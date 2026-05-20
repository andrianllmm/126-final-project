import { useSession } from './use-session';

export function useAuth() {
  const { data: session, ...rest } = useSession();

  return {
    ...rest,
    user: session?.user ?? null,
    session,
  };
}
