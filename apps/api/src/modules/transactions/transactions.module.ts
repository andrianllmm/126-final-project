import { Module } from '@nestjs/common';
import { TransactionsController } from './transactions.controller.js';
import { TransactionsService } from './transactions.service.js';
import { NotificationsModule } from '../notifications/notifications.module.js';
import { EventsModule } from '../events/events.module.js';

@Module({
  imports: [NotificationsModule, EventsModule],
  controllers: [TransactionsController],
  providers: [TransactionsService],
})
export class TransactionsModule {}
