import { Users } from '@prisma/client';
import { randomUUID } from 'node:crypto';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import IUsersRepository from '../IUsersRepository';

class FakeUsersRepository implements IUsersRepository {
  private readonly users: Users[] = [];

  public async create({
    full_name,
    username,
    email,
    avatar,
    password,
  }: ICreateUserDTO): Promise<Users> {
    const user: Users = {
      id: randomUUID(),
      full_name,
      username,
      email,
      avatar,
      password,
      address_id: null,
      created_at: new Date(),
      updated_at: new Date(),
    };

    this.users.push(user);

    return user;
  }

  public async findOneById(id: string): Promise<Users | null> {
    return this.users.find(user => user.id === id) ?? null;
  }

  public async findOneByUsername(username: string): Promise<Users | null> {
    return this.users.find(user => user.username === username) ?? null;
  }

  public async findOneByEmail(email: string): Promise<Users | null> {
    return this.users.find(user => user.email === email) ?? null;
  }

  public async save(user: Users): Promise<Users> {
    const findIndex = this.users.findIndex(findUser => findUser.id === user.id);

    this.users[findIndex] = user;

    return user;
  }
}

export default FakeUsersRepository;
