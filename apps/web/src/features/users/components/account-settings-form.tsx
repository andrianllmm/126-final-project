'use client';

import { FieldGroup } from '@/shared/components/ui/field';

import { DeleteAccountField } from './delete-account-field';

type AccountSettingsFormProps = {
  userId: string;
};

export function AccountSettingsForm({ userId }: AccountSettingsFormProps) {
  return (
    <div>
      <FieldGroup>
        <DeleteAccountField />
      </FieldGroup>
    </div>
  );
}
