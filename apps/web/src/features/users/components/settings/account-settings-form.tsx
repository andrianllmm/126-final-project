'use client';

import { FieldGroup } from '@/shared/components/ui/field';

import { ContactsField } from './contacts-field';
import { VerificationField } from './verification-field';
import { AccountLinkingField } from './account-linking-field';
import { PasswordField } from './password-field';
import { DeleteAccountField } from './delete-account-field';

import { UserProfile } from '@repo/api';

interface AccountSettingsFormProps {
  profile: UserProfile;
}

export function AccountSettingsForm({ profile }: AccountSettingsFormProps) {
  return (
    <div>
      <FieldGroup>
        <ContactsField
          email={profile.email}
          phoneNumber={profile.phoneNumber}
        />
        <VerificationField
          email={profile.email}
          emailVerified={profile.emailVerified}
        />
        <AccountLinkingField />
        <PasswordField />
        <DeleteAccountField />
      </FieldGroup>
    </div>
  );
}
