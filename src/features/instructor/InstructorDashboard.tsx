import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  BookOpen, 
  PlusCircle, 
  Settings, 
  DollarSign, 
  Users, 
  FileCheck, 
  AlertCircle, 
  LogOut, 
  ChevronLeft, 
  ChevronRight, 
  Eye, 
  Trash2, 
  Edit3, 
  Upload, 
  Plus, 
  X, 
  FileText, 
  HelpCircle, 
  Play, 
  Lock, 
  FileSignature, 
  CheckCircle,
  Menu,
  Sparkles,
  ArrowRight,
  TrendingUp,
  AwardIcon,
  Tag,
  CircleCheck,
  CircleAlert,
  Sun,
  Moon,
  Palette,
  Search,
  Sliders
} from 'lucide-react';
import { Course } from '../../types';
import { useAppContext } from '../../providers/AppProvider';
import CourseBuilder from './CourseBuilder';
import { AreaChart, Area, BarChart, Bar, Legend, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Reusable high-fidelity Badge component styled exactly like Shadcn Badge
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

// Initial dummy instructor courses
const INITIAL_INSTRUCTOR_COURSES = [
  {
    id: "inst_1",
    title: "مقدمة شاملة في علم الخط الكوفي والفنيات الفاطمية التراثية",
    category: "الفنون والعمارة التراثية",
    status: "Published", // Published, PendingReview, Draft
    studentsCount: 342,
    revenue: 51300,
    thumbnail: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400",
    lessonsCount: 12,
    duration: "١٤ ساعة",
    price: 150
  },
  {
    id: "inst_2",
    title: "تحقيق مخطوطات العلوم العربية وتخريج الأسناد النجمي الأندلسي",
    category: "علم الآثار والتحقيق",
    status: "PendingReview",
    studentsCount: 128,
    revenue: 25600,
    thumbnail: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400",
    lessonsCount: 16,
    duration: "٢٠ ساعة",
    price: 200
  },
  {
    id: "inst_3",
    title: "فنون الريادة الزخرفية وتصميم البنيان التراثي عبر العهود العباسية",
    category: "التاريخ الإسلامي",
    status: "Draft",
    studentsCount: 0,
    revenue: 0,
    thumbnail: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400",
    lessonsCount: 8,
    duration: "١٠ ساعات",
    price: 180
  }
];

export default function InstructorDashboard() {
  const { handleLogout, userName, displayToast, coursesList, setCoursesList } = useAppContext();
  
  const [activeTab, setActiveTab] = useState<'overview' | 'my-courses' | 'course-builder' | 'revisions' | 'earnings' | 'notifications'>('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [instructorCourses, setInstructorCourses] = useState(INITIAL_INSTRUCTOR_COURSES);
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  
  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'pending' | 'draft'>('all');

  // Notifications State for Popover
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  // Theme Switching State & Handlers
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>(
    () => (localStorage.getItem('theme-mode') as 'light' | 'dark') || 'light'
  );
  const [themeColor, setThemeColor] = useState<'gold' | 'forest' | 'graphite'>(
    () => (localStorage.getItem('theme-color') as 'gold' | 'forest' | 'graphite') || 'gold'
  );

  // Sync with global theme setting changes
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
    displayToast(mode === 'dark' ? '🌒 تم تفعيل النمط الداكن بنجاح.' : '☀️ تم تفعيل النمط المضيء بنجاح.');
  };

  const applyThemeColor = (color: 'gold' | 'forest' | 'graphite') => {
    setThemeColor(color);
    localStorage.setItem('theme-color', color);
    document.documentElement.classList.remove('theme-forest', 'theme-graphite');
    if (color !== 'gold') {
      document.documentElement.classList.add(`theme-${color}`);
    }
    const colorNames = { gold: 'الذهبي الأصيل', forest: 'الغابة العشبية', graphite: 'الجرافيت الحجري' };
    displayToast(`🎨 تم تحويل نسق ألوان المنصة إلى مظهر ${colorNames[color]}.`);
  };
  const [notifications, setNotifications] = useState([
    {
      id: "not_1",
      title: "تسجيل طالب جديد 🚀",
      description: "انضم الدارس صالح الهاشمي لـ 'مقدّمة الخط الكوفي' ويترقب المصادقة.",
      time: "منذ ساعتين",
      unread: true,
      type: "enrollment"
    },
    {
      id: "not_2",
      title: "تم نشر المقرّر بنجاح 🎉",
      description: "وافقت لجنة المراجعة على تفعيل 'مباحث علم الآثار والتحقيق' بالمتجر الرئيسي.",
      time: "منذ ٤ ساعات",
      unread: true,
      type: "course_approval"
    },
    {
      id: "not_3",
      title: "تحديث مراجعة معلق 📜",
      description: "ملاحظة تدقيق جديدة بخصوص التوازن الأندلسي في كراستك المعلقة.",
      time: "منذ يوم واحد",
      unread: false,
      type: "approval_update"
    }
  ]);

  const unreadCount = notifications.filter(n => n.unread).length;

  const handleMarkAsRead = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, unread: false } : n));
    displayToast('تم تحديد التنبيه كمقروء.');
  };

  const handleMarkAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
    displayToast('✅ تم اعتبار جميع التنبيهات مقروءة.');
  };

  // Reset and enter Draft Builder
  const handleOpenNewCourseBuilder = () => {
    setEditingCourseId(null);
    setActiveTab('course-builder');
    displayToast('تم تجهيز كراستك ومحرر منشئ الدورات بالتصنيف والتحقق المعياري.');
  };

  const handleEditExistingCourse = (course: any) => {
    setEditingCourseId(course.id);
    setActiveTab('course-builder');
    displayToast('جاري استيراد وتحميل كراسة المناهج والتعديل المباشر عليها بموجة React Hook Form.');
  };

  const [insightMetric, setInsightMetric] = useState<'revenue' | 'students'>('revenue');

  const PERFORMANCE_INSIGHTS_DATA = [
    { month: 'يناير', revenue: 15400, students: 35 },
    { month: 'فبراير', revenue: 21200, students: 48 },
    { month: 'مارس', revenue: 29800, students: 62 },
    { month: 'أبريل', revenue: 38200, students: 85 },
    { month: 'مايو', revenue: 51300, students: 110 },
    { month: 'يونيو', revenue: 76900, students: 154 },
  ];

  // Filter and search courses helper
  const getFilteredCourses = () => {
    return instructorCourses.filter(c => {
      const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            c.category.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || 
                            (statusFilter === 'published' && c.status === 'Published') ||
                            (statusFilter === 'pending' && c.status === 'PendingReview') ||
                            (statusFilter === 'draft' && c.status === 'Draft');
      
      return matchesSearch && matchesStatus;
    });
  };

  const filteredCourses = getFilteredCourses();

  return (
    <div className="bg-transparent min-h-screen flex flex-col font-sans text-[var(--color-foreground)] transition-colors duration-250" dir="rtl">
      
      {/* Dynamic Background Motif */}
      <div className="absolute inset-x-0 top-0 h-[480px] overflow-hidden pointer-events-none z-0">
        <div className="bg-heritage-pattern opacity-[0.06] absolute inset-0" />
        <div className="absolute inset-0 bg-gradient-to-b from-orange-700/5 via-amber-500/0 to-transparent" />
      </div>

      <div className="flex flex-1 relative z-10">
        
        {/* RIGHT SIDEBAR - Collapse Navigation */}
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
                
                {/* Branding segment */}
                <div className="flex items-center gap-3 px-2 border-b border-orange-900 pb-5">
                  <div className="w-10 h-10 rounded-xl bg-orange-700 flex items-center justify-center shadow-lg border border-orange-600">
                    <Sparkles className="w-5 h-5 text-amber-50" />
                  </div>
                  <div>
                    <h2 className="font-extrabold text-sm tracking-tight text-amber-200">بوابة الأستاذ آثاري</h2>
                    <p className="text-[10px] text-stone-300 font-light">الهيئة التدريسية المعتمدة</p>
                  </div>
                </div>

                {/* Primary navigation Button style for Builder */}
                <button
                  onClick={handleOpenNewCourseBuilder}
                  className="w-full bg-orange-700 hover:bg-orange-800 text-amber-50 font-black text-xs py-3 px-4 rounded-xl transition shadow flex items-center justify-center gap-2 border-0 cursor-pointer hover:scale-102"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>تأليف ومنشأ دبلوم جديد</span>
                </button>

                {/* Links list */}
                <nav className="space-y-1.5 pt-4">
                  
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition text-right text-xs font-bold border-0 cursor-pointer ${
                      activeTab === 'overview' ? 'bg-orange-800 text-amber-200' : 'bg-transparent text-stone-300 hover:bg-orange-900/40 hover:text-white'
                    }`}
                  >
                    <LayoutDashboard className="w-4 h-4 text-orange-500" />
                    <span>لوحة المراقبة ونظرة عامة</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('my-courses')}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition text-right text-xs font-bold border-0 cursor-pointer ${
                      activeTab === 'my-courses' ? 'bg-orange-800 text-amber-200' : 'bg-transparent text-stone-300 hover:bg-orange-900/40 hover:text-white'
                    }`}
                  >
                    <BookOpen className="w-4 h-4 text-orange-500" />
                    <span>سجل ومراجعة دوراتي</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('revisions')}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition text-right text-xs font-bold border-0 cursor-pointer ${
                      activeTab === 'revisions' ? 'bg-orange-800 text-amber-200' : 'bg-transparent text-stone-300 hover:bg-orange-900/40 hover:text-white'
                    }`}
                  >
                    <FileSignature className="w-4 h-4 text-orange-500" />
                    <div className="flex-1 flex justify-between items-center">
                      <span>طلبات تعديل المنهج</span>
                      <span className="bg-amber-400 text-[var(--color-brand-orange-950)] font-black text-[9px] px-1.5 py-0.5 rounded-full">١ معلّق</span>
                    </div>
                  </button>

                  <button
                    onClick={() => setActiveTab('earnings')}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition text-right text-xs font-bold border-0 cursor-pointer ${
                      activeTab === 'earnings' ? 'bg-orange-800 text-amber-200' : 'bg-transparent text-stone-300 hover:bg-orange-900/40 hover:text-white'
                    }`}
                  >
                    <DollarSign className="w-4 h-4 text-orange-500" />
                    <span>عائدات التدقيق المالي ومحاضرينا</span>
                  </button>

                </nav>
              </div>

              {/* Bottom logout area */}
              <div className="pt-6 border-t border-orange-900 space-y-4">
                <div className="flex items-center gap-3 px-1">
                  <div className="w-9 h-9 rounded-full bg-orange-700 flex items-center justify-center text-xs font-bold text-amber-50">أ</div>
                  <div>
                    <h4 className="text-xs font-black">{userName}</h4>
                    <p className="text-[9px] text-[#fbbf24]">مدقق الحلقات التراثية</p>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400 hover:bg-red-950/40 hover:text-red-300 transition text-right text-xs font-semibold cursor-pointer border-0 bg-transparent"
                >
                  <LogOut className="w-4 h-4" />
                  <span>الخروج من كابينة التدريس</span>
                </button>
              </div>

            </motion.aside>
          )}
        </AnimatePresence>

        {/* MAIN COLUMN (LEFT) */}
        <main className="flex-1 px-4 sm:px-8 py-8 overflow-x-hidden min-h-screen">
          
          {/* Header Bar */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 border-b border-amber-100 pb-5">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <button
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="p-1.5 bg-white border border-amber-200/60 rounded-lg text-stone-700 hover:bg-amber-50 lg:flex items-center justify-center cursor-pointer transition hidden"
                  title="تبديل القائمة الجانبية"
                >
                  <Menu className="w-4 h-4" />
                </button>
                <div className="text-[10px] bg-orange-100 text-orange-950 font-bold px-2.5 py-1 rounded-full border border-orange-200 inline">
                  مجلس الإشراف والتدريس
                </div>
              </div>
              <h1 className="text-xl font-extrabold text-stone-900">
                أهلاً بك أستاذ أحمد 👋، إليك ملخص أداء دوراتك اليوم.
              </h1>
              <p className="text-xs text-stone-500 mt-1">تتبع مؤشرات الاستثمار العيني وسير مراجعة مناهجك وتأليفها.</p>
            </div>

            <div className="flex gap-2.5 items-center">
              {/* NOTIFICATIONS SHADCN POPOVER */}
              <div className="relative">
                <button
                  onClick={() => setIsNotifOpen(!isNotifOpen)}
                  className="relative p-2.5 bg-white border border-amber-200/60 rounded-xl text-stone-700 hover:bg-amber-50 cursor-pointer transition flex items-center justify-center shadow-2xs"
                  id="notifications-bell-trigger"
                  title="التنبيهات الأكاديمية"
                >
                  <svg className="w-5 h-5 text-orange-950" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.3" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  {unreadCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white font-mono text-[9px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-xs animate-bounce">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Popover Card */}
                <AnimatePresence>
                  {isNotifOpen && (
                    <>
                      {/* Invisible backdrop to dismiss with click outside */}
                      <div className="fixed inset-0 z-30" onClick={() => setIsNotifOpen(false)} />
                      
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute left-0 mt-2.5 w-80 sm:w-96 bg-white border border-amber-200/80 rounded-2xl shadow-xl z-40 p-4 text-right overflow-hidden"
                        id="notifications-popover-panel"
                      >
                        <div className="flex justify-between items-center pb-3 border-b border-amber-50">
                          <h4 className="font-extrabold text-xs text-stone-900">🔔 التنبيهات والمصادقات ({unreadCount})</h4>
                          {unreadCount > 0 && (
                            <button
                              type="button"
                              onClick={handleMarkAllRead}
                              className="text-[10px] text-orange-700 hover:underline font-bold bg-transparent border-0 cursor-pointer"
                            >
                              تعليم الكل كمقروء
                            </button>
                          )}
                        </div>

                        <div className="divide-y divide-amber-50/60 max-h-80 overflow-y-auto">
                          {notifications.length === 0 ? (
                            <div className="py-8 text-center text-stone-400 text-xs font-light">لا توجد تنبيهات جديدة لك.</div>
                          ) : (
                            notifications.map(notif => (
                              <div 
                                key={notif.id}
                                onClick={() => handleMarkAsRead(notif.id)}
                                className={`py-3 px-1 transition text-right cursor-pointer hover:bg-amber-50/30 flex gap-2.5 items-start ${
                                  notif.unread ? 'bg-orange-50/15' : ''
                                }`}
                              >
                                <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                                  notif.unread ? 'bg-orange-700' : 'bg-transparent'
                                }`} />
                                <div className="space-y-0.5 flex-1">
                                  <div className="flex justify-between items-center gap-2">
                                    <h5 className="font-extrabold text-[11px] text-[var(--color-brand-orange-950)]">{notif.title}</h5>
                                    <span className="text-[9px] text-stone-400 font-mono shrink-0">{notif.time}</span>
                                  </div>
                                  <p className="text-[10px] text-stone-500 leading-relaxed font-light">{notif.description}</p>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              {/* THEME SWITCHER POPOVER WITH CUSTOM COLORS AND MODES */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsThemeOpen(!isThemeOpen)}
                  className="relative p-2.5 bg-white border border-amber-200/60 rounded-xl text-stone-700 hover:bg-amber-50 cursor-pointer transition flex items-center justify-center shadow-2xs"
                  id="theme-dropdown-trigger"
                  title="تخصيص الواجهة والسمات"
                >
                  <Palette className="w-5 h-5 text-orange-950" />
                </button>

                <AnimatePresence>
                  {isThemeOpen && (
                    <>
                      {/* Invisible backdrop to dismiss with click outside */}
                      <div className="fixed inset-0 z-30" onClick={() => setIsThemeOpen(false)} />
                      
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute left-0 mt-2.5 w-64 bg-white border border-amber-200/80 rounded-2xl shadow-xl z-40 p-4 text-right"
                        id="theme-popover-panel"
                      >
                        <div className="pb-2 border-b border-amber-50 mb-3">
                          <h4 className="font-extrabold text-xs text-stone-900 flex items-center gap-1.5">
                            <Palette className="w-4 h-4 text-orange-700" />
                            <span>تخصيص سمت ومظهر المنصة</span>
                          </h4>
                        </div>

                        {/* Part 1: Light/Dark Mode Toggle */}
                        <div className="space-y-2 mb-4">
                          <span className="text-[10px] font-bold text-stone-500 block">نمط العرض (مضيء / مظلم)</span>
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={() => applyThemeMode('light')}
                              className={`py-1.5 px-3 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1.5 transition border cursor-pointer ${
                                themeMode === 'light'
                                  ? 'bg-amber-100 border-amber-400 text-stone-950 shadow-2xs'
                                  : 'bg-stone-50/50 border-stone-200/60 text-stone-500 hover:bg-stone-50'
                              }`}
                            >
                              <Sun className="w-3.5 h-3.5 text-amber-500" />
                              <span>مضيء</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => applyThemeMode('dark')}
                              className={`py-1.5 px-3 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1.5 transition border cursor-pointer ${
                                themeMode === 'dark'
                                  ? 'bg-stone-900 border-stone-700 text-stone-100 shadow-2xs'
                                  : 'bg-stone-50/50 border-stone-200/60 text-stone-500 hover:bg-stone-50'
                              }`}
                            >
                              <Moon className="w-3.5 h-3.5 text-blue-400" />
                              <span>داكن</span>
                            </button>
                          </div>
                        </div>

                        {/* Part 2: Color Palette Themes */}
                        <div className="space-y-2 border-t border-amber-50/75 pt-3">
                          <span className="text-[10px] font-bold text-stone-500 block">أنماط الألوان المتاحة</span>
                          <div className="space-y-1.5">
                            <button
                              type="button"
                              onClick={() => applyThemeColor('gold')}
                              className={`w-full py-1.5 px-3 rounded-lg text-[10px] font-bold flex items-center justify-between transition border cursor-pointer ${
                                themeColor === 'gold'
                                  ? 'bg-[#FDFBF7] border-amber-400 text-amber-950 font-black shadow-3xs'
                                  : 'bg-stone-50/50 border-stone-200/40 text-stone-600 hover:bg-stone-50'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-amber-400 border border-stone-300" />
                                <span>الذهبي الأصيل (آثاري)</span>
                              </div>
                              {themeColor === 'gold' && <span className="text-[9px] text-amber-600">✓ نَشِط</span>}
                            </button>

                            <button
                              type="button"
                              onClick={() => applyThemeColor('forest')}
                              className={`w-full py-1.5 px-3 rounded-lg text-[10px] font-bold flex items-center justify-between transition border cursor-pointer ${
                                themeColor === 'forest'
                                  ? 'bg-[#f0f5f0] border-emerald-400 text-emerald-950 font-black shadow-3xs'
                                  : 'bg-stone-50/50 border-stone-200/40 text-stone-600 hover:bg-stone-50'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-[#6b9e72] border border-stone-300" />
                                <span>الغابة التراثية (Forest)</span>
                              </div>
                              {themeColor === 'forest' && <span className="text-[9px] text-emerald-600">✓ نَشِط</span>}
                            </button>

                            <button
                              type="button"
                              onClick={() => applyThemeColor('graphite')}
                              className={`w-full py-1.5 px-3 rounded-lg text-[10px] font-bold flex items-center justify-between transition border cursor-pointer ${
                                themeColor === 'graphite'
                                  ? 'bg-[#f2f2f2] border-stone-400 text-stone-950 font-black shadow-3xs'
                                  : 'bg-stone-50/50 border-stone-200/40 text-stone-600 hover:bg-stone-50'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-[#707070] border border-stone-300" />
                                <span>الجرافيت الحجري (Graphite)</span>
                              </div>
                              {themeColor === 'graphite' && <span className="text-[9px] text-stone-600">✓ نَشِط</span>}
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              <button
                onClick={handleOpenNewCourseBuilder}
                className="bg-orange-700 hover:bg-orange-800 text-amber-50 text-xs font-bold px-4 py-2.5 rounded-xl transition cursor-pointer border-0 shadow-sm flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>إنشاء دبلوم جديد</span>
              </button>
              
              <button
                onClick={() => {
                  setActiveTab('overview');
                  displayToast('🔄 تم تحديث لوحة التحكم وربطها بقاعدة البيانات الآن.');
                }}
                className="bg-white border border-amber-200 text-stone-700 text-xs font-semibold px-4 py-2.5 rounded-xl transition cursor-pointer hover:bg-amber-50"
              >
                تحديث مؤشرات الأداء
              </button>
            </div>
          </div>

          {/* TAB 1: OVERVIEW PANEL */}
          {activeTab === 'overview' && (
            <motion.div 
              initial={{ opacity: 0, y: 15 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="space-y-8"
              id="instructor-overview-tab"
            >
              {/* Stats Grid (4 cards) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                
                {/* Stat 1: Earnings */}
                <div className="bg-white rounded-2xl p-5 border border-amber-200/60 shadow-xs space-y-4 relative overflow-hidden group">
                  <div className="absolute -left-4 -bottom-4 w-16 h-16 bg-emerald-50 rounded-full group-hover:scale-110 transition" />
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-stone-500 font-bold">إجمالي الأرباح المكتسبة</span>
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex justify-center items-center">
                      <DollarSign className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xl font-extrabold text-stone-900 font-mono">٧٦,٩٠٠ ر.س</h3>
                    <p className="text-[10px] text-emerald-600 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      <span>١٢٪ من الأسبوع الماضي</span>
                    </p>
                  </div>
                </div>

                {/* Stat 2: Students */}
                <div className="bg-white rounded-2xl p-5 border border-amber-200/60 shadow-xs space-y-4 relative overflow-hidden group">
                  <div className="absolute -left-4 -bottom-4 w-16 h-16 bg-blue-50 rounded-full group-hover:scale-110 transition" />
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-stone-500 font-bold">إجمالي رصيد الطلاب</span>
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex justify-center items-center">
                      <Users className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xl font-extrabold text-stone-900 font-mono">٤٧٠ طالب مكيّف</h3>
                    <p className="text-[10px] text-stone-400">ملتحقون بمختلف مقاعد الحلقات</p>
                  </div>
                </div>

                {/* Stat 3: Courses */}
                <div className="bg-white rounded-2xl p-5 border border-amber-200/60 shadow-xs space-y-4 relative overflow-hidden group">
                  <div className="absolute -left-4 -bottom-4 w-16 h-16 bg-teal-50 rounded-full group-hover:scale-110 transition" />
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-stone-500 font-bold">الدورات المنشورة والمقررة</span>
                    <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex justify-center items-center">
                      <BookOpen className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xl font-extrabold text-stone-900 font-mono">٤ مناهج مثرية</h3>
                    <p className="text-[10px] text-teal-600 flex items-center gap-1">منها ١ باللغة الحرة التابعة</p>
                  </div>
                </div>

                {/* Stat 4: Pending review */}
                <div className="bg-white rounded-2xl p-5 border border-amber-200/60 shadow-xs space-y-4 relative overflow-hidden group">
                  <div className="absolute -left-4 -bottom-4 w-16 h-16 bg-amber-50 rounded-full group-hover:scale-110 transition" />
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-stone-500 font-bold">المراجعات وتعديلات الأبواب</span>
                    <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex justify-center items-center">
                      <AlertCircle className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xl font-extrabold text-orange-700 font-mono">٢ قيد المعالجة</h3>
                    <p className="text-[10px] text-amber-700 flex items-center gap-1">بينها صكّ وشهادات معلقة</p>
                  </div>
                </div>

              </div>

              {/* PERFORMANCE INSIGHTS TABBED CHART (RECHARTS) */}
              <div className="bg-white rounded-3xl border border-amber-200/60 p-6 shadow-sm space-y-5" id="performance-insights-card">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-amber-50">
                  <div>
                    <h3 className="font-extrabold text-sm text-stone-900 flex items-center gap-1.5">
                      <TrendingUp className="w-4 h-4 text-orange-700" />
                      <span>رؤى الأداء والنمو المعرفي (آخر ٦ أشهر)</span>
                    </h3>
                    <p className="text-[10.5px] text-stone-500 font-light mt-0.5">دراسة اتجاهات الأرباح المتولدة واستقطاب الدارسين الجدد في مجلسكم الأكاديمي الحصري.</p>
                  </div>
                  
                  {/* Segmented Controls for Switcher */}
                  <div className="flex bg-amber-50/50 p-1 rounded-xl border border-amber-200/50 shrink-0">
                    <button
                      type="button"
                      onClick={() => setInsightMetric('revenue')}
                      className={`px-4 py-1.5 rounded-lg text-[10px] font-bold transition flex items-center gap-1 border-0 cursor-pointer ${
                        insightMetric === 'revenue'
                          ? 'bg-orange-700 text-amber-50 shadow-2xs'
                          : 'text-stone-600 hover:bg-amber-100/50'
                      }`}
                    >
                      <span>📈 المكاسب والريع المالي</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setInsightMetric('students')}
                      className={`px-4 py-1.5 rounded-lg text-[10px] font-bold transition flex items-center gap-1 border-0 cursor-pointer ${
                        insightMetric === 'students'
                          ? 'bg-orange-700 text-amber-50 shadow-2xs'
                          : 'text-stone-600 hover:bg-amber-100/50'
                      }`}
                    >
                      <span>👥 الطلاب والالتحاقات الجدد</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 bg-amber-50/20 p-4 rounded-2xl border border-amber-100 mb-2">
                  <div className="text-right">
                    <span className="text-[9px] text-stone-400 block font-light">إجمالي ريع النصف سنة</span>
                    <span className="text-sm font-black text-orange-950 font-mono">٧٦,٩٠٠ ر.س</span>
                  </div>
                  <div className="text-right border-r border-[#ece3d3]/60 pr-4">
                    <span className="text-[9px] text-stone-400 block font-light">متوسط نمو الاستثمار</span>
                    <span className="text-sm font-black text-teal-700 font-mono">+٢٧.٥%</span>
                  </div>
                  <div className="text-right border-r border-[#ece3d3]/60 pr-4">
                    <span className="text-[9px] text-stone-400 block font-light">مجموع الطلاب الملتحقين</span>
                    <span className="text-sm font-black text-orange-950 font-mono">٤٩٤ طالب نَشِط</span>
                  </div>
                  <div className="text-right border-r border-[#ece3d3]/60 pr-4">
                    <span className="text-[9px] text-stone-400 block font-light">متوسط تقييم المحاضر</span>
                    <span className="text-sm font-black text-amber-600 font-mono">٤.٩ / ٥.٠ ★</span>
                  </div>
                </div>

                {/* CHART CONTAINER */}
                <div className="h-64 sm:h-72 w-full pt-2" dir="ltr">
                  <ResponsiveContainer width="100%" height="100%">
                    {insightMetric === 'revenue' ? (
                      <AreaChart
                        data={PERFORMANCE_INSIGHTS_DATA}
                        margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--color-brand-orange-700)" stopOpacity={0.25}/>
                            <stop offset="95%" stopColor="var(--color-brand-orange-600)" stopOpacity={0.0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#fed7aa" opacity={0.15} />
                        <XAxis 
                          dataKey="month" 
                          stroke="#78716c" 
                          fontSize={10.5}
                          fontWeight="semibold"
                          tickLine={false} 
                        />
                        <YAxis 
                          stroke="#78716c" 
                          fontSize={10.5}
                          fontWeight="bold"
                          tickLine={false}
                          tickFormatter={(value) => `${value.toLocaleString()}`}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'white', 
                            border: '1.5px solid var(--color-border)', 
                            borderRadius: '16px',
                            textAlign: 'right',
                            fontSize: '11px'
                          }}
                          formatter={(value: any) => [`${value.toLocaleString()} ر.س`, 'الإيرادات المحققة']}
                          labelFormatter={(label) => `شهر ${label}`}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="revenue" 
                          stroke="var(--color-brand-orange-700)" 
                          strokeWidth={3} 
                          fillOpacity={1} 
                          fill="url(#colorRevenue)" 
                        />
                      </AreaChart>
                    ) : (
                      <BarChart
                        data={PERFORMANCE_INSIGHTS_DATA}
                        margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#fed7aa" opacity={0.15} />
                        <XAxis 
                          dataKey="month" 
                          stroke="#78716c" 
                          fontSize={10.5}
                          fontWeight="semibold"
                          tickLine={false} 
                        />
                        <YAxis 
                          stroke="#78716c" 
                          fontSize={10.5}
                          fontWeight="bold"
                          tickLine={false}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'white', 
                            border: '1.5px solid var(--color-border)', 
                            borderRadius: '16px',
                            textAlign: 'right',
                            fontSize: '11px'
                          }}
                          formatter={(value: any) => [`${value} طالب جديد`, 'الالتحاقات والطلاب الجدد']}
                          labelFormatter={(label) => `شهر ${label}`}
                        />
                        <Bar 
                          dataKey="students" 
                          fill="var(--color-primary, #C5A565)" 
                          radius={[8, 8, 0, 0]} 
                          barSize={36} 
                        />
                      </BarChart>
                    )}
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Central Main Area: Tables and Side actions */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                
                {/* Recent Courses Table (Left 2 Columns) */}
                <div className="xl:col-span-2 bg-white rounded-3xl border border-amber-200/80 p-6 shadow-sm space-y-6">
                  <div className="flex justify-between items-center pb-4 border-b border-stone-100">
                    <div>
                      <h3 className="font-extrabold text-sm text-stone-900">سجل النشاط وحالة الدورات</h3>
                      <p className="text-[10px] text-stone-500">مجموع المقررات المخطط لها والمرفوعة من قبل مجلسكم الكريم.</p>
                    </div>
                    <span className="text-xs text-orange-700 font-bold hover:underline cursor-pointer" onClick={() => setActiveTab('my-courses')}>
                      تصفح كل المناهج 
                    </span>
                  </div>

                  {/* Advanced Search & Filtering Controls */}
                  <div className="bg-stone-50/50 border border-stone-100 p-4 rounded-2xl flex flex-col lg:flex-row gap-3 items-center justify-between">
                    <div className="relative w-full lg:w-72 border-0 bg-transparent">
                      <Search className="absolute right-3 top-2.5 w-4 h-4 text-stone-400 pointer-events-none" />
                      <input
                        type="text"
                        placeholder="ابحث باسم المنهج أو التصنيف..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full text-xs pr-9 pl-3 py-2 bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 text-right font-sans"
                      />
                    </div>

                    <div className="flex flex-wrap gap-1.5 w-full lg:w-auto">
                      <button
                        type="button"
                        onClick={() => setStatusFilter('all')}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold cursor-pointer transition-all border ${
                          statusFilter === 'all'
                            ? 'bg-[var(--color-contrast)] text-[var(--color-contrast-foreground)] border-[var(--color-contrast)]'
                            : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                        }`}
                      >
                        الكل
                      </button>
                      <button
                        type="button"
                        onClick={() => setStatusFilter('published')}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold cursor-pointer transition-all border flex items-center gap-1 ${
                          statusFilter === 'published'
                            ? 'bg-emerald-700 text-amber-50 border-emerald-700'
                            : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        منشورة ({instructorCourses.filter(c => c.status === 'Published').length})
                      </button>
                      <button
                        type="button"
                        onClick={() => setStatusFilter('pending')}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold cursor-pointer transition-all border flex items-center gap-1 ${
                          statusFilter === 'pending'
                            ? 'bg-amber-600 text-amber-50 border-amber-600'
                            : 'bg-white text-stone-600 border-stone-300 hover:bg-stone-50'
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        تحت المراجعة ({instructorCourses.filter(c => c.status === 'PendingReview').length})
                      </button>
                      <button
                        type="button"
                        onClick={() => setStatusFilter('draft')}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold cursor-pointer transition-all border flex items-center gap-1 ${
                          statusFilter === 'draft'
                            ? 'bg-stone-600 text-amber-50 border-stone-600'
                            : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-stone-400" />
                        مسودة ({instructorCourses.filter(c => c.status === 'Draft').length})
                      </button>
                    </div>

                    {(searchTerm || statusFilter !== 'all') && (
                      <button
                        type="button"
                        onClick={() => {
                          setSearchTerm('');
                          setStatusFilter('all');
                        }}
                        className="text-[10px] font-bold text-red-600 hover:underline cursor-pointer border-0 bg-transparent pr-1"
                      >
                        تصفية الفلاتر ×
                      </button>
                    )}
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-right text-xs max-w-full">
                      <thead>
                        <tr className="border-b border-amber-100 text-stone-500 font-bold">
                          <th className="pb-3 pr-2 font-black">عنوان المقرّر الرئيسي</th>
                          <th className="pb-3 text-center font-black">حالة النشر الأكاديمي</th>
                          <th className="pb-3 text-center font-black">عدد الطلاب</th>
                          <th className="pb-3 text-center font-black">الإيرادات المترتبة</th>
                          <th className="pb-3 pl-2 text-center font-black">الخيار</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-amber-50">
                        {filteredCourses.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="py-8 text-center text-stone-400 font-light">
                              لا توجد دورات مطابقة للمعايير المحددة.
                            </td>
                          </tr>
                        ) : (
                          filteredCourses.map((c) => (
                          <tr key={c.id} className="hover:bg-amber-50/20 transition-colors">
                            <td className="py-4 pr-1">
                              <div className="flex items-center gap-3">
                                <img src={c.thumbnail} alt="" className="w-10 h-10 rounded-lg object-cover border border-amber-100" />
                                <div className="space-y-0.5">
                                  <h4 className="font-extrabold text-orange-700 max-w-sm leading-snug line-clamp-2">{c.title}</h4>
                                  <p className="text-[9px] text-stone-400">قسم: {c.category}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 text-center">
                              {c.status === 'Published' && (
                                <Badge variant="success">
                                  <CheckCircle className="w-3 h-3" />
                                  <span>منشورة</span>
                                </Badge>
                              )}
                              {c.status === 'PendingReview' && (
                                <Badge variant="warning">
                                  <AlertCircle className="w-3 h-3" />
                                  <span>قيد المراجعة</span>
                                </Badge>
                              )}
                              {c.status === 'Draft' && (
                                <Badge variant="secondary">
                                  <Settings className="w-3 h-3" />
                                  <span>مسودة</span>
                                </Badge>
                              )}
                            </td>
                            <td className="py-4 text-center font-mono font-semibold text-stone-800">
                              {c.status === 'Draft' ? '—' : `${c.studentsCount} دارس`}
                            </td>
                            <td className="py-4 text-center font-mono font-bold text-orange-950">
                              {c.status === 'Draft' ? '—' : `${c.revenue.toLocaleString()} ر.س`}
                            </td>
                            <td className="py-4 text-center">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() => handleEditExistingCourse(c)}
                                  className="p-1 text-stone-400 hover:text-orange-700 hover:bg-orange-50 rounded transition border-0 bg-transparent cursor-pointer"
                                  title="تعديل المنهج الأساسي"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => {
                                    setInstructorCourses(instructorCourses.filter(item => item.id !== c.id));
                                    displayToast('تم سحب المنهج وقرائنه بنجاح.');
                                  }}
                                  className="p-1 text-stone-400 hover:text-red-700 hover:bg-red-50 rounded transition border-0 bg-transparent cursor-pointer"
                                  title="حذف وحفظ الأرشيف"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        )))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Quick Actions (Right Column) */}
                <div className="space-y-6">
                  
                  {/* Actions card */}
                  <div className="bg-white rounded-3xl border border-amber-200/80 p-6 shadow-sm space-y-4">
                    <h3 className="font-extrabold text-sm text-stone-900 border-b border-amber-100 pb-3 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-orange-700 animate-pulse" />
                      <span>الكابينة السريعة للإجراءات</span>
                    </h3>

                    <div className="space-y-2.5">
                      
                      <button
                        onClick={handleOpenNewCourseBuilder}
                        className="w-full text-right bg-gradient-to-l from-orange-700 to-orange-800 hover:from-orange-800 hover:to-orange-950 text-amber-50 p-3.5 rounded-xl text-xs font-bold transition flex items-center justify-between shadow border-0 cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <Plus className="w-4 h-4" />
                          <span>تأليف دبلوم أكاديمي جديد</span>
                        </div>
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => {
                          displayToast('🔔 جاري تفريغ ومراجعة إسنادات وصكوك الإجازة المرفوعة لقسم المراجعة.');
                          setActiveTab('revisions');
                        }}
                        className="w-full text-right bg-[var(--color-brand-orange-950)]/5 hover:bg-[var(--color-brand-orange-950)]/10 text-[var(--color-brand-orange-950)] p-3.5 rounded-xl text-xs font-bold transition flex items-center justify-between border-0 cursor-pointer"
                      >
                        <div className="flex items-center gap-3 text-stone-700">
                          <FileSignature className="w-4 h-4 text-orange-700" />
                          <span>مراجعة طلبات التعديل المعلقة</span>
                        </div>
                        <ChevronLeft className="w-3.5 h-3.5 text-stone-500" />
                      </button>

                      <button
                        onClick={() => {
                          displayToast('🏦 تم إرسال طلب تصفير العائدات وجدولة سحب الأرباح للحساب البنكي المعتمد.');
                        }}
                        className="w-full text-right bg-stone-50 border border-amber-200/90 hover:bg-amber-100/40 p-3.5 rounded-xl text-xs font-bold transition flex items-center justify-between text-stone-700 cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <DollarSign className="w-4 h-4 text-emerald-700" />
                          <span>طلب تسوية وسحب أرباح التدريس</span>
                        </div>
                        <ChevronLeft className="w-3.5 h-3.5 text-stone-500" />
                      </button>

                    </div>
                  </div>

                  {/* Trust Advice Callout Card */}
                  <div className="bg-orange-50/20 border border-dashed border-stone-200 rounded-3xl p-5 text-right space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-amber-100 rounded-full flex items-center justify-center text-amber-700">
                        <LineCheckIcon />
                      </div>
                      <h4 className="font-extrabold text-xs text-stone-900">ميثاق التدريس والتحقيق العيني</h4>
                    </div>
                    <p className="text-[10px] text-stone-500 leading-relaxed font-light">
                      حرصاً على مصداقية ورصانة صك الإجازة التي يصادفها الدارس بآثاري، نلتزم في هيئة الإشراف بتصنيف وفلترة جميع مقررات الفيديو والمحاضرات للتحقق التام من مصادر المعلومات وصحتها اللغوية والأثرية.
                    </p>
                  </div>

                </div>

              </div>
            </motion.div>
          )}

          {/* TAB 2: MY COURSES */}
          {activeTab === 'my-courses' && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
              id="instructor-courses-tab"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-base font-extrabold text-orange-700 font-serif">سجل الدورات والمناهج التابعة لك</h2>
                  <p className="text-xs text-stone-500">مراجعة وتحرير المخرجات التفاعلية وأسماء الدارسين المعتمدين.</p>
                </div>
                <button
                  onClick={handleOpenNewCourseBuilder}
                  className="bg-orange-700 hover:bg-orange-800 text-amber-50 text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer border-0 shadow-sm flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>تأليف منهج تالي</span>
                </button>
              </div>

              {filteredCourses.length === 0 ? (
                <div className="bg-white border border-amber-200/70 rounded-2xl p-8 text-center max-w-lg mx-auto space-y-4">
                  <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
                  <h3 className="font-extrabold text-[var(--color-brand-orange-950)] text-sm">لم يتم العثور على مقررات مطابقة</h3>
                  <p className="text-xs text-stone-500 leading-relaxed font-light">
                    لا يتوفر حالياً بالمنصة أي مقرر يطابق بحثك الحالي. يرجى المحاولة بقيمة بحث أخرى أو إعادة التصفية الأكاديمية.
                  </p>
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setStatusFilter('all');
                    }}
                    className="px-4 py-2 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-xl text-xs font-bold cursor-pointer transition-all shrink-0"
                  >
                    تصفية الفلاتر والعودة للكل
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCourses.map((c) => (
                  <div key={c.id} className="bg-white rounded-2xl border border-amber-200/70 overflow-hidden flex flex-col justify-between hover:scale-101 transition shadow-sm">
                    <div className="relative h-40">
                      <img src={c.thumbnail} alt={c.title} className="w-full h-full object-cover" />
                      <div className="absolute top-4 right-4 flex gap-1">
                        {c.status === 'Published' && (
                          <Badge variant="success">منشور بمجلس آثاري</Badge>
                        )}
                        {c.status === 'PendingReview' && (
                          <Badge variant="warning">قيد المراجعة العلمية</Badge>
                        )}
                        {c.status === 'Draft' && (
                          <Badge variant="secondary">مسودة أولية</Badge>
                        )}
                      </div>
                    </div>

                    <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                      <div className="space-y-1.5">
                        <span className="text-[10px] text-orange-800 font-bold tracking-wider">{c.category}</span>
                        <h3 className="font-extrabold text-sm text-stone-900 leading-snug line-clamp-2">{c.title}</h3>
                        <p className="text-[10px] text-stone-500 leading-relaxed font-light">يحتوي هذا المنهج حالياً على {c.lessonsCount} درساً تفاعلياً مصدّقاً بالصوت والصورة.</p>
                      </div>

                      <div className="space-y-3 pt-3 border-t border-amber-100 text-xs">
                        <div className="flex justify-between items-center text-stone-500 font-mono">
                          <span>الدارسين النشطين:</span>
                          <span className="font-bold text-stone-900">{c.studentsCount} طالب</span>
                        </div>
                        <div className="flex justify-between items-center text-stone-500 font-mono">
                          <span>الإيراد المتولد:</span>
                          <span className="font-bold text-orange-950 font-sans">{c.revenue.toLocaleString()} ر.س</span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 pt-2">
                          <button
                            onClick={() => handleEditExistingCourse(c)}
                            className="bg-orange-700 hover:bg-orange-800 text-amber-50 rounded-xl text-center font-bold py-2 transition border-0 cursor-pointer text-xs"
                          >
                            تعديل المنهج
                          </button>
                          <button
                            onClick={() => {
                              setInstructorCourses(instructorCourses.filter(item => item.id !== c.id));
                              displayToast('تم سحب المنهج وقرائنه بنجاح.');
                            }}
                            className="bg-stone-50 hover:bg-red-50 text-stone-500 hover:text-red-700 rounded-xl text-center font-medium py-2 transition border border-stone-200 cursor-pointer text-xs"
                          >
                            حذف وإلغاء
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                </div>
              )}
            </motion.div>
          )}

          {/* TAB 3: COURSE BUILDER (MULTI-STEP WIZARD) */}
          {activeTab === 'course-builder' && (
            <CourseBuilder
              onBack={() => setActiveTab('overview')}
              onTriggerToast={displayToast}
              initialCourse={editingCourseId ? instructorCourses.find(c => c.id === editingCourseId) as any : null}
              onSave={(submittedCourse: any) => {
                const isEditing = instructorCourses.some(item => item.id === submittedCourse.id);
                // Integrate with original lists
                const newCourseObj = {
                  id: submittedCourse.id || `inst_${Date.now()}`,
                  title: submittedCourse.title || "دورة غير معنونة",
                  category: submittedCourse.category || "الفنون والعمارة التراثية",
                  categorySlug: submittedCourse.categorySlug || "heritage-art",
                  instructorName: submittedCourse.instructorName || userName,
                  instructorAvatar: submittedCourse.instructorAvatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
                  rating: submittedCourse.rating || 5,
                  status: submittedCourse.status || "PendingReview",
                  studentsCount: submittedCourse.studentsCount || 0,
                  revenue: submittedCourse.revenue || 0,
                  thumbnail: submittedCourse.thumbnail || "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400",
                  lessonsCount: submittedCourse.lessonsCount || 8,
                  duration: submittedCourse.duration || "١٤ ساعة",
                  price: submittedCourse.price || 150
                };
                
                if (isEditing) {
                  setInstructorCourses(instructorCourses.map(item => item.id === submittedCourse.id ? newCourseObj : item));
                } else {
                  setInstructorCourses([newCourseObj, ...instructorCourses]);
                }
                
                // Update parent lists
                setCoursesList([submittedCourse as any, ...coursesList.filter(c => c.id !== submittedCourse.id)]);
                displayToast('🏮 تم حفظ وإرسال الدبلوم الأكاديمي للجهة الاستشارية بآثاري!');
                setActiveTab('overview');
              }}
            />
          )}

          {/* TAB 4: REVISIONS */}
          {activeTab === 'revisions' && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl border border-amber-200/85 p-6 sm:p-8 shadow-xs space-y-6"
              id="instructor-revisions-tab"
            >
              <div>
                <h2 className="text-base font-extrabold text-orange-700 font-serif">طلبات التعديل والتدقيق العلمي المعلقة</h2>
                <p className="text-xs text-stone-500 leading-relaxed font-light">
                  تقوم اللجنة الاستشارية بتسجيل ملاحظاتها التقويمية واللغوية وتمريرها إليك هنا لملاءمة مساقات ميثاق منصة آثاري المعرفي.
                </p>
              </div>

              <div className="p-5 rounded-2xl border border-stone-200 bg-orange-50/20 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-extrabold text-xs text-stone-900">ملاحظة التدقيق في: فلسفة تناسب النقطة والقياس الهندسي المعتمد</h4>
                    <p className="text-[10px] text-stone-500 font-bold font-mono">رقم الإشراف: ADV-4015</p>
                  </div>
                  <span className="bg-amber-100 border border-amber-200 text-amber-900 text-[9px] font-bold py-1 px-3 rounded-full">بانتظار الإجراء</span>
                </div>

                <div className="text-xs text-stone-700 leading-relaxed space-y-1.5 pt-2">
                  <p>🔹 <strong>التوصية المقررة:</strong> "نوصي بتعديل أو تدبيج المستند التحقيقي المعتمد بإرفاق النماذج الفاطمية المصورة بقرطبة وتونس لإرشاد الدارسين."</p>
                  <p>🔹 <strong>معد الملاحظة:</strong> م. عبد الرحمن البغدادي (الهيئة الفنية)</p>
                </div>

                <div className="pt-3 flex gap-2">
                  <button
                    onClick={() => {
                      setEditingCourseId("inst_2");
                      setActiveTab('course-builder');
                      displayToast('جاري استيراد وتوجيه كراسة المناهج لبناء المنهج والتعديل المباشر.');
                    }}
                    className="bg-orange-700 hover:bg-orange-800 text-amber-50 text-[10px] font-bold px-4 py-2 rounded-lg border-0 cursor-pointer"
                  >
                    تعديل المنهج فوراً
                  </button>
                  <button
                    onClick={() => displayToast('تم الرد برسالة موثقة لفضيلة المشرف المدقق.')}
                    className="bg-stone-100 hover:bg-stone-200 text-stone-700 text-[10px] font-medium px-4 py-2 rounded-lg border-0"
                  >
                    مراسلة المشرف للأمانة العلمية
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 5: EARNINGS DETAIL */}
          {activeTab === 'earnings' && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl border border-amber-200/85 p-6 sm:p-8 shadow-xs space-y-8"
              id="instructor-earnings-tab"
            >
              <div>
                <h2 className="text-base font-extrabold text-orange-700 flex items-center gap-2 font-serif">
                  <DollarSign className="w-5 h-5 text-orange-700" />
                  <span>عائدات وتصفية المحاضرات التفاعلية</span>
                </h2>
                <p className="text-xs text-stone-500 font-light leading-relaxed">
                  تجد هنا تفاصيل الإيرادات المتولدة من شراء مقاعد المناهج والتحويل البنكي والتحقق المعتمد.
                </p>
              </div>

              {/* Bank Acc information summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className="bg-stone-50 border border-amber-100 p-5 rounded-2xl text-right space-y-3">
                  <h4 className="font-extrabold text-xs text-stone-900">الهوية والحساب المالي المعتمد</h4>
                  <div className="text-xs text-stone-600 space-y-1.5 font-light">
                    <p>🏦 <strong>البنك المسجل:</strong> بنك الراجحي الإسلامي</p>
                    <p>📜 <strong>اسم الحساب المعتمد:</strong> أحمد عبد القادر التميمي</p>
                    <p>🔑 <strong>الآيبان النشط للتحويل:</strong> <span className="font-mono text-[11px] font-bold select-all">SA82 8000 0012 3456 7890 1234</span></p>
                  </div>
                </div>

                <div className="bg-orange-50/20 border border-stone-200 p-5 rounded-2xl flex flex-col justify-between text-right">
                  <div>
                    <span className="text-[10px] text-stone-500 font-bold block mb-1">الرصيد المتاح للسحب اليوم</span>
                    <h3 className="text-2xl font-black text-orange-950 font-mono">٥٢,٣٢٠ ر.س</h3>
                  </div>

                  <button
                    onClick={() => displayToast('🏦 تم تسجيل تسوية مصرفية بقيمة ٥٢,٣٢٠ ر.س بنجاح، جاري معالجة التحويل البنكي للراجحي.')}
                    className="w-full bg-orange-700 hover:bg-orange-800 text-amber-50 text-xs font-bold py-2.5 rounded-xl transition border-0 block cursor-pointer mt-4"
                  >
                    تصفية وسحب الرصيد البنكي للراجع
                  </button>
                </div>

              </div>
            </motion.div>
          )}

        </main>
      </div>
    </div>
  );
}

// Simple Helper Components for Layout or missing icons
function LineCheckIcon() {
  return (
    <svg className="w-4 h-4 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5h-18a2 2 0 00-2 2v10a2 2 0 002 2h18a2 2 0 002-2V14a2 2 0 00-2-2z" />
    </svg>
  );
}
