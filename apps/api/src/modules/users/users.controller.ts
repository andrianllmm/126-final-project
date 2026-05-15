import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
} from '@nestjs/common';
import { UsersService } from './users.service.js';
import {
  AllowAnonymous,
  Session,
  type UserSession,
} from '@thallesp/nestjs-better-auth';
import { userProfileUpdateSchema } from '@repo/api';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id/profile')
  @AllowAnonymous()
  async getProfile(@Param('id') id: string) {
    const profile = await this.usersService.findProfileById(id);

    if (!profile) {
      throw new NotFoundException('User profile not found');
    }

    return profile;
  }

  @Patch('me/profile')
  updateMyProfile(@Session() session: UserSession, @Body() body: unknown) {
    const result = userProfileUpdateSchema.safeParse(body);

    if (!result.success) {
      throw new BadRequestException('Invalid profile data');
    }

    return this.usersService.updateProfileById(session.user.id, result.data);
  }

  @Get(':id/stats')
  @AllowAnonymous()
  getProfileStats(@Param('id') id: string) {
    return this.usersService.getProfileStats(id);
  }
}
