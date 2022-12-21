import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import CheckUsernameAvailableUseCase from './CheckUsernameAvailableUseCase';

let fakeUsersRepository: FakeUsersRepository;
let checkUsernameAvailableUseCase: CheckUsernameAvailableUseCase;

describe('check username availability', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    checkUsernameAvailableUseCase = new CheckUsernameAvailableUseCase(
      fakeUsersRepository,
    );
  });

  it('should throw if username is already been used', async () => {
    const username = 'username';

    await fakeUsersRepository.create({
      username,
      email: 'email@email.com',
      full_name: 'full name',
      avatar: 'avatar.jpg',
      password: 'password',
    });

    await expect(
      checkUsernameAvailableUseCase.execute({ username }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
