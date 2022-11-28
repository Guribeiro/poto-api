import { Router } from 'express';
import ListFeedPostsController from '../useCases/ListFeedPosts/ListFeedPostsController';
import ensureAuthentication from '../../../users/http/middlewares/ensureAuthenticate';

const feedRouter = Router();

const listFeedPostsController = new ListFeedPostsController();

feedRouter.get('/posts', ensureAuthentication, listFeedPostsController.handle);

export default feedRouter;
