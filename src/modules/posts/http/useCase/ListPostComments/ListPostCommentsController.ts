import { Request, Response } from 'express';
import { container } from 'tsyringe';
import ListPostCommentsUseCase from './ListPostCommentsUseCase';

class ListPostCommentsController {
  public async handle(request: Request, response: Response): Promise<Response> {
    try {
      const { id } = request.user;
      const { post_id } = request.params;

      const listPostComments = container.resolve(ListPostCommentsUseCase);

      const comments = await listPostComments.execute({
        user_id: id,
        post_id,
      });

      return response.status(200).json(comments);
    } catch (error) {
      const err = error as Error;
      return response.status(400).json({ error: err.message });
    }
  }
}

export default ListPostCommentsController;
