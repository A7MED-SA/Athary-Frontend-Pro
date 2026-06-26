import { UseFormReturn } from 'react-hook-form';
import { KeyRound, Mail, ArrowRight } from 'lucide-react';

interface ForgotFormData { email: string }

interface ForgotPasswordFormProps {
  form: UseFormReturn<ForgotFormData>;
  onSubmit: (data: ForgotFormData) => void;
  onBackToLogin: () => void;
}

export function ForgotPasswordForm({ form, onSubmit, onBackToLogin }: ForgotPasswordFormProps) {
  return (
    <div className="space-y-6" id="forgot-subview">
      <div className="text-center space-y-4">
        <div className="w-14 h-14 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <KeyRound className="w-6 h-6 stroke-[1.8]" />
        </div>
        <h2 className="text-xl font-bold text-stone-900">نسيت كلمة المرور؟</h2>
        <p className="text-xs text-stone-600 max-w-sm mx-auto leading-relaxed">أدخل بريدك الإلكتروني وسنرسل لك رابط إعادة التعيين.</p>
      </div>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5 text-right">
          <label className="text-xs font-bold text-stone-700">البريد الإلكتروني</label>
          <div className="relative">
            <input type="email" placeholder="example@email.com" {...form.register('email')}
              className="w-full bg-stone-50 text-stone-950 text-xs py-3.5 pr-10 pl-4 rounded-xl border border-amber-200 focus:outline-none" />
            <Mail className="w-4 h-4 text-amber-700 absolute top-4 right-3.5" />
          </div>
          {form.formState.errors.email && <p className="text-[10px] text-red-600 mt-1 font-bold">{form.formState.errors.email.message}</p>}
        </div>
        <button type="submit" className="w-full bg-orange-700 hover:bg-orange-800 text-amber-50 font-bold py-3.5 rounded-xl transition text-xs shadow-md border-0 cursor-pointer">إرسال رابط إعادة التعيين</button>
      </form>
      <div className="pt-6 border-t border-amber-50 text-center text-xs">
        <button onClick={onBackToLogin} className="text-stone-500 hover:text-orange-700 flex items-center gap-1.5 mx-auto hover:underline bg-transparent border-0 cursor-pointer">
          <ArrowRight className="w-4 h-4 transform rotate-180" />
          <span>تذكرت كلمة المرور؟ سجل الدخول</span>
        </button>
      </div>
    </div>
  );
}
