import { Module } from '@nestjs/common';
import { MessagingGateway } from './messaging.gateway.js';
import { MessagingService } from './messaging.service.js';
import { MessagingController } from './messaging.controller.js';
import { DatabaseModule } from '../../database/database.module.js';

@Module({
  imports: [DatabaseModule],
  controllers: [MessagingController],
  providers: [MessagingGateway, MessagingService],
  exports: [MessagingService],
})
export class MessagingModule {}
