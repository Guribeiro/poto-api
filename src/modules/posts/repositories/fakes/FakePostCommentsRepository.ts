import { randomUUID } from 'node:crypto';
import { Comments } from '@prisma/client';
import IPostCommentsRepository, {
  ICreatePostCommentDTO,
  IFindOneByPostIdAndUserIdDTO,
} from '../IPostCommentsRepository';

class FakePostCommentsRepository implements IPostCommentsRepository {
  private readonly comments: Comments[] = [];
  public async create({
    user_id,
    post_id,
    content,
  }: ICreatePostCommentDTO): Promise<Comments> {
    const comment: Comments = {
      id: randomUUID(),
      user_id,
      post_id,
      content,
      created_at: new Date(),
      updated_at: new Date(),
    };

    this.comments.push(comment);

    return comment;
  }

  public async findManyByUserId(user_id: string): Promise<Comments[]> {
    return this.comments.filter(comment => comment.user_id === user_id);
  }

  public async findManyByPostId(post_id: string): Promise<Comments[]> {
    return this.comments.filter(comment => comment.post_id === post_id);
  }

  public async findOneById(comment_id: string): Promise<Comments | null> {
    return this.comments.find(comment => comment.id === comment_id) ?? null;
  }

  public async findOneByPostIdAndUserId({
    post_id,
    user_id,
  }: IFindOneByPostIdAndUserIdDTO): Promise<Comments | null> {
    return (
      this.comments.find(
        comment => comment.post_id === post_id && comment.user_id === user_id,
      ) ?? null
    );
  }

  async deleteOneById(comment_id: string): Promise<void> {
    const findIndex = this.comments.findIndex(
      comment => comment.id === comment_id,
    );

    this.comments.splice(findIndex, 1);
  }
}

export default FakePostCommentsRepository;
