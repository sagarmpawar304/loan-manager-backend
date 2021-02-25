import { Status } from './../../../interfaces/modelInterfaces';
import { LoanTypes } from '../../../interfaces/modelInterfaces';
import request from 'supertest';
import { app } from '../../../app';

describe('For Create loans', () => {
  test('Restricated to admin only', async () => {
    const { token } = await global.signInAdmin();
    await request(app)
      .post('/api/loan/create')
      .set({ authorization: `Bearer ${token}` })
      .send({
        name: 'new loan',
        interestRate: 5,
        type: LoanTypes.personalLoan,
      })
      .expect(201);
  });

  test('Get all loans Restricated to admin and agnet only', async () => {
    const { token: admin } = await global.signInAdmin();
    const { token: agent } = await global.signInAgent();
    const { token: user } = await global.signInUser();

    await request(app)
      .get('/api/loan/personalloan')
      .set({ authorization: `Bearer ${admin}` })
      .send()
      .expect(200);

    await request(app)
      .get('/api/loan/personalloan')
      .set({ authorization: `Bearer ${agent}` })
      .send()
      .expect(200);

    await request(app)
      .get('/api/loan/personalloan')
      .set({ authorization: `Bearer ${user}` })
      .send()
      .expect(401);
  });

  test('Get a specific loan Restricated to admin and agnet only', async () => {
    const loanId = await global.createLoan();
    const { token: admin } = await global.signInAdmin();
    const { token: agent } = await global.signInAgent();
    const { token: user } = await global.signInUser();

    await request(app)
      .get(`/api/loan/personalloan/${loanId}`)
      .set({ authorization: `Bearer ${admin}` })
      .send()
      .expect(200);

    await request(app)
      .get(`/api/loan/personalloan/${loanId}`)
      .set({ authorization: `Bearer ${agent}` })
      .send()
      .expect(200);

    await request(app)
      .get(`/api/loan/personalloan/${loanId}`)
      .set({ authorization: `Bearer ${user}` })
      .send()
      .expect(401);
  });

  test('Update a specific loan Restricated agnet only', async () => {
    const loanId = await global.createLoan();
    const { token: admin } = await global.signInAdmin();
    const { token: agent } = await global.signInAgent();
    const { token: user } = await global.signInUser();

    const sendObject = { principle: 200000 };
    await request(app)
      .put(`/api/loan/personalloan/${loanId}`)
      .set({ authorization: `Bearer ${admin}` })
      .send(sendObject)
      .expect(401);

    const response = await request(app)
      .put(`/api/loan/personalloan/${loanId}`)
      .set({ authorization: `Bearer ${agent}` })
      .send(sendObject)
      .expect(200);

    expect(response.body.loan.principle).toBe(sendObject.principle);

    await request(app)
      .put(`/api/loan/personalloan/${loanId}`)
      .set({ authorization: `Bearer ${user}` })
      .send(sendObject)
      .expect(401);
  });

  test('Authorize loan Restricated to admin only', async () => {
    const loanId = await global.createLoan();
    const { token: admin } = await global.signInAdmin();
    const { token: agent } = await global.signInAgent();
    const { token: user } = await global.signInUser();

    const sendObject = { action: Status.approved };

    const response = await request(app)
      .post(`/api/loan/admin/personalloan/${loanId}`)
      .set({ authorization: `Bearer ${admin}` })
      .send(sendObject)
      .expect(200);

    expect(response.body.loan.status).toBe(sendObject.action);

    await request(app)
      .post(`/api/loan/admin/personalloan/${loanId}`)
      .set({ authorization: `Bearer ${agent}` })
      .send(sendObject)
      .expect(401);

    await request(app)
      .post(`/api/loan/admin/personalloan/${loanId}`)
      .set({ authorization: `Bearer ${user}` })
      .send(sendObject)
      .expect(401);
  });
});
