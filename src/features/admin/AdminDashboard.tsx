import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  BarChart2, 
  BookOpen, 
  Award, 
  DollarSign, 
  CheckCircle, 
  XCircle, 
  FileText, 
  Users, 
  Settings, 
  Search, 
  Filter, 
  ChevronRight, 
  ChevronLeft, 
  Grid, 
  Download,
  Check, 
  X, 
  ChevronDown, 
  AlertTriangle,
  Eye, 
  Bell,
  RefreshCw,
  TrendingUp,
  CreditCard,
  UserCheck,
  Percent,
  Layers,
  Archive,
  Terminal,
  Clock,
  Briefcase,
  Sparkles,
  LogOut,
  Menu,
  MessageSquare,
  Megaphone,
  FolderOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppContext } from '../../providers/AppProvider';

// Import Phase 7 Components
import ReviewsModeration from './ReviewsModeration';
import AnnouncementsCenter from './AnnouncementsCenter';
import MediaLibrary from './MediaLibrary';
import SystemActivitySettings from './SystemActivitySettings';
import AdvancedAnalytics from './AdvancedAnalytics';

// Interfaces for our state model
interface CourseReview {
  id: string;
  title: string;
  category: string;
  instructorName: string;
  instructorAvatar: string;
  price: number;
  duration: string;
  thumbnail: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  submitDate: string;
  lessonsCount: number;
  rejectionReason?: string;
}

interface TeacherRequest {
  id: string;
  name: string;
  email: string;
  specialty: string;
  qualification: string;
  experience: string;
  cvUrl?: string;
  coverLetter: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  applyDate: string;
}

interface OrderItem {
  id: string;
  studentName: string;
  courseTitle: string;
  amount: number;
  date: string;
  status: 'Completed' | 'Pending' | 'Refunded';
}

interface RefundItem {
  id: string;
  studentName: string;
  courseTitle: string;
  amount: number;
  reason: string;
  date: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  rejectionReason?: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  courseCount: number;
}

interface ActivityLog {
  id: string;
  action: string;
  type: 'course' | 'teacher' | 'refund' | 'system';
  time: string;
  user: string;
}

interface SignalRNotification {
  id: string;
  title: string;
  message: string;
  type: 'course' | 'refund' | 'teacher';
  payloadId: string;
  timestamp: string;
  read: boolean;
}

