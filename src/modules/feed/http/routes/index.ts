import { Router } from 'express';

import ListUserFeedController from '../useCases/ListUserFeed/ListUserFeedController';

import ListFeedPostsController from '@modules/feed/http/useCases/ListFeedPosts/ListFeedPostsController';
import ensureAuthentication from '@modules/users/http/middlewares/ensureAuthenticate';

const feedRouter = Router();

const listFeedPostsController = new ListFeedPostsController();
const listUserFeedController = new ListUserFeedController();

feedRouter.get('/posts', ensureAuthentication, listFeedPostsController.handle);

feedRouter.get('/', ensureAuthentication, listUserFeedController.handle);

export default feedRouter;
