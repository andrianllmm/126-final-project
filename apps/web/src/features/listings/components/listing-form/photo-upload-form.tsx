'use client';

import { useState, useEffect, useRef } from 'react';
import { Card } from '@/shared/components/ui/card';
import { Plus, X } from 'lucide-react';

interface UploadedPhoto {
  id: string;
  file: File;
  preview: string;
  isMain?: boolean;
}

interface PhotoUploadFormProps {
  photos?: UploadedPhoto[];
  onChange?: (photos: UploadedPhoto[]) => void;
}

export function PhotoUploadForm({
  photos = [],
  onChange,
}: PhotoUploadFormProps) {
  const [localPhotos, setLocalPhotos] = useState<UploadedPhoto[]>(photos);
  const maxPhotos = 5;
  const isInitialMount = useRef(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Only update if incoming props actually differ to prevent local state overwrite
    if (
      JSON.stringify(photos.map((p) => p.id)) !==
      JSON.stringify(localPhotos.map((p) => p.id))
    ) {
      setLocalPhotos(photos);
    }
  }, [photos]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (onChange) {
      onChange(localPhotos);
    }
  }, [localPhotos, onChange]);

  const processFiles = (files: FileList) => {
    const remainingSlots = maxPhotos - localPhotos.length;
    if (remainingSlots <= 0) return;

    // Limit incoming files based on available remaining slots
    const filesToProcess = Array.from(files).slice(0, remainingSlots);

    const newPhotosPromises = filesToProcess.map((file, index) => {
      return new Promise<UploadedPhoto>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const preview = e.target?.result as string;
          resolve({
            id: `photo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            file,
            preview,
            // Automatically set main if it's the absolute first photo
            isMain: localPhotos.length === 0 && index === 0,
          });
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(newPhotosPromises).then((newPhotos) => {
      setLocalPhotos((prev) => {
        const updated = [...prev, ...newPhotos];
        // Enforce that the first item always claims the main photo indicator
        return updated.map((photo, idx) => ({ ...photo, isMain: idx === 0 }));
      });
    });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    processFiles(files);

    // Reset input value so the same file(s) can be selected again if removed
    event.target.value = '';
  };

  const removePhoto = (index: number) => {
    setLocalPhotos((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      return updated.map((photo, idx) => ({ ...photo, isMain: idx === 0 }));
    });
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  // Helper render logic for a generic slot block
  const PhotoSlot = ({ index }: { index: number }) => {
    const photo = localPhotos[index];

    if (photo) {
      return (
        <Card className="relative group cursor-pointer overflow-hidden w-full h-full">
          <img
            src={photo.preview}
            alt={`Photo ${index + 1}`}
            className="w-full h-full object-cover"
          />
          <div
            className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
            onClick={triggerUpload}
          >
            <span className="text-white text-sm font-medium">
              Change Photos
            </span>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              removePhoto(index);
            }}
            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity z-10"
          >
            <X className="w-4 h-4" />
          </button>
        </Card>
      );
    }

    // Only render the actionable "Add" card if it's the very next empty slot
    const isNextAvailableSlot = index === localPhotos.length;

    if (isNextAvailableSlot) {
      return (
        <Card
          onClick={triggerUpload}
          className="border-2 border-dashed border-gray-200 dark:border-gray-600/50 hover:border-gray-400 dark:hover:border-gray-500 transition-colors w-full h-full dark:bg-gray-700/30 cursor-pointer flex flex-col items-center justify-center group"
        >
          <Plus className="w-5 h-5 text-gray-400 dark:text-gray-500 mb-1 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
          <p className="text-xs text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">
            Add Photo
          </p>
        </Card>
      );
    }

    // Dead background slot placeholder
    return (
      <Card className="border border-gray-100 dark:border-gray-800/50 w-full h-full bg-gray-50/50 dark:bg-gray-800/10" />
    );
  };

  return (
    <div className="space-y-4">
      {/* Hidden Master Input */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        multiple
        onChange={handleFileChange}
        className="hidden"
        disabled={localPhotos.length >= maxPhotos}
      />

      <div>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Upload Photos
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Add up to {maxPhotos} photos. The first photo will be your
          listing&apos;s cover. You can select multiple photos at once.
        </p>
      </div>

      {/* Grid Layout Setup */}
      <div className="flex gap-4 items-start">
        {/* Main/Cover Slot */}
        <div className="flex-[2] h-[300px]">
          {localPhotos[0] ? (
            <Card className="relative group cursor-pointer overflow-hidden w-full h-full">
              <img
                src={localPhotos[0].preview}
                alt="Main photo"
                className="w-full h-full object-cover"
              />
              <div
                className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                onClick={triggerUpload}
              >
                <span className="text-white text-sm font-medium">
                  Change Photos
                </span>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removePhoto(0);
                }}
                className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity z-10"
              >
                <X className="w-4 h-4" />
              </button>
            </Card>
          ) : (
            <Card
              onClick={triggerUpload}
              className="border-2 border-dashed border-gray-300 dark:border-gray-600/50 hover:border-rose-500 dark:hover:border-rose-400/70 transition-colors w-full h-full dark:bg-gray-700/30 cursor-pointer flex flex-col items-center justify-center group"
            >
              <div className="w-14 h-14 bg-gray-100 dark:bg-gray-600/40 rounded-full flex items-center justify-center mb-3 group-hover:bg-rose-50 dark:group-hover:bg-rose-900/20 transition-colors">
                <svg
                  className="w-7 h-7 text-gray-400 dark:text-gray-400 group-hover:text-rose-400 transition-colors"
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
              <p className="font-semibold text-gray-700 dark:text-gray-300">
                Add Photos
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                Multi-select supported
              </p>
            </Card>
          )}
        </div>

        {/* Second Slot */}
        <div className="flex-1 h-[300px]">
          <PhotoSlot index={1} />
        </div>
      </div>

      {/* Slots 3, 4, 5 */}
      <div className="grid grid-cols-3 gap-4">
        {[2, 3, 4].map((index) => (
          <div key={index} className="h-[200px]">
            <PhotoSlot index={index} />
          </div>
        ))}
      </div>

      <div className="text-sm text-gray-500 dark:text-gray-400">
        {localPhotos.length} of {maxPhotos} photos added
      </div>
    </div>
  );
}
