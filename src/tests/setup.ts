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
      signUp: () => Promise<{ token: string; user: UserDoc }>;
      signInAdmin: () => Promise<{ token: string; user: UserDoc }>;
      signInAgent: () => Promise<{ token: string; user: UserDoc }>;
      getLoanId: () => Promise<string>;
    }
  }
}

let mongo: MongoMemoryServer;
process.env.JWTSECRET = 'jwtsecret';

// 1) Create mongodb connection
beforeAll(async () => {
  process.env.JWTSECRET = 'jwtsecret';
  mongo = new MongoMemoryServer();
  const mongouri = await mongo.getUri();

  await mongoose.connect(mongouri, {
    useCreateIndex: true,
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });
});

// 2) Clean all collection for every test
beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();
  collections.forEach((collection) => collection.deleteMany({}));

  collections.forEach(async (collection) => {
    const db = collection.namespace.split('.')[1];
    if (db === 'users') {
      const password = await bcrypt.hash('12345', 12);
      // console.log('users db');
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
      ]);
    }

    if (db === 'loans') {
      // console.log('loan db');
      collection.insertOne({
        name: 'loan',
        interestRate: 5,
        type: LoanTypes.personalLoan,
      });
    }
  });
});

// 3) Close all connections with database
afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

global.signUp = async () => {
  const response = await request(app).post('/api/user/signup').send({
    name: 'user1',
    email: 'test@test.com',
    password: '12345',
    confirmPassword: '12345',
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

  return { token: response.body.token, user: response.body.user };
};

global.getLoanId = async () => {
  const response = await request(app).get('/api/loans').send();
  const loanId = response.body[0].id;
  return loanId;
};
