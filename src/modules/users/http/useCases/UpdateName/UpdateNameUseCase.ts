import { Users } from '@prisma/client';
import { injectable, inject } from 'tsyringe';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import { UserMapper } from '../../mappers/UserMapper';
import AppError from '@shared/errors/AppError';

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
      throw new AppError('user could not be found');
    }

    user.full_name = name;

    await this.usersRepository.save(user);

    const userMapped = UserMapper.toDTO(user);

    return userMapped;
  }
}

export default UpdateNameUseCase;
