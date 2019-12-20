require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const User = require('../lib/models/User');

describe('app routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });


  afterAll(() => {
    return mongoose.connection.close();
  });

  it('can signup a new user', () => {
    return request(app)
      .post('/api/v1/auth/signup')
      .send({ email: 'tess@tess.com', password: 'realpassword' })
      .then(res => {
        expect(res.header['set-cookie'][0]).toEqual(expect.stringContaining('session='));
        expect(res.body).toEqual({
          _id: expect.any(String), 
          email: 'tess@tess.com',
          __v: 0
        });
      });
  });

  it('can login a user', async() => {
    //want to start out with an exisiting user in the database 
    const user = await User.create({ email: 'tess@tess.com', password: 'realpassword' });
    //now do the test 
    return request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'tess@tess.com', password: 'realpassword' })
      .then(res => {
        expect(res.header['set-cookie'][0]).toEqual(expect.stringContaining('session='));
        expect(res.body).toEqual({
          _id: user.id, 
          email: 'tess@tess.com',
          __v: 0
        });
      });
  });

  it('throws error due to invalid email login', async() => {
    await User.create({ email: 'tess@tess.com', password: 'realpassword' });
    return request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'nottess@tess.com', password: 'realpassword' })
      .then(res => {
        expect(res.header['set-cookie'][0]).toEqual(expect.stringContaining('session='));
        expect(res.body).toEqual({
          message: 'invalid email or password', 
          status: 401
        });
      });
  });

  it('throws error due to invalid password login', async() => {
    await User.create({ email: 'tess@tess.com', password: 'realpassword' });
    return request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'tess@tess.com', password: 'fakepassword' })
      expect(res.header['set-cookie'][0]).toEqual(expect.stringContaining('session='));
      .then(res => {
        expect(res.body).toEqual({
          message: 'invalid email or password', 
          status: 401
        });
      });
  });

});
