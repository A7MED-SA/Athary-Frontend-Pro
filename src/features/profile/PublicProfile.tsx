import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { publicService } from '../public/services/public.service';
import { useAppContext } from '../../providers/AppProvider';
import { DashboardSkeleton } from '../../components/shared/Skeleton';
import { ErrorFallback } from '../../components/shared/ErrorFallback';
import {
  Award,
  MapPin,
  Calendar,
  UserCheck,
  MessageCircle,
  BookOpen,
  ChevronLeft,
  Share2,
} from 'lucide-react';

export default function PublicProfile() {
  const { name: slug } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn, displayToast } = useAppContext();
  const [isCopied, setIsCopied] = useState(false);

  const profileQuery = useQuery({
    queryKey: ['public-profile', slug],
    queryFn: () => publicService.getPublicProfile(slug!),
    enabled: !!slug,
  });

  const coursesQuery = useQuery({
    queryKey: ['public-courses', profileQuery.data?.data?.id],
    queryFn: () => publicService.getPublicCourses(profileQuery.data!.data!.id),
    enabled: !!profileQuery.data?.data?.id,
  });

  if (profileQuery.isLoading) return <div className="min-h-screen flex items-center justify-center"><DashboardSkeleton /></div>;
  if (profileQuery.error) return <div className="min-h-screen flex items-center justify-center"><ErrorFallback onRetry={() => profileQuery.refetch()} /></div>;

  const profile = profileQuery.data?.data;
  const courses = coursesQuery.data?.data ?? [];

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-stone-500 text-sm">الملف غير موجود</p>
      </div>
    );
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-right font-sans pb-24 selection:bg-orange-200 selection:text-orange-950 text-[var(--color-foreground)] transition-colors duration-350" dir="rtl">

      {/* Top Bar */}
      <div className="bg-[var(--color-brand-orange-700)] text-stone-50 py-3 px-4 sticky top-0 z-40 shadow-md flex items-center justify-between text-xs border-b border-[var(--color-brand-orange-850)]">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-extrabold text-[11px] sm:text-xs">الملف العام للمدرّس</span>
        </div>
      </div>

      {/* Actions Bar */}
      <div className="max-w-4xl mx-auto px-4 pt-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto bg-[var(--color-card)] hover:bg-[var(--color-stone-100-val)] text-[var(--color-brand-orange-700)] dark:text-orange-400 font-black text-xs py-2.5 px-5 rounded-xl border border-[var(--color-border)] transition duration-150 flex items-center justify-center gap-2 cursor-pointer shadow-xs shrink-0"
          >
            <ChevronLeft className="w-4 h-4 rotate-180" />
            <span>العودة</span>
          </button>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              onClick={handleCopyLink}
              className="flex-1 sm:flex-initial bg-[var(--color-card)] hover:bg-[var(--color-stone-100-val)] text-[var(--color-foreground)] font-bold text-xs py-2.5 px-4 rounded-xl border border-[var(--color-border)] transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Share2 className="w-3.5 h-3.5 text-[var(--color-brand-orange-700)]" />
              <span>{isCopied ? 'تم نسخ الرابط!' : 'مشاركة'}</span>
            </button>

            {isLoggedIn && (
              <button
                onClick={() => navigate('/dashboard')}
                className="flex-1 sm:flex-initial bg-[var(--color-brand-orange-700)] hover:bg-[var(--color-brand-orange-850)] text-stone-50 text-xs font-black py-2.5 px-5 rounded-xl border-0 cursor-pointer flex items-center justify-center gap-1.5 shadow-md transition-all hover:scale-[1.02]"
              >
                <MessageCircle className="w-4 h-4" />
                <span>مراسلة</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 space-y-8">

        {/* Profile Card */}
        <div className="bg-[var(--color-card)] rounded-3xl p-6 sm:p-8 border border-[var(--color-border)] shadow-md relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--color-brand-orange-50)]/30 rounded-bl-full pointer-events-none" />

          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
            <div className="relative shrink-0">
              <div className="absolute -inset-1 bg-gradient-to-tr from-[var(--color-brand-orange-700)] to-[var(--color-primary)] rounded-full blur-xs opacity-75" />
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-[var(--color-card)] bg-[var(--color-stone-100-val)] shadow-md overflow-hidden">
                <img
                  src={profile.profileImageUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                  alt={profile.fullName || 'المدرّس'}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="absolute bottom-1 right-2 bg-emerald-500 border-2 border-[var(--color-card)] w-4.5 h-4.5 rounded-full" />
            </div>

            <div className="space-y-4 text-center md:text-right flex-1">
              <div className="flex flex-col sm:flex-row justify-center md:justify-start items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-black text-[var(--color-foreground)] font-serif tracking-tight">
                  {profile.fullName || 'م. غير معروف'}
                </h1>
                <span className="bg-[var(--color-brand-orange-100)] text-[var(--color-brand-orange-750)] text-[10px] font-black px-3 py-1 rounded-full border border-[var(--color-brand-orange-50)] flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" />
                  <span>عضو هيئة التدريس</span>
                </span>
              </div>

              <div className="flex flex-wrap justify-center md:justify-start items-center gap-y-2.5 gap-x-4 text-[var(--color-stone-600-val)] text-xs font-semibold">
                {profile.nationality && (
                  <span className="flex items-center gap-1 bg-[var(--color-stone-100-val)] border border-[var(--color-border)] py-1 px-2.5 rounded-lg">
                    <MapPin className="w-3.5 h-3.5 text-[var(--color-brand-orange-700)]" />
                    <span>{profile.nationality}</span>
                  </span>
                )}
                <span className="flex items-center gap-1 bg-[var(--color-stone-100-val)] border border-[var(--color-border)] py-1 px-2.5 rounded-lg">
                  <Calendar className="w-3.5 h-3.5 text-[var(--color-brand-orange-700)]" />
                  <span>تاريخ الالتحاق: {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString('ar-EG') : 'غير معروف'}</span>
                </span>
                <span className="flex items-center gap-1 bg-[var(--color-stone-100-val)] border border-[var(--color-border)] py-1 px-2.5 rounded-lg">
                  <UserCheck className="w-3.5 h-3.5 text-[var(--color-brand-orange-700)]" />
                  <span>سند معتمد بالمنصة</span>
                </span>
              </div>

              {profile.bio && (
                <p className="text-xs sm:text-sm text-[var(--color-stone-700-val)] leading-relaxed font-light pt-2 max-w-2xl text-center md:text-right">
                  {profile.bio}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Courses */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-2">
            <h3 className="text-sm sm:text-base font-black text-[var(--color-foreground)] font-serif flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[var(--color-brand-orange-700)]" />
              <span>المناهج المنشورة</span>
            </h3>
            <span className="text-[11px] text-[var(--color-stone-500-val)] font-medium">({courses.length} مقررات)</span>
          </div>

          {coursesQuery.isLoading ? (
            <div className="text-center py-10"><DashboardSkeleton /></div>
          ) : courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {courses.map((c) => (
                <div
                  key={c.id}
                  className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition duration-300 flex flex-col justify-between"
                >
                  <div className="relative h-36 bg-[var(--color-stone-100-val)]">
                    <img
                      src={c.courseImageUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300'}
                      alt={c.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="p-4 text-right flex-1 space-y-3 flex flex-col justify-between">
                    <div className="space-y-1">
                      <h4 className="text-xs font-black text-[var(--color-foreground)] leading-snug hover:text-[var(--color-brand-orange-700)] transition line-clamp-2">
                        {c.title}
                      </h4>
                      <p className="text-[9.5px] text-[var(--color-stone-500-val)] font-light flex items-center justify-start gap-2 pt-1 font-mono">
                        <span>{c.enrollmentCount} دارس</span>
                        <span>•</span>
                        <span>{c.averageRating.toFixed(1)} ★</span>
                      </p>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-[var(--color-border)]">
                      <span className="font-black text-xs text-[var(--color-foreground)] font-mono">
                        {c.price === 0 ? 'مجاني' : `${c.price} ر.س`}
                      </span>
                      <button
                        onClick={() => navigate(`/course/${c.id}`)}
                        className="bg-[var(--color-stone-105)] hover:bg-[var(--color-stone-100-val)] text-[var(--color-brand-orange-700)] dark:text-orange-400 text-[10.5px] font-black py-1 px-3 rounded-lg border border-[var(--color-border)] transition flex items-center gap-1 cursor-pointer"
                      >
                        <span>عرض المنهج</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-[var(--color-card)] rounded-2xl border border-dashed border-[var(--color-border)]">
              <p className="text-xs text-[var(--color-stone-550)] font-bold">لا توجد مقررات مدرجة حالياً.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
