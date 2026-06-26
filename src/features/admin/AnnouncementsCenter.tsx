import { useState } from 'react';
import {
  Megaphone,
  Users,
  Trash2,
  Send,
  ToggleLeft,
  ToggleRight,
  Clock,
  Volume2,
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { announcementService } from '@/features/announcements/services/announcement.service';
import { queryKeys } from '@/lib/query-keys';

interface AnnouncementsCenterProps {
  onTriggerToast: (msg: string) => void;
}

type Audience = 'Everyone' | 'Students' | 'Instructors';

function getDisplayAudience(targetRoles: string[]): Audience {
  if (targetRoles.includes('Student')) return 'Students';
  if (targetRoles.includes('Instructor')) return 'Instructors';
  return 'Everyone';
}

function toTargetRoles(audience: Audience): string[] {
  switch (audience) {
    case 'Everyone': return [];
    case 'Students': return ['Student'];
    case 'Instructors': return ['Instructor'];
  }
}

export default function AnnouncementsCenter({ onTriggerToast }: AnnouncementsCenterProps) {
  const queryClient = useQueryClient();

  const [formTitle, setFormTitle] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formTarget, setFormTarget] = useState<Audience>('Everyone');
  const [filterAudience, setFilterAudience] = useState<string>('all');

  const { data: annResponse, isLoading } = useQuery({
    queryKey: queryKeys.announcements.list(),
    queryFn: () => announcementService.getAnnouncements(),
  });

  const createMutation = useMutation({
    mutationFn: (data: { title: string; content: string; targetRoles: string[] }) =>
      announcementService.create({
        title: data.title,
        content: data.content,
        type: 'General',
        targetRoles: data.targetRoles,
        isPinned: true,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.announcements.all });
      setFormTitle('');
      setFormContent('');
      setFormTarget('Everyone');
      onTriggerToast('🚀 تم نشر الإعلان وبث الإشعار اللحظي للمستخدمين.');
    },
    onError: () => {
      onTriggerToast('❌ فشل نشر الإعلان. حاول مرة أخرى.');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, isPinned }: { id: string; isPinned: boolean }) =>
      announcementService.update(id, { isPinned }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.announcements.all });
      onTriggerToast(
        variables.isPinned
          ? '✓ تم تفعيل الإعلان بنجاح وبدء بث التنبيه الفوري به.'
          : '✓ تم تعطيل الإعلان وإيقاف بث إشعاراته المباشرة للطلاب.'
      );
    },
    onError: () => {
      onTriggerToast('❌ فشل تحديث حالة الإعلان.');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => announcementService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.announcements.all });
      onTriggerToast('🗑️ تم التراجع وحذف الإعلان بشكل تراكمي بنجاح.');
    },
    onError: () => {
      onTriggerToast('❌ فشل حذف الإعلان.');
    },
  });

  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formContent.trim()) {
      onTriggerToast('❌ يرجى تعيين عنوان الإعلان ومحتواه العريض.');
      return;
    }
    createMutation.mutate({
      title: formTitle,
      content: formContent,
      targetRoles: toTargetRoles(formTarget),
    });
  };

  const handleToggleActive = (id: string, currentStatus: boolean) => {
    updateMutation.mutate({ id, isPinned: !currentStatus });
  };

  const handleDeleteAnnouncement = (id: string) => {
    deleteMutation.mutate(id);
  };

  const announcements = annResponse?.data?.items ?? [];

  const filtered = announcements.filter((ann) => {
    if (filterAudience === 'all') return true;
    return getDisplayAudience(ann.targetRoles) === filterAudience;
  });

  return (
    <div className="bg-stone-50 rounded-3xl border border-stone-200 p-4 sm:p-6 text-right font-sans" dir="rtl" id="announcements-management-center">

      {/* Banner info */}
      <div className="flex items-center gap-3 border-b border-amber-200/50 pb-4 mb-6">
        <div className="p-3 bg-red-700/10 text-orange-780 rounded-2xl flex items-center justify-center">
          <Megaphone className="w-6 h-6 text-orange-700 animate-pulse" />
        </div>
        <div>
          <h3 className="font-extrabold text-stone-900 text-sm sm:text-base font-serif">مركز إدارة الإعلانات والأخبار العاجلة</h3>
          <p className="text-[11px] text-stone-500 font-light leading-relaxed">
            بث التنبيهات والأوامر الإدارية لعموم الدارسين والمعلمين بالمنصة، واستهداف الحلقات الدراسية المحددة.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* RIGHT COLUMN: CREATE FORM */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-amber-200/60 p-5 space-y-4 shadow-3xs h-fit">
          <div className="border-b border-stone-100 pb-2">
            <h4 className="font-extrabold text-orange-700 text-xs sm:text-sm font-serif">صياغة إعلان جديد وبثه</h4>
            <p className="text-[10px] text-stone-400 mt-0.5">صمم الإشعار الذي يظهر فوراً في حسابات الدارسين المعينين</p>
          </div>

          <form onSubmit={handleCreateAnnouncement} className="space-y-4">

            {/* Title */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700 block">عنوان التنويه أو الإعلان</label>
              <input
                type="text"
                required
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="مثال: تأجيل محاضرة النثر العربي بسبب تحديث الغرف"
                className="w-full bg-stone-50 text-stone-900 text-xs py-3 px-3.5 rounded-xl border border-amber-200 focus:outline-none focus:ring-1 focus:ring-orange-700 font-semibold"
              />
            </div>

            {/* Target Audience SELECT */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700 block">الجمهور والدارسين المستهدفين بالبلاغ</label>
              <select
                value={formTarget}
                onChange={(e) => setFormTarget(e.target.value as Audience)}
                className="w-full bg-stone-50 text-stone-900 text-xs py-3 px-3 rounded-xl border border-amber-200 focus:outline-none"
              >
                <option value="Everyone">الجميع (كافة الزوار، الطلاب، والمدرسين)</option>
                <option value="Students">الطلاب والأعضاء الدارسين فقط</option>
                <option value="Instructors">أعضاء هيئة التدريس والتحقيق فقط</option>
              </select>
            </div>

            {/* Content Textarea */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700 block">مضمون البث والنص التفصيلي</label>
              <textarea
                required
                rows={5}
                value={formContent}
                onChange={(e) => setFormContent(e.target.value)}
                placeholder="تفاصيل التنويه، الروابط البديلة ومواعيد البث المحددة بدقة..."
                className="w-full bg-stone-50 text-stone-900 text-xs py-2.5 px-3.5 rounded-xl border border-amber-200 focus:outline-none focus:ring-1 focus:ring-orange-700 leading-relaxed font-light"
              />
            </div>

            <div className="bg-orange-50 rounded-xl p-3 text-[10px] text-orange-950 border border-orange-200/60 leading-relaxed font-medium">
              🔔 عند الضغط على "نشر الإعلان"، سيقوم معالج البث بدفع إشعار فوري (SignalR Event) لكافة المشتركين المتواجدين على نفس نطاق الاستهداف حالياً.
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={createMutation.isPending}
              className={`w-full bg-orange-700 hover:bg-orange-800 text-white font-black py-3 px-5 rounded-xl text-xs sm:text-sm transition shadow-md border-0 cursor-pointer flex items-center justify-center gap-2 ${
                createMutation.isPending ? 'opacity-80' : ''
              }`}
            >
              {createMutation.isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>جاري تعميم الإعلان وبثه...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>نشر وبث الإعلان عاجلاً</span>
                </>
              )}
            </button>

          </form>
        </div>

        {/* LEFT COLUMN: ACTIVE ANNOUNCEMENTS LIST */}
        <div className="lg:col-span-3 space-y-4">

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-stone-100/80 p-3 border border-stone-200 rounded-xl">
            <h4 className="font-extrabold text-xs text-stone-900">سجل الإعلانات المبرمة النشطة والمدفوعة</h4>

            {/* Quick Filter */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-stone-500 font-bold whitespace-nowrap">عرض الجمهور:</span>
              <select
                value={filterAudience}
                onChange={(e) => setFilterAudience(e.target.value)}
                className="bg-white border text-stone-800 text-[10px] p-1.5 rounded-lg focus:outline-none"
              >
                <option value="all">عرض الكل</option>
                <option value="Everyone">الجميع</option>
                <option value="Students">الطلاب</option>
                <option value="Instructors">المدرسين</option>
              </select>
            </div>
          </div>

          {isLoading ? (
            <div className="bg-white border rounded-2xl p-16 text-center text-stone-400 border-dashed border-stone-200">
              <div className="w-12 h-12 border-4 border-stone-200 border-t-orange-700 rounded-full animate-spin mx-auto mb-2" />
              <p className="text-xs font-bold text-stone-500">جاري تحميل الإعلانات...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="bg-white border rounded-2xl p-16 text-center text-stone-400 border-dashed border-stone-200">
              <Megaphone className="w-12 h-12 text-stone-300 mx-auto stroke-[1.5] mb-2" />
              <p className="text-xs font-bold text-stone-500">لا توجد إعلانات نشطة ومستهدفة حالياً لجمهور التصفية الحالي.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map((ann) => {
                const displayAudience = getDisplayAudience(ann.targetRoles);
                const isStudents = displayAudience === 'Students';
                const isInstructors = displayAudience === 'Instructors';

                return (
                  <div
                    key={ann.id}
                    className={`bg-white border rounded-2xl p-4 sm:p-5 shadow-3xs hover:border-amber-200 transition-all ${
                      ann.isPinned ? 'border-amber-200/85' : 'border-stone-200 opacity-65 bg-stone-50/40'
                    }`}
                  >
                    <div className="space-y-3">

                      {/* Badge header strip */}
                      <div className="flex flex-wrap items-center justify-between gap-2.5">
                        <div className="flex items-center gap-2">

                          {/* Target Audience indicator badges */}
                          {displayAudience === 'Everyone' && (
                            <span className="bg-orange-100 text-orange-950 text-[9px] px-2 py-0.5 rounded font-black flex items-center gap-1">
                              <Users className="w-3 h-3 text-orange-700" />
                              <span>الجميع</span>
                            </span>
                          )}

                          {isStudents && (
                            <span className="bg-blue-105 bg-blue-100 text-blue-950 text-[9px] px-2 py-0.5 rounded font-black flex items-center gap-1">
                              <Users className="w-3 h-3 text-blue-700" />
                              <span>الطلاب فقط</span>
                            </span>
                          )}

                          {isInstructors && (
                            <span className="bg-rose-100 text-rose-950 text-[9px] px-2 py-0.5 rounded font-black flex items-center gap-1">
                              <Users className="w-3 h-3 text-rose-700" />
                              <span>المدرسين والأكاديميين</span>
                            </span>
                          )}

                          {ann.isPinned ? (
                            <span className="bg-emerald-100 border border-emerald-200 text-emerald-800 text-[8px] px-2 py-0.5 rounded font-extrabold flex items-center gap-0.5">
                              ● نشط للبث
                            </span>
                          ) : (
                            <span className="bg-stone-100 border border-stone-200 text-stone-500 text-[8px] px-2 py-0.5 rounded font-extrabold">
                              موقوف حالياً
                            </span>
                          )}

                        </div>

                        <span className="text-[10px] text-stone-400 font-mono flex items-center gap-1 font-medium">
                          <Clock className="w-3 h-3" />
                          <span>تاريخ البث: {ann.createdAt.split('T')[0]}</span>
                        </span>
                      </div>

                      {/* Content block */}
                      <div className="space-y-1 text-right">
                        <h5 className="font-extrabold text-stone-900 text-xs sm:text-sm font-sans flex items-center gap-1">
                          <Volume2 className="w-4 h-4 text-orange-700" />
                          <span>{ann.title}</span>
                        </h5>

                        {ann.courseName && (
                          <span className="text-[10px] text-orange-700 font-semibold block pr-4">
                            * مستهدف خصيصاً: "{ann.courseName}"
                          </span>
                        )}

                        <p className="text-xs text-stone-600 leading-relaxed font-light mt-1 whitespace-pre-line pl-2">
                          {ann.content}
                        </p>
                      </div>

                      {/* Divider actions footer */}
                      <div className="pt-3 border-t border-stone-100 flex items-center justify-between">

                        {/* Toggle Active status */}
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-stone-400 font-bold">بث الإشعار:</span>
                          <button
                            onClick={() => handleToggleActive(ann.id, ann.isPinned)}
                            className="bg-transparent border-0 cursor-pointer p-0 shrink-0"
                            title="تبديل حالة النشاط للبث"
                          >
                            {ann.isPinned ? (
                              <ToggleRight className="w-8 h-8 text-orange-700" />
                            ) : (
                              <ToggleLeft className="w-8 h-8 text-stone-400" />
                            )}
                          </button>
                        </div>

                        <button
                          onClick={() => handleDeleteAnnouncement(ann.id)}
                          className="p-1.5 text-stone-400 hover:text-red-700 hover:bg-red-50 rounded-lg transition border-0 cursor-pointer flex items-center gap-1 text-[10px] font-bold"
                          title="حذف تماماً"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span className="hidden sm:inline">إزالة الإعلان</span>
                        </button>

                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
