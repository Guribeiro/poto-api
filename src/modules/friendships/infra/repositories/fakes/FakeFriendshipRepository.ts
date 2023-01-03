import { Friendship } from '@prisma/client';
import { randomUUID } from 'node:crypto';
import ICreateFriendshipDTO from '@modules/friendships/dtos/ICreateFriendshipDTO';
import IFindOneByUserAndFriendDTO from '@modules/friendships/dtos/IFindOneByUserAndFriendDTO';
import IFriendshipRepository from '../IFriendshipRepository';

class FakeFriendshipRepository implements IFriendshipRepository {
  private readonly friendships: Friendship[] = [];

  public async create({
    user_id,
    friend_id,
  }: ICreateFriendshipDTO): Promise<Friendship> {
    const friendship: Friendship = {
      id: randomUUID(),
      user_id,
      friend_id,
      created_at: new Date(),
      updated_at: new Date(),
    };

    this.friendships.push(friendship);

    return friendship;
  }

  public async findOneByUserAndFriend({
    friend_id,
    user_id,
  }: IFindOneByUserAndFriendDTO): Promise<Friendship | null> {
    return (
      this.friendships.find(
        friendship =>
          friendship.user_id === user_id && friendship.friend_id === friend_id,
      ) ?? null
    );
  }

  public async findManyByUserId(user_id: string): Promise<Friendship[]> {
    return this.friendships.filter(
      friendship =>
        friendship.user_id === user_id || friendship.friend_id === user_id,
    );
  }
}

export default FakeFriendshipRepository;
