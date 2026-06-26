import { useState } from 'react';
import { useAppContext } from '../../providers/AppProvider';
import { useDashboard } from '../common/hooks/useDashboard';
import { useEnrollments } from '../common/hooks/useEnrollments';
import { useCertificates } from '../common/hooks/useCertificates';
import { useLiveSession } from '../common/hooks/useLiveSession';
import { ErrorFallback } from '../../components/shared/ErrorFallback';
import type { EnrollmentResponseDto } from '../../types/api/enrollment';
import LearningRoom from './LearningRoom';
import QuizTaking from './QuizTaking';
import LiveSessionRoom from '../instructor/LiveSession';
import MessagingCenter from './MessagingCenter';
import WishlistRefunds from './WishlistRefunds';
import InstructorApply from './InstructorApply';
import { AnimatePresence, motion } from 'motion/react';
import { StudentSidebar } from './components/StudentSidebar';
import { OverviewTab } from './components/OverviewTab';
import { MyCoursesTab } from './components/MyCoursesTab';
import { CertificatesTab } from './components/CertificatesTab';
import { ShareCertificateModal } from './components/ShareCertificateModal';

type DashboardTab = 'overview' | 'my-courses' | 'certificates' | 'favorites' | 'notifications' | 'instructor-apply';

function TabPanel({ active, children, className, id }: { active: boolean; children: React.ReactNode; className?: string; id?: string }) {
  return (
    <AnimatePresence mode="wait">
      {active && (
        <motion.div
          key={id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.25 }}
          className={className}
          id={id}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function StudentDashboard() {
  const { handleLogout, userName = 'أحمد التميمي', displayToast } = useAppContext();
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

  const handleTabChange = (tab: DashboardTab) => {
    setActiveTab(tab);
    setActivePlaybackEnrollment(null);
  };

  const handleShareCert = (platform: string) => {
    const messages: Record<string, string> = {
      whatsapp: 'تم نسخ رابط الإجازة وفتح تطبيق WhatsApp!',
      linkedin: 'تم إعداد بطاقة الإسناد لملفك الاحترافي!',
      twitter: 'تم نشر التغريدة بنجاح!',
    };
    displayToast(messages[platform] ?? 'تمت المشاركة!');
    setSharingCert(null);
  };

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
        <StudentSidebar
          activeTab={activeTab}
          sidebarCollapsed={sidebarCollapsed}
          onTabChange={handleTabChange}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          onLogout={handleLogout}
        />

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

              <TabPanel active={activeTab === 'overview'} id="overview-tab">
                <OverviewTab
                  isLoading={isLoading}
                  recentEnrollments={recentEnrollments}
                  activeEnrollments={activeEnrollments}
                  completedCount={completedCount}
                  inProgressCount={inProgressCount}
                  enrolledCount={enrolledCount}
                  certificatesCount={certificatesCount}
                  liveSessions={liveSessions}
                  isLiveLoading={isLiveLoading}
                  userName={userName}
                  onContinueLearning={(enrollment) => setActivePlaybackEnrollment(enrollment)}
                  onOpenCourse={(enrollment) => setActivePlaybackEnrollment(enrollment)}
                  onJoinLiveSession={() => {
                    setIsPlayingLiveSession(true);
                    displayToast('جاري الاتصال بالغرفة الافتراضية للبث الحصري');
                  }}
                />
              </TabPanel>

              <TabPanel active={activeTab === 'my-courses'} id="my-courses-tab">
                <MyCoursesTab
                  isLoading={isLoading}
                  activeEnrollments={activeEnrollments}
                  onOpenCourse={(enrollment) => setActivePlaybackEnrollment(enrollment)}
                />
              </TabPanel>

              <TabPanel active={activeTab === 'certificates'} id="certificates-tab">
                <CertificatesTab
                  isLoading={isCertificatesLoading}
                  certificates={certificatesList}
                  userName={userName}
                />
              </TabPanel>

              <TabPanel active={activeTab === 'favorites'}>
                <WishlistRefunds />
              </TabPanel>

              <TabPanel active={activeTab === 'notifications'}>
                <MessagingCenter />
              </TabPanel>

              <TabPanel active={activeTab === 'instructor-apply'}>
                <InstructorApply />
              </TabPanel>
            </div>
          )}
        </main>
      </div>

      <ShareCertificateModal
        sharingCert={sharingCert}
        onClose={() => setSharingCert(null)}
        onShare={handleShareCert}
      />
    </div>
  );
}
