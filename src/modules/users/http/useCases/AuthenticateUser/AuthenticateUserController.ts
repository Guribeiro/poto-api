import { Request, Response } from 'express';
import {container} from 'tsyringe';
import AuthenticateUserUseCase from './AuthenticateUserUseCase';

class AuthenticateUserController {
  public async handle(request: Request, response: Response): Promise<Response> {
    try {

      const {email, password} = request.body;

      const authenticateUser = container.resolve(AuthenticateUserUseCase);

      const {user, token, refresh_token} = await authenticateUser.execute({
        email,
        password
      });


      return response.json({ user, token, refresh_token })
    } catch (error) {
      const err = error as Error;
      return response.json({ error: err.message })
    }
  }
}
export default AuthenticateUserController;