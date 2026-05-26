'use client';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/shared/components/ui/card';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { cn } from '@/shared/lib/utils';

interface ListingCardSkeletonProps {
  className?: string;
}

export function ListingCardSkeleton({ className }: ListingCardSkeletonProps) {
  return (
    <Card
      className={cn(
        'overflow-hidden border bg-background p-0 gap-1',
        className,
      )}
    >
      {/* IMAGE */}
      <div className="relative aspect-4/3 overflow-hidden bg-muted">
        <Skeleton className="h-full w-full" />

        {/* badges */}
        <div className="absolute left-3 top-3 flex gap-2">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
      </div>

      {/* HEADER */}
      <CardHeader className="space-y-3 px-4 pt-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>

          <Skeleton className="h-6 w-20 shrink-0" />
        </div>
      </CardHeader>

      {/* CONTENT */}
      <CardContent className="space-y-3 px-4">
        <div className="space-y-2">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-5/6" />
        </div>

        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-4 w-28" />
        </div>
      </CardContent>

      {/* FOOTER */}
      <CardFooter className="px-4 pb-4 pt-4">
        <Skeleton className="h-9 w-full" />
      </CardFooter>
    </Card>
  );
}
