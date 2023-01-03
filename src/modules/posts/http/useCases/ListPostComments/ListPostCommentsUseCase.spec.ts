import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakePostRepository from '@modules/posts/repositories/fakes/FakePostRepository';
import FakePostCommentsRepository from '@modules/posts/repositories/fakes/FakePostCommentsRepository';

import ListPostCommentsUseCase from './ListPostCommentsUseCase';

let fakeUsersRepository: FakeUsersRepository;
let fakePostRepository: FakePostRepository;
let fakePostCommentsRepository: FakePostCommentsRepository;

let listPostCommentsUseCase: ListPostCommentsUseCase;

describe('List Post Comments', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakePostRepository = new FakePostRepository();
    fakePostCommentsRepository = new FakePostCommentsRepository();

    listPostCommentsUseCase = new ListPostCommentsUseCase(
      fakeUsersRepository,
      fakePostRepository,
      fakePostCommentsRepository,
    );
  });

  it('should be able to list post comments', async () => {
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

    const firstComment = await fakePostCommentsRepository.create({
      user_id: otherUser.id,
      post_id: post.id,
      content: 'post comment content',
    });

    const secondComment = await fakePostCommentsRepository.create({
      user_id: otherUser.id,
      post_id: post.id,
      content: 'post comment content',
    });

    const comments = await listPostCommentsUseCase.execute({
      post_id: post.id,
      user_id: user.id,
    });

    expect(comments).toEqual([firstComment, secondComment]);
  });

  it('should not be able to list post comments if not authorized', async () => {
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

    await fakePostCommentsRepository.create({
      user_id: otherUser.id,
      post_id: post.id,
      content: 'post comment content',
    });

    await expect(
      listPostCommentsUseCase.execute({
        post_id: post.id,
        user_id: 'non-existing-user',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to list comments from a non-existing user', async () => {
    const user = await fakeUsersRepository.create({
      username: 'username',
      email: 'email@email.com',
      full_name: 'full name',
      avatar: 'avatar.jpg',
      password: 'password',
    });

    await expect(
      listPostCommentsUseCase.execute({
        user_id: user.id,
        post_id: 'non-existing-post-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
