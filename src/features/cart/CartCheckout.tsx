import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../common/hooks/useCart';
import { useOrders } from '../common/hooks/useOrders';
import { usePayment } from '../common/hooks/usePayment';
import type { PaymentIntentResponse } from '@/types/api/payment';
import { Skeleton } from '@/components/shared/Skeleton';
import { ErrorFallback } from '@/components/shared/ErrorFallback';
import { Trash2, Tag, CheckCircle, ShoppingBag, ShieldCheck, CreditCard, AlertTriangle, X } from 'lucide-react';
import { toast } from 'sonner';

export default function CartCheckout() {
  const navigate = useNavigate();
  const { cart, isLoading, error, removeItem, isRemovePending, applyCoupon, isCouponPending, couponError } = useCart();
  const { checkout, isCheckoutPending } = useOrders();
  const { createIntentAsync } = usePayment();
  const [coupon, setCoupon] = useState('');
  const [courseToRemove, setCourseToRemove] = useState<string | null>(null);

  const items = cart?.items || [];
  const subtotal = cart?.subtotal || 0;
  const discountAmount = cart?.discountAmount || 0;
  const finalAmount = cart?.finalAmount || subtotal;
  const appliedCoupon = cart?.couponCode;

  const handleApplyCoupon = () => {
    const code = coupon.trim();
    if (!code) return;
    applyCoupon(code, {
      onSuccess: () => {
        toast.success(`تم تطبيق الكوبون "${code}" بنجاح`);
        setCoupon('');
      },
      onError: () => {
        toast.error(couponError?.message || 'كوبون غير صالح');
      },
    });
  };

  const handleRemove = (courseId: string) => {
    removeItem(courseId, {
      onSuccess: () => toast.success('تمت إزالة الدورة من السلة'),
      onError: () => toast.error('فشل إزالة الدورة'),
    });
    setCourseToRemove(null);
  };

  const handleCheckout = async () => {
    if (items.length === 0) return;

    try {
      const orderResult = await new Promise<{ data: { id: string } }>((resolve, reject) => {
        checkout(
          { paymentMethodId: 'tap', couponCode: appliedCoupon || undefined },
          { onSuccess: resolve, onError: reject }
        );
      });

      const paymentResult = await new Promise<{ data: PaymentIntentResponse }>((resolve, reject) => {
        createIntentAsync(
          { orderId: orderResult.data.id, paymentMethodId: 'tap' },
          { onSuccess: resolve, onError: reject }
        );
      });

      if (paymentResult.data.clientSecret) {
        window.location.href = `https://tap.company/pay/${paymentResult.data.clientSecret}`;
      }
    } catch {
      toast.error('فشلت عملية الدفع');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--color-background)] py-10 px-4" dir="rtl">
        <div className="max-w-4xl mx-auto space-y-4">
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-32 rounded-2xl" />)}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[var(--color-background)] py-10 px-4" dir="rtl">
        <ErrorFallback title="فشل تحميل السلة" message={error.message} onRetry={() => window.location.reload()} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)] py-10 px-4 sm:px-6 lg:px-8 font-sans" dir="rtl">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-black mb-6">سلة التسوق</h1>

        {items.length === 0 ? (
          <div className="bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)] p-12 text-center">
            <ShoppingBag className="w-16 h-16 text-stone-300 mx-auto mb-4" />
            <h3 className="font-bold text-lg mb-2">السلة فارغة</h3>
            <p className="text-sm text-stone-500 mb-4">لم تضف أي دورة بعد</p>
            <button onClick={() => navigate('/catalog')} className="bg-orange-700 hover:bg-orange-800 text-amber-50 font-bold px-6 py-3 rounded-xl transition text-sm">تصفح الدورات</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div key={item.courseId} className="bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)] p-4 flex gap-4">
                  <img src={item.courseImageUrl || 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=200'} alt={item.courseTitle}
                    className="w-28 h-20 rounded-xl object-cover" referrerPolicy="no-referrer" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm line-clamp-1">{item.courseTitle}</h4>
                    <p className="text-xs text-stone-500 mt-1">{item.instructorName}</p>
                    <p className="text-sm font-bold text-orange-700 mt-2">{item.price === 0 ? 'مجاناً' : `${item.price} ر.س`}</p>
                  </div>
                  <button onClick={() => handleRemove(item.courseId)} disabled={isRemovePending}
                    className="text-stone-400 hover:text-red-600 transition p-1 self-start">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="space-y-6">
              <div className="bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)] p-6">
                <h3 className="font-bold mb-4">ملخص الطلب</h3>

                {/* Coupon */}
                <div className="flex gap-2 mb-4">
                  <input type="text" placeholder="كود الخصم" value={coupon} onChange={(e) => setCoupon(e.target.value)}
                    className="flex-1 bg-stone-50 text-stone-900 text-xs py-2.5 px-3 rounded-lg border border-amber-200 focus:outline-none focus:ring-2 focus:ring-orange-600" />
                  <button onClick={handleApplyCoupon} disabled={isCouponPending || !coupon.trim()}
                    className="bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs px-4 py-2.5 rounded-lg transition disabled:opacity-50">
                    <Tag className="w-4 h-4 inline ml-1" />
                    تطبيق
                  </button>
                </div>

                <div className="space-y-3 border-t border-[var(--color-border)] pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-stone-500">المجموع الفرعي ({items.length} دورة)</span>
                    <span className="font-bold">{subtotal} ر.س</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-sm text-teal-600">
                      <span>خصم ({appliedCoupon})</span>
                      <span className="font-bold">-{discountAmount} ر.س</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-black border-t border-[var(--color-border)] pt-3">
                    <span>الإجمالي</span>
                    <span className="text-orange-700">{finalAmount} ر.س</span>
                  </div>
                </div>

                <button onClick={handleCheckout} disabled={isCheckoutPending || items.length === 0}
                  className="w-full bg-orange-700 hover:bg-orange-800 text-amber-50 font-bold py-3.5 rounded-xl transition shadow-md mt-4 flex items-center justify-center gap-2 disabled:opacity-50">
                  <CreditCard className="w-5 h-5" />
                  {isCheckoutPending ? 'جارٍ المعالجة...' : 'إتمام الشراء'}
                </button>

                <div className="flex items-center justify-center gap-2 mt-3 text-[10px] text-stone-400">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>دفع آمن عبر Tap Payment</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Remove Confirmation Dialog */}
      {courseToRemove && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-sm mx-4 shadow-xl">
            <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto mb-3" />
            <h3 className="font-bold text-center mb-2">إزالة من السلة؟</h3>
            <p className="text-xs text-stone-500 text-center mb-4">هل أنت متأكد من إزالة هذه الدورة من سلة التسوق؟</p>
            <div className="flex gap-3">
              <button onClick={() => setCourseToRemove(null)} className="flex-1 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold py-2.5 rounded-xl text-xs transition">إلغاء</button>
              <button onClick={() => handleRemove(courseToRemove)} className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded-xl text-xs transition">إزالة</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
