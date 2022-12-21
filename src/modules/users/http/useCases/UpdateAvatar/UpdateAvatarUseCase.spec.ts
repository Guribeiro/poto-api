import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import UpdateAvatarUseCase from './UpdateAvatarUseCase';

let fakeUsersRepository: FakeUsersRepository;
let fakeStorageProvider: FakeStorageProvider;
let updateAvatarUseCase: UpdateAvatarUseCase;

describe('update user avatar', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeStorageProvider = new FakeStorageProvider();

    updateAvatarUseCase = new UpdateAvatarUseCase(
      fakeUsersRepository,
      fakeStorageProvider,
    );
  });

  it('should be able to update the avatar', async () => {
    const avatar = 'new-avatar.jpg';

    const user = await fakeUsersRepository.create({
      username: 'username',
      email: 'email@email.com',
      full_name: 'full name',
      avatar: 'avatar.jpg',
      password: 'password',
    });

    await updateAvatarUseCase.execute({
      user_id: user.id,
      avatar,
    });

    expect(user.avatar).toBe(avatar);
  });

  it('should not be able to update the avatar if it is not authenticated', async () => {
    await expect(
      updateAvatarUseCase.execute({
        user_id: 'non-existing-user',
        avatar: 'avatar.jpg',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to delete old avatar file before the new one gets uploaded', async () => {
    const avatar = 'new-avatar.jpg';

    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const user = await fakeUsersRepository.create({
      username: 'username',
      email: 'email@email.com',
      full_name: 'full name',
      avatar: 'avatar.jpg',
      password: 'password',
    });

    const updatedUser = await updateAvatarUseCase.execute({
      user_id: user.id,
      avatar,
    });

    expect(deleteFile).toHaveBeenCalledWith('avatar.jpg', 'avatars');
    expect(updatedUser.avatar).toBe('new-avatar.jpg');
  });
});
