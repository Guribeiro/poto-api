import { Comments } from '@prisma/client';

import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IPostsRepository from '@modules/posts/repositories/IPostsRepository';
import IPostCommentsRepository from '@modules/posts/repositories/IPostCommentsRepository';

interface Request {
  post_id: string;
  user_id: string;
}

@injectable()
class ListPostCommentsUseCase {
  constructor(
    @inject('UsersRepository')
    private readonly usersRepository: IUsersRepository,

    @inject('PostsRepository')
    private readonly postsRepository: IPostsRepository,

    @inject('PostCommentsRepository')
    private readonly postCommentsRepository: IPostCommentsRepository,
  ) {}

  public async execute({ post_id, user_id }: Request): Promise<Comments[]> {
    const user = await this.usersRepository.findOneById(user_id);

    if (!user) {
      throw new AppError('user could not be found');
    }

    const post = await this.postsRepository.findOneById(post_id);

    if (!post) {
      throw new AppError('post could not be found');
    }

    const comments = await this.postCommentsRepository.findManyByPostId(
      post_id,
    );

    return comments;
  }
}

export default ListPostCommentsUseCase;
