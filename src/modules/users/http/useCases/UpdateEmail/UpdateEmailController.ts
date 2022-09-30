import { Request, Response } from 'express';
import { container } from 'tsyringe';
import UpdateEmailUseCase from './UpdateEmailUseCase';

class UpdateEmailController {
  public async handle(request: Request, response: Response): Promise<Response> {
    try {
      const { id } = request.user;
      const { email } = request.body;

      const updateEmail = container.resolve(UpdateEmailUseCase);

      const user = await updateEmail.execute({
        user_id: id,
        email,
      });

      return response.json(user);
    } catch (error) {
      const err = error as Error;
      return response.status(400).json({ error: err.message });
    }
  }
}

export default UpdateEmailController;
