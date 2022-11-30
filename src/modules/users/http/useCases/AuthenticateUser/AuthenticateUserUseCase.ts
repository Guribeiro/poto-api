import { injectable, inject } from 'tsyringe';
import { Users } from '@prisma/client';
import { addDays } from 'date-fns';

import IUsersRepository from '../../../infra/repositories/IUsersRepository';
import IUserTokensRepository from '../../../infra/repositories/IUserTokensRepository';
import IHashProvider from '../../../infra/providers/HashProvider/models/IHashProvider';
import IJsonWebTokenProvider from '../../../infra/providers/JsonwebtokenProvider/models/IJsonWebTokenProvider';

import AppError from '../../../../../shared/errors/AppError';
import { exclude } from '../../../../../shared/prisma';

import authConfig from '../../../../../config/auth';

interface Request {
  email: string;
  password: string;
}

interface Response {
  user: Omit<Users, 'password'>;
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
    private readonly jsonwebtokenProvider: IJsonWebTokenProvider,

    @inject('BCryptHashProvider')
    private readonly hashProvider: IHashProvider,
  ) {}

  public async execute({ email, password }: Request): Promise<Response> {
    const user = await this.usersRepository.findOneByEmail(email);

    if (!user) {
      throw new AppError('incorrect email/password', 401);
    }

    const passwordMatch = await this.hashProvider.compareHash(
      password,
      user.password,
    );

    if (!passwordMatch) {
      throw new AppError('incorrect email/password', 401);
    }

    const { secret, expiresIn } = authConfig.jwt;

    const token = this.jsonwebtokenProvider.sign({
      payload: {},
      secret,
      options: {
        expiresIn,
        subject: user.id,
      },
    });

    const { secret_refresh_token, expires_in_refresh_token } =
      authConfig.refresh_token;

    const refresh_token = this.jsonwebtokenProvider.sign({
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

    const userWithoutPassword = exclude(user, 'password');

    return {
      user: userWithoutPassword,
      token,
      refresh_token,
    };
  }
}

export default AuthenticateUserUseCase;
