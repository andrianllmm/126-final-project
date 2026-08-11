import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { UserEventType } from '@repo/api';
import { Prisma } from '../../generated/prisma/client.js';

export interface LogEventInput {
  userId?: string;
  listingId?: string;
  eventType: UserEventType;
  metadata?: Record<string, unknown>;
}

@Injectable()
export class EventsService {
  private readonly logger = new Logger(EventsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async logEvent(input: LogEventInput): Promise<void> {
    await this.prisma.userEvent.create({
      data: {
        userId: input.userId ?? null,
        listingId: input.listingId ?? null,
        eventType: input.eventType,
        metadata: input.metadata as Prisma.InputJsonValue | undefined,
      },
    });
  }

  logEventAsync(input: LogEventInput): void {
    this.logEvent(input).catch((err) =>
      this.logger.error(`Failed to log event ${input.eventType}`, err),
    );
  }
}
