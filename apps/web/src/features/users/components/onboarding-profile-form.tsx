'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  userProfileUpdateSchema,
  type UserProfile,
  type UserProfileUpdateInput,
} from '@repo/api';

import { Button } from '@/shared/components/ui/button';
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/shared/components/ui/field';
import { Textarea } from '@/shared/components/ui/textarea';

import { AvatarUpload } from '@/shared/components/upload/avatar-upload';

import {
  updateUserProfile,
  uploadUserAvatar,
} from '@/features/users/api/users-api';

type Props = {
  profile: UserProfile;
  onComplete: () => void;
  onSkip: () => void;
};

export function OnboardingProfileForm({ profile, onComplete, onSkip }: Props) {
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserProfileUpdateInput>({
    resolver: zodResolver(userProfileUpdateSchema),
    defaultValues: {
      bio: profile.bio ?? '',
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setIsSubmitting(true);

    try {
      await updateUserProfile({
        bio: values.bio,
      });

      if (avatarFile) {
        await uploadUserAvatar(avatarFile);
      }

      onComplete();
    } finally {
      setIsSubmitting(false);
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-xl font-semibold">Complete your profile</h1>
        <p className="text-sm text-muted-foreground">
          You can skip this anytime.
        </p>
      </div>

      <FieldGroup>
        <Field>
          <FieldLabel>Avatar</FieldLabel>
          <AvatarUpload
            value={avatarFile ? [avatarFile] : []}
            defaultSrc={profile.image ?? null}
            onValueChange={(files) => setAvatarFile(files[0] ?? null)}
          />
        </Field>

        <Field>
          <FieldLabel>Bio</FieldLabel>
          <Textarea
            {...register('bio')}
            placeholder="Tell something about yourself"
          />
          {errors.bio && (
            <FieldDescription className="text-destructive">
              {errors.bio.message}
            </FieldDescription>
          )}
        </Field>

        <Field>
          <div className="flex gap-3">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Continue'}
            </Button>

            <Button type="button" variant="ghost" onClick={onSkip}>
              Skip
            </Button>
          </div>
        </Field>
      </FieldGroup>
    </form>
  );
}
