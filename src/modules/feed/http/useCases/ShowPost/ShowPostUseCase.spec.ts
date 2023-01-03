import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakePostRepository from '@modules/posts/repositories/fakes/FakePostRepository';
import FakePostCommentsRepository from '@modules/posts/repositories/fakes/FakePostCommentsRepository';
import FakePostLikesRepository from '@modules/posts/repositories/fakes/FakePostLikesRepository';

import ShowPostUseCase from './ShowPostUseCase';

let fakeUsersRepository: FakeUsersRepository;
let fakePostRepository: FakePostRepository;
let fakePostCommentsRepository: FakePostCommentsRepository;
let fakePostLikesRepository: FakePostLikesRepository;

let showPostUseCase: ShowPostUseCase;

describe('Show Post', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakePostRepository = new FakePostRepository();
    fakePostCommentsRepository = new FakePostCommentsRepository();
    fakePostLikesRepository = new FakePostLikesRepository();

    showPostUseCase = new ShowPostUseCase(
      fakeUsersRepository,
      fakePostRepository,
      fakePostLikesRepository,
      fakePostCommentsRepository,
    );
  });

  it('should be able to show post details', async () => {
    const user = await fakeUsersRepository.create({
      username: 'username',
      email: 'email@email.com',
      full_name: 'full name',
      avatar: 'avatar.jpg',
      password: 'password',
    });

    const post = await fakePostRepository.create({
      user_id: user.id,
      subtitle: 'subtitle',
      photo: 'photo.png',
      longitude: 12345678,
      latitude: 12345678,
    });

    const findPost = await showPostUseCase.execute({
      user_id: user.id,
      post_id: post.id,
    });

    expect(findPost).toHaveProperty('id');
    expect(findPost.id).toBe(post.id);
  });

  it('should not be able to show a post if the user is a non-existing one', async () => {
    const user = await fakeUsersRepository.create({
      username: 'username',
      email: 'email@email.com',
      full_name: 'full name',
      avatar: 'avatar.jpg',
      password: 'password',
    });

    const post = await fakePostRepository.create({
      user_id: user.id,
      subtitle: 'subtitle',
      photo: 'photo.png',
      longitude: 12345678,
      latitude: 12345678,
    });

    await expect(
      showPostUseCase.execute({
        user_id: 'non-existing-post-id',
        post_id: post.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to show a non-existing post', async () => {
    const user = await fakeUsersRepository.create({
      username: 'username',
      email: 'email@email.com',
      full_name: 'full name',
      avatar: 'avatar.jpg',
      password: 'password',
    });

    await expect(
      showPostUseCase.execute({
        user_id: user.id,
        post_id: 'non-existing-post-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
