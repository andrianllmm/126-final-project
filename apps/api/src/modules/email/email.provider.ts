import { Provider } from '@nestjs/common';
import { Resend } from 'resend';

export const RESEND_CLIENT = 'RESEND_CLIENT';

export type ResendClient = Resend | null;

export const EmailProvider: Provider<ResendClient> = {
  provide: RESEND_CLIENT,
  useFactory: (): ResendClient => {
    const key = process.env.RESEND_API_KEY;
    return key ? new Resend(key) : null;
  },
};
