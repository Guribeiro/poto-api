import request from 'supertest';
import multer from 'multer';

import { app } from '@shared/http/app';
import uploadConfig from '@config/upload';
import { createUserMock } from '@config/mocks/users';
import { avatar } from '@config/mocks/avatars';

import { clear } from '@shared/prisma/utils';

const { avatars } = uploadConfig;

const uploadAvatars = multer(avatars);

describe('Create User Controller Controller', () => {
  afterEach(async () => {
    await clear('postgres');
  });

  it('should be able to create a new user', async () => {
    const response = await request(app)
      .post('/users')
      .use(() => uploadAvatars.single('photo'))
      .set('content-type', 'multipart/form-data')
      .field('email', createUserMock.email)
      .field('full_name', createUserMock.full_name)
      .field('username', createUserMock.username)
      .field('password', createUserMock.password)
      .attach('photo', avatar);

    expect(response.status).toBe(200);
  });
});
