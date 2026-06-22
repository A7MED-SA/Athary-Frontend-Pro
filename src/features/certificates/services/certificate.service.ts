import api from '@/lib/api';
import type { ApiResponse } from '@/types/api/envelope';
import type {
  CertificateResponse,
  CertificateVerificationResponse,
} from '@/types/api/certificate';

export const certificateService = {
  getMyCertificates: () =>
    api
      .get<ApiResponse<CertificateResponse[]>>('/certificates/my-certificates')
      .then((r) => r.data),

  verify: (code: string) =>
    api
      .get<ApiResponse<CertificateVerificationResponse>>(`/certificates/verify/${code}`)
      .then((r) => r.data),

  getCertificateDetails: (id: string) =>
    api
      .get<ApiResponse<CertificateResponse>>(`/certificates/${id}`)
      .then((r) => r.data),

  getCertificatePDF: (id: string, format?: string) =>
    api
      .get(`/certificates/${id}/pdf`, {
        params: { format },
        responseType: 'blob',
      })
      .then((r) => r.data),
};
