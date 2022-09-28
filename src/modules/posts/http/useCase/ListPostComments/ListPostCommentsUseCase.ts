import { Comments } from '@prisma/client';

import { injectable, inject } from 'tsyringe';

import IPostsRepository from '../../../infra/repositories/IPostsRepository';
import IUsersRepository from '../../../../users/infra/repositories/IUsersRepository';
import IPostCommentsRepository from '../../../infra/repositories/IPostCommentsRepository';

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
      throw new Error('user could not be found');
    }

    const post = await this.postsRepository.findOneById(post_id);

    if (!post) {
      throw new Error('post could not be found');
    }

    const comments = await this.postCommentsRepository.findManyByPostId(
      post_id,
    );

    return comments;
  }
}

export default ListPostCommentsUseCase;
