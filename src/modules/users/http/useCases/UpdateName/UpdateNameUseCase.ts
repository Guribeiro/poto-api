import { Users } from '@prisma/client';
import { injectable, inject } from 'tsyringe';

import IUsersRepository from '@modules/users/infra/repositories/IUsersRepository';
import { exclude } from '@shared/prisma';

interface Request {
  user_id: string;
  name: string;
}

@injectable()
class UpdateNameUseCase {
  constructor(
    @inject('UsersRepository')
    private readonly usersRepository: IUsersRepository,
  ) {}

  public async execute({
    user_id,
    name,
  }: Request): Promise<Omit<Users, 'password'>> {
    const user = await this.usersRepository.findOneById(user_id);

    if (!user) {
      throw new Error('user could not be found');
    }

    user.full_name = name;

    await this.usersRepository.save(user);

    const userWithoutPassword = exclude(user, 'password');

    return userWithoutPassword;
  }
}

export default UpdateNameUseCase;
