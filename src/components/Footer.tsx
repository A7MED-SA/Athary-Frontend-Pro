import React, { useState } from 'react';
import { Landmark, ArrowLeft, Mail, BookOpen, Send, CheckCircle2 } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => {
        setSubscribed(false);
        setEmail('');
      }, 5000);
    }
  };

  return (
    <footer className="bg-stone-900 text-stone-300 pt-16 pb-12 border-t-2 border-[var(--color-brand-orange-700)] font-sans" dir="rtl" id="athary-footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          
          {/* Column 1: App Info */}
          <div className="md:col-span-4 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[var(--color-brand-orange-700)] text-amber-50 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                </svg>
              </div>
              <div>
                <span className="block text-xl font-bold text-amber-50">
                  منصة <span className="text-[var(--color-brand-orange-700)]">آثاري</span>
                </span>
                <span className="block text-xs text-stone-400 mt-0.5">منصة الفنون والعلوم التراثية العربية</span>
              </div>
            </div>
            
            <p className="text-sm text-stone-400 leading-relaxed font-light font-sans">
              نلتزم بتقديم رؤية علمية وجمالية متميزة تجمع بين مأثور الثقافة والتراث الإنساني ومقاييس التعليم التكنولوجي الرقمي الحديثة وتيسير العلوم الجليلة لطلاب العلم حول العالم.
            </p>

            <div className="flex gap-3">
              {['تويتر', 'يوتيوب', 'لينكد إن', 'إنستغرام'].map((social, idx) => (
                <span 
                  key={idx}
                  className="px-3 py-1.5 text-xs font-medium bg-stone-800 hover:bg-[var(--color-brand-orange-700)]/30 hover:text-orange-50 rounded-lg border border-stone-800 hover:border-[var(--color-brand-orange-700)]/50 cursor-pointer transition-all duration-200"
                >
                  {social}
                </span>
              ))}
            </div>
          </div>

          {/* Column 2: Useful Links (منصة آثاري) */}
          <div className="md:col-span-2 space-y-4">
            <h3 className="text-amber-50 font-bold text-sm tracking-wide border-r-2 border-[var(--color-brand-orange-700)] pr-2">منصة آثاري</h3>
            <ul className="space-y-2.5 text-sm">
              {['عن المنصة', 'تاريخنا', 'رؤيتنا وأهدافنا', 'فريق التدريب الأكاديمي', 'اتصل بِنَا'].map((link, idx) => (
                <li key={idx}>
                  <span className="hover:text-[var(--color-brand-orange-700)] cursor-pointer flex items-center gap-1.5 transition-all duration-150 group">
                    <span className="w-1.5 h-1.5 bg-[var(--color-brand-orange-700)] rounded-full group-hover:scale-125 transition-all" />
                    {link}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Resource Links (مسارات معتمدة) */}
          <div className="md:col-span-3 space-y-4">
            <h3 className="text-amber-50 font-bold text-sm tracking-wide border-r-2 border-[var(--color-brand-orange-700)] pr-2">مسارات معتمدة</h3>
            <ul className="space-y-2.5 text-sm">
              {['دراسات العمارة الإسلامية', 'دبلوم البلاغة والنثر العربي كلاسيكيا', 'التحرير وتحقيق المخطوطات الأثرية', 'علم المواريث والعلوم الشرعية الجليلة', 'فنون الخط والزخرفة الإسلامية المعاصرة'].map((link, idx) => (
                <li key={idx}>
                  <span className="hover:text-[var(--color-brand-orange-700)] cursor-pointer flex items-center gap-1.5 transition-all duration-150 group">
                    <span className="w-1.5 h-1.5 bg-[var(--color-brand-orange-700)] rounded-full group-hover:scale-125 transition-all" />
                    {link}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Newsletter Sign-up */}
          <div className="md:col-span-3 space-y-4">
            <h3 className="text-amber-50 font-bold text-sm tracking-wide border-r-2 border-[var(--color-brand-orange-700)] pr-2">النشرة المعرفية</h3>
            <p className="text-xs text-stone-400 leading-relaxed font-sans">
              اشترك في مجلسنا البريدي لتصلك أحدث أوراق البحث، الإصدارات، مواعيد البث المباشر، ومقالات الخط الأسبوعية وتخفيضات الدورات الجديدة أولاً بأول.
            </p>
            
            {subscribed ? (
              <div className="bg-[var(--color-brand-orange-700)]/20 border border-[var(--color-brand-orange-700)]/40 text-orange-200 p-3.5 rounded-xl flex items-start gap-2.5 shadow-md">
                <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs font-sans">
                  <p className="font-bold text-amber-300 font-sans">أهلاً بك في آثاري!</p>
                  <p className="mt-0.5 opacity-80 font-sans">تم تأكيد اشتراكك، ستصلك رسالة قريباً.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="البريد الإلكتروني..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-stone-800 text-stone-100 placeholder-stone-500 text-sm px-4 py-3 rounded-xl border border-stone-700 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-orange-700)] focus:border-transparent text-right font-sans"
                  />
                  <button
                    type="submit"
                    className="absolute left-2 top-2 bg-[var(--color-brand-orange-700)] hover:bg-[var(--color-brand-orange-850)] p-1.5 rounded-lg text-amber-50 transition-all focus:outline-none"
                    aria-label="اشترك الآن"
                  >
                    <Send className="w-4 h-4 transform -rotate-45" />
                  </button>
                </div>
              </form>
            )}
          </div>

        </div>

        {/* Divider and copyright notices */}
        <div className="h-px bg-stone-800 my-10" />

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-stone-500 font-light">
          <p>© {new Date().getFullYear()} منصة آثاري للتعليم الإلكتروني والبحث التراثي. جميع الحقوق محفوظة.</p>
          <div className="flex gap-4">
            <span className="hover:text-stone-300 cursor-pointer transition-all">سياسة الخصوصية</span>
            <span className="hover:text-stone-300 cursor-pointer transition-all">شروط الخدمة</span>
            <span className="hover:text-stone-300 cursor-pointer transition-all">اتفاقية ترخيص شهادات المعرفة</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
