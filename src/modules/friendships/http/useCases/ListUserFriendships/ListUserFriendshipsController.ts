import { Request, Response } from 'express';
import { container } from 'tsyringe';
import ListUserFriendshipsUseCase from './ListUserFriendshipsUseCase';

class ListUserFriendshipsController {
  public async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;

    const listUserFriendshipsUseCase = container.resolve(
      ListUserFriendshipsUseCase,
    );

    const { friendships } = await listUserFriendshipsUseCase.execute({
      user_id: id,
    });
    return response.status(200).json(friendships);
  }
}

export default ListUserFriendshipsController;
