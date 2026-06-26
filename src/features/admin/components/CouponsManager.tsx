import { DashboardSkeleton } from '../../../components/shared/Skeleton';
import { SectionHeader } from '../../../components/shared/ui';

interface CouponsManagerProps {
  coupons: Array<{ id: string; code: string; discountType: string; discountValue: number; currentUses: number; maxUses?: number; isActive: boolean }> | undefined;
  isLoading: boolean;
  onToggle: (id: string) => void;
  onToast: (msg: string) => void;
}

export function CouponsManager({ coupons, isLoading, onToggle, onToast }: CouponsManagerProps) {
  return (
    <div className="space-y-6 animate-fade-in" id="coupons-workbench-tab">
      <SectionHeader
        label="إدارة كوبونات الخصم والعروض"
        title="الكوبونات والخصومات"
        description="إنشاء وإدارة كوبونات الخصم والتحكم في صلاحياتها."
      />

      {isLoading ? (
        <DashboardSkeleton />
      ) : (
        <div className="bg-white rounded-3xl border border-amber-200/80 p-6 shadow-sm space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="border-b border-amber-100 text-stone-500 font-bold">
                  <th className="pb-3 pr-2">الكود</th>
                  <th className="pb-3">النوع</th>
                  <th className="pb-3">القيمة</th>
                  <th className="pb-3">الاستخدامات</th>
                  <th className="pb-3">الحالة</th>
                  <th className="pb-3 pl-2">الإجراء</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-50">
                {(coupons ?? []).length === 0 ? (
                  <tr><td colSpan={6} className="py-8 text-center text-stone-400">لا توجد كوبونات بعد</td></tr>
                ) : (
                  (coupons ?? []).map((coupon) => (
                    <tr key={coupon.id} className="hover:bg-amber-50/20 transition-colors">
                      <td className="py-3 pr-2 font-mono font-bold text-stone-900">{coupon.code}</td>
                      <td className="py-3">{coupon.discountType}</td>
                      <td className="py-3 font-mono">{coupon.discountValue}{coupon.discountType === 'Percentage' ? '%' : ' ر.س'}</td>
                      <td className="py-3 font-mono">{coupon.currentUses}{coupon.maxUses ? `/${coupon.maxUses}` : ''}</td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${coupon.isActive ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-stone-100 text-stone-600 border border-stone-200'}`}>
                          {coupon.isActive ? 'نشط' : 'معطّل'}
                        </span>
                      </td>
                      <td className="py-3 pl-2">
                        <button onClick={() => { onToggle(coupon.id); onToast('تم تبديل حالة الكوبون'); }} className="text-[10px] text-orange-700 hover:underline font-bold bg-transparent border-0 cursor-pointer">تبديل</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
