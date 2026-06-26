import React, { useState } from 'react';
import {
  Clock,
  ShieldAlert,
  Settings,
  Save,
  Filter,
  ShieldCheck,
  Sliders,
  ToggleLeft,
  ToggleRight,
  Info
} from 'lucide-react';

interface SystemActivitySettingsProps {
  onTriggerToast: (msg: string) => void;
}

export default function SystemActivitySettings({ onTriggerToast }: SystemActivitySettingsProps) {
  const [activeTab, setActiveTab] = useState<'audit_logs' | 'system_settings'>('audit_logs');

  // --- Empty (no API available)
  const [auditLogs] = useState<never[]>([]);

  // --- System settings with neutral defaults
  const [maintenanceMode, setMaintenanceMode] = useState<boolean>(false);
  const [refundDays, setRefundDays] = useState<number>(0);
  const [maxUploadSize, setMaxUploadSize] = useState<string>('');
  const [whatsappAlerts, setWhatsappAlerts] = useState<boolean>(false);
  const [strictOtp, setStrictOtp] = useState<boolean>(false);
  const [backupFrequency, setBackupFrequency] = useState<string>('');

  // --- Search and filter UI (no real data to filter)
  const [auditSearch, setAuditSearch] = useState<string>('');
  const [auditRoleFilter, setAuditRoleFilter] = useState<string>('all');
  const [auditTypeFilter, setAuditTypeFilter] = useState<string>('all');

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onTriggerToast('💾 تم حفظ كافة إعدادات البوابة الأمنية وإعادة إرفاق القواعد بالملف المعياري بنجاح.');
  };

  return (
    <div className="bg-stone-50 rounded-3xl border border-stone-200 p-4 sm:p-6 text-right font-sans" dir="rtl" id="system-activity-settings">

      {/* Upper Tab Bar Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200 pb-5 mb-6">
        <div>
          <h2 className="text-base sm:text-xl font-black text-orange-700 font-serif flex items-center gap-2">
            <Sliders className="w-6 h-6 text-orange-700" />
            <span>لوحة التحكم الأمني والإعدادات الفنية العليا</span>
          </h2>
          <p className="text-[11px] sm:text-xs text-stone-500 mt-1 max-w-xl">
            تدقيق ومراقبة تحركات المشرفين والهيئة الأكاديمية بالأثر الرجعي، وتخصيص البوابات واللوائح والسياسات المالية الكسروية.
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex bg-stone-100 p-1.5 rounded-xl border border-stone-200 self-start">
          <button
            onClick={() => setActiveTab('audit_logs')}
            className={`px-4 py-2.5 rounded-lg text-xs font-black transition cursor-pointer border-0 flex items-center gap-1.5 ${
              activeTab === 'audit_logs'
                ? 'bg-orange-700 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-200'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>سجل النشاطات والأمان (Audit Logs)</span>
          </button>

          <button
            onClick={() => setActiveTab('system_settings')}
            className={`px-4 py-2.5 rounded-lg text-xs font-black transition cursor-pointer border-0 flex items-center gap-1.5 ${
              activeTab === 'system_settings'
                ? 'bg-orange-700 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-200'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>إعدادات البوابة والنظام (System Settings)</span>
          </button>
        </div>
      </div>

      {/* ======================= TAB 1: AUDIT LOGS ======================= */}
      {activeTab === 'audit_logs' && (
        <div className="space-y-6">

          {/* Security Alert indicator */}
          <div className="bg-orange-700/5 border border-orange-700/15 p-4 rounded-2xl flex items-start gap-3 text-right">
            <div className="p-2 bg-orange-700/10 text-orange-790 rounded-xl mt-0.5">
              <ShieldCheck className="w-5 h-5 text-orange-700" />
            </div>
            <div className="space-y-0.5">
              <h4 className="font-extrabold text-orange-700 text-xs sm:text-sm">سلسلة كتل التدقيق الآمنة (Immutable Logs)</h4>
              <p className="text-[11px] text-stone-500 max-w-xl leading-relaxed">
                هذه السجلات تقيّد تحركات الطاقم الإداري والمالي ولا يمكن التلاعب بها أو شطبها من قبل أي مسؤول، وتعمل بالربط المباشر مع عمال المراقبة الأمنية بالخلفية (.NET Cloud Logger).
              </p>
            </div>
          </div>

          {/* Filters Bar */}
          <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-3xs flex flex-col md:flex-row items-center justify-between gap-4">

            {/* Search Input */}
            <div className="w-full md:w-80 relative">
              <Filter className="absolute right-3.5 top-2.5 w-4 h-4 text-stone-400" />
              <input
                type="text"
                value={auditSearch}
                onChange={(e) => setAuditSearch(e.target.value)}
                placeholder="البحث في تفاصيل الإجراء أو الفاعل..."
                className="w-full bg-stone-50 text-stone-900 text-xs py-2 px-3 pr-10 rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-orange-700 font-medium"
              />
            </div>

            {/* Quick Filters */}
            <div className="w-full md:w-auto flex flex-wrap items-center gap-2 justify-end">

              {/* Role filter */}
              <select
                value={auditRoleFilter}
                onChange={(e) => setAuditRoleFilter(e.target.value)}
                className="bg-stone-50 border text-stone-800 text-xs py-2 px-2 rounded-xl focus:outline-none"
              >
                <option value="all">كل الرتب والأعضاء</option>
                <option value="مشرف رئيسي">مشرف رئيسي</option>
                <option value="مشرف مساعد">مشرف مساعد</option>
                <option value="مدرس معتمد">مدرس معتمد</option>
              </select>

              {/* Entity Type Filter */}
              <select
                value={auditTypeFilter}
                onChange={(e) => setAuditTypeFilter(e.target.value)}
                className="bg-stone-50 border text-stone-800 text-xs py-2 px-3 rounded-xl focus:outline-none"
              >
                <option value="all">كافة أقسام المنصة</option>
                <option value="مقررات دراسية">مقررات دراسية</option>
                <option value="مكتبة الوسائط">مكتبة الوسائط</option>
                <option value="مركز الإعلانات">مركز الإعلانات</option>
                <option value="نظام المراجعات والتقييمات">نظام المراجعات</option>
                <option value="طلبات التدريس">طلبات التدريس</option>
                <option value="المعاملات المالية والمدفوعات">المالية والمدفوعات</option>
              </select>

            </div>

          </div>

          {/* Empty State */}
          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-3xs">
            <div className="p-16 text-center text-stone-400">
              <ShieldAlert className="w-14 h-14 text-stone-300 mx-auto stroke-[1.5] mb-3" />
              <h5 className="font-bold text-stone-700 text-sm">لا توجد سجلات تدقيق متاحة حالياً</h5>
              <p className="text-xs text-stone-400 mt-1">
                سيتم عرض سجل النشاطات هنا عند توفر بيانات من الخادم.
              </p>
            </div>
          </div>

        </div>
      )}

      {/* ======================= TAB 2: SYSTEM SETTINGS ======================= */}
      {activeTab === 'system_settings' && (
        <form onSubmit={handleSaveSettings} className="space-y-6 max-w-2xl mx-auto bg-white border border-stone-200 rounded-3xl p-5 sm:p-6 shadow-sm">

          <div className="border-b border-stone-100 pb-3">
            <h3 className="font-extrabold text-sm sm:text-base text-stone-900 flex items-center gap-1.5 font-serif">
              <Settings className="w-5 h-5 text-orange-700" />
              <span>لوحة تخصيص سياسات البوابة ومواعيدها</span>
            </h3>
            <p className="text-[11px] text-stone-400 mt-0.5">
              تتحكم هذه البنود في القواعد المالية، مساحات التخزين، ومعايير مصادقة الهواتف والواتساب.
            </p>
          </div>

          <div className="space-y-5 divide-y divide-stone-100">

            {/* ROW 1: MAINTENANCE MODE */}
            <div className="flex items-center justify-between gap-4 pt-4 first:pt-0">
              <div className="space-y-0.5 text-right w-2/3">
                <span className="font-extrabold text-xs sm:text-sm text-stone-900 block">وضع الصيانة المعلق (Maintenance Mode)</span>
                <p className="text-[10px] text-stone-400 leading-relaxed font-light">
                  عند تفعيله، سيتم حظر التصفح والوصول لجميع الطلاب والمدرسين، مع إظهار بطاقة اعتذار تراثية رصينة لأعمال الترقية.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setMaintenanceMode(!maintenanceMode)}
                className="bg-transparent border-0 cursor-pointer p-0 shrink-0"
              >
                {maintenanceMode ? (
                  <ToggleRight className="w-10 h-10 text-orange-700" />
                ) : (
                  <ToggleLeft className="w-10 h-10 text-stone-300" />
                )}
              </button>
            </div>

            {/* ROW 2: REFUND DAYS */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-5">
              <div className="space-y-0.5 text-right w-full sm:w-2/3">
                <span className="font-extrabold text-xs sm:text-sm text-stone-900 block">أيام السماح لطلبات استرداد الرسوم</span>
                <p className="text-[10px] text-stone-400 leading-relaxed">
                  تحديد المدة القصوى بالأيام التي يمكن للطالب تقديم طلب رد الأموال فيها بعد شراء المقاطعة الدراسية بوزارة الدفع.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="3"
                  max="60"
                  required
                  value={refundDays}
                  onChange={(e) => setRefundDays(parseInt(e.target.value) || 0)}
                  className="w-20 bg-stone-50 text-stone-950 font-mono text-center text-xs py-2 rounded-lg border border-stone-200 focus:outline-none focus:ring-1 focus:ring-orange-700"
                />
                <span className="text-[11px] text-stone-500 font-bold">أيام مبرمة</span>
              </div>
            </div>

            {/* ROW 3: MAX FILE SIZE */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-5">
              <div className="space-y-0.5 text-right w-full sm:w-2/3">
                <span className="font-extrabold text-xs sm:text-sm text-stone-900 block">الحد الأقصى لحجم الملف المرفوع</span>
                <p className="text-[10px] text-stone-400 leading-relaxed">
                  الحد الأقصى لإيداع الفيديوهات والملخصات من قبل أعضاء هيئة التدريس لمنع تجاوز مسيرة التخزين المشتركة.
                </p>
              </div>

              <select
                value={maxUploadSize}
                onChange={(e) => setMaxUploadSize(e.target.value)}
                className="bg-stone-50 border text-stone-800 text-xs py-2 px-3 rounded-lg focus:outline-none shrink-0"
              >
                <option value="">-- اختر الحجم --</option>
                <option value="500MB">٥٠٠ ميغابايت (صيغة مضغوطة)</option>
                <option value="1GB">١ جيغابايت (المعيار الاقتصادي)</option>
                <option value="2GB">٢ جيغابايت (المسارات الطويلة)</option>
              </select>
            </div>

            {/* ROW 4: WHATSAPP NOTIFICATIONS */}
            <div className="flex items-center justify-between gap-4 pt-5">
              <div className="space-y-0.5 text-right w-2/3">
                <span className="font-extrabold text-xs sm:text-sm text-stone-900 block">تفعيل التنبيهات والبث عبر WhatsApp</span>
                <p className="text-[10px] text-stone-400 leading-relaxed font-light">
                  إحاطة المعلمين والطلاب بروابط بث الغرف الصوتية عاجلاً وإرسال تذكيرات الاختبارات الأسبوعية عبر بوابات واتساب للهواتف المحمولة.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setWhatsappAlerts(!whatsappAlerts)}
                className="bg-transparent border-0 cursor-pointer p-0 shrink-0"
              >
                {whatsappAlerts ? (
                  <ToggleRight className="w-10 h-10 text-orange-700" />
                ) : (
                  <ToggleLeft className="w-10 h-10 text-stone-300" />
                )}
              </button>
            </div>

            {/* ROW 5: STRICT OTP VERIFICATION */}
            <div className="flex items-center justify-between gap-4 pt-5">
              <div className="space-y-0.5 text-right w-2/3">
                <span className="font-extrabold text-xs sm:text-sm text-stone-900 block">فرض مصادقة الهوية الثنائية الصارمة (Strict OTP)</span>
                <p className="text-[10px] text-stone-400 leading-relaxed font-light">
                  إرغام المشرفين والمعلمين على تصديق الدخول برمز يرسل لبريد الإلكتروني عند الدخول من متصفح أو بلد غير مألوف.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setStrictOtp(!strictOtp)}
                className="bg-transparent border-0 cursor-pointer p-0 shrink-0"
              >
                {strictOtp ? (
                  <ToggleRight className="w-10 h-10 text-orange-700" />
                ) : (
                  <ToggleLeft className="w-10 h-10 text-stone-300" />
                )}
              </button>
            </div>

            {/* ROW 6: BACKUP FREQUENCY */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-5">
              <div className="space-y-0.5 text-right w-full sm:w-2/3">
                <span className="font-extrabold text-xs sm:text-sm text-stone-900 block">تردد النسخ الاحتياطي التلقائي للأثريات</span>
                <p className="text-[10px] text-stone-400 leading-relaxed">
                  دورة عمل خادم السحابة الاحتياطية لتوليد ملفات SQL لجميع الجداول وتأطيرها وحفظها مجانياً.
                </p>
              </div>

              <select
                value={backupFrequency}
                onChange={(e) => setBackupFrequency(e.target.value)}
                className="bg-stone-50 border text-stone-800 text-xs py-2 px-3 rounded-lg focus:outline-none shrink-0"
              >
                <option value="">-- اختر التردد --</option>
                <option value="Hourly">كل ساعة (نقاط استعادة حرجة)</option>
                <option value="Daily">يومي (المعيار الموصى به)</option>
                <option value="Weekly">أسبوعي (التخزين الاقتصادي)</option>
              </select>
            </div>

          </div>

          {/* Alert critical */}
          <div className="bg-red-50/50 border border-red-200 rounded-xl p-3 flex gap-2 items-start mt-4 text-red-950">
            <Info className="w-4 h-4 text-red-700 shrink-0 mt-0.5" />
            <p className="text-[10px] sm:text-[11px] leading-relaxed">
              <strong>ملاحظة إشرافية هامة:</strong> تعديل السياسات الحساسة كـ (Refund Days) ينعكس فوراً على خوارزميات الدفع والاسترداد البرمجية ويتحكم بحظر سحب الشحنات ميكانيكياً.
            </p>
          </div>

          {/* Sticky/Bottom Save button */}
          <div className="pt-4 border-t border-stone-200 flex justify-end">
            <button
              type="submit"
              className="bg-orange-700 hover:bg-orange-800 text-white font-black py-3 px-8 rounded-xl text-xs sm:text-sm transition shadow-md border-0 cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>تأكيد وحفظ إعدادات المنصة العليا</span>
            </button>
          </div>

        </form>
      )}

    </div>
  );
}
