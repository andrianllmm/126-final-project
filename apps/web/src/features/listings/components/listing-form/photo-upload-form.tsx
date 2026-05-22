'use client';

import { useState, useEffect, useRef } from 'react';
import { Card } from '@/shared/components/ui/card';
import { Plus, X } from 'lucide-react';

interface UploadedPhoto {
  id: string;
  preview: string;
  file?: File;
  existingImageId?: string;
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
  const [targetIndex, setTargetIndex] = useState<number | null>(null);

  const maxPhotos = 5;
  const isInitialMount = useRef(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
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
    if (targetIndex === null) return;

    const filesArray = Array.from(files);

    const newPhotosPromises = filesArray.map((file) => {
      return new Promise<UploadedPhoto>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const preview = e.target?.result as string;
          resolve({
            id: `photo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            file,
            preview,
          });
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(newPhotosPromises).then((newPhotos) => {
      setLocalPhotos((prev) => {
        const updated = [...prev];
        let currentTarget = targetIndex;

        newPhotos.forEach((photo) => {
          while (currentTarget < maxPhotos) {
            updated[currentTarget] = photo;
            currentTarget++;
            break;
          }
        });

        const filtered = updated.filter(Boolean);
        return filtered.map((photo, idx) => ({
          ...photo,
          isMain: idx === 0,
        }));
      });
      setTargetIndex(null);
    });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) {
      setTargetIndex(null);
      return;
    }
    processFiles(files);
    event.target.value = '';
  };

  const removePhoto = (index: number) => {
    setLocalPhotos((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      return updated.map((photo, idx) => ({ ...photo, isMain: idx === 0 }));
    });
  };

  const triggerUploadAtBox = (index: number) => {
    setTargetIndex(index);
    fileInputRef.current?.click();
  };

  const SmallSlot = ({ index }: { index: number }) => {
    const photo = localPhotos[index];

    if (photo) {
      return (
        <Card className="relative group cursor-pointer overflow-hidden w-full h-full">
          <img
            src={photo.preview}
            alt={`Photo ${index + 1}`}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div
            className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10 cursor-pointer"
            onClick={() => triggerUploadAtBox(index)}
          >
            <span className="text-white text-sm font-medium">Change Photo</span>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              removePhoto(index);
            }}
            className="absolute top-2 right-2 text-white opacity-0 group-hover:opacity-100 transition-opacity z-20 p-1 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </Card>
      );
    }

    return (
      <Card
        onClick={() => triggerUploadAtBox(index)}
        className="border-2 border-dashed border-border hover:border-rose-500 dark:hover:border-rose-400/70 transition-colors w-full h-full bg-muted/40 cursor-pointer"
      >
        <div className="flex flex-col items-center justify-center h-full group">
          <Plus className="w-5 h-5 text-gray-400 dark:text-gray-500 mb-1 group-hover:text-rose-500 dark:group-hover:text-rose-400 transition-colors" />
          <p className="text-xs text-gray-400 dark:text-gray-500 group-hover:text-rose-500 dark:group-hover:text-rose-400 transition-colors">
            Add Photo
          </p>
        </div>
      </Card>
    );
  };

  return (
    <div className="space-y-4">
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        multiple
        onChange={handleFileChange}
        className="hidden"
      />

      <div>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Upload Photos
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Add up to {maxPhotos}&nbsp;photos. The first photo will be your
          listing&apos;s cover.
        </p>
      </div>

      <div className="flex gap-4 items-start">
        {/* Main/Cover Slot */}
        <div className="flex-2 h-75">
          {localPhotos[0] ? (
            <Card className="relative group cursor-pointer overflow-hidden w-full h-full">
              <img
                src={localPhotos[0].preview}
                alt="Main photo"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div
                className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10 cursor-pointer"
                onClick={() => triggerUploadAtBox(0)}
              >
                <span className="text-white text-sm font-medium">
                  Change Photo
                </span>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removePhoto(0);
                }}
                className="absolute top-2 right-2 text-white opacity-0 group-hover:opacity-100 transition-opacity z-20 p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </Card>
          ) : (
            <Card
              onClick={() => triggerUploadAtBox(0)}
              className="border-2 border-dashed border-border hover:border-rose-500 dark:hover:border-rose-400/70 transition-colors w-full h-full bg-muted/50 cursor-pointer"
            >
              <div className="flex flex-col items-center justify-center h-full group">
                <div className="w-14 h-14 bg-background rounded-full flex items-center justify-center mb-3 group-hover:bg-rose-50 dark:group-hover:bg-rose-900/20 transition-colors">
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
                  Add Main Photo
                </p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                  Required
                </p>
              </div>
            </Card>
          )}
        </div>

        <div className="flex-1 h-75">
          <SmallSlot index={1} />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[2, 3, 4].map((index) => (
          <div key={index} className="h-50">
            <SmallSlot index={index} />
          </div>
        ))}
      </div>

      <div className="text-sm text-gray-500 dark:text-gray-400">
        {localPhotos.length} of {maxPhotos} photos added
      </div>
    </div>
  );
}
