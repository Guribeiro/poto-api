import { Posts } from '@prisma/client';
import ICreatePostDTO from '../dtos/ICreatePostDTO';

export interface Pagination {
  page: number;
  take: number;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
  radius: number;
}

export interface Interval {
  start: Date;
  end: Date;
}

export interface IFindManyByIntervalDateDTO {
  interval: Interval;
  pagination: Pagination;
}

export interface IFindOneByUserAndIntervalDateDTO {
  user_id: string;
  interval: Interval;
}

export interface IFindManyByIntervalDateAndCoordinates {
  interval: Interval;
  coordinates: Coordinates;
  pagination: Pagination;
}

export default interface IPostsRepository {
  create: (data: ICreatePostDTO) => Promise<Posts>;
  all: (data: Pagination) => Promise<Posts[]>;
  findManyByUserId: (user_id: string) => Promise<Posts[]>;
  findOneById: (post_id: string) => Promise<Posts | null>;
  listPostsByUserAndCoordinates: (data: Coordinates) => Promise<Posts[]>;
  findOneByUserAndIntervalDate: (
    data: IFindOneByUserAndIntervalDateDTO,
  ) => Promise<Posts | null>;
  findManyByIntervalDate: (
    data: IFindManyByIntervalDateDTO,
  ) => Promise<Posts[]>;
  findManyByIntervalDateAndCoordinates: (
    data: IFindManyByIntervalDateAndCoordinates,
  ) => Promise<Posts[]>;
}
