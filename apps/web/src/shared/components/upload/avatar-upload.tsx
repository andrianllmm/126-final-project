'use client';

import * as React from 'react';
import { Camera, Trash2 } from 'lucide-react';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/shared/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import {
  FileUpload,
  FileUploadTrigger,
} from '@/shared/components/ui/file-upload';

type AvatarUploadProps = {
  value: File[];
  onValueChange: (files: File[]) => void;
  defaultSrc: string | null;
};

export const AvatarUpload = ({
  value,
  onValueChange,
  defaultSrc,
}: AvatarUploadProps) => {
  const file = value?.[0] ?? null;

  const previewUrl = React.useMemo(() => {
    if (file) return URL.createObjectURL(file);
    return defaultSrc ?? null;
  }, [file, defaultSrc]);

  const hasImage = Boolean(previewUrl);

  const handleRemove = () => {
    onValueChange([]);
  };

  const canRemove = Boolean(file || defaultSrc);

  React.useEffect(() => {
    if (!file || !previewUrl) return;

    return () => {
      URL.revokeObjectURL(previewUrl);
    };
  }, [file, previewUrl]);

  return (
    <div className="flex flex-col items-center gap-4">
      <FileUpload
        value={value}
        onValueChange={onValueChange}
        accept="image/*"
        maxFiles={1}
        maxSize={2 * 1024 * 1024} // 2MB
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="group relative cursor-pointer rounded-full focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <Avatar className="size-24">
                {hasImage && previewUrl ? (
                  <AvatarImage src={previewUrl} alt="Avatar" />
                ) : (
                  <AvatarFallback className="bg-muted" />
                )}
              </Avatar>

              <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                <Camera className="size-6 text-white" />
              </div>
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="center">
            <FileUploadTrigger asChild>
              <DropdownMenuItem>
                <Camera className="mr-2 size-4" />
                Upload
              </DropdownMenuItem>
            </FileUploadTrigger>

            {canRemove && (
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={handleRemove}
              >
                <Trash2 className="mr-2 size-4" />
                Remove
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </FileUpload>
    </div>
  );
};
