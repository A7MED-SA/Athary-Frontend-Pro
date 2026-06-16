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
import ProfileSettings from './components/ProfileSettings';
import PublicProfile from './components/PublicProfile';
import ErrorBoundary from './components/ErrorBoundary';
import NotFound from './components/NotFound';
import { ShoppingBag, X, Check, Award, Compass, CreditCard, Sparkles, Sliders, Minimize2, Maximize2, Move, Link, Printer, QrCode } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { COURSES } from './data';
import { useNotificationStore } from './stores/notificationStore';

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

const VIEW_NAMES: Record<string, string> = {
  landing: 'الرئيسية ✨',
  catalog: 'الكتالوج 📚',
  dashboard: 'لوحة الطالب 🎖️',
  auth: 'التسجيل 🔑',
  'course-details': 'تفاصيل المسار 📖',
  'cart-checkout': 'إتمام الحجز 🛒',
  'instructor-dashboard': 'لوحة المعلم 🎓',
  'admin-dashboard': 'لوحة المشرف 👑',
  'profile-settings': 'إعدادات الحساب ⚙️',
  'public-profile': 'الملف العام للأستاذ 👤',
  'about-contact': 'اتصل بنا 📞'
};

export default function App() {
  const [activeView, setActiveView] = useState<ViewType>('landing');
  const [previousView, setPreviousView] = useState<ViewType>('landing');
  const [selectedInstructorName, setSelectedInstructorName] = useState<string>('م. عبد الرحمن البغدادي');
  const [cartItems, setCartItems] = useState<Course[]>([]);
  const [coursesList, setCoursesList] = useState<Course[]>(COURSES);
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Default logged in for immediate dashboard inspection
  const [userName, setUserName] = useState('أحمد التميمي');
  const [selectedCourseId, setSelectedCourseId] = useState<string>('course_1');
  
  // Interactive UI states
  const [cartOpen, setCartOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [showPreviewHelper, setShowPreviewHelper] = useState<boolean>(() => {
    return localStorage.getItem('athari_deck_closed') !== 'true';
  });
  const [isMinimized, setIsMinimized] = useState<boolean>(() => {
    return localStorage.getItem('athari_deck_minimized') === 'true';
  });
  const [dockCorner, setDockCorner] = useState<'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'>(() => {
    return (localStorage.getItem('athari_deck_corner') as any) || 'bottom-right';
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [tempPos, setTempPos] = useState({ x: 0, y: 0 });
  const [copiedLink, setCopiedLink] = useState(false);
  const [globalToast, setGlobalToast] = useState<string | null>(null);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [recentViews, setRecentViews] = useState<ViewType[]>(() => {
    try {
      const cached = localStorage.getItem('athari_recent_views');
      return cached ? JSON.parse(cached) : ['landing'];
    } catch {
      return ['landing'];
    }
  });

  const displayToast = (msg: string) => {
    setGlobalToast(msg);
    setTimeout(() => {
      setGlobalToast(null);
    }, 4500);
  };

  // Dynamic Simulator for New Course Lessons and Course Updates of enrolled tracks
  useEffect(() => {
    if (!isLoggedIn) return;

    // Wait a brief timeout before starting the checks
    const simulatedEvents = [
      {
        delay: 8000,
        title: '📖 درس جديد في مسارك التراثي 🕌',
        content: 'أضاف الأستاذ م. عبد الرحمن البغدادي درساً جديداً: "الدرس الخامس: تطور المقرنصات والزخارف في القصور الأندلسية" في مسارك المسجل.',
        toastMessage: '🔔 درس جديد صدر للتو: "الدرس الخامس" بمسار فلسفة العمارة الإسلامية بقلم م. عبد الرحمن البغدادي!'
      },
      {
        delay: 22000,
        title: '📂 ملحقات ومستندات دراسية جديدة 📜',
        content: 'قامت الدكتورة ليلى الأنصاري بإرفاق مخطوطة مرشد السائل الملونة كملف دراسي داعم في مقرر تاريخ الدول المستقلة.',
        toastMessage: '🔔 تحديث في مساراتك: أرفقت د. ليلى الأنصاري ملحقات ومخطوطات نادرة بمسار تاريخ الدول المستقلة!'
      },
      {
        delay: 45000,
        title: '📝 اختبار بلاغة مرحلي جديد 🖋️',
        content: 'تم إدراج اختبار تقييمي تفاعلي لقياس تحصيل البلاغة والبيان بإشراف أ. طارق الهاشمي. اختبر رصيدك الآن!',
        toastMessage: '🔔 تحديث هام: تم إطلاق اختبار تقييمي تفاعلي جديد في مقرر روائع البلاغة العربية بالتنسيق مع أ. طارق الهاشمي!'
      }
    ];

    const activeTimers: NodeJS.Timeout[] = [];

    simulatedEvents.forEach((ev) => {
      const timer = setTimeout(() => {
        // Add to Zustand Notification Store so Navbar Bell counter updates instantly!
        useNotificationStore.getState().addNotification({
          title: ev.title,
          content: ev.content,
          type: 'system'
        });
        // Trigger Toast Notification popup instantly on screen!
        displayToast(ev.toastMessage);
      }, ev.delay);
      activeTimers.push(timer);
    });

    return () => {
      activeTimers.forEach((t) => clearTimeout(t));
    };
  }, [isLoggedIn]);

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

  const handleViewInstructor = (name: string) => {
    setPreviousView(activeView);
    setSelectedInstructorName(name);
    setActiveView('public-profile');
  };

  // Scroll to top on view changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [activeView]);

  // Track the 3 most recently visited views
  useEffect(() => {
    setRecentViews((prev) => {
      const filtered = prev.filter(v => v !== activeView);
      const updated = [activeView, ...filtered].slice(0, 3);
      try {
        localStorage.setItem('athari_recent_views', JSON.stringify(updated));
      } catch (err) {
        console.error('Error saving recent views:', err);
      }
      return updated;
    });
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

  // Implement drag-and-drop functionality for the floating deck component
  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const nextX = e.clientX - dragOffset.x;
      const nextY = e.clientY - dragOffset.y;
      setTempPos({ x: nextX, y: nextY });
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      const nextX = touch.clientX - dragOffset.x;
      const nextY = touch.clientY - dragOffset.y;
      setTempPos({ x: nextX, y: nextY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      const width = window.innerWidth;
      const height = window.innerHeight;
      const deckElement = document.getElementById('preview-floating-deck-inner');
      const rect = deckElement ? deckElement.getBoundingClientRect() : { width: 320, height: 350 };

      const currentCenterX = tempPos.x + rect.width / 2;
      const currentCenterY = tempPos.y + rect.height / 2;

      const distTopLeft = Math.hypot(currentCenterX, currentCenterY);
      const distTopRight = Math.hypot(width - currentCenterX, currentCenterY);
      const distBottomLeft = Math.hypot(currentCenterX, height - currentCenterY);
      const distBottomRight = Math.hypot(width - currentCenterX, height - currentCenterY);

      const minDist = Math.min(distTopLeft, distTopRight, distBottomLeft, distBottomRight);

      let finalCorner: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' = 'bottom-right';
      if (minDist === distTopLeft) {
        finalCorner = 'top-left';
      } else if (minDist === distTopRight) {
        finalCorner = 'top-right';
      } else if (minDist === distBottomLeft) {
        finalCorner = 'bottom-left';
      } else {
        finalCorner = 'bottom-right';
      }

      setDockCorner(finalCorner);
      localStorage.setItem('athari_deck_corner', finalCorner);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging, dragOffset, tempPos]);

  const handleMouseDown = (e: React.MouseEvent<any>) => {
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('select') || target.closest('input')) {
      return;
    }

    const deckElement = document.getElementById('preview-floating-deck-inner') || document.getElementById('open-preview-deck-btn');
    if (!deckElement) return;

    const rect = deckElement.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });

    setTempPos({
      x: rect.left,
      y: rect.top,
    });

    setIsDragging(true);
  };

  const handleTouchStart = (e: React.TouchEvent<any>) => {
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('select') || target.closest('input')) {
      return;
    }

    const deckElement = document.getElementById('preview-floating-deck-inner') || document.getElementById('open-preview-deck-btn');
    if (!deckElement) return;

    const rect = deckElement.getBoundingClientRect();
    const touch = e.touches[0];

    setDragOffset({
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top,
    });

    setTempPos({
      x: rect.left,
      y: rect.top,
    });

    setIsDragging(true);
  };

  const handleCopyLink = () => {
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }).catch(err => {
      console.error('Could not copy deep link:', err);
    });
  };

  let positionClasses = '';
  if (dockCorner === 'bottom-right') positionClasses = 'bottom-6 right-6';
  else if (dockCorner === 'bottom-left') positionClasses = 'bottom-6 left-6';
  else if (dockCorner === 'top-right') positionClasses = 'top-6 right-6';
  else if (dockCorner === 'top-left') positionClasses = 'top-6 left-6';

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
            onViewInstructorProfile={handleViewInstructor}
          />
        )}

        {activeView === 'catalog' && (
          <CourseCatalog 
            initialCategoryFilter={categoryFilter}
            onAddToCart={handleAddToCart}
            cartItems={cartItems}
            onViewCourseDetails={(id) => { setSelectedCourseId(id); setActiveView('course-details'); }}
            onViewInstructorProfile={handleViewInstructor}
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
            onViewInstructorProfile={handleViewInstructor}
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

        {activeView === 'profile-settings' && (
          <ProfileSettings 
            onBackToMain={() => setActiveView(previousView || 'landing')} 
            userName={userName}
            onUpdateUserName={(name) => setUserName(name)}
            onTriggerToast={displayToast}
          />
        )}

        {activeView === 'public-profile' && (
          <PublicProfile 
            instructorName={selectedInstructorName} 
            onBack={() => setActiveView(previousView || 'catalog')} 
            onSelectCourse={(id) => { setSelectedCourseId(id); setActiveView('course-details'); }}
            isLoggedIn={isLoggedIn}
            onStartChat={(name) => {
              // Redirect to Student Dashboard center or simulate messages
              setActiveView('dashboard');
              displayToast(`تم فتح نافذة المراسلة المباشرة والمشورة مع الأستاذ ${name}`);
            }}
          />
        )}

        {!['landing', 'catalog', 'dashboard', 'auth', 'course-details', 'cart-checkout', 'instructor-dashboard', 'admin-dashboard', 'about-contact', 'profile-settings', 'public-profile'].includes(activeView) && (
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
      {showPreviewHelper && (
        <div 
          id="preview-floating-deck"
          className={`fixed z-40 font-sans ${isDragging ? '' : positionClasses}`}
          style={isDragging ? { left: tempPos.x, top: tempPos.y, bottom: 'auto', right: 'auto', position: 'fixed' } : {}}
        >
          <AnimatePresence mode="wait">
            {isMinimized ? (
              <motion.button
                key="minimized-deck"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => {
                  setIsMinimized(false);
                  localStorage.setItem('athari_deck_minimized', 'false');
                }}
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
                className="w-12 h-12 bg-stone-900 text-amber-50 rounded-full border-2 border-amber-500 flex items-center justify-center shadow-2xl hover:scale-105 cursor-grab active:cursor-grabbing hover:bg-stone-850"
                title="توسيع لوحة معاينة الشاشات ⤢ (اضغط واسحب لتغيير الموضع)"
                id="open-preview-deck-btn"
              >
                <Sliders className="w-5 h-5 text-amber-400" />
              </motion.button>
            ) : (
              <motion.div 
                key="expanded-deck"
                initial={{ scale: 0.95, opacity: 0, y: 10 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                id="preview-floating-deck-inner"
                className="bg-stone-900 text-amber-50 py-5 px-5 rounded-3xl border-2 border-amber-500 shadow-2xl space-y-4 max-w-sm text-right relative"
              >
                {/* Grab handle bar */}
                <div 
                  onMouseDown={handleMouseDown}
                  onTouchStart={handleTouchStart}
                  className="flex items-center justify-between border-b border-stone-800 pb-2.5 cursor-grab active:cursor-grabbing select-none"
                  title="اضغط واسحب لإعادة توجيه وتموضع اللوحة"
                >
                  <div className="flex items-center gap-1 text-[10px] text-stone-400 font-semibold">
                    <Move className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                    <span>اسحب لإعادة التموضع</span>
                  </div>
                  
                  <div className="flex items-center gap-1.5 button-group-deck-controls">
                    {/* 1. Copy Link Icon button */}
                    <button
                      type="button"
                      onClick={handleCopyLink}
                      className={`p-1.5 rounded-lg border-0 cursor-pointer transition ${
                        copiedLink ? 'bg-emerald-950 text-emerald-400' : 'bg-stone-800 hover:bg-stone-750 text-stone-300'
                      }`}
                      title={copiedLink ? "تم النسخ!" : "نسخ رابط الصفحة الحالي"}
                      id="copy-deeplink-btn-top"
                    >
                      {copiedLink ? <Check className="w-3.5 h-3.5 animate-bounce" /> : <Link className="w-3.5 h-3.5" />}
                    </button>

                    {/* 2. Minimize button */}
                    <button
                      type="button"
                      onClick={() => {
                        setIsMinimized(true);
                        localStorage.setItem('athari_deck_minimized', 'true');
                      }}
                      className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-750 text-stone-400 hover:text-stone-200 border-0 cursor-pointer"
                      title="تصغير اللوحة"
                      id="minimize-preview-deck-btn"
                    >
                      <Minimize2 className="w-3.5 h-3.5" />
                    </button>

                    {/* 3. Close button */}
                    <button
                      type="button"
                      onClick={() => {
                        setShowPreviewHelper(false);
                        localStorage.setItem('athari_deck_closed', 'true');
                      }}
                      className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-750 text-red-500 hover:text-red-400 border-0 cursor-pointer"
                      title="إغلاق اللوحة تماماً"
                      id="close-preview-deck-btn"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

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

                {/* Recent Views section */}
                {recentViews.length > 0 && (
                  <div className="bg-stone-950 border border-stone-850 p-2 text-right rounded-xl">
                    <div className="text-[9px] text-stone-500 font-bold mb-1">آخر 3 صفحات زرتها مؤخراً:</div>
                    <div className="flex flex-wrap gap-1">
                      {recentViews.map((viewId) => {
                        const label = VIEW_NAMES[viewId] || viewId;
                        return (
                          <button
                            key={viewId}
                            type="button"
                            onClick={() => setActiveView(viewId)}
                            className={`px-1.5 py-0.5 rounded-md text-[9px] font-medium cursor-pointer transition border border-transparent ${
                              viewId === activeView 
                                ? 'bg-orange-850 text-orange-400 border-orange-500/25' 
                                : 'bg-stone-850 hover:bg-stone-800 text-stone-300 shadow-sm'
                            }`}
                          >
                            {label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

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
                    onClick={() => { setIsLoggedIn(true); setActiveView('profile-settings'); }}
                    className={`p-2.5 rounded-xl font-bold text-center transition border-0 cursor-pointer ${
                      activeView === 'profile-settings' ? 'bg-orange-700 text-amber-50' : 'bg-stone-800 hover:bg-stone-750 text-stone-300'
                    }`}
                  >
                    إعدادات الحساب ⚙️
                  </button>

                  <button 
                    onClick={() => { setSelectedInstructorName('م. عبد الرحمن البغدادي'); setActiveView('public-profile'); }}
                    className={`p-2.5 rounded-xl font-bold text-center transition border-0 cursor-pointer ${
                      activeView === 'public-profile' ? 'bg-orange-700 text-amber-50' : 'bg-stone-800 hover:bg-stone-750 text-stone-300'
                    }`}
                  >
                    الملف العام للأستاذ 👤
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

                {/* Helper / QR and Print actions */}
                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <button
                    type="button"
                    onClick={() => setQrModalOpen(true)}
                    className="p-2 rounded-xl font-bold text-center transition border border-stone-800 bg-stone-950 hover:bg-stone-850 text-amber-400 hover:text-amber-300 flex items-center justify-center gap-1 cursor-pointer"
                    title="توليد رمز استجابة سريع (QR) للتصفح المباشر من الجوال"
                    id="generate-qr-btn"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>مزامنة الهاتف 📱</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="p-2 rounded-xl font-bold text-center transition border border-stone-800 bg-stone-950 hover:bg-stone-850 text-stone-200 hover:text-white flex items-center justify-center gap-1 cursor-pointer"
                    title="طباعة محتوى الصفحة أو تفاصيل المسار الحالية"
                    id="print-summary-btn"
                  >
                    <Printer className="w-3.5 h-3.5 text-amber-500" />
                    <span>طباعة ملخص 🖨️</span>
                  </button>
                </div>

                {/* Copy deep link helper button component */}
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className={`w-full py-2.5 px-3 rounded-xl font-bold text-center transition border-0 flex items-center justify-center gap-1.5 cursor-pointer text-[10px] ${
                    copiedLink ? 'bg-emerald-800 text-emerald-50' : 'bg-amber-550 bg-amber-500 hover:bg-amber-600 text-stone-950'
                  }`}
                  title="نسخ رابط الصفحة الحالي لمشاركته والوصول السريع"
                  id="copy-deeplink-btn"
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-3.5 h-3.5 animate-bounce" />
                      <span>تم نسخ رابط الصفحة الحصري! ✓</span>
                    </>
                  ) : (
                    <>
                      <Link className="w-3.5 h-3.5" />
                      <span>نسخ رابط الصفحة الحالي للمشاركة 🔗</span>
                    </>
                  )}
                </button>

                <div className="h-px bg-stone-800" />

                <div className="text-[9px] text-stone-500 text-center">
                  تم تشفير وحماية بوابة الطلاب بنظام التحقق المزدوج بموجب المعايير التراثية.
                </div>

              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* QR Code Modal Overlay */}
      <AnimatePresence>
        {qrModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm" id="qrcode-modal-overlay">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-stone-900 border border-amber-200 dark:border-amber-500/30 rounded-3xl p-6 max-w-sm w-full text-center relative shadow-2xl space-y-4"
            >
              <button
                onClick={() => setQrModalOpen(false)}
                className="absolute top-4 left-4 p-1.5 rounded-full bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-500 dark:text-stone-300 transition border-0 cursor-pointer"
                title="إغلاق النافذة"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="pt-2 text-stone-900 dark:text-amber-50 space-y-1">
                <h3 className="text-sm font-bold flex items-center justify-center gap-1.5">
                  <QrCode className="w-5 h-5 text-amber-550 animate-pulse" />
                  <span>امسح للتصفح عبر الجوال 📲</span>
                </h3>
                <p className="text-[10px] text-stone-500 dark:text-stone-400">
                  قم بمسح رمز الاستجابة السريعة (QR) باستخدام كاميرا الهاتف للمزامنة والتصفح الفوري.
                </p>
              </div>

              {/* QR Container */}
              <div className="bg-amber-50/50 dark:bg-stone-950 p-4 rounded-2xl inline-block border border-amber-100 dark:border-stone-850">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                    typeof window !== 'undefined' ? window.location.href : 'https://ais-dev-h7324ze3xuveuw33rjo7ph-401528177986.europe-west1.run.app'
                  )}&color=451a03&bgcolor=faf4e1`}
                  alt="QR Code"
                  className="w-44 h-44 mx-auto rounded-lg shadow-sm border border-amber-200"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Display Link */}
              <div className="space-y-2">
                <div className="bg-stone-50 dark:bg-stone-950 px-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-800 text-[10px] font-mono break-all text-stone-600 dark:text-stone-300 select-all">
                  {typeof window !== 'undefined' ? window.location.href : 'https://ais-dev-h7324ze3xuveuw33rjo7ph-401528177986.europe-west1.run.app'}
                </div>
                
                <button
                  onClick={handleCopyLink}
                  className={`w-full py-2 px-3 rounded-xl font-bold text-xs transition border-0 flex items-center justify-center gap-1.5 cursor-pointer ${
                    copiedLink ? 'bg-emerald-700 text-white' : 'bg-orange-700 hover:bg-orange-800 text-amber-50'
                  }`}
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-3.5 h-3.5 animate-bounce" />
                      <span>تم نسخ الرابط!</span>
                    </>
                  ) : (
                    <>
                      <Link className="w-3.5 h-3.5" />
                      <span>نسخ رابط الصفحة</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  </ErrorBoundary>
  );
}
