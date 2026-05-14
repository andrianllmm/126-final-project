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
  private bucket: string;
  private publicUrl?: string;

  constructor() {
    this.validateConfig();

    this.bucket = env.s3.bucket;

    this.publicUrl = env.s3.publicUrl;

    this.client = new S3Client({
      region: env.s3.region,
      endpoint: env.s3.endpoint,
      forcePathStyle: true,
      credentials: {
        accessKeyId: env.s3.accessKeyId,
        secretAccessKey: env.s3.secretAccessKey,
      },
    });
  }

  private validateConfig() {
    const required = [
      ['S3_REGION', env.s3?.region],
      ['S3_BUCKET', env.s3?.bucket],
      ['S3_ENDPOINT', env.s3?.endpoint],
      ['S3_ACCESS_KEY_ID', env.s3?.accessKeyId],
      ['S3_SECRET_ACCESS_KEY', env.s3?.secretAccessKey],
    ] as const;

    const missing = required.filter(([, value]) => !value);

    if (missing.length > 0) {
      throw new Error(
        `S3 configuration missing: ${missing.map(([k]) => k).join(', ')}`,
      );
    }
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
      url: this.buildPublicUrl(key),
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

  private buildPublicUrl(key: string): string {
    // Preferred: custom CDN/public domain
    if (this.publicUrl) {
      return `${this.publicUrl}/${key}`;
    }

    // Fallback: construct from endpoint + bucket (S3/R2 compatible)
    const base = env.s3.endpoint?.replace(/\/$/, '');
    return `${base}/${this.bucket}/${key}`;
  }
}
