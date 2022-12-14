import { Posts } from '@prisma/client';
import { injectable, inject } from 'tsyringe';

import IUsersRepository from '@modules/users/infra/repositories/IUsersRepository';
import IPostCommentsRepository from '@modules/posts/infra/repositories/IPostCommentsRepository';
import IPostLikesRepository from '@modules/posts/infra/repositories/IPostLikesRepository';
import IPostsRepository from '@modules/posts/infra/repositories/IPostsRepository';

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
      const likes = await this.postLikesRepository.findManyByPostId(post.id);

      Object.assign(post, {
        _likes_count: likes.length,
        _comments_count: likes.length,
        likes,
        comments,
      });
    }

    return posts;
  }
}

export default ListPostsUseCase;
