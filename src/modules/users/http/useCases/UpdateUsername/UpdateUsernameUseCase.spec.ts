import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import AppError from '@shared/errors/AppError';
import UpdateUsernameUseCase from './UpdateUsernameUseCase';

let fakeUsersRepository: FakeUsersRepository;
let updateUsernameUseCase: UpdateUsernameUseCase;

describe('Update user username', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    updateUsernameUseCase = new UpdateUsernameUseCase(fakeUsersRepository);
  });

  it('should be able to update username', async () => {
    const username = 'newusername';

    const user = await fakeUsersRepository.create({
      username: 'username',
      email: 'email@email.com',
      full_name: 'full name',
      avatar: 'avatar.jpg',
      password: 'password',
    });

    const updatedUser = await updateUsernameUseCase.execute({
      user_id: user.id,
      username,
    });

    expect(updatedUser.username).toBe(username);
  });

  it('should not be able to update username to an already in use one', async () => {
    const username = 'newusername';

    await fakeUsersRepository.create({
      username,
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

    await expect(
      updateUsernameUseCase.execute({
        user_id: user.id,
        username,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update username from a non-existing user', async () => {
    const username = 'newusername';

    await expect(
      updateUsernameUseCase.execute({
        user_id: 'non-existing-user-id',
        username,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
