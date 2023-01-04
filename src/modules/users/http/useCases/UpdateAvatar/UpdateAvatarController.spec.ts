import request from 'supertest';

import { app } from '@shared/http/app';
import prisma from '@shared/prisma/client';
import { clear } from '@shared/prisma/utils';

import { avatar } from '@config/mocks/avatars';
import { createUserMock } from '@config/mocks/users';

describe('Update Avatar Controller', () => {
  beforeEach(async () => {
    await prisma.users.create({
      data: createUserMock,
    });
  });

  afterEach(async () => {
    await clear('postgres');
  });

  it('should be able to update email', async () => {
    const email = 'newemail';

    const session = await request(app).post('/sessions').send({
      email: createUserMock.email,
      password: createUserMock.password,
    });

    const { token } = session.body;

    const response = await request(app)
      .put('/profile/avatar')
      .set('content-type', 'multipart/form-data')
      .attach('photo', avatar)
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(200);
    expect(response.body.avatar).not.toBe(null);
  });
});
