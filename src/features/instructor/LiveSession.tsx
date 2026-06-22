import { useState, useEffect, useRef } from 'react';
import { 
  Video, 
  Mic, 
  MicOff, 
  Users, 
  Send, 
  LogOut, 
  Smile, 
  Volume2, 
  Maximize2, 
  MessageSquare, 
  Sparkles,
  Award,
  Power,
  ShieldAlert,
  ChevronRight
} from 'lucide-react';
import { motion } from 'motion/react';

interface LiveSessionProps {
  sessionId?: string;
  sessionTitle?: string;
  onLeave: () => void;
}

interface ChatMessage {
  id: number;
  user: string;
  text: string;
  time: string;
  role?: 'student' | 'instructor' | 'moderator';
}

export default function LiveSession({
  sessionId = 'session_1',
  sessionTitle = 'مجلس المدارسة المباشر: مناقشة النقوش الحجرية في آبار حمى بنجران',
  onLeave
}: LiveSessionProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [streamConnected, setStreamConnected] = useState(true);
  const [attendeesCount, setAttendeesCount] = useState(128);
  const [isVolumeHigh, setIsVolumeHigh] = useState(true);

  // Chat comments system
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      user: 'خالد الشهراني',
      text: 'السلام عليكم ورحمة الله وبركاته، مرحباً بالجميع وبأستاذنا الفاضل. متشوّق جداً للمحور الأول عن النقبة السبئية.',
      time: '٠٨:٠١ م',
      role: 'student'
    },
    {
      id: 2,
      user: 'أ. د. أحمد الخالدي (المحاضر)',
      text: 'وعليكم السلام ورحمة الله وبركاته. أهلاً بطالع العلم ورواد منصتنا التراثية. سنبدأ الآن قراءة فاحصة لنقش السلسلة الأولى.',
      time: '٠٨:٠٢ م',
      role: 'instructor'
    },
    {
      id: 3,
      user: 'سارة الهذلي (مشرف تقني)',
      text: 'تنويه لجميع الصحابة: يمكنكم طرح التساؤلات هنا مباشرة، وسيجيب الدكتور عنها في الربع ساعة الأخير بمشيئة الله.',
      time: '٠٨:٠٢ م',
      role: 'moderator'
    },
    {
      id: 4,
      user: 'فهد السديري',
      text: 'دكتور، هل السطر الثاني بالصورة يمثل نهاية السند أم بداية النعت الحجازي؟ دلالة الحرف تبدو غامضة.',
      time: '٠٨:٠٥ م',
      role: 'student'
    }
  ]);

  const [inputVal, setInputVal] = useState('');
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom helper
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Periodic user simulator: adds realistic comments over time to simulate a live classroom atmosphere
  useEffect(() => {
    const simulatorInterval = setInterval(() => {
      const mockUsers = [
        'جواهر الحربي', 'منى العبدلي', 'عبد المحسن النجدي', 'أحمد الدوسري', 'أروى العسيري'
      ];
      const mockTexts = [
        'هل مادة المحاضرة هذه ستتاح بصيغة PDF بالحقيبة اليدوية؟',
        'صحيح دلالة خط المسند الجنوبي تختلف عن نبطية الشمال بشكل عظيم.',
        'سبحان الله، وضوح النقش وبقاؤه طوال آلاف السنين صامداً على الصخر عجب عجاب!',
        'ما شاء الله، بارك الله في الدكتور وفي هذا العرض الفتان لمنصة آثاري الأصيلة.',
        'قواعد ممتازة وطرح غاية في البساطة والتأصيل.'
      ];

      const randomUser = mockUsers[Math.floor(Math.random() * mockUsers.length)];
      const randomText = mockTexts[Math.floor(Math.random() * mockTexts.length)];
      
      const newMsg: ChatMessage = {
        id: Date.now(),
        user: randomUser,
        text: randomText,
        time: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
        role: 'student'
      };

      setMessages(prev => [...prev, newMsg]);
      setAttendeesCount(prev => prev + Math.floor(Math.random() * 3) - 1);
    }, 12000); // add every 12 seconds

    return () => clearInterval(simulatorInterval);
  }, []);

  const handleSendMessage = () => {
    if (!inputVal.trim()) return;
    
    const userMsg: ChatMessage = {
      id: Date.now(),
      user: 'أحمد التميمي (أنت)',
      text: inputVal,
      time: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
      role: 'student'
    };

    setMessages(prev => [...prev, userMsg]);
    setInputVal('');
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans" dir="rtl" id="live-session-root">
      
      {/* HEADERBAR */}
      <header className="bg-stone-900 border-b border-stone-800 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        <div className="flex items-center gap-3">
          <button
            onClick={onLeave}
            className="p-1.5 hover:bg-stone-800 rounded-lg text-stone-400 hover:text-white transition flex items-center justify-center cursor-pointer border-0 shrink-0"
            title="مغادرة الغرفة والعودة"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-red-600 rounded-full animate-ping shrink-0" />
              <span className="text-[10px] text-red-500 font-black tracking-widest uppercase">البث المباشر المعتمد</span>
            </div>
            <h1 className="text-xs md:text-sm font-black text-amber-50">
              {sessionTitle}
            </h1>
          </div>
        </div>

        {/* Dynamic attending counters */}
        <div className="flex items-center gap-3 self-end md:self-auto">
          <div className="bg-stone-800 border border-stone-700 rounded-2xl px-4 py-2 flex items-center gap-2">
            <Users className="w-4 h-4 text-amber-400" />
            <div className="text-right">
              <span className="text-[8px] text-stone-400 block leading-none">مقارنو البث الحاليون:</span>
              <span className="text-xs font-mono font-bold text-amber-50">{attendeesCount} طالب وطالبة</span>
            </div>
          </div>

          <button
            onClick={onLeave}
            className="bg-red-700 hover:bg-red-800 text-white rounded-xl text-xs font-bold px-4 py-2 flex items-center gap-1.5 transition border-0 cursor-pointer shadow-md"
          >
            <LogOut className="w-4 h-4" />
            <span>مغادرة المجلس</span>
          </button>
        </div>

      </header>

      {/* CORE SYLLABUS GRID Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-10 overflow-hidden">
        
        {/* LEFT VIDEO AREA (70% WIDTH = lg:col-span-7) */}
        <div className="lg:col-span-7 bg-stone-950 p-4 md:p-6 flex flex-col justify-between relative min-h-[420px]">
          
          {/* Main web stream placeholder framed beautifully */}
          <div className="flex-1 bg-stone-900 rounded-3xl border border-stone-800 shadow-2xl relative overflow-hidden flex flex-col justify-between">
            
            {/* Embedded mockup stream overlay backdrop */}
            <div className="absolute inset-0 bg-stone-950 flex items-center justify-center">
              <img 
                src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1200"
                alt="بث المعلم" 
                className="w-full h-full object-cover opacity-35"
                referrerPolicy="no-referrer"
              />
              
              {/* Spinning geometric calibration overlay */}
              <div className="absolute top-8 right-8 bg-[#18181A]/85 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-stone-800 flex items-center gap-2.5">
                <div className="relative">
                  <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full block animate-pulse" />
                  <span className="w-2.5 h-2.5 bg-emerald-500/50 rounded-full block absolute left-0 top-0 animate-ping" />
                </div>
                <div className="text-right">
                  <span className="text-[8px] text-stone-400 block leading-none">جودة البث الحالية:</span>
                  <span className="text-[10px] text-emerald-400 font-bold">1080p متميزة</span>
                </div>
              </div>

              {/* Watermark logo */}
              <div className="absolute left-6 bottom-20 select-none opacity-25 flex items-center gap-1 text-amber-100">
                <Sparkles className="w-4 h-4" />
                <span className="font-serif font-black text-xs">منصة آثاري التراثية</span>
              </div>
            </div>

            {/* Overlaid upper stream title bar */}
            <div className="p-4 bg-gradient-to-b from-black/80 via-black/30 to-transparent flex justify-between items-start z-10 leading-none">
              <div className="bg-red-700/80 px-2.5 py-1 rounded text-[10px] font-black text-white flex items-center gap-1.5 uppercase">
                <Video className="w-3 h-3 animate-pulse" />
                <span>شريحة معروض الأستاذ: أحمد الخالدي</span>
              </div>
            </div>

            {/* Middle presenter watermark placeholder */}
            <div className="z-10 text-center space-y-3 self-center max-w-sm px-6 bg-black/40 py-6 rounded-3xl backdrop-blur-md border border-white/5 mx-4">
              <div className="w-16 h-16 bg-[#F5F0E6] text-[#962D15] rounded-full flex items-center justify-center font-bold text-center border-2 border-amber-500 mx-auto font-serif text-lg leading-none">
                أثري
              </div>
              <div className="space-y-1">
                <h3 className="text-xs font-black text-amber-50 leading-tight">مجلس مدارسة: فحص خطوط الحجر بنجران</h3>
                <p className="text-[10px] text-stone-300 leading-normal">
                  مرور على نقش المخطوط المسند الرقم 15 المتفرد برسومات قوافل النعم.
                </p>
              </div>
            </div>

            {/* Custom controls at bottom shelf */}
            <div className="p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              
              <div className="flex flex-wrap items-center gap-3">
                
                {/* Microphones button toggler */}
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition border-0 cursor-pointer ${
                    isMuted 
                      ? 'bg-red-700 hover:bg-red-800 text-white' 
                      : 'bg-stone-800 hover:bg-stone-700 text-stone-200'
                  }`}
                  title={isMuted ? 'إلغاء كتم جهازك' : 'كتم جازك'}
                >
                  {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  <span>{isMuted ? 'اللاقط مكتوم' : 'اللاقط نشط'}</span>
                </button>

                <button
                  onClick={() => setIsVolumeHigh(!isVolumeHigh)}
                  className="p-2 bg-stone-800 hover:bg-stone-700 rounded-xl transition text-stone-300 border-0 cursor-pointer"
                  title="تغيير مستوى صوت المعلم بالبث"
                >
                  <Volume2 className={`w-4 h-4 ${isVolumeHigh ? 'text-amber-500' : 'text-stone-500'}`} />
                </button>

                <span className="text-[10px] text-stone-300 bg-stone-800/80 p-2.5 rounded-xl border border-stone-800">
                  معدل التباطؤ: <span className="text-emerald-400 font-bold font-mono">١٨ ملي ثانية</span>
                </span>

              </div>

              <div className="flex items-center gap-3">
                <span className="text-[9px] bg-amber-500/10 text-amber-400 px-3 py-1 rounded-full border border-amber-500/20 font-serif">
                  * مجلس مصرح ومعتمد لنقل السلّم العلمي
                </span>
                <Maximize2 className="w-4 h-4 text-stone-400 hover:text-white transition cursor-pointer" />
              </div>

            </div>

          </div>

          {/* Lower webinar quick hints */}
          <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-stone-400">
            <span className="flex items-center gap-1">
              <ShieldAlert className="w-4 h-4 text-orange-600" />
              <span>هذا البث يخضع لشروط الترخيص الأكاديمي الصارمة لوزارة التثقيف.</span>
            </span>
            <span className="font-sans">رمز المحادثة الحية: AT-SESSION-ID839</span>
          </div>

        </div>

        {/* RIGHT LIVE CHAT SIDEBAR (30% WIDTH = lg:col-span-3) */}
        <div className="lg:col-span-3 bg-[#FCFAF5] text-stone-900 border-r border-stone-200 lg:border-r-0 flex flex-col justify-between">
          
          {/* Sidebar Header details */}
          <div className="p-4 bg-amber-50 border-b border-amber-100 flex items-center justify-between">
            <h3 className="font-black text-xs text-stone-950 flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-[#962D15]" />
              <span>الدردشة التفاعلية الفورية</span>
            </h3>
            
            <span className="text-[10px] color-[#8F702D] font-bold bg-[#FAF0D5]/60 pr-2 pl-2 rounded-full font-mono">
              بث مباشر
            </span>
          </div>

          {/* Messages list */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[460px] lg:max-h-none">
            {messages.map((msg) => {
              const isMe = msg.user.includes('أنت');
              const isInstructor = msg.role === 'instructor';
              const isModerator = msg.role === 'moderator';

              let cardBg = 'bg-white';
              let nameColor = 'text-amber-800';
              let borderClass = 'border border-amber-100/60';

              if (isMe) {
                cardBg = 'bg-orange-50';
                nameColor = 'text-orange-950 font-black';
                borderClass = 'border-r-3 border-orange-700 border-t-0 border-b-0 border-l-0';
              } else if (isInstructor) {
                cardBg = 'bg-[#FAECE8]';
                nameColor = 'text-[#962D15] font-black';
                borderClass = 'border-r-3 border-[#962D15] border-t-0 border-b-0 border-l-0';
              } else if (isModerator) {
                cardBg = 'bg-teal-50/50';
                nameColor = 'text-teal-900';
                borderClass = 'border-r-3 border-teal-600 border-t-0 border-b-0 border-l-0';
              }

              return (
                <div key={msg.id} className="space-y-1 text-right">
                  <div className="flex justify-between items-baseline">
                    <span className={`text-[10px] font-bold ${nameColor}`}>{msg.user}</span>
                    <span className="text-[9px] text-stone-400 font-sans">{msg.time}</span>
                  </div>
                  
                  <div className={`p-3 rounded-2xl text-xs text-stone-800 leading-normal ${cardBg} ${borderClass}`}>
                    {msg.text}
                  </div>
                </div>
              );
            })}
            <div ref={chatBottomRef} />
          </div>

          {/* Chat input form box */}
          <div className="p-4 bg-amber-50/50 border-t border-amber-100 space-y-2">
            
            <div className="flex gap-2">
              <input 
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="اكتب استفسارك أو مشاركتك العلمية للفصل..."
                className="flex-1 text-xs p-3 rounded-xl text-stone-900 bg-white border border-amber-100 focus:outline-none focus:border-orange-600 transition"
              />
              
              <button
                onClick={handleSendMessage}
                className="bg-orange-700 hover:bg-orange-800 text-white p-3 rounded-xl border-0 cursor-pointer flex items-center justify-center shadow transition"
                title="إرسال عبر بروتوكول البث"
              >
                <Send className="w-4 h-4 translate-x-[-1px]" />
              </button>
            </div>

            <div className="flex justify-between items-center text-[9px] text-stone-500">
              <span>* يرجى الالتزام بالآداب التراثية لمجالس العلم المعرفية.</span>
              
              <button 
                className="p-1 hover:bg-stone-100 rounded flex items-center justify-center border-0 text-stone-400 bg-transparent cursor-pointer"
                onClick={() => setInputVal(prev => prev + '🌹')}
                title="إضافة رمز مودة"
              >
                <Smile className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
