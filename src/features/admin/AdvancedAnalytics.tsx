import { useState } from 'react';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Calendar, 
  Award, 
  BookOpen, 
  ArrowUpRight, 
  Percent, 
  SlidersHorizontal,
  RefreshCw
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  Legend 
} from 'recharts';

export default function AdvancedAnalytics() {
  const [dateRange, setDateRange] = useState<'6months' | '3months' | '30days'>('6months');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Simulated live fetch state
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  // --- 1. Monthly Revenue Data (الإيرادات الشهرية) ---
  const revenueData6Months = [
    { name: 'محرم', revenue: 14200, label: 'محرم ١٤٤٧ هـ' },
    { name: 'صفر', revenue: 19800, label: 'صفر ١٤٤٧ هـ' },
    { name: 'ربيع أول', revenue: 27500, label: 'ربيع الأول ١٤٤٧ هـ' },
    { name: 'ربيع ثاني', revenue: 24300, label: 'ربيع الآخر ١٤٤٧ هـ' },
    { name: 'جمادى أولى', revenue: 32900, label: 'جمادى الأولى ١٤٤٧ هـ' },
    { name: 'جمادى ثانية', revenue: 41200, label: 'جمادى الآخرة ١٤٤٧ هـ' },
  ];

  const revenueData3Months = [
    { name: 'ربيع ثاني', revenue: 24300, label: 'ربيع الآخر ١٤٤٧ هـ' },
    { name: 'جمادى أولى', revenue: 32900, label: 'جمادى الأولى ١٤٤٧ هـ' },
    { name: 'جمادى ثانية', revenue: 41200, label: 'جمادى الآخرة ١٤٤٧ هـ' },
  ];

  const revenueData30Days = [
    { name: 'الأسبوع ١', revenue: 8600, label: 'الأسبوع الأول' },
    { name: 'الأسبوع ٢', revenue: 9900, label: 'الأسبوع الثاني' },
    { name: 'الأسبوع ٣', revenue: 11200, label: 'الأسبوع الثالث' },
    { name: 'الأسبوع ٤', revenue: 11500, label: 'الأسبوع الرابع' },
  ];

  const activeRevenueData = 
    dateRange === '6months' ? revenueData6Months : 
    dateRange === '3months' ? revenueData3Months : 
    revenueData30Days;

  // --- 2. User Growth Data (نمو تسجيل المستخدمين) ---
  const userGrowth6Months = [
    { name: 'محرم', students: 480, instructors: 24 },
    { name: 'صفر', students: 650, instructors: 32 },
    { name: 'ربيع أول', students: 890, instructors: 45 },
    { name: 'ربيع ثاني', students: 820, instructors: 39 },
    { name: 'جمادى أولى', students: 1100, instructors: 55 },
    { name: 'جمادى ثانية', students: 1450, instructors: 78 },
  ];

  const userGrowth3Months = [
    { name: 'ربيع ثاني', students: 820, instructors: 39 },
    { name: 'جمادى أولى', students: 1100, instructors: 55 },
    { name: 'جمادى ثانية', students: 1450, instructors: 78 },
  ];

  const userGrowth30Days = [
    { name: 'الأسبوع ١', students: 210, instructors: 12 },
    { name: 'الأسبوع ٢', students: 280, instructors: 15 },
    { name: 'الأسبوع ٣', students: 340, instructors: 18 },
    { name: 'الأسبوع ٤', students: 420, instructors: 22 },
  ];

  const activeUserGrowthData = 
    dateRange === '6months' ? userGrowth6Months : 
    dateRange === '3months' ? userGrowth3Months : 
    userGrowth30Days;

  // --- 3. Enrollment Trends (اتجاهات التسجيل في الدورات) ---
  const enrollmentTrends6Months = [
    { name: 'محرم', standard: 120, specialized: 40 },
    { name: 'صفر', standard: 180, specialized: 60 },
    { name: 'ربيع أول', standard: 290, specialized: 110 },
    { name: 'ربيع ثاني', standard: 220, specialized: 90 },
    { name: 'جمادى أولى', standard: 350, specialized: 160 },
    { name: 'جمادى ثانية', standard: 490, specialized: 220 },
  ];

  const enrollmentTrends3Months = [
    { name: 'ربيع ثاني', standard: 220, specialized: 90 },
    { name: 'جمادى أولى', standard: 350, specialized: 160 },
    { name: 'جمادى ثانية', standard: 490, specialized: 220 },
  ];

  const enrollmentTrends30Days = [
    { name: 'الأسبوع ١', standard: 90, specialized: 45 },
    { name: 'الأسبوع ٢', standard: 110, specialized: 60 },
    { name: 'الأسبوع ٣', standard: 140, specialized: 75 },
    { name: 'الأسبوع ٤', standard: 150, specialized: 80 },
  ];

  const activeEnrollmentData = 
    dateRange === '6months' ? enrollmentTrends6Months : 
    dateRange === '3months' ? enrollmentTrends3Months : 
    enrollmentTrends30Days;

  // --- Top Performing Courses (الدورات الأكثر تميزاً مبيعاً) ---
  const topCourses = [
    {
      id: 'top1',
      title: 'توثيق ودراسة النقوش الثمودية في جبال حائل وجبّة التاريخية',
      instructor: 'د. فريد الحربي',
      revenue: 15400,
      students: 240,
      completionRate: 88,
      thumbnail: 'https://images.unsplash.com/photo-1590073844006-33379778ae09?w=150',
    },
    {
      id: 'top2',
      title: 'أدوات التنقيب وصيانة المخطوطات الأندلسية والمملوكية النادرة',
      instructor: 'أ. د. عبد اللطيف السالم',
      revenue: 12600,
      students: 180,
      completionRate: 92,
      thumbnail: 'https://images.unsplash.com/photo-1447069387593-a5de0862481e?w=150',
    },
    {
      id: 'top3',
      title: 'تاريخ العمارة الحجازية وتطور بناء النسيج العمراني السكني',
      instructor: 'المهندس طلال الشعبي',
      revenue: 9800,
      students: 142,
      completionRate: 74,
      thumbnail: 'https://images.unsplash.com/photo-1541829019-35804141d2d5?w=150',
    },
    {
      id: 'top4',
      title: 'المعلقات السبع في ميزان النقد اللغوي والأصوات العربية القديمة',
      instructor: 'أ. فاطمة الهاشمي',
      revenue: 8900,
      students: 210,
      completionRate: 81,
      thumbnail: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=150',
    },
    {
      id: 'top5',
      title: 'مقدمة في قراءة المصادر المسمارية والرموز الميثولوجية القديمة',
      instructor: 'د. سلوى الفايز',
      revenue: 7200,
      students: 96,
      completionRate: 85,
      thumbnail: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=150',
    },
  ];

  return (
    <div className="space-y-6 dir-rtl text-right" id="advanced-analytics-container">
      
      {/* Date Range Picker and Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-3xl border border-amber-200/60 shadow-xs">
        <div className="space-y-1">
          <span className="text-[10px] text-orange-700 font-extrabold uppercase tracking-wider block">
            المقصورة الكبرى للبيانات والموازنات
          </span>
          <h3 className="text-sm md:text-base font-black text-stone-900 font-serif">
            دراسة حية للنمو التراكمي ومداخيل المنصة الإجمالية
          </h3>
          <p className="text-[11px] text-stone-500 font-light">
            مؤشرات فورية يتم سحبها تلقائياً من نظام التحقق من المدفوعات وبنك الاستمارات الكلي.
          </p>
        </div>

        {/* Date Filter Controls (Date Range Picker) */}
        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 bg-stone-50 p-1.5 rounded-2xl border border-stone-100">
          <Calendar className="w-4 h-4 text-orange-700 mr-2 shrink-0" />
          
          <button
            onClick={() => { setDateRange('6months'); handleRefresh(); }}
            className={`py-1 px-3.5 rounded-xl text-[11px] font-black transition cursor-pointer border-0 ${
              dateRange === '6months' ? 'bg-orange-700 text-amber-50 shadow-xs' : 'text-stone-500 hover:text-stone-800 bg-transparent'
            }`}
          >
            آخر ٦ أشهر
          </button>
          
          <button
            onClick={() => { setDateRange('3months'); handleRefresh(); }}
            className={`py-1 px-3.5 rounded-xl text-[11px] font-black transition cursor-pointer border-0 ${
              dateRange === '3months' ? 'bg-orange-700 text-amber-50 shadow-xs' : 'text-stone-500 hover:text-stone-800 bg-transparent'
            }`}
          >
            آخر ٣ أشهر
          </button>
          
          <button
            onClick={() => { setDateRange('30days'); handleRefresh(); }}
            className={`py-1 px-3.5 rounded-xl text-[11px] font-black transition cursor-pointer border-0 ${
              dateRange === '30days' ? 'bg-orange-700 text-amber-50 shadow-xs' : 'text-stone-500 hover:text-stone-800 bg-transparent'
            }`}
          >
            آخر ٣٠ يوماً
          </button>

          <button 
            onClick={handleRefresh}
            className={`p-1.5 mr-1 hover:bg-stone-200 rounded-lg text-stone-400 hover:text-stone-700 transition ${isRefreshing ? 'animate-spin text-orange-700' : ''}`}
            title="تحديث البيانات الكبرى"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Visual Charts Grid Layout */}
      <div className={`grid grid-cols-1 lg:grid-cols-12 gap-6 transition-opacity duration-300 ${isRefreshing ? 'opacity-40' : 'opacity-100'}`}>
        
        {/* Row 1, Col 1: Area Chart representing Monthly Revenue (الإيرادات الشهرية) */}
        <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-amber-200/60 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div className="space-y-1">
              <span className="text-[10px] text-emerald-700 bg-emerald-50 py-0.5 px-2.5 rounded-md font-bold inline-block">
                متحصلات مرخصة
              </span>
              <h4 className="text-xs md:text-sm font-black text-stone-900 font-serif">الإيرادات الشهرية وتدفقات رسوم المقاعد</h4>
            </div>
            <div className="text-left">
              <span className="text-xs font-mono font-black text-[#962D15] block">
                {activeRevenueData.reduce((acc, c) => acc + c.revenue, 0).toLocaleString('ar-SA')} ر.س
              </span>
              <span className="text-[9px] text-stone-400 block">إجمالي الفترة المحددة</span>
            </div>
          </div>

          <div className="h-72 w-full font-sans text-[10px]" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={activeRevenueData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C2410C" stopOpacity={0.24}/>
                    <stop offset="95%" stopColor="#C2410C" stopOpacity={0.01}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F2EFE9" />
                <XAxis 
                  dataKey="name" 
                  stroke="#78716C"
                  tickLine={false}
                  fontSize={10}
                />
                <YAxis 
                  stroke="#78716C"
                  tickLine={false}
                  fontSize={10}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#1C1917',
                    border: 'none',
                    borderRadius: '16px',
                    color: '#FFF',
                    fontSize: '11px',
                    direction: 'rtl',
                    textAlign: 'right'
                  }}
                  formatter={(value: any) => [`${value} ر.س`, 'الإيرادات']}
                  labelFormatter={(label) => `الفترة: ${label}`}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#C2410C" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#revenueGradient)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Row 1, Col 2: Info Card / Platform Key Performance statistics (Metrics summary) */}
        <div className="lg:col-span-4 bg-[#FAF9F5] p-6 rounded-3xl border border-amber-200 shadow-xs flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="border-b border-amber-100 pb-3 text-right">
              <span className="text-[10px] text-amber-700 font-extrabold uppercase">كفاءة المنظومة المعرفية</span>
              <h4 className="text-xs md:text-sm font-black text-stone-900 font-serif">مؤشرات الأداء المستهدفة KPI</h4>
            </div>

            <div className="space-y-4">
              
              {/* Stat Item 1 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 text-right">
                  <div className="w-8 h-8 rounded-xl bg-orange-700 bg-orange-100 text-orange-900 flex items-center justify-center">
                    <Users className="w-4 h-4 text-orange-700" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-stone-900 block">معدل الاحتفاظ بالدارسين</span>
                    <span className="text-[10px] text-stone-500">من التسجيل للشهادة</span>
                  </div>
                </div>
                <span className="text-xs font-mono font-black text-orange-950">٩٢.٦ ٪</span>
              </div>

              {/* Stat Item 2 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 text-right">
                  <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-800 flex items-center justify-center">
                    <Award className="w-4 h-4 text-teal-700" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-stone-900 block">إجازات منصوص عليها</span>
                    <span className="text-[10px] text-stone-500">تقييمات علمية ممتازة</span>
                  </div>
                </div>
                <span className="text-xs font-mono font-black text-teal-800">٤٢٥ إجازة</span>
              </div>

              {/* Stat Item 3 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 text-right">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-900 flex items-center justify-center">
                    <BookOpen className="w-4 h-4 text-amber-700" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-stone-900 block">مدة الاستماع التراكمي</span>
                    <span className="text-[10px] text-stone-500">لكل متعلم نشط</span>
                  </div>
                </div>
                <span className="text-xs font-mono font-black text-stone-800">١٨ ساعة</span>
              </div>

            </div>
          </div>

          <div className="p-4 bg-orange-50 text-amber-950 rounded-2xl border border-orange-100/50 text-[11px] leading-relaxed text-right font-serif">
            📜 <strong>توجيه رقابي:</strong> تم منح صلاحيات إضافية لقنوات التدقيق لتيسير فحص ملفات pdf لرسائل الدكتوراه التراثية.
          </div>
        </div>

        {/* Row 2, Col 1: User Growth Chart (نمو تسجيل المستخدمين) - BarChart */}
        <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-amber-200/60 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3 text-right">
            <div>
              <span className="text-[10px] text-orange-700 font-extrabold block">نمو مجتمع آثاري العلمي</span>
              <h4 className="text-xs md:text-sm font-black text-stone-900 font-serif">نسب استمارات المستخدمين الجدد (طلاب لمدربين)</h4>
            </div>
            <div className="flex gap-4 text-xs font-bold">
              <div className="flex items-center gap-1.5 text-[11px] text-stone-600">
                <span className="inline-block w-2.5 h-2.5 rounded bg-orange-600" />
                <span>الطلاب</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-stone-600">
                <span className="inline-block w-2.5 h-2.5 rounded bg-teal-600" />
                <span>المدربون</span>
              </div>
            </div>
          </div>

          <div className="h-64 w-full font-sans text-[10px]" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={activeUserGrowthData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F2EFE9" />
                <XAxis dataKey="name" stroke="#78716C" tickLine={false} fontSize={10} />
                <YAxis stroke="#78716C" tickLine={false} fontSize={10} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#1C1917',
                    border: 'none',
                    borderRadius: '16px',
                    color: '#FFF',
                    fontSize: '11px',
                    direction: 'rtl',
                    textAlign: 'right'
                  }}
                  formatter={(value: any, name: any) => [
                    `${value} عضو جديد`, 
                    name === 'students' ? 'الطلاب' : 'العلماء الخبراء'
                  ]}
                />
                <Bar dataKey="students" fill="#C2410C" name="students" radius={[4, 4, 0, 0]} />
                <Bar dataKey="instructors" fill="#0D9488" name="instructors" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Row 2, Col 2: Enrollment Trends Chart (اتجاهات التسجيل في الدورات) - LineChart */}
        <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-amber-200/60 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3 text-right">
            <div>
              <span className="text-[10px] text-teal-700 font-extrabold block">الإقبال على الحقائب الأكاديمية</span>
              <h4 className="text-xs md:text-sm font-black text-stone-900 font-serif">اتجاهات حركة المقاعد (الدبلومات العامة vs المساقات الدقيقة)</h4>
            </div>
          </div>

          <div className="h-64 w-full font-sans text-[10px]" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={activeEnrollmentData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F2EFE9" />
                <XAxis dataKey="name" stroke="#78716C" tickLine={false} fontSize={10} />
                <YAxis stroke="#78716C" tickLine={false} fontSize={10} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#1C1917',
                    border: 'none',
                    borderRadius: '16px',
                    color: '#FFF',
                    fontSize: '11px',
                    direction: 'rtl',
                    textAlign: 'right'
                  }}
                  formatter={(value: any, name: any) => [
                    `${value} طلب حجز`,
                    name === 'standard' ? 'الدبلومات العامة' : 'المقررات الدقيقة'
                  ]}
                />
                <Legend align="right" wrapperStyle={{ paddingRight: 20 }} />
                <Line 
                  type="monotone" 
                  dataKey="standard" 
                  stroke="#C2410C" 
                  name="الدبلومات العامة" 
                  strokeWidth={2}
                  activeDot={{ r: 6 }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="specialized" 
                  stroke="#0D9488" 
                  name="المقررات الدقيقة" 
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Row 3: Top Performing Courses Matrix Table (الدورات الأكثر تميزاً مبيعاً) */}
        <div className="lg:col-span-12 bg-white rounded-3xl border border-amber-200/80 shadow-xs overflow-hidden">
          <div className="p-5 bg-stone-50 border-b border-stone-100 flex justify-between items-center text-right">
            <div>
              <h4 className="text-xs md:text-sm font-black text-stone-900 font-serif">الدورات الخمس الأكثر تحقيقاً للإيرادات بالمنصة</h4>
              <p className="text-[10px] text-stone-500 font-light">قائمة مرتبة تنازلياً حسب مبيعات المقاعد التدريبية المحكمة والمثبتة.</p>
            </div>
            <div className="flex items-center gap-1.5 text-[10.5px] bg-orange-50 text-orange-950 font-black px-2.5 py-1 rounded-xl">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>معدل نمو استثنائي</span>
            </div>
          </div>

          <div className="overflow-x-auto text-right">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-stone-50/50 border-b border-stone-100 text-stone-500 text-[10px] font-extrabold text-right">
                  <th className="p-4">المساق الدراسي والمعد</th>
                  <th className="p-4">إجمالي مبيعات الفترة</th>
                  <th className="p-4">عدد الطلاب الملتحقين</th>
                  <th className="p-4">معدل الإثراء وإنجاز الاختبار والتقويم</th>
                  <th className="p-4">ترتيب الشرف الفني</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {topCourses.map((course, index) => (
                  <tr key={course.id} className="hover:bg-amber-50/10 transition">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={course.thumbnail} 
                          alt="thumb" 
                          className="w-10 h-10 rounded-xl object-cover shrink-0 border border-amber-100" 
                          referrerPolicy="no-referrer"
                        />
                        <div className="space-y-0.5 text-right">
                          <span className="text-xs font-black text-stone-900 leading-snug block">{course.title}</span>
                          <span className="text-[9.5px] text-stone-400 block">إشراف الباحث: {course.instructor}</span>
                        </div>
                      </div>
                    </td>

                    <td className="p-4 font-mono font-black text-[#962D15] text-xs">
                      {course.revenue.toLocaleString('ar-SA')} ر.س
                    </td>

                    <td className="p-4 font-mono font-bold text-stone-700">
                      {course.students} طالب وطالبة
                    </td>

                    <td className="p-4 max-w-xs md:max-w-none">
                      <div className="flex items-center gap-3">
                        <div className="w-32 bg-stone-100 h-2 rounded-full overflow-hidden border border-stone-200/50">
                          <div 
                            className="bg-orange-700 h-full rounded-full" 
                            style={{ width: `${course.completionRate}%` }} 
                          />
                        </div>
                        <span className="text-[10px] font-mono font-black text-stone-800">
                          {course.completionRate}%
                        </span>
                      </div>
                    </td>

                    <td className="p-4 text-right">
                      <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-black ${
                        index === 0 ? 'bg-amber-500 text-stone-950 font-extrabold shadow-sm ring-1 ring-amber-400' :
                        index === 1 ? 'bg-stone-300 text-stone-900 font-extrabold' :
                        index === 2 ? 'bg-amber-200 text-amber-950 font-bold' :
                        'bg-stone-100 text-stone-500'
                      }`}>
                        {index + 1}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
}
