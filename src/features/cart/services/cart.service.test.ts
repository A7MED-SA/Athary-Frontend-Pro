import { describe, it, expect, vi, beforeEach } from 'vitest';
import { cartService } from './cart.service';
import api from '@/lib/api';

vi.mock('@/lib/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  },
}));

const mockedApi = vi.mocked(api);

describe('cartService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getCart', () => {
    it('should fetch the cart', async () => {
      mockedApi.get.mockResolvedValue({
        data: {
          success: true,
          data: { id: '1', items: [], subtotal: 0, discountAmount: 0, finalAmount: 0 },
        },
      });

      const result = await cartService.getCart();

      expect(mockedApi.get).toHaveBeenCalledWith('/cart');
      expect(result.data.items).toHaveLength(0);
    });
  });

  describe('addItem', () => {
    it('should add item to cart', async () => {
      mockedApi.post.mockResolvedValue({
        data: {
          success: true,
          data: { id: '1', items: [{ courseId: 'c1' }], subtotal: 100, discountAmount: 0, finalAmount: 100 },
        },
      });

      const result = await cartService.addItem({ courseId: 'c1' });

      expect(mockedApi.post).toHaveBeenCalledWith('/cart/items', { courseId: 'c1' });
      expect(result.data.items).toHaveLength(1);
    });
  });

  describe('removeItem', () => {
    it('should remove item from cart', async () => {
      mockedApi.delete.mockResolvedValue({
        data: { success: true, data: { id: '1', items: [], subtotal: 0, discountAmount: 0, finalAmount: 0 } },
      });

      const result = await cartService.removeItem('c1');

      expect(mockedApi.delete).toHaveBeenCalledWith('/cart/items/c1');
      expect(result.data.items).toHaveLength(0);
    });
  });

  describe('applyCoupon', () => {
    it('should apply coupon to cart', async () => {
      mockedApi.post.mockResolvedValue({
        data: {
          success: true,
          data: { couponCode: 'SAVE10', discountAmount: 10, finalAmount: 90 },
        },
      });

      const result = await cartService.applyCoupon({ code: 'SAVE10' });

      expect(mockedApi.post).toHaveBeenCalledWith('/cart/coupon', { code: 'SAVE10' });
      expect(result.data.discountAmount).toBe(10);
    });
  });
});
