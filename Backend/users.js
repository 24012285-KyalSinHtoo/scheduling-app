
const fs = require('fs');
const path = require('path');
const { v4: uuid } = require('uuid');
const bcrypt = require('bcryptjs');

const dataDir = path.join(process.cwd(), 'data');
const usersFile = path.join(dataDir, 'users.json');

function ensureStore() {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  if (!fs.existsSync(usersFile)) fs.writeFileSync(usersFile, JSON.stringify([]));
}

function load() {
  ensureStore();
  return JSON.parse(fs.readFileSync(usersFile, 'utf-8') || '[]');
}

function save(data) {
  ensureStore();
  fs.writeFileSync(usersFile, JSON.stringify(data, null, 2));
}

function getAll() {
  return load();
}

function findByUsername(username) {
  return load().find(u => u.username.toLowerCase() === String(username).toLowerCase());
}

async function createUser({ username, password }) {
  const all = load();
  if (findByUsername(username)) throw new Error('Username already exists');
  const passwordHash = await bcrypt.hash(password, 10);
  const user = { id: uuid(), username, passwordHash, createdAt: new Date().toISOString() };
  all.push(user);
  save(all);
  return user;
}

async function validateUser({ username, password }) {
  const user = findByUsername(username);
  if (!user) return null;
  const ok = await bcrypt.compare(password, user.passwordHash);
  return ok ? user : null;
}

module.exports = { getAll, findByUsername, createUser, validateUser };
