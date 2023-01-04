import { Request, Response } from 'express';
import { container } from 'tsyringe';
import CheckUsernameAvailableUseCase from './CheckUsernameAvailableUseCase';

class CheckUsernameAvailableController {
  public async handle(request: Request, response: Response): Promise<Response> {
    const { username } = request.body;

    const checkUsernameAvailable = container.resolve(
      CheckUsernameAvailableUseCase,
    );

    await checkUsernameAvailable.execute({
      username,
    });
    return response.status(204).send();
  }
}

export default CheckUsernameAvailableController;
