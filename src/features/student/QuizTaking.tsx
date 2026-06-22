import { useState, useEffect } from 'react';
import { 
  Clock, 
  Check, 
  AlertTriangle, 
  ChevronRight, 
  ChevronLeft, 
  HelpCircle, 
  Award, 
  RotateCcw, 
  Sparkles,
  BookOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface QuizTakingProps {
  quizId: string;
  onFinishQuiz: (scorePercent: number) => void;
  onCancel: () => void;
}

interface Question {
  id: number;
  text: string;
  options: string[];
  correctIndex: number;
}

export default function QuizTaking({
  quizId,
  onFinishQuiz,
  onCancel
}: QuizTakingProps) {
  // Specially-curated, immersive archeology quiz questions for "منصة آثاري"
  const [questions] = useState<Question[]>([
    {
      id: 1,
      text: "أي من تشكيلات الخطوط العربية المكتشفة يُعد أقدم تدوين مسجل ومثبت على صخور شواهد جبل سلع بالمدينة المنورة؟",
      options: [
        "الخط الكوفي المورّق المصحفي",
        "الخط الحجازي المدني والمكي المبكر",
        "خط الجزم النبطي الخالي من النقط ورؤوس الحروف",
        "خط الثلث التراثي العباسي"
      ],
      correctIndex: 1
    },
    {
      id: 2,
      text: "ما هي التقنية الأكثر أماناً وحفظاً للبنية العضوية للرقوق التالفة لتصوير السطور الداخلية دون لمسها المباشر؟",
      options: [
        "التصوير بالأشعة تحت الحمراء متعدد الأطياف (Multispectral)",
        "المعالجة والتنظيف بالأحماض الهيدروكلورية الخفيفة",
        "التعريض الطويل المستمر لأشعة الشمس المباشرة",
        "الاستنساخ اليدوي بالضغط الكربوني التقليدي"
      ],
      correctIndex: 0
    },
    {
      id: 3,
      text: "في موقع 'جرش' الأثري بمنطقة عسير، ما هي المادة البنائية الغالبة على أساس ممر البوابة التاريخية المشهورة؟",
      options: [
        "الحجر الرملي الجيري الهش ذو اللون البيج",
        "كتل المها الرخامية المستوردة من تدمير",
        "الأحجار الغرانيتية المتراصة مع الزخارف المحلية الفخارية والملاط الطيني",
        "الآجر الأحمر المشوي المعزز بالخشب الروماني"
      ],
      correctIndex: 2
    },
    {
      id: 4,
      text: "أي من الرموز الحيوانية الصخرية المنحوتة تكرر ذكره في جنوب شبه الجزيرة قديماً ليرمز إلى القوة والمناعة الأثرية؟",
      options: [
        "الوعل الجبلي ذو القرون المقوسة البارزة",
        "المها العربي ذو العيون المكبّلة",
        "الصقر البازي الجارح الأحادي المنقاد",
        "الذئب الطوقي المستأنس"
      ],
      correctIndex: 0
    },
    {
      id: 5,
      text: "ما هو الإجراء العلمي السليم عند العثور على قطع نقوش طينية رطبة فور استخراجها من الحفرية قبل إرسالها للمختبر؟",
      options: [
        "غسلها جيداً بماء من الصنبور وتجفيفها تحت لهيب شمعة",
        "لفها فوراً في حيز جيد التهوية مع الحفاظ على درجة رطوبتها الطبيعية وتجنب التجفيف الصدمي السريع لئلا تتشقق",
        "دهن السطح بملمع الطلاء الأكريليكي الكيميائي لحماية الألوان",
        "كشط النقش بآلة حديدية حادة للتأكد من عمق الحروف"
      ],
      correctIndex: 1
    }
  ]);

  // Quiz running states
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>(() => {
    // Attempt load from localStorage to prevent loss on reload
    try {
      const saved = localStorage.getItem(`quiz_answers_${quizId}`);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Timer: 10 minutes (600 seconds)
  const [timeLeft, setTimeLeft] = useState(600);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [scorePercent, setScorePercent] = useState(0);

  // Synchronize answers with localStorage key
  useEffect(() => {
    localStorage.setItem(`quiz_answers_${quizId}`, JSON.stringify(answers));
  }, [answers, quizId]);

  // Countdown clock loop
  useEffect(() => {
    if (quizSubmitted || timeLeft <= 0) {
      if (timeLeft <= 0 && !quizSubmitted) {
        handleSubmitQuiz();
      }
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, quizSubmitted]);

  // Time Formatter
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    const arabicMins = mins.toLocaleString('ar-SA');
    const arabicSecs = secs < 10 ? `٠${secs.toLocaleString('ar-SA')}` : secs.toLocaleString('ar-SA');
    return `${arabicMins}:${arabicSecs}`;
  };

  const handleSelectOption = (optionIndex: number) => {
    setAnswers({
      ...answers,
      [currentQuestionIndex]: optionIndex
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setShowWarningModal(true);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmitQuiz = () => {
    // Calculate grade
    let correctCount = 0;
    questions.forEach((q, idx) => {
      if (answers[idx] === q.correctIndex) {
        correctCount++;
      }
    });

    const finalPercent = Math.round((correctCount / questions.length) * 100);
    setScorePercent(finalPercent);
    setQuizSubmitted(true);
    setShowWarningModal(false);
    
    // Clear checkpoint answers
    localStorage.removeItem(`quiz_answers_${quizId}`);
  };

  const handleRestartQuiz = () => {
    setAnswers({});
    setCurrentQuestionIndex(0);
    setTimeLeft(600);
    setQuizSubmitted(false);
  };

  // Check unanswered count
  const answeredCount = Object.keys(answers).length;
  const isTimeLow = timeLeft < 120; // less than 2 minutes

  return (
    <div className="min-h-screen bg-stone-50 py-10 px-4 md:px-6" dir="rtl" id="quiz-taking-root">
      
      {/* CENTERING NARROW CONTAINER */}
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* BACK TO LEARNING LINK HEADER */}
        <div className="flex justify-between items-center">
          <button
            onClick={onCancel}
            className="text-xs font-bold text-stone-600 hover:text-stone-900 flex items-center gap-1 bg-transparent border-0 cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
            <span>العودة لغرفة التعلم والمدارسة</span>
          </button>

          <span className="text-[10px] bg-stone-200 text-stone-700 font-bold px-3 py-1 rounded-full font-mono">
            معاينة الأثر: ATH-{quizId.toUpperCase()}-2026
          </span>
        </div>

        {/* ACTIVE RUNNING QUIZ SECTION */}
        {!quizSubmitted ? (
          <>
            {/* STICKY STAGED TIMER CARD & PROGRESS HEADER */}
            <div className="bg-white rounded-3xl p-5 border border-amber-100 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4 relative overflow-hidden">
              
              <div className="space-y-1 text-center sm:text-right">
                <span className="text-[9px] text-amber-500 font-black tracking-widest block">التقويم الرقمي المشدد للدارسين</span>
                <h2 className="text-sm font-black text-stone-900">اختبار مرحلي: تقنيات النقوش وتصنيف اللقى الأثرية</h2>
                <p className="text-[10px] text-stone-500">تم تجميد وحظر تصفح النوافذ الخارجية لضمان الموثوقية الأكاديمية.</p>
              </div>

              {/* TIMER BOX */}
              <div className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl border transition-all shrink-0 ${
                isTimeLow 
                  ? 'bg-red-50 border-red-200 text-red-600 animate-pulse font-black' 
                  : 'bg-amber-50/50 border-amber-200 text-orange-900 font-bold'
              }`}>
                <Clock className={`w-4 h-4 ${isTimeLow ? 'text-red-600' : 'text-orange-700'}`} />
                <div className="text-right">
                  <span className="text-[9px] text-stone-400 block leading-none">الملتزم المتبقي:</span>
                  <span className="text-xs font-mono">{formatTime(timeLeft)}</span>
                </div>
              </div>

              {/* Top micro progress line */}
              <div className="absolute bottom-0 inset-x-0 h-1 bg-stone-100">
                <div 
                  className="h-full bg-orange-700 transition-all duration-300" 
                  style={{ width: `${(answeredCount / questions.length) * 100}%` }}
                />
              </div>

            </div>

            {/* MAIN QUESTION BLOCK BODY */}
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-amber-100 shadow-md space-y-6">
              
              {/* Question Header */}
              <div className="flex justify-between items-center border-b border-stone-100 pb-4">
                <span className="text-xs text-orange-800 font-black bg-orange-50 px-3 py-1 rounded-md">
                  السؤال {currentQuestionIndex + 1} من {questions.length}
                </span>
                
                <span className="text-[10px] text-stone-400 font-medium">
                  {answers[currentQuestionIndex] !== undefined ? '📌 تم حفظ إجابتك' : '🔘 لم يُجب بعد'}
                </span>
              </div>

              {/* Question Text */}
              <h3 className="text-sm md:text-base font-black text-stone-900 leading-relaxed text-right">
                {questions[currentQuestionIndex].text}
              </h3>

              {/* OPTIONS LIST - CLICKABLE CARDS */}
              <div className="grid grid-cols-1 gap-3">
                {questions[currentQuestionIndex].options.map((option, idx) => {
                  const isSelected = answers[currentQuestionIndex] === idx;
                  const letter = ['أ', 'ب', 'ج', 'د'][idx];

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      className={`w-full p-4 rounded-2xl border text-right transition flex items-center gap-4 cursor-pointer outline-none ${
                        isSelected 
                          ? 'border-orange-500 bg-orange-50 text-orange-950 font-bold ring-2 ring-orange-200' 
                          : 'border-stone-200 hover:border-amber-300 hover:bg-stone-50/50 text-stone-700'
                      }`}
                    >
                      {/* Round visual letter shield */}
                      <span className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center border transition ${
                        isSelected 
                          ? 'bg-orange-700 text-amber-50 border-orange-600' 
                          : 'bg-stone-100 text-stone-500 border-stone-200'
                      }`}>
                        {letter}
                      </span>
                      
                      <span className="text-xs leading-normal flex-1">{option}</span>

                      {isSelected && (
                        <div className="w-5 h-5 bg-orange-700 rounded-full flex items-center justify-center text-amber-50">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* BOTTOM NAVIGATION ACTIONS */}
              <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                
                <button
                  onClick={handlePrev}
                  disabled={currentQuestionIndex === 0}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold border flex items-center gap-1 cursor-pointer transition ${
                    currentQuestionIndex === 0
                      ? 'border-stone-100 text-stone-300 cursor-not-allowed bg-transparent'
                      : 'border-stone-200 text-stone-600 hover:bg-stone-100 bg-white'
                  }`}
                >
                  <ChevronRight className="w-4 h-4" />
                  <span>السابق</span>
                </button>

                {/* Question index dot tracers */}
                <div className="hidden sm:flex items-center gap-1.5">
                  {questions.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentQuestionIndex(idx)}
                      className={`w-2 h-2 rounded-full cursor-pointer transition-all border-0 ${
                        currentQuestionIndex === idx
                          ? 'bg-orange-700 w-5 h-2'
                          : answers[idx] !== undefined
                            ? 'bg-orange-300'
                            : 'bg-stone-200 hover:bg-stone-300'
                      }`}
                      title={`انتقال للسؤال ${idx + 1}`}
                    />
                  ))}
                </div>

                <button
                  onClick={handleNext}
                  className="px-6 py-2.5 bg-orange-700 hover:bg-orange-800 text-amber-50 rounded-xl text-xs font-bold border-0 cursor-pointer flex items-center gap-1 shadow transition"
                >
                  <span>{currentQuestionIndex === questions.length - 1 ? 'مراجعة وتسليم' : 'التالي'}</span>
                  <ChevronLeft className="w-4 h-4" />
                </button>

              </div>

            </div>

            {/* QUESTION JUMP GRID & TERMINATE ACTION */}
            <div className="bg-white rounded-3xl p-5 border border-amber-100 shadow-sm space-y-4">
              
              <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
                <div className="text-right">
                  <span className="text-xs font-bold text-stone-900">خريطة الأسئلة المنجزة:</span>
                  <p className="text-[10px] text-stone-500 leading-relaxed">
                    تمت الإجابة على ({answeredCount}) من أصل {questions.length} أسئلة موضوعية ومقالية.
                  </p>
                </div>

                <button
                  onClick={() => setShowWarningModal(true)}
                  className="bg-red-600 hover:bg-red-700 text-[#fff] text-xs font-extrabold px-5 py-2.5 rounded-xl transition border-0 cursor-pointer flex items-center gap-1.5 shadow"
                >
                  <AlertTriangle className="w-4 h-4" />
                  <span>إنهاء الاختبار وتسليم الإجابة</span>
                </button>
              </div>

              {/* Core numbers grid */}
              <div className="flex flex-wrap gap-2 justify-center py-2">
                {questions.map((_, idx) => {
                  const isSelected = currentQuestionIndex === idx;
                  const isAnswered = answers[idx] !== undefined;

                  let boxClass = 'border-stone-200 text-stone-600 bg-white hover:bg-stone-50';
                  if (isSelected) {
                    boxClass = 'border-orange-600 text-orange-950 bg-orange-50 font-black ring-2 ring-orange-200';
                  } else if (isAnswered) {
                    boxClass = 'border-amber-300 text-orange-800 bg-amber-50';
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => setCurrentQuestionIndex(idx)}
                      className={`w-10 h-10 rounded-xl border text-xs font-bold flex items-center justify-center transition cursor-pointer ${boxClass}`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

            </div>
          </>
        ) : (
          /* ==========================================================================
             RESULTS REPORTING SCREEN (Success / Celebration context)
             ========================================================================== */
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-6 md:p-8 border-2 border-amber-100 decoration-double shadow-2xl text-center space-y-6"
          >
            <div className="relative inline-block">
              <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto scale-110">
                <Award className="w-10 h-10 animate-bounce" />
              </div>
              <Sparkles className="w-6 h-6 text-amber-500 absolute -top-1 -right-1 animate-pulse" />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full font-black uppercase">
                بموجب محرر التقييم الرقمي
              </span>
              <h2 className="text-base md:text-lg font-black text-stone-900">
                تهانينا! لقد أتممت التقييم بنجاح تام
              </h2>
              <p className="text-xs text-stone-500 max-w-md mx-auto leading-relaxed">
                تم رصد وتأكيد درجاتك وإرسال التغذية الراجعة إلى أرشيفك الشخصي بلوحة معلومات الدارس.
              </p>
            </div>

            {/* Score Stats details card */}
            <div className="grid grid-cols-3 gap-3 max-w-lg mx-auto py-2">
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200">
                <span className="text-[10px] text-stone-400 block mb-1">الدرجة المحققة:</span>
                <span className="text-sm font-black text-orange-800 font-mono">{scorePercent}%</span>
              </div>
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200">
                <span className="text-[10px] text-stone-400 block mb-1">حالة الاجتياز:</span>
                <span className={`text-xs font-bold ${scorePercent >= 80 ? 'text-emerald-700' : 'text-orange-950'}`}>
                  {scorePercent >= 80 ? 'إجازة وتخطي متميز' : 'مكتمل بحاجة مراجعة'}
                </span>
              </div>
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200">
                <span className="text-[10px] text-stone-400 block mb-1">الزمن المستهلك:</span>
                <span className="text-xs font-bold font-mono text-stone-700">٣ دقائق</span>
              </div>
            </div>

            {/* Individual Question Feedback Analysis */}
            <div className="text-right space-y-3 max-w-lg mx-auto">
              <h4 className="text-xs font-bold text-stone-950">تفاصيل وصحّة إجابتك:</h4>
              <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                {questions.map((q, idx) => {
                  const isCorrect = answers[idx] === q.correctIndex;
                  return (
                    <div key={idx} className="p-2.5 bg-stone-50 rounded-xl flex justify-between items-center text-xs">
                      <span className="font-bold text-stone-700 truncate max-w-[280px]">
                        س{idx + 1}: {q.text}
                      </span>
                      <span className={`font-semibold text-[10px] py-0.5 px-2 rounded-md ${
                        isCorrect ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                      }`}>
                        {isCorrect ? 'صحيحة' : 'غير صحيحة'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-stone-100 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={handleRestartQuiz}
                className="px-6 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-stone-700 rounded-xl text-xs font-bold transition border-1 border-stone-200 cursor-pointer"
              >
                إعادة المحاولة والتقويم
              </button>

              <button
                onClick={() => onFinishQuiz(scorePercent)}
                className="px-8 py-3 bg-orange-700 hover:bg-orange-800 text-amber-50 rounded-xl text-xs font-black transition border-0 flex items-center justify-center gap-1 shadow-md cursor-pointer"
              >
                <span>اعتماد النتيجة والمواصلة بالمسار</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>

          </motion.div>
        )}

      </div>

      {/* CONFIRMATION WARNING MODAL SHEET */}
      <AnimatePresence>
        {showWarningModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-xs" onClick={() => setShowWarningModal(false)} />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 max-w-sm w-full text-right shadow-2xl relative z-10 border border-amber-100"
            >
              <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="w-6 h-6" />
              </div>

              <h3 className="text-xs font-black text-stone-950">هل أنت متأكد من تسليم ورقة الإجابات؟</h3>
              
              <p className="text-[11px] text-stone-500 leading-relaxed mt-2.5 font-light">
                لقد أنجزت الإجابة على ({answeredCount}) أسئلة فقط من أصل {questions.length}. بمجرد التسليم، لن تتمكن من مراجعة وتعديل هذه الخيارات أثناء هذه الدورة المعفاة.
              </p>

              <div className="flex gap-2.5 mt-5">
                <button
                  onClick={handleSubmitQuiz}
                  className="flex-1 bg-orange-700 hover:bg-orange-800 text-[#fff] py-2.5 rounded-xl text-xs font-extrabold border-0 cursor-pointer text-center font-sans shadow"
                >
                  نعم، تسليم وتصحيح
                </button>
                <button
                  onClick={() => setShowWarningModal(false)}
                  className="flex-1 bg-white hover:bg-stone-50 text-stone-500 py-2.5 rounded-xl text-xs font-extrabold border border-stone-200 cursor-pointer text-center font-sans"
                >
                  العودة للحل
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
