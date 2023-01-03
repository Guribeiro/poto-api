import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeFriendshipRepository from '@modules/friendships/infra/repositories/fakes/FakeFriendshipRepository';
import ListUserFriendshipsUseCase from './ListUserFriendshipsUseCase';

let fakeUsersRepository: FakeUsersRepository;
let fakeFriendshipRepository: FakeFriendshipRepository;

let listUserFriendshipsUseCase: ListUserFriendshipsUseCase;

describe('List User Friends', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeFriendshipRepository = new FakeFriendshipRepository();

    listUserFriendshipsUseCase = new ListUserFriendshipsUseCase(
      fakeUsersRepository,
      fakeFriendshipRepository,
    );
  });

  it('should be able to list user friends', async () => {
    const user = await fakeUsersRepository.create({
      username: 'username',
      email: 'email@email.com',
      full_name: 'full name',
      avatar: 'avatar.jpg',
      password: 'password',
    });

    const firstUser = await fakeUsersRepository.create({
      username: 'username',
      email: 'email@email.com',
      full_name: 'full name',
      avatar: 'avatar.jpg',
      password: 'password',
    });

    const secondUser = await fakeUsersRepository.create({
      username: 'username',
      email: 'email@email.com',
      full_name: 'full name',
      avatar: 'avatar.jpg',
      password: 'password',
    });

    const thirdUser = await fakeUsersRepository.create({
      username: 'username',
      email: 'email@email.com',
      full_name: 'full name',
      avatar: 'avatar.jpg',
      password: 'password',
    });

    await fakeUsersRepository.create({
      username: 'username',
      email: 'email@email.com',
      full_name: 'full name',
      avatar: 'avatar.jpg',
      password: 'password',
    });

    const firstFriend = await fakeFriendshipRepository.create({
      user_id: user.id,
      friend_id: firstUser.id,
    });

    const secondFriend = await fakeFriendshipRepository.create({
      user_id: user.id,
      friend_id: secondUser.id,
    });

    const thirdFriend = await fakeFriendshipRepository.create({
      user_id: user.id,
      friend_id: thirdUser.id,
    });

    const { friendships } = await listUserFriendshipsUseCase.execute({
      user_id: user.id,
    });

    expect(friendships).toEqual([firstFriend, secondFriend, thirdFriend]);
    expect(firstFriend.friend_id).toBe(firstUser.id);
    expect(secondFriend.friend_id).toBe(secondUser.id);
    expect(thirdFriend.friend_id).toBe(thirdUser.id);
  });

  it('should not be able to list friends from a non-existing user', async () => {
    await expect(
      listUserFriendshipsUseCase.execute({
        user_id: 'non-existing-user-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
