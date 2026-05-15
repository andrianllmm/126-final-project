'use client';

import { useEffect, useState } from 'react';
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

type ProfileSettingsFormProps = {
  userId: string;
  profile: UserProfile;
};

function normalizeNullableString(value: unknown) {
  if (typeof value !== 'string') return null;

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export function ProfileSettingsForm({
  userId,
  profile,
}: ProfileSettingsFormProps) {
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<UserProfileUpdateInput>({
    resolver: zodResolver(userProfileUpdateSchema),
    defaultValues: {
      name: profile.name ?? '',
      image: profile.image ?? '',
    },
  });

  useEffect(() => {
    reset({
      name: profile.name ?? '',
      image: profile.image ?? '',
    });
  }, [profile, reset]);

  const mutation = useUpdateUserProfile({ userId });

  const onSubmit = handleSubmit(async (values) => {
    setSaveMessage(null);

    await mutation.mutateAsync({
      name: normalizeNullableString(values.name),
      image: normalizeNullableString(values.image),
    });
  });

  return (
    <div>
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
            <FieldLabel htmlFor="image">Avatar image URL</FieldLabel>
            <Input
              id="image"
              type="url"
              placeholder="https://example.com/avatar.png"
              {...register('image', {
                setValueAs: normalizeNullableString,
              })}
            />
            {errors.image ? (
              <FieldDescription className="text-destructive">
                {errors.image.message}
              </FieldDescription>
            ) : (
              <FieldDescription>
                Leave blank to use your initials.
              </FieldDescription>
            )}
          </Field>

          <Field>
            {saveMessage ? (
              <FieldDescription>{saveMessage}</FieldDescription>
            ) : null}

            {mutation.isError ? (
              <FieldDescription className="text-destructive">
                {(mutation.error as Error).message ||
                  'Unable to update profile.'}
              </FieldDescription>
            ) : null}

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button type="submit" disabled={mutation.isPending || !isDirty}>
                {mutation.isPending ? 'Saving...' : 'Save changes'}
              </Button>
            </div>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
}
