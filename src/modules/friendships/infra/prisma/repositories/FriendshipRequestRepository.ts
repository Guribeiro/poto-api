import { FriendshipRequest, PrismaClient } from '@prisma/client';
import prisma from '@shared/prisma';

import ICreateFriendshipRequestDTO from '@modules/friendships/dtos/ICreateFriendshipRequestDTO';
import IFindOneByRequesteeAndRequestedIdsDTO from '@modules/friendships/dtos/IFindOneByRequesteeAndRequestedIdsDTO';
import IFriendshipRequestRepository from '../../repositories/IFriendshipRequestRepository';

class FriendshipRequestRepository implements IFriendshipRequestRepository {
  private readonly repository: PrismaClient;

  constructor() {
    this.repository = prisma;
  }

  public async create({
    requestee_id,
    requested_id,
  }: ICreateFriendshipRequestDTO): Promise<FriendshipRequest> {
    const friendshipRequest = await this.repository.friendshipRequest.create({
      data: {
        requestee_id,
        requested_id,
      },
    });

    return friendshipRequest;
  }

  public async findOneById(
    friendship_request_id: string,
  ): Promise<FriendshipRequest | null> {
    const friendship_request =
      await this.repository.friendshipRequest.findFirst({
        where: {
          id: friendship_request_id,
        },
      });

    return friendship_request;
  }

  public async findOneByRequesteeAndRequestedIds({
    requestee_id,
    requested_id,
  }: IFindOneByRequesteeAndRequestedIdsDTO): Promise<FriendshipRequest | null> {
    const friendship_request =
      await this.repository.friendshipRequest.findFirst({
        where: {
          requestee_id,
          requested_id,
        },
      });

    return friendship_request;
  }

  public async deleteById(friendship_request_id: string): Promise<void> {
    await this.repository.friendshipRequest.delete({
      where: {
        id: friendship_request_id,
      },
    });
  }
}

export default FriendshipRequestRepository;
