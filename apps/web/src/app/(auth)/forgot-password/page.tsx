'use client';

import { useState } from 'react';
import { authClient } from '@/shared/lib/auth-client';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldDescription,
} from '@/shared/components/ui/field';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setStatus(null);

    const { error } = await authClient.requestPasswordReset({
      email,
      redirectTo: process.env.NEXT_PUBLIC_BASE_URL + '/reset-password',
    });

    setLoading(false);

    if (error) {
      setError(error.message || 'Failed to send reset email');
      return;
    }

    setStatus('If the email exists, a reset link has been sent.');
  }

  return (
    <div className="flex w-full items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Reset your password</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <FieldGroup>
              <Field>
                <FieldLabel>Email</FieldLabel>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                />
              </Field>

              {error && (
                <FieldDescription className="text-destructive">
                  {error}
                </FieldDescription>
              )}

              {status && <FieldDescription>{status}</FieldDescription>}

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Sending...' : 'Send reset link'}
              </Button>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
