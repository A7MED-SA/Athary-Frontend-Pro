import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { useCart } from './useCart';
import { cartService } from '@/features/cart/services/cart.service';

vi.mock('@/features/cart/services/cart.service', () => ({
  cartService: {
    getCart: vi.fn(),
    addItem: vi.fn(),
    removeItem: vi.fn(),
    clearCart: vi.fn(),
    applyCoupon: vi.fn(),
  },
}));

const mockedCartService = vi.mocked(cartService);

function createWrapper() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
}

describe('useCart', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return initial loading state', () => {
    mockedCartService.getCart.mockReturnValue(new Promise(() => {}));
    const { result } = renderHook(() => useCart(), { wrapper: createWrapper() });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.cart).toBeUndefined();
    expect(result.current.itemCount).toBe(0);
  });

  it('should fetch cart successfully', async () => {
    const mockCart = { items: [{ courseId: '1', title: 'Course' }], totalPrice: 100 };
    mockedCartService.getCart.mockResolvedValue({ success: true, data: mockCart } as any);

    const { result } = renderHook(() => useCart(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.cart).toEqual(mockCart);
    expect(result.current.itemCount).toBe(1);
  });

  it('should call addItem mutation and invalidate cache', async () => {
    mockedCartService.getCart.mockResolvedValue({ success: true, data: { items: [] } } as any);
    mockedCartService.addItem.mockResolvedValue({ success: true, data: {} } as any);

    const { result } = renderHook(() => useCart(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    result.current.addItem('course-1');

    await waitFor(() => expect(mockedCartService.addItem).toHaveBeenCalledWith({ courseId: 'course-1' }));
  });

  it('should call removeItem mutation', async () => {
    mockedCartService.getCart.mockResolvedValue({ success: true, data: { items: [] } } as any);
    mockedCartService.removeItem.mockResolvedValue({ success: true, data: {} } as any);

    const { result } = renderHook(() => useCart(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    result.current.removeItem('course-1');

    await waitFor(() => expect(mockedCartService.removeItem).toHaveBeenCalledWith('course-1'));
  });

  it('should call applyCoupon mutation', async () => {
    mockedCartService.getCart.mockResolvedValue({ success: true, data: { items: [] } } as any);
    mockedCartService.applyCoupon.mockResolvedValue({ success: true, data: { discount: 10 } } as any);

    const { result } = renderHook(() => useCart(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    result.current.applyCoupon('DISCOUNT10');

    await waitFor(() => expect(mockedCartService.applyCoupon).toHaveBeenCalledWith({ code: 'DISCOUNT10' }));
  });
});
