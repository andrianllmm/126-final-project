import { Skeleton } from '@/shared/components/ui/skeleton';

export function ConversationListItemSkeleton() {
  return (
    <div className="flex items-center gap-3 rounded-2xl px-3 py-2">
      {/* Avatar */}
      <Skeleton className="size-14 rounded-full shrink-0" />

      {/* Content */}
      <div className="flex-1 min-w-0 py-0.5">
        {/* Title row */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-2/3" />
        </div>

        {/* Participant name */}
        <Skeleton className="mt-2 h-3 w-1/3" />

        {/* Preview */}
        <div className="mt-2 flex items-center gap-2">
          <Skeleton className="h-3 w-4/5" />
        </div>
      </div>
    </div>
  );
}
