import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { ListingsService } from './listings.service.js';
import { CreateListingDto } from './dto/create-listing.dto.js';
import { UpdateListingDto } from './dto/update-listing.dto.js';
import { UpdateListingStatusDto } from './dto/update-listing-status.dto.js';

@Controller('listings')
export class ListingsController {
  constructor(private readonly listingsService: ListingsService) {}

  @Get()
  @AllowAnonymous()
  findAll(@Query('sellerId') sellerId?: string) {
    return this.listingsService.findAll({ sellerId });
  }

  @Post()
  create(@Req() req: Request, @Body() createListingDto: CreateListingDto) {
    const userId = this.getAuthenticatedUserId(req);

    if (!userId) {
      throw new UnauthorizedException(
        'Authentication required to create a listing',
      );
    }

    return this.listingsService.create(userId, createListingDto);
  }

  @Patch(':id')
  update(
    @Param('id') listingId: string,
    @Req() req: Request,
    @Body() updateListingDto: UpdateListingDto,
  ) {
    const userId = this.getAuthenticatedUserId(req);

    if (!userId) {
      throw new UnauthorizedException(
        'Authentication required to update a listing',
      );
    }

    return this.listingsService.update(listingId, userId, updateListingDto);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') listingId: string,
    @Req() req: Request,
    @Body() updateStatusDto: UpdateListingStatusDto,
  ) {
    const userId = this.getAuthenticatedUserId(req);

    if (!userId) {
      throw new UnauthorizedException(
        'Authentication required to update listing status',
      );
    }

    return this.listingsService.updateStatus(
      listingId,
      userId,
      updateStatusDto.status,
    );
  }

  private getAuthenticatedUserId(req: Request): string | undefined {
    const anyReq = req as any;

    if (anyReq.user?.id) {
      return anyReq.user.id;
    }

    if (anyReq.user?.sub) {
      return anyReq.user.sub;
    }

    if (anyReq.session?.user?.id) {
      return anyReq.session.user.id;
    }

    return undefined;
  }
}
