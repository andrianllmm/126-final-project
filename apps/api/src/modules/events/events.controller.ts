import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { OptionalAuth, Session, type UserSession } from '@thallesp/nestjs-better-auth';
import { ZodResponse } from 'nestjs-zod';

import { EventsService } from './events.service.js';
import { UserEmbeddingService } from './user-embedding.service.js';
import { CreateUserEventDto, SearchHistoryDto } from './events.dto.js';

@Controller('events')
export class EventsController {
  constructor(
    private readonly eventsService: EventsService,
    private readonly userEmbeddingService: UserEmbeddingService,
  ) {}

  @Post()
  @OptionalAuth()
  create(
    @Session() session: UserSession | undefined,
    @Body() body: CreateUserEventDto,
  ) {
    this.eventsService.logEventAsync({
      userId: session?.user.id,
      listingId: body.listingId,
      eventType: body.eventType,
      metadata: body.metadata,
    });

    if (session?.user.id && body.eventType === 'SEARCH') {
      this.userEmbeddingService.triggerRecompute(session.user.id);
    }

    return { ok: true };
  }

  @Get('search-history')
  @ZodResponse({ type: SearchHistoryDto })
  getSearchHistory(
    @Session() session: UserSession,
    @Query('limit') limit?: string,
  ) {
    return this.eventsService.getRecentSearchQueries(
      session.user.id,
      limit ? Number(limit) : undefined,
    );
  }

  @Delete('search-history')
  async clearSearchHistory(@Session() session: UserSession) {
    await this.eventsService.clearSearchHistory(session.user.id);
    return { ok: true };
  }
}
