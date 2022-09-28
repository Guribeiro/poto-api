import { Posts } from '@prisma/client';
import { inject, injectable } from 'tsyringe';

import IPostCommentsRepository from '../../../../posts/infra/repositories/IPostCommentsRepository';
import ILikesRepository from '../../../infra/repositories/ILikesRepository';
import IPostsRepository from '../../../../posts/infra/repositories/IPostsRepository';
import IUsersRepository from '../../../../users/infra/repositories/IUsersRepository';

interface Request {
  user_id: string;
  post_id: string;
}

@injectable()
class CreateLikeUseCase {
  constructor(
    @inject('UsersRepository')
    private readonly usersRepository: IUsersRepository,

    @inject('PostsRepository')
    private readonly postsRepository: IPostsRepository,

    @inject('LikesRepository')
    private readonly likesRepository: ILikesRepository,

    @inject('PostCommentsRepository')
    private readonly postCommentsRepository: IPostCommentsRepository,
  ) {}

  public async execute({ user_id, post_id }: Request): Promise<Posts> {
    const user = await this.usersRepository.findOneById(user_id);

    if (!user) {
      throw new Error('user does not exist');
    }

    const post = await this.postsRepository.findOneById(post_id);

    if (!post) {
      throw new Error('post does not exist');
    }

    const findPostLikeByUser =
      await this.likesRepository.findOneByPostIdAndUserId(post_id, user_id);

    if (findPostLikeByUser) {
      await this.likesRepository.deleteById(findPostLikeByUser.id);

      const postComments = await this.postCommentsRepository.findManyByPostId(
        post_id,
      );

      const postCommentsCount = postComments.length;

      const postLikes = await this.likesRepository.findManyByPostId(post.id);

      const postLikesCount = postLikes.length;

      Object.assign(post, {
        likes: postLikes,
        _likesCount: postLikesCount,
        comments: postComments,
        _commentsCount: postCommentsCount,
      });

      return post;
    }

    await this.likesRepository.create({
      user_id,
      post_id,
    });

    const postComments = await this.postCommentsRepository.findManyByPostId(
      post_id,
    );

    const postCommentsCount = postComments.length;

    const postLikes = await this.likesRepository.findManyByPostId(post.id);

    const postLikesCount = postLikes.length;

    Object.assign(post, {
      likes: postLikes,
      _likesCount: postLikesCount,
      comments: postComments,
      _commentsCount: postCommentsCount,
    });

    return post;
  }
}

export default CreateLikeUseCase;
