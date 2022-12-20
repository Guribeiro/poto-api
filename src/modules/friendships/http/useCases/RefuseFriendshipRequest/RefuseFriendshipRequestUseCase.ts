import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IUsersRepository from '@modules/users/infra/repositories/IUsersRepository';
import IFriendshipRequestRepository from '@modules/friendships/infra/repositories/IFriendshipRequestRepository';

interface RefuseFriendshipRequestUseCaseRequest {
  friendship_request_id: string;
  user_id: string;
}

@injectable()
class RefuseFriendshipRequestUseCase {
  constructor(
    @inject('UsersRepository')
    private readonly usersRepository: IUsersRepository,

    @inject('FriendshipRequestRepository')
    private readonly friendshipRequestRepository: IFriendshipRequestRepository,
  ) {}

  public async execute({
    user_id,
    friendship_request_id,
  }: RefuseFriendshipRequestUseCaseRequest): Promise<void> {
    const requested = await this.usersRepository.findOneById(user_id);

    if (!requested) {
      throw new AppError('usuário não encontrado');
    }

    const friendship_request =
      await this.friendshipRequestRepository.findOneById(friendship_request_id);

    if (!friendship_request) {
      throw new AppError('solicitação de amizade não encontrada');
    }

    await this.friendshipRequestRepository.deleteById(friendship_request_id);
  }
}

export default RefuseFriendshipRequestUseCase;
