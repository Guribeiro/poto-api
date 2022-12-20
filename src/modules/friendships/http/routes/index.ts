import { Router } from 'express';

import ensureAuthentication from '@modules/users/http/middlewares/ensureAuthenticate';

import ListUserFriendshipsController from '../useCases/ListUserFriendships/ListUserFriendshipsController';
import CreateFriendshipRequestController from '../useCases/CreateFriendshipRequest/CreateFriendshipRequestController';
import AcceptFriendshipRequestController from '../useCases/AcceptFriendshipRequest/AcceptFriendshipRequestController';
import RefuseFriendshipRequestController from '../useCases/RefuseFriendshipRequest/RefuseFriendshipRequestController';

const friendshipsRouter = Router();

const createFriendshipRequestController =
  new CreateFriendshipRequestController();

const acceptFriendshipRequestController =
  new AcceptFriendshipRequestController();

const refuseFriendshipRequestController =
  new RefuseFriendshipRequestController();

const listUserFriendshipsController = new ListUserFriendshipsController();

friendshipsRouter.post(
  '/requests',
  ensureAuthentication,
  createFriendshipRequestController.handle,
);

friendshipsRouter.post(
  '/requests/:friendship_request_id/accept',
  ensureAuthentication,
  acceptFriendshipRequestController.handle,
);

friendshipsRouter.post(
  '/requests/:friendship_request_id/refuse',
  ensureAuthentication,
  refuseFriendshipRequestController.handle,
);

friendshipsRouter.get(
  '/',
  ensureAuthentication,
  listUserFriendshipsController.handle,
);

export default friendshipsRouter;
