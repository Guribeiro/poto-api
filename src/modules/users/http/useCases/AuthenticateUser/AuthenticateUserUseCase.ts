import { injectable, inject } from 'tsyringe';
import { Users } from '@prisma/client';
import IJsonWebTokenProvider from '../../../infra/providers/JsonwebtokenProvider/models/IJsonWebTokenProvider';
import IUsersRepository from '../../../infra/repositories/IUsersRepository';
import IUserTokensRepository from '../../../infra/repositories/IUserTokensRepository';

import { addDays } from 'date-fns';

import authConfig from '../../../../../config/auth';

import IHashProvider from '../../../infra/providers/HashProvider/models/IHashProvider';

interface Request {
  email: string;
  password: string;
}

interface Response {
  user: Users;
  token: string;
  refresh_token: string;
}

@injectable()
class AuthenticateUserUseCase {
  constructor(
    @inject('UsersRepository')
    private readonly usersRepository: IUsersRepository,

    @inject('UserTokensRepository')
    private readonly userTokensRepository: IUserTokensRepository,

    @inject('JsonWebTokenProvider')
    private readonly jsonwebtokenRepository: IJsonWebTokenProvider,

    @inject('BCryptHashProvider')
    private readonly hashProvider: IHashProvider,
  ) {}

  public async execute({ email, password }: Request): Promise<Response> {
    const user = await this.usersRepository.findOneByEmail(email);

    if (!user) {
      throw new Error('incorrect email/password');
    }

    const passwordMatch = this.hashProvider.compareHash(
      password,
      user.password,
    );

    if (!passwordMatch) {
      throw new Error('incorrect email/password');
    }

    const { secret, expiresIn } = authConfig.jwt;

    const token = this.jsonwebtokenRepository.sign({
      payload: {},
      secret,
      options: {
        expiresIn,
        subject: user.id,
      },
    });

    const { secret_refresh_token, expires_in_refresh_token } =
      authConfig.refresh_token;

    const refresh_token = this.jsonwebtokenRepository.sign({
      payload: {},
      secret: secret_refresh_token,
      options: {
        subject: user.id,
        expiresIn: expires_in_refresh_token,
      },
    });

    const refresh_token_expires_date = addDays(new Date(), 30);

    await this.userTokensRepository.create({
      user_id: user.id,
      refresh_token,
      expires_date: refresh_token_expires_date,
    });

    return {
      user,
      token,
      refresh_token,
    };
  }
}

export default AuthenticateUserUseCase;
