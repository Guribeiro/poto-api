import { Posts } from '@prisma/client';
import { inject, injectable } from 'tsyringe';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IPostCommentsRepository from '@modules/posts/repositories/IPostCommentsRepository';
import IPostLikesRepository from '@modules/posts/repositories/IPostLikesRepository';
import IPostsRepository from '@modules/posts/repositories/IPostsRepository';

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
      await this.postLikesRepository.findOneByPostIdAndUserId(post_id, user_id);

    if (findPostLikeByUser) {
      await this.postLikesRepository.deleteById(findPostLikeByUser.id);

      const postComments = await this.postCommentsRepository.findManyByPostId(
        post_id,
      );

      const postLikes = await this.postLikesRepository.findManyByPostId(
        post.id,
      );

      Object.assign(post, {
        likes: postLikes,
        _likes_count: postLikes.length,
        comments: postComments,
        _comments_count: postComments.length,
      });

      return post;
    }

    await this.postLikesRepository.create({
      user_id,
      post_id,
    });

    const comments = await this.postCommentsRepository.findManyByPostId(
      post_id,
    );

    const likes = await this.postLikesRepository.findManyByPostId(post.id);

    Object.assign(post, {
      likes,
      _likes_count: likes.length,
      comments,
      _comments_count: comments.length,
    });

    return post;
  }
}

export default CreatePostLikeUseCase;
