import { useState, Fragment } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Briefcase, Clock, Check, ChevronDown, Download } from 'lucide-react';
import { SectionHeader } from '../../../components/shared/ui';

interface TeacherItem {
  id: string; name: string; email: string; specialty: string;
  qualification: string; experience: string; coverLetter: string;
  status: string; applyDate: string;
}

interface TeacherRequestsTableProps {
  teachers: TeacherItem[];
  onApprove: (id: string) => void;
  onReject: (type: 'course' | 'teacher' | 'refund', id: string) => void;
  onToast: (msg: string) => void;
  onDownloadDocument?: (requestId: string) => void;
}

export function TeacherRequestsTable({ teachers, onApprove, onReject, onToast, onDownloadDocument }: TeacherRequestsTableProps) {
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});

  const toggleExpanded = (id: string) => {
    setExpandedIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-6 animate-fade-in" id="teachers-requests-workbench">
      <SectionHeader
        label="فحص مؤهلات طاقم التدريس"
        title="وثائق ورخص التدريس المعلقة (Teaching Licenses Audit)"
        description="دراسة طلبات ترقية حسابات الباحثين لتمثيل مساقات التوطين والشواهد التراثية، مع فحص السيرة الذاتية يدوياً وتأصيل الإجازة."
      />

      <div className="bg-white rounded-3xl border border-amber-200/80 shadow-xs overflow-hidden">
        <div className="p-4 bg-stone-50 border-b border-stone-200 flex flex-col sm:flex-row justify-between items-center gap-4">
          <span className="text-xs font-black text-stone-900">طلبات المتقدمين والمؤهلات الأكاديمية</span>
          <p className="text-[9px] text-stone-500 font-mono">انقر على أي سطر لاستعراض مؤهلاته الكاملة وتنزيل براهينه</p>
        </div>

        <div className="overflow-x-auto text-right">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-stone-50/50 text-stone-600 font-bold border-b border-stone-200 text-right">
                <th className="p-4">اسم المتقدم وحسابه</th>
                <th className="p-4">التخصص والفرع المعرفي</th>
                <th className="p-4">تاريخ طلب الانضمام</th>
                <th className="p-4">حالة الفحص العلمي</th>
                <th className="p-4 text-center">تفاصيل السند والمستندات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {teachers.map(teacher => {
                const isExpanded = !!expandedIds[teacher.id];
                let statusBadge = 'bg-stone-100 text-stone-600 border border-stone-200';
                if (teacher.status === 'Approved') statusBadge = 'bg-emerald-50 text-emerald-800 border border-emerald-100';
                else if (teacher.status === 'Rejected') statusBadge = 'bg-red-50 text-red-800 border border-red-100';
                else if (teacher.status === 'Pending') statusBadge = 'bg-amber-50 text-amber-900 border border-amber-200 animate-pulse';

                return (
                  <Fragment key={teacher.id}>
                    <tr onClick={() => toggleExpanded(teacher.id)}
                      className={`cursor-pointer transition ${isExpanded ? 'bg-amber-50/30' : 'hover:bg-amber-50/10'}`}>
                      <td className="p-4 font-bold text-stone-900">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-orange-50 text-orange-950 font-serif font-extrabold flex items-center justify-center border border-orange-100">
                            {teacher.name.charAt(0)}
                          </div>
                          <div>
                            <span className="text-xs font-black block text-stone-950">{teacher.name}</span>
                            <span className="text-[10px] text-stone-400 block font-mono font-normal mt-0.5">{teacher.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="bg-amber-50 text-orange-950/80 font-black border border-amber-100/60 px-2.5 py-1 rounded text-[10px]">
                          {teacher.specialty}
                        </span>
                      </td>
                      <td className="p-4 text-stone-500 font-mono text-[11px]">{teacher.applyDate}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-[9px] font-black ${statusBadge}`}>
                          {teacher.status === 'Pending' ? 'بانتظار التدقيق' : teacher.status === 'Approved' ? 'تم منح رخصة التدريس' : 'طلب مرفوض'}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <button onClick={(e) => { e.stopPropagation(); toggleExpanded(teacher.id); }}
                          className="text-[11px] bg-stone-100 hover:bg-stone-200 text-stone-700 py-1.5 px-3 rounded-lg border-0 font-bold transition flex items-center gap-1.5 mx-auto cursor-pointer">
                          <span>{isExpanded ? 'إغلاق التفاصيل' : 'فحص السيرة والوثائق'}</span>
                          <ChevronDown className={`w-3.5 h-3.5 transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                        </button>
                      </td>
                    </tr>

                    <AnimatePresence>
                      {isExpanded && (
                        <tr className="bg-amber-50/10" key={`${teacher.id}-expanded`}>
                          <td colSpan={5} className="p-6">
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden space-y-5">
                              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                                <div className="lg:col-span-8 space-y-4 text-right">
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="p-4 bg-white rounded-2xl border border-stone-200">
                                      <strong className="text-stone-900 block text-xs font-black mb-1 flex items-center gap-1.5">
                                        <Briefcase className="w-4 h-4 text-orange-700" />
                                        <span>الشهادة والدرجة الأكاديمية:</span>
                                      </strong>
                                      <p className="text-xs text-stone-600 font-medium leading-relaxed">{teacher.qualification}</p>
                                    </div>
                                    <div className="p-4 bg-white rounded-2xl border border-stone-200">
                                      <strong className="text-stone-900 block text-xs font-black mb-1 flex items-center gap-1.5">
                                        <Clock className="w-4 h-4 text-orange-700" />
                                        <span>سنوات المهارة والممارسة:</span>
                                      </strong>
                                      <p className="text-xs text-stone-600 font-medium leading-relaxed">{teacher.experience}</p>
                                    </div>
                                  </div>
                                  <div className="p-4 bg-white rounded-2xl border border-stone-200 space-y-1.5">
                                    <strong className="text-stone-900 block text-xs font-black">خطاب الترشيح واستراتيجية التحفيظ التراثي:</strong>
                                    <p className="text-xs text-stone-600 font-serif italic leading-relaxed">"{teacher.coverLetter}"</p>
                                  </div>
                                  {teacher.status === 'Pending' && (
                                    <div className="pt-2 flex items-center gap-3">
                                      <button onClick={() => onApprove(teacher.id)}
                                        className="bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-black px-5 py-2.5 border-0 shadow-sm transition cursor-pointer flex items-center gap-1.5">
                                        <Check className="w-3.5 h-3.5" />
                                        <span>منح تفويض رخصة تدريس (أجازة للباحث)</span>
                                      </button>
                                      <button onClick={() => onReject('teacher', teacher.id)}
                                        className="bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 px-4 py-2.5 text-xs rounded-xl font-bold transition cursor-pointer">
                                        رفض مؤقت وتأجيل رخصة المتقدم
                                      </button>
                                    </div>
                                  )}
                                </div>
                                <div className="lg:col-span-4 bg-[#FBF9F2] border-2 border-amber-200 border-dashed rounded-3xl p-5 text-center space-y-3 relative overflow-hidden shadow-inner">
                                  <div className="absolute top-2 left-2 w-8 h-8 rounded-full border border-amber-200/50 opacity-40 flex items-center justify-center font-serif text-[10px]">إثبات</div>
                                  <div className="w-12 h-12 bg-amber-500 rounded-full border-4 border-amber-600 mx-auto flex items-center justify-center text-stone-900 font-bold shadow-md transform rotate-12">★</div>
                                  <div className="space-y-1">
                                    <span className="text-[10px] text-amber-800 font-black block">السيرة والوثائق الرسمية الشريفة</span>
                                    <span className="text-[9px] text-stone-400 block font-mono">الملف الملحق: ATH_PRO_RESUME.pdf</span>
                                  </div>
                                  <div className="bg-white/80 p-2 text-[10px] text-right rounded-lg border border-amber-100 font-light text-stone-500 leading-normal">
                                    "تشهد عمادة شؤون الآثار بصحة الإجازات في النقوش والكوفيات والشواهد المذكورة للباحث"
                                  </div>
                                  <button onClick={() => { onDownloadDocument?.(teacher.id); onToast('📥 جاري تحميل المستندات...'); }}
                                    className="w-full text-center bg-orange-700 hover:bg-orange-800 text-amber-50 text-[10px] font-black py-2 rounded-xl border-0 shadow-xs cursor-pointer transition flex items-center justify-center gap-1.5">
                                    <Download className="w-3.5 h-3.5" />
                                    <span>تحميل ملف السيرة ومعاينة الوثائق</span>
                                  </button>
                                </div>
                              </div>
                            </motion.div>
                          </td>
                        </tr>
                      )}
                    </AnimatePresence>
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
