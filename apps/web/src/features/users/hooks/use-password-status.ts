'use client';

import { useEffect, useMemo, useState } from 'react';

import { authClient } from '@/shared/lib/auth-client';

type AccountLink = {
  id: string;
  providerId: string;
  accountId: string;
};

export function usePasswordStatus() {
  const [accounts, setAccounts] = useState<AccountLink[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const hasCredentialAccount = useMemo(
    () => accounts.some((account) => account.providerId === 'credential'),
    [accounts],
  );

  async function refresh() {
    setIsLoading(true);
    setError(null);

    const result = await authClient.listAccounts();

    if (result.error) {
      setError(result.error.message || 'Unable to load password status.');
      setAccounts([]);
    } else {
      setAccounts(result.data ?? []);
    }

    setIsLoading(false);
  }

  useEffect(() => {
    void refresh();
  }, []);

  return {
    hasCredentialAccount,
    isLoading,
    error,
    refresh,
  };
}
