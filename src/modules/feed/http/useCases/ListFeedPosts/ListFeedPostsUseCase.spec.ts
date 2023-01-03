import AppError from '@shared/errors/AppError';

import FakePostRepository from '@modules/posts/repositories/fakes/FakePostRepository';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';

import ListFeedPostsUseCase from './ListFeedPostsUseCase';

let fakePostRepository: FakePostRepository;
let fakeUsersRepository: FakeUsersRepository;

let listFeedPostsUseCase: ListFeedPostsUseCase;

describe('List Feed Posts', () => {
  beforeEach(() => {
    fakePostRepository = new FakePostRepository();
    fakeUsersRepository = new FakeUsersRepository();

    listFeedPostsUseCase = new ListFeedPostsUseCase(
      fakeUsersRepository,
      fakePostRepository,
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

    const feed = await listFeedPostsUseCase.execute({
      user_id: user.id,
      page: 1,
      take: 6,
    });

    expect(feed).toEqual([firstPost, secondPost, thirdPost]);
  });

  it('should not be able to list feed posts from a non-existing user', async () => {
    await expect(
      listFeedPostsUseCase.execute({
        user_id: 'non-existing-user',
        page: 1,
        take: 6,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
