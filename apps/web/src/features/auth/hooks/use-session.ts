import { authClient } from '@/shared/lib/auth-client';

export function useSession() {
  return authClient.useSession();
}
