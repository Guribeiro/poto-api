import { Posts } from '@prisma/client';
import ICreatePostDTO from '../../dtos/ICreatePostDTO';

export default interface IPostsRepository {
  create: (data: ICreatePostDTO) => Promise<Posts>;
  all: () => Promise<Posts[]>;
  findManyByUserId: (user_id: string) => Promise<Posts[]>;
  findOneById: (post_id: string) => Promise<Posts | null>;
}
