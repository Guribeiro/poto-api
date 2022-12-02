import { Router } from 'express';

import ListFeedPostsController from '@modules/feed/http/useCases/ListFeedPosts/ListFeedPostsController';
import ensureAuthentication from '@modules/users/http/middlewares/ensureAuthenticate';

const feedRouter = Router();

const listFeedPostsController = new ListFeedPostsController();

feedRouter.get('/posts', ensureAuthentication, listFeedPostsController.handle);

export default feedRouter;