export default function AdminDashboard() {
  const { userName, handleLogout, displayToast } = useAppContext();
  // Tabs for the Admin Workbench
  const [activeTab, setActiveTab] = useState<'overview' | 'courses' | 'teachers' | 'orders-refunds' | 'categories' | 'settings' | 'reviews' | 'announcements' | 'media' | 'system-logs'>('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Sub-tab inside Orders & Refunds page
  const [financialSubTab, setFinancialSubTab] = useState<'orders' | 'refunds'>('orders');

  // --- MODEL STATES (Seeded with beautiful historic Arabian context) ---
  const [courses, setCourses] = useState<CourseReview[]>([
    {
      id: 'course_review_1',
      title: 'توثيق ودراسة النقوش الثمودية الأثرية في جبال حائل وجبّة التاريخية',
      category: 'علم الآثار والتحقيق',
      instructorName: 'د. فريد الحربي',
      instructorAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
      price: 250,
      duration: '٢٤ ساعة مادة مسجلة',
      thumbnail: 'https://images.unsplash.com/photo-1590073844006-33379778ae09?w=600',
      status: 'Pending',
      submitDate: '٢٠٢٦/٠٦/١٠',
      lessonsCount: 15
    },
    {
      id: 'course_review_2',
      title: 'المعلقات السبع في ميزان النقد اللغوي الكلاسيكي والأصوات العربية القديمة',
      category: 'اللغة العربية وآدابها',
      instructorName: 'أ. فاطمة الهاشمي',
      instructorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      price: 150,
      duration: '١٨ ساعة تدوين صوتي',
      thumbnail: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600',
      status: 'Pending',
      submitDate: '٢٠٢٦/٠٦/٠٩',
      lessonsCount: 12
    },
    {
      id: 'course_review_3',
      title: 'الخطوط والمقاييس الهندسية لعقود الآجر والمقرنصات الأندلسية الفذة',
      category: 'الفنون والعمارة التراثية',
      instructorName: 'أ. عبد الإله بن فهد',
      instructorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      price: 180,
      duration: '١٦ ساعة تدريب تطبيقي',
      thumbnail: 'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?w=600',
      status: 'Approved',
      submitDate: '٢٠٢٦/٠٦/٠٥',
      lessonsCount: 10
    },
    {
      id: 'course_review_4',
      title: 'فن صناعة وحياكة البشوت الحساوية وتاريخ منسوخات الأحساء الشريفة',
      category: 'الحرف والصناعات اليدوية',
      instructorName: 'الشيخ عبد الرزاق القرين',
      instructorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      price: 320,
      duration: '٣٠ ساعة مساق تدريبي',
      thumbnail: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600',
      status: 'Pending',
      submitDate: '٢٠٢٦/٠٦/٠٨',
      lessonsCount: 22
    }
  ]);

  const [teachers, setTeachers] = useState<TeacherRequest[]>([
    {
      id: 'REQ-TECH-302',
      name: 'د. عبد المجيد السليمان',
      email: 'a.sulaiman@university.edu.sa',
      specialty: 'النقوش والمكتشفات النبطية والعربية القديمة',
      qualification: 'دكتوراه في علم الآثار والنقوش السامية المقارنة',
      experience: '١٢ عاماً أستاذ مشارك لعمادة الآثار ومستشار الهيئات الوطنية للتنقيب',
      coverLetter: 'أرغب في نشر الوعي بالمدونات الصخرية الأثرية في الشمال والشرق العربي وتقديم مجلس لتتبع رحلة الخط النبطي وانتقاله للخط الكوفي القديم.',
      status: 'Pending',
      applyDate: '٢٠٢٦/٠٦/١١'
    },
    {
      id: 'REQ-TECH-303',
      name: 'أ. ريم بنت عبدالعزيز',
      email: 'reem.illumination@outlook.com',
      specialty: 'فن تذهيب المصاحف والمنمنمات الإسلامية',
      qualification: 'ماجستير فنون إسلامية وإجازة في الخط التاريخي والزركشة',
      experience: '٨ سنوات من تنظيم ورش العمل الأثرية بالتعاون مع المتاحف والجمعيات التشكيلية',
      coverLetter: 'أتقدم للانضمام إلى قائمة المعلمين في آثاري لدعم الهوية الفنية الشرقية وبناء مرجع مسجل لتعليم الطلاب كيفية تحضير الألوان التراثية وتذهيب الألواح.',
      status: 'Pending',
      applyDate: '٢٠٢٦/٠٦/١٠'
    },
    {
      id: 'REQ-TECH-304',
      name: 'الشيخ صالح الفارس',
      email: 'saleh.fares@heritage.org',
      specialty: 'قوانين الهندسة المائية القديمة وبناء الأفلاج',
      qualification: 'باحث ميداني معتمد وشيخ حرفيين في الصيانة التقليدية لآبار ممتلكات العلا والمواقع التراثية',
      experience: '٢٢ عاماً من المساهمة في ترميم الأفلاج الأثرية والقنوات التاريخية المسقاة بالجزيرة العربية',
      coverLetter: 'أبواب منصة آثاري ستكون النافذة لنقل أسرار المزارعين القدامى ونظام الأفلاج الذي غذى حضارتنا، لتوثيق هذا التراث وصونه للأجيال الشريفة.',
      status: 'Approved',
      applyDate: '٢٠٢٦/٠٦/٠١'
    }
  ]);

  const [orders, setOrders] = useState<OrderItem[]>([
    { id: 'ATH-ORD-110', studentName: 'أحمد التميمي', courseTitle: 'توثيق ودراسة النقوش الثمودية الأثرية', amount: 250, date: '٢٠٢٦/٠٦/١٠', status: 'Pending' },
    { id: 'ATH-ORD-111', studentName: 'منى العبدلي', courseTitle: 'المعلقات السبع في ميزان النقد اللغوي الكلاسيكي', amount: 150, date: '٢٠٢٦/٠٦/١١', status: 'Completed' },
    { id: 'ATH-ORD-112', studentName: 'خالد السديري', courseTitle: 'الخطوط والمقاييس الهندسية لعقود الآجر الأندلسية', amount: 185, date: '٢٠٢٦/٠٦/١١', status: 'Completed' },
    { id: 'ATH-ORD-113', studentName: 'عادل الشمري', courseTitle: 'روائع البلاغة العربية ونظم النثر الأدبي', amount: 120, date: '٢٠٢٦/٠٦/٠٩', status: 'Completed' },
    { id: 'ATH-ORD-114', studentName: 'أريج الحارثي', courseTitle: 'فن صناعة وحياكة البشوت الحساوية وتاريخ منسوخات الأحساء', amount: 320, date: '٢٠٢٦/٠٦/١١', status: 'Refunded' }
  ]);

  const [refunds, setRefunds] = useState<RefundItem[]>([
    {
      id: 'REF-ATH-091',
      studentName: 'منى العبدلي',
      courseTitle: 'الخطوط والمقاييس الهندسية لعقود الآجر والمقرنصات الأندلسية الفذة',
      amount: 185,
      reason: 'تداخل توقيت مجلس البث المباشر التفاعلي للمساق مع ساعات دراستي الوظيفية العليا، وأرغب في ترحيل الرصيد لمحاضرة معلقة أخرى.',
      date: '٢٠٢٦/٠٦/١٠',
      status: 'Pending'
    },
    {
      id: 'REF-ATH-092',
      studentName: 'سعد العسيري',
      courseTitle: 'توثيق ودراسة النقوش الثمودية الأثرية في جبال حائل وجبّة التاريخية',
      amount: 250,
      reason: 'تم سحب الرسم بالخطأ مرتين متتاليتين من الحساب البنكي، والرجاء رد السحب الإضافي الثاني لحسابي سريعاً للتسوية.',
      date: '٢٠٢٦/٠٦/١١',
      status: 'Pending'
    }
  ]);

  const [categories, setCategories] = useState<Category[]>([
    { id: 'cat_1', name: 'علم الآثار والتحقيق', slug: 'archaeology', courseCount: 8 },
    { id: 'cat_2', name: 'اللغة العربية وآدابها', slug: 'arabic-linguistics', courseCount: 18 },
    { id: 'cat_3', name: 'الفنون والعمارة التراثية', slug: 'islamic-architecture', courseCount: 12 },
    { id: 'cat_4', name: 'الحرف والصناعات اليدوية', slug: 'crafts-heritage', courseCount: 5 }
  ]);

  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([
    { id: 'log_1', action: 'الموافقة على طلب ترقية حساب المدرس "الشيخ صالح الفارس" لمنحه رخصة التدريس', type: 'teacher', time: 'منذ ١٠ دقائق', user: 'أنت' },
    { id: 'log_2', action: 'تسجيل الدارس "خالد السديري" في دورة المقرنصات الأندلسية ودفع ١٨٥ ر.س', type: 'refund', time: 'منذ ساعتين', user: 'النظام' },
    { id: 'log_3', action: 'اعتماد ونشر الدورة التراثية الأندلسية للأستاذ عبدالإله بن فهد للعموم', type: 'course', time: 'منذ ٣ ساعات', user: 'أنت' },
    { id: 'log_4', action: 'أرسل الباحث د. عبد المجيد السليمان بياناً رسمياً للانضمام ومراجعة رخصته المعرفية', type: 'teacher', time: 'منذ ٦ ساعات', user: 'النظام' }
  ]);

  // SignalR - State list for real-time notifications alerting the admin
  const [signalrConnected, setSignalrConnected] = useState<boolean>(true);
  const [signalrNotifications, setSignalrNotifications] = useState<SignalRNotification[]>([
    {
      id: 'notif_init_1',
      title: 'طلب استرداد مالي عاجل 🚨',
      message: 'قام الدارس خالد السديري برفع طلب استرداد عاجل بقيمة ٢٥٠ ر.س لدورة النقوش الثمودية.',
      type: 'refund',
      payloadId: 'REF-ATH-092',
      timestamp: 'منذ لحظات',
      read: false
    }
  ]);
  const [activeToast, setActiveToast] = useState<SignalRNotification | null>(null);

  // Expandable table rows tracker for teachers requests page
  const [expandedTeacherIds, setExpandedTeacherIds] = useState<Record<string, boolean>>({});

  // Course accreditation sidebar filtering & selection parameters
  const [selectedCourseId, setSelectedCourseId] = useState<string>('course_review_1');
  const [courseSearch, setCourseSearch] = useState<string>('');
  const [courseCategoryFilter, setCourseCategoryFilter] = useState<string>('all');
  const [courseStatusFilter, setCourseStatusFilter] = useState<string>('all');

  // Text dialog fields for rejection reviews
  const [rejectionTarget, setRejectionTarget] = useState<{ type: 'course' | 'teacher' | 'refund'; id: string } | null>(null);
  const [rejectionReasonText, setRejectionReasonText] = useState<string>('');
  const [isRejectionDialogOpen, setIsRejectionDialogOpen] = useState<boolean>(false);

  // New category inputs
  const [catNameInput, setCatNameInput] = useState<string>('');
  const [catSlugInput, setCatSlugInput] = useState<string>('');

  // --- SIGNALR DYNAMIC SIMULATION LOGIC ---
  useEffect(() => {
    if (!signalrConnected) return;

    // Simulate incoming real-time notifications over SignalR connection
    const interval = setInterval(() => {
      const odds = Math.random();
      if (odds < 0.25) {
        // Create random simulated event to wake up the admin
        const id = `notif_dyn_${Date.now()}`;
        let mockNotif: SignalRNotification;

        if (odds < 0.1) {
          const payloadId = `sim_course_${Date.now()}`;
          mockNotif = {
            id,
            title: 'دورة تدريبية جديدة مقترحة 📚',
            message: 'قام الدكتور فريد الحربي باقتراح مراجعة مساق "آثار طريق الحرير الإسلامي في دروب الجزيرة".',
            type: 'course',
            payloadId,
            timestamp: 'الآن تفاعلياً',
            read: false
          };
          injectSimulatedDataset('course', payloadId);
        } else if (odds < 0.18) {
          const payloadId = `sim_tech_${Date.now()}`;
          mockNotif = {
            id,
            title: 'طلب رخصة تدريس عاجل 🎓',
            message: 'قدّم الباحث د. عبد المجيد السليمان وثائق إجازته التراثية بانتظار الاعتماد السري.',
            type: 'teacher',
            payloadId,
            timestamp: 'الآن تفاعلياً',
            read: false
          };
          injectSimulatedDataset('teacher', payloadId);
        } else {
          const payloadId = `sim_refund_${Date.now()}`;
          mockNotif = {
            id,
            title: 'طلب مرتجع رسوم قيد التسوية 💳',
            message: 'قدّم الطالب منى العبدلي طلباً فورياً لاسترداد بقيمة ١٨٥ ر.س لمراجعة حسابها.',
            type: 'refund',
            payloadId,
            timestamp: 'الآن تفاعلياً',
            read: false
          };
          injectSimulatedDataset('refund', payloadId);
        }

        setSignalrNotifications(prev => [mockNotif, ...prev]);
        setActiveToast(mockNotif);
        displayToast('💡 إشعار بث حي فوري عبر SignalR: ' + mockNotif.title);

        // Auto remove toast after 6 seconds
        setTimeout(() => {
          setActiveToast(current => current?.id === id ? null : current);
        }, 12000); // Give the admin plenty of time to read and click!
      }
    }, 45000); // Trigger occasionally in background

    return () => clearInterval(interval);
  }, [signalrConnected]);

  // Helper function to inject simulated dataset objects into local React states for genuine reactivity
  const injectSimulatedDataset = (type: 'course' | 'teacher' | 'refund', payloadId: string) => {
    if (type === 'course') {
      setCourses(prev => {
        if (prev.some(c => c.id === payloadId)) return prev;
        const newCourse: CourseReview = {
          id: payloadId,
          title: payloadId.includes('course_review_2') 
            ? 'المعلقات السبع في ميزان النقد اللغوي الكلاسيكي والأثر الفكري المتصل'
            : 'آثار دروب الحرير القديمة في هضاب الحجاز وجبال السراة الأثرية',
          category: 'الصحراء والبلدان',
          instructorName: 'أ. فاطمة الهاشمي',
          instructorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
          price: 340,
          duration: '٢٠ ساعة مادة مسجلة',
          thumbnail: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=600',
          status: 'Pending',
          submitDate: 'اليوم (تنبيه فوري)',
          lessonsCount: 14
        };
        return [newCourse, ...prev];
      });
    } else if (type === 'teacher') {
      setTeachers(prev => {
        if (prev.some(t => t.id === payloadId)) return prev;
        const newTeacher = {
          id: payloadId,
          name: 'د. عبد المجيد السليمان',
          email: 'a.sulaiman@athari.sa',
          specialty: 'النقوش التراثية البائدة والخط الكوفي القديم',
          applyDate: 'اليوم (تنبيه فوري)',
          status: 'Pending' as const,
          qualification: 'دكتوراه في النقوش التراثية من قسم علم الآثار بجامعة جنيف للآثار',
          experience: 'عمل باحثاً ميدانياً ومدققاً للخط المسند واللغات القديمة لأكثر من ١٦ سنة',
          coverLetter: 'أسعى لنقل خبرتي المكثفة في الخطوط الكوفية القديمة والنقوش لشريحة أوسع من طلاب ومحبي التراث والآثار.'
        };
        return [newTeacher, ...prev];
      });
    } else if (type === 'refund') {
      setRefunds(prev => {
        if (prev.some(r => r.id === payloadId)) return prev;
        const newRefund = {
          id: payloadId,
          studentName: 'منى العبدلي',
          amount: 185,
          courseTitle: 'فنون ودراسات في العمارة الإسلامية والتأصيل الفاطمي بالأزهر والمساجد الكبرى',
          reason: 'تعارض أوقات المحاضرات المباشرة مع محاضراتي التخصصية الأكاديمية بنظام الساعات وعلاقتها بآثار البلدان.',
          date: 'اليوم (تنبيه فوري)',
          status: 'Pending' as const
        };
        return [newRefund, ...prev];
      });
    }
  };

  // Handle manually pushing a SignalR message for instantaneous testing
  const triggerManualSignalRSimulation = () => {
    const id = `notif_man_${Date.now()}`;
    const targetPayloadId = `sim_payload_${Date.now()}`;
    
    const dynamicEvents = [
      {
        id,
        title: 'صرف استرداد مالي عاجل لدقائق 🚨',
        message: 'تم رصد معاملة استرداد إلكترونية عاجلة للطالب منى العبدلي بانتظار إشرافك المباشر برصيد ١٨٥ ر.س.',
        type: 'refund' as const,
        payloadId: `sim_ref_${Date.now()}`,
        timestamp: 'الآن',
        read: false
      },
      {
        id,
        title: 'اعتماد سيرة ذاتية معلقة للتدريس 🎓',
        message: 'قام د. عبد المجيد السليمان بإرفاق مستندات مؤهلاته النبطية ويرغب في تدقيقها لحظياً للاعتماد.',
        type: 'teacher' as const,
        payloadId: `sim_tech_${Date.now()}`,
        timestamp: 'الآن',
        read: false
      },
      {
        id,
        title: 'تقديم مقرر أثري للمصادقة 📚',
        message: 'تم رفع مقرر "المعلقات السبع في ميزان النقد اللغوي الكلاسيكي" من أ. فاطمة الهاشمي لطلب النشر بالدليل.',
        type: 'course' as const,
        payloadId: `sim_course_review_2`,
        timestamp: 'الآن',
        read: false
      }
    ];

    const chosen = dynamicEvents[Math.floor(Math.random() * dynamicEvents.length)];
    
    // Inject into the mock records lists reactive data objects so clicking notices displays genuine outcomes
    injectSimulatedDataset(chosen.type, chosen.payloadId);

    setSignalrNotifications(prev => [chosen, ...prev]);
    setActiveToast(chosen);
    displayToast('🔔 تم بث إشعار تجريبي فوري عبر SignalR Hub ونقل البيانات لقوائم المراجعة!');
    
    // Auto-insert action to audit logs
    const newLog: ActivityLog = {
      id: `log_${Date.now()}`,
      action: `تم تفعيل بث تنبيه فوري تجريبي مع تحشيد البيانات: [${chosen.title}]`,
      type: 'system',
      time: 'الآن',
      user: 'خادم SignalR'
    };
    setActivityLogs(prev => [newLog, ...prev]);
  };

  // Switch to specific element target from notification payload
  const handleFollowNotificationLink = (notif: SignalRNotification) => {
    notif.read = true;
    setActiveToast(null);

    if (notif.type === 'course') {
      setActiveTab('courses');
      setSelectedCourseId(notif.payloadId);
      displayToast(`تم نقلك وتلوين الدورة المطلوبة: ${notif.title}`);
    } else if (notif.type === 'teacher') {
      setActiveTab('teachers');
      setExpandedTeacherIds(prev => ({ ...prev, [notif.payloadId]: true }));
      displayToast(`تم تمريز وفحص طلب المدرس: ${notif.payloadId}`);
    } else if (notif.type === 'refund') {
      setActiveTab('orders-refunds');
      setFinancialSubTab('refunds');
      displayToast(`تم فتح قيد الاستردادات المالية لمعاينة المعاملة.`);
    }
  };

  // Helper calculation for total revenue and count indicators
  const statsDoneIncome = orders
    .filter(o => o.status === 'Completed')
    .reduce((sum, item) => sum + item.amount, 0);

  const statsRefundedDebit = orders
    .filter(o => o.status === 'Refunded')
    .reduce((sum, item) => sum + item.amount, 0);

  const pendingCourses = courses.filter(c => c.status === 'Pending');
  const pendingTeachers = teachers.filter(t => t.status === 'Pending');
  const pendingRefunds = refunds.filter(r => r.status === 'Pending');

  // --- ACTION HANDLERS ---
  const handleApproveCourse = (id: string) => {
    setCourses(prev => prev.map(c => c.id === id ? { ...c, status: 'Approved' } : c));
    const target = courses.find(c => c.id === id);
    if (target) {
      // Append audit log
      const newLog: ActivityLog = {
        id: `log_${Date.now()}`,
        action: `تم اعتماد ونشر مقرر التدريس المعرفي: "${target.title}" بنجاح للطلاب`,
        type: 'course',
        time: 'منذ ثوانٍ',
        user: 'أنت'
      };
      setActivityLogs(prev => [newLog, ...prev]);
      displayToast(`✅ مبارك! تم إقرار واعتماد مقرر الدورة ونشره فوراً في دليل آثاري.`);
    }
  };

  const handleOpenRejectionDialog = (type: 'course' | 'teacher' | 'refund', id: string) => {
    setRejectionTarget({ type, id });
    setRejectionReasonText('');
    setIsRejectionDialogOpen(true);
  };

  const handleConfirmRejectionAction = () => {
    if (!rejectionTarget || !rejectionReasonText.trim()) return;

    if (rejectionTarget.type === 'course') {
      setCourses(prev => prev.map(c => c.id === rejectionTarget.id ? { ...c, status: 'Rejected', rejectionReason: rejectionReasonText } : c));
      const target = courses.find(c => c.id === rejectionTarget.id);
      if (target) {
        setActivityLogs(prev => [{
          id: `log_${Date.now()}`,
          action: `إعادة المساق وحظر اعتماد دورة "${target.title}" لملاحظات علمية`,
          type: 'course',
          time: 'الآن',
          user: 'أنت'
        }, ...prev]);
        displayToast(`❌ تم رفض ونقض اعتماد المقرر وإصدار خطاب الملاحظات للمعد.`);
      }
    } else if (rejectionTarget.type === 'teacher') {
      setTeachers(prev => prev.map(t => t.id === rejectionTarget.id ? { ...t, status: 'Rejected' } : t));
      const target = teachers.find(t => t.id === rejectionTarget.id);
      if (target) {
        setActivityLogs(prev => [{
          id: `log_${Date.now()}`,
          action: `رفض ترشيح المتقدم للتدريس: "${target.name}" لعدم كفاية المؤيد الأكاديمي`,
          type: 'teacher',
          time: 'الآن',
          user: 'أنت'
        }, ...prev]);
        displayToast(`❌ تم ترحيل طلب الباحث وتأجيل صلاحياته مع مخاطبته لتقديم مستندات أشمل.`);
      }
    } else if (rejectionTarget.type === 'refund') {
      setRefunds(prev => prev.map(r => r.id === rejectionTarget.id ? { ...r, status: 'Rejected', rejectionReason: rejectionReasonText } : r));
      const target = refunds.find(r => r.id === rejectionTarget.id);
      if (target) {
        setActivityLogs(prev => [{
          id: `log_${Date.now()}`,
          action: `رفض مرتجع الرسوم وسحب الدفعة للمستفيد "${target.studentName}" بمبرر اللائحة`,
          type: 'refund',
          time: 'الآن',
          user: 'أنت'
        }, ...prev]);
        displayToast(`❌ تم رفض صرف طلب الاسترداد وحفظ المعاملة استناداً إلى اللائحة العامة للمنصة.`);
      }
    }

    setIsRejectionDialogOpen(false);
    setRejectionTarget(null);
    setRejectionReasonText('');
  };

  const handleApproveTeacherLicense = (id: string) => {
    setTeachers(prev => prev.map(t => t.id === id ? { ...t, status: 'Approved' } : t));
    const target = teachers.find(t => t.id === id);
    if (target) {
      setActivityLogs(prev => [{
        id: `log_${Date.now()}`,
        action: `منح وإصدار رتبة "مدرّس مرخص معتمد" للباحث ${target.name}`,
        type: 'teacher',
        time: 'منذ ثوانٍ',
        user: 'أنت'
      }, ...prev]);
      displayToast(`🎉 عظيم! تم تفويض رخصة التدريس المعرفي ودخول المدرس لقاعة الشرف بنجاح.`);
    }
  };

  const handleApproveRefundTransaction = (id: string) => {
    setRefunds(prev => prev.map(r => r.id === id ? { ...r, status: 'Approved' } : r));
    const target = refunds.find(r => r.id === id);
    if (target) {
      // Set matching orders status to Refunded
      setOrders(prev => prev.map(o => o.studentName === target.studentName && target.courseTitle.includes(o.courseTitle.substring(0, 10)) ? { ...o, status: 'Refunded' } : o));
      
      setActivityLogs(prev => [{
        id: `log_${Date.now()}`,
        action: `الموافقة وصرف الاسترداد المالي للمستفيد "${target.studentName}" بمبلغ ${target.amount} ر.س`,
        type: 'refund',
        time: 'الآن',
        user: 'أنت'
      }, ...prev]);
      displayToast(`💳 تم توجيه أمر صرف وموازنة المرتجع بقيمة ${target.amount} ر.س إلى حساب الدارس بنجاح.`);
    }
  };

  const handleAddNewCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catNameInput.trim() || !catSlugInput.trim()) {
      displayToast('⚠️ فضلاً، ينبغي ملء اسم القسم والرمز التبويبي بالكامل.');
      return;
    }

    const cleanSlug = catSlugInput.toLowerCase().trim().replace(/\s+/g, '-');
    const newCat: Category = {
      id: `cat_${Date.now()}`,
      name: catNameInput,
      slug: cleanSlug,
      courseCount: 0
    };

    setCategories(prev => [...prev, newCat]);
    setCatNameInput('');
    setCatSlugInput('');
    setActivityLogs(prev => [{
      id: `log_${Date.now()}`,
      action: `أنشئ وتبويب قسم تراثي معرفي جديد بالمنصة: "${newCat.name}"`,
      type: 'system',
      time: 'منذ ثوانٍ',
      user: 'أنت'
    }, ...prev]);
    displayToast(`✨ تم إشعاع وتبويب قسم "${newCat.name}" كبوابة تدريبية جديدة بالمنصة.`);
  };

  const handleDeleteCategoryObj = (id: string) => {
    const target = categories.find(c => c.id === id);
    if (!target) return;
    setCategories(prev => prev.filter(c => c.id !== id));
    setActivityLogs(prev => [{
      id: `log_${Date.now()}`,
      action: `إلغاء وحذف فئة التراث والتبويب: "${target.name}"`,
      type: 'system',
      time: 'الآن',
      user: 'أنت'
    }, ...prev]);
    displayToast(`🧹 تم مسح التبويب المعرفي وعزل مكنونات القسم بنجاح.`);
  };

  // Switch row expanded visibility for teacher CV inspection
  const toggleTeacherRowExpanded = (id: string) => {
    setExpandedTeacherIds(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Filter pending review list logic
  const activeReviewList = courses.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(courseSearch.toLowerCase()) || 
                          c.instructorName.toLowerCase().includes(courseSearch.toLowerCase());
    const matchesCategory = courseCategoryFilter === 'all' || c.category === courseCategoryFilter;
    
    // Support 'PendingReview' and 'Pending' interchangeably for status queries
    const statusLower = c.status.toLowerCase();
    const filterLower = courseStatusFilter.toLowerCase();
    
    let matchesStatus = true;
    if (filterLower !== 'all') {
      if (filterLower === 'pendingreview' || filterLower === 'pending') {
        matchesStatus = statusLower === 'pending' || statusLower === 'pendingreview';
      } else {
        matchesStatus = statusLower === filterLower;
      }
    }
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const currentlySelectedCourse = courses.find(c => c.id === selectedCourseId) || courses[0];

  return (
    <div className="bg-transparent min-h-screen flex flex-col font-sans transition-colors duration-250 w-full" dir="rtl" id="admin-dashboard-container">
      
      {/* Dynamic Background Motif */}
      <div className="absolute inset-x-0 top-0 h-[480px] overflow-hidden pointer-events-none z-0">
        <div className="bg-heritage-pattern opacity-[0.06] absolute inset-0" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#962D15]/5 via-amber-500/0 to-transparent" />
      </div>

      <div className="flex flex-1 relative z-10 flex-col lg:flex-row">
        
        {/* 🟢 FLOATING SIGNALR NOTIFICATION SYSTEM POPUP */}
        <AnimatePresence>
          {activeToast && (
            <motion.div 
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="fixed bottom-6 left-6 z-50 bg-stone-930 bg-stone-900 text-stone-100 max-w-md p-5 rounded-3xl shadow-2xl border border-orange-500/30 text-right flex flex-col gap-3 font-sans leading-relaxed"
              id="signalr-floating-alert"
            >
              <div className="flex items-center justify-between text-xs border-b border-stone-800 pb-2">
                <span className="flex items-center gap-1.5 text-amber-400 font-extrabold">
                  <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping shrink-0" />
                  <span>بث حي فوري (SignalR Direct Alert)</span>
                </span>
                <button 
                  onClick={() => setActiveToast(null)}
                  className="text-stone-400 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-1">
                <h4 className="text-xs font-black text-white">{activeToast.title}</h4>
                <p className="text-[11px] text-stone-300 leading-normal">{activeToast.message}</p>
              </div>

              <div className="flex gap-2.5 justify-end pt-1">
                <button
                  onClick={() => handleFollowNotificationLink(activeToast)}
                  className="bg-orange-600 bg-orange-700 hover:bg-orange-800 text-white rounded-xl text-[10px] font-black px-4 py-2 border-0 cursor-pointer transition shadow-sm"
                >
                  معاينة واتخاذ قرار الآن
                </button>
                <button
                  onClick={() => setActiveToast(null)}
                  className="bg-stone-800 hover:bg-stone-700 text-stone-400 rounded-xl text-[10px] font-bold px-3 py-2 border-0 cursor-pointer"
                >
                  تجاهل
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* RIGHT SIDEBAR - Collapse Navigation */}
        <AnimatePresence mode="wait">
          {isSidebarOpen && (
            <motion.aside
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 280 }}
              exit={{ opacity: 0, width: 0 }}
              className="hidden lg:flex flex-col bg-[var(--color-contrast)] text-[var(--color-contrast-foreground)] border-l border-[var(--color-contrast-border)] min-h-screen px-4 py-8 justify-between sticky top-0"
              id="admin-sidebar"
            >
              <div className="space-y-8">
                
                {/* Branding segment */}
                <div className="flex items-center gap-3 px-2 border-b border-orange-900 pb-5">
                  <div className="w-10 h-10 rounded-xl bg-orange-700 flex items-center justify-center shadow-lg border border-orange-600">
                    <Sparkles className="w-5 h-5 text-amber-50" />
                  </div>
                  <div>
                    <h2 className="font-extrabold text-[#fbbf24] text-sm tracking-tight">بوابة المشرفين آثاري</h2>
                    <p className="text-[10px] text-stone-300 font-light">بوابة التدقيق والتحكيم العالي</p>
                  </div>
                </div>

                {/* SignalR Node Status */}
                <div className="bg-orange-950/40 border border-orange-900/60 p-3 rounded-2xl space-y-2 text-right">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-orange-400 font-semibold">تنبيهات البث الفوري</span>
                    <span className={`flex items-center gap-1 text-[10px] font-extrabold ${signalrConnected ? 'text-emerald-400' : 'text-stone-400'}`}>
                      <span className={`w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse shrink-0`} />
                      <span>{signalrConnected ? 'متصل (SignalR)' : 'غير متصل'}</span>
                    </span>
                  </div>
                  <p className="text-[10px] text-stone-300 leading-normal font-light">
                    يتلقى المشرفون تذكيرات حية عند اقتراح دورات جديدة أو ورود معاملات مالية عاجلة.
                  </p>
                  <div className="flex gap-1 pt-1.5">
                    <button
                      onClick={triggerManualSignalRSimulation}
                      className="flex-1 text-[9px] bg-orange-900/40 hover:bg-orange-900/80 text-amber-100 font-extrabold py-1 px-2 rounded-lg transition border-0 cursor-pointer text-center"
                      title="محاكاة وصول معاملة للمشرفين عبر الخوادم"
                    >
                      بث تجريبي 🔔
                    </button>
                    <button
                      onClick={() => setSignalrConnected(!signalrConnected)}
                      className={`px-2 py-1 text-[9px] font-black rounded-lg transition cursor-pointer border-0 ${signalrConnected ? 'bg-red-900/40 text-red-100 hover:bg-red-900/70' : 'bg-emerald-900/45 text-emerald-100 hover:bg-emerald-900/70'}`}
                    >
                      {signalrConnected ? 'قطع' : 'ربط'}
                    </button>
                  </div>
                </div>

                {/* Navigation links */}
                <nav className="space-y-1.5 pt-4">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`w-full flex items-center justify-between gap-3 px-3 py-3 rounded-xl transition text-right text-xs font-bold border-0 cursor-pointer ${
                      activeTab === 'overview' ? 'bg-orange-800 text-amber-200' : 'bg-transparent text-stone-300 hover:bg-orange-900/40 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <BarChart2 className="w-4 h-4 text-orange-500" />
                      <span>لوحة المعاينة العامة</span>
                    </div>
                  </button>

                  <button
                    onClick={() => setActiveTab('courses')}
                    className={`w-full flex items-center justify-between gap-3 px-3 py-3 rounded-xl transition text-right text-xs font-bold border-0 cursor-pointer ${
                      activeTab === 'courses' ? 'bg-orange-800 text-amber-200' : 'bg-transparent text-stone-300 hover:bg-orange-900/40 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <BookOpen className="w-4 h-4 text-orange-500" />
                      <span>طابور تحكيم المقررات</span>
                    </div>
                    {pendingCourses.length > 0 && (
                      <span className="bg-amber-400 text-[var(--color-brand-orange-950)] font-black text-[9px] px-1.5 py-0.5 rounded-full">
                        {pendingCourses.length}
                      </span>
                    )}
                  </button>

                  <button
                    onClick={() => setActiveTab('teachers')}
                    className={`w-full flex items-center justify-between gap-3 px-3 py-3 rounded-xl transition text-right text-xs font-bold border-0 cursor-pointer ${
                      activeTab === 'teachers' ? 'bg-orange-800 text-amber-200' : 'bg-transparent text-stone-300 hover:bg-orange-900/40 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Award className="w-4 h-4 text-orange-500" />
                      <span>طلبات رخص التدريس</span>
                    </div>
                    {pendingTeachers.length > 0 && (
                      <span className="bg-orange-500 text-white font-black text-[9px] px-1.5 py-0.5 rounded-full">
                        {pendingTeachers.length}
                      </span>
                    )}
                  </button>

                  <button
                    onClick={() => setActiveTab('orders-refunds')}
                    className={`w-full flex items-center justify-between gap-3 px-3 py-3 rounded-xl transition text-right text-xs font-bold border-0 cursor-pointer ${
                      activeTab === 'orders-refunds' ? 'bg-orange-800 text-amber-200' : 'bg-transparent text-stone-300 hover:bg-orange-900/40 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <DollarSign className="w-4 h-4 text-orange-500" />
                      <span>العمليات والاستردادات</span>
                    </div>
                    {pendingRefunds.length > 0 && (
                      <span className="bg-red-500 text-white font-black text-[9px] px-1.5 py-0.5 rounded-full">
                        {pendingRefunds.length}
                      </span>
                    )}
                  </button>

                  <button
                    onClick={() => setActiveTab('categories')}
                    className={`w-full flex items-center justify-between gap-3 px-3 py-3 rounded-xl transition text-right text-xs font-bold border-0 cursor-pointer ${
                      activeTab === 'categories' ? 'bg-orange-800 text-amber-200' : 'bg-transparent text-stone-300 hover:bg-orange-900/40 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Grid className="w-4 h-4 text-orange-500" />
                      <span>إدارة أقسام التراث</span>
                    </div>
                  </button>

                  <button
                    onClick={() => setActiveTab('reviews')}
                    className={`w-full flex items-center justify-between gap-3 px-3 py-3 rounded-xl transition text-right text-xs font-bold border-0 cursor-pointer ${
                      activeTab === 'reviews' ? 'bg-orange-800 text-amber-200' : 'bg-transparent text-stone-300 hover:bg-orange-900/40 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <MessageSquare className="w-4 h-4 text-orange-500" />
                      <span>نظام مراجعة التقييمات</span>
                    </div>
                  </button>

                  <button
                    onClick={() => setActiveTab('announcements')}
                    className={`w-full flex items-center justify-between gap-3 px-3 py-3 rounded-xl transition text-right text-xs font-bold border-0 cursor-pointer ${
                      activeTab === 'announcements' ? 'bg-orange-800 text-amber-200' : 'bg-transparent text-stone-300 hover:bg-orange-900/40 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Megaphone className="w-4 h-4 text-orange-500" />
                      <span>مركز الإعلانات والأخبار</span>
                    </div>
                  </button>

                  <button
                    onClick={() => setActiveTab('media')}
                    className={`w-full flex items-center justify-between gap-3 px-3 py-3 rounded-xl transition text-right text-xs font-bold border-0 cursor-pointer ${
                      activeTab === 'media' ? 'bg-orange-800 text-amber-200' : 'bg-transparent text-stone-300 hover:bg-orange-900/40 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <FolderOpen className="w-4 h-4 text-orange-500" />
                      <span>مكتبة الوسائط المركزية</span>
                    </div>
                  </button>

                  <button
                    onClick={() => setActiveTab('system-logs')}
                    className={`w-full flex items-center justify-between gap-3 px-3 py-3 rounded-xl transition text-right text-xs font-bold border-0 cursor-pointer ${
                      activeTab === 'system-logs' ? 'bg-orange-800 text-amber-200' : 'bg-transparent text-stone-300 hover:bg-orange-900/40 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Clock className="w-4 h-4 text-orange-500" />
                      <span>سجل النشاطات وإعدادات النظام</span>
                    </div>
                  </button>

                  <button
                    onClick={() => setActiveTab('settings')}
                    className={`w-full flex items-center justify-between gap-3 px-3 py-3 rounded-xl transition text-right text-xs font-bold border-0 cursor-pointer ${
                      activeTab === 'settings' ? 'bg-orange-800 text-amber-200' : 'bg-transparent text-stone-300 hover:bg-orange-900/40 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Settings className="w-4 h-4 text-orange-500" />
                      <span>قوانين واشتراطات التدقيق</span>
                    </div>
                  </button>
                </nav>
              </div>

              {/* Bottom logout area */}
              <div className="pt-6 border-t border-orange-900 space-y-4">
                <div className="flex items-center gap-3 px-1">
                  <div className="w-9 h-9 rounded-full bg-orange-700 flex items-center justify-center text-xs font-bold text-amber-50">م</div>
                  <div>
                    <h4 className="text-xs font-black text-amber-50">{userName}</h4>
                    <p className="text-[10px] text-[#fbbf24]">كبير مدققي المنصة</p>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400 hover:bg-red-950/40 hover:text-red-300 transition text-right text-xs font-semibold cursor-pointer border-0 bg-transparent"
                >
                  <LogOut className="w-4 h-4" />
                  <span>الخروج من كابينة الإشراف</span>
                </button>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* ─── LEFT WORKBENCH PAGE SHEET ─── */}
        <main className="flex-1 px-4 sm:px-8 py-8 overflow-x-hidden min-h-screen relative z-10 space-y-6" id="admin-workbench-main">

          {/* Core Layout Header, modeled after Teacher Dashboard */}
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
                  مجلس الرقابة المعتمد بالمنصة 👑
                </div>
              </div>
              <h1 className="text-xl font-extrabold text-[var(--color-brand-orange-950)]">
                أهلاً بك في مقصورة الرقابة والتحكيم العالي
              </h1>
              <p className="text-xs text-stone-500 mt-1">تتبع مؤشرات الاستثمار العيني وسير مراجعة مناهجك وتأليفها.</p>
            </div>
          </div>

        {/* =========================================================================
            1. TAB OVERVIEW - PLATFORM METRICS & ACTIVITY FEEDS 
            ========================================================================= */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-fade-in" id="overview-workbench-tab">
            
            {/* Top Stat Summary Section (Stats Dashboard) */}
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
                  <button 
                    onClick={() => {
                      displayToast('🔄 تم فحص قنوات الربط بالخلفية وتدقيق المقاعد المفتوحة.');
                      setActivityLogs(prev => [{
                        id: `log_${Date.now()}`,
                        action: 'تحديث بيانات الاعتماد والمقاعد النشطة مع قنوات الإشراف الكبرى',
                        type: 'system',
                        time: 'الآن',
                        user: userName
                      }, ...prev]);
                    }}
                    className="p-2 border border-stone-200 hover:bg-stone-50 rounded-xl bg-white text-stone-700 cursor-pointer transition flex items-center justify-center shadow-xs"
                    title="تحديث البيانات فورياً"
                  >
                    <RefreshCw className="w-4 h-4 text-stone-500" />
                  </button>
                </div>
              </div>

              {/* Stats Card Grid Row - Inspired by Shadcn UI */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mt-6">
                
                {/* 1. Revenue Stat */}
                <div className="bg-white p-5 rounded-2xl border border-amber-100/70 shadow-xs flex flex-col justify-between space-y-3 relative overflow-hidden group">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <span className="text-[11px] text-stone-500 font-bold block">صافي الإيرادات المكتسبة</span>
                      <span className="text-lg font-mono font-black text-stone-900 leading-none">{(statsDoneIncome).toLocaleString('ar-SA')} ر.س</span>
                    </div>
                    <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100">
                      <DollarSign className="w-4.5 h-4.5" />
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-emerald-700 bg-emerald-50/50 py-1 px-2.5 rounded-lg w-fit">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>ارتفاع مقداره ١٦٪ هذا الشهر</span>
                  </div>
                  <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-400 to-teal-500" />
                </div>

                {/* 2. Total active verified courses */}
                <div className="bg-white p-5 rounded-2xl border border-amber-100/70 shadow-xs flex flex-col justify-between space-y-3 relative overflow-hidden group">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <span className="text-[11px] text-stone-500 font-bold block">المقررات المعتمدة بالدليل</span>
                      <span className="text-lg font-mono font-black text-stone-900 leading-none">
                        {courses.filter(c => c.status === 'Approved').length} حقائب منشورة
                      </span>
                    </div>
                    <div className="p-2.5 bg-amber-50 text-amber-900 rounded-xl border border-amber-100">
                      <BookOpen className="w-4.5 h-4.5 text-amber-700" />
                    </div>
                  </div>
                  <div className="text-[10px] text-amber-700 flex items-center gap-1">
                    <span>• {courses.filter(c => c.status === 'Pending').length} مقررات قيد المراجعة</span>
                  </div>
                  <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-amber-400 to-orange-500" />
                </div>

                {/* 3. Approved Instructors */}
                <div className="bg-white p-5 rounded-2xl border border-amber-100/70 shadow-xs flex flex-col justify-between space-y-3 relative overflow-hidden group">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <span className="text-[11px] text-stone-500 font-bold block">الأعضاء والمدربون المرخصون</span>
                      <span className="text-lg font-mono font-black text-stone-900 leading-none">
                        {teachers.filter(t => t.status === 'Approved').length + 4} علماء وباحثين
                      </span>
                    </div>
                    <div className="p-2.5 bg-orange-50 text-orange-950 rounded-xl border border-orange-100">
                      <Award className="w-4.5 h-4.5 text-orange-700" />
                    </div>
                  </div>
                  <div className="text-[10px] text-orange-800 bg-orange-50 border border-orange-100 py-0.5 px-2 rounded-md w-fit font-mono font-bold">
                    ترخيص معتمد بلائحة الوزارة
                  </div>
                  <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-orange-400 to-red-500" />
                </div>

                {/* 4. Active enrollments */}
                <div className="bg-white p-5 rounded-2xl border border-amber-100/70 shadow-xs flex flex-col justify-between space-y-3 relative overflow-hidden group">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <span className="text-[11px] text-stone-500 font-bold block">مرتجعات الرسوم المعلقة</span>
                      <span className="text-lg font-mono font-black text-red-800 leading-none">
                        {refunds.filter(r => r.status === 'Pending').length} طلبات تسوية
                      </span>
                    </div>
                    <div className="p-2.5 bg-red-50 text-red-800 rounded-xl border border-red-100">
                      <CreditCard className="w-4.5 h-4.5" />
                    </div>
                  </div>
                  <div className="text-[10px] text-red-700 flex items-center gap-1 font-bold">
                    <span>تبلغ قيمتها: {refunds.filter(r => r.status === 'Pending').reduce((a, b) => a + b.amount, 0)} ر.س</span>
                  </div>
                  <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-red-400 to-rose-600" />
                </div>

              </div>
            </div>

            {/* 📈 ADVANCED ANALYTICS DASHBOARD WITH RECHARTS (Phase 8 Requirement) */}
            <AdvancedAnalytics />

            {/* Quick Review Queues Callout Cards (بطاقات طوابير المراجعة لفتح التبويبات مباشرة) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* 1. Courses Accredit Card */}
              <div className="bg-white p-6 rounded-3xl border border-amber-200/80 shadow-xs text-right space-y-4 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 bg-amber-50 text-amber-900 rounded-2xl flex items-center justify-center font-bold border border-amber-100">
                      📚
                    </div>
                    <span className="text-xs bg-amber-100 text-amber-900 border border-amber-200 font-black px-2.5 py-0.5 rounded-full">
                      {pendingCourses.length} دورات معلّقة
                    </span>
                  </div>
                  <h3 className="text-xs md:text-sm font-black text-stone-900 font-serif">طابور مراجعة المقررات</h3>
                  <p className="text-[11px] text-stone-500 font-light leading-relaxed">
                    مراجعة المناهج والملفات الأثرية لتوثيق النقوش وعقود العمارة الإسلامية والتصريح بالدروس وتدبيجها.
                  </p>
                </div>
                
                <button
                  onClick={() => setActiveTab('courses')}
                  className="w-full text-center bg-orange-700 hover:bg-orange-800 text-white font-extrabold text-xs py-2.5 px-4 rounded-xl border-0 cursor-pointer transition shadow-xs mt-2"
                >
                  فتح طابور المقررات ({pendingCourses.length}) ➔
                </button>
              </div>

              {/* 2. Teacher requests Card */}
              <div className="bg-white p-6 rounded-3xl border border-amber-200/80 shadow-xs text-right space-y-4 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 bg-orange-50 text-orange-950 rounded-2xl flex items-center justify-center font-bold border border-orange-100">
                      🎓
                    </div>
                    <span className="text-xs bg-orange-100 text-orange-950 font-black px-2.5 py-0.5 rounded-full">
                      {pendingTeachers.length} معلّقين
                    </span>
                  </div>
                  <h3 className="text-xs md:text-sm font-black text-stone-900 font-serif">طابور رخص التدريس الكبرى</h3>
                  <p className="text-[11px] text-stone-500 font-light leading-relaxed">
                    فحص طلبات الباحثين، تفنيد سيرهم الذاتية، وتحميل مستنداتهم المصدقة ومنحهم تذكرة الترشيح للعموم.
                  </p>
                </div>
                
                <button
                  onClick={() => setActiveTab('teachers')}
                  className="w-full text-center bg-orange-700 hover:bg-orange-800 text-white font-extrabold text-xs py-2.5 px-4 rounded-xl border-0 cursor-pointer transition shadow-xs mt-2"
                >
                  فحص طلبات الانضمام ({pendingTeachers.length}) ➔
                </button>
              </div>

              {/* 3. Refund management Card */}
              <div className="bg-white p-6 rounded-3xl border border-amber-200/80 shadow-xs text-right space-y-4 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 bg-red-50 text-red-00 rounded-2xl flex items-center justify-center font-bold border border-red-100">
                      💳
                    </div>
                    <span className="text-xs bg-red-100 text-red-800 font-black px-2.5 py-0.5 rounded-full">
                      {pendingRefunds.length} طلب استرداد
                    </span>
                  </div>
                  <h3 className="text-xs md:text-sm font-black text-stone-900 font-serif">طلبات الاسترداد والتسوية</h3>
                  <p className="text-[11px] text-stone-500 font-light leading-relaxed">
                    معالجة فواتير مرتجعات الرسوم ومراجعة مبررات الاسترداد المرفقة من الدارسين تفادياً للخلافات المالية.
                  </p>
                </div>
                
                <button
                  onClick={() => {
                    setActiveTab('orders-refunds');
                    setFinancialSubTab('refunds');
                  }}
                  className="w-full text-center bg-orange-700 hover:bg-orange-800 text-white font-extrabold text-xs py-2.5 px-4 rounded-xl border-0 cursor-pointer transition shadow-xs mt-2"
                >
                  معالجة مرتجعات الرسوم ({pendingRefunds.length}) ➔
                </button>
              </div>

            </div>

            {/* Recent Activities Log Section (سجل أعمال المراجعة والتدقيق) */}
            <div className="bg-white rounded-3xl border border-amber-200/80 shadow-xs overflow-hidden">
              <div className="p-5 bg-amber-50/40 border-b border-amber-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="text-right">
                  <h3 className="text-xs md:text-sm font-black text-stone-900 font-serif flex items-center gap-2">
                    <Archive className="w-4.5 h-4.5 text-stone-700" />
                    <span>سجل الأعمال الرقابية والنشاطات الأخيرة (Audit Trail)</span>
                  </h3>
                  <p className="text-[10px] text-stone-500 font-light mt-0.5">
                    عمليات رصد وتحكيم المحاضرات وإجازة الباحثين وتأصيل الصرف الهيكلي والتحكيم الفوري.
                  </p>
                </div>

                <div className="text-[10px] bg-white border border-amber-200/80 rounded-xl px-2.5 py-1 text-stone-600 font-mono">
                  معاملات حية مصدقة
                </div>
              </div>

              {/* Activities Ledger Table */}
              <div className="overflow-x-auto text-right">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-stone-50 border-b border-stone-100 text-stone-500 text-[10px] font-bold">
                      <th className="p-4">رقم الحركة</th>
                      <th className="p-4">التحرك الإجرائي للعملية</th>
                      <th className="p-4 text-center">نوع التصنيف</th>
                      <th className="p-4">توقيت الحركة</th>
                      <th className="p-4">القائم بالتدقيق</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 font-light text-stone-700">
                    {activityLogs.map((log) => {
                      let tagAndBadge = 'bg-stone-100 text-stone-700 border-stone-200 border';
                      if (log.type === 'course') tagAndBadge = 'bg-amber-50 text-amber-800 border-amber-100 border';
                      else if (log.type === 'teacher') tagAndBadge = 'bg-emerald-50 text-emerald-800 border-emerald-100 border';
                      else if (log.type === 'refund') tagAndBadge = 'bg-red-50 text-red-800 border-red-100 border';
                      else if (log.type === 'system') tagAndBadge = 'bg-blue-50 text-blue-800 border-blue-100 border';

                      return (
                        <tr key={log.id} className="hover:bg-amber-50/10 transition">
                          <td className="p-4 font-mono text-[10px] text-stone-400">ATH-LOG-{log.id.slice(-4)}</td>
                          <td className="p-4 text-stone-900 font-semibold">{log.action}</td>
                          <td className="p-4 text-center">
                            <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black ${tagAndBadge}`}>
                              {log.type === 'course' ? 'مقررات' : log.type === 'teacher' ? 'مدرسين' : log.type === 'refund' ? 'ماليات وعمليات' : 'أصالة النظام'}
                            </span>
                          </td>
                          <td className="p-4 text-stone-500 text-[10px]">{log.time}</td>
                          <td className="p-4 font-medium">{log.user}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* =========================================================================
            2. TAB COURSES - COURSE MODERATION QUEUE WITH ACCORDION PREVIEW & FILTERS
            ========================================================================= */}
        {activeTab === 'courses' && (
          <div className="space-y-6 animate-fade-in" id="CourseModerationQueue-wrapper">
            
            <div className="text-right border-b border-amber-100 pb-4">
              <span className="text-[10px] text-amber-600 font-black block">اتخاذ القرارات وإقرار المناهج العلمية</span>
              <h2 className="text-sm md:text-base font-black text-stone-900 font-serif mt-1">
                غرفة تحكيم واعتماد المناهج (CourseModerationQueue)
              </h2>
              <p className="text-[11px] text-stone-500 font-light mt-1">
                تدقيق واجهات المساقات، تفصيل مجالس الاختبار والدروس المرفوعة وتمرير إقرار النشر أو حظره.
              </p>
            </div>

            {/* Advanced Filters & Search Bar */}
            <div className="bg-white p-5 rounded-3xl border border-amber-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4 text-right">
              
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto flex-1">
                {/* Search Text Input */}
                <div className="relative flex-1 max-w-sm">
                  <input 
                    type="text"
                    placeholder="ابحث بالعنوان أو الباحث أو المدرب..."
                    value={courseSearch}
                    onChange={(e) => setCourseSearch(e.target.value)}
                    className="w-full p-2.5 pr-9 text-xs bg-stone-50 text-stone-900 border border-stone-200 rounded-xl focus:outline-none focus:border-orange-600 focus:bg-white text-right leading-none"
                  />
                  <Search className="absolute right-3 top-3 w-4 h-4 text-stone-400" />
                </div>

                {/* Category Selector */}
                <div className="flex items-center gap-2">
                  <label className="text-[10px] font-bold text-stone-500 whitespace-nowrap shrink-0">الفئة التراثية:</label>
                  <select
                    value={courseCategoryFilter}
                    onChange={(e) => setCourseCategoryFilter(e.target.value)}
                    className="p-2 text-xs bg-stone-50 text-stone-900 border border-stone-200 rounded-xl focus:outline-none focus:border-orange-600 leading-normal"
                  >
                    <option value="all">جميع الفئات والمعارف</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                {/* Status Selector */}
                <div className="flex items-center gap-2">
                  <label className="text-[10px] font-bold text-stone-500 whitespace-nowrap shrink-0">حالة الطلب:</label>
                  <select
                    value={courseStatusFilter}
                    onChange={(e) => setCourseStatusFilter(e.target.value)}
                    className="p-2 text-xs bg-stone-50 text-stone-900 border border-stone-200 rounded-xl focus:outline-none focus:border-orange-600 leading-normal"
                  >
                    <option value="all">جميع الحالات بالموقع</option>
                    <option value="Pending">بانتظار المراجعة (PendingReview)</option>
                    <option value="Approved">تم منح الاعتماد ونظام النشر</option>
                    <option value="Rejected">تحفظ وملاحظات إرجاع</option>
                  </select>
                </div>
              </div>

              {/* Reset Quick Badge Counter */}
              <div className="bg-amber-50 text-amber-900 font-black px-3 py-1.5 rounded-2xl border border-amber-100 text-[10px] shrink-0 self-end md:self-auto uppercase">
                بانتظار التحكيم: {courses.filter(c => c.status === 'Pending').length} مساقات
              </div>

            </div>

            {/* Main Advanced Table representing CourseModerationQueue */}
            <div className="bg-white rounded-3xl border border-amber-200/80 shadow-xs overflow-hidden">
              <div className="overflow-x-auto text-right">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-[#FAF9F2] text-stone-600 font-bold border-b border-stone-200 text-right">
                      <th className="p-4 w-28">رمز المساق</th>
                      <th className="p-4">المقرر والعنونة</th>
                      <th className="p-4">شخصية المدرب ومؤهله</th>
                      <th className="p-4">محاضراته ورسومه</th>
                      <th className="p-4 text-center">حالة التحكيم الدراسي</th>
                      <th className="p-4 text-center w-56">القرار التراكمي الشريف</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {activeReviewList.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-16 text-center text-stone-400 space-y-2">
                          <div className="font-serif text-3xl text-stone-200">📜</div>
                          <p className="text-xs">لم يتم رصد أي مقررات تلائم ضوابط التصفية المدخلة.</p>
                          <button
                            onClick={() => {
                              setCourseSearch('');
                              setCourseCategoryFilter('all');
                              setCourseStatusFilter('all');
                            }}
                            className="bg-stone-100 hover:bg-stone-200 border-0 text-stone-600 rounded-lg px-2.5 py-1 text-[10px] font-bold cursor-pointer transition"
                          >
                            إلغاء التهيئة والتصفية العامة
                          </button>
                        </td>
                      </tr>
                    ) : (
                      activeReviewList.map(course => {
                        const isExpanded = course.id === selectedCourseId;
                        
                        // Status styling representation (representing Shadcn badge weights)
                        let badgeStyle = 'bg-stone-100 text-stone-600 border border-stone-200';
                        if (course.status === 'Approved') {
                          badgeStyle = 'bg-emerald-50 text-emerald-800 border border-emerald-100';
                        } else if (course.status === 'Rejected') {
                          badgeStyle = 'bg-red-50 text-red-100 border border-red-200';
                        } else if (course.status === 'Pending' || course.status === 'PendingReview') {
                          badgeStyle = 'bg-amber-50 text-amber-900 border border-amber-200 animate-pulse';
                        }

                        return (
                          <React.Fragment key={course.id}>
                            {/* Main row */}
                            <tr 
                              onClick={() => setSelectedCourseId(course.id === selectedCourseId ? '' : course.id)}
                              className={`cursor-pointer transition ${isExpanded ? 'bg-amber-50/20' : 'hover:bg-amber-50/10'}`}
                            >
                              <td className="p-4 font-mono font-bold text-stone-400 text-[10px]">
                                {course.id.toUpperCase()}
                              </td>

                              <td className="p-4 max-w-sm">
                                <div className="flex items-start gap-3">
                                  <img 
                                    src={course.thumbnail} 
                                    alt="thumb" 
                                    className="w-12 h-12 rounded-xl object-cover shrink-0 border border-amber-100" 
                                    referrerPolicy="no-referrer"
                                  />
                                  <div className="space-y-1">
                                    <span className="text-[11px] font-black text-stone-900 leading-tight block hover:text-orange-950">
                                      {course.title}
                                    </span>
                                    <span className="text-[9px] bg-amber-50 text-orange-950 font-black border border-amber-100/50 px-2 py-0.5 rounded-md inline-block font-sans">
                                      {course.category}
                                    </span>
                                  </div>
                                </div>
                              </td>

                              <td className="p-4">
                                <div className="flex items-center gap-2">
                                  <img 
                                    src={course.instructorAvatar} 
                                    alt="avatar" 
                                    className="w-5 h-5 rounded-full border border-stone-200" 
                                    referrerPolicy="no-referrer"
                                  />
                                  <span className="font-extrabold text-stone-800 text-[11px]">{course.instructorName}</span>
                                </div>
                              </td>

                              <td className="p-4">
                                <span className="block text-stone-900 font-bold">{course.lessonsCount} درساً ({course.duration})</span>
                                <span className="text-[10px] font-mono font-extrabold text-[#962D15] block mt-0.5">{course.price} ر.س</span>
                              </td>

                              <td className="p-4 text-center">
                                <span className={`px-2.5 py-1 rounded-full text-[9px] font-black tracking-wide inline-block ${badgeStyle}`}>
                                  {course.status === 'Pending' ? '⏳ قيد التحكيم الشريف' : 
                                   course.status === 'Approved' ? '🟢 معتمد ومنشور بالدليل' : '🔴 معاد للملاحظات والتصحيح'}
                                </span>
                              </td>

                              <td className="p-4 text-center" onClick={(e) => e.stopPropagation()}>
                                <div className="flex items-center justify-center gap-2">
                                  
                                  <button
                                    onClick={() => setSelectedCourseId(isExpanded ? '' : course.id)}
                                    className={`p-1.5 rounded-lg border-0 transition cursor-pointer text-[10px] font-bold flex items-center justify-center gap-1 ${
                                      isExpanded ? 'bg-orange-700 text-white' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                                    }`}
                                    title="استعراض المنهج والدروس"
                                  >
                                    <Eye className="w-3.5 h-3.5" />
                                    <span>{isExpanded ? 'طي الفهرس' : 'السيرة والمنهج'}</span>
                                  </button>

                                  {course.status === 'Pending' ? (
                                    <>
                                      <button
                                        onClick={() => handleApproveCourse(course.id)}
                                        className="bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg p-1.5 text-[10px] font-black border-0 cursor-pointer shadow-xs transition flex items-center gap-1"
                                        title="إجازة ونشر فوراً بالمنصة"
                                      >
                                        <Check className="w-3 h-3" />
                                        <span>إجازة</span>
                                      </button>

                                      <button
                                        onClick={() => handleOpenRejectionDialog('course', course.id)}
                                        className="bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 rounded-lg p-1.5 text-[10px] font-bold cursor-pointer transition flex items-center gap-1"
                                        title="إعادة للمراجعة والتصحيح"
                                      >
                                        <X className="w-3 h-3" />
                                        <span>إرجاع</span>
                                      </button>
                                    </>
                                  ) : (
                                    <span className="text-[10px] text-stone-400 font-serif">منتهي القرار</span>
                                  )}

                                </div>
                              </td>
                            </tr>

                            {/* Syllabus / Content Preview Accordion */}
                            <AnimatePresence>
                              {isExpanded && (
                                <tr className="bg-amber-50/10">
                                  <td colSpan={6} className="p-6">
                                    <motion.div
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: 'auto', opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      transition={{ duration: 0.22 }}
                                      className="overflow-hidden space-y-4 text-right"
                                    >
                                      
                                      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                        
                                        {/* Syllabus column 1 */}
                                        <div className="md:col-span-2 space-y-3">
                                          <div className="flex items-center gap-2 pb-1.5 border-b border-stone-200">
                                            <span className="w-1.5 h-1.5 bg-[#962D15] rounded-full" />
                                            <h4 className="text-xs font-black text-stone-900 font-serif">تفصيل مجلس الخطة العلمية والدروس:</h4>
                                          </div>

                                          <div className="space-y-2">
                                            <div className="p-3 bg-white border border-stone-200/80 text-[11px] rounded-xl flex items-center justify-between">
                                              <div className="space-y-0.5">
                                                <span className="font-extrabold text-stone-900 block">مجلس التمهيد التوطيني الأول: مسار وتاريخ الشواهد</span>
                                                <span className="text-stone-500 text-[10px]">محاضرات ميدانية مسجلة وعينات شواهد صالحة للتطبيق • ٦ ساعات</span>
                                              </div>
                                              <span className="bg-stone-50 px-2 py-0.5 border border-stone-100 text-stone-600 rounded text-[10px] font-mono">الدرس ١-٣</span>
                                            </div>

                                            <div className="p-3 bg-white border border-stone-200/80 text-[11px] rounded-xl flex items-center justify-between">
                                              <div className="space-y-0.5">
                                                <span className="font-extrabold text-stone-900 block">مجلس التحصيل الميداني وعقود هندسة الخط التراثية</span>
                                                <span className="text-stone-500 text-[10px]">فيديوهات ومعاينة تفصيلية بالدقة الكاملة للقطع والرموز • ٨ ساعات</span>
                                              </div>
                                              <span className="bg-stone-50 px-2 py-0.5 border border-stone-100 text-stone-600 rounded text-[10px] font-mono">الدرس ٤-٧</span>
                                            </div>

                                            <div className="p-3 bg-white border border-stone-200/80 text-[11px] rounded-xl flex items-center justify-between">
                                              <div className="space-y-0.5">
                                                <span className="font-extrabold text-stone-900 block">مجلس المذاكرة والاستجواب: حلقة بث مباشر لاختبار تحصيل الدارسين</span>
                                                <span className="text-stone-500 text-[10px]">بث مباشر تفاعلي عبر خادم آثاري لغرف المذاكرة الحية • ٤ ساعات</span>
                                              </div>
                                              <span className="bg-stone-50 px-2 py-0.5 border border-stone-100 text-slate-600 rounded text-[10px] font-mono">الدرس ٨-١٢</span>
                                            </div>
                                          </div>
                                        </div>

                                        {/* Syllabus column 2 - decision card */}
                                        <div className="bg-[#FAF9F2] p-5 rounded-2xl border-2 border-amber-200/60 border-dashed text-stone-800 space-y-4 flex flex-col justify-between">
                                          <div className="space-y-2">
                                            <span className="text-[10px] text-amber-800 uppercase tracking-widest block font-bold">وثيقة التحكيم العلمي والأدبي</span>
                                            <h5 className="font-black text-[12px] font-serif leading-tight">مراجعة سياق ونقاء المنهج الأثري</h5>
                                            <p className="text-[10px] text-stone-500 leading-relaxed font-light">
                                              يقوم مجلس الرقابة في آثاري بالتأكد من نقاء المساقات والأبحاث من انتحال الأسماء والمجهودات، وضمان غرس النوايا التوطينية الشريفة.
                                            </p>
                                          </div>

                                          {/* Rejection / Note display if available */}
                                          {course.rejectionReason && (
                                            <div className="bg-red-50 text-red-950 p-2 text-[10px] leading-normal rounded-lg border border-red-100 font-light">
                                              <strong>سبب الإرجاع:</strong> "{course.rejectionReason}"
                                            </div>
                                          )}

                                          {course.status === 'Approved' && (
                                            <div className="bg-emerald-50 text-emerald-950 p-2 text-[10px] leading-normal rounded-lg border border-emerald-100 flex items-center gap-1.5">
                                              <CheckCircle className="w-4 h-4 text-emerald-700 shrink-0" />
                                              <span>مقرر معتمد بشكل رسمي كلي.</span>
                                            </div>
                                          )}

                                          {/* Direct Decisions buttons in Expanded Area as well */}
                                          {course.status === 'Pending' && (
                                            <div className="grid grid-cols-2 gap-2 mt-2">
                                              <button
                                                onClick={() => handleApproveCourse(course.id)}
                                                className="bg-emerald-700 hover:bg-emerald-800 text-white font-black text-[10px] py-1.5 rounded-xl border-0 shadow-xs cursor-pointer text-center"
                                              >
                                                إجازة المنهج
                                              </button>
                                              <button
                                                onClick={() => handleOpenRejectionDialog('course', course.id)}
                                                className="bg-red-50 hover:bg-red-100 text-red-800 font-bold text-[10px] py-1.5 rounded-xl border border-red-200 cursor-pointer text-center"
                                              >
                                                طلب تعديل
                                              </button>
                                            </div>
                                          )}
                                        </div>

                                      </div>

                                    </motion.div>
                                  </td>
                                </tr>
                              )}
                            </AnimatePresence>
                          </React.Fragment>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}


        {/* =========================================================================
            3. TAB TEACHERS - ACCORDION EXPANDABLE ROWS FOR CV AUDITING
            ========================================================================= */}
        {activeTab === 'teachers' && (
          <div className="space-y-6 animate-fade-in" id="teachers-requests-workbench">
            
            <div className="text-right border-b border-amber-100 pb-4">
              <span className="text-[10px] text-amber-600 font-black block">فحص مؤهلات طاقم التدريس</span>
              <h2 className="text-sm md:text-base font-black text-stone-900 font-serif mt-1">
                وثائق ورخص التدريس المعلقة (Teaching Licenses Audit)
              </h2>
              <p className="text-[11px] text-stone-500 font-light mt-1">
                دراسة طلبات ترقية حسابات الباحثين لتمثيل مساقات التوطين والشواهد التراثية، مع فحص السيرة الذاتية يدوياً وتأصيل الإجازة.
              </p>
            </div>

            {/* Teaching requests list block using gorgeous Expandable Rows */}
            <div className="bg-white rounded-3xl border border-amber-200/80 shadow-xs overflow-hidden">
              <div className="p-4 bg-stone-50 border-b border-stone-200 flex flex-col sm:flex-row justify-between items-center gap-4">
                <span className="text-xs font-black text-stone-900">طلبات المتقدمين والمؤهلات الأكاديمية</span>
                <p className="text-[9px] text-stone-500 font-mono">انقر على أي سطر لاستعراض مؤهلاته الكاملة وتنزيل براهينه</p>
              </div>

              <div className="overflow-x-auto text-right">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-stone-50/50 text-stone-600 font-bold border-b border-stone-200 text-right">
                      <th className="p-4">اسم المتقدم وحسابه</th>
                      <th className="p-4">التخصص والفرع المعرفي</th>
                      <th className="p-4">تاريخ طلب الانضمام</th>
                      <th className="p-4">حالة الفحص العلمي</th>
                      <th className="p-4 text-center">تفاصيل السند والمستندات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {teachers.map(teacher => {
                      const isExpanded = !!expandedTeacherIds[teacher.id];
                      let statusBadge = 'bg-stone-100 text-stone-600 border border-stone-200';
                      if (teacher.status === 'Approved') statusBadge = 'bg-emerald-50 text-emerald-800 border border-emerald-100';
                      else if (teacher.status === 'Rejected') statusBadge = 'bg-red-50 text-red-800 border border-red-100';
                      else if (teacher.status === 'Pending') statusBadge = 'bg-amber-100 bg-amber-50 text-amber-900 border border-amber-200 animate-pulse';

                      return (
                        <>
                          {/* Main Row */}
                          <tr 
                            key={teacher.id} 
                            onClick={() => toggleTeacherRowExpanded(teacher.id)}
                            className={`cursor-pointer transition ${isExpanded ? 'bg-amber-50/30' : 'hover:bg-amber-50/10'}`}
                          >
                            <td className="p-4 font-bold text-stone-900">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-orange-50 text-orange-950 font-serif font-extrabold flex items-center justify-center border border-orange-100">
                                  {teacher.name.charAt(0)}
                                </div>
                                <div>
                                  <span className="text-xs font-black block text-stone-950">{teacher.name}</span>
                                  <span className="text-[10px] text-stone-400 block font-mono font-normal mt-0.5">{teacher.email}</span>
                                </div>
                              </div>
                            </td>

                            <td className="p-4">
                              <span className="bg-amber-50 text-orange-950/80 font-black border border-amber-100/60 px-2.5 py-1 rounded text-[10px]">
                                {teacher.specialty}
                              </span>
                            </td>

                            <td className="p-4 text-stone-500 font-mono text-[11px]">{teacher.applyDate}</td>
                            
                            <td className="p-4">
                              <span className={`px-2.5 py-1 rounded-full text-[9px] font-black ${statusBadge}`}>
                                {teacher.status === 'Pending' ? 'بانتظار التدقيق' : teacher.status === 'Approved' ? 'تم منح رخصة التدريس' : 'طلب مرفوض'}
                              </span>
                            </td>

                            <td className="p-4 text-center">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleTeacherRowExpanded(teacher.id);
                                }}
                                className="text-[11px] bg-stone-100 hover:bg-stone-200 text-stone-700 py-1.5 px-3 rounded-lg border-0 font-bold transition flex items-center gap-1.5 mx-auto cursor-pointer"
                              >
                                <span>{isExpanded ? 'إغلاق التفاصيل' : 'فحص السيرة والوثائق'}</span>
                                <ChevronDown className={`w-3.5 h-3.5 transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                              </button>
                            </td>
                          </tr>

                          {/* Expanded detail row with vintage paper layout representation */}
                          <AnimatePresence>
                            {isExpanded && (
                              <tr className="bg-amber-50/10" key={`${teacher.id}-expanded`}>
                                <td colSpan={5} className="p-6">
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.25 }}
                                    className="overflow-hidden space-y-5"
                                  >
                                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                                      
                                      {/* Qualifications text */}
                                      <div className="lg:col-span-8 space-y-4 text-right">
                                        
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                          <div className="p-4 bg-white rounded-2xl border border-stone-200">
                                            <strong className="text-stone-900 block text-xs font-black mb-1 flex items-center gap-1.5">
                                              <Briefcase className="w-4 h-4 text-orange-700" />
                                              <span>الشهادة والدرجة الأكاديمية:</span>
                                            </strong>
                                            <p className="text-xs text-stone-600 font-medium leading-relaxed">{teacher.qualification}</p>
                                          </div>

                                          <div className="p-4 bg-white rounded-2xl border border-stone-200">
                                            <strong className="text-stone-900 block text-xs font-black mb-1 flex items-center gap-1.5">
                                              <Clock className="w-4 h-4 text-orange-700" />
                                              <span>سنوات المهارة والممارسة:</span>
                                            </strong>
                                            <p className="text-xs text-stone-600 font-medium leading-relaxed">{teacher.experience}</p>
                                          </div>
                                        </div>

                                        <div className="p-4 bg-white rounded-2xl border border-stone-200 space-y-1.5">
                                          <strong className="text-stone-900 block text-xs font-black">خطاب الترشيح واستراتيجية التحفيظ التراثي:</strong>
                                          <p className="text-xs text-stone-600 font-serif italic leading-relaxed">
                                            "{teacher.coverLetter}"
                                          </p>
                                        </div>

                                        {/* Actions block on expanded view */}
                                        {teacher.status === 'Pending' && (
                                          <div className="pt-2 flex items-center gap-3">
                                            <button
                                              onClick={() => handleApproveTeacherLicense(teacher.id)}
                                              className="bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-black px-5 py-2.5 border-0 shadow-sm transition cursor-pointer flex items-center gap-1.5"
                                            >
                                              <Check className="w-3.5 h-3.5" />
                                              <span>منح تفويض رخصة تدريس (أجازة للباحث)</span>
                                            </button>

                                            <button
                                              onClick={() => handleOpenRejectionDialog('teacher', teacher.id)}
                                              className="bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 px-4 py-2.5 text-xs rounded-xl font-bold transition cursor-pointer"
                                            >
                                              رفض مؤقت وتأجيل رخصة المتقدم
                                            </button>
                                          </div>
                                        )}

                                      </div>

                                      {/* Qualifications Document/Parchment Preview Mockup on left */}
                                      <div className="lg:col-span-4 bg-[#FBF9F2] border-2 border-amber-200 border-dashed rounded-3xl p-5 text-center space-y-3 relative overflow-hidden shadow-inner">
                                        <div className="absolute top-2 left-2 w-8 h-8 rounded-full border border-amber-200/50 opacity-40 flex items-center justify-center font-serif text-[10px]">
                                          إثبات
                                        </div>

                                        {/* Golden Seal element */}
                                        <div className="w-12 h-12 bg-amber-500 rounded-full border-4 border-amber-600 mx-auto flex items-center justify-center text-stone-900 font-bold shadow-md transform rotate-12">
                                          ★
                                        </div>

                                        <div className="space-y-1">
                                          <span className="text-[10px] text-amber-800 font-black block">السيرة والوثائق الرسمية الشريفة</span>
                                          <span className="text-[9px] text-stone-400 block font-mono">الملف الملحق: ATH_PRO_RESUME.pdf</span>
                                        </div>

                                        <div className="bg-white/80 p-2 text-[10px] text-right rounded-lg border border-amber-100 font-light text-stone-500 leading-normal">
                                          "تشهد عمادة شؤون الآثار بصحة الإجازات في النقوش والكوفيات والشواهد المذكورة للباحث"
                                        </div>

                                        <button
                                          onClick={() => {
                                            displayToast('📥 جاري تنزيل السجل والوثائق المصادقة للباحث الموقعة بصيرة شريفة.');
                                          }}
                                          className="w-full text-center bg-orange-700 hover:bg-orange-800 text-amber-50 text-[10px] font-black py-2 rounded-xl border-0 shadow-xs cursor-pointer transition flex items-center justify-center gap-1.5"
                                        >
                                          <Download className="w-3.5 h-3.5" />
                                          <span>تحميل ملف السيرة ومعاينة الوثائق</span>
                                        </button>

                                      </div>

                                    </div>
                                  </motion.div>
                                </td>
                              </tr>
                            )}
                          </AnimatePresence>
                        </>
                      );
                    })}
                  </tbody>
                </table>
              </div>

            </div>

          </div>
        )}

        {/* =========================================================================
            4. TAB ORDERS & FINANCIAL REFUNDS - TABS STRUCTURE & HANDLING
            ========================================================================= */}
        {activeTab === 'orders-refunds' && (
          <div className="space-y-6 animate-fade-in" id="financial-orders-workbench">
            
            <div className="text-right border-b border-amber-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <span className="text-[10px] text-amber-600 font-black block">إدارة مالية واشتراكات الطلاب</span>
                <h2 className="text-sm md:text-base font-black text-stone-900 font-serif mt-1">
                  التحصيل المالي ومعالجة استردادات الرسوم
                </h2>
                <p className="text-[11px] text-stone-500 font-light">
                  مراقبت حركات الشراء المباشرة والتحقق من حساب استردادات الطلاب وموازنتها بدقة.
                </p>
              </div>

              {/* Sub tabs Toggle (Orders vs Refunds) */}
              <div className="flex bg-stone-100 p-1 rounded-2xl border border-stone-200 self-start sm:self-auto shrink-0">
                <button
                  onClick={() => setFinancialSubTab('orders')}
                  className={`py-1.5 px-4 rounded-xl text-xs font-extrabold transition cursor-pointer border-0 ${
                    financialSubTab === 'orders'
                      ? 'bg-orange-700 text-white shadow-sm'
                      : 'text-stone-500 hover:text-stone-800 bg-transparent'
                  }`}
                >
                  حركات الشراء والاشتراك ({orders.length})
                </button>
                <button
                  onClick={() => setFinancialSubTab('refunds')}
                  className={`py-1.5 px-4 rounded-xl text-xs font-extrabold transition cursor-pointer border-0 ${
                    financialSubTab === 'refunds'
                      ? 'bg-orange-700 text-white shadow-sm'
                      : 'text-stone-500 hover:text-stone-800 bg-transparent'
                  }`}
                >
                  مطالبات المرتجع المالي ({refunds.length})
                </button>
              </div>
            </div>

            {/* Sub-tab 1: Orders ledger list */}
            {financialSubTab === 'orders' && (
              <div className="bg-white rounded-3xl border border-amber-200/80 shadow-xs overflow-hidden">
                <div className="p-4 bg-stone-50 border-b border-stone-200 text-right">
                  <span className="text-xs font-black text-stone-950 block">تفصيل حركات شراء مقاعد المذاكرة</span>
                  <p className="text-[10px] text-stone-400 font-light">السجلات والاعتمادات البنكية المحصلة عبر منصة آثاري للشراء.</p>
                </div>

                <div className="overflow-x-auto text-right">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-stone-50 bg-stone-50 text-stone-500 font-bold border-b border-stone-100">
                        <th className="p-4">رقم الاشتراك</th>
                        <th className="p-4">اسم الطالب المستفيد</th>
                        <th className="p-4">المساق التدريبي المفتوح</th>
                        <th className="p-4">المبلغ المدفوع</th>
                        <th className="p-4">توقيت المعاملة</th>
                        <th className="p-4">حالة المعاملة</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 font-light text-stone-700">
                      {orders.map(order => {
                        let badgeColor = 'bg-stone-100 text-stone-600 border border-stone-100';
                        if (order.status === 'Completed') badgeColor = 'bg-emerald-50 text-emerald-800 border border-emerald-100';
                        else if (order.status === 'Refunded') badgeColor = 'bg-red-50 text-red-800 border-red-100 border';
                        else if (order.status === 'Pending') badgeColor = 'bg-amber-50 text-amber-800 border border-amber-100 animate-pulse';

                        return (
                          <tr key={order.id} className="hover:bg-amber-50/10">
                            <td className="p-4 font-mono text-stone-400 text-[10px]">{order.id}</td>
                            <td className="p-4 font-black text-stone-950">{order.studentName}</td>
                            <td className="p-4 font-medium text-stone-800">{order.courseTitle}</td>
                            <td className="p-4 font-mono font-bold text-stone-950">{order.amount} ر.س</td>
                            <td className="p-4 font-mono text-stone-500 text-[11px]">{order.date}</td>
                            <td className="p-4">
                              <span className={`px-2 py-0.5 rounded-full text-[9px] font-black ${badgeColor}`}>
                                {order.status === 'Completed' ? 'تم تحصيلها' : order.status === 'Refunded' ? 'مستردة للبطاقة' : 'معلّقة قيد الدفع'}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Sub-tab 2: Refund tickets handling with Action buttons */}
            {financialSubTab === 'refunds' && (
              <div className="bg-white rounded-3xl border border-amber-200/80 shadow-xs overflow-hidden">
                <div className="p-4 bg-stone-50 border-b border-stone-200 text-right">
                  <span className="text-xs font-black text-stone-950 block">طلبات المرتجعات المالية بانتظار البت والتسوية</span>
                  <p className="text-[10px] text-stone-400 font-light">مراجعة ملفات المستفيدين وتبرير المطالبات وصرف موازناتها للبطاقة.</p>
                </div>

                <div className="overflow-x-auto text-right">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-[#FAF9F2] text-stone-600 font-bold border-b border-stone-200 text-right">
                        <th className="p-4">كود الطلب</th>
                        <th className="p-4">اسم الطالب والرسوم</th>
                        <th className="p-4">أسباب وتبريرات المترشح</th>
                        <th className="p-4">تاريخ الطلب</th>
                        <th className="p-4">حالة التذكرة</th>
                        <th className="p-4 text-center">الإجراء المالي المباشر</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 font-light text-stone-600">
                      {refunds.map(refund => {
                        let badgeColor = 'bg-stone-100 text-stone-500';
                        if (refund.status === 'Approved') badgeColor = 'bg-emerald-50 text-emerald-800 border border-emerald-100';
                        else if (refund.status === 'Rejected') badgeColor = 'bg-red-50 text-red-800 border border-red-100 border';
                        else if (refund.status === 'Pending') badgeColor = 'bg-amber-100 bg-amber-50 bg-amber-50 text-amber-900 border border-amber-200 animate-pulse';

                        return (
                          <tr key={refund.id} className="hover:bg-amber-50/10 transition">
                            <td className="p-4 font-mono font-bold text-stone-400 text-[10px]">{refund.id}</td>
                            
                            <td className="p-4 font-bold text-stone-900">
                              <span className="block text-stone-950 font-black">{refund.studentName}</span>
                              <span className="text-[10px] text-orange-950 font-mono font-bold">{refund.amount} ر.س</span>
                            </td>

                            <td className="p-4 max-w-sm">
                              <span className="block font-medium text-stone-700 leading-relaxed text-[10px]">{refund.courseTitle}</span>
                              <p className="text-[10px] text-stone-400 font-light max-w-xs mt-1 italic tracking-normal md:max-w-md">"{refund.reason}"</p>
                              {refund.rejectionReason && (
                                <p className="text-[9px] text-red-700 bg-red-50 p-2 rounded-lg border border-red-100 mt-1">
                                  <strong>ملحوظة الرفض:</strong> "{refund.rejectionReason}"
                                </p>
                              )}
                            </td>

                            <td className="p-4 text-stone-400 font-mono text-[10px]">{refund.date}</td>
                            
                            <td className="p-4">
                              <span className={`px-2.5 py-1 rounded-full text-[9px] font-black ${badgeColor}`}>
                                {refund.status === 'Pending' ? '🔘 بانتظار التسوية' : refund.status === 'Approved' ? '🟢 تمت موازنة الدفع' : '🔴 رفض الصرف'}
                              </span>
                            </td>

                            <td className="p-4 text-center">
                              {refund.status === 'Pending' ? (
                                <div className="flex items-center justify-center gap-2">
                                  <button
                                    onClick={() => handleApproveRefundTransaction(refund.id)}
                                    className="bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-[10px] font-black px-3 py-1.5 border-0 shadow-sm cursor-pointer transition flex items-center gap-1"
                                    title="شحن المقاعد المالية للبطاقة"
                                  >
                                    <Check className="w-3 h-3" />
                                    <span>صرف المبلغ</span>
                                  </button>

                                  <button
                                    onClick={() => handleOpenRejectionDialog('refund', refund.id)}
                                    className="bg-red-50 hover:bg-red-100 text-red-700 px-2 py-1.5 rounded-xl border border-red-200 text-[10px] font-bold cursor-pointer transition flex items-center gap-1"
                                    title="رفض طلب الارجاع"
                                  >
                                    <X className="w-3 h-3" />
                                    <span>رفض</span>
                                  </button>
                                </div>
                              ) : (
                                <span className="text-[10px] text-stone-400">مغلق</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>
        )}

        {/* =========================================================================
            5. TAB CATEGORIES - INTERACTIVE MANAGEMENT OF PORTAL SECTIONS
            ========================================================================= */}
        {activeTab === 'categories' && (
          <div className="space-y-6 animate-fade-in" id="categories-workbench-tab">
            
            <div className="text-right border-b border-amber-100 pb-4">
              <span className="text-[10px] text-amber-600 font-black block">هيكلة وتصنيف مكتبة آثاري</span>
              <h2 className="text-sm md:text-base font-black text-stone-900 font-serif mt-1">تعديل وإقرار فئات التراث</h2>
              <p className="text-[11px] text-stone-500 font-light mt-1">
                إضافة وحرص الفئات التراثية والأقسام المعجمية التي يتسيدها الدارسون لإحياء العلوم الأثرية.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Add category form on right */}
              <div className="lg:col-span-4 bg-white p-5 rounded-3xl border border-amber-200/80 shadow-xs space-y-4">
                <span className="text-xs font-black text-stone-900 block pb-2 border-b border-amber-50">تأسيس فئة جديدة</span>
                
                <form onSubmit={handleAddNewCategory} className="space-y-4 text-right">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-stone-500 block">اسم القسم بالكامل (مثال: الخط العربي):</label>
                    <input 
                      type="text"
                      className="w-full text-xs p-2.5 rounded-xl bg-stone-50 text-stone-900 border border-stone-200 focus:outline-none focus:border-orange-600"
                      placeholder="لغة الضاد ونحوها..."
                      value={catNameInput}
                      onChange={(e) => setCatNameInput(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-stone-500 block">الرمز البرمجي للرابط (Slug URL):</label>
                    <input 
                      type="text"
                      className="w-full text-xs p-2.5 rounded-xl bg-stone-50 text-stone-900 border border-stone-200 focus:outline-none focus:border-orange-600 font-mono"
                      placeholder="arabic-morphology"
                      value={catSlugInput}
                      onChange={(e) => setCatSlugInput(e.target.value)}
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full text-center bg-orange-700 hover:bg-orange-800 text-white font-black text-xs py-2.5 rounded-xl border-0 cursor-pointer shadow-sm transition mt-2 flex items-center justify-center gap-1.5"
                  >
                    <span>تبويب وإدراج القسم الآن</span>
                  </button>
                </form>
              </div>

              {/* Category active listings table on left */}
              <div className="lg:col-span-8 bg-white rounded-3xl border border-amber-200/80 shadow-xs overflow-hidden">
                <div className="p-4 bg-stone-50 border-b border-stone-200 text-right">
                  <span className="text-xs font-black text-stone-900 block font-serif">قروض الفئات النشطة بالموقع</span>
                </div>

                <table className="w-full text-xs text-right">
                  <thead>
                    <tr className="bg-stone-50 border-b border-stone-100 font-bold text-stone-500">
                      <th className="p-4">اسم التبويب التراثي</th>
                      <th className="p-4">الرمز واللاحقة التقنية (Slug)</th>
                      <th className="p-4">حجم الحقائب المسجلة</th>
                      <th className="p-4 text-center">الإجراء</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 text-stone-700">
                    {categories.map(cat => (
                      <tr key={cat.id} className="hover:bg-amber-50/10">
                        <td className="p-4 font-black text-stone-950">{cat.name}</td>
                        <td className="p-4 font-mono text-stone-500 text-[11px]">{cat.slug}</td>
                        <td className="p-4 font-mono font-bold text-stone-800">{cat.courseCount} دورات بالدليل</td>
                        <td className="p-4 text-center">
                          <button
                            onClick={() => handleDeleteCategoryObj(cat.id)}
                            className="text-red-600 hover:bg-red-50 p-1.5 rounded-lg border-0 bg-transparent cursor-pointer transition"
                            title="حذف هذا القسم بعزل الحقائب"
                            disabled={cat.courseCount > 0}
                          >
                            <X className="w-4 h-4 mx-auto" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>

          </div>
        )}

        {/* =========================================================================
            6. TAB SETTINGS - MODERATION CONSTRAINTS & AUDITING RULE PANEL
            ========================================================================= */}
        {activeTab === 'settings' && (
          <div className="space-y-6 animate-fade-in" id="settings-workbench-tab">
            
            <div className="text-right border-b border-amber-100 pb-4">
              <span className="text-[10px] text-amber-600 font-black block">إدارة الضوابط والمعايير الأكاديمية</span>
              <h2 className="text-sm md:text-base font-black text-stone-900 font-serif mt-1">
                اشتراطات المراجعة وتنبيهات اللائحة
              </h2>
              <p className="text-[11px] text-stone-500 font-light mt-1">
                صيانة قواعد القبول وشروط الاسترجاع المالي والمصادقات المباشرة لمجلس الإشراف.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-amber-200/80 shadow-xs space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 leading-relaxed text-right">
                
                <div className="space-y-4">
                  <h4 className="text-xs font-black text-stone-950 pb-2 border-b border-stone-100 flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-orange-700" />
                    <span>بروتوكولات التنبيه ومزامنة الغرف الحية (.NET Hub)</span>
                  </h4>

                  <div className="space-y-3">
                    <label className="flex items-start gap-3 bg-stone-50 p-3.5 rounded-2xl border border-stone-200 cursor-pointer">
                      <input type="checkbox" defaultChecked className="w-4.5 h-4.5 accent-orange-700 mt-0.5 shrink-0" />
                      <div className="text-right">
                        <span className="font-extrabold text-stone-900 text-xs block">تمكين الاتصال الفوري SignalR لمعلمي المنصة</span>
                        <span className="text-[10px] text-stone-500 block leading-normal mt-0.5">تبليغ المدرسين تلقائياً عبر الإشعار بقرارات المشرفين (قبول/رفض).</span>
                      </div>
                    </label>

                    <label className="flex items-start gap-3 bg-stone-50 p-3.5 rounded-2xl border border-stone-200 cursor-pointer">
                      <input type="checkbox" defaultChecked className="w-4.5 h-4.5 accent-orange-700 mt-0.5 shrink-0" />
                      <div className="text-right">
                        <span className="font-extrabold text-stone-900 text-xs block">إنفاذ وثيقة منع انتحال الشخصات العلمية</span>
                        <span className="text-[10px] text-stone-500 block leading-normal mt-0.5">مراجعة ثبوتيات التوطين من بطاقة ومواقع موحدة قبل النشر الجماهيري للمقاعد.</span>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xs font-black text-stone-950 pb-2 border-b border-stone-100 flex items-center gap-2">
                    <Settings className="w-4 h-4 text-orange-700" />
                    <span>محددات الفواتير والحدود الزمنية العامة</span>
                  </h4>

                  <div className="space-y-4 text-xs font-medium">
                    <div className="space-y-1.5 text-right">
                      <span className="text-stone-500 text-[10px] block font-bold">المهلة الزمنية المتاحة لمرتجع رسوم مقاعد المذاكرة دائنة (أيام):</span>
                      <input 
                        type="number" 
                        defaultValue={14} 
                        className="p-2.5 w-full text-xs rounded-xl bg-stone-50 border border-stone-200 text-stone-900 focus:outline-none" 
                      />
                    </div>

                    <div className="space-y-1.5 text-right font-mono">
                      <span className="text-stone-500 text-[10px] block font-bold">البريد الموحد الصادر لغرفة التحكيم العلمي:</span>
                      <input 
                        type="email" 
                        defaultValue="moderation-council@athari.sa" 
                        className="p-2.5 w-full text-xs rounded-xl bg-stone-50 border border-stone-200 text-stone-900 focus:outline-none font-mono text-left" 
                      />
                    </div>
                  </div>
                </div>

              </div>

              <div className="pt-4 border-t border-stone-100 flex justify-end">
                <button
                  onClick={() => {
                    displayToast('💾 تم حفظ سجل التغييرات وقوانين التدقيق وحفظ المعايير بنجاح.');
                    setActivityLogs(prev => [{
                      id: `log_${Date.now()}`,
                      action: 'تحديث قواعد قبول وحوكمة المقررات وتثبيت إعدادات الوزارة',
                      type: 'system',
                      time: 'الآن',
                      user: userName
                    }, ...prev]);
                  }}
                  className="bg-orange-700 hover:bg-orange-800 text-white rounded-xl font-black text-xs px-6 py-3 border-0 cursor-pointer shadow-md transition"
                >
                  حفظ وإقرار التعديلات المعيارية الشاملة
                </button>
              </div>

            </div>

          </div>
        )}

        {/* =========================================================================
            7. TAB REVIEWS MODERATION - Phase 7
            ========================================================================= */}
        {activeTab === 'reviews' && (
          <div className="space-y-6 animate-fade-in" id="reviews-moderation-workbench">
            <ReviewsModeration onTriggerToast={displayToast} />
          </div>
        )}

        {/* =========================================================================
            8. TAB ANNOUNCEMENTS CENTER - Phase 7
            ========================================================================= */}
        {activeTab === 'announcements' && (
          <div className="space-y-6 animate-fade-in" id="announcements-center-workbench">
            <AnnouncementsCenter onTriggerToast={displayToast} />
          </div>
        )}

        {/* =========================================================================
            9. TAB MEDIA LIBRARY - Phase 7
            ========================================================================= */}
        {activeTab === 'media' && (
          <div className="space-y-6 animate-fade-in" id="media-library-workbench">
            <MediaLibrary onTriggerToast={displayToast} />
          </div>
        )}

        {/* =========================================================================
            10. TAB SYSTEM ACTIVITY & LOGS - Phase 7
            ========================================================================= */}
        {activeTab === 'system-logs' && (
          <div className="space-y-6 animate-fade-in" id="system-activity-settings-workbench">
            <SystemActivitySettings onTriggerToast={displayToast} />
          </div>
        )}

      </main>

      </div>

      {/* ─── HIGHER FIDELITY REJECTION REJECTION MEMO TEXT DIALOG ─── */}
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
              id="rejection-text-dialog"
            >
              <div className="w-12 h-12 bg-red-50 text-red-700 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 border-0" />
              </div>

              <div className="space-y-1 text-right">
                <h3 className="text-xs md:text-sm font-black text-stone-950 font-serif leading-tight">
                  خطاب توصية ومبررات الملاحظات أو الإرجاع
                </h3>
                <p className="text-[11px] text-stone-500 leading-normal">
                  يرجى تسطير الإفادات أو أسباب الإعادة والرفض الفنية والعلمية بوضوح تام، ليتم إشعار المعني فوراً عبر بث خادم SignalR والبريد الإلكتروني للقرارات.
                </p>
              </div>

              <textarea
                value={rejectionReasonText}
                onChange={(e) => setRejectionReasonText(e.target.value)}
                placeholder="اكتب التوصيات وملاحظات المراجعة للتدقيق الفكري والعلمي هنا بالتفصيل (مثال: يرجى تثبيت مرجع مخطوطات الأندلس بالأحساء بالصفحة الخامسة في الفهرس)..."
                rows={5}
                className="w-full text-xs p-3.5 rounded-xl bg-stone-50 text-stone-900 border border-stone-200 focus:outline-none focus:border-red-600 focus:bg-white text-right placeholder:text-stone-400 leading-normal font-sans"
              />

              <div className="flex gap-2.5 pt-2">
                <button
                  onClick={handleConfirmRejectionAction}
                  disabled={!rejectionReasonText.trim()}
                  className="flex-1 bg-red-75 bg-red-700 hover:bg-red-800 disabled:bg-stone-100 disabled:text-stone-400 disabled:cursor-not-allowed text-white py-2.5 rounded-xl text-xs font-black border-0 cursor-pointer text-center font-sans shadow shadow-red-100"
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
