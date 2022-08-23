import {injectable, inject} from 'tsyringe';
import IJsonWebTokenProvider from '../../../infra/providers/JsonwebtokenProvider/models/IJsonWebTokenProvider';
import IUsersRepository from '../../../infra/repositories/IUsersRepository';

import authConfig from '../../../../../config/auth';

import User from '../../../infra/prisma/entities/User';
import IHashProvider from '../../../infra/providers/HashProvider/models/IHashProvider';

interface Request {
  email: string;
  password: string;
}

interface Response {
  user: User,
  token: string;
};

@injectable()
class AuthenticateUserUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository:IUsersRepository,

    @inject('JsonWebTokenProvider')
    private jsonwebtokenRepository:IJsonWebTokenProvider,
    
    @inject('BCryptHashProvider')
    private hashProvider: IHashProvider,
  ){}
  public async execute({email, password}:Request):Promise<Response>{
    const user = await this.usersRepository.findOneByEmail(email);

    if(!user){
      throw new Error('incorrect email/password');
    }

    const passwordMatch = this.hashProvider.compareHash(password, user.password);

    if(!passwordMatch){
      throw new Error('incorrect email/password');
    }

    const {secret, expiresIn} = authConfig.jwt;

    const token = this.jsonwebtokenRepository.sign({
      payload: {},
      secret,
      options: {
        expiresIn
      }
    });

    return {
      user,
      token
    }
  }
}

export default AuthenticateUserUseCase;