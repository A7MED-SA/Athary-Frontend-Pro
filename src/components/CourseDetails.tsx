import React, { useState } from 'react';
import { Course, ViewType } from '../types';
import { COURSES } from '../data';
import { 
  ArrowRight, 
  Star, 
  Users, 
  Calendar, 
  Globe, 
  CheckCircle, 
  PlayCircle, 
  Lock, 
  Unlock, 
  BookOpen, 
  Award, 
  Clock, 
  Heart, 
  Share2, 
  ShieldCheck, 
  FileText, 
  HelpCircle,
  TrendingUp,
  AwardIcon,
  BookMarked,
  X,
  Compass
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CourseDetailsProps {
  courseId: string;
  onAddToCart: (course: Course) => void;
  cartItems: Course[];
  setActiveView: (view: ViewType) => void;
  onTriggerToast: (msg: string) => void;
  onViewInstructorProfile?: (name: string) => void;
}

export default function CourseDetails({
  courseId,
  onAddToCart,
  cartItems,
  setActiveView,
  onTriggerToast,
  onViewInstructorProfile
}: CourseDetailsProps) {
  const [favorite, setFavorite] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState<number | null>(0);

  // Active course finder
  const course = COURSES.find(c => c.id === courseId) || COURSES[0];
  const inCart = cartItems.some(item => item.id === course.id);

  // Dynamic syllabus generation depending on course
  const getSyllabus = (id: string) => {
    switch (id) {
      case 'course_1':
        return [
          {
            title: 'الفصل الأول: مدخل تمهيدي وباب التعريف بفلسفة العمارة',
            lessons: [
              { title: 'علم العمران بين المادي والروحي: نظرة تاريخية فاحصة', duration: '٤٥ دقيقة', type: 'video', free: true },
              { title: 'أسرار الاتزان ومفهوم الهوية الهندسية الإسلامية', duration: '٣٠ دقيقة', type: 'video', free: false },
              { title: 'قراءة في مخطوطة "الإعلام بهندسة الإسلام" العتيقة', duration: '٥٠ دقيقة', type: 'document', free: false }
            ]
          },
          {
            title: 'الفصل الثاني: البنى الهيكلية والقباب والمنارات',
            lessons: [
              { title: 'المقرنصات المعلقة: فلسفة توازن الصخر ومحاكاة الطبيعة', duration: '٦٠ دقيقة', type: 'video', free: false },
              { title: 'هندسة القباب المزدوجة وتحمل الحركات الأرضية في المساجد الكبرى', duration: '٥٥ دقيقة', type: 'video', free: false },
              { title: 'المنارات العباسية والأموية: التطور الوظيفي والجمالي عبر العصور', duration: '٤٠ دقيقة', type: 'video', free: false }
            ]
          },
          {
            title: 'الفصل الثالث: الفنون الزخرفية والخطوط الأثرية المدمجة',
            lessons: [
              { title: 'فنون الفسيفساء الشرفية في المسجد الأموي بدمشق', duration: '٧٥ دقيقة', type: 'video', free: false },
              { title: 'الكتابة كعنصر إنشائي: أسرار نقوش الثلث على جدران المعابد والأضرحة', duration: '٥٠ دقيقة', type: 'document', free: false },
              { title: 'كراسة التفاصيل الفنية للنقوش الجصية بمسجد قرطبة', duration: '١٢ صفحة', type: 'document', free: false }
            ]
          },
          {
            title: 'الفصل الرابع: الاختبار النهائي الشامل ومنح الإجازة الكبرى',
            lessons: [
              { title: 'الامتحان الفردي التقييمي: فلسفة البناء الأموي والعباسي والأندلسي', duration: '٦٠ دقيقة', type: 'quiz', free: false },
              { title: 'مناقشة التقرير العملي وبدء تدبيج الإسناد الورقي الرقمي الموثق', duration: '٣٠ دقيقة', type: 'video', free: false }
            ]
          }
        ];
      case 'course_3':
        return [
          {
            title: 'الفصل الأول: نشأة البلاغة والمدارس العربية الأولى',
            lessons: [
              { title: 'أسرار الإعجاز البلاغي والبياني في القرآن الكريم والسنة النبوية', duration: '٣٥ دقيقة', type: 'video', free: true },
              { title: 'الفروق المنهجية بين مدرسة البصرة ومدرسة الكوفة في علوم الأدب والنظم', duration: '٤٥ دقيقة', type: 'video', free: false }
            ]
          },
          {
            title: 'الفصل الثاني: علم البيان - التشبيه، المجاز، والاستعارة',
            lessons: [
              { title: 'التشبيه التمثيلي والضمني: اللمسات الجمالية وتطبيق من عيون الشعر العربي', duration: '٥٠ دقيقة', type: 'video', free: false },
              { title: 'الحقيقة والمجاز الممنهج ودوره في تزيين مجالس النثر الإنشائي', duration: '٤٠ دقيقة', type: 'video', free: false }
            ]
          },
          {
            title: 'الفصل الثالث: تطور النثر الفني ومجالس الإفتاء المعمد بعهد الجاحظ',
            lessons: [
              { title: 'رسائل الجاحظ وبديع الزمان الهمذاني: المدرسة الأدبية الخالدة والنسق البدييل', duration: '٦٠ دقيقة', type: 'video', free: false },
              { title: 'ديوان نماذج فخر الإنشاء والبلاغة المرتجلة بالمجالس الأثرية', duration: '٢٤ صفحة', type: 'document', free: false }
            ]
          }
        ];
      default:
        return [
          {
            title: 'الفصل الأول: تمهيد المنهج والمدخل إلى جوهر العلم التراثي',
            lessons: [
              { title: 'المصطلحات التأسيسية وأدوات الطالب بمجلس التعلم من البداية', duration: '٤٠ دقيقة', type: 'video', free: true },
              { title: 'مفاهيم الأصالة الفكرية وعلاقتها بالبنية الأثرية الحديثة', duration: '٣٠ دقيقة', type: 'video', free: false },
              { title: 'خطوات استخراج وحفظ المحتوى الدراسي والتفاعل مع المدرب', duration: '٢٠ دقيقة', type: 'document', free: false }
            ]
          },
          {
            title: 'الفصل الثاني: المحاور الكبرى والمسائل التفصيلية المعمقة للتحرير',
            lessons: [
              { title: 'تفكيك المسائل الأساسية وتبيان الإسناد العلمي المناسب للتقييم', duration: '٦٠ دقيقة', type: 'video', free: false },
              { title: 'دراسة مرئية مستندة إلى خرائط وتحف أثرية موثقة', duration: '٥٠ دقيقة', type: 'video', free: false }
            ]
          },
          {
            title: 'الفصل الثالث: ورشة التقييم المنهجي والمقابلة المباشرة',
            lessons: [
              { title: 'الامتحان السنوي الأكاديمي والتطبيقات الفردية المقارنة', duration: '٤٥ دقيقة', type: 'quiz', free: false },
              { title: 'طرق تدبيج واستلام شهادات التحصين والإجازة الكبرى بآثاري', duration: '١٥ دقيقة', type: 'video', free: false }
            ]
          }
        ];
    }
  };

  const getWhatYouWillLearn = (id: string) => {
    switch (id) {
      case 'course_1':
        return [
          'استكشاف الفلسفة الروحية والجمالية الكامنة وراء الهندسة والتلوين الإسلامي.',
          'القدرة الذاتية على دراسة وتصنيف الطرز المعمارية (الأموي، العباسي، المملوكي، والأندلسي).',
          'تحليل هيكلي كامل للقباب المتطورة لامتصاص الصدمات الجيولوجية وحل العقود والأعمدة.',
          'توظيف التقييم والترميم ثنائي وثلاثي الأبعاد باستخدام الأدوات التراثية والرقمية.',
          'قواعد دمج الخط العربي الثلث بجمال في الزخرفة الجدارية والجصية وصناعة الروائع.',
          'التدرب على قراءة وفك شفرات المعبد القديم وتوثيق الرسوم الهندسية المصاحبة للأصل.'
        ];
      case 'course_2':
        return [
          'تتبع نشوء وسقوط الدويلات المستقلة بالمشرق كالفاطميين والزنكيين والأيوبيين وسلاجقة الروم.',
          'فهم العمق الحضاري والاجتماعي والفلسفي الذي صبغ حياة الناس والمفكرين في المشرق.',
          'التعرف على مسارات التجارة القديمة ودورها في نقل المخطوطات والعلوم للأمم الأخرى.',
          'التقييم المعمق لدور القلاع والموانئ الحربية في درء الأخطار وصد الحملات الصليبية.'
        ];
      case 'course_3':
        return [
          'إتقان ميثاق النثر الفني الكلاسيكي وحسن توظيف تراكيب التشبيه والاستعارة والبيان.',
          'القدرة على التمييز السمعي للنغمات النثرية وبديع السجع في المكاتبات التراثية القديمة.',
          'تحسين المهارة الشخصية في صياغة الخطب والرسائل الرسمية الرنانة بجزالة فصحى بليغة.',
          'نقد وفهم أشعار كبار الطامحين بالبلاغة وتحليل مواطن الحسن والتصوير الفني البهي.'
        ];
      default:
        return [
          'الحصول على مادة علمية شاملة ومنقحة بمعرفة كبار العلماء الأكاديميين المعتمدين.',
          'التمكن الفوري من مهارة تفكيك المسائل المعقدة وصعود مراتب الإتقان بسهولة.',
          'بناء معرفي متين مدعوم بخرائط أثرية حقيقية وصور فوتوغرافية ومخطوطات أصلية.',
          'استحقاق نيل شهادة الإجازة الكبرى الممهورة بالختم الهاشمي لتوثيق التحصيل والتميّز.'
        ];
    }
  };

  const syllabusChapters = getSyllabus(course.id);
  const whatYouWillLearn = getWhatYouWillLearn(course.id);

  // Mock course reviews (very high fidelity)
  const courseReviews = [
    {
      name: 'عبد الهادي الأنصاري',
      rating: 5,
      comment: 'هذه الدورة بمثابة كنز تراثي أصيل! الشرح هادئ ومقترن بالشواهد والصور النادرة. أنصح بها وبشدة لكل طالب علم يبحث عن المتعة الهندسية البصرية المقترنة بالعمق العقدي.',
      date: 'منذ يومين',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'
    },
    {
      name: 'زينب الشنقيطي',
      rating: 5,
      comment: 'دروس المقرنصات والقباب الأموية جعلتني أعيد قراءة الفن الإنشائي بروح تراثية فاحصة. المدرب متمكن للغاية ويسخر فصاحته لتبسيط أشد المعضلات الهندسية دقة وجمالاً.',
      date: 'منذ أسبوع',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'
    },
    {
      name: 'عمر الفاروق الدليمي',
      rating: 4,
      comment: 'محتوى استثنائي ومتقن والخرائط التوضيحية ممتازة. كنت أتمنى لو تم التوسع في الجانب العملي الرقمي أكثر ولكنها على أي حال أوفى دورة فنية عثرت عليها.',
      date: 'منذ ١٢ يوماً',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150'
    }
  ];

  const [reviewsList, setReviewsList] = useState(courseReviews);
  const dynamicAvgRating = reviewsList.length > 0
    ? reviewsList.reduce((acc, curr) => acc + curr.rating, 0) / reviewsList.length
    : course.rating;

  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [newReviewName, setNewReviewName] = useState('طالب مجتهد');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState('');
  const [ratingHover, setRatingHover] = useState(0);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewComment.trim()) return;

    const newRev = {
      name: newReviewName.trim() || 'طالب مجهول',
      rating: newReviewRating,
      comment: newReviewComment.trim(),
      date: 'الآن',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'
    };

    setReviewsList([newRev, ...reviewsList]);
    setIsReviewDialogOpen(false);
    setNewReviewComment('');
    setNewReviewRating(5);
    onTriggerToast('تم استلام تقييمكم المبارك للمجلس الأكاديمي وصكّه بنجاح! 📜✨');
  };

  const handleToggleFavorite = () => {
    setFavorite(!favorite);
    onTriggerToast(!favorite ? 'أضيفت الدورة إلى قائمة محفوظاتك التراثية بنجاح!' : 'تمت الإزالة من قائمتك المرجعية.');
  };

  const handleShareCourse = () => {
    const shareText = `بحمد الله، أثبتُّ رغبتي بتعلم مسار (${course.title}) لدى منصة آثاري الراقية للتراث. انضموا إلينا! 🕊️📜`;
    navigator.clipboard.writeText(shareText);
    onTriggerToast('📋 تم نسخ رابط الإجازة والمعايرة لملف مشاركتك الشخصي! جاهز للمشاركة.');
  };

  const handleAddToCartLocal = () => {
    onAddToCart(course);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-[var(--color-background)] pb-16 pt-6 text-[var(--color-foreground)] transition-colors duration-250"
      dir="rtl"
    >
      {/* HERO BANNER SECTION (Dark Warm Overlay over Pattern Background) */}
      <section className="relative bg-[#1A1612] text-amber-50 overflow-hidden py-12 md:py-16 px-4 md:px-8 border-b border-amber-900/40 shadow-inner">
        {/* Soft background glow */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#C2410C_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#120F0D] via-[#1C1714]/90 to-[#120F0D]/60 pointer-events-none" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          
          {/* Breadcrumb & Hero Text (Right 8 columns) */}
          <div className="lg:col-span-8 text-right space-y-4">
            
            {/* Navigation back and Category */}
            <div className="flex flex-wrap items-center gap-2.5 text-xs">
              <button 
                onClick={() => setActiveView('catalog')}
                className="text-amber-500 hover:text-amber-300 font-bold transition flex items-center gap-1 cursor-pointer bg-transparent border-0"
              >
                <ArrowRight className="w-4 h-4 ml-1" />
                <span>العودة لكتالوج الدورات</span>
              </button>
              <span className="text-stone-600">/</span>
              <span className="bg-orange-950/80 text-orange-400 font-bold px-3 py-1 rounded-full border border-orange-900/60">
                {course.category}
              </span>
            </div>

            {/* Course Title and Tagline */}
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white leading-tight font-serif tracking-tight pr-1 border-r-4 border-orange-700">
              {course.title}
            </h1>

            <p className="text-xs sm:text-sm text-stone-300 max-w-3xl leading-relaxed font-light">
              مقرر ممهد ومصادق من قبل الهيئة الاستشارية العلمية لمنصة آثاري، صباغة نظرية وهندسية فنية تعتمد الأسانيد المتصلة وتمنح الدارسين المتميزين مجازاً أكاديمياً مدبجاً بالخط المغربي.
            </p>

            {/* Micro details stats line */}
            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs">
              
              {/* Rating stars */}
              <div className="flex items-center gap-1.5 text-amber-505 bg-black/45 px-3 py-1.5 rounded-xl border border-stone-800">
                <span className="font-extrabold text-amber-400 font-mono text-sm">{dynamicAvgRating.toFixed(1)}</span>
                <div className="flex text-amber-400 gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star} 
                      className={`w-3.5 h-3.5 fill-current ${
                        star <= Math.round(dynamicAvgRating) ? 'text-amber-400' : 'text-stone-700'
                      }`} 
                    />
                  ))}
                </div>
                <span className="text-stone-400 text-[10px]">({reviewsList.length} مراجعات مصادقة)</span>
              </div>

              {/* Enrolled Students Count */}
              <div className="flex items-center gap-1 text-stone-350 bg-black/45 px-3 py-1.5 rounded-xl border border-stone-800 text-stone-3 align-middle">
                <Users className="w-4 h-4 text-orange-500" />
                <span className="font-bold text-[11px] font-mono text-stone-300">{course.studentsCount.toLocaleString('ar-EG')} طالب مسجل</span>
              </div>

              {/* Language and Last update */}
              <div className="flex items-center gap-4 text-stone-400 text-[11px]">
                <div className="flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-stone-500" />
                  <span>اللغة: العربية الفصحى</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-stone-500" />
                  <span>آخر تحديث: يونيو ٢٠٢٦ م</span>
                </div>
              </div>

            </div>

          </div>

          {/* Left Column Graphic Feature (Desktop only, 4 cols) */}
          <div className="hidden lg:block lg:col-span-4 select-none">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-orange-950/80 group">
              <img 
                src={course.thumbnail} 
                alt={course.title} 
                className="w-full h-56 object-cover transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#120F0D] to-transparent opacity-60" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="w-14 h-14 bg-orange-700 hover:bg-orange-600 text-amber-50 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110 cursor-pointer">
                  <PlayCircle className="w-8 h-8 fill-amber-50/10" />
                </span>
              </div>
              <span className="absolute bottom-3 left-3 text-[10px] bg-black/75 text-amber-400 font-bold px-2.5 py-1 rounded-md">
                معاينة تعريفية للمسلك
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* CORE TWO-COLUMN MAIN CONTENTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* RIGHT COLUMN (Desktop 4 cols): Sticky Sidebar Checkout / Purchase widget */}
          <div className="lg:col-span-4 order-1 lg:order-2">
            <div className="bg-white rounded-3xl border border-amber-200/90 shadow-lg p-6 space-y-6 sticky top-24" id="sticky-course-checkout-sidebar">
              
              {/* Thumbnail image for mobile preview within sidebar widget card */}
              <div className="relative rounded-2xl overflow-hidden h-44 mb-2 lg:hidden">
                <img 
                  src={course.thumbnail} 
                  alt={course.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-transparent to-transparent opacity-60" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="w-12 h-12 bg-orange-700 text-white rounded-full flex items-center justify-center shadow">
                    <PlayCircle className="w-6 h-6" />
                  </span>
                </div>
              </div>

              {/* Cost of course */}
              <div className="space-y-1.5 text-right">
                <span className="text-[10px] text-stone-400 font-bold block">قيمة الاستثمار والمعايرة المعرفية:</span>
                <div className="flex items-baseline gap-2 justify-start">
                  {course.price === 0 ? (
                    <span className="text-2xl font-black text-teal-700">دورة مجانية بالكامل</span>
                  ) : (
                    <>
                      <span className="text-3xl font-black text-stone-950 font-sans tracking-tight">{course.price} ر.س</span>
                      {course.originalPrice && (
                        <span className="text-xs text-stone-400 line-through font-mono font-bold">{course.originalPrice} ر.س</span>
                      )}
                    </>
                  )}
                </div>
                <p className="text-[10px] text-stone-500 leading-normal">
                  * الرسوم شاملة حضور مجالس النقاش الصوتي التفاعلي، مراجعة الاختبارات، واستحقاق الإسناد الرقمي المباشر.
                </p>
              </div>

              {/* Purchase Action Buttons */}
              <div className="space-y-2.5">
                <button
                  onClick={handleAddToCartLocal}
                  disabled={inCart}
                  className={`w-full py-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 shadow-md border-0 ${
                    inCart 
                      ? 'bg-amber-100 text-stone-500 border border-amber-200 cursor-not-allowed'
                      : 'bg-orange-700 hover:bg-orange-850 text-amber-50 cursor-pointer'
                  }`}
                >
                  <BookMarked className="w-4 h-4" />
                  <span>
                    {inCart ? 'تم حجزها في حقيبتك' : 'احجز مقعدك الآن (أضف للسلة)'}
                  </span>
                </button>

                {inCart && (
                  <button
                    onClick={() => setActiveView('cart-checkout')}
                    className="w-full bg-teal-750 bg-teal-700 hover:bg-teal-850 text-amber-50 py-3.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer border-0 shadow-sm"
                  >
                    <span>الذهاب لإتمام حجز المقاعد والتحصين</span>
                    <span>←</span>
                  </button>
                )}

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    onClick={handleToggleFavorite}
                    className={`py-3 px-2.5 rounded-xl font-bold border transition flex items-center justify-center gap-1.5 cursor-pointer ${
                      favorite 
                        ? 'bg-orange-50 border-orange-350 text-orange-750' 
                        : 'bg-white border-stone-200 hover:bg-stone-50 text-stone-600'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${favorite ? 'fill-current text-orange-700' : ''}`} />
                    <span>{favorite ? 'مفضلة' : 'حفظ للمرجعية'}</span>
                  </button>

                  <button
                    onClick={handleShareCourse}
                    className="py-3 px-2.5 bg-white border border-stone-200 hover:bg-stone-50 rounded-xl font-bold text-stone-600 transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5 text-stone-400 animate-pulse" />
                    <span>مشاركة العلم</span>
                  </button>
                </div>
              </div>

              {/* What course includes bullet checklist detail line */}
              <div className="pt-5 border-t border-amber-100 space-y-3">
                <h4 className="font-bold text-xs text-stone-900 text-right flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-orange-700" />
                  <span>تشمل دراسة هذا المقرر:</span>
                </h4>
                
                <ul className="space-y-2 text-right text-xs text-stone-600 font-light">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-teal-700 shrink-0" />
                    <span>وصول كامل مدى الحياة للمحاضرات المسجلة</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-teal-700 shrink-0" />
                    <span>شهادة إجازة مغرب مذهب مخرجات رقمية معمدة</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-teal-700 shrink-0" />
                    <span>حلقات نقاش ودروس صوتية تفاعلية حية دورية</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-teal-700 shrink-0" />
                    <span>ملفات دراسية PDF داعمة تفصيلية للنصوص كراسة التدبر</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-teal-700 shrink-0" />
                    <span>اختبارات تقييمية مستمرة ومراجعة فردية للواجبات</span>
                  </li>
                </ul>
              </div>

              {/* Secure Trust Stamp info */}
              <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-100 flex items-center gap-3 text-right">
                <ShieldCheck className="w-8 h-8 text-orange-800 shrink-0" />
                <div className="space-y-0.5">
                  <h5 className="font-bold text-[10px] text-stone-900 leading-none">ميثاق الأصالة والضمان الكامل</h5>
                  <p className="text-[9px] text-stone-500 leading-normal">
                    في حال عدم استيفاء رغبتك بالتحصيل الأكاديمي، نرد الرسوم كاملة خلال ١٤ يوماً دون أي اشتراطات.
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* LEFT COLUMN (Desktop 8 cols): Core info, What you'll learn, curriculum, instructor review list */}
          <div className="lg:col-span-8 order-2 lg:order-1 text-right space-y-8">
            
            {/* Box: "What you learn" (ماذا ستتعلم؟) */}
            <div className="bg-white rounded-3xl border border-amber-200/90 p-6 sm:p-8 shadow-xs" id="learn-objectives">
              <h2 className="text-base font-black text-stone-950 flex items-center gap-2 border-b border-amber-100 pb-3 mb-5">
                <span className="w-2.5 h-4 bg-orange-700 rounded-full" />
                <span>ماذا ستتعلم في هذا المسلك التراثي؟</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {whatYouWillLearn.map((objective, index) => (
                  <div key={index} className="flex items-start gap-2.5 text-xs text-stone-705 text-stone-700 leading-relaxed font-light">
                    <CheckCircle className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
                    <span>{objective}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Curriculum Accordion (محتوى الدورة) */}
            <div className="bg-white rounded-3xl border border-amber-200/90 p-6 sm:p-8 shadow-xs" id="curriculum-accordion">
              <div className="flex items-center justify-between border-b border-amber-100 pb-3 mb-5">
                <h2 className="text-base font-black text-stone-950 flex items-center gap-2">
                  <span className="w-2.5 h-4 bg-teal-700 rounded-full" />
                  <span>تفاصيل كراسة ومحتوى المنهج</span>
                </h2>
                <div className="text-xs text-stone-500 font-mono">
                  <span>إجمالي الحجم: {syllabusChapters.length} فصول • {syllabusChapters.reduce((acc, curr) => acc + curr.lessons.length, 0)} دروس ممهورة</span>
                </div>
              </div>

              {/* Accordion container */}
              <div className="space-y-3">
                {syllabusChapters.map((chapter, chapIdx) => {
                  const isOpen = activeAccordion === chapIdx;
                  return (
                    <div 
                      key={chapIdx} 
                      className={`border rounded-2xl overflow-hidden transition-all duration-200 ${
                        isOpen 
                          ? 'border-amber-300 bg-amber-50/15' 
                          : 'border-stone-200 hover:border-amber-250 bg-white'
                      }`}
                    >
                      {/* Chapter Trigger Toggle */}
                      <button
                        onClick={() => setActiveAccordion(isOpen ? null : chapIdx)}
                        className="w-full px-5 py-4 flex items-center justify-between text-right font-bold text-xs sm:text-sm text-stone-900 hover:text-orange-900 transition focus:outline-none cursor-pointer border-0 bg-transparent"
                      >
                        <span className="leading-snug pr-2 border-r-3 border-amber-400">{chapter.title}</span>
                        <span className="text-[10px] bg-stone-100 text-stone-600 px-2.5 py-1 rounded-full font-sans">
                          {chapter.lessons.length} دروس
                        </span>
                      </button>

                      {/* Lessons Grid list content under Chapter */}
                      {isOpen && (
                        <div className="px-5 pb-4 pt-1 divide-y divide-amber-100/55 text-xs text-stone-700">
                          {chapter.lessons.map((lesson, lesIdx) => (
                            <div key={lesIdx} className="py-3 flex items-center justify-between gap-3 font-light text-left">
                              
                              <div className="flex items-center gap-2.5 text-right w-full">
                                {lesson.free ? (
                                  <span className="text-[9px] bg-teal-100 text-teal-800 font-bold px-2 py-0.5 rounded leading-none shrink-0 border border-teal-200">مجاني</span>
                                ) : (
                                  <Lock className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                                )}
                                <span className={`text-stone-850 font-medium leading-relaxed ${lesson.free ? 'font-semibold text-stone-900' : ''}`}>
                                  {lesson.title}
                                </span>
                              </div>

                              <div className="flex items-center gap-2 text-[10px] text-stone-450 text-stone-400 shrink-0 font-mono">
                                <Clock className="w-3 h-3 text-stone-400" />
                                <span>{lesson.duration}</span>
                              </div>

                            </div>
                          ))}
                        </div>
                      )}

                    </div>
                  );
                })}
              </div>
            </div>

            {/* Instructor Details Segment (المدرب) */}
            <div className="bg-gradient-to-br from-[#FFFDF9] to-[#FDF9F0] border border-amber-250 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row gap-6 items-start" id="instructor-profile">
              
              {/* Photo Avatar */}
              <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 border-2 border-amber-500 shadow mx-auto md:mx-0">
                <img 
                  src={course.instructorAvatar} 
                  alt={course.instructorName} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Bio Details */}
              <div className="space-y-3 flex-1 text-center md:text-right min-w-0">
                
                <div className="space-y-1">
                  <span className="text-[9px] text-amber-800 bg-amber-100 px-3 py-1 rounded-full font-bold">عضو الهيئة الاستشارية المعتمد</span>
                  <div className="flex flex-col sm:flex-row items-center gap-3 mt-2 justify-center md:justify-start">
                    <h3 className="font-black text-stone-950 text-base">{course.instructorName}</h3>
                    <button
                      type="button"
                      onClick={() => onViewInstructorProfile && onViewInstructorProfile(course.instructorName)}
                      className="bg-orange-700 hover:bg-orange-850 text-amber-50 text-[10px] sm:text-xs font-black py-1 px-3 rounded-lg border-0 cursor-pointer shadow-xs transition"
                    >
                      عرض الملف الشخصي العام ←
                    </button>
                  </div>
                  <p className="text-[11px] text-stone-500 font-sans italic font-light">مؤلف وباحث ومحقق بارز للأسانيد التاريخية والفنون الزخرفية الإسلامية</p>
                </div>

                <p className="text-xs text-stone-605 text-stone-700 leading-relaxed font-light">
                  {course.id === 'course_1' 
                    ? 'باحث ومخطط معماري وباحث دكتوراه مختص في ترميم القصور الأثرية وقصور غرناطة والأندلس، يملك خبرة ممتدة لأكثر من ١٥ عاماً في التحقيق والتصميم الهندسي المصادق بصور ثنائية تفصيلية وثلاثية مدهشة للجمهور.'
                    : 'حائز على إجازة التحقيق الأكاديمي الأعلى، ويشرف على الفحص العلمي لأوراق الطلاب، مع مراجعة ومطابقة واجبات تزيين الخط والترميم القديم.'}
                </p>

                {/* stats quick row */}
                <div className="pt-2 flex items-center justify-center md:justify-start gap-6 text-xs border-t border-amber-200/50 mt-1">
                  
                  <div className="text-right">
                    <span className="text-[10px] text-stone-400 block">إجمالي طلابه:</span>
                    <strong className="font-bold text-stone-900 font-mono">{(course.studentsCount + 800).toLocaleString('ar-EG')} طالب</strong>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-stone-400 block">متوسط التقييم:</span>
                    <strong className="font-bold text-orange-950 flex items-center gap-0.5 justify-start font-mono">
                      <span>{dynamicAvgRating.toFixed(1)}</span>
                      <Star className="w-3 h-3 fill-amber-500 text-amber-500 inline-block mb-1 font-mono" />
                    </strong>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-stone-400 block">الكتب والتحقيقات:</span>
                    <strong className="font-bold text-stone-900 font-mono">٨ رسائل موثقة</strong>
                  </div>

                </div>

              </div>

            </div>

            {/* Individual Reviews Card segment (مراجعات طلابية) */}
            <div className="bg-white rounded-3xl border border-amber-200/90 p-6 sm:p-8 shadow-xs" id="reviews-segment">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-amber-100 pb-3 mb-5 gap-3">
                <h2 className="text-base font-black text-stone-950 flex items-center gap-2">
                  <span className="w-2.5 h-4 bg-orange-700 rounded-full" />
                  <span>عيون من تقييمات الدارسين لهذه الدورة</span>
                </h2>
                
                <button
                  onClick={() => setIsReviewDialogOpen(true)}
                  className="bg-orange-700 hover:bg-orange-850 text-amber-50 text-xs font-bold px-4 py-2.5 rounded-xl transition cursor-pointer border-0 shadow-sm self-start sm:self-auto hover:scale-102 active:scale-98"
                >
                  أضف تقييمًا أو مراجعةً
                </button>
              </div>

              <div className="space-y-4">
                {reviewsList.map((rev, revIdx) => (
                  <div key={revIdx} className="p-4 rounded-2xl border border-amber-100 bg-[#FFFDF9]/60 hover:bg-[#FFFDF9] transition shadow-sm space-y-2.5">
                    
                    <div className="flex justify-between items-center text-xs">
                      <div className="flex items-center gap-2">
                        <img 
                          src={rev.avatar} 
                          alt={rev.name} 
                          className="w-8 h-8 rounded-full border border-orange-100 object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="text-right">
                          <h5 className="font-bold text-stone-900 text-xs">{rev.name}</h5>
                          <span className="text-[9px] text-stone-400 font-sans block">طالب مجتاز بامتياز • {rev.date}</span>
                        </div>
                      </div>

                      <div className="flex text-amber-400 gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star} 
                            className={`w-3.5 h-3.5 fill-current ${
                              star <= rev.rating ? 'text-amber-500' : 'text-stone-100'
                            }`} 
                          />
                        ))}
                      </div>
                    </div>

                    <p className="text-xs text-stone-700 leading-relaxed font-light mt-1">
                      {rev.comment}
                    </p>

                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Shadcn-like Dialog with Framer Motion */}
      <AnimatePresence>
        {isReviewDialogOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto" id="reviews-detail-dialog-overlay" dir="rtl">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm transition-opacity"
              onClick={() => setIsReviewDialogOpen(false)}
            />

            {/* Central dialog container */}
            <div className="flex min-h-screen items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                transition={{ type: "spring", damping: 25, stiffness: 350 }}
                className="relative w-full max-w-md bg-white border border-amber-200/80 rounded-2xl shadow-2xl overflow-hidden text-right flex flex-col"
                id="reviews-detail-dialog-panel"
              >
                {/* Decorative topper */}
                <div className="h-1.5 bg-gradient-to-r from-orange-600 via-amber-500 to-teal-600" />

                {/* Header */}
                <div className="px-6 py-4 bg-amber-50/65 border-b border-amber-100 flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-stone-900 text-sm">تقييم ومراجعة الدورة الأكاديمية</h3>
                    <p className="text-[10px] text-stone-500 mt-0.5">شارك تجربتك ومدارستك المباركة مع عموم الدارسين</p>
                  </div>
                  <button 
                    type="button"
                    onClick={() => {
                      setIsReviewDialogOpen(false);
                      setNewReviewComment('');
                      setNewReviewRating(5);
                    }}
                    className="p-1.5 hover:bg-amber-100 rounded-lg text-stone-400 hover:text-stone-700 transition cursor-pointer border-0 bg-transparent"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Form Body */}
                <form onSubmit={handleSubmitReview} className="p-6 space-y-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-stone-600 block text-right">اسم الطالب الكريم ثنائياً</label>
                    <input
                      type="text"
                      required
                      value={newReviewName}
                      onChange={(e) => setNewReviewName(e.target.value)}
                      className="w-full text-xs font-semibold py-2 px-3 border border-amber-100 rounded-lg bg-stone-50/50 focus:outline-none focus:ring-1 focus:ring-orange-600 text-right"
                      placeholder="مثال: صالح الهاشمي"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-stone-600 block text-right">تقييمك لمجلس الدورة ورصانتها</label>
                    <div className="flex items-center gap-1.5 h-8">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setNewReviewRating(star)}
                          onMouseEnter={() => setRatingHover(star)}
                          onMouseLeave={() => setRatingHover(0)}
                          className="text-stone-200 transition duration-100 cursor-pointer focus:outline-none border-0 p-0 hover:scale-110 bg-transparent"
                        >
                          <Star 
                            className={`w-6 h-6 fill-current ${
                              star <= (ratingHover || newReviewRating) ? 'text-amber-500' : 'text-stone-250 text-stone-200'
                            }`} 
                          />
                        </button>
                      ))}
                      <span className="text-[10px] font-bold text-stone-500 pr-2 font-mono">({newReviewRating} من ٥)</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-stone-600 block text-right">مراجعتك النقدية وتعليقك الأدبي</label>
                    <textarea
                      required
                      rows={4}
                      value={newReviewComment}
                      onChange={(e) => setNewReviewComment(e.target.value)}
                      className="w-full text-xs font-normal py-2 px-3 border border-amber-100 rounded-lg bg-stone-50/50 focus:outline-none focus:ring-1 focus:ring-orange-600 text-right leading-relaxed resize-none"
                      placeholder="صف مجلس الدرس، رصانة الطرح، الأسلوب، والفوائد النثرية التي خرجت بها بقلمك الصادق..."
                    />
                  </div>

                  <div className="pt-2 flex gap-2">
                    <button
                      type="submit"
                      className="flex-1 bg-orange-700 hover:bg-orange-850 text-amber-50 text-xs font-bold py-2.5 rounded-xl transition cursor-pointer border-0 shadow-sm"
                    >
                      صك وحفظ المراجعة المباركة
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsReviewDialogOpen(false)}
                      className="bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium py-2.5 px-4 rounded-xl transition cursor-pointer border-0"
                    >
                      إلغاء الأمر
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
