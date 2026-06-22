export interface UploadUrlRequestDto {
  fileName: string;
  contentType: string;
  fileSize: number;
}

export interface MediaFileDto {
  id: string;
  fileName: string;
  fileUrl: string;
  objectKey: string;
  contentType: string;
  fileSize: number;
  createdAt: string;
}

export interface MediaConfirmUploadRequest {
  objectKey: string;
  fileName: string;
  contentType: string;
  fileSize: number;
}

export interface MediaFileUrlResponse {
  fileUrl: string;
  expiresAt: string;
}
