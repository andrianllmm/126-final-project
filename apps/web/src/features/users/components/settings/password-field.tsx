'use client';

import {
  Field,
  FieldDescription,
  FieldLabel,
} from '@/shared/components/ui/field';

import { usePasswordStatus } from '../../hooks/use-password-status';
import { PasswordChangeField } from './password-change-field';
import { PasswordSetField } from './password-set-field';

export function PasswordField() {
  const { hasCredentialAccount, isLoading, error, refresh } =
    usePasswordStatus();

  if (isLoading) {
    return (
      <Field>
        <FieldLabel>Password</FieldLabel>

        <FieldDescription>Loading password status...</FieldDescription>
      </Field>
    );
  }

  if (error) {
    return (
      <Field>
        <FieldLabel>Password</FieldLabel>

        <FieldDescription className="text-destructive">
          {error}
        </FieldDescription>
      </Field>
    );
  }

  return hasCredentialAccount ? (
    <PasswordChangeField onSuccess={refresh} />
  ) : (
    <PasswordSetField onSuccess={refresh} />
  );
}
