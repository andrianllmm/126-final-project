'use client';

import { useRouter } from 'next/navigation';
import { MessageCircle } from 'lucide-react';
import { toast } from 'sonner';

import { Button, type ButtonProps } from '@/shared/components/ui/button';
import { cn } from '@/shared/lib/utils';
import {
  useGetOrCreateConversation,
  useGetOrCreateConversationWithBuyer,
} from '../hooks/use-conversations';
import { Spinner } from '@/shared/components/ui/spinner';

type MessageButtonProps = ButtonProps & {
  listingId: string;
  buyerId?: string;
  onSuccessNavigate?: (conversationId: string) => void;
};

export function MessageButton({
  listingId,
  buyerId,
  className,
  disabled,
  children,
  onClick,
  onSuccessNavigate,
  ...buttonProps
}: MessageButtonProps) {
  const router = useRouter();
  const buyerConversationMutation = useGetOrCreateConversationWithBuyer();
  const listingConversationMutation = useGetOrCreateConversation();

  const isPending =
    buyerConversationMutation.isPending ||
    listingConversationMutation.isPending;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    onClick?.(e);

    const onSuccess = (conversation: { id: string }) => {
      if (onSuccessNavigate) {
        onSuccessNavigate(conversation.id);
        return;
      }

      router.push(`/messages/${conversation.id}`);
    };

    const onError = () => {
      toast.error('Failed to open conversation');
    };

    if (buyerId) {
      buyerConversationMutation.mutate(
        { listingId, buyerId },
        { onSuccess, onError },
      );
      return;
    }

    listingConversationMutation.mutate(listingId, { onSuccess, onError });
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
