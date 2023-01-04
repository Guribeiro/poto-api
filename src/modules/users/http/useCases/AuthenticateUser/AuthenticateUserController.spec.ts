import request from 'supertest';
import multer from 'multer';

import { app } from '@shared/http/app';
import uploadConfig from '@config/upload';
import { createUserMock } from '@config/mocks/users';
import { avatar } from '@config/mocks/avatars';

import { clear } from '@shared/prisma/utils';

const { avatars } = uploadConfig;

const uploadAvatars = multer(avatars);

describe('Authenticate User Controller', () => {
  beforeEach(async () => {
    await request(app)
      .post('/users')
      .use(() => uploadAvatars.single('photo'))
      .set('content-type', 'multipart/form-data')
      .field('email', createUserMock.email)
      .field('full_name', createUserMock.full_name)
      .field('username', createUserMock.username)
      .field('password', createUserMock.password)
      .attach('photo', avatar);
  });

  afterEach(async () => {
    await clear('postgres');
  });

  it('should be able to authenticate an user', async () => {
    const response = await request(app).post('/sessions').send({
      email: createUserMock.email,
      password: createUserMock.password,
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('user');
    expect(response.body).toHaveProperty('token');
    expect(response.body).toHaveProperty('refresh_token');
  });
});
