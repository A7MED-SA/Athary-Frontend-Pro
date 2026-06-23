import { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { useAuth } from '../common/hooks/useAuth';
import { env } from '@/lib/env';
import {
  Mail,
  Lock,
  Phone,
  User,
  ArrowRight,
  Eye,
  EyeOff,
  CheckCircle,
  KeyRound,
  Loader2,
  AlertCircle,
  MapPin,
  Calendar,
  Globe,
  Building,
} from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('البريد الإلكتروني غير صحيح'),
  password: z.string().min(8, 'كلمة المرور يجب أن تكون ٨ أحرف على الأقل'),
});

const registerSchema = z.object({
  firstName: z.string().min(1, 'الاسم الأول مطلوب').max(100),
  lastName: z.string().min(1, 'اسم العائلة مطلوب').max(100),
  email: z.string().email('البريد الإلكتروني غير صحيح'),
  password: z.string().min(8, 'كلمة المرور يجب أن تكون ٨ أحرف على الأقل'),
  confirmPassword: z.string(),
  phoneNumber: z.string().optional(),
  gender: z.enum(['Male', 'Female', 'Other', 'PreferNotToSay']).optional(),
  dateOfBirth: z.string().optional(),
  country: z.string().optional(),
  city: z.string().optional(),
  streetLine1: z.string().optional(),
  postalCode: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'كلمتا المرور غير متطابقتين',
  path: ['confirmPassword'],
});

const forgotPasswordSchema = z.object({
  email: z.string().email('البريد الإلكتروني غير صحيح'),
});

