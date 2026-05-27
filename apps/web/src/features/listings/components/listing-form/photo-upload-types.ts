export interface UploadedPhoto {
  id: string;
  preview: string;
  file?: File;
  existingImageId?: string;
  isMain?: boolean;
}

export const MAX_LISTING_PHOTOS = 5;
