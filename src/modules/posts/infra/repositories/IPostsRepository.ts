import { Posts } from '@prisma/client';
import ICreatePostDTO from '../../dtos/ICreatePostDTO';

export interface IAllDTO {
  page: number;
  take: number;
}

export default interface IPostsRepository {
  create: (data: ICreatePostDTO) => Promise<Posts>;
  all: (data: IAllDTO) => Promise<Posts[]>;
  findManyByUserId: (user_id: string) => Promise<Posts[]>;
  findOneById: (post_id: string) => Promise<Posts | null>;
}
