'use client';

import { Button } from '@/shared/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { useState } from 'react';

const productData = {
  name: 'Vintage Leather Jacket',
  images: [
    'https://images.unsplash.com/photo-1502389614483-e475fc34407e?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=774',
    'https://images.unsplash.com/photo-1618453292459-53424b66bb6a?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=928',
    'https://images.unsplash.com/photo-1618453292507-4959ece6429e?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=928',
    'https://images.unsplash.com/photo-1617984102437-a4aa52284d00?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=774',
    'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=774',
  ],
};

export function ProductSummaryImg() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % productData.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) =>
        (prev - 1 + productData.images.length) % productData.images.length,
    );
  };

  return (
    <div className="w-full not-prose">
      <div className="flex gap-2">
        {/* Thumbnails */}
        <div className="flex flex-col gap-2 w-16 shrink-0">
          {productData.images.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={cn(
                'aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 transition-colors',
                currentImageIndex === index
                  ? 'border-gray-900'
                  : 'border-transparent hover:border-gray-300',
              )}
            >
              <img
                src={image}
                alt={`${productData.name} ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>

        {/* Main Image */}
        <div className="flex-1 relative aspect-[4/5] bg-gray-100 rounded-xl overflow-hidden">
          <img
            src={productData.images[currentImageIndex]}
            alt={productData.name}
            className="w-full h-full object-cover"
          />

          {/* Navigation Arrows */}
          <Button
            variant="outline"
            size="icon"
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full h-8 w-8"
            onClick={prevImage}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full h-8 w-8"
            onClick={nextImage}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>

          {/* Image Counter */}
          <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs font-medium px-2 py-1 rounded-full">
            {currentImageIndex + 1} / {productData.images.length}
          </div>
        </div>
      </div>
    </div>
  );
}
