import { Likes, Posts, Comments } from '@prisma/client';
import { injectable, inject } from 'tsyringe';
import AppError from '@shared/errors/AppError';

import { PostMapper } from '../../mappers/PostMapper';

import { Complement } from '@modules/posts/types';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IPostsRepository from '@modules/posts/repositories/IPostsRepository';
import IPostLikesRepository from '@modules/posts/repositories/IPostLikesRepository';
import IPostCommentsRepository from '@modules/posts/repositories/IPostCommentsRepository';

interface CreatePostCommentUseCaseResponse extends Posts, Complement {}

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

  public async execute({
    user_id,
    post_id,
    content,
  }: Request): Promise<CreatePostCommentUseCaseResponse> {
    const user = await this.usersRepository.findOneById(user_id);

    if (!user) {
      throw new AppError('user could not be found');
    }

    const post = await this.postsRepository.findOneById(post_id);

    if (!post) {
      throw new AppError('post could not be found');
    }

    const postMapped = PostMapper.toDTO(post);

    await this.postCommentsRepository.create({
      user_id,
      post_id,
      content,
    });

    const comments = await this.postCommentsRepository.findManyByPostId(
      post_id,
    );

    const likes = await this.postLikesRepository.findManyByPostId(post.id);

    const postUpdated = Object.assign<Posts, Complement>(postMapped, {
      _likes_count: likes.length,
      _comments_count: comments.length,
      likes,
      comments,
    });

    return postUpdated;
  }
}

export default CreatePostCommentUseCase;
