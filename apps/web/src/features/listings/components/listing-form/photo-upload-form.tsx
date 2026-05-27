'use client';

import { useRef } from 'react';

import { MAX_LISTING_PHOTOS, type UploadedPhoto } from './photo-upload-types';
import { PhotoUploadSlot } from './photo-upload-slot';

interface PhotoUploadFormProps {
  photos?: UploadedPhoto[];
  onChange?: (photos: UploadedPhoto[]) => void;
}

export function PhotoUploadForm({
  photos = [],
  onChange,
}: PhotoUploadFormProps) {
  const targetIndexRef = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const readFileAsPhoto = (file: File) =>
    new Promise<UploadedPhoto>((resolve) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        resolve({
          id: crypto.randomUUID(),
          file,
          preview: String(event.target?.result ?? ''),
        });
      };

      reader.readAsDataURL(file);
    });

  const mergePhotos = (
    currentPhotos: UploadedPhoto[],
    startIndex: number,
    incomingPhotos: UploadedPhoto[],
  ) => {
    const updatedPhotos = [...currentPhotos];
    let insertIndex = startIndex;

    for (const photo of incomingPhotos) {
      if (insertIndex >= MAX_LISTING_PHOTOS) break;

      updatedPhotos[insertIndex] = photo;
      insertIndex += 1;
    }

    return updatedPhotos
      .filter((photo): photo is UploadedPhoto => Boolean(photo))
      .map((photo, index) => ({
        ...photo,
        isMain: index === 0,
      }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    const targetIndex = targetIndexRef.current;

    if (!files || files.length === 0 || targetIndex === null) {
      targetIndexRef.current = null;
      return;
    }

    Promise.all(Array.from(files).map((file) => readFileAsPhoto(file))).then(
      (newPhotos) => {
        onChange?.(mergePhotos(photos, targetIndex, newPhotos));
      },
    );

    targetIndexRef.current = null;
    event.target.value = '';
  };

  const removePhoto = (index: number) => {
    onChange?.(
      photos
        .filter((_, currentIndex) => currentIndex !== index)
        .map((photo, currentIndex) => ({
          ...photo,
          isMain: currentIndex === 0,
        })),
    );
  };

  const triggerUploadAtBox = (index: number) => {
    targetIndexRef.current = index;
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-6">
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        multiple
        onChange={handleFileChange}
        className="hidden"
      />

      <div>
        <h2 className="mb-2 text-2xl font-semibold text-foreground">
          Upload Photos
        </h2>
        <p className="text-muted-foreground">
          Add up to {MAX_LISTING_PHOTOS} photos. The first photo will be your
          listing&apos;s cover.
        </p>
      </div>

      {/* RESPONSIVE GRID LAYOUT */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* MAIN IMAGE */}
        <div className="sm:col-span-2 h-80 sm:h-75">
          <PhotoUploadSlot
            index={0}
            photo={photos[0]}
            variant="main"
            onSelect={triggerUploadAtBox}
            onRemove={removePhoto}
            className="h-full w-full"
          />
        </div>

        {/* SECOND SLOT */}
        <div className="sm:col-span-1 h-80 sm:h-75">
          <PhotoUploadSlot
            index={1}
            photo={photos[1]}
            variant="secondary"
            onSelect={triggerUploadAtBox}
            onRemove={removePhoto}
            className="h-full w-full"
          />
        </div>

        {/* MOBILE */}
        {[2, 3, 4].map((index) => (
          <div key={index} className="sm:col-span-1 h-80 sm:h-50">
            <PhotoUploadSlot
              index={index}
              photo={photos[index]}
              variant="secondary"
              onSelect={triggerUploadAtBox}
              onRemove={removePhoto}
              className="h-full w-full"
            />
          </div>
        ))}
      </div>

      <div className="text-sm text-muted-foreground">
        {photos.length} of {MAX_LISTING_PHOTOS} photos added
      </div>
    </div>
  );
}
