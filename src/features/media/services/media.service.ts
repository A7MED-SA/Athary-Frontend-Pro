import api from '@/lib/api';
import type { ApiResponse } from '@/types/api/envelope';
import type {
  MediaFileDto,
  UploadUrlRequestDto,
  UploadUrlResponseDto,
  MediaConfirmUploadRequest,
  ViewUrlResponseDto,
} from '@/types/api/media';

export const mediaService = {
  getUploadUrl: (data: UploadUrlRequestDto) =>
    api
      .post<ApiResponse<UploadUrlResponseDto>>('/media/upload-url', data)
      .then((r) => r.data),

  confirmUpload: (data: MediaConfirmUploadRequest) =>
    api
      .post<ApiResponse<MediaFileDto>>('/media/confirm-upload', data)
      .then((r) => r.data),

  getViewUrl: (fileId: string) =>
    api
      .get<ApiResponse<ViewUrlResponseDto>>(`/media/${fileId}/view-url`)
      .then((r) => r.data),

  deleteMedia: (id: string) =>
    api.delete<ApiResponse>(`/media/${id}`).then((r) => r.data),

  uploadFile: async (file: File, fileType: number = 0): Promise<MediaFileDto> => {
    const contentType = file.type || 'application/octet-stream';

    console.log('[MediaUpload] Step 1: Requesting pre-signed URL...', {
      fileName: file.name,
      contentType,
      fileSizeBytes: file.size,
      fileType,
    });

    const uploadData = await mediaService.getUploadUrl({
      fileType,
      fileName: file.name,
      contentType,
      fileSizeBytes: file.size,
      visibility: 0,
    });

    console.log('[MediaUpload] Step 1 done:', uploadData.data);

    // Step 2: Upload file directly to MinIO/S3
    console.log('[MediaUpload] Step 2: Uploading to MinIO...', uploadData.data.uploadUrl);

    const uploadResponse = await fetch(uploadData.data.uploadUrl, {
      method: 'PUT',
      body: file,
      headers: { 'Content-Type': contentType },
    });

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      console.error('[MediaUpload] Step 2 FAILED:', uploadResponse.status, errorText);
      throw new Error(`MinIO upload failed: ${uploadResponse.status} ${errorText}`);
    }

    console.log('[MediaUpload] Step 2 done: File uploaded to MinIO');

    // Step 3: Confirm upload with backend
    console.log('[MediaUpload] Step 3: Confirming upload...', {
      fileId: uploadData.data.fileId,
      objectKey: uploadData.data.objectKey,
      bucket: uploadData.data.bucket,
    });

    const confirmed = await mediaService.confirmUpload({
      fileId: uploadData.data.fileId,
      objectKey: uploadData.data.objectKey,
      bucket: uploadData.data.bucket,
    });

    console.log('[MediaUpload] Step 3 done:', confirmed.data);

    return confirmed.data;
  },
};
