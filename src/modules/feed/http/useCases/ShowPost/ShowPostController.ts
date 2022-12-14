import { Request, Response } from 'express';
import { container } from 'tsyringe';
import ShowPostUseCase from './ShowPostUseCase';

class ShowPostController {
  public async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;
    const { post_id } = request.params;

    const showPost = container.resolve(ShowPostUseCase);

    const post = await showPost.execute({
      user_id: id,
      post_id,
    });
    return response.status(200).json(post);
  }
}

export default ShowPostController;
