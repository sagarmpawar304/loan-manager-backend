import request from 'supertest';
import { app } from '../../../app';

describe('For users', () => {
  test('Get all user accessible only for admin and agent', async () => {
    const token = await global.signUp();
    await request(app)
      .get('/api/users')
      .set({ authorization: token })
      .send()
      .expect(401);
  });
});
