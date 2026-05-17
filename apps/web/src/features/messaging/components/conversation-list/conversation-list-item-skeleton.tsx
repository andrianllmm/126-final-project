import { Skeleton } from '@/shared/components/ui/skeleton';

export function ConversationListItemSkeleton() {
  return (
    <div className="flex items-center gap-3 rounded-xl px-4 py-3">
      <Skeleton className="size-8 rounded-full" />

      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/5" />
        <Skeleton className="h-3 w-4/5" />
      </div>
    </div>
  );
}
