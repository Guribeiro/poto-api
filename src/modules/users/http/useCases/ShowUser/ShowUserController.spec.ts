import request from 'supertest';
import { Users } from '@prisma/client';

import { app } from '@shared/http/app';
import prisma from '@shared/prisma/client';

import { createUserMock } from '@config/mocks/users';
import { clear } from '@shared/prisma/utils';

let user: Users;

describe('Show User Controller', () => {
  beforeEach(async () => {
    user = await prisma.users.create({
      data: createUserMock,
    });
  });

  afterEach(async () => {
    await clear('postgres');
  });

  it('should be able to show a user', async () => {
    const session = await request(app).post('/sessions').send({
      email: createUserMock.email,
      password: createUserMock.password,
    });

    console.log(session);

    const { token } = session.body;

    const response = await request(app)
      .get('/users')
      .query({ user_profile_id: user.id })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
  });
});
