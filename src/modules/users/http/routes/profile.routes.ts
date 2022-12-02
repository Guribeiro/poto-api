import { Router } from 'express';
import multer from 'multer';

import UpdateUsernameController from '../useCases/UpdateUsername/UpdateUsernameController';
import UpdateAvatarController from '../useCases/UpdateAvatar/UpdateAvatarController';
import UpdateEmailController from '../useCases/UpdateEmail/UpdateEmailController';
import UpdateNameController from '../useCases/UpdateName/UpdateNameController';

import ensureAuthentication from '../middlewares/ensureAuthenticate';

import uploadConfig from '@config/upload';

const updateUsernameController = new UpdateUsernameController();
const updateAvatarController = new UpdateAvatarController();
const updateEmailController = new UpdateEmailController();
const updateNameController = new UpdateNameController();

const { avatars } = uploadConfig;

const uploadAvatars = multer(avatars);

const profileRouter = Router();

profileRouter.put(
  '/avatar',
  ensureAuthentication,
  uploadAvatars.single('photo'),
  updateAvatarController.handle,
);

profileRouter.put('/name', ensureAuthentication, updateNameController.handle);
profileRouter.put('/email', ensureAuthentication, updateEmailController.handle);
profileRouter.put(
  '/username',
  ensureAuthentication,
  updateUsernameController.handle,
);

export default profileRouter;
