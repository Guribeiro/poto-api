import { randomUUID } from 'node:crypto';
import ICreateUserTokenDTO from '@modules/users/dtos/ICreateUserTokenDTO';
import { UserTokens } from '@prisma/client';
import IUserTokensRepository from '../IUserTokensRepository';

class FakeUserTokensRepository implements IUserTokensRepository {
  private readonly userTokens: UserTokens[] = [];

  public async create({
    user_id,
    expires_date,
    refresh_token,
  }: ICreateUserTokenDTO): Promise<UserTokens> {
    const userToken: UserTokens = {
      id: randomUUID(),
      user_id,
      expires_date,
      refresh_token,
      created_at: new Date(),
    };

    this.userTokens.push(userToken);

    return userToken;
  }

  public async findOneByUserIdAndToken(
    user_id: string,
    token: string,
  ): Promise<UserTokens | null> {
    return (
      this.userTokens.find(
        userToken =>
          userToken.user_id === user_id && userToken.refresh_token === token,
      ) ?? null
    );
  }

  public async deleteById(id: string): Promise<void> {
    const findIndex = this.userTokens.findIndex(
      userToken => userToken.id === id,
    );

    this.userTokens.splice(findIndex, 1);
  }
}

export default FakeUserTokensRepository;
