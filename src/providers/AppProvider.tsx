import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Course } from '../types';
import { COURSES } from '../data';
import { useNotificationStore } from '../stores/notificationStore';

interface AppContextType {
  cartItems: Course[];
  handleAddToCart: (course: Course) => void;
  handleRemoveFromCart: (id: string) => void;
  handleCheckout: () => void;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (loggedIn: boolean) => void;
  userName: string;
  setUserName: (name: string) => void;
  coursesList: Course[];
  setCoursesList: (courses: Course[]) => void;
  globalToast: string | null;
  displayToast: (msg: string) => void;
  handleLogout: () => void;
  handleLoginSuccess: (name: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
}

export default function AppProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<Course[]>([]);
  const [coursesList, setCoursesList] = useState<Course[]>(COURSES);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [userName, setUserName] = useState('أحمد التميمي');
  const [cartOpen, setCartOpen] = useState(false);
  const [globalToast, setGlobalToast] = useState<string | null>(null);

  const displayToast = (msg: string) => {
    setGlobalToast(msg);
    setTimeout(() => setGlobalToast(null), 4500);
  };

  const handleAddToCart = (course: Course) => {
    const alreadyIn = cartItems.some(item => item.id === course.id);
    if (!alreadyIn) {
      setCartItems([...cartItems, course]);
      displayToast(`أضيفت بنجاح: ${course.title}`);
    } else {
      displayToast('هذه الدورة موجودة مسبقاً في حقيبة التسوق الخاصة بك.');
    }
  };

  const handleRemoveFromCart = (id: string) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    cartItems.forEach(item => {
      const match = COURSES.find(c => c.id === item.id);
      if (match) {
        match.progress = 0;
        match.nextLesson = 'المقدمة التمهيدية وباب التعريف الأكاديمي للجامعة';
      }
    });
    setCartItems([]);
    setCartOpen(false);
    setIsLoggedIn(true);
    navigate('/dashboard');
    displayToast('🎉 تهانينا! تم تأكيد تسجيلك في المسارات وحجز مقعدك بنجاح. تصفح لوحة التحكم للبدء.');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate('/');
    displayToast('تم تسجيل الخروج بنجاح. مجلسك المعرفي مغلق حالياً.');
  };

  const handleLoginSuccess = (name: string) => {
    setIsLoggedIn(true);
    setUserName(name || 'أحمد التميمي');
    displayToast(`مرحباً بك مجدداً يا ${name} في رحلتك المعرفية المفتوحة!`);
  };

  useEffect(() => {
    if (!isLoggedIn) return;
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
        useNotificationStore.getState().addNotification({
          title: ev.title,
          content: ev.content,
          type: 'system'
        });
        displayToast(ev.toastMessage);
      }, ev.delay);
      activeTimers.push(timer);
    });
    return () => { activeTimers.forEach(t => clearTimeout(t)); };
  }, [isLoggedIn]);

  return (
    <AppContext.Provider value={{
      cartItems,
      handleAddToCart,
      handleRemoveFromCart,
      handleCheckout,
      cartOpen,
      setCartOpen,
      isLoggedIn,
      setIsLoggedIn,
      userName,
      setUserName,
      coursesList,
      setCoursesList,
      globalToast,
      displayToast,
      handleLogout,
      handleLoginSuccess,
    }}>
      {children}
    </AppContext.Provider>
  );
}
