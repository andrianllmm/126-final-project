'use client';

import Image from 'next/image';
import { Button } from '@/shared/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { useState } from 'react';

interface ProductSummaryImgProps {
  photos?: { preview: string }[];
}

export function ProductSummaryImg({ photos = [] }: ProductSummaryImgProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const displayImages = photos.length > 0 ? photos.map((p) => p.preview) : [];

  const nextImage = () => {
    if (!displayImages.length) return;
    setCurrentImageIndex((prev) => (prev + 1) % displayImages.length);
  };

  const prevImage = () => {
    if (!displayImages.length) return;
    setCurrentImageIndex(
      (prev) => (prev - 1 + displayImages.length) % displayImages.length,
    );
  };

  const selectImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  if (displayImages.length === 0) {
    return (
      <div className="w-full not-prose">
        <div className="flex gap-2 flex-col sm:flex-row">
          <div className="flex flex-row sm:flex-col gap-2 w-full sm:w-24 shrink-0">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="aspect-square w-16 sm:w-full bg-muted rounded-lg border-2 border-border"
              />
            ))}
          </div>

          <div className="w-full sm:w-95 md:w-105 relative aspect-4/5 bg-muted rounded-xl overflow-hidden flex items-center justify-center">
            <p className="text-muted-foreground text-sm">
              No photos uploaded yet
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full not-prose">
      <div className="flex gap-2 flex-col sm:flex-row items-start">
        {/* Thumbnails */}
        <div className="flex flex-row sm:flex-col gap-2 w-full sm:w-24 shrink-0 overflow-x-auto sm:overflow-visible">
          {displayImages.map((image, index) => (
            <button
              key={index}
              onClick={() => selectImage(index)}
              className={cn(
                'relative aspect-square w-16 sm:w-full bg-muted rounded-lg overflow-hidden border-2 transition-colors shrink-0',
                currentImageIndex === index
                  ? 'border-primary'
                  : 'border-transparent hover:border-primary/40',
              )}
            >
              <Image
                src={image}
                alt={`Photo ${index + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>

        {/* Main Image */}
        <div className="w-full sm:w-90 md:w-105 lg:w-115 relative aspect-4/5 bg-muted rounded-xl overflow-hidden">
          <Image
            src={displayImages[currentImageIndex]}
            alt="Product"
            fill
            priority
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 360px, (max-width: 1024px) 420px, 460px"
          />

          {/* Navigation */}
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

          {/* Counter */}
          <div className="absolute bottom-3 right-3 bg-foreground/60 text-background text-xs font-medium px-2 py-1 rounded-full">
            {currentImageIndex + 1} / {displayImages.length}
          </div>
        </div>
      </div>
    </div>
  );
}
