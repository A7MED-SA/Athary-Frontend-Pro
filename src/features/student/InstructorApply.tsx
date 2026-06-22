import React, { useState } from 'react';
import { 
  GraduationCap, 
  Upload, 
  FileText, 
  CheckSquare, 
  Send, 
  Trash2, 
  Check, 
  AlertCircle,
  Clock,
  ExternalLink,
  Lock,
  ArrowLeftRight
} from 'lucide-react';

interface UploadedFile {
  name: string;
  size: string;
  type: string;
  uploadStep: 'idle' | 'presigned' | 'minio' | 'confirm' | 'done';
  minioUrl?: string;
}

interface InstructorApplyProps {
  onTriggerToast: (msg: string) => void;
}

export default function InstructorApply({ onTriggerToast }: InstructorApplyProps) {
  const [experienceText, setExperienceText] = useState<string>('');
  const [proposedCategory, setProposedCategory] = useState<string>('');
  const [agreedToTerms, setAgreedToTerms] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);

  // States for the two distinct dropzones
  const [cvFile, setCvFile] = useState<UploadedFile | null>(null);
  const [certFile, setCertFile] = useState<UploadedFile | null>(null);

  // Simulated Presigned URL and MinIO Upload sequence (MinIO 2-Step)
  const handleSimulatedFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>, 
    type: 'cv' | 'cert'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formattedSize = (file.size / (1024 * 1024)).toFixed(2) + ' MB';
    
    const initialUploadState: UploadedFile = {
      name: file.name,
      size: formattedSize,
      type: file.type,
      uploadStep: 'presigned'
    };

    if (type === 'cv') setCvFile(initialUploadState);
    else setCertFile(initialUploadState);

    // Step 1: Request Presigned URL
    setTimeout(() => {
      const step2State: UploadedFile = {
        ...initialUploadState,
        uploadStep: 'minio'
      };
      if (type === 'cv') setCvFile(step2State);
      else setCertFile(step2State);

      // Step 2: Upload directly to MinIO s3 storage
      setTimeout(() => {
        const step3State: UploadedFile = {
          ...step2State,
          uploadStep: 'confirm'
        };
        if (type === 'cv') setCvFile(step3State);
        else setCertFile(step3State);

        // Step 3: Confirm-Upload to .NET Backend API for Database relational sync
        setTimeout(() => {
          const finalState: UploadedFile = {
            ...step3State,
            uploadStep: 'done',
            minioUrl: `https://minio.athary.edu.sa/documents/${type}/${Date.now()}_${file.name}`
          };
          if (type === 'cv') setCvFile(finalState);
          else setCertFile(finalState);
          onTriggerToast(`✓ تم رفع الملف "${file.name}" وتوثيقه بنظام MinIO ثنائي الخطوة بنجاح ☁️`);
        }, 1200);

      }, 1000);

    }, 800);
  };

  const handleRemoveFile = (type: 'cv' | 'cert') => {
    if (type === 'cv') setCvFile(null);
    else setCertFile(null);
    onTriggerToast('✓ تم إزالة المستند وتفتيت وجوده بالتخزين السحابي.');
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!experienceText.trim() || !proposedCategory) {
      onTriggerToast('❌ يرجى ملء حقل نبذة الخبرة واختيار التخصص المقترح.');
      return;
    }
    if (!cvFile || cvFile.uploadStep !== 'done') {
      onTriggerToast('❌ مستند السيرة الذاتية (CV) ضروري لإقفال ومراجعة طلب التدريس.');
      return;
    }
    if (!agreedToTerms) {
      onTriggerToast('❌ يرجى الموافقة أولاً على أحكام وميثاق التدريس والتعليم لدى آثاري.');
      return;
    }

    setIsSubmitting(true);

    // Simulated API POST to /api/teacher-requests with files sync
    setTimeout(() => {
      setIsSubmitting(false);
      setHasSubmitted(true);
      onTriggerToast('🎉 تهانينا الشارقة! تم حفظ وبث طلب الانضمام كمعيد لمدققي هيئات التدريس بنجاح.');
    }, 2000);
  };

  return (
    <div className="bg-amber-50/15 rounded-3xl border border-amber-200/80 p-5 sm:p-8 max-w-3xl mx-auto text-right font-sans" id="become-instructor-application">
      
      {/* Centered header banner */}
      <div className="text-center space-y-3 pb-6 border-b border-amber-100 mb-6">
        <div className="w-16 h-16 bg-[#962D15]/10 text-[#962D15] rounded-full flex items-center justify-center mx-auto shadow-2xs">
          <GraduationCap className="w-9 h-9 animate-pulse" />
        </div>
        <div className="space-y-1.5 max-w-xl mx-auto">
          <h2 className="text-lg sm:text-2xl font-black text-stone-900 font-serif">انضم إلى نخبة مبدعي ومدربي منصة آثاري</h2>
          <p className="text-xs sm:text-sm text-stone-500 leading-relaxed font-light">
            قُل كلمتَك واشحَذ فكر الطلاب والمواهب بربوع الوطن العربي. انضم إلينا لتدريس البلاغة، علم المخطوطات، الزخارف والخط على مذهب رصين.
          </p>
        </div>
      </div>

      {hasSubmitted ? (
        <div className="bg-white border border-amber-100 rounded-2xl p-8 text-center space-y-6 animate-scale-up">
          <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-300">
            <Check className="w-10 h-10 text-emerald-700 stroke-[3]" />
          </div>

          <div className="space-y-2">
            <h3 className="font-extrabold text-stone-950 text-base sm:text-lg">تم تسجيل وبث طلب انضمامك بنجاح!</h3>
            <p className="text-xs text-stone-500 leading-relaxed max-w-md mx-auto">
              طلبك قيد المراجعة العلمية لدى الهيئة الاستشارية العليا لآثاري تحت الكد النظامي <strong className="font-mono text-orange-900">REQ-ATH-{Math.floor(20500 + Math.random() * 5000)}</strong>.
            </p>
            <p className="text-xs text-stone-500 max-w-md mx-auto">
              سيتم موازنة وفحص سوانح سيرتك وخبراتك وسيتم التواصل معك على الجوال المصدق لجدولة المقابلة والتحكيم المرئي.
            </p>
          </div>

          <div className="pt-4 border-t border-stone-100 flex flex-col sm:flex-row justify-center gap-3">
            <button
              onClick={() => setHasSubmitted(false)}
              className="bg-stone-50 text-stone-700 hover:bg-stone-100 border border-stone-200 rounded-xl py-3 px-5 text-xs font-black transition cursor-pointer"
            >
              تقديم تعديل أو طلب جديد
            </button>
            
            <a 
              href="mailto:instructors@athary.edu.sa" 
              className="bg-orange-700 hover:bg-orange-800 text-amber-50 rounded-xl py-3 px-6 text-xs font-black transition text-center no-underline"
            >
              مراسلة مصلحة شؤون التعليمية
            </a>
          </div>
        </div>
      ) : (
        <form onSubmit={handleFormSubmit} className="space-y-6">
          
          {/* Section 1: Proposed Category */}
          <div className="space-y-4">
            <div className="border-r-4 border-orange-700 pr-3">
              <span className="font-extrabold text-xs text-orange-800 block">القسم الأول: تصنيف المجلس والطلب</span>
              <p className="text-[10px] text-stone-400 mt-0.5">تحديد الحقل الدراسي الذي يسري فيه تخصصك الموقر.</p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-700 block">مجال التدريس والتحقيق المقترح</label>
              <select
                required
                value={proposedCategory}
                onChange={(e) => setProposedCategory(e.target.value)}
                className="w-full bg-white text-stone-900 text-xs py-3.5 px-4 rounded-xl border border-amber-200 focus:outline-none"
              >
                <option value="">-- يرجى اختيار الحقل الأكثر مطابقة لخيوط علمك --</option>
                <option value="علم المخطوطات والتحقيق الأثري">علم المخطوطات والتحقيق الأثري والترميم</option>
                <option value="الخط العربي والحروفيات">الخط العربي والزخرفة الإسلامية الكلاسيكية</option>
                <option value="البلاغة والأدب العربي القديم">البلاغة العربية والبيان ونقوش النثر</option>
                <option value="العمارة والأنماط الهندسية القديمة">العمارة الإسلامية والتصميم التراثي</option>
              </select>
            </div>
          </div>

          {/* Section 2: Experience */}
          <div className="space-y-3 pt-2">
            <div className="border-r-4 border-orange-700 pr-3">
              <span className="font-extrabold text-xs text-orange-800 block">القسم الثاني: حقل السوانح والخبرات التعليمية</span>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-700 block">نبذة عن خبرتك التعليمية، الأكاديمية أو الميدانية</label>
              <textarea
                required
                rows={5}
                value={experienceText}
                onChange={(e) => setExperienceText(e.target.value)}
                placeholder="اكتب هنا سرداً مفصلاً بالمدارس أو المعاهد أو مجالس البحث التي قمت بالتدريس بها أو إخراج الشهادات، ومشاريعك التراثية السابقة..."
                className="w-full bg-white text-stone-900 text-xs py-3.5 px-4 rounded-xl border border-amber-200 focus:outline-none focus:ring-1 focus:ring-orange-700 leading-relaxed"
              />
            </div>
          </div>

          {/* Section 3: File Upload with presigned MinIO sequences */}
          <div className="space-y-4 pt-2">
            <div className="border-r-4 border-orange-700 pr-3">
              <span className="font-extrabold text-xs text-orange-800 block">القسم الثالث: إرفاق الوثائق الرسمية والشهادات</span>
              <p className="text-[10px] text-stone-400 mt-0.5">معد بنظام الرفع الآمن ثنائي المرحلة (MinIO Cloud API Integration).</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Dropzone 1: CV */}
              <div className="text-right space-y-2">
                <label className="text-xs font-bold text-stone-800 block">مرمى السيرة الذاتية (CV)</label>
                
                {cvFile ? (
                  <div className="border border-amber-200 bg-white rounded-2xl p-4 flex flex-col justify-between min-h-[140px] relative">
                    <div className="flex gap-3 items-start">
                      <div className="p-2.5 bg-orange-50 text-[#962D15] rounded-xl shrink-0">
                        <FileText className="w-6 h-6" />
                      </div>
                      <div className="space-y-1 min-w-0">
                        <h5 className="font-extrabold text-xs text-stone-900 truncate" title={cvFile.name}>{cvFile.name}</h5>
                        <p className="text-[10px] text-stone-500">{cvFile.size}</p>
                        
                        {/* Process display */}
                        {cvFile.uploadStep === 'presigned' && (
                          <div className="text-[9px] text-blue-700 font-bold flex items-center gap-1">
                            <Clock className="w-3   h-3 animate-spin" />
                            <span>[١/٣] طلب رابط Presigned URL...</span>
                          </div>
                        )}
                        {cvFile.uploadStep === 'minio' && (
                          <div className="text-[9px] text-amber-700 font-bold flex items-center gap-1">
                            <Upload className="w-3 h-3 animate-bounce" />
                            <span>[٢/٣] رفع مباشر لمخازن MinIO...</span>
                          </div>
                        )}
                        {cvFile.uploadStep === 'confirm' && (
                          <div className="text-[9px] text-[#962D15] font-bold flex items-center gap-1">
                            <ArrowLeftRight className="w-3 h-3 animate-pulse" />
                            <span>[٣/٣] ربط وتحديث Confirm-Upload...</span>
                          </div>
                        )}
                        {cvFile.uploadStep === 'done' && (
                          <div className="text-[9px] text-emerald-800 font-black flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded w-fit border border-emerald-100">
                            <Check className="w-3 h-3" />
                            <span>مرفوع ومصادق بالرابط ☁️</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-between items-center mt-3 pt-3 border-t border-stone-50">
                      <span className="text-[8px] text-stone-400 font-mono italic">
                        {cvFile.uploadStep === 'done' ? 'سحابة MinIO مسيرة' : 'جار الرفع الآمن...'}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFile('cv')}
                        className="p-1.5 text-stone-400 hover:text-red-700 bg-stone-50 hover:bg-red-50 rounded border-0 cursor-pointer"
                        title="إزالة وتفتيت الملف"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="border border-dashed border-amber-300 rounded-2xl bg-white p-5 text-center hover:border-orange-700 transition flex flex-col justify-center items-center gap-3 min-h-[140px] relative">
                    <input 
                      type="file" 
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => handleSimulatedFileUpload(e, 'cv')}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                    <Upload className="w-8 h-8 text-amber-600 shrink-0" />
                    <div className="space-y-1">
                      <span className="font-extrabold text-[11px] text-stone-900 block">اسحب وألقِ السيرة الذاتية أو انقر هنا</span>
                      <span className="text-[9px] text-stone-400 block">الملفات المدعومة: PDF, Word (بحد أقصى ١٠ ميجابايت)</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Dropzone 2: Credentials & Certs */}
              <div className="text-right space-y-2">
                <label className="text-xs font-bold text-stone-800 block">شهادات الخبرة أو المؤهلات (إختياري)</label>
                
                {certFile ? (
                  <div className="border border-amber-200 bg-white rounded-2xl p-4 flex flex-col justify-between min-h-[140px] relative">
                    <div className="flex gap-3 items-start">
                      <div className="p-2.5 bg-orange-50 text-[#962D15] rounded-xl shrink-0">
                        <GraduationCap className="w-6 h-6" />
                      </div>
                      <div className="space-y-1 min-w-0">
                        <h5 className="font-extrabold text-xs text-stone-900 truncate" title={certFile.name}>{certFile.name}</h5>
                        <p className="text-[10px] text-stone-500">{certFile.size}</p>
                        
                        {/* Process display */}
                        {certFile.uploadStep === 'presigned' && (
                          <div className="text-[9px] text-blue-700 font-bold flex items-center gap-1">
                            <Clock className="w-3 h-3 animate-spin" />
                            <span>[١/٣] طلب رابط Presigned URL...</span>
                          </div>
                        )}
                        {certFile.uploadStep === 'minio' && (
                          <div className="text-[9px] text-amber-700 font-bold flex items-center gap-1">
                            <Upload className="w-3 h-3 animate-bounce" />
                            <span>[٢/٣] رفع مباشر لمخازن MinIO...</span>
                          </div>
                        )}
                        {certFile.uploadStep === 'confirm' && (
                          <div className="text-[9px] text-[#962D15] font-bold flex items-center gap-1">
                            <ArrowLeftRight className="w-3 h-3 animate-pulse" />
                            <span>[٣/٣] ربط وتحديث Confirm-Upload...</span>
                          </div>
                        )}
                        {certFile.uploadStep === 'done' && (
                          <div className="text-[9px] text-emerald-800 font-black flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded w-fit border border-emerald-100">
                            <Check className="w-3 h-3" />
                            <span>مرفوع ومصادق بالرابط ☁️</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-between items-center mt-3 pt-3 border-t border-stone-50">
                      <span className="text-[8px] text-stone-400 font-mono italic">
                        {certFile.uploadStep === 'done' ? 'سحابة MinIO مسيرة' : 'جار الرفع الآمن...'}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFile('cert')}
                        className="p-1.5 text-stone-400 hover:text-red-700 bg-stone-50 hover:bg-red-50 rounded border-0 cursor-pointer"
                        title="إزالة وتفتيت الملف"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="border border-dashed border-amber-300 rounded-2xl bg-white p-5 text-center hover:border-orange-700 transition flex flex-col justify-center items-center gap-3 min-h-[140px] relative">
                    <input 
                      type="file" 
                      accept=".pdf,.png,.jpg,.jpeg"
                      onChange={(e) => handleSimulatedFileUpload(e, 'cert')}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                    <Upload className="w-8 h-8 text-amber-600 shrink-0" />
                    <div className="space-y-1">
                      <span className="font-extrabold text-[11px] text-stone-900 block">اسحب وألقِ المؤهلات أو انقر هنا</span>
                      <span className="text-[9px] text-stone-400 block">الملفات المدعومة: PDF, صور (بحد أقصى ١٠ ميجابايت)</span>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* Agreement Checkbox */}
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
                أقر بصحة البيانات المدرجة في هذا الطلب الشريف، وأوافق طوعاً على شروط ميثاق التدريس والتعليم لمنصة آثاري، وبما يحفظ مصداقية المحتوى التراثي وحقوق الدارسين بالأمانة المعرفية.
              </label>
            </div>
          </div>

          {/* Action Footer Button */}
          <div className="pt-2 flex justify-center sm:justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full sm:w-auto bg-orange-700 hover:bg-orange-800 text-white font-black py-4 px-10 rounded-xl text-xs sm:text-sm transition shadow-lg flex items-center justify-center gap-2.5 border-0 cursor-pointer ${
                isSubmitting ? 'opacity-80 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>جاري رفع الطلب العلمي ووثائق MinIO...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>إرسال طلب الانضمام التدريسي للهيئة العليا</span>
                </>
              )}
            </button>
          </div>

        </form>
      )}

    </div>
  );
}
