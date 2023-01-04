import request from 'supertest';
import { PrismaClient, Users } from '@prisma/client';

import { app } from '@shared/http/app';

import { createUserMock } from '@config/mocks/users';
import { clear } from '@shared/prisma/utils';

let prisma: PrismaClient;

describe('Update Email Controller', () => {
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

  it('should be able to update email', async () => {
    const email = 'newemail';

    const session = await request(app).post('/sessions').send({
      email: 'email@email.com',
      password: 'password',
    });

    const { token } = session.body;

    console.log({ token });

    const response = await request(app)
      .put('/profile/email')
      .send({ email })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(200);
    expect(response.body.email).toBe(email);
  });
});
