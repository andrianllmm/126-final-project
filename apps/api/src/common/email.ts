import { Resend } from 'resend';
import { env } from '../config/env.js';

const resend = new Resend(env.email.resendApiKey);

export async function sendEmail(params: {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}) {
  console.log('sendEmail', params, env.email.from);
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
