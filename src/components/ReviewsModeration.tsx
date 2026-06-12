import React, { useState } from 'react';
import { 
  Star, 
  Flag, 
  CheckCircle, 
  XCircle, 
  MessageSquare, 
  User, 
  BookOpen, 
  AlertTriangle, 
  Trash2, 
  Sparkles, 
  ThumbsUp, 
  Calendar,
  X
} from 'lucide-react';

interface FlaggedReview {
  id: string;
  studentName: string;
  studentEmail: string;
  courseName: string;
  reviewText: string;
  rating: number;
  date: string;
  flagReason: string;
  reporterName: string;
  reporterRole: string;
}

interface ReviewsModerationProps {
  onTriggerToast: (msg: string) => void;
}

export default function ReviewsModeration({ onTriggerToast }: ReviewsModerationProps) {
  const [activeTab, setActiveTab] = useState<'moderation' | 'student-write'>('moderation');
  
  // Flagged reviews initial mock database
  const [flaggedReviews, setFlaggedReviews] = useState<FlaggedReview[]>([
    {
      id: 'rev-301',
      studentName: 'عبد الرحمن السديري',
      studentEmail: 'a.sudairy@example.com',
      courseName: 'علم المخطوطات والتحقيق الأثري والترميم',
      reviewText: 'دورة سيئة جداً ولا تعطي أي معلومة مفيدة، الأستاذ لا يجيب على الأسئلة ويبدو غير ملم بالموضوع، كأنها مضيعة للوقت والمال ولا أنصح بها أحداً.',
      rating: 1,
      date: '2026-06-11',
      flagReason: 'أسلوب هجومي مبالغ فيه ولا يلتزم بأدب النقد العلمي البناء التراثي.',
      reporterName: 'د. فريد الحربي',
      reporterRole: 'مدرب الدورة'
    },
    {
      id: 'rev-302',
      studentName: 'سمر بنت تركي السهلي',
      studentEmail: 'samar.turki@example.com',
      courseName: 'الخط العربي والزخرفة الإسلامية الكلاسيكية',
      reviewText: 'المقرر رائع ولكن جودة البث الصوتي كانت ضعيفة وتتقطع كل خمس دقائق مما تسبب في ضياع الشرح، أرجو إصلاح السيرفرات لأعطيكم خمس نجوم.',
      rating: 3,
      date: '2026-06-10',
      flagReason: 'طلب صيانة فنية مكرر في غير مكانه المخصص وتم تحويله للدعم التقني.',
      reporterName: 'م. خالد مشرف المراقبة',
      reporterRole: 'مشرف جودة'
    },
    {
      id: 'rev-303',
      studentName: 'فيصل بن غازي العتيبي',
      studentEmail: 'f.ghazi@example.com',
      courseName: 'روائع البلاغة العربية ونظم النثر الأدبي',
      reviewText: 'يا جماعة سجلوا في أكاديمية البديل للتطوير كود الخصم هو ALBADIL90 يعطون إجازات بدقائق وبسعر أرخص بكثير ومضمون!',
      rating: 5,
      date: '2026-06-08',
      flagReason: 'ترويج إعلاني تجاري لجهات ومنافسين خارجيين واستخدام روابط مشبوهة.',
      reporterName: 'نظام الحماية والذكاء',
      reporterRole: 'فحص آلي آثاري'
    },
    {
      id: 'rev-304',
      studentName: 'منيرة عبد الله القحطاني',
      studentEmail: 'munira.a@example.com',
      courseName: 'العمارة الإسلامية والتصميم التراثي وتطوره عبر القرون',
      reviewText: 'لقد قمت بتحميل بعض الكتب المرفقة وأجدها مسروقة من أبحاث دكتور معين دون الإشارة للمصدر، هذه سرقة علمية صارخة يجب توضيحها.',
      rating: 2,
      date: '2026-06-05',
      flagReason: 'اتهام مباشر وسرقة علمية يحتاج فحص وتحقق من قبل اللجنة العليا والتدريسيين.',
      reporterName: 'أ. فاطمة الهاشمي',
      reporterRole: 'مقيّم خارجي للبحث'
    }
  ]);

  // Student Review Writing state
  const [selectedCourse, setSelectedCourse] = useState<string>('علم المخطوطات والتحقيق الأثري والترميم');
  const [studentRating, setStudentRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [reviewContent, setReviewContent] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  // Moderation Action state
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteReason, setDeleteReason] = useState<string>('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);

  // Profile Viewer Modal
  const [selectedReporter, setSelectedReporter] = useState<{ name: string; role: string; email: string } | null>(null);

  // Handle Review Submission
  const handlePublishReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewContent.trim()) {
      onTriggerToast('❌ يرجى كتابة نص المراجعة أولاً.');
      return;
    }
    if (reviewContent.length < 15) {
      onTriggerToast('❌ يجب ألا تقل المراجعة عن ١٥ حرفاً لضمان الجدية والأمانة العلمية.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      onTriggerToast(`🎉 تم نشر مراجعتك بنجاح لدورة: "${selectedCourse}"! جاري فحصها لتوافق شروط النشر.`);
      setReviewContent('');
      setStudentRating(5);
      setIsSubmitting(false);
      // Swaps to moderation view to let them see the system reactive updates
      setActiveTab('moderation');
    }, 1200);
  };

  // Accept flagged review (keep it, dismiss the flag)
  const handleAcceptReview = (id: string, name: string) => {
    setFlaggedReviews(prev => prev.filter(r => r.id !== id));
    onTriggerToast(`✓ تم قبول المراجعة وإلغاء البلاغ المرفوع ضد الدارس: "${name}" بنجاح.`);
  };

  // Reject/Delete flagged review
  const handleOpenDeleteDialog = (id: string) => {
    setDeletingId(id);
    setDeleteReason('');
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!deleteReason.trim()) {
      onTriggerToast('❌ يرجى توضيح سبب الرفض أو الحذف للإعتماد البرمجي.');
      return;
    }
    
    setFlaggedReviews(prev => prev.filter(r => r.id !== deletingId));
    setIsDeleteDialogOpen(false);
    setDeletingId(null);
    onTriggerToast(`🗑️ تم وسم وحذف المراجعة وإرسال قرار الرفض آلياً لبريد الطالب مع التبرير.`);
  };

  return (
    <div className="bg-amber-50/40 rounded-3xl border border-amber-200/90 p-4 sm:p-6 text-right font-sans" dir="rtl" id="reviews-moderation-component">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-amber-200/60 pb-5 mb-6">
        <div>
          <h2 className="text-base sm:text-xl font-black text-[#962D15] font-serif flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-orange-700" />
            <span>نظام مراجعة وتعديل التقييمات العلمية</span>
          </h2>
          <p className="text-[11px] sm:text-xs text-stone-550 mt-1 max-w-xl">
            إدارة موازين التقييم التي يطرحها الطلاب، وضبط ورصد مراجعات الدارسين للتأكد من موافقتها لميثاق النقد الأثري الرصين بالبوابة.
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex bg-stone-100 p-1.5 rounded-xl border border-stone-200 self-start">
          <button
            onClick={() => setActiveTab('moderation')}
            className={`px-4 py-2 rounded-lg text-xs font-black transition cursor-pointer border-0 ${
              activeTab === 'moderation' 
                ? 'bg-orange-700 text-white shadow-xs' 
                : 'text-stone-605 hover:bg-stone-200'
            }`}
          >
            صف المشرف (التقييمات المبلغ عنها)
          </button>
          
          <button
            onClick={() => setActiveTab('student-write')}
            className={`px-4 py-2 rounded-lg text-xs font-black transition cursor-pointer border-0 ${
              activeTab === 'student-write' 
                ? 'bg-orange-700 text-white shadow-xs' 
                : 'text-stone-605 hover:bg-stone-200'
            }`}
          >
            صفة الطالب (كتابة تقييم)
          </button>
        </div>
      </div>

      {/* VIEW 1: SUPERVISOR MODERATION QUEUE */}
      {activeTab === 'moderation' && (
        <div className="space-y-6">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[#962D15]/5 p-4 rounded-2xl border border-orange-700/15">
            <div className="space-y-1">
              <h3 className="font-extrabold text-xs sm:text-sm text-[#962D15] flex items-center gap-1.5">
                <AlertTriangle className="w-4.5 h-4.5" />
                <span>طابور المراجعة والتحويل الفوري</span>
              </h3>
              <p className="text-[11px] text-stone-600">
                يقوم المشرفون بفحص التبليغات المرفوعة ضد كلمات التقييم المريبة، والتأكد من مطابقتها للقواعد التراثية.
              </p>
            </div>
            
            <div className="bg-orange-700/10 text-orange-950 font-black text-xs px-3.5 py-1.5 rounded-full border border-orange-700/30">
              {flaggedReviews.length} مراجعات قيد المراجعة الفورية ⏳
            </div>
          </div>

          {flaggedReviews.length === 0 ? (
            <div className="bg-white border text-center p-16 rounded-2xl border-dashed border-amber-300">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-stone-900 text-sm">طابور البلاغات فارغ تماماً!</h4>
              <p className="text-xs text-stone-550 max-w-sm mx-auto leading-relaxed mt-1">
                كافة تقييمات الطلاب والدارسين بنسختها الحالية مصدقة ومستوفية لشروط الرقي المعرفي والدعم البناء.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {flaggedReviews.map((rev) => (
                <div key={rev.id} className="bg-white border border-stone-200 rounded-2xl p-4 sm:p-5 shadow-2xs relative flex flex-col md:flex-row md:items-start gap-5 transition hover:shadow-xs">
                  
                  {/* Left stats & info */}
                  <div className="flex-1 space-y-3">
                    
                    {/* Header line */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-2.5">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-stone-100 text-stone-755 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-black text-xs sm:text-xs text-stone-900 leading-tight">الدارس: {rev.studentName}</h4>
                          <span className="text-[9px] text-stone-400 font-mono block">{rev.studentEmail}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg text-[10px] text-stone-500 font-semibold">
                        <BookOpen className="w-3.5 h-3.5 text-orange-700" />
                        <span>مقرر: {rev.courseName}</span>
                      </div>
                    </div>

                    {/* Stars and comment */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-4 h-4 ${
                              i < rev.rating ? 'text-amber-500 fill-current' : 'text-stone-200'
                            }`} 
                          />
                        ))}
                        <span className="text-[10px] text-stone-400 font-sans mr-1">({rev.rating}/5 نجوم)</span>
                        <span className="text-[10px] text-stone-400 mr-2 font-mono flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>تاريخ التقييم: {rev.date}</span>
                        </span>
                      </div>

                      <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200/60 text-xs text-stone-700 leading-relaxed font-light quote">
                        "{rev.reviewText}"
                      </div>
                    </div>

                    {/* Flag report source */}
                    <div className="bg-red-50/50 border border-red-200/50 rounded-xl p-3 flex items-start sm:items-center justify-between gap-3 text-red-950">
                      <div className="space-y-0.5 text-right text-[10px] sm:text-xs">
                        <span className="font-extrabold text-[#962D15] flex items-center gap-1">
                          <Flag className="w-3.5 h-3.5" />
                          <span>سبب التبليغ والاستئناف: {rev.flagReason}</span>
                        </span>
                        <p className="text-[10px] text-stone-550 italic pr-4 mt-0.5">* أثار البلاغ: {rev.reporterName} ({rev.reporterRole})</p>
                      </div>

                      <button
                        onClick={() => setSelectedReporter({ name: rev.reporterName, role: rev.reporterRole, email: 'reporter@athary.edu.sa' })}
                        className="bg-transparent hover:underline text-orange-755 font-black text-[10px] whitespace-nowrap cursor-pointer border-0 shrink-0"
                      >
                        عرض الملف التعريفي للمبلغ ←
                      </button>
                    </div>

                  </div>

                  {/* Right Actions */}
                  <div className="flex flex-row md:flex-col gap-2 shrink-0 md:w-44 justify-end md:justify-start border-t md:border-t-0 md:border-r border-stone-100 pt-3 md:pt-0 md:pr-4">
                    <button
                      onClick={() => handleAcceptReview(rev.id, rev.studentName)}
                      className="flex-1 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 font-extrabold text-[11px] py-2 px-3 rounded-xl cursor-pointer transition flex items-center justify-center gap-1.5"
                      title="السماح بنشر المراجعة ورفض البلاغ"
                    >
                      <CheckCircle className="w-4 h-4 text-emerald-700" />
                      <span>قبول ومطابقة المراجعة</span>
                    </button>

                    <button
                      onClick={() => handleOpenDeleteDialog(rev.id)}
                      className="flex-1 bg-red-50 hover:bg-red-100 border border-red-300 text-red-800 font-extrabold text-[11px] py-2 px-3 rounded-xl cursor-pointer transition flex items-center justify-center gap-1.5"
                      title="حذف المراجعة وإخطار الطالب"
                    >
                      <XCircle className="w-4 h-4 text-red-700" />
                      <span>حذف ووسم المراجعة</span>
                    </button>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: STUDENT REVIEW WRITING EXPERIMENTAL BOARD */}
      {activeTab === 'student-write' && (
        <form onSubmit={handlePublishReview} className="max-w-xl mx-auto space-y-5 bg-white border border-amber-250 p-5 sm:p-6 rounded-3xl shadow-sm text-right">
          
          <div className="border-b border-stone-150 pb-3">
            <h3 className="font-extrabold text-sm sm:text-base text-stone-900 flex items-center gap-1.5 font-serif">
              <Sparkles className="w-5 h-5 text-amber-500 fill-current" />
              <span>قيّم دورة ومسار من السجل الدراسي</span>
            </h3>
            <p className="text-[11px] text-stone-500 mt-0.5">
              شارك الباحثين والمعلمين تقييمك لمضمون الشرح ووضوح الصوت والخبرة الإدراكية بالمسار الحائز.
            </p>
          </div>

          {/* Course select dropdown */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-700 block">اختر المقرر الدراسي المراد تقديم مراجعته</label>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="w-full bg-stone-50 text-stone-900 text-xs py-3 px-3.5 rounded-xl border border-amber-200 focus:outline-none"
            >
              <option value="علم المخطوطات والتحقيق الأثري والترميم">علم المخطوطات والتحقيق الأثري والترميم</option>
              <option value="الخط العربي والزخرفة الإسلامية الكلاسيكية">الخط العربي والزخرفة الإسلامية الكلاسيكية</option>
              <option value="روائع البلاغة العربية ونظم النثر الأدبي">روائع البلاغة العربية ونظم النثر الأدبي</option>
              <option value="العمارة الإسلامية والتصميم التراثي وتطوره عبر القرون">العمارة الإسلامية والتصميم التراثي وتطوره عبر القرون</option>
            </select>
          </div>

          {/* Interactive Star component */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-stone-700 block">منح ختم التقييم بالنجوم الشرفية</label>
            <div className="flex items-center gap-2 bg-amber-50/30 p-3 border border-amber-200/50 rounded-2xl w-fit">
              <div className="flex items-center gap-1.5">
                {Array.from({ length: 5 }).map((_, i) => {
                  const starVal = i + 1;
                  const isGold = (hoverRating || studentRating) >= starVal;
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setStudentRating(starVal)}
                      onMouseEnter={() => setHoverRating(starVal)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1 hover:scale-110 active:scale-95 transition bg-transparent border-0 cursor-pointer"
                      title={`${starVal} نجوم`}
                    >
                      <Star 
                        className={`w-7 h-7 transition-colors duration-150 ${
                          isGold ? 'text-amber-500 fill-current' : 'text-stone-200'
                        }`} 
                      />
                    </button>
                  );
                })}
              </div>
              <span className="text-xs font-black text-stone-650 px-2">
                {studentRating === 5 && '🌟 متميز وفاق الإعجاب'}
                {studentRating === 4 && '👍 جيد ومثري جداً'}
                {studentRating === 3 && '👌 مقبول وبحاجة لبعض الإضافات'}
                {studentRating === 2 && '⚠️ متواضع ويحتاج تنظيم وتطوير'}
                {studentRating === 1 && '🛑 ضعيف ولا يستحق الانتساب'}
              </span>
            </div>
          </div>

          {/* Textarea review */}
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-stone-700 block">اكتب تجربتك الصريحة مع الدورة والمدرب</label>
              <span className="text-[10px] text-stone-400 font-mono italic">{reviewContent.length} / 500 حرف</span>
            </div>

            <textarea
              required
              rows={5}
              maxLength={500}
              value={reviewContent}
              onChange={(e) => setReviewContent(e.target.value)}
              placeholder="نشكر لك أمانتك المعرفية. يرجى ذكر انطباعك عن مهارة التدريسي وتصاميم الهوغرافيا والخط والخرائط ومستوى الإفادة الأثرية بالشهادة..."
              className="w-full bg-stone-50 text-stone-900 text-xs py-3 px-4 rounded-xl border border-amber-200 focus:outline-none focus:ring-1 focus:ring-orange-700 leading-relaxed font-light"
            />
          </div>

          <div className="bg-red-55/10 rounded-xl p-3 border border-orange-200 text-stone-700 text-[10px] sm:text-[11px] leading-relaxed">
            <strong className="text-[#962D15] block">📌 ميثاق الأمنية العلمية والمراقبة:</strong>
            سيتم إخضاع المراجعة لبلايست النقد المعياري والذكاء الآلي للتأكد من خلوه من التعدي اللفظي أو إعلانات الويب المشبوهة لمنع تفتيت النقد الهادف.
          </div>

          {/* Submit */}
          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`bg-orange-700 hover:bg-orange-850 text-white font-black py-3 px-8 rounded-xl text-xs sm:text-sm transition shadow-md border-0 cursor-pointer flex items-center justify-center gap-1.5 ${
                isSubmitting ? 'opacity-80 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>جاري تسجيل ونشر المراجعة الموقرة...</span>
                </>
              ) : (
                <>
                  <ThumbsUp className="w-4 h-4" />
                  <span>تأكيد المراجعة ونشر التقييم المعياري</span>
                </>
              )}
            </button>
          </div>

        </form>
      )}

      {/* 🛑 DELETION EXPLAIN DIALOG MODAL */}
      {isDeleteDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-xs" onClick={() => setIsDeleteDialogOpen(false)} />
          <div className="bg-white rounded-3xl border border-red-200 p-6 shadow-2xl relative max-w-md w-full text-right z-10 animate-scale-up">
            
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-red-50 text-red-700 rounded-xl flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-stone-900">تبرير حذف المراجعة وتنبيه الطالب</h4>
                <p className="text-[10px] text-stone-400">إلزامية كتابة التبرير لمنع العشوائية الإدارية</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700 block">سبب الرفض والمسح (سيرسل بريداً للطالب)</label>
                <textarea
                  required
                  rows={3}
                  value={deleteReason}
                  onChange={(e) => setDeleteReason(e.target.value)}
                  placeholder="مثال: يمنع استخدام كلمات نابية أو الترويج بكود خصم لمقررات تتبع لجهات أخرى بموجب البند ٥ لميثاق الدارسين..."
                  className="w-full bg-stone-50 text-stone-900 text-xs py-2.5 px-3 rounded-lg border border-stone-200 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setIsDeleteDialogOpen(false)}
                  className="bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-200 px-4 py-2 rounded-lg text-xs cursor-pointer"
                >
                  إلغاء التراجع
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="bg-red-750 hover:bg-red-855 bg-red-700 text-white font-black px-4 py-2 rounded-lg text-xs cursor-pointer border-0"
                >
                  تأكيد الإقصاء والحذف النهائي 🛑
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 👁️ REPORTER PROFILE POPUP */}
      {selectedReporter && (
        <div className="fixed inset-0 z-55 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-stone-950/40 backdrop-blur-3xs" onClick={() => setSelectedReporter(null)} />
          <div className="bg-white rounded-2xl border border-amber-200 p-5 shadow-2xl relative max-w-sm w-full text-right z-10 animate-scale-up">
            
            <button 
              onClick={() => setSelectedReporter(null)}
              className="absolute top-4 left-4 p-1 rounded-full hover:bg-stone-100 text-stone-400 border-0 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center space-y-3 pt-2">
              <div className="w-16 h-16 bg-orange-700/15 text-orange-780 font-black text-xs sm:text-sm rounded-full flex items-center justify-center mx-auto">
                <User className="w-7 h-7 text-orange-850" />
              </div>

              <div className="space-y-1">
                <h4 className="font-extrabold text-sm text-stone-900">{selectedReporter.name}</h4>
                <span className="text-[10px] bg-amber-100 text-[#962D15] font-black px-2.5 py-0.5 rounded-full inline-block">
                  {selectedReporter.role}
                </span>
                <p className="text-[10px] text-stone-400 font-mono mt-0.5">{selectedReporter.email}</p>
              </div>

              <p className="text-[11px] text-stone-500 font-light leading-relaxed">
                باحث مصدق مسجل من الهيئة العلمية لآثاري، لديه صلاحية مراجعة القوافي وجودة الحضور وبث البلاغات الفورية للجان شؤون تصفية الحسابات والاجتهاد.
              </p>

              <div className="pt-3 border-t border-stone-100 flex justify-center">
                <button
                  onClick={() => setSelectedReporter(null)}
                  className="bg-orange-700 hover:bg-orange-800 text-white text-[10px] font-black px-5 py-2 rounded-lg cursor-pointer border-0"
                >
                  إغلاق نافذة الملف
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
