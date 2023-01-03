import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakePostRepository from '@modules/posts/repositories/fakes/FakePostRepository';
import FakePostLikesRepository from '@modules/posts/repositories/fakes/FakePostLikesRepository';
import FakePostCommentsRepository from '@modules/posts/repositories/fakes/FakePostCommentsRepository';

import CreatePostLikeUseCase from './CreatePostLikeUseCase';

let fakeUsersRepository: FakeUsersRepository;
let fakePostRepository: FakePostRepository;
let fakePostLikesRepository: FakePostLikesRepository;
let fakePostCommentsRepository: FakePostCommentsRepository;

let createPostLikeUseCase: CreatePostLikeUseCase;

describe('Create Post Like', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakePostRepository = new FakePostRepository();
    fakePostLikesRepository = new FakePostLikesRepository();
    fakePostCommentsRepository = new FakePostCommentsRepository();

    createPostLikeUseCase = new CreatePostLikeUseCase(
      fakeUsersRepository,
      fakePostRepository,
      fakePostLikesRepository,
      fakePostCommentsRepository,
    );
  });

  it('should be able to create a like for a post', async () => {
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

    const post = await fakePostRepository.create({
      user_id: user.id,
      subtitle: 'subtitle',
      photo: 'photo.png',
      longitude: 12345678,
      latitude: 12345678,
    });

    const { likes } = await createPostLikeUseCase.execute({
      user_id: otherUser.id,
      post_id: post.id,
    });

    expect(likes[0]).toHaveProperty('id');
  });

  it('should not be able to create a like from a non-existing user', async () => {
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

    expect(
      createPostLikeUseCase.execute({
        post_id: post.id,
        user_id: 'non-existing-user',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a like to a non-existing post', async () => {
    const user = await fakeUsersRepository.create({
      username: 'username',
      email: 'email@email.com',
      full_name: 'full name',
      avatar: 'avatar.jpg',
      password: 'password',
    });

    expect(
      createPostLikeUseCase.execute({
        post_id: 'non-existing-post',
        user_id: user.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to unlike post instead of create a new like when the post is already liked by the user', async () => {
    const deleteLikeById = jest.spyOn(fakePostLikesRepository, 'deleteById');

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

    const like = await fakePostLikesRepository.create({
      user_id: user.id,
      post_id: post.id,
    });

    await createPostLikeUseCase.execute({
      user_id: user.id,
      post_id: post.id,
    });

    expect(deleteLikeById).toHaveBeenCalledWith(like.id);
  });
});
