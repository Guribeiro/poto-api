import { Router } from 'express';
import multer from 'multer';

import CreateUserController from '../useCases/CreateUser/CreateUserController';
import uploadConfig from '../../../../config/upload';

const createUserController = new CreateUserController();

const usersRouter = Router();

const { avatars } = uploadConfig;

const uploadAvatars = multer(avatars);

usersRouter.post(
  '/',
  uploadAvatars.single('photo'),
  createUserController.handle,
);

export default usersRouter;
