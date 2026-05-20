'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { authClient } from '@/shared/lib/auth-client';

import { Button } from '@/shared/components/ui/button';
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
import { PasswordInput } from '@/shared/components/ui/password-input';

export function DeleteAccountField() {
  const router = useRouter();

  const [password, setPassword] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDeleteAccount = async () => {
    setError(null);
    setIsDeleting(true);

    try {
      const result = await authClient.deleteUser({
        password,
      });

      if (result.error) {
        setError(result.error.message || 'Failed to delete account.');
        return;
      }

      router.replace('/sign-in');
    } catch (err) {
      setError((err as Error)?.message || 'Failed to delete account.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Field>
      <FieldLabel>Delete account</FieldLabel>

      <FieldDescription>
        Permanently delete your account. This action cannot be undone.
      </FieldDescription>

      <div className="pt-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="destructive">Delete account</Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle>Delete account</DialogTitle>

              <DialogDescription>
                This action is permanent. Enter your password to confirm
                deletion.
              </DialogDescription>
            </DialogHeader>

            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>

                <PasswordInput
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
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
                variant="destructive"
                disabled={isDeleting || password.length === 0}
                onClick={handleDeleteAccount}
              >
                {isDeleting ? 'Deleting...' : 'Delete account'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Field>
  );
}
