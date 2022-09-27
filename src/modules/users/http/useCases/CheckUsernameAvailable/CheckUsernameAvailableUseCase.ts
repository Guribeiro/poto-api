import { injectable, inject } from 'tsyringe';
import IUsersRepository from '../../../infra/repositories/IUsersRepository';

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
      throw new Error('username is already been used');
    }
  }
}

export default CheckUsernameAvailableUseCase;
