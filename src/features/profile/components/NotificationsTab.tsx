import { Save } from 'lucide-react';

interface NotificationsTabProps {
  notifSmsLive: boolean;
  notifEmailManuscript: boolean;
  notifPushAnnouncements: boolean;
  notifWeeklyDigest: boolean;
  isNotifPending: boolean;
  onSmsLiveChange: (v: boolean) => void;
  onEmailManuscriptChange: (v: boolean) => void;
  onPushAnnouncementsChange: (v: boolean) => void;
  onWeeklyDigestChange: (v: boolean) => void;
  onSave: () => void;
  onCancel: () => void;
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label?: string }) {
  return (
    <label className="relative inline-flex items-center cursor-pointer select-none">
      <input type="checkbox" className="sr-only peer" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-700"></div>
    </label>
  );
}

export function NotificationsTab({
  notifSmsLive, notifEmailManuscript, notifPushAnnouncements, notifWeeklyDigest,
  isNotifPending, onSmsLiveChange, onEmailManuscriptChange, onPushAnnouncementsChange, onWeeklyDigestChange,
  onSave, onCancel,
}: NotificationsTabProps) {
  return (
    <div className="space-y-6 animate-fade-in text-right" dir="rtl">
      <div className="bg-orange-50/20 p-4 rounded-2xl border border-stone-200 mb-4 text-right">
        <span className="text-[11px] font-extrabold text-orange-950">🔔 إشعارات البوابة الشريفة</span>
        <p className="text-stone-600 text-xs mt-1 leading-relaxed">
          يتم مزامنة تعديلاتك تلقائياً مع خيوط إشعارات الحساب. تحكم بقنوات الاتصال المفضلة لضمان استلاف تقارير المدرسين والإجازات التراكمية.
        </p>
      </div>

      <div className="space-y-4">
        <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200/60 flex items-start justify-between gap-4">
          <div className="space-y-1 text-right flex-1">
            <h4 className="text-xs font-black text-stone-900">تنبيهات البث المفتوح والدروس المباشرة (SMS)</h4>
            <p className="text-[11px] text-stone-500 leading-normal font-light">تلقي رسائل جوال نصية هامة عند بدء المدرس في شرح مخطوط حية لمساعدتك على الحضور الفوري والتعليق.</p>
          </div>
          <Toggle checked={notifSmsLive} onChange={onSmsLiveChange} />
        </div>

        <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200/60 flex items-start justify-between gap-4">
          <div className="space-y-1 text-right flex-1">
            <h4 className="text-xs font-black text-stone-900">مراجعة وتدبيج المخطوطات والواجبات العلمية (البريد الإلكتروني)</h4>
            <p className="text-[11px] text-stone-500 leading-normal font-light">تلقي رسالة آلية عبر بريدك المسجل فور قيام أحد الأساتذة بتقييم فرضك المكتوب أو كتابة حواشٍ نقدية عليه.</p>
          </div>
          <Toggle checked={notifEmailManuscript} onChange={onEmailManuscriptChange} />
        </div>

        <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200/60 flex items-start justify-between gap-4">
          <div className="space-y-1 text-right flex-1">
            <h4 className="text-xs font-black text-stone-900">إشعار بالمستجدات والقرارات الإدارية العليا (إشارات ويب مدمجة)</h4>
            <p className="text-[11px] text-stone-500 leading-normal font-light">تنبيهات منبثقة غامرة للأجهزة لقرارات مجلس إدارة الأثر الأكاديمي، بما يشمل تعديلات المناهج الشريفة.</p>
          </div>
          <Toggle checked={notifPushAnnouncements} onChange={onPushAnnouncementsChange} />
        </div>

        <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200/60 flex items-start justify-between gap-4">
          <div className="space-y-1 text-right flex-1">
            <h4 className="text-xs font-black text-stone-900">الملخص الأسبوعي للدارس (تقرير قياس الأثر التحليلي)</h4>
            <p className="text-[11px] text-stone-500 leading-normal font-light">تلقي تقرير شامل في صبيحة كل سبت يوضح كمية استهلاكك للمحاضرات وعدد الساعات التراكمية ومستوى تقدم معدلاتك.</p>
          </div>
          <Toggle checked={notifWeeklyDigest} onChange={onWeeklyDigestChange} />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-stone-100">
        <button type="button" onClick={onCancel}
          className="bg-stone-100 hover:bg-stone-200 text-stone-600 font-bold py-2.5 px-6 rounded-xl text-xs transition border-0 cursor-pointer">
          العودة للرئيسية
        </button>
        <button type="button" disabled={isNotifPending} onClick={onSave}
          className="bg-orange-700 hover:bg-orange-850 text-amber-50 font-black py-2.5 px-6 rounded-xl text-xs shadow-sm transition border-0 cursor-pointer flex items-center gap-1.5 disabled:opacity-50">
          <Save className="w-4 h-4" />
          <span>{isNotifPending ? 'جاري الحفظ...' : 'تأكيد الحفظ الرئيسي'}</span>
        </button>
      </div>
    </div>
  );
}
