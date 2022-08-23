import { PrismaClient, Users } from '@prisma/client';
import IUsersRepository from '../../repositories/IUsersRepository';
import ICreateUserDTO from '../../../dtos/ICreateUserDTO';

class UsersRepositories implements IUsersRepository {
  private readonly repository: PrismaClient;
  constructor() {
    this.repository = new PrismaClient();
  }

  public async create({
    full_name,
    email,
    password,
    address: { cep, city, country, district, state, street, complement },
  }: ICreateUserDTO): Promise<Users> {
    const user = this.repository.users.create({
      data: {
        full_name,
        email,
        password,
        address: {
          create: {
            cep,
            city,
            country,
            district,
            state,
            street,
            complement,
          },
        },
      },
    });

    return await user;
  }

  public async findOneById(id: string): Promise<Users | null> {
    const user = await this.repository.users.findFirst({
      where: {
        id,
      },
    });

    return user;
  }

  public async findOneByEmail(email: string): Promise<Users | null> {
    const user = await this.repository.users.findFirst({
      where: {
        email,
      },
    });

    return user;
  }
}

export default UsersRepositories;
