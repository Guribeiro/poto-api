import { injectable, inject } from 'tsyringe';
import { Users } from '@prisma/client';
import IUsersRepository from '../../../infra/repositories/IUsersRepository';
import IStorageProvider from '../../../../../shared/container/providers/StorageProvider/models/IStorageProvider';
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

  public async execute({ avatar, user_id }: IRequest): Promise<Users> {
    const user = await this.usersRepository.findOneById(user_id);

    if (!user) throw new Error('user could not be found');

    if (user.avatar) {
      await this.storageProvider.deleteFile(user.avatar, 'avatars');
    }

    const fileName = await this.storageProvider.saveFile(avatar, 'avatars');

    user.avatar = fileName;

    await this.usersRepository.save(user);

    return user;
  }
}

export default UpdateAvatarUseCase;
