import { Users } from '@prisma/client';
import { injectable, inject } from 'tsyringe';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IPostsRepository from '@modules/posts/repositories/IPostsRepository';

import { exclude } from '@shared/prisma/client';
import AppError from '@shared/errors/AppError';

interface IRequest {
  user_id: string;
  user_profile_id: string;
}

@injectable()
class ShowUserUseCase {
  constructor(
    @inject('UsersRepository')
    private readonly usersRepository: IUsersRepository,

    @inject('PostsRepository')
    private readonly postsRepository: IPostsRepository,
  ) {}

  public async execute({
    user_id,
    user_profile_id,
  }: IRequest): Promise<Omit<Users, 'password'>> {
    const user = await this.usersRepository.findOneById(user_id);

    if (!user) throw new AppError('usuário não encontrado');

    const userProfile = await this.usersRepository.findOneById(user_profile_id);

    if (!userProfile) throw new AppError('usuário não encontrado');

    const userProfilePosts = await this.postsRepository.findManyByUserId(
      user_profile_id,
    );

    Object.assign(userProfile, { posts: userProfilePosts });

    const userProfileWithoutPassword = exclude(userProfile, 'password');

    return userProfileWithoutPassword;
  }
}

export default ShowUserUseCase;
