import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListUserFeedUseCase from './ListUserFeedUseCase';

class ListUserFeedController {
  public async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.user;
    const { latitude, longitude, radius } = request.query;

    const latitudeAsNumber = Number(latitude);
    const longitudeAsNumber = Number(longitude);
    const radiusAsNumber = Number(radius);

    const listUserFeed = container.resolve(ListUserFeedUseCase);

    const feed = await listUserFeed.execute({
      user_id: id,
      latitude: latitudeAsNumber,
      longitude: longitudeAsNumber,
      radius: radiusAsNumber || 10,
    });

    return response.status(200).json(feed);
  }
}

export default ListUserFeedController;
