import { Request, Response } from 'express';
import { container } from 'tsyringe';
import CreateUserUseCase from './CreateUserUseCase';

class CreateUserController {
  public async handle(request: Request, response: Response): Promise<Response> {
    try {
      const { full_name, email, password, address } = request.body;

      const createUser = container.resolve(CreateUserUseCase);

      const user = await createUser.execute({
        full_name,
        email,
        password,
        address,
      });

      return response.json(user);
    } catch (error) {
      const err = error as Error;
      return response.json({ error: err.message });
    }
  }
}

export default CreateUserController;
