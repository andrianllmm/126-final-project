'use client';

import { cn } from '@/shared/lib/utils';
import { useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { authClient } from '@/shared/lib/auth-client';

import { Button } from '@/shared/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from '@/shared/components/ui/field';
import { Input } from '@/shared/components/ui/input';
import { PasswordInput } from '@/shared/components/ui/password-input';
import Link from 'next/link';

import { signInSchema, SignInInput } from '@repo/api';
import { GoogleAuthButton } from './google-auth-button';

import {
  createSignInCallbackURL,
  getSafeReturnTo,
} from '@/shared/lib/auth-redirect';

export function SignInForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = getSafeReturnTo(searchParams.get('returnTo'));
  const signInCallbackURL = useMemo(
    () => createSignInCallbackURL(returnTo),
    [returnTo],
  );

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
  });

  async function onSubmit(values: SignInInput) {
    const { error } = await authClient.signIn.email(values);

    if (error) {
      setError('root', {
        message: error.message || 'Sign in failed',
      });
      return;
    }

    router.replace(returnTo);
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Sign in to your account</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="space-y-4">
              <GoogleAuthButton
                className="w-full"
                label="Continue with Google"
                callbackURL={signInCallbackURL}
                onAuthError={(message) =>
                  setError('root', {
                    message,
                  })
                }
              />

              <FieldSeparator className="my-4 bg-card">or</FieldSeparator>

              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    {...register('email')}
                  />
                  {errors.email && (
                    <FieldDescription className="text-destructive">
                      {errors.email.message}
                    </FieldDescription>
                  )}
                </Field>

                <Field>
                  <div className="flex items-center">
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <Link
                      href="/forgot-password"
                      className="ml-auto inline-block text-sm text-end underline-offset-4 hover:underline"
                    >
                      Forgot your password?
                    </Link>
                  </div>

                  <PasswordInput id="password" {...register('password')} />

                  {errors.password && (
                    <FieldDescription className="text-destructive">
                      {errors.password.message}
                    </FieldDescription>
                  )}
                </Field>

                {errors.root && (
                  <FieldDescription className="text-destructive text-center">
                    {errors.root.message}
                  </FieldDescription>
                )}

                <Field>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Signing in...' : 'Sign in'}
                  </Button>

                  <FieldDescription className="text-center">
                    Don&apos;t have an account?{' '}
                    <Link href="/sign-up">Sign up</Link>
                  </FieldDescription>
                </Field>
              </FieldGroup>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
