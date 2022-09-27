import { Router } from 'express';

import multer from 'multer';
import uploadConfig from '../../../../config/upload';

import ensureAuthentication from '../../../users/http/middlewares/ensureAuthenticate';

import CreatePostController from '../useCase/CreatePost/CreatePostController';
import ListPostsController from '../useCase/ListPosts/ListPostsController';

const postsRouter = Router();
const { posts } = uploadConfig;
const uploadPosts = multer(posts);

const createPostController = new CreatePostController();
const listPostsController = new ListPostsController();

postsRouter.post(
  '/',
  ensureAuthentication,
  uploadPosts.single('photo'),
  createPostController.handle,
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
