import { Posts } from '@prisma/client';

export interface PostMapped extends Posts {
  photo_url: string;
}

export class PostMapper {
  public static toDTO({ photo, ...props }: Posts): PostMapped {
    let photo_url: string;

    switch (process.env.NODE_ENV) {
      case 'production':
        photo_url = ``;
        break;

      default:
        photo_url = `http://10.0.0.76:3333/files/posts/${photo}`;
    }

    return {
      ...props,
      photo,
      photo_url,
    };
  }
}
