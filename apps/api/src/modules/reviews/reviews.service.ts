import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { CreateReviewDto } from './dto/create-review.dto.js';

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(reviewerId: string, dto: CreateReviewDto) {
    const { transactionId, listingId, rating, comment } = dto;

    const transaction = await this.prisma.transaction.findUnique({
      where: { transactionId },
      include: { listing: true },
    });

    if (!transaction) throw new NotFoundException('Transaction not found');

    if (transaction.listingId !== listingId) {
      throw new BadRequestException('Listing does not match transaction');
    }

    if (transaction.status !== 'COMPLETED') {
      throw new BadRequestException(
        'Can only review after transaction is completed',
      );
    }

    const isBuyer = transaction.buyerId === reviewerId;
    const isSeller = transaction.sellerId === reviewerId;

    if (!isBuyer && !isSeller) {
      throw new ForbiddenException(
        'Only participants of the transaction can leave a review',
      );
    }

    const role = isBuyer ? 'BUYER_TO_SELLER' : 'SELLER_TO_BUYER';

    const existing = await this.prisma.review.findFirst({
      where: {
        transactionId,
        role,
      },
    });

    if (existing) {
      throw new ConflictException(
        'A review for this transaction and role already exists',
      );
    }

    const revieweeId = isBuyer ? transaction.sellerId : transaction.buyerId;

    const review = await this.prisma.review.create({
      data: {
        reviewerId,
        revieweeId,
        listingId,
        transactionId,
        rating,
        comment,
        role,
      },
    });

    // create a notification for the reviewee
    await this.prisma.notification.create({
      data: {
        userId: revieweeId,
        type: 'RATING',
        title: 'You received a new rating',
        message: `You received a ${rating} star rating`,
      },
    });

    return review;
  }

  async findByUser(userId: string) {
    return this.prisma.review.findMany({
      where: { revieweeId: userId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
