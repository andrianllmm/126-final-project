import { apiClient } from '@/shared/lib/api-client';

/**
 * Response returned after uploading a file.
 */
export type UploadResponse = {
  id: string;
  url: string;
  filename?: string;
  size?: number;
  mimeType?: string;
  createdAt?: string;
};

/**
 * Response returned after deleting an upload.
 */
export type DeleteUploadResponse = {
  success: true;
};

export const uploadFile = (file: File, fieldName = 'file') => {
  const formData = new FormData();
  formData.append(fieldName, file);

  return apiClient.post<UploadResponse, FormData>('/uploads', formData);
};

export const deleteUpload = (uploadId: string) =>
  apiClient.delete<DeleteUploadResponse>(`/uploads/${uploadId}`);
