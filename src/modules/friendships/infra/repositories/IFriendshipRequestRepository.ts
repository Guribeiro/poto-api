import { FriendshipRequest } from '@prisma/client';

import ICreateFriendshipRequestDTO from '@modules/friendships/dtos/ICreateFriendshipRequestDTO';
import IFindOneByRequesteeAndRequestedIdsDTO from '@modules/friendships/dtos/IFindOneByRequesteeAndRequestedIdsDTO';

export default class IFriendshipRequestRepository {
  create: (data: ICreateFriendshipRequestDTO) => Promise<FriendshipRequest>;
  findOneById: (
    friendship_request_id: string,
  ) => Promise<FriendshipRequest | null>;

  findOneByRequesteeAndRequestedIds: (
    data: IFindOneByRequesteeAndRequestedIdsDTO,
  ) => Promise<FriendshipRequest | null>;

  deleteById: (friendship_request_id: string) => Promise<void>;
}
