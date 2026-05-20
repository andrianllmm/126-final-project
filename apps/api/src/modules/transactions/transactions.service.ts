import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import {
  CreateTransactionDto,
  TransactionQueryDto,
} from './transactions.dto.js';
import { NotificationsService } from '../notifications/notifications.service.js';
import { ListingStatus, NotificationType, TransactionStatus } from '@repo/api';
import { PrismaTx } from '../../common/prisma-tx.js';

@Injectable()
export class TransactionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async createTransaction(buyerId: string, createDto: CreateTransactionDto) {
    const activeTransaction = await this.prisma.transaction.findFirst({
      where: {
        listingId: createDto.listingId,
        status: { in: ['PENDING', 'ACCEPTED'] },
      },
    });

    if (activeTransaction) {
      throw new ConflictException('Listing already has an active transaction');
    }

    const listing = await this.prisma.listing.findUnique({
      where: { id: createDto.listingId },
    });

    if (!listing || listing.status !== 'AVAILABLE') {
      throw new BadRequestException('Listing is not available');
    }

    if (listing.sellerId === buyerId) {
      throw new BadRequestException(
        'You cannot create a transaction for your own listing',
      );
    }

    return this.prisma.$transaction(async (tx) => {
      const transaction = await tx.transaction.create({
        data: {
          listingId: createDto.listingId,
          buyerId,
          sellerId: listing.sellerId,
          agreedPrice: listing.price,
          status: 'PENDING',
        },
        include: {
          listing: true,
          buyer: true,
          seller: true,
        },
      });

      await this.notificationsService.createWithTx(
        tx,
        buyerId,
        NotificationType.TRANSACTION,
        'Purchase requested',
        `Transaction created for ${listing.title}`,
      );

      await this.notificationsService.createWithTx(
        tx,
        listing.sellerId,
        NotificationType.TRANSACTION,
        'New purchase request',
        `You received a transaction request for ${listing.title}`,
      );

      return transaction;
    });
  }

  async acceptTransaction(transactionId: string, sellerId: string) {
    const transaction = await this.prisma.transaction.findUnique({
      where: { transactionId },
      include: { listing: true },
    });

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    if (transaction.sellerId !== sellerId) {
      throw new ForbiddenException(
        'You are not allowed to accept this transaction',
      );
    }

    this.validateStateTransition(transaction.status, 'ACCEPTED');

    return this.prisma.$transaction(async (tx) => {
      const updatedTransaction = await tx.transaction.update({
        where: { transactionId },
        data: { status: 'ACCEPTED' },
        include: { listing: true, buyer: true, seller: true },
      });

      await tx.listing.update({
        where: { id: transaction.listingId },
        data: { status: 'RESERVED' },
      });

      await this.notificationsService.createWithTx(
        tx,
        transaction.buyerId,
        NotificationType.TRANSACTION,
        'Transaction accepted',
        `${transaction.listing.title} transaction was accepted`,
      );

      return updatedTransaction;
    });
  }

  async rejectTransaction(transactionId: string, sellerId: string) {
    const transaction = await this.prisma.transaction.findUnique({
      where: { transactionId },
      include: { listing: true },
    });

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    if (transaction.sellerId !== sellerId) {
      throw new ForbiddenException(
        'You are not allowed to reject this transaction',
      );
    }

    this.validateStateTransition(transaction.status, 'REJECTED');

    return this.prisma.$transaction(async (tx) => {
      const updatedTransaction = await tx.transaction.update({
        where: { transactionId },
        data: { status: 'REJECTED' },
        include: { listing: true, buyer: true, seller: true },
      });

      await this.syncListingStatus(tx, transaction.listingId, 'REJECTED');

      await this.notificationsService.createWithTx(
        tx,
        transaction.buyerId,
        NotificationType.TRANSACTION,
        'Transaction rejected',
        `${transaction.listing.title} transaction was rejected`,
      );

      return updatedTransaction;
    });
  }

  async completeTransaction(transactionId: string, sellerId: string) {
    const transaction = await this.prisma.transaction.findUnique({
      where: { transactionId },
      include: { listing: true },
    });

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    if (transaction.sellerId !== sellerId) {
      throw new ForbiddenException(
        'You are not allowed to complete this transaction',
      );
    }

    this.validateStateTransition(transaction.status, 'COMPLETED');

    return this.prisma.$transaction(async (tx) => {
      const updatedTransaction = await tx.transaction.update({
        where: { transactionId },
        data: {
          status: 'COMPLETED',
          completedAt: new Date(),
        },
        include: { listing: true, buyer: true, seller: true },
      });

      await tx.listing.update({
        where: { id: transaction.listingId },
        data: {
          status: 'SOLD',
          soldAt: new Date(),
        },
      });

      await this.notificationsService.createWithTx(
        tx,
        transaction.buyerId,
        NotificationType.TRANSACTION,
        'Transaction completed',
        `${transaction.listing.title} transaction completed`,
      );
      await this.notificationsService.createWithTx(
        tx,
        transaction.sellerId,
        NotificationType.TRANSACTION,
        'Transaction completed',
        `${transaction.listing.title} transaction completed`,
      );

      return updatedTransaction;
    });
  }

  async cancelTransaction(transactionId: string, userId: string) {
    const transaction = await this.prisma.transaction.findUnique({
      where: { transactionId },
      include: { listing: true },
    });

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    const isParticipant =
      transaction.buyerId === userId || transaction.sellerId === userId;

    if (!isParticipant) {
      throw new ForbiddenException(
        'You are not allowed to cancel this transaction',
      );
    }

    this.validateStateTransition(transaction.status, 'CANCELLED');

    return this.prisma.$transaction(async (tx) => {
      const updatedTransaction = await tx.transaction.update({
        where: { transactionId },
        data: { status: 'CANCELLED' },
        include: { listing: true, buyer: true, seller: true },
      });

      await this.syncListingStatus(tx, transaction.listingId, 'CANCELLED');

      await tx.notification.createMany({
        data: [
          {
            userId: transaction.buyerId,
            type: NotificationType.TRANSACTION,
            title: 'Transaction cancelled',
            message: `${transaction.listing.title} transaction cancelled`,
          },
          {
            userId: transaction.sellerId,
            type: NotificationType.TRANSACTION,
            title: 'Transaction cancelled',
            message: `${transaction.listing.title} transaction cancelled`,
          },
        ],
      });

      return updatedTransaction;
    });
  }

  async getUserTransactions(userId: string, query: TransactionQueryDto) {
    const limit = query.limit ?? 10;
    const offset = query.offset ?? 0;

    const where = {
      ...(query.role === 'buyer' && { buyerId: userId }),
      ...(query.role === 'seller' && { sellerId: userId }),
      ...((!query.role || query.role === 'all') && {
        OR: [{ buyerId: userId }, { sellerId: userId }],
      }),
      ...(query.status && { status: query.status }),
      ...(query.listingId && { listingId: query.listingId }),
    };

    const orderBy = {
      [query.sortBy ?? 'createdAt']: query.sortOrder ?? 'desc',
    };

    const [transactions, total] = await Promise.all([
      this.prisma.transaction.findMany({
        where,
        include: {
          listing: {
            include: {
              images: { include: { upload: true } },
            },
          },
          buyer: true,
          seller: true,
        },
        orderBy,
        skip: offset,
        take: limit,
      }),
      this.prisma.transaction.count({ where }),
    ]);

    return {
      data: transactions,
      meta: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    };
  }

  async getTransaction(transactionId: string, userId: string) {
    const transaction = await this.prisma.transaction.findUnique({
      where: { transactionId },
      include: {
        listing: {
          include: {
            images: { include: { upload: true } },
          },
        },
        buyer: true,
        seller: true,
        reviews: true,
      },
    });

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    const isParticipant =
      transaction.buyerId === userId || transaction.sellerId === userId;

    if (!isParticipant) {
      throw new ForbiddenException(
        'You are not allowed to view this transaction',
      );
    }

    return transaction;
  }

  async hasActiveTransaction(listingId: string): Promise<boolean> {
    const transaction = await this.prisma.transaction.findFirst({
      where: {
        listingId,
        status: { in: ['PENDING', 'ACCEPTED'] },
      },
    });

    return !!transaction;
  }

  private validateStateTransition(
    currentStatus: TransactionStatus,
    newStatus: TransactionStatus,
  ): void {
    const validTransitions: Record<TransactionStatus, TransactionStatus[]> = {
      PENDING: ['ACCEPTED', 'REJECTED', 'CANCELLED'],
      ACCEPTED: ['COMPLETED', 'CANCELLED'],
      REJECTED: [],
      COMPLETED: [],
      CANCELLED: [],
    };

    if (!validTransitions[currentStatus].includes(newStatus)) {
      throw new BadRequestException('Invalid status transition');
    }
  }

  private async syncListingStatus(
    tx: PrismaTx,
    listingId: string,
    newStatus: TransactionStatus,
  ): Promise<void> {
    const listingUpdates: Record<
      TransactionStatus,
      { status: ListingStatus; soldAt?: Date } | null
    > = {
      PENDING: null,
      ACCEPTED: { status: 'RESERVED' },
      REJECTED: { status: 'AVAILABLE' },
      COMPLETED: { status: 'SOLD', soldAt: new Date() },
      CANCELLED: { status: 'AVAILABLE' },
    };
    const update = listingUpdates[newStatus];
    if (update) {
      await tx.listing.update({ where: { id: listingId }, data: update });
    }
  }
}
