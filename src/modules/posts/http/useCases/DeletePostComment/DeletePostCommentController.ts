import { Request, Response } from 'express';
import { container } from 'tsyringe';
import DeletePostCommentUseCase from './DeletePostCommentUseCase';

class DeletePostCommentController {
  public async handle(request: Request, response: Response): Promise<Response> {
    try {
      const { id } = request.user;
      const { post_id, comment_id } = request.params;

      const deletePostComment = container.resolve(DeletePostCommentUseCase);

      const comment = await deletePostComment.execute({
        user_id: id,
        comment_id,
        post_id,
      });

      return response.status(200).json(comment);
    } catch (error) {
      const err = error as Error;
      return response.status(400).json({ error: err.message });
    }
  }
}

export default DeletePostCommentController;
