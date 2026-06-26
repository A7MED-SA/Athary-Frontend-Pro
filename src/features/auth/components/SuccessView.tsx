import { CheckCircle } from 'lucide-react';

interface SuccessViewProps {
  title?: string;
  message?: string;
  buttonText?: string;
  onAction?: () => void;
}

export function SuccessView({
  title = 'تمت العملية بنجاح!',
  message = 'تحقق من بريدك الإلكتروني لتأكيد الحساب.',
  buttonText = 'الذهاب لتسجيل الدخول',
  onAction,
}: SuccessViewProps) {
  return (
    <div className="space-y-6 text-center py-4" id="success-subview">
      <div className="w-20 h-20 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center mx-auto shadow-inner relative">
        <span className="absolute inset-0 rounded-full bg-teal-500/10 animate-ping pointer-events-none" />
        <CheckCircle className="w-10 h-10 stroke-[1.8]" />
      </div>
      <div className="space-y-3">
        <h2 className="text-2xl font-black text-stone-900">{title}</h2>
        <p className="text-xs text-stone-600 max-w-sm mx-auto leading-relaxed">{message}</p>
      </div>
      {onAction && (
        <div className="pt-6">
          <button onClick={onAction} className="w-full bg-orange-700 hover:bg-orange-800 text-amber-50 font-bold py-4 rounded-xl text-xs transition shadow-md hover:shadow-lg border-0 cursor-pointer">{buttonText}</button>
        </div>
      )}
    </div>
  );
}
