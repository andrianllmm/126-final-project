import { Provider } from '@nestjs/common';
import { Resend } from 'resend';

export const RESEND_CLIENT = 'RESEND_CLIENT';

export const EmailProvider: Provider = {
  provide: RESEND_CLIENT,
  useFactory: () => {
    return new Resend(process.env.RESEND_API_KEY);
  },
};
