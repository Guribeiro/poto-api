import request from 'supertest';
import { Users, PrismaClient } from '@prisma/client';

import { app } from '@shared/http/app';

import { createUserMock } from '@config/mocks/users';
import { clear } from '@shared/prisma/utils';

let user: Users;

let prisma: PrismaClient;
describe('Check Email Availability Controller', () => {
  beforeEach(async () => {
    prisma = new PrismaClient();

    user = await prisma.users.create({
      data: createUserMock,
    });
  });

  afterEach(async () => {
    await clear('postgres');
  });

  it('should be able to check email availability', async () => {
    const response = await request(app)
      .post('/sessions/valid_email')
      .send({ email: 'valid@email.com' });

    expect(response.status).toBe(204);
  });

  it('should return status 406 if email is not available', async () => {
    const response = await request(app)
      .post('/sessions/valid_email')
      .send({ email: user.email });

    expect(response.status).toBe(406);
  });
});
