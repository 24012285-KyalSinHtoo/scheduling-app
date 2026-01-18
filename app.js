const express = require('express');
const app = express();
const port = 3000;

// Parse form data
app.use(express.urlencoded({ extended: true }));

// Serve static files from public folder
app.use(express.static('public'));

// Set EJS as the template engine
app.set('view engine', 'ejs');

// Temporary task storage
let tasks = [
  { id: 1, name: "Buy groceries", priority: "High", due: "2026-01-19" },
  { id: 2, name: "Finish homework", priority: "Medium", due: "2026-01-18" }
];

// Landing page - dashboard
app.get('/', (req, res) => {
  res.render('index', { tasks: tasks });
});

// Add task page
app.get('/add', (req, res) => {
  res.render('addTask');
});

// Add task POST
app.post('/add', (req, res) => {
  const { name, priority, due } = req.body;
  const newTask = { id: tasks.length + 1, name, priority, due };
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

app.listen(port, () => {
  console.log(`App running at http://localhost:${port}`);
});



// Calendar backend
app.get('/calendar', (req, res) => {
  res.render('calendarView', { tasks: tasks }); // use global tasks array
});


