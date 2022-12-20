import { injectable, inject } from 'tsyringe';

import IFriendshipRequestRepository from '@modules/friendships/infra/repositories/IFriendshipRequestRepository';
import IUsersRepository from '@modules/users/infra/repositories/IUsersRepository';
import AppError from '@shared/errors/AppError';
import IFriendshipRepository from '@modules/friendships/infra/repositories/IFriendshipRepository';

interface AcceptFriendshipRequestUseCaseRequest {
  friendship_request_id: string;
  requested_id: string;
}

@injectable()
class AcceptFriendshipRequestUseCase {
  constructor(
    @inject('UsersRepository')
    private readonly usersRepository: IUsersRepository,

    @inject('FriendshipRequestRepository')
    private readonly friendshipRequestRepository: IFriendshipRequestRepository,

    @inject('FriendshipRepository')
    private readonly friendshipRepository: IFriendshipRepository,
  ) {}

  public async execute({
    requested_id,
    friendship_request_id,
  }: AcceptFriendshipRequestUseCaseRequest): Promise<void> {
    const requested = await this.usersRepository.findOneById(requested_id);

    if (!requested) {
      throw new AppError('usuário não encontrado');
    }

    const friendship_request =
      await this.friendshipRequestRepository.findOneById(friendship_request_id);

    if (!friendship_request) {
      throw new AppError('solicitação de amizade não encontrada');
    }

    if (friendship_request.requested_id !== requested_id) {
      throw new AppError(
        'você não pode aprovar uma solicitação de amizade enviada por você mesmo',
      );
    }

    await this.friendshipRepository.create({
      user_id: requested_id,
      friend_id: friendship_request.requestee_id,
    });

    await this.friendshipRequestRepository.deleteById(friendship_request_id);
  }
}

export default AcceptFriendshipRequestUseCase;
