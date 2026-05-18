'use client';

import { useEffect, useState } from 'react';

import { authClient } from '@/shared/lib/auth-client';

import {
  Field,
  FieldDescription,
  FieldLabel,
} from '@/shared/components/ui/field';

import { GoogleAuthButton } from '@/features/auth/components/google-auth-button';

type AccountLink = {
  id: string;
  providerId: string;
  accountId: string;
};

const ACCOUNT_SETTINGS_CALLBACK_URL =
  process.env.NEXT_PUBLIC_BASE_URL + '/settings?tab=account';

export function AccountLinkingField() {
  const [accounts, setAccounts] = useState<AccountLink[]>([]);
  const [error, setError] = useState<string | null>(null);

  const linkedProviderIds = new Set(
    accounts.map((account) => account.providerId),
  );

  useEffect(() => {
    let isActive = true;

    async function loadAccounts() {
      setError(null);

      const result = await authClient.listAccounts();

      if (!isActive) return;

      if (result.error) {
        setError(result.error.message || 'Unable to load linked accounts.');
        setAccounts([]);
      } else {
        setAccounts(result.data ?? []);
      }
    }

    void loadAccounts();

    return () => {
      isActive = false;
    };
  }, []);

  return (
    <Field>
      <FieldLabel>Connected accounts</FieldLabel>

      <div className="pt-2 space-y-4">
        {error ? (
          <FieldDescription className="text-destructive">
            {error}
          </FieldDescription>
        ) : null}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <GoogleAuthButton
            className="w-full sm:w-auto"
            label={
              linkedProviderIds.has('google')
                ? 'Google already linked'
                : 'Link Google'
            }
            mode="link"
            callbackURL={ACCOUNT_SETTINGS_CALLBACK_URL}
            disabled={linkedProviderIds.has('google')}
            onAuthError={(message) => setError(message)}
          />
        </div>
      </div>
    </Field>
  );
}
