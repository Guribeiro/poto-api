import { Request, Response } from 'express';
import { container } from 'tsyringe';
import RefuseFriendshipRequestUseCase from './RefuseFriendshipRequestUseCase';

class RefuseFriendshipRequestController {
  public async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;
    const { friendship_request_id } = request.params;

    const refuseFriendshipRequestUseCase = container.resolve(
      RefuseFriendshipRequestUseCase,
    );

    await refuseFriendshipRequestUseCase.execute({
      user_id: id,
      friendship_request_id,
    });

    return response.status(204).send();
  }
}

export default RefuseFriendshipRequestController;
