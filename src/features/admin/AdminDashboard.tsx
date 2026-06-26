import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  ShieldCheck,
  BookOpen,
  Award,
  DollarSign,
  Users,
  Settings,
  TrendingUp,
  CreditCard,
  Percent,
  Clock,
  Menu,
  MessageSquare,
  Megaphone,
  FolderOpen,
  BarChart2,
  AlertTriangle,
  Grid,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppContext } from '../../providers/AppProvider';
import { useDashboard } from '../common/hooks/useDashboard';
import { DashboardSkeleton } from '../../components/shared/Skeleton';
import {
  useAdminCoupons,
  useAdminPaymentMethods,
  useAdminRefunds,
  useAdminInstructorRequests,
  useAdminUsers,
  useAdminPendingCourses,
  useAdminCourseActions,
} from '../admin/hooks/useAdmin';
import { useCategories } from '../common/hooks/useCategories';
import { StatCard } from '../../components/shared/ui';
import { DashboardSidebar } from '../../components/layout/dashboard';
import { CouponsManager } from './components/CouponsManager';
import { PaymentMethodsManager } from './components/PaymentMethodsManager';
import { UsersManager } from './components/UsersManager';
import { CourseModerationTable } from './components/CourseModerationTable';
import { TeacherRequestsTable } from './components/TeacherRequestsTable';
import { OrdersRefundsManager } from './components/OrdersRefundsManager';
import { CategoriesManager } from './components/CategoriesManager';
import { SettingsPanel } from './components/SettingsPanel';
import ReviewsModeration from './ReviewsModeration';
import AnnouncementsCenter from './AnnouncementsCenter';
import MediaLibrary from './MediaLibrary';
import SystemActivitySettings from './SystemActivitySettings';
import AdvancedAnalytics from './AdvancedAnalytics';
import { adminService } from './services/admin.service';
import { mediaService } from '../media/services/media.service';

