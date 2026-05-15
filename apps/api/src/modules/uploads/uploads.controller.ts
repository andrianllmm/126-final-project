import {
  Controller,
  Post,
  Delete,
  Param,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { UploadsService } from './uploads.service.js';
import { Session, type UserSession } from '@thallesp/nestjs-better-auth';

import { ImageFileValidationPipe } from './pipes/image-file-validation.pipe.js';
import { toUploadFile } from './adapters/to-upload-file.js';
import { UploadFile } from './uploads.types.js';

@Controller('uploads')
export class UploadsController {
  constructor(private uploadsService: UploadsService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    }),
  )
  async upload(
    @UploadedFile(new ImageFileValidationPipe())
    file: any,

    @Session()
    session: UserSession,
  ) {
    const uploadFile: UploadFile = toUploadFile(file);

    return this.uploadsService.upload(uploadFile, session.user.id);
  }

  @Delete(':id')
  async delete(
    @Param('id') id: string,
    @Session()
    session: UserSession,
  ) {
    return this.uploadsService.delete(id, session.user.id);
  }
}
