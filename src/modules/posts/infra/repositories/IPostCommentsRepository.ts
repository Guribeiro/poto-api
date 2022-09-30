import { Comments } from '@prisma/client';

export interface ICreatePostCommentDTO {
  post_id: string;
  user_id: string;
  content: string;
}

export interface IFindOneByPostIdAndUserIdDTO {
  user_id: string;
  post_id: string;
}

export default interface IPostCommentsRepository {
  create: (data: ICreatePostCommentDTO) => Promise<Comments>;
  findManyByUserId: (user_id: string) => Promise<Comments[]>;
  findManyByPostId: (post_id: string) => Promise<Comments[]>;
  findOneById: (comment_id: string) => Promise<Comments | null>;
  findOneByPostIdAndUserId: (
    data: IFindOneByPostIdAndUserIdDTO,
  ) => Promise<Comments | null>;
  deleteOneById: (comment_id: string) => Promise<void>;
}
