import { Plus, X, Star, Pencil, Trash2 } from 'lucide-react';

interface AddressItem { id: string; title: string; addressLine: string; isDefault: boolean; }
interface AddressFromProfile { id: string; type: string; streetLine1: string; city: string; country: string; isDefault: boolean; }

interface AddressesTabProps {
  addresses: AddressFromProfile[];
  isAdding: boolean;
  editingAddress: AddressItem | null;
  newAddrTitle: string; newAddrLine: string; newAddrCity: string; newAddrCountry: string; newAddrPostalCode: string;
  onToggleAdd: () => void;
  onNewTitleChange: (v: string) => void;
  onNewLineChange: (v: string) => void;
  onNewCityChange: (v: string) => void;
  onNewCountryChange: (v: string) => void;
  onNewPostalChange: (v: string) => void;
  onAddSubmit: (e: React.FormEvent) => void;
  onEditStart: (a: AddressItem) => void;
  onEditCancel: () => void;
  onEditSubmit: (e: React.FormEvent) => void;
  onSetDefault: (id: string) => void;
  onDelete: (id: string) => void;
}

export function AddressesTab({
  addresses, isAdding, editingAddress,
  newAddrTitle, newAddrLine, newAddrCity, newAddrCountry, newAddrPostalCode,
  onToggleAdd, onNewTitleChange, onNewLineChange, onNewCityChange, onNewCountryChange, onNewPostalChange,
  onAddSubmit, onEditStart, onEditCancel, onEditSubmit, onSetDefault, onDelete,
}: AddressesTabProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-stone-100 pb-3">
        <h3 className="text-xs sm:text-sm font-black text-orange-950 font-serif">العناوين المعتمدة لشحن السجلات</h3>
        <button onClick={onToggleAdd}
          className="bg-orange-700 hover:bg-orange-850 text-amber-50 text-[11px] py-1.5 px-3 rounded-lg font-black flex items-center gap-1 transition-all border-0 cursor-pointer">
          {isAdding ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
          <span>{isAdding ? 'إلغاء' : 'إضافة عنوان جديد'}</span>
        </button>
      </div>

      {isAdding && (
        <form onSubmit={onAddSubmit} className="p-4 bg-stone-50 border border-amber-200/50 rounded-2xl space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-stone-700 block">نوع العنوان (المنزل، العمل)</label>
              <input type="text" required value={newAddrTitle} onChange={(e) => onNewTitleChange(e.target.value)}
                placeholder="المنزل، العمل..." className="w-full bg-white text-stone-950 text-xs py-2 px-3 rounded-lg border border-stone-200 focus:outline-none" />
            </div>
            <div className="space-y-1 sm:col-span-2">
              <label className="text-[10px] font-bold text-stone-700 block">العنوان والتفاصيل</label>
              <input type="text" required value={newAddrLine} onChange={(e) => onNewLineChange(e.target.value)}
                placeholder="الحي، اسم الشارع، رقم البناية..." className="w-full bg-white text-stone-950 text-xs py-2 px-3 rounded-lg border border-stone-200 focus:outline-none" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-stone-700 block">المدينة</label>
              <input type="text" value={newAddrCity} onChange={(e) => onNewCityChange(e.target.value)}
                placeholder="الرياض" className="w-full bg-white text-stone-950 text-xs py-2 px-3 rounded-lg border border-stone-200 focus:outline-none" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-stone-700 block">الدولة</label>
              <input type="text" value={newAddrCountry} onChange={(e) => onNewCountryChange(e.target.value)}
                placeholder="المملكة العربية السعودية" className="w-full bg-white text-stone-950 text-xs py-2 px-3 rounded-lg border border-stone-200 focus:outline-none" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-stone-700 block">الرمز البريدي</label>
              <input type="text" value={newAddrPostalCode} onChange={(e) => onNewPostalChange(e.target.value)}
                placeholder="11564" className="w-full bg-white text-stone-950 text-xs py-2 px-3 rounded-lg border border-stone-200 focus:outline-none" />
            </div>
          </div>
          <div className="flex justify-end pt-1">
            <button type="submit" className="bg-orange-700 hover:bg-orange-850 text-white text-[10px] font-black px-4 py-2 rounded-lg cursor-pointer border-0">حفظ عنوان الشحن</button>
          </div>
        </form>
      )}

      {editingAddress && (
        <form onSubmit={onEditSubmit} className="p-4 bg-amber-50/20 border-2 border-dashed border-amber-200 rounded-2xl space-y-3">
          <h4 className="text-xs font-black text-stone-900">تعديل وتصحيح تفاصيل العنوان:</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-stone-700 block">نوع العنوان</label>
              <input type="text" required value={editingAddress.title}
                onChange={(e) => onEditStart({ ...editingAddress, title: e.target.value })}
                className="w-full bg-white text-stone-950 text-xs py-2 px-3 rounded-lg border border-stone-200 focus:outline-none" />
            </div>
            <div className="space-y-1 sm:col-span-2">
              <label className="text-[10px] font-bold text-stone-700 block">العنوان بالتفصيل</label>
              <input type="text" required value={editingAddress.addressLine}
                onChange={(e) => onEditStart({ ...editingAddress, addressLine: e.target.value })}
                className="w-full bg-white text-stone-950 text-xs py-2 px-3 rounded-lg border border-stone-200 focus:outline-none" />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button type="button" onClick={onEditCancel} className="bg-stone-100 text-stone-600 text-[10px] font-bold px-3 py-1.5 rounded-lg border-0 cursor-pointer">إلغاء</button>
            <button type="submit" className="bg-orange-700 hover:bg-orange-850 text-white text-[10px] font-black px-4 py-1.5 rounded-lg cursor-pointer border-0">تحديث العنوان</button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {addresses.length === 0 ? (
          <p className="col-span-2 text-center text-stone-400 text-xs py-6">لا توجد عناوين مسجلة</p>
        ) : (
          addresses.map((a) => (
            <div key={a.id}
              className={`p-4 rounded-2xl border flex flex-col justify-between text-right transition-all duration-300 ${a.isDefault ? 'border-orange-600 bg-orange-50/20 shadow-2xs' : 'border-stone-200 bg-white hover:border-stone-400'}`}>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-right">
                  <span className="font-black text-xs text-orange-950 font-serif">{a.type}</span>
                  {a.isDefault && <span className="text-[9px] bg-amber-100 text-amber-950 px-2.5 py-0.5 rounded-full border border-amber-300">الافتراضي للشحن</span>}
                </div>
                <p className="text-[11px] text-stone-600 leading-relaxed font-light">{a.streetLine1}</p>
                <p className="text-[10px] text-stone-400 leading-none">{a.city} - {a.country}</p>
              </div>
              <div className="flex items-center justify-end gap-2 pt-4 mt-3 border-t border-stone-100">
                {!a.isDefault && (
                  <button onClick={() => onSetDefault(a.id)}
                    className="text-[10px] text-orange-700 hover:text-orange-850 bg-transparent border-0 cursor-pointer flex items-center gap-1 font-black">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>تعيين كافتراضي</span>
                  </button>
                )}
                <button type="button" onClick={() => onEditStart({ id: a.id, title: a.type, addressLine: a.streetLine1, isDefault: a.isDefault })}
                  className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition border-0 cursor-pointer" title="تعديل العنوان">
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button type="button" onClick={() => onDelete(a.id)}
                  className="p-1.5 text-stone-300 hover:text-red-700 hover:bg-red-50 rounded-lg transition border-0 cursor-pointer" title="حذف العنوان">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
