import AppError from '@shared/errors/AppError';
import { injectable, inject } from 'tsyringe';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

interface Request {
  email: string;
}

@injectable()
class CheckEmailAvailableUseCase {
  constructor(
    @inject('UsersRepository')
    private readonly usersRepository: IUsersRepository,
  ) {}

  public async execute({ email }: Request): Promise<void> {
    const findUserWithSameEmail = await this.usersRepository.findOneByEmail(
      email,
    );

    if (findUserWithSameEmail) {
      throw new AppError('email is already been used');
    }
  }
}

export default CheckEmailAvailableUseCase;