export default function AdminDashboard() {
  const { userName, handleLogout, displayToast } = useAppContext();
  const { adminOverview, isAdminLoading } = useDashboard({ enableAdmin: true });
  const [searchParams, setSearchParams] = useSearchParams();

  type AdminTab = 'overview' | 'courses' | 'teachers' | 'orders-refunds' | 'categories' | 'coupons' | 'payment-methods' | 'users' | 'settings' | 'reviews' | 'announcements' | 'media' | 'system-logs';
  const activeTab = (searchParams.get('tab') as AdminTab) || 'overview';
  const setActiveTab = (tab: AdminTab) => setSearchParams({ tab });

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Real API hooks
  const { coupons, isLoading: isCouponsLoading, create: createCoupon, toggle: toggleCoupon, deleteCoupon } = useAdminCoupons();
  const { methods: paymentMethods, isLoading: isPaymentMethodsLoading, toggle: togglePaymentMethod } = useAdminPaymentMethods();
  const { refunds: adminRefunds, isLoading: isRefundsLoading, approve: approveRefund, reject: rejectRefund } = useAdminRefunds();
  const { requests: instructorRequests, isLoading: isInstructorRequestsLoading, approve: approveInstructorRequest, reject: rejectInstructorRequest } = useAdminInstructorRequests();
  const { users: adminUsers, isLoading: isUsersLoading, toggleActive: toggleUserActive } = useAdminUsers();
  const { data: pendingCoursesData, isLoading: isCoursesLoading } = useAdminPendingCourses();
  const { approve: approveCourse, reject: rejectCourse } = useAdminCourseActions();
  const { categories: realCategories, isLoading: isCategoriesLoading, create: createCategory, deleteCategory: deleteCategoryApi } = useCategories();

  // Map API data to sub-component prop shapes
  const pendingCourses = pendingCoursesData?.items ?? [];
  const pendingTeachers = (instructorRequests ?? []).filter(r => r.status === 'Pending');
  const pendingRefunds = (adminRefunds ?? []).filter(r => r.status === 'Pending');

  const courseItems = pendingCourses.map(c => ({
    id: c.id,
    title: c.title,
    category: c.categoryName,
    instructorName: '',
    instructorAvatar: '',
    price: c.price,
    duration: '',
    thumbnail: c.courseImageUrl ?? '',
    status: c.status,
    lessonsCount: 0,
    rejectionReason: undefined as string | undefined,
  }));

  const categoryOptions = (realCategories ?? []).map(c => ({ id: c.id, name: c.name }));

  const teacherItems = (instructorRequests ?? []).map(r => ({
    id: r.id,
    name: r.userName,
    email: r.userEmail,
    specialty: '',
    qualification: '',
    experience: '',
    coverLetter: r.message ?? '',
    status: r.status,
    applyDate: r.submittedAt,
  }));

  const refundItems = (adminRefunds ?? []).map(r => ({
    id: r.id,
    studentName: '',
    courseTitle: r.courseName,
    amount: r.amount,
    reason: r.reason,
    date: r.createdAt,
    status: r.status,
    rejectionReason: r.rejectionReason,
  }));

  const categoryItems = (realCategories ?? []).map(c => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    courseCount: c.courseCount ?? 0,
  }));

  const [selectedCourseId, setSelectedCourseId] = useState<string>(courseItems[0]?.id ?? '');
  const [rejectionTarget, setRejectionTarget] = useState<{ type: 'course' | 'teacher' | 'refund'; id: string } | null>(null);
  const [rejectionReasonText, setRejectionReasonText] = useState<string>('');
  const [isRejectionDialogOpen, setIsRejectionDialogOpen] = useState<boolean>(false);

  const handleDownloadDocument = async (requestId: string) => {
    try {
      const res = await adminService.getInstructorRequestDetails(requestId);
      const docs = res.data?.documents;
      if (!docs || docs.length === 0) {
        displayToast('⚠️ لا توجد مستندات مرفوعة لهذا الطلب.');
        return;
      }
      for (const doc of docs) {
        if (doc.fileId) {
          try {
            const urlRes = await mediaService.getViewUrl(doc.fileId);
            window.open(urlRes.data.viewUrl, '_blank');
          } catch {
            displayToast(`⚠️ تعذر فتح المستند: ${doc.documentType}`);
          }
        } else if (doc.urlValue) {
          window.open(doc.urlValue, '_blank');
        }
      }
    } catch {
      displayToast('⚠️ تعذر تحميل المستندات. الـ API غير متاح.');
    }
  };

  const handleOpenRejectionDialog = (type: 'course' | 'teacher' | 'refund', id: string) => {
    setRejectionTarget({ type, id });
    setRejectionReasonText('');
    setIsRejectionDialogOpen(true);
  };

  const handleConfirmRejection = () => {
    if (!rejectionTarget || !rejectionReasonText.trim()) return;
    if (rejectionTarget.type === 'course') {
      rejectCourse({ id: rejectionTarget.id, reason: rejectionReasonText });
      displayToast('❌ تم رفض المقرر وإرسال الملاحظات للمعد.');
    } else if (rejectionTarget.type === 'teacher') {
      rejectInstructorRequest({ id: rejectionTarget.id, reason: rejectionReasonText });
      displayToast('❌ تم رفض طلب التدريس وإشعار المتقدم.');
    } else if (rejectionTarget.type === 'refund') {
      rejectRefund({ id: rejectionTarget.id, reason: rejectionReasonText });
      displayToast('❌ تم رفض طلب الاسترداد.');
    }
    setIsRejectionDialogOpen(false);
    setRejectionTarget(null);
    setRejectionReasonText('');
  };

  return (
    <div className="bg-transparent min-h-screen flex flex-col font-sans transition-colors duration-250 w-full" dir="rtl" id="admin-dashboard-container">

      <div className="absolute inset-x-0 top-0 h-[480px] overflow-hidden pointer-events-none z-0">
        <div className="bg-heritage-pattern opacity-[0.06] absolute inset-0" />
        <div className="absolute inset-0 bg-gradient-to-b from-orange-700/5 via-amber-500/0 to-transparent" />
      </div>

      <div className="flex flex-1 relative z-10 flex-col lg:flex-row">

        <DashboardSidebar
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
          activeTab={activeTab}
          onTabChange={(tab) => setActiveTab(tab as AdminTab)}
          navItems={[
            { id: 'overview', label: 'لوحة المعاينة العامة', icon: <BarChart2 className="w-4 h-4" /> },
            { id: 'courses', label: 'طابور تحكيم المقررات', icon: <BookOpen className="w-4 h-4" />, badge: pendingCourses.length > 0 ? <span className="bg-amber-400 text-[var(--color-brand-orange-950)] font-black text-[9px] px-1.5 py-0.5 rounded-full">{pendingCourses.length}</span> : undefined },
            { id: 'teachers', label: 'طلبات رخص التدريس', icon: <Award className="w-4 h-4" />, badge: pendingTeachers.length > 0 ? <span className="bg-orange-500 text-white font-black text-[9px] px-1.5 py-0.5 rounded-full">{pendingTeachers.length}</span> : undefined },
            { id: 'orders-refunds', label: 'العمليات والاستردادات', icon: <DollarSign className="w-4 h-4" />, badge: pendingRefunds.length > 0 ? <span className="bg-red-500 text-white font-black text-[9px] px-1.5 py-0.5 rounded-full">{pendingRefunds.length}</span> : undefined },
            { id: 'categories', label: 'إدارة أقسام التراث', icon: <Grid className="w-4 h-4" /> },
            { id: 'coupons', label: 'الكوبونات والخصومات', icon: <Percent className="w-4 h-4" /> },
            { id: 'payment-methods', label: 'طرق الدفع', icon: <CreditCard className="w-4 h-4" /> },
            { id: 'users', label: 'إدارة المستخدمين', icon: <Users className="w-4 h-4" /> },
            { id: 'reviews', label: 'نظام مراجعة التقييمات', icon: <MessageSquare className="w-4 h-4" /> },
            { id: 'announcements', label: 'مركز الإعلانات والأخبار', icon: <Megaphone className="w-4 h-4" /> },
            { id: 'media', label: 'مكتبة الوسائط المركزية', icon: <FolderOpen className="w-4 h-4" /> },
            { id: 'system-logs', label: 'سجل النشاطات وإعدادات النظام', icon: <Clock className="w-4 h-4" /> },
            { id: 'settings', label: 'قوانين واشتراطات التدقيق', icon: <Settings className="w-4 h-4" /> },
          ]}
          branding={{ title: 'بوابة المشرفين آثاري', subtitle: 'بوابة التدقيق والتحكيم العالي' }}
          userName={userName}
          userRole="كبير مدققي المنصة"
          onLogout={handleLogout}
          sidebarId="admin-sidebar"
        />

        <main className="flex-1 px-4 sm:px-8 py-8 overflow-x-hidden min-h-screen relative z-10 space-y-6" id="admin-workbench-main">

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
                <div className="text-[10px] bg-red-100 text-red-950 font-bold px-2.5 py-1 rounded-full border border-red-200 inline">
                  مجلس الرقابة المعتمد بالمنصة
                </div>
              </div>
              <h1 className="text-xl font-extrabold text-[var(--color-brand-orange-950)]">
                أهلاً بك في مقصورة الرقابة والتحكيم العالي
              </h1>
              <p className="text-xs text-stone-500 mt-1">تتبع مؤشرات الاستثمار العيني وسير مراجعة مناهجك وتأليفها.</p>
            </div>
          </div>

          {/* ─── OVERVIEW TAB ─── */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-fade-in" id="overview-workbench-tab">

              <div className="bg-white p-6 rounded-3xl border border-amber-200/60 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-50 pb-5">
                  <div className="text-right space-y-1">
                    <h2 className="text-base font-black text-stone-900 font-serif flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-orange-700" />
                      <span>ملخص أداء وحالة منصة آثاري التعليمية</span>
                    </h2>
                    <p className="text-[11px] text-stone-500 font-light leading-relaxed">
                      منظومة التدقيق والاعتماد السريع لإجازات البحوث والدورات التاريخية الإسلامية.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 self-start sm:self-auto font-mono text-[10px]">
                    <span className="bg-amber-50 text-orange-800 px-3 py-1.5 rounded-full font-bold border border-amber-100">
                      آخر تحديث للشبكة: منذ ثوانٍ
                    </span>
                  </div>
                </div>

                {isAdminLoading ? (
                  <DashboardSkeleton />
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mt-6">
                    <StatCard
                      icon={<DollarSign className="w-4.5 h-4.5" />}
                      label="صافي الإيرادات المكتسبة"
                      value={`${adminOverview?.totalRevenue?.toLocaleString('ar-SA') ?? '0'} ر.س`}
                      trend={<><TrendingUp className="w-3.5 h-3.5" /><span>الإيراد الشهري: {adminOverview?.monthlyRevenue?.toLocaleString('ar-SA') ?? '0'} ر.س</span></>}
                      variant="emerald"
                    />
                    <StatCard
                      icon={<BookOpen className="w-4.5 h-4.5 text-amber-700" />}
                      label="إجمالي المقررات"
                      value={`${adminOverview?.totalCourses ?? 0} مقرر`}
                      trend={<span>{adminOverview?.pendingApprovals ?? 0} مقررات قيد المراجعة</span>}
                      variant="amber"
                    />
                    <StatCard
                      icon={<Award className="w-4.5 h-4.5 text-orange-700" />}
                      label="المدربون المرخصون"
                      value={`${adminOverview?.totalInstructors ?? 0} مدرّب`}
                      trend={<span>{adminOverview?.totalStudents ?? 0} طالب مسجّل</span>}
                      variant="orange"
                    />
                    <StatCard
                      icon={<Users className="w-4.5 h-4.5" />}
                      label="المستخدمون الجدد هذا الشهر"
                      value={`${adminOverview?.newUsersThisMonth ?? 0} مستخدم جديد`}
                      trend={<span>إجمالي المستخدمين: {adminOverview?.totalUsers ?? '0'}</span>}
                      variant="blue"
                    />
                  </div>
                )}
              </div>

              <AdvancedAnalytics />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-amber-200/80 shadow-xs text-right space-y-4 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 bg-amber-50 text-amber-900 rounded-2xl flex items-center justify-center font-bold border border-amber-100">📚</div>
                      <span className="text-xs bg-amber-100 text-amber-900 border border-amber-200 font-black px-2.5 py-0.5 rounded-full">{pendingCourses.length} دورات معلّقة</span>
                    </div>
                    <h3 className="text-xs md:text-sm font-black text-stone-900 font-serif">طابور مراجعة المقررات</h3>
                    <p className="text-[11px] text-stone-500 font-light leading-relaxed">مراجعة المناهج والملفات الأثرية لتوثيق النقوش وعقود العمارة الإسلامية والتصريح بالدروس وتدبيجها.</p>
                  </div>
                  <button onClick={() => setActiveTab('courses')} className="w-full text-center bg-orange-700 hover:bg-orange-800 text-white font-extrabold text-xs py-2.5 px-4 rounded-xl border-0 cursor-pointer transition shadow-xs mt-2">
                    فتح طابور المقررات ({pendingCourses.length}) ➔
                  </button>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-amber-200/80 shadow-xs text-right space-y-4 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 bg-orange-50 text-orange-950 rounded-2xl flex items-center justify-center font-bold border border-orange-100">🎓</div>
                      <span className="text-xs bg-orange-100 text-orange-950 font-black px-2.5 py-0.5 rounded-full">{pendingTeachers.length} معلّقين</span>
                    </div>
                    <h3 className="text-xs md:text-sm font-black text-stone-900 font-serif">طابور رخص التدريس الكبرى</h3>
                    <p className="text-[11px] text-stone-500 font-light leading-relaxed">فحص طلبات الباحثين، تفنيد سيرهم الذاتية، وتحميل مستنداتهم المصدقة ومنحهم تذكرة الترشيح للعموم.</p>
                  </div>
                  <button onClick={() => setActiveTab('teachers')} className="w-full text-center bg-orange-700 hover:bg-orange-800 text-white font-extrabold text-xs py-2.5 px-4 rounded-xl border-0 cursor-pointer transition shadow-xs mt-2">
                    فحص طلبات الانضمام ({pendingTeachers.length}) ➔
                  </button>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-amber-200/80 shadow-xs text-right space-y-4 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 bg-red-50 text-red-800 rounded-2xl flex items-center justify-center font-bold border border-red-100">💳</div>
                      <span className="text-xs bg-red-100 text-red-800 font-black px-2.5 py-0.5 rounded-full">{pendingRefunds.length} طلب استرداد</span>
                    </div>
                    <h3 className="text-xs md:text-sm font-black text-stone-900 font-serif">طلبات الاسترداد والتسوية</h3>
                    <p className="text-[11px] text-stone-500 font-light leading-relaxed">معالجة فواتير مرتجعات الرسوم ومراجعة مبررات الاسترداد المرفقة من الدارسين تفادياً للخلافات المالية.</p>
                  </div>
                  <button onClick={() => setActiveTab('orders-refunds')} className="w-full text-center bg-orange-700 hover:bg-orange-800 text-white font-extrabold text-xs py-2.5 px-4 rounded-xl border-0 cursor-pointer transition shadow-xs mt-2">
                    معالجة مرتجعات الرسوم ({pendingRefunds.length}) ➔
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* ─── TABS: Courses, Teachers, Orders & Refunds, Categories ─── */}
          {activeTab === 'courses' && (
            <CourseModerationTable
              courses={courseItems}
              categories={categoryOptions}
              selectedCourseId={selectedCourseId}
              onSelectedCourseIdChange={setSelectedCourseId}
              onApprove={(id) => { approveCourse(id); displayToast('✅ تم اعتماد ونشر المقرر بنجاح.'); }}
              onReject={handleOpenRejectionDialog}
            />
          )}

          {activeTab === 'teachers' && (
            <TeacherRequestsTable
              teachers={teacherItems}
              onApprove={(id) => { approveInstructorRequest(id); displayToast('🎉 تم منح رخصة التدريس.'); }}
              onReject={handleOpenRejectionDialog}
              onToast={displayToast}
              onDownloadDocument={handleDownloadDocument}
            />
          )}

          {activeTab === 'orders-refunds' && (
            <OrdersRefundsManager
              orders={[]}
              refunds={refundItems}
              onApproveRefund={(id) => { approveRefund(id); displayToast('💳 تم صرف الاسترداد.'); }}
              onReject={handleOpenRejectionDialog}
            />
          )}

          {activeTab === 'categories' && (
            <CategoriesManager
              categories={categoryItems}
              onAdd={(name, slug) => { createCategory({ name, slug, iconName: '' }); displayToast('✨ تم إضافة القسم.'); }}
              onDelete={(id) => { deleteCategoryApi(id); displayToast('🧹 تم حذف القسم.'); }}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsPanel onSave={() => displayToast('💾 تم حفظ الإعدادات بنجاح.')} />
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-6 animate-fade-in" id="reviews-moderation-workbench">
              <ReviewsModeration onTriggerToast={displayToast} />
            </div>
          )}

          {activeTab === 'announcements' && (
            <div className="space-y-6 animate-fade-in" id="announcements-center-workbench">
              <AnnouncementsCenter onTriggerToast={displayToast} />
            </div>
          )}

          {activeTab === 'media' && (
            <div className="space-y-6 animate-fade-in" id="media-library-workbench">
              <MediaLibrary onTriggerToast={displayToast} />
            </div>
          )}

          {activeTab === 'system-logs' && (
            <div className="space-y-6 animate-fade-in" id="system-activity-settings-workbench">
              <SystemActivitySettings onTriggerToast={displayToast} />
            </div>
          )}

          {activeTab === 'coupons' && (
            <CouponsManager
              coupons={coupons}
              isLoading={isCouponsLoading}
              onToggle={toggleCoupon}
              onToast={displayToast}
            />
          )}

          {activeTab === 'payment-methods' && (
            <PaymentMethodsManager
              methods={paymentMethods}
              isLoading={isPaymentMethodsLoading}
              onToggle={togglePaymentMethod}
              onToast={displayToast}
            />
          )}

          {activeTab === 'users' && (
            <UsersManager
              users={adminUsers}
              isLoading={isUsersLoading}
              onToggleActive={toggleUserActive}
              onToast={displayToast}
            />
          )}

        </main>

      </div>

      {/* ─── REJECTION DIALOG ─── */}
      <AnimatePresence>
        {isRejectionDialogOpen && rejectionTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-stone-900/60 backdrop-blur-xs cursor-pointer"
              onClick={() => setIsRejectionDialogOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="bg-white rounded-3xl p-6 max-w-lg w-full text-right shadow-2xl relative z-10 border border-amber-100 space-y-4"
            >
              <div className="w-12 h-12 bg-red-50 text-red-700 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 border-0" />
              </div>
              <div className="space-y-1 text-right">
                <h3 className="text-xs md:text-sm font-black text-stone-950 font-serif leading-tight">
                  خطاب توصية ومبررات الملاحظات أو الإرجاع
                </h3>
                <p className="text-[11px] text-stone-500 leading-normal">
                  يرجى تسطير الإفادات أو أسباب الرفض بوضوح، ليتم إشعار المعني فوراً.
                </p>
              </div>
              <textarea
                value={rejectionReasonText}
                onChange={(e) => setRejectionReasonText(e.target.value)}
                placeholder="اكتب التوصيات وملاحظات المراجعة هنا..."
                rows={5}
                className="w-full text-xs p-3.5 rounded-xl bg-stone-50 text-stone-900 border border-stone-200 focus:outline-none focus:border-red-600 focus:bg-white text-right placeholder:text-stone-400 leading-normal font-sans"
              />
              <div className="flex gap-2.5 pt-2">
                <button
                  onClick={handleConfirmRejection}
                  disabled={!rejectionReasonText.trim()}
                  className="flex-1 bg-red-700 hover:bg-red-800 disabled:bg-stone-100 disabled:text-stone-400 disabled:cursor-not-allowed text-white py-2.5 rounded-xl text-xs font-black border-0 cursor-pointer text-center font-sans shadow shadow-red-100"
                >
                  إرسال المبررات وتقرير الرفض
                </button>
                <button
                  onClick={() => setIsRejectionDialogOpen(false)}
                  className="flex-1 bg-white hover:bg-stone-50 text-stone-500 py-2.5 rounded-xl text-xs font-extrabold border border-stone-200 cursor-pointer text-center"
                >
                  إلغاء والعودة
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
