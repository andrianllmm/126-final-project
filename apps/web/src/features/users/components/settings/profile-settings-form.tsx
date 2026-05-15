'use client';

import { useEffect, useMemo, useState } from 'react';
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

import { UserAvatar } from '../user-avatar';

import {
  userProfileUpdateSchema,
  type UserProfile,
  type UserProfileUpdateInput,
} from '@repo/api';

import { deleteUserAvatar, uploadUserAvatar } from '../../api/users-api';
import { useUpdateUserProfile } from '../../hooks/use-update-user-profile';

type ProfileSettingsFormProps = {
  userId: string;
  profile: UserProfile;
};

type AvatarState =
  | { mode: 'existing'; url: string | null }
  | { mode: 'file'; file: File; previewUrl: string }
  | { mode: 'removed' };

function normalizeNullableString(value: unknown) {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export function ProfileSettingsForm({
  userId,
  profile,
}: ProfileSettingsFormProps) {
  const mutation = useUpdateUserProfile({ userId });

  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [fileInputKey, setFileInputKey] = useState(0);

  const [avatarState, setAvatarState] = useState<AvatarState>({
    mode: 'existing',
    url: profile.avatarUpload?.url ?? null,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<UserProfileUpdateInput>({
    resolver: zodResolver(userProfileUpdateSchema),
    defaultValues: {
      name: profile.name ?? '',
    },
  });

  const existingAvatarUploadId = profile.avatarUpload?.id ?? null;

  useEffect(() => {
    reset({
      name: profile.name ?? '',
    });

    setAvatarState({
      mode: 'existing',
      url: profile.avatarUpload?.url ?? null,
    });

    setFileInputKey((v) => v + 1);
    setSaveMessage(null);
  }, [profile, reset]);

  const avatarSrc = useMemo(() => {
    if (avatarState.mode === 'file') return avatarState.previewUrl;
    if (avatarState.mode === 'removed') return null;
    return avatarState.url;
  }, [avatarState]);

  const hasChanges =
    isDirty || avatarState.mode === 'file' || avatarState.mode === 'removed';

  const onSubmit = handleSubmit(async (values) => {
    setSaveMessage(null);

    try {
      let avatarUploadId: string | null = existingAvatarUploadId;

      // Upload new avatar
      if (avatarState.mode === 'file') {
        if (existingAvatarUploadId) {
          await deleteUserAvatar(existingAvatarUploadId);
        }

        const upload = await uploadUserAvatar(avatarState.file);
        avatarUploadId = upload.id;
      }

      // Remove avatar explicitly
      if (avatarState.mode === 'removed') {
        if (existingAvatarUploadId) {
          await deleteUserAvatar(existingAvatarUploadId);
        }
        avatarUploadId = null;
      }

      await mutation.mutateAsync({
        name: normalizeNullableString(values.name),
        avatarUploadId,
      });

      reset({
        name: normalizeNullableString(values.name) ?? '',
      });

      setAvatarState({
        mode: 'existing',
        url: avatarUploadId ? avatarSrc : null,
      });

      setFileInputKey((v) => v + 1);
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

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <UserAvatar
                name={profile.name}
                email={profile.email}
                src={avatarSrc}
                sizeClassName="size-16"
                fallbackClassName="text-lg font-semibold"
              />

              <div className="flex w-full gap-2 items-center">
                <Input
                  key={fileInputKey}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (!file) return;

                    const previewUrl = URL.createObjectURL(file);

                    setAvatarState({
                      mode: 'file',
                      file,
                      previewUrl,
                    });
                  }}
                  className="w-full"
                />

                {avatarState.mode !== 'removed' && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    disabled={mutation.isPending}
                    onClick={() => {
                      setAvatarState({ mode: 'removed' });
                      setFileInputKey((v) => v + 1);
                    }}
                  >
                    Remove
                  </Button>
                )}
              </div>
            </div>
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
