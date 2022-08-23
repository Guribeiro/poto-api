import {container} from 'tsyringe';

import '../../modules/users/infra/providers';

import IUserTokensRepository from '../../modules/users/infra/repositories/IUserTokensRepository';
import UserTokensRepository from '../../modules/users/infra/prisma/repositories/UserTokensRepository';

import IUsersRepository from '../../modules/users/infra/repositories/IUsersRepository';
import UsersRepository from '../../modules/users/infra/prisma/repositories/UsersRepository';

container.registerSingleton<IUsersRepository>('UsersRepository', UsersRepository)

container.registerSingleton<IUserTokensRepository>('UserTokensRepository', UserTokensRepository)