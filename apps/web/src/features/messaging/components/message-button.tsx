'use client';

import { useRouter } from 'next/navigation';
import { MessageCircle } from 'lucide-react';
import { toast } from 'sonner';

import { Button, type ButtonProps } from '@/shared/components/ui/button';
import { cn } from '@/shared/lib/utils';
import { useGetOrCreateConversation } from '../hooks/use-conversations';
import { Spinner } from '@/shared/components/ui/spinner';

type MessageButtonProps = ButtonProps & {
  listingId: string;
  onSuccessNavigate?: (conversationId: string) => void;
};

export function MessageButton({
  listingId,
  className,
  disabled,
  children,
  onClick,
  onSuccessNavigate,
  ...buttonProps
}: MessageButtonProps) {
  const router = useRouter();
  const { mutate, isPending } = useGetOrCreateConversation();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    onClick?.(e);

    mutate(listingId, {
      onSuccess: (conversation) => {
        if (onSuccessNavigate) {
          onSuccessNavigate(conversation.id);
          return;
        }

        router.push(`/messages/${conversation.id}`);
      },
      onError: () => {
        toast.error('Failed to open conversation');
      },
    });
  };

  return (
    <Button
      {...buttonProps}
      disabled={disabled || isPending}
      onClick={handleClick}
      className={cn(className)}
    >
      {isPending ? (
        <Spinner className="size-4" />
      ) : (
        <MessageCircle className="size-4" />
      )}

      {children}
    </Button>
  );
}
