import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeFriendshipRequestRepository from '@modules/friendships/infra/repositories/fakes/FakeFriendshipRequestRepository';
import FakeFriendshipRepository from '@modules/friendships/infra/repositories/fakes/FakeFriendshipRepository';

import RefuseFriendshipRequestUseCase from './RefuseFriendshipRequestUseCase';

let fakeFriendshipRequestRepository: FakeFriendshipRequestRepository;
let fakeFriendshipRepository: FakeFriendshipRepository;
let fakeUsersRepository: FakeUsersRepository;

let refuseFriendshipRequestUseCase: RefuseFriendshipRequestUseCase;

describe('Refuse Friend Request', () => {
  beforeEach(() => {
    fakeFriendshipRequestRepository = new FakeFriendshipRequestRepository();
    fakeUsersRepository = new FakeUsersRepository();

    fakeFriendshipRepository = new FakeFriendshipRepository();

    refuseFriendshipRequestUseCase = new RefuseFriendshipRequestUseCase(
      fakeUsersRepository,
      fakeFriendshipRequestRepository,
    );
  });

  it('should be able to refuse a friend request', async () => {
    const deleteById = jest.spyOn(
      fakeFriendshipRequestRepository,
      'deleteById',
    );

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

    const friendshipRequest = await fakeFriendshipRequestRepository.create({
      requestee_id: requestee.id,
      requested_id: requested.id,
    });

    await refuseFriendshipRequestUseCase.execute({
      user_id: requested.id,
      friendship_request_id: friendshipRequest.id,
    });

    expect(deleteById).toHaveBeenCalledWith(friendshipRequest.id);
  });

  it('should not be able to refuse a friend request when the user could not be found', async () => {
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

    const friendshipRequest = await fakeFriendshipRequestRepository.create({
      requestee_id: requestee.id,
      requested_id: requested.id,
    });

    await expect(
      refuseFriendshipRequestUseCase.execute({
        user_id: 'invalid-user-id',
        friendship_request_id: friendshipRequest.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to refuse a friend request from a non-existing one', async () => {
    const requested = await fakeUsersRepository.create({
      username: 'username',
      email: 'email@email.com',
      full_name: 'full name',
      avatar: 'avatar.jpg',
      password: 'password',
    });

    await expect(
      refuseFriendshipRequestUseCase.execute({
        user_id: requested.id,
        friendship_request_id: 'invalid-friend-request-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
