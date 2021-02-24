import request from 'supertest';

import { app } from '../../../app';

describe('For users', () => {
  test('Get all users accessible only for admin and agent', async () => {
    const { token } = await global.signUp();

    await request(app)
      .get('/api/users')
      .set({ authorization: `Bearer ${token}` })
      .send()
      .expect(401);
  });

  test('It Fails Updated password  is less than rules and this is can be done only by customer', async () => {
    const { token } = await global.signUp();
    await request(app)
      .put('/api/user')
      .set({ authorization: `Bearer ${token}` })
      .send({ password: '1234' })
      .expect(400);
  });

  test('Update password if only if it is as per password rules and this is can be done only by customer', async () => {
    const { token } = await global.signUp();
    await request(app)
      .put('/api/user')
      .set({ authorization: `Bearer ${token}` })
      .send({ password: '123456' })
      .expect(200);
  });

  test('Update user status to "Agent".It is possible only for admin', async () => {
    const { token, user } = await global.signUp();
    await request(app)
      .put(`/api/user/auth/${user.id}`)
      .set({ authorization: `Bearer ${token}` })
      .send({ role: 'agent' })
      .expect(401);
  });

  test('Create a loan request by user or by agent on behalf of agent', async () => {
    const { token, user } = await global.signUp();
    const { token: agentToken, user: agent } = await global.signInAgent();
    const loanId = await global.getLoanId();

    const response = await request(app)
      .post(`/api/user/loan`)
      .set({ authorization: `Bearer ${token}` })
      .send({
        loanId,
        clientId: user.id,
        principle: 100000,
        type: 'personal loan',
        duration_in_months: 12,
      })
      .expect(200);

    expect(response.body.message).toEqual('success');

    const responseForAgent = await request(app)
      .post(`/api/user/loan`)
      .set({ authorization: `Bearer ${agentToken}` })
      .send({
        loanId,
        clientId: user.id,
        agentId: agent.id,
        principle: 100000,
        type: 'personal loan',
        duration_in_months: 12,
      })
      .expect(200);

    expect(responseForAgent.body.message).toEqual('success');
  });
});
