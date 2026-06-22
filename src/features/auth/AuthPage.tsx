import React, { useState, useRef, useEffect } from 'react';
import { AuthSubView, ViewType } from '../../types';
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
  Check
} from 'lucide-react';

interface AuthPageProps {
  onLoginSuccess: (name: string) => void;
  setActiveView: (view: ViewType) => void;
}

export default function AuthPage({ onLoginSuccess, setActiveView }: AuthPageProps) {
  const [subView, setSubView] = useState<AuthSubView>('login');
  
  // Custom form input states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // New registration fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState('');
  const [dob, setDob] = useState('');
  const [country, setCountry] = useState('المملكة العربية السعودية');
  const [city, setCity] = useState('');
  const [streetLine1, setStreetLine1] = useState('');
  const [postalCode, setPostalCode] = useState('');
  
  // Registration current multi-step state (1, 2, 3)
  const [registerStep, setRegisterStep] = useState(1);
  
  // Password Visibility toggles
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  // Common UI State Indicators
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Validation errors state
  const [validationErrors, setValidationErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
    phone?: string;
    firstName?: string;
    lastName?: string;
    postalCode?: string;
  }>({});

  // Restore registration draft from localStorage on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem('athari_registration_draft');
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft);
        if (parsed.email) setEmail(parsed.email);
        if (parsed.password) setPassword(parsed.password);
        if (parsed.confirmPassword) setConfirmPassword(parsed.confirmPassword);
        if (parsed.firstName) setFirstName(parsed.firstName);
        if (parsed.lastName) setLastName(parsed.lastName);
        if (parsed.phone) setPhone(parsed.phone);
        if (parsed.gender) setGender(parsed.gender);
        if (parsed.dob) setDob(parsed.dob);
        if (parsed.country) setCountry(parsed.country);
        if (parsed.city) setCity(parsed.city);
        if (parsed.streetLine1) setStreetLine1(parsed.streetLine1);
        if (parsed.postalCode) setPostalCode(parsed.postalCode);
        if (parsed.registerStep) setRegisterStep(parsed.registerStep);
        if (parsed.subView) setSubView(parsed.subView);

        // Notify user of restored draft
        setTimeout(() => {
          handleTriggerToast('📝 تم استعادة مسودة التسجيل المحفوظة تلقائياً بنجاح لتجنب فقدان البيانات!');
        }, 800);
      } catch (err) {
        console.error('Failed to restore registration draft:', err);
      }
    }
  }, []);

  // Password Strength checker based on backend Identity rules
  const checkPasswordStrength = (pass: string) => {
    return {
      minLength: pass.length >= 8,
      hasUpper: /[A-Z]/.test(pass),
      hasLower: /[a-z]/.test(pass),
      hasNumber: /[0-9]/.test(pass),
      hasSpecial: /[^A-Za-z0-9]/.test(pass),
    };
  };

  const strength = checkPasswordStrength(password);
  const strengthCount = Object.values(strength).filter(Boolean).length;

  // Auto-save registration draft to localStorage on change
  useEffect(() => {
    if (subView === 'register') {
      const draft = {
        email,
        password,
        confirmPassword,
        firstName,
        lastName,
        phone,
        gender,
        dob,
        country,
        city,
        streetLine1,
        postalCode,
        registerStep,
        subView
      };
      localStorage.setItem('athari_registration_draft', JSON.stringify(draft));
    }
  }, [
    email, password, confirmPassword, firstName, lastName, phone, gender,
    dob, country, city, streetLine1, postalCode, registerStep, subView
  ]);

  // Real-time Form Validation logic
  useEffect(() => {
    const errors: typeof validationErrors = {};
    
    // Email validate
    if (email) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.email = 'شكل البريد الإلكتروني غير صحيح (مثال: student@athari.edu)';
      }
    }

    // First and last names
    if (firstName) {
      if (firstName.trim().length === 0) {
        errors.firstName = 'الاسم الأول مطلوب ولا يمكن تركه فارغاً.';
      } else if (firstName.length > 100) {
        errors.firstName = 'الاسم الأول طويل جداً (الحد الأقصى ١٠٠ حرف).';
      }
    }
    if (lastName) {
      if (lastName.trim().length === 0) {
        errors.lastName = 'اسم العائلة مطلوب ولا يمكن تركه فارغاً.';
      } else if (lastName.length > 100) {
        errors.lastName = 'اسم العائلة طويل جداً (الحد الأقصى ١٠٠ حرف).';
      }
    }

    // Password validate
    if (password) {
      if (password.length < 8) {
        errors.password = 'تتطلب معايير الأمان ٨ أحرف على الأقل لشفرة المرور.';
      } else if (strengthCount < 3) {
        errors.password = 'نوصي بكلمة مرور أقوى (امزج حروفاً وأرقاماً ورموزاً).';
      }
    }

    // Confirm password validate
    if (confirmPassword && password !== confirmPassword) {
      errors.confirmPassword = 'تأكيد كلمة المرور وتطابقها مع المدخل الأول غير صحيح.';
    }

    // Phone validate
    if (phone) {
      if (!/^\+?[0-9\s-]{7,16}$/.test(phone)) {
        errors.phone = 'رقم الجوال المقدم غير صالح (أرقام فقط مع رمز البلد الاختياري).';
      }
    }

    // Postal code validate
    if (postalCode) {
      if (!/^[a-zA-Z0-9\s-]{4,10}$/.test(postalCode)) {
        errors.postalCode = 'الرمز البريدي يجب أن يتكون من ٤ إلى ١٠ حروف أو أرقام.';
      }
    }

    setValidationErrors(errors);
  }, [email, password, confirmPassword, phone, firstName, lastName, postalCode, strengthCount]);

  // OTP 6 digits input state
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(''));
  const otpInputs = useRef<HTMLInputElement[]>([]);

  // Timer countdown for resending Verification code
  const [countdown, setCountdown] = useState(60);

  // Start timer when on OTP subView
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (subView === 'verify' && countdown > 0) {
      interval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [subView, countdown]);

  const handleResendOtp = () => {
    if (countdown === 0) {
      setCountdown(60);
      setErrorMessage(null);
      // Simulate API resend
      alert('تم إعادة إرسال رمز تحقق جديد إلى بريدك الإلكتروني الموفر.');
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    
    if (!email || !password) {
      setErrorMessage('يرجى ملء جميع الحقول المطلوبة لتمكين الدخول.');
      return;
    }

    setLoading(true);
    // Simulate API delay
    setTimeout(() => {
      setLoading(false);
      onLoginSuccess(email.split('@')[0]);
      setSubView('success');
    }, 1200);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (registerStep === 1) {
      if (!firstName.trim() || !lastName.trim() || !email.trim() || !password || !confirmPassword) {
        setErrorMessage('يرجى تعبئة كامل الحقول الأساسية المطلوبة بالخطوة الأولى.');
        return;
      }
      if (validationErrors.firstName || validationErrors.lastName || validationErrors.email || validationErrors.password || validationErrors.confirmPassword) {
        setErrorMessage('يرجى تصحيح الأخطاء المشار إليها باللون الأحمر قبل الانتقال للخطوة التالية.');
        return;
      }
      if (firstName.length > 100 || lastName.length > 100) {
        setErrorMessage('الاسم الأول أو الأخير يجب ألا يتجاوز ١٠٠ حرفاً.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage('عذراً، كلمتا المرور غير متطابقتين، تأكد من المدخلات.');
        return;
      }
      if (strengthCount < 3) {
        setErrorMessage('يرجى توفير كلمة مرور أقوى تناسب المتطلبات الأمنية (حروف وأرقام ورموز).');
        return;
      }
      setFullName(`${firstName.trim()} ${lastName.trim()}`);
      setRegisterStep(2);
      return;
    }

    if (registerStep === 2) {
      if (!phone.trim()) {
        setErrorMessage('يرجى توفير رقم الهاتف للاتصال وتلقي التنبيهات.');
        return;
      }
      if (validationErrors.phone) {
        setErrorMessage('يرجى تصحيح خطأ رقم الهاتف قبل الانتقال للخطوة التالية.');
        return;
      }
      setRegisterStep(3);
      return;
    }

    if (registerStep === 3) {
      if (validationErrors.postalCode) {
        setErrorMessage('يرجى تصحيح خطأ الرمز البريدي قبل إتمام التسجيل.');
        return;
      }
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        // Persist newly registered credentials to simulate state in localStorage for Account Settings!
        const registrationData = {
          email,
          firstName,
          lastName,
          phone,
          gender,
          dob,
          country,
          city,
          streetLine1,
          postalCode,
          fullName: `${firstName} ${lastName}`
        };
        localStorage.setItem('athari_registered_user', JSON.stringify(registrationData));
        // Clear the draft registration as it is now completed
        localStorage.removeItem('athari_registration_draft');
        setSubView('verify'); // Lead to OTP verification screen
      }, 1200);
    }
  };

  const handleOtpChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return;

    const val = element.value;
    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);

    // Auto focus next input
    if (val !== '' && index < 5) {
      otpInputs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
      otpInputs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    if (pastedData.length === 6 && /^\d+$/.test(pastedData)) {
      const splitOtp = pastedData.split('');
      setOtp(splitOtp);
      otpInputs.current[5]?.focus();
    }
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    const completeCode = otp.join('');
    if (completeCode.length < 6) {
      setErrorMessage('يرجى إدخال كامل أرقام الرمز المكون من 6 أرقام لتسهيل التحقق.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubView('success'); // Lead to Celebratory success state
    }, 1000);
  };

  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    if (!email) {
      setErrorMessage('يرجى إدخال بريدك الإلكتروني أولاً.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // Automatically navigate to Reset Password token screen to showcase complete flow
      setSubView('reset');
    }, 1200);
  };

  const handleResetPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (password !== confirmPassword) {
      setErrorMessage('عذراً، كلمتا المرور لا تتطابقان.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubView('success');
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-amber-50 flex flex-col justify-center font-sans py-12 px-4 sm:px-6 lg:px-8" dir="rtl" id="athary-auth-engine">
      
      {/* Background patterns */}
      <div className="absolute inset-0 bg-heritage-pattern opacity-[0.08] pointer-events-none" />

      <div className="max-w-5xl mx-auto w-full bg-white rounded-3xl overflow-hidden border border-amber-200/60 shadow-2xl relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12">
          
          {/* RIGHT PANEL: Desktop Heritage Banner & Quote */}
          <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-orange-700 from-orange-700 via-orange-800 to-amber-900 text-amber-50 p-10 flex-col justify-between relative overflow-hidden">
            <div className="absolute inset-0 bg-heritage-pattern opacity-12 pointer-events-none" />
            
            {/* Logo area */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/10 backdrop-blur rounded-xl flex items-center justify-center text-amber-300">
                <svg className="w-6 h-6 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                </svg>
              </div>
              <span className="text-xl font-black text-amber-50 tracking-tight">منصة آثاري</span>
            </div>

            {/* Quote Block */}
            <div className="space-y-6 my-12" dir="rtl">
              <span className="text-[10px] uppercase font-bold text-amber-300 bg-white/10 px-3 py-1 rounded-full">رسالة المجلس الأكاديمي</span>
              <p className="text-base sm:text-lg font-serif italic leading-relaxed text-amber-100">
                "مَنْ كَانَ يَرْجُو مَنَازِلَ الأَبْرَارِ فَلْيَحْرِصْ عَلَى نِيلِ الحِكْمَةِ النَّافِعَةِ؛ فَإِنَّ سُلْطَانَ الجسدِ يَزُولُ وَسُلْطَانَ المعْرِفَةِ الخَالِدَةِ يَبْقَى وَيَتَّصِلُ."
              </p>
              <div className="h-0.5 bg-dashed bg-orange-600/60 w-32" />
              <p className="text-xs text-amber-200 text-amber-200">الشيخ المحقق: عبد الكريم الأندلسي</p>
            </div>

            {/* Quick status check */}
            <p className="text-[10px] text-orange-200">بوابة آثاري الموحدة للمصادقة وتأمين الحسابات ٢٠٢٦</p>
          </div>

          {/* LEFT PANEL: Dynamic Auth Forms container */}
          <div className="lg:col-span-7 p-8 sm:p-12" id="auth-forms-holder">
            
            {/* Logo for mobile view */}
            <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
              <div className="w-9 h-9 bg-orange-700 text-amber-50 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                </svg>
              </div>
              <span className="text-lg font-extrabold text-stone-900">منصة آثاري</span>
            </div>

            {/* Error alerts from ApiResponse */}
            {errorMessage && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl flex items-start gap-2.5 shadow-sm text-xs">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">فشلت العملية</p>
                  <p className="mt-0.5 opacity-90">{errorMessage}</p>
                </div>
              </div>
            )}

            {/* Form View 1: LOGIN */}
            {subView === 'login' && (
              <div className="space-y-6" id="login-subview">
                <div className="text-right">
                  <h2 className="text-xl font-bold text-stone-900">تسجيل الدخول للمجلس وبوابة الطلاب</h2>
                  <p className="text-xs text-stone-500 font-light mt-1">يمكنك الوصول الآمن ومتابعة دروسك المسجلة وحضور البثوث المباشرة.</p>
                </div>

                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div className="space-y-1.5 text-right">
                    <label className="text-xs font-bold text-stone-700">البريد الإلكتروني للدارس</label>
                    <div className="relative">
                      <input 
                        type="email" 
                        required
                        placeholder="example@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-stone-50 text-stone-950 text-xs py-3.5 pr-10 pl-4 rounded-xl border border-amber-200 focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent text-right"
                      />
                      <Mail className="w-4 h-4 text-amber-700 absolute top-4 right-3.5" />
                    </div>
                  </div>

                  <div className="space-y-1.5 text-right">
                    <div className="flex justify-between items-center text-xs">
                      <label className="font-bold text-stone-700">كلمة المرور المشفرة</label>
                      <button 
                        type="button"
                        onClick={() => setSubView('forgot')}
                        className="text-orange-700 hover:underline font-semibold"
                      >
                        نسيت كلمة المرور؟
                      </button>
                    </div>
                    <div className="relative">
                      <input 
                        type={showPass ? "text" : "password"} 
                        required
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-stone-50 text-stone-950 text-xs py-3.5 pr-10 pl-10 rounded-xl border border-amber-200 focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent text-right"
                      />
                      <Lock className="w-4 h-4 text-amber-700 absolute top-4 right-3.5" />
                      <button
                        type="button"
                        onClick={() => setShowPass(!showPass)}
                        className="absolute top-4 left-3 text-stone-400 hover:text-stone-600"
                      >
                        {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-orange-700 bg-orange-700 hover:bg-orange-800 text-amber-50 font-bold py-3.5 rounded-xl transition shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-xs"
                    id="login-btn-final"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'تسجيل الدخول ومتابعة العلم'}
                  </button>
                </form>

                {/* Google sign-in */}
                <div className="relative my-6 text-center">
                  <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-amber-100"></span></div>
                  <span className="relative bg-white px-4 text-[10px] text-stone-400">أو سجل عبر الهوية الموثقة</span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    handleTriggerToast?.('تسجيل دخول جوجل غير مفعل ببيئة التطوير، جار المحاكاة...');
                    onLoginSuccess('أحمد التميمي');
                    setSubView('success');
                  }}
                  className="w-full border border-stone-200 hover:bg-stone-50 text-stone-800 text-xs font-bold py-3.5 rounded-xl transition flex items-center justify-center gap-2"
                  id="google-login-btn"
                >
                  <svg className="w-4 h-4 ml-1" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.24 10.285V13.4h6.887C18.2 15.614 15.645 18 12.24 18c-3.86 0-7-3.14-7-7s3.14-7 7-7c1.7 0 3.3.6 4.6 1.8l2.4-2.4C17.3 1.7 14.9 1 12.24 1c-5.5 0-10 4.5-10 10s4.5 10 10 10c5.3 0 9.8-3.8 9.8-10 0-.6-.1-1.2-.2-1.7H12.24z"/>
                  </svg>
                  <span>تسجيل الدخول عبر Google</span>
                </button>

                {/* Footer Switch */}
                <div className="pt-6 border-t border-amber-50 text-center text-xs text-stone-600">
                  <span>ليس لديك حساب بعد؟ </span>
                  <button onClick={() => setSubView('register')} className="text-orange-700 font-bold hover:underline">
                    إنشاء حساب جديد بالمنصة
                  </button>
                </div>
              </div>
            )}

            {/* Form View 2: REGISTER */}
            {subView === 'register' && (
              <div className="space-y-5" id="register-subview">
                <div className="text-right">
                  <h2 className="text-xl font-bold text-stone-900">إنشاء حساب جديد بمنصة آثاري</h2>
                  <p className="text-xs text-stone-500 font-light mt-1">ابدأ رحلتك المعرفية وسجل في الفصول العلمية الممنهجة بالمنصة.</p>
                </div>

                {/* WIZARD STEP INDICATOR */}
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

                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                  
                  {/* STEP 1: BASICS & SECURITY */}
                  {registerStep === 1 && (
                    <div className="space-y-3.5 text-right">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                        <div className="space-y-1 text-right">
                          <label className="text-xs font-bold text-stone-700">الاسم الأول <span className="text-red-500">*</span></label>
                          <div className="relative">
                            <input 
                              type="text" 
                              required
                              placeholder="أحمد"
                              value={firstName}
                              onChange={(e) => setFirstName(e.target.value)}
                              className={`w-full bg-stone-50 text-stone-950 text-xs py-3 pr-10 pl-4 rounded-xl border focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent text-right ${
                                validationErrors.firstName ? 'border-red-500 ring-2 ring-red-200' : 'border-amber-200'
                              }`}
                            />
                            <User className="w-4 h-4 text-amber-700 absolute top-3.5 right-3.5" />
                          </div>
                          {validationErrors.firstName && (
                            <p className="text-[10px] text-red-600 mt-1 font-bold">⚠️ {validationErrors.firstName}</p>
                          )}
                        </div>
                        <div className="space-y-1 text-right">
                          <label className="text-xs font-bold text-stone-700">اسم العائلة <span className="text-red-500">*</span></label>
                          <div className="relative">
                            <input 
                              type="text" 
                              required
                              placeholder="التميمي"
                              value={lastName}
                              onChange={(e) => setLastName(e.target.value)}
                              className={`w-full bg-stone-50 text-stone-950 text-xs py-3 pr-10 pl-4 rounded-xl border focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent text-right ${
                                validationErrors.lastName ? 'border-red-500 ring-2 ring-red-200' : 'border-amber-200'
                              }`}
                            />
                            <User className="w-4 h-4 text-amber-700 absolute top-3.5 right-3.5" />
                          </div>
                          {validationErrors.lastName && (
                            <p className="text-[10px] text-red-600 mt-1 font-bold">⚠️ {validationErrors.lastName}</p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-1 text-right">
                        <label className="text-xs font-bold text-stone-700">البريد الإلكتروني للدارس <span className="text-red-500">*</span></label>
                        <div className="relative">
                          <input 
                            type="email" 
                            required
                            placeholder="example@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={`w-full bg-stone-50 text-stone-950 text-xs py-3 pr-10 pl-4 rounded-xl border focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent text-right ${
                              validationErrors.email ? 'border-red-500 ring-2 ring-red-200' : 'border-amber-200'
                            }`}
                          />
                          <Mail className="w-4 h-4 text-amber-700 absolute top-3.5 right-3.5" />
                        </div>
                        {validationErrors.email && (
                          <p className="text-[10px] text-red-600 mt-1 font-bold">⚠️ {validationErrors.email}</p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                        <div className="space-y-1 text-right">
                          <label className="text-xs font-bold text-stone-700">كلمة المرور المقترحة <span className="text-red-500">*</span></label>
                          <div className="relative">
                            <input 
                              type={showPass ? "text" : "password"} 
                              required
                              placeholder="••••••••"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              className={`w-full bg-stone-50 text-stone-950 text-xs py-3 pr-10 pl-10 rounded-xl border focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent text-right ${
                                validationErrors.password ? 'border-red-500 ring-2 ring-red-200' : 'border-amber-200'
                              }`}
                            />
                            <Lock className="w-4 h-4 text-amber-700 absolute top-3.5 right-3.5" />
                            <button
                              type="button"
                              onClick={() => setShowPass(!showPass)}
                              className="absolute top-3.5 left-3 text-stone-400 hover:text-stone-600"
                            >
                              {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                          {validationErrors.password && (
                            <p className="text-[10px] text-red-600 mt-1 font-bold">⚠️ {validationErrors.password}</p>
                          )}
                        </div>

                        <div className="space-y-1 text-right">
                          <label className="text-xs font-bold text-stone-700">تأكيد كلمة المرور <span className="text-red-500">*</span></label>
                          <div className="relative">
                            <input 
                              type={showConfirmPass ? "text" : "password"} 
                              required
                              placeholder="••••••••"
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              className={`w-full bg-stone-50 text-stone-950 text-xs py-3 pr-10 pl-10 rounded-xl border focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent text-right ${
                                validationErrors.confirmPassword ? 'border-red-500 ring-2 ring-red-200' : 'border-amber-200'
                              }`}
                            />
                            <Lock className="w-4 h-4 text-amber-700 absolute top-3.5 right-3.5" />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPass(!showConfirmPass)}
                              className="absolute top-3.5 left-3 text-stone-400 hover:text-stone-600"
                            >
                              {showConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                          {validationErrors.confirmPassword && (
                            <p className="text-[10px] text-red-600 mt-1 font-bold">⚠️ {validationErrors.confirmPassword}</p>
                          )}
                        </div>
                      </div>

                      {/* Password Strength Checklist panel */}
                      {password.length > 0 && (
                        <div className="p-3 bg-amber-50 rounded-xl text-[10px] space-y-1.5 text-right border border-amber-100">
                          <p className="font-bold text-stone-800">قوة كلمة المرور المقرّة أمنياً:</p>
                          <div className="w-full bg-stone-200 h-1 rounded-full overflow-hidden">
                            <div 
                              className={`h-full transition-all duration-300 ${
                                strengthCount < 2 ? 'bg-red-500' : strengthCount < 4 ? 'bg-amber-500' : 'bg-teal-600'
                              }`}
                              style={{ width: `${(strengthCount / 5) * 100}%` }}
                            />
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

                   {/* STEP 2: IDENTITY & CONTACT */}
                  {registerStep === 2 && (
                    <div className="space-y-3.5 text-right">
                      <div className="space-y-1 text-right">
                        <label className="text-xs font-bold text-stone-700">رقم الهاتف للهواتف النقالة <span className="text-red-500">*</span></label>
                        <div className="relative">
                          <input 
                            type="tel" 
                            required
                            placeholder="+966 50 123 4567"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className={`w-full bg-stone-50 text-stone-950 text-xs py-3 pr-10 pl-4 rounded-xl border focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent text-right ${
                              validationErrors.phone ? 'border-red-500 ring-2 ring-red-200' : 'border-amber-200'
                            }`}
                          />
                          <Phone className="w-4 h-4 text-amber-700 absolute top-3.5 right-3.5" />
                        </div>
                        {validationErrors.phone && (
                          <p className="text-[10px] text-red-600 mt-1 font-bold">⚠️ {validationErrors.phone}</p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                        <div className="space-y-1 text-right">
                          <label className="text-xs font-bold text-stone-700">الجنس (اختياري)</label>
                          <div className="relative">
                            <select 
                              value={gender}
                              onChange={(e) => setGender(e.target.value)}
                              className="w-full bg-stone-50 text-stone-950 text-xs py-3 pr-3 pl-4 rounded-xl border border-amber-200 focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent text-right appearance-none cursor-pointer"
                            >
                              <option value="">اختر الجنس...</option>
                              <option value="male">ذكر</option>
                              <option value="female">أنثى</option>
                              <option value="other">أخرى</option>
                            </select>
                          </div>
                        </div>

                        <div className="space-y-1 text-right">
                          <label className="text-xs font-bold text-stone-700">تاريخ الميلاد (اختياري)</label>
                          <div className="relative">
                            <input 
                              type="date" 
                              value={dob}
                              onChange={(e) => setDob(e.target.value)}
                              className="w-full bg-stone-50 text-stone-950 text-xs py-3 pr-10 pl-4 rounded-xl border border-amber-200 focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent text-right"
                            />
                            <Calendar className="w-4 h-4 text-amber-700 absolute top-3.5 right-3.5" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 3: RESIDENCY & ADDRESS */}
                  {registerStep === 3 && (
                    <div className="space-y-3.5 text-right">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                        <div className="space-y-1 text-right">
                          <label className="text-xs font-bold text-stone-700">الدولة (اختياري)</label>
                          <div className="relative">
                            <input 
                              type="text" 
                              placeholder="المملكة العربية السعودية"
                              value={country}
                              onChange={(e) => setCountry(e.target.value)}
                              className="w-full bg-stone-50 text-stone-950 text-xs py-3 pr-10 pl-4 rounded-xl border border-amber-200 focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent text-right"
                            />
                            <Globe className="w-4 h-4 text-amber-700 absolute top-3.5 right-3.5" />
                          </div>
                        </div>

                        <div className="space-y-1 text-right">
                          <label className="text-xs font-bold text-stone-700">المدينة (اختياري)</label>
                          <div className="relative">
                            <input 
                              type="text" 
                              placeholder="الرياض"
                              value={city}
                              onChange={(e) => setCity(e.target.value)}
                              className="w-full bg-stone-50 text-stone-950 text-xs py-3 pr-10 pl-4 rounded-xl border border-amber-200 focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent text-right"
                            />
                            <Building className="w-4 h-4 text-amber-700 absolute top-3.5 right-3.5" />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                        <div className="space-y-1 text-right">
                          <label className="text-xs font-bold text-stone-700">اسم الشارع وعنوان الإقامة (اختياري)</label>
                          <div className="relative">
                            <input 
                              type="text" 
                              placeholder="الملز، طريق صلاح الدين"
                              value={streetLine1}
                              onChange={(e) => setStreetLine1(e.target.value)}
                              className="w-full bg-stone-50 text-stone-950 text-xs py-3 pr-10 pl-4 rounded-xl border border-amber-200 focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent text-right"
                            />
                            <MapPin className="w-4 h-4 text-amber-700 absolute top-3.5 right-3.5" />
                          </div>
                        </div>

                        <div className="space-y-1 text-right">
                          <label className="text-xs font-bold text-stone-700">الرمز البريدي (اختياري)</label>
                          <div className="relative">
                            <input 
                              type="text" 
                              placeholder="11564"
                              value={postalCode}
                              onChange={(e) => setPostalCode(e.target.value)}
                              className={`w-full bg-stone-50 text-stone-950 text-xs py-3 pr-10 pl-4 rounded-xl border focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent text-right ${
                                validationErrors.postalCode ? 'border-red-500 ring-2 ring-red-200' : 'border-amber-200'
                              }`}
                            />
                            <MapPin className="w-4 h-4 text-amber-700 absolute top-3.5 right-3.5" />
                          </div>
                          {validationErrors.postalCode && (
                            <p className="text-[10px] text-red-600 mt-1 font-bold">⚠️ {validationErrors.postalCode}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* NAVIGATION STEP CONTROLS */}
                  <div className="flex gap-4 pt-2">
                    {registerStep > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          setErrorMessage(null);
                          setRegisterStep((prev) => prev - 1);
                        }}
                        className="w-1/3 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold py-3.5 rounded-xl transition flex items-center justify-center gap-1.5 text-xs cursor-pointer border-0"
                      >
                        السابق
                      </button>
                    )}
                    <button
                      type="submit"
                      disabled={loading}
                      className={`font-bold py-3.5 rounded-xl transition shadow-md flex items-center justify-center gap-2 text-xs cursor-pointer border-0 ${
                        registerStep > 1 ? 'w-2/3' : 'w-full'
                      } bg-orange-700 hover:bg-orange-800 text-amber-50`}
                      id="register-btn-final"
                    >
                      {loading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : registerStep < 3 ? (
                        <span className="flex items-center gap-1">الخطوة التالية ➔</span>
                      ) : (
                        <span>إنشاء وحجز المقعد الأكاديمي ✓</span>
                      )}
                    </button>
                  </div>

                </form>

                {/* Footer Switch */}
                <div className="pt-6 border-t border-amber-50 text-center text-xs text-stone-600">
                  <span>لديك حساب بالفعل بالمجلس؟ </span>
                  <button onClick={() => setSubView('login')} className="text-orange-700 font-bold hover:underline cursor-pointer bg-transparent border-0">
                    تسجيل الدخول الآن
                  </button>
                </div>
              </div>
            )}

            {/* Form View 3: FORGOT PASSWORD */}
            {subView === 'forgot' && (
              <div className="space-y-6" id="forgot-subview">
                <div className="text-center space-y-4">
                  <div className="w-14 h-14 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
                    <KeyRound className="w-6 h-6 stroke-[1.8]" />
                  </div>
                  <h2 className="text-xl font-bold text-stone-900">نسيت كلمة المرور؟</h2>
                  <p className="text-xs text-stone-600 max-w-sm mx-auto leading-relaxed">
                    لا تقلق، يحدث هذا للكثيرين. أدخل بريدك الإلكتروني والمسجل وسنرسل لك على الفور رمز وتوكن إعادة الضبط الآمن.
                  </p>
                </div>

                <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                  <div className="space-y-1.5 text-right">
                    <label className="text-xs font-bold text-stone-700">البريد الإلكتروني للدارس</label>
                    <div className="relative">
                      <input 
                        type="email" 
                        required
                        placeholder="example@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-stone-50 text-stone-950 text-xs py-3.5 pr-10 pl-4 rounded-xl border border-amber-200 focus:outline-none"
                      />
                      <Mail className="w-4 h-4 text-amber-700 absolute top-4 right-3.5" />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-orange-700 hover:bg-orange-800 text-amber-50 font-bold py-3.5 rounded-xl transition text-xs shadow-md"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'إرسال رابط التحقق ورمز التعيين'}
                  </button>
                </form>

                <div className="pt-6 border-t border-amber-50 text-center text-xs">
                  <button 
                    onClick={() => setSubView('login')}
                    className="text-stone-500 hover:text-orange-700 flex items-center gap-1.5 mx-auto hover:underline"
                  >
                    <ArrowRight className="w-4 h-4 transform rotate-180" />
                    <span>تذكرت كلمة المرور؟ سجل الدخول الآن</span>
                  </button>
                </div>
              </div>
            )}

            {/* Form View 4: VERIFY OTP */}
            {subView === 'verify' && (
              <div className="space-y-6" id="verify-subview">
                <div className="text-center space-y-3">
                  <div className="w-14 h-14 bg-orange-50 text-orange-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
                    <Mail className="w-6 h-6 animate-pulse" />
                  </div>
                  <h2 className="text-xl font-bold text-stone-900">تأكيد البريد الإلكتروني</h2>
                  <p className="text-xs text-stone-600 max-w-sm mx-auto leading-relaxed">
                    أرسلنا للتو رمز تحقق آمن مكون من 6 أرقام إلى بريدك الإلكتروني الموفر. يرجى إدخاله أدناه للمتابعة.
                  </p>
                </div>

                <form onSubmit={handleOtpSubmit} className="space-y-6">
                  
                  {/* 6 Digit Inputs container */}
                  <div className="flex justify-center gap-2.5 sm:gap-4" dir="ltr">
                    {otp.map((data, index) => (
                      <input
                        key={index}
                        type="text"
                        maxLength={1}
                        ref={(ref) => { otpInputs.current[index] = ref as HTMLInputElement; }}
                        value={data}
                        onChange={(e) => handleOtpChange(e.target, index)}
                        onKeyDown={(e) => handleOtpKeyDown(e, index)}
                        onPaste={handleOtpPaste}
                        className="w-11 h-11 sm:w-14 sm:h-14 font-bold text-base sm:text-lg text-center bg-stone-50 text-stone-900 rounded-xl border border-amber-200 focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent"
                      />
                    ))}
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-orange-700 hover:bg-orange-800 text-amber-50 font-bold py-3 rounded-xl shadow-md text-xs transition"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'تحقق وتأكيد حسابي'}
                  </button>
                </form>

                {/* Resend OTP countdown and trigger button */}
                <div className="text-center text-xs text-stone-500 pt-2">
                  {countdown > 0 ? (
                    <p className="font-light">أعد إرسال الرمز التحقق بعد <span className="font-mono font-bold text-orange-700">{countdown} ثانية</span></p>
                  ) : (
                    <button 
                      onClick={handleResendOtp}
                      className="text-orange-700 hover:underline font-bold"
                    >
                      لم يصلك الرمز؟ أعد الإرسال الآن
                    </button>
                  )}
                </div>

                <div className="pt-6 border-t border-amber-50 text-center text-xs">
                  <button onClick={() => setSubView('login')} className="text-stone-500 hover:text-orange-700 hover:underline">
                    العودة إلى تسجيل الدخول
                  </button>
                </div>
              </div>
            )}

            {/* Form View 5: RESET PASSWORD */}
            {subView === 'reset' && (
              <div className="space-y-6" id="reset-subview">
                <div className="text-right">
                  <h2 className="text-xl font-bold text-stone-900">إنشاء كلمة مرور جديدة</h2>
                  <p className="text-xs text-stone-500 font-light mt-1">يجب أن تكون كلمة المرور الجديدة مختلفة عن كلمات المرور المستخدمة سابقاً لتعزيز أمن المجلس.</p>
                </div>

                <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
                  
                  <div className="space-y-1.5 text-right">
                    <label className="text-xs font-bold text-stone-700">كلمة المرور الجديدة</label>
                    <div className="relative">
                      <input 
                        type={showPass ? "text" : "password"} 
                        required
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-stone-50 text-stone-950 text-xs py-3.5 pr-10 pl-10 rounded-xl border border-amber-200 focus:outline-none"
                      />
                      <Lock className="w-4 h-4 text-amber-700 absolute top-4 right-3.5" />
                      <button
                        type="button"
                        onClick={() => setShowPass(!showPass)}
                        className="absolute top-4 left-3 text-stone-400"
                      >
                        {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-right">
                    <label className="text-xs font-bold text-stone-700">تأكيد كلمة المرور الجديدة</label>
                    <div className="relative">
                      <input 
                        type={showConfirmPass ? "text" : "password"} 
                        required
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full bg-stone-50 text-stone-950 text-xs py-3.5 pr-10 pl-10 rounded-xl border border-amber-200 focus:outline-none"
                      />
                      <Lock className="w-4 h-4 text-amber-700 absolute top-4 right-3.5" />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPass(!showConfirmPass)}
                        className="absolute top-4 left-3 text-stone-400"
                      >
                        {showConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-orange-700 hover:bg-orange-800 text-amber-50 font-bold py-3.5 rounded-xl transition text-xs shadow-md"
                  >
                    حفظ وتحديث كلمة المرور الكبرى
                  </button>
                </form>
              </div>
            )}

            {/* Form View 6: SUCCESS */}
            {subView === 'success' && (
              <div className="space-y-6 text-center py-4" id="success-subview">
                
                <div className="w-20 h-20 bg-teal-50 text-teal-600 text-teal-600 rounded-full flex items-center justify-center mx-auto shadow-inner relative">
                  <span className="absolute inset-0 rounded-full bg-teal-500/10 animate-ping pointer-events-none" />
                  <CheckCircle className="w-10 h-10 stroke-[1.8]" />
                </div>

                <div className="space-y-3">
                  <h2 className="text-2xl font-black text-stone-900">تمت العملية بنجاح! 🎉</h2>
                  <p className="text-xs text-stone-600 max-w-sm mx-auto leading-relaxed">
                    تمت مصادقة بياناتك بنظام OTP المتقدم وحفظ وتشفير حسابك الجديد بنجاح مأمول.
                  </p>
                  <p className="text-xs text-stone-500">يمكنك الآن الدخول والبدء فوراً في رحلة العلوم العربية التراثية مع منصة آثاري.</p>
                </div>

                <div className="pt-6">
                  <button
                    onClick={() => {
                      onLoginSuccess(fullName || 'أحمد التميمي');
                      setActiveView('dashboard'); // Direct transition to dashboard on success
                    }}
                    className="w-full bg-orange-700 hover:bg-orange-800 text-amber-50 font-bold py-4 rounded-xl text-xs transition shadow-md hover:shadow-lg"
                    id="success-dashboard-redirect"
                  >
                    الدخول الفوري إلى لوحة تحكم الطالب
                  </button>
                </div>

                <p className="text-[10px] text-stone-400">ستقوم المنصة بحفظ تقدمك تلقائياً لشهادات الإجازة.</p>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}

// Global Toast simulated alert helper helper
function handleTriggerToast(msg: string) {
  const toastContainer = document.createElement('div');
  toastContainer.className = "fixed bottom-6 left-6 z-50 bg-stone-900 text-amber-50 px-5 py-4 rounded-xl shadow-2xl border-r-4 border-amber-500 text-xs flex items-center gap-2 animate-slide-in";
  toastContainer.innerHTML = `<span>${msg}</span>`;
  document.body.appendChild(toastContainer);
  setTimeout(() => {
    toastContainer.remove();
  }, 3000);
}
