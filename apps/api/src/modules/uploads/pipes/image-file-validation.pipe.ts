import { PipeTransform, BadRequestException } from '@nestjs/common';
import { UploadFile } from '../uploads.types.js';

export class ImageFileValidationPipe implements PipeTransform {
  private readonly allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];

  transform(file: UploadFile) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    if (!this.allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('Only image files are allowed');
    }

    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      throw new BadRequestException('File too large (max 5MB)');
    }

    return file;
  }
}
