import { Posts } from '@prisma/client';
import { injectable, inject } from 'tsyringe';
import { startOfDay, endOfDay } from 'date-fns';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IPostsRepository from '@modules/posts/repositories/IPostsRepository';
import AppError from '@shared/errors/AppError';

interface CreatePostUseCaseRequest {
  request: {
    user_id: string;
    subtitle: string;
    photo: string;
    latitude: number;
    longitude: number;
  };
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
    request: { user_id, subtitle, photo, latitude, longitude },
  }: CreatePostUseCaseRequest): Promise<Posts> {
    const user = await this.usersRepository.findOneById(user_id);

    if (!user) {
      throw new AppError('user could not be found', 401);
    }

    const today = new Date();

    const findPostToday =
      await this.postsRepository.findOneByUserAndIntervalDate({
        user_id: user.id,
        interval: {
          start: startOfDay(today),
          end: endOfDay(today),
        },
      });

    if (findPostToday) {
      throw new AppError('you can post only once per day', 401);
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
