import { Terminal, Settings } from 'lucide-react';
import { SectionHeader } from '../../../components/shared/ui';

interface SettingsPanelProps {
  onSave: () => void;
}

export function SettingsPanel({ onSave }: SettingsPanelProps) {
  return (
    <div className="space-y-6 animate-fade-in" id="settings-workbench-tab">
      <SectionHeader label="إدارة الضوابط والمعايير الأكاديمية" title="اشتراطات المراجعة وتنبيهات اللائحة"
        description="صيانة قواعد القبول وشروط الاسترجاع المالي والمصادقات المباشرة لمجلس الإشراف." />

      <div className="bg-white p-6 rounded-3xl border border-amber-200/80 shadow-xs space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 leading-relaxed text-right">
          <div className="space-y-4">
            <h4 className="text-xs font-black text-stone-950 pb-2 border-b border-stone-100 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-orange-700" />
              <span>بروتوكولات التنبيه ومزامنة الغرف الحية (.NET Hub)</span>
            </h4>
            <div className="space-y-3">
              <label className="flex items-start gap-3 bg-stone-50 p-3.5 rounded-2xl border border-stone-200 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4.5 h-4.5 accent-orange-700 mt-0.5 shrink-0" />
                <div className="text-right">
                  <span className="font-extrabold text-stone-900 text-xs block">تمكين الاتصال الفوري SignalR لمعلمي المنصة</span>
                  <span className="text-[10px] text-stone-500 block leading-normal mt-0.5">تبليغ المدرسين تلقائياً عبر الإشعار بقرارات المشرفين (قبول/رفض).</span>
                </div>
              </label>
              <label className="flex items-start gap-3 bg-stone-50 p-3.5 rounded-2xl border border-stone-200 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4.5 h-4.5 accent-orange-700 mt-0.5 shrink-0" />
                <div className="text-right">
                  <span className="font-extrabold text-stone-900 text-xs block">إنفاذ وثيقة منع انتحال الشخصات العلمية</span>
                  <span className="text-[10px] text-stone-500 block leading-normal mt-0.5">مراجعة ثبوتيات التوطين من بطاقة ومواقع موحدة قبل النشر الجماهيري للمقاعد.</span>
                </div>
              </label>
            </div>
          </div>
          <div className="space-y-4">
            <h4 className="text-xs font-black text-stone-950 pb-2 border-b border-stone-100 flex items-center gap-2">
              <Settings className="w-4 h-4 text-orange-700" />
              <span>محددات الفواتير والحدود الزمنية العامة</span>
            </h4>
            <div className="space-y-4 text-xs font-medium">
              <div className="space-y-1.5 text-right">
                <span className="text-stone-500 text-[10px] block font-bold">المهلة الزمنية المتاحة لمرتجع رسوم مقاعد المذاكرة دائنة (أيام):</span>
                <input type="number" defaultValue={14} className="p-2.5 w-full text-xs rounded-xl bg-stone-50 border border-stone-200 text-stone-900 focus:outline-none" />
              </div>
              <div className="space-y-1.5 text-right font-mono">
                <span className="text-stone-500 text-[10px] block font-bold">البريد الموحد الصادر لغرفة التحكيم العلمي:</span>
                <input type="email" defaultValue="moderation-council@athari.sa" className="p-2.5 w-full text-xs rounded-xl bg-stone-50 border border-stone-200 text-stone-900 focus:outline-none font-mono text-left" />
              </div>
            </div>
          </div>
        </div>
        <div className="pt-4 border-t border-stone-100 flex justify-end">
          <button onClick={onSave}
            className="bg-orange-700 hover:bg-orange-800 text-white rounded-xl font-black text-xs px-6 py-3 border-0 cursor-pointer shadow-md transition">
            حفظ وإقرار التعديلات المعيارية الشاملة
          </button>
        </div>
      </div>
    </div>
  );
}
