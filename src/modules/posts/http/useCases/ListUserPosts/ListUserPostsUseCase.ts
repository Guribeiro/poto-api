import { Posts } from '@prisma/client';
import { injectable, inject } from 'tsyringe';

import { PostMapper } from '../../mappers/PostMapper';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IPostsRepository from '@modules/posts/repositories/IPostsRepository';

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

    const postsMapped = posts.map(post => PostMapper.toDTO(post));

    return postsMapped;
  }
}

export default ListUserPostsUseCase;
