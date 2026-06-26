import { useState, useEffect, Fragment } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Eye, Check, X, CheckCircle } from 'lucide-react';
import { SectionHeader } from '../../../components/shared/ui';

interface CourseItem {
  id: string; title: string; category: string; instructorName: string; instructorAvatar: string;
  price: number; duration: string; thumbnail: string; status: string; lessonsCount: number;
  rejectionReason?: string;
}

interface CourseModerationTableProps {
  courses: CourseItem[];
  categories: Array<{ id: string; name: string }>;
  selectedCourseId: string;
  onSelectedCourseIdChange: (id: string) => void;
  onApprove: (id: string) => void;
  onReject: (type: 'course' | 'teacher' | 'refund', id: string) => void;
}

export function CourseModerationTable({
  courses, categories, selectedCourseId, onSelectedCourseIdChange,
  onApprove, onReject,
}: CourseModerationTableProps) {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = courses.filter((c) => {
    const q = search.toLowerCase();
    const matchesSearch = c.title.toLowerCase().includes(q) || c.instructorName.toLowerCase().includes(q);
    const matchesCategory = categoryFilter === 'all' || c.category === categoryFilter;
    const sf = statusFilter.toLowerCase();
    const cs = c.status.toLowerCase();
    let matchesStatus = true;
    if (sf !== 'all') {
      if (sf === 'pendingreview' || sf === 'pending') matchesStatus = cs === 'pending' || cs === 'pendingreview';
      else matchesStatus = cs === sf;
    }
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const toggleExpanded = (id: string) => {
    onSelectedCourseIdChange(id === selectedCourseId ? '' : id);
  };

  return (
    <div className="space-y-6 animate-fade-in" id="CourseModerationQueue-wrapper">
      <SectionHeader
        label="اتخاذ القرارات وإقرار المناهج العلمية"
        title="غرفة تحكيم واعتماد المناهج (CourseModerationQueue)"
        description="تدقيق واجهات المساقات، تفصيل مجالس الاختبار والدروس المرفوعة وتمرير إقرار النشر أو حظره."
      />

      <div className="bg-white p-5 rounded-3xl border border-amber-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4 text-right">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto flex-1">
          <div className="relative flex-1 max-w-sm">
            <input type="text" placeholder="ابحث بالعنوان أو الباحث أو المدرب..." value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full p-2.5 pr-9 text-xs bg-stone-50 text-stone-900 border border-stone-200 rounded-xl focus:outline-none focus:border-orange-600 focus:bg-white text-right leading-none" />
            <Search className="absolute right-3 top-3 w-4 h-4 text-stone-400" />
          </div>

          <div className="flex items-center gap-2">
            <label className="text-[10px] font-bold text-stone-500 whitespace-nowrap shrink-0">الفئة التراثية:</label>
            <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}
              className="p-2 text-xs bg-stone-50 text-stone-900 border border-stone-200 rounded-xl focus:outline-none focus:border-orange-600 leading-normal">
              <option value="all">جميع الفئات والمعارف</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-[10px] font-bold text-stone-500 whitespace-nowrap shrink-0">حالة الطلب:</label>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
              className="p-2 text-xs bg-stone-50 text-stone-900 border border-stone-200 rounded-xl focus:outline-none focus:border-orange-600 leading-normal">
              <option value="all">جميع الحالات بالموقع</option>
              <option value="Pending">بانتظار المراجعة (PendingReview)</option>
              <option value="Approved">تم منح الاعتماد ونظام النشر</option>
              <option value="Rejected">تحفظ وملاحظات إرجاع</option>
            </select>
          </div>
        </div>

        <div className="bg-amber-50 text-amber-900 font-black px-3 py-1.5 rounded-2xl border border-amber-100 text-[10px] shrink-0 self-end md:self-auto uppercase">
          بانتظار التحكيم: {courses.filter((c) => c.status === 'Pending').length} مساقات
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-amber-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto text-right">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-[#FAF9F2] text-stone-600 font-bold border-b border-stone-200 text-right">
                <th className="p-4 w-28">رمز المساق</th>
                <th className="p-4">المقرر والعنونة</th>
                <th className="p-4">شخصية المدرب ومؤهله</th>
                <th className="p-4">محاضراته ورسومه</th>
                <th className="p-4 text-center">حالة التحكيم الدراسي</th>
                <th className="p-4 text-center w-56">القرار التراكمي الشريف</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-16 text-center text-stone-400 space-y-2">
                    <div className="font-serif text-3xl text-stone-200">📜</div>
                    <p className="text-xs">لم يتم رصد أي مقررات تلائم ضوابط التصفية المدخلة.</p>
                    <button onClick={() => { setSearch(''); setCategoryFilter('all'); setStatusFilter('all'); }}
                      className="bg-stone-100 hover:bg-stone-200 border-0 text-stone-600 rounded-lg px-2.5 py-1 text-[10px] font-bold cursor-pointer transition">
                      إلغاء التهيئة والتصفية العامة
                    </button>
                  </td>
                </tr>
              ) : (
                filtered.map((course) => {
                  const isExpanded = course.id === selectedCourseId;
                  let badgeStyle = 'bg-stone-100 text-stone-600 border border-stone-200';
                  if (course.status === 'Approved') badgeStyle = 'bg-emerald-50 text-emerald-800 border border-emerald-100';
                  else if (course.status === 'Rejected') badgeStyle = 'bg-red-50 text-red-100 border border-red-200';
                  else if (course.status === 'Pending' || course.status === 'PendingReview') badgeStyle = 'bg-amber-50 text-amber-900 border border-amber-200 animate-pulse';

                  return (
                    <Fragment key={course.id}>
                      <tr onClick={() => toggleExpanded(course.id)}
                        className={`cursor-pointer transition ${isExpanded ? 'bg-amber-50/20' : 'hover:bg-amber-50/10'}`}>
                        <td className="p-4 font-mono font-bold text-stone-400 text-[10px]">{course.id.toUpperCase()}</td>
                        <td className="p-4 max-w-sm">
                          <div className="flex items-start gap-3">
                            <img src={course.thumbnail} alt="thumb" className="w-12 h-12 rounded-xl object-cover shrink-0 border border-amber-100" referrerPolicy="no-referrer" />
                            <div className="space-y-1">
                              <span className="text-[11px] font-black text-stone-900 leading-tight block">{course.title}</span>
                              <span className="text-[9px] bg-amber-50 text-orange-950 font-black border border-amber-100/50 px-2 py-0.5 rounded-md inline-block">{course.category}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <img src={course.instructorAvatar} alt="avatar" className="w-5 h-5 rounded-full border border-stone-200" referrerPolicy="no-referrer" />
                            <span className="font-extrabold text-stone-800 text-[11px]">{course.instructorName}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="block text-stone-900 font-bold">{course.lessonsCount} درساً ({course.duration})</span>
                          <span className="text-[10px] font-mono font-extrabold text-orange-700 block mt-0.5">{course.price} ر.س</span>
                        </td>
                        <td className="p-4 text-center">
                          <span className={`px-2.5 py-1 rounded-full text-[9px] font-black tracking-wide inline-block ${badgeStyle}`}>
                            {course.status === 'Pending' ? '⏳ قيد التحكيم الشريف' : course.status === 'Approved' ? '🟢 معتمد ومنشور بالدليل' : '🔴 معاد للملاحظات والتصحيح'}
                          </span>
                        </td>
                        <td className="p-4 text-center" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-center gap-2">
                            <button onClick={() => toggleExpanded(course.id)}
                              className={`p-1.5 rounded-lg border-0 transition cursor-pointer text-[10px] font-bold flex items-center justify-center gap-1 ${isExpanded ? 'bg-orange-700 text-white' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'}`}
                              title="استعراض المنهج والدروس">
                              <Eye className="w-3.5 h-3.5" /><span>{isExpanded ? 'طي الفهرس' : 'السيرة والمنهج'}</span>
                            </button>
                            {course.status === 'Pending' ? (
                              <>
                                <button onClick={() => onApprove(course.id)}
                                  className="bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg p-1.5 text-[10px] font-black border-0 cursor-pointer shadow-xs transition flex items-center gap-1"
                                  title="إجازة ونشر فوراً بالمنصة">
                                  <Check className="w-3 h-3" /><span>إجازة</span>
                                </button>
                                <button onClick={() => onReject('course', course.id)}
                                  className="bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 rounded-lg p-1.5 text-[10px] font-bold cursor-pointer transition flex items-center gap-1"
                                  title="إعادة للمراجعة والتصحيح">
                                  <X className="w-3 h-3" /><span>إرجاع</span>
                                </button>
                              </>
                            ) : (
                              <span className="text-[10px] text-stone-400 font-serif">منتهي القرار</span>
                            )}
                          </div>
                        </td>
                      </tr>

                      <AnimatePresence>
                        {isExpanded && (
                          <tr className="bg-amber-50/10">
                            <td colSpan={6} className="p-6">
                              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }} className="overflow-hidden space-y-4 text-right">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                  <div className="md:col-span-2 space-y-3">
                                    <div className="flex items-center gap-2 pb-1.5 border-b border-stone-200">
                                      <span className="w-1.5 h-1.5 bg-orange-700 rounded-full" />
                                      <h4 className="text-xs font-black text-stone-900 font-serif">تفصيل مجلس الخطة العلمية والدروس:</h4>
                                    </div>
                                    <div className="space-y-2">
                                      {['مجلس التمهيد التوطيني الأول: مسار وتاريخ الشواهد', 'مجلس التحصيل الميداني وعقود هندسة الخط التراثية', 'مجلس المذاكرة والاستجواب: حلقة بث مباشر'].map((title, i) => (
                                        <div key={i} className="p-3 bg-white border border-stone-200/80 text-[11px] rounded-xl flex items-center justify-between">
                                          <div className="space-y-0.5">
                                            <span className="font-extrabold text-stone-900 block">{title}</span>
                                            <span className="text-stone-500 text-[10px]">محاضرات ميدانية مسجلة • {[6, 8, 4][i]} ساعات</span>
                                          </div>
                                          <span className="bg-stone-50 px-2 py-0.5 border border-stone-100 text-stone-600 rounded text-[10px] font-mono">الدرس {['١-٣', '٤-٧', '٨-١٢'][i]}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                  <div className="bg-[#FAF9F2] p-5 rounded-2xl border-2 border-amber-200/60 border-dashed text-stone-800 space-y-4 flex flex-col justify-between">
                                    <div className="space-y-2">
                                      <span className="text-[10px] text-amber-800 uppercase tracking-widest block font-bold">وثيقة التحكيم العلمي والأدبي</span>
                                      <h5 className="font-black text-[12px] font-serif leading-tight">مراجعة سياق ونقاء المنهج الأثري</h5>
                                      <p className="text-[10px] text-stone-500 leading-relaxed font-light">يقوم مجلس الرقابة في آثاري بالتأكد من نقاء المساقات والأبحاث من انتحال الأسماء والمجهودات، وضمان غرس النوايا التوطينية الشريفة.</p>
                                    </div>
                                    {course.rejectionReason && (
                                      <div className="bg-red-50 text-red-950 p-2 text-[10px] leading-normal rounded-lg border border-red-100 font-light">
                                        <strong>سبب الإرجاع:</strong> "{course.rejectionReason}"
                                      </div>
                                    )}
                                    {course.status === 'Approved' && (
                                      <div className="bg-emerald-50 text-emerald-950 p-2 text-[10px] leading-normal rounded-lg border border-emerald-100 flex items-center gap-1.5">
                                        <CheckCircle className="w-4 h-4 text-emerald-700 shrink-0" />
                                        <span>مقرر معتمد بشكل رسمي كلي.</span>
                                      </div>
                                    )}
                                    {course.status === 'Pending' && (
                                      <div className="grid grid-cols-2 gap-2 mt-2">
                                        <button onClick={() => onApprove(course.id)} className="bg-emerald-700 hover:bg-emerald-800 text-white font-black text-[10px] py-1.5 rounded-xl border-0 shadow-xs cursor-pointer text-center">إجازة المنهج</button>
                                        <button onClick={() => onReject('course', course.id)} className="bg-red-50 hover:bg-red-100 text-red-800 font-bold text-[10px] py-1.5 rounded-xl border border-red-200 cursor-pointer text-center">طلب تعديل</button>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </motion.div>
                            </td>
                          </tr>
                        )}
                      </AnimatePresence>
                    </Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
