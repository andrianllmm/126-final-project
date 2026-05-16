'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

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

import { changePasswordSchema, type ChangePasswordInput } from '@repo/api';

export function ChangePasswordField() {
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
  }

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

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="current-password">
                    Current password
                  </FieldLabel>

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
              </FieldGroup>

              <DialogFooter className="mt-6">
                <DialogClose asChild>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                </DialogClose>

                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Updating...' : 'Update password'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </Field>
  );
}
