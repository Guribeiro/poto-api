import {container} from 'tsyringe';

import '../../modules/users/infra/providers';

import IUsersRepository from '../../modules/users/infra/repositories/IUsersRepository';
import UsersRepository from '../../modules/users/infra/prisma/repositories/UsersRepository';

container.registerSingleton<IUsersRepository>('UsersRepository', UsersRepository)