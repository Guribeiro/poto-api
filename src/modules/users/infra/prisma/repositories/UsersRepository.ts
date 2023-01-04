import { PrismaClient, Users } from '@prisma/client';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';

import prisma from '@shared/prisma/client';

class UsersRepository implements IUsersRepository {
  private readonly repository: PrismaClient;
  constructor() {
    this.repository = prisma;
  }

  public async create({
    full_name,
    email,
    password,
    avatar,
  }: ICreateUserDTO): Promise<Users> {
    const user = this.repository.users.create({
      data: {
        full_name,
        email,
        password,
        avatar,
      },
    });

    return await user;
  }

  public async save(user: Users): Promise<Users> {
    return await this.repository.users.update({
      where: {
        id: user.id,
      },
      data: user,
    });
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

  public async findOneByUsername(username: string): Promise<Users | null> {
    const user = await this.repository.users.findFirst({
      where: {
        username,
      },
    });

    return user;
  }
}

export default UsersRepository;
