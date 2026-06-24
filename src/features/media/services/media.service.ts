import api from '@/lib/api';
import type { ApiResponse } from '@/types/api/envelope';
import type {
  MediaFileDto,
  UploadUrlRequestDto,
  MediaConfirmUploadRequest,
  MediaFileUrlResponse,
} from '@/types/api/media';

export const mediaService = {
  getUploadUrl: (data: UploadUrlRequestDto) =>
    api
      .post<ApiResponse<MediaFileDto>>('/media/upload-url', data)
      .then((r) => r.data),

  confirmUpload: (data: MediaConfirmUploadRequest) =>
    api
      .post<ApiResponse<MediaFileDto>>('/media/confirm-upload', data)
      .then((r) => r.data),

  getFileByObjectId: (id: string) =>
    api
      .get<ApiResponse<MediaFileDto>>(`/media/object-id/${id}`)
      .then((r) => r.data),

  deleteMedia: (id: string) =>
    api.delete<ApiResponse>(`/media/${id}`).then((r) => r.data),

  getFileUrl: (objectKey: string, fileName?: string) =>
    api
      .get<ApiResponse<MediaFileUrlResponse>>(`/media/file-url/${objectKey}`, {
        params: { fileName },
      })
      .then((r) => r.data),

  uploadFile: async (file: File): Promise<MediaFileDto> => {
    const contentType = file.type || 'application/octet-stream';

    // Step 1: Get pre-signed URL from backend
    console.log('[MediaUpload] Step 1: Requesting pre-signed URL...', {
      fileName: file.name,
      contentType,
      fileSizeBytes: file.size,
    });

    const uploadData = await mediaService.getUploadUrl({
      fileType: 0,
      fileName: file.name,
      contentType,
      fileSizeBytes: file.size,
      visibility: 0,
    });

    console.log('[MediaUpload] Step 1 done:', uploadData.data);

    // Step 2: Upload file directly to MinIO/S3
    console.log('[MediaUpload] Step 2: Uploading to MinIO...', uploadData.data.fileUrl);

    const uploadResponse = await fetch(uploadData.data.fileUrl, {
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
      fileId: uploadData.data.id,
      objectKey: uploadData.data.objectKey,
      bucket: uploadData.data.bucket,
    });

    const confirmed = await mediaService.confirmUpload({
      fileId: uploadData.data.id,
      objectKey: uploadData.data.objectKey,
      bucket: uploadData.data.bucket || '',
    });

    console.log('[MediaUpload] Step 3 done:', confirmed.data);

    return confirmed.data;
  },
};
