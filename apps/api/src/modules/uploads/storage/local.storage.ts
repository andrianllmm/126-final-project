import { promises as fs } from 'fs';
import { createWriteStream, createReadStream } from 'fs';
import { join } from 'path';
import { pipeline } from 'stream/promises';
import sharp from 'sharp';

import { StorageProvider } from './storage.interface.js';
import { env } from '../../../config/env.js';
import { UploadFile, UploadResult } from '../uploads.types.js';

export class LocalStorageProvider implements StorageProvider {
  private uploadDir = env.uploadDir;
  private baseUrl = env.baseUrl;

  async upload(file: UploadFile): Promise<UploadResult> {
    await fs.mkdir(this.uploadDir, { recursive: true });

    const ext = file.originalname.split('.').pop();
    const key = `${Date.now()}-${Math.round(Math.random() * 1e9)}.${ext}`;

    const filePath = join(this.uploadDir, key);

    // Write file
    if (file.buffer) {
      await fs.writeFile(filePath, file.buffer);
    } else if (file.path) {
      await pipeline(createReadStream(file.path), createWriteStream(filePath));
    } else {
      throw new Error('Invalid file input: no buffer or path');
    }

    const metadata = await sharp(filePath).metadata();

    return {
      key,
      url: `${this.baseUrl}/uploads/${key}`,
      mimeType: file.mimetype,
      size: file.size,
      width: metadata.width,
      height: metadata.height,
    };
  }

  async delete(key: string): Promise<void> {
    const filePath = join(this.uploadDir, key);

    try {
      await fs.unlink(filePath);
    } catch {
      // ignore missing files
    }
  }
}
