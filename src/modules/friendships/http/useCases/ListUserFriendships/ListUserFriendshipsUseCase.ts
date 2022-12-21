import { injectable, inject } from 'tsyringe';
import { Friendship } from '@prisma/client';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IFriendshipRepository from '@modules/friendships/infra/repositories/IFriendshipRepository';
import AppError from '@shared/errors/AppError';

interface ListUserFriendshipsUseCaseRequest {
  user_id: string;
}

interface ListUserFriendshipsUseCaseResponse {
  friendships: Friendship[];
}

@injectable()
class ListUserFriendshipsUseCase {
  constructor(
    @inject('UsersRepository')
    private readonly usersRepository: IUsersRepository,

    @inject('FriendshipRepository')
    private readonly friendshipRepository: IFriendshipRepository,
  ) {}

  public async execute({
    user_id,
  }: ListUserFriendshipsUseCaseRequest): Promise<ListUserFriendshipsUseCaseResponse> {
    const user = await this.usersRepository.findOneById(user_id);

    if (!user) {
      throw new AppError('usuário não encontrado');
    }

    const friendships = await this.friendshipRepository.findManyByUserId(
      user_id,
    );

    return {
      friendships,
    };
  }
}

export default ListUserFriendshipsUseCase;
