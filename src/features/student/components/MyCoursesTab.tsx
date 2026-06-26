import { useNavigate } from 'react-router-dom';
import { DashboardSkeleton } from '../../../components/shared/Skeleton';
import type { EnrollmentResponseDto } from '../../../types/api/enrollment';
import { BookOpen } from 'lucide-react';
import { motion } from 'motion/react';

interface MyCoursesTabProps {
  isLoading: boolean;
  activeEnrollments: EnrollmentResponseDto[];
  onOpenCourse: (enrollment: EnrollmentResponseDto) => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { y: 18, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { type: 'spring' as const, stiffness: 260, damping: 22 } },
};

export function MyCoursesTab({ isLoading, activeEnrollments, onOpenCourse }: MyCoursesTabProps) {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-3xl border border-amber-200/80 p-6 shadow-sm space-y-6" id="my-courses-tab">
      <div>
        <h2 className="text-base font-extrabold text-stone-905">مقررات تدرسها وتشاركها حالياً</h2>
        <p className="text-xs text-stone-500 font-light mt-1">تجد هنا تفاصيل الدروس والاختبارات الفردية لكل المناهج المسجل بها اسمك.</p>
      </div>

      {isLoading ? (
        <DashboardSkeleton />
      ) : (
        <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {activeEnrollments.map((enrollment) => (
            <motion.div key={enrollment.id} variants={itemVariants} className="border border-amber-200/60 rounded-2xl overflow-hidden flex flex-col justify-between group bg-stone-50">
              <div className="relative h-32 overflow-hidden bg-amber-100">
                {enrollment.courseImageUrl && (
                  <img src={enrollment.courseImageUrl} alt={enrollment.courseTitle} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                )}
                <div className="absolute inset-0 bg-stone-900/40" />
                <span className="absolute top-2 right-2 bg-orange-700 text-amber-50 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {enrollment.status === 'Completed' ? 'مكتمل' : 'قيد الدراسة'}
                </span>
              </div>
              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between text-right">
                <div className="space-y-1">
                  <h4 className="font-bold text-xs text-stone-900 leading-snug line-clamp-2">{enrollment.courseTitle}</h4>
                  <p className="text-[10px] text-stone-500">الطالب: {enrollment.studentName}</p>
                </div>
                <div className="space-y-2 pt-2 border-t border-amber-100">
                  <div className="flex justify-between items-center text-[10px] text-stone-500">
                    <span>تقدم المسار: {enrollment.progressPercentage}%</span>
                  </div>
                  <div className="w-full bg-stone-200 h-1 rounded-full overflow-hidden">
                    <div className="bg-orange-700 h-full" style={{ width: `${enrollment.progressPercentage}%` }} />
                  </div>
                  <button
                    onClick={() => onOpenCourse(enrollment)}
                    className="w-full text-center bg-orange-700 hover:bg-orange-800 text-amber-50 text-xs font-bold py-2.5 rounded-xl block mt-2"
                  >
                    استئناف الفصل التفاعلي
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
          <div className="border border-dashed border-amber-300 rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-4 bg-amber-100/10">
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center">
              <BookOpen className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-xs text-stone-900">هل تبحث عن علوم جديدة؟</h4>
              <p className="text-[10px] text-stone-500 leading-relaxed max-w-xs">كتالوج آثاري ممتد ويضم دبلومات مكثفة في الفنون القديمة وعلم المخطوطات.</p>
            </div>
            <button onClick={() => navigate('/catalog')} className="bg-amber-100 hover:bg-amber-200 text-orange-800 text-[11px] font-bold px-4 py-2 rounded-xl transition border-0 cursor-pointer text-center">
              زيارة كتالوج الدورات
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
