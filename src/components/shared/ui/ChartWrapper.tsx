import { ResponsiveContainer } from 'recharts';
import type { ReactNode } from 'react';

export interface ChartWrapperProps {
  children: ReactNode;
  isLoading?: boolean;
  isEmpty?: boolean;
  emptyMessage?: string;
  loadingMessage?: string;
  height?: number | string;
  className?: string;
}

export function ChartWrapper({
  children,
  isLoading,
  isEmpty,
  emptyMessage = 'لا توجد بيانات بعد',
  loadingMessage = 'جاري تحميل البيانات...',
  height = '100%',
  className,
}: ChartWrapperProps) {
  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center text-xs text-stone-400" style={{ height }}>
        {loadingMessage}
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="h-full flex items-center justify-center text-xs text-stone-400" style={{ height }}>
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className={className} style={{ height, width: '100%' }}>
      <ResponsiveContainer width="100%" height="100%">
        {children as JSX.Element}
      </ResponsiveContainer>
    </div>
  );
}
