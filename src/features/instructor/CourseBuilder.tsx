import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft,
  Plus, 
  X, 
  Upload, 
  BookOpen, 
  Settings, 
  Video, 
  FileText, 
  HelpCircle, 
  CheckCircle,
  AlertCircle,
  Coins
} from 'lucide-react';
import { Course } from '../../types';

interface SectionItem {
  id: string;
  title: string;
  type: 'video' | 'document' | 'quiz';
  duration: string;
}

interface Section {
  id: string;
  title: string;
  items: SectionItem[];
}

interface CourseBuilderProps {
  onBack: () => void;
  onSave: (courseData: Partial<Course> & { sections: Section[] }) => void;
  initialCourse?: Course | null;
  onTriggerToast: (msg: string) => void;
}

interface FormValues {
  title: string;
  subtitle: string;
  category: string;
  language: string;
  thumbnail: string;
  price: number;
  originalPrice: number;
  outcomes?: string;
  requirements?: string;
}

const courseSchema = z.object({
  title: z.string().min(4, { message: "يجب أن يكون عنوان الدورة 4 أحرف على الأقل" }),
  subtitle: z.string().min(10, { message: "يجب أن تتضمن التوطئة وصفاً من 10 أحرف على الأقل" }),
  category: z.string().min(1, { message: "التصنيف مطلوب" }),
  language: z.string().min(1, { message: "اللغة مطلوبة" }),
  thumbnail: z.string().optional().or(z.literal('')),
  price: z.coerce.number().min(0, { message: "السعر يجب أن يكون 0 أو أكثر" }),
  originalPrice: z.coerce.number().min(0, { message: "السعر الأصلي يجب أن يكون 0 أو أكثر" }).optional(),
  outcomes: z.string().optional(),
  requirements: z.string().optional(),
});

