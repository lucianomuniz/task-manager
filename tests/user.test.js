const request = require('supertest');

const app = require('../src/app');
const User = require('../src/models/user');
const { mongoConnect, mongoDisconnect } = require('../src/db/mongo');
const { userOneId, userOne, setupDatabase } = require('./fixtures/db');

describe('USERS API', () => {
  beforeAll(async () => {
    await mongoConnect();
  });

  afterAll(async () => {
    await mongoDisconnect();
  });

  beforeEach(setupDatabase);

  describe('Test POST /users', () => {
    test('Should signup a new user', async () => {
      const response = await request(app)
        .post('/users')
        .send({
          name: 'User 1',
          email: 'user1@email.com',
          password: 'pass@123',
        })
        .expect(201);

      // Assert that the database was changed correctly
      const user = await User.findById(response.body.user._id);
      expect(user).not.toBeNull();

      // Assert about the response
      expect(response.body).toMatchObject({
        user: {
          name: 'User 1',
          email: 'user1@email.com',
        },
        token: user.tokens[0].token,
      });

      // Assert that the password was encripted
      expect(user.password).not.toBe('pass@123');
    });

    test('Should return bad request due the password validation', async () => {
      await request(app)
        .post('/users')
        .send({
          name: 'User 1',
          email: 'user1@email.com',
          password: 'password123',
        })
        .expect(400);
    });
  });

  describe('Test POST /users/login', () => {
    test('Should login existing user', async () => {
      const response = await request(app)
        .post('/users/login')
        .send({
          email: userOne.email,
          password: userOne.password,
        })
        .expect(200);

      const user = await User.findById(response.body.user._id);
      expect(response.body.token).toBe(user.tokens[1].token);
    });

    test('Should not login nonexisting user', async () => {
      await request(app)
        .post('/users/login')
        .send({
          email: 'nonexisgint@email.com',
          password: 'anonymous',
        })
        .expect(400);
    });
  });

  describe('Test GET /users/me', () => {
    test('Should get profile for user', async () => {
      await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200);
    });

    test('Should not get profile for unauthenticated user', async () => {
      await request(app).get('/users/me').send().expect(401);
    });
  });

  describe('Test DELETE /users/me', () => {
    test('Should delete account for user', async () => {
      await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200);

      const user = await User.findById(userOne._id);
      expect(user).toBeNull();
    });

    test('Should not delete account for unauthenticated user', async () => {
      await request(app).delete('/users/me').send().expect(401);
    });
  });

  describe('Test POST /users/me/avatar ', () => {
    test('Should upload avatar image', async () => {
      await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('avatar', 'tests/fixtures/profile-pic.jpg')
        .expect(200);

      const user = await User.findById(userOneId);
      expect(user.avatar).toEqual(expect.any(Buffer));
    });
  });

  describe('Test PATCH /user/me', () => {
    test('Should update valid user fields', async () => {
      await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
          name: 'Jess',
        })
        .expect(200);

      const user = await User.findById(userOneId);
      expect(user.name).toEqual('Jess');
    });

    test('Should not update valid user fields', async () => {
      await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
          location: 'Philadelphia',
        })
        .expect(400);
    });
  });
});
