import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from '@thallesp/nestjs-better-auth';
import { auth } from './modules/auth/auth.config.js';

import { DatabaseModule } from './database/database.module.js';

import { AppService } from './app.service.js';
import { AppController } from './app.controller.js';

import { UsersModule } from './modules/users/users.module.js';
import { UploadsModule } from './modules/uploads/uploads.module.js';
import { ListingsModule } from './modules/listings/listings.module.js';
import { SearchModule } from './modules/search/search.module.js';
import { MessagingModule } from './modules/messaging/messaging.module.js';
import { TransactionsModule } from './modules/transactions/transactions.module.js';
import { ReviewsModule } from './modules/reviews/reviews.module.js';
import { NotificationsModule } from './modules/notifications/notifications.module.js';
import { HealthModule } from './modules/health/health.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    AuthModule.forRoot({
      auth,
      bodyParser: {
        json: { limit: '2mb' },
        urlencoded: { limit: '2mb', extended: true },
        rawBody: true,
      },
    }),
    UsersModule,
    UploadsModule,
    ListingsModule,
    SearchModule,
    MessagingModule,
    TransactionsModule,
    ReviewsModule,
    NotificationsModule,
    HealthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
