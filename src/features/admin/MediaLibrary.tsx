import React, { useState } from 'react';
import {
  FileVideo,
  FileText,
  Image as ImageIcon,
  Folder,
  HardDrive,
  Upload,
  CheckCircle2,
  Filter,
  Search
} from 'lucide-react';

interface MediaLibraryProps {
  onTriggerToast: (msg: string) => void;
}

export default function MediaLibrary({ onTriggerToast }: MediaLibraryProps) {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const handleUpload = () => {
    onTriggerToast('⬆️ ميزة رفع الملفات متاحة. يرجى تنفيذ منتقي الملفات لاختيار ملف للرفع.');
  };

  return (
    <div className="bg-amber-50/40 rounded-3xl border border-amber-200/90 p-4 sm:p-6 text-right font-sans" dir="rtl" id="media-library-component">

      {/* Banner info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-amber-200/60 pb-5 mb-6">
        <div>
          <h2 className="text-base sm:text-xl font-black text-orange-700 font-serif flex items-center gap-2">
            <Folder className="w-6 h-6 text-orange-700" />
            <span>مكتبة الوسائط المركزية والأرشيف الفني</span>
          </h2>
          <p className="text-[11px] sm:text-xs text-stone-500 mt-1 max-w-xl">
            رفع وحفظ وإدارة ملفات المواد المسجلة، المقررات المصعّدة بالمنصة، وإخضاع الفيديوهات لمعالج دقة الضغط والبث الآلي.
          </p>
        </div>

        <button
          onClick={handleUpload}
          className="bg-orange-700 hover:bg-orange-800 text-white font-black px-5 py-3 rounded-xl text-xs sm:text-xs transition shadow-md border-0 cursor-pointer flex items-center justify-center gap-2 self-start md:self-center"
        >
          <Upload className="w-4 h-4 animate-bounce" />
          <span>رفع ملفات جديدة للأرشيف</span>
        </button>
      </div>

      {/* THREE STORAGE STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

        {/* CARD 1: USED SIZE WITH PROGRESS BAR */}
        <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-3xs flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500">إجمالي المساحة المستخدمة</span>
            <HardDrive className="w-5 h-5 text-orange-700" />
          </div>
          <div>
            <div className="flex items-baseline gap-1.5 text-stone-900">
              <span className="text-xl font-black font-mono">0.0</span>
              <span className="text-[10px] text-stone-400 font-bold">ميغابايت مستهلكة</span>
            </div>
            <p className="text-[10px] text-stone-400 mt-0.5">من أصل الحد المخصص للأكاديمية (20 جيغابايت)</p>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1">
            <div className="w-full bg-orange-700/10 h-2 rounded-full overflow-hidden">
              <div className="bg-orange-700 h-full rounded-full transition-all duration-1000" style={{ width: '0%' }} />
            </div>
            <div className="flex justify-between text-[9px] text-stone-400 font-bold">
              <span>0.0% مستعمل</span>
              <span>المتبقي: 20.00 جيجابايت</span>
            </div>
          </div>
        </div>

        {/* CARD 2: TOTAL FILE COUNT */}
        <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-3xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500">عدد الملفات النشطة بالأرشيف</span>
            <Folder className="w-5 h-5 text-emerald-700" />
          </div>
          <div className="my-3">
            <span className="text-2xl font-black font-mono text-stone-900">0</span>
            <span className="text-xs font-bold text-orange-700 mr-1">ملفاً مرفوعاً ومحققاً</span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-stone-400">
            <span className="inline-block w-2 h-2 bg-emerald-500 rounded-full" />
            <span>٣ ملفات فحصت آلياً من البرمجيات الضارة</span>
          </div>
        </div>

        {/* CARD 3: STATUS AND ENCRYPTION */}
        <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-3xs flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500">حالة التخزين والاتصال</span>
            <CheckCircle2 className="w-5 h-5 text-teal-700" />
          </div>
          <div className="text-right">
            <span className="text-xs font-extrabold text-orange-700 block">خادم التخزين السحابي مؤمن ومشفّر 🔓</span>
            <p className="text-[10px] text-stone-500 font-light mt-1 leading-relaxed">
              يدعم خوادم البث المباشر الفوري، بنسخ احتياطي جغرافي مكرر لمنع تلف الدروس والملخصات التاريخية.
            </p>
          </div>
          <div className="text-[9px] bg-teal-50 text-teal-900 p-1.5 rounded-lg border border-teal-200/50 font-bold text-center">
            تشفير عالي التسامح AES-256 بت المعياري
          </div>
        </div>

      </div>

      {/* FILTERS & SEARCH ROW */}
      <div className="bg-white rounded-2xl border border-stone-200 p-4 mb-6 shadow-3xs flex flex-col md:flex-row items-center justify-between gap-4">

        {/* Search Input */}
        <div className="w-full md:w-72 relative">
          <Search className="absolute right-3.5 top-2.5 w-4 h-4 text-stone-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="البحث في اسم الملف المرفوع..."
            className="w-full bg-stone-50 text-stone-900 text-xs py-2 px-3 pr-10 rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-orange-700 font-medium"
          />
        </div>

        {/* Filter selectors */}
        <div className="w-full md:w-auto flex flex-wrap items-center gap-3 justify-end">

          <div className="flex items-center gap-1.5 text-xs text-stone-500 font-bold">
            <Filter className="w-4 h-4 text-orange-700" />
            <span>تصفية:</span>
          </div>

          {/* Type dropdown */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-stone-50 border text-stone-800 text-xs py-2 px-3 rounded-xl focus:outline-none"
          >
            <option value="all">كافة الأنواع</option>
            <option value="video">فيديو (mp4)</option>
            <option value="document">ملف مستندي (pdf, xlsx)</option>
            <option value="image">صورة (jpg, png)</option>
          </select>

          {/* Status dropdown */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-stone-50 border text-stone-800 text-xs py-2 px-3 rounded-xl focus:outline-none"
          >
            <option value="all">كافة الحالات</option>
            <option value="Ready">جاهز للبث</option>
            <option value="Processing">قيد المعالجة بالفيتشيرز</option>
            <option value="Failed">فشل الإعداد</option>
          </select>

        </div>

      </div>

      {/* MEDIA LIST TABLE CONTAINER */}
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-3xs">
        <div className="overflow-x-auto">

          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-stone-100 text-stone-600 font-black text-xs border-b border-stone-200">
                <th className="p-4">اسم الملف وبياناته</th>
                <th className="p-4">نوع الصيغة</th>
                <th className="p-4">المساحة</th>
                <th className="p-4">المسؤول عن الرفع</th>
                <th className="p-4">تاريخ الإيداع</th>
                <th className="p-4">حالة البث</th>
                <th className="p-4 text-center">الإجراءات</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-stone-100">
              <tr>
                <td colSpan={7} className="p-16 text-center text-stone-400">
                  <Folder className="w-12 h-12 text-stone-300 mx-auto stroke-[1.5] mb-2" />
                  <h5 className="font-bold text-stone-700 text-xs sm:text-sm">لا توجد ملفات وسائط مرفوعة بعد</h5>
                  <p className="text-[11px] text-stone-400 mt-0.5">قم برفع أول ملف وسائط للبدء في بناء أرشيفك الرقمي.</p>
                </td>
              </tr>
            </tbody>
          </table>

        </div>
      </div>

    </div>
  );
}
