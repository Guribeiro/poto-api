import { Posts } from '@prisma/client';
import { injectable, inject } from 'tsyringe';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IPostsRepository from '@modules/posts/repositories/IPostsRepository';
import IPostLikesRepository from '@modules/posts/repositories/IPostLikesRepository';
import IPostCommentsRepository from '@modules/posts/repositories/IPostCommentsRepository';

interface Request {
  user_id: string;
  post_id: string;
}

@injectable()
class ShowPostUseCase {
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
      throw new Error('user could not be found');
    }

    const post = await this.postsRepository.findOneById(post_id);

    if (!post) {
      throw new Error('post could not be found');
    }

    const comments = await this.postCommentsRepository.findManyByPostId(
      post.id,
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

export default ShowPostUseCase;
