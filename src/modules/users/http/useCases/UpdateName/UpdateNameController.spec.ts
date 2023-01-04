import request from 'supertest';
import { Users } from '@prisma/client';

import { app } from '@shared/http/app';
import prisma from '@shared/prisma/client';

import { createUserMock } from '@config/mocks/users';
import { clear } from '@shared/prisma/utils';

describe('Update Name Controller', () => {
  beforeEach(async () => {
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

  it('should be able to update name', async () => {
    const name = 'newname';

    const session = await request(app).post('/sessions').send({
      email: 'email@email.com',
      password: 'password',
    });

    const { token } = session.body;

    const response = await request(app)
      .put('/profile/name')
      .send({ name })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe(name);
  });
});
