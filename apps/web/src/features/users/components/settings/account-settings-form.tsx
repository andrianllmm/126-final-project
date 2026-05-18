'use client';

import { FieldGroup } from '@/shared/components/ui/field';

import { AccountLinkingField } from './account-linking-field';
import { PasswordField } from './password-field';
import { DeleteAccountField } from './delete-account-field';

type AccountSettingsFormProps = {
  userId: string;
};

export function AccountSettingsForm({
  userId: _userId,
}: AccountSettingsFormProps) {
  void _userId;

  return (
    <div>
      <FieldGroup>
        <AccountLinkingField />
        <PasswordField />
        <DeleteAccountField />
      </FieldGroup>
    </div>
  );
}
