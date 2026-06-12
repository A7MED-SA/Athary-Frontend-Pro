import { useState, useEffect } from 'react';
import { ViewType, Course } from './types';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import CourseCatalog from './components/CourseCatalog';
import StudentDashboard from './components/StudentDashboard';
import InstructorDashboard from './components/InstructorDashboard';
import AuthPage from './components/AuthPage';
import CourseDetails from './components/CourseDetails';
import CartCheckout from './components/CartCheckout';
import Footer from './components/Footer';
import AdminDashboard from './components/AdminDashboard';
import AboutContactPublic from './components/AboutContactPublic';
import ErrorBoundary from './components/ErrorBoundary';
import NotFound from './components/NotFound';
import { ShoppingBag, X, Check, Award, Compass, CreditCard, Sparkles, Sliders } from 'lucide-react';
import { COURSES } from './data';

// Synchronously apply theme at module load to prevent visual flash on reload
if (typeof window !== 'undefined') {
  const savedMode = localStorage.getItem('theme-mode') || 'light';
  const savedTheme = localStorage.getItem('theme-color') || 'default';
  
  if (savedMode === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }

  // Clear any active subclasses
  document.documentElement.classList.remove('theme-gold', 'theme-forest', 'theme-graphite');
  
  // Normalize and apply
  let mappedClass = '';
  if (savedTheme === 'gold' || savedTheme === 'theme-gold') mappedClass = 'theme-gold';
  else if (savedTheme === 'forest' || savedTheme === 'theme-forest') mappedClass = 'theme-forest';
  else if (savedTheme === 'graphite' || savedTheme === 'theme-graphite') mappedClass = 'theme-graphite';

  if (mappedClass) {
    document.documentElement.classList.add(mappedClass);
  }
}

