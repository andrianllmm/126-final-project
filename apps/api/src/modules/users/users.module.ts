import { Module } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { UsersController } from './users.controller.js';
import { DatabaseModule } from '../../database/database.module.js';
import { UploadsModule } from '../uploads/uploads.module.js';

@Module({
  imports: [DatabaseModule, UploadsModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
