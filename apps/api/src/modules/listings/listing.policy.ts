import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { ListingStatus } from '@repo/api';
import { LISTING_STATUS_TRANSITIONS } from './listings.constants.js';
import { Listing } from '../../generated/prisma/client.js';

@Injectable()
export class ListingPolicy {
  constructor(private readonly prisma: PrismaService) {}

  assertOwner(listing: Listing, userId: string) {
    if (listing.sellerId !== userId) {
      throw new ForbiddenException('Not allowed');
    }
  }

  assertCanDelete(listing: Listing) {
    if (
      listing.status === ListingStatus.SOLD ||
      listing.status === ListingStatus.RESERVED
    ) {
      throw new BadRequestException('Listing cannot be deleted');
    }
  }

  assertValidStatusTransition(from: ListingStatus, to: ListingStatus) {
    const allowed = LISTING_STATUS_TRANSITIONS[from];

    if (!allowed.includes(to)) {
      throw new BadRequestException(`Invalid transition ${from} to ${to}`);
    }
  }

  async assertValidCategory(categoryId: string) {
    const exists = await this.prisma.listingCategory.findUnique({
      where: { id: categoryId },
      select: { id: true },
    });

    if (!exists) {
      throw new NotFoundException('Category not found');
    }
  }
}
