import { Router } from 'express';

import multer from 'multer';
import uploadConfig from '@config/upload';

import ensureAuthentication from '@modules/users/http/middlewares/ensureAuthenticate';

import ListPostsController from '../useCases/ListPosts/ListPostsController';
import CreatePostController from '../useCases/CreatePost/CreatePostController';
import CreatePostLikeController from '../useCases/CreatePostLike/CreatePostLikeController';
import CreatePostCommentController from '../useCases/CreatePostComment/CreatePostCommentController';
import ListPostCommentsController from '../useCases/ListPostComments/ListPostCommentsController';
import DeletePostCommentController from '../useCases/DeletePostComment/DeletePostCommentController';
import ListUserPostsLikedController from '../useCases/ListUserPostsLiked/ListUserPostsLikedController';

const postsRouter = Router();

const { posts } = uploadConfig;

const uploadPosts = multer(posts);

const listPostsController = new ListPostsController();
const createPostController = new CreatePostController();
const createPostLikeController = new CreatePostLikeController();
const createPostCommentController = new CreatePostCommentController();
const listPostCommentsController = new ListPostCommentsController();
const deletePostCommentController = new DeletePostCommentController();
const listUserPostsLikedController = new ListUserPostsLikedController();

postsRouter.post(
  '/',
  ensureAuthentication,
  uploadPosts.single('photo'),
  createPostController.handle,
);

postsRouter.post(
  '/:post_id/comments',
  ensureAuthentication,
  createPostCommentController.handle,
);

postsRouter.post(
  '/:post_id/likes',
  ensureAuthentication,
  createPostLikeController.handle,
);

postsRouter.get(
  '/:post_id/comments',
  ensureAuthentication,
  listPostCommentsController.handle,
);

postsRouter.delete(
  '/:post_id/comments/:comment_id',
  ensureAuthentication,
  deletePostCommentController.handle,
);

postsRouter.post(
  '/me',
  ensureAuthentication,
  uploadPosts.single('photo'),
  createPostController.handle,
);

postsRouter.get(
  '/me/likes',
  ensureAuthentication,
  listUserPostsLikedController.handle,
);

postsRouter.get('/', ensureAuthentication, listPostsController.handle);

postsRouter.get('/me', ensureAuthentication, listPostsController.handle);

export default postsRouter;
