'use client';

import { useHealth } from '../hooks/use-health';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Spinner } from '@/shared/components/ui/spinner';

function HealthCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

function LoadingState() {
  return (
    <HealthCard title="Health">
      <Spinner />
    </HealthCard>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <HealthCard title="Unavailable">
      <p className="text-sm text-destructive">{message}</p>
    </HealthCard>
  );
}

export default function HealthStatus() {
  const { data, isLoading, error } = useHealth();

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState message={error.message} />;

  const isHealthy = data?.status === 'ok';

  return (
    <HealthCard title="Health">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-muted-foreground">Status</span>
        <Badge variant={isHealthy ? 'default' : 'destructive'}>
          {data?.status ?? 'unknown'}
        </Badge>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">App</span>
          <span className="font-medium">{data?.info?.app?.status}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-muted-foreground">Last check</span>
          <span className="font-mono text-xs">
            {data?.info?.app?.timestamp
              ? new Date(data.info.app.timestamp).toLocaleTimeString()
              : '-'}
          </span>
        </div>
      </div>
    </HealthCard>
  );
}
