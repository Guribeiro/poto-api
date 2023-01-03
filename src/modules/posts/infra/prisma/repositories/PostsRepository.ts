import { PrismaClient, Posts } from '@prisma/client';
import prisma from '@shared/prisma';
import ICreatePostDTO from '@modules/posts/dtos/ICreatePostDTO';
import IPostsRepository, {
  IAllDTO,
  IListFeedDTO,
} from '../../../repositories/IPostsRepository';

class PostsRepository implements IPostsRepository {
  private readonly repository: PrismaClient;
  constructor() {
    this.repository = prisma;
  }

  public async create({
    user_id,
    subtitle,
    photo,
    latitude,
    longitude,
  }: ICreatePostDTO): Promise<Posts> {
    const post = await this.repository.posts.create({
      data: {
        user_id,
        subtitle,
        photo,
        latitude,
        longitude,
      },
      include: {
        user: true,
        likes: true,
      },
    });

    return post;
  }

  public async all({ page, take }: IAllDTO): Promise<Posts[]> {
    return await this.repository.posts.findMany({
      skip: page * take,
      take,
      include: {
        user: true,
        likes: {
          include: {
            user: true,
          },
        },
        comments: {
          include: {
            user: true,
          },
        },
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

  public async listPostsByUserAndCoordinates({
    latitude,
    longitude,
    radius,
  }: IListFeedDTO): Promise<Posts[]> {
    const posts: Posts[] = await this.repository
      .$queryRaw`SELECT * FROM "posts" WHERE ST_DWithin(ST_MakePoint(longitude, latitude), ST_MakePoint(${longitude}, ${latitude})::geography, ${radius} * 1000)`;

    return posts;
  }
}

export default PostsRepository;
