import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';

import { Session, type UserSession } from '@thallesp/nestjs-better-auth';

import { ListingImagesService } from './listing-images.service.js';
import { ImageFileValidationPipe } from '../uploads/pipes/image-file-validation.pipe.js';
import { toUploadFile } from '../uploads/adapters/to-upload-file.js';

@Controller('listings/:listingId/images')
export class ListingImagesController {
  constructor(private readonly service: ListingImagesService) {}

  @Post()
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  addImages(
    @Param('listingId') listingId: string,
    @Session() session: UserSession,
    @UploadedFiles(new ImageFileValidationPipe({ required: true }))
    files: any[],
  ) {
    return this.service.addImages(
      listingId,
      session.user.id,
      files.map(toUploadFile),
    );
  }

  @Delete(':imageId')
  removeImage(
    @Param('listingId') listingId: string,
    @Param('imageId') imageId: string,
    @Session() session: UserSession,
  ) {
    return this.service.removeImage(listingId, session.user.id, imageId);
  }

  @Patch('reorder')
  reorderImages(
    @Param('listingId') listingId: string,
    @Session() session: UserSession,
    @Body() body: { orderedImageIds: string[] },
  ) {
    return this.service.reorderImages(
      listingId,
      session.user.id,
      body.orderedImageIds,
    );
  }
}
