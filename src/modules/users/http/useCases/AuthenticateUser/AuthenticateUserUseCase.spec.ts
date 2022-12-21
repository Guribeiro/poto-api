import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '@modules/users/repositories/fakes/FakeUserTokensRepository';
import FakeHashProvider from '@modules/users/infra/providers/HashProvider/fakes/FakeHashProvider';
import FakeJsonWebTokenProvider from '@modules/users/infra/providers/JsonwebtokenProvider/fakes/FakeJsonWebTokenProvider';
import AuthenticateUserUseCase from './AuthenticateUserUseCase';
import AppError from '@shared/errors/AppError';

let fakeHashProvider: FakeHashProvider;
let fakeUsersRepository: FakeUsersRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;
let fakeUserTokensRepository: FakeUserTokensRepository;
let fakeJsonWebTokenProvider: FakeJsonWebTokenProvider;

describe('authenticate user', () => {
  beforeEach(() => {
    fakeHashProvider = new FakeHashProvider();
    fakeUsersRepository = new FakeUsersRepository();
    fakeJsonWebTokenProvider = new FakeJsonWebTokenProvider();
    fakeUserTokensRepository = new FakeUserTokensRepository();

    authenticateUserUseCase = new AuthenticateUserUseCase(
      fakeUsersRepository,
      fakeUserTokensRepository,
      fakeJsonWebTokenProvider,
      fakeHashProvider,
    );
  });

  it('should be able to authenticate', async () => {
    const user = await fakeUsersRepository.create({
      username: 'username',
      email: 'email@email.com',
      full_name: 'full name',
      avatar: 'avatar.jpg',
      password: 'password',
    });

    const response = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password,
    });

    expect(response).toHaveProperty('token');
    expect(response).toHaveProperty('user');
    expect(response).toHaveProperty('refresh_token');
  });

  it('should not be able to authenticate with wrong email', async () => {
    const user = await fakeUsersRepository.create({
      username: 'username',
      email: 'email@email.com',
      full_name: 'full name',
      avatar: 'avatar.jpg',
      password: 'password',
    });

    await expect(
      authenticateUserUseCase.execute({
        email: 'wrong-email',
        password: user.password,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate with wrong password', async () => {
    const user = await fakeUsersRepository.create({
      username: 'username',
      email: 'email@email.com',
      full_name: 'full name',
      avatar: 'avatar.jpg',
      password: 'password',
    });

    await expect(
      authenticateUserUseCase.execute({
        email: user.email,
        password: 'wrong-password',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
