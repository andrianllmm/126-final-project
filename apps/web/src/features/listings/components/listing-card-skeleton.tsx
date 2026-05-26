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
        'cursor-pointer overflow-hidden border bg-background p-0 gap-1',
        'transition-all duration-200',
        className,
      )}
    >
      {/* IMAGE */}
      <div className="relative aspect-4/3 overflow-hidden bg-muted">
        <Skeleton className="h-full w-full" />
      </div>

      {/* HEADER */}
      <CardHeader className="space-y-3 px-4 pt-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-[80%]" />
          </div>

          <Skeleton className="h-5 w-12 shrink-0" />
        </div>
      </CardHeader>

      {/* CONTENT */}
      <CardContent className="space-y-3 px-4">
        <div className="space-y-2">
          <Skeleton className="h-3 w-[70%]" />
          <Skeleton className="h-3 w-[40%]" />
        </div>
      </CardContent>

      {/* FOOTER */}
      <CardFooter className="flex flex-col gap-2 px-4 pb-4 mt-auto">
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="size-6 rounded-full" />
            <Skeleton className="h-3 w-18" />
          </div>

          <div></div>
        </div>

        <Skeleton className="h-9 w-full" />
      </CardFooter>
    </Card>
  );
}
