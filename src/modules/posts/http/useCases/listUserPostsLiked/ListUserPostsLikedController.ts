import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListUserPostsLikedUseCase from './ListUserPostsLikedUseCase';

class ListUserPostsLikedController {
  public async handle(request: Request, response: Response): Promise<Response> {
    try {
      const { id } = request.user;

      const listUserPostsLiked = container.resolve(ListUserPostsLikedUseCase);

      const userLikes = await listUserPostsLiked.execute({
        user_id: id,
      });

      return response.status(200).json(userLikes);
    } catch (error) {
      const err = error as Error;
      return response.status(400).json({ error: err.message });
    }
  }
}

export default ListUserPostsLikedController;
