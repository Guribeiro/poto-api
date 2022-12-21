import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import AppError from '@shared/errors/AppError';
import UpdateEmailUseCase from './UpdateEmailUseCase';

let fakeUsersRepository: FakeUsersRepository;
let updateEmailUseCase: UpdateEmailUseCase;

describe('Update user email', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    updateEmailUseCase = new UpdateEmailUseCase(fakeUsersRepository);
  });

  it('should be able to update email', async () => {
    const updatedEmail = 'updated@email.com';

    const user = await fakeUsersRepository.create({
      username: 'username',
      email: 'email@email.com',
      full_name: 'full name',
      avatar: 'avatar.jpg',
      password: 'password',
    });

    const updatedUser = await updateEmailUseCase.execute({
      user_id: user.id,
      email: updatedEmail,
    });

    expect(updatedUser.email).toBe(updatedEmail);
  });

  it('should not be able to update email from a non-existing user', async () => {
    const email = 'first@email.com';

    await expect(
      updateEmailUseCase.execute({
        user_id: 'non-existing-user-id',
        email,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update email to an email already in use', async () => {
    const email = 'first@email.com';

    await fakeUsersRepository.create({
      username: 'username',
      email: 'first@email.com',
      full_name: 'full name',
      avatar: 'avatar.jpg',
      password: 'password',
    });

    const user = await fakeUsersRepository.create({
      username: 'username',
      email: 'second@email.com',
      full_name: 'full name',
      avatar: 'avatar.jpg',
      password: 'password',
    });

    await expect(
      updateEmailUseCase.execute({
        user_id: user.id,
        email,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
