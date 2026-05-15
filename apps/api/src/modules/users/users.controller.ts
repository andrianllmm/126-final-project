import {
  BadRequestException,
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
import { UsersService } from './users.service.js';
import {
  AllowAnonymous,
  Session,
  type UserSession,
} from '@thallesp/nestjs-better-auth';
import { userProfileUpdateSchema } from '@repo/api';
import { ImageFileValidationPipe } from '../uploads/pipes/image-file-validation.pipe.js';
import { toUploadFile } from '../uploads/adapters/to-upload-file.js';

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
  @UseInterceptors(
    FileInterceptor('avatar', {
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    }),
  )
  updateMyProfile(
    @Session() session: UserSession,
    @Body() body: unknown,
    @UploadedFile(new ImageFileValidationPipe({ required: false }))
    avatarFile?: any,
  ) {
    const result = userProfileUpdateSchema.safeParse(body);

    if (!result.success) {
      throw new BadRequestException('Invalid profile data');
    }

    const rawBody = body as { avatar?: unknown } | null;
    const shouldRemoveAvatar = rawBody?.avatar === '' && !avatarFile;

    return this.usersService.updateProfileById(
      session.user.id,
      result.data,
      avatarFile ? toUploadFile(avatarFile) : undefined,
      shouldRemoveAvatar,
    );
  }

  @Get(':id/stats')
  @AllowAnonymous()
  getProfileStats(@Param('id') id: string) {
    return this.usersService.getProfileStats(id);
  }
}
