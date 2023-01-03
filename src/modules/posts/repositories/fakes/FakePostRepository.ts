import { randomUUID } from 'node:crypto';
import ICreatePostDTO from '@modules/posts/dtos/ICreatePostDTO';
import { Posts } from '@prisma/client';
import IPostsRepository, { IAllDTO, IListFeedDTO } from '../IPostsRepository';

class FakePostRepository implements IPostsRepository {
  private readonly posts: Posts[] = [];

  public async create({
    user_id,
    subtitle,
    photo,
    latitude,
    longitude,
  }: ICreatePostDTO): Promise<Posts> {
    const post: Posts = {
      id: randomUUID(),
      user_id,
      subtitle,
      photo,
      latitude,
      longitude,
      created_at: new Date(),
      updated_at: new Date(),
    };

    this.posts.push(post);

    return post;
  }

  public async all(data: IAllDTO): Promise<Posts[]> {
    return this.posts;
  }

  public async findManyByUserId(user_id: string): Promise<Posts[]> {
    return this.posts.filter(post => post.user_id === user_id);
  }

  public async findOneById(post_id: string): Promise<Posts | null> {
    return this.posts.find(post => post.id === post_id) ?? null;
  }

  public async listPostsByUserAndCoordinates(
    data: IListFeedDTO,
  ): Promise<Posts[]> {
    return this.posts;
  }
}

export default FakePostRepository;