export default function App() {
  const [activeView, setActiveView] = useState<ViewType>('landing');
  const [cartItems, setCartItems] = useState<Course[]>([]);
  const [coursesList, setCoursesList] = useState<Course[]>(COURSES);
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Default logged in for immediate dashboard inspection
  const [userName, setUserName] = useState('أحمد التميمي');
  const [selectedCourseId, setSelectedCourseId] = useState<string>('course_1');
  
  // Interactive UI states
  const [cartOpen, setCartOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [showPreviewHelper, setShowPreviewHelper] = useState(true);
  const [globalToast, setGlobalToast] = useState<string | null>(null);

  const displayToast = (msg: string) => {
    setGlobalToast(msg);
    setTimeout(() => {
      setGlobalToast(null);
    }, 4000);
  };

  const handleAddToCart = (course: Course) => {
    const alreadyIn = cartItems.some(item => item.id === course.id);
    if (!alreadyIn) {
      setCartItems([...cartItems, course]);
      displayToast(`أضيفت بنجاح: ${course.title}`);
    } else {
      displayToast(`هذه الدورة موجودة مسبقاً في حقيبة التسوق الخاصة بك.`);
    }
  };

  const handleRemoveFromCart = (id: string) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    
    // Simulate checking out and adding pages to student progress portfolio
    // For each course in cartItems, set simulated progress to 0% and enroll
    cartItems.forEach(item => {
      const match = COURSES.find(c => c.id === item.id);
      if (match) {
        match.progress = 0; // Starts with 0% progress on Student Dashboard!
        match.nextLesson = "المقدمة التمهيدية وباب التعريف الأكاديمي للجامعة";
      }
    });

    setCartItems([]);
    setCartOpen(false);
    setIsLoggedIn(true);
    setActiveView('dashboard');
    displayToast('🎉 تهانينا! تم تأكيد تسجيلك في المسارات وحجز مقعدك بنجاح. تصفح لوحة التحكم للبدء.');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setActiveView('landing');
    displayToast('تم تسجيل الخروج بنجاح. مجلسك المعرفي مغلق حالياً.');
  };

  const handleLoginSuccess = (name: string) => {
    setIsLoggedIn(true);
    setUserName(name || 'أحمد التميمي');
    displayToast(`مرحباً بك مجدداً يا ${name} في رحلتك المعرفية المفتوحة!`);
  };

  // Scroll to top on view changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [activeView]);

  // Load persisted theme on boot and react to updates dynamically
  useEffect(() => {
    const applyTheme = () => {
      const savedMode = localStorage.getItem('theme-mode') || 'light';
      const savedTheme = localStorage.getItem('theme-color') || 'default';
      
      // Apply mode
      if (savedMode === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }

      // Clear any active subclasses to avoid duplication or overlaps
      document.documentElement.classList.remove('theme-gold', 'theme-forest', 'theme-graphite');
      
      let mappedClass = '';
      if (savedTheme === 'gold' || savedTheme === 'theme-gold') mappedClass = 'theme-gold';
      else if (savedTheme === 'forest' || savedTheme === 'theme-forest') mappedClass = 'theme-forest';
      else if (savedTheme === 'graphite' || savedTheme === 'theme-graphite') mappedClass = 'theme-graphite';

      if (mappedClass) {
        document.documentElement.classList.add(mappedClass);
      }
    };

    applyTheme();
    window.addEventListener('theme-changed', applyTheme);
    return () => window.removeEventListener('theme-changed', applyTheme);
  }, []);

  return (
    <ErrorBoundary>
      <div className="min-h-screen flex flex-col bg-[var(--color-background)] text-[var(--color-foreground)] relative antialiased transition-colors duration-250 selection:bg-orange-200 selection:text-orange-900" dir="rtl">
      
      {/* GLOBAL NOTIFICATION SYSTEM */}
      {globalToast && (
        <div className="fixed top-24 left-6 z-50 bg-stone-900 text-amber-50 px-5 py-4 rounded-2xl shadow-xl max-w-sm flex items-center gap-3 animate-slide-in border-r-4 border-amber-500">
          <div className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          <p className="text-xs font-semibold leading-tight">{globalToast}</p>
        </div>
      )}

      {/* CORE NAVBAR COMPONENT */}
      <Navbar 
        activeView={activeView}
        setActiveView={(v) => { setActiveView(v); setCategoryFilter(null); }}
        cartCount={cartItems.length}
        onOpenCart={() => setCartOpen(true)}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
        userName={userName}
      />

      {/* DYNAMIC VIEW ROUTER SCREEN */}
      <div className="flex-1">
        {activeView === 'landing' && (
          <LandingPage 
            setActiveView={setActiveView}
            setCategoryFilter={setCategoryFilter}
            onAddToCart={handleAddToCart}
            cartItems={cartItems}
            onViewCourseDetails={(id) => { setSelectedCourseId(id); setActiveView('course-details'); }}
          />
        )}

        {activeView === 'catalog' && (
          <CourseCatalog 
            initialCategoryFilter={categoryFilter}
            onAddToCart={handleAddToCart}
            cartItems={cartItems}
            onViewCourseDetails={(id) => { setSelectedCourseId(id); setActiveView('course-details'); }}
          />
        )}

        {activeView === 'dashboard' && (
          <StudentDashboard 
            onLogout={handleLogout}
            userName={userName}
            onNavigateToCatalog={() => { setActiveView('catalog'); setCategoryFilter(null); }}
          />
        )}

        {activeView === 'auth' && (
          <AuthPage 
            onLoginSuccess={handleLoginSuccess}
            setActiveView={setActiveView}
          />
        )}

        {activeView === 'course-details' && (
          <CourseDetails 
            courseId={selectedCourseId}
            onAddToCart={handleAddToCart}
            cartItems={cartItems}
            setActiveView={setActiveView}
            onTriggerToast={displayToast}
          />
        )}

        {activeView === 'cart-checkout' && (
          <CartCheckout 
            cartItems={cartItems}
            onRemoveFromCart={handleRemoveFromCart}
            onCheckout={handleCheckout}
            setActiveView={setActiveView}
            onTriggerToast={displayToast}
          />
        )}

        {activeView === 'instructor-dashboard' && (
          <InstructorDashboard 
            onLogout={handleLogout}
            userName={userName}
            onTriggerToast={displayToast}
            coursesList={coursesList}
            setCoursesList={setCoursesList}
          />
        )}

        {activeView === 'admin-dashboard' && (
          <AdminDashboard 
            userName="المشرف العام (أحمد)"
            onLogout={handleLogout}
            onTriggerToast={displayToast}
          />
        )}

        {activeView === 'about-contact' && (
          <AboutContactPublic />
        )}

        {!['landing', 'catalog', 'dashboard', 'auth', 'course-details', 'cart-checkout', 'instructor-dashboard', 'admin-dashboard', 'about-contact'].includes(activeView) && (
          <NotFound setActiveView={setActiveView} />
        )}
      </div>

      {/* HIGH FIDELITY CORE FOOTER */}
      <Footer />

      {/* 🎒 SHOPPING CART SLIDE OVER OVERLAY DRAWER */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden" id="shopping-cart-drawer">
          <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm transition-opacity" onClick={() => setCartOpen(false)} />
          
          <div className="absolute inset-y-0 left-0 max-w-full flex pl-0 sm:pl-10">
            <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between text-right">
              
              {/* Header */}
              <div className="px-6 py-5 bg-amber-50 border-b border-amber-100 flex items-center justify-between">
                <div className="flex items-center gap-2 text-stone-900">
                  <ShoppingBag className="w-5 h-5 text-orange-700" />
                  <span className="font-black text-sm">حقيبة المقاعد والدراسات</span>
                </div>
                
                <button 
                  onClick={() => setCartOpen(false)}
                  className="p-1.5 hover:bg-amber-100 rounded-lg text-stone-500 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Cart List Items Body */}
              <div className="flex-1 px-6 py-6 overflow-y-auto space-y-4">
                {cartItems.length === 0 ? (
                  <div className="text-center py-16 space-y-4">
                    <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto text-amber-600">
                      <ShoppingBag className="w-7 h-7 stroke-[1.5]" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-stone-900 text-sm">حقيبة الدارسة فارغة حالياً</h4>
                      <p className="text-xs text-stone-500 leading-relaxed max-w-xs mx-auto">
                        تصفح كتالوج ومسارات آثاري الفنية لحجز مقعدك بالبث والمجلس التفاعلي الحصري.
                      </p>
                    </div>
                    <button
                      onClick={() => { setActiveView('catalog'); setCartOpen(false); }}
                      className="bg-orange-700 hover:bg-orange-850 text-amber-50 text-xs font-bold px-6 py-3 rounded-xl transition shadow"
                    >
                      تصفح العلوم المتاحة
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-xs text-stone-500 font-semibold">{cartItems.length} دورات جاهزة للتسجيل المعتمد:</p>
                    
                    <div className="divide-y divide-amber-50 space-y-3">
                      {cartItems.map((item) => (
                        <div key={item.id} className="pt-3 first:pt-0 flex gap-4 items-center">
                          <img 
                            src={item.thumbnail} 
                            alt={item.title} 
                            className="w-16 h-16 rounded-xl object-cover border border-amber-100"
                            referrerPolicy="no-referrer"
                          />
                          <div className="flex-1 text-right space-y-1 min-w-0">
                            <h4 className="font-bold text-xs text-stone-900 leading-snug line-clamp-2">{item.title}</h4>
                            <p className="text-[10px] text-stone-500">معد دبلوم: {item.instructorName}</p>
                            <span className="block text-xs font-black text-orange-850">
                              {item.price === 0 ? 'مجاني بالكامل' : `${item.price} ر.س`}
                            </span>
                          </div>
                          
                          <button
                            onClick={() => handleRemoveFromCart(item.id)}
                            className="text-stone-400 hover:text-red-700 text-xs font-bold p-1 hover:bg-red-50 rounded"
                            title="حذف"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Cart Drawer Checkout Footer */}
              {cartItems.length > 0 && (
                <div className="p-6 border-t border-amber-150 bg-amber-50/50 space-y-4 text-right">
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between items-center text-stone-600">
                      <span>إجمالي رسوم المقاعد:</span>
                      <span className="font-mono">{cartItems.reduce((acc, curr) => acc + curr.price, 0)} ر.س</span>
                    </div>
                    <div className="flex justify-between items-center text-stone-600">
                      <span>خصم كوبون التراث الأولي:</span>
                      <span className="text-teal-700 font-bold">مجاناً بفترة التأسيس</span>
                    </div>
                    <div className="h-px bg-amber-200/50 my-1" />
                    <div className="flex justify-between items-center text-stone-950 font-black text-sm">
                      <span>الاستثمار الكلي المتبقي:</span>
                      <span className="font-mono text-orange-850">{cartItems.reduce((acc, curr) => acc + curr.price, 0)} ر.س</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setCartOpen(false);
                      setActiveView('cart-checkout');
                    }}
                    className="w-full bg-orange-700 hover:bg-orange-850 text-amber-50 font-black py-3.5 rounded-xl text-xs transition shadow-lg flex items-center justify-center gap-2 border-0 cursor-pointer"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>الانتقال لصفحة إتمام الحجز والدفع</span>
                  </button>
                  
                  <button
                    onClick={handleCheckout}
                    className="w-full bg-stone-900 hover:bg-stone-800 text-stone-100 font-bold py-2.5 rounded-xl text-[10px] transition flex items-center justify-center gap-1.5 border-0 cursor-pointer"
                  >
                    <span>تسجيل سريع بنقرة واحدة (مجاني بالتأسيس)</span>
                  </button>
                  <p className="text-[9px] text-stone-500 text-center">أو اضغط للدخول مباشرة بلوحة معلوماتك التمهيدية.</p>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* 🧭 PREMIUM DESIGN PREVIEW DECK (Floating Collapsible Tool) */}
      <div className="fixed bottom-6 right-6 z-40 font-sans" id="preview-floating-deck">
        {showPreviewHelper ? (
          <div className="bg-stone-900 text-amber-50 py-5 px-5 rounded-3xl border-2 border-amber-500 shadow-2xl space-y-4 max-w-sm text-right animate-slide-up relative">
            
            <button 
              onClick={() => setShowPreviewHelper(false)}
              className="absolute top-3 left-3 p-1 rounded-full bg-stone-800 hover:bg-stone-750 text-stone-400 hover:text-stone-200"
              title="إخفاء لوحة التحكم"
            >
              <X className="w-3.5 h-3.5" />
            </button>

            <div className="space-y-1.5">
              <span className="inline-flex items-center gap-1.5 text-[9px] font-bold text-amber-400 bg-orange-900/50 py-1 px-2.5 rounded-full uppercase leading-none">
                <Sparkles className="w-3 h-3 animate-pulse" />
                <span>لوحة تقويم الإصدار الحصري لمراجعي آثاري</span>
              </span>
              <h4 className="text-xs font-black">تحكم المعاينة الفورية للأقسام المطلوبة:</h4>
              <p className="text-[10px] text-stone-400 leading-snug">
                انقر على أي شاشة بالأسفل للانتقال الفوري وتدقيق جودة التصميم المطلوبة بالبرومبت.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              
              <button 
                onClick={() => { setActiveView('landing'); }}
                className={`p-2.5 rounded-xl font-bold text-center transition border-0 cursor-pointer ${
                  activeView === 'landing' ? 'bg-orange-700 text-amber-50' : 'bg-stone-800 hover:bg-stone-750 text-stone-300'
                }`}
              >
                الرئيسية ✨
              </button>

              <button 
                onClick={() => { setActiveView('catalog'); }}
                className={`p-2.5 rounded-xl font-bold text-center transition border-0 cursor-pointer ${
                  activeView === 'catalog' ? 'bg-orange-700 text-amber-50' : 'bg-stone-800 hover:bg-stone-750 text-stone-300'
                }`}
              >
                الكتالوج 📚
              </button>

              <button 
                onClick={() => { setSelectedCourseId('course_1'); setActiveView('course-details'); }}
                className={`p-2.5 rounded-xl font-bold text-center transition border-0 cursor-pointer ${
                  activeView === 'course-details' ? 'bg-orange-700 text-amber-50' : 'bg-stone-800 hover:bg-stone-750 text-stone-300'
                }`}
              >
                تفاصيل المسار 📖
              </button>

              <button 
                onClick={() => { setActiveView('cart-checkout'); }}
                className={`p-2.5 rounded-xl font-bold text-center transition border-0 cursor-pointer ${
                  activeView === 'cart-checkout' ? 'bg-orange-700 text-amber-50' : 'bg-stone-800 hover:bg-stone-750 text-stone-300'
                }`}
              >
                إتمام الحجز 🛒
              </button>

              <button 
                onClick={() => { setIsLoggedIn(true); setActiveView('dashboard'); }}
                className={`p-2.5 rounded-xl font-bold text-center transition border-0 cursor-pointer ${
                  activeView === 'dashboard' ? 'bg-orange-700 text-amber-50' : 'bg-stone-800 hover:bg-stone-750 text-stone-300'
                }`}
              >
                لوحة الطالب 🎖️
              </button>

              <button 
                onClick={() => { setIsLoggedIn(true); setActiveView('instructor-dashboard'); }}
                className={`p-2.5 rounded-xl font-bold text-center transition border-0 cursor-pointer ${
                  activeView === 'instructor-dashboard' ? 'bg-orange-700 text-amber-50' : 'bg-stone-800 hover:bg-stone-750 text-stone-300'
                }`}
              >
                لوحة المعلم 🎓
              </button>

              <button 
                onClick={() => { setIsLoggedIn(false); setActiveView('auth'); }}
                className={`p-2.5 rounded-xl font-bold text-center transition border-0 cursor-pointer ${
                  activeView === 'auth' ? 'bg-orange-700 text-amber-50' : 'bg-stone-800 hover:bg-stone-750 text-stone-300'
                }`}
              >
                التسجيل 🔑
              </button>

              <button 
                onClick={() => { setIsLoggedIn(true); setActiveView('admin-dashboard'); }}
                className={`p-2.5 rounded-xl font-bold text-center transition border-0 cursor-pointer col-span-2 ${
                  activeView === 'admin-dashboard' ? 'bg-orange-700 text-amber-50' : 'bg-stone-800 hover:bg-stone-750 text-stone-300'
                }`}
              >
                لوحة المشرف 👑
              </button>

            </div>

            <div className="h-px bg-stone-800" />

            <div className="text-[9px] text-stone-500 text-center">
              تم تشفير وحماية بوابة الطلاب بنظام التحقق المزدوج بموجب المعايير التراثية.
            </div>

          </div>
        ) : (
          <button
            onClick={() => setShowPreviewHelper(true)}
            className="w-12 h-12 bg-stone-900 text-amber-400 hover:text-amber-300 border-2 border-amber-500 rounded-full flex items-center justify-center shadow-2xl transition hover:scale-105"
            title="فتح لوحة المعاينة السريعة للشاشات"
            id="open-preview-deck-btn"
          >
            <Sliders className="w-5 h-5" />
          </button>
        )}
      </div>

    </div>
  </ErrorBoundary>
  );
}
