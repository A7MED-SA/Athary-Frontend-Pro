import { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
  error?: { message?: string } | null;
}

export function AuthLayout({ children, error }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-amber-50 flex flex-col justify-center font-sans py-12 px-4 sm:px-6 lg:px-8" dir="rtl" id="athary-auth-engine">
      <div className="absolute inset-0 bg-heritage-pattern opacity-[0.08] pointer-events-none" />
      <div className="max-w-5xl mx-auto w-full bg-white rounded-3xl overflow-hidden border border-amber-200/60 shadow-2xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12">
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

            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl flex items-start gap-2.5 shadow-sm text-xs">
                <AlertCircleIcon />
                <div>
                  <p className="font-bold">فشلت العملية</p>
                  <p className="mt-0.5 opacity-90">{error.message}</p>
                </div>
              </div>
            )}

            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

function AlertCircleIcon() {
  return (
    <svg className="w-4 h-4 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}
