import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { NotificationsService } from '../notifications/notifications.service.js';
import { NotificationType } from '@repo/api';
import { CreateOfferDto } from './offers.dto.js';
import type { Notification as NotificationRecord } from '../../generated/prisma/client.js';

@Injectable()
export class OffersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
  ) {}

  private assertOfferable(
    transaction: {
      status: string;
      buyerId: string;
      sellerId: string;
    },
    userId: string,
  ) {
    const isParticipant =
      transaction.buyerId === userId || transaction.sellerId === userId;

    if (!isParticipant) {
      throw new ForbiddenException('Not allowed');
    }

    if (
      transaction.status === 'COMPLETED' ||
      transaction.status === 'CANCELLED'
    ) {
      throw new BadRequestException('Cannot create offers on this transaction');
    }
  }

  private getCounterpartyId(
    transaction: {
      buyerId: string;
      sellerId: string;
    },
    userId: string,
  ) {
    return transaction.buyerId === userId
      ? transaction.sellerId
      : transaction.buyerId;
  }

  async createOffer(userId: string, dto: CreateOfferDto) {
    const transaction = await this.prisma.transaction.findUnique({
      where: { transactionId: dto.transactionId },
      include: { listing: true },
    });

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    this.assertOfferable(transaction, userId);

    if (
      dto.price === undefined &&
      dto.meetupLocation === undefined &&
      dto.meetupTime === undefined
    ) {
      throw new BadRequestException('Offer must include at least one change');
    }

    let meetupLocationId: number | undefined;

    if (dto.meetupLocation) {
      const createdLocation = await this.prisma.$queryRaw<
        Array<{ id: number }>
      >`
        INSERT INTO "Location" ("name", "position")
        VALUES (
          ${dto.meetupLocation.name},
          ST_SetSRID(
            ST_MakePoint(
              ${dto.meetupLocation.position.coordinates[0]},
              ${dto.meetupLocation.position.coordinates[1]}
            ),
            4326
          )
        )
        RETURNING "id";
      `;

      meetupLocationId = createdLocation[0]?.id;
    }

    const offer = await this.prisma.offer.create({
      data: {
        transactionId: dto.transactionId,
        proposerId: userId,
        price: dto.price,
        meetupLocationId,
        meetupTime: dto.meetupTime,
      },
      include: {
        meetupLocation: true,
      },
    });

    const notification = await this.notificationsService.create(
      this.getCounterpartyId(transaction, userId),
      NotificationType.TRANSACTION,
      'New offer received',
      `New offer for ${transaction.listing.title}`,
      undefined,
      `/transactions/${dto.transactionId}`,
    );

    this.notificationsService.emitCreated(notification as NotificationRecord);

    return offer;
  }

  async getOffers(transactionId: string, userId: string) {
    const transaction = await this.prisma.transaction.findUnique({
      where: { transactionId },
    });

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    const isParticipant =
      transaction.buyerId === userId || transaction.sellerId === userId;

    if (!isParticipant) {
      throw new ForbiddenException('Not allowed');
    }

    return this.prisma.offer.findMany({
      where: { transactionId },
      orderBy: { createdAt: 'desc' },
      include: {
        meetupLocation: true,
      },
    });
  }

  async acceptOffer(offerId: string, userId: string) {
    const offer = await this.prisma.offer.findUnique({
      where: { id: offerId },
      include: { transaction: { include: { listing: true } } },
    });

    if (!offer) {
      throw new NotFoundException('Offer not found');
    }

    const isParticipant =
      offer.transaction.buyerId === userId ||
      offer.transaction.sellerId === userId;

    if (!isParticipant) {
      throw new ForbiddenException('Not allowed');
    }

    if (
      offer.transaction.status === 'COMPLETED' ||
      offer.transaction.status === 'CANCELLED'
    ) {
      throw new BadRequestException('Cannot accept offers on this transaction');
    }

    if (offer.proposerId === userId) {
      throw new BadRequestException('You cannot accept your own offer');
    }

    if (offer.status !== 'PENDING') {
      throw new BadRequestException('Offer is no longer pending');
    }

    const counterpartyId = this.getCounterpartyId(offer.transaction, userId);

    return this.prisma.$transaction(async (tx) => {
      await tx.offer.update({
        where: { id: offerId },
        data: { status: 'ACCEPTED' },
      });

      await tx.offer.updateMany({
        where: {
          transactionId: offer.transactionId,
          id: { not: offerId },
        },
        data: { status: 'SUPERSEDED' },
      });

      const transaction = await tx.transaction.update({
        where: { transactionId: offer.transactionId },
        data: {
          agreedPrice: offer.price ?? offer.transaction.agreedPrice,
          ...(offer.meetupLocationId !== null
            ? { meetupLocationId: offer.meetupLocationId }
            : {}),
          ...(offer.meetupTime !== undefined
            ? { meetupTime: offer.meetupTime }
            : {}),
          status: 'ACCEPTED',
        },
        include: {
          listing: true,
          buyer: true,
          seller: true,
          meetupLocation: true,
        },
      });

      await tx.listing.update({
        where: { id: offer.transaction.listingId },
        data: { status: 'RESERVED' },
      });

      const notification = await this.notificationsService.createWithTx(
        tx,
        counterpartyId,
        NotificationType.TRANSACTION,
        'Offer accepted',
        `Your offer for ${offer.transaction.listing.title} was accepted`,
        undefined,
        `/transactions/${offer.transactionId}`,
      );
      this.notificationsService.emitCreated(notification as NotificationRecord);

      return transaction;
    });
  }

  async rejectOffer(offerId: string, userId: string) {
    const offer = await this.prisma.offer.findUnique({
      where: { id: offerId },
      include: { transaction: { include: { listing: true } } },
    });

    if (!offer) {
      throw new NotFoundException('Offer not found');
    }

    const isParticipant =
      offer.transaction.buyerId === userId ||
      offer.transaction.sellerId === userId;

    if (!isParticipant) {
      throw new ForbiddenException('Not allowed');
    }

    if (
      offer.transaction.status === 'COMPLETED' ||
      offer.transaction.status === 'CANCELLED'
    ) {
      throw new BadRequestException('Cannot reject offers on this transaction');
    }

    if (offer.proposerId === userId) {
      throw new BadRequestException('You cannot reject your own offer');
    }

    if (offer.status !== 'PENDING') {
      throw new BadRequestException('Offer is no longer pending');
    }

    const counterpartyId = this.getCounterpartyId(offer.transaction, userId);

    const rejectedOffer = await this.prisma.offer.update({
      where: { id: offerId },
      data: { status: 'REJECTED' },
    });

    const notification = await this.notificationsService.create(
      counterpartyId,
      NotificationType.TRANSACTION,
      'Offer rejected',
      `Your offer for ${offer.transaction.listing.title} was rejected`,
      undefined,
      `/transactions/${offer.transactionId}`,
    );
    this.notificationsService.emitCreated(notification as NotificationRecord);

    return rejectedOffer;
  }
}
