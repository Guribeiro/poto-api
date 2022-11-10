import { PrismaClient, Likes } from '@prisma/client';
import ILikesRepository, {
  ICreateLikeDTO,
} from '../../repositories/IPostLikesRepository';

class LikesRepository implements ILikesRepository {
  private readonly repository: PrismaClient;

  constructor() {
    this.repository = new PrismaClient();
  }

  public async create({ user_id, post_id }: ICreateLikeDTO): Promise<Likes> {
    const like = await this.repository.likes.create({
      data: {
        user_id,
        post_id,
      },
      include: {
        user: true,
        post: true,
      },
    });

    return like;
  }

  public async findManyByPostId(post_id: string): Promise<Likes[]> {
    const likes = await this.repository.likes.findMany({
      where: {
        post_id,
      },
      include: {
        user: true,
      },
    });

    return likes;
  }

  public async findManyByUserId(user_id: string): Promise<Likes[]> {
    const likes = await this.repository.likes.findMany({
      where: {
        user_id,
      },
      include: {
        user: true,
        post: true,
      },
    });

    return likes;
  }

  public async findOneByPostId(post_id: string): Promise<Likes | null> {
    return await this.repository.likes.findFirst({
      where: {
        id: post_id,
      },
    });
  }

  async findOneByPostIdAndUserId(
    post_id: string,
    user_id: string,
  ): Promise<Likes | null> {
    return await this.repository.likes.findFirst({
      where: {
        post_id,
        user_id,
      },
    });
  }

  async deleteById(id: string): Promise<void> {
    await this.repository.likes.delete({
      where: {
        id,
      },
    });
  }
}

export default LikesRepository;
