import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard,
  BookOpen,
  PlusCircle,
  Settings,
  DollarSign,
  Users,
  AlertCircle,
  LogOut,
  ChevronLeft,
  Edit3,
  Plus,
  FileSignature,
  CheckCircle,
  Menu,
  Sparkles,
  TrendingUp,
  Search,
  Palette,
  Sun,
  Moon,
  Trash2,
} from 'lucide-react';
import { useAppContext } from '../../providers/AppProvider';
import { useDashboard } from '../common/hooks/useDashboard';
import { useCourses } from '../common/hooks/useCourses';
import { dashboardService } from '../dashboards/services/dashboard.service';
import { DashboardSkeleton } from '../../components/shared/Skeleton';
import { ErrorFallback } from '../../components/shared/ErrorFallback';
import CourseBuilder from './CourseBuilder';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { CourseResponseDto } from '../../types/api/course';
import type { InstructorRevenueDto } from '../../types/api/dashboard';

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'destructive' | 'success' | 'warning';
  children?: React.ReactNode;
  className?: string;
}

function Badge({ className, children, variant = 'default', ...props }: BadgeProps) {
  const baseStyles = "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold border transition-all duration-150 shadow-2xs";
  const variants = {
    default: "border-transparent bg-orange-700 text-amber-50 hover:bg-orange-700",
    secondary: "border-stone-200 bg-stone-100/90 text-stone-700 hover:bg-stone-200",
    outline: "text-stone-800 border-stone-200 bg-white hover:bg-stone-50",
    destructive: "border-transparent bg-red-100 text-red-800 border-red-200 hover:bg-red-200",
    success: "bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100/60",
    warning: "bg-amber-50 border-amber-200 text-amber-800 hover:bg-amber-100/60"
  };
  return (
    <div className={`${baseStyles} ${variants[variant]} ${className || ''}`} {...props}>
      {children}
    </div>
  );
}

function LineCheckIcon() {
  return (
    <svg className="w-4 h-4 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5h-18a2 2 0 00-2 2v10a2 2 0 002 2h18a2 2 0 002-2V14a2 2 0 00-2-2z" />
    </svg>
  );
}

