import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @AllowAnonymous()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @AllowAnonymous()
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }
}
