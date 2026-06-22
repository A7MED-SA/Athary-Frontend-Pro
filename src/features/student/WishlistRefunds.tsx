import React, { useState } from 'react';
import { COURSES } from '../../data';
import { Course, ViewType } from '../../types';
import { 
  Heart, 
  ShoppingCart, 
  RefreshCcw, 
  XCircle, 
  CheckCircle,
  AlertCircle,
  Calendar,
  DollarSign,
  Plus,
  Compass,
  FileText,
  Clock,
  ArrowLeftRight,
  ShieldAlert
} from 'lucide-react';

interface RefundRequest {
  id: string;
  courseTitle: string;
  requestDate: string;
  amount: number;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  notes?: string;
}

interface WishlistRefundsProps {
  onNavigateToCatalog: () => void;
  onTriggerToast: (msg: string) => void;
}

export default function WishlistRefunds({ onNavigateToCatalog, onTriggerToast }: WishlistRefundsProps) {
  const [activeTab, setActiveTab] = useState<'wishlist' | 'refunds'>('wishlist');
  
  // Simulated Wishlist state initialized with a few courses from global COURSES list
  const [wishlistItems, setWishlistItems] = useState<Course[]>([
    COURSES[2], // علم المخطوطات والتحقيق الأثري والترميم
    COURSES[4]  // الخط العربي والزخرفة الإسلامية الكلاسيكية
  ]);

  // Optimistic UI toggle for demonstration
  const [shouldFailNetwork, setShouldFailNetwork] = useState<boolean>(false);
  const [pendingRemovalId, setPendingRemovalId] = useState<string | null>(null);

  // Refund Requests list state
  const [refundRequests, setRefundRequests] = useState<RefundRequest[]>([
    {
      id: 'REF-7801',
      courseTitle: 'روائع البلاغة العربية ونظم النثر الأدبي',
      requestDate: '2026-06-08',
      amount: 450,
      reason: 'تعارض موعد البث المباشر التفاعلي مع دراستي العليا بالجامعة المسائية.',
      status: 'Approved',
      notes: 'تمت مصادقة التسوية المالية وإعادتها لحساب فيزا المنتهي بـ 4321.'
    },
    {
      id: 'REF-9204',
      courseTitle: 'العمارة الإسلامية والتصميم التراثي وتطوره عبر القرون',
      requestDate: '2026-06-11',
      amount: 380,
      reason: 'شراء تضاعفي بالخطأ ومطالبتي بدمج الحجز تحت حسابي الموازي الثاني.',
      status: 'Pending'
    }
  ]);

  // Refund Dialog Modal states
  const [showNewRefundModal, setShowNewRefundModal] = useState<boolean>(false);
  const [selectedCourseTitle, setSelectedCourseTitle] = useState<string>('');
  const [refundReason, setRefundReason] = useState<string>('');
  const [refundAmount, setRefundAmount] = useState<number>(350);

  // Optimistic UI for Heart Favorites: Removing from Wishlist
  const handleOptimisticRemove = (courseId: string, courseTitle: string) => {
    // 1. Capture current state for rollback backup
    const backupWishlist = [...wishlistItems];
    setPendingRemovalId(courseId);

    // 2. Perform Optimistic UI Update directly
    setWishlistItems(prev => prev.filter(item => item.id !== courseId));
    onTriggerToast(`⏳ جاري إرسال طلب تحديث المفضلة بقاعدة البيانات... (تحديث واجهة متفائل)`);

    // 3. Simulate backend latency
    setTimeout(() => {
      if (shouldFailNetwork) {
        // Rollback on simulated API failure
        setWishlistItems(backupWishlist);
        setPendingRemovalId(null);
        onTriggerToast(`❌ فشل الاتصال بالملقم (503 Gateway Timeout). تم التراجع عن تعديل المفضلة!`);
      } else {
        // Success confirm
        setPendingRemovalId(null);
        onTriggerToast(`❤️ تم تحديث وحذف الدورة من مفضلتك المصادق عليها بنجاح.`);
      }
    }, 1500);
  };

  // Add Course to Cart
  const handleAddToCartSimulated = (course: Course) => {
    onTriggerToast(`🛒 تم تضمين الدورة: "${course.title}" في سلتك بنجاح!`);
  };

  // Create Refund Request
  const handleCreateRefundRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourseTitle || !refundReason.trim()) {
      onTriggerToast('❌ يرجى ملء حقول طلب الاسترداد وتحديد اسم الدورة والسبب.');
      return;
    }

    const newRequest: RefundRequest = {
      id: `REF-${Math.floor(1000 + Math.random() * 9000)}`,
      courseTitle: selectedCourseTitle,
      requestDate: new Date().toISOString().split('T')[0]!,
      amount: refundAmount,
      reason: refundReason,
      status: 'Pending'
    };

    setRefundRequests([newRequest, ...refundRequests]);
    setSelectedCourseTitle('');
    setRefundReason('');
    setShowNewRefundModal(false);
    onTriggerToast('🔄 تم تسجيل وبث طلب الاسترداد المالي لوكيل شؤون الدارسين للمراجعة.');
  };

  return (
    <div className="bg-stone-50 rounded-3xl border border-amber-200/80 p-4 sm:p-6 text-right font-sans space-y-6" id="wishlist-refunds-management" dir="rtl">
      
      {/* Tab Controller Headings */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-100 pb-3">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab('wishlist')}
            className={`px-4 py-2.5 rounded-xl text-xs font-black transition border-0 cursor-pointer flex items-center gap-2 ${
              activeTab === 'wishlist' 
                ? 'bg-orange-700 text-amber-50 shadow-xs' 
                : 'bg-white hover:bg-stone-100 text-stone-600 border border-stone-200'
            }`}
          >
            <Heart className="w-4 h-4 fill-current text-amber-100" />
            <span>المفضلة والمحفوظات ❤️</span>
          </button>

          <button
            onClick={() => setActiveTab('refunds')}
            className={`px-4 py-2.5 rounded-xl text-xs font-black transition border-0 cursor-pointer flex items-center gap-2 ${
              activeTab === 'refunds' 
                ? 'bg-orange-700 text-amber-50 shadow-xs' 
                : 'bg-white hover:bg-stone-100 text-stone-600 border border-stone-200'
            }`}
          >
            <RefreshCcw className="w-4 h-4" />
            <span>طلبات الاسترداد المالي وتسوية الرسوم 🔄</span>
          </button>
        </div>

        {/* Optimistic UI Simulator Controls */}
        {activeTab === 'wishlist' && (
          <div className="flex items-center gap-2.5 bg-amber-50 p-2 border border-amber-200 rounded-xl text-[10px] w-fit">
            <ShieldAlert className="w-4 h-4 text-orange-700 shrink-0" />
            <div className="flex items-center gap-1.5 label text-stone-700 font-bold">
              <span>محاكاة خطأ شبكة (تراجع متفائل):</span>
              <input 
                type="checkbox" 
                checked={shouldFailNetwork}
                onChange={(e) => setShouldFailNetwork(e.target.checked)}
                className="w-4 h-4 text-orange-700 focus:ring-0 cursor-pointer accent-orange-700"
              />
            </div>
          </div>
        )}
      </div>

      {/* TAB 1: WISHLIST */}
      {activeTab === 'wishlist' && (
        <div className="space-y-4">
          <div>
            <h3 className="font-extrabold text-[#962D15] text-xs sm:text-sm font-serif">مجموعتك المفضلة من العلوم</h3>
            <p className="text-[11px] text-stone-500 mt-1">تجد هنا المناهج والمحاضرات التي تعتزم حجز مقعدك بها لاحقاً بمجالس آثاري الحرة.</p>
          </div>

          {wishlistItems.length === 0 ? (
            <div className="bg-white border rounded-2xl p-16 text-center space-y-4 border-dashed border-amber-200">
              <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto text-amber-600">
                <Heart className="w-7 h-7 stroke-[1.5]" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-stone-900 text-sm">لا توجد مقررات في مفضلتك حالياً</h4>
                <p className="text-xs text-stone-500 max-w-sm mx-auto leading-relaxed">
                  تصفح الفنون الأثرية وعلم المخطوطات والقرآن لملء بوابتك بأجود الدروس المصدقة.
                </p>
              </div>
              <button
                onClick={onNavigateToCatalog}
                className="bg-orange-700 hover:bg-orange-800 text-white font-black px-6 py-2.5 rounded-xl text-xs transition border-0 cursor-pointer text-center"
              >
                تصفح المقررات والعلوم المتاحة
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
              {wishlistItems.map((course) => {
                const isPending = pendingRemovalId === course.id;
                return (
                  <div 
                    key={course.id} 
                    className={`bg-white border border-stone-200/80 rounded-2xl p-4 flex gap-4 text-right justify-between items-center transition hover:border-amber-300 relative overflow-hidden ${
                      isPending ? 'opacity-50 pointer-events-none' : ''
                    }`}
                  >
                    <div className="flex gap-4 items-center">
                      <img 
                        src={course.thumbnail} 
                        alt={course.title} 
                        className="w-16 h-16 rounded-xl object-cover border border-amber-100 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="space-y-1 min-w-0">
                        <span className="text-[9px] bg-orange-100 text-orange-700 font-bold px-2 py-0.5 rounded">
                          {course.category}
                        </span>
                        <h4 className="font-bold text-xs text-stone-900 leading-snug line-clamp-2">{course.title}</h4>
                        <div className="flex items-center gap-1.5 text-[10px] text-stone-500">
                          <span>بإشراف: {course.instructorName}</span>
                          <span>•</span>
                          <span className="font-mono text-orange-800 font-black">{course.price === 0 ? 'مجاني' : `${course.price} ر.س`}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 shrink-0">
                      <button
                        onClick={() => handleAddToCartSimulated(course)}
                        className="bg-orange-700 hover:bg-orange-800 text-white text-[10px] font-black py-2 px-3 rounded-lg border-0 cursor-pointer shadow-3xs flex items-center justify-center gap-1.5 whitespace-nowrap"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        <span>أضف للسلة</span>
                      </button>

                      <button
                        onClick={() => handleOptimisticRemove(course.id, course.title)}
                        className="bg-red-50 hover:bg-red-100 text-red-700 text-[10px] font-extrabold py-1.5 px-3 rounded-lg border border-red-200/50 cursor-pointer flex items-center justify-center gap-1"
                        title="إزالة من المفضلة"
                      >
                        <Heart className="w-3.5 h-3.5 fill-current" />
                        <span>إزالة</span>
                      </button>
                    </div>

                    {isPending && (
                      <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-orange-700 border-t-transparent rounded-full animate-spin" />
                          <span className="text-[10px] text-orange-950 font-bold">جاري تحديث القاعدة...</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: REFUND REQUESTS */}
      {activeTab === 'refunds' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-extrabold text-[#962D15] text-xs sm:text-sm font-serif">أرشيف وعمليات التسوية المالية</h3>
              <p className="text-[11px] text-stone-500 mt-1">مطالب استعادة الرسوم بموجب ميثاق وسياسة الإلغاء الشفافة لمنصة آثاري.</p>
            </div>

            <button
              onClick={() => setShowNewRefundModal(true)}
              className="bg-orange-700 hover:bg-orange-800 text-amber-50 font-black text-xs px-4  py-2.5 rounded-xl border-0 cursor-pointer shadow-sm flex items-center justify-center gap-2 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>تقديم طلب استرداد جديد</span>
            </button>
          </div>

          {/* Refund requests list / Table */}
          <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-3xs">
            <div className="overflow-x-auto">
              <table className="w-full text-right border-collapse text-xs">
                <thead>
                  <tr className="bg-amber-50/50 border-b border-amber-100/80 text-stone-500 font-bold">
                    <th className="p-4 whitespace-nowrap">رقم الطلب 🆔</th>
                    <th className="p-4">اسم الدورة التدريبية</th>
                    <th className="p-4 whitespace-nowrap">تاريخ التقديم</th>
                    <th className="p-4 whitespace-nowrap">المبلغ المستثمر</th>
                    <th className="p-4">السبب الأساسي لطلب الإلغاء</th>
                    <th className="p-4 whitespace-nowrap">حالة المراجعة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {refundRequests.map((req) => (
                    <tr key={req.id} className="hover:bg-stone-50/40 text-stone-700">
                      <td className="p-4 font-mono font-bold text-stone-900 whitespace-nowrap">{req.id}</td>
                      <td className="p-4 font-extrabold text-stone-900 min-w-[200px]">{req.courseTitle}</td>
                      <td className="p-4 text-stone-500 whitespace-nowrap font-mono">{req.requestDate}</td>
                      <td className="p-4 font-mono font-bold text-orange-900 whitespace-nowrap">{req.amount} ر.س</td>
                      <td className="p-4 leading-relaxed font-light min-w-[250px]">{req.reason}</td>
                      <td className="p-4 whitespace-nowrap">
                        {req.status === 'Approved' && (
                          <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 h-7 inline-flex items-center gap-1.5 px-3 rounded-full text-[10px] font-black">
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-700" />
                            <span>مقبول • تمت التسوية</span>
                          </div>
                        )}
                        {req.status === 'Pending' && (
                          <div className="bg-amber-50 text-amber-800 border border-amber-200 h-7 inline-flex items-center gap-1.5 px-3 rounded-full text-[10px] font-black">
                            <Clock className="w-3.5 h-3.5 text-amber-700 animate-pulse" />
                            <span>قيد معالجة الشؤون</span>
                          </div>
                        )}
                        {req.status === 'Rejected' && (
                          <div className="bg-red-50 text-red-800 border border-red-200 h-7 inline-flex items-center gap-1.5 px-3 rounded-full text-[10px] font-black">
                            <XCircle className="w-3.5 h-3.5 text-red-700" />
                            <span>مرفوض من الهيئة</span>
                          </div>
                        )}

                        {req.notes && (
                          <span className="block text-[9px] text-stone-500 mt-1 italic leading-tight max-w-[200px] whitespace-normal">
                            * {req.notes}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 bg-stone-50/50 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
              <span>عرض {refundRequests.length} طلبات تسوية</span>
              <span className="font-light">يتم إعادة مبالغ الدفع لبطاقتك في غضون ٣-٧ أيام عمل بمصادقة المراجعة المالية.</span>
            </div>
          </div>
        </div>
      )}

      {/* NEW REFUND DIALOG MODAL */}
      {showNewRefundModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-xs" onClick={() => setShowNewRefundModal(false)} />
          
          <div className="bg-white rounded-3xl border border-amber-200 shadow-2xl relative max-w-lg w-full p-6 text-right z-10 animate-scale-up" dir="rtl">
            
            {/* Close */}
            <button 
              onClick={() => setShowNewRefundModal(false)}
              className="absolute top-4 left-4 p-1 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition border-0 cursor-pointer"
            >
              <XCircle className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-stone-100">
              <div className="w-10 h-10 rounded-xl bg-orange-700/10 flex items-center justify-center text-orange-700 shrink-0">
                <RefreshCcw className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-black text-sm sm:text-base text-stone-900">طلب استرداد وتسوية مالية مسبقة</h4>
                <p className="text-[10px] text-stone-400">منصة آثاري للتراث المعرفي العتيق</p>
              </div>
            </div>

            <form onSubmit={handleCreateRefundRequest} className="space-y-4">
              
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700 block">اختر الدورة أو المسار المطلوب تسويته</label>
                <select 
                  required
                  value={selectedCourseTitle}
                  onChange={(e) => {
                    setSelectedCourseTitle(e.target.value);
                    // Match a pseudo-price for refund
                    const title = e.target.value;
                    if (title.includes('البلاغة')) setRefundAmount(450);
                    else if (title.includes('العمارة')) setRefundAmount(380);
                    else setRefundAmount(350);
                  }}
                  className="w-full bg-stone-50 text-stone-900 text-xs py-3 px-3.5 rounded-xl border border-amber-200 focus:outline-none"
                >
                  <option value="">-- يرجى اختيار المقرر المعرفي المنشور --</option>
                  <option value="علم المخطوطات والتحقيق الأثري والترميم">علم المخطوطات والتحقيق الأثري والترميم (٣٥٠ ر.س)</option>
                  <option value="الخط العربي والزخرفة الإسلامية الكلاسيكية">الخط العربي والزخرفة الإسلامية الكلاسيكية (٣٥٠ ر.س)</option>
                  <option value="فلسفة العمارة الإسلامية والتصميم التراثي">فلسفة العمارة الإسلامية والتصميم السقفي (٣٨٠ ر.س)</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-right">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700 block">المبلغ التقريبي المرصود للاستعادة</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      disabled
                      value={refundAmount}
                      className="w-full bg-stone-100 text-stone-500 text-xs py-3 pl-12 pr-4 rounded-xl border border-stone-200/60 cursor-not-allowed font-mono font-bold"
                    />
                    <span className="absolute left-3 top-3.5 text-[10px] text-stone-400 font-sans">ريال سعودي</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700 block">مرسل الطلب الموثق</label>
                  <input 
                    type="text" 
                    disabled
                    value="أحمد التميمي"
                    className="w-full bg-stone-100 text-stone-500 text-xs py-3 px-4 rounded-xl border border-stone-200/60 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700 block">سبب طلب استرجاع الرسوم والمقعد</label>
                <textarea 
                  required
                  rows={4}
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  placeholder="يرجى كتابة سبب موضوعي ومفصل لمساعدة لجنة المتابعة المالية في اتخاذ القرار بالموافقة الفورية..."
                  className="w-full bg-stone-50 text-stone-900 text-xs py-3 px-4 rounded-xl border border-amber-200 focus:outline-none focus:ring-1 focus:ring-orange-700 leading-relaxed"
                />
              </div>

              <div className="p-3 bg-amber-50 rounded-xl space-y-1 text-right text-[10px] text-amber-900 border border-amber-200/50">
                <span className="font-extrabold block">📌 إرشاد نظام الاسترداد المالي:</span>
                <p className="font-light leading-relaxed">
                  يجب تقديم الطلب في السبعة أيام الأولى بحد أقصى من تاريخ حجز مقعدك بالبث وبشرط عدم اجتياز أكثر من فصلين دراسيين معتمدين من دورة الطلاب المتكافلة.
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewRefundModal(false)}
                  className="bg-stone-50 text-stone-600 hover:bg-stone-100 px-5 py-2.5 rounded-xl text-xs font-extrabold cursor-pointer border border-stone-200"
                >
                  إلغاء التقديم
                </button>

                <button
                  type="submit"
                  className="bg-orange-700 hover:bg-orange-800 text-white font-black px-6 py-2.5 rounded-xl text-xs transition border-0 cursor-pointer shadow-sm flex items-center justify-center gap-1.5"
                >
                  <ArrowLeftRight className="w-4 h-4" />
                  <span>تأكيد الإرسال للجنة المالية</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
