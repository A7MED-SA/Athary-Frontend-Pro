import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BookOpen, ShoppingBag, Menu, X, Landmark, User, Bookmark, LogIn, Award, Bell, Trash2, CheckCheck, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNotificationStore } from '../../stores/notificationStore';
import ThemeSettingsPopover from '../../features/theme/ThemeSettingsPopover';
import { useTheme } from '../../hooks/useTheme';
import { useAppContext } from '../../providers/AppProvider';
import CartDrawer from './CartDrawer';

export default function Navbar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { cartItems, isLoggedIn, userName, handleLogout, cartOpen, setCartOpen } = useAppContext();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const { themeMode, toggleThemeMode } = useTheme();

  const { notifications, markAsRead, markAllAsRead, deleteNotification } = useNotificationStore();
  const unreadCount = useNotificationStore((state) => state.unreadCount());

  const handleMarkAsRead = (id: string) => { markAsRead(id); };
  const handleMarkAllAsRead = () => { markAllAsRead(); };
  const handleDeleteNotif = (id: string) => { deleteNotification(id); };

  const navLinks = [
    { label: 'الرئيسية', path: '/' },
    { label: 'تصفح الدورات', path: '/catalog' },
    { label: 'بوابة الطالب', path: '/dashboard' },
    { label: 'من نحن واتصل بنا', path: '/about' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  return (
    <nav className="sticky top-0 z-50 bg-amber-50/90 backdrop-blur-md border-b border-amber-100 shadow-sm" id="athary-navbar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">

          <div className="flex items-center">
            <button
              onClick={() => { navigate('/'); setMobileMenuOpen(false); }}
              className="flex items-center gap-3 group focus:outline-none"
              id="brand-logo-btn"
            >
              <div className="relative w-12 h-12 bg-orange-700 rounded-xl flex items-center justify-center text-amber-100 shadow-md transform transition-all duration-300 group-hover:scale-105 group-hover:bg-orange-800">
                <svg className="w-8 h-8 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                  <path d="M12 6c0 0-2 2-2 4s2 3 2 5c0-2 2-3 2-5s-2-4-2-4z" fill="currentColor" className="text-amber-400 animate-pulse" />
                </svg>
                <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-500 rounded-full border-2 border-amber-50 flex items-center justify-center">
                  <div className="w-1 h-1 bg-amber-950 rounded-full"></div>
                </div>
              </div>

              <div className="text-right">
                <span className="block text-xl font-bold font-sans text-stone-900 tracking-tight leading-none">
                  منصة <span className="text-orange-700">آثاري</span>
                </span>
                <span className="block text-[10px] font-medium text-amber-600 mt-1">
                  للأصالة والتعليم الإلكتروني المعاصر
                </span>
              </div>
            </button>

            <div className="hidden md:flex mr-10 space-x-reverse space-x-8">
              {navLinks.map((link) => (
                <button
                  key={link.path}
                  onClick={() => { navigate(link.path); setMobileMenuOpen(false); }}
                  className={`relative text-base font-medium px-1 py-2 transition-all duration-200 focus:outline-none ${
                    isActive(link.path)
                      ? 'text-orange-700 font-bold'
                      : 'text-stone-700 hover:text-orange-700'
                  }`}
                  id={`nav-link-${link.path === '/' ? 'landing' : link.path.slice(1)}`}
                >
                  {link.label}
                  {isActive(link.path) && (
                    <span className="absolute bottom-0 inset-x-0 h-0.5 bg-orange-700 rounded-full" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4 animate-fade-in">

            <ThemeSettingsPopover />

            <div className="relative">
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="relative p-2.5 text-stone-700 dark:text-stone-300 hover:text-orange-700 hover:bg-orange-50 dark:hover:bg-stone-900 rounded-full transition-all duration-200 focus:outline-none cursor-pointer"
                title="التنبيهات والمستجدات"
                id="notifications-bell-btn"
              >
                <Bell className="w-6 h-6 stroke-[2]" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-orange-700 text-amber-50 text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full ring-2 ring-amber-50 dark:ring-stone-900 shadow-sm animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {notifOpen && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setNotifOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 15, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      className="absolute left-0 mt-2 w-80 sm:w-96 bg-white dark:bg-stone-900 border border-amber-200/80 dark:border-stone-800 rounded-2xl shadow-xl z-40 text-right overflow-hidden origin-top-left"
                      id="notifications-popover-panel"
                    >
                      <div className="px-4 py-3.5 bg-amber-50/50 dark:bg-stone-950 border-b border-amber-100 dark:border-stone-800 flex items-center justify-between">
                        <span className="font-bold text-xs text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                          <Bell className="w-4 h-4 text-orange-700 dark:text-orange-400" />
                          <span>التحديثات والمستجدات ({notifications.length})</span>
                        </span>
                        {unreadCount > 0 && (
                          <button
                            onClick={handleMarkAllAsRead}
                            className="text-[10px] text-orange-700 hover:text-orange-900 dark:text-amber-500 font-bold hover:underline flex items-center gap-1 cursor-pointer bg-transparent border-0"
                          >
                            <CheckCheck className="w-3.5 h-3.5" />
                            <span>تعيين كقروء</span>
                          </button>
                        )}
                      </div>

                      <div className="max-h-80 overflow-y-auto divide-y divide-amber-100/55 dark:divide-stone-800">
                        {notifications.length === 0 ? (
                          <div className="p-8 text-center text-stone-500 space-y-2">
                            <span className="block text-2xl">✨</span>
                            <p className="text-xs font-bold text-stone-800 dark:text-stone-200">صندوق الوارد نظيف ومبهج!</p>
                            <p className="text-[10px] text-stone-400 dark:text-stone-500">لا توجد إعلانات أو إشعارات غير مقروءة حالياً في المنصة.</p>
                          </div>
                        ) : (
                          notifications.map((notif) => (
                            <div
                              key={notif.id}
                              onClick={() => handleMarkAsRead(notif.id)}
                              className={`p-4 transition duration-150 cursor-pointer flex flex-col justify-between gap-1.5 relative ${
                                notif.read
                                  ? 'bg-white dark:bg-stone-900 hover:bg-stone-50/50 dark:hover:bg-stone-800/30'
                                  : 'bg-orange-50/30 dark:bg-orange-950/15 hover:bg-orange-50/50 dark:hover:bg-orange-950/35'
                              }`}
                            >
                              {!notif.read && (
                                <div className="absolute top-0 right-0 bottom-0 w-1 bg-orange-700" />
                              )}
                              <div className="flex justify-between items-start gap-2">
                                <h4 className={`text-xs font-bold leading-snug ${notif.read ? 'text-stone-800 dark:text-stone-200' : 'text-stone-950 dark:text-stone-50 font-black'}`}>
                                  {notif.title}
                                </h4>
                                <button
                                  onClick={(e) => { e.stopPropagation(); handleDeleteNotif(notif.id); }}
                                  className="text-stone-400 dark:text-stone-500 hover:text-red-700 dark:hover:text-red-400 p-1 rounded hover:bg-stone-100 dark:hover:bg-stone-800 transition shrink-0 cursor-pointer border-0 bg-transparent"
                                  title="حذف التنبيه"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                              <p className="text-[11px] text-stone-600 dark:text-stone-400 leading-relaxed font-light">{notif.content}</p>
                              <span className="text-[9px] text-stone-400 dark:text-stone-500 block self-start">{notif.date}</span>
                            </div>
                          ))
                        )}
                      </div>

                      <div className="p-3 bg-stone-50 dark:bg-stone-950 border-t border-amber-100/60 dark:border-stone-800 text-center">
                        <button
                          onClick={() => { navigate('/dashboard'); setNotifOpen(false); }}
                          className="text-[11px] font-bold text-orange-700 dark:text-amber-500 hover:text-orange-900 transition-colors cursor-pointer bg-transparent border-0"
                        >
                          عرض مركز التنبيهات الكامل بصفحة التحصيل الدراسي ←
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            <button
              onClick={() => setCartOpen(true)}
              className="relative p-2.5 text-stone-700 hover:text-orange-700 hover:bg-orange-50 rounded-full transition-all duration-200 focus:outline-none"
              title="حقيبة الدورات"
              id="cart-btn"
            >
              <ShoppingBag className="w-6 h-6 stroke-[2]" />
              {cartItems.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-orange-700 text-amber-50 text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full ring-2 ring-amber-50 shadow-sm animate-bounce">
                  {cartItems.length}
                </span>
              )}
            </button>

            <div className="hidden sm:flex items-center gap-3">
              {isLoggedIn ? (
                <div className="flex items-center gap-2" id="verified-user-menu">
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="flex items-center gap-2 bg-orange-50 shadow-sm border border-orange-100 hover:bg-orange-100/70 px-4 py-2 rounded-xl transition-all duration-200 text-stone-800"
                  >
                    <div className="w-8 h-8 rounded-full bg-orange-700 text-amber-50 flex items-center justify-center font-bold text-sm">
                      {userName.charAt(0)}
                    </div>
                    <div className="text-right text-xs">
                      <p className="font-semibold text-stone-900">{userName}</p>
                      <p className="text-[10px] text-amber-700">بوابة الطالب</p>
                    </div>
                  </button>

                  <button
                    onClick={() => navigate('/profile')}
                    className="p-2 text-stone-600 hover:text-orange-700 hover:bg-orange-50 border border-stone-200 hover:border-orange-200 rounded-xl transition-all flex items-center gap-1 cursor-pointer"
                    title="إعدادات الحساب والملف الشخصي"
                  >
                    <User className="w-4 h-4 text-orange-700" />
                    <span className="text-xs font-bold leading-none px-1">الملف الشخصي</span>
                  </button>

                  <button
                    onClick={handleLogout}
                    className="text-xs text-stone-500 hover:text-red-700 py-1 px-2 border border-stone-200 hover:border-red-200 rounded-lg transition-all"
                    id="logout-btn"
                  >
                    خروج
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3" id="guest-menu">
                  <button
                    onClick={() => navigate('/auth')}
                    className="text-stone-700 hover:text-orange-700 font-medium text-sm px-4 py-2.5 transition-all focus:outline-none"
                    id="guest-login-btn"
                  >
                    تسجيل الدخول
                  </button>
                  <button
                    onClick={() => navigate('/auth')}
                    className="bg-orange-700 hover:bg-orange-800 text-amber-50 font-semibold text-sm px-5 py-2.5 rounded-xl transition-all shadow-md hover:shadow-lg focus:outline-none"
                    id="guest-start-btn"
                  >
                    ابدأ مجاناً
                  </button>
                </div>
              )}
            </div>

            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-stone-700 hover:text-orange-700 hover:bg-orange-50 rounded-xl transition-all focus:outline-none"
                id="mobile-menu-toggle"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-amber-50 border-b border-amber-100 shadow-inner py-4 px-6 space-y-3" id="mobile-dropdown-menu">
          {navLinks.map((link) => (
            <button
              key={link.path}
              onClick={() => { navigate(link.path); setMobileMenuOpen(false); }}
              className={`block w-full text-right px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                isActive(link.path)
                  ? 'bg-orange-50 text-orange-700 font-bold border-r-4 border-orange-700'
                  : 'text-stone-700 hover:bg-amber-100'
              }`}
              id={`mobile-nav-link-${link.path === '/' ? 'landing' : link.path.slice(1)}`}
            >
              {link.label}
            </button>
          ))}

          <div className="h-px bg-amber-100/80 my-2" />

          <div className="flex flex-col gap-2 pt-2">
            {isLoggedIn ? (
              <div className="space-y-2">
                <div className="flex items-center gap-3 p-2 bg-orange-50/50 rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-orange-700 text-amber-50 flex items-center justify-center font-bold">
                    {userName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-stone-900">{userName}</h3>
                    <p className="text-xs text-stone-500">حساب الطالب المفعل</p>
                  </div>
                </div>
                <button
                  onClick={() => { navigate('/dashboard'); setMobileMenuOpen(false); }}
                  className="w-full text-center bg-orange-100 hover:bg-orange-200 text-orange-800 font-semibold py-3 rounded-xl text-sm transition-all"
                >
                  لوحة التحكم الخاصة بي
                </button>
                <button
                  onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                  className="w-full text-center text-stone-500 hover:text-red-700 py-3 text-sm transition-all"
                >
                  تسجيل الخروج
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={() => { navigate('/auth'); setMobileMenuOpen(false); }}
                  className="w-full text-center text-stone-700 hover:text-orange-700 py-3 font-semibold text-sm transition-all"
                >
                  تسجيل الدخول
                </button>
                <button
                  onClick={() => { navigate('/auth'); setMobileMenuOpen(false); }}
                  className="w-full text-center bg-orange-700 hover:bg-orange-800 text-amber-50 py-3 rounded-xl font-semibold text-sm transition-all shadow-md"
                >
                  البدء الآن مجاناً
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
