import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWishlist } from '../wishlist/hooks/useWishlist';
import { useRefunds } from './hooks/useRefunds';
import { DashboardSkeleton } from '../../components/shared/Skeleton';
import {
  Heart,
  ShoppingCart,
  RefreshCcw,
  XCircle,
  CheckCircle,
  Clock,
  Plus,
} from 'lucide-react';

export default function WishlistRefunds() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'wishlist' | 'refunds'>('wishlist');

  const { items: wishlistItems, isLoading: wishlistLoading, removeFromWishlist, isRemovePending } = useWishlist();
  const { refunds, isLoading: refundsLoading, requestRefund, isRequestPending } = useRefunds();

  const [showNewRefundModal, setShowNewRefundModal] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [selectedCourseTitle, setSelectedCourseTitle] = useState('');
  const [refundReason, setRefundReason] = useState('');

  const handleRemoveFromWishlist = (courseId: string) => {
    removeFromWishlist(courseId);
  };

  const handleCreateRefundRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourseId || !refundReason.trim()) return;

    requestRefund(
      { orderId: '', courseId: selectedCourseId, reason: refundReason },
      {
        onSuccess: () => {
          setSelectedCourseId('');
          setSelectedCourseTitle('');
          setRefundReason('');
          setShowNewRefundModal(false);
        },
      }
    );
  };

  const formatTime = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('ar-EG');
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="bg-stone-50 rounded-3xl border border-amber-200/80 p-4 sm:p-6 text-right font-sans space-y-6" dir="rtl">

      {/* Tab Controller */}
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
            <span>المفضلة</span>
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
            <span>طلبات الاسترداد</span>
          </button>
        </div>
      </div>

      {/* Wishlist Tab */}
      {activeTab === 'wishlist' && (
        <div className="space-y-4">
          <div>
            <h3 className="font-extrabold text-[#962D15] text-xs sm:text-sm font-serif">المقررات المفضلة</h3>
            <p className="text-[11px] text-stone-500 mt-1">المناجي التي تعتزم حجز مقعدك بها لاحقاً.</p>
          </div>

          {wishlistLoading ? (
            <div className="text-center py-10"><DashboardSkeleton /></div>
          ) : wishlistItems.length === 0 ? (
            <div className="bg-white border rounded-2xl p-16 text-center space-y-4 border-dashed border-amber-200">
              <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto text-amber-600">
                <Heart className="w-7 h-7 stroke-[1.5]" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-stone-900 text-sm">لا توجد مقررات في مفضلتك</h4>
                <p className="text-xs text-stone-500 max-w-sm mx-auto leading-relaxed">
                  تصفح المناهج وأضف ما يعجبك إلى المفضلة.
                </p>
              </div>
              <button
                onClick={() => navigate('/courses')}
                className="bg-orange-700 hover:bg-orange-800 text-white font-black px-6 py-2.5 rounded-xl text-xs transition border-0 cursor-pointer text-center"
              >
                تصفح المقررات
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {wishlistItems.map((item) => (
                <div
                  key={item.courseId}
                  className="bg-white border border-stone-200/80 rounded-2xl p-4 flex gap-4 text-right justify-between items-center transition hover:border-amber-300 relative overflow-hidden"
                >
                  <div className="flex gap-4 items-center">
                    {item.courseImageUrl && (
                      <img
                        src={item.courseImageUrl}
                        alt={item.courseTitle}
                        className="w-16 h-16 rounded-xl object-cover border border-amber-100 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                    )}
                    <div className="space-y-1 min-w-0">
                      <h4 className="font-bold text-xs text-stone-900 leading-snug line-clamp-2">{item.courseTitle}</h4>
                      <div className="flex items-center gap-1.5 text-[10px] text-stone-500">
                        <span>{item.instructorName}</span>
                        <span>•</span>
                        <span className="font-mono text-orange-800 font-black">{item.price === 0 ? 'مجاني' : `${item.price} ر.س`}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 shrink-0">
                    <button
                      onClick={() => navigate(`/course/${item.courseId}`)}
                      className="bg-orange-700 hover:bg-orange-800 text-white text-[10px] font-black py-2 px-3 rounded-lg border-0 cursor-pointer shadow-3xs flex items-center justify-center gap-1.5 whitespace-nowrap"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      <span>عرض</span>
                    </button>

                    <button
                      onClick={() => handleRemoveFromWishlist(item.courseId)}
                      disabled={isRemovePending}
                      className="bg-red-50 hover:bg-red-100 text-red-700 text-[10px] font-extrabold py-1.5 px-3 rounded-lg border border-red-200/50 cursor-pointer flex items-center justify-center gap-1 disabled:opacity-50"
                    >
                      <Heart className="w-3.5 h-3.5 fill-current" />
                      <span>إزالة</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Refunds Tab */}
      {activeTab === 'refunds' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-extrabold text-[#962D15] text-xs sm:text-sm font-serif">طلبات الاسترداد</h3>
              <p className="text-[11px] text-stone-500 mt-1">متابعة طلبات استعادة الرسوم.</p>
            </div>
          </div>

          {refundsLoading ? (
            <div className="text-center py-10"><DashboardSkeleton /></div>
          ) : (
            <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-3xs">
              <div className="overflow-x-auto">
                <table className="w-full text-right border-collapse text-xs">
                  <thead>
                    <tr className="bg-amber-50/50 border-b border-amber-100/80 text-stone-500 font-bold">
                      <th className="p-4">رقم الطلب</th>
                      <th className="p-4">الدورة</th>
                      <th className="p-4">المبلغ</th>
                      <th className="p-4">السبب</th>
                      <th className="p-4">الحالة</th>
                      <th className="p-4">التاريخ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {refunds.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-stone-400">لا توجد طلبات استرداد</td>
                      </tr>
                    ) : (
                      refunds.map((req) => (
                        <tr key={req.id} className="hover:bg-stone-50/40 text-stone-700">
                          <td className="p-4 font-mono font-bold text-stone-900 whitespace-nowrap">{req.orderNumber}</td>
                          <td className="p-4 font-extrabold text-stone-900 min-w-[200px]">{req.courseName}</td>
                          <td className="p-4 font-mono font-bold text-orange-900 whitespace-nowrap">{req.amount} ر.س</td>
                          <td className="p-4 leading-relaxed font-light min-w-[250px]">{req.reason}</td>
                          <td className="p-4 whitespace-nowrap">
                            {req.status === 'Approved' && (
                              <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 h-7 inline-flex items-center gap-1.5 px-3 rounded-full text-[10px] font-black">
                                <CheckCircle className="w-3.5 h-3.5" />
                                <span>مقبول</span>
                              </div>
                            )}
                            {(req.status === 'Pending' || req.status === 'Completed') && (
                              <div className="bg-amber-50 text-amber-800 border border-amber-200 h-7 inline-flex items-center gap-1.5 px-3 rounded-full text-[10px] font-black">
                                <Clock className="w-3.5 h-3.5 animate-pulse" />
                                <span>{req.status === 'Completed' ? 'مكتمل' : 'قيد المراجعة'}</span>
                              </div>
                            )}
                            {req.status === 'Rejected' && (
                              <div className="bg-red-50 text-red-800 border border-red-200 h-7 inline-flex items-center gap-1.5 px-3 rounded-full text-[10px] font-black">
                                <XCircle className="w-3.5 h-3.5" />
                                <span>مرفوض</span>
                              </div>
                            )}
                          </td>
                          <td className="p-4 text-stone-500 whitespace-nowrap font-mono">{formatTime(req.createdAt)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* New Refund Modal */}
      {showNewRefundModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-xs" onClick={() => setShowNewRefundModal(false)} />
          <div className="bg-white rounded-3xl border border-amber-200 shadow-2xl relative max-w-lg w-full p-6 text-right z-10" dir="rtl">
            <button
              onClick={() => setShowNewRefundModal(false)}
              className="absolute top-4 left-4 p-1 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition border-0 cursor-pointer"
            >
              <XCircle className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-stone-100">
              <RefreshCcw className="w-5 h-5 text-orange-700" />
              <h4 className="font-black text-sm text-stone-900">طلب استرداد جديد</h4>
            </div>

            <form onSubmit={handleCreateRefundRequest} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700 block">رقم الدورة</label>
                <input
                  type="text"
                  required
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                  placeholder="أدخل رقم الدورة"
                  className="w-full bg-stone-50 text-stone-900 text-xs py-3 px-3.5 rounded-xl border border-amber-200 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700 block">سبب طلب الاسترداد</label>
                <textarea
                  required
                  rows={4}
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  placeholder="اكتب سبب طلب الاسترداد..."
                  className="w-full bg-stone-50 text-stone-900 text-xs py-3 px-4 rounded-xl border border-amber-200 focus:outline-none focus:ring-1 focus:ring-orange-700 leading-relaxed"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewRefundModal(false)}
                  className="bg-stone-50 text-stone-600 hover:bg-stone-100 px-5 py-2.5 rounded-xl text-xs font-extrabold cursor-pointer border border-stone-200"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isRequestPending}
                  className="bg-orange-700 hover:bg-orange-800 text-white font-black px-6 py-2.5 rounded-xl text-xs transition border-0 cursor-pointer shadow-sm flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {isRequestPending ? 'جاري الإرسال...' : 'إرسال الطلب'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
