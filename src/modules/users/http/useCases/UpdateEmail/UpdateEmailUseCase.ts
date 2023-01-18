import { Users } from '@prisma/client';
import { injectable, inject } from 'tsyringe';

import { UserMapper } from '../../mappers/UserMapper';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import AppError from '@shared/errors/AppError';

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
      throw new AppError('usuário não encontrado');
    }

    const userWithSameEmail = await this.usersRepository.findOneByEmail(email);

    if (userWithSameEmail && userWithSameEmail.id !== user_id) {
      throw new AppError('email já em uso por outro usuário');
    }

    user.email = email;

    await this.usersRepository.save(user);

    const userMapped = UserMapper.toDTO(user);

    return userMapped;
  }
}

export default UpdateEmailUseCase;
