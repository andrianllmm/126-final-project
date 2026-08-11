import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import {
  Module,
  HttpException,
  ArgumentsHost,
  Logger,
  Catch,
} from '@nestjs/common';
import {
  ZodValidationPipe,
  ZodSerializerInterceptor,
  ZodSerializationException,
} from 'nestjs-zod';
import {
  APP_PIPE,
  APP_INTERCEPTOR,
  APP_FILTER,
  BaseExceptionFilter,
} from '@nestjs/core';
import { ZodError } from 'zod';

import { join } from 'path';

import { AuthModule } from '@thallesp/nestjs-better-auth';
import { auth } from './modules/auth/auth.config.js';

import { DatabaseModule } from './database/database.module.js';

import { AppService } from './app.service.js';
import { AppController } from './app.controller.js';

import { EmailModule } from './modules/email/email.module.js';
import { UsersModule } from './modules/users/users.module.js';
import { UploadsModule } from './modules/uploads/uploads.module.js';
import { ListingsModule } from './modules/listings/listings.module.js';
import { MessagingModule } from './modules/messaging/messaging.module.js';
import { TransactionsModule } from './modules/transactions/transactions.module.js';
import { OffersModule } from './modules/transactions/offers.module.js';
import { ReviewsModule } from './modules/reviews/reviews.module.js';
import { NotificationsModule } from './modules/notifications/notifications.module.js';
import { EventsModule } from './modules/events/events.module.js';
import { HealthModule } from './modules/health/health.module.js';
import { AuthController } from './modules/auth/auth.controller.js';

import { env } from './config/env.js';

@Catch(HttpException)
class HttpExceptionFilter extends BaseExceptionFilter {
  private logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    if (exception instanceof ZodSerializationException) {
      const zodError = exception.getZodError();

      if (zodError instanceof ZodError) {
        this.logger.error(`ZodSerializationException: ${zodError.message}`);
      }
    }

    super.catch(exception, host);
  }
}

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    EmailModule,
    AuthModule.forRoot({
      auth,
      bodyParser: {
        json: { limit: '2mb' },
        urlencoded: { limit: '2mb', extended: true },
        rawBody: true,
      },
    }),
    UsersModule,
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), env.uploadDir),
      serveRoot: '/uploads',
      serveStaticOptions: {
        index: false,
      },
    }),
    UploadsModule,
    ListingsModule,
    MessagingModule,
    TransactionsModule,
    OffersModule,
    ReviewsModule,
    NotificationsModule,
    EventsModule,
    HealthModule,
  ],
  controllers: [AppController, AuthController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ZodSerializerInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
