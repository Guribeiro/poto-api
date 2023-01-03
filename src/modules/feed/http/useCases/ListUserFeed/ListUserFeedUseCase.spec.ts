import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakePostRepository from '@modules/posts/repositories/fakes/FakePostRepository';
import FakePostCommentsRepository from '@modules/posts/repositories/fakes/FakePostCommentsRepository';
import FakePostLikesRepository from '@modules/posts/repositories/fakes/FakePostLikesRepository';

import ListUserFeedUseCase from './ListUserFeedUseCase';

let fakeUsersRepository: FakeUsersRepository;
let fakePostRepository: FakePostRepository;
let fakePostCommentsRepository: FakePostCommentsRepository;
let fakePostLikesRepository: FakePostLikesRepository;

let listUserFeedUseCase: ListUserFeedUseCase;

describe('List User Feed ', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakePostRepository = new FakePostRepository();
    fakePostCommentsRepository = new FakePostCommentsRepository();
    fakePostLikesRepository = new FakePostLikesRepository();

    listUserFeedUseCase = new ListUserFeedUseCase(
      fakeUsersRepository,
      fakePostRepository,
      fakePostLikesRepository,
      fakePostCommentsRepository,
    );
  });

  it('should be able to list user feed', async () => {
    const user = await fakeUsersRepository.create({
      username: 'username',
      email: 'email@email.com',
      full_name: 'full name',
      avatar: 'avatar.jpg',
      password: 'password',
    });

    const otherUser = await fakeUsersRepository.create({
      username: 'username',
      email: 'email@email.com',
      full_name: 'full name',
      avatar: 'avatar.jpg',
      password: 'password',
    });

    const firstPost = await fakePostRepository.create({
      user_id: user.id,
      subtitle: 'subtitle',
      photo: 'photo.png',
      longitude: 12345678,
      latitude: 12345678,
    });

    const secondPost = await fakePostRepository.create({
      user_id: otherUser.id,
      subtitle: 'subtitle',
      photo: 'photo.png',
      longitude: 12345678,
      latitude: 12345678,
    });

    const thirdPost = await fakePostRepository.create({
      user_id: otherUser.id,
      subtitle: 'subtitle',
      photo: 'photo.png',
      longitude: 12345678,
      latitude: 12345678,
    });

    const posts = await listUserFeedUseCase.execute({
      longitude: 12345678,
      latitude: 12345678,
      radius: 10,
      user_id: user.id,
    });

    expect(posts).toEqual([firstPost, secondPost, thirdPost]);
  });

  it('should not be able to list feed from non-existing user', async () => {
    await expect(
      listUserFeedUseCase.execute({
        longitude: 12345678,
        latitude: 12345678,
        radius: 10,
        user_id: 'non-existing-user-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
