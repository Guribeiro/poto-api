import { container } from 'tsyringe';
import '../../modules/users/infra/providers';
import './providers';

import ILikesRepository from '../../modules/likes/infra/repositories/ILikesRepository';
import LikesRepository from '../../modules/likes/infra/prisma/repositories/LikesRepository';

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

container.registerSingleton<ILikesRepository>(
  'LikesRepository',
  LikesRepository,
);

container.registerSingleton<IPostCommentsRepository>(
  'PostCommentsRepository',
  PostCommentsRepository,
);
