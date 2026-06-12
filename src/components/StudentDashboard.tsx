import { useState } from 'react';
import { COURSES, LIVE_SESSIONS } from '../data';
import { Course, LiveSession } from '../types';
import ManuscriptCertificate from './ManuscriptCertificate';
import LearningRoom from './LearningRoom';
import QuizTaking from './QuizTaking';
import LiveSessionRoom from './LiveSession';
import MessagingCenter from './MessagingCenter';
import AdvancedProfile from './AdvancedProfile';
import WishlistRefunds from './WishlistRefunds';
import InstructorApply from './InstructorApply';
import { 
  Layout, 
  BookOpen, 
  Award, 
  Heart, 
  Bell, 
  User, 
  LogOut, 
  Play, 
  CheckCircle, 
  Calendar, 
  ChevronLeft, 
  Tv, 
  Clock, 
  Check, 
  Bookmark, 
  Menu, 
  Smile, 
  Volume2, 
  BookOpenCheck,
  AwardIcon,
  HelpCircle,
  Share2,
  Download,
  ExternalLink,
  X,
  GraduationCap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface StudentDashboardProps {
  onLogout: () => void;
  userName?: string;
  onNavigateToCatalog: () => void;
}

type DashboardTab = 'overview' | 'my-courses' | 'certificates' | 'favorites' | 'notifications' | 'profile' | 'instructor-apply';

export default function StudentDashboard({
  onLogout,
  userName = 'أحمد التميمي',
  onNavigateToCatalog
}: StudentDashboardProps) {
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  // Simulated Class/Lesson Player state
  const [activePlaybackCourse, setActivePlaybackCourse] = useState<Course | null>(null);
  const [playbackNotification, setPlaybackNotification] = useState<string | null>(null);
  
  // Real active dynamic views for Phase 4
  const [playingQuizId, setPlayingQuizId] = useState<string | null>(null);
  const [isPlayingLiveSession, setIsPlayingLiveSession] = useState(false);

  // Share & download simulation states
  const [sharingCert, setSharingCert] = useState<{ id: string; title: string } | null>(null);
  const [downloadingCertId, setDownloadingCertId] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState(0);

  const handleSimulateDownload = (certId: string, certTitle: string) => {
    if (downloadingCertId) return;
    setDownloadingCertId(certId);
    setDownloadProgress(0);
    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setDownloadingCertId(null);
            handleTriggerToast(`تم تدبيج وحفظ الإجازة الشريفة بنجاح باسم 'Athary_${userName.replace(/ /g, "_")}_${certId}.pdf' 📜`);
          }, 450);
          return 100;
        }
        return prev + 25;
      });
    }, 120);
  };

  // Filter courses that are in progress for the student
  const studentCourses = COURSES.filter(c => c.progress !== undefined);
  const favoriteCourses = COURSES.slice(2, 4);

  // Framer Motion entrance & stagger animation variants
  const containerVariants: any = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants: any = {
    hidden: { y: 18, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 260, damping: 22 } }
  };

  const notifications = [
    { id: '1', title: 'تمت مصادقة وتدبيج شهادة العمارة الإسلامية الخاص بك مسبقاً!', date: 'منذ ساعتين' },
    { id: '2', title: 'دورة أدب الأندلس تبدأ البث المباشر مجلساً غداً بعد صلاة العشاء.', date: 'منذ يوم واحد' },
    { id: '3', title: 'نصيحة المعلم: راجع البند الخامس في خط الثلث قبل حل الواجب الشهري.', date: 'منذ يومين' }
  ];

  const handleTriggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleJoinLive = (session: LiveSession) => {
    setIsPlayingLiveSession(true);
    handleTriggerToast(`جاري الاتصال بالغرفة الافتراضية للبث الحصري: ${session.title}`);
  };

  // Sidebar navigation links
  const menuItems = [
    { id: 'overview' as DashboardTab, label: 'نظرة عامة', icon: <Layout className="w-5 h-5" /> },
    { id: 'my-courses' as DashboardTab, label: 'دوراتي المفتوحة', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'certificates' as DashboardTab, label: 'الشهادات والإجازات', icon: <Award className="w-5 h-5" /> },
    { id: 'favorites' as DashboardTab, label: 'المفضلة وطلب الاسترداد', icon: <Heart className="w-5 h-5" /> },
    { id: 'notifications' as DashboardTab, label: 'مركز الرسائل والتنبيهات', icon: <Bell className="w-5 h-5" /> },
    { id: 'profile' as DashboardTab, label: 'الملف الشخصي والضبط', icon: <User className="w-5 h-5" /> },
    { id: 'instructor-apply' as DashboardTab, label: 'الانضمام كمدرب', icon: <GraduationCap className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-transparent font-sans flex text-right text-[var(--color-foreground)] transition-colors duration-250" dir="rtl" id="athary-student-dashboard">
      
      {/* Toast Notification popup */}
      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-50 bg-stone-900 text-amber-50 px-5 py-4 rounded-xl shadow-2xl border-r-4 border-amber-500 text-xs flex items-center gap-2 animate-slide-in">
          <span className="w-2 h-2 bg-amber-500 rounded-full animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container */}
      <div className="flex-1 flex flex-col md:flex-row w-full max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 gap-6">

        {/* Dynamic Navigation Sidebar */}
        <aside 
          className={`bg-white border border-amber-200/80 rounded-3xl p-5 flex flex-col justify-between shadow-sm transition-all duration-300 ${
            sidebarCollapsed ? 'w-full md:w-20' : 'w-full md:w-72'
          }`}
          id="dashboard-sidebar"
        >
          <div className="space-y-6">
            
            {/* Sidebar toggle and logo item */}
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

            {/* Sidebar core links */}
            <nav className="space-y-1">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => { setActiveTab(item.id); setActivePlaybackCourse(null); }}
                  className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-xs font-bold transition-all ${
                    activeTab === item.id && !activePlaybackCourse
                      ? 'bg-orange-700 text-amber-50 shadow-md transform hover:translate-x-[-2px]'
                      : 'text-stone-700 hover:bg-orange-50/50 hover:text-orange-955'
                  }`}
                  id={`sidebar-tab-${item.id}`}
                >
                  <span className={activeTab === item.id && !activePlaybackCourse ? 'text-amber-300' : 'text-stone-500'}>
                    {item.icon}
                  </span>
                  {!sidebarCollapsed && <span>{item.label}</span>}
                </button>
              ))}
            </nav>

          </div>

          {/* Sidebar bottom action: Logout */}
          <div className="pt-6 border-t border-amber-100 mt-6">
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-xs font-bold text-stone-600 hover:bg-red-50 hover:text-red-700 transition"
              id="sidebar-logout-btn"
            >
              <LogOut className="w-5 h-5 text-stone-400" />
              {!sidebarCollapsed && <span>تسجيل الخروج</span>}
            </button>
          </div>

        </aside>

        {/* Left main area: Tab Contents */}
        <main className="flex-1 min-w-0" id="dashboard-tab-content">
          
          {/* Detailed Classroom Sub-views Router for Phase 4 */}
          {isPlayingLiveSession ? (
            <LiveSessionRoom 
              sessionTitle={activePlaybackCourse ? `بث مباشر: لـ ${activePlaybackCourse.title}` : undefined}
              onLeave={() => setIsPlayingLiveSession(false)}
            />
          ) : playingQuizId ? (
            <QuizTaking 
              quizId={playingQuizId}
              onFinishQuiz={(scorePercent) => {
                if (activePlaybackCourse) {
                  activePlaybackCourse.progress = 100;
                  // Force list state update
                  setActivePlaybackCourse({ ...activePlaybackCourse });
                }
                setPlayingQuizId(null);
                handleTriggerToast(`🎉 هنيئاً لك! لقد أكملت التقييم وحصلت على نسبة ${scorePercent}% واكتمل المسار الدراسي بنسبة ١٠٠٪!`);
              }}
              onCancel={() => setPlayingQuizId(null)}
            />
          ) : activePlaybackCourse ? (
            <LearningRoom 
              courseId={activePlaybackCourse.id}
              courseTitle={activePlaybackCourse.title}
              onNavigateBack={() => setActivePlaybackCourse(null)}
              onOpenQuiz={(quizId) => {
                if (quizId === 'live_broadcast') {
                  setIsPlayingLiveSession(true);
                } else {
                  setPlayingQuizId(quizId);
                }
              }}
              onOpenCertificate={() => {
                setActiveTab('certificates');
                setActivePlaybackCourse(null);
                handleTriggerToast('📜 تم توجيهك لصفحة الشهادات والإجازات الشريفة لتدبيج وثيقتك!');
              }}
            />
          ) : (
            /* Normal Tabs Views Container */
            <div className="space-y-6">
              
              {/* HEADER WELCOME BANNER (Always shown on tabs for dashboard feel) */}
              <header className="bg-white rounded-3xl border border-amber-200/80 p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm text-right">
                <div>
                  <span className="text-xs font-bold text-orange-705 text-orange-700 block">مجلس التحصيل الدراسي المنفذ</span>
                  <h1 className="text-xl sm:text-2xl font-black text-stone-950 mt-1 block">
                    مرحباً بعودتك، {userName} الأصيل 👋
                  </h1>
                </div>
                
                {/* Visual Quick stat tag */}
                <div className="flex gap-4 self-stretch sm:self-auto justify-between bg-stone-50 p-4 rounded-2xl border border-amber-100">
                  <div className="text-center px-2">
                    <span className="block text-xl font-extrabold text-orange-850">٣</span>
                    <span className="block text-[10px] text-stone-500 font-semibold mt-0.5">مسارات قيد الدراسة</span>
                  </div>
                  <div className="w-px bg-amber-200" />
                  <div className="text-center px-2">
                    <span className="block text-xl font-extrabold text-teal-700">٢</span>
                    <span className="block text-[10px] text-stone-500 font-semibold mt-0.5">شهادات وإجازات</span>
                  </div>
                </div>
              </header>

              {/* TAB 1: OVERVIEW */}
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
                  
                  {/* CONTINUE LEARNING BANNER CARD */}
                  <section className="bg-gradient-to-l from-orange-750 from-orange-700 to-amber-700 text-amber-50 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-md">
                    <div className="absolute inset-0 bg-heritage-pattern opacity-[0.08] pointer-events-none" />
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                      
                      <div className="space-y-3 flex-1">
                        <span className="bg-amber-500 text-stone-950 font-extrabold text-[9px] px-3 py-1 rounded-full uppercase leading-none">متابعة الدرس الأخير</span>
                        <h3 className="text-base sm:text-lg font-bold leading-snug">
                          فلسفة العمارة الإسلامية والتصميم التراثي وتطوره عبر العصور
                        </h3>
                        <p className="text-xs text-amber-100/95 font-light">الدرس التالي: العقود والأقواس في المسجد الأموي بدمشق - م. عبد الرحمن البغدادي</p>
                        
                        {/* Progress slider bar dynamic */}
                        <div className="pt-2">
                          <div className="flex justify-between items-center text-xs mb-1">
                            <span>التقدم المنجز بالمسار: ٦٥٪ مكتمل</span>
                            <span>٩ دروس من أصل ١٤</span>
                          </div>
                          <div className="w-full bg-orange-950/40 h-2 rounded-full overflow-hidden">
                            <div className="bg-amber-400 h-full" style={{ width: '65%' }}></div>
                          </div>
                        </div>
                      </div>

                      <button 
                        onClick={() => {
                          const c = COURSES.find(item => item.id === 'course_1') || COURSES[0];
                          setActivePlaybackCourse(c);
                        }}
                        className="bg-amber-50 hover:bg-amber-100 text-orange-900 font-extrabold px-6 py-4 rounded-xl text-xs transition flex items-center justify-center gap-1.5 self-start md:self-auto shrink-0 shadow-lg"
                        id="continue-learning-btn"
                      >
                        <Play className="w-4 h-4 fill-current ml-[-2px] text-orange-700" />
                        <span>متابعة المشاهدة الآن</span>
                      </button>

                    </div>
                  </section>

                  {/* ACTIVE COURSES GRID */}
                  <section className="space-y-4">
                    <h2 className="text-sm font-bold text-stone-900 pr-1">مقرراتي المفعلة حظوتها</h2>
                    
                    <motion.div 
                      variants={containerVariants}
                      initial="hidden"
                      animate="show"
                      className="grid grid-cols-1 md:grid-cols-2 gap-6"
                    >
                      {studentCourses.map((course) => (
                        <motion.div 
                          key={course.id}
                          variants={itemVariants}
                          className="bg-white rounded-2xl p-5 border border-amber-200/60 shadow-sm flex flex-col justify-between hover:border-amber-300 transition duration-150"
                        >
                          <div className="flex gap-4 items-start pb-4 border-b border-amber-50">
                            <img 
                              src={course.thumbnail} 
                              alt={course.title} 
                              className="w-16 h-16 rounded-xl object-cover border border-amber-100"
                              referrerPolicy="no-referrer"
                            />
                            <div className="space-y-1 py-0.5 text-right">
                              <span className="text-[10px] bg-orange-50 text-orange-750 font-bold px-2 py-0.5 rounded">
                                {course.category}
                              </span>
                              <h4 className="font-bold text-xs sm:text-xs text-stone-905 text-stone-900 leading-tight line-clamp-2 mt-1">
                                {course.title}
                              </h4>
                            </div>
                          </div>

                          <div className="pt-4 space-y-3">
                            <div className="space-y-1">
                              <div className="flex justify-between items-center text-[11px] text-stone-500">
                                <span>التقدم: {course.progress || 0}٪ مكتمل</span>
                                <span>أ. {course.instructorName.split(' ')[2] || 'الهاشمي'}</span>
                              </div>
                              <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden">
                                <div 
                                  className="bg-orange-700 h-full transition-all duration-500" 
                                  style={{ width: `${course.progress || 0}%` }}
                                ></div>
                              </div>
                            </div>

                            <div className="flex justify-between items-center pt-2">
                              {course.progress === 100 ? (
                                <span className="flex items-center gap-1.5 text-xs text-teal-700 font-extrabold pr-1">
                                  <Check className="w-4 h-4" />
                                  <span>مكتمل! اطلب الإجازة</span>
                                </span>
                              ) : (
                                <span className="text-[10px] text-stone-500 font-light truncate max-w-[160px]" title={course.nextLesson}>
                                  التالي: {course.nextLesson || 'مقدمة الباب الأول'}
                                </span>
                              )}

                              <button
                                onClick={() => setActivePlaybackCourse(course)}
                                className="bg-orange-55 text-orange-755 hover:bg-orange-100 text-[11px] font-bold px-3 transition-colors py-2 rounded-lg"
                              >
                                {course.progress === 100 ? 'مراجعة المادة' : 'الدخول للغرفة'}
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  </section>

                  {/* BOTTOM ROWS: UPCOMING LIVE SESSION + TRUST ADVICE */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    {/* Upcoming Live session box */}
                    <div className="md:col-span-2 bg-white rounded-3xl p-6 border border-amber-200/60 shadow-sm space-y-4">
                      
                      <div className="flex items-center justify-between pb-3 border-b border-amber-50">
                        <span className="flex items-center gap-2 text-xs font-bold text-stone-900">
                          <Calendar className="w-4 h-4 text-orange-700" />
                          <span>مجالس البث المباشر القادمة</span>
                        </span>
                        <span className="text-[10px] text-orange-750 font-bold bg-orange-100/50 px-2 py-0.5 rounded">بث مرئي حيّ</span>
                      </div>

                      <div className="space-y-4 divide-y divide-amber-50">
                        {LIVE_SESSIONS.map((session) => (
                          <div key={session.id} className="pt-3 first:pt-0 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                            <div className="space-y-1">
                              <h4 className="font-bold text-xs text-stone-900 leading-snug">{session.title}</h4>
                              <p className="text-[11px] text-stone-500 font-light flex items-center gap-2">
                                <span>المعلم: {session.instructor}</span>
                                <span>•</span>
                                <span>الموعد: {session.date} ({session.time})</span>
                              </p>
                            </div>
                            
                            <button
                              onClick={() => handleJoinLive(session)}
                              className="bg-orange-700 hover:bg-orange-850 text-amber-50 font-bold px-4 py-2 border border-orange-700 hover:border-orange-850 rounded-xl text-[10px] cursor-pointer transition shadow-sm w-full sm:w-auto text-center"
                            >
                              انضمام للبث
                            </button>
                          </div>
                        ))}
                      </div>

                    </div>

                    {/* Quick Advice callout box */}
                    <div className="bg-amber-100/35 rounded-3xl p-6 border border-amber-200/50 flex flex-col justify-between text-right">
                      
                      <div className="space-y-2">
                        <span className="text-[9px] bg-amber-500 text-stone-950 px-2 py-0.5 rounded font-extrabold uppercase">وصية المجلس المعرفي</span>
                        <h4 className="font-bold text-xs text-stone-900">أحمد بن تميم، ركيزة التعلم الرصينة:</h4>
                        <p className="text-[11px] text-stone-600 leading-relaxed font-light">
                          "احرص على أخذ قسط دائم من تدوين الملاحظات اليدوية. لقد وجد باحثونا التراثيون الفنيون أن رسم الحروف بيدك يرسخ موازين البصر ٧٠٪ أفضل عن الكتابة الفورية."
                        </p>
                      </div>

                      <div className="pt-4 border-t border-amber-100 flex items-center gap-3">
                        <Smile className="w-10 h-10 text-orange-700 shrink-0" />
                        <div>
                          <p className="font-bold text-[11px] text-stone-850">مكتب التوثيق والإسناد</p>
                          <p className="text-[9px] text-stone-500">منصة آثاري العريقة</p>
                        </div>
                      </div>

                    </div>

                  </div>

                </motion.div>
              )}
            </AnimatePresence>

              {/* TAB 2: MY COURSES */}
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

                  <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2"
                  >
                    {studentCourses.map((course) => (
                      <motion.div key={course.id} variants={itemVariants} className="border border-amber-200/60 rounded-2xl overflow-hidden flex flex-col justify-between group bg-stone-50">
                        <div className="relative h-32 overflow-hidden bg-amber-100">
                          <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          <div className="absolute inset-0 bg-stone-900/40" />
                          <span className="absolute top-2 right-2 bg-orange-700 text-amber-50 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            {course.category}
                          </span>
                        </div>

                        <div className="p-4 space-y-3 flex-1 flex flex-col justify-between text-right">
                          <div className="space-y-1">
                            <h4 className="font-bold text-xs text-stone-900 leading-snug line-clamp-2">{course.title}</h4>
                            <p className="text-[10px] text-stone-550">المحاضر المدقق: {course.instructorName}</p>
                          </div>

                          <div className="space-y-2 pt-2 border-t border-amber-100">
                            <div className="flex justify-between items-center text-[10px] text-stone-500">
                              <span>قضيت: ٧ ساعات مادة</span>
                              <span>تقدم المسار: {course.progress || 0}%</span>
                            </div>
                            <div className="w-full bg-stone-200 h-1 rounded-full overflow-hidden">
                              <div className="bg-orange-700 h-full" style={{ width: `${course.progress || 0}%` }}></div>
                            </div>

                            <button
                              onClick={() => setActivePlaybackCourse(course)}
                              className="w-full text-center bg-orange-700 hover:bg-orange-850 text-amber-50 text-xs font-bold py-2.5 rounded-xl block mt-2"
                            >
                              استئناف الفصل التفاعلي
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                    
                    {/* Add Course Mock Card */}
                    <div className="border border-dashed border-amber-300 rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-4 bg-amber-100/10">
                      <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center">
                        <BookOpen className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-bold text-xs text-stone-900">هل تبحث عن علوم جديدة صالحة؟</h4>
                        <p className="text-[10px] text-stone-500 leading-relaxed max-w-xs">
                          كتالوج آثاري ممتد ويضم حالياً دبلومات مكثفة في الفنون القديمة، علم المخطوطات والتحقيق الأثري.
                        </p>
                      </div>
                      <button
                        onClick={onNavigateToCatalog}
                        className="bg-amber-100 hover:bg-amber-200 text-orange-850 text-[11px] font-bold px-4 py-2 rounded-xl transition border-0 cursor-pointer text-center"
                      >
                        زيارة كتالوج الدورات
                      </button>
                    </div>

                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* TAB 3: CERTIFICATES & MANUSCRIPTS */}
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
                    <p className="text-xs text-stone-550 font-light mt-1">تجد هنا الشهادات والاجازات الموقعة والمصدقة رقمياً من الهيئات الاستشارية لمنصة آثاري.</p>
                  </div>

                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 pt-2">
                    
                    {/* Custom Manuscript Certificate 1: البلاغة العربية */}
                    <ManuscriptCertificate 
                      id="BL_CERT_45"
                      title="روائع البلاغة العربية ونظم النثر الأدبي"
                      recipient={userName}
                      grade="٩٨٪"
                      serialNumber="CRM-BL-45/2026"
                      dateHijri="رمضان ١٤٤٧ هـ"
                      dateGregorian="مايو ٢٠٢٦ م"
                      authorizer="الأستاذ طارق الهاشمي"
                      description="تدريس مجازات علم البيان والبديع والواجبات المنهجية التطبيقية."
                    />

                    {/* Custom Manuscript Certificate 2: العمارة الإسلامية */}
                    <ManuscriptCertificate 
                      id="AR_CERT_78"
                      title="فلسفة العمارة الإسلامية والتصميم التراثي وتطوره"
                      recipient={userName}
                      grade="٩٥٪"
                      serialNumber="CRM-AR-78/2026"
                      dateHijri="شوال ١٤٤٧ هـ"
                      dateGregorian="يونيو ٢٠٢٦ م"
                      authorizer="م. عبد الرحمن البغدادي"
                      description="تاريخ المقرنصات والأنماط الهندسية الإسلامية والواجبات المنجزة."
                    />

                  </div>

                  {/* Pending Certificate 3: علم المخطوطات والتحقيق الأثري والترميم */}
                  <div className="bg-white border border-dashed border-amber-200/80 rounded-2xl p-6 flex flex-col justify-between text-right relative min-h-[360px] shadow-xs hover:border-amber-400 transition" id="pending-certificate-ms">
                    <div className="absolute top-4 left-4 bg-amber-50 text-amber-700 text-[10px] font-bold py-1 px-3 rounded-full border border-amber-100 uppercase">قيد التحصيل الدراسي</div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
                        <div className="w-8 h-8 rounded-lg bg-stone-50 text-stone-500 flex justify-center items-center border border-stone-200">
                          <Clock className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-bold text-xs text-stone-800">شهادة دبلوم علم المخطوطات والتحقيق الأثري</h4>
                          <p className="text-[9px] text-stone-400">رقم المسار: MS-5021</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <p className="text-[11px] text-stone-600 leading-relaxed font-light">
                          أحرزت تقدم بقيمة <strong className="text-orange-700 font-sans">٧٥٪</strong> في المقررات المخصصة لهذا الدبلوم والتحرير البحثي بمصلحة المنصة الرصينة.
                        </p>
                        <p className="text-[11px] text-stone-500 leading-relaxed font-light">
                          الدرس المتبقي: موازين الورق والرق القديم في المغرب العربي والأندلس، تليها معالجة الامتحان النهائي لتأكيد وطباعة الإسناد الورقي المباشر.
                        </p>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between items-center text-[10px] text-stone-500">
                          <span>التقدم المنجز بالمسار:</span>
                          <span className="font-sans font-bold text-orange-700">٧٥٪</span>
                        </div>
                        <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-amber-600 h-full animate-pulse" style={{ width: '75%' }} />
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        const c = COURSES.find(item => item.id === 'course_1') || COURSES[0];
                        setActivePlaybackCourse(c);
                      }}
                      className="w-full text-center bg-stone-50 hover:bg-amber-50/50 text-stone-700 font-bold py-2.5 rounded-xl text-[10px] block mt-5 transition border border-stone-200 cursor-pointer"
                    >
                      متابعة دروس المسار لإقفاله
                    </button>
                  </div>

                </motion.div>
              )}
            </AnimatePresence>

              {/* TAB 4: WISHLIST & REFUNDS */}
              <AnimatePresence mode="wait">
                {activeTab === 'favorites' && (
                  <motion.div 
                    key="favorites"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.25 }}
                  >
                    <WishlistRefunds onNavigateToCatalog={onNavigateToCatalog} onTriggerToast={handleTriggerToast} />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* TAB 5: MESSAGING & NOTIFICATIONS */}
              <AnimatePresence mode="wait">
                {activeTab === 'notifications' && (
                  <motion.div 
                    key="notifications"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.25 }}
                  >
                    <MessagingCenter onTriggerToast={handleTriggerToast} />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* TAB 6: ADVANCED PROFILE & SETTINGS */}
              <AnimatePresence mode="wait">
                {activeTab === 'profile' && (
                  <motion.div 
                    key="profile"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.25 }}
                  >
                    <AdvancedProfile userName={userName} onTriggerToast={handleTriggerToast} />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* TAB 7: BECOME AN INSTRUCTOR */}
              <AnimatePresence mode="wait">
                {activeTab === 'instructor-apply' && (
                  <motion.div 
                    key="instructor-apply"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.25 }}
                  >
                    <InstructorApply onTriggerToast={handleTriggerToast} />
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          )}

        </main>

      </div>

      {/* SOCIAL SHARING DRAWER MODAL AI STUDIO SPECIAL */}
      <AnimatePresence>
        {sharingCert && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-stone-900/60 backdrop-blur-xs"
              onClick={() => setSharingCert(null)}
            />
            
            {/* Modal Box */}
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
                انشر حصاد علمك وثابر عليه! يمكنك تزيين جدار إنجازاتك المعرفية عبر تغريدة تويتر، أو منشور لينكد إن، أو مشاركتها مع ذويك ومقربيك فوراً.
              </p>

              {/* Share Preset Preview Textbox */}
              <div className="bg-amber-50/50 rounded-2xl p-4 border border-amber-200/50 mb-5 text-right">
                <p className="text-[10px] text-amber-800 font-bold mb-1.5">نص المنشور المقترح لشبكتك:</p>
                <p className="text-[11px] text-stone-700 leading-relaxed font-sans font-medium">
                  "بحمد الله وتوفيقه، أجزتني لجنة التحقيق الأثرية والتعليمية لدى منصة <strong className="text-orange-900 font-bold">آثاري</strong> شهادة الإجازة الكبرى في <strong className="text-stone-900 font-bold">({sharingCert.title})</strong> بتقدير ممتاز مع فريد الإسناد! 📜🕊️ #آثاري"
                </p>
              </div>

              {/* Share Channels list */}
              <div className="space-y-2.5">
                <button
                  onClick={() => {
                    handleTriggerToast(`تم نسخ رابط الإجازة المعززة وفتح تطبيق WhatsApp لمشاركة إنجازك!`);
                    setSharingCert(null);
                  }}
                  className="w-full bg-[#25D366] hover:bg-[#1ebd5d] text-white py-3 px-4 rounded-xl text-xs font-bold transition flex items-center justify-between cursor-pointer border-0 shadow-xs"
                >
                  <span className="font-bold">واتساب (WhatsApp Group)</span>
                  <span className="text-[9px] bg-white/20 px-2.5 py-0.5 rounded-full font-sans">إرسال فوري</span>
                </button>

                <button
                  onClick={() => {
                    handleTriggerToast(`جاري إعداد بطاقة الإسناد لملفك الاحترافي على LinkedIn بنجاح!`);
                    setSharingCert(null);
                  }}
                  className="w-full bg-[#0077B5] hover:bg-[#006396] text-white py-3 px-4 rounded-xl text-xs font-bold transition flex items-center justify-between cursor-pointer border-0 shadow-xs"
                >
                  <span className="font-bold">لينكد إن (LinkedIn Career)</span>
                  <span className="text-[9px] bg-white/20 px-2.5 py-0.5 rounded-full font-sans">ملف احترافي</span>
                </button>

                <button
                  onClick={() => {
                    handleTriggerToast(`تم نشر تغريدة بمستوى الإجازة الكبرى على حسابك الشخصي بجمال!`);
                    setSharingCert(null);
                  }}
                  className="w-full bg-stone-900 hover:bg-stone-950 text-white py-3 px-4 rounded-xl text-xs font-bold transition flex items-center justify-between cursor-pointer border-0 shadow-xs"
                >
                  <span className="font-bold">تويتر / إكس (X Platform)</span>
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
