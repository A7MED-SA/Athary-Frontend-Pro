import { useState } from 'react';
import { Check, X } from 'lucide-react';
import { SectionHeader } from '../../../components/shared/ui';

interface OrderItem {
  id: string; studentName: string; courseTitle: string;
  amount: number; date: string; status: string;
}

interface RefundItem {
  id: string; studentName: string; courseTitle: string;
  amount: number; reason: string; date: string;
  status: string; rejectionReason?: string;
}

interface OrdersRefundsManagerProps {
  orders: OrderItem[];
  refunds: RefundItem[];
  onApproveRefund: (id: string) => void;
  onReject: (type: 'course' | 'teacher' | 'refund', id: string) => void;
}

export function OrdersRefundsManager({ orders, refunds, onApproveRefund, onReject }: OrdersRefundsManagerProps) {
  const [subTab, setSubTab] = useState<'orders' | 'refunds'>('orders');

  const badgeClass = (status: string, base: string) => {
    if (status === 'Completed' || status === 'Approved') return 'bg-emerald-50 text-emerald-800 border border-emerald-100';
    if (status === 'Refunded' || status === 'Rejected') return 'bg-red-50 text-red-800 border border-red-100';
    if (status === 'Pending') return 'bg-amber-50 text-amber-800 border border-amber-100 animate-pulse';
    return base;
  };

  return (
    <div className="space-y-6 animate-fade-in" id="financial-orders-workbench">
      <div className="text-right border-b border-amber-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-0.5">
          <SectionHeader label="إدارة مالية واشتراكات الطلاب" title="التحصيل المالي ومعالجة استردادات الرسوم"
            description="مراقبت حركات الشراء المباشرة والتحقق من حساب استردادات الطلاب وموازنتها بدقة." />
        </div>
        <div className="flex bg-stone-100 p-1 rounded-2xl border border-stone-200 self-start sm:self-auto shrink-0">
          <button onClick={() => setSubTab('orders')}
            className={`py-1.5 px-4 rounded-xl text-xs font-extrabold transition cursor-pointer border-0 ${subTab === 'orders' ? 'bg-orange-700 text-white shadow-sm' : 'text-stone-500 hover:text-stone-800 bg-transparent'}`}>
            حركات الشراء والاشتراك ({orders.length})
          </button>
          <button onClick={() => setSubTab('refunds')}
            className={`py-1.5 px-4 rounded-xl text-xs font-extrabold transition cursor-pointer border-0 ${subTab === 'refunds' ? 'bg-orange-700 text-white shadow-sm' : 'text-stone-500 hover:text-stone-800 bg-transparent'}`}>
            مطالبات المرتجع المالي ({refunds.length})
          </button>
        </div>
      </div>

      {subTab === 'orders' && (
        <div className="bg-white rounded-3xl border border-amber-200/80 shadow-xs overflow-hidden">
          <div className="p-4 bg-stone-50 border-b border-stone-200 text-right">
            <span className="text-xs font-black text-stone-950 block">تفصيل حركات شراء مقاعد المذاكرة</span>
            <p className="text-[10px] text-stone-400 font-light">السجلات والاعتمادات البنكية المحصلة عبر منصة آثاري للشراء.</p>
          </div>
          <div className="overflow-x-auto text-right">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-stone-50 text-stone-500 font-bold border-b border-stone-100">
                  <th className="p-4">رقم الاشتراك</th>
                  <th className="p-4">اسم الطالب المستفيد</th>
                  <th className="p-4">المساق التدريبي المفتوح</th>
                  <th className="p-4">المبلغ المدفوع</th>
                  <th className="p-4">توقيت المعاملة</th>
                  <th className="p-4">حالة المعاملة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-light text-stone-700">
                {orders.map(order => (
                  <tr key={order.id} className="hover:bg-amber-50/10">
                    <td className="p-4 font-mono text-stone-400 text-[10px]">{order.id}</td>
                    <td className="p-4 font-black text-stone-950">{order.studentName}</td>
                    <td className="p-4 font-medium text-stone-800">{order.courseTitle}</td>
                    <td className="p-4 font-mono font-bold text-stone-950">{order.amount} ر.س</td>
                    <td className="p-4 font-mono text-stone-500 text-[11px]">{order.date}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-black ${badgeClass(order.status, 'bg-stone-100 text-stone-600 border border-stone-100')}`}>
                        {order.status === 'Completed' ? 'تم تحصيلها' : order.status === 'Refunded' ? 'مستردة للبطاقة' : 'معلّقة قيد الدفع'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {subTab === 'refunds' && (
        <div className="bg-white rounded-3xl border border-amber-200/80 shadow-xs overflow-hidden">
          <div className="p-4 bg-stone-50 border-b border-stone-200 text-right">
            <span className="text-xs font-black text-stone-950 block">طلبات المرتجعات المالية بانتظار البت والتسوية</span>
            <p className="text-[10px] text-stone-400 font-light">مراجعة ملفات المستفيدين وتبرير المطالبات وصرف موازناتها للبطاقة.</p>
          </div>
          <div className="overflow-x-auto text-right">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-[#FAF9F2] text-stone-600 font-bold border-b border-stone-200 text-right">
                  <th className="p-4">كود الطلب</th>
                  <th className="p-4">اسم الطالب والرسوم</th>
                  <th className="p-4">أسباب وتبريرات المترشح</th>
                  <th className="p-4">تاريخ الطلب</th>
                  <th className="p-4">حالة التذكرة</th>
                  <th className="p-4 text-center">الإجراء المالي المباشر</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-light text-stone-600">
                {refunds.map(refund => (
                  <tr key={refund.id} className="hover:bg-amber-50/10 transition">
                    <td className="p-4 font-mono font-bold text-stone-400 text-[10px]">{refund.id}</td>
                    <td className="p-4 font-bold text-stone-900">
                      <span className="block text-stone-950 font-black">{refund.studentName}</span>
                      <span className="text-[10px] text-orange-950 font-mono font-bold">{refund.amount} ر.س</span>
                    </td>
                    <td className="p-4 max-w-sm">
                      <span className="block font-medium text-stone-700 leading-relaxed text-[10px]">{refund.courseTitle}</span>
                      <p className="text-[10px] text-stone-400 font-light max-w-xs mt-1 italic tracking-normal md:max-w-md">"{refund.reason}"</p>
                      {refund.rejectionReason && (
                        <p className="text-[9px] text-red-700 bg-red-50 p-2 rounded-lg border border-red-100 mt-1">
                          <strong>ملحوظة الرفض:</strong> "{refund.rejectionReason}"
                        </p>
                      )}
                    </td>
                    <td className="p-4 text-stone-400 font-mono text-[10px]">{refund.date}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[9px] font-black ${badgeClass(refund.status, 'bg-stone-100 text-stone-500')}`}>
                        {refund.status === 'Pending' ? '🔘 بانتظار التسوية' : refund.status === 'Approved' ? '🟢 تمت موازنة الدفع' : '🔴 رفض الصرف'}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      {refund.status === 'Pending' ? (
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => onApproveRefund(refund.id)}
                            className="bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-[10px] font-black px-3 py-1.5 border-0 shadow-sm cursor-pointer transition flex items-center gap-1"
                            title="شحن المقاعد المالية للبطاقة">
                            <Check className="w-3 h-3" /><span>صرف المبلغ</span>
                          </button>
                          <button onClick={() => onReject('refund', refund.id)}
                            className="bg-red-50 hover:bg-red-100 text-red-700 px-2 py-1.5 rounded-xl border border-red-200 text-[10px] font-bold cursor-pointer transition flex items-center gap-1"
                            title="رفض طلب الارجاع">
                            <X className="w-3 h-3" /><span>رفض</span>
                          </button>
                        </div>
                      ) : (
                        <span className="text-[10px] text-stone-400">مغلق</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
