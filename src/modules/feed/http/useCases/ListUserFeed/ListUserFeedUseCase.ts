import { injectable, inject } from 'tsyringe';
import { Posts } from '@prisma/client';

import IFeedRepository from '@modules/feed/infra/repositories/IFeedRepository';
import IUsersRepository from '@modules/users/infra/repositories/IUsersRepository';
import IPostLikesRepository from '@modules/posts/infra/repositories/IPostLikesRepository';
import IPostCommentsRepository from '@modules/posts/infra/repositories/IPostCommentsRepository';

import AppError from '@shared/errors/AppError';
import { exclude } from '@shared/prisma';

interface Request {
  user_id: string;
  latitude: number;
  longitude: number;
  radius: number;
}

@injectable()
class ListUserFeedUseCase {
  constructor(
    @inject('UsersRepository')
    private readonly usersRepository: IUsersRepository,

    @inject('FeedRepository')
    private readonly feedRepository: IFeedRepository,

    @inject('PostLikesRepository')
    private readonly postLikesRepository: IPostLikesRepository,

    @inject('PostCommentsRepository')
    private readonly postCommentsRepository: IPostCommentsRepository,
  ) {}

  public async execute({
    user_id,
    latitude,
    longitude,
    radius,
  }: Request): Promise<Posts[]> {
    const user = await this.usersRepository.findOneById(user_id);

    if (!user) {
      throw new AppError('user could not be found');
    }

    const posts = await this.feedRepository.list({
      latitude,
      longitude,
      radius,
    });

    const userWithoutPassword = exclude(user, 'password');

    for await (const post of posts) {
      const likes = await this.postLikesRepository.findManyByPostId(post.id);

      const comments = await this.postCommentsRepository.findManyByPostId(
        post.id,
      );

      Object.assign(post, {
        user: userWithoutPassword,
        likes,
        _likes_count: likes.length,
        comments,
        _comments_count: comments.length,
      });
    }

    return posts;
  }
}

export default ListUserFeedUseCase;
