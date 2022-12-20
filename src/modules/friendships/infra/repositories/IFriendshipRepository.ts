import { Friendship } from '@prisma/client';

import ICreateFriendshipDTO from '@modules/friendships/dtos/ICreateFriendshipDTO';
import IFindOneByUserAndFriendDTO from '@modules/friendships/dtos/IFindOneByUserAndFriendDTO';

export default interface IFriendshipRepository {
  create: (data: ICreateFriendshipDTO) => Promise<Friendship>;
  findOneByUserAndFriend: (
    data: IFindOneByUserAndFriendDTO,
  ) => Promise<Friendship | null>;
  findManyByUserId: (user_id: string) => Promise<Friendship[]>;
}
