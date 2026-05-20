'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { PasswordInput } from '@/shared/components/ui/password-input';

import {
  Field,
  FieldDescription,
  FieldLabel,
} from '@/shared/components/ui/field';

import { setPasswordSchema, type SetPasswordInput } from '@repo/api';

import { setUserPassword } from '../../api/password-api';

import { PasswordDialog } from './password-dialog';

export function PasswordSetField({
  onSuccess,
}: {
  onSuccess: () => Promise<void>;
}) {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SetPasswordInput>({
    resolver: zodResolver(setPasswordSchema),
  });

  async function onSubmit(values: SetPasswordInput) {
    try {
      await setUserPassword({
        newPassword: values.newPassword,
      });
    } catch {
      setError('root', {
        message: 'Unable to add password.',
      });

      return;
    }

    reset();
    await onSuccess();
  }

  return (
    <Field>
      <FieldLabel>Password</FieldLabel>

      <FieldDescription>Add a password.</FieldDescription>

      <div className="pt-2">
        <PasswordDialog
          title="Set password"
          description="Create a password for this account."
          triggerLabel="Set password"
          submitLabel="Save password"
          submitPendingLabel="Saving..."
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit(onSubmit)}
        >
          <Field>
            <FieldLabel htmlFor="new-password">New password</FieldLabel>

            <PasswordInput
              id="new-password"
              autoComplete="new-password"
              {...register('newPassword')}
            />

            {errors.newPassword && (
              <FieldDescription className="text-destructive">
                {errors.newPassword.message}
              </FieldDescription>
            )}
          </Field>

          {errors.root && (
            <FieldDescription className="text-destructive text-center">
              {errors.root.message}
            </FieldDescription>
          )}
        </PasswordDialog>
      </div>
    </Field>
  );
}
