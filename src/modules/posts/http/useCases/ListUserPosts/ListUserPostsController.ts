import { Request, Response } from 'express';
import { container } from 'tsyringe';
import ListUserPostsUseCase from './ListUserPostsUseCase';

class ListUserPostsController {
  public async handle(request: Request, response: Response): Promise<Response> {
    try {
      const { id } = request.user;
      const listUserPosts = container.resolve(ListUserPostsUseCase);

      const posts = await listUserPosts.execute({
        user_id: id,
      });

      return response.status(200).json(posts);
    } catch (error) {
      const err = error as Error;
      return response.status(400).json({ error: err.message });
    }
  }
}

export default ListUserPostsController;
