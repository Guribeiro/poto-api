import { Router } from 'express';
import multer from 'multer';

import CreateUserController from '../useCases/CreateUser/CreateUserController';
import ShowUserController from '../useCases/ShowUser/ShowUserController';

import uploadConfig from '../../../../config/upload';
import ensureAuthentication from '../middlewares/ensureAuthenticate';

const createUserController = new CreateUserController();
const showUserController = new ShowUserController();

const usersRouter = Router();

const { avatars } = uploadConfig;

const uploadAvatars = multer(avatars);

usersRouter.post(
  '/',
  uploadAvatars.single('photo'),
  createUserController.handle,
);

usersRouter.get(
  '/:user_profile_id',
  ensureAuthentication,
  showUserController.handle,
);

export default usersRouter;
