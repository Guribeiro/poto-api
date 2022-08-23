import {container} from 'tsyringe';

import IUsersRepository from '../../modules/users/infra/repositories/IUsersRepository';
import UsersRepository from '../../modules/users/infra/prisma/repositories/UsersRepository';

container.registerSingleton<IUsersRepository>('UsersRepository', UsersRepository)