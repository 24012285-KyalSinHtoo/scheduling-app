//Kaden
//Add task
const request = require('supertest');
const app = require('../app');

it('should load add page', async () => {
const res = await request(app).get('/add');
expect(res.statusCode).toBe(200);
});

//Edit task
it('should load edit task page', async () => {
const testTaskId = 1;
const res = await request(app).get(`/edit/${testTaskId}`);
expect(res.statusCode).toBe(200);
});

//Delete task
it('should delete a task and redirect', async () => {
  //Creating a task
await request(app)
.post('/add')
.send({
name: 'Test Task',
priority: 'High',
due: '2026-01-20'
});

  //Delete task
const res = await request(app).get('/delete/1');

  //Redirect to page
expect(res.statusCode).toBe(302);
expect(res.headers.location).toBe('/');
});

//Task list view
it('should load the task list page', async () => {
const res = await request(app).get('/tasks');

expect(res.statusCode).toBe(200);
});

//Calendar view
it('should load the calendar view page', async () => {
const res = await request(app).get('/calendar');

expect(res.statusCode).toBe(200);
});

//Search bar

//Marking tasks complete

//Invalid input

//Invalid route