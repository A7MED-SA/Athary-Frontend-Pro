import { useState } from 'react';
import { useInstructorRequest } from '../instructorRequests/hooks/useInstructorRequest';
import { mediaService } from '@/features/media/services/media.service';
import { DashboardSkeleton } from '../../components/shared/Skeleton';
import type { InstructorRequestDocumentDto } from '@/types/api/instructorRequest';
import {
  GraduationCap,
  Upload,
  FileText,
  Check,
  Send,
  Trash2,
  Clock,
  AlertCircle,
} from 'lucide-react';

interface UploadedFile {
  name: string;
  size: string;
  uploadStep: 'idle' | 'presigned' | 'minio' | 'confirm' | 'done' | 'error';
  fileId?: string;
  error?: string;
}

export default function InstructorApply() {
  const { latestRequest, isLoading, submit, isSubmitPending } = useInstructorRequest();

  const [experienceText, setExperienceText] = useState('');
  const [proposedCategory, setProposedCategory] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const [cvFile, setCvFile] = useState<UploadedFile | null>(null);
  const [certFile, setCertFile] = useState<UploadedFile | null>(null);

  const hasSubmitted = latestRequest?.status === 'Pending' || latestRequest?.status === 'Approved' || latestRequest?.status === 'Rejected';

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'cv' | 'cert'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formattedSize = (file.size / (1024 * 1024)).toFixed(2) + ' MB';
    const initial: UploadedFile = { name: file.name, size: formattedSize, uploadStep: 'presigned' };

    if (type === 'cv') setCvFile(initial);
    else setCertFile(initial);

    try {
      const isPdf = file.type === 'application/pdf';
      const fileType = type === 'cv' ? 2 : isPdf ? 4 : 0;
      const result = await mediaService.uploadFile(file, fileType);
      const done: UploadedFile = { name: file.name, size: formattedSize, uploadStep: 'done', fileId: result.id };
      if (type === 'cv') setCvFile(done);
      else setCertFile(done);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'فشل رفع الملف';
      const errorState: UploadedFile = { name: file.name, size: formattedSize, uploadStep: 'error', error: msg };
      if (type === 'cv') setCvFile(errorState);
      else setCertFile(errorState);
    }
  };

  const handleRemoveFile = (type: 'cv' | 'cert') => {
    if (type === 'cv') setCvFile(null);
    else setCertFile(null);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!experienceText.trim() || !proposedCategory) return;
    if (!cvFile || cvFile.uploadStep !== 'done') return;
    if (!agreedToTerms) return;

    const documents: InstructorRequestDocumentDto[] = [
      { documentType: 'CV', fileId: cvFile.fileId },
    ];

    if (certFile && certFile.uploadStep === 'done' && certFile.fileId) {
      documents.push({ documentType: 'Certificate', fileId: certFile.fileId });
    }

    submit({
      message: `مجال التدريس: ${proposedCategory}\n\nالخبرات: ${experienceText}`,
      documents,
    });
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><DashboardSkeleton /></div>;

  return (
    <div className="bg-amber-50/15 rounded-3xl border border-amber-200/80 p-5 sm:p-8 max-w-3xl mx-auto text-right font-sans" dir="rtl">

      <div className="text-center space-y-3 pb-6 border-b border-amber-100 mb-6">
        <div className="w-16 h-16 bg-[#962D15]/10 text-[#962D15] rounded-full flex items-center justify-center mx-auto shadow-2xs">
          <GraduationCap className="w-9 h-9 animate-pulse" />
        </div>
        <div className="space-y-1.5 max-w-xl mx-auto">
          <h2 className="text-lg sm:text-2xl font-black text-stone-900 font-serif">انضم إلى نخبة مدربي منصة آثاري</h2>
          <p className="text-xs sm:text-sm text-stone-500 leading-relaxed font-light">
            قُل كلمتَك واشحَذ فكر الطلاب. انضم إلينا لتدريس البلاغة، علم المخطوطات، الزخارف والخط.
          </p>
        </div>
      </div>

      {hasSubmitted ? (
        <div className="bg-white border border-amber-100 rounded-2xl p-8 text-center space-y-6">
          <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-300">
            <Check className="w-10 h-10 text-emerald-700 stroke-[3]" />
          </div>

          <div className="space-y-2">
            <h3 className="font-extrabold text-stone-950 text-base sm:text-lg">
              {latestRequest?.status === 'Approved' && 'تم قبول طلبك!'}
              {latestRequest?.status === 'Pending' && 'طلبك قيد المراجعة'}
              {latestRequest?.status === 'Rejected' && 'تم رفض طلبك'}
            </h3>
            <p className="text-xs text-stone-500 leading-relaxed max-w-md mx-auto">
              {latestRequest?.status === 'Pending' && 'جاري مراجعة طلبك من قبل الهيئة الاستشارية. سيتم التواصل معك قريباً.'}
              {latestRequest?.status === 'Approved' && 'تهانينا! تم قبول طلبك. يمكنك الآن البدء بالتدريس على المنصة.'}
              {latestRequest?.status === 'Rejected' && latestRequest.message
                ? `سبب الرفض: ${latestRequest.message}`
                : 'لم يتم قبول طلبك في هذه المرة.'}
            </p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleFormSubmit} className="space-y-6">

          {/* Category */}
          <div className="space-y-4">
            <div className="border-r-4 border-orange-700 pr-3">
              <span className="font-extrabold text-xs text-orange-800 block">القسم الأول: تصنيف المجال</span>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-700 block">مجال التدريس المقترح</label>
              <select
                required
                value={proposedCategory}
                onChange={(e) => setProposedCategory(e.target.value)}
                className="w-full bg-white text-stone-900 text-xs py-3.5 px-4 rounded-xl border border-amber-200 focus:outline-none"
              >
                <option value="">-- اختر المجال --</option>
                <option value="علم المخطوطات والتحقيق الأثري">علم المخطوطات والتحقيق الأثري والترميم</option>
                <option value="الخط العربي والحروفيات">الخط العربي والزخرفة الإسلامية</option>
                <option value="البلاغة والأدب العربي القديم">البلاغة العربية والبيان</option>
                <option value="العمارة والأنماط الهندسية القديمة">العمارة الإسلامية والتصميم التراثي</option>
              </select>
            </div>
          </div>

          {/* Experience */}
          <div className="space-y-3 pt-2">
            <div className="border-r-4 border-orange-700 pr-3">
              <span className="font-extrabold text-xs text-orange-800 block">القسم الثاني: الخبرات التعليمية</span>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-700 block">نبذة عن خبرتك</label>
              <textarea
                required
                rows={5}
                value={experienceText}
                onChange={(e) => setExperienceText(e.target.value)}
                placeholder="اكتب هنا سرداً مفصلاً بخبراتك التعليمية والأكاديمية..."
                className="w-full bg-white text-stone-900 text-xs py-3.5 px-4 rounded-xl border border-amber-200 focus:outline-none focus:ring-1 focus:ring-orange-700 leading-relaxed"
              />
            </div>
          </div>

          {/* File Upload */}
          <div className="space-y-4 pt-2">
            <div className="border-r-4 border-orange-700 pr-3">
              <span className="font-extrabold text-xs text-orange-800 block">القسم الثالث: إرفاق الوثائق</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* CV */}
              <div className="text-right space-y-2">
                <label className="text-xs font-bold text-stone-800 block">السيرة الذاتية (CV)</label>
                {cvFile ? (
                  <div className="border border-amber-200 bg-white rounded-2xl p-4 flex flex-col justify-between min-h-[140px] relative">
                    <div className="flex gap-3 items-start">
                      <div className="p-2.5 bg-orange-50 text-[#962D15] rounded-xl shrink-0">
                        <FileText className="w-6 h-6" />
                      </div>
                      <div className="space-y-1 min-w-0">
                        <h5 className="font-extrabold text-xs text-stone-900 truncate">{cvFile.name}</h5>
                        <p className="text-[10px] text-stone-500">{cvFile.size}</p>
                        {cvFile.uploadStep === 'presigned' && (
                          <div className="text-[9px] text-amber-700 font-bold flex items-center gap-1">
                            <Clock className="w-3 h-3 animate-spin" />
                            <span>جاري رفع الملف...</span>
                          </div>
                        )}
                        {cvFile.uploadStep === 'error' && (
                          <div className="text-[9px] text-red-700 font-bold flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            <span>{cvFile.error || 'فشل الرفع'}</span>
                          </div>
                        )}
                        {cvFile.uploadStep === 'done' && (
                          <div className="text-[9px] text-emerald-800 font-black flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded w-fit border border-emerald-100">
                            <Check className="w-3 h-3" />
                            <span>مرفوع بنجاح</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-end mt-3 pt-3 border-t border-stone-50">
                      <button type="button" onClick={() => handleRemoveFile('cv')} className="p-1.5 text-stone-400 hover:text-red-700 bg-stone-50 hover:bg-red-50 rounded border-0 cursor-pointer">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="border border-dashed border-amber-300 rounded-2xl bg-white p-5 text-center hover:border-orange-700 transition flex flex-col justify-center items-center gap-3 min-h-[140px] relative">
                    <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => handleFileUpload(e, 'cv')} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
                    <Upload className="w-8 h-8 text-amber-600 shrink-0" />
                    <div className="space-y-1">
                      <span className="font-extrabold text-[11px] text-stone-900 block">اسحب أو انقر لرفع السيرة الذاتية</span>
                      <span className="text-[9px] text-stone-400 block">PDF, Word (حد أقصى 10 ميجا)</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Certs */}
              <div className="text-right space-y-2">
                <label className="text-xs font-bold text-stone-800 block">الشهادات (اختياري)</label>
                {certFile ? (
                  <div className="border border-amber-200 bg-white rounded-2xl p-4 flex flex-col justify-between min-h-[140px] relative">
                    <div className="flex gap-3 items-start">
                      <div className="p-2.5 bg-orange-50 text-[#962D15] rounded-xl shrink-0">
                        <GraduationCap className="w-6 h-6" />
                      </div>
                      <div className="space-y-1 min-w-0">
                        <h5 className="font-extrabold text-xs text-stone-900 truncate">{certFile.name}</h5>
                        <p className="text-[10px] text-stone-500">{certFile.size}</p>
                        {certFile.uploadStep === 'error' ? (
                          <div className="text-[9px] text-red-700 font-bold flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            <span>{certFile.error || 'فشل الرفع'}</span>
                          </div>
                        ) : certFile.uploadStep === 'done' ? (
                          <div className="text-[9px] text-emerald-800 font-black flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded w-fit border border-emerald-100">
                            <Check className="w-3 h-3" />
                            <span>مرفوع بنجاح</span>
                          </div>
                        ) : (
                          <div className="text-[9px] text-amber-700 font-bold flex items-center gap-1">
                            <Clock className="w-3 h-3 animate-spin" />
                            <span>جاري الرفع...</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-end mt-3 pt-3 border-t border-stone-50">
                      <button type="button" onClick={() => handleRemoveFile('cert')} className="p-1.5 text-stone-400 hover:text-red-700 bg-stone-50 hover:bg-red-50 rounded border-0 cursor-pointer">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="border border-dashed border-amber-300 rounded-2xl bg-white p-5 text-center hover:border-orange-700 transition flex flex-col justify-center items-center gap-3 min-h-[140px] relative">
                    <input type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={(e) => handleFileUpload(e, 'cert')} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
                    <Upload className="w-8 h-8 text-amber-600 shrink-0" />
                    <div className="space-y-1">
                      <span className="font-extrabold text-[11px] text-stone-900 block">اسحب أو انقر لرفع المؤهلات</span>
                      <span className="text-[9px] text-stone-400 block">PDF, صور (حد أقصى 10 ميجا)</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Agreement */}
          <div className="space-y-3 pt-4 border-t border-amber-100">
            <div className="flex items-start gap-3 bg-white p-4 border border-amber-200/55 rounded-2xl cursor-pointer">
              <input
                id="agree-checkbox"
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="w-5 h-5 text-orange-700 focus:ring-0 cursor-pointer accent-orange-700 mt-0.5 shrink-0"
              />
              <label htmlFor="agree-checkbox" className="text-xs text-stone-600 leading-relaxed font-medium select-none cursor-pointer">
                أقر بصحة البيانات وأوافق على شروط ميثاق التدريس والتعليم لمنصة آثاري.
              </label>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2 flex justify-center sm:justify-end">
            <button
              type="submit"
              disabled={isSubmitPending || !agreedToTerms || !cvFile || cvFile.uploadStep !== 'done' || !cvFile.fileId}
              className="w-full sm:w-auto bg-orange-700 hover:bg-orange-800 text-white font-black py-4 px-10 rounded-xl text-xs sm:text-sm transition shadow-lg flex items-center justify-center gap-2.5 border-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>جاري الإرسال...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>إرسال طلب الانضمام</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
