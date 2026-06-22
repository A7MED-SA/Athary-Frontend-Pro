import React, { useState } from 'react';
import { 
  Award, 
  Users, 
  Star, 
  MessageCircle, 
  BookOpen, 
  MapPin, 
  ChevronLeft, 
  UserCheck,
  Building,
  Calendar,
  Mail,
  User,
  ShieldCheck,
  Share2,
  Globe,
  Bookmark,
  Sparkles,
  AwardIcon
} from 'lucide-react';
import { COURSES } from '../data';

interface PublicProfileProps {
  instructorName?: string;
  onBack: () => void;
  onSelectCourse: (courseId: string) => void;
  onStartChat?: (withName: string) => void;
  isLoggedIn?: boolean;
}

export default function PublicProfile({
  instructorName = 'م. عبد الرحمن البغدادي',
  onBack,
  onSelectCourse,
  onStartChat,
  isLoggedIn = true
}: PublicProfileProps) {
  const [isCopied, setIsCopied] = useState(false);

  // Fetch current logged in user details from system persistence
  const registeredUser = (() => {
    const cached = localStorage.getItem('athari_registered_user');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (_) {}
    }
    return null;
  })();

  const userFirstName = registeredUser?.firstName || localStorage.getItem('athari_firstName') || 'أحمد';
  const userLastName = registeredUser?.lastName || localStorage.getItem('athari_lastName') || 'التميمي';
  const userEmail = registeredUser?.email || localStorage.getItem('athari_email') || 'ahmedmelk32@gmail.com';
  const userPhone = registeredUser?.phone || localStorage.getItem('athari_phone') || '+966 50 123 4567';
  const userGender = registeredUser?.gender || localStorage.getItem('athari_gender') || 'male';
  const userDob = registeredUser?.dob || localStorage.getItem('athari_dob') || '1995-04-12';
  const userCountry = registeredUser?.country || localStorage.getItem('athari_country') || 'المملكة العربية السعودية';
  const userCity = registeredUser?.city || localStorage.getItem('athari_city') || 'الرياض';
  const userStreet = registeredUser?.streetLine1 || localStorage.getItem('athari_streetLine1') || 'الملز، طريق صلاح الدين الأيوبي';
  const userPostal = registeredUser?.postalCode || localStorage.getItem('athari_postalCode') || '11564';
  const userBio = localStorage.getItem('athari_bio') || 'دارس وباحث شغوف بالآثار المعمارية الإسلامية وعلوم ترميم المخطوطات القديمة بالشرق الأدنى.';

  // Instructor-specific details
  const filteredCourses = COURSES.filter(c => c.instructorName === instructorName);
  const isBaghdadi = instructorName.includes('البغدادي');
  const isAnsari = instructorName.includes('الأنصاري');
  
  const instructorAvatar = isBaghdadi
    ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
    : isAnsari 
      ? 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'
      : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150';

  const instructorRole = isBaghdadi
    ? 'مهندسة وباحثة تراثية معتمدة لدى هيئة التطوير الأثري الشرقية'
    : isAnsari
      ? 'أستاذة التاريخ والحضارات المقارنة بجامعة المدينة الشريفة'
      : 'باحث ومحاضر تراثي مسجل بالمنصة';

  const instructorBio = isBaghdadi
    ? 'باحث متخصص في الهندسة المعمارية الإسلامية ووثائق المقرصنات والقباب العباسية والأموية الشريفة. أشرف على ترميم عدة قلاع أثرية ومتاحف وطنية.'
    : isAnsari
      ? 'متخصصة في تاريخ الفترات المستقلة وحركات الإصلاح الفني والاجتماعي بالأندلس والمشرق العربي القديم. مؤلفة كتاب طروس حضارية وثائقية.'
      : 'عضو اللجنة العلمية المعتمدة لاستقراء الموروث التراثي والحضاري بمنصة آثاري العريقة.';

  const instructorLocation = isBaghdadi ? 'بغداد، العراق' : isAnsari ? 'المدينة المنورة، السعودية' : 'الرياض، السعودية';

  // Stats row counts
  const countCourses = filteredCourses.length || 2;
  const countStudents = isBaghdadi ? '٣,١٢٠ دارس' : isAnsari ? '٢,٤٥٠ دارس' : '١٢٠ دارس';
  const avgRating = isBaghdadi ? '٤.٩/٥' : isAnsari ? '٤.٨/٥' : '٥/٥';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-right font-sans pb-24 selection:bg-orange-250 selection:text-orange-950 text-[var(--color-foreground)] transition-colors duration-350" dir="rtl" id="public-profile-container">
      
      {/* 1. TOP STATELY HEADER INFORMATION (FULLY RESPONSIVE WITH THEME SWITCHER) */}
      <div className="bg-[var(--color-brand-orange-700)] text-stone-50 py-3 px-4 sticky top-0 z-40 shadow-md flex items-center justify-between text-xs border-b border-[var(--color-brand-orange-850)]">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-extrabold text-[11px] sm:text-xs">الملف الشامل الموحد • أبعاد الأستاذ الأكاديمي والدارس المستفيد معاً في نافذة واحدة</span>
        </div>
        <div className="text-[10px] text-orange-100 font-mono tracking-wider">ATHARI INTEGRATED v1.3</div>
      </div>

      {/* 2. ACTIONS FLOW BAR */}
      <div className="max-w-4xl mx-auto px-4 pt-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <button
            onClick={onBack}
            className="w-full sm:w-auto bg-[var(--color-card)] hover:bg-[var(--color-stone-100-val)] text-[var(--color-brand-orange-700)] dark:text-orange-400 font-black text-xs py-2.5 px-5 rounded-xl border border-[var(--color-border)] transition duration-150 flex items-center justify-center gap-2 cursor-pointer shadow-xs shrink-0"
          >
            <ChevronLeft className="w-4 h-4 rotate-180" />
            <span>العودة للرئيسية</span>
          </button>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              onClick={handleCopyLink}
              className="flex-1 sm:flex-initial bg-[var(--color-card)] hover:bg-[var(--color-stone-100-val)] text-[var(--color-foreground)] font-bold text-xs py-2.5 px-4 rounded-xl border border-[var(--color-border)] transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              title="نسخ رابط الملف العام"
            >
              <Share2 className="w-3.5 h-3.5 text-[var(--color-brand-orange-700)]" />
              <span>{isCopied ? 'تم نسخ الرابط!' : 'مشاركة هذا الملف'}</span>
            </button>

            {isLoggedIn && onStartChat && (
              <button
                onClick={() => onStartChat(instructorName)}
                className="flex-1 sm:flex-initial bg-[var(--color-brand-orange-700)] hover:bg-[var(--color-brand-orange-850)] text-stone-50 text-xs font-black py-2.5 px-5 rounded-xl border-0 cursor-pointer flex items-center justify-center gap-1.5 shadow-md transition-all hover:scale-[1.02]"
              >
                <MessageCircle className="w-4 h-4" />
                <span>مراسلة الأستاذ فوراً</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 3. CORE SINGLE COLUMN FEED (CONSOLIDATED FLOW) */}
      <div className="max-w-4xl mx-auto px-4 space-y-8">
        
        {/* A. DISTINGUISHED INSTRUCTOR CARD */}
        <div className="bg-[var(--color-card)] rounded-3xl p-6 sm:p-8 border border-[var(--color-border)] shadow-md relative overflow-hidden">
          {/* Decorative Corner Ornament */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--color-brand-orange-50)]/30 rounded-bl-full pointer-events-none" />
          
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
            {/* Elegant Scholar Avatar */}
            <div className="relative shrink-0">
              <div className="absolute -inset-1 bg-gradient-to-tr from-[var(--color-brand-orange-700)] to-[var(--color-primary)] rounded-full blur-xs opacity-75" />
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-[var(--color-card)] bg-[var(--color-stone-100-val)] shadow-md overflow-hidden">
                <img 
                  src={instructorAvatar} 
                  alt={instructorName} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="absolute bottom-1 right-2 bg-emerald-500 border-2 border-[var(--color-card)] w-4.5 h-4.5 rounded-full" title="مسجل ونشط حالياً" />
            </div>

            {/* Scholar Metadata */}
            <div className="space-y-4 text-center md:text-right flex-1">
              <div className="flex flex-col sm:flex-row justify-center md:justify-start items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-black text-[var(--color-foreground)] font-serif tracking-tight">{instructorName}</h1>
                <span className="bg-[var(--color-brand-orange-100)] text-[var(--color-brand-orange-750)] text-[10px] font-black px-3 py-1 rounded-full border border-[var(--color-brand-orange-50)] flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" />
                  <span>عضو هيئة التدريس</span>
                </span>
              </div>

              <p className="text-xs sm:text-sm font-bold text-[var(--color-brand-orange-700)] bg-[var(--color-brand-orange-50)]/50 py-1.5 px-3 rounded-lg border border-[var(--color-brand-orange-100)] inline-block">
                {instructorRole}
              </p>

              <div className="flex flex-wrap justify-center md:justify-start items-center gap-y-2.5 gap-x-4 text-[var(--color-stone-600-val)] text-xs font-semibold">
                <span className="flex items-center gap-1 bg-[var(--color-stone-100-val)] border border-[var(--color-border)] py-1 px-2.5 rounded-lg">
                  <MapPin className="w-3.5 h-3.5 text-[var(--color-brand-orange-700)]" />
                  <span>البلد الأصلي: {instructorLocation}</span>
                </span>
                
                <span className="flex items-center gap-1 bg-[var(--color-stone-100-val)] border border-[var(--color-border)] py-1 px-2.5 rounded-lg">
                  <Calendar className="w-3.5 h-3.5 text-[var(--color-brand-orange-700)]" />
                  <span>تاريخ الالتحاق: ذو الحجة ١٤٤٤ هـ</span>
                </span>

                <span className="flex items-center gap-1 bg-[var(--color-stone-100-val)] border border-[var(--color-border)] py-1 px-2.5 rounded-lg">
                  <UserCheck className="w-3.5 h-3.5 text-[var(--color-brand-orange-700)]" />
                  <span>سند معتمد بالمنصة</span>
                </span>
              </div>

              <p className="text-xs sm:text-sm text-[var(--color-stone-700-val)] leading-relaxed font-light pt-2 max-w-2xl text-center md:text-right">
                {instructorBio}
              </p>
            </div>
          </div>
        </div>

        {/* B. INSTRUCTOR SCHOLARLY STATS SUMMARY */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-4 shadow-xs text-center duration-150">
            <span className="text-[10px] text-[var(--color-stone-500-val)] font-bold block">مقررات الأستاذ</span>
            <span className="text-lg sm:text-xl font-black text-[var(--color-brand-orange-750)] font-serif block mt-1">{countCourses} مناهج</span>
          </div>
          <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-4 shadow-xs text-center duration-150">
            <span className="text-[10px] text-[var(--color-stone-500-val)] font-bold block">الدارسين المنتفعين</span>
            <span className="text-lg sm:text-xl font-black text-[var(--color-brand-orange-750)] font-serif block mt-1">{countStudents}</span>
          </div>
          <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-4 shadow-xs text-center duration-150">
            <span className="text-[10px] text-[var(--color-stone-500-val)] font-bold block">متوسط التقييم العام</span>
            <span className="text-lg sm:text-xl font-black text-[var(--color-brand-orange-750)] font-serif block mt-1">{avgRating}</span>
          </div>
        </div>

        {/* C. INSTRUCTOR PUBLISHED COURSES LIST */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-2">
            <h3 className="text-sm sm:text-base font-black text-[var(--color-foreground)] font-serif flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[var(--color-brand-orange-700)]" />
              <span>المناهج والمساقات المنشورة الشريفة للأستاذ</span>
            </h3>
            <span className="text-[11px] text-[var(--color-stone-500-val)] font-medium">({filteredCourses.length} مقررات معمدة)</span>
          </div>

          {filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredCourses.map((c) => (
                <div 
                  key={c.id} 
                  className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition duration-300 flex flex-col justify-between"
                >
                  <div className="relative h-36 bg-[var(--color-stone-100-val)]">
                    <img 
                      src={c.thumbnail} 
                      alt={c.title} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <span className="absolute top-2 right-2 bg-stone-900/80 text-stone-50 rounded-lg text-[9px] font-black px-2 py-0.5 backdrop-blur-xs">
                      {c.category}
                    </span>
                  </div>

                  <div className="p-4 text-right flex-1 space-y-3 flex flex-col justify-between">
                    <div className="space-y-1">
                      <h4 className="text-xs font-black text-[var(--color-foreground)] leading-snug hover:text-[var(--color-brand-orange-700)] transition line-clamp-2">
                        {c.title}
                      </h4>
                      <p className="text-[9.5px] text-[var(--color-stone-500-val)] font-light flex items-center justify-start gap-2 pt-1 font-mono">
                        <span>المدة: {c.duration}</span>
                        <span>•</span>
                        <span>({c.lessonsCount} درساً)</span>
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-[var(--color-border)]">
                      <span className="font-black text-xs text-[var(--color-foreground)] font-mono">{c.price} USD</span>
                      <button
                        onClick={() => onSelectCourse(c.id)}
                        className="bg-[var(--color-stone-105)] hover:bg-[var(--color-stone-100-val)] text-[var(--color-brand-orange-700)] dark:text-orange-400 text-[10.5px] font-black py-1 px-3 rounded-lg border border-[var(--color-border)] transition flex items-center gap-1 cursor-pointer"
                      >
                        <span>عرض المنهج المقدر</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-[var(--color-card)] rounded-2xl border border-dashed border-[var(--color-border)]">
              <p className="text-xs text-[var(--color-stone-550)] font-bold">لا توجد مقررات مدرجة حالياً للأستاذ بالبوابة.</p>
            </div>
          )}
        </div>

        {/* D. ACADEMIC & RESEARCH TIMELINE */}
        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-6 space-y-5">
          <h3 className="text-xs sm:text-sm font-black text-[var(--color-foreground)] font-serif flex items-center gap-2">
            <Building className="w-5 h-5 text-[var(--color-brand-orange-700)]" />
            <span>الخبرة الأكاديمية والميدانية وبحوث الأثر الفني</span>
          </h3>
          
          <div className="text-xs text-[var(--color-stone-700-val)] leading-relaxed font-light space-y-2.5">
            <p>
              يجمع هذا الملف مسيرة علمية مشرفة من البحث الميداني المقيد في ترميم السواري التراثية والمقرنصات والنقوش الجصية. نرتكز أساساً في دراساتنا ومحاضراتنا المطروحة في البوابة على فك الرموز الوثائقية والمنقوشات المعمارية الفريدة.
            </p>
            <p className="bg-[var(--color-brand-orange-50)]/50 p-3 rounded-xl border border-[var(--color-brand-orange-100)] text-[11px] leading-relaxed text-[var(--color-stone-800-val)]">
              🏛️ <strong>أحدث النشرات والمنجزات الميدانية:</strong> إصدار وثيقة حصر لرسومات السواري القديمة وحواشي النقوش الجصية بالمنطقتين الشرقية والأندلسية.
            </p>
          </div>

          <div className="pt-2">
            <h4 className="text-[11px] font-black text-[var(--color-foreground)] mb-2 font-serif">الإجازات والمطابقات العلمية الصادرة</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 bg-[var(--color-stone-50-val)] rounded-xl border border-[var(--color-border)] flex items-start gap-2.5">
                <span className="text-xs bg-[var(--color-brand-orange-700)] text-stone-50 rounded w-5 h-5 flex items-center justify-center font-mono shrink-0 font-bold">1</span>
                <span className="text-[10px] font-bold text-[var(--color-stone-800-val)]">إجازة رصف المقرنصات المعماري الشريف</span>
              </div>
              <div className="p-3 bg-[var(--color-stone-50-val)] rounded-xl border border-[var(--color-border)] flex items-start gap-2.5">
                <span className="text-xs bg-[var(--color-brand-orange-700)] text-stone-50 rounded w-5 h-5 flex items-center justify-center font-mono shrink-0 font-bold">2</span>
                <span className="text-[10px] font-bold text-[var(--color-stone-800-val)]">إجازة فك طلاسم الطروس والجلود الكوفية</span>
              </div>
            </div>
          </div>
        </div>

        {/* E. CONSOLIDATED LEARNER CARD (NO LONGER SPLIT SIDEBAR! INTEGRATED IN THE UNIFIED SINGLE COLUMN VIEW) */}
        <div className="relative overflow-hidden bg-gradient-to-l from-[var(--color-brand-orange-700)] to-[var(--color-brand-orange-850)] text-stone-50 p-6 sm:p-8 rounded-3xl space-y-6 shadow-md">
          {/* Subtle background heritage graphic details */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full pointer-events-none" />
          
          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 border-b border-white/20 pb-4">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-7 h-7 text-orange-200" />
              <div className="text-right">
                <h3 className="text-base font-black text-stone-50 font-serif">بطاقة المعلومات الموحدة لدارس المنصة</h3>
                <p className="text-[10px] text-orange-100/80 font-light mt-0.5">البوابة الرقمية لمزامنة بيانات التحصيل الدراسي والعناوين</p>
              </div>
            </div>
            
            <span className="bg-emerald-500 text-stone-50 text-[10px] font-extrabold px-3 py-1 rounded-full border border-emerald-400">
              ✓ تم المصادقة الفعلية
            </span>
          </div>

          <p className="text-xs sm:text-sm text-stone-100/90 leading-relaxed font-light text-right">
            هذه بطاقة البيانات الشخصية والعناوين المعتمدة لك كطالب حالي بالبوابة. يتم مزامنتها تلقائياً مع خوادم التوريد ونظام تسليم الشهادات العينية والوثائق المكتوبة للدارسين.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            
            {/* Column 1: Identity & Bio */}
            <div className="bg-white/10 backdrop-blur-xs border border-white/15 p-5 rounded-2xl space-y-4">
              <h4 className="text-xs font-black text-white font-serif border-b border-white/10 pb-2 flex items-center gap-2">
                <User className="w-4 h-4 text-orange-200" />
                <span>الاسم الشخصي ومعلومات الهوية</span>
              </h4>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-stone-900/40 p-2.5 rounded-xl border border-white/5 text-right">
                    <span className="text-[9px] text-orange-200 block">الاسم الأول للدارس</span>
                    <span className="text-xs font-black text-stone-50">{userFirstName}</span>
                  </div>
                  <div className="bg-stone-900/40 p-2.5 rounded-xl border border-white/5 text-right">
                    <span className="text-[9px] text-orange-200 block">اسم العائلة للدارس</span>
                    <span className="text-xs font-black text-stone-50">{userLastName}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-stone-900/40 p-2.5 rounded-xl border border-white/5 text-right">
                    <span className="text-[9px] text-orange-200 block">الجنس الموثق</span>
                    <span className="text-xs font-black text-stone-50">
                      {userGender === 'male' ? 'ذكر' : 'أنثى'}
                    </span>
                  </div>
                  <div className="bg-stone-900/40 p-2.5 rounded-xl border border-white/5 text-right">
                    <span className="text-[9px] text-orange-200 block">تاريخ الميلاد</span>
                    <span className="text-xs font-black text-stone-105 font-mono">{userDob}</span>
                  </div>
                </div>

                <div className="bg-stone-900/40 p-3 rounded-xl border border-white/5 text-right">
                  <span className="text-[9px] text-orange-200 block">نبذة الأثر والاهتمام البحثي</span>
                  <p className="text-[10.5px] text-stone-100 font-light mt-1 leading-relaxed">
                    {userBio}
                  </p>
                </div>
              </div>
            </div>

            {/* Column 2: Contacts & delivery address */}
            <div className="space-y-6">
              
              {/* Contacts */}
              <div className="bg-white/10 backdrop-blur-xs border border-white/15 p-5 rounded-2xl space-y-4">
                <h4 className="text-xs font-black text-white font-serif border-b border-white/10 pb-2 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-orange-200" />
                  <span>قنوات الحساب الرقمية ونقاط التماس</span>
                </h4>

                <div className="space-y-2.5">
                  <div className="bg-stone-900/40 p-2.5 rounded-xl border border-white/5 flex items-center justify-between text-right">
                    <div>
                      <span className="text-[9px] text-orange-200 block">البريد الإلكتروني المعتمد</span>
                      <span className="text-xs font-bold text-stone-50 font-mono">{userEmail}</span>
                    </div>
                    <span className="text-[8.5px] bg-emerald-500/80 text-stone-50 py-0.5 px-2 rounded-full font-bold">نشط</span>
                  </div>

                  <div className="bg-stone-900/40 p-2.5 rounded-xl border border-white/5 flex items-center justify-between text-right">
                    <div>
                      <span className="text-[9px] text-orange-200 block">رقم الجوال الفعلي</span>
                      <span className="text-xs font-bold text-stone-50 font-mono" dir="ltr">{userPhone}</span>
                    </div>
                    <span className="text-[8.5px] bg-amber-500 text-stone-50 py-0.5 px-2 rounded-full font-bold">موثق</span>
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="bg-white/10 backdrop-blur-xs border border-white/15 p-5 rounded-2xl space-y-4">
                <h4 className="text-xs font-black text-white font-serif border-b border-white/10 pb-2 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-orange-200" />
                  <span>عنوان الشحن للكتب والوثائق العينية التراثية</span>
                </h4>

                <div className="space-y-2 font-semibold text-xs text-stone-100 text-right">
                  <div className="flex justify-between items-center bg-stone-900/30 p-2 rounded-lg border border-white/5">
                    <span className="text-orange-200 text-[10px]">الدولة:</span>
                    <span className="font-extrabold text-stone-50">{userCountry}</span>
                  </div>

                  <div className="flex justify-between items-center bg-stone-900/30 p-2 rounded-lg border border-white/5">
                    <span className="text-orange-200 text-[10px]">المدينة / المنطقة:</span>
                    <span className="font-extrabold text-stone-50">{userCity}</span>
                  </div>

                  <div className="bg-stone-900/30 p-2.5 rounded-lg border border-white/5">
                    <span className="text-orange-200 text-[9px] block">عنوان الشارع ووصف المنزل والحي:</span>
                    <span className="font-semibold text-stone-50 text-[11px] block mt-0.5">{userStreet}</span>
                  </div>

                  <div className="flex justify-between items-center bg-stone-900/30 p-2 rounded-lg border border-white/5">
                    <span className="text-orange-200 text-[10px]">الرمز البريدي:</span>
                    <span className="font-mono font-black text-orange-200 bg-white/10 px-2 py-0.5 rounded text-[11px]">{userPostal}</span>
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* F. SAVED / REGISTERED PREFERENCES CHECKLIST */}
          <div className="bg-white/10 backdrop-blur-xs border border-white/15 p-5 rounded-2xl text-right text-xs space-y-3">
            <span className="font-black text-white flex items-center gap-1.5 text-[11.5px] border-b border-white/10 pb-2">
              <Bookmark className="w-4.5 h-4.5 text-orange-200" />
              <span>قائمتك الدراسية المتابعة شخصياً</span>
            </span>
            <ul className="list-disc leading-relaxed text-stone-100 pl-0 pr-4 space-y-1.5 text-[11px]">
              <li>شرح منسك الأسرار ومفاتح الآثار العتيقة (أكملت ٧٥% من المنهج المقروء)</li>
              <li>مقدمة في تاريخ النقوش والمحافظة على اللوائح الجصية والشواهد القديمة</li>
              <li>تصنيف الخزف الأثري وفحص الطروس الإسلامية (تم اجتيازه وبانتظار إصدار الوثيقة ✓)</li>
            </ul>
          </div>

        </div>

      </div>

    </div>
  );
}
