import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { NotificationType, ReviewRole, TransactionStatus } from '@repo/api';
import { PrismaService } from '../../database/prisma.service.js';
import { CreateReviewDto } from './dto/create-review.dto.js';
import { NotificationsService } from '../notifications/notifications.service.js';

@Injectable()
export class ReviewsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
  ) {}

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

    if (transaction.status !== TransactionStatus.COMPLETED) {
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

    const role = isBuyer
      ? ReviewRole.BUYER_TO_SELLER
      : ReviewRole.SELLER_TO_BUYER;

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

    const { review, notification } = await this.prisma.$transaction(
      async (tx) => {
        const createdReview = await tx.review.create({
          data: {
            reviewerId,
            revieweeId,
            listingId,
            transactionId,
            rating,
            comment: comment?.trim() || null,
            role,
          },
        });

        const createdNotification =
          await this.notificationsService.createWithTx(
            tx,
            revieweeId,
            NotificationType.RATING,
            'You received a new review',
            `You received a ${rating}-star review`,
            undefined,
            `/transactions/${transactionId}`,
          );

        return {
          review: createdReview,
          notification: createdNotification,
        };
      },
    );

    this.notificationsService.emitCreated(notification);

    return review;
  }

  async findByUser(userId: string) {
    return this.prisma.review.findMany({
      where: { revieweeId: userId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
