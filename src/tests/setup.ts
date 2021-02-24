import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import { app } from '../app';

declare global {
  namespace NodeJS {
    interface Global {
      signUp: () => Promise<string>;
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
  const collections = await mongoose.connection.db.collections();
  collections.forEach((collection) => collection.deleteMany({}));
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

  return response.body.token;
};
