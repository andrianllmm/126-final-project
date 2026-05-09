'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/shared/components/ui/button';
import { authClient } from '@/auth/lib/auth-client';

export function AuthButton() {
  const router = useRouter();

  const { useSession } = authClient;
  const session = useSession();

  const user = session.data?.user;

  const handleLogout = async () => {
    await authClient.signOut();
    session.refetch();
    router.push('/sign-in');
    router.refresh();
  };

  if (session.isPending) {
    return <Button variant="outline">Account</Button>;
  }

  if (!user) {
    return (
      <Button asChild variant="outline">
        <Link href="/sign-in">Sign in</Link>
      </Button>
    );
  }

  return (
    <Button variant="outline" onClick={handleLogout}>
      Sign out
    </Button>
  );
}
