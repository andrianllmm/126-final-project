import { Card, CardContent } from '@/shared/components/ui/card';
import { cn } from '@/shared/lib/utils';
import Link from 'next/link';
import type { TransactionUser } from '@repo/api';

interface UserCardCompactProps {
  user: TransactionUser;
  rating?: number;
  reviewCount?: number;
  className?: string;
}

export function UserCardCompact({ user, className }: UserCardCompactProps) {
  return (
    <Link href={`/profile/${user.id}`}>
      <Card
        className={cn(
          'hover:bg-muted/50 transition-colors cursor-pointer',
          className,
        )}
      >
        <CardContent className="px-y">
          <div className="flex items-center gap-4">
            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate">{user.name}</p>
              <p className="text-sm text-muted-foreground truncate">
                {user.email}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
