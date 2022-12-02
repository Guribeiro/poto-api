import { Posts } from '@prisma/client';
import { injectable, inject } from 'tsyringe';

import IUsersRepository from '@modules/users/infra/repositories/IUsersRepository';
import IPostsRepository from '@modules/posts/infra/repositories/IPostsRepository';

interface Request {
  user_id: string;
  subtitle: string;
  photo: string;
  latitude: number;
  longitude: number;
}

@injectable()
class CreatePostUseCase {
  constructor(
    @inject('UsersRepository')
    private readonly usersRepository: IUsersRepository,

    @inject('PostsRepository')
    private readonly postsRepository: IPostsRepository,
  ) {}

  public async execute({
    user_id,
    subtitle,
    photo,
    latitude,
    longitude,
  }: Request): Promise<Posts> {
    const user = await this.usersRepository.findOneById(user_id);

    if (!user) {
      throw new Error('user could not be found');
    }

    const post = await this.postsRepository.create({
      user_id,
      subtitle,
      photo,
      latitude,
      longitude,
    });

    return post;
  }
}

export default CreatePostUseCase;
