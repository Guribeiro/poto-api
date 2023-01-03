import { container } from 'tsyringe';
import '@modules/users/infra/providers';
import './providers';

import IPostLikesRepository from '@modules/posts/repositories/IPostLikesRepository';
import PostLikesRepository from '@modules/posts/infra/prisma/repositories/PostLikesRepository';

import IPostsRepository from '@modules/posts/repositories/IPostsRepository';
import PostsRepository from '@modules/posts/infra/prisma/repositories/PostsRepository';

import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';
import UserTokensRepository from '@modules/users/infra/prisma/repositories/UserTokensRepository';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import UsersRepository from '@modules/users/infra/prisma/repositories/UsersRepository';

import IPostCommentsRepository from '@modules/posts/repositories/IPostCommentsRepository';
import PostCommentsRepository from '@modules/posts/infra/prisma/repositories/PostCommentsRepository';

import IFriendshipRequestRepository from '@modules/friendships/infra/repositories/IFriendshipRequestRepository';
import FriendshipRequestRepository from '@modules/friendships/infra/prisma/repositories/FriendshipRequestRepository';

import IFriendshipRepository from '@modules/friendships/infra/repositories/IFriendshipRepository';
import FriendshipRepository from '@modules/friendships/infra/prisma/repositories/FriendshipRepository';

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

container.registerSingleton<IFriendshipRequestRepository>(
  'FriendshipRequestRepository',
  FriendshipRequestRepository,
);

container.registerSingleton<IFriendshipRepository>(
  'FriendshipRepository',
  FriendshipRepository,
);
