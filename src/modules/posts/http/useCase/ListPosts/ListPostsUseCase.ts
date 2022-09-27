import { Posts, Likes } from '@prisma/client';
import { injectable, inject } from 'tsyringe';

import ILikesRepository from '../../../../likes/infra/repositories/ILikesRepository';
import IUsersRepository from '../../../../users/infra/repositories/IUsersRepository';
import IPostsRepository from '../../../infra/repositories/IPostsRepository';

@injectable()
class ListPostsUseCase {
  constructor(
    @inject('UsersRepository')
    private readonly usersRepository: IUsersRepository,

    @inject('PostsRepository')
    private readonly postsRepository: IPostsRepository,

    @inject('LikesRepository')
    private readonly likesRepository: ILikesRepository,
  ) {}

  public async execute(): Promise<Posts[]> {
    const posts = await this.postsRepository.all();

    for await (const post of posts) {
      const postLikes = await this.likesRepository.findManyByPostId(post.id);

      const postLikesCount = postLikes.length;

      Object.assign(post, { _likes_count: postLikesCount });
    }

    return posts;
  }
}

export default ListPostsUseCase;
