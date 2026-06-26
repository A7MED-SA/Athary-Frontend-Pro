import { FileX } from 'lucide-react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className = '',
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center p-12 text-center ${className}`}
    >
      <div className="mb-4 text-stone-400 dark:text-stone-500">
        {icon || <FileX className="h-16 w-16" />}
      </div>
      <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100 mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-stone-600 dark:text-stone-400 mb-4 max-w-sm">
          {description}
        </p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className="inline-flex items-center gap-2 rounded-lg bg-orange-700 hover:bg-orange-800 py-2 text-sm font-medium text-white transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
