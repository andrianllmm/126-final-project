'use client';

import { cn } from '@/shared/lib/utils';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Checkbox } from '@/shared/components/ui/checkbox';

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

import {
  createSignInUrl,
  getCurrentPathWithSearch,
} from '@/shared/lib/auth-redirect';

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<typeof Card>) {
  const router = useRouter();
  const pathname = usePathname();
  const currentPath = getCurrentPathWithSearch(pathname);

  const {
    control,
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      acceptedTerms: false,
    },
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

              <Field>
                <div className="flex items-start gap-2">
                  <Controller
                    control={control}
                    name="acceptedTerms"
                    render={({ field }) => (
                      <Checkbox
                        id="acceptedTerms"
                        checked={field.value}
                        onCheckedChange={(checked) =>
                          field.onChange(checked === true)
                        }
                        onBlur={field.onBlur}
                        ref={field.ref}
                        className="mt-0.5"
                      />
                    )}
                  />

                  <label
                    htmlFor="acceptedTerms"
                    className="text-xs leading-relaxed text-muted-foreground"
                  >
                    I agree to the{' '}
                    <Link
                      href="/terms"
                      className="text-primary underline-offset-4 hover:underline"
                    >
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link
                      href="/privacy"
                      className="text-primary underline-offset-4 hover:underline"
                    >
                      Privacy Policy
                    </Link>
                    .
                  </label>
                </div>

                {errors.acceptedTerms && (
                  <FieldDescription className="text-destructive">
                    {errors.acceptedTerms.message}
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
                  Already have an account?{' '}
                  <Link href={createSignInUrl(currentPath)} replace>
                    Sign in
                  </Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