export default function CourseBuilder({ 
  onBack, 
  onSave, 
  initialCourse, 
  onTriggerToast 
}: CourseBuilderProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  
  // Custom states that live alongside the form, loading draft from localStorage if available (Autosave Restore)
  const [outcomesList, setOutcomesList] = useState<string[]>(() => {
    const draft = localStorage.getItem('athari_course_builder_draft');
    if (draft) {
      try {
        const parsed = JSON.parse(draft);
        if (parsed.outcomesList) return parsed.outcomesList;
      } catch (e) {}
    }
    return initialCourse ? [
      "فهم وتطبيق موازين الخطوط التاريخية",
      "تمييز المدارس الهندسية والزخارف التراثية",
      "إتقان التحقيق والتوثيق الأثري للمخطوطات"
    ] : [
      "فهم المدارس التراثية المعنية",
      "تمييز أنواع الزخارف والخطوط الكوفية المعتمدة",
      "التحقيق العلمي الدقيق للرقوق الأثرية"
    ];
  });
  
  const [requirementsList, setRequirementsList] = useState<string[]>(() => {
    const draft = localStorage.getItem('athari_course_builder_draft');
    if (draft) {
      try {
        const parsed = JSON.parse(draft);
        if (parsed.requirementsList) return parsed.requirementsList;
      } catch (e) {}
    }
    return initialCourse ? [
      "معرفة أولية بالتراث الإسلامي",
      "شغف بتحقيق الخطوط والزخارف"
    ] : [
      "إلمام أساسي بمسار التاريخ الثقافي والخط العربي الكلاسيكي",
      "دوافع مسبقة للبحث والتحري الأثري الرصين"
    ];
  });

  const [sections, setSections] = useState<Section[]>(() => {
    const draft = localStorage.getItem('athari_course_builder_draft');
    if (draft) {
      try {
        const parsed = JSON.parse(draft);
        if (parsed.sections) return parsed.sections;
      } catch (e) {}
    }
    return initialCourse ? [
      {
        id: 'sec_1',
        title: 'الباب الأول: توطئة ومدخل للخطوط القديمة والزخرفة المشرقية',
        items: [
          { id: 'item_1', title: 'مقدمة مرئية لتاريخ المداد والرق الكوفي الزاهر', type: 'video', duration: '١٥ دقيقة' },
          { id: 'item_2', title: 'مستند: فلسفة تناسب النقطة والقياس الهندسي المعتمد', type: 'document', duration: '٥ صفحات ملف PDF' }
        ]
      }
    ] : [
      {
        id: 'sec_default_1',
        title: 'الباب الأول: مقدمات المنهج التراثي والتمهيد التاريخي',
        items: [
          { id: 'item_d1', title: 'فيديو تمهيدي: روعة المعالم الكوفية القديمة', type: 'video', duration: '١٠:٣٠ دقيقة' },
          { id: 'item_d2', title: 'اختبار تمهيدي: استطلاع المهارات والمدارك', type: 'quiz', duration: '٥ أسئلة' }
        ]
      }
    ];
  });

  // AlertDialog Confirmation State for section/lesson deletes
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    type: 'section' | 'item';
    sectionId: string;
    itemId?: string;
    title: string;
  } | null>(null);

  // Helper to read form draft
  const getDraftFormValues = () => {
    const draft = localStorage.getItem('athari_course_builder_draft');
    if (draft) {
      try {
        const parsed = JSON.parse(draft);
        if (parsed.formValues) {
          return {
            title: parsed.formValues.title || '',
            subtitle: parsed.formValues.subtitle || '',
            category: parsed.formValues.category || 'الفنون والعمارة التراثية',
            language: parsed.formValues.language || 'العربية',
            thumbnail: parsed.formValues.thumbnail || 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600',
            price: Number(parsed.formValues.price) || 150,
            originalPrice: Number(parsed.formValues.price) ? Math.round(Number(parsed.formValues.price) * 1.5) : 250,
            outcomes: '',
            requirements: ''
          };
        }
      } catch (e) {}
    }
    return null;
  };

  // React Hook Form initialization
  const { 
    register, 
    handleSubmit, 
    control,
    watch,
    trigger,
    formState: { errors, isValid } 
  } = useForm<FormValues>({
    resolver: zodResolver(courseSchema) as any,
    mode: 'all',
    defaultValues: getDraftFormValues() || {
      title: initialCourse?.title || '',
      subtitle: initialCourse 
        ? `${initialCourse.category} التراثية الرصينة وتفصيل فنياتها`
        : 'رصيد غني من الشروحات والمجالس التفاعلية التي تتناول تفاصيل هذا الفن الأثري وخطوطه وموازينه البديعة.',
      category: initialCourse?.category || 'الفنون والعمارة التراثية',
      language: 'العربية',
      thumbnail: initialCourse?.thumbnail || 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600',
      price: initialCourse?.price || 150,
      originalPrice: initialCourse?.originalPrice || 250,
      outcomes: '',
      requirements: ''
    }
  });

  // Dynamic watch values
  const watchedTitle = watch('title');
  const watchedSubtitle = watch('subtitle');
  const watchedPrice = watch('price');
  const watchedThumbnail = watch('thumbnail');

  // AUTOSAVE EFFECTS IMPLEMENTATION
  useEffect(() => {
    const draft = localStorage.getItem('athari_course_builder_draft');
    if (draft) {
      onTriggerToast('♻️ تم استرداد مسودتك المحفوظة تلقائياً لمنع فقدان العمل!');
    }
  }, []);

  useEffect(() => {
    // Only save draft if anything has contents to save
    if (watchedTitle || watchedSubtitle || sections.length > 0 || outcomesList.length > 0) {
      const draftData = {
        formValues: {
          title: watchedTitle,
          subtitle: watchedSubtitle,
          price: watchedPrice,
          thumbnail: watchedThumbnail,
          category: watch('category'),
          language: watch('language')
        },
        sections,
        outcomesList,
        requirementsList
      };
      
      const timeoutId = setTimeout(() => {
        localStorage.setItem('athari_course_builder_draft', JSON.stringify(draftData));
      }, 1000); // 1s Debounce

      return () => clearTimeout(timeoutId);
    }
  }, [watchedTitle, watchedSubtitle, watchedPrice, watchedThumbnail, sections, outcomesList, requirementsList]);

  // Outcome addition logic
  const [outcomeInput, setOutcomeInput] = useState('');
  const addOutcome = () => {
    if (outcomeInput.trim()) {
      setOutcomesList([...outcomesList, outcomeInput.trim()]);
      setOutcomeInput('');
      onTriggerToast('تمت إضافة المخرج بنجاح.');
    }
  };
  const removeOutcome = (index: number) => {
    setOutcomesList(outcomesList.filter((_, i) => i !== index));
  };

  // Requirement addition logic
  const [requirementInput, setRequirementInput] = useState('');
  const addRequirement = () => {
    if (requirementInput.trim()) {
      setRequirementsList([...requirementsList, requirementInput.trim()]);
      setRequirementInput('');
      onTriggerToast('تم تصنيف المتطلب المعرفي.');
    }
  };
  const removeRequirement = (index: number) => {
    setRequirementsList(requirementsList.filter((_, i) => i !== index));
  };

  // Curriculum management logic
  const handleAddSection = () => {
    const newSec: Section = {
      id: `sec_${Date.now()}`,
      title: `الباب الجديد رقم ${sections.length + 1}: تفصيل العلوم ومراجعتها`,
      items: []
    };
    setSections([...sections, newSec]);
    onTriggerToast('تمت إضافة باب جديد للمنهج.');
  };

  const handleEditSectionTitle = (id: string, newTitle: string) => {
    setSections(sections.map(s => s.id === id ? { ...s, title: newTitle } : s));
  };

  const confirmDeleteSection = (id: string, title?: string) => {
    setDeleteConfirm({
      isOpen: true,
      type: 'section',
      sectionId: id,
      title: title || 'الباب المختار'
    });
  };

  const confirmDeleteItem = (sectionId: string, itemId: string, title?: string) => {
    setDeleteConfirm({
      isOpen: true,
      type: 'item',
      sectionId,
      itemId,
      title: title || 'الدرس المختار'
    });
  };

  const handleExecuteDelete = () => {
    if (!deleteConfirm) return;
    if (deleteConfirm.type === 'section') {
      setSections(sections.filter(s => s.id !== deleteConfirm.sectionId));
      onTriggerToast('تم حذف الباب وقرائنه.');
    } else if (deleteConfirm.type === 'item' && deleteConfirm.itemId) {
      setSections(sections.map(s => {
        if (s.id === deleteConfirm.sectionId) {
          return { ...s, items: s.items.filter(i => i.id !== deleteConfirm.itemId) };
        }
        return s;
      }));
      onTriggerToast('تم حذف الدرس بنجاح.');
    }
    setDeleteConfirm(null);
  };

  const handleDeleteSection = (id: string) => {
    setSections(sections.filter(s => s.id !== id));
    onTriggerToast('تم حذف الباب وقرائنه.');
  };

  const handleAddItem = (sectionId: string, type: 'video' | 'document' | 'quiz') => {
    const typesAr = { video: 'شرح مرئي مسجل', document: 'مستند تحقيقي PDF', quiz: 'اختبار موازنة فني' };
    const title = `مقرر جديد: ${typesAr[type]} تفصيلي`;
    const duration = type === 'video' ? '١٢:٠٠ دقيقة' : type === 'document' ? 'شرح كراسة أثرية' : '٥ أسئلة تقييمية';

    setSections(sections.map(s => {
      if (s.id === sectionId) {
        return {
          ...s,
          items: [...s.items, { id: `item_${Date.now()}`, title, type, duration }]
        };
      }
      return s;
    }));
    onTriggerToast(`تم إقرار ${typesAr[type]} بالقسم.`);
  };

  const handleDeleteItem = (sectionId: string, itemId: string) => {
    setSections(sections.map(s => {
      if (s.id === sectionId) {
        return { ...s, items: s.items.filter(i => i.id !== itemId) };
      }
      return s;
    }));
    onTriggerToast('تم حذف الدرس بنجاح.');
  };

  const handleEditItemTitle = (sectionId: string, itemId: string, newTitle: string) => {
    setSections(sections.map(s => {
      if (s.id === sectionId) {
        return {
          ...s,
          items: s.items.map(i => i.id === itemId ? { ...i, title: newTitle } : i)
        };
      }
      return s;
    }));
  };

  // Form final submit
  const onSubmitForm = (data: FormValues) => {
    if (sections.length === 0 || sections.every(s => s.items.length === 0)) {
      onTriggerToast('⚠️ يرجى إضافة باب دراسي واحد و درس واحد على الأقل في الخطوة الثانية قبل تقديم المنهج!');
      setStep(2);
      return;
    }

    const durationHrs = sections.reduce((acc, curr) => acc + curr.items.length * 2, 8);
    const lessonsCountTotal = sections.reduce((acc, curr) => acc + curr.items.length, 0);

    const submissionData = {
      id: initialCourse?.id || `inst_${Date.now()}`,
      title: data.title,
      category: data.category,
      categorySlug: data.category === 'البلاغة واللغة العربية' ? 'arabic' : data.category === 'علم الآثار والتحقيق' ? 'archaeology' : 'heritage',
      instructorName: initialCourse?.instructorName || 'أحمد التميمي',
      instructorAvatar: initialCourse?.instructorAvatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
      rating: initialCourse?.rating || 4.9,
      studentsCount: initialCourse?.studentsCount || 0,
      price: Number(data.price),
      originalPrice: Number(data.originalPrice),
      duration: `${durationHrs} ساعة`,
      lessonsCount: lessonsCountTotal,
      thumbnail: watchedThumbnail || 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600',
      sections,
      outcomesList,
      requirementsList
    };

    localStorage.removeItem('athari_course_builder_draft');
    onSave(submissionData);
  };

  // Safe navigation validations
  const handleNextStep = async () => {
    if (step === 1) {
      const isStep1Valid = await trigger(['title', 'subtitle', 'category', 'language', 'thumbnail']);
      if (!isStep1Valid) {
        onTriggerToast('⚠️ يرجى مسايرة المتطلبات وتدوين البيانات الأساسية بالشكل السليم.');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (sections.length === 0 || !sections.some(s => s.items.length > 0)) {
        onTriggerToast('⚠️ يرجى تأسيس باب وزخرفة دراسية ومقرر واحد على الأقل بالمنهج.');
        return;
      }
      setStep(3);
    }
  };

  // Progress percentage calculation
  const getProgressPercentage = () => {
    let completedSteps = 0;
    if (watchedTitle && watchedTitle.length >= 4 && watchedSubtitle && watchedSubtitle.length >= 10) completedSteps += 33;
    if (sections.length >= 1 && sections.some(s => s.items.length >= 1)) completedSteps += 34;
    if (watchedPrice && watchedPrice > 0) completedSteps += 33;
    return Math.min(completedSteps, 100);
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Visual Stepper Header inspired by Shadcn Theme */}
      <div className="bg-white border border-amber-100 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-base font-extrabold text-stone-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-orange-700 animate-pulse" />
              <span>فضاء تصميم وتأليف الدبلومات الأثرية 🕋</span>
            </h2>
            <p className="text-xs text-stone-500">توفير ركائز وبناء تفاعلي يتجاوب مع موازين مجلس الاعتماد العلمي.</p>
          </div>
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-stone-600 hover:text-orange-700 font-extrabold text-xs bg-transparent border-0 cursor-pointer p-1"
          >
            <span>إلغاء والعودة للرئيسية</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>

        {/* Multi-step Stepper Progress Bar */}
        <div className="pt-2">
          <div className="w-full bg-stone-100 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-gradient-to-l from-orange-600 to-amber-500 h-1.5 rounded-full transition-all duration-350"
              style={{ width: `${getProgressPercentage()}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-stone-500 mt-1 font-mono">
            <span>تقدم الصياغة والاعتماد:</span>
            <span className="font-bold text-orange-700">{getProgressPercentage()}% مكتمل</span>
          </div>
        </div>

        {/* Stepper Wizard Nodes */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-amber-50">
          
          <button 
            type="button"
            onClick={() => setStep(1)}
            className={`flex items-center justify-center gap-2 py-2 px-1 rounded-xl transition text-right border-0 cursor-pointer font-bold ${
              step === 1 ? 'bg-orange-50 text-orange-800' : 'bg-transparent text-stone-500 hover:bg-stone-50'
            }`}
          >
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
              step === 1 ? 'bg-orange-700 text-amber-50' : 'bg-stone-200 text-stone-700'
            }`}>١</span>
            <span className="text-[11px] hidden md:inline">المعلومات الأساسية والوسائط</span>
          </button>

          <button 
            type="button"
            onClick={() => {
              if (watchedTitle && watchedTitle.length >= 4) {
                setStep(2);
              } else {
                onTriggerToast('يرجى ملء الاسم والبيانات الأساسية أولاً.');
              }
            }}
            className={`flex items-center justify-center gap-2 py-2 px-1 rounded-xl transition text-right border-0 cursor-pointer font-bold ${
              step === 2 ? 'bg-orange-50 text-orange-800' : 'bg-transparent text-stone-500 hover:bg-stone-50'
            }`}
          >
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
              step === 2 ? 'bg-orange-700 text-amber-50' : 'bg-stone-200 text-stone-700'
            }`}>٢</span>
            <span className="text-[11px] hidden md:inline">هيكلة الأبواب والمنهج</span>
          </button>

          <button 
            type="button"
            onClick={() => {
              if (watchedTitle && watchedTitle.length >= 4 && sections.length > 0) {
                setStep(3);
              } else {
                onTriggerToast('يرجى إنهاء البنائين الأوليّ والمنهجي أولاً.');
              }
            }}
            className={`flex items-center justify-center gap-2 py-2 px-1 rounded-xl transition text-right border-0 cursor-pointer font-bold ${
              step === 3 ? 'bg-orange-50 text-orange-800' : 'bg-transparent text-stone-500 hover:bg-stone-50'
            }`}
          >
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
              step === 3 ? 'bg-orange-700 text-amber-50' : 'bg-stone-200 text-stone-700'
            }`}>٣</span>
            <span className="text-[11px] hidden md:inline">التسعير والمراجعة العلمية</span>
          </button>

        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
        
        {/* STEP 1 CONTENT: Basic Info & Goals */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-white rounded-3xl border border-amber-200/60 p-6 sm:p-8 shadow-sm space-y-6"
            id="builder-step-1"
          >
            <div className="pb-3 border-b border-stone-100">
              <h3 className="font-extrabold text-sm text-stone-900">الخطوة الأولى: البيانات العامة وعنوان الحلقة</h3>
              <p className="text-[10px] text-stone-500 mt-0.5">صياغة عنوان جليل وتحميل وسائط تمثيلية تليق بوقار المادّة التراثية والمجلس المفتوح.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              {/* Course Title input using React Hook Form */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-[11px] font-bold text-stone-700 block">عنوان الدورة بالكامل *</label>
                <input
                  type="text"
                  {...register('title', { required: true, minLength: 4 })}
                  className={`w-full text-xs font-semibold py-2.5 px-3.5 border rounded-lg bg-stone-50/50 focus:outline-none focus:ring-1 focus:ring-orange-600 text-right ${
                    errors.title ? 'border-red-400 focus:ring-red-400' : 'border-amber-100'
                  }`}
                  placeholder="مثال: تحقيق المخطوطات والرقوق الأثرية في الحضارة الفاطمية الرائعة"
                />
                {errors.title && (
                  <p className="text-[10px] text-red-600 font-bold">اسم الدورة مطلوب (على الأقل ٤ أحرف) لتوثيق السجل الأكاديمي.</p>
                )}
              </div>

              {/* Description textarea */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-[11px] font-bold text-stone-700 block">التوطئة والمدخل الفرعي للدبلوم *</label>
                <textarea
                  rows={3}
                  {...register('subtitle', { required: true, minLength: 10 })}
                  className={`w-full text-xs py-2.5 px-3.5 border rounded-lg bg-stone-50/50 focus:outline-none focus:ring-1 focus:ring-orange-600 text-right leading-relaxed ${
                    errors.subtitle ? 'border-red-400 focus:ring-red-400' : 'border-amber-100'
                  }`}
                  placeholder="اكتب خلاصة تفصيلية تعرّف الدارس بماهية هذا المساق والمحاضرات المصاحبة له..."
                />
                {errors.subtitle && (
                  <p className="text-[10px] text-red-600 font-bold">الوصف التدشيني إلزامي وجوهري للراغبين بالالتحاق.</p>
                )}
              </div>

              {/* Category selector */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-stone-700 block">تصنيف الحلقة الدراسية</label>
                <select
                  {...register('category')}
                  className="w-full text-xs font-semibold py-2.5 px-3 border border-amber-100 rounded-lg bg-stone-50/30 focus:outline-none text-right"
                >
                  <option value="البلاغة واللغة العربية">البلاغة واللغة العربية</option>
                  <option value="الفنون والعمارة التراثية">الفنون والعمارة التراثية</option>
                  <option value="علم الآثار والتحقيق">علم الآثار والتحقيق</option>
                  <option value="التاريخ الإسلامي">التاريخ الإسلامي</option>
                </select>
              </div>

              {/* Language Selector */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-stone-700 block">لغة التدريس والمحاضرات</label>
                <select
                  {...register('language')}
                  className="w-full text-xs font-semibold py-2.5 px-3 border border-amber-100 rounded-lg bg-stone-50/30 focus:outline-none text-right"
                >
                  <option value="العربية">العربية</option>
                  <option value="العربية والإنجليزية">العربية والإنجليزية</option>
                  <option value="العربية الفصحى فقط">العربية الفصحى فقط</option>
                </select>
              </div>

              {/* Thumbnail URL Input */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-[11px] font-bold text-stone-700 block">مسار وغلاف صورة الدرس (Thumbnail URL)</label>
                <input
                  type="text"
                  {...register('thumbnail')}
                  className="w-full text-xs py-2 px-3 border border-amber-100 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-600 text-right font-mono"
                  placeholder="https://images.unsplash.com/..."
                />
                
                <div className="border-2 border-dashed border-amber-200/80 rounded-2xl p-6 bg-amber-50/10 hover:border-amber-400 transition text-center space-y-3">
                  <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-800 flex items-center justify-center mx-auto">
                    <Upload className="w-4 h-4" />
                  </div>
                  <p className="text-[11px] font-bold text-stone-900">سحب غلاف الدورة الرئيسي أو النقر للاختيار التلقائي</p>
                  
                  {watchedThumbnail && (
                    <div className="mt-2 flex items-center justify-center gap-3 bg-white p-2.5 rounded-xl border border-amber-50 max-w-md mx-auto">
                      <img src={watchedThumbnail} alt="Thumbnail preview" className="w-20 h-12 object-cover rounded-md" />
                      <div className="text-right flex-1">
                        <span className="text-[10px] font-bold block text-stone-700">معاينة الغلاف الجاهزة</span>
                        <span className="text-[9px] text-[#fbbf24] block">تطابق مميز مع القالب المعياري</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          onTriggerToast('💡 نموذج تمهيدي لغلاف زخارف أندلسية عريقة.');
                        }}
                        className="text-[10px] text-orange-700 hover:underline bg-transparent border-0 cursor-pointer font-bold"
                      >
                        معاينة كاملة
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Learning Outcomes Tags section */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-[11px] font-bold text-stone-700 block">ما هي المخرجات التعليمية والمهارات التي سيجنيها الدارس؟</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={outcomeInput}
                    onChange={(e) => setOutcomeInput(e.target.value)}
                    className="flex-1 text-xs py-2 px-3 border border-amber-100 rounded-lg focus:ring-1 focus:ring-orange-600 focus:outline-none text-right"
                    placeholder="مثال: تمييز قواعد الورق الهاشمي المصنوع قديماً"
                  />
                  <button
                    type="button"
                    onClick={addOutcome}
                    className="bg-orange-700 hover:bg-orange-800 text-amber-50 text-xs font-bold px-4 py-2 rounded-xl transition border-0 cursor-pointer"
                  >
                    إضافة مخرج
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {outcomesList.map((out, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1 bg-amber-50/60 border border-amber-200/60 text-stone-800 text-[10px] font-bold px-3 py-1 rounded-full">
                      <span>{out}</span>
                      <button
                        type="button"
                        onClick={() => removeOutcome(idx)}
                        className="text-stone-400 hover:text-red-700 bg-transparent border-0 cursor-pointer p-0.5 rounded-full"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Requirements Dynamic List */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-[11px] font-bold text-stone-700 block">المتطلبات المعرفية المسبقة للدارس المبتدئ</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={requirementInput}
                    onChange={(e) => setRequirementInput(e.target.value)}
                    className="flex-1 text-xs py-2 px-3 border border-amber-100 rounded-lg focus:ring-1 focus:ring-orange-600 focus:outline-none text-right"
                    placeholder="مثال: معرفة بمبادئ تحقيق النصوص العربية القديمة"
                  />
                  <button
                    type="button"
                    onClick={addRequirement}
                    className="bg-[var(--color-brand-orange-950)] hover:bg-stone-900 text-amber-50 text-xs font-bold px-4 py-2 rounded-xl transition border-0 cursor-pointer"
                  >
                    إضافة متطلب
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {requirementsList.map((req, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1 bg-stone-100/80 border border-stone-200/80 text-stone-700 text-[10px] font-bold px-3 py-1 rounded-full">
                      <span>{req}</span>
                      <button
                        type="button"
                        onClick={() => removeRequirement(idx)}
                        className="text-stone-400 hover:text-red-700 bg-transparent border-0 cursor-pointer p-0.5 rounded-full"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

            </div>

            {/* Step 1 control buttons */}
            <div className="pt-5 border-t border-amber-50 flex justify-between">
              <button
                type="button"
                onClick={onBack}
                className="bg-stone-50 hover:bg-stone-100 text-stone-600 text-xs font-bold px-5 py-2.5 rounded-xl border border-stone-200 cursor-pointer"
              >
                إلغاء والعودة لقائمة الدورات
              </button>
              <button
                type="button"
                onClick={handleNextStep}
                className="bg-orange-700 hover:bg-orange-800 text-amber-50 text-xs font-bold px-5 py-2.5 rounded-xl transition cursor-pointer border-0 shadow-sm flex items-center gap-1.5"
              >
                <span>التالي: المنهج والأبواب الدراسية</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 2 CONTENT: Curriculum & Lesson Sections */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
            id="builder-step-2"
          >
            <div className="bg-white rounded-3xl border border-amber-200/60 p-6 sm:p-8 shadow-xs space-y-2">
              <h3 className="font-extrabold text-sm text-stone-900">الخطوة الثانية: هيكلة المنهج وتوزيع المجالس 📜</h3>
              <p className="text-[10px] text-stone-500">قم ببناء الفهرس العلمي وتفريع الأبواب إلى مقررات مرئية ومستندات وصكوك اختبارية متكاملة لضمان استحقاق الدارس.</p>
            </div>

            {/* Render chapters & sections dynamically */}
            <div className="space-y-4">
              {sections.map((section, sIdx) => (
                <div key={section.id} className="bg-white rounded-2xl border border-amber-200/60 shadow-xs overflow-hidden">
                  
                  {/* Chapter Section Title bar */}
                  <div className="bg-amber-50/20 px-5 py-4 border-b border-amber-50 flex justify-between items-center flex-wrap gap-2">
                    <div className="flex items-center gap-2.5 max-w-full">
                      <BookOpen className="w-4.5 h-4.5 text-orange-700" />
                      <input
                        type="text"
                        value={section.title}
                        onChange={(e) => handleEditSectionTitle(section.id, e.target.value)}
                        className="bg-transparent font-extrabold text-stone-800 text-xs border-b border-dashed border-amber-300 focus:outline-none focus:border-orange-700 px-1 py-0.5 py-1 text-right w-full sm:w-112"
                        placeholder="أدخل عنوان الباب الدراسي (مثال: الباب الأول: الفنون المشرقية)"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => confirmDeleteSection(section.id, section.title)}
                      className="text-[10px] text-red-600 hover:text-red-800 hover:underline border-0 bg-transparent cursor-pointer font-bold"
                    >
                      حذف الباب بالكامل
                    </button>
                  </div>

                  {/* Chapter's Items List */}
                  <div className="p-5 space-y-3.5">
                    {section.items.length === 0 ? (
                      <div className="py-6 text-center">
                        <AlertCircle className="w-5 h-5 text-amber-500 mx-auto opacity-75 mb-1.5" />
                        <p className="text-[10px] text-stone-400">لا توجد مقررات دراسية مضافة في هذا الباب حتى الآن. استخدم الأزرار بالأسفل لإعمار الباب.</p>
                      </div>
                    ) : (
                      <div className="space-y-2.5">
                        {section.items.map((item, iIdx) => (
                          <div 
                            key={item.id} 
                            className="bg-stone-50 rounded-xl p-3 border border-amber-100 flex justify-between items-center gap-3 flex-wrap"
                          >
                            <div className="flex items-center gap-2.5 flex-1 min-w-[200px]">
                              <div className="w-7 h-7 rounded-lg bg-orange-100/50 flex justify-center items-center text-orange-900">
                                {item.type === 'video' && <Video className="w-3.5 h-3.5" />}
                                {item.type === 'document' && <FileText className="w-3.5 h-3.5" />}
                                {item.type === 'quiz' && <HelpCircle className="w-3.5 h-3.5" />}
                              </div>
                              
                              <input
                                type="text"
                                value={item.title}
                                onChange={(e) => handleEditItemTitle(section.id, item.id, e.target.value)}
                                className="bg-transparent text-xs font-semibold text-stone-800 border-b border-transparent focus:border-amber-300 focus:outline-none px-1 py-0.5 flex-1 text-right"
                              />
                            </div>

                            <div className="flex items-center gap-3">
                              <span className="text-[10px] bg-white border border-stone-100 text-stone-500 rounded-md px-2 py-0.5 font-mono">
                                {item.duration}
                              </span>
                              <button
                                type="button"
                                onClick={() => confirmDeleteItem(section.id, item.id, item.title)}
                                className="text-red-500 hover:text-red-700 bg-transparent border-0 cursor-pointer p-1 rounded-full"
                                title="إقصاء الدرس"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Adding item action group inside the Section */}
                    <div className="pt-3 border-t border-dotted border-amber-100 flex flex-wrap gap-2 justify-center sm:justify-start">
                      <button
                        type="button"
                        onClick={() => handleAddItem(section.id, 'video')}
                        className="bg-orange-50 border border-orange-100 hover:bg-orange-100 text-orange-950 text-[10px] font-bold px-3 py-1.5 rounded-lg transition border-0 cursor-pointer flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>إضافة محاضرة فيديو</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleAddItem(section.id, 'document')}
                        className="bg-[var(--color-brand-orange-950)]/5 hover:bg-[var(--color-brand-orange-950)]/10 text-stone-700 text-[10px] font-bold px-3 py-1.5 rounded-lg transition border-0 cursor-pointer flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>إرفاق مستند أثري PDF</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleAddItem(section.id, 'quiz')}
                        className="bg-emerald-50 border border-emerald-100 hover:bg-emerald-100 text-emerald-950 text-[10px] font-bold px-3 py-1.5 rounded-lg transition border-0 cursor-pointer flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>إدراج كراسة موازنة واختبار</span>
                      </button>
                    </div>

                  </div>
                </div>
              ))}
            </div>

            {/* Stepper dynamic section builder actions */}
            <div className="flex justify-center pt-3">
              <button
                type="button"
                onClick={handleAddSection}
                className="bg-orange-700 hover:bg-orange-800 text-amber-50 text-xs font-bold px-6 py-3 rounded-xl transition border-0 cursor-pointer flex items-center gap-1.5 shadow"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة وتأليف باب رئيسي منهج كوفّي جديد</span>
              </button>
            </div>

            {/* Controls Step 2 */}
            <div className="pt-5 bg-white border border-amber-100 rounded-3xl p-6 flex justify-between items-center shadow-xs">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="bg-transparent hover:bg-stone-50 text-stone-600 text-xs font-bold px-5 py-2.5 rounded-xl border border-stone-200 cursor-pointer flex items-center gap-1"
              >
                <ArrowRight className="w-4 h-4" />
                <span>السابق: تفاصيل الدورة</span>
              </button>

              <button
                type="button"
                onClick={handleNextStep}
                className="bg-[var(--color-brand-orange-950)] hover:bg-stone-900 text-amber-50 text-xs font-bold px-5 py-2.5 rounded-xl transition cursor-pointer border-0 shadow-sm flex items-center gap-1"
              >
                <span>التالي: التسعير والنشر العلمي</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 3 CONTENT: Pricing, Review & Sign-off */}
        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-white rounded-3xl border border-amber-200/60 p-6 sm:p-8 shadow-sm space-y-6"
            id="builder-step-3"
          >
            <div className="pb-3 border-b border-stone-100">
              <h3 className="font-extrabold text-sm text-stone-905 flex items-center gap-2">
                <Coins className="w-4.5 h-4.5 text-orange-700" />
                <span>الخطوة الثالثة: موازين الاستثمار المالي والتعهد السلوكي</span>
              </h3>
              <p className="text-[10px] text-stone-500 mt-1">تحديد القيمة المالية الرمزية لجهودك ومصادقة وثيقة الأمانة العلمية.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
              
              {/* Product Price */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-stone-704 block">سعر الدورة المعتمد (ر.س) *</label>
                <input
                  type="number"
                  {...register('price', { required: true, min: 0 })}
                  className={`w-full text-xs font-semibold py-2.5 px-3.5 border rounded-lg bg-stone-50/50 focus:outline-none focus:ring-1 focus:ring-orange-600 text-right ${
                    errors.price ? 'border-red-400 focus:ring-red-400' : 'border-amber-100'
                  }`}
                  placeholder="مثال: 150"
                />
                <span className="text-[9px] text-stone-400 block">ضعه 0 لتصنيف المقرر كحلقة دراسية حرة بغير ثمن.</span>
              </div>

              {/* Original Price */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-stone-704 block">السعر الأصلي للمقارنة قبل الحسم (ر.س)</label>
                <input
                  type="number"
                  {...register('originalPrice', { min: 0 })}
                  className="w-full text-xs font-semibold py-2.5 px-3.5 border border-amber-100 rounded-lg bg-stone-50/50 focus:outline-none focus:ring-1 focus:ring-orange-600 text-right"
                  placeholder="مثال: 250"
                />
                <span className="text-[9px] text-stone-400 block">عرض السعر السابق كمرجع ترويجي بالمتجر.</span>
              </div>

              {/* Dynamic Publishing Readiness Checklist Card */}
              <div className="md:col-span-2 bg-[#fffdfa] border border-amber-200/80 rounded-2xl p-5 space-y-4 shadow-2xs">
                <h4 className="font-extrabold text-xs text-orange-950 flex items-center gap-1.5 border-b border-amber-100/60 pb-2">
                  <Sparkles className="w-4 h-4 text-orange-700 animate-pulse" />
                  <span>قائمة تحقّق جاهزية النشر العلمي والأكاديمي (Publishing Checklist)</span>
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Item 1: Title */}
                  <div className={`p-3 rounded-xl border flex items-center justify-between transition-all duration-200 ${
                    watchedTitle && watchedTitle.trim().length >= 4 
                      ? 'bg-emerald-50/40 border-emerald-100 text-emerald-950' 
                      : 'bg-stone-50 border-stone-155 text-stone-500'
                  }`}>
                    <div className="flex items-center gap-2">
                      {watchedTitle && watchedTitle.trim().length >= 4 ? (
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-stone-400 shrink-0" />
                      )}
                      <span className="text-[11px] font-bold">صياغة عنوان الدورة العلمي</span>
                    </div>
                    <span className="text-[10px] font-semibold font-mono">
                      {watchedTitle && watchedTitle.trim().length >= 4 ? 'مكتمل' : 'مطلوب رصين'}
                    </span>
                  </div>

                  {/* Item 2: Subtitle */}
                  <div className={`p-3 rounded-xl border flex items-center justify-between transition-all duration-200 ${
                    watchedSubtitle && watchedSubtitle.trim().length >= 10 
                      ? 'bg-emerald-50/40 border-emerald-100 text-emerald-950' 
                      : 'bg-stone-50 border-stone-155 text-stone-500'
                  }`}>
                    <div className="flex items-center gap-2">
                      {watchedSubtitle && watchedSubtitle.trim().length >= 10 ? (
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-stone-400 shrink-0" />
                      )}
                      <span className="text-[11px] font-bold">التوطئة والمدخل العلمي (الوصف)</span>
                    </div>
                    <span className="text-[10px] font-semibold font-mono">
                      {watchedSubtitle && watchedSubtitle.trim().length >= 10 ? 'مكتمل' : 'مطلوب وصف'}
                    </span>
                  </div>

                  {/* Item 3: Thumbnail */}
                  <div className={`p-3 rounded-xl border flex items-center justify-between transition-all duration-200 ${
                    watchedThumbnail && watchedThumbnail.trim().length > 0 
                      ? 'bg-emerald-50/40 border-emerald-100 text-emerald-950' 
                      : 'bg-stone-50 border-stone-155 text-stone-500'
                  }`}>
                    <div className="flex items-center gap-2">
                      {watchedThumbnail && watchedThumbnail.trim().length > 0 ? (
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-stone-400 shrink-0" />
                      )}
                      <span className="text-[11px] font-bold">رفع أو إدراج غلاف الدورة الرئيسي</span>
                    </div>
                    <span className="text-[10px] font-semibold font-mono">
                      {watchedThumbnail && watchedThumbnail.trim().length > 0 ? 'مرفوع' : 'مطلوب صورة'}
                    </span>
                  </div>

                  {/* Item 4: Sections check */}
                  <div className={`p-3 rounded-xl border flex items-center justify-between transition-all duration-200 ${
                    sections.length >= 1 
                      ? 'bg-emerald-50/40 border-emerald-100 text-emerald-950' 
                      : 'bg-stone-50 border-stone-155 text-stone-500'
                  }`}>
                    <div className="flex items-center gap-2">
                      {sections.length >= 1 ? (
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-stone-400 shrink-0" />
                      )}
                      <span className="text-[11px] font-bold">تأسيس الأبواب المعرفية لآثاري</span>
                    </div>
                    <span className="text-[10px] font-semibold font-mono">
                      {sections.length >= 1 ? `${sections.length} أبواب` : 'مطلوب باب'}
                    </span>
                  </div>

                  {/* Item 5: Lessons/items check */}
                  <div className={`p-3 rounded-xl border flex items-center justify-between transition-all duration-200 ${
                    sections.some(s => s.items.length >= 1) 
                      ? 'bg-emerald-50/40 border-emerald-100 text-emerald-950' 
                      : 'bg-stone-50 border-stone-155 text-stone-500'
                  }`}>
                    <div className="flex items-center gap-2">
                      {sections.some(s => s.items.length >= 1) ? (
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-stone-400 shrink-0" />
                      )}
                      <span className="text-[11px] font-bold">إدراج محاضرة أو درس تفصيلي</span>
                    </div>
                    <span className="text-[10px] font-semibold font-mono">
                      {sections.some(s => s.items.length >= 1) ? 'مكتمل' : 'مطلوب مقرر'}
                    </span>
                  </div>

                  {/* Item 6: Price check */}
                  <div className={`p-3 rounded-xl border flex items-center justify-between transition-all duration-200 ${
                    watchedPrice !== undefined && Number(watchedPrice) >= 0 
                      ? 'bg-emerald-50/40 border-emerald-100 text-emerald-950' 
                      : 'bg-stone-50 border-stone-155 text-stone-500'
                  }`}>
                    <div className="flex items-center gap-2">
                      {watchedPrice !== undefined && Number(watchedPrice) >= 0 ? (
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-stone-400 shrink-0" />
                      )}
                      <span className="text-[11px] font-bold">تحديد سعر الاستثمار المعتمد</span>
                    </div>
                    <span className="text-[10px] font-semibold font-mono">
                      {watchedPrice !== undefined && Number(watchedPrice) >= 0 ? `${watchedPrice} ر.س` : 'مطلوب الاستثمار'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Course submission review declaration Card */}
              <div className="md:col-span-2 bg-amber-50/10 border border-dashed border-amber-400 rounded-2xl p-5 space-y-4">
                <h4 className="font-extrabold text-xs text-orange-950 flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-orange-700" />
                  <span>وثيقة الأمانة الشرعية والاستحقاق التراثي</span>
                </h4>
                <p className="text-[10px] text-stone-600 leading-relaxed font-light">
                  مستند رصين يقرّ به الأستاذ أو الهيئة المعتمدة بأن كامل المادة العلمية ومجموع المجهودات من فيديوهات ونماذج مرجعية تم تدوينها وكتابتها بأقصى درجات التدقيق، ولا تشتمل على مخالفات لحقوق التأليف الفكرية أو مصادر وهمية غير مصادق عليها.
                </p>

                <div className="flex items-start gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="declaration-agreement"
                    required
                    className="mt-0.5"
                  />
                  <label htmlFor="declaration-agreement" className="text-[10px] text-stone-800 font-bold select-none cursor-pointer">
                    أتعهد أنا، أحمد التميمي، وبصفتي معلماً مسؤولاً، بدقة كافة المقررات والتزامي بميثاق مجلس آثاري الأكاديمي.
                  </label>
                </div>
              </div>

              {/* Metadata display review summary */}
              <div className="md:col-span-2 bg-stone-50 border border-stone-200 rounded-2xl p-4 text-xs space-y-2 font-mono">
                <h5 className="font-sans font-bold text-xs text-stone-800 mb-2">معلومات الدورة قيد الاعتماد:</h5>
                <div className="grid grid-cols-2 gap-y-1 text-[11px] text-stone-600">
                  <div>العنوان الرئيسي: {watchedTitle || '—'}</div>
                  <div>إجمالي المناهج: {sections.length} أبواب ومجالس</div>
                  <div>التصنيف المعرفي: {initialCourse?.category || 'الفنون التراثية الكلاسيكية'}</div>
                  <div>ثمن التسجيل المعتمد: {watchedPrice || 0} ر.س</div>
                </div>
              </div>

            </div>

            {/* Stepper Action controllers */}
            <div className="pt-5 border-t border-amber-50 flex justify-between items-center">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="bg-transparent hover:bg-stone-50 text-stone-600 text-xs font-bold px-5 py-2.5 rounded-xl border border-stone-200 cursor-pointer flex items-center gap-1"
              >
                <ArrowRight className="w-4 h-4" />
                <span>السابق: المنهج الهيكلي</span>
              </button>

              <button
                type="submit"
                className="bg-orange-700 hover:bg-orange-800 text-amber-50 text-xs font-black px-6 py-3 rounded-xl transition cursor-pointer border-0 shadow-md flex items-center gap-1"
              >
                <CheckCircle className="w-4 h-4" />
                <span>إقرار الدبلوم وتدشينه قيد المراجعة 🕋</span>
              </button>
            </div>
          </motion.div>
        )}

      {/* Dynamic AlertDialog Confirmation Overlay */}
      <AnimatePresence>
        {deleteConfirm && deleteConfirm.isOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            {/* Backdrop with elegant twilight blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteConfirm(null)}
              className="absolute inset-0 bg-stone-900/60 backdrop-blur-xs"
            />
            
            {/* Modal Dialog container Box content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.3 }}
              className="relative w-full max-w-md bg-white border border-amber-200/80 rounded-2xl shadow-xl p-6 text-right z-10"
              dir="rtl"
            >
              <div className="flex items-center gap-3 text-red-700 mb-3">
                <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="font-extrabold text-stone-900 text-sm">تأكيد عملية الحذف والإرساء</h3>
                  <p className="text-[10px] text-stone-500 font-light mt-0.5">هل أنت متأكد من رغبتك في إتمام هذا الإجراء؟</p>
                </div>
              </div>

              <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-100/80 text-stone-700 text-xs font-semibold leading-relaxed mb-5">
                تنبيه: سيتم التخلص من <span className="text-[#962D15] font-black">"{deleteConfirm.title}"</span> ومسجَّل بياناته بشكل نهائي من نموذج العمل الحالي ولا يمكن التراجع عن هذا التعديل.
              </div>

              <div className="flex gap-2.5 justify-end">
                <button
                  type="button"
                  onClick={() => setDeleteConfirm(null)}
                  className="px-4 py-2 bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-600 rounded-xl text-xs font-bold cursor-pointer transition"
                >
                  تراجع وإلغاء
                </button>
                <button
                  type="button"
                  onClick={handleExecuteDelete}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-amber-50 rounded-xl text-xs font-bold cursor-pointer transition shadow-2xs shadow-red-200"
                >
                  نعم، احذف الآن
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      </form>
    </div>
  );
}
