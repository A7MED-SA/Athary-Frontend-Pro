import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Toaster } from 'sonner';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import CartDrawer from '../components/layout/CartDrawer';
import ErrorBoundary from '../components/layout/ErrorBoundary';
import AppProvider, { useAppContext } from '../providers/AppProvider';

function LayoutContent() {
  const { pathname } = useLocation();
  const { cartOpen, setCartOpen } = useAppContext();

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
        <Toaster position="top-right" dir="rtl" richColors />

        <Navbar />

        <div className="flex-1">
          <Outlet />
        </div>

        <Footer />

        <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
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
