import { Request, Response } from 'express';
import { container } from 'tsyringe';
import UpdateUsernameUseCase from './UpdateUsernameUseCase';

class UpdateUsernameController {
  public async handle(request: Request, response: Response): Promise<Response> {
    try {
      const { id } = request.user;
      const { username } = request.body;

      const updateUsername = container.resolve(UpdateUsernameUseCase);

      const user = await updateUsername.execute({
        user_id: id,
        username,
      });

      return response.json(user);
    } catch (error) {
      const err = error as Error;
      return response.status(400).json({ error: err.message });
    }
  }
}

export default UpdateUsernameController;
