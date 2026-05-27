import { Controller, Get, Query } from '@nestjs/common';
import {
  OptionalAuth,
  Session,
  type UserSession,
} from '@thallesp/nestjs-better-auth';
import { ZodResponse } from 'nestjs-zod';

import { ListingPageDto } from './listings.dto.js';
import { SearchListingsQueryDto } from './search.dto.js';
import { SearchService } from './search.service.js';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  @OptionalAuth()
  @ZodResponse({ type: ListingPageDto })
  search(
    @Session() session: UserSession | undefined,
    @Query() query: SearchListingsQueryDto,
  ) {
    return this.searchService.search(query, session?.user.id);
  }
}
