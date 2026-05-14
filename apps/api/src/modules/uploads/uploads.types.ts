export interface UploadFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer?: Buffer;
  path?: string;
  filename?: string;
}

export interface UploadResult {
  key: string;
  url: string;
  mimeType: string;
  size: number;
  width?: number;
  height?: number;
}
