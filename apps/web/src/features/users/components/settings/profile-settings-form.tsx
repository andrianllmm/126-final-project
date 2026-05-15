'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Button } from '@/shared/components/ui/button';
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/shared/components/ui/field';
import { Input } from '@/shared/components/ui/input';

import {
  userProfileUpdateSchema,
  type UserProfile,
  type UserProfileUpdateInput,
} from '@repo/api';

import { useUpdateUserProfile } from '../../hooks/use-update-user-profile';
import { AvatarUpload } from '@/shared/components/upload/avatar-upload';
import { normalizeNullableString } from '@/shared/lib/normalize-nullable-string';

type ProfileSettingsFormProps = {
  userId: string;
  profile: UserProfile;
};

const profileSettingsSchema = userProfileUpdateSchema;

type ProfileSettingsValues = UserProfileUpdateInput;

export function ProfileSettingsForm({
  userId,
  profile,
}: ProfileSettingsFormProps) {
  const mutation = useUpdateUserProfile({ userId });

  const existingAvatar = profile.avatarUpload ?? null;

  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarRemoved, setAvatarRemoved] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileSettingsValues>({
    resolver: zodResolver(profileSettingsSchema),
    defaultValues: {
      name: profile.name ?? '',
    },
  });

  useEffect(() => {
    reset({
      name: profile.name ?? '',
    });

    setAvatarFile(null);
    setAvatarRemoved(false);
    setSaveMessage(null);
  }, [profile, reset]);

  const hasChanges = isDirty || Boolean(avatarFile) || avatarRemoved;

  const onSubmit = handleSubmit(async (values) => {
    setSaveMessage(null);

    try {
      const formData = new FormData();

      formData.append('name', values.name ?? '');

      if (avatarFile) {
        formData.append('avatar', avatarFile);
      }

      if (avatarRemoved) {
        formData.append('avatar', '');
      }

      await mutation.mutateAsync(formData);

      reset({
        name: normalizeNullableString(values.name || '') ?? '',
      });

      setAvatarFile(null);
      setAvatarRemoved(false);

      setSaveMessage('Profile updated.');
    } catch (err) {
      console.error(err);
      setSaveMessage('Failed to update profile.');
    }
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <p className="text-sm text-muted-foreground">
          Manage your public profile information.
        </p>

        <Link
          href={`/profile/${userId}`}
          className="text-sm font-medium text-primary hover:underline"
        >
          View profile
        </Link>
      </div>

      <form onSubmit={onSubmit} noValidate>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="name">Display name</FieldLabel>

            <Input
              id="name"
              type="text"
              placeholder="Juan Dela Cruz"
              {...register('name', {
                setValueAs: normalizeNullableString,
              })}
            />

            {errors.name ? (
              <FieldDescription className="text-destructive">
                {errors.name.message}
              </FieldDescription>
            ) : (
              <FieldDescription>
                This is shown on your profile and in marketplace activity.
              </FieldDescription>
            )}
          </Field>

          <Field>
            <FieldLabel>Avatar</FieldLabel>

            <AvatarUpload
              value={avatarFile ? [avatarFile] : []}
              defaultSrc={avatarRemoved ? null : (existingAvatar?.url ?? null)}
              onValueChange={(files) => {
                const file = files[0];

                if (!file) {
                  setAvatarFile(null);
                  setAvatarRemoved(true);
                  return;
                }

                setAvatarFile(file);
                setAvatarRemoved(false);
              }}
            />
          </Field>

          <Field>
            {saveMessage && <FieldDescription>{saveMessage}</FieldDescription>}

            {mutation.isError && (
              <FieldDescription className="text-destructive">
                {(mutation.error as Error)?.message ||
                  'Unable to update profile.'}
              </FieldDescription>
            )}

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button
                type="submit"
                disabled={mutation.isPending || !hasChanges}
              >
                {mutation.isPending ? 'Saving...' : 'Save changes'}
              </Button>
            </div>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
}
