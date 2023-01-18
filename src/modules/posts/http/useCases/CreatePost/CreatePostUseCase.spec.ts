import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakePostRepository from '@modules/posts/repositories/fakes/FakePostRepository';
import CreatePostUseCase from './CreatePostUseCase';
import AppError from '@shared/errors/AppError';

let fakeUsersRepository: FakeUsersRepository;
let fakePostRepository: FakePostRepository;
let createPostUseCase: CreatePostUseCase;

describe('create post', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakePostRepository = new FakePostRepository();

    createPostUseCase = new CreatePostUseCase(
      fakeUsersRepository,
      fakePostRepository,
    );
  });

  it('should be able to create a new post', async () => {
    const user = await fakeUsersRepository.create({
      username: 'username',
      email: 'email@email.com',
      full_name: 'full name',
      avatar: 'avatar.jpg',
      password: 'password',
    });

    const post = await createPostUseCase.execute({
      user_id: user.id,
      subtitle: 'subtitle',
      photo: 'photo.png',
      longitude: 12345678,
      latitude: 12345678,
    });

    expect(post).toHaveProperty('id');
  });

  it('should not be able to create a post with a non existing user id', async () => {
    await expect(
      createPostUseCase.execute({
        user_id: 'non-existing-user-id',
        subtitle: 'subtitle',
        photo: 'photo.png',
        longitude: 12345678,
        latitude: 12345678,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create new post before interval of 24 hours', async () => {
    const user = await fakeUsersRepository.create({
      username: 'username',
      email: 'email@email.com',
      full_name: 'full name',
      avatar: 'avatar.jpg',
      password: 'password',
    });

    await fakePostRepository.create({
      user_id: user.id,
      subtitle: 'subtitle',
      photo: 'photo.png',
      longitude: 12345678,
      latitude: 12345678,
    });

    await expect(
      createPostUseCase.execute({
        user_id: user.id,
        subtitle: 'subtitle',
        photo: 'photo.png',
        longitude: 12345678,
        latitude: 12345678,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
