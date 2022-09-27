import { injectable, inject } from 'tsyringe';
import { Users } from '@prisma/client';
import ICreateUserDTO from '../../../dtos/ICreateUserDTO';
import IUsersRepository from '../../../infra/repositories/IUsersRepository';
import IHashProvider from '../../../infra/providers/HashProvider/models/IHashProvider';

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
  }: Request): Promise<Users> {
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

    return user;
  }
}

export default CreateUserUseCase;
