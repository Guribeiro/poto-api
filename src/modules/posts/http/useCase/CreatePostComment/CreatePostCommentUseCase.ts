import { Posts } from '@prisma/client';
import { injectable, inject } from 'tsyringe';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IPostsRepository from '@modules/posts/repositories/IPostsRepository';
import IPostLikesRepository from '@modules/posts/repositories/IPostLikesRepository';
import IPostCommentsRepository from '@modules/posts/repositories/IPostCommentsRepository';

interface Request {
  user_id: string;
  post_id: string;
  content: string;
}

@injectable()
class CreatePostCommentUseCase {
  constructor(
    @inject('UsersRepository')
    private readonly usersRepository: IUsersRepository,

    @inject('PostsRepository')
    private readonly postsRepository: IPostsRepository,

    @inject('PostCommentsRepository')
    private readonly postCommentsRepository: IPostCommentsRepository,

    @inject('PostLikesRepository')
    private readonly postLikesRepository: IPostLikesRepository,
  ) {}

  public async execute({ user_id, post_id, content }: Request): Promise<Posts> {
    const user = await this.usersRepository.findOneById(user_id);

    if (!user) {
      throw new Error('user could not be found');
    }

    const post = await this.postsRepository.findOneById(post_id);

    if (!post) {
      throw new Error('post could not be found');
    }

    await this.postCommentsRepository.create({
      user_id,
      post_id,
      content,
    });

    const comments = await this.postCommentsRepository.findManyByPostId(
      post_id,
    );

    const likes = await this.postLikesRepository.findManyByPostId(post.id);

    Object.assign(post, {
      _likes_count: likes.length,
      _comments_count: comments.length,
      likes,
      comments,
    });

    return post;
  }
}

export default CreatePostCommentUseCase;
