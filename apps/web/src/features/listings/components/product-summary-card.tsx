'use client';

import { Card, CardContent, CardHeader } from '@/shared/components/ui/card';
import { MapPin, AlertCircle } from 'lucide-react';
import { productSummaryDummyData } from './dummy-data';

interface ProductSummaryCardProps {
  productTitle: string;
  category: string;
  price: string;
  description: string;
  meetupLocation: string;
  meetupTime?: string;
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
    <div className="flex flex-col gap-3 w-full max-w-sm">
      {/* Main Product Summary Card */}
      <Card className="w-full bg-white">
        <CardHeader className="pb-2">
          <h3 className="text-base font-semibold text-foreground">
            Product Summary
          </h3>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Product Title */}
          <div className="space-y-0.5">
            <p className="text-xs text-muted-foreground">Product Title</p>
            <p className="text-lg font-bold text-foreground leading-tight">
              {productTitle}
            </p>
          </div>

          {/* Category & Price */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-0.5">
              <p className="text-xs text-muted-foreground">Category</p>
              <p className="text-sm text-foreground">{category}</p>
            </div>
            <div className="space-y-0.5">
              <p className="text-xs text-muted-foreground">Asking Price</p>
              <p className="text-lg font-bold text-destructive">{price}</p>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-0.5">
            <p className="text-xs text-muted-foreground">Description</p>
            <p className="text-sm leading-relaxed text-foreground">
              {description}
            </p>
          </div>

          {/* Meetup Location */}
          <div className="rounded-lg border border-border bg-muted/30 p-3">
            <div className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-destructive" />
              <div className="space-y-0.5">
                <p className="text-xs text-muted-foreground">Meetup Location</p>
                <p className="text-sm font-semibold text-foreground">
                  {meetupLocation}
                </p>
                {meetupTime && (
                  <p className="text-xs text-muted-foreground">
                    Preferred Time: {meetupTime}
                  </p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Final Review Confirmation Card */}
      <Card className="w-full bg-white">
        <CardContent className="pt-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-destructive" />
            <div className="space-y-1">
              <p className="text-sm font-semibold text-foreground">
                Final Review Confirmation
              </p>
              <p className="text-xs leading-relaxed text-muted-foreground">
                Please review all information above carefully. By publishing
                this listing, you confirm that the description is accurate and
                the items adhere to the UP Visayas Community Marketplace
                guidelines. Once published, this listing will be visible to all
                verified students and faculty.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// usage with dummy data
export function ProductSummaryCardExample() {
  return <ProductSummaryCard {...productSummaryDummyData} />;
}
