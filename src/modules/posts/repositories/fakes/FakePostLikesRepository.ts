import { Likes } from '@prisma/client';
import { randomUUID } from 'node:crypto';
import IPostLikesRepository, { ICreateLikeDTO } from '../IPostLikesRepository';

class FakePostLikesRepository implements IPostLikesRepository {
  private readonly likes: Likes[] = [];

  public async create({ user_id, post_id }: ICreateLikeDTO): Promise<Likes> {
    const like: Likes = {
      id: randomUUID(),
      user_id,
      post_id,
      created_at: new Date(),
      updated_at: new Date(),
    };

    this.likes.push(like);

    return like;
  }

  public async findManyByPostId(post_id: string): Promise<Likes[]> {
    return this.likes.filter(like => like.post_id === post_id);
  }

  async findManyByUserId(user_id: string): Promise<Likes[]> {
    return this.likes.filter(like => like.user_id === user_id);
  }

  public async findOneByPostId(post_id: string): Promise<Likes | null> {
    return this.likes.find(like => like.post_id === post_id) ?? null;
  }

  public async findOneByPostIdAndUserId(
    post_id: string,
    user_id: string,
  ): Promise<Likes | null> {
    return (
      this.likes.find(
        like => like.user_id === user_id && like.post_id === post_id,
      ) ?? null
    );
  }

  async deleteById(id: string): Promise<void> {
    const findIndex = this.likes.findIndex(like => like.id === id);
    this.likes.splice(findIndex, 1);
  }
}

export default FakePostLikesRepository;
