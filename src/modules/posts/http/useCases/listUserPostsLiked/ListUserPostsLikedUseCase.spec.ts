import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakePostLikesRepository from '@modules/posts/repositories/fakes/FakePostLikesRepository';
import FakePostRepository from '@modules/posts/repositories/fakes/FakePostRepository';

import ListUserPostsLikedUseCase from './ListUserPostsLikedUseCase';

let fakeUsersRepository: FakeUsersRepository;
let fakePostLikesRepository: FakePostLikesRepository;
let fakePostRepository: FakePostRepository;

let listUserPostsLikedUseCase: ListUserPostsLikedUseCase;

describe('List User Posts Liked', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakePostLikesRepository = new FakePostLikesRepository();

    fakePostRepository = new FakePostRepository();

    listUserPostsLikedUseCase = new ListUserPostsLikedUseCase(
      fakeUsersRepository,
      fakePostLikesRepository,
    );
  });

  it('should be able to list posts liked by the user', async () => {
    const postOwner = await fakeUsersRepository.create({
      username: 'username',
      email: 'email@email.com',
      full_name: 'full name',
      avatar: 'avatar.jpg',
      password: 'password',
    });

    const user = await fakeUsersRepository.create({
      username: 'username',
      email: 'email@email.com',
      full_name: 'full name',
      avatar: 'avatar.jpg',
      password: 'password',
    });

    const post = await fakePostRepository.create({
      user_id: postOwner.id,
      subtitle: 'subtitle',
      photo: 'photo.png',
      longitude: 12345678,
      latitude: 12345678,
    });

    const otherPost = await fakePostRepository.create({
      user_id: postOwner.id,
      subtitle: 'subtitle',
      photo: 'photo.png',
      longitude: 12345678,
      latitude: 12345678,
    });

    const firstLike = await fakePostLikesRepository.create({
      post_id: post.id,
      user_id: user.id,
    });

    const secondLike = await fakePostLikesRepository.create({
      post_id: otherPost.id,
      user_id: user.id,
    });

    const likes = await listUserPostsLikedUseCase.execute({
      user_id: user.id,
    });

    expect(likes).toEqual([firstLike, secondLike]);
  });

  it('should not be able to list likes from a non-existing user', async () => {
    await expect(
      listUserPostsLikedUseCase.execute({
        user_id: 'non-existing-user',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
