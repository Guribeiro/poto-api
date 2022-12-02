import { injectable, inject } from 'tsyringe';
import { Posts } from '@prisma/client';

import IUsersRepository from '@modules/users/infra/repositories/IUsersRepository';
import IPostCommentsRepository from '@modules/posts/infra/repositories/IPostCommentsRepository';
import IPostLikesRepository from '@modules/posts/infra/repositories/IPostLikesRepository';
import IPostsRepository from '@modules/posts/infra/repositories/IPostsRepository';

interface Request {
  user_id: string;
  post_id: string;
  comment_id: string;
}

@injectable()
class DeletePostCommentUseCase {
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

  public async execute({
    user_id,
    post_id,
    comment_id,
  }: Request): Promise<Posts> {
    let post: Posts | null;

    const user = await this.usersRepository.findOneById(user_id);

    if (!user) {
      throw new Error('user could not be found');
    }

    post = await this.postsRepository.findOneById(post_id);

    if (!post) {
      throw new Error('post could not be found');
    }

    const comment = await this.postCommentsRepository.findOneById(comment_id);

    if (!comment) {
      throw new Error('comment could not be found');
    }

    if (comment.user_id !== user_id) {
      throw new Error('you do not have permission to delete this comment');
    }

    await this.postCommentsRepository.deleteOneById(comment_id);

    post = await this.postsRepository.findOneById(post_id);

    if (!post) {
      throw new Error('post could not be found');
    }

    const comments = await this.postCommentsRepository.findManyByPostId(
      post.id,
    );
    const postLikes = await this.postLikesRepository.findManyByPostId(post.id);

    const _commentsCount = comments.length;
    const _likesCount = postLikes.length;

    Object.assign(post, {
      _likesCount,
      _commentsCount,
      likes: postLikes,
      comments,
    });

    return post;
  }
}

export default DeletePostCommentUseCase;
