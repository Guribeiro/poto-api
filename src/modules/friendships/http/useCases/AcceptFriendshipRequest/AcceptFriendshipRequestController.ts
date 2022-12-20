import { Request, Response } from 'express';
import { container } from 'tsyringe';

import AcceptFriendshipRequestUseCase from './AcceptFriendshipRequestUseCase';

class AcceptFriendshipRequestController {
  public async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;
    const { friendship_request_id } = request.params;

    const acceptFriendshipRequestUseCase = container.resolve(
      AcceptFriendshipRequestUseCase,
    );

    await acceptFriendshipRequestUseCase.execute({
      requested_id: id,
      friendship_request_id,
    });

    return response.status(204).send();
  }
}

export default AcceptFriendshipRequestController;
