import { Request, Response } from 'express';
import { container } from 'tsyringe';
import UpdateNameUseCase from './UpdateNameUseCase';

class UpdateNameController {
  public async handle(request: Request, response: Response): Promise<Response> {
    try {
      const { id } = request.user;
      const { name } = request.body;

      const updateName = container.resolve(UpdateNameUseCase);

      const user = await updateName.execute({
        user_id: id,
        name,
      });

      return response.json(user);
    } catch (error) {
      const err = error as Error;
      return response.status(400).json({ error: err.message });
    }
  }
}

export default UpdateNameController;
