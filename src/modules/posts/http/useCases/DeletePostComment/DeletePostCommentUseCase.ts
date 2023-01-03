import { injectable, inject } from 'tsyringe';
import { Posts } from '@prisma/client';

import AppError from '@shared/errors/AppError';

import { Complement } from '@modules/posts/types';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IPostCommentsRepository from '@modules/posts/repositories/IPostCommentsRepository';
import IPostLikesRepository from '@modules/posts/repositories/IPostLikesRepository';
import IPostsRepository from '@modules/posts/repositories/IPostsRepository';

interface DeletePostCommentUseCaseResponse extends Posts, Complement {}

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
  }: Request): Promise<DeletePostCommentUseCaseResponse> {
    const user = await this.usersRepository.findOneById(user_id);

    if (!user) {
      throw new AppError('user could not be found');
    }

    const post = await this.postsRepository.findOneById(post_id);

    if (!post) {
      throw new AppError('post could not be found');
    }

    const comment = await this.postCommentsRepository.findOneById(comment_id);

    if (!comment) {
      throw new AppError('comment could not be found');
    }

    if (comment.user_id !== user_id) {
      throw new AppError('you do not have permission to delete this comment');
    }

    await this.postCommentsRepository.deleteOneById(comment_id);

    const comments = await this.postCommentsRepository.findManyByPostId(
      post.id,
    );
    const likes = await this.postLikesRepository.findManyByPostId(post.id);

    const updatedPost = Object.assign(post, {
      _likes_count: likes.length,
      _comments_count: comments.length,
      likes,
      comments,
    });

    return updatedPost;
  }
}

export default DeletePostCommentUseCase;
