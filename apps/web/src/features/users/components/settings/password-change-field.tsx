'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { authClient } from '@/shared/lib/auth-client';

import { Input } from '@/shared/components/ui/input';

import {
  Field,
  FieldDescription,
  FieldLabel,
} from '@/shared/components/ui/field';

import { changePasswordSchema, type ChangePasswordInput } from '@repo/api';

import { PasswordDialog } from './password-dialog';

export function PasswordChangeField({
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
  } = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
  });

  async function onSubmit(values: ChangePasswordInput) {
    const { error } = await authClient.changePassword({
      currentPassword: values.currentPassword,
      newPassword: values.newPassword,
    });

    if (error) {
      setError('root', {
        message: error.message || 'Invalid current password or request failed.',
      });

      return;
    }

    reset();
    await onSuccess();
  }

  return (
    <Field>
      <FieldLabel>Password</FieldLabel>

      <FieldDescription>
        Update your password using your current password.
      </FieldDescription>

      <div className="pt-2">
        <PasswordDialog
          title="Change password"
          description="Enter your current password and choose a new one."
          triggerLabel="Change password"
          submitLabel="Update password"
          submitPendingLabel="Updating..."
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit(onSubmit)}
        >
          <Field>
            <FieldLabel htmlFor="current-password">Current password</FieldLabel>

            <Input
              id="current-password"
              type="password"
              autoComplete="current-password"
              {...register('currentPassword')}
            />

            {errors.currentPassword && (
              <FieldDescription className="text-destructive">
                {errors.currentPassword.message}
              </FieldDescription>
            )}
          </Field>

          <Field>
            <FieldLabel htmlFor="new-password">New password</FieldLabel>

            <Input
              id="new-password"
              type="password"
              autoComplete="new-password"
              {...register('newPassword')}
            />

            {errors.newPassword && (
              <FieldDescription className="text-destructive">
                {errors.newPassword.message}
              </FieldDescription>
            )}
          </Field>

          <Field>
            <FieldLabel htmlFor="confirm-password">
              Confirm new password
            </FieldLabel>

            <Input
              id="confirm-password"
              type="password"
              autoComplete="new-password"
              {...register('confirmPassword')}
            />

            {errors.confirmPassword && (
              <FieldDescription className="text-destructive">
                {errors.confirmPassword.message}
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
