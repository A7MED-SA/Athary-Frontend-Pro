import { Layout, BookOpen, Award, Heart, Bell, GraduationCap, Menu, LogOut } from 'lucide-react';

type DashboardTab = 'overview' | 'my-courses' | 'certificates' | 'favorites' | 'notifications' | 'instructor-apply';

interface StudentSidebarProps {
  activeTab: DashboardTab;
  sidebarCollapsed: boolean;
  onTabChange: (tab: DashboardTab) => void;
  onToggleCollapse: () => void;
  onLogout: () => void;
}

const menuItems = [
  { id: 'overview' as DashboardTab, label: 'نظرة عامة', icon: <Layout className="w-5 h-5" /> },
  { id: 'my-courses' as DashboardTab, label: 'دوراتي المفتوحة', icon: <BookOpen className="w-5 h-5" /> },
  { id: 'certificates' as DashboardTab, label: 'الشهادات والإجازات', icon: <Award className="w-5 h-5" /> },
  { id: 'favorites' as DashboardTab, label: 'المفضلة وطلب الاسترداد', icon: <Heart className="w-5 h-5" /> },
  { id: 'notifications' as DashboardTab, label: 'مركز الرسائل والتنبيهات', icon: <Bell className="w-5 h-5" /> },
  { id: 'instructor-apply' as DashboardTab, label: 'الانضمام كمدرب', icon: <GraduationCap className="w-5 h-5" /> },
];

export function StudentSidebar({ activeTab, sidebarCollapsed, onTabChange, onToggleCollapse, onLogout }: StudentSidebarProps) {
  return (
    <aside
      className={`bg-white border border-amber-200/80 rounded-3xl p-5 flex flex-col justify-between shadow-sm transition-all duration-300 ${
        sidebarCollapsed ? 'w-full md:w-20' : 'w-full md:w-72'
      }`}
      id="dashboard-sidebar"
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-amber-100">
          {!sidebarCollapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-orange-700/10 flex items-center justify-center text-orange-700 font-bold">
                أ
              </div>
              <span className="font-black text-stone-900 text-xs">بوابة الطالب التعليمية</span>
            </div>
          )}
          {sidebarCollapsed && (
            <div className="w-8 h-8 rounded-lg bg-orange-700 text-amber-50 mx-auto flex items-center justify-center font-bold">آ</div>
          )}
          <button
            onClick={onToggleCollapse}
            className="hidden md:block p-1.5 hover:bg-stone-100 rounded-lg text-stone-500"
            title={sidebarCollapsed ? 'توسيع' : 'طي'}
          >
            <Menu className="w-4 h-4 mx-auto" />
          </button>
        </div>

        <nav className="space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { onTabChange(item.id); }}
              className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-xs font-bold transition-all ${
                activeTab === item.id
                  ? 'bg-orange-700 text-amber-50 shadow-md transform hover:translate-x-[-2px]'
                  : 'text-stone-700 hover:bg-orange-50/50 hover:text-orange-950'
              }`}
              id={`sidebar-tab-${item.id}`}
            >
              <span className={activeTab === item.id ? 'text-amber-300' : 'text-stone-500'}>
                {item.icon}
              </span>
              {!sidebarCollapsed && <span>{item.label}</span>}
            </button>
          ))}
        </nav>
      </div>

      <div className="pt-6 border-t border-amber-100 mt-6">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-xs font-bold text-stone-600 hover:bg-red-50 hover:text-red-700 transition"
          id="sidebar-logout-btn"
        >
          <LogOut className="w-5 h-5 text-stone-400" />
          {!sidebarCollapsed && <span>تسجيل الخروج</span>}
        </button>
      </div>
    </aside>
  );
}
