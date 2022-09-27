import { Request, Response } from 'express';
import { container } from 'tsyringe';
import CheckEmailAvailableUseCase from './CheckEmailAvailableUseCase';

class CheckEmailAvailableController {
  public async handle(request: Request, response: Response): Promise<Response> {
    try {
      const { email } = request.body;

      const checkEmailAvailable = container.resolve(CheckEmailAvailableUseCase);

      await checkEmailAvailable.execute({
        email,
      });
      return response.status(204).send();
    } catch (error) {
      const err = error as Error;
      return response.status(406).json({ error: err.message });
    }
  }
}

export default CheckEmailAvailableController;
