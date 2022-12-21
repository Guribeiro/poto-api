import { injectable, inject } from 'tsyringe';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import AppError from '@shared/errors/AppError';

interface Request {
  username: string;
}

@injectable()
class CheckUsernameAvailableUseCase {
  constructor(
    @inject('UsersRepository')
    private readonly usersRepository: IUsersRepository,
  ) {}

  public async execute({ username }: Request): Promise<void> {
    const findUserWithSameEmail = await this.usersRepository.findOneByUsername(
      username,
    );

    if (findUserWithSameEmail) {
      throw new AppError('username is already been used');
    }
  }
}

export default CheckUsernameAvailableUseCase;
