import {injectable, inject} from 'tsyringe';
import ICreateUserDTO from '../../../dtos/ICreateUserDTO';
import IUsersRepository from '../../../infra/repositories/IUsersRepository';
import IHashProvider from '../../../infra/providers/HashProvider/models/IHashProvider';
import User from '../../../infra/prisma/entities/User';

interface Request extends ICreateUserDTO {};

@injectable()
class CreateUserUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('BCryptHashProvider')
    private hashProvider: IHashProvider,
  ){}

  public async execute({full_name, email, password, address}:Request):Promise<User>{

    const findUserWithSameEmail = await this.usersRepository.findOneByEmail(email);

    if(findUserWithSameEmail){
      throw new Error('email has already been taken');
    }

    const hashedPassword = await this.hashProvider.generateHash(password);

    const user = await this.usersRepository.create({
      full_name,
      email,
      password: hashedPassword,
      address
    });

    return user;
  }
}

export default CreateUserUseCase;