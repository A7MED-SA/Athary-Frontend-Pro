import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import CartDrawer from '../components/layout/CartDrawer';
import ErrorBoundary from '../components/layout/ErrorBoundary';
import AppProvider, { useAppContext } from '../providers/AppProvider';

function LayoutContent() {
  const { pathname } = useLocation();
  const { globalToast, cartOpen } = useAppContext();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  useEffect(() => {
    const applyTheme = () => {
      const savedMode = localStorage.getItem('theme-mode') || 'light';
      const savedTheme = localStorage.getItem('theme-color') || 'default';
      if (savedMode === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      document.documentElement.classList.remove('theme-gold', 'theme-forest', 'theme-graphite');
      let mappedClass = '';
      if (savedTheme === 'gold' || savedTheme === 'theme-gold') mappedClass = 'theme-gold';
      else if (savedTheme === 'forest' || savedTheme === 'theme-forest') mappedClass = 'theme-forest';
      else if (savedTheme === 'graphite' || savedTheme === 'theme-graphite') mappedClass = 'theme-graphite';
      if (mappedClass) document.documentElement.classList.add(mappedClass);
    };
    applyTheme();
    window.addEventListener('theme-changed', applyTheme);
    return () => window.removeEventListener('theme-changed', applyTheme);
  }, []);

  return (
    <ErrorBoundary>
      <div className="min-h-screen flex flex-col bg-[var(--color-background)] text-[var(--color-foreground)] relative antialiased transition-colors duration-250 selection:bg-[var(--color-muted)] selection:text-[var(--color-foreground)]" dir="rtl">

        {globalToast && (
          <div className="fixed top-24 left-6 z-50 bg-stone-900 text-amber-50 px-5 py-4 rounded-2xl shadow-xl max-w-sm flex items-center gap-3 animate-slide-in border-r-4 border-amber-500">
            <div className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <p className="text-xs font-semibold leading-tight">{globalToast}</p>
          </div>
        )}

        <Navbar />

        <div className="flex-1">
          <Outlet />
        </div>

        <Footer />

        {cartOpen && <CartDrawer />}
      </div>
    </ErrorBoundary>
  );
}

export default function RootLayout() {
  return (
    <AppProvider>
      <LayoutContent />
    </AppProvider>
  );
}
