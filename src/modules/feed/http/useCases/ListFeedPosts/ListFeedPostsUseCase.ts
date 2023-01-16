import { injectable, inject } from 'tsyringe';
import { Posts } from '@prisma/client';
import { startOfDay, endOfDay } from 'date-fns';

import AppError from '@shared/errors/AppError';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IPostsRepository, {
  Coordinates,
  Pagination,
} from '@modules/posts/repositories/IPostsRepository';
import IPostLikesRepository from '@modules/posts/repositories/IPostLikesRepository';
import IPostCommentsRepository from '@modules/posts/repositories/IPostCommentsRepository';
import { exclude } from '@shared/prisma/client';

interface Request {
  user_id: string;
}

interface ListFeedPostsUseCaseRequest {
  request: Request;
  pagination: Pagination;
  coordinates: Coordinates;
}

@injectable()
class ListFeedPostsUseCase {
  constructor(
    @inject('UsersRepository')
    private readonly usersRepository: IUsersRepository,

    @inject('PostsRepository')
    private readonly postsRepository: IPostsRepository,

    @inject('PostLikesRepository')
    private readonly postLikesRepository: IPostLikesRepository,

    @inject('PostCommentsRepository')
    private readonly postCommentsRepository: IPostCommentsRepository,
  ) {}

  public async execute({
    request: { user_id },
    pagination,
    coordinates,
  }: ListFeedPostsUseCaseRequest): Promise<Posts[]> {
    const user = await this.usersRepository.findOneById(user_id);

    if (!user) {
      throw new AppError('user could not be found');
    }

    const today = new Date();

    const posts =
      await this.postsRepository.findManyByIntervalDateAndCoordinates({
        interval: {
          start: startOfDay(today),
          end: endOfDay(today),
        },
        pagination,
        coordinates,
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

export default ListFeedPostsUseCase;
