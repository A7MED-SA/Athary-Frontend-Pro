import { useState, useEffect, FormEvent } from 'react';
import { COURSES, CATEGORIES } from '../data';
import { Course, ViewType } from '../types';
import { 
  Search, 
  RotateCcw, 
  Star, 
  ChevronDown, 
  ChevronUp, 
  ShoppingBag, 
  AlertTriangle, 
  Filter, 
  X, 
  GraduationCap,
  MessageSquare,
  ThumbsUp,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CourseCatalogProps {
  initialCategoryFilter: string | null;
  onAddToCart: (course: Course) => void;
  cartItems: Course[];
  onViewCourseDetails: (id: string) => void;
  onViewInstructorProfile?: (name: string) => void;
}

export default function CourseCatalog({
  initialCategoryFilter,
  onAddToCart,
  cartItems,
  onViewCourseDetails,
  onViewInstructorProfile
}: CourseCatalogProps) {
  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [priceFilter, setPriceFilter] = useState<string>('all'); // 'all', 'free', 'paid'
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>('featured'); // 'featured', 'rating', 'price-asc', 'price-desc'

  // Sidebar Accordion states
  const [categoryOpen, setCategoryOpen] = useState(true);
  const [levelOpen, setLevelOpen] = useState(true);
  const [priceOpen, setPriceOpen] = useState(true);
  const [ratingOpen, setRatingOpen] = useState(true);

  // Mobile Filter Dialog state
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Success indicator for adding course
  const [addedCourseId, setAddedCourseId] = useState<string | null>(null);

  // Reviews & Rating System State (Arabic custom reviews seed)
  const [reviews, setReviews] = useState<any[]>([
    {
      id: 'rev_1',
      courseId: 'course_1',
      userName: 'د. عبد الله اليوسف',
      rating: 5,
      comment: 'مادة فريدة من نوعها! الشرح المتصل بالعقود والنقوش الإسلامية في الأندلس فتح لي آفاقاً واسعة في فهم عظمة الموروث الهندسي للمسلمين.',
      date: 'منذ ٣ أيام',
      helpfulCount: 14,
      helpfulUsers: []
    },
    {
      id: 'rev_2',
      courseId: 'course_1',
      userName: 'منى القحطاني',
      rating: 4,
      comment: 'الشرح المعماري مدعم بأجهزة مرئية رائعة، كراسة التصميم المرفقة في غاية الروعة والوضوح. شكراً جزيلاً لجهود المعلم والمنصة.',
      date: 'منذ أسبوع',
      helpfulCount: 6,
      helpfulUsers: []
    },
    {
      id: 'rev_3',
      courseId: 'course_2',
      userName: 'سليمان الفوزان',
      rating: 5,
      comment: 'سرد تاريخي رائع ومستند إلى وثائق إسناد متصلة. الدكتورة ليلى تلقي المحاضرة بأسلوب مشوق يجبرك على المتابعة.',
      date: 'منذ يومين',
      helpfulCount: 9,
      helpfulUsers: []
    },
    {
      id: 'rev_4',
      courseId: 'course_3',
      userName: 'الأستاذ أنس المدني',
      rating: 5,
      comment: 'أفضل مقرر مجاني في علم البلاغة العربية! القواعد الفنية والجمالية مشروحة بتفصيل ومقارنات ممتعة وجليلة النفع.',
      date: 'منذ ٤ أيام',
      helpfulCount: 22,
      helpfulUsers: []
    }
  ]);

  const [selectedCourseForReview, setSelectedCourseForReview] = useState<Course | null>(null);
  
  // review form state inside modal
  const [newReviewName, setNewReviewName] = useState('أحمد التميمي'); // default
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState('');
  const [reviewRatingHover, setReviewRatingHover] = useState(0);

  const calcAverageRating = (courseId: string, defaultRating: number) => {
    const courseRevs = reviews.filter(r => r.courseId === courseId);
    if (courseRevs.length === 0) return defaultRating.toFixed(1);
    const sum = courseRevs.reduce((acc, curr) => acc + curr.rating, 0);
    return (sum / courseRevs.length).toFixed(1);
  };

  const handleAddReviewSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!newReviewComment.trim()) return;
    
    const newRev = {
      id: `rev_${Date.now()}`,
      courseId: selectedCourseForReview?.id || '',
      userName: newReviewName.trim() || 'طالب مجهول',
      rating: newReviewRating,
      comment: newReviewComment.trim(),
      date: 'الآن',
      helpfulCount: 0,
      helpfulUsers: []
    };

    setReviews([newRev, ...reviews]);
    setNewReviewComment('');
    setNewReviewRating(5);
  };

  const handleUpvoteReview = (reviewId: string) => {
    setReviews(prev => prev.map(r => {
      if (r.id === reviewId) {
        return { ...r, helpfulCount: r.helpfulCount + 1 };
      }
      return r;
    }));
  };

  // Animation variants for course card stagger
  const cardVariants: any = {
    hidden: { opacity: 0, scale: 0.98, y: 12 },
    visible: (index: number) => ({
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        delay: Math.min(index * 0.05, 0.4),
        duration: 0.35,
        ease: 'easeOut'
      }
    })
  };

  // Initialize initial category filter if passed from landing page
  useEffect(() => {
    if (initialCategoryFilter) {
      // Find category name/slug from initialCategoryFilter
      const cat = CATEGORIES.find(c => c.slug === initialCategoryFilter);
      if (cat) {
        setSelectedCategories([cat.name]);
      }
    }
  }, [initialCategoryFilter]);

  // Handle Reset Filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategories([]);
    setSelectedLevels([]);
    setPriceFilter('all');
    setMinRating(0);
    setSortBy('featured');
  };

  // Helper arrays for level and rating values
  const LEVEL_LABELS = ['مبتدئ', 'متوسط', 'متقدم'];
  const RATING_STEPS = [
    { value: 4.8, label: '٤.٨ نجوم فأكثر ⭐' },
    { value: 4.5, label: '٤.٥ نجوم فأكثر ⭐' },
    { value: 4.0, label: '٤.٠ نجوم فأكثر ⭐' },
  ];

  // Filtering Logic
  const filteredCourses = COURSES.filter((course) => {
    // 1. Search Query Search check (Course title, instructor name, category)
    const matchesSearch = 
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.instructorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.category.toLowerCase().includes(searchQuery.toLowerCase());

    // 2. Category Checkbox Check
    const matchesCategory = 
      selectedCategories.length === 0 || 
      selectedCategories.includes(course.category);

    // 3. Level Check (we simulate the level of courses from course duration/lessons for high fidelity)
    // For simplicity, let's look at lesson count: metadata or custom lookup.
    // Course 1, 5, 7 are advanced, 2, 4 are medium, 3, 6 are beginner
    let courseLevel = 'مبتدئ';
    if (course.id === 'course_1' || course.id === 'course_5') {
      courseLevel = 'متقدم';
    } else if (course.id === 'course_2' || course.id === 'course_4') {
      courseLevel = 'متوسط';
    } else {
      courseLevel = 'مبتدئ';
    }

    const matchesLevel = 
      selectedLevels.length === 0 || 
      selectedLevels.includes(courseLevel);

    // 4. Price Check
    const isFree = course.price === 0;
    const matchesPrice = 
      priceFilter === 'all' ||
      (priceFilter === 'free' && isFree) ||
      (priceFilter === 'paid' && !isFree);

    // 5. Rating Check
    const matchesRating = course.rating >= minRating;

    return matchesSearch && matchesCategory && matchesLevel && matchesPrice && matchesRating;
  });

  // Sorting Logic
  const sortedCourses = [...filteredCourses].sort((a, b) => {
    if (sortBy === 'rating') {
      return b.rating - a.rating;
    }
    if (sortBy === 'price-asc') {
      return a.price - b.price;
    }
    if (sortBy === 'price-desc') {
      return b.price - a.price;
    }
    // Default features
    return a.featured === b.featured ? b.studentsCount - a.studentsCount : (a.featured ? -1 : 1);
  });

  const handleToggleCategory = (categoryName: string) => {
    if (selectedCategories.includes(categoryName)) {
      setSelectedCategories(selectedCategories.filter(c => c !== categoryName));
    } else {
      setSelectedCategories([...selectedCategories, categoryName]);
    }
  };

  const handleToggleLevel = (levelName: string) => {
    if (selectedLevels.includes(levelName)) {
      setSelectedLevels(selectedLevels.filter(l => l !== levelName));
    } else {
      setSelectedLevels([...selectedLevels, levelName]);
    }
  };

  const handleAddToCartLocal = (course: Course) => {
    onAddToCart(course);
    setAddedCourseId(course.id);
    setTimeout(() => {
      setAddedCourseId(null);
    }, 2500);
  };

  return (
    <div className="bg-amber-50/40 min-h-screen py-10 px-4 sm:px-6 lg:px-8 font-sans" dir="rtl" id="athary-catalog-page">
      <div className="max-w-7xl mx-auto">
        
        {/* Banner Section */}
        <div className="relative mb-10 overflow-hidden bg-gradient-to-l from-orange-700 to-amber-700 text-amber-50 rounded-3xl p-8 sm:p-12 shadow-md">
          <div className="absolute inset-0 bg-heritage-pattern opacity-10 pointer-events-none" />
          <div className="relative z-10 max-w-xl space-y-3">
            <h1 className="text-3xl sm:text-4xl font-black">البوابة الكبرى للعلوم التراثية</h1>
            <p className="text-sm sm:text-base text-amber-100 font-light leading-relaxed">
              تصفح دبلومات ومقررات آثاري المدققة، وحدد رغباتك المناسبة لتصقل معارفك التراثية وفق مناهج متصلة الإسناد مدعومة بأجهزة شرح رقمية معاصرة.
            </p>
          </div>
        </div>

        {/* Catalog Main Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Right Column: Filters Sidebar (Hidden on mobile modal) */}
          <aside className="hidden lg:block space-y-6" id="filters-sidebar-desktop">
            
            {/* Filter Main Header Card */}
            <div className="bg-white rounded-2xl border border-amber-200/80 p-5 shadow-sm space-y-5">
              
              <div className="flex items-center justify-between pb-3 border-b border-amber-100">
                <span className="flex items-center gap-2 font-bold text-stone-900 text-sm">
                  <Filter className="w-4 h-4 text-orange-700" />
                  <span>تصفية ومعاينة النتائج</span>
                </span>
                
                <button 
                  onClick={handleResetFilters}
                  className="text-xs text-stone-500 hover:text-orange-700 flex items-center gap-1 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>إعادة ضبط</span>
                </button>
              </div>

              {/* Search Bar Input */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="ابحث باسم الدورة أو المعلم..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-stone-50 text-stone-900 placeholder-stone-400 text-xs py-3 pr-10 pl-4 rounded-xl border border-amber-200 focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent text-right"
                />
                <Search className="w-4 h-4 text-amber-600 absolute top-3.5 right-3.5" />
              </div>

              {/* Accordion Group 1: Category */}
              <div className="border-t border-amber-100/60 pt-4">
                <button
                  onClick={() => setCategoryOpen(!categoryOpen)}
                  className="w-full flex items-center justify-between text-right text-xs font-bold text-stone-800 pb-2.5 focus:outline-none"
                >
                  <span>الفئة والموضوع</span>
                  {categoryOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                
                {categoryOpen && (
                  <div className="space-y-2 mt-2 max-h-56 overflow-y-auto pr-1">
                    {CATEGORIES.map((cat) => (
                      <label key={cat.id} className="flex items-center gap-2.5 cursor-pointer select-none text-xs text-stone-700 hover:text-orange-700 transition" id={`label-filter-${cat.id}`}>
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(cat.name)}
                          onChange={() => handleToggleCategory(cat.name)}
                          className="accent-orange-700 h-4 w-4 rounded border-amber-300 text-orange-700 focus:ring-orange-500"
                        />
                        <span>{cat.name}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Accordion Group 2: Levels */}
              <div className="border-t border-amber-100/60 pt-4">
                <button
                  onClick={() => setLevelOpen(!levelOpen)}
                  className="w-full flex items-center justify-between text-right text-xs font-bold text-stone-800 pb-2.5 focus:outline-none"
                >
                  <span>المستوى المستهدف</span>
                  {levelOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {levelOpen && (
                  <div className="space-y-2 mt-2">
                    {LEVEL_LABELS.map((lvl) => (
                      <label key={lvl} className="flex items-center gap-2.5 cursor-pointer select-none text-xs text-stone-700 hover:text-orange-700 transition">
                        <input
                          type="checkbox"
                          checked={selectedLevels.includes(lvl)}
                          onChange={() => handleToggleLevel(lvl)}
                          className="accent-orange-700 h-4 w-4 rounded border-amber-300 text-orange-750 focus:ring-orange-500"
                        />
                        <span>{lvl}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Accordion Group 3: Price model */}
              <div className="border-t border-amber-100/60 pt-4">
                <button
                  onClick={() => setPriceOpen(!priceOpen)}
                  className="w-full flex items-center justify-between text-right text-xs font-bold text-stone-800 pb-2.5 focus:outline-none"
                >
                  <span>نموذج السعر</span>
                  {priceOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {priceOpen && (
                  <div className="space-y-2 mt-2">
                    {[
                      { value: 'all', label: 'الكل' },
                      { value: 'free', label: 'مجانية بالكامل' },
                      { value: 'paid', label: 'مدفوعة بالهامش' }
                    ].map((mode) => (
                      <label key={mode.value} className="flex items-center gap-2.5 cursor-pointer select-none text-xs text-stone-700 hover:text-orange-700 transition">
                        <input
                          type="radio"
                          name="price-tier"
                          checked={priceFilter === mode.value}
                          onChange={() => setPriceFilter(mode.value)}
                          className="accent-orange-700 h-4 w-4 text-orange-700 focus:ring-orange-500 border-amber-300"
                        />
                        <span>{mode.label}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Accordion Group 4: Student rating */}
              <div className="border-t border-amber-100/60 pt-4">
                <button
                  onClick={() => setRatingOpen(!ratingOpen)}
                  className="w-full flex items-center justify-between text-right text-xs font-bold text-stone-800 pb-2.5 focus:outline-none"
                >
                  <span>تقييم الطلاب الدارسين</span>
                  {ratingOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {ratingOpen && (
                  <div className="space-y-2.5 mt-2">
                    <label className="flex items-center gap-2.5 cursor-pointer text-xs text-stone-700">
                      <input
                        type="radio"
                        name="rating-star"
                        checked={minRating === 0}
                        onChange={() => setMinRating(0)}
                        className="accent-orange-700 h-4 w-4"
                      />
                      <span>عرض الكل</span>
                    </label>
                    
                    {RATING_STEPS.map((step) => (
                      <label key={step.value} className="flex items-center gap-2.5 cursor-pointer text-xs text-stone-700">
                        <input
                          type="radio"
                          name="rating-star"
                          checked={minRating === step.value}
                          onChange={() => setMinRating(step.value)}
                          className="accent-orange-700 h-4 w-4"
                        />
                        <span>{step.label}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

            </div>

            {/* Side Callout Coupon Banner */}
            <div className="bg-orange-700 text-amber-50 rounded-2xl p-5 shadow-sm text-right relative overflow-hidden">
              <div className="absolute inset-x-0 bottom-0 bg-heritage-pattern opacity-[0.08] h-full" />
              <p className="text-[10px] font-bold text-amber-300 tracking-wide uppercase">كوبون التراث الأول</p>
              <h4 className="text-sm font-bold mt-2">وفر ٢٠٪ على الدورة القادمة</h4>
              <p className="text-[11px] text-amber-100/80 leading-relaxed mt-1">امسح أو استخدم الرمز <span className="font-mono bg-orange-850 px-1 py-0.5 rounded text-amber-200">ATHAR20</span> عند إعطاء الدفوعات.</p>
            </div>

          </aside>

          {/* Left Column: Course Grid, sorting and filters for mobile */}
          <main className="lg:col-span-3 space-y-6" id="catalog-main-grid-left">
            
            {/* Real-time High Visibility Search Bar & Level Dropdown Filter */}
            <div className="bg-white rounded-2xl border border-amber-200/80 p-5 shadow-sm space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Search query input */}
                <div className="md:col-span-2 space-y-2">
                  <span className="block text-xs font-bold text-stone-850 text-right">
                    البحث الفوري والذكي عن المقررات والفضلاء:
                  </span>
                  <div className="relative">
                    <input
                      id="catalog-realtime-search-input"
                      type="text"
                      placeholder="اكتب عنوان الدورة أو اسم الأستاذ المحاضر (مثال: البغدادي، الحربي، البلاغة)..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-stone-50 text-stone-900 dark:bg-stone-950 placeholder-stone-400 text-xs sm:text-sm py-3 px-11 pl-4 rounded-xl border border-amber-200 focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent text-right font-sans"
                    />
                    <Search className="w-5 h-5 text-orange-700 absolute top-3.5 right-4 pointer-events-none" />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="absolute left-3.5 top-3.5 text-stone-400 hover:text-stone-700 font-bold text-xs p-1 cursor-pointer bg-transparent border-0"
                        title="مسح البحث"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Level Dropdown selector list */}
                <div className="space-y-2">
                  <span className="block text-xs font-bold text-stone-850 text-right">
                    تصفية المستوى الدراسي للدورة:
                  </span>
                  <div className="relative">
                    <select
                      id="catalog-level-select"
                      value={selectedLevels.length === 1 ? selectedLevels[0] : 'all'}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === 'all') {
                          setSelectedLevels([]);
                        } else {
                          setSelectedLevels([val]);
                        }
                      }}
                      className="w-full bg-stone-50 text-stone-900 dark:bg-stone-950 text-xs sm:text-sm py-3 px-4 rounded-xl border border-amber-200 focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent text-right font-sans appearance-none cursor-pointer"
                    >
                      <option value="all">جميع المستويات الدراسية (الكل)</option>
                      <option value="مبتدئ">مستوى مبتدئ (صغار الطلبة)</option>
                      <option value="متوسط">مستوى متوسط (متوسط الأهلية)</option>
                      <option value="متقدم">مستوى متقدم (العلماء والأسانيد)</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-orange-700 absolute left-4 top-3.5 pointer-events-none" />
                  </div>
                </div>

              </div>

              {/* Active search or level filters display info */}
              {(searchQuery || selectedLevels.length > 0) && (
                <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-stone-100 text-xs text-stone-605">
                  <span className="font-semibold text-right text-stone-800">
                    نشط الآن: {filteredCourses.length} دورة مطابقة للفلاتر الحالية.
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedLevels([]);
                    }}
                    className="text-xs text-orange-700 hover:text-orange-900 underline font-bold cursor-pointer bg-transparent border-0 p-0"
                  >
                    إعادة تعيين مرشحات البحث والمستوى ↺
                  </button>
                </div>
              )}
            </div>

            {/* Header controls inside catalog */}
            <div className="bg-white rounded-2xl border border-amber-200/80 p-5 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-sm text-right">
              
              <div>
                <span className="text-xs text-stone-500 font-semibold block">المجال الأكاديمي</span>
                <span className="text-lg font-bold text-stone-900 mt-1 block">
                  جميع المقررات المفتوحة ({filteredCourses.length} دورة مطابقة)
                </span>
              </div>

              {/* Sorting tools */}
              <div className="flex gap-3 items-center w-full sm:w-auto">
                <span className="text-xs text-stone-500 shrink-0">ترتيب حسب:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full sm:w-44 bg-stone-50 text-stone-850 text-xs font-semibold py-2.5 px-3.5 border border-amber-100 rounded-xl focus:outline-none focus:ring-1 focus:ring-orange-600 text-right"
                  id="sort-select-catalog"
                >
                  <option value="featured">الأكثر قيمة ورواجاً</option>
                  <option value="rating">الأعلى تقييماً للرواد</option>
                  <option value="price-asc">السعر: من الأقل للأعلى</option>
                  <option value="price-desc">السعر: من الأعلى للأقل</option>
                </select>

                {/* Mobile Filters Toggle Button */}
                <button
                  onClick={() => setMobileFiltersOpen(true)}
                  className="lg:hidden flex items-center justify-center p-2.5 border border-amber-205 border-amber-200 hover:bg-orange-50 rounded-xl transition text-stone-700"
                  title="تصفية"
                  id="mobile-filter-trigger"
                >
                  <Filter className="w-5 h-5" />
                </button>

              </div>

            </div>

            {/* Empty view state checks */}
            {sortedCourses.length === 0 ? (
              <div className="bg-white rounded-2xl border border-amber-200 p-12 text-center text-stone-700 py-16 space-y-4 shadow-sm" id="empty-results">
                <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto animate-bounce" />
                <h3 className="text-lg font-semibold text-stone-900">عذراً، لم نعثر على أي دورات مطابقة</h3>
                <p className="text-xs text-stone-500 max-w-sm mx-auto leading-relaxed">
                  حاول تغيير معايير التصفية، أو البحث بكلمات أخرى للحصول على نتائج، أو إعادة تعيين الفلاتر بالكامل.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="bg-orange-700 hover:bg-orange-850 text-amber-50 text-xs font-bold px-6 py-2.5 rounded-xl transition-all cursor-pointer border-0"
                  id="empty-reset-btn"
                >
                  مسح الفلاتر وإعادة المحاولة
                </button>
              </div>
            ) : (
              /* Catalog Grid of active course cards */
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {sortedCourses.map((course, idx) => {
                  const inCart = cartItems.some(i => i.id === course.id);
                  const isAdded = addedCourseId === course.id;

                  return (
                    <motion.article 
                      key={course.id}
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      custom={idx}
                      className="bg-white rounded-2xl overflow-hidden border border-amber-200/50 shadow-sm hover:shadow-md hover:border-amber-300 transition-all duration-300 flex flex-col group h-full"
                      id={`course-card-catalog-${course.id}`}
                    >
                      
                      {/* Image Thumbnail with soft orange warm overlay */}
                      <div 
                        onClick={() => onViewCourseDetails(course.id)}
                        className="relative h-48 overflow-hidden cursor-pointer"
                      >
                        <img 
                          src={course.thumbnail} 
                          alt={course.title}
                          className="w-full h-full object-cover transform duration-500 group-hover:scale-105"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-orange-700/5 group-hover:bg-transparent transition-all pointer-events-none" />
                        
                        {/* Category Badge */}
                        <span className="absolute top-3.5 right-3.5 bg-orange-700 text-amber-50 text-[10px] font-bold px-3 py-1.5 rounded-full shadow-sm">
                          {course.category}
                        </span>

                        {/* Duration banner badge */}
                        <span className="absolute bottom-3 right-3 text-[10px] font-medium text-amber-100 bg-black/55 px-2 py-1 rounded-md">
                          {course.duration}
                        </span>
                      </div>

                      {/* Content block */}
                      <div className="p-5 flex-1 flex flex-col justify-between text-right">
                        
                        <div>
                          {/* Instructor name & avatar */}
                          <div className="flex items-center justify-between mb-2.5 text-xs">
                            <button
                              type="button"
                              onClick={() => onViewInstructorProfile && onViewInstructorProfile(course.instructorName)}
                              className="flex items-center gap-1.5 text-stone-700 hover:text-orange-850 font-medium font-sans bg-transparent border-0 cursor-pointer p-0 focus:outline-none"
                              title={`عرض الملف الشخصي لـ ${course.instructorName}`}
                            >
                              <img 
                                src={course.instructorAvatar} 
                                alt={course.instructorName}
                                className="w-5 h-5 rounded-full object-cover border border-amber-150"
                                referrerPolicy="no-referrer"
                              />
                              <span className="text-[11px] font-bold truncate max-w-[120px]">{course.instructorName}</span>
                            </button>
                            
                            <button
                              onClick={() => setSelectedCourseForReview(course)}
                              className="flex items-center gap-1 bg-amber-50 hover:bg-amber-100 py-1 px-2.5 rounded-lg text-amber-700 font-black transition-colors focus:outline-none cursor-pointer border-0"
                              title="عرض مراجعات الطلاب"
                            >
                              <span>{calcAverageRating(course.id, course.rating)}</span>
                              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                            </button>
                          </div>

                          {/* Level indicator / students */}
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-[9px] bg-amber-100 text-amber-850 font-bold px-2 py-0.5 rounded">
                              {course.id === 'course_1' || course.id === 'course_5' ? 'متقدم' : course.id === 'course_2' || course.id === 'course_4' ? 'متوسط' : 'مبتدئ'}
                            </span>
                            <span className="text-[10px] text-stone-400">|</span>
                            <span className="text-[10px] text-stone-500">{course.lessonsCount} درساً تدريبياً</span>
                          </div>

                          {/* Title - maximum 2 lines */}
                          <h3 
                            onClick={() => onViewCourseDetails(course.id)}
                            className="font-bold text-stone-900 text-sm sm:text-sm leading-snug line-clamp-2 group-hover:text-orange-700 transition duration-150 cursor-pointer"
                          >
                            {course.title}
                          </h3>

                          {/* Interactive student feedback button inline */}
                          <div className="mt-3.5 bg-stone-50/50 hover:bg-orange-50/20 rounded-xl p-2.5 border border-amber-100/50 flex items-center justify-between transition-all">
                            <button
                              onClick={() => setSelectedCourseForReview(course)}
                              className="text-[10px] sm:text-[11px] font-bold text-orange-700 hover:text-orange-900 flex items-center gap-1 underline transition-all focus:outline-none cursor-pointer border-0"
                            >
                              <MessageSquare className="w-3.5 h-3.5 text-orange-700" />
                              <span>{reviews.filter(r => r.courseId === course.id).length ? `تعليقات الطلاب (${reviews.filter(r => r.courseId === course.id).length})` : 'اكتب مراجعة الدورة ✍️'}</span>
                            </button>
                            <span className="text-[9px] text-stone-400 font-sans">معتمد بآثاري</span>
                          </div>
                        </div>

                        {/* Price footer and call to action block */}
                        <div className="pt-4 mt-5 border-t border-amber-50 flex items-center justify-between">
                          
                          <div className="text-right">
                            <span className="text-[9px] block text-stone-400">رسوم التسجيل</span>
                            {course.price === 0 ? (
                              <span className="text-base font-black text-teal-700">مجاناً للجميع</span>
                            ) : (
                              <div className="flex items-baseline gap-1">
                                <span className="text-base font-black text-orange-850">{course.price} ر.س</span>
                                {course.originalPrice && (
                                  <span className="text-[10px] text-stone-450 text-stone-400 line-through">{course.originalPrice} ر.س</span>
                                )}
                              </div>
                            )}
                          </div>

                          <button
                            onClick={() => handleAddToCartLocal(course)}
                            disabled={inCart}
                            className={`px-3 py-2 rounded-xl font-bold text-[11px] transition-all flex items-center gap-1 shadow-sm border-0 ${
                              inCart 
                                ? 'bg-amber-105/50 bg-amber-100/50 text-stone-500 border border-amber-200 cursor-not-allowed'
                                : isAdded 
                                  ? 'bg-teal-700 text-amber-50 shadow-md'
                                  : 'bg-orange-700 hover:bg-orange-850 text-amber-50 shadow-md cursor-pointer'
                            }`}
                            id={`add-to-cart-catalog-${course.id}`}
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>
                              {isAdded ? 'تمت الإضافة!' : inCart ? 'موجود بالسلة' : 'أضف للسلة'}
                            </span>
                          </button>

                        </div>

                      </div>

                    </motion.article>
                  );
                })}
              </div>
            )}

            {/* Quick platform benefit stats callout for trust checking */}
            <div className="bg-amber-100/40 p-6 rounded-2xl border border-amber-200/80 flex flex-col sm:flex-row items-center gap-6 text-right">
              <div className="bg-orange-100 p-3.5 rounded-full text-orange-700">
                <GraduationCap className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-stone-900 text-sm">سياسة "آثاري" المعرفية الضامنة للمقعد الحصري</h4>
                <p className="text-[11px] text-stone-600 leading-relaxed font-light">
                  المقاعد محدودة بمجلس النقاش الصوتي لضمان إعلاء جودة الاستماع والرد الفردي للمدرب على الواجبات. سارع بحجز دورتك للالتحاق الفوري بالفصل النشط.
                </p>
              </div>
            </div>

          </main>

        </div>
      </div>

      {/* Slide-out mobile filters modal dialog */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden lg:hidden" role="dialog" aria-modal="true" id="mobile-filter-dialog">
          
          {/* Backdrop color */}
          <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm transition-opacity" onClick={() => setMobileFiltersOpen(false)} />

          <div className="absolute inset-y-0 left-0 max-w-full flex pr-10">
            <div className="w-screen max-w-xs bg-white text-right shadow-xl py-6 px-6 overflow-y-auto flex flex-col justify-between">
              
              <div className="space-y-6">
                {/* Header of mobile slider filter */}
                <div className="flex items-center justify-between pb-4 border-b border-amber-100">
                  <span className="flex items-center gap-2 font-bold text-stone-900 text-sm">
                    <Filter className="w-4 h-4 text-orange-700" />
                    <span>تصفية ومعاينة</span>
                  </span>
                  <button onClick={() => setMobileFiltersOpen(false)} className="p-1 rounded-lg hover:bg-stone-100 text-stone-500">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Mobile Search */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-stone-850">البحث بالكلمات</span>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="ابحث..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-stone-50 text-stone-950 text-xs py-2.5 pr-9 pl-3 rounded-lg border border-amber-200 text-right"
                    />
                    <Search className="w-4 h-4 text-amber-600 absolute top-3.5 right-3" />
                  </div>
                </div>

                {/* Categories Checkboxes Mobile */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-stone-850">الفئة والموضوع</span>
                  <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                    {CATEGORIES.map((cat) => (
                      <label key={cat.id} className="flex items-center gap-2.5 cursor-pointer text-xs text-stone-650">
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(cat.name)}
                          onChange={() => handleToggleCategory(cat.name)}
                          className="accent-orange-700 h-4 w-4 text-orange-700 rounded border-amber-300"
                        />
                        <span>{cat.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Levels Checkboxes Mobile */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-stone-850">المستوى</span>
                  <div className="space-y-2">
                    {LEVEL_LABELS.map((lvl) => (
                      <label key={lvl} className="flex items-center gap-2.5 cursor-pointer text-xs text-stone-650">
                        <input
                          type="checkbox"
                          checked={selectedLevels.includes(lvl)}
                          onChange={() => handleToggleLevel(lvl)}
                          className="accent-orange-700 h-4 w-4 rounded border-amber-300 text-orange-700"
                        />
                        <span>{lvl}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Model Mobile */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-stone-850">نموذج السعر</span>
                  <div className="space-y-2">
                    {[
                      { value: 'all', label: 'الكل' },
                      { value: 'free', label: 'مجانية' },
                      { value: 'paid', label: 'مدفوعة' }
                    ].map((mode) => (
                      <label key={mode.value} className="flex items-center gap-2.5 cursor-pointer text-xs text-stone-650">
                        <input
                          type="radio"
                          name="price-tier-mobile"
                          checked={priceFilter === mode.value}
                          onChange={() => setPriceFilter(mode.value)}
                          className="accent-orange-700 h-4 w-4"
                        />
                        <span>{mode.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Rating Select Mobile */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-stone-850">التقييم</span>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2.5 cursor-pointer text-xs text-stone-650">
                      <input
                        type="radio"
                        name="rating-star-mobile"
                        checked={minRating === 0}
                        onChange={() => setMinRating(0)}
                        className="accent-orange-700 h-4 w-4"
                      />
                      <span>عرض الكل</span>
                    </label>
                    {RATING_STEPS.map((step) => (
                      <label key={step.value} className="flex items-center gap-2.5 cursor-pointer text-xs text-stone-650">
                        <input
                          type="radio"
                          name="rating-star-mobile"
                          checked={minRating === step.value}
                          onChange={() => setMinRating(step.value)}
                          className="accent-orange-700 h-4 w-4"
                        />
                        <span>{step.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

              </div>

              {/* Reset & Apply footer on mobile */}
              <div className="space-y-2 pt-6 border-t border-amber-100">
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="w-full bg-orange-700 hover:bg-orange-850 text-amber-50 text-xs font-bold py-3 rounded-xl transition"
                >
                  تطبيق الفلاتر المتوفرة
                </button>
                <button
                  onClick={() => { handleResetFilters(); setMobileFiltersOpen(false); }}
                  className="w-full bg-stone-105 bg-stone-100 text-stone-700 text-xs font-semibold py-3 rounded-xl transition"
                >
                  إلغاء وإعادة تعيين
                </button>
              </div>

            </div>
          </div>

        </div>
      )}

      {/* RATING & REVIEWS CUSTOM DIALOG (Shadcn style with Framer Motion) */}
      <AnimatePresence>
        {selectedCourseForReview && (
          <div className="fixed inset-0 z-50 overflow-y-auto" id="reviews-dialog-overlay">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm transition-opacity"
              onClick={() => setSelectedCourseForReview(null)}
            />

            {/* Central dialog container */}
            <div className="flex min-h-screen items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                transition={{ type: "spring", damping: 25, stiffness: 350 }}
                className="relative w-full max-w-xl bg-white border border-amber-200/80 rounded-2xl shadow-2xl overflow-hidden text-right flex flex-col max-h-[85vh]"
                id="reviews-dialog-panel"
              >
                
                {/* Decorative Islamic geometric star graphic header accent */}
                <div className="h-2 bg-gradient-to-r from-orange-600 via-amber-500 to-teal-600" />

                {/* Header info */}
                <div className="px-6 py-5 bg-amber-50/60 border-b border-amber-100/70 flex justify-between items-start gap-4">
                  <div>
                    <span className="text-[10px] bg-orange-100 text-orange-850 px-2.5 py-1 rounded font-black">تقييمات ومراجعات آثاري</span>
                    <h3 className="font-bold text-stone-900 text-base leading-snug mt-1">{selectedCourseForReview.title}</h3>
                    <p className="text-xs text-stone-500 mt-0.5">مع الحافظ المجيز م. {selectedCourseForReview.instructorName}</p>
                  </div>

                  <button 
                    onClick={() => {
                      setSelectedCourseForReview(null);
                      setNewReviewComment('');
                      setNewReviewRating(5);
                    }}
                    className="p-1.5 hover:bg-amber-100 rounded-lg text-stone-500 hover:text-stone-800 transition cursor-pointer font-bold border-0"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Body Content with separate lists and inputs */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  
                  {/* Visual Rating Statistics Panel */}
                  <div className="bg-amber-50/30 p-4 rounded-xl border border-amber-100 flex flex-col sm:flex-row gap-5 items-center justify-around">
                    <div className="text-center space-y-1">
                      <span className="text-3xl font-black text-stone-900 font-mono">
                        {calcAverageRating(selectedCourseForReview.id, selectedCourseForReview.rating)}
                      </span>
                      <div className="flex justify-center text-amber-500 gap-0.5 animate-pulse">
                        {[1, 2, 3, 4, 5].map((star) => {
                          const avgVal = parseFloat(calcAverageRating(selectedCourseForReview.id, selectedCourseForReview.rating));
                          return (
                            <Star 
                              key={star} 
                              className={`w-4 h-4 fill-current ${
                                star <= Math.round(avgVal) ? 'text-amber-500' : 'text-stone-200'
                              }`} 
                            />
                          );
                        })}
                      </div>
                      <span className="text-[10px] text-stone-500 block">
                        بناءً على {reviews.filter(r => r.courseId === selectedCourseForReview.id).length} تقييمات موثقة من الطلاب المسجلين
                      </span>
                    </div>

                    <div className="w-full sm:w-1/2 space-y-1.5 text-xs text-stone-600">
                      {/* 5, 4, 3 star progress lines */}
                      {[5, 4, 3, 2, 1].map((ratingNum) => {
                        const listRevs = reviews.filter(r => r.courseId === selectedCourseForReview.id);
                        const withRatingCount = listRevs.filter(r => r.rating === ratingNum).length;
                        const percentage = listRevs.length ? (withRatingCount / listRevs.length) * 100 : ratingNum === 5 ? 100 : 0;
                        return (
                          <div key={ratingNum} className="flex items-center gap-2">
                            <span className="w-3 text-left font-mono">{ratingNum}</span>
                            <div className="flex-1 h-1.5 bg-stone-100 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-amber-500 rounded-full" 
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <span className="w-6 text-stone-400 font-mono">{withRatingCount}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Submit New Review Form */}
                  <div className="bg-white p-4 rounded-xl border border-amber-200/60 shadow-sm space-y-4">
                    <span className="text-xs font-black text-stone-900 block border-r-3 border-orange-700 pr-2">
                      كتابة مراجعتك الأكاديمية للدورة
                    </span>

                    <form onSubmit={handleAddReviewSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-stone-600 block">اسم الطالب الثنائي</label>
                          <input
                            type="text"
                            required
                            value={newReviewName}
                            onChange={(e) => setNewReviewName(e.target.value)}
                            className="w-full text-xs font-semibold py-2 px-3 border border-amber-100 rounded-lg bg-stone-50/50 focus:outline-none focus:ring-1 focus:ring-orange-600 text-right"
                            placeholder="مثال: أحمد التميمي"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-stone-600 block">تقييمك بالنجوم</label>
                          <div className="flex items-center gap-1.5 h-8">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                type="button"
                                key={star}
                                onClick={() => setNewReviewRating(star)}
                                onMouseEnter={() => setReviewRatingHover(star)}
                                onMouseLeave={() => setReviewRatingHover(0)}
                                className="text-stone-300 hover:scale-110 transition duration-100 cursor-pointer focus:outline-none border-0"
                              >
                                <Star 
                                  className={`w-6 h-6 fill-current ${
                                    star <= (reviewRatingHover || newReviewRating) ? 'text-amber-500' : 'text-stone-200'
                                  }`} 
                                />
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-stone-600 block">انطباعك وملاحظاتك المنهجية</label>
                        <textarea
                          required
                          rows={3}
                          value={newReviewComment}
                          onChange={(e) => setNewReviewComment(e.target.value)}
                          maxLength={350}
                          className="w-full text-xs py-2.5 px-3 border border-amber-100 rounded-lg bg-stone-50/50 focus:outline-none focus:ring-1 focus:ring-orange-600 text-right font-light leading-relaxed resize-none"
                          placeholder="اكتب خلاصة تقييمك لمضمون الشرح ووضوح الصوت والخرائط التوضيحية لزملائك الطلاب..."
                        />
                      </div>

                      <div className="flex justify-end gap-2 text-xs">
                        <button
                          type="submit"
                          className="bg-orange-700 hover:bg-orange-850 text-amber-50 font-black py-2.5 px-6 rounded-lg transition shadow cursor-pointer flex items-center gap-1.5 border-0"
                        >
                          <Check className="w-4 h-4" />
                          <span>نشر التقييم المعتمد</span>
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Student Reviews Feed List */}
                  <div className="space-y-3">
                    <span className="text-xs font-black text-stone-900 block border-r-3 border-teal-700 pr-2">
                      سجل التقييمات للطلاب المسجلين ({reviews.filter(r => r.courseId === selectedCourseForReview.id).length})
                    </span>

                    <div className="space-y-3.5 max-h-72 overflow-y-auto pr-1">
                      {reviews.filter(r => r.courseId === selectedCourseForReview.id).length === 0 ? (
                        <div className="bg-amber-50/20 rounded-xl border border-dashed border-amber-150 p-6 text-center text-stone-500 text-xs text-light space-y-1">
                          <p>لا توجد مراجعات منشورة لهذه الدورة بعد.</p>
                          <p className="text-[10px] text-stone-400">كن أول من يشارك زملاءه الدارسين بتقييمك المنهجي الأنيق!</p>
                        </div>
                      ) : (
                        reviews.filter(r => r.courseId === selectedCourseForReview.id).map((item) => (
                          <div 
                            key={item.id} 
                            className="p-4 rounded-xl border border-stone-100 bg-white/75 hover:bg-stone-50/30 transition shadow-sm space-y-2 text-right animate-fade-in"
                          >
                            <div className="flex justify-between items-center text-xs">
                              <div className="space-y-0.5">
                                <h5 className="font-bold text-stone-900">{item.userName}</h5>
                                <span className="text-[9px] text-stone-400 font-sans block">{item.date} — طالب مصدق</span>
                              </div>
                              <div className="flex text-amber-500 gap-0.5">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star 
                                    key={star} 
                                    className={`w-3.5 h-3.5 fill-current ${
                                      star <= item.rating ? 'text-amber-500' : 'text-stone-100'
                                    }`} 
                                  />
                                ))}
                              </div>
                            </div>

                            <p className="text-xs text-stone-750 font-light leading-relaxed">
                              {item.comment}
                            </p>

                            {/* Upvoting feedback utility */}
                            <div className="pt-2 border-t border-stone-100/50 flex justify-between items-center text-[10px]">
                              <span className="text-stone-400">هل كان هذا التقييم مفيداً لك؟</span>
                              <button
                                onClick={() => handleUpvoteReview(item.id)}
                                className="flex items-center gap-1.5 bg-stone-50 text-stone-600 hover:bg-orange-50 hover:text-orange-750 py-1 px-3 rounded-full transition focus:outline-none cursor-pointer border-0"
                                title="تقييم مفيد"
                              >
                                <ThumbsUp className="w-3 h-3 text-stone-400 group-hover:text-amber-600" />
                                <span>مفيد ({item.helpfulCount})</span>
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                </div>

              </motion.div>
            </div>

          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
