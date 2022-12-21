import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import CheckEmailAvailableUseCase from './CheckEmailAvailableUseCase';

let fakeUsersRepository: FakeUsersRepository;
let checkEmailAvailableUseCase: CheckEmailAvailableUseCase;

describe('check email availability', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    checkEmailAvailableUseCase = new CheckEmailAvailableUseCase(
      fakeUsersRepository,
    );
  });

  it('should throw if email is already been used', async () => {
    const email = 'email@email.com';

    await fakeUsersRepository.create({
      email,
      username: 'username',
      full_name: 'full name',
      avatar: 'avatar.jpg',
      password: 'password',
    });

    await expect(
      checkEmailAvailableUseCase.execute({ email }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
