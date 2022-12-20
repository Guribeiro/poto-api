import { Request, Response } from 'express';
import { container } from 'tsyringe';
import CreateFriendshipRequestUseCase from './CreateFriendshipRequestUseCase';

class CreateFriendshipRequestController {
  public async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;
    const { requested_id } = request.body;

    const createFriendshipRequest = container.resolve(
      CreateFriendshipRequestUseCase,
    );

    const { friendshipRequest } = await createFriendshipRequest.execute({
      requestee_id: id,
      requested_id,
    });
    return response.status(200).json(friendshipRequest);
  }
}

export default CreateFriendshipRequestController;
