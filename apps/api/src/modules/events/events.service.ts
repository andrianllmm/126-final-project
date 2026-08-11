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

  async getRecentSearchQueries(
    userId: string,
    limit = 10,
  ): Promise<string[]> {
    const events = await this.prisma.userEvent.findMany({
      where: { userId, eventType: 'SEARCH' },
      orderBy: { createdAt: 'desc' },
      take: 50,
      select: { metadata: true },
    });

    const seen = new Set<string>();
    const queries: string[] = [];

    for (const event of events) {
      const metadata = event.metadata as Record<string, unknown> | null;
      const q = typeof metadata?.q === 'string' ? metadata.q.trim() : '';
      if (!q) continue;

      const key = q.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);

      queries.push(q);
      if (queries.length >= limit) break;
    }

    return queries;
  }

  async clearSearchHistory(userId: string): Promise<void> {
    await this.prisma.userEvent.deleteMany({
      where: { userId, eventType: 'SEARCH' },
    });
  }
}
