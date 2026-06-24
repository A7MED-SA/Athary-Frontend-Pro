import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../providers/AppProvider';
import { useDashboard } from '../common/hooks/useDashboard';
import { useEnrollments } from '../common/hooks/useEnrollments';
import { useCertificates } from '../common/hooks/useCertificates';
import { useLiveSession } from '../common/hooks/useLiveSession';
import { DashboardSkeleton } from '../../components/shared/Skeleton';
import { ErrorFallback } from '../../components/shared/ErrorFallback';
import type { EnrollmentResponseDto } from '../../types/api/enrollment';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import ManuscriptCertificate from './ManuscriptCertificate';
import LearningRoom from './LearningRoom';
import QuizTaking from './QuizTaking';
import LiveSessionRoom from '../instructor/LiveSession';
import MessagingCenter from './MessagingCenter';
import WishlistRefunds from './WishlistRefunds';
import InstructorApply from './InstructorApply';
import {
  Layout,
  BookOpen,
  Award,
  Heart,
  Bell,
  LogOut,
  Play,
  CheckCircle,
  Calendar,
  Clock,
  Check,
  Menu,
  Smile,
  GraduationCap,
  Share2,
  X,
  TrendingUp,
  Users,
  BookOpenCheck,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type DashboardTab = 'overview' | 'my-courses' | 'certificates' | 'favorites' | 'notifications' | 'instructor-apply';

export default function StudentDashboard() {
  const { handleLogout, userName = 'أحمد التميمي', displayToast } = useAppContext();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const [activePlaybackEnrollment, setActivePlaybackEnrollment] = useState<EnrollmentResponseDto | null>(null);
  const [isPlayingLiveSession, setIsPlayingLiveSession] = useState(false);
  const [playingQuizId, setPlayingQuizId] = useState<string | null>(null);

  const [sharingCert, setSharingCert] = useState<{ id: string; title: string } | null>(null);

  const { studentOverview, isStudentLoading, isStudentError, refetchStudent } = useDashboard({ enableStudent: true });
  const { enrollments, isLoading: isEnrollmentsLoading } = useEnrollments();
  const { certificates, isLoading: isCertificatesLoading } = useCertificates();
  const { upcomingStudent, isLoading: isLiveLoading } = useLiveSession();

  const isLoading = isStudentLoading || isEnrollmentsLoading;
  const isError = isStudentError;

  const recentEnrollments = studentOverview?.recentEnrollments ?? [];
  const activeEnrollments = (enrollments ?? []).filter(
    (e) => e.status === 'InProgress' || e.status === 'Completed'
  );
  const certificatesList = certificates ?? [];
  const liveSessions = upcomingStudent ?? [];

  const completedCount = studentOverview?.completedCoursesCount ?? 0;
  const inProgressCount = studentOverview?.inProgressCoursesCount ?? 0;
  const enrolledCount = studentOverview?.enrolledCoursesCount ?? 0;
  const certificatesCount = studentOverview?.certificatesCount ?? 0;

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

  const menuItems = [
    { id: 'overview' as DashboardTab, label: 'نظرة عامة', icon: <Layout className="w-5 h-5" /> },
    { id: 'my-courses' as DashboardTab, label: 'دوراتي المفتوحة', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'certificates' as DashboardTab, label: 'الشهادات والإجازات', icon: <Award className="w-5 h-5" /> },
    { id: 'favorites' as DashboardTab, label: 'المفضلة وطلب الاسترداد', icon: <Heart className="w-5 h-5" /> },
    { id: 'notifications' as DashboardTab, label: 'مركز الرسائل والتنبيهات', icon: <Bell className="w-5 h-5" /> },
    { id: 'instructor-apply' as DashboardTab, label: 'الانضمام كمدرب', icon: <GraduationCap className="w-5 h-5" /> },
  ];

  if (isError) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center" dir="rtl">
        <ErrorFallback
          title="خطأ في تحميل لوحة التحكم"
          message="حدث خطأ أثناء تحميل بيانات لوحة التحكم. يرجى المحاولة مرة أخرى."
          onRetry={() => refetchStudent()}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent font-sans flex text-right text-[var(--color-foreground)] transition-colors duration-250" dir="rtl" id="athary-student-dashboard">

      <div className="flex-1 flex flex-col md:flex-row w-full max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 gap-6">

        <aside
          className={`bg-white border border-amber-200/80 rounded-3xl p-5 flex flex-col justify-between shadow-sm transition-all duration-300 ${
            sidebarCollapsed ? 'w-full md:w-20' : 'w-full md:w-72'
          }`}
          id="dashboard-sidebar"
        >
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-amber-100">
              {!sidebarCollapsed && (
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-orange-700/10 flex items-center justify-center text-orange-700 font-bold">
                    أ
                  </div>
                  <span className="font-black text-stone-900 text-xs">بوابة الطالب التعليمية</span>
                </div>
              )}
              {sidebarCollapsed && (
                <div className="w-8 h-8 rounded-lg bg-orange-700 text-amber-50 mx-auto flex items-center justify-center font-bold">آ</div>
              )}
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="hidden md:block p-1.5 hover:bg-stone-100 rounded-lg text-stone-500"
                title={sidebarCollapsed ? 'توسيع' : 'طي'}
              >
                <Menu className="w-4 h-4 mx-auto" />
              </button>
            </div>

            <nav className="space-y-1">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => { setActiveTab(item.id); setActivePlaybackEnrollment(null); }}
                  className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-xs font-bold transition-all ${
                    activeTab === item.id && !activePlaybackEnrollment
                      ? 'bg-orange-700 text-amber-50 shadow-md transform hover:translate-x-[-2px]'
                      : 'text-stone-700 hover:bg-orange-50/50 hover:text-orange-950'
                  }`}
                  id={`sidebar-tab-${item.id}`}
                >
                  <span className={activeTab === item.id && !activePlaybackEnrollment ? 'text-amber-300' : 'text-stone-500'}>
                    {item.icon}
                  </span>
                  {!sidebarCollapsed && <span>{item.label}</span>}
                </button>
              ))}
            </nav>
          </div>

          <div className="pt-6 border-t border-amber-100 mt-6">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-xs font-bold text-stone-600 hover:bg-red-50 hover:text-red-700 transition"
              id="sidebar-logout-btn"
            >
              <LogOut className="w-5 h-5 text-stone-400" />
              {!sidebarCollapsed && <span>تسجيل الخروج</span>}
            </button>
          </div>
        </aside>

        <main className="flex-1 min-w-0" id="dashboard-tab-content">

          {isPlayingLiveSession ? (
            <LiveSessionRoom
              sessionTitle={activePlaybackEnrollment ? `بث مباشر: لـ ${activePlaybackEnrollment.courseTitle}` : undefined}
              onLeave={() => setIsPlayingLiveSession(false)}
            />
          ) : playingQuizId ? (
            <QuizTaking
              quizId={playingQuizId}
              onFinishQuiz={(scorePercent) => {
                setPlayingQuizId(null);
                displayToast(`هنيئاً لك! لقد أكملت التقييم وحصلت على نسبة ${scorePercent}%!`);
              }}
              onCancel={() => setPlayingQuizId(null)}
            />
          ) : activePlaybackEnrollment ? (
            <LearningRoom
              courseId={activePlaybackEnrollment.courseId}
              courseTitle={activePlaybackEnrollment.courseTitle}
              onNavigateBack={() => setActivePlaybackEnrollment(null)}
              onOpenQuiz={(quizId) => {
                if (quizId === 'live_broadcast') {
                  setIsPlayingLiveSession(true);
                } else {
                  setPlayingQuizId(quizId);
                }
              }}
              onOpenCertificate={() => {
                setActiveTab('certificates');
                setActivePlaybackEnrollment(null);
                displayToast('تم توجيهك لصفحة الشهادات والإجازات الشريفة!');
              }}
            />
          ) : (
            <div className="space-y-6">

              <header className="bg-white rounded-3xl border border-amber-200/80 p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm text-right">
                <div>
                  <span className="text-xs font-bold text-orange-700 block">مجلس التحصيل الدراسي المنفذ</span>
                  <h1 className="text-xl sm:text-2xl font-black text-stone-950 mt-1 block">
                    مرحباً بعودتك، {userName} الأصيل
                  </h1>
                </div>

                <div className="flex gap-4 self-stretch sm:self-auto justify-between bg-stone-50 p-4 rounded-2xl border border-amber-100">
                  <div className="text-center px-2">
                    <span className="block text-xl font-extrabold text-orange-800">{inProgressCount}</span>
                    <span className="block text-[10px] text-stone-500 font-semibold mt-0.5">مسارات قيد الدراسة</span>
                  </div>
                  <div className="w-px bg-amber-200" />
                  <div className="text-center px-2">
                    <span className="block text-xl font-extrabold text-teal-700">{certificatesCount}</span>
                    <span className="block text-[10px] text-stone-500 font-semibold mt-0.5">شهادات وإجازات</span>
                  </div>
                </div>
              </header>

              <AnimatePresence mode="wait">
                {activeTab === 'overview' && (
                  <motion.div
                    key="overview"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-6"
                    id="overview-tab"
                  >
                    {isLoading ? (
                      <DashboardSkeleton />
                    ) : (
                      <>
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
                                  if (enrollment) setActivePlaybackEnrollment(enrollment);
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
                                      onClick={() => setActivePlaybackEnrollment(enrollment)}
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
                                      onClick={() => {
                                        setIsPlayingLiveSession(true);
                                        displayToast(`جاري الاتصال بالغرفة الافتراضية للبث الحصري: ${session.title}`);
                                      }}
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
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence mode="wait">
                {activeTab === 'my-courses' && (
                  <motion.div
                    key="my-courses"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.25 }}
                    className="bg-white rounded-3xl border border-amber-200/80 p-6 shadow-sm space-y-6"
                    id="my-courses-tab"
                  >
                    <div>
                      <h2 className="text-base font-extrabold text-stone-905">مقررات تدرسها وتشاركها حالياً</h2>
                      <p className="text-xs text-stone-500 font-light mt-1">تجد هنا تفاصيل الدروس والاختبارات الفردية لكل المناهج المسجل بها اسمك.</p>
                    </div>

                    {isLoading ? (
                      <DashboardSkeleton />
                    ) : (
                      <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                        {activeEnrollments.map((enrollment) => (
                          <motion.div key={enrollment.id} variants={itemVariants} className="border border-amber-200/60 rounded-2xl overflow-hidden flex flex-col justify-between group bg-stone-50">
                            <div className="relative h-32 overflow-hidden bg-amber-100">
                              {enrollment.courseImageUrl && (
                                <img src={enrollment.courseImageUrl} alt={enrollment.courseTitle} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                              )}
                              <div className="absolute inset-0 bg-stone-900/40" />
                              <span className="absolute top-2 right-2 bg-orange-700 text-amber-50 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                {enrollment.status === 'Completed' ? 'مكتمل' : 'قيد الدراسة'}
                              </span>
                            </div>
                            <div className="p-4 space-y-3 flex-1 flex flex-col justify-between text-right">
                              <div className="space-y-1">
                                <h4 className="font-bold text-xs text-stone-900 leading-snug line-clamp-2">{enrollment.courseTitle}</h4>
                                <p className="text-[10px] text-stone-500">الطالب: {enrollment.studentName}</p>
                              </div>
                              <div className="space-y-2 pt-2 border-t border-amber-100">
                                <div className="flex justify-between items-center text-[10px] text-stone-500">
                                  <span>تقدم المسار: {enrollment.progressPercentage}%</span>
                                </div>
                                <div className="w-full bg-stone-200 h-1 rounded-full overflow-hidden">
                                  <div className="bg-orange-700 h-full" style={{ width: `${enrollment.progressPercentage}%` }} />
                                </div>
                                <button
                                  onClick={() => setActivePlaybackEnrollment(enrollment)}
                                  className="w-full text-center bg-orange-700 hover:bg-orange-800 text-amber-50 text-xs font-bold py-2.5 rounded-xl block mt-2"
                                >
                                  استئناف الفصل التفاعلي
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                        <div className="border border-dashed border-amber-300 rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-4 bg-amber-100/10">
                          <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center">
                            <BookOpen className="w-6 h-6" />
                          </div>
                          <div className="space-y-1">
                            <h4 className="font-bold text-xs text-stone-900">هل تبحث عن علوم جديدة؟</h4>
                            <p className="text-[10px] text-stone-500 leading-relaxed max-w-xs">كتالوج آثاري ممتد ويضم دبلومات مكثفة في الفنون القديمة وعلم المخطوطات.</p>
                          </div>
                          <button onClick={() => navigate('/catalog')} className="bg-amber-100 hover:bg-amber-200 text-orange-800 text-[11px] font-bold px-4 py-2 rounded-xl transition border-0 cursor-pointer text-center">
                            زيارة كتالوج الدورات
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence mode="wait">
                {activeTab === 'certificates' && (
                  <motion.div
                    key="certificates"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.25 }}
                    className="bg-white rounded-3xl border border-amber-200/80 p-6 shadow-sm space-y-6"
                    id="certificates-tab"
                  >
                    <div>
                      <h2 className="text-base font-extrabold text-[#962D15] flex items-center gap-2">
                        <Award className="w-5 h-5 text-[#962D15]" />
                        <span>سجل الإجازات والشهادات المكتسبة</span>
                      </h2>
                      <p className="text-xs text-stone-500 font-light mt-1">تجد هنا الشهادات والاجازات الموقعة والمصدقة رقمياً من الهيئات الاستشارية لمنصة آثاري.</p>
                    </div>

                    {isCertificatesLoading ? (
                      <DashboardSkeleton />
                    ) : certificatesList.length > 0 ? (
                      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 pt-2">
                        {certificatesList.map((cert) => (
                          <ManuscriptCertificate
                            key={cert.id}
                            id={cert.id}
                            title={cert.courseName}
                            recipient={userName}
                            grade="ممتاز"
                            serialNumber={cert.code}
                            dateHijri={new Date(cert.issuedAt).toLocaleDateString('ar-SA')}
                            dateGregorian={new Date(cert.issuedAt).toLocaleDateString('ar-EG')}
                            authorizer="المنصة"
                            description="شهادة إتمام دورة تعليمية على منصة آثاري."
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-stone-400 text-xs">لم تحصل على أي شهادات بعد</div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence mode="wait">
                {activeTab === 'favorites' && (
                  <motion.div
                    key="favorites"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.25 }}
                  >
                    <WishlistRefunds />
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence mode="wait">
                {activeTab === 'notifications' && (
                  <motion.div
                    key="notifications"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.25 }}
                  >
                    <MessagingCenter />
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence mode="wait">
                {activeTab === 'instructor-apply' && (
                  <motion.div
                    key="instructor-apply"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.25 }}
                  >
                    <InstructorApply />
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          )}

        </main>
      </div>

      <AnimatePresence>
        {sharingCert && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-stone-900/60 backdrop-blur-xs"
              onClick={() => setSharingCert(null)}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 30 }}
              className="bg-white rounded-3xl border border-amber-200 shadow-2xl relative max-w-md w-full p-6 text-right z-10"
              dir="rtl"
            >
              <button
                onClick={() => setSharingCert(null)}
                className="absolute top-4 left-4 p-1.5 text-stone-400 hover:text-stone-700 bg-stone-50 hover:bg-stone-100 rounded-full border-0 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-10 h-10 rounded-xl bg-orange-700/10 flex items-center justify-center text-orange-700">
                  <Share2 className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm sm:text-base text-stone-900">مشاركة الإجازة الشريفة</h4>
                  <p className="text-[10px] text-stone-400">منصة آثاري للتراث المعرفي العتيق</p>
                </div>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed mb-4">
                انشر حصاد علمك وثابر عليه! يمكنك تزيين جدار إنجازاتك المعرفية عبر وسائل التواصل.
              </p>
              <div className="bg-amber-50/50 rounded-2xl p-4 border border-amber-200/50 mb-5 text-right">
                <p className="text-[10px] text-amber-800 font-bold mb-1.5">نص المنشور المقترح:</p>
                <p className="text-[11px] text-stone-700 leading-relaxed font-sans font-medium">
                  "بحمد الله وتوفيقه، أجزتني لجنة التحقيق الأثرية والتعليمية لدى منصة <strong className="text-orange-900 font-bold">آثاري</strong> شهادة الإجازة في <strong className="text-stone-900 font-bold">({sharingCert.title})</strong> بتقدير ممتاز! #آثاري"
                </p>
              </div>
              <div className="space-y-2.5">
                <button
                  onClick={() => { displayToast('تم نسخ رابط الإجازة وفتح تطبيق WhatsApp!'); setSharingCert(null); }}
                  className="w-full bg-[#25D366] hover:bg-[#1ebd5d] text-white py-3 px-4 rounded-xl text-xs font-bold transition flex items-center justify-between cursor-pointer border-0 shadow-xs"
                >
                  <span className="font-bold">واتساب</span>
                  <span className="text-[9px] bg-white/20 px-2.5 py-0.5 rounded-full font-sans">إرسال فوري</span>
                </button>
                <button
                  onClick={() => { displayToast('تم إعداد بطاقة الإسناد لملفك الاحترافي!'); setSharingCert(null); }}
                  className="w-full bg-[#0077B5] hover:bg-[#006396] text-white py-3 px-4 rounded-xl text-xs font-bold transition flex items-center justify-between cursor-pointer border-0 shadow-xs"
                >
                  <span className="font-bold">لينكد إن</span>
                  <span className="text-[9px] bg-white/20 px-2.5 py-0.5 rounded-full font-sans">ملف احترافي</span>
                </button>
                <button
                  onClick={() => { displayToast('تم نشر التغريدة بنجاح!'); setSharingCert(null); }}
                  className="w-full bg-stone-900 hover:bg-stone-950 text-white py-3 px-4 rounded-xl text-xs font-bold transition flex items-center justify-between cursor-pointer border-0 shadow-xs"
                >
                  <span className="font-bold">تويتر / إكس</span>
                  <span className="text-[9px] bg-white/25 px-2.5 py-0.5 rounded-full font-sans">تغريدة فورية</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
