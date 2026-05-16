import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
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
  @UseInterceptors(
    FileInterceptor('avatar', {
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  @ZodResponse({ type: UserProfileDto })
  updateMyProfile(
    @Session() session: UserSession,
    @Body() body: UpdateMyProfileDto,
    @UploadedFile(new ImageFileValidationPipe({ required: false }))
    avatarFile?: any,
  ) {
    const shouldRemoveAvatar =
      (body as unknown as { avatar?: unknown })?.avatar === '' && !avatarFile;

    return this.usersService.updateProfileById(
      session.user.id,
      body,
      avatarFile ? toUploadFile(avatarFile) : undefined,
      shouldRemoveAvatar,
    );
  }

  @Get(':id/stats')
  @AllowAnonymous()
  @ZodResponse({ type: UserProfileStatsDto })
  getProfileStats(@Param('id') id: string) {
    return this.usersService.getProfileStats(id);
  }
}
