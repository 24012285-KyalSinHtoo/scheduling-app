
// app.js (place this at the project root)
const path = require('path');
const express = require('express');
const session = require('express-session');
const helmet = require('helmet');
const morgan = require('morgan');
const methodOverride = require('method-override');
const cron = require('node-cron');

// Repos (located under ./Backend)
const usersRepo = require('./Backend/users');
const tasksRepo = require('./Backend/tasks');

const app = express();
const PORT = process.env.PORT || 3000;
const SESSION_SECRET = process.env.SESSION_SECRET || 'dev_secret_change_me';

/* ---------------------- App & Middleware ---------------------- */
app.set('view engine', 'ejs');
// Since app.js is at the root, __dirname = project root.
// This makes Express look for .ejs files in ./views
app.set('views', path.join(__dirname, 'views'));

app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(morgan('dev'));

// Serve /Frontend as /static
app.use('/static', express.static(path.join(__dirname, 'Frontend')));

// Sessions
app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  })
);

// Simple flash helper using session (no connect-flash needed)
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  res.locals.flash = req.session.flash || null;
  delete req.session.flash;
  next();
});

// Auth guard
function requireAuth(req, res, next) {
  if (!req.session.user) {
    req.session.flash = { type: 'warning', message: 'Please login first.' };
    return res.redirect('/login');
  }
  next();
}

/* --------------------------- Routes --------------------------- */

// Landing
app.get('/', (req, res) => {
  if (req.session.user) return res.redirect('/dashboard');
  res.render('Welcome', { title: 'Welcome' });
});

// Guest (public info)
app.get('/guest', (req, res) => res.render('Guest', { title: 'Guest' }));

/* Auth */
app.get('/login', (req, res) => res.render('Login', { title: 'Login' }));

app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await usersRepo.validateUser({ username, password });
    if (!user) {
      req.session.flash = { type: 'danger', message: 'Invalid credentials' };
      return res.redirect('/login');
    }
    req.session.user = { id: user.id, username: user.username };
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    req.session.flash = { type: 'danger', message: 'Login failed' };
    res.redirect('/login');
  }
});

app.get('/register', (req, res) => res.render('Register', { title: 'Register' }));

app.post('/register', async (req, res) => {
  try {
    const { username, password, confirm } = req.body;
    if (!username || !password || password !== confirm) {
      req.session.flash = { type: 'danger', message: 'Password mismatch or missing fields' };
      return res.redirect('/register');
    }
    const user = await usersRepo.createUser({ username, password });
    req.session.user = { id: user.id, username: user.username };
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    req.session.flash = { type: 'danger', message: err.message || 'Registration failed' };
    res.redirect('/register');
  }
});

app.post('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/'));
});

/* Dashboard (search/sort/today) */
app.get('/dashboard', requireAuth, (req, res) => {
  const { sort = 'priority', search = '', view = '' } = req.query;

  // Update overdue markers
  const marked = tasksRepo.markOverdueForUser(req.session.user.id);
  if (marked) {
    req.session.flash = { type: 'warning', message: `You have ${marked} overdue task(s).` };
  }

  const all = tasksRepo.getAll(req.session.user.id);
  const filtered = tasksRepo.filterTasks(all, { search, today: view === 'today' });
  const sorted = tasksRepo.sortTasks(filtered, sort);

  res.render('Dashboard', {
    title: 'Dashboard',
    tasks: sorted,
    query: { sort, search, view }
  });
});

/* Tasks: Add */
app.get('/tasks/add', requireAuth, (req, res) => {
  res.render('AddTask', { title: 'Add Task' });
});

app.post('/tasks', requireAuth, (req, res) => {
  try {
    const { title, description, dueDate, priority } = req.body;
    if (!title?.trim()) {
      req.session.flash = { type: 'danger', message: 'Title is required.' };
      return res.redirect('/tasks/add');
    }
    tasksRepo.createTask(req.session.user.id, { title, description, dueDate, priority });
    req.session.flash = { type: 'success', message: 'Task created.' };
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    req.session.flash = { type: 'danger', message: 'Failed to create task.' };
    res.redirect('/tasks/add');
  }
});

/* Tasks: Edit */
app.get('/tasks/:id/edit', requireAuth, (req, res) => {
  const task = tasksRepo.findById(req.session.user.id, req.params.id);
  if (!task) {
    req.session.flash = { type: 'danger', message: 'Task not found.' };
    return res.redirect('/dashboard');
  }
  res.render('EditTask', { title: 'Edit Task', task });
});

app.put('/tasks/:id', requireAuth, (req, res) => {
  try {
    const { title, description, dueDate, priority } = req.body;
    const updated = tasksRepo.updateTask(req.session.user.id, req.params.id, {
      title,
      description,
      dueDate,
      priority
    });
    req.session.flash = {
      type: updated ? 'success' : 'danger',
      message: updated ? 'Task updated.' : 'Task not found.'
    };
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    req.session.flash = { type: 'danger', message: 'Failed to update task.' };
    res.redirect('/dashboard');
  }
});

/* Tasks: Toggle complete */
app.post('/tasks/:id/toggle', requireAuth, (req, res) => {
  const t = tasksRepo.toggleComplete(req.session.user.id, req.params.id);
  req.session.flash = {
    type: t ? 'success' : 'danger',
    message: t ? `Task marked ${t.completed ? 'complete' : 'incomplete'}.` : 'Task not found.'
  };
  res.redirect('/dashboard');
});

/* Tasks: Delete */
app.post('/tasks/:id/delete', requireAuth, (req, res) => {
  const removed = tasksRepo.removeTask(req.session.user.id, req.params.id);
  req.session.flash = {
    type: removed ? 'success' : 'danger',
    message: removed ? 'Task deleted.' : 'Task not found.'
  };
  res.redirect('/dashboard');
});

/* -------------------- Background Overdue Job -------------------- */
// Re-evaluate overdue flags every minute
if (process.env.NODE_ENV !== 'test') {
  cron.schedule('* * * * *', () => {
    try {
      usersRepo.getAll().forEach(u => tasksRepo.markOverdueForUser(u.id));
    } catch (err) {
      console.error('Cron error:', err.message);
    }
  });
}

/* ---------------------------- Start ---------------------------- */
if (require.main === module) {
  console.log('Views dir ->', app.get('views'));
  console.log('Static dir ->', path.join(__dirname, 'Frontend'));
  app.listen(PORT, () => console.log(`✓ Server running at http://localhost:${PORT}`));
}

module.exports = app;
