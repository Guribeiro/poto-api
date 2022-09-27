import { Router } from 'express';
import CreateLikeController from '../useCase/createLike/CreateLikeController';

import ensureAuthentication from '../../../users/http/middlewares/ensureAuthenticate';

const likesRouter = Router();

const createLikeController = new CreateLikeController();

likesRouter.post(
  '/posts/:post_id',
  ensureAuthentication,
  createLikeController.handle,
);

export default likesRouter;
