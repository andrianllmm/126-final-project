import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppService } from './app.service';
import { AppController } from './app.controller';
import { UsersModule } from './users/users.module';
import { PrismaService } from './prisma/prisma.service';
import { UsersService } from './users/users.service';

@Module({
  imports: [ConfigModule.forRoot(), UsersModule],
  controllers: [AppController],
  providers: [AppService, PrismaService, UsersService],
})
export class AppModule {}
