import { inject, injectable } from 'tsyringe';
import { Likes } from '@prisma/client';

import AppError from '@shared/errors/AppError';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IPostLikesRepository from '@modules/posts/repositories/IPostLikesRepository';

interface Request {
  user_id: string;
}

@injectable()
class ListUserPostsLikedUseCase {
  constructor(
    @inject('UsersRepository')
    private readonly usersRepository: IUsersRepository,

    @inject('PostLikesRepository')
    private readonly postLikesRepository: IPostLikesRepository,
  ) {}

  public async execute({ user_id }: Request): Promise<Likes[]> {
    const user = await this.usersRepository.findOneById(user_id);

    if (!user) {
      throw new AppError('user could not be found');
    }

    const likes = await this.postLikesRepository.findManyByUserId(user_id);

    return likes;
  }
}

export default ListUserPostsLikedUseCase;
