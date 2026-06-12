import { useState, useEffect } from 'react';
import { Award, Download, Share2, X, Check, Copy, Twitter, Linkedin, Sparkles, BookOpen, Clock, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CertificateProps {
  id: string;
  title: string;
  recipient: string;
  grade: string;
  serialNumber: string;
  dateHijri: string;
  dateGregorian: string;
  authorizer: string;
  description: string;
}

export default function ManuscriptCertificate({
  id,
  title,
  recipient,
  grade,
  serialNumber,
  dateHijri,
  dateGregorian,
  authorizer,
  description
}: CertificateProps) {
  const [downloading, setDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [sharing, setSharing] = useState(false);
  const [copied, setCopied] = useState(false);

  // Simulate PDF Download with genuine digital signatures representation
  const handlePdfDownload = () => {
    setDownloading(true);
    setDownloadProgress(0);
    
    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setDownloading(false);
            // Simulate triggering browser download
            const link = document.createElement('a');
            link.href = '#';
            link.setAttribute('download', `${id}_manifest.pdf`);
            // Custom alert or success state
          }, 600);
          return 100;
        }
        return prev + 10;
      });
    }, 120);
  };

  const shareText = `بفضل الله وتوفيقه، تم منحي إجازة معتمدة في "${title}" بتقدير ${grade} من منصة آثاري للتعليم التراثي والأصالة المعاصرة. 📜✨ ${window.location.origin}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="relative" id={`manuscript-cert-container-${id}`}>
      
      {/* CARD MAIN PARCHMENT FRAME */}
      <div 
        className="relative bg-gradient-to-br from-[#FCFAF2] via-[#FBF7EC] to-[#FAF3E0] rounded-3xl p-1 sm:p-2 border border-[#E9D9B5] shadow-lg overflow-hidden group min-h-[460px]"
        style={{ boxShadow: '0 12px 36px -12px rgba(139, 92, 26, 0.15)' }}
      >
        
        {/* Intricate Islamic Calligraphy border style wrapper */}
        <div className="border-[3px] border-double border-[#C5A86B] rounded-2.5xl p-4 sm:p-6 h-full flex flex-col justify-between relative bg-[#FFFDF9]/60">
          
          {/* Inner traditional corner elements (Arabic Ornate Motif representation) */}
          <div className="absolute top-3 right-3 text-[#B08D46]/45 text-lg select-none font-serif">✥</div>
          <div className="absolute top-3 left-3 text-[#B08D46]/45 text-lg select-none font-serif">✥</div>
          <div className="absolute bottom-3 right-3 text-[#B08D46]/45 text-lg select-none font-serif">✥</div>
          <div className="absolute bottom-3 left-3 text-[#B08D46]/45 text-lg select-none font-serif">✥</div>

          <div className="absolute top-4 inset-x-4 h-px bg-gradient-to-r from-transparent via-[#C5A86B]/35 to-transparent" />
          <div className="absolute bottom-4 inset-x-4 h-px bg-gradient-to-r from-transparent via-[#C5A86B]/35 to-transparent" />

          {/* Top Header - Basmala & Traditional Script */}
          <div className="text-center pt-2 pb-1 space-y-2">
            <p className="text-[10px] text-[#A68840] font-serif tracking-widest block font-medium">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</p>
            
            {/* Ornate Medallion Banner */}
            <div className="inline-flex items-center justify-center gap-1.5 px-4 py-1.5 bg-[#FAF4E1] border border-[#DECFAC]/80 rounded-full shadow-inner">
              <Sparkles className="w-3.5 h-3.5 text-[#B8964B] animate-pulse" />
              <span className="text-[10px] md:text-[11px] font-bold text-[#8F702D] font-serif tracking-tight">إِجَازَةُ خَتْمِ الدِّرَاسَةِ الرَّصِينَةِ</span>
              <Sparkles className="w-3.5 h-3.5 text-[#B8964B]" />
            </div>
            
            {/* ID Seal */}
            <p className="text-[8px] sm:text-[9px] font-sans text-stone-400 mt-1 block">رقم الإجازة الموثقة: <span className="font-mono text-[#B8964B] font-bold">{serialNumber}</span></p>
          </div>

          {/* Certificate Main Text in Traditional Arabic Prose Style */}
          <div className="text-center my-6 space-y-4 px-1 sm:px-4">
            <h4 className="text-[#962D15] font-black text-sm md:text-base tracking-normal font-serif leading-none">
              سَنَدُ التَّحْصِيلِ وَالْإِجَازَةِ الْعِلْمِيَّةِ
            </h4>
            <p className="text-[9px] text-[#A49479] font-serif italic mt-0.5">طُبِعَ لَهُ التَّوْفِيقُ بِمَنِّ الْبَارِئِ وَكَرَمِهِ</p>
            
            <p className="text-xs text-stone-750 font-serif leading-relaxed text-justify select-none max-w-lg mx-auto" style={{ textAlignLast: 'center' }}>
              تشهد الهيئة الأكاديمية الاستشارية لمنصة <strong className="text-[#962D15] font-sans font-extrabold">آثاري</strong> للتعليم التراثي، بأن الدارس الفاضل <strong className="text-stone-950 font-black bg-[#FAF0D5] px-2.5 py-1 rounded-md decoration-[#A68840]/40 font-sans inline-block text-[13px] border border-[#EBE1BF]">{recipient}</strong> قد انتهى من قراءة واستماع ومدارسة كامل محاور الدورة التخصصية المكثفة الموسومة بـ:
            </p>

            <h3 className="text-[#845E1E] text-sm md:text-[15px] font-serif font-black underline decoration-double decoration-[#C5A86B]/50 underline-offset-4 tracking-tight py-1 inline-block max-w-[95%]">
              " {title} "
            </h3>

            <p className="text-xs text-stone-750 font-serif leading-relaxed text-justify select-none max-w-lg mx-auto mt-2" style={{ textAlignLast: 'center' }}>
              وقد اجتاز الامتحان الختامي المتقن والتقييم الشهري بنجاحٍ تام وبمعدل مشرف قدره <strong className="text-teal-750 font-black text-[13px] bg-teal-50 px-1.5 py-0.5 rounded border border-teal-100 font-sans">{grade} (تقدير ممتاز)</strong>، وبناءً عليه مُنح هذه الشهادة المصدقة برعاية الأستاذ الفاضل <strong className="text-stone-900 font-bold">{authorizer}</strong>.
            </p>
            
            <p className="text-[10px] text-stone-500 font-sans font-light mt-2 max-w-md mx-auto">
              إثباتاً لمثابرته وحرصه على ضبط قواعد العلوم التراثية ونظم الآداب والجهد التراكمي في التحصيل العلمي.
            </p>
          </div>

          {/* Golden Seal Emblem Overlay Bottom Side */}
          <div className="absolute right-5 bottom-16 select-none opacity-10 pointer-events-none group-hover:opacity-15 transition-opacity">
            <svg className="w-16 h-16 fill-current text-[#A68840]" viewBox="0 0 100 100">
              <path d="M50 0 C64 0, 78 12, 78 28 C78 35, 84 42, 92 42 C100 42, 100 58, 92 58 C84 58, 78 65, 78 72 C78 88, 64 100, 50 100 C36 100, 22 88, 22 72 C22 65, 16 58, 8 58 C0 58, 0 42, 8 42 C16 42, 22 35, 22 28 C22 12, 36 0, 50 0 Z" />
            </svg>
          </div>

          {/* Footer - Date and Call to action buttons */}
          <div className="pt-4 border-t border-[#E9D9B5]/45 flex flex-col sm:flex-row items-center justify-between gap-4">
            
            {/* Verified Dates */}
            <div className="text-center sm:text-right space-y-0.5 shrink-0">
              <span className="text-[9px] text-[#A29170] block">صدور المحضر الرقمي المستوفي:</span>
              <p className="text-[10px] text-stone-700 font-bold font-serif leading-none">
                {dateHijri} <span className="text-stone-300">/</span> {dateGregorian}
              </p>
              <div className="inline-flex items-center gap-1 text-[8px] bg-teal-500/10 text-teal-850 px-2 py-0.5 rounded border border-teal-200 font-semibold mt-1">
                <span className="w-1.5 h-1.5 bg-teal-600 rounded-full animate-pulse" />
                <span>تم التحقق من الرمز الفريد بنجاح</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-end">
              <button
                onClick={handlePdfDownload}
                className="bg-[#962D15] hover:bg-[#80220E] text-[#FFFDF9] px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border-0 shadow-md hover:shadow-lg active:scale-95"
                title="تحميل كوثيقة PDF رسمية ممهورة بختم الجامعة"
              >
                <Download className="w-3.5 h-3.5" />
                <span>تحميل PDF</span>
              </button>

              <button
                onClick={() => setSharing(true)}
                className="bg-stone-100 hover:bg-[#FAF0D5] text-[#8F702D]/90 hover:text-[#845E1E] p-2.5 rounded-xl transition flex items-center justify-center cursor-pointer border border-[#E2D4B6] hover:border-[#C5A86B] active:scale-95 bg-white shadow-xs"
                title="مشاركة إنجازك الدراسي مع العالم"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

        {/* LOADING PROGRESS MODAL SIMULATION OVERLAY */}
        <AnimatePresence>
          {downloading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#FAFAEE]/95 backdrop-blur-xs flex flex-col justify-center items-center p-6 text-center z-40 rounded-3xl"
            >
              <div className="relative">
                {/* Simulated spinning geometric frame */}
                <div className="w-16 h-16 rounded-full border-4 border-[#C5A86B]/20 border-t-[#962D15] animate-spin" />
                <Award className="w-6 h-6 text-[#962D15] absolute inset-0 m-auto" />
              </div>
              
              <h4 className="text-xs font-extrabold text-stone-900 mt-5">جاري تدبيج وختم السجل المعرفي الموثّق...</h4>
              <p className="text-[10px] text-stone-500 mt-1.5 max-w-xs leading-relaxed">
                يتم الآن إصدار رقم الشهادة التسلسلي، استرجاع الأختام الإسنادية، وإجازة المستند الرقمي بصيغة PDF عالية الجودة.
              </p>
              
              <div className="w-56 bg-stone-100 h-2 rounded-full overflow-hidden mt-5 border border-stone-200/50">
                <motion.div 
                  className="bg-[#962D15] h-full" 
                  initial={{ width: 0 }}
                  animate={{ width: `${downloadProgress}%` }}
                />
              </div>
              <span className="text-xs text-[#962D15] font-black mt-2 font-mono">{downloadProgress}%</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* SHARING INSTRUCTIONS DIALOG MODAL */}
        <AnimatePresence>
          {sharing && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-stone-950/80 backdrop-blur-xs flex justify-center items-center p-4 z-40 rounded-3xl"
            >
              <motion.div 
                initial={{ scale: 0.95, y: 10 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 10 }}
                className="bg-white rounded-2xl p-5 max-w-sm w-full text-right shadow-2xl relative"
              >
                <button 
                  onClick={() => setSharing(false)}
                  className="absolute top-4 left-4 p-1 hover:bg-stone-100 rounded-lg text-stone-400 hover:text-stone-700 transition"
                >
                  <X className="w-4 h-4" />
                </button>

                <h3 className="text-xs font-black text-stone-950 flex items-center gap-1.5 border-r-3 border-orange-700 pr-2">
                  <Share2 className="w-4 h-4 text-orange-700" />
                  <span>مشاركة الإجازة التعليمية والشهادة</span>
                </h3>

                <p className="text-[11px] text-stone-500 leading-relaxed mt-3 font-light">
                  شارك إنجازك الأكاديمي مع زملائك على وسائل التواصل الاجتماعي، لتعرّفهم بالجهد العلمي الذي بذلته في منصة آثاري.
                </p>

                {/* Custom formatted share message card */}
                <div className="bg-stone-50 p-3 rounded-lg border border-stone-150 mt-4 relative text-right">
                  <p className="text-[10px] text-stone-700 font-serif leading-relaxed line-clamp-3">
                    {shareText}
                  </p>
                  <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-stone-50 to-transparent pointer-events-none rounded-b-lg" />
                </div>

                <div className="grid grid-cols-1 gap-2 mt-4">
                  <button
                    onClick={copyToClipboard}
                    className="flex items-center justify-center gap-1.5 bg-orange-700 hover:bg-[#962D15] text-white py-2 px-4 rounded-xl text-xs font-bold transition w-full cursor-pointer border-0"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'تم نسخ نص المشاركة!' : 'نسخ نص المشاركة الجاهز'}</span>
                  </button>

                  <div className="flex gap-2">
                    <a
                      href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-1 bg-[#1DA1F2] hover:bg-sky-500 text-white py-2 rounded-xl text-xs font-bold transition text-decoration-none"
                    >
                      <Twitter className="w-3.5 h-3.5" />
                      <span>تويتر / X</span>
                    </a>
                    
                    <a
                      href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.origin)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-1 bg-[#0077B5] hover:bg-blue-700 text-white py-2 rounded-xl text-xs font-bold transition text-decoration-none"
                    >
                      <Linkedin className="w-3.5 h-3.5" />
                      <span>لينكد إن</span>
                    </a>
                  </div>
                </div>

                <p className="text-[9px] text-[#A68840] text-center mt-3 font-serif">
                  * الشهادة ممهورة برمز التحقق الفريد CRM وموثقة بسجلات آثاري الرسمية.
                </p>

              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

    </div>
  );
}
