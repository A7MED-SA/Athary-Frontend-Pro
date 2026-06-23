import { useNavigate } from 'react-router-dom';
import { useCart } from '../../features/common/hooks/useCart';
import { ShoppingBag, X, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const navigate = useNavigate();
  const { cart, removeItem, isRemovePending } = useCart();
  const items = cart?.items || [];

  if (!isOpen) return null;

  const handleRemove = (courseId: string, title: string) => {
    removeItem(courseId, {
      onSuccess: () => toast.success(`تمت إزالة "${title}"`),
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" id="shopping-cart-drawer">
      <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="absolute inset-y-0 left-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between text-right">
          <div className="px-6 py-5 bg-amber-50 border-b border-amber-100 flex items-center justify-between">
            <div className="flex items-center gap-2 text-stone-900">
              <ShoppingBag className="w-5 h-5 text-orange-700" />
              <span className="font-black text-sm">سلة التسوق ({items.length})</span>
            </div>
            <button onClick={onClose} className="p-1.5 hover:bg-amber-100 rounded-lg text-stone-500 transition">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 px-6 py-6 overflow-y-auto space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto text-amber-600">
                  <ShoppingBag className="w-7 h-7 stroke-[1.5]" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-stone-900 text-sm">السلة فارغة</h4>
                  <p className="text-xs text-stone-500">تصفح الدورات وأضف ما يناسبك</p>
                </div>
                <button onClick={() => { onClose(); navigate('/catalog'); }}
                  className="bg-orange-700 hover:bg-orange-800 text-amber-50 font-bold px-5 py-2.5 rounded-xl text-xs transition">تصفح الدورات</button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.courseId} className="flex gap-3 p-3 bg-stone-50 rounded-xl">
                  <img src={item.courseImageUrl || 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=100'} alt={item.courseTitle}
                    className="w-16 h-12 rounded-lg object-cover" referrerPolicy="no-referrer" />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-xs line-clamp-1">{item.courseTitle}</p>
                    <p className="text-[10px] text-stone-500">{item.instructorName}</p>
                    <p className="text-xs font-bold text-orange-700 mt-1">{item.price === 0 ? 'مجاناً' : `${item.price} ر.س`}</p>
                  </div>
                  <button onClick={() => handleRemove(item.courseId, item.courseTitle)} disabled={isRemovePending}
                    className="text-stone-400 hover:text-red-500 transition self-start p-1">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>

          {items.length > 0 && (
            <div className="px-6 py-4 border-t border-amber-100 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-stone-500">الإجمالي</span>
                <span className="font-black text-orange-700">{cart?.finalAmount || cart?.subtotal || 0} ر.س</span>
              </div>
              <button onClick={() => { onClose(); navigate('/checkout'); }}
                className="w-full bg-orange-700 hover:bg-orange-800 text-amber-50 font-bold py-3 rounded-xl transition shadow-md text-xs">
                الذهاب للدفع
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
