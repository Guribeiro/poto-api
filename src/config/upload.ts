import { resolve } from 'path';
import { randomUUID } from 'crypto';
import multer from 'multer';

const postsTempFolder = resolve(__dirname, '..', '..', 'tmp', 'posts');
const avatarsTempFolder = resolve(__dirname, '..', '..', 'tmp', 'avatars');

export default {
  posts: {
    directory: postsTempFolder,
    storage: multer.diskStorage({
      destination: postsTempFolder,
      filename(request, file, callback) {
        const fileHash = randomUUID();
        const fileName = `${fileHash}-${file.originalname}`;

        return callback(null, fileName);
      },
    }),
  },

  avatars: {
    directory: avatarsTempFolder,
    storage: multer.diskStorage({
      destination: avatarsTempFolder,
      filename(request, file, callback) {
        const fileHash = randomUUID();
        const fileName = `${fileHash}-${file.originalname}`;

        return callback(null, fileName);
      },
    }),
  },
};
