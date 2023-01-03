import { Likes, Comments } from '@prisma/client';

export interface Complement {
  _likes_count: number;
  _comments_count: number;
  likes: Likes[];
  comments: Comments[];
}
