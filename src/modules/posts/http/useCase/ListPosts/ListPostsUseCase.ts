import { Posts } from '@prisma/client';
import { injectable, inject } from 'tsyringe';

import IPostsRepository from '../../../infra/repositories/IPostsRepository';
import IPostLikesRepository from '../../../infra/repositories/IPostLikesRepository';
import IUsersRepository from '../../../../users/infra/repositories/IUsersRepository';
import IPostCommentsRepository from '../../../infra/repositories/IPostCommentsRepository';

@injectable()
class ListPostsUseCase {
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

  public async execute(): Promise<Posts[]> {
    const posts = await this.postsRepository.all();

    for await (const post of posts) {
      const comments = await this.postCommentsRepository.findManyByPostId(
        post.id,
      );
      const postLikes = await this.postLikesRepository.findManyByPostId(
        post.id,
      );

      const _commentsCount = comments.length;
      const _likesCount = postLikes.length;

      Object.assign(post, {
        _likesCount,
        _commentsCount,
        likes: postLikes,
        comments,
      });
    }

    return posts;
  }
}

export default ListPostsUseCase;
