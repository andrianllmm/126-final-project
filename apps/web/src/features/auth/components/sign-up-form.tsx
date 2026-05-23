'use client';

import { cn } from '@/shared/lib/utils';
import { useRouter } from 'next/navigation';
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

import { signUpSchema, SignUpInput } from '@repo/api';
import { GoogleAuthButton } from './google-auth-button';

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<typeof Card>) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
  });

  async function onSubmit(values: SignUpInput) {
    const { error } = await authClient.signUp.email({
      name: values.name,
      email: values.email,
      password: values.password,
    });

    if (error) {
      setError('root', {
        message: error.message || 'Sign up failed',
      });
      return;
    }

    router.push('/onboarding');
  }

  return (
    <Card className={cn(className)} {...props}>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="space-y-4">
            <GoogleAuthButton
              className="w-full"
              label="Sign up with Google"
              onAuthError={(message) =>
                setError('root', {
                  message,
                })
              }
            />

            <FieldSeparator className="my-4">or</FieldSeparator>

            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="name">Full Name</FieldLabel>
                <Input
                  id="name"
                  type="text"
                  placeholder="Juan Dela Cruz"
                  {...register('name')}
                />
                {errors.name && (
                  <FieldDescription className="text-destructive">
                    {errors.name.message}
                  </FieldDescription>
                )}
              </Field>

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
                <FieldLabel htmlFor="password">Password</FieldLabel>
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
                  {isSubmitting ? 'Creating...' : 'Create Account'}
                </Button>

                <FieldDescription className="px-6 text-center">
                  Already have an account? <Link href="/sign-in">Sign in</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
