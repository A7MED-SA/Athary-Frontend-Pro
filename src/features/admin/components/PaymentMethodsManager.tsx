import { DashboardSkeleton } from '../../../components/shared/Skeleton';
import { SectionHeader } from '../../../components/shared/ui';

interface PaymentMethodsManagerProps {
  methods: Array<{ id: string; name: string; type: string; isEnabled: boolean }> | undefined;
  isLoading: boolean;
  onToggle: (id: string) => void;
  onToast: (msg: string) => void;
}

export function PaymentMethodsManager({ methods, isLoading, onToggle, onToast }: PaymentMethodsManagerProps) {
  return (
    <div className="space-y-6 animate-fade-in" id="payment-methods-workbench-tab">
      <SectionHeader
        label="إدارة طرق الدفع المتاحة"
        title="طرق الدفع"
        description="تفعيل وتعطيل طرق الدفع المدعومة."
      />

      {isLoading ? (
        <DashboardSkeleton />
      ) : (
        <div className="bg-white rounded-3xl border border-amber-200/80 p-6 shadow-sm space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(methods ?? []).length === 0 ? (
              <div className="col-span-3 text-center py-8 text-stone-400 text-xs">لا توجد طرق دفع</div>
            ) : (
              (methods ?? []).map((method) => (
                <div key={method.id} className="bg-stone-50 border border-stone-200 rounded-2xl p-4 flex flex-col justify-between space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-extrabold text-xs text-stone-900">{method.name}</h4>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${method.isEnabled ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-stone-100 text-stone-600 border border-stone-200'}`}>
                      {method.isEnabled ? 'مفعّل' : 'معطّل'}
                    </span>
                  </div>
                  <p className="text-[10px] text-stone-500">{method.type}</p>
                  <button onClick={() => { onToggle(method.id); onToast('تم تبديل حالة طريقة الدفع'); }} className="w-full text-center bg-orange-700 hover:bg-orange-800 text-amber-50 text-[10px] font-bold py-2 rounded-xl border-0 cursor-pointer transition">
                    {method.isEnabled ? 'تعطيل' : 'تفعيل'}
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
