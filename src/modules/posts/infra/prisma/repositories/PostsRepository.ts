import { PrismaClient, Posts } from '@prisma/client';
import prisma from '@shared/prisma/client';
import ICreatePostDTO from '@modules/posts/dtos/ICreatePostDTO';
import IPostsRepository, {
  Pagination,
  Coordinates,
  IFindOneByUserAndIntervalDateDTO,
  IFindManyByIntervalDateDTO,
  IFindManyByIntervalDateAndCoordinates,
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

  public async all({ page, take }: Pagination): Promise<Posts[]> {
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
  }: Coordinates): Promise<Posts[]> {
    const posts: Posts[] = await this.repository.$queryRaw`
    SELECT * FROM "posts"
      WHERE ST_DWithin(
        ST_MakePoint(longitude, latitude),
        ST_MakePoint(${longitude}, ${latitude})::geography, ${radius} * 1000
      )`;

    return posts;
  }

  public async findOneByUserAndIntervalDate({
    user_id,
    interval,
  }: IFindOneByUserAndIntervalDateDTO): Promise<Posts | null> {
    return await this.repository.posts.findFirst({
      where: {
        user_id,
        created_at: {
          gt: interval.start,
        },
        AND: {
          created_at: {
            lt: interval.end,
          },
        },
      },
    });
  }

  public async findManyByIntervalDate({
    interval: { start, end },
    pagination: { page, take },
  }: IFindManyByIntervalDateDTO): Promise<Posts[]> {
    return await this.repository.posts.findMany({
      where: {
        created_at: {
          gt: start,
        },
        AND: {
          created_at: {
            lt: end,
          },
        },
      },
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

  public async findManyByIntervalDateAndCoordinates({
    interval: { end, start },
    coordinates: { latitude, longitude, radius },
  }: IFindManyByIntervalDateAndCoordinates): Promise<Posts[]> {
    const posts: Posts[] = await this.repository.$queryRaw`
      SELECT * FROM "posts" WHERE
        ST_DWithin(
          ST_MakePoint(longitude, latitude),
          ST_MakePoint(${longitude}, ${latitude})::geography, ${radius} * 1000)
        AND created_at BETWEEN ${start} AND ${end}
        ORDER BY created_at DESC
        `;

    return posts;
  }
}

export default PostsRepository;
