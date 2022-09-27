import { Request, Response } from 'express';
import { container } from 'tsyringe';
import CheckUsernameAvailableUseCase from './CheckUsernameAvailableUseCase';

class CheckUsernameAvailableController {
  public async handle(request: Request, response: Response): Promise<Response> {
    try {
      const { username } = request.body;

      const checkUsernameAvailable = container.resolve(
        CheckUsernameAvailableUseCase,
      );

      await checkUsernameAvailable.execute({
        username,
      });
      return response.status(204).send();
    } catch (error) {
      const err = error as Error;
      return response.status(406).json({ error: err.message });
    }
  }
}

export default CheckUsernameAvailableController;
