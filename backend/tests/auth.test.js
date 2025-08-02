const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');

beforeAll(async () => {
  // Optionally connect to a test DB
});
afterAll(async () => {
  await mongoose.connection.close();
});

describe('Auth API', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({ name: 'Test User', email: 'test@example.com', password: 'testpass123' });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user.email).toBe('test@example.com');
  });

  it('should login with correct credentials', async () => {
    await request(app)
      .post('/auth/register')
      .send({ name: 'Test2', email: 'test2@example.com', password: 'testpass123' });
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'test2@example.com', password: 'testpass123' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });
}); 