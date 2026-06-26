import { motion, AnimatePresence } from 'motion/react';
import { X, Share2 } from 'lucide-react';

interface ShareCertificateModalProps {
  sharingCert: { id: string; title: string } | null;
  onClose: () => void;
  onShare: (platform: string) => void;
}

export function ShareCertificateModal({ sharingCert, onClose, onShare }: ShareCertificateModalProps) {
  return (
    <AnimatePresence>
      {sharingCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-stone-900/60 backdrop-blur-xs"
            onClick={onClose}
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 30 }}
            className="bg-white rounded-3xl border border-amber-200 shadow-2xl relative max-w-md w-full p-6 text-right z-10"
            dir="rtl"
          >
            <button
              onClick={onClose}
              className="absolute top-4 left-4 p-1.5 text-stone-400 hover:text-stone-700 bg-stone-50 hover:bg-stone-100 rounded-full border-0 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-10 h-10 rounded-xl bg-orange-700/10 flex items-center justify-center text-orange-700">
                <Share2 className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm sm:text-base text-stone-900">مشاركة الإجازة الشريفة</h4>
                <p className="text-[10px] text-stone-400">منصة آثاري للتراث المعرفي العتيق</p>
              </div>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed mb-4">
              انشر حصاد علمك وثابر عليه! يمكنك تزيين جدار إنجازاتك المعرفية عبر وسائل التواصل.
            </p>
            <div className="bg-amber-50/50 rounded-2xl p-4 border border-amber-200/50 mb-5 text-right">
              <p className="text-[10px] text-amber-800 font-bold mb-1.5">نص المنشور المقترح:</p>
              <p className="text-[11px] text-stone-700 leading-relaxed font-sans font-medium">
                "بحمد الله وتوفيقه، أجزتني لجنة التحقيق الأثرية والتعليمية لدى منصة <strong className="text-orange-900 font-bold">آثاري</strong> شهادة الإجازة في <strong className="text-stone-900 font-bold">({sharingCert.title})</strong> بتقدير ممتاز! #آثاري"
              </p>
            </div>
            <div className="space-y-2.5">
              <button
                onClick={() => onShare('whatsapp')}
                className="w-full bg-[#25D366] hover:bg-[#1ebd5d] text-white py-3 px-4 rounded-xl text-xs font-bold transition flex items-center justify-between cursor-pointer border-0 shadow-xs"
              >
                <span className="font-bold">واتساب</span>
                <span className="text-[9px] bg-white/20 px-2.5 py-0.5 rounded-full font-sans">إرسال فوري</span>
              </button>
              <button
                onClick={() => onShare('linkedin')}
                className="w-full bg-[#0077B5] hover:bg-[#006396] text-white py-3 px-4 rounded-xl text-xs font-bold transition flex items-center justify-between cursor-pointer border-0 shadow-xs"
              >
                <span className="font-bold">لينكد إن</span>
                <span className="text-[9px] bg-white/20 px-2.5 py-0.5 rounded-full font-sans">ملف احترافي</span>
              </button>
              <button
                onClick={() => onShare('twitter')}
                className="w-full bg-stone-900 hover:bg-stone-950 text-white py-3 px-4 rounded-xl text-xs font-bold transition flex items-center justify-between cursor-pointer border-0 shadow-xs"
              >
                <span className="font-bold">تويتر / إكس</span>
                <span className="text-[9px] bg-white/25 px-2.5 py-0.5 rounded-full font-sans">تغريدة فورية</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
