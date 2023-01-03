import AcceptFriendshipRequestUseCase from './AcceptFriendshipRequestUseCase';

import FakeFriendshipRequestRepository from '@modules/friendships/infra/repositories/fakes/FakeFriendshipRequestRepository';
import FakeFriendshipRepository from '@modules/friendships/infra/repositories/fakes/FakeFriendshipRepository';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';

import AppError from '@shared/errors/AppError';

let fakeFriendshipRequestRepository: FakeFriendshipRequestRepository;
let fakeFriendshipRepository: FakeFriendshipRepository;
let fakeUsersRepository: FakeUsersRepository;

let acceptFriendshipRequestUseCase: AcceptFriendshipRequestUseCase;

describe('Accept Friendship Request', () => {
  beforeEach(() => {
    fakeFriendshipRequestRepository = new FakeFriendshipRequestRepository();
    fakeFriendshipRepository = new FakeFriendshipRepository();
    fakeUsersRepository = new FakeUsersRepository();

    acceptFriendshipRequestUseCase = new AcceptFriendshipRequestUseCase(
      fakeUsersRepository,
      fakeFriendshipRequestRepository,
      fakeFriendshipRepository,
    );
  });

  it('should be able to accept a friendship request', async () => {
    const createFriendship = jest.spyOn(fakeFriendshipRepository, 'create');
    const deleteFriendshipRequest = jest.spyOn(
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

    await acceptFriendshipRequestUseCase.execute({
      friendship_request_id: friendshipRequest.id,
      requested_id: requested.id,
    });

    expect(createFriendship).toHaveBeenCalledWith({
      user_id: requested.id,
      friend_id: friendshipRequest.requestee_id,
    });
    expect(deleteFriendshipRequest).toHaveBeenCalledWith(friendshipRequest.id);
  });

  it('should not be able to accept a friendship request when requested user could not be found', async () => {
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
      acceptFriendshipRequestUseCase.execute({
        friendship_request_id: friendshipRequest.id,
        requested_id: 'invalid-requested-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to accept a non existing friendship request', async () => {
    const requested = await fakeUsersRepository.create({
      username: 'username',
      email: 'email@email.com',
      full_name: 'full name',
      avatar: 'avatar.jpg',
      password: 'password',
    });

    await expect(
      acceptFriendshipRequestUseCase.execute({
        friendship_request_id: 'invalid-friendship-request',
        requested_id: requested.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to accept a friendship request if user is not the requested one', async () => {
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

    const not_requested = await fakeUsersRepository.create({
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
      acceptFriendshipRequestUseCase.execute({
        friendship_request_id: friendshipRequest.id,
        requested_id: not_requested.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
