import { Likes } from '@prisma/client';

export interface ICreateLikeDTO {
  user_id: string;
  post_id: string;
}

export default interface ILikesRepository {
  create: (data: ICreateLikeDTO) => Promise<Likes>;
  findManyByPostId: (post_id: string) => Promise<Likes[]>;
  findOneByPostId: (post_id: string) => Promise<Likes | null>;
  findOneByPostIdAndUserId: (
    post_id: string,
    user_id: string,
  ) => Promise<Likes | null>;
  deleteById: (id: string) => Promise<void>;
}
