'use client';

import { authClient } from '@/shared/lib/auth-client';
import { Button } from '@/shared/components/ui/button';
import { SiGoogle } from '@icons-pack/react-simple-icons';
import { useState } from 'react';

type GoogleAuthButtonProps = Omit<
  React.ComponentProps<typeof Button>,
  'type' | 'onClick'
> & {
  callbackURL?: string;
  label: string;
  mode?: 'signIn' | 'link';
  onAuthError?: (message: string) => void;
};

export function GoogleAuthButton({
  callbackURL = process.env.NEXT_PUBLIC_BASE_URL,
  label,
  mode = 'signIn',
  onAuthError,
  className,
  disabled,
  ...props
}: GoogleAuthButtonProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleClick() {
    setIsSubmitting(true);

    const result =
      mode === 'link'
        ? await authClient.linkSocial({
            provider: 'google',
            callbackURL,
          })
        : await authClient.signIn.social({
            provider: 'google',
            callbackURL,
            newUserCallbackURL: callbackURL,
          });

    const { error } = result;

    if (error) {
      setIsSubmitting(false);
      onAuthError?.(error.message || 'Google authentication failed');
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
