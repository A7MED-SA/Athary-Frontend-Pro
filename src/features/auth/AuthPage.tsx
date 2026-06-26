import { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { useAuth } from '../common/hooks/useAuth';
import { authService } from '@/features/auth/services/auth.service';
import { useAppContext } from '@/providers/AppProvider';
import { env } from '@/lib/env';
import { tokenStorage } from '@/lib/token-storage';
import { getErrorMessage, getErrorCode } from '@/lib/error-codes';
import { AuthLayout } from './components/AuthLayout';
import { LoginForm } from './components/LoginForm';
import { RegisterForm } from './components/RegisterForm';
import { ForgotPasswordForm } from './components/ForgotPasswordForm';
import { ResetPasswordForm } from './components/ResetPasswordForm';
import { OtpVerification } from './components/OtpVerification';
import { VerifyView } from './components/VerifyView';
import { SuccessView } from './components/SuccessView';

const loginSchema = z.object({
  email: z.string().email('البريد الإلكتروني غير صحيح'),
  password: z.string().min(8, 'كلمة المرور يجب أن تكون ٨ أحرف على الأقل'),
});

const registerSchema = z.object({
  firstName: z.string().min(1, 'الاسم الأول مطلوب').max(100),
  lastName: z.string().min(1, 'اسم العائلة مطلوب').max(100),
  email: z.string().email('البريد الإلكتروني غير صحيح'),
  password: z.string()
    .min(8, 'كلمة المرور يجب أن تكون ٨ أحرف على الأقل')
    .regex(/[A-Z]/, 'يجب أن تحتوي كلمة المرور على حرف كبير واحد على الأقل')
    .regex(/[a-z]/, 'يجب أن تحتوي كلمة المرور على حرف صغير واحد على الأقل')
    .regex(/[0-9]/, 'يجب أن تحتوي كلمة المرور على رقم واحد على الأقل')
    .regex(/[^A-Za-z0-9]/, 'يجب أن تحتوي كلمة المرور على رمز خاص واحد على الأقل (!@#$%^&* 등)'),
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
  code: z.string().min(6, 'رمز التحقق يجب أن يكون ٦ أرقام على الأقل').max(10, 'الرمز غير صحيح'),
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

type AuthSubView = 'login' | 'register' | 'forgot' | 'verify' | 'reset' | 'success' | 'otp';

export default function AuthPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { handleLoginSuccess } = useAppContext();
  const {
    loginAsync,
    isLoginPending,
    loginError,
    register: registerUser,
    isRegisterPending,
    registerError,
    loginWithGoogleAsync,
    loginWithMicrosoftAsync,
    isOAuthPending,
  } = useAuth();

  const [subView, setSubView] = useState<AuthSubView>('login');
  const [registerStep, setRegisterStep] = useState(1);
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const [emailForVerification, setEmailForVerification] = useState<string>('');
  const [tokenForVerification, setTokenForVerification] = useState<string>('');
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(''));
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const otpInputsRef = useRef<HTMLInputElement[]>([]);

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
      resetForm.setValue('code', token);
      setEmailForVerification(email);
    } else if (token && email) {
      setSubView('verify');
      setEmailForVerification(email);
      setTokenForVerification(token);
    }
  }, [searchParams, resetForm]);

  // Countdown timer for OTP resend
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (subView === 'otp' && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (subView === 'otp' && timer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [subView, timer]);

  const handleOtpChange = (value: string, index: number) => {
    if (value && isNaN(Number(value))) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Shift focus to next input
    if (value !== '' && index < 5) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace') {
      const newOtp = [...otp];
      if (otp[index] === '' && index > 0) {
        newOtp[index - 1] = '';
        setOtp(newOtp);
        otpInputsRef.current[index - 1]?.focus();
      } else {
        newOtp[index] = '';
        setOtp(newOtp);
      }
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    if (pastedData.length === 6 && /^\d+$/.test(pastedData)) {
      const newOtp = pastedData.split('');
      setOtp(newOtp);
      otpInputsRef.current[5]?.focus();
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length < 6) {
      toast.error('يرجى إدخال رمز التحقق كاملاً (٦ أرقام)');
      return;
    }

    setIsVerifying(true);
    try {
      await authService.verifyEmail({ email: emailForVerification, token: code });
      toast.success('تم تفعيل الحساب بنجاح!');
      setSubView('login');
    } catch (error: any) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOtp = async () => {
    if (!canResend) return;
    setIsResending(true);
    try {
      await authService.resendVerification({ email: emailForVerification });
      toast.success('تم إعادة إرسال رمز التحقق بنجاح');
      setTimer(60);
      setCanResend(false);
    } catch (error: any) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsResending(false);
    }
  };

  // Google OAuth initialization
  useEffect(() => {
    const clientId = env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId || clientId === 'YOUR_GOOGLE_CLIENT_ID') return;

    const checkGoogle = setInterval(() => {
      if (window.google?.accounts?.id) {
        clearInterval(checkGoogle);
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: async (response: { credential: string }) => {
            try {
              const result = await loginWithGoogleAsync(response.credential);
              if (result?.data) {
                tokenStorage.setTokens(result.data.accessToken, result.data.refreshToken);
                handleLoginSuccess(result.data.user);
              }
              toast.success('تم تسجيل الدخول بنجاح عبر Google');
              navigate('/dashboard');
            } catch {
              toast.error('فشل تسجيل الدخول عبر Google');
            }
          },
        });
      }
    }, 200);

    return () => clearInterval(checkGoogle);
  }, [loginWithGoogleAsync, navigate]);

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
        try {
          const result = await loginWithMicrosoftAsync(response.idToken);
          if (result?.data) {
            tokenStorage.setTokens(result.data.accessToken, result.data.refreshToken);
            handleLoginSuccess(result.data.user);
          }
          toast.success('تم تسجيل الدخول بنجاح عبر Microsoft');
          navigate('/dashboard');
        } catch {
          toast.error('فشل تسجيل الدخول عبر Microsoft');
        }
      }
    } catch {
      toast.error('تم إلغاء تسجيل الدخول عبر Microsoft');
    }
  };

  const onLoginSubmit = async (data: LoginFormData) => {
    try {
      const response = await loginAsync(data);
      if (response?.data) {
        tokenStorage.setTokens(response.data.accessToken, response.data.refreshToken);
        handleLoginSuccess(response.data.user);
      }
      toast.success('تم تسجيل الدخول بنجاح!');
      navigate('/dashboard');
    } catch (error: any) {
      const errorCode = getErrorCode(error);
      if (errorCode === 'ACCOUNT_NOT_ACTIVE') {
        toast.error('يرجى تأكيد البريد الإلكتروني أولاً.');
        setEmailForVerification(data.email);
        setOtp(new Array(6).fill(''));
        setTimer(60);
        setCanResend(false);
        setSubView('otp');
      } else if (errorCode === 'ACCOUNT_LOCKED') {
        toast.error(getErrorMessage(error), { duration: 6000 });
      } else {
        toast.error(getErrorMessage(error));
      }
    }
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
        toast.success('تم إنشاء الحساب بنجاح! تم إرسال رمز التحقق إلى بريدك الإلكتروني.');
        setEmailForVerification(data.email);
        setOtp(new Array(6).fill(''));
        setTimer(60);
        setCanResend(false);
        setSubView('otp');
      },
      onError: (error: any) => {
        toast.error(getErrorMessage(error));
      },
    });
  };

  const onForgotSubmit = (data: ForgotPasswordFormData) => {
    authService.forgotPassword({ email: data.email }).then(() => {
      toast.success('تم إرسال رمز إعادة تعيين كلمة المرور إلى بريدك الإلكتروني');
      setEmailForVerification(data.email);
      setSubView('reset');
    }).catch((error: any) => {
      toast.error(getErrorMessage(error));
    });
  };

  const onResetSubmit = (data: ResetPasswordFormData) => {
    const email = emailForVerification || searchParams.get('email');
    if (!email) {
      toast.error('البريد الإلكتروني غير معروف');
      return;
    }

    authService.resetPassword({
      email,
      token: data.code,
      newPassword: data.newPassword,
      confirmPassword: data.confirmPassword,
    }).then(() => {
      toast.success('تم تغيير كلمة المرور بنجاح!');
      setSubView('login');
    }).catch((error: any) => {
      toast.error(getErrorMessage(error));
    });
  };
  return (
    <AuthLayout error={loginError || registerError}>
      {subView === 'login' && (
        <LoginForm
          form={loginForm}
          onSubmit={onLoginSubmit}
          showPass={showPass}
          onTogglePass={() => setShowPass(!showPass)}
          isPending={isLoginPending}
          onForgotClick={() => setSubView('forgot')}
          onRegisterClick={() => setSubView('register')}
          onGoogleLogin={handleGoogleLogin}
          onMicrosoftLogin={handleMicrosoftLogin}
          isOAuthPending={isOAuthPending}
        />
      )}

      {subView === 'register' && (
        <RegisterForm
          form={registerForm}
          onSubmit={onRegisterSubmit}
          step={registerStep}
          onPrevStep={() => setRegisterStep((p) => p - 1)}
          showPass={showPass}
          onTogglePass={() => setShowPass(!showPass)}
          showConfirmPass={showConfirmPass}
          onToggleConfirmPass={() => setShowConfirmPass(!showConfirmPass)}
          password={password}
          strength={strength}
          strengthCount={strengthCount}
          isPending={isRegisterPending}
          onLoginClick={() => setSubView('login')}
        />
      )}

      {subView === 'forgot' && (
        <ForgotPasswordForm
          form={forgotForm}
          onSubmit={onForgotSubmit}
          onBackToLogin={() => setSubView('login')}
        />
      )}

      {subView === 'verify' && (
        <VerifyView
          email={emailForVerification}
          token={tokenForVerification}
          onVerified={() => setSubView('login')}
        />
      )}

      {subView === 'reset' && (
        <ResetPasswordForm
          form={resetForm}
          onSubmit={onResetSubmit}
          showPass={showPass}
          onTogglePass={() => setShowPass(!showPass)}
          showConfirmPass={showConfirmPass}
          onToggleConfirmPass={() => setShowConfirmPass(!showConfirmPass)}
          email={emailForVerification}
          onBackToForgot={() => setSubView('forgot')}
        />
      )}

      {subView === 'success' && (
        <SuccessView onAction={() => setSubView('login')} />
      )}

      {subView === 'otp' && (
        <OtpVerification
          email={emailForVerification}
          otp={otp}
          onOtpChange={handleOtpChange}
          onOtpKeyDown={handleOtpKeyDown}
          onOtpPaste={handleOtpPaste}
          onVerify={handleVerifyOtp}
          onResend={handleResendOtp}
          isVerifying={isVerifying}
          isResending={isResending}
          timer={timer}
          canResend={canResend}
          otpRefs={otpInputsRef}
          onBackToLogin={() => setSubView('login')}
        />
      )}
    </AuthLayout>
  );
}
