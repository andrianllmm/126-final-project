import { Body, Controller, Post } from '@nestjs/common';
import { OptionalAuth, Session, type UserSession } from '@thallesp/nestjs-better-auth';

import { EventsService } from './events.service.js';
import { CreateUserEventDto } from './events.dto.js';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

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

    return { ok: true };
  }
}
