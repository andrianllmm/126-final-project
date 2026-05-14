import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';

import { readFile } from 'fs/promises';
import sharp from 'sharp';

import { StorageProvider } from './storage.interface.js';

import { env } from '../../../config/env.js';
import { UploadFile, UploadResult } from '../uploads.types.js';

export class S3StorageProvider implements StorageProvider {
  private client: S3Client;
  private bucket = env.s3.bucket;
  private publicUrl = env.s3.publicUrl;

  constructor() {
    this.client = new S3Client({
      region: env.s3.region,
      endpoint: env.s3.endpoint,
      credentials: {
        accessKeyId: env.s3.accessKeyId,
        secretAccessKey: env.s3.secretAccessKey,
      },
    });
  }

  async upload(file: UploadFile): Promise<UploadResult> {
    const ext = file.originalname.split('.').pop();
    const key = `${Date.now()}-${Math.round(Math.random() * 1e9)}.${ext}`;

    let buffer: Buffer;

    if (file.buffer) {
      buffer = file.buffer;
    } else if (file.path) {
      buffer = await readFile(file.path);
    } else {
      throw new Error('Invalid file input: no buffer or path');
    }

    // Extract metadata BEFORE upload (fast, avoids re-fetching)
    const metadata = await sharp(buffer).metadata();

    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: buffer,
        ContentType: file.mimetype,
      }),
    );

    return {
      key,
      url: `${this.publicUrl}/${key}`,
      mimeType: file.mimetype,
      size: file.size,
      width: metadata.width,
      height: metadata.height,
    };
  }

  async delete(key: string): Promise<void> {
    await this.client.send(
      new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      }),
    );
  }
}
