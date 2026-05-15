'use client';

import { useState } from 'react';
import { authClient } from '@/shared/lib/auth-client';

import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/shared/components/ui/field';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog';

export function ChangePasswordField() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChangePassword = async () => {
    setError(null);
    setIsLoading(true);

    try {
      await authClient.changePassword(
        {
          currentPassword,
          newPassword,
        },
        {
          onSuccess: () => {
            setCurrentPassword('');
            setNewPassword('');
            setError(null);
          },
          onError: ({ error }) => {
            setError(
              error.message || 'Invalid current password or request failed.',
            );
          },
        },
      );

      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      setError((err as Error)?.message || 'Failed to change password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Field>
      <FieldLabel>Change password</FieldLabel>

      <FieldDescription>
        Update your password using your current password.
      </FieldDescription>

      <div className="pt-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Change password</Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle>Change password</DialogTitle>

              <DialogDescription>
                Enter your current password and choose a new one.
              </DialogDescription>
            </DialogHeader>

            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="current-password">
                  Current password
                </FieldLabel>
                <Input
                  id="current-password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="new-password">New password</FieldLabel>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </Field>

              {error ? (
                <FieldDescription className="text-destructive">
                  {error}
                </FieldDescription>
              ) : null}
            </FieldGroup>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>

              <Button
                type="button"
                disabled={isLoading || !currentPassword || !newPassword}
                onClick={handleChangePassword}
              >
                {isLoading ? 'Updating...' : 'Update password'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Field>
  );
}
