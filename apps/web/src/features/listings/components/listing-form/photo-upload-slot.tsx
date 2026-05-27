'use client';

import { Card } from '@/shared/components/ui/card';
import { cn } from '@/shared/lib/utils';
import { Plus, X } from 'lucide-react';
import Image from 'next/image';

import type { UploadedPhoto } from './photo-upload-types';

interface PhotoUploadSlotProps {
  index: number;
  photo?: UploadedPhoto;
  variant: 'main' | 'secondary';
  onSelect: (index: number) => void;
  onRemove: (index: number) => void;
  className?: string;
}

export function PhotoUploadSlot({
  index,
  photo,
  variant,
  onSelect,
  onRemove,
  className,
}: PhotoUploadSlotProps) {
  const isMainSlot = variant === 'main';

  if (photo) {
    return (
      <Card
        className={cn(
          'group relative cursor-pointer overflow-hidden border-border',
          className,
        )}
      >
        <Image
          src={photo.preview}
          alt={isMainSlot ? 'Main photo' : `Photo ${index + 1}`}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />

        <div
          className="absolute inset-0 z-10 flex items-center justify-center bg-foreground/40 opacity-0 transition-opacity group-hover:opacity-100"
          onClick={() => onSelect(index)}
        >
          <span className="text-sm font-medium text-primary-foreground">
            Change Photo
          </span>
        </div>

        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onRemove(index);
          }}
          className="absolute right-2 top-2 z-20 rounded-full bg-background/90 p-1 text-foreground opacity-0 shadow-sm transition-opacity hover:bg-background group-hover:opacity-100"
        >
          <X className="size-4" />
        </button>
      </Card>
    );
  }

  if (isMainSlot) {
    return (
      <Card
        onClick={() => onSelect(index)}
        className={cn(
          'group flex h-full w-full cursor-pointer flex-col items-center justify-center border-2 border-dashed border-border bg-muted/50 transition-colors hover:border-primary',
          className,
        )}
      >
        <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-background transition-colors group-hover:bg-primary/10">
          <svg
            className="size-7 text-muted-foreground transition-colors group-hover:text-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </div>
        <p className="font-semibold text-foreground">Add Main Photo</p>
        <p className="mt-1 text-sm text-muted-foreground">Required</p>
      </Card>
    );
  }

  return (
    <Card
      onClick={() => onSelect(index)}
      className={cn(
        'group flex h-full w-full cursor-pointer flex-col items-center justify-center border-2 border-dashed border-border bg-muted/40 transition-colors hover:border-primary',
        className,
      )}
    >
      <Plus className="mb-1 size-5 text-muted-foreground transition-colors group-hover:text-primary" />
      <p className="text-xs text-muted-foreground transition-colors group-hover:text-primary">
        Add Photo
      </p>
    </Card>
  );
}
