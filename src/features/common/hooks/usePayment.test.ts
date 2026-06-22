import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { usePayment } from './usePayment';
import { paymentService } from '@/features/cart/services/payment.service';

vi.mock('@/features/cart/services/payment.service', () => ({
  paymentService: {
    getPaymentMethods: vi.fn(),
    createPaymentIntent: vi.fn(),
    confirmPayment: vi.fn(),
  },
}));

const mockedPaymentService = vi.mocked(paymentService);

function createWrapper() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
}

describe('usePayment', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return initial loading state', () => {
    mockedPaymentService.getPaymentMethods.mockReturnValue(new Promise(() => {}));
    const { result } = renderHook(() => usePayment(), { wrapper: createWrapper() });

    expect(result.current.isMethodsLoading).toBe(true);
    expect(result.current.methods).toBeUndefined();
  });

  it('should fetch payment methods successfully', async () => {
    const mockMethods = [{ id: 'pm-1', type: 'card', brand: 'visa' }];
    mockedPaymentService.getPaymentMethods.mockResolvedValue({ success: true, data: mockMethods } as any);

    const { result } = renderHook(() => usePayment(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isMethodsLoading).toBe(false));
    expect(result.current.methods).toEqual(mockMethods);
  });

  it('should call createIntent mutation', async () => {
    mockedPaymentService.getPaymentMethods.mockResolvedValue({ success: true, data: [] } as any);
    mockedPaymentService.createPaymentIntent.mockResolvedValue({ success: true, data: { clientSecret: 'secret' } } as any);

    const { result } = renderHook(() => usePayment(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isMethodsLoading).toBe(false));

    result.current.createIntent({ orderId: 'order-1', paymentMethodId: 'pm-1' });

    await waitFor(() => expect(mockedPaymentService.createPaymentIntent).toHaveBeenCalledWith({ orderId: 'order-1', paymentMethodId: 'pm-1' }));
  });

  it('should call confirmPayment mutation and invalidate cache', async () => {
    mockedPaymentService.getPaymentMethods.mockResolvedValue({ success: true, data: [] } as any);
    mockedPaymentService.confirmPayment.mockResolvedValue({ success: true, data: undefined } as any);

    const { result } = renderHook(() => usePayment(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isMethodsLoading).toBe(false));

    result.current.confirmPayment('payment-1');

    await waitFor(() => expect(mockedPaymentService.confirmPayment).toHaveBeenCalledWith('payment-1'));
  });
});
