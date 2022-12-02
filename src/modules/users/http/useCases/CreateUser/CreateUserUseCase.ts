import { injectable, inject } from 'tsyringe';

import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import IUsersRepository from '@modules/users/infra/repositories/IUsersRepository';
import IHashProvider from '@modules/users/infra/providers/HashProvider/models/IHashProvider';

import { Users } from '@prisma/client';
import { exclude } from '@shared/prisma';

interface Request extends ICreateUserDTO {}

@injectable()
class CreateUserUseCase {
  constructor(
    @inject('UsersRepository')
    private readonly usersRepository: IUsersRepository,

    @inject('BCryptHashProvider')
    private readonly hashProvider: IHashProvider,
  ) {}

  public async execute({
    full_name,
    email,
    username,
    password,
    avatar,
  }: Request): Promise<Omit<Users, 'password'>> {
    const findUserWithSameEmail = await this.usersRepository.findOneByEmail(
      email,
    );

    if (findUserWithSameEmail) {
      throw new Error('email has already been taken');
    }

    const hashedPassword = await this.hashProvider.generateHash(password);

    const user = await this.usersRepository.create({
      full_name,
      email,
      username,
      password: hashedPassword,
      avatar,
    });

    const userWithoutPassword = exclude(user, 'password');

    return userWithoutPassword;
  }
}

export default CreateUserUseCase;
