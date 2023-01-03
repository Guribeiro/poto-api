import { Posts } from '@prisma/client';
import { injectable, inject } from 'tsyringe';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IPostCommentsRepository from '@modules/posts/repositories/IPostCommentsRepository';
import IPostLikesRepository from '@modules/posts/repositories/IPostLikesRepository';
import IPostsRepository from '@modules/posts/repositories/IPostsRepository';

interface ListPostsUseCaseRequest {
  page: number;
  take: number;
}

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

  public async execute({
    take,
    page,
  }: ListPostsUseCaseRequest): Promise<Posts[]> {
    const posts = await this.postsRepository.all({ take, page });

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
