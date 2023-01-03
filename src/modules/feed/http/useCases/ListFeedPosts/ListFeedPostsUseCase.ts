import { injectable, inject } from 'tsyringe';
import { Posts } from '@prisma/client';

import AppError from '@shared/errors/AppError';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IPostsRepository from '@modules/posts/repositories/IPostsRepository';

interface Request {
  user_id: string;
  page: number;
  take: number;
}

@injectable()
class ListFeedPostsUseCase {
  constructor(
    @inject('UsersRepository')
    private readonly usersRepository: IUsersRepository,

    @inject('PostsRepository')
    private readonly postsRepository: IPostsRepository,
  ) {}

  public async execute({ user_id, page, take }: Request): Promise<Posts[]> {
    const user = await this.usersRepository.findOneById(user_id);

    if (!user) {
      throw new AppError('user could not be found');
    }

    const posts = await this.postsRepository.all({
      page,
      take,
    });

    return posts;
  }
}

export default ListFeedPostsUseCase;
