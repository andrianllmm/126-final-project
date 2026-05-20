import { Resend } from 'resend';
import { env } from '../config/env.js';

const resend = env.email.resendApiKey
  ? new Resend(env.email.resendApiKey)
  : null;

export async function sendEmail(params: {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}) {
  if (!resend) {
    console.warn('Email provider not configured');
    return;
  }

  const { data, error } = await resend.emails.send({
    from: env.email.from,
    to: params.to,
    subject: params.subject,
    text: params.text || '',
    html: params.html,
  });
  if (error) {
    console.error(error);
  }
  return data;
}
