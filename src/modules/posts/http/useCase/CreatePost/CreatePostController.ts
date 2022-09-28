import { Request, Response } from 'express';
import { container } from 'tsyringe';
import CreatePostUseCase from './CreatePostUseCase';

class CreatePostController {
  public async handle(request: Request, response: Response): Promise<Response> {
    try {
      const { id } = request.user;
      const { subtitle } = request.body;
      const { filename } = request.file as Express.Multer.File;

      const createPost = container.resolve(CreatePostUseCase);

      const post = await createPost.execute({
        user_id: id,
        subtitle,
        photo: filename,
      });

      return response.status(200).json(post);
    } catch (error) {
      const err = error as Error;
      return response.status(400).json({ error: err.message });
    }
  }
}

export default CreatePostController;
