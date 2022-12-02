import { PrismaClient, UserTokens } from '@prisma/client';
import prisma from '@shared/prisma';

import IUserTokensRepository from '@modules/users/infra/repositories/IUserTokensRepository';
import ICreateUserTokenDTO from '@modules/users/dtos/ICreateUserTokenDTO';

class UserTokensRepository implements IUserTokensRepository {
  private readonly repository: PrismaClient;

  constructor() {
    this.repository = prisma;
  }

  public async create({
    user_id,
    refresh_token,
    expires_date,
  }: ICreateUserTokenDTO): Promise<UserTokens> {
    const userToken = await this.repository.userTokens.create({
      data: {
        user_id,
        refresh_token,
        expires_date,
      },
    });

    return userToken;
  }

  public async findOneByUserIdAndToken(
    user_id: string,
    token: string,
  ): Promise<UserTokens | null> {
    const userToken = await this.repository.userTokens.findFirst({
      where: {
        user_id,
        refresh_token: token,
      },
    });

    return userToken;
  }

  public async deleteById(id: string): Promise<void> {
    await this.repository.userTokens.delete({
      where: {
        id,
      },
    });
  }
}

export default UserTokensRepository;
