import { Users } from '@prisma/client';
import { injectable, inject } from 'tsyringe';
import IUsersRepository from '../../../infra/repositories/IUsersRepository';

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

  public async execute({ user_id, name }: Request): Promise<Users> {
    const user = await this.usersRepository.findOneById(user_id);

    if (!user) {
      throw new Error('user could not be found');
    }

    user.full_name = name;

    await this.usersRepository.save(user);

    return user;
  }
}

export default UpdateNameUseCase;
