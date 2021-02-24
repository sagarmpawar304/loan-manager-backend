import { LoanTypes } from './../../../interfaces/modelInterfaces';
import request from 'supertest';
import { app } from '../../../app';

describe('For Create loans', () => {
  test('Restricated to admin only', async () => {
    const token = await global.signUp();
    await request(app)
      .post('/api/loan/create')
      .set({ authorization: `Bearer ${token}` })
      .send({
        name: 'loan',
        interestRate: 5,
        type: LoanTypes.personalLoan,
      })
      .expect(401);
  });
});