const resetPasswordSchema = z.object({
  newPassword: z.string().min(8, 'كلمة المرور يجب أن تكون ٨ أحرف على الأقل'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'كلمتا المرور غير متطابقتين',
  path: ['confirmPassword'],
});

type LoginFormData = z.infer<typeof loginSchema>;
type RegisterFormData = z.infer<typeof registerSchema>;
type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

type AuthSubView = 'login' | 'register' | 'forgot' | 'verify' | 'reset' | 'success';

export default function AuthPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const {
    login,
    isLoginPending,
    loginError,
    register: registerUser,
    isRegisterPending,
    registerError,
    loginWithOAuth,
    isOAuthPending,
  } = useAuth();

  const [subView, setSubView] = useState<AuthSubView>('login');
  const [registerStep, setRegisterStep] = useState(1);
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      gender: undefined,
      country: '',
      city: '',
      streetLine1: '',
      postalCode: '',
    },
  });

  const forgotForm = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const resetForm = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const password = registerForm.watch('password') || '';
  const checkPasswordStrength = (pass: string) => ({
    minLength: pass.length >= 8,
    hasUpper: /[A-Z]/.test(pass),
    hasLower: /[a-z]/.test(pass),
    hasNumber: /[0-9]/.test(pass),
    hasSpecial: /[^A-Za-z0-9]/.test(pass),
  });
  const strength = checkPasswordStrength(password);
  const strengthCount = Object.values(strength).filter(Boolean).length;

  // Handle email verification and password reset from URL params
  useEffect(() => {
    const token = searchParams.get('token');
    const email = searchParams.get('email');
    const mode = searchParams.get('mode');

    if (token && email && mode === 'reset') {
      setSubView('reset');
      resetForm.setValue('newPassword', '');
    } else if (token && email) {
      setSubView('verify');
    }
  }, [searchParams, resetForm]);

  // Google OAuth initialization
  useEffect(() => {
    const clientId = env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId || clientId === 'YOUR_GOOGLE_CLIENT_ID') return;

    const checkGoogle = setInterval(() => {
      if (window.google?.accounts?.id) {
        clearInterval(checkGoogle);
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: (response: { credential: string }) => {
            loginWithOAuth(
              { idToken: response.credential, provider: 'google' },
              {
                onSuccess: () => {
                  toast.success('تم تسجيل الدخول بنجاح عبر Google');
                  navigate('/dashboard');
                },
                onError: () => {
                  toast.error('فشل تسجيل الدخول عبر Google');
                },
              }
            );
          },
        });
      }
    }, 200);

    return () => clearInterval(checkGoogle);
  }, [loginWithOAuth, navigate]);

  const handleGoogleLogin = () => {
    if (window.google?.accounts?.id) {
      window.google.accounts.id.prompt();
    } else {
      toast.error('خدمة Google غير متوفرة حالياً');
    }
  };

  const handleMicrosoftLogin = async () => {
    const clientId = env.VITE_MICROSOFT_CLIENT_ID;
    if (!clientId || clientId === 'YOUR_MICROSOFT_CLIENT_ID') {
      toast.error('خدمة Microsoft غير مفعلة في بيئة التطوير');
      return;
    }

    try {
      const { PublicClientApplication } = await import('@azure/msal-browser');
      const msalConfig = {
        auth: {
          clientId,
          authority: 'https://login.microsoftonline.com/common',
          redirectUri: window.location.origin,
        },
      };
      const msalInstance = new PublicClientApplication(msalConfig);
      await msalInstance.initialize();

      const loginRequest = {
        scopes: ['openid', 'profile', 'email'],
      };

      const response = await msalInstance.loginPopup(loginRequest);
      if (response.idToken) {
        loginWithOAuth(
          { idToken: response.idToken, provider: 'microsoft' },
          {
            onSuccess: () => {
              toast.success('تم تسجيل الدخول بنجاح عبر Microsoft');
              navigate('/dashboard');
            },
            onError: () => {
              toast.error('فشل تسجيل الدخول عبر Microsoft');
            },
          }
        );
      }
    } catch {
      toast.error('تم إلغاء تسجيل الدخول عبر Microsoft');
    }
  };

  const onLoginSubmit = (data: LoginFormData) => {
    login(data, {
      onSuccess: () => {
        toast.success('تم تسجيل الدخول بنجاح!');
        navigate('/dashboard');
      },
      onError: (error) => {
        toast.error(error?.message || 'فشل تسجيل الدخول');
      },
    });
  };

  const onRegisterSubmit = (data: RegisterFormData) => {
    if (registerStep === 1) {
      setRegisterStep(2);
      return;
    }
    if (registerStep === 2) {
      setRegisterStep(3);
      return;
    }

    registerUser(data, {
      onSuccess: () => {
        toast.success('تم إنشاء الحساب بنجاح! تحقق من بريدك الإلكتروني.');
        setSubView('success');
      },
      onError: (error) => {
        toast.error(error?.message || 'فشل إنشاء الحساب');
      },
    });
  };

  const onForgotSubmit = (data: ForgotPasswordFormData) => {
    import('@/features/auth/services/auth.service').then(({ authService }) =>
      authService.forgotPassword({ email: data.email }).then(() => {
        toast.success('تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني');
        setSubView('login');
      }).catch(() => {
        toast.error('فشل إرسال رابط إعادة التعيين');
      })
    );
  };

  const onResetSubmit = (data: ResetPasswordFormData) => {
    const token = searchParams.get('token');
    const email = searchParams.get('email');
    if (!token || !email) {
      toast.error('رابط إعادة التعيين غير صالح');
      return;
    }

    import('@/features/auth/services/auth.service').then(({ authService }) =>
      authService.resetPassword({ email, token, newPassword: data.newPassword }).then(() => {
        toast.success('تم تغيير كلمة المرور بنجاح!');
        setSubView('login');
      }).catch(() => {
        toast.error('فشل تغيير كلمة المرور');
      })
    );
  };

  return (
    <div className="min-h-screen bg-amber-50 flex flex-col justify-center font-sans py-12 px-4 sm:px-6 lg:px-8" dir="rtl" id="athary-auth-engine">
      <div className="absolute inset-0 bg-heritage-pattern opacity-[0.08] pointer-events-none" />

      <div className="max-w-5xl mx-auto w-full bg-white rounded-3xl overflow-hidden border border-amber-200/60 shadow-2xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12">

          {/* RIGHT PANEL: Desktop Heritage Banner */}
          <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-orange-700 via-orange-800 to-amber-900 text-amber-50 p-10 flex-col justify-between relative overflow-hidden">
            <div className="absolute inset-0 bg-heritage-pattern opacity-12 pointer-events-none" />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/10 backdrop-blur rounded-xl flex items-center justify-center text-amber-300">
                <svg className="w-6 h-6 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                </svg>
              </div>
              <span className="text-xl font-black text-amber-50 tracking-tight">منصة آثاري</span>
            </div>
            <div className="space-y-6 my-12" dir="rtl">
              <span className="text-[10px] uppercase font-bold text-amber-300 bg-white/10 px-3 py-1 rounded-full">رسالة المجلس الأكاديمي</span>
              <p className="text-base sm:text-lg font-serif italic leading-relaxed text-amber-100">
                "مَنْ كَانَ يَرْجُو مَنَازِلَ الأَبْرَارِ فَلْيَحْرِصْ عَلَى نِيلِ الحِكْمَةِ النَّافِعَةِ؛ فَإِنَّ سُلْطَانَ الجسدِ يَزُولُ وَسُلْطَانَ المعْرِفَةِ الخَالِدَةِ يَبْقَى وَيَتَّصِلُ."
              </p>
              <div className="h-0.5 bg-dashed bg-orange-600/60 w-32" />
              <p className="text-xs text-amber-200">الشيخ المحقق: عبد الكريم الأندلسي</p>
            </div>
            <p className="text-[10px] text-orange-200">بوابة آثاري الموحدة للمصادقة وتأمين الحسابات ٢٠٢٦</p>
          </div>

          {/* LEFT PANEL: Auth Forms */}
          <div className="lg:col-span-7 p-8 sm:p-12" id="auth-forms-holder">
            <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
              <div className="w-9 h-9 bg-orange-700 text-amber-50 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                </svg>
              </div>
              <span className="text-lg font-extrabold text-stone-900">منصة آثاري</span>
            </div>

            {/* Error alert */}
            {(loginError || registerError) && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl flex items-start gap-2.5 shadow-sm text-xs">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">فشلت العملية</p>
                  <p className="mt-0.5 opacity-90">{loginError?.message || registerError?.message}</p>
                </div>
              </div>
            )}

            {/* LOGIN VIEW */}
            {subView === 'login' && (
              <div className="space-y-6" id="login-subview">
                <div className="text-right">
                  <h2 className="text-xl font-bold text-stone-900">تسجيل الدخول للمجلس وبوابة الطلاب</h2>
                  <p className="text-xs text-stone-500 font-light mt-1">يمكنك الوصول الآمن ومتابعة دروسك المسجلة وحضور البثوث المباشرة.</p>
                </div>

                <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                  <div className="space-y-1.5 text-right">
                    <label className="text-xs font-bold text-stone-700">البريد الإلكتروني للدارس</label>
                    <div className="relative">
                      <input
                        type="email"
                        placeholder="example@email.com"
                        {...loginForm.register('email')}
                        className="w-full bg-stone-50 text-stone-950 text-xs py-3.5 pr-10 pl-4 rounded-xl border border-amber-200 focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent text-right"
                      />
                      <Mail className="w-4 h-4 text-amber-700 absolute top-4 right-3.5" />
                    </div>
                    {loginForm.formState.errors.email && (
                      <p className="text-[10px] text-red-600 mt-1 font-bold">{loginForm.formState.errors.email.message}</p>
                    )}
                  </div>

                  <div className="space-y-1.5 text-right">
                    <div className="flex justify-between items-center text-xs">
                      <label className="font-bold text-stone-700">كلمة المرور المشفرة</label>
                      <button type="button" onClick={() => setSubView('forgot')} className="text-orange-700 hover:underline font-semibold">نسيت كلمة المرور؟</button>
                    </div>
                    <div className="relative">
                      <input
                        type={showPass ? 'text' : 'password'}
                        placeholder="••••••••"
                        {...loginForm.register('password')}
                        className="w-full bg-stone-50 text-stone-950 text-xs py-3.5 pr-10 pl-10 rounded-xl border border-amber-200 focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent text-right"
                      />
                      <Lock className="w-4 h-4 text-amber-700 absolute top-4 right-3.5" />
                      <button type="button" onClick={() => setShowPass(!showPass)} className="absolute top-4 left-3 text-stone-400 hover:text-stone-600">
                        {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {loginForm.formState.errors.password && (
                      <p className="text-[10px] text-red-600 mt-1 font-bold">{loginForm.formState.errors.password.message}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isLoginPending}
                    className="w-full bg-orange-700 hover:bg-orange-800 text-amber-50 font-bold py-3.5 rounded-xl transition shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-xs"
                    id="login-btn-final"
                  >
                    {isLoginPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'تسجيل الدخول ومتابعة العلم'}
                  </button>
                </form>

                {/* OAuth buttons */}
                <div className="relative my-6 text-center">
                  <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-amber-100"></span></div>
                  <span className="relative bg-white px-4 text-[10px] text-stone-400">أو سجل عبر الهوية الموثقة</span>
                </div>

                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={isOAuthPending}
                  className="w-full border border-stone-200 hover:bg-stone-50 text-stone-800 text-xs font-bold py-3.5 rounded-xl transition flex items-center justify-center gap-2"
                  id="google-login-btn"
                >
                  <svg className="w-4 h-4 ml-1" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.24 10.285V13.4h6.887C18.2 15.614 15.645 18 12.24 18c-3.86 0-7-3.14-7-7s3.14-7 7-7c1.7 0 3.3.6 4.6 1.8l2.4-2.4C17.3 1.7 14.9 1 12.24 1c-5.5 0-10 4.5-10 10s4.5 10 10 10c5.3 0 9.8-3.8 9.8-10 0-.6-.1-1.2-.2-1.7H12.24z"/>
                  </svg>
                  <span>تسجيل الدخول عبر Google</span>
                </button>

                <button
                  type="button"
                  onClick={handleMicrosoftLogin}
                  disabled={isOAuthPending}
                  className="w-full border border-stone-200 hover:bg-stone-50 text-stone-800 text-xs font-bold py-3.5 rounded-xl transition flex items-center justify-center gap-2"
                  id="microsoft-login-btn"
                >
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
                  <button onClick={() => setSubView('register')} className="text-orange-700 font-bold hover:underline">إنشاء حساب جديد بالمنصة</button>
                </div>
              </div>
            )}

            {/* REGISTER VIEW */}
            {subView === 'register' && (
              <div className="space-y-5" id="register-subview">
                <div className="text-right">
                  <h2 className="text-xl font-bold text-stone-900">إنشاء حساب جديد بمنصة آثاري</h2>
                  <p className="text-xs text-stone-500 font-light mt-1">ابدأ رحلتك المعرفية وسجل في الفصول العلمية الممنهجة بالمنصة.</p>
                </div>

                <div className="grid grid-cols-3 gap-2 py-2 text-center" dir="rtl">
                  <div className="space-y-1">
                    <div className={`h-1.5 rounded-full transition ${registerStep >= 1 ? 'bg-orange-700' : 'bg-stone-200'}`} />
                    <span className={`text-[9.5px] font-bold ${registerStep === 1 ? 'text-orange-700' : 'text-stone-400'}`}>١. الحساب والأمان</span>
                  </div>
                  <div className="space-y-1">
                    <div className={`h-1.5 rounded-full transition ${registerStep >= 2 ? 'bg-orange-700' : 'bg-stone-200'}`} />
                    <span className={`text-[9.5px] font-bold ${registerStep === 2 ? 'text-orange-700' : 'text-stone-400'}`}>٢. الهوية والاتصال</span>
                  </div>
                  <div className="space-y-1">
                    <div className={`h-1.5 rounded-full transition ${registerStep >= 3 ? 'bg-orange-700' : 'bg-stone-200'}`} />
                    <span className={`text-[9.5px] font-bold ${registerStep === 3 ? 'text-orange-700' : 'text-stone-400'}`}>٣. محل الإقامة</span>
                  </div>
                </div>

                <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                  {registerStep === 1 && (
                    <div className="space-y-3.5 text-right">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                        <div className="space-y-1 text-right">
                          <label className="text-xs font-bold text-stone-700">الاسم الأول <span className="text-red-500">*</span></label>
                          <div className="relative">
                            <input type="text" placeholder="أحمد" {...registerForm.register('firstName')}
                              className={`w-full bg-stone-50 text-stone-950 text-xs py-3 pr-10 pl-4 rounded-xl border focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent text-right ${registerForm.formState.errors.firstName ? 'border-red-500' : 'border-amber-200'}`} />
                            <User className="w-4 h-4 text-amber-700 absolute top-3.5 right-3.5" />
                          </div>
                          {registerForm.formState.errors.firstName && <p className="text-[10px] text-red-600 mt-1 font-bold">{registerForm.formState.errors.firstName.message}</p>}
                        </div>
                        <div className="space-y-1 text-right">
                          <label className="text-xs font-bold text-stone-700">اسم العائلة <span className="text-red-500">*</span></label>
                          <div className="relative">
                            <input type="text" placeholder="التميمي" {...registerForm.register('lastName')}
                              className={`w-full bg-stone-50 text-stone-950 text-xs py-3 pr-10 pl-4 rounded-xl border focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent text-right ${registerForm.formState.errors.lastName ? 'border-red-500' : 'border-amber-200'}`} />
                            <User className="w-4 h-4 text-amber-700 absolute top-3.5 right-3.5" />
                          </div>
                          {registerForm.formState.errors.lastName && <p className="text-[10px] text-red-600 mt-1 font-bold">{registerForm.formState.errors.lastName.message}</p>}
                        </div>
                      </div>

                      <div className="space-y-1 text-right">
                        <label className="text-xs font-bold text-stone-700">البريد الإلكتروني للدارس <span className="text-red-500">*</span></label>
                        <div className="relative">
                          <input type="email" placeholder="example@email.com" {...registerForm.register('email')}
                            className={`w-full bg-stone-50 text-stone-950 text-xs py-3 pr-10 pl-4 rounded-xl border focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent text-right ${registerForm.formState.errors.email ? 'border-red-500' : 'border-amber-200'}`} />
                          <Mail className="w-4 h-4 text-amber-700 absolute top-3.5 right-3.5" />
                        </div>
                        {registerForm.formState.errors.email && <p className="text-[10px] text-red-600 mt-1 font-bold">{registerForm.formState.errors.email.message}</p>}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                        <div className="space-y-1 text-right">
                          <label className="text-xs font-bold text-stone-700">كلمة المرور <span className="text-red-500">*</span></label>
                          <div className="relative">
                            <input type={showPass ? 'text' : 'password'} placeholder="••••••••" {...registerForm.register('password')}
                              className={`w-full bg-stone-50 text-stone-950 text-xs py-3 pr-10 pl-10 rounded-xl border focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent text-right ${registerForm.formState.errors.password ? 'border-red-500' : 'border-amber-200'}`} />
                            <Lock className="w-4 h-4 text-amber-700 absolute top-3.5 right-3.5" />
                            <button type="button" onClick={() => setShowPass(!showPass)} className="absolute top-3.5 left-3 text-stone-400 hover:text-stone-600">
                              {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                          {registerForm.formState.errors.password && <p className="text-[10px] text-red-600 mt-1 font-bold">{registerForm.formState.errors.password.message}</p>}
                        </div>
                        <div className="space-y-1 text-right">
                          <label className="text-xs font-bold text-stone-700">تأكيد كلمة المرور <span className="text-red-500">*</span></label>
                          <div className="relative">
                            <input type={showConfirmPass ? 'text' : 'password'} placeholder="••••••••" {...registerForm.register('confirmPassword')}
                              className={`w-full bg-stone-50 text-stone-950 text-xs py-3 pr-10 pl-10 rounded-xl border focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent text-right ${registerForm.formState.errors.confirmPassword ? 'border-red-500' : 'border-amber-200'}`} />
                            <Lock className="w-4 h-4 text-amber-700 absolute top-3.5 right-3.5" />
                            <button type="button" onClick={() => setShowConfirmPass(!showConfirmPass)} className="absolute top-3.5 left-3 text-stone-400 hover:text-stone-600">
                              {showConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                          {registerForm.formState.errors.confirmPassword && <p className="text-[10px] text-red-600 mt-1 font-bold">{registerForm.formState.errors.confirmPassword.message}</p>}
                        </div>
                      </div>

                      {password.length > 0 && (
                        <div className="p-3 bg-amber-50 rounded-xl text-[10px] space-y-1.5 text-right border border-amber-100">
                          <p className="font-bold text-stone-800">قوة كلمة المرور:</p>
                          <div className="w-full bg-stone-200 h-1 rounded-full overflow-hidden">
                            <div className={`h-full transition-all duration-300 ${strengthCount < 2 ? 'bg-red-500' : strengthCount < 4 ? 'bg-amber-500' : 'bg-teal-600'}`} style={{ width: `${(strengthCount / 5) * 100}%` }} />
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

                  {registerStep === 2 && (
                    <div className="space-y-3.5 text-right">
                      <div className="space-y-1 text-right">
                        <label className="text-xs font-bold text-stone-700">رقم الهاتف</label>
                        <div className="relative">
                          <input type="tel" placeholder="+966 50 123 4567" {...registerForm.register('phoneNumber')}
                            className="w-full bg-stone-50 text-stone-950 text-xs py-3 pr-10 pl-4 rounded-xl border border-amber-200 focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent text-right" />
                          <Phone className="w-4 h-4 text-amber-700 absolute top-3.5 right-3.5" />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                        <div className="space-y-1 text-right">
                          <label className="text-xs font-bold text-stone-700">الجنس</label>
                          <select {...registerForm.register('gender')} className="w-full bg-stone-50 text-stone-950 text-xs py-3 pr-3 pl-4 rounded-xl border border-amber-200 focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent text-right appearance-none cursor-pointer">
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
                            <input type="date" {...registerForm.register('dateOfBirth')}
                              className="w-full bg-stone-50 text-stone-950 text-xs py-3 pr-10 pl-4 rounded-xl border border-amber-200 focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent text-right" />
                            <Calendar className="w-4 h-4 text-amber-700 absolute top-3.5 right-3.5" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {registerStep === 3 && (
                    <div className="space-y-3.5 text-right">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                        <div className="space-y-1 text-right">
                          <label className="text-xs font-bold text-stone-700">الدولة</label>
                          <div className="relative">
                            <input type="text" placeholder="المملكة العربية السعودية" {...registerForm.register('country')}
                              className="w-full bg-stone-50 text-stone-950 text-xs py-3 pr-10 pl-4 rounded-xl border border-amber-200 focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent text-right" />
                            <Globe className="w-4 h-4 text-amber-700 absolute top-3.5 right-3.5" />
                          </div>
                        </div>
                        <div className="space-y-1 text-right">
                          <label className="text-xs font-bold text-stone-700">المدينة</label>
                          <div className="relative">
                            <input type="text" placeholder="الرياض" {...registerForm.register('city')}
                              className="w-full bg-stone-50 text-stone-950 text-xs py-3 pr-10 pl-4 rounded-xl border border-amber-200 focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent text-right" />
                            <Building className="w-4 h-4 text-amber-700 absolute top-3.5 right-3.5" />
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                        <div className="space-y-1 text-right">
                          <label className="text-xs font-bold text-stone-700">اسم الشارع</label>
                          <div className="relative">
                            <input type="text" placeholder="الملز، طريق صلاح الدين" {...registerForm.register('streetLine1')}
                              className="w-full bg-stone-50 text-stone-950 text-xs py-3 pr-10 pl-4 rounded-xl border border-amber-200 focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent text-right" />
                            <MapPin className="w-4 h-4 text-amber-700 absolute top-3.5 right-3.5" />
                          </div>
                        </div>
                        <div className="space-y-1 text-right">
                          <label className="text-xs font-bold text-stone-700">الرمز البريدي</label>
                          <div className="relative">
                            <input type="text" placeholder="11564" {...registerForm.register('postalCode')}
                              className="w-full bg-stone-50 text-stone-950 text-xs py-3 pr-10 pl-4 rounded-xl border border-amber-200 focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent text-right" />
                            <MapPin className="w-4 h-4 text-amber-700 absolute top-3.5 right-3.5" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-4 pt-2">
                    {registerStep > 1 && (
                      <button type="button" onClick={() => setRegisterStep((prev) => prev - 1)}
                        className="w-1/3 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold py-3.5 rounded-xl transition flex items-center justify-center gap-1.5 text-xs cursor-pointer border-0">السابق</button>
                    )}
                    <button type="submit" disabled={isRegisterPending}
                      className={`font-bold py-3.5 rounded-xl transition shadow-md flex items-center justify-center gap-2 text-xs cursor-pointer border-0 ${registerStep > 1 ? 'w-2/3' : 'w-full'} bg-orange-700 hover:bg-orange-800 text-amber-50`}>
                      {isRegisterPending ? <Loader2 className="w-4 h-4 animate-spin" /> : registerStep < 3 ? <span>الخطوة التالية ➔</span> : <span>إنشاء وحجز المقعد الأكاديمي ✓</span>}
                    </button>
                  </div>
                </form>

                <div className="pt-6 border-t border-amber-50 text-center text-xs text-stone-600">
                  <span>لديك حساب بالفعل بالمجلس؟ </span>
                  <button onClick={() => setSubView('login')} className="text-orange-700 font-bold hover:underline cursor-pointer bg-transparent border-0">تسجيل الدخول الآن</button>
                </div>
              </div>
            )}

            {/* FORGOT PASSWORD VIEW */}
            {subView === 'forgot' && (
              <div className="space-y-6" id="forgot-subview">
                <div className="text-center space-y-4">
                  <div className="w-14 h-14 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
                    <KeyRound className="w-6 h-6 stroke-[1.8]" />
                  </div>
                  <h2 className="text-xl font-bold text-stone-900">نسيت كلمة المرور؟</h2>
                  <p className="text-xs text-stone-600 max-w-sm mx-auto leading-relaxed">أدخل بريدك الإلكتروني وسنرسل لك رابط إعادة التعيين.</p>
                </div>
                <form onSubmit={forgotForm.handleSubmit(onForgotSubmit)} className="space-y-4">
                  <div className="space-y-1.5 text-right">
                    <label className="text-xs font-bold text-stone-700">البريد الإلكتروني</label>
                    <div className="relative">
                      <input type="email" placeholder="example@email.com" {...forgotForm.register('email')}
                        className="w-full bg-stone-50 text-stone-950 text-xs py-3.5 pr-10 pl-4 rounded-xl border border-amber-200 focus:outline-none" />
                      <Mail className="w-4 h-4 text-amber-700 absolute top-4 right-3.5" />
                    </div>
                    {forgotForm.formState.errors.email && <p className="text-[10px] text-red-600 mt-1 font-bold">{forgotForm.formState.errors.email.message}</p>}
                  </div>
                  <button type="submit" className="w-full bg-orange-700 hover:bg-orange-800 text-amber-50 font-bold py-3.5 rounded-xl transition text-xs shadow-md">إرسال رابط إعادة التعيين</button>
                </form>
                <div className="pt-6 border-t border-amber-50 text-center text-xs">
                  <button onClick={() => setSubView('login')} className="text-stone-500 hover:text-orange-700 flex items-center gap-1.5 mx-auto hover:underline">
                    <ArrowRight className="w-4 h-4 transform rotate-180" />
                    <span>تذكرت كلمة المرور؟ سجل الدخول</span>
                  </button>
                </div>
              </div>
            )}

            {/* VERIFY EMAIL VIEW */}
            {subView === 'verify' && (
              <div className="space-y-6 text-center py-4" id="verify-subview">
                <div className="w-14 h-14 bg-orange-50 text-orange-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <Mail className="w-6 h-6 animate-pulse" />
                </div>
                <div className="space-y-3">
                  <h2 className="text-xl font-bold text-stone-900">تأكيد البريد الإلكتروني</h2>
                  <p className="text-xs text-stone-600 max-w-sm mx-auto leading-relaxed">جارٍ التحقق من حسابك...</p>
                </div>
                <Loader2 className="w-8 h-8 animate-spin text-orange-700 mx-auto" />
              </div>
            )}

            {/* RESET PASSWORD VIEW */}
            {subView === 'reset' && (
              <div className="space-y-6" id="reset-subview">
                <div className="text-right">
                  <h2 className="text-xl font-bold text-stone-900">إنشاء كلمة مرور جديدة</h2>
                  <p className="text-xs text-stone-500 font-light mt-1">يجب أن تكون كلمة المرور الجديدة مختلفة عن كلمات المرور المستخدمة سابقاً.</p>
                </div>
                <form onSubmit={resetForm.handleSubmit(onResetSubmit)} className="space-y-4">
                  <div className="space-y-1.5 text-right">
                    <label className="text-xs font-bold text-stone-700">كلمة المرور الجديدة</label>
                    <div className="relative">
                      <input type={showPass ? 'text' : 'password'} placeholder="••••••••" {...resetForm.register('newPassword')}
                        className="w-full bg-stone-50 text-stone-950 text-xs py-3.5 pr-10 pl-10 rounded-xl border border-amber-200 focus:outline-none" />
                      <Lock className="w-4 h-4 text-amber-700 absolute top-4 right-3.5" />
                      <button type="button" onClick={() => setShowPass(!showPass)} className="absolute top-4 left-3 text-stone-400">
                        {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {resetForm.formState.errors.newPassword && <p className="text-[10px] text-red-600 mt-1 font-bold">{resetForm.formState.errors.newPassword.message}</p>}
                  </div>
                  <div className="space-y-1.5 text-right">
                    <label className="text-xs font-bold text-stone-700">تأكيد كلمة المرور</label>
                    <div className="relative">
                      <input type={showConfirmPass ? 'text' : 'password'} placeholder="••••••••" {...resetForm.register('confirmPassword')}
                        className="w-full bg-stone-50 text-stone-950 text-xs py-3.5 pr-10 pl-10 rounded-xl border border-amber-200 focus:outline-none" />
                      <Lock className="w-4 h-4 text-amber-700 absolute top-4 right-3.5" />
                      <button type="button" onClick={() => setShowConfirmPass(!showConfirmPass)} className="absolute top-4 left-3 text-stone-400">
                        {showConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {resetForm.formState.errors.confirmPassword && <p className="text-[10px] text-red-600 mt-1 font-bold">{resetForm.formState.errors.confirmPassword.message}</p>}
                  </div>
                  <button type="submit" className="w-full bg-orange-700 hover:bg-orange-800 text-amber-50 font-bold py-3.5 rounded-xl transition text-xs shadow-md">حفظ وتحديث كلمة المرور</button>
                </form>
              </div>
            )}

            {/* SUCCESS VIEW */}
            {subView === 'success' && (
              <div className="space-y-6 text-center py-4" id="success-subview">
                <div className="w-20 h-20 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center mx-auto shadow-inner relative">
                  <span className="absolute inset-0 rounded-full bg-teal-500/10 animate-ping pointer-events-none" />
                  <CheckCircle className="w-10 h-10 stroke-[1.8]" />
                </div>
                <div className="space-y-3">
                  <h2 className="text-2xl font-black text-stone-900">تمت العملية بنجاح!</h2>
                  <p className="text-xs text-stone-600 max-w-sm mx-auto leading-relaxed">تحقق من بريدك الإلكتروني لتأكيد الحساب.</p>
                </div>
                <div className="pt-6">
                  <button onClick={() => setSubView('login')} className="w-full bg-orange-700 hover:bg-orange-800 text-amber-50 font-bold py-4 rounded-xl text-xs transition shadow-md hover:shadow-lg">الذهاب لتسجيل الدخول</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
