import { Users } from '@prisma/client';
import { injectable, inject } from 'tsyringe';
import IUsersRepository from '../../../infra/repositories/IUsersRepository';
import { exclude } from '../../../../../shared/prisma';
import IPostsRepository from '../../../../posts/infra/repositories/IPostsRepository';

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

    if (!user) throw new Error('user could not be found');

    const userProfile = await this.usersRepository.findOneById(user_profile_id);

    if (!userProfile) throw new Error('user could not be found');

    const userProfilePosts = await this.postsRepository.findManyByUserId(
      user_profile_id,
    );

    Object.assign(userProfile, { posts: userProfilePosts });

    const userProfileWithoutPassword = exclude(userProfile, 'password');

    return userProfileWithoutPassword;
  }
}

export default ShowUserUseCase;
