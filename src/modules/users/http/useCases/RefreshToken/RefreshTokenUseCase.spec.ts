import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeJsonWebTokenProvider from '@modules/users/infra/providers/JsonwebtokenProvider/fakes/FakeJsonWebTokenProvider';
import FakeUserTokensRepository from '@modules/users/repositories/fakes/FakeUserTokensRepository';
import RefreshTokenUserCase from './RefreshTokenUseCase';
import AuthenticateUserUseCase from '../AuthenticateUser/AuthenticateUserUseCase';

import authConfig from '@config/auth';
import FakeHashProvider from '@modules/users/infra/providers/HashProvider/fakes/FakeHashProvider';
import { addDays } from 'date-fns';
import AppError from '@shared/errors/AppError';

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

    const { expires_in_refresh_token, secret_refresh_token } = refresh_token;

    const fake_refresh_token = fakeJsonWebTokenProvider.sign({
      payload: {},
      secret: secret_refresh_token,
      options: {
        subject: user.id,
        expiresIn: expires_in_refresh_token,
      },
    });

    const refresh_token_expires_date = addDays(new Date(), 30);

    await fakeUserTokensRepository.create({
      user_id: user.id,
      refresh_token: fake_refresh_token,
      expires_date: refresh_token_expires_date,
    });

    const { refresh_token: created_refresh_token } =
      await authenticateUserUseCase.execute({
        email: user.email,
        password: user.password,
      });

    const response = await refreshTokenUserCase.execute({
      token: created_refresh_token,
    });

    expect(response).toHaveProperty('refresh_token');
    expect(response).toHaveProperty('updated_token');
  });
});
