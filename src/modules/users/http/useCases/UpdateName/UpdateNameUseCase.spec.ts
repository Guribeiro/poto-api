import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import AppError from '@shared/errors/AppError';
import UpdateNameUseCase from './UpdateNameUseCase';

let fakeUsersRepository: FakeUsersRepository;
let updateNameUseCase: UpdateNameUseCase;

describe('Update user name', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    updateNameUseCase = new UpdateNameUseCase(fakeUsersRepository);
  });

  it('should be able to update user name', async () => {
    const updatedName = 'new full name';

    const user = await fakeUsersRepository.create({
      username: 'username',
      email: 'email@email.com',
      full_name: 'full name',
      avatar: 'avatar.jpg',
      password: 'password',
    });

    const updatedUser = await updateNameUseCase.execute({
      user_id: user.id,
      name: updatedName,
    });

    expect(updatedUser.full_name).toBe(updatedName);
  });

  it('should not be able to update name from a non existing user', async () => {
    const updatedName = 'new full name';

    await expect(
      updateNameUseCase.execute({
        user_id: 'non-existing-user-id',
        name: updatedName,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
