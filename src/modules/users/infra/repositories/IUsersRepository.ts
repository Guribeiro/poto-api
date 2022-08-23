import User from "../prisma/entities/User"
import ICreateUserDTO from "../../dtos/ICreateUserDTO"

export default interface IUsersRepository {
  create(data: ICreateUserDTO):Promise<User>;
  findOneById(id: string):Promise<User | null>;
  findOneByEmail(email: string):Promise<User | null>;
}