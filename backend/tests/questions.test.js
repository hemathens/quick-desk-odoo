const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');

let token;
beforeAll(async () => {
  await request(app).post('/auth/register').send({ name: 'QUser', email: 'quser@example.com', password: 'testpass123' });
  const res = await request(app).post('/auth/login').send({ email: 'quser@example.com', password: 'testpass123' });
  token = res.body.token;
});
afterAll(async () => {
  await mongoose.connection.close();
});

describe('Questions API', () => {
  it('should create a new question', async () => {
    const res = await request(app)
      .post('/questions')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Test Question', description: 'Test desc', tags: ['test'] });
    expect(res.statusCode).toBe(201);
    expect(res.body.question.title).toBe('Test Question');
  });

  it('should list questions', async () => {
    const res = await request(app).get('/questions');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.questions)).toBe(true);
  });
}); 