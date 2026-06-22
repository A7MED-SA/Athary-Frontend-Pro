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
    const uploadData = await mediaService.getUploadUrl({
      fileName: file.name,
      contentType: file.type,
      fileSize: file.size,
    });

    await fetch(uploadData.data.fileUrl, {
      method: 'PUT',
      body: file,
      headers: { 'Content-Type': file.type },
    });

    const confirmed = await mediaService.confirmUpload({
      objectKey: uploadData.data.objectKey,
      fileName: file.name,
      contentType: file.type,
      fileSize: file.size,
    });

    return confirmed.data;
  },
};
