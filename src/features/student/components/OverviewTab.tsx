import { useNavigate } from 'react-router-dom';
import { DashboardSkeleton } from '../../../components/shared/Skeleton';
import type { RecentEnrollmentDto } from '../../../types/api/dashboard';
import type { EnrollmentResponseDto } from '../../../types/api/enrollment';
import type { LiveSessionResponseDto } from '../../../types/api/liveSession';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';
import { Check, Play, Smile, Calendar } from 'lucide-react';
import { motion } from 'motion/react';

interface OverviewTabProps {
  isLoading: boolean;
  recentEnrollments: RecentEnrollmentDto[];
  activeEnrollments: EnrollmentResponseDto[];
  completedCount: number;
  inProgressCount: number;
  enrolledCount: number;
  certificatesCount: number;
  liveSessions: LiveSessionResponseDto[];
  isLiveLoading: boolean;
  userName: string;
  onContinueLearning: (enrollment: EnrollmentResponseDto) => void;
  onOpenCourse: (enrollment: EnrollmentResponseDto) => void;
  onJoinLiveSession: () => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { y: 18, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { type: 'spring' as const, stiffness: 260, damping: 22 } },
};

export function OverviewTab({
  isLoading, recentEnrollments, activeEnrollments, completedCount, inProgressCount,
  enrolledCount, certificatesCount, liveSessions, isLiveLoading, userName,
  onContinueLearning, onOpenCourse, onJoinLiveSession,
}: OverviewTabProps) {
  const navigate = useNavigate();

  const chartData = recentEnrollments.map((e) => ({
    name: e.courseTitle,
    'التقدم الحالي (%)': e.progressPercentage,
    progressPercent: e.progressPercentage,
    shortTitle: e.courseTitle.length > 15 ? e.courseTitle.substring(0, 15) + '...' : e.courseTitle,
  }));
  const pieData = [
    { name: 'المسارات المكتملة', value: completedCount, color: '#115e59' },
    { name: 'قيد الدراسة', value: inProgressCount, color: '#c2410c' },
  ].filter((item) => item.value > 0);

  if (isLoading) return <DashboardSkeleton />;
  return (
    <div className="space-y-6" id="overview-tab">
      {recentEnrollments.length > 0 && (
        <section className="bg-gradient-to-l from-orange-700 to-amber-700 text-amber-50 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-md">
          <div className="absolute inset-0 bg-heritage-pattern opacity-[0.08] pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3 flex-1">
              <span className="bg-amber-500 text-stone-950 font-extrabold text-[9px] px-3 py-1 rounded-full uppercase leading-none">متابعة الدرس الأخير</span>
              <h3 className="text-base sm:text-lg font-bold leading-snug">
                {recentEnrollments[0].courseTitle}
              </h3>
              <p className="text-xs text-amber-100/95 font-light">
                آخر وصول: {new Date(recentEnrollments[0].lastAccessedAt).toLocaleDateString('ar-EG')}
              </p>
              <div className="pt-2">
                <div className="flex justify-between items-center text-xs mb-1">
                  <span>التقدم: {recentEnrollments[0].progressPercentage}% مكتمل</span>
                </div>
                <div className="w-full bg-orange-950/40 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-400 h-full" style={{ width: `${recentEnrollments[0].progressPercentage}%` }} />
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                const enrollment = activeEnrollments.find((e) => e.courseId === recentEnrollments[0].courseId);
                if (enrollment) onContinueLearning(enrollment);
              }}
              className="bg-amber-50 hover:bg-amber-100 text-orange-900 font-extrabold px-6 py-4 rounded-xl text-xs transition flex items-center justify-center gap-1.5 self-start md:self-auto shrink-0 shadow-lg"
              id="continue-learning-btn"
            >
              <Play className="w-4 h-4 fill-current ml-[-2px] text-orange-700" />
              <span>متابعة المشاهدة الآن</span>
            </button>
          </div>
        </section>
      )}

      <section className="bg-white rounded-3xl border border-amber-200/80 p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-4 border-b border-amber-100">
          <div>
            <h2 className="text-sm font-bold text-stone-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-orange-700 rounded-full animate-pulse" />
              <span>تحليل الإنجاز والمثابرة العلمية</span>
            </h2>
            <p className="text-[10px] text-stone-500 font-light mt-1">تتبع مرئي حقيقي لتقدمك في المسارات التراثية</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-black bg-teal-50 text-teal-800 border border-teal-200 px-2.5 py-1 rounded-lg">
              المكتملة: {completedCount}
            </span>
            <span className="text-[10px] font-black bg-orange-50 text-orange-700 border border-orange-200 px-2.5 py-1 rounded-lg">
              قيد النهل: {inProgressCount}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-3 bg-stone-50/50 p-4 rounded-2xl border border-stone-100/60">
            <h3 className="text-xs font-bold text-stone-800 text-right">مستوى النهل والتحصيل التفصيلي (%)</h3>
            <div className="h-64 w-full">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eaeaea" />
                    <XAxis dataKey="shortTitle" tick={{ fontSize: 9, fill: '#57534e', fontWeight: 600 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 9, fill: '#78716c' }} domain={[0, 100]} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{ direction: 'rtl', textAlign: 'right', backgroundColor: 'var(--color-card)', border: 'none', borderRadius: '12px', color: 'var(--color-card-foreground)', fontSize: '11px', fontWeight: 'bold', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                      formatter={(value: number) => [`${value}%`, 'التقدم']}
                      labelFormatter={(label: string) => `المسار: ${label}`}
                    />
                    <Bar dataKey="التقدم الحالي (%)" radius={[8, 8, 0, 0]} fill="#c2410c">
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.progressPercent === 100 ? '#115e59' : '#c2410c'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-stone-400">لا توجد بيانات بعد</div>
              )}
            </div>
          </div>

          <div className="space-y-4 bg-stone-50/50 p-4 rounded-2xl border border-stone-100/60 flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-bold text-stone-800 text-right">رصيد التحصيل والأهلية</h3>
              <p className="text-[9px] text-stone-400 leading-none">توزيع الأرصدة الدراسية في مشوارك العلمي</p>
            </div>
            <div className="h-44 w-full relative flex items-center justify-center">
              {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={5} dataKey="value">
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ direction: 'rtl', textAlign: 'right', backgroundColor: 'var(--color-card)', border: 'none', borderRadius: '10px', color: 'var(--color-card-foreground)', fontSize: '10px' }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-stone-400">لا توجد بيانات</div>
              )}
              <div className="absolute inset-x-0 mx-auto flex flex-col items-center justify-center">
                <span className="text-base font-black text-stone-900">{enrolledCount}</span>
                <span className="text-[8px] text-stone-500 font-bold leading-none">إجمالي المسارات</span>
              </div>
            </div>
            <div className="space-y-1.5">
              {pieData.map((entry, i) => (
                <div key={i} className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: entry.color }} />
                    <span className="text-stone-700 font-semibold">{entry.name}</span>
                  </div>
                  <span className="font-bold text-stone-900">
                    {entry.value} مسار ({enrolledCount > 0 ? ((entry.value / enrolledCount) * 100).toFixed(0) : 0}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-bold text-stone-900 pr-1">مقرراتي المفعلة</h2>
        <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {activeEnrollments.map((enrollment) => (
            <motion.div
              key={enrollment.id}
              variants={itemVariants}
              className="bg-white rounded-2xl p-5 border border-amber-200/60 shadow-sm flex flex-col justify-between hover:border-amber-300 transition duration-150"
            >
              <div className="flex gap-4 items-start pb-4 border-b border-amber-50">
                {enrollment.courseImageUrl && (
                  <img src={enrollment.courseImageUrl} alt={enrollment.courseTitle} className="w-16 h-16 rounded-xl object-cover border border-amber-100" referrerPolicy="no-referrer" />
                )}
                <div className="space-y-1 py-0.5 text-right flex-1">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${enrollment.status === 'Completed' ? 'bg-teal-50 text-teal-700' : 'bg-orange-50 text-orange-700'}`}>
                    {enrollment.status === 'Completed' ? 'مكتمل' : 'قيد الدراسة'}
                  </span>
                  <h4 className="font-bold text-xs text-stone-900 leading-tight line-clamp-2 mt-1">{enrollment.courseTitle}</h4>
                </div>
              </div>
              <div className="pt-4 space-y-3">
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-[11px] text-stone-500">
                    <span>التقدم: {enrollment.progressPercentage}% مكتمل</span>
                    <span>{enrollment.studentName}</span>
                  </div>
                  <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-orange-700 h-full transition-all duration-500" style={{ width: `${enrollment.progressPercentage}%` }} />
                  </div>
                </div>
                <div className="flex justify-between items-center pt-2">
                  {enrollment.status === 'Completed' ? (
                    <span className="flex items-center gap-1.5 text-xs text-teal-700 font-extrabold pr-1">
                      <Check className="w-4 h-4" />
                      <span>مكتمل! اطلب الإجازة</span>
                    </span>
                  ) : (
                    <span className="text-[10px] text-stone-500 font-light truncate max-w-[160px]" title={enrollment.lastAccessedAt ? `آخر وصول: ${new Date(enrollment.lastAccessedAt).toLocaleDateString('ar-EG')}` : undefined}>
                      آخر وصول: {enrollment.lastAccessedAt ? new Date(enrollment.lastAccessedAt).toLocaleDateString('ar-EG') : '—'}
                    </span>
                  )}
                  <button
                    onClick={() => onOpenCourse(enrollment)}
                    className="bg-orange-50 text-orange-700 hover:bg-orange-100 text-[11px] font-bold px-3 transition-colors py-2 rounded-lg"
                  >
                    {enrollment.status === 'Completed' ? 'مراجعة المادة' : 'الدخول للغرفة'}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
          {activeEnrollments.length === 0 && (
            <div className="col-span-2 text-center py-8 text-stone-400 text-xs">لا توجد مقررات مسجلة بعد</div>
          )}
        </motion.div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white rounded-3xl p-6 border border-amber-200/60 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-amber-50">
            <span className="flex items-center gap-2 text-xs font-bold text-stone-900">
              <Calendar className="w-4 h-4 text-orange-700" />
              <span>مجالس البث المباشر القادمة</span>
            </span>
            <span className="text-[10px] text-orange-700 font-bold bg-orange-100/50 px-2 py-0.5 rounded">بث مرئي حي</span>
          </div>
          <div className="space-y-4 divide-y divide-amber-50">
            {isLiveLoading ? (
              <div className="text-center py-4 text-xs text-stone-400">جاري التحميل...</div>
            ) : liveSessions.length > 0 ? (
              liveSessions.map((session) => (
                <div key={session.id} className="pt-3 first:pt-0 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div className="space-y-1">
                    <h4 className="font-bold text-xs text-stone-900 leading-snug">{session.title}</h4>
                    <p className="text-[11px] text-stone-500 font-light flex items-center gap-2">
                      <span>المعلم: {session.instructorName}</span>
                      <span>•</span>
                      <span>الموعد: {new Date(session.scheduledAt).toLocaleDateString('ar-EG')} ({new Date(session.scheduledAt).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })})</span>
                    </p>
                  </div>
                  <button
                    onClick={onJoinLiveSession}
                    className="bg-orange-700 hover:bg-orange-800 text-amber-50 font-bold px-4 py-2 border border-orange-700 hover:border-orange-800 rounded-xl text-[10px] cursor-pointer transition shadow-sm w-full sm:w-auto text-center"
                  >
                    انضمام للبث
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-xs text-stone-400">لا توجد جلسات بث قادمة</div>
            )}
          </div>
        </div>

        <div className="bg-amber-100/35 rounded-3xl p-6 border border-amber-200/50 flex flex-col justify-between text-right">
          <div className="space-y-2">
            <span className="text-[9px] bg-amber-500 text-stone-950 px-2 py-0.5 rounded font-extrabold uppercase">وصية المجلس المعرفي</span>
            <h4 className="font-bold text-xs text-stone-900">نصيحة للتعلم الرصين:</h4>
            <p className="text-[11px] text-stone-600 leading-relaxed font-light">
              "احرص على أخذ قسط دائم من تدوين الملاحظات اليدوية. لقد وجد باحثونا التراثيون الفنيون أن رسم الحروف بيدك يرسخ موازين البصر ٧٠٪ أفضل."
            </p>
          </div>
          <div className="pt-4 border-t border-amber-100 flex items-center gap-3">
            <Smile className="w-10 h-10 text-orange-700 shrink-0" />
            <div>
              <p className="font-bold text-[11px] text-stone-800">مكتب التوثيق والإسناد</p>
              <p className="text-[9px] text-stone-500">منصة آثاري العريقة</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
