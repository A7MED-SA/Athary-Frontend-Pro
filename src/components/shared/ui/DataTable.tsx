import type { ReactNode } from 'react';

export interface Column<T> {
  key: string;
  header: string;
  width?: string;
  render: (item: T) => ReactNode;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  onRowClick?: (item: T) => void;
  isLoading?: boolean;
  emptyMessage?: string;
  wrapperClassName?: string;
  headerExtra?: ReactNode;
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  onRowClick,
  isLoading,
  emptyMessage = 'لا توجد بيانات',
  wrapperClassName,
  headerExtra,
}: DataTableProps<T>) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-3xl border border-amber-200/80 shadow-xs overflow-hidden">
        <div className="p-12 text-center text-xs text-stone-400">جاري التحميل...</div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-3xl border border-amber-200/80 shadow-xs overflow-hidden ${wrapperClassName ?? ''}`}>
      {headerExtra}
      <div className="overflow-x-auto text-right">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-stone-50/80 text-stone-600 font-bold border-b border-stone-200 text-right">
              {columns.map((col) => (
                <th key={col.key} className="p-4" style={col.width ? { width: col.width } : undefined}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="p-12 text-center text-stone-400 text-xs">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr
                  key={keyExtractor(item)}
                  onClick={() => onRowClick?.(item)}
                  className={onRowClick ? 'cursor-pointer hover:bg-amber-50/10 transition' : 'hover:bg-amber-50/10 transition'}
                >
                  {columns.map((col) => (
                    <td key={col.key} className="p-4">
                      {col.render(item)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
