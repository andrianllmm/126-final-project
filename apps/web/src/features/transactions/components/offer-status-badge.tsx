import { Badge } from '@/shared/components/ui/badge';
import { OfferStatus } from '@repo/api';

const offerStatusMap: Record<
  OfferStatus,
  {
    label: string;
    variant: 'default' | 'secondary' | 'destructive' | 'outline';
  }
> = {
  [OfferStatus.PENDING]: {
    label: 'Pending',
    variant: 'secondary',
  },
  [OfferStatus.ACCEPTED]: {
    label: 'Accepted',
    variant: 'default',
  },
  [OfferStatus.REJECTED]: {
    label: 'Rejected',
    variant: 'destructive',
  },
  [OfferStatus.SUPERSEDED]: {
    label: 'Superseded',
    variant: 'outline',
  },
};

export function OfferStatusBadge({ status }: { status: OfferStatus }) {
  const config = offerStatusMap[status] ?? {
    label: String(status),
    variant: 'outline',
  };

  return <Badge variant={config.variant}>{config.label}</Badge>;
}
