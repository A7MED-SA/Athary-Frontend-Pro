export interface UploadUrlRequestDto {
  fileType: number;
  fileName: string;
  contentType: string;
  fileSizeBytes: number;
  visibility: number;
}

export interface MediaFileDto {
  id: string;
  fileName: string;
  fileUrl: string;
  objectKey: string;
  bucket: string;
  contentType: string;
  fileSizeBytes: number;
  createdAt: string;
}

export interface MediaConfirmUploadRequest {
  fileId: string;
  objectKey: string;
  bucket: string;
}

export interface MediaFileUrlResponse {
  fileUrl: string;
  expiresAt: string;
}
