import { Request, Response } from 'express';
import { container } from 'tsyringe';
import ListPostsUseCase from './ListPostsUseCase';

class ListPostsController {
  public async handle(request: Request, response: Response): Promise<Response> {
    try {
      const listPosts = container.resolve(ListPostsUseCase);

      const posts = await listPosts.execute();

      return response.status(200).json(posts);
    } catch (error) {
      const err = error as Error;
      return response.status(400).json({ error: err.message });
    }
  }
}

export default ListPostsController;
