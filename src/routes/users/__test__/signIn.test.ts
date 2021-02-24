import request from 'supertest';

import { app } from '../../../app';

describe('Tests for signin route', () => {
  test('Return status 404 for not valid email', async () => {
    await request(app)
      .post('/api/user/signin')
      .send({
        email: 'test@test.com',
        password: '12345',
      })
      .expect(404);
  });

  test('Return status 400 for password not matching', async () => {
    await global.signUp();
    await request(app)
      .post('/api/user/signin')
      .send({
        email: 'test@test.com',
        password: '1234',
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
