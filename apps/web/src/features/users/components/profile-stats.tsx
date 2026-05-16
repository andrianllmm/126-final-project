'use client';

import { useUserProfileStats } from '../hooks/use-user-profile';
import { Skeleton } from '@/shared/components/ui/skeleton';

export function ProfileStats({ userId }: { userId: string }) {
  const { data, isLoading, error } = useUserProfileStats(userId);

  if (isLoading) return <ProfileStatsLoading />;
  if (error || !data) return null;

  const stats = [
    {
      label: 'Rating',
      value: data.averageRating.toFixed(1),
    },
    {
      label: 'Reviews',
      value: data.reviewCount.toLocaleString(),
    },
    {
      label: 'Sales',
      value: data.salesCount.toLocaleString(),
    },
    {
      label: 'Listings',
      value: data.listingCount.toLocaleString(),
    },
    {
      label: 'Response Rate',
      value: `${data.responseRate * 100}%`,
    },
  ];

  return (
    <div className="grid w-full grid-cols-2 gap-y-6 px-6 py-5 sm:grid-cols-3 lg:grid-cols-5">
      {stats.map((stat) => (
        <div key={stat.label} className="flex flex-col">
          <p className="text-xl font-bold">{stat.value}</p>
          <p className="text-sm text-muted-foreground">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}

function ProfileStatsLoading() {
  return (
    <div className="grid w-full grid-cols-2 gap-y-6 px-6 py-5 sm:grid-cols-3 lg:grid-cols-5">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="flex flex-col gap-2">
          <Skeleton className="h-7 w-16" />
          <Skeleton className="h-4 w-24" />
        </div>
      ))}
    </div>
  );
}
