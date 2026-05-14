import { UploadFile, UploadResult } from '../uploads.types.js';

export interface StorageProvider {
  upload(file: UploadFile): Promise<UploadResult>;

  delete(key: string): Promise<void>;
}
