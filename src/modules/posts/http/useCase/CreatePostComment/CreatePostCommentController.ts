import { Request, Response } from 'express';
import CreatePostCommentUseCase from './CreatePostCommentUseCase';
import { container } from 'tsyringe';

class CreatePostCommentController {
  public async handle(request: Request, response: Response): Promise<Response> {
    try {
      const { id } = request.user;
      const { content } = request.body;
      const { post_id } = request.params;

      const createPostComment = container.resolve(CreatePostCommentUseCase);

      const post = await createPostComment.execute({
        user_id: id,
        post_id,
        content,
      });

      return response.status(200).json(post);
    } catch (error) {
      return response.status(400).json({ error: true });
    }
  }
}

export default CreatePostCommentController;
