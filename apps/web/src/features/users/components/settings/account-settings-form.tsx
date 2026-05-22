'use client';

import { FieldGroup } from '@/shared/components/ui/field';

import { AccountLinkingField } from './account-linking-field';
import { PasswordField } from './password-field';
import { DeleteAccountField } from './delete-account-field';
import { EmailVerificationField } from './email-verification-field';
import { UserProfile } from '@repo/api';

interface AccountSettingsFormProps {
  profile: UserProfile;
}

export function AccountSettingsForm({ profile }: AccountSettingsFormProps) {
  return (
    <div>
      <FieldGroup>
        <EmailVerificationField
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
