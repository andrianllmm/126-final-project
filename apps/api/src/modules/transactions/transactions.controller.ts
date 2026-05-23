import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Session, type UserSession } from '@thallesp/nestjs-better-auth';

import { TransactionsService } from './transactions.service.js';
import {
  CreateTransactionDto,
  TransactionQueryDto,
} from './transactions.dto.js';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  createTransaction(
    @Session() session: UserSession,
    @Body() createDto: CreateTransactionDto,
  ) {
    return this.transactionsService.createTransaction(
      session.user.id,
      createDto,
    );
  }

  @Patch(':id/accept')
  acceptTransaction(@Param('id') id: string, @Session() session: UserSession) {
    return this.transactionsService.acceptTransaction(id, session.user.id);
  }

  @Patch(':id/reject')
  rejectTransaction(@Param('id') id: string, @Session() session: UserSession) {
    return this.transactionsService.rejectTransaction(id, session.user.id);
  }

  @Patch(':id/complete')
  completeTransaction(
    @Param('id') id: string,
    @Session() session: UserSession,
  ) {
    return this.transactionsService.completeTransaction(id, session.user.id);
  }

  @Patch(':id/cancel')
  cancelTransaction(@Param('id') id: string, @Session() session: UserSession) {
    return this.transactionsService.cancelTransaction(id, session.user.id);
  }

  @Get()
  getUserTransactions(
    @Session() session: UserSession,
    @Query() query: TransactionQueryDto,
  ) {
    return this.transactionsService.getUserTransactions(session.user.id, query);
  }

  @Get(':id')
  getTransaction(@Param('id') id: string, @Session() session: UserSession) {
    return this.transactionsService.getTransaction(id, session.user.id);
  }
}
