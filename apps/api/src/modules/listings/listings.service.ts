import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { CreateListingDto } from './dto/create-listing.dto.js';

@Injectable()
export class ListingsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(sellerId: string, createListingDto: CreateListingDto) {
    const title = createListingDto.title?.trim();
    const description = createListingDto.description?.trim();
    const meetupLocation = createListingDto.meetupLocation?.trim();
    const imageUrls = createListingDto.imageUrls ?? [];

    if (!title) {
      throw new BadRequestException('Listing title is required');
    }

    if (!description) {
      throw new BadRequestException('Listing description is required');
    }

    const price = typeof createListingDto.price === 'string'
      ? Number(createListingDto.price)
      : createListingDto.price;

    if (typeof price !== 'number' || Number.isNaN(price) || price < 0) {
      throw new BadRequestException('Listing price must be a valid non-negative number');
    }

    if (!createListingDto.categoryId) {
      throw new BadRequestException('Listing categoryId is required');
    }

    if (!createListingDto.condition) {
      throw new BadRequestException('Listing condition is required');
    }

    const category = await this.prisma.listingCategory.findUnique({
      where: { id: createListingDto.categoryId },
    });

    if (!category) {
      throw new NotFoundException('Listing category not found');
    }

    const data: any = {
      sellerId,
      title,
      description,
      price,
      categoryId: createListingDto.categoryId,
      condition: createListingDto.condition,
      status: createListingDto.status ?? 'AVAILABLE',
      meetupLocation: meetupLocation || null,
    };

    if (imageUrls.length > 0) {
      data.images = {
        create: imageUrls.map((imageUrl, index) => ({
          imageUrl: imageUrl.trim(),
          sortOrder: index,
        })),
      };
    }

    return this.prisma.listing.create({
      data,
      include: {
        images: true,
        category: true,
      },
    });
  }
}
