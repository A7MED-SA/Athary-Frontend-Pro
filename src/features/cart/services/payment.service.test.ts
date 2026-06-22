import { describe, it, expect, vi, beforeEach } from 'vitest';
import { paymentService } from './payment.service';
import api from '@/lib/api';

vi.mock('@/lib/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

const mockedApi = vi.mocked(api);

describe('paymentService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getPaymentMethods', () => {
    it('should fetch payment methods', async () => {
      mockedApi.get.mockResolvedValue({
        data: { success: true, data: [{ id: '1', name: 'Credit Card', type: 'card', isEnabled: true }] },
      });

      const result = await paymentService.getPaymentMethods();

      expect(mockedApi.get).toHaveBeenCalledWith('/payments/methods');
      expect(result.data).toHaveLength(1);
    });
  });

  describe('createPaymentIntent', () => {
    it('should create payment intent', async () => {
      mockedApi.post.mockResolvedValue({
        data: { success: true, data: { clientSecret: 'secret', paymentIntentId: 'pi-1', amount: 100, currency: 'USD' } },
      });

      const result = await paymentService.createPaymentIntent({ orderId: 'o1', paymentMethodId: 'pm1' });

      expect(mockedApi.post).toHaveBeenCalledWith('/payments/create-intent', { orderId: 'o1', paymentMethodId: 'pm1' });
      expect(result.data.clientSecret).toBe('secret');
    });
  });
});
