import { Posts } from '@prisma/client';
import { injectable, inject } from 'tsyringe';

import IUsersRepository from '@modules/users/infra/repositories/IUsersRepository';
import IPostsRepository from '@modules/posts/infra/repositories/IPostsRepository';

interface Request {
  user_id: string;
}

@injectable()
class ListUserPostsUseCase {
  constructor(
    @inject('UsersRepository')
    private readonly usersRepository: IUsersRepository,

    @inject('PostsRepository')
    private readonly postsRepository: IPostsRepository,
  ) {}

  public async execute({ user_id }: Request): Promise<Posts[]> {
    const user = await this.usersRepository.findOneById(user_id);

    if (!user) {
      throw new Error('user could not be foud');
    }

    const posts = await this.postsRepository.findManyByUserId(user_id);

    return posts;
  }
}

export default ListUserPostsUseCase;
