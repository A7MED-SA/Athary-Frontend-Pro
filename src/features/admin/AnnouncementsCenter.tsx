import React, { useState, useEffect } from 'react';
import { 
  Megaphone, 
  Users, 
  BookOpen, 
  Trash2, 
  AlertCircle, 
  Sparkles, 
  Send, 
  ToggleLeft, 
  ToggleRight, 
  Clock, 
  Bell,
  Volume2
} from 'lucide-react';
import { COURSES } from '../../data';

interface Announcement {
  id: string;
  title: string;
  content: string;
  targetAudience: 'Everyone' | 'Students' | 'Instructors' | 'SpecificCourse';
  courseId?: string;
  courseTitle?: string;
  date: string;
  isActive: boolean;
}

interface AnnouncementsCenterProps {
  onTriggerToast: (msg: string) => void;
}

export default function AnnouncementsCenter({ onTriggerToast }: AnnouncementsCenterProps) {
  // Mock Announcement Databases seed
  const [announcements, setAnnouncements] = useState<Announcement[]>([
    {
      id: 'ann-1',
      title: 'إطلاق مساقات صيفية جديدة للترميم والأماكن الأثرية',
      content: 'نعلن للزملاء الكرام والدارسين عن بد إطلاق التسجيل المجدول في البعثات التراثية الافتراضية للربع الثالث لعام ٢٠٢٦ بالشراكة مع هيئات الترميم الوطنية لمخطوطات الربع الخالي.',
      targetAudience: 'Everyone',
      date: '2026-06-11',
      isActive: true
    },
    {
      id: 'ann-2',
      title: 'تنويه لطلاب دورة "علم المخطوطات والتحقيق الأثري"',
      content: 'الرجاء من كافة الدارسين تقديم المنهج المقارن لصفحات إجماع الخطوط القديمة لتقييم الشواهد بنسختها المصورة في موعد أقصاه الأسبوع الدراسي المقبل لتجنب شطب وثيقة الاجتياز.',
      targetAudience: 'SpecificCourse',
      courseId: 'course_1',
      courseTitle: 'علم المخطوطات والتحقيق الأثري والترميم',
      date: '2026-06-10',
      isActive: true
    },
    {
      id: 'ann-3',
      title: 'ورش عمل واجتماع خاص بأعضاء هيئة التدريس والتحكيم',
      content: 'مشرفي شؤون الحلقات التعليمية ينوهون لضرورة حضور الندوة التقييمية المغلقة عبر الغرف الصوتية للتباحث في لوائح الاعتمادات الورقية للمجالس الحرة المعايرة.',
      targetAudience: 'Instructors',
      date: '2026-06-08',
      isActive: false
    }
  ]);

  // Create Form States (Watch fields to react changes)
  const [formTitle, setFormTitle] = useState<string>('');
  const [formContent, setFormContent] = useState<string>('');
  const [formTarget, setFormTarget] = useState<'Everyone' | 'Students' | 'Instructors' | 'SpecificCourse'>('Everyone');
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [isPublishing, setIsPublishing] = useState<boolean>(false);

  // Filter lists if needed (for live preview or student)
  const [filterAudience, setFilterAudience] = useState<string>('all');

  // Triggering visual notice changes
  const handleToggleActive = (id: string, currentStatus: boolean) => {
    setAnnouncements(prev => prev.map(ann => {
      if (ann.id === id) {
        return { ...ann, isActive: !ann.isActive };
      }
      return ann;
    }));
    onTriggerToast(
      currentStatus 
        ? '✓ تم تعطيل الإعلان وإيقاف بث إشعاراته المباشرة للطلاب.' 
        : '✓ تم تفعيل الإعلان بنجاح وبدء بث التنبيه الفوري به.'
    );
  };

  const handleDeleteAnnouncement = (id: string) => {
    setAnnouncements(prev => prev.filter(ann => ann.id !== id));
    onTriggerToast('🗑️ تم التراجع وحذف الإعلان بشكل تراكمي بنجاح.');
  };

  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formContent.trim()) {
      onTriggerToast('❌ يرجى تعيين عنوان الإعلان ومحتواه العريض.');
      return;
    }

    if (formTarget === 'SpecificCourse' && !selectedCourseId) {
      onTriggerToast('❌ يرجى تحديد المقرر المعرفي المستهدف بالإعلان.');
      return;
    }

    setIsPublishing(true);

    // Dynamic checks
    let matchedCourseTitle = '';
    if (formTarget === 'SpecificCourse') {
      const course = COURSES.find(c => c.id === selectedCourseId);
      matchedCourseTitle = course ? course.title : 'دورة مخصصة';
    }

    setTimeout(() => {
      const newAnn: Announcement = {
        id: 'ann-' + Date.now(),
        title: formTitle,
        content: formContent,
        targetAudience: formTarget,
        courseId: formTarget === 'SpecificCourse' ? selectedCourseId : undefined,
        courseTitle: formTarget === 'SpecificCourse' ? matchedCourseTitle : undefined,
        date: new Date().toISOString().split('T')[0]!,
        isActive: true
      };

      setAnnouncements([newAnn, ...announcements]);
      
      // Reset
      setFormTitle('');
      setFormContent('');
      setFormTarget('Everyone');
      setSelectedCourseId('');
      setIsPublishing(false);
      
      onTriggerToast('🚀 تم نشر الإعلان وبث الإشعار اللحظي للمستخدمين بالتزامن مع ملقم .NET ☁️');
    }, 1200);
  };

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
            <h4 className="font-extrabold text-[#962D15] text-xs sm:text-sm font-serif">صياغة إعلان جديد وبثه</h4>
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
                onChange={(e) => setFormTarget(e.target.value as any)}
                className="w-full bg-stone-50 text-stone-900 text-xs py-3 px-3 rounded-xl border border-amber-200 focus:outline-none"
              >
                <option value="Everyone">الجميع (كافة الزوار، الطلاب، والمدرسين)</option>
                <option value="Students">الطلاب والأعضاء الدارسين فقط</option>
                <option value="Instructors">أعضاء هيئة التدريس والتحقيق فقط</option>
                <option value="SpecificCourse">مقرر دراسي بعينه ومستنداته</option>
              </select>
            </div>

            {/* CONDITIONAL RENDERING: Watch Target Audience and display course list dynamically! */}
            {formTarget === 'SpecificCourse' && (
              <div className="space-y-1 bg-amber-50/40 p-3 rounded-xl border border-amber-200/50 animate-slide-down">
                <label className="text-xs font-bold text-stone-700 block">اختر المقرر الدراسي المستهدف شرفياً</label>
                <select
                  required
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                  className="w-full bg-white text-stone-900 text-xs py-2 px-2.5 rounded-lg border border-amber-200 focus:outline-none"
                >
                  <option value="">-- يرجى اختيار المقرر المعني بالإشعار --</option>
                  {COURSES.map(course => (
                    <option key={course.id} value={course.id}>{course.title}</option>
                  ))}
                </select>
              </div>
            )}

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
              disabled={isPublishing}
              className={`w-full bg-orange-700 hover:bg-orange-800 text-white font-black py-3 px-5 rounded-xl text-xs sm:text-sm transition shadow-md border-0 cursor-pointer flex items-center justify-center gap-2 ${
                isPublishing ? 'opacity-80' : ''
              }`}
            >
              {isPublishing ? (
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
                <option value="SpecificCourse">الحلقات الخاصة</option>
              </select>
            </div>
          </div>

          {/* List Renderer */}
          {(() => {
            const filtered = announcements.filter(ann => {
              if (filterAudience === 'all') return true;
              return ann.targetAudience === filterAudience;
            });

            if (filtered.length === 0) {
              return (
                <div className="bg-white border rounded-2xl p-16 text-center text-stone-400 border-dashed border-stone-200">
                  <Megaphone className="w-12 h-12 text-stone-300 mx-auto stroke-[1.5] mb-2" />
                  <p className="text-xs font-bold text-stone-500">لا توجد إعلانات نشطة ومستهدفة حالياً لجمهور التصفية الحالي.</p>
                </div>
              );
            }

            return (
              <div className="space-y-4">
                {filtered.map((ann) => (
                  <div 
                    key={ann.id} 
                    className={`bg-white border rounded-2xl p-4 sm:p-5 shadow-3xs hover:border-amber-200 transition-all ${
                      ann.isActive ? 'border-amber-200/85' : 'border-stone-200 opacity-65 bg-stone-50/40'
                    }`}
                  >
                    <div className="space-y-3">
                      
                      {/* Badge header strip */}
                      <div className="flex flex-wrap items-center justify-between gap-2.5">
                        <div className="flex items-center gap-2">
                          
                          {/* Target Audience indicator badges */}
                          {ann.targetAudience === 'Everyone' && (
                            <span className="bg-orange-100 text-orange-950 text-[9px] px-2 py-0.5 rounded font-black flex items-center gap-1">
                              <Users className="w-3 h-3 text-orange-700" />
                              <span>الجميع</span>
                            </span>
                          )}

                          {ann.targetAudience === 'Students' && (
                            <span className="bg-blue-105 bg-blue-100 text-blue-950 text-[9px] px-2 py-0.5 rounded font-black flex items-center gap-1">
                              <Users className="w-3 h-3 text-blue-700" />
                              <span>الطلاب فقط</span>
                            </span>
                          )}

                          {ann.targetAudience === 'Instructors' && (
                            <span className="bg-rose-100 text-rose-950 text-[9px] px-2 py-0.5 rounded font-black flex items-center gap-1">
                              <Users className="w-3 h-3 text-rose-700" />
                              <span>المدرسين والأكاديميين</span>
                            </span>
                          )}

                          {ann.targetAudience === 'SpecificCourse' && (
                            <span className="bg-amber-100 text-[#962D15] text-[9px] px-2 py-0.5 rounded font-black flex items-center gap-1" title={ann.courseTitle}>
                              <BookOpen className="w-3 h-3 text-brand-orange" />
                              <span>طلاب مادة مخصصة</span>
                            </span>
                          )}

                          {ann.isActive ? (
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
                          <span>تاريخ البث: {ann.date}</span>
                        </span>
                      </div>

                      {/* Content block */}
                      <div className="space-y-1 text-right">
                        <h5 className="font-extrabold text-stone-900 text-xs sm:text-sm font-sans flex items-center gap-1">
                          <Volume2 className="w-4 h-4 text-orange-700" />
                          <span>{ann.title}</span>
                        </h5>
                        
                        {ann.courseTitle && (
                          <span className="text-[10px] text-[#962D15] font-semibold block pr-4">
                            * مستهدف خصيصاً: "{ann.courseTitle}"
                          </span>
                        )}

                        <p className="text-xs text-stone-600 leading-relaxed font-light mt-1 whitespace-pre-line pl-2">
                          {ann.content}
                        </p>
                      </div>

                      {/* Divider actions footer */}
                      <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                        
                        {/* Toggle Active status using buttons mapped to Switch concept */}
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-stone-400 font-bold">بث الإشعار:</span>
                          <button
                            onClick={() => handleToggleActive(ann.id, ann.isActive)}
                            className="bg-transparent border-0 cursor-pointer p-0 shrink-0"
                            title="تبديل حالة النشاط للبث"
                          >
                            {ann.isActive ? (
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
                ))}
              </div>
            );
          })()}

        </div>

      </div>

    </div>
  );
}
