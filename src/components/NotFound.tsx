import { Compass, ArrowLeft, Home, Search } from 'lucide-react';
import { ViewType } from '../types';

export default function NotFound({
  setActiveView
}: {
  setActiveView: (view: ViewType) => void;
}) {
  return (
    <div 
      className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-16 text-right dir-rtl font-sans selection:bg-orange-200 selection:text-orange-900 bg-amber-50/20"
      id="athary-404-view"
    >
      <div className="max-w-md w-full text-center space-y-6">
        
        {/* Retro visual representing a lost ancient map compass */}
        <div className="relative w-32 h-32 mx-auto">
          <div className="absolute inset-0 bg-radial from-orange-500/10 to-transparent blur-xl rounded-full" />
          
          <div className="w-24 h-24 bg-white border-2 border-dashed border-amber-300 rounded-full flex items-center justify-center mx-auto shadow-md relative">
            <Compass className="w-12 h-12 text-orange-700 animate-spin-slow" />
            
            {/* 404 Badge */}
            <div className="absolute -bottom-1 -right-1 bg-orange-850 text-amber-50 text-[10px] font-mono font-black py-1 px-2.5 rounded-full ring-2 ring-white shadow">
              404
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <span className="text-[10px] text-orange-700 font-extrabold uppercase bg-orange-100 py-0.5 px-3 rounded-md border border-orange-200 inline-block font-sans">
            ضلّ الطريق في الأرشيف!
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-[#5C230E] font-serif leading-snug">
            هذه الصفحة غائبة عن الفهرس وسجلات آثاري
          </h1>
          <p className="text-xs text-stone-500 leading-relaxed font-light">
            يبدو أن النقش أو المسار الذي ترومه غير مسجل حالياً في لوحاتنا المعرفية، أو لعل رابطه قد عُدّل ليصون الأمانة التراثية الشريفة.
          </p>
        </div>

        {/* Action controls */}
        <div className="bg-white p-5 rounded-3xl border border-amber-100 shadow-xs space-y-4">
          
          <div className="space-y-1.5 text-center">
            <span className="text-[11px] text-stone-700 block font-semibold flex items-center justify-center gap-1.5">
              <Search className="w-4 h-4 text-stone-400" />
              <span>هل ترغب بالبحث والتنقيب مجدداً؟</span>
            </span>
            <p className="text-[10px] text-stone-400">تصفح الكتالوج الشامل لجميع المناهج المدروسة بالجامعة.</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setActiveView('landing')}
              className="bg-[#962D15] hover:bg-[#7D220F] text-amber-50 py-3 px-4 rounded-xl text-xs font-black border-0 cursor-pointer shadow-sm transition flex items-center justify-center gap-1.5"
            >
              <Home className="w-3.5 h-3.5" />
              <span>الرئيسية</span>
            </button>

            <button
              onClick={() => setActiveView('catalog')}
              className="bg-stone-100 hover:bg-stone-200 text-stone-700 py-3 px-4 rounded-xl text-xs font-bold border-0 cursor-pointer transition flex items-center justify-center gap-1.5"
            >
              <span>كتالوج المساقات</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

        <p className="text-[9px] text-stone-400 font-mono">
          كود الخطأ: ATH-ARCHIVE-INDEX-NOT-FOUND
        </p>

      </div>
    </div>
  );
}
