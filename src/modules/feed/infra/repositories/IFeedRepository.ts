import { Posts } from '@prisma/client';

export interface IListFeedDTO {
  latitude: number;
  longitude: number;
  radius: number;
}

export default interface IFeedRepository {
  list: (data: IListFeedDTO) => Promise<Posts[]>;
}
