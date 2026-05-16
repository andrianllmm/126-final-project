import { PipeTransform, BadRequestException } from '@nestjs/common';

export class ImageFileValidationPipe implements PipeTransform {
  private readonly allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];

  constructor(private readonly options: { required?: boolean } = {}) {}

  transform(value: any) {
    if (!value || (Array.isArray(value) && value.length === 0)) {
      if (this.options.required === false) {
        return undefined;
      }

      throw new BadRequestException('File is required');
    }

    const files = Array.isArray(value) ? value : [value];

    const maxSize = 5 * 1024 * 1024;

    for (const file of files) {
      if (!this.allowedMimeTypes.includes(file.mimetype)) {
        throw new BadRequestException('Only image files are allowed');
      }

      if (file.size > maxSize) {
        throw new BadRequestException('File too large (max 5MB)');
      }
    }

    return value;
  }
}
