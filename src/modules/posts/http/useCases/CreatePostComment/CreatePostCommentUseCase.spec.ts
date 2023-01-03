import AppError from '@shared/errors/AppError';
import CreatePostCommentUseCase from './CreatePostCommentUseCase';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakePostRepository from '@modules/posts/repositories/fakes/FakePostRepository';
import FakePostLikesRepository from '@modules/posts/repositories/fakes/FakePostLikesRepository';
import FakePostCommentsRepository from '@modules/posts/repositories/fakes/FakePostCommentsRepository';

let fakeUsersRepository: FakeUsersRepository;
let fakePostRepository: FakePostRepository;
let fakePostLikesRepository: FakePostLikesRepository;
let fakePostCommentsRepository: FakePostCommentsRepository;
let createPostCommentUseCase: CreatePostCommentUseCase;

describe('Create Post Comment', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakePostRepository = new FakePostRepository();
    fakePostLikesRepository = new FakePostLikesRepository();
    fakePostCommentsRepository = new FakePostCommentsRepository();

    createPostCommentUseCase = new CreatePostCommentUseCase(
      fakeUsersRepository,
      fakePostRepository,
      fakePostCommentsRepository,
      fakePostLikesRepository,
    );
  });

  it('should be able to create a comment to a post', async () => {
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

    const { comments } = await createPostCommentUseCase.execute({
      user_id: otherUser.id,
      post_id: post.id,
      content: 'some content',
    });

    expect(comments[0]).toHaveProperty('id');
  });

  it('should not be able to create a comment when user does not exist', async () => {
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
      createPostCommentUseCase.execute({
        user_id: 'non-existing-user',
        post_id: post.id,
        content: 'some content',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a comment to a non existing post', async () => {
    const user = await fakeUsersRepository.create({
      username: 'username',
      email: 'email@email.com',
      full_name: 'full name',
      avatar: 'avatar.jpg',
      password: 'password',
    });

    await expect(
      createPostCommentUseCase.execute({
        user_id: user.id,
        post_id: 'non-existing-post',
        content: 'some content',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
