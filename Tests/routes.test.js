const request = require('supertest');
const app = require('../app');

it('should load add page', async () => {
  const res = await request(app).get('/add');
  expect(res.statusCode).toBe(200);
});

