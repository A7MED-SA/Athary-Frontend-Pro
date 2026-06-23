import { useState, useEffect } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useCourses } from '../common/hooks/useCourses';
import { useCategories } from '../common/hooks/useCategories';
import { useCart } from '../common/hooks/useCart';
import { CourseCardSkeleton } from '@/components/shared/Skeleton';
import { EmptyState } from '@/components/shared/EmptyState';
import { ErrorFallback } from '@/components/shared/ErrorFallback';
import { Pagination } from '@/components/shared/Pagination';
import { Search, RotateCcw, Star, ChevronDown, ChevronUp, ShoppingBag, Filter, X, GraduationCap } from 'lucide-react';
import { toast } from 'sonner';
import type { PublicCourseFilterDto, CourseLevel, PublicCourseSortBy } from '@/types/api/course';

export default function CourseCatalog() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const initialCategoryFilter = (location.state as { initialCategory?: string | null })?.initialCategory ?? null;

  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(initialCategoryFilter ? undefined : null);
  const [selectedLevel, setSelectedLevel] = useState<CourseLevel | undefined>(undefined);
  const [priceFilter, setPriceFilter] = useState<'all' | 'free' | 'paid'>('all');
  const [minRating, setMinRating] = useState<number | undefined>(undefined);
  const [sortBy, setSortBy] = useState<PublicCourseSortBy>('PublishedAt');
  const [sortDescending, setSortDescending] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  const [categoryOpen, setCategoryOpen] = useState(true);
  const [levelOpen, setLevelOpen] = useState(true);
  const [priceOpen, setPriceOpen] = useState(true);
  const [ratingOpen, setRatingOpen] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const { categories } = useCategories();
  const { addItem: addToCart } = useCart();

  const filters: PublicCourseFilterDto = {
    searchQuery: searchQuery || undefined,
    categoryId: selectedCategoryId || undefined,
    level: selectedLevel,
    isFreeOnly: priceFilter === 'free' ? true : undefined,
    minPrice: priceFilter === 'paid' ? 1 : undefined,
    minRating: minRating || undefined,
    sortBy,
    sortDescending,
    page: currentPage,
    pageSize,
  };

  const { courses, isLoading, error } = useCourses(filters);

  useEffect(() => {
    if (initialCategoryFilter && categories) {
      const cat = categories.find((c: { slug?: string; name: string }) => c.slug === initialCategoryFilter || c.name === initialCategoryFilter);
      if (cat) setSelectedCategoryId(cat.id);
    }
  }, [initialCategoryFilter, categories]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategoryId(undefined);
    setSelectedLevel(undefined);
    setPriceFilter('all');
    setMinRating(undefined);
    setSortBy('PublishedAt');
    setSortDescending(true);
    setCurrentPage(1);
  };

  const handleAddToCart = (courseId: string, courseTitle: string) => {
    addToCart(courseId, {
      onSuccess: () => toast.success(`تمت إضافة "${courseTitle}" للسلة`),
      onError: () => toast.error('فشل إضافة الدورة للسلة'),
    });
  };

  const courseList = courses?.items || [];
  const totalPages = courses?.totalPages || 1;
  const totalItems = courses?.totalCount || 0;

  const LEVEL_LABELS: { value: CourseLevel; label: string }[] = [
    { value: 'Beginner', label: 'مبتدئ' },
    { value: 'Intermediate', label: 'متوسط' },
    { value: 'Advanced', label: 'متقدم' },
  ];

  const SORT_OPTIONS: { value: PublicCourseSortBy; desc: boolean; label: string }[] = [
    { value: 'PublishedAt', desc: true, label: 'الأحدث' },
    { value: 'AverageRating', desc: true, label: 'الأعلى تقييماً' },
    { value: 'Price', desc: false, label: 'السعر: من الأقل للأعلى' },
    { value: 'Price', desc: true, label: 'السعر: من الأعلى للأقل' },
    { value: 'EnrollmentCount', desc: true, label: 'الأكثر تسجيلاً' },
  ];

  if (error) {
    return (
      <div className="bg-[var(--color-background)] min-h-screen py-10 px-4" dir="rtl">
        <ErrorFallback title="فشل تحميل الكتالوج" message={error.message || 'حدث خطأ غير متوقع'} onRetry={() => window.location.reload()} />
      </div>
    );
  }

  return (
    <div className="bg-[var(--color-background)] text-[var(--color-foreground)] min-h-screen py-10 px-4 sm:px-6 lg:px-8 font-sans" dir="rtl" id="athary-catalog-page">
      <div className="max-w-7xl mx-auto">
        {/* Banner */}
        <div className="relative mb-10 overflow-hidden bg-gradient-to-l from-orange-700 to-amber-700 text-amber-50 rounded-3xl p-8 sm:p-12 shadow-md">
          <div className="absolute inset-0 bg-heritage-pattern opacity-10 pointer-events-none" />
          <div className="relative z-10 max-w-xl space-y-3">
            <h1 className="text-3xl sm:text-4xl font-black">البوابة الكبرى للعلوم التراثية</h1>
            <p className="text-sm sm:text-base text-amber-100 font-light leading-relaxed">تصفح دبلومات ومقررات آثاري المدققة.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <aside className="hidden lg:block space-y-6" id="filters-sidebar-desktop">
            <div className="bg-white rounded-2xl border border-amber-200/80 p-5 shadow-sm space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-amber-100">
                <span className="flex items-center gap-2 font-bold text-stone-900 text-sm">
                  <Filter className="w-4 h-4 text-orange-700" />
                  <span>تصفية النتائج</span>
                </span>
                <button onClick={handleResetFilters} className="text-xs text-stone-500 hover:text-orange-700 flex items-center gap-1 transition-colors">
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>إعادة ضبط</span>
                </button>
              </div>

              <div className="relative">
                <input type="text" placeholder="ابحث باسم الدورة أو المعلم..." value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                  className="w-full bg-stone-50 text-stone-900 placeholder-stone-400 text-xs py-3 pr-10 pl-4 rounded-xl border border-amber-200 focus:outline-none focus:ring-2 focus:ring-orange-600 text-right" />
                <Search className="w-4 h-4 text-amber-600 absolute top-3.5 right-3.5" />
              </div>

              {/* Categories */}
              <div className="border-t border-amber-100/60 pt-4">
                <button onClick={() => setCategoryOpen(!categoryOpen)} className="w-full flex items-center justify-between text-right text-xs font-bold text-stone-800 pb-2.5">
                  <span>الفئة والموضوع</span>
                  {categoryOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {categoryOpen && (
                  <div className="space-y-2 mt-2 max-h-56 overflow-y-auto pr-1">
                    {categories?.map((cat: { id: string; name: string }) => (
                      <label key={cat.id} className="flex items-center gap-2.5 cursor-pointer select-none text-xs text-stone-700 hover:text-orange-700 transition">
                        <input type="radio" name="category" checked={selectedCategoryId === cat.id}
                          onChange={() => { setSelectedCategoryId(selectedCategoryId === cat.id ? undefined : cat.id); setCurrentPage(1); }}
                          className="accent-orange-700 h-4 w-4" />
                        <span>{cat.name}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Levels */}
              <div className="border-t border-amber-100/60 pt-4">
                <button onClick={() => setLevelOpen(!levelOpen)} className="w-full flex items-center justify-between text-right text-xs font-bold text-stone-800 pb-2.5">
                  <span>المستوى</span>
                  {levelOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {levelOpen && (
                  <div className="space-y-2 mt-2">
                    {LEVEL_LABELS.map((lvl) => (
                      <label key={lvl.value} className="flex items-center gap-2.5 cursor-pointer select-none text-xs text-stone-700 hover:text-orange-700 transition">
                        <input type="radio" name="level" checked={selectedLevel === lvl.value}
                          onChange={() => { setSelectedLevel(selectedLevel === lvl.value ? undefined : lvl.value); setCurrentPage(1); }}
                          className="accent-orange-700 h-4 w-4" />
                        <span>{lvl.label}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Price */}
              <div className="border-t border-amber-100/60 pt-4">
                <button onClick={() => setPriceOpen(!priceOpen)} className="w-full flex items-center justify-between text-right text-xs font-bold text-stone-800 pb-2.5">
                  <span>السعر</span>
                  {priceOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {priceOpen && (
                  <div className="space-y-2 mt-2">
                    {(['all', 'free', 'paid'] as const).map((mode) => (
                      <label key={mode} className="flex items-center gap-2.5 cursor-pointer select-none text-xs text-stone-700 hover:text-orange-700 transition">
                        <input type="radio" name="price" checked={priceFilter === mode}
                          onChange={() => { setPriceFilter(mode); setCurrentPage(1); }}
                          className="accent-orange-700 h-4 w-4" />
                        <span>{mode === 'all' ? 'الكل' : mode === 'free' ? 'مجانية' : 'مدفوعة'}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Rating */}
              <div className="border-t border-amber-100/60 pt-4">
                <button onClick={() => setRatingOpen(!ratingOpen)} className="w-full flex items-center justify-between text-right text-xs font-bold text-stone-800 pb-2.5">
                  <span>تقييم الطلاب</span>
                  {ratingOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {ratingOpen && (
                  <div className="space-y-2 mt-2">
                    {[undefined, 4.5, 4.0, 3.5].map((val) => (
                      <label key={String(val)} className="flex items-center gap-2.5 cursor-pointer text-xs text-stone-700">
                        <input type="radio" name="rating" checked={minRating === val}
                          onChange={() => { setMinRating(val); setCurrentPage(1); }}
                          className="accent-orange-700 h-4 w-4" />
                        <span>{val ? `${val}+ نجوم` : 'عرض الكل'}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3 space-y-6" id="catalog-main-grid">
            {/* Search & Sort Bar */}
            <div className="bg-white rounded-2xl border border-amber-200/80 p-5 shadow-sm space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 space-y-2">
                  <span className="block text-xs font-bold text-stone-800 text-right">البحث عن المقررات:</span>
                  <div className="relative">
                    <input id="catalog-search" type="text" placeholder="اكتب عنوان الدورة أو اسم الأستاذ..." value={searchQuery}
                      onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                      className="w-full bg-stone-50 text-stone-900 placeholder-stone-400 text-xs sm:text-sm py-3 px-11 pl-4 rounded-xl border border-amber-200 focus:outline-none focus:ring-2 focus:ring-orange-600 text-right" />
                    <Search className="w-5 h-5 text-orange-700 absolute top-3.5 right-4 pointer-events-none" />
                    {searchQuery && (
                      <button onClick={() => { setSearchQuery(''); setCurrentPage(1); }} className="absolute left-3.5 top-3.5 text-stone-400 hover:text-stone-700">
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <span className="block text-xs font-bold text-stone-800 text-right">ترتيب حسب:</span>
                  <select value={`${sortBy}-${sortDescending}`}
                    onChange={(e) => {
                      const [sb, desc] = e.target.value.split('-');
                      setSortBy(sb as PublicCourseSortBy);
                      setSortDescending(desc === 'true');
                      setCurrentPage(1);
                    }}
                    className="w-full bg-stone-50 text-stone-900 text-xs sm:text-sm py-3 px-4 rounded-xl border border-amber-200 focus:outline-none focus:ring-2 focus:ring-orange-600 text-right appearance-none cursor-pointer">
                    {SORT_OPTIONS.map((opt, i) => (
                      <option key={i} value={`${opt.value}-${opt.desc}`}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Mobile filter toggle */}
              <button onClick={() => setMobileFiltersOpen(true)} className="lg:hidden flex items-center gap-2 text-xs font-bold text-orange-700">
                <Filter className="w-4 h-4" /> تصفية
              </button>
            </div>

            {/* Results count */}
            <div className="text-xs text-stone-500 font-semibold">
              {totalItems} دورة مطابقة
            </div>

            {/* Loading state */}
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => <CourseCardSkeleton key={i} />)}
              </div>
            ) : courseList.length === 0 ? (
              <EmptyState title="لم نعثر على دورات مطابقة" description="حاول تغيير معايير التصفية أو البحث بكلمات أخرى." action={{ label: 'إعادة ضبط الفلاتر', onClick: handleResetFilters }} />
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {courseList.map((course) => (
                    <div key={course.id} className="bg-white rounded-2xl overflow-hidden border border-amber-200/50 shadow-sm hover:shadow-md hover:border-amber-300 transition-all duration-300 flex flex-col group h-full">
                      <div onClick={() => navigate('/course/' + course.id)} className="relative h-48 overflow-hidden cursor-pointer">
                        <img src={course.courseImageUrl || 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800'} alt={course.title}
                          className="w-full h-full object-cover transform duration-500 group-hover:scale-105" referrerPolicy="no-referrer" />
                        <div className="absolute inset-0 bg-orange-700/5 group-hover:bg-transparent transition-all pointer-events-none" />
                        <span className="absolute top-3.5 right-3.5 bg-orange-700 text-amber-50 text-[10px] font-bold px-3 py-1.5 rounded-full shadow-sm">{course.categoryName}</span>
                        <span className="absolute bottom-3 right-3 text-[10px] font-medium text-amber-100 bg-black/55 px-2 py-1 rounded-md">{Math.floor(course.totalDurationMinutes / 60)}س {course.totalDurationMinutes % 60}د</span>
                      </div>

                      <div className="p-5 flex-1 flex flex-col justify-between text-right">
                        <div>
                          <div className="flex items-center justify-between mb-2.5 text-xs">
                            <span className="text-stone-700 font-medium">{course.instructorName}</span>
                            <div className="flex items-center gap-1 text-amber-600 font-bold">
                              <span>{course.averageRating.toFixed(1)}</span>
                              <Star className="w-3.5 h-3.5 fill-current" />
                            </div>
                          </div>
                          <span className="text-[9px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded">{course.level === 'Beginner' ? 'مبتدئ' : course.level === 'Intermediate' ? 'متوسط' : 'متقدم'}</span>
                          <h3 onClick={() => navigate('/course/' + course.id)} className="font-bold text-stone-900 text-sm leading-snug line-clamp-2 group-hover:text-orange-700 transition cursor-pointer mt-2">{course.title}</h3>
                          <p className="text-[10px] text-stone-500 mt-2">{course.lessonCount} درس • {course.enrollmentCount.toLocaleString()} طالب</p>
                        </div>

                        <div className="pt-4 mt-5 border-t border-amber-50 flex items-center justify-between">
                          <div className="text-right">
                            <span className="text-[9px] block text-stone-400">الرسوم</span>
                            {course.isFree ? (
                              <span className="text-base font-black text-teal-700">مجاناً</span>
                            ) : (
                              <span className="text-base font-black text-orange-800">{course.price} ر.س</span>
                            )}
                          </div>
                          <button onClick={() => handleAddToCart(course.id, course.title)}
                            className="px-3 py-2 rounded-xl font-bold text-[11px] bg-orange-700 hover:bg-orange-800 text-amber-50 shadow-md transition-all flex items-center gap-1">
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>أضف للسلة</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
              </>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filters Dialog */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden lg:hidden" role="dialog">
          <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm" onClick={() => setMobileFiltersOpen(false)} />
          <div className="absolute inset-y-0 left-0 max-w-full flex pr-10">
            <div className="w-screen max-w-xs bg-white text-right shadow-xl py-6 px-6 overflow-y-auto flex flex-col justify-between">
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-amber-100">
                  <span className="flex items-center gap-2 font-bold text-stone-900 text-sm"><Filter className="w-4 h-4 text-orange-700" /> تصفية</span>
                  <button onClick={() => setMobileFiltersOpen(false)} className="p-1 rounded-lg hover:bg-stone-100"><X className="w-5 h-5" /></button>
                </div>
                <div className="space-y-2">
                  <span className="text-xs font-bold text-stone-800">البحث</span>
                  <input type="text" placeholder="ابحث..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-stone-50 text-stone-950 text-xs py-2.5 pr-9 pl-3 rounded-lg border border-amber-200 text-right" />
                </div>
                <div className="space-y-2">
                  <span className="text-xs font-bold text-stone-800">الفئة</span>
                  {categories?.map((cat: { id: string; name: string }) => (
                    <label key={cat.id} className="flex items-center gap-2.5 cursor-pointer text-xs text-stone-600">
                      <input type="radio" name="cat-mobile" checked={selectedCategoryId === cat.id}
                        onChange={() => setSelectedCategoryId(selectedCategoryId === cat.id ? undefined : cat.id)}
                        className="accent-orange-700 h-4 w-4" />
                      <span>{cat.name}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="space-y-2 pt-6 border-t border-amber-100">
                <button onClick={() => setMobileFiltersOpen(false)} className="w-full bg-orange-700 hover:bg-orange-800 text-amber-50 text-xs font-bold py-3 rounded-xl transition">تطبيق</button>
                <button onClick={() => { handleResetFilters(); setMobileFiltersOpen(false); }} className="w-full bg-stone-100 text-stone-700 text-xs font-semibold py-3 rounded-xl transition">إعادة تعيين</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
