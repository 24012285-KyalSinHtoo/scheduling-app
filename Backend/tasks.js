
const fs = require('fs');
const path = require('path');
const dayjs = require('dayjs');
const { v4: uuid } = require('uuid');

const dataDir = path.join(process.cwd(), 'data');
const tasksFile = path.join(dataDir, 'tasks.json');

function ensureStore() {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  if (!fs.existsSync(tasksFile)) fs.writeFileSync(tasksFile, JSON.stringify([]));
}

function load() {
  ensureStore();
  return JSON.parse(fs.readFileSync(tasksFile, 'utf-8') || '[]');
}

function save(data) {
  ensureStore();
  fs.writeFileSync(tasksFile, JSON.stringify(data, null, 2));
}

function getAll(userId) {
  return load().filter(t => t.userId === userId);
}

function createTask(userId, { title, description, dueDate, priority }) {
  const all = load();
  const task = {
    id: uuid(),
    userId,
    title: title?.trim(),
    description: (description || '').trim(),
    dueDate: dueDate ? dayjs(dueDate).toISOString() : null,
    priority: (priority || 'medium').toLowerCase(),
    completed: false,
    overdue: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  all.push(task);
  save(all);
  return task;
}

function updateTask(userId, id, updates) {
  const all = load();
  const idx = all.findIndex(t => t.id === id && t.userId === userId);
  if (idx === -1) return null;
  const prev = all[idx];
  all[idx] = {
    ...prev,
    ...updates,
    dueDate: updates.dueDate ? dayjs(updates.dueDate).toISOString() : prev.dueDate,
    priority: updates.priority ? updates.priority.toLowerCase() : prev.priority,
    updatedAt: new Date().toISOString()
  };
  save(all);
  return all[idx];
}

function toggleComplete(userId, id) {
  const all = load();
  const idx = all.findIndex(t => t.id === id && t.userId === userId);
  if (idx === -1) return null;
  all[idx].completed = !all[idx].completed;
  if (all[idx].completed) all[idx].overdue = false;
  all[idx].updatedAt = new Date().toISOString();
  save(all);
  return all[idx];
}

function removeTask(userId, id) {
  const all = load();
  const next = all.filter(t => !(t.id === id && t.userId === userId));
  const removed = next.length !== all.length;
  save(next);
  return removed;
}

function findById(userId, id) {
  return load().find(t => t.id === id && t.userId === userId);
}

// Sort: Priority (High > Medium > Low), then due date
function sortTasks(list, sortBy = 'priority') {
  const prioRank = { high: 0, medium: 1, low: 2 };
  const arr = [...list];
  if (sortBy === 'priority') {
    arr.sort((a, b) => {
      const pa = prioRank[a.priority] ?? 1;
      const pb = prioRank[b.priority] ?? 1;
      if (pa !== pb) return pa - pb;
      const ad = a.dueDate ? dayjs(a.dueDate).valueOf() : Infinity;
      const bd = b.dueDate ? dayjs(b.dueDate).valueOf() : Infinity;
      return ad - bd;
    });
  } else if (sortBy === 'due') {
    arr.sort((a, b) => {
      const ad = a.dueDate ? dayjs(a.dueDate).valueOf() : Infinity;
      const bd = b.dueDate ? dayjs(b.dueDate).valueOf() : Infinity;
      return ad - bd;
    });
  } else if (sortBy === 'created') {
    arr.sort((a, b) => dayjs(a.createdAt).valueOf() - dayjs(b.createdAt).valueOf());
  }
  return arr;
}

// Mark overdue for a user
function markOverdueForUser(userId) {
  const now = dayjs();
  const all = load();
  let count = 0;
  for (const t of all) {
    if (t.userId !== userId) continue;
    const due = t.dueDate ? dayjs(t.dueDate) : null;
    const shouldOverdue = due && due.isBefore(now) && !t.completed;
    if (t.overdue !== !!shouldOverdue) {
      t.overdue = !!shouldOverdue;
      t.updatedAt = new Date().toISOString();
      count++;
    }
  }
  if (count) save(all);
  return count;
}

function filterTasks(list, { search = '', today = false } = {}) {
  let out = list;
  if (search) {
    const q = search.toLowerCase();
    out = out.filter(t =>
      (t.title || '').toLowerCase().includes(q) ||
      (t.description || '').toLowerCase().includes(q)
    );
  }
  if (today) {
    const now = dayjs();
    out = out.filter(t => t.dueDate && dayjs(t.dueDate).isSame(now, 'day'));
  }
  return out;
}

module.exports = {
  getAll, createTask, updateTask, toggleComplete, removeTask, findById,
  sortTasks, markOverdueForUser, filterTasks
};
``
