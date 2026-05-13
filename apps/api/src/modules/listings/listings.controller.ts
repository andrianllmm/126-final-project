import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { ListingsService } from './listings.service.js';
import { CreateListingDto } from './dto/create-listing.dto.js';

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
      throw new UnauthorizedException('Authentication required to create a listing');
    }

    return this.listingsService.create(userId, createListingDto);
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
