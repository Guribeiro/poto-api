import {injectable, inject} from 'tsyringe';
import ICreateUserDTO from '../../../dtos/ICreateUserDTO';
import IUsersRepository from '../../../infra/repositories/IUsersRepository';
import User from '../../../infra/prisma/entities/User';

interface Request extends ICreateUserDTO {};

@injectable()
class CreateUserUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ){}

  public async execute({full_name, email, password, address}:Request):Promise<User>{

    const findUserWithSameEmail = await this.usersRepository.findOneByEmail(email);

    if(findUserWithSameEmail){
      throw new Error('email has already been taken');
    }

    const user = await this.usersRepository.create({
      full_name,
      email,
      password,
      address
    });

    return user;
  }
}

export default CreateUserUseCase;