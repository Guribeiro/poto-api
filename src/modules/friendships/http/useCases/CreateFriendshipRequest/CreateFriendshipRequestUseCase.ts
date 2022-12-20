import { injectable, inject } from 'tsyringe';
import IUsersRepository from '@modules/users/infra/repositories/IUsersRepository';
import IFriendshipRequestRepository from '@modules/friendships/infra/repositories/IFriendshipRequestRepository';
import { FriendshipRequest } from '@prisma/client';
import AppError from '@shared/errors/AppError';
import IFriendshipRepository from '@modules/friendships/infra/repositories/IFriendshipRepository';

interface CreateFriendshipRequestUseCaseRequest {
  requestee_id: string;
  requested_id: string;
}

interface CreateFriendshipRequestUseCaseResponse {
  friendshipRequest: FriendshipRequest;
}

@injectable()
class CreateFriendshipRequestUseCase {
  constructor(
    @inject('UsersRepository')
    private readonly usersRepository: IUsersRepository,

    @inject('FriendshipRequestRepository')
    private readonly friendshipRequestRepository: IFriendshipRequestRepository,

    @inject('FriendshipRepository')
    private readonly friendshipRepository: IFriendshipRepository,
  ) {}

  public async execute({
    requestee_id,
    requested_id,
  }: CreateFriendshipRequestUseCaseRequest): Promise<CreateFriendshipRequestUseCaseResponse> {
    if (requestee_id === requested_id) {
      throw new AppError(
        'você não pode enviar uma solicitação de amizade para você mesmo',
      );
    }

    const requestee = await this.usersRepository.findOneById(requestee_id);

    if (!requestee) {
      throw new AppError('usuário não encontrado');
    }

    const requested = await this.usersRepository.findOneById(requested_id);

    if (!requested) {
      throw new AppError('usuário não encontrado');
    }

    const friendshipAlreadyExists =
      await this.friendshipRepository.findOneByUserAndFriend({
        user_id: requestee_id,
        friend_id: requested_id,
      });

    console.log({ friendshipAlreadyExists });

    if (friendshipAlreadyExists) {
      throw new AppError('você já é amigo deste usuário');
    }

    const friendshipRequestAlreadyExists =
      await this.friendshipRequestRepository.findOneByRequesteeAndRequestedIds({
        requestee_id,
        requested_id,
      });

    if (friendshipRequestAlreadyExists) {
      throw new AppError('você já enviou uma solicitação para esse usuário');
    }

    const friendshipRequest = await this.friendshipRequestRepository.create({
      requestee_id,
      requested_id,
    });

    return {
      friendshipRequest,
    };
  }
}

export default CreateFriendshipRequestUseCase;
