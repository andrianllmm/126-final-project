'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useQueryClient } from '@tanstack/react-query';
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

import { AvatarUpload } from '@/shared/components/upload/avatar-upload';

import {
  updateUserProfile,
  uploadUserAvatar,
  removeUserAvatar,
} from '../../api/users-api';

type ProfileSettingsFormProps = {
  profile: UserProfile;
};

const profileSettingsSchema = userProfileUpdateSchema;

type ProfileSettingsValues = UserProfileUpdateInput;

export function ProfileSettingsForm({ profile }: ProfileSettingsFormProps) {
  const queryClient = useQueryClient();

  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarTouched, setAvatarTouched] = useState(false);

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

  const existingAvatar = profile.avatarUpload ?? null;

  useEffect(() => {
    reset({
      name: profile.name ?? '',
    });

    setAvatarFile(null);
    setAvatarTouched(false);
    setSaveMessage(null);
  }, [profile, reset]);

  const hasExistingAvatar = Boolean(existingAvatar);
  const shouldRemoveAvatar = avatarTouched && !avatarFile && hasExistingAvatar;

  const hasChanges = isDirty || Boolean(avatarFile) || shouldRemoveAvatar;

  const onSubmit = handleSubmit(async (values) => {
    setSaveMessage(null);

    try {
      // Update profile fields
      await updateUserProfile({
        name: values.name ?? '',
      });

      // Avatar changes
      if (avatarFile) {
        await uploadUserAvatar(avatarFile);
      } else if (shouldRemoveAvatar) {
        await removeUserAvatar();
      }

      await queryClient.invalidateQueries({
        queryKey: ['users'],
      });

      reset({
        name: values.name ?? '',
      });

      setAvatarFile(null);
      setAvatarTouched(false);

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
          href={`/profile/${profile.id}`}
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
              {...register('name')}
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
              defaultSrc={
                shouldRemoveAvatar ? null : (existingAvatar?.url ?? null)
              }
              onValueChange={(files) => {
                setAvatarTouched(true);

                const file = files[0];

                if (!file) {
                  setAvatarFile(null);
                  return;
                }

                setAvatarFile(file);
              }}
            />
          </Field>

          <Field>
            {saveMessage && <FieldDescription>{saveMessage}</FieldDescription>}

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button type="submit" disabled={!hasChanges}>
                Save changes
              </Button>
            </div>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
}
