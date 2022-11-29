import { Request, Response } from 'express';
import ShowUserUseCase from './ShowUserUseCase';
import { container } from 'tsyringe';

class ShowUserController {
  public async handle(request: Request, response: Response): Promise<Response> {
    try {
      const { id } = request.user;
      const { user_profile_id } = request.params;

      const showUser = container.resolve(ShowUserUseCase);

      const userProfile = await showUser.execute({
        user_id: id,
        user_profile_id,
      });

      return response.status(200).json(userProfile);
    } catch (error) {
      const err = error as Error;
      return response.status(400).json({ error: err.message });
    }
  }
}

export default ShowUserController;
