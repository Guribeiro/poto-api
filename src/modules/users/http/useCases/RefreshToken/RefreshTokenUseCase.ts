import { injectable, inject } from 'tsyringe';

import { verify } from 'jsonwebtoken';

import authConfig from '../../../../../config/auth';

import IUsersRepository from '../../../infra/repositories/IUsersRepository';
import IUserTokensRepository from '../../../infra/repositories/IUserTokensRepository';
import IJsonWebTokenProvider from '../../../infra/providers/JsonwebtokenProvider/models/IJsonWebTokenProvider';
import { addDays } from 'date-fns';

interface Request {
  token: string;
}

interface IPayload {
  sub: string;
}

interface Response {
  updated_token: string;
  refresh_token: string;
}

@injectable()
class RefreshTokenUserCase {
  constructor(
    @inject('UsersRepository')
    private readonly usersRepository: IUsersRepository,

    @inject('UserTokensRepository')
    private readonly userTokensRepository: IUserTokensRepository,

    @inject('JsonWebTokenProvider')
    private readonly jsonwebtokenRepository: IJsonWebTokenProvider,
  ) {}

  public async execute({ token }: Request): Promise<Response> {
    const { secret_refresh_token, expires_in_refresh_token } =
      authConfig.refresh_token;

    const decoded = verify(token, secret_refresh_token);

    const { sub } = decoded as unknown as IPayload;

    const user_id = sub;

    const user = await this.usersRepository.findOneById(user_id);

    if (!user) {
      throw new Error('invalid refresh_token');
    }

    const userToken = await this.userTokensRepository.findOneByUserIdAndToken(
      user_id,
      token,
    );

    if (!userToken) {
      throw new Error('invalid refresh_token');
    }

    await this.userTokensRepository.deleteById(userToken.id);

    const { secret, expiresIn } = authConfig.jwt;

    const updated_token = this.jsonwebtokenRepository.sign({
      payload: {},
      secret,
      options: {
        expiresIn,
        subject: user.id,
      },
    });

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
      refresh_token,
      updated_token,
    };
  }
}

export default RefreshTokenUserCase;
