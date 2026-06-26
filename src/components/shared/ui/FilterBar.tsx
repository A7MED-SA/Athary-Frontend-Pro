import { Search } from 'lucide-react';

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterSelect {
  key: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: FilterOption[];
}

export interface FilterBarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  selects?: FilterSelect[];
  extra?: React.ReactNode;
}

export function FilterBar({
  searchValue,
  onSearchChange,
  searchPlaceholder = 'بحث...',
  selects,
  extra,
}: FilterBarProps) {
  return (
    <div className="bg-white p-5 rounded-3xl border border-amber-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4 text-right">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto flex-1">
        <div className="relative flex-1 max-w-sm">
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full p-2.5 pr-9 text-xs bg-stone-50 text-stone-900 border border-stone-200 rounded-xl focus:outline-none focus:border-orange-600 focus:bg-white text-right leading-none"
          />
          <Search className="absolute right-3 top-3 w-4 h-4 text-stone-400" />
        </div>

        {selects?.map((select) => (
          <div key={select.key} className="flex items-center gap-2">
            <label className="text-[10px] font-bold text-stone-500 whitespace-nowrap shrink-0">{select.label}:</label>
            <select
              value={select.value}
              onChange={(e) => select.onChange(e.target.value)}
              className="p-2 text-xs bg-stone-50 text-stone-900 border border-stone-200 rounded-xl focus:outline-none focus:border-orange-600 leading-normal"
            >
              {select.options.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        ))}
      </div>

      {extra}
    </div>
  );
}
