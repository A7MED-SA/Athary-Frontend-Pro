import { useState } from 'react';
import { motion } from 'motion/react';
import { CATEGORIES, COURSES } from '../data';
import { Course, Category, ViewType } from '../types';
import { 
  BookOpen, 
  PenTool, 
  Palette, 
  Compass, 
  Star, 
  Users, 
  BookOpenCheck, 
  Sparkles, 
  Play, 
  ChevronLeft, 
  ShoppingBag, 
  Award, 
  MapPin, 
  Clock 
} from 'lucide-react';

interface LandingPageProps {
  setActiveView: (view: ViewType) => void;
  setCategoryFilter: (categorySlug: string | null) => void;
  onAddToCart: (course: Course) => void;
  cartItems: Course[];
  onViewCourseDetails: (id: string) => void;
}

export default function LandingPage({
  setActiveView,
  setCategoryFilter,
  onAddToCart,
  cartItems,
  onViewCourseDetails
}: LandingPageProps) {
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Filter 3 courses to display as featured
  const featuredCourses = COURSES.slice(0, 3);

  const handleCategoryClick = (slug: string) => {
    setCategoryFilter(slug);
    setActiveView('catalog');
  };

  const handleAddToCartLocal = (course: Course) => {
    onAddToCart(course);
    setSuccessToast(course.title);
    setTimeout(() => {
      setSuccessToast(null);
    }, 3000);
  };

  // Helper to map icon name to Lucide Icon
  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'BookOpen':
        return <BookOpen className="w-8 h-8 text-orange-700" />;
      case 'PenTool':
        return <PenTool className="w-8 h-8 text-amber-600" />;
      case 'Palette':
        return <Palette className="w-8 h-8 text-teal-700" />;
      case 'Compass':
        return <Compass className="w-8 h-8 text-stone-700" />;
      default:
        return <BookOpen className="w-8 h-8 text-orange-700" />;
    }
  };

  return (
    <div className="font-sans relative" dir="rtl" id="athary-landing-page">
      {/* Dynamic Success Toast */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 border-r-4 border-amber-500 text-amber-50 px-5 py-4 rounded-xl shadow-2xl max-w-sm flex items-center gap-3 animate-slide-in">
          <div className="bg-amber-600/25 p-2 rounded-lg text-amber-400">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-stone-400">تمت إضافة الدورة بنجاح!</p>
            <p className="font-semibold text-xs leading-tight mt-0.5 max-w-[240px] truncate">{successToast}</p>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[var(--color-brand-amber-50)]/35 via-[var(--color-background)] to-[var(--color-beige-darker)] pt-16 pb-24 md:py-32" id="hero-section">
        {/* Subtle geometric overlay */}
        <div className="absolute inset-0 bg-heritage-pattern opacity-10 pointer-events-none" />
        
        {/* Decorative architectural arch in background */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/3 w-[500px] h-[500px] bg-orange-700/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/4 right-0 -translate-y-1/2 translate-x-1/3 w-[300px] h-[300px] bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Right Side: Welcome Typography, Headline */}
            <div className="lg:col-span-7 space-y-8 text-right">
              <div className="inline-flex items-center gap-2 bg-[var(--color-brand-orange-50)] border border-[var(--color-brand-orange-100)] py-1.5 px-4 rounded-full text-xs font-semibold text-[var(--color-brand-orange-700)] shadow-sm">
                <Sparkles className="w-4 h-4 text-[var(--color-brand-amber-500)] animate-spin-slow" />
                <span>إعادة تعريف التعليم التراثي العربي برؤية حديثة</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[var(--color-foreground)] tracking-tight leading-none">
                اكتشف تراث المعرفة <br className="hidden sm:block" />
                مع منصة <span className="text-[var(--color-brand-orange-700)] relative inline-block">أثاري <span className="absolute bottom-1 right-0 left-0 h-2 bg-amber-300-30 pointer-events-none rounded" style={{ height: '8px', backgroundColor: 'rgba(217, 119, 6, 0.15)' }}></span></span>
              </h1>
              
              <p className="text-base sm:text-lg text-stone-700 dark:text-stone-300 leading-relaxed max-w-xl font-light">
                آثاري هي منارتك الرقمية للغوص في أعماق العمارة الإسلامية الخالدة، بلاغة لغة الضاد الساحرة، والآثار الشاهدة على حضارتنا الممتدة. نجمع لك ألمع الشيوخ والأكاديميين في واجهة عصرية ترقى لذوقك المعرفي.
              </p>

              <div className="flex flex-wrap gap-4 pt-4">
                <button
                  onClick={() => { setCategoryFilter(null); setActiveView('catalog'); }}
                  className="bg-[var(--color-brand-orange-700)] hover:bg-[var(--color-brand-orange-850)] text-amber-50 font-bold px-8 py-4 rounded-xl transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center gap-2"
                  id="hero-explore-btn"
                >
                  <span>تصفح مسارات العلوم</span>
                  <ChevronLeft className="w-5 h-5" />
                </button>
                
                <a
                  href="#how-it-works"
                  className="bg-[var(--color-brand-amber-100)] dark:bg-stone-850 hover:bg-[var(--color-brand-amber-200)] dark:hover:bg-stone-800 text-[var(--color-foreground)] font-bold px-8 py-4 rounded-xl transition-all border border-[var(--color-border)] flex items-center gap-2"
                  id="hero-info-btn"
                >
                  <Play className="w-4 h-4 fill-current text-[var(--color-brand-orange-700)]" />
                  <span>بروشور المنصة والتعريف</span>
                </a>
              </div>

              {/* Trusted Indicators */}
              <div className="pt-6 flex items-center gap-6 border-t border-[var(--color-border)] max-w-lg">
                <div>
                  <p className="text-2xl font-black text-[var(--color-brand-orange-700)]">+٩٨٪</p>
                  <p className="text-xs text-stone-600 dark:text-stone-400">نسبة رضا وانطباع الطلاب</p>
                </div>
                <div className="w-px h-10 bg-[var(--color-border)]" />
                <div>
                  <p className="text-2xl font-black text-teal-700 dark:text-teal-400">١٠٠٪</p>
                  <p className="text-xs text-stone-600 dark:text-stone-400">شهادات موثقة بالتحقيق المعتمد</p>
                </div>
                <div className="w-px h-10 bg-[var(--color-border)]" />
                <div>
                  <p className="text-2xl font-black text-[var(--color-foreground)]">مباشر</p>
                  <p className="text-xs text-stone-600 dark:text-stone-400">مجالس نقاش وبث تفاعلي مستمر</p>
                </div>
              </div>
            </div>

            {/* Left Side: Illustration Panel with modern frame + background */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-[420px] lg:max-w-none">
                
                {/* Visual back decoration */}
                <div className="absolute -top-6 -right-6 w-full h-full bg-[var(--color-brand-amber-200)]/80 rounded-3xl -rotate-3 z-0" />
                <div className="absolute -bottom-4 -left-4 w-full h-full bg-teal-50 dark:bg-teal-950/20 rounded-3xl rotate-2 z-0 opacity-80" />
                
                {/* Main Hero Card */}
                <div className="relative bg-[var(--color-card)] border border-[var(--color-border)] rounded-3xl p-4 shadow-xl z-10 overflow-hidden group">
                  <div className="relative h-96 sm:h-[450px] bg-[var(--color-muted)] rounded-2xl overflow-hidden shadow-inner flex flex-col justify-end">
                    
                    {/* Unsplash beautiful decorative architecture picture (Arabic dome representation) */}
                    <img 
                      src="https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800" 
                      alt="عمارة إسلامية وتصميم تراثي عريق" 
                      className="absolute inset-0 w-full h-full object-cover transform duration-700 ease-out group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-900/90 via-stone-900/40 to-transparent" />
                    
                    {/* Floating quote label */}
                    <div className="absolute top-4 right-4 bg-[var(--color-brand-orange-700)]/90 backdrop-blur-md text-amber-50 p-4 rounded-2xl max-w-[280px] border border-[var(--color-brand-orange-600)] shadow-lg" dir="rtl">
                      <p className="text-xs font-serif leading-relaxed italic">
                        "العِلْمُ صَيْدٌ وَالْكِتَابَةُ قَيْدُهُ، قَيِّدْ صُيُودَكَ بِالْحِبَالِ الْوَاثِقَةِ"
                      </p>
                      <span className="block text-[10px] text-[var(--color-brand-amber-200)] mt-2 text-left">— الإمام الشافعي</span>
                    </div>

                    {/* Student Counter Floating Block */}
                    <div className="absolute bottom-24 left-4 bg-[var(--color-card)]/95 backdrop-blur shadow-md py-2.5 px-4 rounded-xl flex items-center gap-3 border border-[var(--color-border)]">
                      <div className="flex -space-x-2 space-x-reverse">
                        <img className="w-8 h-8 rounded-full border-2 border-[var(--color-card)]" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50" alt="طالب" referrerPolicy="no-referrer" />
                        <img className="w-8 h-8 rounded-full border-2 border-[var(--color-card)]" src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=50" alt="طالب" referrerPolicy="no-referrer" />
                        <img className="w-8 h-8 rounded-full border-2 border-[var(--color-card)]" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50" alt="طالب" referrerPolicy="no-referrer" />
                      </div>
                      <p className="text-[10px] text-[var(--color-foreground)] font-bold leading-tight">
                        انضم للتو <br />
                        <span className="text-[var(--color-brand-orange-700)]">أكثر من ١٠ آلاف طالب</span>
                      </p>
                    </div>

                    {/* Glassy badge on the course banner */}
                    <div className="relative p-6 text-right text-amber-50">
                      <span className="inline-block bg-teal-700 text-teal-50 text-[10px] font-bold px-3 py-1 rounded-full mb-2">الدورة الأكثر رواجاً</span>
                      <h4 className="font-extrabold text-lg leading-snug">فلسفة وتاريخ النقوش وعلم الخط العربي العريق</h4>
                      <div className="flex items-center gap-2 mt-2 text-stone-300 text-xs">
                        <span>أ. معاذ السامرائي</span>
                        <span>•</span>
                        <span className="text-[var(--color-brand-amber-400)] font-semibold">٥.٠ ⭐</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-[var(--color-card)] py-12 border-y border-[var(--color-border)] relative z-20" id="stats-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 divide-y md:divide-y-0 md:divide-x md:divide-x-reverse divide-[var(--color-border)]">
            
            {/* Stat Item 1 */}
            <div className="text-center p-4">
              <div className="inline-flex p-3 bg-[var(--color-brand-orange-50)] rounded-2xl text-[var(--color-brand-orange-700)] mb-3">
                <Users className="w-6 h-6 stroke-[2]" />
              </div>
              <p className="block text-4xl font-extrabold text-[var(--color-foreground)]">+١٠,٠٠٠</p>
              <p className="text-xs text-stone-500 dark:text-stone-400 font-medium mt-1">طالب مسجل من شتى البلدان</p>
            </div>

            {/* Stat Item 2 */}
            <div className="text-center p-4">
              <div className="inline-flex p-3 bg-[var(--color-brand-amber-100)] dark:bg-[var(--color-brand-orange-50)]/30 rounded-2xl text-amber-700 dark:text-amber-500 mb-3">
                <BookOpenCheck className="w-6 h-6 stroke-[2]" />
              </div>
              <p className="block text-4xl font-extrabold text-[var(--color-foreground)]">+٥٠٠</p>
              <p className="text-xs text-stone-500 dark:text-stone-400 font-medium mt-1">ساعة دورة مسجلة وحيّة معتمدة</p>
            </div>

            {/* Stat Item 3 */}
            <div className="text-center p-4">
              <div className="inline-flex p-3 bg-teal-100 dark:bg-teal-950/30 rounded-2xl text-teal-700 dark:text-teal-400 mb-3">
                <Award className="w-6 h-6 stroke-[2]" />
              </div>
              <p className="block text-4xl font-extrabold text-[var(--color-foreground)]">+٥٠</p>
              <p className="text-xs text-stone-500 dark:text-stone-400 font-medium mt-1">مدرب خبير وأكاديمي مُحقّق</p>
            </div>

            {/* Stat Item 4 */}
            <div className="text-center p-4">
              <div className="inline-flex p-3 bg-stone-100 dark:bg-stone-800 rounded-2xl text-stone-700 dark:text-stone-300 mb-3">
                <Clock className="w-6 h-6 stroke-[2]" />
              </div>
              <p className="block text-4xl font-extrabold text-[var(--color-foreground)]">٢٤/٧</p>
              <p className="text-xs text-stone-500 dark:text-stone-400 font-medium mt-1">منتديات نقاش وأسئلة الطلاب الفورية</p>
            </div>

          </div>
        </div>
      </section>

      {/* Featured Categories Grid Section */}
      <section className="py-20 bg-[var(--color-beige-darker)]/40" id="categories-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--color-brand-orange-700)]">مسارات الهوية العربية والإسلامية</h2>
            <h3 className="text-3xl font-extrabold text-[var(--color-foreground)]">تصفح حسب فئات التراث والعلوم</h3>
            <p className="text-sm text-stone-600 dark:text-stone-400">
              اختر المسار التربوي والعلمي المناسب لك وابدأ رحلة استكشاف أسرار وفنون حضارتنا المورّدة
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {CATEGORIES.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.slug)}
                className="group relative bg-[var(--color-card)] hover:bg-[var(--color-secondary)]/10 text-right p-8 rounded-2xl border border-[var(--color-border)] shadow-sm hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-orange-700)] block w-full transform hover:-translate-y-1"
                id={`cat-card-${category.id}`}
              >
                {/* Decorative gold background on hover */}
                <span className="absolute top-0 right-0 h-1.5 w-0 bg-[var(--color-brand-orange-700)] group-hover:w-full transition-all duration-300 rounded-t-2xl" />
                
                <div className="inline-flex p-4 bg-[var(--color-brand-orange-50)] group-hover:bg-[var(--color-brand-amber-100)] transition-all rounded-2xl mb-6">
                  {getCategoryIcon(category.iconName)}
                </div>
                
                <h4 className="text-lg font-bold text-[var(--color-foreground)] group-hover:text-[var(--color-brand-orange-700)] transition-all">
                  {category.name}
                </h4>
                
                <p className="text-xs text-stone-500 dark:text-stone-400 font-light mt-2">
                  دبلوم مكثف ومناهج متكاملة تشمل {category.courseCount} دورة ومصنف.
                </p>

                <div className="mt-6 flex items-center justify-between text-xs font-semibold text-[var(--color-brand-orange-700)]">
                  <span>تصفح المسار الآن</span>
                  <ChevronLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-all" />
                </div>
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* Featured Courses Grid Section */}
      <section className="py-24 bg-gradient-to-b from-[var(--color-background)] to-[var(--color-beige-darker)]/20" id="featured-courses">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-16 gap-4">
            <div className="text-right space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">مختارات هذا الموسم الأكاديمي</span>
              <h2 className="text-3xl font-extrabold text-[var(--color-foreground)]">سجل في أكثر دوراتنا مبيعاً</h2>
              <p className="text-sm text-stone-600 dark:text-stone-400">
                برامج ممتازة مصممة لتأهيل الطلاب معرفياً وعلمياً من الصفر حتى مرحلة التحقيق والإيجاز.
              </p>
            </div>
            
            <button
              onClick={() => { setCategoryFilter(null); setActiveView('catalog'); }}
              className="bg-[var(--color-card)] hover:bg-[var(--color-secondary)]/10 text-[var(--color-foreground)] border border-[var(--color-border)] font-bold px-6 py-3 rounded-xl transition-all shadow-sm flex items-center gap-2 self-start sm:self-auto"
            >
              <span>رؤية كل الدورات المدرجة</span>
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>

          {/* Courses grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCourses.map((course) => {
              const inCart = cartItems.some(i => i.id === course.id);
              return (
                <div 
                  key={course.id}
                  className="bg-[var(--color-card)] rounded-3xl overflow-hidden border border-[var(--color-border)] shadow-md hover:shadow-xl transition-all duration-300 flex flex-col group h-full"
                  id={`course-card-${course.id}`}
                >
                  
                  {/* Thumbnail */}
                  <div 
                    onClick={() => onViewCourseDetails(course.id)}
                    className="relative h-56 overflow-hidden cursor-pointer"
                  >
                    <img 
                      src={course.thumbnail} 
                      alt={course.title}
                      className="w-full h-full object-cover transform duration-500 ease-out group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 to-transparent" />
                    
                    {/* Category Badge */}
                    <span className="absolute top-4 right-4 bg-orange-700 text-amber-50 text-[10px] font-bold px-3 py-1.5 rounded-full shadow-md">
                      {course.category}
                    </span>
                    
                    {/* Duration badge */}
                    <span className="absolute bottom-4 right-4 text-xs font-medium text-amber-100 bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-lg">
                      {course.duration}
                    </span>
                  </div>

                  {/* Body Info */}
                  <div className="p-6 flex-1 flex flex-col justify-between text-right">
                    
                    <div>
                      {/* Instructor and rating row */}
                      <div className="flex items-center justify-between mb-3 text-xs text-stone-500 dark:text-stone-400">
                        <div className="flex items-center gap-2">
                          <img 
                            src={course.instructorAvatar} 
                            alt={course.instructorName}
                            className="w-6 h-6 rounded-full border border-[var(--color-border)]"
                            referrerPolicy="no-referrer"
                          />
                          <span className="font-semibold text-[var(--color-foreground)]">{course.instructorName}</span>
                        </div>
                        <div className="flex items-center gap-1 text-amber-600 font-bold">
                          <span>{course.rating.toFixed(1)}</span>
                          <Star className="w-3.5 h-3.5 fill-current" />
                        </div>
                      </div>

                      {/* Title */}
                      <h3 
                        onClick={() => onViewCourseDetails(course.id)}
                        className="font-bold text-[var(--color-foreground)] text-base sm:text-base leading-snug line-clamp-2 hover:text-[var(--color-brand-orange-700)] transition-all cursor-pointer"
                      >
                        {course.title}
                      </h3>

                      {/* Stat summary */}
                      <p className="text-[11px] text-stone-550 dark:text-stone-400 mt-2 flex items-center gap-2">
                        <span>{course.lessonsCount} درساً فصلياً</span>
                        <span>•</span>
                        <span>{course.studentsCount.toLocaleString()} طالباً متعلم</span>
                      </p>
                    </div>

                    {/* Pricing and Cart add row */}
                    <div className="pt-5 mt-6 border-t border-[var(--color-border)] flex items-center justify-between">
                      <div className="text-right">
                        <span className="text-[10px] block text-stone-500 dark:text-stone-400">الاستثمار المقابل</span>
                        {course.price === 0 ? (
                          <span className="text-xl font-black text-teal-700 dark:text-teal-400">مجاناً بالكامل</span>
                        ) : (
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-xl font-black text-[var(--color-brand-orange-700)]">{course.price} ر.س</span>
                            {course.originalPrice && (
                              <span className="text-xs text-stone-400 line-through">{course.originalPrice} ر.س</span>
                            )}
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => handleAddToCartLocal(course)}
                        disabled={inCart}
                        className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 ${
                          inCart 
                            ? 'bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400 cursor-not-allowed border border-[var(--color-border)]'
                            : 'bg-[var(--color-brand-orange-700)] hover:bg-[var(--color-brand-orange-850)] text-amber-50 shadow-md hover:shadow-lg'
                        }`}
                        id={`add-to-cart-landing-${course.id}`}
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>{inCart ? 'تم الإضافة' : 'أضف للسلة'}</span>
                      </button>
                    </div>

                  </div>

                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* Interactive Workflow "كيف نعمل؟" Section */}
      <section className="py-24 bg-[var(--color-beige-darker)]/25 border-t border-[var(--color-border)]" id="how-it-works">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
            <span className="text-xs font-bold text-[var(--color-brand-orange-700)]">دليل مسارك التعليمي التفاعلي</span>
            <h2 className="text-3xl font-extrabold text-[var(--color-foreground)]">من التسجيل إلى نيل إجازة المعرِفة</h2>
            <p className="text-sm text-stone-600 dark:text-stone-400">
              خطوات يسيرة صُممت بعناية لتضمن الفهم والتحقيق والتحصين المفاهيمي للعلوم الشريفة
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative">
            
            {/* Visual connector lines for desktop */}
            <div className="hidden md:block absolute top-16 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-orange-300 via-amber-300 to-teal-300 z-0 opacity-40" />

            {/* Step 1 */}
            <div className="relative bg-[var(--color-card)] p-8 rounded-2xl border border-[var(--color-border)] text-center z-10 shadow-sm hover:shadow-md transition-all">
              <span className="absolute -top-5 right-1/2 translate-x-1/2 w-10 h-10 bg-[var(--color-brand-orange-700)] rounded-full text-amber-50 font-bold flex items-center justify-center border-4 border-[var(--color-card)] shadow-md">١</span>
              <div className="w-16 h-16 mx-auto bg-[var(--color-brand-orange-50)] text-[var(--color-brand-orange-700)] rounded-2xl flex items-center justify-center mb-6">
                <BookOpen className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-[var(--color-foreground)]">اختر منبر دراستك</h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed mt-2.5">
                تصفح الكتالوج الشامل والمسارات المعتمدة، حدد دوراتك ثم قم بتأكيد اشتراكك الآمن.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative bg-[var(--color-card)] p-8 rounded-2xl border border-[var(--color-border)] text-center z-10 shadow-sm hover:shadow-md transition-all">
              <span className="absolute -top-5 right-1/2 translate-x-1/2 w-10 h-10 bg-[var(--color-brand-amber-500)] rounded-full text-amber-50 font-bold flex items-center justify-center border-4 border-[var(--color-card)] shadow-md">٢</span>
              <div className="w-16 h-16 mx-auto bg-[var(--color-brand-amber-100)] dark:bg-[var(--color-brand-orange-50)]/30 text-amber-700 dark:text-amber-500 rounded-2xl flex items-center justify-center mb-6">
                <Play className="w-8 h-8 fill-current text-amber-700 dark:text-amber-500" />
              </div>
              <h3 className="text-lg font-bold text-[var(--color-foreground)]">حضور المجالس والنقاش</h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed mt-2.5">
                تدرج في المقاطع والفصول، واحرص على المشاركة الفعالة في جلسات النقاش المباشرة مع المدرب والزملاء.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative bg-[var(--color-card)] p-8 rounded-2xl border border-[var(--color-border)] text-center z-10 shadow-sm hover:shadow-md transition-all">
              <span className="absolute -top-5 right-1/2 translate-x-1/2 w-10 h-10 bg-teal-700 rounded-full text-amber-50 font-bold flex items-center justify-center border-4 border-[var(--color-card)] shadow-md">٣</span>
              <div className="w-16 h-16 mx-auto bg-teal-50 dark:bg-teal-950/20 text-teal-700 dark:text-teal-400 rounded-2xl flex items-center justify-center mb-6">
                <Award className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-[var(--color-foreground)]">الامتحان العملي والإيجاز</h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed mt-2.5">
                أنجز المتطلبات البحثية بنجاح لتنال شهادتك الرمزية المعزاة بالختم الرقمي والتوقيع الحصري لمدربك.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* App testimonial quotes section */}
      <section className="py-24 bg-[var(--color-background)] border-t border-[var(--color-border)]" id="testimonials">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <span className="text-xs font-bold text-teal-700 dark:text-teal-400">شركاء النجاح وأصداء المنصة</span>
            <h2 className="text-3xl font-extrabold text-[var(--color-foreground)]">ماذا قال طلابنا عن آثاري؟</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Review Card 1 */}
            <div className="bg-[var(--color-card)] p-8 rounded-3xl border border-[var(--color-border)] flex flex-col justify-between" dir="rtl">
              <p className="text-stone-700 dark:text-stone-300 text-sm leading-relaxed italic">
                "كان حلمي دائماً فهم وتدبر تاريخ عمارة المساجد التراثية بأسلوب علمي رصين لا مجرد مشاهدة صور. دورات منصة آثاري رائعة وسلسة ومليئة بالدروس المفصلة والمعلومات الدقيقة."
              </p>
              <div className="flex items-center gap-3 mt-6">
                <img className="w-10 h-10 rounded-full border border-[var(--color-border)]" src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100" alt="طالبة" referrerPolicy="no-referrer" />
                <div>
                  <h4 className="font-bold text-[var(--color-foreground)] text-sm">سارة الهذلي</h4>
                  <p className="text-[10px] text-stone-500 dark:text-stone-400">خريجة فنون إسلامية، ومصممة ديكور داخلي</p>
                </div>
              </div>
            </div>

            {/* Review Card 2 */}
            <div className="bg-[var(--color-card)] p-8 rounded-3xl border border-[var(--color-border)] flex flex-col justify-between" dir="rtl">
              <p className="text-stone-700 dark:text-stone-300 text-sm leading-relaxed italic">
                "بصفتي مهندساً ومحباً للتراث، أبهرتني الجودة العالية للمادة العلمية. دورة الخط الديواني مع الأستاذ معاذ من أكثر البرامج نضجاً وتنظيماً على الإنترنت العربي بالكامل."
              </p>
              <div className="flex items-center gap-3 mt-6">
                <img className="w-10 h-10 rounded-full border border-[var(--color-border)]" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100" alt="مهندس" referrerPolicy="no-referrer" />
                <div>
                  <h4 className="font-bold text-[var(--color-foreground)] text-sm">م. فيصل الشهري</h4>
                  <p className="text-[10px] text-stone-500 dark:text-stone-400">مهندس معماري ومخطط تراث وطني مسجل</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
