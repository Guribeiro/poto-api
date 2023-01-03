import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeFriendshipRepository from '@modules/friendships/infra/repositories/fakes/FakeFriendshipRepository';
import FakeFriendshipRequestRepository from '@modules/friendships/infra/repositories/fakes/FakeFriendshipRequestRepository';

import CreateFriendshipRequestUseCase from './CreateFriendshipRequestUseCase';

let fakeFriendshipRequestRepository: FakeFriendshipRequestRepository;
let fakeFriendshipRepository: FakeFriendshipRepository;
let fakeUsersRepository: FakeUsersRepository;

let createFriendshipRequestUseCase: CreateFriendshipRequestUseCase;

describe('Create Friendship Request', () => {
  beforeEach(() => {
    fakeFriendshipRequestRepository = new FakeFriendshipRequestRepository();
    fakeFriendshipRepository = new FakeFriendshipRepository();
    fakeUsersRepository = new FakeUsersRepository();

    createFriendshipRequestUseCase = new CreateFriendshipRequestUseCase(
      fakeUsersRepository,
      fakeFriendshipRequestRepository,
      fakeFriendshipRepository,
    );
  });

  it('should be able to create a new friendship request', async () => {
    const requestee = await fakeUsersRepository.create({
      username: 'username',
      email: 'email@email.com',
      full_name: 'full name',
      avatar: 'avatar.jpg',
      password: 'password',
    });

    const requested = await fakeUsersRepository.create({
      username: 'username',
      email: 'email@email.com',
      full_name: 'full name',
      avatar: 'avatar.jpg',
      password: 'password',
    });

    const { friendshipRequest } = await createFriendshipRequestUseCase.execute({
      requestee_id: requestee.id,
      requested_id: requested.id,
    });

    expect(friendshipRequest).toHaveProperty('id');
  });

  it('should not be able to create a new friendship request from a non-existing requestee user', async () => {
    const requested = await fakeUsersRepository.create({
      username: 'username',
      email: 'email@email.com',
      full_name: 'full name',
      avatar: 'avatar.jpg',
      password: 'password',
    });

    await expect(
      createFriendshipRequestUseCase.execute({
        requestee_id: 'non-existing-user',
        requested_id: requested.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a new friendship request to a non-existing requested user', async () => {
    const requestee = await fakeUsersRepository.create({
      username: 'username',
      email: 'email@email.com',
      full_name: 'full name',
      avatar: 'avatar.jpg',
      password: 'password',
    });

    await expect(
      createFriendshipRequestUseCase.execute({
        requestee_id: requestee.id,
        requested_id: 'non-existing-user',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a new friendship request when users are friends already', async () => {
    const requestee = await fakeUsersRepository.create({
      username: 'username',
      email: 'email@email.com',
      full_name: 'full name',
      avatar: 'avatar.jpg',
      password: 'password',
    });

    const requested = await fakeUsersRepository.create({
      username: 'username',
      email: 'email@email.com',
      full_name: 'full name',
      avatar: 'avatar.jpg',
      password: 'password',
    });

    await fakeFriendshipRequestRepository.create({
      requestee_id: requestee.id,
      requested_id: requested.id,
    });

    await fakeFriendshipRepository.create({
      user_id: requestee.id,
      friend_id: requested.id,
    });

    await expect(
      createFriendshipRequestUseCase.execute({
        requestee_id: requestee.id,
        requested_id: requested.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to send a friend request to the requestee user', async () => {
    const requestee = await fakeUsersRepository.create({
      username: 'username',
      email: 'email@email.com',
      full_name: 'full name',
      avatar: 'avatar.jpg',
      password: 'password',
    });

    await expect(
      createFriendshipRequestUseCase.execute({
        requestee_id: requestee.id,
        requested_id: requestee.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to send more than one friend request to the same user', async () => {
    const requestee = await fakeUsersRepository.create({
      username: 'username',
      email: 'email@email.com',
      full_name: 'full name',
      avatar: 'avatar.jpg',
      password: 'password',
    });

    const requested = await fakeUsersRepository.create({
      username: 'username',
      email: 'email@email.com',
      full_name: 'full name',
      avatar: 'avatar.jpg',
      password: 'password',
    });

    await fakeFriendshipRequestRepository.create({
      requestee_id: requestee.id,
      requested_id: requested.id,
    });

    await expect(
      createFriendshipRequestUseCase.execute({
        requestee_id: requestee.id,
        requested_id: requestee.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
