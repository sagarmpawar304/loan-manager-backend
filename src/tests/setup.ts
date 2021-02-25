import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import bcrypt from 'bcrypt';

import { app } from '../app';
import { UserDoc } from '../models/userModel';
import { LoanTypes } from '../interfaces/modelInterfaces';

declare global {
  namespace NodeJS {
    interface Global {
      signInUser: () => Promise<{ token: string; user: UserDoc }>;
      signInAdmin: () => Promise<{ token: string; user: UserDoc }>;
      signInAgent: () => Promise<{ token: string; user: UserDoc }>;
      getLoanId: () => Promise<string>;
      createLoan: () => Promise<string>;
    }
  }
}

let mongo: MongoMemoryServer;
process.env.JWTSECRET = 'jwtsecret';

// 1) Create mongodb connection
beforeAll(async () => {
  process.env.JWTSECRET = 'jwtsecret';
  mongo = new MongoMemoryServer();
  try {
    const mongouri = await mongo.getUri();
    await mongoose.connect(mongouri, {
      useCreateIndex: true,
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });

    const collections = await mongoose.connection.db.collections();
    collections.forEach(async (collection) => {
      const { result } = await collection.deleteMany({});
      if (result.ok !== 1) {
        console.log('exit');
        return;
      }
    });
    collections.forEach((collection) => {
      const db = collection.namespace.split('.')[1];
      if (db === 'users') {
        const password = bcrypt.hashSync('12345', 12);
        collection.insertMany([
          {
            name: 'admin',
            email: 'admin@test.com',
            password,
            role: 'admin',
          },
          {
            name: 'agent',
            email: 'agent@test.com',
            password,
            role: 'agent',
          },
          {
            name: 'user',
            email: 'user@test.com',
            password,
            role: 'customer',
          },
        ]);
      }

      if (db === 'loans') {
        collection.insertOne({
          name: 'loan',
          type: 'personal loan',
          interestRate: 8,
        });
      }
    });
  } catch (error) {
    console.log(error.message);
  }
});

// 3) Close all connections with database
afterAll(async () => {
  try {
    const res = await mongo.stop();
    await mongoose.connection.close();
    // console.log({ res });
  } catch (error) {
    console.log('error');
  }
});

global.signInUser = async () => {
  const response = await request(app).post('/api/user/signin').send({
    email: 'user@test.com',
    password: '12345',
  });

  return { token: response.body.token, user: response.body.user };
};

global.signInAdmin = async () => {
  const response = await request(app).post('/api/user/signin').send({
    email: 'admin@test.com',
    password: '12345',
  });

  return { token: response.body.token, user: response.body.user };
};

global.signInAgent = async () => {
  const response = await request(app).post('/api/user/signin').send({
    email: 'agent@test.com',
    password: '12345',
  });

  // console.log(response.body);

  return { token: response.body.token, user: response.body.user };
};

global.getLoanId = async () => {
  const response = await request(app).get('/api/loans').send();
  const loanId = response.body[0].id;
  return loanId;
};

global.createLoan = async () => {
  const { user } = await global.signInUser();
  const { token: agentToken, user: agent } = await global.signInAgent();
  const loanId = await global.getLoanId();

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

  return responseForAgent.body.loanId;
};
