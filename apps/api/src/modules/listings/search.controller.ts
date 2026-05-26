import { Controller, Get, Query } from '@nestjs/common';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { ZodResponse } from 'nestjs-zod';

import { ListingListDto } from './listings.dto.js';
import { SearchListingsQueryDto } from './search.dto.js';
import { SearchService } from './search.service.js';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  @AllowAnonymous()
  @ZodResponse({ type: ListingListDto })
  search(@Query() query: SearchListingsQueryDto) {
    return this.searchService.search(query);
  }
}
