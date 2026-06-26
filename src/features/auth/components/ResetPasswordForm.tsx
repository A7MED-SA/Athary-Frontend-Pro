import { UseFormReturn } from 'react-hook-form';
import { KeyRound, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';

interface ResetFormData { code: string; newPassword: string; confirmPassword: string; }

interface ResetPasswordFormProps {
  form: UseFormReturn<ResetFormData>;
  onSubmit: (data: ResetFormData) => void;
  showPass: boolean;
  onTogglePass: () => void;
  showConfirmPass: boolean;
  onToggleConfirmPass: () => void;
  email: string;
  onBackToForgot: () => void;
}

export function ResetPasswordForm({
  form, onSubmit, showPass, onTogglePass, showConfirmPass, onToggleConfirmPass, email, onBackToForgot,
}: ResetPasswordFormProps) {
  return (
    <div className="space-y-6" id="reset-subview">
      <div className="text-right">
        <h2 className="text-xl font-bold text-stone-900">إنشاء كلمة مرور جديدة</h2>
        <p className="text-xs text-stone-500 font-light mt-1 text-right font-sans">
          أدخل رمز التحقق (OTP) المرسل إلى بريدك الإلكتروني{' '}
          <span className="font-bold text-orange-700 select-all" dir="ltr">{email}</span>{' '}
          ثم أدخل كلمة المرور الجديدة.
        </p>
      </div>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5 text-right">
          <label className="text-xs font-bold text-stone-700">رمز التحقق (OTP)</label>
          <div className="relative">
            <input type="text" placeholder="123456" {...form.register('code')}
              className="w-full bg-stone-50 text-stone-950 text-xs py-3.5 pr-10 pl-4 rounded-xl border border-amber-200 focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent text-right" />
            <KeyRound className="w-4 h-4 text-amber-700 absolute top-4 right-3.5" />
          </div>
          {form.formState.errors.code && (
            <p className="text-[10px] text-red-600 mt-1 font-bold">{form.formState.errors.code.message}</p>
          )}
        </div>

        <div className="space-y-1.5 text-right">
          <label className="text-xs font-bold text-stone-700">كلمة المرور الجديدة</label>
          <div className="relative">
            <input type={showPass ? 'text' : 'password'} placeholder="••••••••" {...form.register('newPassword')}
              className="w-full bg-stone-50 text-stone-950 text-xs py-3.5 pr-10 pl-10 rounded-xl border border-amber-200 focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent text-right" />
            <Lock className="w-4 h-4 text-amber-700 absolute top-4 right-3.5" />
            <button type="button" onClick={onTogglePass} className="absolute top-4 left-3 text-stone-400 bg-transparent border-0 cursor-pointer">
              {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {form.formState.errors.newPassword && (
            <p className="text-[10px] text-red-600 mt-1 font-bold">{form.formState.errors.newPassword.message}</p>
          )}
        </div>

        <div className="space-y-1.5 text-right">
          <label className="text-xs font-bold text-stone-700">تأكيد كلمة المرور</label>
          <div className="relative">
            <input type={showConfirmPass ? 'text' : 'password'} placeholder="••••••••" {...form.register('confirmPassword')}
              className="w-full bg-stone-50 text-stone-950 text-xs py-3.5 pr-10 pl-10 rounded-xl border border-amber-200 focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent text-right" />
            <Lock className="w-4 h-4 text-amber-700 absolute top-4 right-3.5" />
            <button type="button" onClick={onToggleConfirmPass} className="absolute top-4 left-3 text-stone-400 bg-transparent border-0 cursor-pointer">
              {showConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {form.formState.errors.confirmPassword && (
            <p className="text-[10px] text-red-600 mt-1 font-bold">{form.formState.errors.confirmPassword.message}</p>
          )}
        </div>

        <button type="submit" className="w-full bg-orange-700 hover:bg-orange-800 text-amber-50 font-bold py-3.5 rounded-xl transition text-xs shadow-md border-0 cursor-pointer">
          حفظ وتحديث كلمة المرور
        </button>
      </form>

      <div className="pt-4 text-center border-t border-amber-50">
        <button type="button" onClick={onBackToForgot}
          className="text-stone-500 hover:text-orange-700 flex items-center gap-1.5 mx-auto hover:underline bg-transparent border-0 cursor-pointer text-xs">
          <ArrowRight className="w-4 h-4 transform rotate-180" />
          <span>الرجوع للخطوة السابقة</span>
        </button>
      </div>
    </div>
  );
}
