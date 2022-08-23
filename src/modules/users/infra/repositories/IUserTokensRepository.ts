import { UserTokens } from '@prisma/client';
import ICreateUserTokenDTO from '../../dtos/ICreateUserTokenDTO';

export default interface IUserTokensRepository {
  create: (data: ICreateUserTokenDTO) => Promise<UserTokens>;
  findOneByUserIdAndToken: (
    user_id: string,
    token: string,
  ) => Promise<UserTokens | null>;
  deleteById: (id: string) => Promise<void>;
}
