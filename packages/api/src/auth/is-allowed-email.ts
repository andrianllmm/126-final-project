import { ALLOWED_EMAIL_DOMAINS } from '../constants.js';

export function isAllowedEmail(email: string) {
  const domain = email.toLowerCase().split('@')[1];
  return !!domain && ALLOWED_EMAIL_DOMAINS.includes(domain);
}
