import { MessageSquare, CheckCircle } from 'lucide-react';

interface ReviewsModerationProps {
  onTriggerToast: (msg: string) => void;
}

export default function ReviewsModeration({ onTriggerToast }: ReviewsModerationProps) {
  return (
    <div className="bg-amber-50/40 rounded-3xl border border-amber-200/90 p-4 sm:p-6 text-right font-sans" dir="rtl" id="reviews-moderation-component">

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-amber-200/60 pb-5 mb-6">
        <div>
          <h2 className="text-base sm:text-xl font-black text-orange-700 font-serif flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-orange-700" />
            <span>نظام مراجعة وتعديل التقييمات العلمية</span>
          </h2>
          <p className="text-[11px] sm:text-xs text-stone-500 mt-1 max-w-xl">
            إدارة موازين التقييم التي يطرحها الطلاب، وضبط ورصد مراجعات الدارسين للتأكد من موافقتها لميثاق النقد الأثري الرصين بالبوابة.
          </p>
        </div>
      </div>

      {/* Empty State */}
      <div className="bg-white border text-center p-16 rounded-2xl border-dashed border-amber-300">
        <div className="w-16 h-16 bg-emerald-50 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8" />
        </div>
        <h4 className="font-bold text-stone-900 text-sm">طابور البلاغات فارغ تماماً! لا توجد مراجعات مبلغ عنها حالياً.</h4>
        <p className="text-xs text-stone-500 max-w-sm mx-auto leading-relaxed mt-1">
          كافة تقييمات الطلاب والدارسين بنسختها الحالية مصدقة ومستوفية لشروط الرقي المعرفي والدعم البناء.
        </p>
      </div>

    </div>
  );
}
