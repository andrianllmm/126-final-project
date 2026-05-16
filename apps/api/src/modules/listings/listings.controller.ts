import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  AllowAnonymous,
  OptionalAuth,
  Session,
  type UserSession,
} from '@thallesp/nestjs-better-auth';

import { ListingsService } from './listings.service.js';
import {
  CreateListingDto,
  UpdateListingDto,
  UpdateListingStatusDto,
} from './listings.dto.js';

@Controller('listings')
export class ListingsController {
  constructor(private readonly listingsService: ListingsService) {}

  @Get()
  @AllowAnonymous()
  findAll() {
    return this.listingsService.findAll();
  }

  @Get(':id')
  @OptionalAuth()
  findOne(@Param('id') id: string) {
    return this.listingsService.findOne(id);
  }

  @Post()
  create(@Session() session: UserSession, @Body() body: CreateListingDto) {
    return this.listingsService.create(session.user.id, body);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Session() session: UserSession,
    @Body() body: UpdateListingDto,
  ) {
    return this.listingsService.update(id, session.user.id, body);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Session() session: UserSession,
    @Body() body: UpdateListingStatusDto,
  ) {
    return this.listingsService.updateStatus(id, session.user.id, body.status);
  }

  @Delete(':id')
  delete(@Param('id') id: string, @Session() session: UserSession) {
    return this.listingsService.delete(id, session.user.id);
  }
}
