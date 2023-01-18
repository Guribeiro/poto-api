import { Comments, Likes, Posts } from '@prisma/client';
import { inject, injectable } from 'tsyringe';

import { PostMapper } from '../../mappers/PostMapper';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IPostCommentsRepository from '@modules/posts/repositories/IPostCommentsRepository';
import IPostLikesRepository from '@modules/posts/repositories/IPostLikesRepository';
import IPostsRepository from '@modules/posts/repositories/IPostsRepository';
import AppError from '@shared/errors/AppError';

interface Complement {
  _likes_count: number;
  _comments_count: number;
  likes: Likes[];
  comments: Comments[];
}

interface CreatePostLikeUseCaseResponse extends Posts, Complement {}

interface Request {
  user_id: string;
  post_id: string;
}

@injectable()
class CreatePostLikeUseCase {
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
    user_id,
    post_id,
  }: Request): Promise<CreatePostLikeUseCaseResponse> {
    const user = await this.usersRepository.findOneById(user_id);

    if (!user) {
      throw new AppError('user does not exist');
    }

    const post = await this.postsRepository.findOneById(post_id);

    if (!post) {
      throw new AppError('post does not exist');
    }

    const postMapped = PostMapper.toDTO(post);

    const findLike = await this.postLikesRepository.findOneByPostIdAndUserId(
      post_id,
      user_id,
    );

    if (findLike) {
      await this.postLikesRepository.deleteById(findLike.id);

      const comments = await this.postCommentsRepository.findManyByPostId(
        post_id,
      );

      const likes = await this.postLikesRepository.findManyByPostId(post.id);

      const postUpdated = Object.assign(postMapped, {
        likes,
        _likes_count: likes.length,
        comments,
        _comments_count: comments.length,
      });

      return postUpdated;
    }

    await this.postLikesRepository.create({
      user_id,
      post_id,
    });

    const comments = await this.postCommentsRepository.findManyByPostId(
      post_id,
    );

    const likes = await this.postLikesRepository.findManyByPostId(post.id);

    const postUpdated = Object.assign(postMapped, {
      likes,
      _likes_count: likes.length,
      comments,
      _comments_count: comments.length,
    });

    return postUpdated;
  }
}

export default CreatePostLikeUseCase;
