import type { ReactNode } from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'destructive' | 'success' | 'warning';
  children?: ReactNode;
}

export function Badge({ className, children, variant = 'default', ...props }: BadgeProps) {
  const baseStyles = "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold border transition-all duration-150 shadow-2xs";
  const variants = {
    default: "border-transparent bg-orange-700 text-amber-50 hover:bg-orange-700",
    secondary: "border-stone-200 bg-stone-100/90 text-stone-700 hover:bg-stone-200",
    outline: "text-stone-800 border-stone-200 bg-white hover:bg-stone-50",
    destructive: "border-transparent bg-red-100 text-red-800 border-red-200 hover:bg-red-200",
    success: "bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100/60",
    warning: "bg-amber-50 border-amber-200 text-amber-800 hover:bg-amber-100/60",
  };
  return (
    <div className={`${baseStyles} ${variants[variant]} ${className ?? ''}`} {...props}>
      {children}
    </div>
  );
}
