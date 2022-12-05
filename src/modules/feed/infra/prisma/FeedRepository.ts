import { Posts, PrismaClient } from '@prisma/client';
import prisma from '@shared/prisma';
import IFeedRepository, { IListFeedDTO } from '../repositories/IFeedRepository';

class FeedRepository implements IFeedRepository {
  private readonly repository: PrismaClient;

  constructor() {
    this.repository = prisma;
  }

  public async list({
    latitude,
    longitude,
    radius,
  }: IListFeedDTO): Promise<Posts[]> {
    const feed = await this.repository
      .$queryRaw`SELECT * FROM "posts" WHERE ST_DWithin(ST_MakePoint(longitude, latitude), ST_MakePoint(${longitude}, ${latitude})::geography, ${radius} * 1000)`;

    return feed as Posts[];
  }
}

export default FeedRepository;
