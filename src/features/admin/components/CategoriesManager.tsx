import { useState } from 'react';
import { X } from 'lucide-react';
import { SectionHeader } from '../../../components/shared/ui';

interface CategoryItem {
  id: string; name: string; slug: string; courseCount: number;
}

interface CategoriesManagerProps {
  categories: CategoryItem[];
  onAdd: (name: string, slug: string) => void;
  onDelete: (id: string) => void;
}

export function CategoriesManager({ categories, onAdd, onDelete }: CategoriesManagerProps) {
  const [nameInput, setNameInput] = useState('');
  const [slugInput, setSlugInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim() || !slugInput.trim()) return;
    onAdd(nameInput.trim(), slugInput.trim().toLowerCase().replace(/\s+/g, '-'));
    setNameInput('');
    setSlugInput('');
  };

  return (
    <div className="space-y-6 animate-fade-in" id="categories-workbench-tab">
      <SectionHeader label="هيكلة وتصنيف مكتبة آثاري" title="تعديل وإقرار فئات التراث"
        description="إضافة وحرص الفئات التراثية والأقسام المعجمية التي يتسيدها الدارسون لإحياء العلوم الأثرية." />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-4 bg-white p-5 rounded-3xl border border-amber-200/80 shadow-xs space-y-4">
          <span className="text-xs font-black text-stone-900 block pb-2 border-b border-amber-50">تأسيس فئة جديدة</span>
          <form onSubmit={handleSubmit} className="space-y-4 text-right">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-stone-500 block">اسم القسم بالكامل (مثال: الخط العربي):</label>
              <input type="text" value={nameInput} onChange={(e) => setNameInput(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl bg-stone-50 text-stone-900 border border-stone-200 focus:outline-none focus:border-orange-600"
                placeholder="لغة الضاد ونحوها..." />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-stone-500 block">الرمز البرمجي للرابط (Slug URL):</label>
              <input type="text" value={slugInput} onChange={(e) => setSlugInput(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl bg-stone-50 text-stone-900 border border-stone-200 focus:outline-none focus:border-orange-600 font-mono"
                placeholder="arabic-morphology" />
            </div>
            <button type="submit"
              className="w-full text-center bg-orange-700 hover:bg-orange-800 text-white font-black text-xs py-2.5 rounded-xl border-0 cursor-pointer shadow-sm transition mt-2 flex items-center justify-center gap-1.5">
              <span>تبويب وإدراج القسم الآن</span>
            </button>
          </form>
        </div>

        <div className="lg:col-span-8 bg-white rounded-3xl border border-amber-200/80 shadow-xs overflow-hidden">
          <div className="p-4 bg-stone-50 border-b border-stone-200 text-right">
            <span className="text-xs font-black text-stone-900 block font-serif">قروض الفئات النشطة بالموقع</span>
          </div>
          <table className="w-full text-xs text-right">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-100 font-bold text-stone-500">
                <th className="p-4">اسم التبويب التراثي</th>
                <th className="p-4">الرمز واللاحقة التقنية (Slug)</th>
                <th className="p-4">حجم الحقائب المسجلة</th>
                <th className="p-4 text-center">الإجراء</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700">
              {categories.map(cat => (
                <tr key={cat.id} className="hover:bg-amber-50/10">
                  <td className="p-4 font-black text-stone-950">{cat.name}</td>
                  <td className="p-4 font-mono text-stone-500 text-[11px]">{cat.slug}</td>
                  <td className="p-4 font-mono font-bold text-stone-800">{cat.courseCount} دورات بالدليل</td>
                  <td className="p-4 text-center">
                    <button onClick={() => onDelete(cat.id)}
                      className="text-red-600 hover:bg-red-50 p-1.5 rounded-lg border-0 bg-transparent cursor-pointer transition"
                      title="حذف هذا القسم بعزل الحقائب" disabled={cat.courseCount > 0}>
                      <X className="w-4 h-4 mx-auto" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
