import { Router } from 'express';
import multer from 'multer';

import UpdateAvatarController from '../useCases/UpdateAvatar/UpdateAvatarController';
import ensureAuthentication from '../middlewares/ensureAuthenticate';
import uploadConfig from '../../../../config/upload';

const updateAvatarController = new UpdateAvatarController();

const { avatars } = uploadConfig;

const uploadAvatars = multer(avatars);

const profileRouter = Router();

profileRouter.put(
  '/avatar',
  ensureAuthentication,
  uploadAvatars.single('photo'),
  updateAvatarController.handle,
);

export default profileRouter;
