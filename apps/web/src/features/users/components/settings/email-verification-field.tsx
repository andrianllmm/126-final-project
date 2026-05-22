'use client';

import { useState } from 'react';
import { authClient } from '@/shared/lib/auth-client';
import { Button } from '@/shared/components/ui/button';
import { Field, FieldLabel } from '@/shared/components/ui/field';
import { toast } from 'sonner';
import { MailIcon } from 'lucide-react';

export function EmailVerificationField({
  email,
  emailVerified,
}: {
  email: string;
  emailVerified: boolean;
}) {
  const [loading, setLoading] = useState(false);

  const resend = async () => {
    setLoading(true);
    try {
      await authClient.sendVerificationEmail({
        email,
        callbackURL: process.env.NEXT_PUBLIC_BASE_URL + '/settings?tab=account',
      });
      toast.success('Verification email sent');
    } catch (err) {
      toast.error(
        (err as Error)?.message || 'Failed to resend verification email',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Field>
      <FieldLabel>Verification</FieldLabel>

      <div className="pt-2 space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button
            variant="outline"
            onClick={resend}
            disabled={loading || emailVerified}
            className="w-full sm:w-auto"
          >
            <MailIcon className="size-4" />
            {emailVerified ? 'Email Verified' : 'Resend verification email'}
          </Button>
        </div>
      </div>
    </Field>
  );
}
