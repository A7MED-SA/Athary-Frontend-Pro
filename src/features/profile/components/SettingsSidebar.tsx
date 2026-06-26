import { User, Phone, MapPin, Shield, Bell, ArrowRight } from 'lucide-react';

type SettingsTab = 'personal' | 'phones' | 'addresses' | 'security' | 'notifications';

interface SettingsSidebarProps {
  activeTab: SettingsTab;
  onTabChange: (tab: SettingsTab) => void;
  onNavigateBack: () => void;
}

const tabs: { id: SettingsTab; label: string; icon: React.ReactNode }[] = [
  { id: 'personal', label: 'المعلومات الشخصية', icon: <User className="w-4 h-4" /> },
  { id: 'phones', label: 'أرقام الهواتف', icon: <Phone className="w-4 h-4" /> },
  { id: 'addresses', label: 'العناوين المسجلة', icon: <MapPin className="w-4 h-4" /> },
  { id: 'security', label: 'الأمان والجلسات', icon: <Shield className="w-4 h-4" /> },
  { id: 'notifications', label: 'تفضيلات الإشعارات', icon: <Bell className="w-4 h-4" /> },
];

export function SettingsSidebar({ activeTab, onTabChange, onNavigateBack }: SettingsSidebarProps) {
  return (
    <div className="bg-white rounded-3xl border border-stone-200/60 p-4 shadow-sm">
      <div className="p-3 border-b border-stone-100 mb-2">
        <h2 className="text-xs font-black text-orange-950 font-serif tracking-tight">إعدادات البوابة الشريفة</h2>
        <p className="text-[10px] text-stone-400 mt-1">إدارة معلومات الباحث وأمان الحساب</p>
      </div>

      <nav className="flex flex-row lg:flex-col overflow-x-auto gap-1 pb-2 lg:pb-0 scrollbar-none">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`w-full text-right px-4.5 py-3 rounded-2xl text-xs font-black transition border-0 cursor-pointer flex items-center gap-3 shrink-0 ${
              activeTab === tab.id
                ? 'bg-orange-700 text-amber-50 shadow-xs'
                : 'text-stone-600 hover:bg-stone-50 hover:bg-stone-100 bg-transparent'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}

        <div className="h-0.5 bg-stone-100 my-2 hidden lg:block" />

        <button
          onClick={onNavigateBack}
          className="w-full text-right px-4.5 py-3 rounded-2xl text-xs font-extrabold text-orange-900 hover:bg-amber-50 bg-transparent transition border-0 cursor-pointer flex items-center gap-3 shrink-0"
        >
          <ArrowRight className="w-4 h-4 text-orange-700" />
          <span>العودة للرئيسية</span>
        </button>
      </nav>
    </div>
  );
}
