'use client';

import { Card, CardContent } from '@/shared/components/ui/card';
import { ListingConditionBadge } from '@/features/listings/components/listing-condition-badge';
import { currencyFormatter } from '@/shared/lib/currency-formatter';
import { ListingCondition } from '@repo/api';

interface ProductSummaryCardProps {
  productTitle: string;
  categoryName?: string;
  price: number;
  description: string;
  condition?: ListingCondition;
}

export function ProductSummaryCard({
  productTitle,
  categoryName,
  price,
  description,
  condition,
}: ProductSummaryCardProps) {
  return (
    <div className="flex flex-col gap-3 w-full min-w-sm max-w-xl">
      <Card className="w-full bg-card overflow-hidden border border-border/70 shadow-sm rounded-2xl">
        <CardContent className="px-9 pt-4 pb-5 space-y-6">
          {/* Title */}
          <h2 className="text-xl font-bold text-card-foreground">
            Product Summary
          </h2>

          {/* Product Title */}
          <div className="space-y-1.5">
            <p className="text-xs font-medium text-muted-foreground">
              Product Title
            </p>
            <p className="text-xl font-bold text-card-foreground tracking-tight">
              {productTitle}
            </p>
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <p className="text-xs font-medium text-muted-foreground">
              Category
            </p>
            <p className="text-base font-semibold text-foreground">
              {categoryName ?? 'Uncategorized'}
            </p>
          </div>

          {/* Condition */}
          {condition && (
            <div className="space-y-1.5">
              <p className="text-xs font-medium text-muted-foreground">
                Condition
              </p>
              <ListingConditionBadge condition={condition} />
            </div>
          )}

          {/* Description */}
          <div className="space-y-1.5">
            <p className="text-xs font-medium text-muted-foreground">
              Description
            </p>
            <p className="text-base leading-relaxed text-muted-foreground">
              {description}
            </p>
          </div>

          {/* Price */}
          <div className="space-y-1.5">
            <p className="text-xs font-medium text-muted-foreground">
              Asking Price
            </p>
            <p className="text-2xl font-bold text-primary tracking-tight">
              {currencyFormatter.format(price)}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
