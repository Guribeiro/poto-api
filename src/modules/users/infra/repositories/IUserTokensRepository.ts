import {UserTokens} from '@prisma/client';
import ICreateUserTokenDTO from "../../dtos/ICreateUserTokenDTO"
import UserToken from "../prisma/entities/UserToken"

export default interface IUserTokensRepository {
  create(data: ICreateUserTokenDTO):Promise<UserTokens>
  findOneByUserIdAndToken(user_id: string, token: string):Promise<UserTokens | null>;
  deleteById(id: string):Promise<void>;
}