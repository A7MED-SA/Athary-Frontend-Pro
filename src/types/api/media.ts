export interface UploadUrlRequestDto {
  fileType: number;
  fileName: string;
  contentType: string;
  fileSizeBytes: number;
  visibility: number;
}

export interface UploadUrlResponseDto {
  fileId: string;
  uploadUrl: string;
  objectKey: string;
  bucket: string;
  expiresAt: string;
}

export interface MediaFileDto {
  id: string;
  originalName: string;
  filePath: string;
  bucket: string;
  fileType: string;
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

export interface ViewUrlResponseDto {
  fileId: string;
  viewUrl: string;
  expiresAt: string;
  contentType: string;
  sizeBytes: number;
}
