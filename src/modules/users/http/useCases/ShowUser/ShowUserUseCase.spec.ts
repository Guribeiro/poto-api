import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakePostRepository from '@modules/posts/repositories/fakes/FakePostRepository';
import ShowUserUseCase from './ShowUserUseCase';

import AppError from '@shared/errors/AppError';

let fakeUsersRepository: FakeUsersRepository;
let fakePostRepository: FakePostRepository;
let showUserUseCase: ShowUserUseCase;

describe('show user profile and posts', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakePostRepository = new FakePostRepository();
    showUserUseCase = new ShowUserUseCase(
      fakeUsersRepository,
      fakePostRepository,
    );
  });

  it('should be able to show user', async () => {
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
      photo: 'photo.jpg',
      longitude: 1111111,
      latitude: 1111111,
    });

    const userProfile = await showUserUseCase.execute({
      user_id: user.id,
      user_profile_id: user.id,
    });

    expect(userProfile).toHaveProperty('id');
  });

  it('shoud not be able to show user if not exist', async () => {
    const user = await fakeUsersRepository.create({
      username: 'username',
      email: 'email@email.com',
      full_name: 'full name',
      avatar: 'avatar.jpg',
      password: 'password',
    });

    await expect(
      showUserUseCase.execute({
        user_id: user.id,
        user_profile_id: 'non-existing-user',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('shoud not be able to show user if not allowed', async () => {
    const user = await fakeUsersRepository.create({
      username: 'username',
      email: 'email@email.com',
      full_name: 'full name',
      avatar: 'avatar.jpg',
      password: 'password',
    });

    await expect(
      showUserUseCase.execute({
        user_id: 'non-existing-user',
        user_profile_id: user.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
