//Kyal Sin Htoo
const express = require('express');
const app = express();
const task = [];
const priority = [];
module.exports = app;

// Parse form data
app.use(express.urlencoded({ extended: true }));

// Serve static files from public folder
app.use(express.static('public'));

// Set EJS as the template engine
app.set('view engine', 'ejs');

// Temporary task storage
let tasks = [
  { id: 1, name: "Buy groceries", priority: "High", due: "2026-01-19" },
  { id: 2, name: "Finish homework", priority: "Medium", due: "2026-01-20" }
];

// Add task page
app.get('/add', (req, res) => {
  res.render('addTask');
});

// Add task POST
app.post('/add', (req, res) => {
  const { name, priority, due } = req.body;
  const newTask = { id: tasks.length + 1, name, priority, due, completed: false };
  tasks.push(newTask);
  res.redirect('/');
});

// Edit task page
app.get('/edit/:id', (req, res) => {
  const task = tasks.find(t => t.id == req.params.id);
  res.render('editTask', { task: task });
});

// Edit task POST
app.post('/edit/:id', (req, res) => {
  const { name, priority, due } = req.body;
  const task = tasks.find(t => t.id == req.params.id);
  task.name = name;
  task.priority = priority;
  task.due = due;
  res.redirect('/');
});

// Delete task
app.get('/delete/:id', (req, res) => {
  tasks = tasks.filter(t => t.id != req.params.id);
  res.redirect('/');
});

// Task list page
app.get('/tasks', (req, res) => {
  res.render('taskList', { tasks: tasks });
});

// Calendar backend
app.get('/calendar', (req, res) => {
  res.render('calendarView', { tasks: tasks }); // use global tasks array
});

// SEARCH BAR backend
app.get('/', (req, res) => {
  let { search, priority, dueDate } = req.query;

  let filteredTasks = tasks; // tasks is your array or database result

  if (search) {
    filteredTasks = filteredTasks.filter(task =>
      task.name.toLowerCase().includes(search.toLowerCase())
    );
  }

  if (priority) {
    filteredTasks = filteredTasks.filter(task =>
      task.priority === priority
    );
  }

  if (dueDate) {
    filteredTasks = filteredTasks.filter(task =>
      task.due === dueDate
    );
  }

  res.render('index', { tasks: filteredTasks, search, priority, dueDate });
});

//Alicia
//Mark completed tasks as completed with a tick
app.post('/complete/:id', (req, res) => {
  const task = tasks.find(t => t.id == req.params.id);
  task.completed = !task.completed;
  res.redirect('/');
});

// Toggle task completion status
app.get('/complete/:id', (req, res) => {
  const task = tasks.find(t => t.id == req.params.id);
  if (task) {
    task.completed = !task.completed;
  }
  res.redirect('/');
});


