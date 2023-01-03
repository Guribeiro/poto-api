import { Request, Response } from 'express';
import { container } from 'tsyringe';
import ListPostsUseCase from './ListPostsUseCase';

class ListPostsController {
  public async handle(request: Request, response: Response): Promise<Response> {
    const { page, per_page } = request.query;

    const listPosts = container.resolve(ListPostsUseCase);

    const posts = await listPosts.execute({
      page: Number(page) || 0,
      take: Number(per_page) || 6,
    });

    return response.status(200).json(posts);
  }
}

export default ListPostsController;
