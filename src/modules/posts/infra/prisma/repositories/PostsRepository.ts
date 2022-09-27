import { PrismaClient, Posts } from '@prisma/client';
import ICreatePostDTO from '../../../dtos/ICreatePostDTO';
import IPostsRepository from '../../repositories/IPostsRepository';

class PostsRepository implements IPostsRepository {
  private readonly repository: PrismaClient;
  constructor() {
    this.repository = new PrismaClient();
  }

  public async create({
    user_id,
    subtitle,
    photo,
  }: ICreatePostDTO): Promise<Posts> {
    const post = await this.repository.posts.create({
      data: {
        user_id,
        subtitle,
        photo,
      },
      include: {
        user: true,
        likes: true,
      },
    });

    return post;
  }

  public async all(): Promise<Posts[]> {
    return await this.repository.posts.findMany({
      include: {
        user: true,
        likes: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  public async findManyByUserId(user_id: string): Promise<Posts[]> {
    return await this.repository.posts.findMany({
      where: {
        user_id,
      },
      include: {
        user: true,
        likes: true,
      },
    });
  }

  public async findOneById(post_id: string): Promise<Posts | null> {
    return await this.repository.posts.findUnique({
      where: {
        id: post_id,
      },
      include: {
        user: true,
      },
    });
  }
}

export default PostsRepository;
