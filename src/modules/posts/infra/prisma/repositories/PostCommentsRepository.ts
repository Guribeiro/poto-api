import { PrismaClient, Comments } from '@prisma/client';
import prisma from '../../../../../shared/prisma';

import IPostCommentsRepository, {
  ICreatePostCommentDTO,
  IFindOneByPostIdAndUserIdDTO,
} from '../../repositories/IPostCommentsRepository';

class PostCommentsRepository implements IPostCommentsRepository {
  private readonly repository: PrismaClient;
  constructor() {
    this.repository = prisma;
  }

  async findOneByPostIdAndUserId({
    user_id,
    post_id,
  }: IFindOneByPostIdAndUserIdDTO): Promise<Comments | null> {
    return await this.repository.comments.findFirst({
      where: {
        user_id,
        post_id,
      },
    });
  }

  public async create({
    user_id,
    post_id,
    content,
  }: ICreatePostCommentDTO): Promise<Comments> {
    const comment = await this.repository.comments.create({
      data: {
        post_id,
        user_id,
        content,
      },
    });

    return comment;
  }

  public async all(): Promise<Comments[]> {
    return await this.repository.comments.findMany({
      include: {
        user: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  public async findManyByUserId(user_id: string): Promise<Comments[]> {
    return await this.repository.comments.findMany({
      where: {
        user_id,
      },
      include: {
        user: true,
      },
    });
  }

  public async findManyByPostId(post_id: string): Promise<Comments[]> {
    return await this.repository.comments.findMany({
      where: {
        post_id,
      },
      include: {
        user: true,
      },
    });
  }

  public async findOneById(post_id: string): Promise<Comments | null> {
    return await this.repository.comments.findUnique({
      where: {
        id: post_id,
      },
      include: {
        user: true,
      },
    });
  }

  public async deleteOneById(comment_id: string): Promise<void> {
    await this.repository.comments.delete({
      where: {
        id: comment_id,
      },
    });
  }
}

export default PostCommentsRepository;
