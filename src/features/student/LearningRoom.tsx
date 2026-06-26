import { useState, useEffect } from 'react';
import { 
  Play, 
  FileText, 
  HelpCircle, 
  CheckCircle, 
  Lock, 
  MessageCircle, 
  Paperclip, 
  FileDown, 
  BookOpen, 
  Send, 
  Heart, 
  Mic, 
  Maximize2, 
  Volume2, 
  Award, 
  ChevronRight, 
  Edit, 
  Eye, 
  ChevronDown, 
  Sparkles,
  ArrowRight,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface LearningRoomProps {
  courseId?: string;
  courseTitle?: string;
  onNavigateBack: () => void;
  onOpenQuiz: (quizId: string) => void;
  onOpenCertificate: () => void;
}

interface SyllabusItem {
  id: string;
  title: string;
  type: 'video' | 'document' | 'quiz';
  duration: string;
  status: 'completed' | 'active' | 'locked';
  videoUrl?: string;
  textContent?: string;
  quizId?: string;
}

export default function LearningRoom({
  courseId = 'course_1',
  courseTitle = 'دبلوم النقوش والآثار الإسلامية القديمة في شبه الجزيرة العربية',
  onNavigateBack,
  onOpenQuiz,
  onOpenCertificate
}: LearningRoomProps) {
  // Curriculum items state
  const [syllabus, setSyllabus] = useState<SyllabusItem[]>([
    {
      id: 'item_1',
      title: 'المقدمة الفنية والتعريف العام بالمدارس الأثرية بتهامة وعسير',
      type: 'video',
      duration: '١٤ دقيقة',
      status: 'completed',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hand-turning-pages-of-old-book-40436-large.mp4'
    },
    {
      id: 'item_2',
      title: 'دراسة استقصائية لمراحل تدوين الأحجار والرقوق النبطية المبكرة',
      type: 'document',
      duration: '١٨ صفحة ورقية',
      status: 'completed',
      textContent: `بسم الله الرحمن الرحيم. تعد هذه المادة وثيقة مرجعية في دراسة الأشكال الكتابية السابقة للإسلام في جنوب غرب الجزيرة العربية. نمر خلال هذا المبحث على مراحل تطور الخط المسند الحميّري واختلافه البنيوي عن الأبجديات الآرامية والنبطية المشهورة، متطرقين إلى شواهد القبور الحجرية المنتشرة في منطقتي الفاو ونجران.`
    },
    {
      id: 'item_3',
      title: 'الاختبار المرحلي الأول: تقييم تشكيلات الكتابات والخط العربي القديم',
      type: 'quiz',
      duration: '١٠ أسئلة تقييمية',
      status: 'active',
      quizId: 'quiz_1'
    },
    {
      id: 'item_4',
      title: 'تحليل المنظومة المعمارية في القلاع والحصون الفنية النبعية بالمدينة',
      type: 'video',
      duration: '٢٤ دقيقة',
      status: 'locked',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-man-reading-vintage-library-book-41804-large.mp4'
    },
    {
      id: 'item_5',
      title: 'الأدلة التراثية الميدانية لتصنيف كسر الفخار بموقع جرش الأثري',
      type: 'document',
      duration: '٣٢ صفحة',
      status: 'locked',
      textContent: `المبحث الثالث: فخار موقع جرش الأثري بمنطقة عسير. يتميز فخار جرش بمتانة العجينة الطينية الحمراء والزخارف الغائرة والبارزة المستلهمة من البيئة المحلية. في هذه الدراسة نعرض تصنيف الطبقات الأثرية المكتشفة من القرنين الأول والثالث الهجري.`
    },
    {
      id: 'item_6',
      title: 'الاختبار الشامل لنيل شهادة التخرج المعتمدة من قطاع المتاحف',
      type: 'quiz',
      duration: '٢٠ سؤالاً نهائياً',
      status: 'locked',
      quizId: 'quiz_final'
    }
  ]);

  const [activeItemId, setActiveItemId] = useState('item_1');
  const [activeTab, setActiveTab] = useState<'comments' | 'resources' | 'notes'>('comments');
  
  // Custom Video Player controls representation
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoProgress, setVideoProgress] = useState(48);
  const [volume, setVolume] = useState(80);
  const [fullscreen, setFullscreen] = useState(false);
  const [videoSpent, setVideoSpent] = useState('06:45');
  const [videoDuration, setVideoDuration] = useState('14:00');

  // Comments System
  const [comments, setComments] = useState([
    {
      id: 1,
      user: 'أ. د. عبد الرحمن الشهري',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      text: 'شرح رائع جداً ومستوفٍ لأبعاد مقارنة خط المسند الجنوبي مع نبطية الشمال. نفع الله بعلمك شيخنا الفاضل وعسى أن يكون اللقاء القادم بالميدان الاستكشافي.',
      time: 'منذ ساعتين',
      likes: 12,
      liked: false
    },
    {
      id: 2,
      user: 'نسيبة العتيبي',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
      text: 'أرجو توفير خريطة توزيع المواقع الأثرية الحجرية بدقة عالية لنتمكن من مطابقتها مع الإحداثيات الجغرافية في بحوث الماجستير الخاصة بنا.',
      time: 'منذ ٤ ساعات',
      likes: 8,
      liked: true
    },
    {
      id: 3,
      user: 'م. إبراهيم الخالدي',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      text: 'التصوير في غاية الإتقان وجودة الصوت ممتازة. يسهل استيعاب المصطلحات الفنية للنقوش بفضل الكتابة التوضيحية المرافقة.',
      time: 'منذ يوم واحد',
      likes: 4,
      liked: false
    }
  ]);
  const [newCommentText, setNewCommentText] = useState('');

  // Resources list
  const [resources] = useState([
    { name: 'حقيبة النقوش التمهيدية - آثاري.pdf', size: '١٢.٤ ميجابايت', format: 'PDF' },
    { name: 'خرائط ومواقع المسالك والبلدان للهمداني.zip', size: '٤٥.٨ ميجابايت', format: 'ZIP' },
    { name: 'جدول مقارنة الأبجديات العربية القديمة المعتمد.pdf', size: '٣.٥ ميجابايت', format: 'PDF' }
  ]);

  // Notes state
  const [myNotes, setMyNotes] = useState(() => {
    return localStorage.getItem(`notes_${courseId}`) || 'قم بتدوين ملاحظانك الأكاديمية هنا ومراجعتها عند الاستعداد للاختبار الختامي... هذه الملاحظات تحفظ تلقائياً بصفتك طالباً مسجلاً.';
  });
  const [notesSaving, setNotesSaving] = useState(false);

  // Auto-save notes helper
  useEffect(() => {
    setNotesSaving(true);
    const timer = setTimeout(() => {
      localStorage.setItem(`notes_${courseId}`, myNotes);
      setNotesSaving(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [myNotes, courseId]);

  // Handle active curriculum selection
  const activeItem = syllabus.find(item => item.id === activeItemId) || syllabus[0];

  const handleSelectItem = (item: SyllabusItem) => {
    if (item.status === 'locked') {
      return; // Cannot access locked items
    }
    setActiveItemId(item.id);
    setIsPlaying(false);
  };

  const handleCompleteCurrent = () => {
    // Current active index
    const currentIndex = syllabus.findIndex(item => item.id === activeItemId);
    if (currentIndex === -1) return;

    // Set current to completed, and unlock the next lesson
    const updated = [...syllabus];
    updated[currentIndex].status = 'completed';
    
    if (currentIndex + 1 < updated.length) {
      updated[currentIndex + 1].status = 'active';
      setActiveItemId(updated[currentIndex + 1].id);
    }
    
    setSyllabus(updated);
  };

  const handleAddComment = () => {
    if (!newCommentText.trim()) return;
    const comment = {
      id: Date.now(),
      user: 'أحمد التميمي (أنت)',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
      text: newCommentText,
      time: 'قبل قليل',
      likes: 0,
      liked: false
    };
    setComments([comment, ...comments]);
    setNewCommentText('');
  };

  const handleLikeComment = (id: number) => {
    setComments(comments.map(c => {
      if (c.id === id) {
        return {
          ...c,
          liked: !c.liked,
          likes: c.liked ? c.likes - 1 : c.likes + 1
        };
      }
      return c;
    }));
  };

  // Calculate overall program progress
  const completedCount = syllabus.filter(item => item.status === 'completed').length;
  const progressPercent = Math.round((completedCount / syllabus.length) * 100);

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans" dir="rtl" id="learning-room-root">
      
      {/* HEADER SECTION WITH HERO CONTEXT */}
      <header className="bg-stone-950 text-amber-50 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between border-b border-stone-800 gap-4">
        <div className="flex items-center gap-3">
          <button 
            onClick={onNavigateBack}
            className="p-2 hover:bg-stone-800 rounded-lg text-stone-400 hover:text-white transition flex items-center justify-center border-0 cursor-pointer"
            title="العودة للوحة التحكم"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          
          <div className="space-y-0.5">
            <span className="text-[10px] text-amber-400 font-black tracking-widest block uppercase">غرفة التعلم والمدارسة الأثرية</span>
            <h1 className="text-xs md:text-sm font-black text-amber-50 leading-tight block truncate max-w-xl">
              {courseTitle}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end md:self-auto">
          {progressPercent === 100 && (
            <button
              onClick={onOpenCertificate}
              className="bg-amber-500 hover:bg-amber-600 text-stone-950 text-xs font-black px-4 py-2 rounded-xl transition flex items-center gap-1.5 border-0 shadow-lg cursor-pointer animate-pulse"
            >
              <Award className="w-4 h-4" />
              <span>استلام شهادة الإتمام</span>
            </button>
          )}

          <div className="text-left">
            <span className="text-[10px] text-stone-400 block">مرشد المسار:</span>
            <span className="text-xs font-bold text-amber-100">أ. د. أحمد بن صالح الخالدي</span>
          </div>
        </div>
      </header>

      {/* CORE SYLLABUS GRID */}
      <main className="max-w-7xl mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* LEFT COLUMN: Player Placeholder & Core Discussion Tabs (75% width / Column 3/4) */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Main Stage Player Area based on Syllabus Item Type */}
          <div className="bg-stone-900 rounded-3xl overflow-hidden border border-stone-800 shadow-2xl relative">
            
            {activeItem.type === 'video' && (
              <div className="relative aspect-video flex flex-col justify-between" id="video-stage">
                
                {/* Simulated video playback source with static backdrop placeholder */}
                <div className="absolute inset-0 bg-stone-950 flex shadow-inner items-center justify-center">
                  <img 
                    src="https://images.unsplash.com/photo-1447069387593-a5de0862481e?w=800"
                    alt="فيديو الدرس" 
                    className="w-full h-full object-cover opacity-35"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Big shimmering center play button */}
                  {!isPlaying && (
                    <button 
                      onClick={() => setIsPlaying(true)}
                      className="absolute w-20 h-20 bg-orange-700 hover:bg-orange-600 hover:scale-110 active:scale-95 text-amber-50 rounded-full flex items-center justify-center shadow-2xl transition cursor-pointer border-0 z-10"
                    >
                      <Play className="w-8 h-8 fill-amber-50 translate-x-[-2px]" />
                    </button>
                  )}

                  {isPlaying && (
                    <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                      <p className="text-xs text-amber-50 font-serif bg-black/60 px-4 py-2 rounded-lg backdrop-blur-md flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
                        <span>جاري المحاكاة التدفقية للبث الرقمي الموثَّق...</span>
                      </p>
                    </div>
                  )}
                </div>

                {/* Overlaid Top Header Details */}
                <div className="p-4 bg-gradient-to-b from-black/85 via-black/40 to-transparent text-amber-50 flex justify-between items-start z-10">
                  <span className="text-xs font-semibold bg-orange-800/80 px-2.5 py-1 rounded-md text-[10px]">فيديو معتمد وموثق</span>
                  <div className="text-left text-[10px] text-stone-300">
                    بث مدرسة: آثاري المعتمدة
                  </div>
                </div>

                {/* Overlaid Custom Controls bar */}
                <div className="p-4 bg-gradient-to-t from-black/95 via-black/80 to-transparent text-amber-50 z-10 space-y-3">
                  
                  {/* Progress bar controller representation */}
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono text-stone-400">{videoSpent}</span>
                    <div className="flex-1 h-1.5 bg-stone-800 rounded-full relative overflow-hidden group/progress cursor-pointer">
                      <div 
                        className="bg-orange-700 h-full rounded-full transition-all relative" 
                        style={{ width: `${videoProgress}%` }}
                      >
                        <div className="w-3 h-3 bg-amber-400 rounded-full absolute -right-1.5 -top-0.5 opacity-0 group-hover/progress:opacity-100 transition" />
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-stone-400">{videoDuration}</span>
                  </div>

                  {/* Icon Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="p-1 hover:text-orange-500 transition text-stone-300 border-0 cursor-pointer bg-transparent"
                      >
                        {isPlaying ? (
                          <div className="w-4 h-4 flex gap-1 items-center justify-center">
                            <span className="w-1 bg-amber-50 h-3" />
                            <span className="w-1 bg-amber-50 h-3" />
                          </div>
                        ) : (
                          <Play className="w-4 h-4 fill-current" />
                        )}
                      </button>

                      <div className="flex items-center gap-1 group/vol">
                        <Volume2 className="w-4 h-4 text-stone-300" />
                        <div className="w-12 h-1 bg-stone-700 rounded-full overflow-hidden">
                          <div className="bg-amber-400 h-full" style={{ width: `${volume}%` }} />
                        </div>
                      </div>

                      <span className="text-[10px] text-stone-300 bg-stone-800/80 px-2 py-0.5 rounded">١.٢٥x سرعة العرض</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <button 
                        onClick={handleCompleteCurrent}
                        className="bg-teal-700 hover:bg-teal-800 text-[#fff] text-[10px] font-bold px-3 py-1.5 rounded-lg border-0 cursor-pointer transition flex items-center gap-1.5 shadow"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>تأشير كمكتمل والانتقال</span>
                      </button>

                      <Maximize2 className="w-4 h-4 text-stone-300 cursor-pointer hover:text-white transition" />
                    </div>
                  </div>
                </div>

              </div>
            )}

            {activeItem.type === 'document' && (
              <div className="p-6 md:p-8 bg-[#FBF9F2] text-stone-900 font-serif min-h-[400px] flex flex-col justify-between border-b-[8px] border-amber-200">
                <div className="space-y-6">
                  {/* Classical Script design header */}
                  <div className="border-b border-amber-200/60 pb-4 text-center">
                    <span className="text-xs text-[#8F702D] block mb-1">من مخرجات المعهد الفرعي للحفاظ على النقوس دمشق وسنمار</span>
                    <h3 className="text-base text-orange-700 font-black">{activeItem.title}</h3>
                  </div>

                  <div className="space-y-4 max-w-2xl mx-auto">
                    <p className="text-sm text-stone-800 leading-relaxed text-justify first-letter:text-xl">
                      {activeItem.textContent}
                    </p>
                    <p className="text-sm text-stone-800 leading-relaxed text-justify">
                      وقد بينت الدراسات المقارنة أن تأثير القوافل التجارية من عسير إلى مكة المكرمة ومنها نحو حوران أسهم بشكل وافر في حوار كتابي مستفيض. إن معاينة الشاهد الأثرى تفيد بأن هذا التداخل الكتابي كان مرناً ويمتاز بتجويد دائم في شكل الحرف لتسهيل الحفر على صخور البازلت والغرانيت الصلدة.
                    </p>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-amber-100 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
                  <span className="text-stone-500 font-sans">عدد الصفحات المتبقي: ١٢ صفحة من أصل ١٨</span>
                  
                  <div className="flex gap-2">
                    <button 
                      onClick={handleCompleteCurrent}
                      className="bg-orange-700 hover:bg-orange-800 text-amber-50 px-4 py-2 rounded-xl transition font-bold border-0 cursor-pointer flex items-center gap-1.5 shadow-md"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>قراءة كامل الصحائف واعتماد التقدم</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeItem.type === 'quiz' && (
              <div className="p-12 text-center bg-stone-900 text-amber-50 space-y-6 min-h-[350px] flex flex-col justify-center items-center">
                <div className="w-16 h-16 bg-orange-900/40 border border-orange-700/60 rounded-full flex items-center justify-center text-orange-400">
                  <HelpCircle className="w-8 h-8 stroke-[1.5]" />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-sm md:text-base font-black text-amber-100">{activeItem.title}</h3>
                  <p className="text-xs text-stone-400 max-w-md mx-auto">
                    يتكون هذا التقييم من ١٠ أسئلة موضوعية لضبط قياس استيعابك للمهارات التراكمية في الدورة. تحتاج الحصول على درجة ٨٠٪ كحد أدنى لاجتياز الدرس.
                  </p>
                </div>

                <button
                  onClick={() => onOpenQuiz(activeItem.quizId || 'quiz_1')}
                  className="bg-orange-700 hover:bg-orange-800 text-amber-50 text-xs font-black px-8 py-3.5 rounded-xl transition border-0 cursor-pointer shadow-lg hover:shadow-xl active:scale-95"
                >
                  بدء الاختبار التفاعلي الموثق الآن
                </button>
              </div>
            )}

          </div>

          {/* LOWER INTERACTIVE TABS PANEL (Comments, Resources, Notepad) */}
          <div className="bg-white rounded-3xl p-6 border border-amber-100 shadow-sm">
            
            {/* Tabs Trigger Headers */}
            <div className="flex border-b border-amber-100 pb-3 gap-2">
              <button
                onClick={() => setActiveTab('comments')}
                className={`py-2 px-4 rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 border-0 cursor-pointer ${
                  activeTab === 'comments' ? 'bg-orange-50 text-orange-800 font-black' : 'text-stone-500 hover:text-stone-900 bg-transparent'
                }`}
              >
                <MessageCircle className="w-4 h-4" />
                <span>التعليقات والمناقشات</span>
                <span className="text-[10px] bg-orange-100 text-orange-800 px-1.5 py-0.5 rounded-full font-mono">{comments.length}</span>
              </button>

              <button
                onClick={() => setActiveTab('resources')}
                className={`py-2 px-4 rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 border-0 cursor-pointer ${
                  activeTab === 'resources' ? 'bg-orange-50 text-orange-800 font-black' : 'text-stone-500 hover:text-stone-900 bg-transparent'
                }`}
              >
                <Paperclip className="w-4 h-4" />
                <span>المرفقات والمصادر الدراسية</span>
              </button>

              <button
                onClick={() => setActiveTab('notes')}
                className={`py-2 px-4 rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 border-0 cursor-pointer ${
                  activeTab === 'notes' ? 'bg-orange-50 text-orange-800 font-black' : 'text-stone-500 hover:text-stone-900 bg-transparent'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>دفتر ملاحظاتي الخاص</span>
                {notesSaving && <span className="w-2.5 h-2.5 bg-amber-500 rounded-full animate-ping" />}
              </button>
            </div>

            {/* TAB CONTENT: Comments */}
            {activeTab === 'comments' && (
              <div className="mt-6 space-y-6">
                
                {/* Input box to post a comment */}
                <div className="flex gap-3 items-start">
                  <img 
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150" 
                    alt="أنت" 
                    className="w-10 h-10 rounded-xl object-cover border border-amber-100 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 space-y-2">
                    <textarea
                      value={newCommentText}
                      onChange={(e) => setNewCommentText(e.target.value)}
                      placeholder="اسأل المحاضر أو شارك استفساراً منهجياً مع زملائك بالدورة حول خطط النقوش..."
                      className="w-full text-xs p-3.5 border border-amber-100 rounded-xl text-stone-900 bg-stone-50 outline-none focus:border-orange-600 transition min-h-[75px]"
                    />
                    <div className="flex justify-between items-center">
                      <p className="text-[10px] text-stone-500">التعليقات تخضع لسياسة السلوك في مجالس المعارفي بمنصة آثاري.</p>
                      
                      <button
                        onClick={handleAddComment}
                        className="bg-orange-700 hover:bg-orange-800 text-amber-50 text-xs font-bold px-4 py-2 rounded-xl transition border-0 cursor-pointer flex items-center gap-1.5"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>نشر التعليق</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="h-px bg-stone-100 my-4" />

                {/* Custom feedback comment list */}
                <div className="divide-y divide-amber-100 space-y-4">
                  {comments.map((comment) => (
                    <div key={comment.id} className="pt-4 first:pt-0 flex gap-4 text-right">
                      <img 
                        src={comment.avatar} 
                        alt={comment.user} 
                        className="w-10 h-10 rounded-xl object-cover shrink-0 border border-amber-100"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex-1 space-y-1.5 min-w-0">
                        <div className="flex justify-between items-center">
                          <h4 className="font-bold text-xs text-stone-900">{comment.user}</h4>
                          <span className="text-[10px] text-stone-400 font-sans">{comment.time}</span>
                        </div>
                        <p className="text-xs text-stone-700 leading-relaxed text-slate-800">{comment.text}</p>
                        
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleLikeComment(comment.id)}
                            className={`flex items-center gap-1.5 text-[10px] font-semibold border-0 cursor-pointer bg-transparent transition ${
                              comment.liked ? 'text-red-500' : 'text-stone-400 hover:text-red-500'
                            }`}
                          >
                            <Heart className={`w-3.5 h-3.5 ${comment.liked ? 'fill-current text-red-500' : ''}`} />
                            <span className="font-mono">{comment.likes}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            )}

            {/* TAB CONTENT: Resources download lists */}
            {activeTab === 'resources' && (
              <div className="mt-6 space-y-4">
                <p className="text-xs text-stone-500">الملفات المعرفية والخرائط الملحقة المعينة لهذا المسار الأكاديمي، قابلة للتحميل المباشر للدارسين:</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {resources.map((res, idx) => (
                    <div key={idx} className="p-4 bg-stone-50 border border-amber-100 rounded-2xl flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-amber-100 text-amber-700 rounded-xl flex items-center justify-center font-bold text-xs">
                          {res.format}
                        </div>
                        <div className="text-right">
                          <h4 className="text-xs font-bold text-stone-950 truncate max-w-[200px]" title={res.name}>{res.name}</h4>
                          <p className="text-[10px] text-stone-500">الحجم الكلي: {res.size}</p>
                        </div>
                      </div>

                      <button
                        title="تحميل الملف المعتمد"
                        className="p-2 bg-white hover:bg-amber-100 text-stone-600 hover:text-orange-800 rounded-xl border border-amber-100 transition cursor-pointer"
                        onClick={() => alert(`محاكاة تحميل: ${res.name}`)}
                      >
                        <FileDown className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB CONTENT: Save notes auto editor */}
            {activeTab === 'notes' && (
              <div className="mt-6 space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-xs font-bold text-stone-950">مذكرة تدوين الفوائد والأصائل والمنظومات</h3>
                    <p className="text-[10px] text-stone-500">تحفظ فوائدك تلقائياً في السجل الرقمي المحلي بجهازك.</p>
                  </div>
                  <div className="text-left">
                    <span className="text-[10px] px-2.5 py-1 bg-amber-50 text-amber-800 rounded-full font-bold">
                      {notesSaving ? 'جاري الحفظ الآمن...' : 'تم الحفظ والمزامنة'}
                    </span>
                  </div>
                </div>

                <div className="relative">
                  <textarea
                    value={myNotes}
                    onChange={(e) => setMyNotes(e.target.value)}
                    className="w-full text-xs font-serif p-4 min-h-[160px] bg-[#FFFDFC] border border-[#ECD9AF]/60 rounded-2xl shadow-inner focus:outline-none focus:border-amber-500 leading-relaxed text-stone-900"
                  />
                  
                  <div className="absolute left-3 bottom-0.5 text-[10px] text-stone-400 font-serif">
                    * صالحة للمطالعة والتحضير المباشر
                  </div>
                </div>

                <div className="bg-amber-50 p-3 rounded-xl border border-amber-100 text-[10px] text-stone-600 leading-relaxed flex gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>تذكير تراثي: لخص الأفكار المفصلية بأسلوبك لتتمكن من استخدام "محصلة الفوائد" في المناقشات الختامية رفقة الأساتذة وعلماء الآثار.</span>
                </div>
              </div>
            )}

          </div>

        </div>

        {/* RIGHT COLUMN: Curriculum navigation (Sticky Sidebar, 25% width / Column 1/4) */}
        <div className="space-y-6">
          
          {/* Progress Tracker Card */}
          <div className="bg-[#FAF9F5] p-5 rounded-3xl border border-amber-100 shadow-xs space-y-4">
            <div className="space-y-1">
              <span className="text-[9px] text-stone-400 font-bold block uppercase">سير العملية التعليمية المعتمدة</span>
              <div className="flex justify-between items-baseline">
                <span className="text-xs font-bold text-stone-900">معدل تحصيلك الحالي:</span>
                <span className="text-sm font-black text-orange-800 font-mono">{progressPercent}%</span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden">
              <div 
                className="bg-orange-700 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <p className="text-[10px] text-[#8F702D] font-medium leading-relaxed">
              {completedCount === syllabus.length ? (
                '📜 مبارك! لقد أتممت جميع صحائف ومعاينات هذا المسار بنجاح. يمكنك استخراج شهادتك الموثّقة الآن.'
              ) : (
                `تبقّى لك معاينة وحل ${syllabus.length - completedCount} عناصر لإكمال متطلبات الدبلوم.`
              )}
            </p>
          </div>

          {/* Syllabus Items List */}
          <div className="bg-[#fff] rounded-3xl border border-amber-100 overflow-hidden shadow-sm">
            
            <div className="p-4 bg-amber-50 border-b border-amber-100">
              <h3 className="font-bold text-xs text-stone-900 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-orange-700" />
                <span>فهرست المحاضرات والمعاينات</span>
              </h3>
            </div>

            <div className="divide-y divide-amber-50">
              {syllabus.map((item, index) => {
                const isActive = item.id === activeItemId;
                
                // Determine layout helper class based on status
                let statusBg = '';
                let titleColor = '';
                let hoverClass = '';

                if (isActive) {
                  statusBg = 'bg-orange-50 border-r-4 border-orange-700';
                  titleColor = 'text-orange-900 font-black';
                  hoverClass = '';
                } else if (item.status === 'completed') {
                  statusBg = 'bg-transparent';
                  titleColor = 'text-stone-700';
                  hoverClass = 'hover:bg-stone-50 cursor-pointer';
                } else {
                  // Locked
                  statusBg = 'bg-stone-50/50 opacity-70';
                  titleColor = 'text-stone-400';
                  hoverClass = 'cursor-not-allowed';
                }

                return (
                  <div
                    key={item.id}
                    onClick={() => handleSelectItem(item)}
                    className={`p-4 flex gap-3 transition ${statusBg} ${hoverClass}`}
                  >
                    
                    {/* Visual indicators */}
                    <div className="flex flex-col items-center shrink-0">
                      
                      {item.status === 'completed' && (
                        <CheckCircle className="w-5 h-5 text-teal-700" />
                      )}

                      {item.status === 'active' && !isActive && (
                        <div className="w-5 h-5 bg-orange-100 rounded-full flex items-center justify-center">
                          <div className="w-2.5 h-2.5 bg-orange-700 rounded-full animate-pulse" />
                        </div>
                      )}

                      {isActive && (
                        <div className="w-5 h-5 bg-orange-700 text-amber-50 rounded-full flex items-center justify-center text-[10px] font-black">
                          {index + 1}
                        </div>
                      )}

                      {item.status === 'locked' && (
                        <Lock className="w-4 h-4 text-stone-400" />
                      )}

                      {/* Connection bar */}
                      {index < syllabus.length - 1 && (
                        <div className="w-px bg-stone-200 flex-1 my-1.5 min-h-[16px]" />
                      )}

                    </div>

                    <div className="flex-1 space-y-1.5 text-right min-w-0">
                      <div className="flex justify-between items-start gap-1">
                        <h4 className={`text-xs leading-snug line-clamp-2 ${titleColor}`}>
                          {item.title}
                        </h4>
                      </div>

                      <div className="flex items-center gap-2 text-[10px] text-stone-500 font-sans">
                        
                        {item.type === 'video' && (
                          <span className="flex items-center gap-1">
                            <Play className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                            <span>فيديو دبلومي</span>
                          </span>
                        )}

                        {item.type === 'document' && (
                          <span className="flex items-center gap-1">
                            <FileText className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                            <span>مستند دراسة</span>
                          </span>
                        )}

                        {item.type === 'quiz' && (
                          <span className="flex items-center gap-1">
                            <HelpCircle className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                            <span>تقييم مرحلي</span>
                          </span>
                        )}

                        <span className="text-stone-300">/</span>
                        <span>{item.duration}</span>

                      </div>
                    </div>

                  </div>
                );
              })}
            </div>

          </div>

          {/* Quick link to Live Broadcasts */}
          <div className="p-5 bg-stone-900 rounded-3xl text-amber-50 space-y-3 relative overflow-hidden shadow">
            <span className="inline-block bg-red-600 text-white text-[8px] font-black px-2 py-0.5 rounded-sm uppercase tracking-wider animate-pulse bg-red-700">
              ● بث مباشر معلَّق
            </span>
            <div className="space-y-1">
              <h4 className="text-xs font-black text-amber-100">بوابة تتبع الجلسات الحية</h4>
              <p className="text-[10px] text-stone-400 leading-normal">
                انضم الآن لمناقشة الأطروحات التراثية فليست العلوم حكراً على دفات الكراسات فحسب.
              </p>
            </div>
            
            <button 
              onClick={() => onOpenQuiz('live_broadcast')} 
              className="w-full bg-amber-500 hover:bg-amber-600 text-stone-950 font-black py-2.5 rounded-xl text-[10px] text-center block transition border-0 cursor-pointer text-decoration-none shadow"
            >
              دخول البث المباشر والدردشة المقارنة
            </button>
          </div>

        </div>

      </main>

    </div>
  );
}
