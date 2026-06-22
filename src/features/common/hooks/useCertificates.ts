import { useQuery, useQueryClient } from '@tanstack/react-query';
import { certificateService } from '@/features/certificates/services/certificate.service';
import { queryKeys } from '@/lib/query-keys';

export function useCertificates() {
  const query = useQuery({
    queryKey: queryKeys.certificates.myCertificates(),
    queryFn: () => certificateService.getMyCertificates(),
  });

  return {
    certificates: query.data?.data,
    isLoading: query.isLoading,
    error: query.error,
  };
}

export function useCertificateVerification(code: string) {
  const query = useQuery({
    queryKey: queryKeys.certificates.verify(code),
    queryFn: () => certificateService.verify(code),
    enabled: !!code,
  });

  return {
    verification: query.data?.data,
    isLoading: query.isLoading,
    error: query.error,
  };
}

export function useCertificatePDF() {
  const downloadPDF = async (id: string, format?: string) => {
    const blob = await certificateService.getCertificatePDF(id, format);
    const url = window.URL.createObjectURL(blob as unknown as Blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `certificate-${id}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return { downloadPDF };
}
