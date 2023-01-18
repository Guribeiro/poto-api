import { Request, Response } from 'express';
import { container } from 'tsyringe';
import ListFeedPostsUseCase from './ListFeedPostsUseCase';

class ListFeedPostsController {
  public async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;
    const { page, per_page, latitude, longitude, radius } = request.query;

    const latitudeAsNumber = Number(latitude);
    const longitudeAsNumber = Number(longitude);
    const radiusAsNumber = Number(radius);

    const listFeedPosts = container.resolve(ListFeedPostsUseCase);

    const posts = await listFeedPosts.execute({
      request: {
        user_id: id,
      },
      pagination: {
        page: Number(page) || 0,
        take: Number(per_page) || 6,
      },
      coordinates: {
        latitude: latitudeAsNumber,
        longitude: longitudeAsNumber,
        radius: radiusAsNumber || 10,
      },
    });

    return response.status(200).json(posts);
  }
}

export default ListFeedPostsController;
