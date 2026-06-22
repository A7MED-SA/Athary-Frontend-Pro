import React, { useState } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  ShieldCheck, 
  Clock, 
  Compass, 
  X,
  FileText,
  HelpCircle,
  BookOpen
} from 'lucide-react';

export default function AboutContactPublic() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'suggest',
    message: ''
  });
  
  const [submitted, setSubmitted] = useState(false);
  const [activeLegalModal, setActiveLegalModal] = useState<'privacy' | 'terms' | 'refund' | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    
    // Simulate API delivery
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', subject: 'suggest', message: '' });
    }, 4000);
  };

  const legalContent = {
    privacy: {
      title: 'سياسة الخصوصية وحماية بيانات متعلمي آثاري',
      subtitle: 'حماية وحرص السجلات والبيانات الرقمية الشريفة',
      paragraphs: [
        'نحن في منصة آثاري نولي خصوصية بياناتكم أهمية بالغة تعادل حرصنا على صون الوثائق الأثرية. تلتزم المنصة بتشفير السجلات الأكاديمية ودفوعات المقاعد بالكامل وفق معايير التوطين العالمية.',
        'لا يتم استخدام بريدكم الإلكتروني أو أرقام التواصل إلا بغرض موافاتكم بإتاحة البث المباشر المصدق للمجالس العلمية وحساب استحقاق الشهادات.',
        'تخضع كافة خوادم البيانات وقنوات الربط بنظام SignalR لتشفير دوري صارم يمنع تسرب تفاصيل الهوية المعرفية للباحثين للعموم.'
      ]
    },
    terms: {
      title: 'شروط استخدام منصة آثاري المعرفية',
      subtitle: 'الضوابط الأكاديمية والشرعية للمدارسة المشتركة',
      paragraphs: [
        'يعد التسجيل في منصة آثاري بمثابة توقيع على ميثاق الأمانة العلمية وصون المخرجات التراثية ومجهودات الباحثين المعلقين.',
        'يُحظر تحت طائلة المسؤولية الأكاديمية والقانونية نسخ أو توطين الساعات المرئية المسجلة خارج حساب المتعلم الموثق لأسباب فكرية وتجارية.',
        'يتحمل الدارس المسؤولية الكلية عن صحة المستندات والوثائق المرفوعة لطلب رخص التدريس، ويحق للمشرفين إلغاء الترخيص الفوري حال رصد مغالطات.'
      ]
    },
    refund: {
      title: 'سياسة استرداد الرسوم وضوابط التسوية البنكية',
      subtitle: 'صرف المستحقات بحكمة وفق اللوائح المعتمدة بالوزارة',
      paragraphs: [
        'تتيح منصة آثاري استرداد الرسوم لجميع الدبلومات المدفوعة في غضون 7 أيام عمل من تاريخ سداد الاشتراك المالي، بشرط عدم استماع أو استعراض أكثر من ٢٠٪ من السلوك والمعدل الدراسي للمساق.',
        'تتم معالجة التذاكر مالياً وتدقيقها يدوياً بواسطة المشرف في طابور مراجعة الطلبات المالي، وتنساب الدفعة مباشرة للبطاقة البنكية الأصلية.',
        'في حال تجاوزت المدة القانونية أو تم إصدار Manuscript Certificate (شهادة معتمدة)، يتعذر قانوناً المطالبة بالاسترداد استناداً إلى لائحة التكاليف الأكاديمية المعمول بها.'
      ]
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)] pb-20 pt-10 px-4 sm:px-6 lg:px-8 text-right font-sans selection:bg-orange-200 selection:text-orange-900" id="about-contact-public-view">
      
      {/* 1. HERO SECTION */}
      <div className="max-w-6xl mx-auto text-center space-y-4 mb-16 relative">
        <div className="absolute inset-0 bg-radial from-orange-500/5 to-transparent blur-3xl rounded-full" />
        
        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-800 bg-orange-100 py-1 px-3.5 rounded-full uppercase leading-none border border-orange-200">
          <Compass className="w-3.5 h-3.5 text-orange-700 animate-spin-slow" />
          <span>رسالتنا: صون المعارف وتأصيل الحكمة والتاريخ</span>
        </span>
        
        <h1 className="text-3xl md:text-5xl font-black text-orange-950 font-serif tracking-tight leading-tight mt-2">
          إحياء التراث المكتوب والآثاري برؤية معاصرة
        </h1>
        
        <p className="text-xs md:text-sm text-stone-600 max-w-2xl mx-auto leading-relaxed font-light">
          تأسست منصة آثاري لتكون الجسر المعرفي الكلاسيكي الأمين، ترتقي بجهود الباحثين وتمنح طالبي العلم حقائب تفصيلية مصدقة ومحكّمة في فروع الآثار والمخطوطات والأصوات التاريخية القديمة.
        </p>
      </div>

      {/* 2. STATS SECTION */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 mb-20">
        
        {/* Card 1 */}
        <div className="bg-white p-6 rounded-3xl border border-amber-200 border-amber-200 shadow-sm text-center space-y-2 relative overflow-hidden group hover:shadow-md transition">
          <div className="w-10 h-10 bg-amber-50 text-amber-900 rounded-2xl flex items-center justify-center mx-auto text-sm border border-amber-100 font-bold">
            📜
          </div>
          <h3 className="text-xl font-mono font-extrabold text-orange-700 leading-none">+٢٠٠ مخطوطة</h3>
          <p className="text-[11px] text-stone-500 font-medium">تم فك ترميزها وتدبيج مقررها</p>
          <div className="absolute bottom-0 inset-x-0 h-1 bg-orange-600/40" />
        </div>

        {/* Card 2 */}
        <div className="bg-white p-6 rounded-3xl border border-amber-200 border-amber-200 shadow-sm text-center space-y-2 relative overflow-hidden group hover:shadow-md transition">
          <div className="w-10 h-10 bg-orange-50 text-orange-950 rounded-2xl flex items-center justify-center mx-auto text-sm border border-orange-100 font-bold">
            🎓
          </div>
          <h3 className="text-xl font-mono font-extrabold text-orange-700 leading-none">+١٠,٠٠٠ متعلم</h3>
          <p className="text-[11px] text-stone-500 font-medium font-sans">تلقوا الإجازات والشهادات الكبرى</p>
          <div className="absolute bottom-0 inset-x-0 h-1 bg-orange-600/40" />
        </div>

        {/* Card 3 */}
        <div className="bg-white p-6 rounded-3xl border border-amber-200 border-amber-200 shadow-sm text-center space-y-2 relative overflow-hidden group hover:shadow-md transition">
          <div className="w-10 h-10 bg-emerald-50 text-emerald-900 rounded-2xl flex items-center justify-center mx-auto text-sm border border-emerald-100 font-bold">
            🕌
          </div>
          <h3 className="text-xl font-mono font-extrabold text-orange-700 leading-none">١٤ عاماً</h3>
          <p className="text-[11px] text-stone-500 font-medium">من البحث الميداني والتعليم الأصيل</p>
          <div className="absolute bottom-0 inset-x-0 h-1 bg-orange-600/40" />
        </div>

      </div>

      {/* 3. CORE TWO COLUMN: CONTACT FORM (LEFT) vs CONTACT INFO & OFFICE (RIGHT) */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Contact Form (Left Column) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-amber-200 p-8 shadow-xs flex flex-col justify-between">
          <div className="space-y-3 mb-6">
            <h2 className="text-base sm:text-lg font-black text-stone-900 font-serif flex items-center gap-2">
              <Mail className="w-5 h-5 text-orange-700" />
              <span>مجلس المراسلة وتلقي الاستفسارات</span>
            </h2>
            <p className="text-[11px] text-stone-500 font-light leading-relaxed">
              يسعدنا تلقي طروحاتكم ومشاريع صيانة المتاحف ودراسات التعاون الأكاديمي الشريف. سيتم الرد عليكم في غضون ٢٤ ساعة.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-stone-600 block">اسمك الكريم بالمستمسكات *</label>
                <input 
                  type="text"
                  required
                  placeholder="الاسم الثلاثي..."
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2.5 text-xs bg-stone-50 text-stone-900 border border-stone-200 rounded-xl focus:outline-none focus:border-orange-600 focus:border-orange-600 focus:bg-white text-right"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-stone-600 block">عنوان البريد الإلكتروني للرد *</label>
                <input 
                  type="email"
                  required
                  placeholder="name@domain.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-2.5 text-xs bg-stone-50 text-stone-950 border border-stone-200 rounded-xl focus:outline-none focus:border-orange-600 focus:bg-white text-left font-mono"
                  dir="ltr"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-stone-600 block">غرض المراسلة وغايتها *</label>
              <select
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full p-2.5 text-xs bg-stone-50 text-stone-900 border border-stone-200 rounded-xl focus:outline-none focus:border-orange-600"
              >
                <option value="suggest">اقتراح فئة تراثية ومصنف معرفي جديد</option>
                <option value="corporate">شراكات متاحف وجهات رسمية</option>
                <option value="billing">دعم فني وبوابات الدفع البنكي</option>
                <option value="credentials">طلبات رخص ومنح التدريس الأكاديمية</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-stone-600 block">متن الرسالة وتفاصيل الطلب *</label>
              <textarea 
                required
                rows={5}
                placeholder="يرجى كتابة تفاصيل رسالتكم هنا بوضوح تام..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full p-3 text-xs bg-stone-50 text-stone-900 border border-stone-200 rounded-xl focus:outline-none focus:border-orange-600 focus:bg-white text-right placeholder:text-stone-400 leading-relaxed font-sans"
              />
            </div>

            {submitted ? (
              <div className="p-4 bg-emerald-50 text-emerald-800 rounded-2xl border border-emerald-100 text-[11px] font-bold leading-relaxed animate-fade-in">
                🎉 تم ترحيل رسالتكم وتحرير تذكرة بالمجلس بنجاح. سيقوم الرقيب الإداري لآثاري بمخاطبتكم عاجلاً على بريدكم المدخل.
              </div>
            ) : (
              <button
                type="submit"
                className="w-full bg-orange-700 hover:bg-orange-800 text-amber-50 font-black py-3 rounded-xl text-xs transition shadow-sm flex items-center justify-center gap-2 border-0 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>إرسال وتوثيق الرسالة بالمجلس المعرفي</span>
              </button>
            )}

          </form>
        </div>

        {/* Contact info & Office Map (Right Column) */}
        <div className="lg:col-span-5 bg-orange-50/20 rounded-3xl border border-stone-200 p-8 shadow-xs flex flex-col justify-between space-y-8">
          
          {/* Info blocks section */}
          <div className="space-y-6">
            <div className="border-b border-amber-100 pb-3">
              <span className="text-[10px] text-amber-800 font-extrabold block">قنواتنا المباشرة الشريفة</span>
              <h3 className="text-xs md:text-sm font-black text-stone-900 font-serif">مجلس خدمات آثاري العام</h3>
            </div>

            <div className="space-y-5">
              
              {/* Item 1 */}
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 bg-amber-50 bg-amber-100 text-orange-700 rounded-xl flex items-center justify-center shrink-0 border border-amber-200">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="space-y-0.5 text-right">
                  <span className="text-[10px] text-stone-400 block font-bold">البريد الإلكتروني للعموم والشركاء</span>
                  <span className="text-xs font-mono font-bold text-stone-900 block" dir="ltr">support@athary-platform.com</span>
                </div>
              </div>

              {/* Item 2 */}
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 bg-amber-50 bg-amber-100 bg-amber-100 text-orange-700 rounded-xl flex items-center justify-center shrink-0 border border-amber-200">
                  <Phone className="w-4 h-4" />
                </div>
                <div className="space-y-0.5 text-right">
                  <span className="text-[10px] text-stone-400 block font-bold">هاتف تلقي إشعارات التحكيم والخطوط</span>
                  <span className="text-xs font-mono font-bold text-stone-900 block" dir="ltr">+966 11 405 9290</span>
                </div>
              </div>

              {/* Item 3 */}
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 bg-amber-50 bg-amber-100 bg-amber-100 text-orange-700 rounded-xl flex items-center justify-center shrink-0 border border-amber-200">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="space-y-0.5 text-right">
                  <span className="text-[10px] text-stone-400 block font-bold">مقر عمادة آثاري الإجرائية والتنظيمية</span>
                  <span className="text-xs font-semibold text-stone-900 block">حي السفارات، ص.ب ٩٢، الرياض، المملكة العربية السعودية</span>
                </div>
              </div>

            </div>
          </div>

          {/* Interactive Vintage Map Placeholder */}
          <div className="space-y-2">
            <div className="text-[10px] text-stone-500 font-semibold flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-orange-700" />
              <span>مواعيد المجلس المعرفي: الأحد - الخميس (٨:٠٠ ص - ٤:٠٠ م)</span>
            </div>

            <div className="bg-white border-2 border-stone-200 border-dashed rounded-2xl p-4 text-center space-y-2 relative overflow-hidden h-40 flex flex-col justify-center items-center shadow-inner group">
              {/* Retro compass grid visual representing office maps */}
              <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#C2410C_1px,transparent_1px)] [background-size:16px_16px]" />
              
              <div className="w-8 h-8 rounded-full bg-amber-50 text-orange-700 flex items-center justify-center border border-amber-200 shadow-xs mb-1 group-hover:scale-110 transition">
                🗺️
              </div>
              <span className="text-[10.5px] text-stone-900 font-black block">خارطة مقر عمادة آثاري المركزية</span>
              <span className="text-[9px] text-stone-400 block font-mono">24.6853° N, 46.7214° E (حي السفارات الرياض)</span>
              <span className="text-[9px] bg-amber-100 text-orange-950 font-bold px-2 py-0.5 rounded-md border border-amber-200">
                قاعة المعارض واللقاءات الكبرى
              </span>
            </div>
          </div>

        </div>

      </div>

      {/* 4. LEGAL FOOTER LINKS SECTION */}
      <div className="max-w-5xl mx-auto border-t border-amber-200 mt-16 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-right">
        <div className="space-y-1 text-right">
          <span className="text-[11px] text-stone-400 font-mono block">منصة آثاري © ٢٠٢٦ مـ - خوادم معتمدة للدارسين</span>
          <span className="text-[9px] text-stone-400 block">مسجلة بوزارة الثقافة بموجب ميثاق صون التراث الوطني الشريف</span>
        </div>

        {/* Action Quick Links */}
        <div className="flex flex-wrap justify-center sm:justify-end gap-5 text-xs font-black">
          <button 
            onClick={() => setActiveLegalModal('privacy')}
            className="text-orange-700 hover:text-orange-800 hover:underline bg-transparent border-0 cursor-pointer text-xs"
          >
            سياسة الخصوصية والأمان
          </button>
          
          <span className="text-stone-300">|</span>
          
          <button 
            onClick={() => setActiveLegalModal('terms')}
            className="text-orange-700 hover:text-orange-800 hover:underline bg-transparent border-0 cursor-pointer text-xs"
          >
            شروط وبنود الاستخدام العلمي
          </button>
          
          <span className="text-stone-300">|</span>
          
          <button 
            onClick={() => setActiveLegalModal('refund')}
            className="text-orange-700 hover:text-orange-800 hover:underline bg-transparent border-0 cursor-pointer text-xs"
          >
            سياسة الاسترداد والمالية
          </button>
        </div>
      </div>

      {/* 5. LEGAL MODAL (Static Details dialog on the spot) */}
      {activeLegalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" id="legal-lightbox-overlay">
          <div 
            className="absolute inset-0 bg-stone-950/70 backdrop-blur-xs cursor-pointer"
            onClick={() => setActiveLegalModal(null)}
          />
          
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full text-right shadow-2xl relative z-10 border border-amber-100 space-y-6">
            
            {/* Header modal */}
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-700 flex items-center justify-center border border-orange-100">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <span className="text-[9px] text-amber-800 font-extrabold uppercase tracking-wide block">
                    الوثائق المصدقة للمنصة
                  </span>
                  <h3 className="text-xs sm:text-sm font-black text-stone-950 font-serif leading-none">
                    {legalContent[activeLegalModal].subtitle}
                  </h3>
                </div>
              </div>
              
              <button 
                onClick={() => setActiveLegalModal(null)}
                className="p-1.5 hover:bg-stone-100 rounded-lg text-stone-400 hover:text-stone-700 transition"
                title="إغلاق وطي الوثيقة"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Document Content */}
            <div className="space-y-4 text-right">
              <h4 className="font-extrabold text-stone-900 border-r-4 border-orange-700 pr-3 text-xs">
                {legalContent[activeLegalModal].title}
              </h4>
              
              <div className="space-y-3.5 text-stone-600 text-xs leading-relaxed max-h-72 overflow-y-auto pr-2">
                {legalContent[activeLegalModal].paragraphs.map((para, idx) => (
                  <p key={idx}>{para}</p>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="pt-2 flex gap-3 text-center">
              <button
                onClick={() => {
                  setActiveLegalModal(null);
                  // Trigger simple print/alert feedback
                  alert('📄 تم نسخ واعتماد شروط هذه الوثيقة في سجلات متصفحك الدراسي بنجاح.');
                }}
                className="flex-1 bg-orange-700 hover:bg-orange-800 text-amber-50 py-2.5 rounded-xl text-xs font-black border-0 cursor-pointer shadow-sm transition"
              >
                الموافقة والاعتماد للوثيقة
              </button>
              
              <button
                onClick={() => setActiveLegalModal(null)}
                className="px-5 bg-stone-100 hover:bg-stone-200 text-stone-600 py-2.5 rounded-xl text-xs font-bold border-0 cursor-pointer"
              >
                إغلاق
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
