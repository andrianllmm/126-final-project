import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from '@thallesp/nestjs-better-auth';
import { auth } from './core/auth/auth.js';

import { PrismaService } from './prisma/prisma.service.js';

import { AppService } from './app.service.js';
import { AppController } from './app.controller.js';
import { UsersModule } from './modules/users/users.module.js';
import { UsersService } from './modules/users/users.service.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule.forRoot({
      auth,
      bodyParser: {
        json: { limit: '2mb' },
        urlencoded: { limit: '2mb', extended: true },
        rawBody: true,
      },
    }),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService, UsersService],
})
export class AppModule {}
