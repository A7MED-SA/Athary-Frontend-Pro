import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { useOrders, useOrderDetail } from './useOrders';
import { orderService } from '@/features/cart/services/order.service';

vi.mock('@/features/cart/services/order.service', () => ({
  orderService: {
    getOrders: vi.fn(),
    checkout: vi.fn(),
    getOrderDetail: vi.fn(),
  },
}));

const mockedOrderService = vi.mocked(orderService);

function createWrapper() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
}

describe('useOrders', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return initial loading state', () => {
    mockedOrderService.getOrders.mockReturnValue(new Promise(() => {}));
    const { result } = renderHook(() => useOrders(), { wrapper: createWrapper() });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.orders).toBeUndefined();
  });

  it('should fetch orders successfully', async () => {
    const mockOrders = [{ id: '1', total: 100, status: 'completed' }];
    mockedOrderService.getOrders.mockResolvedValue({ success: true, data: mockOrders } as any);

    const { result } = renderHook(() => useOrders(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.orders).toEqual(mockOrders);
  });

  it('should call checkout mutation and invalidate queries', async () => {
    mockedOrderService.getOrders.mockResolvedValue({ success: true, data: [] } as any);
    mockedOrderService.checkout.mockResolvedValue({ success: true, data: {} } as any);

    const { result } = renderHook(() => useOrders(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    result.current.checkout({ paymentMethodId: 'pm-1', couponCode: 'SAVE10' });

    await waitFor(() => expect(mockedOrderService.checkout).toHaveBeenCalledWith({ paymentMethodId: 'pm-1', couponCode: 'SAVE10' }));
  });

  it('should expose checkoutError', async () => {
    mockedOrderService.getOrders.mockResolvedValue({ success: true, data: [] } as any);
    mockedOrderService.checkout.mockRejectedValue(new Error('Payment failed'));

    const { result } = renderHook(() => useOrders(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.checkoutError).toBeNull();
  });
});

describe('useOrderDetail', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch order detail when id is provided', async () => {
    const mockOrder = { id: '1', total: 100, items: [] };
    mockedOrderService.getOrderDetail.mockResolvedValue({ success: true, data: mockOrder } as any);

    const { result } = renderHook(() => useOrderDetail('1'), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.order).toEqual(mockOrder);
  });

  it('should not fetch when id is empty', () => {
    const { result } = renderHook(() => useOrderDetail(''), { wrapper: createWrapper() });

    expect(mockedOrderService.getOrderDetail).not.toHaveBeenCalled();
  });
});