export default function InstructorDashboard() {
  const { handleLogout, userName, displayToast } = useAppContext();

  const [activeTab, setActiveTab] = useState<'overview' | 'my-courses' | 'course-builder' | 'revisions' | 'earnings'>('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'pending' | 'draft'>('all');
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>(() => (localStorage.getItem('theme-mode') as 'light' | 'dark') || 'light');
  const [themeColor, setThemeColor] = useState<'gold' | 'forest' | 'graphite'>(() => (localStorage.getItem('theme-color') as 'gold' | 'forest' | 'graphite') || 'gold');
  const [insightMetric, setInsightMetric] = useState<'revenue' | 'students'>('revenue');

  const { instructorOverview, isInstructorLoading, isInstructorError, refetchInstructor } = useDashboard();
  const { instructorCourses, isLoading: isCoursesLoading } = useCourses();
  const [revenueData, setRevenueData] = useState<InstructorRevenueDto | null>(null);
  const [isRevenueLoading, setIsRevenueLoading] = useState(true);

  useEffect(() => {
    dashboardService.getInstructorRevenue()
      .then((res) => setRevenueData(res.data))
      .catch(() => {})
      .finally(() => setIsRevenueLoading(false));
  }, []);

  useEffect(() => {
    const handleThemeSync = () => {
      const mode = (localStorage.getItem('theme-mode') as 'light' | 'dark') || 'light';
      const color = (localStorage.getItem('theme-color') as 'gold' | 'forest' | 'graphite') || 'gold';
      setThemeMode(mode);
      setThemeColor(color);
    };
    window.addEventListener('theme-changed', handleThemeSync);
    return () => window.removeEventListener('theme-changed', handleThemeSync);
  }, []);

  const applyThemeMode = (mode: 'light' | 'dark') => {
    setThemeMode(mode);
    localStorage.setItem('theme-mode', mode);
    if (mode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    displayToast(mode === 'dark' ? 'تم تفعيل النمط الداكن بنجاح.' : 'تم تفعيل النمط المضيء بنجاح.');
  };

  const applyThemeColor = (color: 'gold' | 'forest' | 'graphite') => {
    setThemeColor(color);
    localStorage.setItem('theme-color', color);
    document.documentElement.classList.remove('theme-forest', 'theme-graphite');
    if (color !== 'gold') {
      document.documentElement.classList.add(`theme-${color}`);
    }
    const colorNames = { gold: 'الذهبي الأصيل', forest: 'الغابة العشبية', graphite: 'الجرافيت الحجري' };
    displayToast(`تم تحويل نسق ألوان المنصة إلى مظهر ${colorNames[color]}.`);
  };

  const overview = instructorOverview;
  const coursesList = instructorCourses?.items ?? [];
  const isLoading = isInstructorLoading || isCoursesLoading;

  const chartData = (revenueData?.revenueByMonth ?? []).map((m) => ({
    month: m.month,
    revenue: m.amount,
    students: 0,
  }));

  const filteredCourses = coursesList.filter((c) => {
    const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.categoryName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' ||
      (statusFilter === 'published' && c.status === 'Published') ||
      (statusFilter === 'pending' && c.status === 'PendingReview') ||
      (statusFilter === 'draft' && c.status === 'Draft');
    return matchesSearch && matchesStatus;
  });

  const handleOpenNewCourseBuilder = () => {
    setEditingCourseId(null);
    setActiveTab('course-builder');
  };

  const handleEditExistingCourse = (course: CourseResponseDto) => {
    setEditingCourseId(course.id);
    setActiveTab('course-builder');
  };

  if (isInstructorError) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center" dir="rtl">
        <ErrorFallback
          title="خطأ في تحميل لوحة التحكم"
          message="حدث خطأ أثناء تحميل بيانات لوحة التحكم."
          onRetry={() => refetchInstructor()}
        />
      </div>
    );
  }

  return (
    <div className="bg-transparent min-h-screen flex flex-col font-sans text-[var(--color-foreground)] transition-colors duration-250" dir="rtl">
      <div className="absolute inset-x-0 top-0 h-[480px] overflow-hidden pointer-events-none z-0">
        <div className="bg-heritage-pattern opacity-[0.06] absolute inset-0" />
        <div className="absolute inset-0 bg-gradient-to-b from-orange-700/5 via-amber-500/0 to-transparent" />
      </div>

      <div className="flex flex-1 relative z-10">
        <AnimatePresence mode="wait">
          {isSidebarOpen && (
            <motion.aside
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 280 }}
              exit={{ opacity: 0, width: 0 }}
              className="hidden lg:flex flex-col bg-[var(--color-contrast)] text-[var(--color-contrast-foreground)] border-l border-[var(--color-contrast-border)] min-h-screen px-4 py-8 justify-between sticky top-0"
              id="instructor-sidebar"
            >
              <div className="space-y-8">
                <div className="flex items-center gap-3 px-2 border-b border-orange-900 pb-5">
                  <div className="w-10 h-10 rounded-xl bg-orange-700 flex items-center justify-center shadow-lg border border-orange-600">
                    <Sparkles className="w-5 h-5 text-amber-50" />
                  </div>
                  <div>
                    <h2 className="font-extrabold text-sm tracking-tight text-amber-200">بوابة الأستاذ آثاري</h2>
                    <p className="text-[10px] text-stone-300 font-light">الهيئة التدريسية المعتمدة</p>
                  </div>
                </div>

                <button
                  onClick={handleOpenNewCourseBuilder}
                  className="w-full bg-orange-700 hover:bg-orange-800 text-amber-50 font-black text-xs py-3 px-4 rounded-xl transition shadow flex items-center justify-center gap-2 border-0 cursor-pointer hover:scale-102"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>تأليف ومنشأ دبلوم جديد</span>
                </button>

                <nav className="space-y-1.5 pt-4">
                  <button onClick={() => setActiveTab('overview')} className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition text-right text-xs font-bold border-0 cursor-pointer ${activeTab === 'overview' ? 'bg-orange-800 text-amber-200' : 'bg-transparent text-stone-300 hover:bg-orange-900/40 hover:text-white'}`}>
                    <LayoutDashboard className="w-4 h-4 text-orange-500" />
                    <span>لوحة المراقبة ونظرة عامة</span>
                  </button>
                  <button onClick={() => setActiveTab('my-courses')} className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition text-right text-xs font-bold border-0 cursor-pointer ${activeTab === 'my-courses' ? 'bg-orange-800 text-amber-200' : 'bg-transparent text-stone-300 hover:bg-orange-900/40 hover:text-white'}`}>
                    <BookOpen className="w-4 h-4 text-orange-500" />
                    <span>سجل ومراجعة دوراتي</span>
                  </button>
                  <button onClick={() => setActiveTab('revisions')} className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition text-right text-xs font-bold border-0 cursor-pointer ${activeTab === 'revisions' ? 'bg-orange-800 text-amber-200' : 'bg-transparent text-stone-300 hover:bg-orange-900/40 hover:text-white'}`}>
                    <FileSignature className="w-4 h-4 text-orange-500" />
                    <span>طلبات تعديل المنهج</span>
                  </button>
                  <button onClick={() => setActiveTab('earnings')} className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition text-right text-xs font-bold border-0 cursor-pointer ${activeTab === 'earnings' ? 'bg-orange-800 text-amber-200' : 'bg-transparent text-stone-300 hover:bg-orange-900/40 hover:text-white'}`}>
                    <DollarSign className="w-4 h-4 text-orange-500" />
                    <span>عائدات التدقيق المالي ومحاضرينا</span>
                  </button>
                </nav>
              </div>

              <div className="pt-6 border-t border-orange-900 space-y-4">
                <div className="flex items-center gap-3 px-1">
                  <div className="w-9 h-9 rounded-full bg-orange-700 flex items-center justify-center text-xs font-bold text-amber-50">أ</div>
                  <div>
                    <h4 className="text-xs font-black">{userName}</h4>
                    <p className="text-[9px] text-[#fbbf24]">مدقق الحلقات التراثية</p>
                  </div>
                </div>
                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400 hover:bg-red-950/40 hover:text-red-300 transition text-right text-xs font-semibold cursor-pointer border-0 bg-transparent">
                  <LogOut className="w-4 h-4" />
                  <span>الخروج من كابينة التدريس</span>
                </button>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        <main className="flex-1 px-4 sm:px-8 py-8 overflow-x-hidden min-h-screen">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 border-b border-amber-100 pb-5">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-1.5 bg-white border border-amber-200/60 rounded-lg text-stone-700 hover:bg-amber-50 lg:flex items-center justify-center cursor-pointer transition hidden" title="تبديل القائمة الجانبية">
                  <Menu className="w-4 h-4" />
                </button>
                <div className="text-[10px] bg-orange-100 text-orange-950 font-bold px-2.5 py-1 rounded-full border border-orange-200 inline">مجلس الإشراف والتدريس</div>
              </div>
              <h1 className="text-xl font-extrabold text-stone-900">
                أهلاً بك أستاذ {userName}، إليك ملخص أداء دوراتك اليوم.
              </h1>
              <p className="text-xs text-stone-500 mt-1">تتبع مؤشرات الاستثمار العيني وسير مراجعة مناهجك وتأليفها.</p>
            </div>

            <div className="flex gap-2.5 items-center">
              <div className="relative">
                <button onClick={() => setIsNotifOpen(!isNotifOpen)} className="relative p-2.5 bg-white border border-amber-200/60 rounded-xl text-stone-700 hover:bg-amber-50 cursor-pointer transition flex items-center justify-center shadow-2xs" title="التنبيهات الأكاديمية">
                  <svg className="w-5 h-5 text-orange-950" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.3" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                </button>
              </div>

              <div className="relative">
                <button type="button" onClick={() => setIsThemeOpen(!isThemeOpen)} className="relative p-2.5 bg-white border border-amber-200/60 rounded-xl text-stone-700 hover:bg-amber-50 cursor-pointer transition flex items-center justify-center shadow-2xs" title="تخصيص الواجهة والسمات">
                  <Palette className="w-5 h-5 text-orange-950" />
                </button>
                <AnimatePresence>
                  {isThemeOpen && (
                    <>
                      <div className="fixed inset-0 z-30" onClick={() => setIsThemeOpen(false)} />
                      <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} transition={{ duration: 0.15 }} className="absolute left-0 mt-2.5 w-64 bg-white border border-amber-200/80 rounded-2xl shadow-xl z-40 p-4 text-right">
                        <div className="pb-2 border-b border-amber-50 mb-3">
                          <h4 className="font-extrabold text-xs text-stone-900 flex items-center gap-1.5"><Palette className="w-4 h-4 text-orange-700" /><span>تخصيص سمت ومظهر المنصة</span></h4>
                        </div>
                        <div className="space-y-2 mb-4">
                          <span className="text-[10px] font-bold text-stone-500 block">نمط العرض</span>
                          <div className="grid grid-cols-2 gap-2">
                            <button type="button" onClick={() => applyThemeMode('light')} className={`py-1.5 px-3 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1.5 transition border cursor-pointer ${themeMode === 'light' ? 'bg-amber-100 border-amber-400 text-stone-950 shadow-2xs' : 'bg-stone-50/50 border-stone-200/60 text-stone-500 hover:bg-stone-50'}`}><Sun className="w-3.5 h-3.5 text-amber-500" /><span>مضيء</span></button>
                            <button type="button" onClick={() => applyThemeMode('dark')} className={`py-1.5 px-3 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1.5 transition border cursor-pointer ${themeMode === 'dark' ? 'bg-stone-900 border-stone-700 text-stone-100 shadow-2xs' : 'bg-stone-50/50 border-stone-200/60 text-stone-500 hover:bg-stone-50'}`}><Moon className="w-3.5 h-3.5 text-blue-400" /><span>داكن</span></button>
                          </div>
                        </div>
                        <div className="space-y-2 border-t border-amber-50/75 pt-3">
                          <span className="text-[10px] font-bold text-stone-500 block">أنماط الألوان</span>
                          <div className="space-y-1.5">
                            <button type="button" onClick={() => applyThemeColor('gold')} className={`w-full py-1.5 px-3 rounded-lg text-[10px] font-bold flex items-center justify-between transition border cursor-pointer ${themeColor === 'gold' ? 'bg-[#FDFBF7] border-amber-400 text-amber-950 font-black shadow-3xs' : 'bg-stone-50/50 border-stone-200/40 text-stone-600 hover:bg-stone-50'}`}><div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-amber-400 border border-stone-300" /><span>الذهبي الأصيل</span></div>{themeColor === 'gold' && <span className="text-[9px] text-amber-600">✓</span>}</button>
                            <button type="button" onClick={() => applyThemeColor('forest')} className={`w-full py-1.5 px-3 rounded-lg text-[10px] font-bold flex items-center justify-between transition border cursor-pointer ${themeColor === 'forest' ? 'bg-[#f0f5f0] border-emerald-400 text-emerald-950 font-black shadow-3xs' : 'bg-stone-50/50 border-stone-200/40 text-stone-600 hover:bg-stone-50'}`}><div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#6b9e72] border border-stone-300" /><span>الغابة التراثية</span></div>{themeColor === 'forest' && <span className="text-[9px] text-emerald-600">✓</span>}</button>
                            <button type="button" onClick={() => applyThemeColor('graphite')} className={`w-full py-1.5 px-3 rounded-lg text-[10px] font-bold flex items-center justify-between transition border cursor-pointer ${themeColor === 'graphite' ? 'bg-[#f2f2f2] border-stone-400 text-stone-950 font-black shadow-3xs' : 'bg-stone-50/50 border-stone-200/40 text-stone-600 hover:bg-stone-50'}`}><div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#707070] border border-stone-300" /><span>الجرافيت الحجري</span></div>{themeColor === 'graphite' && <span className="text-[9px] text-stone-600">✓</span>}</button>
                          </div>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              <button onClick={handleOpenNewCourseBuilder} className="bg-orange-700 hover:bg-orange-800 text-amber-50 text-xs font-bold px-4 py-2.5 rounded-xl transition cursor-pointer border-0 shadow-sm flex items-center gap-1.5">
                <Plus className="w-4 h-4" />
                <span>إنشاء دبلوم جديد</span>
              </button>
            </div>
          </div>

          {activeTab === 'overview' && (
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-8" id="instructor-overview-tab">
              {isLoading ? (
                <DashboardSkeleton />
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                    <div className="bg-white rounded-2xl p-5 border border-amber-200/60 shadow-xs space-y-4 relative overflow-hidden group">
                      <div className="absolute -left-4 -bottom-4 w-16 h-16 bg-emerald-50 rounded-full group-hover:scale-110 transition" />
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-stone-500 font-bold">إجمالي الأرباح</span>
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex justify-center items-center"><DollarSign className="w-4 h-4" /></div>
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-xl font-extrabold text-stone-900 font-mono">{overview?.totalRevenue?.toLocaleString() ?? '0'} ر.س</h3>
                        <p className="text-[10px] text-emerald-600 flex items-center gap-1"><TrendingUp className="w-3 h-3" /><span>الإيراد الشهري: {overview?.totalRevenue?.toLocaleString() ?? '0'} ر.س</span></p>
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl p-5 border border-amber-200/60 shadow-xs space-y-4 relative overflow-hidden group">
                      <div className="absolute -left-4 -bottom-4 w-16 h-16 bg-blue-50 rounded-full group-hover:scale-110 transition" />
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-stone-500 font-bold">إجمالي الطلاب</span>
                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex justify-center items-center"><Users className="w-4 h-4" /></div>
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-xl font-extrabold text-stone-900 font-mono">{overview?.totalStudents ?? 0} طالب</h3>
                        <p className="text-[10px] text-stone-400">ملتحقون بمختلف مقاعد الحلقات</p>
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl p-5 border border-amber-200/60 shadow-xs space-y-4 relative overflow-hidden group">
                      <div className="absolute -left-4 -bottom-4 w-16 h-16 bg-teal-50 rounded-full group-hover:scale-110 transition" />
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-stone-500 font-bold">الدورات المنشورة</span>
                        <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex justify-center items-center"><BookOpen className="w-4 h-4" /></div>
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-xl font-extrabold text-stone-900 font-mono">{overview?.publishedCourses ?? 0} مناهج</h3>
                        <p className="text-[10px] text-teal-600">منها {overview?.draftCourses ?? 0} مسودة</p>
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl p-5 border border-amber-200/60 shadow-xs space-y-4 relative overflow-hidden group">
                      <div className="absolute -left-4 -bottom-4 w-16 h-16 bg-amber-50 rounded-full group-hover:scale-110 transition" />
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-stone-500 font-bold">متوسط التقييم</span>
                        <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex justify-center items-center"><AlertCircle className="w-4 h-4" /></div>
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-xl font-extrabold text-amber-600 font-mono">{overview?.averageRating?.toFixed(1) ?? '0.0'} / 5.0</h3>
                        <p className="text-[10px] text-amber-700">تقييم الطلاب العام</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-3xl border border-amber-200/60 p-6 shadow-sm space-y-5">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-amber-50">
                      <div>
                        <h3 className="font-extrabold text-sm text-stone-900 flex items-center gap-1.5"><TrendingUp className="w-4 h-4 text-orange-700" /><span>رؤى الأداء والنمو المعرفي</span></h3>
                        <p className="text-[10.5px] text-stone-500 font-light mt-0.5">دراسة اتجاهات الأرباح المتولدة واستقطاب الدارسين الجدد.</p>
                      </div>
                      <div className="flex bg-amber-50/50 p-1 rounded-xl border border-amber-200/50 shrink-0">
                        <button type="button" onClick={() => setInsightMetric('revenue')} className={`px-4 py-1.5 rounded-lg text-[10px] font-bold transition flex items-center gap-1 border-0 cursor-pointer ${insightMetric === 'revenue' ? 'bg-orange-700 text-amber-50 shadow-2xs' : 'text-stone-600 hover:bg-amber-100/50'}`}><span>المكاسب والريع المالي</span></button>
                        <button type="button" onClick={() => setInsightMetric('students')} className={`px-4 py-1.5 rounded-lg text-[10px] font-bold transition flex items-center gap-1 border-0 cursor-pointer ${insightMetric === 'students' ? 'bg-orange-700 text-amber-50 shadow-2xs' : 'text-stone-600 hover:bg-amber-100/50'}`}><span>الطلاب والالتحاقات الجدد</span></button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 bg-amber-50/20 p-4 rounded-2xl border border-amber-100 mb-2">
                      <div className="text-right">
                        <span className="text-[9px] text-stone-400 block font-light">إجمالي الإيرادات</span>
                        <span className="text-sm font-black text-orange-950 font-mono">{revenueData?.totalRevenue?.toLocaleString() ?? '0'} ر.س</span>
                      </div>
                      <div className="text-right border-r border-[#ece3d3]/60 pr-4">
                        <span className="text-[9px] text-stone-400 block font-light">الإيراد الشهري</span>
                        <span className="text-sm font-black text-teal-700 font-mono">{revenueData?.monthlyRevenue?.toLocaleString() ?? '0'} ر.س</span>
                      </div>
                      <div className="text-right border-r border-[#ece3d3]/60 pr-4">
                        <span className="text-[9px] text-stone-400 block font-light">معلقات السحب</span>
                        <span className="text-sm font-black text-orange-950 font-mono">{revenueData?.pendingPayouts?.toLocaleString() ?? '0'} ر.س</span>
                      </div>
                      <div className="text-right border-r border-[#ece3d3]/60 pr-4">
                        <span className="text-[9px] text-stone-400 block font-light">متوسط التقييم</span>
                        <span className="text-sm font-black text-amber-600 font-mono">{overview?.averageRating?.toFixed(1) ?? '0.0'} / 5.0</span>
                      </div>
                    </div>

                    <div className="h-64 sm:h-72 w-full pt-2" dir="ltr">
                      {isRevenueLoading ? (
                        <div className="h-full flex items-center justify-center text-xs text-stone-400">جاري تحميل البيانات...</div>
                      ) : chartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          {insightMetric === 'revenue' ? (
                            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                              <defs>
                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="var(--color-brand-orange-700)" stopOpacity={0.25} />
                                  <stop offset="95%" stopColor="var(--color-brand-orange-600)" stopOpacity={0.0} />
                                </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" stroke="#fed7aa" opacity={0.15} />
                              <XAxis dataKey="month" stroke="#78716c" fontSize={10.5} fontWeight="semibold" tickLine={false} />
                              <YAxis stroke="#78716c" fontSize={10.5} fontWeight="bold" tickLine={false} tickFormatter={(value) => `${value.toLocaleString()}`} />
                              <Tooltip contentStyle={{ backgroundColor: 'white', border: '1.5px solid var(--color-border)', borderRadius: '16px', textAlign: 'right', fontSize: '11px' }} formatter={(value: number) => [`${value.toLocaleString()} ر.س`, 'الإيرادات المحققة']} labelFormatter={(label) => `شهر ${label}`} />
                              <Area type="monotone" dataKey="revenue" stroke="var(--color-brand-orange-700)" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                            </AreaChart>
                          ) : (
                            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#fed7aa" opacity={0.15} />
                              <XAxis dataKey="month" stroke="#78716c" fontSize={10.5} fontWeight="semibold" tickLine={false} />
                              <YAxis stroke="#78716c" fontSize={10.5} fontWeight="bold" tickLine={false} />
                              <Tooltip contentStyle={{ backgroundColor: 'white', border: '1.5px solid var(--color-border)', borderRadius: '16px', textAlign: 'right', fontSize: '11px' }} formatter={(value: number) => [`${value} طالب جديد`, 'الالتحاقات والطلاب الجدد']} labelFormatter={(label) => `شهر ${label}`} />
                              <Bar dataKey="students" fill="var(--color-primary, #C5A565)" radius={[8, 8, 0, 0]} barSize={36} />
                            </BarChart>
                          )}
                        </ResponsiveContainer>
                      ) : (
                        <div className="h-full flex items-center justify-center text-xs text-stone-400">لا توجد بيانات بعد</div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    <div className="xl:col-span-2 bg-white rounded-3xl border border-amber-200/80 p-6 shadow-sm space-y-6">
                      <div className="flex justify-between items-center pb-4 border-b border-stone-100">
                        <div>
                          <h3 className="font-extrabold text-sm text-stone-900">سجل النشاط وحالة الدورات</h3>
                          <p className="text-[10px] text-stone-500">مجموع المقررات المخطط لها والمرفوعة.</p>
                        </div>
                        <span className="text-xs text-orange-700 font-bold hover:underline cursor-pointer" onClick={() => setActiveTab('my-courses')}>تصفح كل المناهج</span>
                      </div>

                      <div className="bg-stone-50/50 border border-stone-100 p-4 rounded-2xl flex flex-col lg:flex-row gap-3 items-center justify-between">
                        <div className="relative w-full lg:w-72 border-0 bg-transparent">
                          <Search className="absolute right-3 top-2.5 w-4 h-4 text-stone-400 pointer-events-none" />
                          <input type="text" placeholder="ابحث باسم المنهج أو التصنيف..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full text-xs pr-9 pl-3 py-2 bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 text-right font-sans" />
                        </div>
                        <div className="flex flex-wrap gap-1.5 w-full lg:w-auto">
                          <button type="button" onClick={() => setStatusFilter('all')} className={`px-3 py-1.5 rounded-lg text-[10px] font-bold cursor-pointer transition-all border ${statusFilter === 'all' ? 'bg-[var(--color-contrast)] text-[var(--color-contrast-foreground)] border-[var(--color-contrast)]' : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'}`}>الكل</button>
                          <button type="button" onClick={() => setStatusFilter('published')} className={`px-3 py-1.5 rounded-lg text-[10px] font-bold cursor-pointer transition-all border flex items-center gap-1 ${statusFilter === 'published' ? 'bg-emerald-700 text-amber-50 border-emerald-700' : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'}`}><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />منشورة</button>
                          <button type="button" onClick={() => setStatusFilter('pending')} className={`px-3 py-1.5 rounded-lg text-[10px] font-bold cursor-pointer transition-all border flex items-center gap-1 ${statusFilter === 'pending' ? 'bg-amber-600 text-amber-50 border-amber-600' : 'bg-white text-stone-600 border-stone-300 hover:bg-stone-50'}`}><span className="w-1.5 h-1.5 rounded-full bg-amber-500" />قيد المراجعة</button>
                          <button type="button" onClick={() => setStatusFilter('draft')} className={`px-3 py-1.5 rounded-lg text-[10px] font-bold cursor-pointer transition-all border flex items-center gap-1 ${statusFilter === 'draft' ? 'bg-stone-600 text-amber-50 border-stone-600' : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'}`}><span className="w-1.5 h-1.5 rounded-full bg-stone-400" />مسودة</button>
                        </div>
                        {(searchTerm || statusFilter !== 'all') && (
                          <button type="button" onClick={() => { setSearchTerm(''); setStatusFilter('all'); }} className="text-[10px] font-bold text-red-600 hover:underline cursor-pointer border-0 bg-transparent pr-1">تصفية الفلاتر x</button>
                        )}
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-right text-xs max-w-full">
                          <thead>
                            <tr className="border-b border-amber-100 text-stone-500 font-bold">
                              <th className="pb-3 pr-2 font-black">عنوان المقرر الرئيسي</th>
                              <th className="pb-3 text-center font-black">حالة النشر</th>
                              <th className="pb-3 text-center font-black">السعر</th>
                              <th className="pb-3 pl-2 text-center font-black">الإجراء</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-amber-50">
                            {filteredCourses.length === 0 ? (
                              <tr><td colSpan={4} className="py-8 text-center text-stone-400 font-light">لا توجد دورات مطابقة.</td></tr>
                            ) : (
                              filteredCourses.map((c) => (
                                <tr key={c.id} className="hover:bg-amber-50/20 transition-colors">
                                  <td className="py-4 pr-1">
                                    <div className="flex items-center gap-3">
                                      {c.courseImageUrl && <img src={c.courseImageUrl} alt="" className="w-10 h-10 rounded-lg object-cover border border-amber-100" />}
                                      <div className="space-y-0.5">
                                        <h4 className="font-extrabold text-orange-700 max-w-sm leading-snug line-clamp-2">{c.title}</h4>
                                        <p className="text-[9px] text-stone-400">قسم: {c.categoryName}</p>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="py-4 text-center">
                                    {c.status === 'Published' && <Badge variant="success"><CheckCircle className="w-3 h-3" /><span>منشورة</span></Badge>}
                                    {c.status === 'PendingReview' && <Badge variant="warning"><AlertCircle className="w-3 h-3" /><span>قيد المراجعة</span></Badge>}
                                    {c.status === 'Draft' && <Badge variant="secondary"><Settings className="w-3 h-3" /><span>مسودة</span></Badge>}
                                  </td>
                                  <td className="py-4 text-center font-mono font-bold text-orange-950">{c.isFree ? 'مجاني' : `${c.price} ر.س`}</td>
                                  <td className="py-4 text-center">
                                    <div className="flex items-center justify-center gap-2">
                                      <button onClick={() => handleEditExistingCourse(c)} className="p-1 text-stone-400 hover:text-orange-700 hover:bg-orange-50 rounded transition border-0 bg-transparent cursor-pointer" title="تعديل"><Edit3 className="w-3.5 h-3.5" /></button>
                                    </div>
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="bg-white rounded-3xl border border-amber-200/80 p-6 shadow-sm space-y-4">
                        <h3 className="font-extrabold text-sm text-stone-900 border-b border-amber-100 pb-3 flex items-center gap-2"><Sparkles className="w-4 h-4 text-orange-700 animate-pulse" /><span>الإجراءات السريعة</span></h3>
                        <div className="space-y-2.5">
                          <button onClick={handleOpenNewCourseBuilder} className="w-full text-right bg-gradient-to-l from-orange-700 to-orange-800 hover:from-orange-800 hover:to-orange-950 text-amber-50 p-3.5 rounded-xl text-xs font-bold transition flex items-center justify-between shadow border-0 cursor-pointer"><div className="flex items-center gap-3"><Plus className="w-4 h-4" /><span>تأليف دبلوم أكاديمي جديد</span></div><ChevronLeft className="w-3.5 h-3.5" /></button>
                          <button onClick={() => setActiveTab('revisions')} className="w-full text-right bg-[var(--color-brand-orange-950)]/5 hover:bg-[var(--color-brand-orange-950)]/10 text-[var(--color-brand-orange-950)] p-3.5 rounded-xl text-xs font-bold transition flex items-center justify-between border-0 cursor-pointer"><div className="flex items-center gap-3 text-stone-700"><FileSignature className="w-4 h-4 text-orange-700" /><span>مراجعة طلبات التعديل المعلقة</span></div><ChevronLeft className="w-3.5 h-3.5 text-stone-500" /></button>
                        </div>
                      </div>

                      {overview?.recentReviews && overview.recentReviews.length > 0 && (
                        <div className="bg-white rounded-3xl border border-amber-200/80 p-6 shadow-sm space-y-4">
                          <h3 className="font-extrabold text-sm text-stone-900 border-b border-amber-100 pb-3">آخر التقييمات</h3>
                          <div className="space-y-3">
                            {overview.recentReviews.map((review, i) => (
                              <div key={i} className="p-3 rounded-xl bg-stone-50 border border-stone-100">
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-[10px] font-bold text-stone-700">{review.studentName}</span>
                                  <span className="text-[10px] text-amber-600 font-bold">{review.rating}/5</span>
                                </div>
                                <p className="text-[10px] text-stone-500 line-clamp-2">{review.comment ?? 'تقييم بدون تعليق'}</p>
                                <p className="text-[9px] text-stone-400 mt-1">{review.courseName}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="bg-orange-50/20 border border-dashed border-stone-200 rounded-3xl p-5 text-right space-y-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 bg-amber-100 rounded-full flex items-center justify-center text-amber-700"><LineCheckIcon /></div>
                          <h4 className="font-extrabold text-xs text-stone-900">ميثاق التدريس والتحقيق العيني</h4>
                        </div>
                        <p className="text-[10px] text-stone-500 leading-relaxed font-light">حرصاً على مصداقية ورصانة صك الإجازة، نلتزم بتصنيف وفلترة جميع مقررات الفيديو والمحاضرات للتحقق التام من مصادر المعلومات.</p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          )}

          {activeTab === 'my-courses' && (
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6" id="instructor-courses-tab">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-base font-extrabold text-orange-700 font-serif">سجل الدورات والمناهج التابعة لك</h2>
                  <p className="text-xs text-stone-500">مراجعة وتحرير المخرجات التفاعلية وأسماء الدارسين المعتمدين.</p>
                </div>
                <button onClick={handleOpenNewCourseBuilder} className="bg-orange-700 hover:bg-orange-800 text-amber-50 text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer border-0 shadow-sm flex items-center gap-1.5"><Plus className="w-4 h-4" /><span>تأليف منهج تالي</span></button>
              </div>

              {isCoursesLoading ? (
                <DashboardSkeleton />
              ) : filteredCourses.length === 0 ? (
                <div className="bg-white border border-amber-200/70 rounded-2xl p-8 text-center max-w-lg mx-auto space-y-4">
                  <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
                  <h3 className="font-extrabold text-stone-900 text-sm">لم يتم العثور على مقررات مطابقة</h3>
                  <p className="text-xs text-stone-500 leading-relaxed font-light">لا يتوفر حالياً أي مقرر يطابق بحثك.</p>
                  <button onClick={() => { setSearchTerm(''); setStatusFilter('all'); }} className="px-4 py-2 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-xl text-xs font-bold cursor-pointer transition-all">تصفية والعودة للكل</button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCourses.map((c) => (
                    <div key={c.id} className="bg-white rounded-2xl border border-amber-200/70 overflow-hidden flex flex-col justify-between hover:scale-101 transition shadow-sm">
                      <div className="relative h-40">
                        {c.courseImageUrl && <img src={c.courseImageUrl} alt={c.title} className="w-full h-full object-cover" />}
                        <div className="absolute top-4 right-4 flex gap-1">
                          {c.status === 'Published' && <Badge variant="success">منشور</Badge>}
                          {c.status === 'PendingReview' && <Badge variant="warning">قيد المراجعة</Badge>}
                          {c.status === 'Draft' && <Badge variant="secondary">مسودة</Badge>}
                        </div>
                      </div>
                      <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                        <div className="space-y-1.5">
                          <span className="text-[10px] text-orange-800 font-bold tracking-wider">{c.categoryName}</span>
                          <h3 className="font-extrabold text-sm text-stone-900 leading-snug line-clamp-2">{c.title}</h3>
                        </div>
                        <div className="space-y-3 pt-3 border-t border-amber-100 text-xs">
                          <div className="flex justify-between items-center text-stone-500 font-mono">
                            <span>السعر:</span>
                            <span className="font-bold text-orange-950 font-sans">{c.isFree ? 'مجاني' : `${c.price} ر.س`}</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 pt-2">
                            <button onClick={() => handleEditExistingCourse(c)} className="bg-orange-700 hover:bg-orange-800 text-amber-50 rounded-xl text-center font-bold py-2 transition border-0 cursor-pointer text-xs">تعديل المنهج</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'course-builder' && (
            <CourseBuilder
              onBack={() => setActiveTab('overview')}
              onTriggerToast={displayToast}
              initialCourse={editingCourseId ? coursesList.find((c) => c.id === editingCourseId) as any : null}
              onSave={(submittedCourse: any) => {
                displayToast('تم حفظ وإرسال الدبلوم الأكاديمي!');
                setActiveTab('overview');
              }}
            />
          )}

          {activeTab === 'revisions' && (
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl border border-amber-200/85 p-6 sm:p-8 shadow-xs space-y-6">
              <div>
                <h2 className="text-base font-extrabold text-orange-700 font-serif">طلبات التعديل والتدقيق العلمي المعلقة</h2>
                <p className="text-xs text-stone-500 leading-relaxed font-light">قائمة طلبات التعديل من الهيئة الاستشارية.</p>
              </div>
              <div className="text-center py-8 text-stone-400 text-xs">لا توجد طلبات تعديل معلقة حالياً.</div>
            </motion.div>
          )}

          {activeTab === 'earnings' && (
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl border border-amber-200/85 p-6 sm:p-8 shadow-xs space-y-8">
              <div>
                <h2 className="text-base font-extrabold text-orange-700 flex items-center gap-2 font-serif"><DollarSign className="w-5 h-5 text-orange-700" /><span>عائدات وتصفية المحاضرات التفاعلية</span></h2>
                <p className="text-xs text-stone-500 font-light leading-relaxed">تفاصيل الإيرادات المتولدة من شراء مقاعد المناهج.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-stone-50 border border-amber-100 p-5 rounded-2xl text-right space-y-3">
                  <h4 className="font-extrabold text-xs text-stone-900">ملخص العائدات</h4>
                  <div className="text-xs text-stone-600 space-y-1.5 font-light">
                    <p>إجمالي الإيرادات: <strong className="font-mono">{revenueData?.totalRevenue?.toLocaleString() ?? '0'} ر.س</strong></p>
                    <p>الإيراد الشهري: <strong className="font-mono">{revenueData?.monthlyRevenue?.toLocaleString() ?? '0'} ر.س</strong></p>
                    <p>المعلقات: <strong className="font-mono">{revenueData?.pendingPayouts?.toLocaleString() ?? '0'} ر.س</strong></p>
                  </div>
                </div>
                <div className="bg-orange-50/20 border border-stone-200 p-5 rounded-2xl flex flex-col justify-between text-right">
                  <div>
                    <span className="text-[10px] text-stone-500 font-bold block mb-1">الرصيد المتاح للسحب</span>
                    <h3 className="text-2xl font-black text-orange-950 font-mono">{revenueData?.pendingPayouts?.toLocaleString() ?? '0'} ر.س</h3>
                  </div>
                  <button onClick={() => displayToast('تم تسجيل طلب تسوية بنجاح.')} className="w-full bg-orange-700 hover:bg-orange-800 text-amber-50 text-xs font-bold py-2.5 rounded-xl transition border-0 block cursor-pointer mt-4">تصفية وسحب الرصيد</button>
                </div>
              </div>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
}
