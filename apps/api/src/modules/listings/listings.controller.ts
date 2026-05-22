import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ZodResponse } from 'nestjs-zod';
import {
  AllowAnonymous,
  OptionalAuth,
  Session,
  type UserSession,
} from '@thallesp/nestjs-better-auth';

import { ListingsService } from './listings.service.js';
import {
  CreateListingDto,
  ListingDto,
  ListingListDto,
  UpdateListingDto,
  UpdateListingStatusDto,
} from './listings.dto.js';
import { TransactionStatus } from '@repo/api';

@Controller('listings')
export class ListingsController {
  constructor(private readonly listingsService: ListingsService) {}

  @Get()
  @AllowAnonymous()
  @ZodResponse({ type: ListingListDto })
  findAll() {
    return this.listingsService.findAll();
  }

  @Get(':id')
  @OptionalAuth()
  @ZodResponse({ type: ListingDto })
  findOne(@Param('id') id: string) {
    return this.listingsService.findOne(id);
  }

  @Post()
  @ZodResponse({ type: ListingDto })
  create(@Session() session: UserSession, @Body() body: CreateListingDto) {
    return this.listingsService.create(session.user.id, body);
  }

  @Patch(':id')
  @ZodResponse({ type: ListingDto })
  update(
    @Param('id') id: string,
    @Session() session: UserSession,
    @Body() body: UpdateListingDto,
  ) {
    return this.listingsService.update(id, session.user.id, body);
  }

  @Patch(':id/status')
  @ZodResponse({ type: ListingDto })
  updateStatus(
    @Param('id') id: string,
    @Session() session: UserSession,
    @Body() body: UpdateListingStatusDto,
  ) {
    return this.listingsService.updateStatus(id, session.user.id, body.status);
  }

  @Delete(':id')
  @ZodResponse({ type: ListingDto })
  delete(@Param('id') id: string, @Session() session: UserSession) {
    return this.listingsService.delete(id, session.user.id);
  }

  @Get(':id/transactions')
  getListingTransactions(
    @Param('id') listingId: string,
    @Query('status') status?: TransactionStatus | TransactionStatus[],
  ) {
    return this.listingsService.getListingTransactions(listingId, status);
  }
}
