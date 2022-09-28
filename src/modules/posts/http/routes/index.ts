import { Router } from 'express';

import multer from 'multer';
import uploadConfig from '../../../../config/upload';

import ensureAuthentication from '../../../users/http/middlewares/ensureAuthenticate';

import ListPostsController from '../useCase/ListPosts/ListPostsController';
import CreatePostController from '../useCase/CreatePost/CreatePostController';
import CreatePostCommentController from '../useCase/CreatePostComment/CreatePostCommentController';
import ListPostCommentsController from '../useCase/ListPostComments/ListPostCommentsController';

const postsRouter = Router();
const { posts } = uploadConfig;
const uploadPosts = multer(posts);

const listPostsController = new ListPostsController();
const createPostController = new CreatePostController();
const createPostCommentController = new CreatePostCommentController();
const listPostCommentsController = new ListPostCommentsController();

postsRouter.post(
  '/',
  ensureAuthentication,
  uploadPosts.single('photo'),
  createPostController.handle,
);

postsRouter.post(
  '/:post_id/comment',
  ensureAuthentication,
  createPostCommentController.handle,
);

postsRouter.get(
  '/:post_id/comments',
  ensureAuthentication,
  listPostCommentsController.handle,
);

postsRouter.post(
  '/me',
  ensureAuthentication,
  uploadPosts.single('photo'),
  createPostController.handle,
);

postsRouter.get('/', ensureAuthentication, listPostsController.handle);

postsRouter.get('/me', ensureAuthentication, listPostsController.handle);

export default postsRouter;
