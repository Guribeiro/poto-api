import { Users } from '@prisma/client';
import ICreateUserDTO from '../../dtos/ICreateUserDTO';

export default interface IUsersRepository {
  create: (data: ICreateUserDTO) => Promise<Users>;
  findOneById: (id: string) => Promise<Users | null>;
  findOneByEmail: (email: string) => Promise<Users | null>;
}
