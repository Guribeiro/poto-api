import fs from 'fs';
import path from 'path';

import uploadConfig from '../../../../../config/upload';
import IStoreProvider, { Reference } from '../models/IStorageProvider';

const { avatars, posts } = uploadConfig;

const configVariations = {
  avatars,
  posts,
};

export default class DiskStorageProvider implements IStoreProvider {
  public async saveFile(file: string, reference: Reference): Promise<string> {
    const config = configVariations[reference];

    await fs.promises.rename(
      path.resolve(config.directory, file),
      path.resolve(config.directory, file),
    );

    return file;
  }

  public async deleteFile(file: string, reference: Reference): Promise<void> {
    const config = configVariations[reference];

    const filePath = path.resolve(config.directory, file);

    try {
      await fs.promises.stat(filePath);
    } catch {
      return;
    }

    await fs.promises.unlink(filePath);
  }
}
