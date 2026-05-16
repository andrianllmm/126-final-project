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
import { CreateListingDto } from './dto/create-listing.dto.js';
import { UpdateListingDto } from './dto/update-listing.dto.js';
import { UpdateListingStatusDto } from './dto/update-listing-status.dto.js';

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
  findOne(@Param('id') listingId: string) {
    return this.listingsService.findOne(listingId);
  }

  @Post()
  create(
    @Session() session: UserSession,
    @Body() createListingDto: CreateListingDto,
  ) {
    return this.listingsService.create(session.user.id, createListingDto);
  }

  @Patch(':id')
  update(
    @Param('id') listingId: string,
    @Session() session: UserSession,
    @Body() updateListingDto: UpdateListingDto,
  ) {
    return this.listingsService.update(
      listingId,
      session.user.id,
      updateListingDto,
    );
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') listingId: string,
    @Session() session: UserSession,
    @Body() updateStatusDto: UpdateListingStatusDto,
  ) {
    return this.listingsService.updateStatus(
      listingId,
      session.user.id,
      updateStatusDto.status,
    );
  }

  @Delete(':id')
  delete(@Param('id') listingId: string, @Session() session: UserSession) {
    return this.listingsService.delete(listingId, session.user.id);
  }
}
