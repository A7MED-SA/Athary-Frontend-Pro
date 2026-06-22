import { describe, it, expect, vi, beforeEach } from 'vitest';
import { orderService } from './order.service';
import api from '@/lib/api';

vi.mock('@/lib/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

const mockedApi = vi.mocked(api);

describe('orderService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('checkout', () => {
    it('should checkout with payment method', async () => {
      mockedApi.post.mockResolvedValue({
        data: { success: true, data: { id: '1', orderNumber: 'ORD-001', finalAmount: 100, items: [] } },
      });

      const result = await orderService.checkout({ paymentMethodId: 'pm-1' });

      expect(mockedApi.post).toHaveBeenCalledWith('/orders/checkout', { paymentMethodId: 'pm-1' });
      expect(result.data.orderNumber).toBe('ORD-001');
    });
  });

  describe('getOrders', () => {
    it('should fetch orders', async () => {
      mockedApi.get.mockResolvedValue({
        data: { success: true, data: [{ id: '1', orderNumber: 'ORD-001' }] },
      });

      const result = await orderService.getOrders();

      expect(mockedApi.get).toHaveBeenCalledWith('/orders');
      expect(result.data).toHaveLength(1);
    });
  });
});
