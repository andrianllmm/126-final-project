import { Module } from '@nestjs/common';
import { EmailService } from './email.service.js';
import { EmailProvider } from './email.provider.js';

@Module({
  providers: [EmailService, EmailProvider],
  exports: [EmailService],
})
export class EmailModule {}
