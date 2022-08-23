import { Request, Response } from 'express';
import { container } from 'tsyringe';
import RefreshTokenUserCase from "./RefreshTokenUseCase";


class RefreshTokenController {
  public async handle(request: Request, response: Response): Promise<Response> {
    try {
      const token =
        request.body.token ||
        request.headers['x-access-token'] ||
        request.query.token

      const refreshToken = container.resolve(RefreshTokenUserCase);

      const { refresh_token, updated_token } = await refreshToken.execute({
        token
      });

      return response.status(200).json({ refresh_token, updated_token })
    } catch (error) {
      const err = error as Error;
      return response.status(400).json({ error: err.message })
    }
  }
}

export default RefreshTokenController;