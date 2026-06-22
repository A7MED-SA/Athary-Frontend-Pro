import React, { useState, useEffect } from 'react';
import { 
  FileVideo, 
  FileText, 
  Image as ImageIcon, 
  Loader2, 
  Eye, 
  Link as LinkIcon, 
  Trash2, 
  Filter, 
  Search, 
  Folder, 
  HardDrive, 
  Upload, 
  CheckCircle2, 
  AlertCircle,
  PlayCircle,
  FileDown,
  X
} from 'lucide-react';

interface MediaFile {
  id: string;
  name: string;
  type: 'video' | 'document' | 'image';
  size: string;
  bytes: number;
  uploadedBy: string;
  date: string;
  status: 'Ready' | 'Processing' | 'Failed';
  url: string;
}

interface MediaLibraryProps {
  onTriggerToast: (msg: string) => void;
}

export default function MediaLibrary({ onTriggerToast }: MediaLibraryProps) {
  // Mock Media File DB
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([
    {
      id: 'm-101',
      name: 'محاضرة_الخط_العربي_والتذهيب_الكامل.mp4',
      type: 'video',
      size: '142.5 MB',
      bytes: 149422080,
      uploadedBy: 'أ. فاطمة الهاشمي',
      date: '2026-06-11',
      status: 'Ready',
      url: 'https://storage.athary-api.org/videos/khatt-ahmar.mp4'
    },
    {
      id: 'm-102',
      name: 'كتاب_ترميم_رقوق_البحر_الميت_والمخطوطات_النادرة.pdf',
      type: 'document',
      size: '22.4 MB',
      bytes: 23488102,
      uploadedBy: 'د. فريد الحربي',
      date: '2026-06-11',
      status: 'Ready',
      url: 'https://storage.athary-api.org/docs/tarmeem.pdf'
    },
    {
      id: 'm-103',
      name: 'سلسلة_فيديو_رحلة_حائل_الفصل_الثالث.mp4',
      type: 'video',
      size: '412.0 MB',
      bytes: 432013312,
      uploadedBy: 'د. فريد الحربي',
      date: '2026-06-11',
      status: 'Processing', // Will simulate worker update!
      url: 'https://storage.athary-api.org/videos/hail-exploration-3.mp4'
    },
    {
      id: 'm-104',
      name: 'صورة_مكبرة_رق_صنعاء_المصحف_القديم.jpg',
      type: 'image',
      size: '8.1 MB',
      bytes: 8493465,
      uploadedBy: 'أ. فاطمة الهاشمي',
      date: '2026-06-09',
      status: 'Ready',
      url: 'https://storage.athary-api.org/images/sanaa-mushaf.jpg'
    },
    {
      id: 'm-105',
      name: 'ندوة_النقوش_الثمودية_القصيرة_الجزء_الثاني.mp4',
      type: 'video',
      size: '290.4 MB',
      bytes: 304504100,
      uploadedBy: 'أ. فاطمة الهاشمي',
      date: '2026-06-08',
      status: 'Ready',
      url: 'https://storage.athary-api.org/videos/thamudic-short.mp4'
    },
    {
      id: 'm-106',
      name: 'خلفية_مهرجان_ملتقى_النقش_كلاسك.png',
      type: 'image',
      size: '4.5 MB',
      bytes: 4718592,
      uploadedBy: 'النظام الآلي للشارات',
      date: '2026-06-05',
      status: 'Ready',
      url: 'https://storage.athary-api.org/images/logo-classic.png'
    },
    {
      id: 'm-107',
      name: 'ملف_تنظيمي_محاضرات_اللغة_القديمة.xlsx',
      type: 'document',
      size: '1.2 MB',
      bytes: 1258291,
      uploadedBy: 'م. خالد مشرف المراقبة',
      date: '2026-06-04',
      status: 'Failed',
      url: 'https://storage.athary-api.org/docs/schedule-excel.xlsx'
    }
  ]);

  // Video Processing State Refetch simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setMediaFiles(prev => {
        let updated = false;
        const mapped = prev.map(file => {
          if (file.status === 'Processing') {
            updated = true;
            return { ...file, status: 'Ready' as const };
          }
          return file;
        });
        if (updated) {
          onTriggerToast('🔄 تحديث فوري (SignalR): معالج الفيديو (.NET Worker) أكمل معالجة جودة البث للفيديو بنجاح!');
        }
        return mapped;
      });
    }, 12000); // Checks every 12 seconds to fit real-world feel

    return () => clearInterval(interval);
  }, []);

  // UI Filters
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Preview dialog item & Modal
  const [previewFile, setPreviewFile] = useState<MediaFile | null>(null);

  // Soft Delete state
  const [deletingFile, setDeletingFile] = useState<MediaFile | null>(null);
  const [isDeletingConfirm, setIsDeletingConfirm] = useState<boolean>(false);

  // Calculation stats
  const totalFiles = mediaFiles.length;
  const processedBytes = mediaFiles.reduce((acc, curr) => acc + curr.bytes, 0);
  const totalStorageMB = (processedBytes / (1024 * 1024)).toFixed(1);
  const storageLimitGB = 20;
  const storageLimitMB = 20 * 1024;
  const storageUsagePercent = Math.min(((parseFloat(totalStorageMB) / storageLimitMB) * 100), 100).toFixed(1);

  // Copy Link helper
  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    onTriggerToast('🔗 تم نسخ رابط الملف المباشر للحافظة بنجاح!');
  };

  // Perform soft delete
  const handleTriggerSoftDelete = (file: MediaFile) => {
    setDeletingFile(file);
    setIsDeletingConfirm(true);
  };

  const handleConfirmSoftDelete = () => {
    if (deletingFile) {
      setMediaFiles(prev => prev.filter(f => f.id !== deletingFile.id));
      onTriggerToast(`🗑️ تم نقل الملف "${deletingFile.name}" إلى سلة المحذوفات المؤقتة. يمكنك استعادته بحد أقصى ٣٠ يوماً بموجب قواعد الأرشفة.`);
      setIsDeletingConfirm(false);
      setDeletingFile(null);
    }
  };

  // Upload trigger file simulator
  const handleFileDropUpload = () => {
    onTriggerToast('⬆️ تم تشغيل معالج رفع الملفات. يرجى سحب وإسقاط الملفات أو الضغط للرفع.');
  };

  return (
    <div className="bg-amber-50/40 rounded-3xl border border-amber-200/90 p-4 sm:p-6 text-right font-sans" dir="rtl" id="media-library-component">
      
      {/* Banner info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-amber-200/60 pb-5 mb-6">
        <div>
          <h2 className="text-base sm:text-xl font-black text-[#962D15] font-serif flex items-center gap-2">
            <Folder className="w-6 h-6 text-orange-700" />
            <span>مكتبة الوسائط المركزية والأرشيف الفني</span>
          </h2>
          <p className="text-[11px] sm:text-xs text-stone-500 mt-1 max-w-xl">
            رفع وحفظ وإدارة ملفات المواد المسجلة، المقررات المصعّدة بالمنصة، وإخضاع الفيديوهات لمعالج دقة الضغط والبث الآلي.
          </p>
        </div>

        <button
          onClick={handleFileDropUpload}
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
              <span className="text-xl font-black font-mono">{totalStorageMB}</span>
              <span className="text-[10px] text-stone-400 font-bold">ميغابايت مستهلكة</span>
            </div>
            <p className="text-[10px] text-stone-400 mt-0.5">من أصل الحد المخصص للأكاديمية ({storageLimitGB} جيغابايت)</p>
          </div>
          
          {/* Progress Bar */}
          <div className="space-y-1">
            <div className="w-full bg-[#962D15]/10 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-orange-700 h-full rounded-full transition-all duration-1000" 
                style={{ width: `${storageUsagePercent}%` }}
              />
            </div>
            <div className="flex justify-between text-[9px] text-stone-400 font-bold">
              <span>{storageUsagePercent}% مستعمل</span>
              <span>المتبقي: {((storageLimitMB - parseFloat(totalStorageMB)) / 1024).toFixed(2)} جيجابايت</span>
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
            <span className="text-2xl font-black font-mono text-stone-900">{totalFiles}</span>
            <span className="text-xs font-bold text-[#962D15] mr-1">ملفاً مرفوعاً ومحققاً</span>
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
            <span className="text-xs font-extrabold text-[#962D15] block">خادم التخزين السحابي مؤمن ومشفّر 🔓</span>
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
              {(() => {
                const filtered = mediaFiles.filter(file => {
                  const matchSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase());
                  const matchType = filterType === 'all' || file.type === filterType;
                  const matchStatus = filterStatus === 'all' || file.status === filterStatus;
                  return matchSearch && matchType && matchStatus;
                });

                if (filtered.length === 0) {
                  return (
                    <tr>
                      <td colSpan={7} className="p-16 text-center text-stone-400">
                        <Folder className="w-12 h-12 text-stone-300 mx-auto stroke-[1.5] mb-2" />
                        <h5 className="font-bold text-stone-700 text-xs sm:text-sm">لا تتوفر وسائط مطابقة لطلب البحث الخاص بك</h5>
                        <p className="text-[11px] text-stone-400 mt-0.5">يرجى تغيير الكلمات المفتاحية لمطابقة الأرشيف.</p>
                      </td>
                    </tr>
                  );
                }

                return filtered.map((file) => (
                  <tr key={file.id} className="hover:bg-amber-50/10 text-xs text-stone-700 transition">
                    
                    {/* File name & Icon */}
                    <td className="p-4 max-w-xs sm:max-w-md">
                      <div className="flex items-center gap-2.5">
                        
                        {file.type === 'video' && (
                          <div className="p-2 bg-rose-50 text-rose-700 rounded-xl">
                            <FileVideo className="w-5 h-5" />
                          </div>
                        )}

                        {file.type === 'document' && (
                          <div className="p-2 bg-blue-50 text-blue-700 rounded-xl">
                            <FileText className="w-5 h-5" />
                          </div>
                        )}

                        {file.type === 'image' && (
                          <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl">
                            <ImageIcon className="w-5 h-5" />
                          </div>
                        )}

                        <div className="space-y-0.5 min-w-0">
                          <span className="font-extrabold text-stone-900 block truncate font-mono" title={file.name}>
                            {file.name}
                          </span>
                          <span className="text-[9px] text-stone-400 block font-mono truncate">{file.url}</span>
                        </div>

                      </div>
                    </td>

                    {/* File Type */}
                    <td className="p-4 font-bold text-stone-500">
                      {file.type === 'video' && 'مرئي مقطع فيديو (MP4)'}
                      {file.type === 'document' && 'مستند تعليمي وتحقق'}
                      {file.type === 'image' && 'ملف رسومي وتذهيب'}
                    </td>

                    {/* Size */}
                    <td className="p-4 text-stone-500 font-mono font-bold">
                      {file.size}
                    </td>

                    {/* Uploaded By */}
                    <td className="p-4 font-medium text-stone-900">
                      {file.uploadedBy}
                    </td>

                    {/* Date */}
                    <td className="p-4 text-stone-500 font-mono">
                      {file.date}
                    </td>

                    {/* Status Badge */}
                    <td className="p-4">
                      {file.status === 'Ready' && (
                        <span className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] px-3 py-1 rounded-full font-black inline-flex items-center gap-1">
                          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                          <span>جاهز ومتاح للبث</span>
                        </span>
                      )}

                      {file.status === 'Processing' && (
                        <span className="bg-amber-50 border border-amber-200 text-amber-700 text-[10px] px-2.5 py-1 rounded-full font-black inline-flex items-center gap-1 animate-pulse">
                          <Loader2 className="w-3.5 h-3.5 text-amber-600 animate-spin" />
                          <span>قيد المعالجة الفنية...</span>
                        </span>
                      )}

                      {file.status === 'Failed' && (
                        <span className="bg-red-50 border border-red-200 text-red-700 text-[10px] px-3 py-1 rounded-full font-black inline-flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5 text-red-600" />
                          <span>فشل الإعداد والتحويل</span>
                        </span>
                      )}
                    </td>

                    {/* Actions tools */}
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        
                        <button
                          onClick={() => setPreviewFile(file)}
                          className="p-1.5 hover:bg-stone-50 text-stone-600 hover:text-orange-700 rounded-lg border-0 bg-transparent cursor-pointer"
                          title="معاينة الملف"
                        >
                          <Eye className="w-4 h-4 text-stone-500 hover:text-stone-900" />
                        </button>

                        <button
                          onClick={() => handleCopyLink(file.url)}
                          className="p-1.5 hover:bg-stone-50 text-stone-600 hover:text-orange-700 rounded-lg border-0 bg-transparent cursor-pointer"
                          title="نسخ الرابط والمسير السحابي"
                        >
                          <LinkIcon className="w-4 h-4 text-stone-500 hover:text-orange-700" />
                        </button>

                        <button
                          onClick={() => handleTriggerSoftDelete(file)}
                          className="p-1.5 hover:bg-red-50 text-stone-600 hover:text-red-700 rounded-lg border-0 bg-transparent cursor-pointer"
                          title="حذف مؤقت للمهملات"
                        >
                          <Trash2 className="w-4 h-4 text-stone-400 hover:text-red-700" />
                        </button>

                      </div>
                    </td>

                  </tr>
                ));
              })()}
            </tbody>
          </table>

        </div>
      </div>

      {/* 👁️ FILE PREVIEW MODAL */}
      {previewFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-stone-950/65 backdrop-blur-xs" onClick={() => setPreviewFile(null)} />
          <div className="bg-white rounded-3xl border border-amber-200 p-6 shadow-2xl relative max-w-xl w-full text-right z-10 animate-scale-up">
            
            <button 
              onClick={() => setPreviewFile(null)}
              className="absolute top-4 left-4 p-1 rounded-full hover:bg-stone-100 text-stone-400 border-0 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-4">
              
              <div className="flex items-center gap-2.5 border-b border-stone-100 pb-3">
                <div className="p-2.5 bg-orange-700/10 text-orange-800 rounded-xl">
                  {previewFile.type === 'video' && <FileVideo className="w-6 h-6 text-orange-700" />}
                  {previewFile.type === 'document' && <FileText className="w-6 h-6 text-blue-700" />}
                  {previewFile.type === 'image' && <ImageIcon className="w-6 h-6 text-emerald-700" />}
                </div>
                <div>
                  <h4 className="font-extrabold text-xs sm:text-sm text-stone-900 font-mono leading-tight">{previewFile.name}</h4>
                  <p className="text-[10px] text-stone-400 font-mono mt-0.5">الحجم: {previewFile.size} • تاريخ الإيداع: {previewFile.date}</p>
                </div>
              </div>

              {/* Fake Media View box based on type */}
              <div className="bg-stone-900 text-white rounded-2xl h-56 flex items-center justify-center relative overflow-hidden group">
                {previewFile.type === 'video' && (
                  <div className="absolute inset-0 bg-cover bg-center opacity-40 blur-xs" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1590073844006-33379778ae09?w=400')` }} />
                )}

                {previewFile.type === 'image' && (
                  <img src="https://images.unsplash.com/photo-1590073844006-33379778ae09?w=600" className="object-cover w-full h-full" alt="image preview" />
                )}

                {previewFile.type === 'document' && (
                  <div className="text-center space-y-2 z-10 px-5">
                    <FileText className="w-12 h-12 text-blue-400 mx-auto" />
                    <p className="text-xs font-bold font-serif">معاينة المستندات المكتوبة مدعومة بمشاهد PDF مدمج</p>
                    <button 
                      onClick={() => onTriggerToast('📥 جاري تنزيل الملف المرجعي...')}
                      className="bg-orange-700 hover:bg-orange-800 text-white text-[10px] py-1.5 px-3 rounded-lg flex items-center gap-1 mx-auto cursor-pointer border-0"
                    >
                      <FileDown className="w-3.5 h-3.5" />
                      <span>تنزيل نسخة PDF الأصلية</span>
                    </button>
                  </div>
                )}

                {previewFile.type === 'video' && (
                  <button 
                    onClick={() => onTriggerToast('🎬 جاري الاتصال بخادم البث المباشر وبدء التحميل...')}
                    className="z-10 bg-orange-700/90 hover:bg-orange-700 hover:scale-105 text-white p-4 rounded-full shadow-lg transition-transform border-0 cursor-pointer"
                  >
                    <PlayCircle className="w-10 h-10" />
                  </button>
                )}
              </div>

              <div className="space-y-1.5 text-stone-600 text-xs leading-relaxed font-light">
                <span className="font-bold text-stone-800 block">تفاصيل المسير السحابي المصدّق:</span>
                <div className="bg-stone-50 p-2.5 rounded-lg border border-stone-200">
                  <span className="font-mono text-[9px] text-stone-400 select-all">{previewFile.url}</span>
                </div>
                <p className="text-[10px] text-orange-950 mt-1 font-medium italic">
                  * هذا الرابط مخدّم لتسجيل الحضور، وفي حال كان هذا المقطع جزءاً من دقة مسار الدرس فسيتم تفعيل العداد تلقائياً للطالب لضمان الحصول على شهادة الاجتياز.
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-stone-100">
                <button
                  onClick={() => handleCopyLink(previewFile.url)}
                  className="bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200 px-4 py-2 rounded-xl text-xs flex items-center gap-1 cursor-pointer"
                >
                  <LinkIcon className="w-3.5 h-3.5" />
                  <span>نسخ الرابط</span>
                </button>

                <button
                  onClick={() => setPreviewFile(null)}
                  className="bg-orange-700 hover:bg-orange-800 text-white font-black px-6 py-2 rounded-xl text-xs cursor-pointer border-0"
                >
                  إغلاق نافذة المعاينة
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* 🛑 DELETION EXPLAIN DIALOG MODAL */}
      {isDeletingConfirm && deletingFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-xs" onClick={() => setIsDeletingConfirm(false)} />
          <div className="bg-white rounded-3xl border border-red-200 p-6 shadow-2xl relative max-w-md w-full text-right z-10 animate-scale-up">
            
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-red-50 text-red-700 rounded-xl flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-stone-900">حذف ناعم للوسائط وأرشفة</h4>
                <p className="text-[10px] text-stone-400">تحذير من إمكانية تعطل الروابط لدى الطلاب</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="text-xs text-stone-600 leading-relaxed bg-amber-50/50 p-3.5 border border-amber-200 rounded-xl">
                هل أنت متأكد من حذف الملف الموقر <strong className="font-mono text-[#962D15] block break-all mt-1">"{deletingFile.name}"</strong>؟
                <p className="mt-2 text-[10px] text-stone-500 font-light">
                  * سيتم نقله إلى سلة المحذوفات الإدارية ويمكن للمدرس أو المشرف استعادته خلال ٣٠ يوماً كقاعدة أمان، وبعدها سيتم حذفه من مخاض التخزين بشكل دائم.
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setIsDeletingConfirm(false)}
                  className="bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-200 px-4 py-2 rounded-lg text-xs cursor-pointer"
                >
                  إلغاء والتراجع
                </button>
                <button
                  onClick={handleConfirmSoftDelete}
                  className="bg-red-700 hover:bg-red-800 text-white font-black px-4 py-2 rounded-lg text-xs cursor-pointer border-0"
                >
                  نعم، تمكين الحذف المؤقت 🗑️
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
