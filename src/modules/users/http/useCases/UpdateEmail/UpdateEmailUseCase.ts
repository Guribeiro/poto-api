import { Users } from '@prisma/client';
import { injectable, inject } from 'tsyringe';
import { exclude } from '../../../../../shared/prisma';
import IUsersRepository from '../../../infra/repositories/IUsersRepository';

interface Request {
  user_id: string;
  email: string;
}

@injectable()
class UpdateEmailUseCase {
  constructor(
    @inject('UsersRepository')
    private readonly usersRepository: IUsersRepository,
  ) {}

  public async execute({
    user_id,
    email,
  }: Request): Promise<Omit<Users, 'password'>> {
    const user = await this.usersRepository.findOneById(user_id);

    if (!user) {
      throw new Error('user could not be found');
    }

    const userWithSameEmail = await this.usersRepository.findOneByEmail(email);

    if (userWithSameEmail && userWithSameEmail.id !== user_id) {
      throw new Error('email has already been taken by another user');
    }

    user.email = email;

    await this.usersRepository.save(user);

    const userWithoutPassword = exclude(user, 'password');

    return userWithoutPassword;
  }
}

export default UpdateEmailUseCase;
