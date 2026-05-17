'use client';

import { Card, CardContent } from '@/shared/components/ui/card';
import { MapPin } from 'lucide-react';

interface ProductSummaryCardProps {
  productTitle: string;
  category: string;
  price: string;
  description: string;
  meetupLocation: string;
  meetupTime?: string;
}

/** Capitalizes the first letter of a string (e.g. "electronics" → "Electronics") */
function capitalize(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function ProductSummaryCard({
  productTitle,
  category,
  price,
  description,
  meetupLocation,
  meetupTime,
}: ProductSummaryCardProps) {
  return (
    <div className="flex flex-col gap-3 w-full">
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

          {/* Category & Price */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <p className="text-xs font-medium text-muted-foreground">
                Category
              </p>
              <p className="text-base font-semibold text-foreground">
                {capitalize(category)}
              </p>
            </div>
            <div className="space-y-1.5">
              <p className="text-xs font-medium text-muted-foreground">
                Asking Price
              </p>
              <p className="text-2xl font-bold text-primary tracking-tight">
                {price}
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <p className="text-xs font-medium text-muted-foreground">
              Description
            </p>
            <p className="text-base leading-relaxed text-muted-foreground">
              {description}
            </p>
          </div>

          {/* Meetup Location Box */}
          <div className="rounded-2xl border border-primary/40 bg-muted/50 p-5">
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">
                  Meetup Location
                </p>
                <p className="text-base font-bold text-card-foreground">
                  {meetupLocation}
                </p>
                {meetupTime && (
                  <p className="text-xs font-medium text-muted-foreground">
                    Preferred Time: {meetupTime}
                  </p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
