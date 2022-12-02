import { Request, Response } from 'express';
import { container } from 'tsyringe';
import ListFeedPostsUseCase from './ListFeedPostsUseCase';

class ListFeedPostsController {
  public async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;
    const { page, per_page } = request.query;

    const listFeedPosts = container.resolve(ListFeedPostsUseCase);

    const posts = await listFeedPosts.execute({
      user_id: id,
      page: Number(page) || 0,
      take: Number(per_page) || 6,
    });

    return response.status(200).json(posts);
  }
}

export default ListFeedPostsController;
