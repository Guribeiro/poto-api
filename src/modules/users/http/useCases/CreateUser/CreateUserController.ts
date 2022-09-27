import { Request, Response } from 'express';
import { container } from 'tsyringe';
import CreateUserUseCase from './CreateUserUseCase';
import AuthenticateUserUseCase from '../AuthenticateUser/AuthenticateUserUseCase';

class CreateUserController {
  public async handle(request: Request, response: Response): Promise<Response> {
    try {
      const { full_name, email, username, password } = request.body;
      const { filename } = request.file as Express.Multer.File;

      const createUser = container.resolve(CreateUserUseCase);

      const authenticateUser = container.resolve(AuthenticateUserUseCase);

      await createUser.execute({
        full_name,
        email,
        username,
        password,
        avatar: filename,
      });

      const { user, token, refresh_token } = await authenticateUser.execute({
        email,
        password,
      });

      return response.json({ user, token, refresh_token });
    } catch (error) {
      const err = error as Error;
      return response.json({ error: err.message });
    }
  }
}

export default CreateUserController;
