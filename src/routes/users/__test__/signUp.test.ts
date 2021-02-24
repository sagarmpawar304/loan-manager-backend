import request from 'supertest';

import { app } from '../../../app';

describe('Tests for signin route', () => {
  test('Returns with status 400 for not valid email', async () => {
    await request(app)
      .post('/api/user/signup')
      .send({
        name: 'user1',
        email: 'test.com',
        password: '12345',
        confirmPassword: '12345',
      })
      .expect(400);
  });

  test('Returns with status 400 for password length less than 5 and greater than 16', async () => {
    await request(app)
      .post('/api/user/signup')
      .send({
        name: 'user1',
        email: 'test@test.com',
        password: '1234',
        confirmPassword: '1234',
      })
      .expect(400);

    await request(app)
      .post('/api/user/signup')
      .send({
        name: 'user1',
        email: 'test@test.com',
        password: '1234567891011121314151617',
        confirmPassword: '1234567891011121314151617',
      })
      .expect(400);
  });

  test('Returns with status 400 for not matching password', async () => {
    await request(app)
      .post('/api/user/signup')
      .send({
        name: 'user1',
        email: 'test@test.com',
        password: '12345',
        confirmPassword: '1234',
      })
      .expect(400);
  });

  test('Returns with status of 200 with jwt token for valid credentials', async () => {
    const response = await request(app)
      .post('/api/user/signup')
      .send({
        name: 'user1',
        email: 'test@test.com',
        password: '12345',
        confirmPassword: '12345',
      })
      .expect(200);

    expect(response.body.token).toBeDefined();
  });
});
