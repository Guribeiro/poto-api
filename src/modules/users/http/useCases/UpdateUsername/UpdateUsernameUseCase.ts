import { Users } from '@prisma/client';
import { injectable, inject } from 'tsyringe';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import AppError from '@shared/errors/AppError';

interface Request {
  user_id: string;
  username: string;
}

@injectable()
class UpdateUsernameUseCase {
  constructor(
    @inject('UsersRepository')
    private readonly usersRepository: IUsersRepository,
  ) {}

  public async execute({ user_id, username }: Request): Promise<Users> {
    const user = await this.usersRepository.findOneById(user_id);

    if (!user) {
      throw new AppError('user could not be found');
    }

    const userWithSameUsername = await this.usersRepository.findOneByUsername(
      username,
    );

    if (userWithSameUsername && userWithSameUsername.id !== user_id) {
      throw new AppError('username has already been taken by another user');
    }

    user.username = username;

    await this.usersRepository.save(user);

    return user;
  }
}

export default UpdateUsernameUseCase;
