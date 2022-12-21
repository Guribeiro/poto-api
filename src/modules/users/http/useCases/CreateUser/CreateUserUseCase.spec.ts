import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/infra/providers/HashProvider/fakes/FakeHashProvider';

import AppError from '@shared/errors/AppError';

import CreateUserUseCase from './CreateUserUseCase';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUserUseCase: CreateUserUseCase;

describe('Create User', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    createUserUseCase = new CreateUserUseCase(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('shoud be able to create a new user', async () => {
    const user = await createUserUseCase.execute({
      username: 'username',
      email: 'email@email.com',
      full_name: 'full name',
      avatar: 'avatar.jpg',
      password: 'password',
    });

    expect(user).toHaveProperty('id');
  });

  it('should not be able to two users with same email', async () => {
    await fakeUsersRepository.create({
      username: 'username',
      email: 'email@email.com',
      full_name: 'full name',
      avatar: 'avatar.jpg',
      password: 'password',
    });

    await expect(
      createUserUseCase.execute({
        username: 'anotherusername',
        email: 'email@email.com',
        full_name: 'full name',
        avatar: 'avatar.jpg',
        password: 'password',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to two users with same username', async () => {
    const user = await fakeUsersRepository.create({
      username: 'username',
      email: 'email@email.com',
      full_name: 'full name',
      avatar: 'avatar.jpg',
      password: 'password',
    });

    await expect(
      createUserUseCase.execute({
        username: 'username',
        email: 'email@email2.com',
        full_name: 'full name',
        avatar: 'avatar.jpg',
        password: 'password',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
