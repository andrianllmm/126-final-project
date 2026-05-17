'use client';

import { useState, useEffect, useRef } from 'react';
import { Card } from '@/shared/components/ui/card';
import { Plus } from 'lucide-react';

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

  useEffect(() => {
    setLocalPhotos(photos);
  }, []);

  useEffect(() => {
    // Skip first mount to avoid circular updates
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (onChange) {
      onChange(localPhotos);
    }
  }, [localPhotos]);

  const handlePhotoUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const files = event.target.files;
    if (!files || !files[0]) return;

    const file = files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const preview = e.target?.result as string;
      const newPhoto: UploadedPhoto = {
        id: `photo-${Date.now()}`,
        file,
        preview,
        isMain: index === 0 && localPhotos.length === 0,
      };

      const updatedPhotos = [...localPhotos];
      updatedPhotos[index] = newPhoto;
      setLocalPhotos(updatedPhotos);
    };

    reader.readAsDataURL(file);
  };

  const removePhoto = (index: number) => {
    const updatedPhotos = localPhotos.filter((_, i) => i !== index);
    setLocalPhotos(updatedPhotos);
  };

  const SmallSlot = ({ index }: { index: number }) =>
    localPhotos[index] ? (
      <Card className="relative group cursor-pointer overflow-hidden w-full h-full">
        <img
          src={localPhotos[index].preview}
          alt={`Photo ${index + 1}`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <label className="cursor-pointer">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handlePhotoUpload(e, index)}
              className="hidden"
            />
            <span className="text-white text-sm font-medium">Change</span>
          </label>
        </div>
        <button
          onClick={() => removePhoto(index)}
          className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
        >
          ✕
        </button>
      </Card>
    ) : (
      <Card className="border-2 border-dashed border-gray-200 dark:border-gray-600/50 hover:border-gray-400 dark:hover:border-gray-500 transition-colors w-full h-full dark:bg-gray-700/30">
        <label className="flex flex-col items-center justify-center h-full cursor-pointer group">
          <Plus className="w-5 h-5 text-gray-400 dark:text-gray-500 mb-1 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
          <p className="text-xs text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">
            Add Photo
          </p>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handlePhotoUpload(e, index)}
            className="hidden"
          />
        </label>
      </Card>
    );

  return (
    <div className="space-y-4">
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
        <div className="flex-[2] h-[300px]">
          {localPhotos[0] ? (
            <Card className="relative group cursor-pointer overflow-hidden w-full h-full">
              <img
                src={localPhotos[0].preview}
                alt="Main photo"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handlePhotoUpload(e, 0)}
                    className="hidden"
                  />
                  <span className="text-white text-sm font-medium">
                    Change Photo
                  </span>
                </label>
              </div>
              <button
                onClick={() => removePhoto(0)}
                className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ✕
              </button>
            </Card>
          ) : (
            <Card className="border-2 border-dashed border-gray-300 dark:border-gray-600/50 hover:border-rose-500 dark:hover:border-rose-400/70 transition-colors w-full h-full dark:bg-gray-700/30">
              <label className="flex flex-col items-center justify-center h-full cursor-pointer group">
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
                  Add Main Photo
                </p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                  Required
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handlePhotoUpload(e, 0)}
                  className="hidden"
                />
              </label>
            </Card>
          )}
        </div>

        <div className="flex-1 h-[200px]">
          <SmallSlot index={1} />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[2, 3, 4].map((index) => (
          <div key={index} className="h-[200px]">
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
