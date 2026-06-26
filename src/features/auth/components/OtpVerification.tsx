import { Loader2, ArrowRight } from 'lucide-react';

interface OtpVerificationProps {
  email: string;
  otp: string[];
  onOtpChange: (value: string, index: number) => void;
  onOtpKeyDown: (e: React.KeyboardEvent<HTMLInputElement>, index: number) => void;
  onOtpPaste: (e: React.ClipboardEvent<HTMLInputElement>) => void;
  onVerify: (e: React.FormEvent) => void;
  onResend: () => void;
  isVerifying: boolean;
  isResending: boolean;
  timer: number;
  canResend: boolean;
  otpRefs: React.MutableRefObject<HTMLInputElement[]>;
  onBackToLogin: () => void;
}

export function OtpVerification({
  email, otp, onOtpChange, onOtpKeyDown, onOtpPaste, onVerify,
  onResend, isVerifying, isResending, timer, canResend, otpRefs, onBackToLogin,
}: OtpVerificationProps) {
  return (
    <div className="space-y-6" id="otp-subview">
      <div className="text-right">
        <h2 className="text-xl font-bold text-stone-900">رمز تأكيد البريد الإلكتروني</h2>
        <p className="text-xs text-stone-500 font-light mt-1 text-right">
          أدخل الرمز المكون من 6 أرقام الذي أرسلناه إلى بريدك الإلكتروني{' '}
          <span className="font-bold text-orange-700 select-all" dir="ltr">{email}</span>
        </p>
      </div>

      <form onSubmit={onVerify} className="space-y-6">
        <div className="flex justify-between items-center gap-2" dir="ltr">
          {otp.map((digit, idx) => (
            <input key={idx} type="text" maxLength={1} value={digit}
              ref={(el) => { if (el) otpRefs.current[idx] = el; }}
              onChange={(e) => onOtpChange(e.target.value, idx)}
              onKeyDown={(e) => onOtpKeyDown(e, idx)}
              onPaste={onOtpPaste}
              className="w-12 h-12 text-center text-lg font-bold bg-stone-50 text-stone-950 rounded-xl border border-amber-200 focus:outline-none focus:ring-2 focus:ring-orange-600 focus:border-transparent transition-all" />
          ))}
        </div>

        <button type="submit" disabled={isVerifying || otp.join('').length < 6}
          className="w-full bg-orange-700 hover:bg-orange-800 disabled:bg-stone-300 disabled:cursor-not-allowed text-amber-50 font-bold py-3.5 rounded-xl transition shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-xs border-0 cursor-pointer">
          {isVerifying ? <Loader2 className="w-4 h-4 animate-spin" /> : 'تأكيد البريد الإلكتروني وتفعيل الحساب'}
        </button>
      </form>

      <div className="pt-2 text-center text-xs space-y-3">
        <div className="text-stone-600">
          {canResend ? (
            <button type="button" onClick={onResend} disabled={isResending}
              className="text-orange-700 font-bold hover:underline cursor-pointer bg-transparent border-0 inline-flex items-center gap-1">
              {isResending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              إعادة إرسال رمز التحقق
            </button>
          ) : (
            <span>يمكنك إعادة إرسال الرمز خلال <span className="font-bold text-orange-700">{timer}</span> ثانية</span>
          )}
        </div>
        <div className="border-t border-amber-50 pt-4">
          <button type="button" onClick={onBackToLogin}
            className="text-stone-500 hover:text-orange-700 flex items-center gap-1.5 mx-auto hover:underline bg-transparent border-0 cursor-pointer text-xs">
            <ArrowRight className="w-4 h-4 transform rotate-180" />
            <span>الرجوع إلى تسجيل الدخول</span>
          </button>
        </div>
      </div>
    </div>
  );
}
