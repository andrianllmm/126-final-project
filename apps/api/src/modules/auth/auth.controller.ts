import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Req,
} from '@nestjs/common';

import { AuthService } from '@thallesp/nestjs-better-auth';
import { fromNodeHeaders } from 'better-auth/node';
import type { Request } from 'express';

import { auth } from './auth.config.js';
import { SetPasswordDto } from './auth.dto.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService<typeof auth>) {}

  @Post('set-password')
  async setPassword(@Req() request: Request, @Body() body: SetPasswordDto) {
    const accounts = await this.authService.api.listUserAccounts({
      headers: fromNodeHeaders(request.headers),
    });

    const hasPassword = accounts.some(
      (account) => account.providerId === 'credential',
    );

    if (hasPassword) {
      throw new BadRequestException(
        'User already has a password. Use change password instead.',
      );
    }

    return this.authService.api.setPassword({
      headers: fromNodeHeaders(request.headers),
      body,
    });
  }
}
