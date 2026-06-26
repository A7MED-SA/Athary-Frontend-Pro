import { useState, useEffect } from 'react';
import { authService } from '../services/auth.service';
import { Mail, CheckCircle, XCircle, Loader2 } from 'lucide-react';

interface VerifyViewProps {
  email: string;
  token: string;
  onVerified: () => void;
}

export function VerifyView({ email, token, onVerified }: VerifyViewProps) {
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    authService.verifyEmail({ email, token })
      .then(() => setStatus('success'))
      .catch((err: any) => {
        setErrorMsg(err?.response?.data?.message || err?.message || 'فشل تأكيد البريد الإلكتروني');
        setStatus('error');
      });
  }, [email, token]);

  if (status === 'verifying') {
    return (
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
    );
  }

  if (status === 'error') {
    return (
      <div className="space-y-6 text-center py-4" id="verify-error-subview">
        <div className="w-20 h-20 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <XCircle className="w-10 h-10 stroke-[1.8]" />
        </div>
        <div className="space-y-3">
          <h2 className="text-2xl font-black text-stone-900">فشل التحقق</h2>
          <p className="text-xs text-red-600 max-w-sm mx-auto leading-relaxed">{errorMsg}</p>
        </div>
        <div className="pt-6">
          <button onClick={onVerified} className="w-full bg-orange-700 hover:bg-orange-800 text-amber-50 font-bold py-4 rounded-xl text-xs transition shadow-md hover:shadow-lg border-0 cursor-pointer">العودة لتسجيل الدخول</button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-center py-4" id="verify-success-subview">
      <div className="w-20 h-20 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center mx-auto shadow-inner relative">
        <span className="absolute inset-0 rounded-full bg-teal-500/10 animate-ping pointer-events-none" />
        <CheckCircle className="w-10 h-10 stroke-[1.8]" />
      </div>
      <div className="space-y-3">
        <h2 className="text-2xl font-black text-stone-900">تم تأكيد البريد الإلكتروني!</h2>
        <p className="text-xs text-stone-600 max-w-sm mx-auto leading-relaxed">حسابك مفعل الآن. يمكنك تسجيل الدخول والبدء في رحلتك التعليمية.</p>
      </div>
      <div className="pt-6">
        <button onClick={onVerified} className="w-full bg-orange-700 hover:bg-orange-800 text-amber-50 font-bold py-4 rounded-xl text-xs transition shadow-md hover:shadow-lg border-0 cursor-pointer">الذهاب لتسجيل الدخول</button>
      </div>
    </div>
  );
}
