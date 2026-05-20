import { Inject, Injectable } from '@nestjs/common';
import { Resend } from 'resend';
import { RESEND_CLIENT } from './email.provider.js';
import { env } from '../../config/env.js';

@Injectable()
export class EmailService {
  constructor(
    @Inject(RESEND_CLIENT)
    private readonly resend: Resend | null,
  ) {}

  async sendEmail(params: {
    to: string | string[];
    subject: string;
    html: string;
  }) {
    if (!this.resend) {
      console.warn('Email provider not configured');
      return;
    }

    return this.resend.emails.send({
      from: env.email.from,
      to: params.to,
      subject: params.subject,
      html: params.html,
    });
  }
}
