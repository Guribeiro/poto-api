import { Posts } from '@prisma/client';
import { injectable, inject } from 'tsyringe';

import IPostsRepository from '../../../infra/repositories/IPostsRepository';
import IUsersRepository from '../../../../users/infra/repositories/IUsersRepository';
import ILikesRepository from '../../../../likes/infra/repositories/ILikesRepository';
import IPostCommentsRepository from '../../../infra/repositories/IPostCommentsRepository';

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

    @inject('LikesRepository')
    private readonly likesRepository: ILikesRepository,
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

    const postComments = await this.postCommentsRepository.findManyByPostId(
      post_id,
    );

    const postLikes = await this.likesRepository.findManyByPostId(post.id);

    const postLikesCount = postLikes.length;
    const postCommentsCount = postComments.length;

    Object.assign(post, {
      _likesCount: postLikesCount,
      _commentsCount: postCommentsCount,
      likes: postLikes,
      comments: postComments,
    });

    return post;
  }
}

export default CreatePostCommentUseCase;
