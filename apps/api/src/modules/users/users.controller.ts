import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';

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

  @Get(':id/stats')
  @AllowAnonymous()
  getProfileStats(@Param('id') id: string) {
    return this.usersService.getProfileStats(id);
  }
}
