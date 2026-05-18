'use client';

import { authClient } from '@/shared/lib/auth-client';
import { Button } from '@/shared/components/ui/button';
import { useState } from 'react';
import { SiGoogle } from '@icons-pack/react-simple-icons';

type GoogleAuthButtonProps = Omit<
  React.ComponentProps<typeof Button>,
  'type' | 'onClick'
> & {
  callbackURL?: string;
  label: string;
  onAuthError?: (message: string) => void;
};

export function GoogleAuthButton({
  callbackURL = process.env.NEXT_PUBLIC_BASE_URL,
  label,
  onAuthError,
  className,
  disabled,
  ...props
}: GoogleAuthButtonProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleClick() {
    setIsSubmitting(true);

    const { error } = await authClient.signIn.social({
      provider: 'google',
      callbackURL,
      newUserCallbackURL: callbackURL,
    });

    if (error) {
      setIsSubmitting(false);
      onAuthError?.(error.message || 'Google sign in failed');
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      className={className}
      disabled={disabled || isSubmitting}
      onClick={handleClick}
      {...props}
    >
      <SiGoogle className="size-5" />
      {isSubmitting ? 'Opening Google...' : label}
    </Button>
  );
}
