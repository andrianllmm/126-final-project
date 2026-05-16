import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { ListingPolicy } from '../listings/listing.policy.js';
import { UploadsService } from '../uploads/uploads.service.js';
import { UploadFile } from '../uploads/uploads.types.js';

@Injectable()
export class ListingImagesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly policy: ListingPolicy,
    private readonly uploadsService: UploadsService,
  ) {}

  async addImages(listingId: string, userId: string, files: UploadFile[]) {
    await this.policy.assertOwnerByListingId(listingId, userId);

    const uploaded = await Promise.all(
      files.map((file) => this.uploadsService.upload(file, userId)),
    );

    const images = await this.prisma.listingImage.createMany({
      data: uploaded.map((u, index) => ({
        listingId,
        uploadId: u.id,
        sortOrder: index,
      })),
    });

    return images;
  }

  async removeImage(listingId: string, userId: string, imageId: string) {
    await this.policy.assertOwnerByListingId(listingId, userId);

    const image = await this.prisma.listingImage.findFirst({
      where: {
        id: imageId,
        listingId,
      },
      select: {
        id: true,
        uploadId: true,
      },
    });

    if (!image) {
      throw new NotFoundException('Image not found');
    }

    await this.prisma.listingImage.delete({
      where: { id: imageId },
    });

    await this.uploadsService.delete(image.uploadId, userId);

    return { success: true };
  }

  async reorderImages(
    listingId: string,
    userId: string,
    orderedImageIds: string[],
  ) {
    await this.policy.assertOwnerByListingId(listingId, userId);

    const images = await this.prisma.listingImage.findMany({
      where: { listingId },
      select: { id: true },
    });

    const valid = new Set(images.map((i) => i.id));

    for (const id of orderedImageIds) {
      if (!valid.has(id)) {
        throw new NotFoundException(`Image ${id} not found`);
      }
    }

    await Promise.all(
      orderedImageIds.map((id, index) =>
        this.prisma.listingImage.update({
          where: { id },
          data: { sortOrder: index },
        }),
      ),
    );

    return this.prisma.listingImage.findMany({
      where: { listingId },
      include: { upload: true },
      orderBy: { sortOrder: 'asc' },
    });
  }
}
