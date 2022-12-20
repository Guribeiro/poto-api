import ICreateFriendshipDTO from '@modules/friendships/dtos/ICreateFriendshipDTO';
import IFindOneByUserAndFriendDTO from '@modules/friendships/dtos/IFindOneByUserAndFriendDTO';
import { Friendship, PrismaClient } from '@prisma/client';
import prisma from '@shared/prisma';
import IFriendshipRepository from '../../repositories/IFriendshipRepository';

class FriendshipRepository implements IFriendshipRepository {
  private readonly repository: PrismaClient;

  constructor() {
    this.repository = prisma;
  }

  public async create({
    user_id,
    friend_id,
  }: ICreateFriendshipDTO): Promise<Friendship> {
    const friendship = await this.repository.friendship.create({
      data: {
        user_id,
        friend_id,
      },
    });

    return friendship;
  }

  public async findOneByUserAndFriend({
    user_id,
    friend_id,
  }: IFindOneByUserAndFriendDTO): Promise<Friendship | null> {
    const friendship = await this.repository.friendship.findFirst({
      where: {
        OR: [
          {
            user_id,
            friend_id,
          },
          {
            user_id: friend_id,
            friend_id: user_id,
          },
        ],
      },
    });

    return friendship;
  }

  public async findManyByUserId(user_id: string): Promise<Friendship[]> {
    const friendships = await this.repository.friendship.findMany({
      where: {
        OR: [
          {
            user_id,
          },
          {
            friend_id: user_id,
          },
        ],
      },
    });

    return friendships;
  }
}

export default FriendshipRepository;
