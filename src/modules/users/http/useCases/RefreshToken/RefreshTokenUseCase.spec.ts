import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeJsonWebTokenProvider from '@modules/users/infra/providers/JsonwebtokenProvider/fakes/FakeJsonWebTokenProvider';
import FakeUserTokensRepository from '@modules/users/repositories/fakes/FakeUserTokensRepository';
import RefreshTokenUserCase from './RefreshTokenUseCase';
import AuthenticateUserUseCase from '../AuthenticateUser/AuthenticateUserUseCase';

import authConfig from '@config/auth';
import FakeHashProvider from '@modules/users/infra/providers/HashProvider/fakes/FakeHashProvider';

let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let fakeJsonWebTokenProvider: FakeJsonWebTokenProvider;
let refreshTokenUserCase: RefreshTokenUserCase;
let fakeHashProvider: FakeHashProvider;
let authenticateUserUseCase: AuthenticateUserUseCase;

const { refresh_token } = authConfig;

describe('refresh authentication token', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeJsonWebTokenProvider = new FakeJsonWebTokenProvider();
    fakeUserTokensRepository = new FakeUserTokensRepository();
    fakeHashProvider = new FakeHashProvider();

    authenticateUserUseCase = new AuthenticateUserUseCase(
      fakeUsersRepository,
      fakeUserTokensRepository,
      fakeJsonWebTokenProvider,
      fakeHashProvider,
    );

    refreshTokenUserCase = new RefreshTokenUserCase(
      fakeUsersRepository,
      fakeUserTokensRepository,
      fakeJsonWebTokenProvider,
    );
  });

  it('should be able to refresh authentication token', async () => {
    const user = await fakeUsersRepository.create({
      username: 'username',
      email: 'email@email.com',
      full_name: 'full name',
      avatar: 'avatar.jpg',
      password: 'password',
    });

    const { refresh_token } = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password,
    });

    const response = await refreshTokenUserCase.execute({
      token: refresh_token,
    });

    expect(response).toHaveProperty('refresh_token');
    expect(response).toHaveProperty('updated_token');
  });
});
