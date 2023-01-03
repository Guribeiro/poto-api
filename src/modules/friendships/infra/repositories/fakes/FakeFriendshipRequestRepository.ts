import { FriendshipRequest } from '@prisma/client';
import { randomUUID } from 'node:crypto';
import ICreateFriendshipRequestDTO from '@modules/friendships/dtos/ICreateFriendshipRequestDTO';
import IFriendshipRequestRepository from '../IFriendshipRequestRepository';
import IFindOneByRequesteeAndRequestedIdsDTO from '@modules/friendships/dtos/IFindOneByRequesteeAndRequestedIdsDTO';

class FakeFriendshipRequestRepository implements IFriendshipRequestRepository {
  private readonly friendshipRequests: FriendshipRequest[] = [];

  public async create({
    requested_id,
    requestee_id,
  }: ICreateFriendshipRequestDTO): Promise<FriendshipRequest> {
    const friendshipRequest: FriendshipRequest = {
      id: randomUUID(),
      requestee_id,
      requested_id,
      created_at: new Date(),
    };

    this.friendshipRequests.push(friendshipRequest);

    return friendshipRequest;
  }

  public async findOneById(
    friendship_request_id: string,
  ): Promise<FriendshipRequest | null> {
    return (
      this.friendshipRequests.find(
        friendshipRequest => friendshipRequest.id === friendship_request_id,
      ) ?? null
    );
  }

  public async findOneByRequesteeAndRequestedIds({
    requested_id,
    requestee_id,
  }: IFindOneByRequesteeAndRequestedIdsDTO): Promise<FriendshipRequest | null> {
    return (
      this.friendshipRequests.find(
        friendshipRequest =>
          friendshipRequest.requested_id === requested_id &&
          friendshipRequest.requestee_id === requestee_id,
      ) ?? null
    );
  }

  public async deleteById(friendship_request_id: string): Promise<void> {
    const findIndex = this.friendshipRequests.findIndex(
      friendshipRequest => friendshipRequest.id === friendship_request_id,
    );

    this.friendshipRequests.splice(findIndex, 1);
  }
}

export default FakeFriendshipRequestRepository;
