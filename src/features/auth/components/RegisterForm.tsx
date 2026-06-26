import { UseFormReturn } from 'react-hook-form';
import { Loader2, User, Mail, Lock, Eye, EyeOff, Phone, Calendar, Globe, Building, MapPin } from 'lucide-react';

interface RegisterFormData {
  firstName: string; lastName: string; email: string; password: string;
  confirmPassword: string; phoneNumber?: string;
  gender?: string; dateOfBirth?: string; country?: string; city?: string;
  streetLine1?: string; postalCode?: string;
}

interface RegisterFormProps {
  form: UseFormReturn<RegisterFormData>;
  onSubmit: (data: RegisterFormData) => void;
  step: number;
  onPrevStep: () => void;
  showPass: boolean;
  onTogglePass: () => void;
  showConfirmPass: boolean;
  onToggleConfirmPass: () => void;
  password: string;
  strength: Record<string, boolean>;
  strengthCount: number;
  isPending: boolean;
  onLoginClick: () => void;
}

export function RegisterForm({
  form, onSubmit, step, onPrevStep, showPass, onTogglePass,
  showConfirmPass, onToggleConfirmPass, password, strength, strengthCount,
  isPending, onLoginClick,
}: RegisterFormProps) {
  return (
    <div className="space-y-5" id="register-subview">
      <div className="text-right">
        <h2 className="text-xl font-bold text-stone-900">إنشاء حساب جديد بمنصة آثاري</h2>
        <p className="text-xs text-stone-500 font-light mt-1">ابدأ رحلتك المعرفية وسجل في الفصول العلمية الممنهجة بالمنصة.</p>
      </div>

      <div className="grid grid-cols-3 gap-2 py-2 text-center" dir="rtl">
        <div className="space-y-1">
          <div className={`h-1.5 rounded-full transition ${step >= 1 ? 'bg-orange-700' : 'bg-stone-200'}`} />
          <span className={`text-[9.5px] font-bold ${step === 1 ? 'text-orange-700' : 'text-stone-400'}`}>١. الحساب والأمان</span>
        </div>
        <div className="space-y-1">
          <div className={`h-1.5 rounded-full transition ${step >= 2 ? 'bg-orange-700' : 'bg-stone-200'}`} />
          <span className={`text-[9.5px] font-bold ${step === 2 ? 'text-orange-700' : 'text-stone-400'}`}>٢. الهوية والاتصال</span>
        </div>
        <div className="space-y-1">
          <div className={`h-1.5 rounded-full transition ${step >= 3 ? 'bg-orange-700' : 'bg-stone-200'}`} />
          <span className={`text-[9.5px] font-bold ${step === 3 ? 'text-orange-700' : 'text-stone-400'}`}>٣. محل الإقامة</span>
        </div>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {step === 1 && (
          <div className="space-y-3.5 text-right">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <FieldWrapper label="الاسم الأول" error={form.formState.errors.firstName?.message} required>
                <input type="text" placeholder="أحمد" {...form.register('firstName')}
                  className={`w-full bg-stone-50 text-stone-950 text-xs py-3 pr-10 pl-4 rounded-xl border focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent text-right ${form.formState.errors.firstName ? 'border-red-500' : 'border-amber-200'}`} />
                <User className="w-4 h-4 text-amber-700 absolute top-3.5 right-3.5" />
              </FieldWrapper>
              <FieldWrapper label="اسم العائلة" error={form.formState.errors.lastName?.message} required>
                <input type="text" placeholder="التميمي" {...form.register('lastName')}
                  className={`w-full bg-stone-50 text-stone-950 text-xs py-3 pr-10 pl-4 rounded-xl border focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent text-right ${form.formState.errors.lastName ? 'border-red-500' : 'border-amber-200'}`} />
                <User className="w-4 h-4 text-amber-700 absolute top-3.5 right-3.5" />
              </FieldWrapper>
            </div>

            <FieldWrapper label="البريد الإلكتروني للدارس" error={form.formState.errors.email?.message} required>
              <input type="email" placeholder="example@email.com" {...form.register('email')}
                className={`w-full bg-stone-50 text-stone-950 text-xs py-3 pr-10 pl-4 rounded-xl border focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent text-right ${form.formState.errors.email ? 'border-red-500' : 'border-amber-200'}`} />
              <Mail className="w-4 h-4 text-amber-700 absolute top-3.5 right-3.5" />
            </FieldWrapper>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <FieldWrapper label="كلمة المرور" error={form.formState.errors.password?.message} required>
                <input type={showPass ? 'text' : 'password'} placeholder="••••••••" {...form.register('password')}
                  className={`w-full bg-stone-50 text-stone-950 text-xs py-3 pr-10 pl-10 rounded-xl border focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent text-right ${form.formState.errors.password ? 'border-red-500' : 'border-amber-200'}`} />
                <Lock className="w-4 h-4 text-amber-700 absolute top-3.5 right-3.5" />
                <button type="button" onClick={onTogglePass} className="absolute top-3.5 left-3 text-stone-400 hover:text-stone-600 bg-transparent border-0 cursor-pointer">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </FieldWrapper>
              <FieldWrapper label="تأكيد كلمة المرور" error={form.formState.errors.confirmPassword?.message} required>
                <input type={showConfirmPass ? 'text' : 'password'} placeholder="••••••••" {...form.register('confirmPassword')}
                  className={`w-full bg-stone-50 text-stone-950 text-xs py-3 pr-10 pl-10 rounded-xl border focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent text-right ${form.formState.errors.confirmPassword ? 'border-red-500' : 'border-amber-200'}`} />
                <Lock className="w-4 h-4 text-amber-700 absolute top-3.5 right-3.5" />
                <button type="button" onClick={onToggleConfirmPass} className="absolute top-3.5 left-3 text-stone-400 hover:text-stone-600 bg-transparent border-0 cursor-pointer">
                  {showConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </FieldWrapper>
            </div>

            {password.length > 0 && (
              <div className="p-3 bg-amber-50 rounded-xl text-[10px] space-y-1.5 text-right border border-amber-100">
                <p className="font-bold text-stone-800">قوة كلمة المرور:</p>
                <div className="w-full bg-stone-200 h-1 rounded-full overflow-hidden">
                  <div className={`h-full transition-all duration-300 ${strengthCount < 2 ? 'bg-red-500' : strengthCount < 4 ? 'bg-amber-500' : 'bg-teal-600'}`}
                    style={{ width: `${(strengthCount / 5) * 100}%` }} />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 mt-2">
                  <span className={strength.minLength ? 'text-teal-700 font-bold' : 'text-stone-400'}>✓ ٨ أحرف على الأقل</span>
                  <span className={strength.hasUpper ? 'text-teal-700 font-bold' : 'text-stone-400'}>✓ حرف كبير</span>
                  <span className={strength.hasLower ? 'text-teal-700 font-bold' : 'text-stone-400'}>✓ حرف صغير</span>
                  <span className={strength.hasNumber ? 'text-teal-700 font-bold' : 'text-stone-400'}>✓ رقم واحد</span>
                  <span className={strength.hasSpecial ? 'text-teal-700 font-bold' : 'text-stone-400'}>✓ رمز خاص</span>
                </div>
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-3.5 text-right">
            <FieldWrapper label="رقم الهاتف" error={form.formState.errors.phoneNumber?.message}>
              <input type="tel" placeholder="+966 50 123 4567" {...form.register('phoneNumber')}
                className="w-full bg-stone-50 text-stone-950 text-xs py-3 pr-10 pl-4 rounded-xl border border-amber-200 focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent text-right" />
              <Phone className="w-4 h-4 text-amber-700 absolute top-3.5 right-3.5" />
            </FieldWrapper>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <div className="space-y-1 text-right">
                <label className="text-xs font-bold text-stone-700">الجنس</label>
                <select {...form.register('gender')}
                  className="w-full bg-stone-50 text-stone-950 text-xs py-3 pr-3 pl-4 rounded-xl border border-amber-200 focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent text-right appearance-none cursor-pointer">
                  <option value="">اختر...</option>
                  <option value="Male">ذكر</option>
                  <option value="Female">أنثى</option>
                  <option value="Other">أخرى</option>
                  <option value="PreferNotToSay">أفضّل عدم الإفصاح</option>
                </select>
              </div>
              <div className="space-y-1 text-right">
                <label className="text-xs font-bold text-stone-700">تاريخ الميلاد</label>
                <div className="relative">
                  <input type="date" {...form.register('dateOfBirth')}
                    className="w-full bg-stone-50 text-stone-950 text-xs py-3 pr-10 pl-4 rounded-xl border border-amber-200 focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent text-right" />
                  <Calendar className="w-4 h-4 text-amber-700 absolute top-3.5 right-3.5" />
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-3.5 text-right">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <FieldWrapper label="الدولة" error={form.formState.errors.country?.message}>
                <input type="text" placeholder="المملكة العربية السعودية" {...form.register('country')}
                  className="w-full bg-stone-50 text-stone-950 text-xs py-3 pr-10 pl-4 rounded-xl border border-amber-200 focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent text-right" />
                <Globe className="w-4 h-4 text-amber-700 absolute top-3.5 right-3.5" />
              </FieldWrapper>
              <FieldWrapper label="المدينة" error={form.formState.errors.city?.message}>
                <input type="text" placeholder="الرياض" {...form.register('city')}
                  className="w-full bg-stone-50 text-stone-950 text-xs py-3 pr-10 pl-4 rounded-xl border border-amber-200 focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent text-right" />
                <Building className="w-4 h-4 text-amber-700 absolute top-3.5 right-3.5" />
              </FieldWrapper>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <FieldWrapper label="اسم الشارع" error={form.formState.errors.streetLine1?.message}>
                <input type="text" placeholder="الملز، طريق صلاح الدين" {...form.register('streetLine1')}
                  className="w-full bg-stone-50 text-stone-950 text-xs py-3 pr-10 pl-4 rounded-xl border border-amber-200 focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent text-right" />
                <MapPin className="w-4 h-4 text-amber-700 absolute top-3.5 right-3.5" />
              </FieldWrapper>
              <FieldWrapper label="الرمز البريدي" error={form.formState.errors.postalCode?.message}>
                <input type="text" placeholder="11564" {...form.register('postalCode')}
                  className="w-full bg-stone-50 text-stone-950 text-xs py-3 pr-10 pl-4 rounded-xl border border-amber-200 focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent text-right" />
                <MapPin className="w-4 h-4 text-amber-700 absolute top-3.5 right-3.5" />
              </FieldWrapper>
            </div>
          </div>
        )}

        <div className="flex gap-4 pt-2">
          {step > 1 && (
            <button type="button" onClick={onPrevStep}
              className="w-1/3 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold py-3.5 rounded-xl transition flex items-center justify-center gap-1.5 text-xs cursor-pointer border-0">السابق</button>
          )}
          <button type="submit" disabled={isPending}
            className={`font-bold py-3.5 rounded-xl transition shadow-md flex items-center justify-center gap-2 text-xs cursor-pointer border-0 ${step > 1 ? 'w-2/3' : 'w-full'} bg-orange-700 hover:bg-orange-800 text-amber-50`}>
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : step < 3 ? <span>الخطوة التالية ➔</span> : <span>إنشاء وحجز المقعد الأكاديمي ✓</span>}
          </button>
        </div>
      </form>

      <div className="pt-6 border-t border-amber-50 text-center text-xs text-stone-600">
        <span>لديك حساب بالفعل بالمجلس؟ </span>
        <button onClick={onLoginClick} className="text-orange-700 font-bold hover:underline cursor-pointer bg-transparent border-0">تسجيل الدخول الآن</button>
      </div>
    </div>
  );
}

function FieldWrapper({ label, error, required, children }: { label: string; error?: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="space-y-1 text-right">
      <label className="text-xs font-bold text-stone-700">{label}{required && <span className="text-red-500"> *</span>}</label>
      <div className="relative">{children}</div>
      {error && <p className="text-[10px] text-red-600 mt-1 font-bold">{error}</p>}
    </div>
  );
}
