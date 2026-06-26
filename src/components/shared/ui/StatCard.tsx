import type { ReactNode } from 'react';

export interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string;
  trend?: ReactNode;
  variant?: 'emerald' | 'amber' | 'orange' | 'blue' | 'teal';
  iconBgClassName?: string;
  iconClassName?: string;
  trendBgClassName?: string;
  trendTextClassName?: string;
  bottomBarClassName?: string;
}

const variants: Record<string, { iconBg: string; iconText: string; trendBg: string; trendText: string; bottomBar: string }> = {
  emerald: {
    iconBg: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    iconText: 'text-emerald-700',
    trendBg: 'bg-emerald-50/50 text-emerald-700',
    trendText: 'text-emerald-700',
    bottomBar: 'from-emerald-400 to-teal-500',
  },
  amber: {
    iconBg: 'bg-amber-50 text-amber-900 border-amber-100',
    iconText: 'text-amber-700',
    trendBg: 'text-amber-700',
    trendText: 'text-amber-700',
    bottomBar: 'from-amber-400 to-orange-500',
  },
  orange: {
    iconBg: 'bg-orange-50 text-orange-950 border-orange-100',
    iconText: 'text-orange-700',
    trendBg: 'bg-orange-50 border-orange-100 text-orange-800',
    trendText: 'text-orange-800',
    bottomBar: 'from-orange-400 to-red-500',
  },
  blue: {
    iconBg: 'bg-blue-50 text-blue-800 border-blue-100',
    iconText: 'text-blue-800',
    trendBg: 'text-blue-700',
    trendText: 'text-blue-700',
    bottomBar: 'from-blue-400 to-indigo-500',
  },
  teal: {
    iconBg: 'bg-teal-50 border-teal-100',
    iconText: 'text-teal-700',
    trendBg: 'text-teal-600',
    trendText: 'text-teal-600',
    bottomBar: 'from-teal-400 to-emerald-500',
  },
};

export function StatCard({
  icon,
  label,
  value,
  trend,
  variant = 'emerald',
  iconBgClassName,
  iconClassName,
  trendBgClassName,
  trendTextClassName,
  bottomBarClassName,
}: StatCardProps) {
  const v = variants[variant] ?? variants.emerald;
  return (
    <div className="bg-white p-5 rounded-2xl border border-amber-100/70 shadow-xs flex flex-col justify-between space-y-3 relative overflow-hidden group">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <span className="text-[11px] text-stone-500 font-bold block">{label}</span>
          <span className="text-lg font-mono font-black text-stone-900 leading-none block">{value}</span>
        </div>
        <div className={`p-2.5 rounded-xl border ${iconBgClassName ?? v.iconBg}`}>
          <span className={iconClassName ?? v.iconText}>{icon}</span>
        </div>
      </div>
      {trend && (
        <div className={`flex items-center gap-1.5 text-[10px] py-1 px-2.5 rounded-lg w-fit ${trendBgClassName ?? v.trendBg}`}>
          <span className={trendTextClassName ?? v.trendText}>{trend}</span>
        </div>
      )}
      <div className={`absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r ${bottomBarClassName ?? v.bottomBar}`} />
    </div>
  );
}
