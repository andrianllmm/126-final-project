import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { MessagingService } from './messaging.service.js';
import { Session, type UserSession } from '@thallesp/nestjs-better-auth';

@Controller('messaging')
export class MessagingController {
  constructor(private messagingService: MessagingService) {}

  @Post('conversations')
  async getOrCreateConversation(
    @Body() body: { listingId: string },
    @Session() session: UserSession,
  ) {
    return this.messagingService.getOrCreateConversation(
      session.user.id,
      body.listingId,
    );
  }

  @Post('conversations/with-buyer')
  async getOrCreateConversationWithBuyer(
    @Body() body: { listingId: string; buyerId: string },
    @Session() session: UserSession,
  ) {
    return this.messagingService.getOrCreateConversationWithBuyer(
      session.user.id,
      body.listingId,
      body.buyerId,
    );
  }

  @Get('conversations')
  getConversations(@Session() session: UserSession) {
    return this.messagingService.getConversations(session.user.id);
  }

  @Get('conversations/:id')
  getConversation(
    @Session() session: UserSession,
    @Param('id') conversationId: string,
  ) {
    return this.messagingService.getConversation(
      session.user.id,
      conversationId,
    );
  }

  @Post('conversations/:id/read')
  markAsRead(
    @Session() session: UserSession,
    @Param('id') conversationId: string,
  ) {
    return this.messagingService.markMessagesAsRead(
      session.user.id,
      conversationId,
    );
  }

  @Get('unread-count')
  getUnreadCount(@Session() session: UserSession) {
    return this.messagingService.getUnreadCount(session.user.id);
  }
}
