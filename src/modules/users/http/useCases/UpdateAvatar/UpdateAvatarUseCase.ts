import { injectable, inject } from 'tsyringe';
import { Users } from '@prisma/client';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';

import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import { exclude } from '@shared/prisma/client';
import AppError from '@shared/errors/AppError';

interface IRequest {
  user_id: string;
  avatar: string;
}

@injectable()
class UpdateAvatarUseCase {
  constructor(
    @inject('UsersRepository')
    private readonly usersRepository: IUsersRepository,

    @inject('StorageProvider')
    private readonly storageProvider: IStorageProvider,
  ) {}

  public async execute({
    avatar,
    user_id,
  }: IRequest): Promise<Omit<Users, 'password'>> {
    const user = await this.usersRepository.findOneById(user_id);

    if (!user) throw new AppError('user could not be found');

    if (user.avatar) {
      await this.storageProvider.deleteFile(user.avatar, 'avatars');
    }

    const fileName = await this.storageProvider.saveFile(avatar, 'avatars');

    user.avatar = fileName;

    await this.usersRepository.save(user);

    const userWithoutPassword = exclude(user, 'password');

    return userWithoutPassword;
  }
}

export default UpdateAvatarUseCase;
