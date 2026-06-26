import type { ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, X } from 'lucide-react';

export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  icon?: ReactNode;
  children?: ReactNode;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'تأكيد',
  cancelText = 'إلغاء',
  variant = 'danger',
  icon,
  children,
}: ConfirmModalProps) {
  const variantStyles = {
    danger: { iconBg: 'bg-red-50', iconText: 'text-red-700', btn: 'bg-red-600 hover:bg-red-700 text-white' },
    warning: { iconBg: 'bg-amber-50', iconText: 'text-amber-700', btn: 'bg-amber-600 hover:bg-amber-700 text-white' },
    info: { iconBg: 'bg-blue-50', iconText: 'text-blue-700', btn: 'bg-orange-700 hover:bg-orange-800 text-amber-50' },
  };
  const s = variantStyles[variant];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-stone-900/60 backdrop-blur-xs cursor-pointer"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-md bg-white border border-amber-200/80 rounded-3xl shadow-xl p-6 text-right z-10"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-2.5 rounded-xl ${s.iconBg}`}>
                {icon ?? <AlertTriangle className={`w-5 h-5 ${s.iconText}`} />}
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-stone-100 transition text-stone-400 hover:text-stone-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <h3 className="text-sm font-black text-stone-900 mb-1">{title}</h3>
            <p className="text-xs text-stone-500 leading-relaxed mb-5">{message}</p>
            {children}
            <div className="flex gap-2 justify-start mt-6">
              <button
                onClick={onClose}
                className="px-5 py-2 text-xs font-bold rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-50 transition"
              >
                {cancelText}
              </button>
              <button
                onClick={onConfirm}
                className={`px-5 py-2 text-xs font-bold rounded-xl transition ${s.btn}`}
              >
                {confirmText}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
