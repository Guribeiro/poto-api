export type Reference = 'avatars' | 'posts';

export default interface IStorageProvider {
  saveFile: (file: string, reference: Reference) => Promise<string>;
  deleteFile: (file: string, reference: Reference) => Promise<void>;
}
