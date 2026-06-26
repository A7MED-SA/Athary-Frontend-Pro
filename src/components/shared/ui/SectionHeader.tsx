import type { ReactNode } from 'react';

export interface SectionHeaderProps {
  label?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
}

export function SectionHeader({ label, title, description, actions, className }: SectionHeaderProps) {
  return (
    <div className={`text-right border-b border-amber-100 pb-4 ${className ?? ''}`}>
      {label && (
        <span className="text-[10px] text-amber-600 font-black block">{label}</span>
      )}
      <h2 className="text-sm md:text-base font-black text-stone-900 font-serif mt-1">{title}</h2>
      {description && (
        <p className="text-[11px] text-stone-500 font-light mt-1">{description}</p>
      )}
      {actions}
    </div>
  );
}
