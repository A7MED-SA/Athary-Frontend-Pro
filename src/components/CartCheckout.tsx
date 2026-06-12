import { useState, FormEvent } from 'react';
import { Course } from '../types';
import { 
  Trash2, 
  Lock, 
  Tag, 
  CheckCircle, 
  ArrowRight, 
  ShoppingBag, 
  ShieldCheck, 
  CreditCard,
  Percent,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CartCheckoutProps {
  cartItems: Course[];
  onRemoveFromCart: (id: string) => void;
  onCheckout: () => void;
  setActiveView: (view: 'landing' | 'catalog' | 'dashboard' | 'auth' | 'course-details' | 'cart-checkout') => void;
  onTriggerToast: (msg: string) => void;
}

export default function CartCheckout({
  cartItems,
  onRemoveFromCart,
  onCheckout,
  setActiveView,
  onTriggerToast
}: CartCheckoutProps) {
  const [coupon, setCoupon] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [appliedCode, setAppliedCode] = useState<string | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);

  const subtotal = cartItems.reduce((acc, curr) => acc + curr.price, 0);

  const handleApplyCoupon = (e: FormEvent) => {
    e.preventDefault();
    setCouponError(null);
    const code = coupon.trim().toUpperCase();

    if (!code) return;

    if (code === 'ATHARY_FOUNDER' || code === 'TURAATH') {
      const discountAmount = Math.round(subtotal * 0.25); // 25% discount
      setAppliedDiscount(discountAmount);
      setAppliedCode(code);
      onTriggerToast(`🎉 تم تطبيق كوبون التأسيس (${code}) بخصم ٢٥% بنجاح!`);
      setCoupon('');
    } else if (code === 'FREE100' || code === 'ATHARY_FREE') {
      const discountAmount = subtotal; // 100% free!
      setAppliedDiscount(discountAmount);
      setAppliedCode(code);
      onTriggerToast(`🎉 تم تطبيق الكوبون الترويجي الشامل بنجاح! الرسوم أصبحت مجانية بالكامل.`);
      setCoupon('');
    } else {
      setCouponError('عذراً، هذا الكوبون غير موجود أو منتهي الصلاحية بانتهاء الموسم التمهيدي.');
    }
  };

  const finalTotal = Math.max(0, subtotal - appliedDiscount);

  // Animation variants for transitions
  const itemVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.2 } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.2 } }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="bg-[var(--color-background)] min-h-[85vh] pb-24 pt-6 text-right text-[var(--color-foreground)] transition-colors duration-250"
      dir="rtl"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Breadcrumb header in visual harmony */}
        <div className="mb-6 flex items-center justify-between">
          <button 
            onClick={() => setActiveView('catalog')}
            className="text-stone-600 hover:text-orange-700 text-xs font-bold flex items-center gap-1 bg-transparent border-0 cursor-pointer"
          >
            <ArrowRight className="w-4 h-4 ml-1" />
            <span>العودة لمواصلة تصفح العلوم المتاحة</span>
          </button>

          <span className="text-[11px] font-medium text-stone-500 font-sans">تأمين المقاعد والحجز • آثاري</span>
        </div>

        {/* Title area */}
        <div className="mb-8 border-r-4 border-orange-700 pr-4">
          <h1 className="text-xl sm:text-2xl font-black text-stone-900">سلة التسجيل وإتمام حجز المقاعد</h1>
          <p className="text-xs text-stone-500 font-light mt-1">قم بمراجعة مساراتك التعليمية المختارة وتوثيق كوبونات الخصم لاستلام الإسناد الدراسي.</p>
        </div>

        {cartItems.length === 0 ? (
          /* Empty Cart State */
          <div className="bg-white rounded-3xl border border-amber-250/80 p-12 text-center max-w-xl mx-auto space-y-6 shadow-sm">
            <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto text-amber-600 border border-amber-100">
              <ShoppingBag className="w-9 h-9 stroke-[1.25] text-orange-700" />
            </div>
            
            <div className="space-y-2">
              <h3 className="font-extrabold text-stone-950 text-sm sm:text-base">سلة التسجيل فارغة حالياً</h3>
              <p className="text-xs text-stone-500 leading-relaxed max-w-sm mx-auto">
                لم تقم بحجز أي مقعد بالمسارات أو ورش العمل التفاعلية حتى الآن. تفضل بزيارة الكتالوج لإعمار كشوفات التحصيل الخاصة بك.
              </p>
            </div>

            <button
              onClick={() => setActiveView('catalog')}
              className="bg-orange-700 hover:bg-orange-850 text-amber-50 text-xs font-black py-3 px-8 rounded-xl transition shadow border-0 cursor-pointer"
            >
              استكشف كتالوج الدبلومات والمسارات
            </button>
          </div>
        ) : (
          /* Checkout 2-Column layout */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* RIGHT SIDE (8 columns): Cart Enrolled Items details list */}
            <div className="lg:col-span-8 bg-white rounded-3xl border border-amber-200/90 shadow-sm p-6 space-y-6">
              
              <div className="border-b border-amber-100 pb-4 flex justify-between items-center bg-transparent">
                <h3 className="font-bold text-stone-900 text-xs sm:text-sm">المقررات والمسارات التي اخترتها ({cartItems.length})</h3>
                <span className="text-[10px] text-stone-400">التحديث حقيقي وتلقائي</span>
              </div>

              <div className="divide-y divide-amber-100/50 space-y-4">
                <AnimatePresence mode="popLayout">
                  {cartItems.map((item) => (
                    <motion.div 
                      key={item.id}
                      variants={itemVariants}
                      initial="visible"
                      exit="exit"
                      layout
                      className="pt-4 first:pt-0 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
                      id={`cart-checkout-item-${item.id}`}
                    >
                      {/* Image and basic info combo */}
                      <div className="flex gap-4 items-center flex-1 min-w-0">
                        <img 
                          src={item.thumbnail} 
                          alt={item.title} 
                          className="w-20 h-20 rounded-2xl object-cover shrink-0 border border-amber-150"
                          referrerPolicy="no-referrer"
                        />
                        <div className="space-y-1 text-right">
                          <span className="text-[9px] bg-amber-100 text-amber-800 font-bold px-2.5 py-0.5 rounded-full">
                            {item.category}
                          </span>
                          
                          <h4 
                            onClick={() => { setActiveView('course-details'); }}
                            className="font-black text-xs sm:text-xs text-stone-900 leading-snug line-clamp-2 hover:text-orange-700 cursor-pointer transition"
                          >
                            {item.title}
                          </h4>
                          
                          <p className="text-[10px] text-stone-500">إشراف المدرب: {item.instructorName} • {item.duration}</p>
                        </div>
                      </div>

                      {/* Price and deletion action item */}
                      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t border-dashed border-stone-100 sm:border-0">
                        
                        <div className="text-right sm:text-left">
                          <span className="text-[9px] text-stone-400 block sm:hidden">تكلفة المقعد الدراسي</span>
                          <span className="text-sm font-black text-orange-850 font-mono">
                            {item.price === 0 ? 'مجاني بالكامل' : `${item.price} ر.س`}
                          </span>
                        </div>

                        <button
                          onClick={() => {
                            onRemoveFromCart(item.id);
                            onTriggerToast(`تم حذف المقرر: ${item.title}`);
                          }}
                          className="text-stone-400 hover:text-red-700 text-xs font-bold p-2 hover:bg-red-50 rounded-lg transition border border-transparent hover:border-red-100 bg-transparent cursor-pointer"
                          title="إلغاء حجز المقرر الدراسي"
                        >
                          <Trash2 className="w-4 h-4 text-stone-450" />
                        </button>

                      </div>

                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Secure statement and guarantees */}
              <div className="pt-6 border-t border-amber-100/70 grid grid-cols-1 md:grid-cols-2 gap-4 text-stone-600 text-xs">
                
                <div className="flex gap-2.5 p-3.5 bg-amber-50/20 rounded-2xl border border-amber-100">
                  <ShieldCheck className="w-6 h-6 text-orange-700 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <h5 className="font-bold text-[11px] text-stone-900">سندات وحماية المستهلك</h5>
                    <p className="text-[10px] text-stone-500 leading-normal">تأمين ثقة للطلاب بضمان كامل للاسترجاع خلال ١٤ يوماً من تفعيل الدراسات بمجلس آثاري.</p>
                  </div>
                </div>

                <div className="flex gap-2.5 p-3.5 bg-amber-50/20 rounded-2xl border border-amber-100">
                  <CheckCircle className="w-6 h-6 text-teal-700 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <h5 className="font-bold text-[11px] text-stone-900">إشراف وعراقة الأسانيد</h5>
                    <p className="text-[10px] text-stone-500 leading-normal">جميع الدبلومات تمنح شهادة موقعة بختم حقيقي ومعمدة من كبار باحثي التراث الحضاري العربي.</p>
                  </div>
                </div>

              </div>

            </div>

            {/* LEFT SIDE (4 columns): Bill invoice summary with applied promo codes */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Order total bill information */}
              <div className="bg-white rounded-3xl border border-amber-250 p-6 shadow-md space-y-6">
                
                <div className="border-b border-amber-105 pb-3.5">
                  <h3 className="font-extrabold text-stone-950 text-xs sm:text-xs">ملخص التقييد المالي ومجموع المقاعد</h3>
                </div>

                {/* Subtotal table details */}
                <div className="space-y-3.5 text-xs text-stone-605 text-stone-600">
                  
                  <div className="flex justify-between items-center">
                    <span>إجمالي الرسوم المادية للمقاعد:</span>
                    <span className="font-mono font-bold text-stone-900">{subtotal} ر.س</span>
                  </div>

                  {/* Coupon feedback rows */}
                  {appliedCode && (
                    <div className="flex justify-between items-center bg-teal-50/50 p-2.5 rounded-xl border border-teal-200 text-teal-850 animate-fade-in text-[10px]">
                      <span className="flex items-center gap-1.5 font-bold shrink-0">
                        <Tag className="w-3.5 h-3.5 text-teal-700" />
                        <span>كوبون مفعل: {appliedCode}</span>
                      </span>
                      <span className="font-mono font-bold font-sans">- {appliedDiscount} ر.س</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center text-stone-500">
                    <span>رسوم قيد ومعايرة الأسانيد:</span>
                    <span className="text-teal-700 font-bold font-sans">مجاني وحصري 🎁</span>
                  </div>

                  <div className="h-px bg-amber-100" />

                  <div className="flex justify-between items-center text-stone-950 font-black text-sm">
                    <span>الاستثمار المستحق النهائي:</span>
                    <span className="font-mono text-orange-850 text-base">{finalTotal} ر.س</span>
                  </div>

                </div>

                {/* Submit Coupon Form */}
                <form onSubmit={handleApplyCoupon} className="space-y-2">
                  <label className="text-[10px] font-bold text-stone-500 block">هل تملك بطاقة حسم أو كود خصم تراثي؟</label>
                  
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={coupon}
                      onChange={(e) => {
                        setCoupon(e.target.value);
                        setCouponError(null);
                      }}
                      placeholder="مثال: ATHARY_FOUNDER"
                      className="flex-1 bg-stone-50 text-stone-900 placeholder-stone-400 text-xs py-2.5 px-3 border border-amber-205 border-amber-200 rounded-xl text-center font-mono font-bold focus:outline-none focus:ring-1 focus:ring-orange-600 focus:bg-white"
                    />
                    <button
                      type="submit"
                      className="bg-stone-900 hover:bg-stone-800 text-amber-50 text-[11px] font-bold px-4 rounded-xl transition cursor-pointer border-0"
                    >
                      تطبيق
                    </button>
                  </div>

                  {couponError && (
                    <p className="text-[10px] text-red-700 leading-normal font-medium">{couponError}</p>
                  )}

                  <div className="bg-orange-50/30 p-2.5 rounded-xl border border-orange-100 text-[10px] text-orange-950 leading-relaxed space-y-1">
                    <div className="flex items-center gap-1 font-bold">
                      <Sparkles className="w-3 h-3 text-orange-700 shrink-0" />
                      <span>تلميحات الموسم التأسيسي للأصالة:</span>
                    </div>
                    <p className="font-light">
                      استخدم رمز <code className="font-mono font-bold bg-amber-100 px-1 rounded text-orange-900">ATHARY_FOUNDER</code> لحسم فوري بنسبة ٢٥%، أو رمز <code className="font-mono font-bold bg-amber-100 px-1 rounded text-orange-900">FREE100</code> لتعليق الرسوم لطلاب المجهود التراثي.
                    </p>
                  </div>
                </form>

                {/* Final Checkout Button with robust lock indicators */}
                <div className="space-y-2.5 pt-2">
                  <button
                    onClick={onCheckout}
                    className="w-full bg-orange-700 hover:bg-orange-850 text-amber-50 font-black py-4 rounded-xl text-xs sm:text-xs transition shadow-lg flex items-center justify-center gap-2 cursor-pointer border-0"
                  >
                    <Lock className="w-4 h-4 shrink-0 text-amber-300" />
                    <span>تأكيد القيد النهائي وتفعيل مجلس الدراسة فوراَ</span>
                  </button>
                  
                  <p className="text-[9px] text-stone-500 text-center">بمجرد الضغط، ستنضم الدبلومات تلقائياً إلى صفحة لوحة معلومات الطالب النشطة.</p>
                </div>

              </div>

              {/* Secure Checkout stamps card */}
              <div className="bg-white border border-amber-200/60 rounded-3xl p-5 shadow-sm space-y-3.5 text-right">
                <span className="text-[10px] text-stone-400 font-extrabold block uppercase tracking-wider">بوابات وقنوات دفع آمنة موثقة بآثاري</span>
                
                <div className="flex flex-wrap items-center justify-start gap-4">
                  {/* Visual payment placeholders */}
                  <span className="text-[10px] font-bold text-stone-650 font-sans border border-stone-200 px-2 py-1 rounded bg-stone-50">مدى Mada</span>
                  <span className="text-[10px] font-bold text-stone-650 font-sans border border-stone-200 px-2 py-1 rounded bg-stone-50">تحويل بنكي Bank</span>
                  <span className="text-[10px] font-bold text-stone-650 font-sans border border-stone-200 px-2 py-1 rounded bg-stone-50">فيزا Visa</span>
                  <span className="text-[10px] font-bold text-stone-650 font-sans border border-stone-200 px-2 py-1 rounded bg-stone-50">أبل باي Apple</span>
                </div>

                <div className="h-px bg-stone-100 my-1" />

                <div className="text-[9px] text-stone-400 leading-normal">
                  إن اتصالاتكم محمية بخوادم SSL آمنة ومصدقة بشهادة أمنية عالية الدقة لامتثال التعاملات المالية.
                </div>
              </div>

            </div>

          </div>
        )}

      </div>
    </motion.div>
  );
}
