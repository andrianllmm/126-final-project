import { Module } from '@nestjs/common';

import { EventsController } from './events.controller.js';
import { EventsService } from './events.service.js';
import { UserEmbeddingService } from './user-embedding.service.js';
import { EmbeddingsModule } from '../embeddings/embeddings.module.js';

@Module({
  imports: [EmbeddingsModule],
  controllers: [EventsController],
  providers: [EventsService, UserEmbeddingService],
  exports: [EventsService, UserEmbeddingService],
})
export class EventsModule {}
