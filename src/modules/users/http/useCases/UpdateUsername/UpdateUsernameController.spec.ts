import request from 'supertest';
import { PrismaClient } from '@prisma/client';

import { app } from '@shared/http/app';

import { createUserMock } from '@config/mocks/users';
import { clear } from '@shared/prisma/utils';

let prisma: PrismaClient;

describe('Update Username Controller', () => {
  beforeEach(async () => {
    prisma = new PrismaClient();

    await prisma.users.create({
      data: {
        full_name: 'full name',
        username: 'username',
        email: 'email@email.com',
        password: 'password',
      },
    });
  });

  afterEach(async () => {
    await clear('postgres');
  });

  it('should be able to update username', async () => {
    const username = 'newusername';

    const session = await request(app).post('/sessions').send({
      email: 'email@email.com',
      password: 'password',
    });

    const { token } = session.body;

    const response = await request(app)
      .put('/profile/username')
      .send({ username })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(200);
    expect(response.body.username).toBe(username);
  });
});
