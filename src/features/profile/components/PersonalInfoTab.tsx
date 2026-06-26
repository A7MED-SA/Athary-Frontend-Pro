import { CheckCircle, AlertCircle, Upload, Trash2, Save, Globe } from 'lucide-react';

interface PersonalInfoTabProps {
  firstName: string; lastName: string; fullName: string; bio: string;
  gender: string; dob: string; nationality: string; avatarUrl: string;
  validationErrors: Record<string, string>;
  isLoadingPicture: boolean; uploadStep: number; isUpdatePending: boolean;
  userEmail: string;
  onFirstNameChange: (v: string) => void;
  onLastNameChange: (v: string) => void;
  onFullNameChange: (v: string) => void;
  onBioChange: (v: string) => void;
  onGenderChange: (v: string) => void;
  onDobChange: (v: string) => void;
  onNationalityChange: (v: string) => void;
  onPictureUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemovePicture: () => void;
  onSave: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export function PersonalInfoTab({
  firstName, lastName, fullName, bio, gender, dob, nationality, avatarUrl,
  validationErrors, isLoadingPicture, uploadStep, isUpdatePending, userEmail,
  onFirstNameChange, onLastNameChange, onFullNameChange, onBioChange,
  onGenderChange, onDobChange, onNationalityChange,
  onPictureUpload, onRemovePicture, onSave, onCancel,
}: PersonalInfoTabProps) {
  return (
    <div className="space-y-6">
      <div className="bg-orange-50/20 p-5 rounded-2xl border border-stone-200">
        <div className="relative w-[120px] h-[120px] rounded-full shrink-0 bg-stone-200 border-2 border-orange-700/80 overflow-hidden shadow">
          {avatarUrl ? (
            <img src={avatarUrl} alt="الملف الشخصي" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-stone-500 font-serif text-3xl font-black bg-stone-100">
              {fullName.slice(0, 2)}
            </div>
          )}
          {isLoadingPicture && (
            <div className="absolute inset-0 bg-stone-900/80 flex flex-col items-center justify-center text-amber-50 text-[10px] p-2 text-center">
              <span className="animate-spin text-orange-500 text-lg">⏳</span>
              <span className="mt-1 font-bold">جاري الرفع... {uploadStep}/4</span>
            </div>
          )}
        </div>

        <div className="space-y-3 text-center sm:text-right flex-1 mt-4">
          <h3 className="text-xs font-black text-stone-900 block">الصورة الشخصية الرسمية</h3>
          <p className="text-[11px] text-stone-400 leading-normal font-light">
            تتكامل الواجهة مع GET/PUT /api/profile/picture عبر ترحيل مرحلي مزدوج لقنوات التخزين لـ MinIO.
          </p>

          <div className="flex flex-wrap justify-center sm:justify-start gap-3">
            <label className="bg-orange-700 hover:bg-orange-850 text-amber-50 text-xs font-black py-2 px-4 rounded-xl shadow-xs transition border-0 cursor-pointer flex items-center gap-1.5 disabled:opacity-50">
              <Upload className="w-3.5 h-3.5" />
              <span>تغيير الصورة</span>
              <input type="file" accept="image/*" className="hidden" onChange={onPictureUpload} disabled={isLoadingPicture} />
            </label>
            {avatarUrl && (
              <button type="button" onClick={onRemovePicture} className="text-red-700 hover:text-red-900 bg-red-50 hover:bg-red-100 text-xs font-black py-2 px-4 rounded-xl transition border-0 cursor-pointer flex items-center gap-1.5">
                <Trash2 className="w-3.5 h-3.5" />
                <span>حذف الصورة</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <form onSubmit={onSave} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-900 block">الاسم الأول</label>
            <input type="text" maxLength={100}
              className={`w-full bg-stone-50 p-3 text-xs text-stone-950 border rounded-xl focus:outline-none focus:bg-white focus:border-orange-700 font-semibold ${validationErrors.firstName ? 'border-red-500 ring-2 ring-red-100' : 'border-stone-200/80'}`}
              value={firstName} onChange={(e) => onFirstNameChange(e.target.value)} placeholder="أحمد" />
            {validationErrors.firstName && <p className="text-[10px] text-red-600 font-bold mt-1">⚠️ {validationErrors.firstName}</p>}
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-900 block">اسم العائلة</label>
            <input type="text" maxLength={100}
              className={`w-full bg-stone-50 p-3 text-xs text-stone-950 border rounded-xl focus:outline-none focus:bg-white focus:border-orange-700 font-semibold ${validationErrors.lastName ? 'border-red-500 ring-2 ring-red-100' : 'border-stone-200/80'}`}
              value={lastName} onChange={(e) => onLastNameChange(e.target.value)} placeholder="التميمي" />
            {validationErrors.lastName && <p className="text-[10px] text-red-600 font-bold mt-1">⚠️ {validationErrors.lastName}</p>}
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-stone-900 block font-serif">الاسم الكامل الشريف (المسجل بالإجازات)</label>
          <input type="text"
            className={`w-full bg-stone-100 p-3 text-xs text-stone-900 border rounded-xl focus:outline-none font-bold ${validationErrors.fullName ? 'border-red-700 ring-1 ring-red-400' : 'border-stone-200/80'}`}
            value={fullName} onChange={(e) => onFullNameChange(e.target.value)} placeholder="أحمد بن معز التميمي..." />
          {validationErrors.fullName && (
            <p className="text-[11px] text-red-700 font-bold flex items-center gap-1 animate-pulse mt-1">
              <AlertCircle className="w-3.5 h-3.5 text-red-700 shrink-0" />
              <span>{validationErrors.fullName}</span>
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-900 block">الجنس</label>
            <select className="w-full bg-stone-50 p-3 text-xs text-stone-950 border border-stone-200/80 rounded-xl focus:outline-none focus:bg-white focus:border-orange-700"
              value={gender} onChange={(e) => onGenderChange(e.target.value)}>
              <option value="male">ذكر</option>
              <option value="female">أنثى</option>
              <option value="prefer_not_to_say">يفضل عدم الإفصاح</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-900 block">تاريخ الميلاد</label>
            <input type="date"
              className="w-full bg-stone-50 p-3 text-xs text-stone-950 border border-stone-200/80 rounded-xl focus:outline-none focus:bg-white focus:border-orange-700 font-mono"
              value={dob} onChange={(e) => onDobChange(e.target.value)} />
          </div>
        </div>

        <div className="h-px bg-stone-100 my-4" />
        <h3 className="text-xs font-black text-orange-950 font-serif mb-2">الجنسية</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-900 block">الجنسية</label>
            <div className="relative">
              <input type="text"
                className="w-full bg-stone-50 pr-10 p-3 text-xs text-stone-950 border border-stone-200/80 rounded-xl focus:outline-none focus:bg-white focus:border-orange-700 font-semibold"
                value={nationality} onChange={(e) => onNationalityChange(e.target.value)} placeholder="المملكة العربية السعودية..." />
              <Globe className="w-4 h-4 text-stone-400 absolute right-3.5 top-3.5" />
            </div>
          </div>
        </div>

        <div className="h-px bg-stone-100 my-4" />

        <div className="space-y-1">
          <label className="text-xs font-bold text-stone-700 block">عنوان البريد الإلكتروني (غير قابل للتعديل)</label>
          <div className="relative">
            <input type="email" disabled
              className="w-full bg-stone-100 p-3 text-xs text-stone-500 border border-stone-200 rounded-xl cursor-not-allowed font-mono text-left"
              value={userEmail} dir="ltr" />
            <span className="absolute top-2.5 right-3 bg-emerald-100 text-emerald-800 text-[10px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-emerald-300">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-700" />
              <span>مؤكد</span>
            </span>
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold text-stone-900 block">نبذة تعريفية (Bio)</label>
            <span className="text-[10px] text-stone-400 font-mono">{bio.length}/500 حرف</span>
          </div>
          <textarea rows={3}
            className="w-full bg-stone-50 p-3 text-xs text-stone-950 border border-stone-200/80 rounded-xl focus:outline-none focus:bg-white focus:border-orange-700 leading-relaxed font-sans"
            maxLength={500} value={bio} onChange={(e) => onBioChange(e.target.value)}
            placeholder="تحدث بوضوح وتأصيل عن دراستك التراثية العريقة واهتماماتك الميدانية..." />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-stone-100">
          <button type="button" onClick={onCancel}
            className="bg-stone-100 hover:bg-stone-200 text-stone-600 font-bold py-2.5 px-6 rounded-xl text-xs transition border-0 cursor-pointer">
            إلغاء
          </button>
          <button type="submit" disabled={isUpdatePending}
            className="bg-orange-700 hover:bg-orange-850 text-amber-50 font-black py-2.5 px-6 rounded-xl text-xs shadow-sm transition border-0 cursor-pointer flex items-center gap-1.5 disabled:opacity-50">
            <Save className="w-4 h-4" />
            <span>{isUpdatePending ? 'جاري الحفظ...' : 'حفظ التغييرات'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
