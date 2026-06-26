import { UseFormReturn } from 'react-hook-form';
import { Loader2, Mail, Lock, Eye, EyeOff } from 'lucide-react';

interface LoginFormData {
  email: string;
  password: string;
}

interface LoginFormProps {
  form: UseFormReturn<LoginFormData>;
  onSubmit: (data: LoginFormData) => void;
  showPass: boolean;
  onTogglePass: () => void;
  isPending: boolean;
  onForgotClick: () => void;
  onRegisterClick: () => void;
  onGoogleLogin: () => void;
  onMicrosoftLogin: () => void;
  isOAuthPending: boolean;
}

export function LoginForm({
  form, onSubmit, showPass, onTogglePass, isPending,
  onForgotClick, onRegisterClick, onGoogleLogin, onMicrosoftLogin, isOAuthPending,
}: LoginFormProps) {
  return (
    <div className="space-y-6" id="login-subview">
      <div className="text-right">
        <h2 className="text-xl font-bold text-stone-900">تسجيل الدخول للمجلس وبوابة الطلاب</h2>
        <p className="text-xs text-stone-500 font-light mt-1">يمكنك الوصول الآمن ومتابعة دروسك المسجلة وحضور البثوث المباشرة.</p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5 text-right">
          <label className="text-xs font-bold text-stone-700">البريد الإلكتروني للدارس</label>
          <div className="relative">
            <input type="email" placeholder="example@email.com" {...form.register('email')}
              className="w-full bg-stone-50 text-stone-950 text-xs py-3.5 pr-10 pl-4 rounded-xl border border-amber-200 focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent text-right" />
            <Mail className="w-4 h-4 text-amber-700 absolute top-4 right-3.5" />
          </div>
          {form.formState.errors.email && (
            <p className="text-[10px] text-red-600 mt-1 font-bold">{form.formState.errors.email.message}</p>
          )}
        </div>

        <div className="space-y-1.5 text-right">
          <div className="flex justify-between items-center text-xs">
            <label className="font-bold text-stone-700">كلمة المرور المشفرة</label>
            <button type="button" onClick={onForgotClick} className="text-orange-700 hover:underline font-semibold bg-transparent border-0 cursor-pointer">نسيت كلمة المرور؟</button>
          </div>
          <div className="relative">
            <input type={showPass ? 'text' : 'password'} placeholder="••••••••" {...form.register('password')}
              className="w-full bg-stone-50 text-stone-950 text-xs py-3.5 pr-10 pl-10 rounded-xl border border-amber-200 focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent text-right" />
            <Lock className="w-4 h-4 text-amber-700 absolute top-4 right-3.5" />
            <button type="button" onClick={onTogglePass} className="absolute top-4 left-3 text-stone-400 hover:text-stone-600 bg-transparent border-0 cursor-pointer">
              {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {form.formState.errors.password && (
            <p className="text-[10px] text-red-600 mt-1 font-bold">{form.formState.errors.password.message}</p>
          )}
        </div>

        <button type="submit" disabled={isPending}
          className="w-full bg-orange-700 hover:bg-orange-800 text-amber-50 font-bold py-3.5 rounded-xl transition shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-xs border-0 cursor-pointer"
          id="login-btn-final">
          {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'تسجيل الدخول ومتابعة العلم'}
        </button>
      </form>

      <div className="relative my-6 text-center">
        <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-amber-100" /></div>
        <span className="relative bg-white px-4 text-[10px] text-stone-400">أو سجل عبر الهوية الموثقة</span>
      </div>

      <button type="button" onClick={onGoogleLogin} disabled={isOAuthPending}
        className="w-full border border-stone-200 hover:bg-stone-50 text-stone-800 text-xs font-bold py-3.5 rounded-xl transition flex items-center justify-center gap-2 bg-transparent cursor-pointer"
        id="google-login-btn">
        <svg className="w-4 h-4 ml-1" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.24 10.285V13.4h6.887C18.2 15.614 15.645 18 12.24 18c-3.86 0-7-3.14-7-7s3.14-7 7-7c1.7 0 3.3.6 4.6 1.8l2.4-2.4C17.3 1.7 14.9 1 12.24 1c-5.5 0-10 4.5-10 10s4.5 10 10 10c5.3 0 9.8-3.8 9.8-10 0-.6-.1-1.2-.2-1.7H12.24z"/>
        </svg>
        <span>تسجيل الدخول عبر Google</span>
      </button>

      <button type="button" onClick={onMicrosoftLogin} disabled={isOAuthPending}
        className="w-full border border-stone-200 hover:bg-stone-50 text-stone-800 text-xs font-bold py-3.5 rounded-xl transition flex items-center justify-center gap-2 bg-transparent cursor-pointer"
        id="microsoft-login-btn">
        <svg className="w-4 h-4 ml-1" viewBox="0 0 23 23" fill="currentColor">
          <path fill="#f35325" d="M1 1h10v10H1z"/>
          <path fill="#81bc06" d="M12 1h10v10H12z"/>
          <path fill="#05a6f0" d="M1 12h10v10H1z"/>
          <path fill="#ffba08" d="M12 12h10v10H12z"/>
        </svg>
        <span>تسجيل الدخول عبر Microsoft</span>
      </button>

      <div className="pt-6 border-t border-amber-50 text-center text-xs text-stone-600">
        <span>ليس لديك حساب بعد؟ </span>
        <button onClick={onRegisterClick} className="text-orange-700 font-bold hover:underline bg-transparent border-0 cursor-pointer">إنشاء حساب جديد بالمنصة</button>
      </div>
    </div>
  );
}
