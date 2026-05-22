'use client';

import { Button } from '@/shared/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { useState } from 'react';

interface ProductSummaryImgProps {
  photos?: { preview: string }[];
}

export function ProductSummaryImg({ photos = [] }: ProductSummaryImgProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Use uploaded photos if available, otherwise show placeholder
  const displayImages = photos.length > 0 ? photos.map((p) => p.preview) : [];

  const nextImage = () => {
    if (displayImages.length === 0) return;
    setCurrentImageIndex((prev) => (prev + 1) % displayImages.length);
  };

  const prevImage = () => {
    if (displayImages.length === 0) return;
    setCurrentImageIndex(
      (prev) => (prev - 1 + displayImages.length) % displayImages.length,
    );
  };

  // If no photos uploaded, show empty state
  if (displayImages.length === 0) {
    return (
      <div className="w-full not-prose">
        <div className="flex gap-2">
          <div className="flex flex-col gap-2 w-24 shrink-0">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="aspect-square bg-muted rounded-lg border-2 border-border"
              />
            ))}
          </div>
          <div className="flex-1 relative aspect-4/5 bg-muted rounded-xl overflow-hidden flex items-center justify-center">
            <p className="text-muted-foreground">No photos uploaded yet</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full not-prose">
      <div className="flex gap-2">
        {/* Thumbnails */}
        <div className="flex flex-col gap-2 w-24 shrink-0">
          {displayImages.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={cn(
                'aspect-square bg-muted rounded-lg overflow-hidden border-2 transition-colors',
                currentImageIndex === index
                  ? 'border-primary'
                  : 'border-transparent hover:border-primary/40',
              )}
            >
              <img
                src={image}
                alt={`Photo ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>

        {/* Main Image */}
        <div className="flex-1 relative aspect-4/5 bg-muted rounded-xl overflow-hidden">
          <img
            src={displayImages[currentImageIndex]}
            alt="Product"
            className="w-full h-full object-cover"
          />

          {/* Navigation Arrows */}
          <Button
            type="button"
            variant="default"
            size="icon"
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-background text-foreground hover:bg-muted rounded-full h-10 w-10 border border-border shadow-md"
            onClick={prevImage}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <Button
            type="button"
            variant="default"
            size="icon"
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-background text-foreground hover:bg-muted rounded-full h-10 w-10 border border-border shadow-md"
            onClick={nextImage}
          >
            <ChevronRight className="w-5 h-5" />
          </Button>

          {/* Image Counter */}
          <div className="absolute bottom-3 right-3 bg-foreground/60 text-background text-xs font-medium px-2 py-1 rounded-full">
            {currentImageIndex + 1} / {displayImages.length}
          </div>
        </div>
      </div>
    </div>
  );
}
