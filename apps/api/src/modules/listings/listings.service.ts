import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { CreateListingDto } from './dto/create-listing.dto.js';
import { UpdateListingDto } from './dto/update-listing.dto.js';

@Injectable()
export class ListingsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(params: { sellerId?: string } = {}) {
    const where: any = {};

    if (params.sellerId) {
      where.sellerId = params.sellerId;
    } else {
      where.status = 'AVAILABLE';
    }

    return this.prisma.listing.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        category: true,
        images: {
          orderBy: { sortOrder: 'asc' },
        },
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async update(
    listingId: string,
    userId: string,
    updateListingDto: UpdateListingDto,
  ) {
    const listing = await this.prisma.listing.findUnique({
      where: { id: listingId },
      include: {
        images: true,
      },
    });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    if (listing.sellerId !== userId) {
      throw new ForbiddenException('You may only edit your own listing');
    }

    const title = updateListingDto.title?.trim();
    const description = updateListingDto.description?.trim();
    const meetupLocation = updateListingDto.meetupLocation?.trim();

    if (updateListingDto.title !== undefined && !title) {
      throw new BadRequestException('Listing title cannot be empty');
    }

    if (updateListingDto.description !== undefined && !description) {
      throw new BadRequestException('Listing description cannot be empty');
    }

    let price: number | undefined;
    if (updateListingDto.price !== undefined) {
      price =
        typeof updateListingDto.price === 'string'
          ? Number(updateListingDto.price)
          : updateListingDto.price;

      if (typeof price !== 'number' || Number.isNaN(price) || price < 0) {
        throw new BadRequestException(
          'Listing price must be a valid non-negative number',
        );
      }
    }

    if (updateListingDto.categoryId) {
      const category = await this.prisma.listingCategory.findUnique({
        where: { id: updateListingDto.categoryId },
      });

      if (!category) {
        throw new NotFoundException('Listing category not found');
      }
    }

    const data: any = {};

    if (title !== undefined) data.title = title;
    if (description !== undefined) data.description = description;
    if (price !== undefined) data.price = price;
    if (updateListingDto.categoryId)
      data.categoryId = updateListingDto.categoryId;
    if (updateListingDto.condition) data.condition = updateListingDto.condition;
    if (updateListingDto.status) data.status = updateListingDto.status;
    if (updateListingDto.meetupLocation !== undefined) {
      data.meetupLocation = meetupLocation || null;
    }

    if (updateListingDto.imageUrls !== undefined) {
      await this.prisma.listingImage.deleteMany({
        where: { listingId },
      });

      if (updateListingDto.imageUrls.length > 0) {
        data.images = {
          create: updateListingDto.imageUrls.map((imageUrl, index) => ({
            imageUrl: imageUrl.trim(),
            sortOrder: index,
          })),
        };
      }
    }

    return this.prisma.listing.update({
      where: { id: listingId },
      data,
      include: {
        category: true,
        images: {
          orderBy: { sortOrder: 'asc' },
        },
      },
    });
  }

  async updateStatus(listingId: string, userId: string, newStatus: string) {
    const listing = await this.prisma.listing.findUnique({
      where: { id: listingId },
    });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    if (listing.sellerId !== userId) {
      throw new ForbiddenException(
        'You may only update the status of your own listing',
      );
    }

    // Validate status transition
    const validStatuses = [
      'DRAFT',
      'AVAILABLE',
      'RESERVED',
      'SOLD',
      'ARCHIVED',
    ];
    if (!validStatuses.includes(newStatus)) {
      throw new BadRequestException(
        `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      );
    }

    // Validate status transitions
    const currentStatus = listing.status;
    const invalidTransitions = {
      SOLD: ['DRAFT', 'AVAILABLE', 'RESERVED'], // Can't go back from SOLD
      ARCHIVED: ['DRAFT', 'AVAILABLE', 'RESERVED', 'SOLD'], // Can't go back from ARCHIVED
    };

    if (invalidTransitions[newStatus]?.includes(currentStatus)) {
      throw new BadRequestException(
        `Cannot change status from ${currentStatus} to ${newStatus}`,
      );
    }

    const data: any = { status: newStatus };

    // Set soldAt when status becomes SOLD
    if (newStatus === 'SOLD' && currentStatus !== 'SOLD') {
      data.soldAt = new Date();
    }

    return this.prisma.listing.update({
      where: { id: listingId },
      data,
      include: {
        category: true,
        images: {
          orderBy: { sortOrder: 'asc' },
        },
      },
    });
  }

  async delete(listingId: string, userId: string) {
    const listing = await this.prisma.listing.findUnique({
      where: { id: listingId },
    });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    if (listing.sellerId !== userId) {
      throw new ForbiddenException('You may only delete your own listing');
    }

    // Prevent deletion of listings that are SOLD or RESERVED
    if (listing.status === 'SOLD') {
      throw new BadRequestException(
        'Cannot delete a listing that has been sold',
      );
    }

    if (listing.status === 'RESERVED') {
      throw new BadRequestException(
        'Cannot delete a listing that is currently reserved. Cancel the reservation first.',
      );
    }

    return this.prisma.listing.delete({
      where: { id: listingId },
    });
  }

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

    const price =
      typeof createListingDto.price === 'string'
        ? Number(createListingDto.price)
        : createListingDto.price;

    if (typeof price !== 'number' || Number.isNaN(price) || price < 0) {
      throw new BadRequestException(
        'Listing price must be a valid non-negative number',
      );
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
