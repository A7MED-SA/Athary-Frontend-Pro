import { motion, AnimatePresence } from 'motion/react';
import { LogOut, Menu, Sparkles } from 'lucide-react';
import type { ReactNode } from 'react';

export interface SidebarNavItem {
  id: string;
  label: string;
  icon: ReactNode;
  badge?: ReactNode;
}

export interface DashboardSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  navItems: SidebarNavItem[];
  branding: { title: string; subtitle: string };
  userName: string;
  userRole: string;
  onLogout: () => void;
  extraTop?: ReactNode;
  sidebarId?: string;
}

export function DashboardSidebar({
  isOpen,
  onToggle,
  activeTab,
  onTabChange,
  navItems,
  branding,
  userName,
  userRole,
  onLogout,
  extraTop,
  sidebarId,
}: DashboardSidebarProps) {
  const initials = userName ? userName.charAt(0) : 'م';

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.aside
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: 280 }}
          exit={{ opacity: 0, width: 0 }}
          className="hidden lg:flex flex-col bg-[var(--color-contrast)] text-[var(--color-contrast-foreground)] border-l border-[var(--color-contrast-border)] min-h-screen px-4 py-8 justify-between sticky top-0"
          id={sidebarId}
        >
          <div className="space-y-6">
            <div className="flex items-center gap-3 px-2 border-b border-orange-900 pb-5">
              <div className="w-10 h-10 rounded-xl bg-orange-700 flex items-center justify-center shadow-lg border border-orange-600">
                <Sparkles className="w-5 h-5 text-amber-50" />
              </div>
              <div>
                <h2 className="font-extrabold text-[#fbbf24] text-sm tracking-tight">{branding.title}</h2>
                <p className="text-[10px] text-stone-300 font-light">{branding.subtitle}</p>
              </div>
            </div>

            {extraTop}

            <nav className="space-y-1.5 pt-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center justify-between gap-3 px-3 py-3 rounded-xl transition text-right text-xs font-bold border-0 cursor-pointer ${
                    activeTab === item.id
                      ? 'bg-orange-800 text-amber-200'
                      : 'bg-transparent text-stone-300 hover:bg-orange-900/40 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-orange-500">{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                  {item.badge}
                </button>
              ))}
            </nav>
          </div>

          <div className="pt-6 border-t border-orange-900 space-y-4">
            <div className="flex items-center gap-3 px-1">
              <div className="w-9 h-9 rounded-full bg-orange-700 flex items-center justify-center text-xs font-bold text-amber-50">
                {initials}
              </div>
              <div>
                <h4 className="text-xs font-black text-amber-50">{userName}</h4>
                <p className="text-[10px] text-[#fbbf24]">{userRole}</p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400 hover:bg-red-950/40 hover:text-red-300 transition text-right text-xs font-semibold cursor-pointer border-0 bg-transparent"
            >
              <LogOut className="w-4 h-4" />
              <span>تسجيل الخروج</span>
            </button>
          </div>

          <button
            onClick={onToggle}
            className="p-1.5 bg-white border border-amber-200/60 rounded-lg text-stone-700 hover:bg-amber-50 lg:flex items-center justify-center cursor-pointer transition hidden mt-4"
            title="تبديل القائمة الجانبية"
          >
            <Menu className="w-4 h-4" />
          </button>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
