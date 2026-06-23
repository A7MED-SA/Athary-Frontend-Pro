import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCourseDetail } from '../common/hooks/useCourses';
import { useCourseReviews } from '../common/hooks/useReview';
import { useCart } from '../common/hooks/useCart';
import { Skeleton } from '@/components/shared/Skeleton';
import { ErrorFallback } from '@/components/shared/ErrorFallback';
import { Star, Users, Clock, BookOpen, Heart, Share2, ChevronDown, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';

export default function CourseDetails() {
  const { courseId: paramCourseId } = useParams();
  const courseId = paramCourseId || '';
  const navigate = useNavigate();
  const { course, relatedCourses, isLoading, error } = useCourseDetail(courseId);
  const { reviews } = useCourseReviews(courseId);
  const { addItem: addToCart } = useCart();
  const [activeAccordion, setActiveAccordion] = useState<number | null>(0);
  const [showShareMenu, setShowShareMenu] = useState(false);

  const handleAddToCart = () => {
    addToCart(courseId, {
      onSuccess: () => toast.success('تمت إضافة الدورة للسلة'),
      onError: () => toast.error('فشل إضافة الدورة للسلة'),
    });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('تم نسخ رابط الدورة');
    setShowShareMenu(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--color-background)] py-10 px-4" dir="rtl">
        <div className="max-w-5xl mx-auto space-y-6">
          <Skeleton className="h-64 w-full rounded-2xl" />
          <Skeleton className="h-8 w-3/4" variant="text" />
          <Skeleton className="h-4 w-1/2" variant="text" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="h-40 rounded-xl" />
            <Skeleton className="h-40 rounded-xl" />
            <Skeleton className="h-40 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-[var(--color-background)] py-10 px-4" dir="rtl">
        <ErrorFallback title="لم يتم العثور على الدورة" message={error?.message || 'الدورة المطلوبة غير موجودة'} onRetry={() => navigate('/catalog')} />
      </div>
    );
  }

  const formatDuration = (minutes: number) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return h > 0 ? `${h} ساعة ${m > 0 ? `${m} دقيقة` : ''}` : `${m} دقيقة`;
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)] font-sans" dir="rtl">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-orange-700 via-orange-800 to-amber-900 text-amber-50 py-16 px-4">
        <div className="absolute inset-0 bg-heritage-pattern opacity-10 pointer-events-none" />
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="flex items-center gap-2 text-amber-200 text-xs mb-4">
            <button onClick={() => navigate('/catalog')} className="hover:text-amber-50 transition">الكتالوج</button>
            <span>/</span>
            <span>{course.categoryName}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black leading-tight">{course.title}</h1>
          <p className="mt-4 text-amber-100 text-sm leading-relaxed max-w-2xl">{course.description}</p>

          <div className="flex flex-wrap items-center gap-4 mt-6 text-sm">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="font-bold">{course.averageRating.toFixed(1)}</span>
            </div>
            <div className="flex items-center gap-1 text-amber-200">
              <Users className="w-4 h-4" />
              <span>{course.enrollmentCount.toLocaleString()} طالب</span>
            </div>
            <div className="flex items-center gap-1 text-amber-200">
              <Clock className="w-4 h-4" />
              <span>{formatDuration(course.totalDurationMinutes)}</span>
            </div>
            <div className="flex items-center gap-1 text-amber-200">
              <BookOpen className="w-4 h-4" />
              <span>{course.sectionCount} أقسام • {course.lessonCount} درس</span>
            </div>
          </div>

          <div className="flex items-center gap-3 mt-6">
            <span className="text-xs bg-amber-500/20 text-amber-200 px-3 py-1 rounded-full">{course.level === 'Beginner' ? 'مبتدئ' : course.level === 'Intermediate' ? 'متوسط' : 'متقدم'}</span>
            <span className="text-xs bg-white/10 text-amber-200 px-3 py-1 rounded-full">{course.language === 'Ar' ? 'عربي' : 'إنجليزي'}</span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Instructor */}
            <div className="bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)] p-6">
              <h3 className="font-bold text-lg mb-4">المدرّب</h3>
              <div className="flex items-center gap-4">
                {course.instructorProfileImageUrl && (
                  <img src={course.instructorProfileImageUrl} alt={course.instructorName} className="w-14 h-14 rounded-full border border-[var(--color-border)]" referrerPolicy="no-referrer" />
                )}
                <div>
                  <p className="font-bold">{course.instructorName}</p>
                  {course.instructorBio && <p className="text-xs text-stone-500 mt-1 leading-relaxed">{course.instructorBio}</p>}
                </div>
              </div>
            </div>

            {/* What you'll learn */}
            {course.learningOutcomes && course.learningOutcomes.length > 0 && (
              <div className="bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)] p-6">
                <h3 className="font-bold text-lg mb-4">ما الذي ستتعلمه</h3>
                <ul className="space-y-2">
                  {course.learningOutcomes.map((outcome, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="text-teal-600 mt-0.5">✓</span>
                      <span>{outcome}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Requirements */}
            {course.requirements && course.requirements.length > 0 && (
              <div className="bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)] p-6">
                <h3 className="font-bold text-lg mb-4">المتطلبات</h3>
                <ul className="space-y-2">
                  {course.requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="text-orange-600 mt-0.5">•</span>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Reviews */}
            <div className="bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)] p-6">
              <h3 className="font-bold text-lg mb-4">تقييمات الطلاب ({reviews?.items?.length || 0})</h3>
              {reviews?.items && reviews.items.length > 0 ? (
                <div className="space-y-4">
                  {reviews.items.map((review) => (
                    <div key={review.id} className="border-b border-[var(--color-border)] pb-4 last:border-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm">{review.studentName}</span>
                          <div className="flex items-center gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-stone-300'}`} />
                            ))}
                          </div>
                        </div>
                        <span className="text-[10px] text-stone-400">{new Date(review.createdAt).toLocaleDateString('ar-SA')}</span>
                      </div>
                      {review.comment && <p className="text-sm text-stone-600">{review.comment}</p>}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-stone-500">لا توجد تقييمات بعد</p>
              )}
            </div>

            {/* Related Courses */}
            {relatedCourses && relatedCourses.length > 0 && (
              <div className="bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)] p-6">
                <h3 className="font-bold text-lg mb-4">دورات ذات صلة</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {relatedCourses.slice(0, 4).map((rc) => (
                    <div key={rc.id} onClick={() => navigate('/course/' + rc.id)} className="flex gap-3 p-3 rounded-xl hover:bg-[var(--color-muted)] cursor-pointer transition">
                      <img src={rc.courseImageUrl || 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=200'} alt={rc.title} className="w-20 h-16 rounded-lg object-cover" referrerPolicy="no-referrer" />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-xs line-clamp-2">{rc.title}</p>
                        <p className="text-[10px] text-stone-500 mt-1">{rc.instructorName}</p>
                        <p className="text-xs font-bold text-orange-700 mt-1">{rc.isFree ? 'مجاناً' : `${rc.price} ر.س`}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)] p-6 sticky top-24">
              {/* Price */}
              <div className="mb-6">
                {course.isFree ? (
                  <span className="text-3xl font-black text-teal-700">مجاناً</span>
                ) : (
                  <span className="text-3xl font-black text-orange-700">{course.price} ر.س</span>
                )}
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <button onClick={handleAddToCart}
                  className="w-full bg-orange-700 hover:bg-orange-800 text-amber-50 font-bold py-3 rounded-xl transition shadow-md flex items-center justify-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  <span>أضف للسلة</span>
                </button>

                <button onClick={() => {}} className="w-full border border-[var(--color-border)] hover:bg-[var(--color-muted)] text-[var(--color-foreground)] font-bold py-3 rounded-xl transition flex items-center justify-center gap-2">
                  <Heart className="w-5 h-5" />
                  <span>أضف للمفضلة</span>
                </button>

                <div className="relative">
                  <button onClick={() => setShowShareMenu(!showShareMenu)} className="w-full border border-[var(--color-border)] hover:bg-[var(--color-muted)] text-[var(--color-foreground)] font-bold py-3 rounded-xl transition flex items-center justify-center gap-2">
                    <Share2 className="w-5 h-5" />
                    <span>مشاركة</span>
                  </button>
                  {showShareMenu && (
                    <div className="absolute bottom-full left-0 right-0 mb-2 bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl shadow-lg p-2">
                      <button onClick={handleShare} className="w-full text-right text-xs p-2 hover:bg-[var(--color-muted)] rounded-lg transition">نسخ الرابط</button>
                    </div>
                  )}
                </div>
              </div>

              {/* Course Info */}
              <div className="mt-6 space-y-3 border-t border-[var(--color-border)] pt-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-stone-500">المستوى</span>
                  <span className="font-bold">{course.level === 'Beginner' ? 'مبتدئ' : course.level === 'Intermediate' ? 'متوسط' : 'متقدم'}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-stone-500">المدة</span>
                  <span className="font-bold">{formatDuration(course.totalDurationMinutes)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-stone-500">الأقسام</span>
                  <span className="font-bold">{course.sectionCount}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-stone-500">الدروس</span>
                  <span className="font-bold">{course.lessonCount}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-stone-500">الطلاب</span>
                  <span className="font-bold">{course.enrollmentCount.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
