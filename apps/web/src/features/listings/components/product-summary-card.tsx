'use client';

import { Card, CardContent } from '@/shared/components/ui/card';
import { MapPin } from 'lucide-react';
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
    <div className="flex flex-col gap-3 w-full max-w-3xl">
      <Card className="w-full bg-white overflow-hidden border border-slate-200/70 shadow-sm rounded-2xl">
        <CardContent className="px-9 pt-4 pb-5 space-y-6">
          {/* Title */}
          <h2 className="text-xl font-bold text-[#0f172a]">Product Summary</h2>

          {/* Product Title */}
          <div className="space-y-1.5">
            <p className="text-xs font-medium text-slate-400">Product Title</p>
            <p className="text-xl font-bold text-[#0f172a] tracking-tight">
              {productTitle}
            </p>
          </div>

          {/* Category & Price */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <p className="text-xs font-medium text-slate-400">Category</p>
              <p className="text-base font-semibold text-slate-800">
                {category}
              </p>
            </div>
            <div className="space-y-1.5">
              <p className="text-xs font-medium text-slate-400">Asking Price</p>
              <p className="text-2xl font-bold text-[#db0527] tracking-tight">
                {price}
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <p className="text-xs font-medium text-slate-400">Description</p>
            <p className="text-base leading-relaxed text-slate-600">
              {description}
            </p>
          </div>

          {/* Meetup Location Box */}
          <div className="rounded-2xl border border-primary/40 bg-slate-50/50 p-5">
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#db0527]" />
              <div className="space-y-1">
                <p className="text-xs font-medium text-slate-400">
                  Meetup Location
                </p>
                <p className="text-base font-bold text-[#0f172a]">
                  {meetupLocation}
                </p>
                {meetupTime && (
                  <p className="text-xs font-medium text-slate-500">
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

export function ProductSummaryCardExample() {
  return <ProductSummaryCard {...productSummaryDummyData} />;
}
