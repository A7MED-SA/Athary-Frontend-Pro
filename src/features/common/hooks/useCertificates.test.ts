import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { useCertificates, useCertificateVerification, useCertificatePDF } from './useCertificates';
import { certificateService } from '@/features/certificates/services/certificate.service';

vi.mock('@/features/certificates/services/certificate.service', () => ({
  certificateService: {
    getMyCertificates: vi.fn(),
    verify: vi.fn(),
    getCertificatePDF: vi.fn(),
  },
}));

const mockedCertificateService = vi.mocked(certificateService);

function createWrapper() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
}

describe('useCertificates', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return initial loading state', () => {
    mockedCertificateService.getMyCertificates.mockReturnValue(new Promise(() => {}));
    const { result } = renderHook(() => useCertificates(), { wrapper: createWrapper() });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.certificates).toBeUndefined();
  });

  it('should fetch certificates successfully', async () => {
    const mockCerts = [{ id: '1', code: 'CERT-001', courseName: 'React' }];
    mockedCertificateService.getMyCertificates.mockResolvedValue({ success: true, data: mockCerts } as any);

    const { result } = renderHook(() => useCertificates(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.certificates).toEqual(mockCerts);
  });
});

describe('useCertificateVerification', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should verify certificate when code is provided', async () => {
    const mockVerification = { valid: true, holderName: 'John Doe', courseName: 'React' };
    mockedCertificateService.verify.mockResolvedValue({ success: true, data: mockVerification } as any);

    const { result } = renderHook(() => useCertificateVerification('CERT-001'), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.verification).toEqual(mockVerification);
  });

  it('should not verify when code is empty', () => {
    const { result } = renderHook(() => useCertificateVerification(''), { wrapper: createWrapper() });

    expect(mockedCertificateService.verify).not.toHaveBeenCalled();
  });
});

describe('useCertificatePDF', () => {
  const mockClick = vi.fn();
  const mockCreateObjectURL = vi.fn(() => 'blob:mock-url');
  const mockRevokeObjectURL = vi.fn();
  let appendChildSpy: ReturnType<typeof vi.spyOn>;
  let removeChildSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockClick.mockClear();
    mockCreateObjectURL.mockClear();
    mockRevokeObjectURL.mockClear();
    Object.defineProperty(window.URL, 'createObjectURL', { value: mockCreateObjectURL, writable: true, configurable: true });
    Object.defineProperty(window.URL, 'revokeObjectURL', { value: mockRevokeObjectURL, writable: true, configurable: true });
    const originalCreateElement = document.createElement.bind(document);
    vi.spyOn(document, 'createElement').mockImplementation((tag: string) => {
      if (tag === 'a') {
        return { click: mockClick, href: '', download: '' } as any;
      }
      return originalCreateElement(tag);
    });
    appendChildSpy = vi.spyOn(document.body, 'appendChild').mockImplementation(() => {});
    removeChildSpy = vi.spyOn(document.body, 'removeChild').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should download PDF', async () => {
    mockedCertificateService.getCertificatePDF.mockResolvedValue(new Blob());

    const { downloadPDF } = useCertificatePDF();

    await downloadPDF('cert-1');

    expect(mockedCertificateService.getCertificatePDF).toHaveBeenCalledWith('cert-1', undefined);
    expect(mockClick).toHaveBeenCalled();
  });

  it('should download PDF with format', async () => {
    mockedCertificateService.getCertificatePDF.mockResolvedValue(new Blob());

    const { downloadPDF } = useCertificatePDF();

    await downloadPDF('cert-1', 'A4');

    expect(mockedCertificateService.getCertificatePDF).toHaveBeenCalledWith('cert-1', 'A4');
    expect(mockClick).toHaveBeenCalled();
  });
});
