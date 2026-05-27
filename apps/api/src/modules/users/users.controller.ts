import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import {
  AllowAnonymous,
  Session,
  type UserSession,
} from '@thallesp/nestjs-better-auth';

import { ZodResponse } from 'nestjs-zod';

import {
  UserProfileDto,
  UpdateMyProfileDto,
  UserProfileStatsDto,
} from './users.dto.js';
import { ListingListDto } from '../listings/listings.dto.js';

import { UsersService } from './users.service.js';
import { ImageFileValidationPipe } from '../uploads/pipes/image-file-validation.pipe.js';
import { toUploadFile } from '../uploads/adapters/to-upload-file.js';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id/profile')
  @AllowAnonymous()
  @ZodResponse({ type: UserProfileDto })
  async getProfile(@Param('id') id: string) {
    const profile = await this.usersService.findProfileById(id);

    if (!profile) {
      throw new NotFoundException('User profile not found');
    }

    return profile;
  }

  @Patch('me/profile')
  @ZodResponse({ type: UserProfileDto })
  async updateMyProfile(
    @Session() session: UserSession,
    @Body() body: UpdateMyProfileDto,
  ) {
    return this.usersService.updateProfileById(session.user.id, body);
  }

  @Post('me/avatar')
  @UseInterceptors(
    FileInterceptor('avatar', {
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  @ZodResponse({ type: UserProfileDto })
  async uploadMyAvatar(
    @Session() session: UserSession,
    @UploadedFile(new ImageFileValidationPipe({ required: true }))
    avatarFile: any,
  ) {
    return this.usersService.setAvatar(
      session.user.id,
      toUploadFile(avatarFile),
    );
  }

  @Delete('me/avatar')
  @ZodResponse({ type: UserProfileDto })
  async removeMyAvatar(@Session() session: UserSession) {
    return this.usersService.removeAvatar(session.user.id);
  }

  @Get('me/liked-listings')
  @ZodResponse({ type: ListingListDto })
  getMyLikedListings(@Session() session: UserSession) {
    return this.usersService.getLikedListings(session.user.id);
  }

  @Get(':id/stats')
  @AllowAnonymous()
  @ZodResponse({ type: UserProfileStatsDto })
  getProfileStats(@Param('id') id: string) {
    return this.usersService.getProfileStats(id);
  }
}
