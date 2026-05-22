import {
  Injectable,
  Inject,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';

import { type StorageProvider } from './storage/storage.interface.js';
import { UploadFile } from './uploads.types.js';

@Injectable()
export class UploadsService {
  constructor(
    private prisma: PrismaService,
    @Inject('STORAGE_PROVIDER')
    private storage: StorageProvider,
  ) {}

  async upload(file: UploadFile, userId?: string) {
    const result = await this.storage.upload(file);

    const upload = await this.prisma.upload.create({
      data: {
        key: result.key,
        url: result.url,
        mimeType: result.mimeType,
        size: result.size,
        width: result.width,
        height: result.height,
        uploaderId: userId ?? null,
      },
    });

    return upload;
  }

  async delete(uploadId: string, userId: string) {
    const upload = await this.prisma.upload.findUnique({
      where: { id: uploadId },
    });

    if (!upload) {
      throw new NotFoundException('Upload not found');
    }

    // Ownership check
    if (upload.uploaderId && upload.uploaderId !== userId) {
      throw new ForbiddenException('Unauthorized');
    }

    await this.storage.delete(upload.key);

    await this.prisma.upload.delete({
      where: { id: uploadId },
    });

    return { success: true };
  }

  async deleteByUrl(url: string, userId: string) {
    const upload = await this.prisma.upload.findFirst({
      where: { url },
    });

    if (!upload) {
      return;
    }

    return this.delete(upload.id, userId);
  }
}
