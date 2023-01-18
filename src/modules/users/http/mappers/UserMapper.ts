import { Users } from '@prisma/client';

export interface UserMapped extends Omit<Users, 'password'> {
  avatar_url: string;
}

export class UserMapper {
  public static toDTO({ avatar, password, ...props }: Users): UserMapped {
    let avatar_url: string;

    switch (process.env.NODE_ENV) {
      case 'production':
        avatar_url = ``;
        break;

      default:
        avatar_url = `http://10.0.0.76:3333/files/avatars/${avatar}`;
    }

    return {
      ...props,
      avatar,
      avatar_url,
    };
  }
}
