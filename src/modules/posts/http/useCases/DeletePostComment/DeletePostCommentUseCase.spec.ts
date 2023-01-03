import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakePostRepository from '@modules/posts/repositories/fakes/FakePostRepository';
import FakePostLikesRepository from '@modules/posts/repositories/fakes/FakePostLikesRepository';
import FakePostCommentsRepository from '@modules/posts/repositories/fakes/FakePostCommentsRepository';

import DeletePostCommentUseCase from './DeletePostCommentUseCase';

let fakeUsersRepository: FakeUsersRepository;
let fakePostRepository: FakePostRepository;
let fakePostLikesRepository: FakePostLikesRepository;
let fakePostCommentsRepository: FakePostCommentsRepository;

let deletePostCommentUseCase: DeletePostCommentUseCase;

const content = 'post comment content';

describe('Delete Post Comment', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakePostRepository = new FakePostRepository();
    fakePostLikesRepository = new FakePostLikesRepository();
    fakePostCommentsRepository = new FakePostCommentsRepository();

    deletePostCommentUseCase = new DeletePostCommentUseCase(
      fakeUsersRepository,
      fakePostRepository,
      fakePostCommentsRepository,
      fakePostLikesRepository,
    );
  });

  it('should be able to delete a post comment', async () => {
    const deleteOneById = jest.spyOn(
      fakePostCommentsRepository,
      'deleteOneById',
    );

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

    const comment = await fakePostCommentsRepository.create({
      user_id: otherUser.id,
      post_id: post.id,
      content,
    });

    await deletePostCommentUseCase.execute({
      user_id: otherUser.id,
      post_id: post.id,
      comment_id: comment.id,
    });

    expect(deleteOneById).toHaveBeenCalledWith(comment.id);
  });

  it('should not be able to delete a post comment if the owner post is invalid', async () => {
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

    const comment = await fakePostCommentsRepository.create({
      user_id: otherUser.id,
      post_id: post.id,
      content,
    });

    await expect(
      deletePostCommentUseCase.execute({
        user_id: 'invalid-post-owner-id',
        post_id: post.id,
        comment_id: comment.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to delete a post comment from a non-existing post', async () => {
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

    const comment = await fakePostCommentsRepository.create({
      user_id: otherUser.id,
      post_id: post.id,
      content,
    });

    await expect(
      deletePostCommentUseCase.execute({
        user_id: otherUser.id,
        post_id: 'invalid-post-id',
        comment_id: comment.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to delete a post comment when it does not exist', async () => {
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
      content,
    });

    await expect(
      deletePostCommentUseCase.execute({
        user_id: otherUser.id,
        post_id: post.id,
        comment_id: 'invalid-comment-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to delete a post comment when the user is not the comment owner', async () => {
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

    const comment = await fakePostCommentsRepository.create({
      user_id: otherUser.id,
      post_id: post.id,
      content,
    });

    await expect(
      deletePostCommentUseCase.execute({
        user_id: user.id,
        post_id: post.id,
        comment_id: comment.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
