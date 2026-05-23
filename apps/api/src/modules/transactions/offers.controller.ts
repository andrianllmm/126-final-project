import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { Session, type UserSession } from '@thallesp/nestjs-better-auth';

import { OffersService } from './offers.service.js';
import { CreateOfferDto } from './offers.dto.js';

@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Post()
  createOffer(@Session() session: UserSession, @Body() dto: CreateOfferDto) {
    return this.offersService.createOffer(session.user.id, dto);
  }

  @Get('transaction/:transactionId')
  getOffers(
    @Param('transactionId') transactionId: string,
    @Session() session: UserSession,
  ) {
    return this.offersService.getOffers(transactionId, session.user.id);
  }

  @Patch(':id/accept')
  acceptOffer(@Param('id') id: string, @Session() session: UserSession) {
    return this.offersService.acceptOffer(id, session.user.id);
  }

  @Patch(':id/reject')
  rejectOffer(@Param('id') id: string, @Session() session: UserSession) {
    return this.offersService.rejectOffer(id, session.user.id);
  }
}
