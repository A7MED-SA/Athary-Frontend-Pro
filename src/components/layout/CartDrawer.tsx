import { useNavigate } from 'react-router-dom';
import { ShoppingBag, X, CreditCard } from 'lucide-react';
import { useAppContext } from '../../providers/AppProvider';

export default function CartDrawer() {
  const navigate = useNavigate();
  const { cartItems, handleRemoveFromCart, handleCheckout, cartOpen, setCartOpen } = useAppContext();

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" id="shopping-cart-drawer">
      <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm transition-opacity" onClick={() => setCartOpen(false)} />

      <div className="absolute inset-y-0 left-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between text-right">

          <div className="px-6 py-5 bg-amber-50 border-b border-amber-100 flex items-center justify-between">
            <div className="flex items-center gap-2 text-stone-900">
              <ShoppingBag className="w-5 h-5 text-orange-700" />
              <span className="font-black text-sm">حقيبة المقاعد والدراسات</span>
            </div>
            <button
              onClick={() => setCartOpen(false)}
              className="p-1.5 hover:bg-amber-100 rounded-lg text-stone-500 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 px-6 py-6 overflow-y-auto space-y-4">
            {cartItems.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto text-amber-600">
                  <ShoppingBag className="w-7 h-7 stroke-[1.5]" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-stone-900 text-sm">حقيبة الدارسة فارغة حالياً</h4>
                  <p className="text-xs text-stone-500 leading-relaxed max-w-xs mx-auto">
                    تصفح كتالوج ومسارات آثاري الفنية لحجز مقعدك بالبث والمجلس التفاعلي الحصري.
                  </p>
                </div>
                <button
                  onClick={() => { navigate('/catalog'); setCartOpen(false); }}
                  className="bg-orange-700 hover:bg-orange-800 text-amber-50 text-xs font-bold px-6 py-3 rounded-xl transition shadow"
                >
                  تصفح العلوم المتاحة
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-xs text-stone-500 font-semibold">{cartItems.length} دورات جاهزة للتسجيل المعتمد:</p>
                <div className="divide-y divide-amber-50 space-y-3">
                  {cartItems.map((item) => (
                    <div key={item.id} className="pt-3 first:pt-0 flex gap-4 items-center">
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="w-16 h-16 rounded-xl object-cover border border-amber-100"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex-1 text-right space-y-1 min-w-0">
                        <h4 className="font-bold text-xs text-stone-900 leading-snug line-clamp-2">{item.title}</h4>
                        <p className="text-[10px] text-stone-500">معد دبلوم: {item.instructorName}</p>
                        <span className="block text-xs font-black text-orange-800">
                          {item.price === 0 ? 'مجاني بالكامل' : `${item.price} ر.س`}
                        </span>
                      </div>
                      <button
                        onClick={() => handleRemoveFromCart(item.id)}
                        className="text-stone-400 hover:text-red-700 text-xs font-bold p-1 hover:bg-red-50 rounded"
                        title="حذف"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {cartItems.length > 0 && (
            <div className="p-6 border-t border-amber-100 bg-amber-50/50 space-y-4 text-right">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between items-center text-stone-600">
                  <span>إجمالي رسوم المقاعد:</span>
                  <span className="font-mono">{cartItems.reduce((acc, curr) => acc + curr.price, 0)} ر.س</span>
                </div>
                <div className="flex justify-between items-center text-stone-600">
                  <span>خصم كوبون التراث الأولي:</span>
                  <span className="text-teal-700 font-bold">مجاناً بفترة التأسيس</span>
                </div>
                <div className="h-px bg-amber-200/50 my-1" />
                <div className="flex justify-between items-center text-stone-950 font-black text-sm">
                  <span>الاستثمار الكلي المتبقي:</span>
                  <span className="font-mono text-orange-800">{cartItems.reduce((acc, curr) => acc + curr.price, 0)} ر.س</span>
                </div>
              </div>

              <button
                onClick={() => { setCartOpen(false); navigate('/checkout'); }}
                className="w-full bg-orange-700 hover:bg-orange-800 text-amber-50 font-black py-3.5 rounded-xl text-xs transition shadow-lg flex items-center justify-center gap-2 border-0 cursor-pointer"
              >
                <CreditCard className="w-4 h-4" />
                <span>الانتقال لصفحة إتمام الحجز والدفع</span>
              </button>

              <button
                onClick={handleCheckout}
                className="w-full bg-stone-900 hover:bg-stone-800 text-stone-100 font-bold py-2.5 rounded-xl text-[10px] transition flex items-center justify-center gap-1.5 border-0 cursor-pointer"
              >
                <span>تسجيل سريع بنقرة واحدة (مجاني بالتأسيس)</span>
              </button>
              <p className="text-[9px] text-stone-500 text-center">أو اضغط للدخول مباشرة بلوحة معلوماتك التمهيدية.</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
