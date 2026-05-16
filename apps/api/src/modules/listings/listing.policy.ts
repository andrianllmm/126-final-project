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

  async assertOwnerByListingId(listingId: string, userId: string) {
    const listing = await this.prisma.listing.findUnique({
      where: { id: listingId },
      select: { sellerId: true },
    });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    if (listing.sellerId !== userId) {
      throw new ForbiddenException('Not allowed');
    }
  }

  assertOwner(listing: Pick<Listing, 'sellerId'> | null, userId: string) {
    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

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
