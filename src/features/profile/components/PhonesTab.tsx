import { Phone, Plus, X, Star, Trash2 } from 'lucide-react';

interface PhoneItem { id: string; number: string; isDefault: boolean; type: string; }

interface PhonesTabProps {
  phones: PhoneItem[];
  isAdding: boolean;
  newPhone: string;
  newPhoneType: 'Primary' | 'Secondary';
  validationErrors: Record<string, string>;
  onToggleAdd: () => void;
  onNewPhoneChange: (v: string) => void;
  onNewPhoneTypeChange: (v: 'Primary' | 'Secondary') => void;
  onAddSubmit: (e: React.FormEvent) => void;
  onSetDefault: (id: string) => void;
  onDelete: (id: string) => void;
}

export function PhonesTab({
  phones, isAdding, newPhone, newPhoneType, validationErrors,
  onToggleAdd, onNewPhoneChange, onNewPhoneTypeChange, onAddSubmit,
  onSetDefault, onDelete,
}: PhonesTabProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-stone-100 pb-3">
        <h3 className="text-xs sm:text-sm font-black text-orange-950 font-serif">إدارة هويات الهواتف المعتمدة</h3>
        <button onClick={onToggleAdd}
          className="bg-orange-700 hover:bg-orange-850 text-amber-50 text-[11px] py-1.5 px-3 rounded-lg font-black flex items-center gap-1 transition-all border-0 cursor-pointer">
          {isAdding ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
          <span>{isAdding ? 'إلغاء' : 'إضافة رقم جديد'}</span>
        </button>
      </div>

      {isAdding && (
        <form onSubmit={onAddSubmit} className="p-4 bg-stone-50 border border-amber-200/50 rounded-2xl space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-stone-700 block">رقم الهاتف</label>
              <input type="text" required value={newPhone} onChange={(e) => onNewPhoneChange(e.target.value)}
                placeholder="+966 5x xxx xxxx"
                className={`w-full bg-white text-stone-950 text-xs py-2 px-3 rounded-lg border focus:outline-none ${validationErrors.newPhone ? 'border-red-500 ring-2 ring-red-100' : 'border-stone-200'}`} />
              {validationErrors.newPhone && <p className="text-[9.5px] text-red-600 font-bold mt-1">⚠️ {validationErrors.newPhone}</p>}
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-stone-700 block">نوع الهاتف</label>
              <select value={newPhoneType} onChange={(e) => onNewPhoneTypeChange(e.target.value as 'Primary' | 'Secondary')}
                className="w-full bg-white text-stone-950 text-xs py-2 px-3 rounded-lg border border-stone-200 focus:outline-none">
                <option value="Primary">رئيسي</option>
                <option value="Secondary">ثانوي</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end pt-1">
            <button type="submit" className="bg-orange-700 hover:bg-orange-850 text-white text-[10px] font-black px-4 py-2 rounded-lg cursor-pointer border-0">حفظ رقم الهاتف</button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {phones.length === 0 ? (
          <p className="text-center text-stone-400 text-xs py-6">لا توجد أرقام مسجلة</p>
        ) : (
          phones.map((p) => (
            <div key={p.id} className="p-4 bg-stone-50/50 hover:bg-white rounded-2xl border border-stone-200 flex items-center justify-between transition group">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center border-0 ${p.isDefault ? 'bg-orange-100 text-orange-700' : 'bg-stone-100 text-stone-400'}`}>
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-mono font-black text-stone-900 block" dir="ltr">{p.phoneNumber}</span>
                  <span className="text-[10px] text-stone-500 font-light block">{p.type === 'Primary' ? 'رئيسي' : 'ثانوي'}</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                {p.isDefault ? (
                  <span className="text-[9.5px] font-black bg-amber-100 text-amber-950 py-1 px-2.5 rounded-lg border border-amber-300">افتراضي</span>
                ) : (
                  <button onClick={() => onSetDefault(p.id)}
                    className="bg-transparent hover:bg-orange-50/30 p-2 text-stone-300 hover:text-amber-500 rounded-lg transition border-0 cursor-pointer" title="تعيين كافتراضي">
                    <Star className="w-4.5 h-4.5" />
                  </button>
                )}
                <button onClick={() => onDelete(p.id)}
                  className="p-2 text-stone-300 hover:text-red-700 hover:bg-red-50 rounded-lg transition border-0 cursor-pointer" title="حذف الرقم">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
