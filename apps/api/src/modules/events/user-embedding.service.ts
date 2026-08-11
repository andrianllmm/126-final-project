import { Injectable, Logger } from '@nestjs/common';
import pgvector from 'pgvector';
import { PrismaService } from '../../database/prisma.service.js';
import { EmbeddingsService } from '../embeddings/embeddings.service.js';
import { UserEventType } from '@repo/api';

const EVENT_WEIGHTS: Record<UserEventType, number> = {
  VIEW: 1,
  CLICK: 2,
  LIKE: 5,
  MESSAGE: 8,
  PURCHASE: 15,
  SEARCH: 1,
};

const RECENCY_HALF_LIFE_DAYS = 30;
const RECOMPUTE_STALENESS_MS = 60 * 60 * 1000; // 1h
const RECOMPUTE_EVENT_LIMIT = 200;

function parsePgvectorText(text: string): number[] {
  return text
    .slice(1, -1)
    .split(',')
    .map(Number);
}

@Injectable()
export class UserEmbeddingService {
  private readonly logger = new Logger(UserEmbeddingService.name);

  constructor(
    private readonly prisma: PrismaService,
    // Not called directly here (we average existing listing embeddings rather
    // than re-embedding text), but kept injected for parity/future use.
    private readonly embeddings: EmbeddingsService,
  ) {}

  // Fire-and-forget entry point used by event hooks elsewhere in the app.
  triggerRecompute(userId: string): void {
    this.recomputeOne(userId).catch((err) =>
      this.logger.error(`Failed to recompute embedding for user ${userId}`, err),
    );
  }

  // Idempotent — safe to call from event hooks OR a future cron sweep.
  async recomputeOne(userId: string): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { embeddingUpdatedAt: true },
    });
    if (!user) return;

    if (
      user.embeddingUpdatedAt &&
      Date.now() - user.embeddingUpdatedAt.getTime() < RECOMPUTE_STALENESS_MS
    ) {
      return;
    }

    const events = await this.prisma.userEvent.findMany({
      where: { userId, listingId: { not: null } },
      orderBy: { createdAt: 'desc' },
      take: RECOMPUTE_EVENT_LIMIT,
      select: { listingId: true, eventType: true, createdAt: true },
    });
    if (events.length === 0) return;

    const listingIds = [...new Set(events.map((e) => e.listingId as string))];

    const rows = await this.prisma.$queryRaw<
      { id: string; embedding: string | null }[]
    >`
      SELECT id, embedding::text as embedding FROM "Listing"
      WHERE id = ANY(${listingIds}) AND embedding IS NOT NULL
    `;
    const vectorsById = new Map(
      rows
        .filter((r) => r.embedding !== null)
        .map((r) => [r.id, parsePgvectorText(r.embedding as string)]),
    );
    if (vectorsById.size === 0) return;

    const now = Date.now();
    const dim = vectorsById.values().next().value!.length;
    const sum = new Array(dim).fill(0);
    let totalWeight = 0;

    for (const event of events) {
      const vector = vectorsById.get(event.listingId as string);
      if (!vector) continue;

      const daysAgo =
        (now - event.createdAt.getTime()) / (1000 * 60 * 60 * 24);
      const weight =
        EVENT_WEIGHTS[event.eventType as UserEventType] *
        Math.exp(-daysAgo / RECENCY_HALF_LIFE_DAYS);

      for (let i = 0; i < dim; i++) sum[i] += (vector[i] ?? 0) * weight;
      totalWeight += weight;
    }
    if (totalWeight === 0) return;

    const embedding = pgvector.toSql(sum.map((v) => v / totalWeight));

    await this.prisma.$executeRaw`
      UPDATE "user" SET "embedding" = ${embedding}::vector, "embeddingUpdatedAt" = now()
      WHERE "id" = ${userId}
    `;
  }

  // Not called by anything yet. Future cron:
  // `@Cron(...) sweep() { return this.userEmbeddingService.recomputeStale(); }`
  async recomputeStale(limit = 50): Promise<number> {
    const cutoff = new Date(Date.now() - RECOMPUTE_STALENESS_MS);
    const staleUsers = await this.prisma.user.findMany({
      where: {
        OR: [{ embeddingUpdatedAt: null }, { embeddingUpdatedAt: { lt: cutoff } }],
        events: { some: {} },
      },
      select: { id: true },
      take: limit,
    });

    for (const u of staleUsers) {
      await this.recomputeOne(u.id);
    }
    return staleUsers.length;
  }
}
