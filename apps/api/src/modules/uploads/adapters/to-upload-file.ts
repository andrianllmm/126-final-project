import { UploadFile } from '../uploads.types.js';

export function toUploadFile(file: any): UploadFile {
  return {
    fieldname: file.fieldname,
    originalname: file.originalname,
    encoding: file.encoding,
    mimetype: file.mimetype,
    size: file.size,
    buffer: file.buffer,
    path: file.path,
    filename: file.filename,
  };
}
