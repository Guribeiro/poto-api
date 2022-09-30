import { container } from 'tsyringe';
import '../../modules/users/infra/providers';
import './providers';

import IPostLikesRepository from '../../modules/posts/infra/repositories/IPostLikesRepository';
import PostLikesRepository from '../../modules/posts/infra/prisma/repositories/PostLikesRepository';

import IPostsRepository from '../../modules/posts/infra/repositories/IPostsRepository';
import PostsRepository from '../../modules/posts/infra/prisma/repositories/PostsRepository';

import IUserTokensRepository from '../../modules/users/infra/repositories/IUserTokensRepository';
import UserTokensRepository from '../../modules/users/infra/prisma/repositories/UserTokensRepository';

import IUsersRepository from '../../modules/users/infra/repositories/IUsersRepository';
import UsersRepository from '../../modules/users/infra/prisma/repositories/UsersRepository';

import IPostCommentsRepository from '../../modules/posts/infra/repositories/IPostCommentsRepository';
import PostCommentsRepository from '../../modules/posts/infra/prisma/repositories/PostCommentsRepository';

container.registerSingleton<IUsersRepository>(
  'UsersRepository',
  UsersRepository,
);

container.registerSingleton<IUserTokensRepository>(
  'UserTokensRepository',
  UserTokensRepository,
);

container.registerSingleton<IPostsRepository>(
  'PostsRepository',
  PostsRepository,
);

container.registerSingleton<IPostLikesRepository>(
  'PostLikesRepository',
  PostLikesRepository,
);

container.registerSingleton<IPostCommentsRepository>(
  'PostCommentsRepository',
  PostCommentsRepository,
);
