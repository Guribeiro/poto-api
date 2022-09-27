import { Request, Response } from 'express';
import { container } from 'tsyringe';
import CreateLikeUseCase from './CreateLikeUseCase';

class CreateLikeController {
  public async handle(request: Request, response: Response): Promise<Response> {
    try {
      const { id } = request.user;
      const { post_id } = request.params;

      const createLike = container.resolve(CreateLikeUseCase);

      const like = await createLike.execute({
        post_id,
        user_id: id,
      });

      return response.status(200).json(like);
    } catch (error) {
      const err = error as Error;
      return response.status(400).json({ error: err.message });
    }
  }
}

export default CreateLikeController;
