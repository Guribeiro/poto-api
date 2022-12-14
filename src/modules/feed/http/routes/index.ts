import { Router } from 'express';

import ListUserFeedController from '../useCases/ListUserFeed/ListUserFeedController';
import ShowPostController from '../useCases/ShowPost/ShowPostController';
import ListFeedPostsController from '@modules/feed/http/useCases/ListFeedPosts/ListFeedPostsController';

import ensureAuthentication from '@modules/users/http/middlewares/ensureAuthenticate';

const feedRouter = Router();

const listFeedPostsController = new ListFeedPostsController();
const listUserFeedController = new ListUserFeedController();
const showPostController = new ShowPostController();

feedRouter.get('/posts', ensureAuthentication, listFeedPostsController.handle);

feedRouter.get('/', ensureAuthentication, listUserFeedController.handle);
feedRouter.get(
  '/posts/:post_id',
  ensureAuthentication,
  showPostController.handle,
);

export default feedRouter;
