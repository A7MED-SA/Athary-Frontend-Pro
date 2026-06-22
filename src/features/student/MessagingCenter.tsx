import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageCircle, 
  Bell, 
  Send, 
  Paperclip, 
  Check, 
  CheckCheck, 
  AlertCircle, 
  Clock, 
  User,
  Shield,
  Trash2,
  CheckCircle2,
  Volume2,
  VolumeX
} from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'me' | 'other';
  time: string;
}

interface Conversation {
  id: string;
  name: string;
  avatar: string;
  role: string;
  lastMessage: string;
  time: string;
  unreadCount: number;
  online: boolean;
  messages: Message[];
}

interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
  type: 'info' | 'success' | 'alert';
}

interface MessagingCenterProps {
  onTriggerToast: (msg: string) => void;
}

export default function MessagingCenter({ onTriggerToast }: MessagingCenterProps) {
  const [activeNav, setActiveNav] = useState<'messages' | 'notifications'>('messages');
  
  // Rate limiting simulation states
  const [sendMessageCount, setSendMessageCount] = useState<number>(0);
  const [cooldownTime, setCooldownTime] = useState<number>(0);
  const [isCooldownActive, setIsCooldownActive] = useState<boolean>(false);
  const [inputText, setInputText] = useState<string>('');
  
  // Notifications state
  const [notificationsList, setNotificationsList] = useState<NotificationItem[]>([
    {
      id: 'notif_1',
      title: 'تم تصديق شهادتك الكبرى 📜',
      description: 'أجازتك في "فلسفة العمارة الإسلامية والتصميم التراثي" جاهزة ومصدقة الآن بختم المنصة الرفيعا.',
      time: 'منذ ساعتين',
      read: false,
      type: 'success'
    },
    {
      id: 'notif_2',
      title: 'بث مباشر جديد يبدأ قريباً 🎥',
      description: 'المجلس الروحي والميداني لدورة "أدب الأندلس ونظم المحاورة" ينطلق غداً بعد صلاة العشاء مباشرة بمشاركة مدققي الهيئات.',
      time: 'منذ يوم',
      read: false,
      type: 'info'
    },
    {
      id: 'notif_3',
      title: 'مراجعة الملاحظة رقم ٣ ⚠️',
      description: 'تنبيه من فضيلة المعلم: الرجاء التدقيق في قواعد تذهيب الخطوط قبل تقديم الإرسالية الثالثة تفادياً للتحفظ.',
      time: 'منذ يومين',
      read: true,
      type: 'alert'
    },
    {
      id: 'notif_4',
      title: 'تم قبول طلب الاسترداد المالي 🔄',
      description: 'تمت المصادقة على تسوية الرسوم لغرفة "دراسات معالم الفخار الأثري" وإعادتها لبطاقتك بنجاح.',
      time: 'منذ ٣ أيام',
      read: true,
      type: 'success'
    }
  ]);

  // Conversations state
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: 'conv_1',
      name: 'الأستاذ طارق الهاشمي',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      role: 'مدقق علم المخطوطات والبلاغة',
      lastMessage: 'أهلاً بك يا أحمد. لقد اطلعت على مسودتك وسنناقش في الدرس القادم قواعد تدوين الرقوق الأندلسية.',
      time: '١٢:٤٠ م',
      unreadCount: 2,
      online: true,
      messages: [
        { id: '1', text: 'السلام عليكم ورحمة الله وبركاته يا فضيلة الأستاذ طارق.', sender: 'me', time: '١٠:١٥ ص' },
        { id: '2', text: 'وعليكم السلام ورحمة الله وبركاته. كيف تسير قراءاتك في الباب الثالث للبلاغة ونظم النثر؟', sender: 'other', time: '١٠:٢٥ ص' },
        { id: '3', text: 'بفضل الله أتممت المذكرة وألحقت بها شواهد موازين الحروف المنقوشة.', sender: 'me', time: '١٠:٣٢ ص' },
        { id: '4', text: 'أهلاً بك يا أحمد. لقد اطلعت على مسودتك وسنناقش في الدرس القادم قواعد تدوين الرقوق الأندلسية.', sender: 'other', time: '١٢:٤٠ م' }
      ]
    },
    {
      id: 'conv_2',
      name: 'م. عبد الرحمن البغدادي',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
      role: 'معلم العمارة والأنماط الهندسية',
      lastMessage: 'تعديلاتك الأخيرة على رسم المقرنصات ممتازة جداً وننصح بمواصلة هذا النمط.',
      time: 'أمس',
      unreadCount: 0,
      online: false,
      messages: [
        { id: '1', text: 'أرفقت لكم سيدي تصميم المساقط الجانبية لمقرنص السقف كما وجهتم.', sender: 'me', time: 'أمس، ٠٣:٠٠ م' },
        { id: '2', text: 'تعديلاتك الأخيرة على رسم المقرنصات ممتازة جداً وننصح بمواصلة هذا النمط.', sender: 'other', time: 'أمس، ٠٤:١٢ م' }
      ]
    },
    {
      id: 'conv_3',
      name: 'مكتب الدعم المالي والتحصيل',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
      role: 'شؤون الدارسين والطلبات',
      lastMessage: 'مرحباً، تم توجيه طلب تسوية الرسوم لوكيل الحسابات المعتمد للمنصة.',
      time: 'قبل يومين',
      unreadCount: 0,
      online: true,
      messages: [
        { id: '1', text: 'أريد الاستفسار عن توقيت وصول أموال الاسترداد لبطاقة الصراف.', sender: 'me', time: 'منذ ٣ أيام' },
        { id: '2', text: 'مرحباً، تم توجيه طلب تسوية الرسوم لوكيل الحسابات المعتمد للمنصة.', sender: 'other', time: 'قبل يومين' }
      ]
    }
  ]);

  const [selectedConvId, setSelectedConvId] = useState<string>('conv_1');
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  const currentConversation = conversations.find(c => c.id === selectedConvId) || conversations[0];

  // Rate Limiting Cooldown Clock effect
  useEffect(() => {
    let timer: any;
    if (cooldownTime > 0) {
      timer = setInterval(() => {
        setCooldownTime(prev => {
          if (prev <= 1) {
            setIsCooldownActive(false);
            setSendMessageCount(0); // Reset count after cooldown completes
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cooldownTime]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentConversation.messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    // Simulate SignalR Rate Limiting: max 3 rapid messages in short succession for demo constraints
    // (Translating the 30 messages/minute endpoint limitation to immediate client safeguard)
    if (sendMessageCount >= 3) {
      setIsCooldownActive(true);
      setCooldownTime(15); // 15-second cooldown
      onTriggerToast('⚠️ تم تفعيل حماية الإرسال المتتابع (Rate Limiting)! يرجى الانتظار لحماية موارد الخادم.');
      return;
    }

    const newMessage: Message = {
      id: String(Date.now()),
      text: inputText,
      sender: 'me',
      time: 'الآن'
    };

    // Update messages in conversation
    setConversations(prev => prev.map(conv => {
      if (conv.id === selectedConvId) {
        return {
          ...conv,
          lastMessage: inputText,
          time: 'الآن',
          messages: [...conv.messages, newMessage]
        };
      }
      return conv;
    }));

    setInputText('');
    setSendMessageCount(prev => prev + 1);

    // Simulate teacher automated response after 2 seconds
    setTimeout(() => {
      const responseText = `تلقيت رسالتك المعرفية الموقرة يا أحمد، وسيكون ردي مسبوقاً بمراجعة دقيقة لمخطوطك في الدرس القادم إن شاء الله.`;
      const replyMessage: Message = {
        id: String(Date.now() + 1),
        text: responseText,
        sender: 'other',
        time: 'الآن'
      };

      setConversations(prev => prev.map(conv => {
        if (conv.id === selectedConvId) {
          return {
            ...conv,
            lastMessage: responseText,
            time: 'الآن',
            messages: [...conv.messages, replyMessage]
          };
        }
        return conv;
      }));
    }, 2000);
  };

  const markAllNotificationsAsRead = () => {
    setNotificationsList(prev => prev.map(n => ({ ...n, read: true })));
    onTriggerToast('✓ تم تحديد جميع التنبيهات كمقروءة');
  };

  const toggleNotificationRead = (id: string) => {
    setNotificationsList(prev => prev.map(n => {
      if (n.id === id) {
        return { ...n, read: !n.read };
      }
      return n;
    }));
  };

  const clearUnreadDot = (convId: string) => {
    setConversations(prev => prev.map(conv => {
      if (conv.id === convId) {
        return { ...conv, unreadCount: 0 };
      }
      return conv;
    }));
    setSelectedConvId(convId);
  };

  return (
    <div className="bg-stone-50 rounded-3xl border border-amber-200/80 p-1 sm:p-4 overflow-hidden relative font-sans flex flex-col md:flex-row gap-4 min-h-[600px]" dir="rtl" id="messaging-notif-center">
      
      {/* Active Sidebar Column for Left Switcher Links */}
      <div className="w-full md:w-64 bg-white border border-amber-100 rounded-2xl p-3 shrink-0 flex flex-col justify-between">
        <div className="space-y-4">
          <div className="px-2 pt-2 pb-1 text-right">
            <h3 className="font-extrabold text-[#962D15] text-sm font-serif">مركز الاتصال والمجتمع</h3>
            <p className="text-[10px] text-stone-400 mt-0.5">مراسلات المعلمين وإشعارات الحركات النظامية</p>
          </div>

          <div className="flex flex-row md:flex-col gap-1">
            <button
              onClick={() => setActiveNav('messages')}
              className={`flex-1 md:flex-none flex items-center justify-between gap-2 px-3.5 py-3 rounded-xl text-xs font-black transition border-0 cursor-pointer ${
                activeNav === 'messages' 
                  ? 'bg-orange-700 text-amber-50' 
                  : 'bg-stone-50 hover:bg-amber-50 text-stone-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                <span>الرسائل والمجادلات</span>
              </div>
              {conversations.reduce((acc, current) => acc + current.unreadCount, 0) > 0 && (
                <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-mono leading-none ${
                  activeNav === 'messages' ? 'bg-amber-400 text-stone-900' : 'bg-orange-700 text-white'
                }`}>
                  {conversations.reduce((acc, current) => acc + current.unreadCount, 0)}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveNav('notifications')}
              className={`flex-1 md:flex-none flex items-center justify-between gap-2 px-3.5 py-3 rounded-xl text-xs font-black transition border-0 cursor-pointer ${
                activeNav === 'notifications' 
                  ? 'bg-orange-700 text-amber-50' 
                  : 'bg-stone-50 hover:bg-amber-50 text-stone-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4" />
                <span>شريط التنبيهات والأثر</span>
              </div>
              {notificationsList.filter(n => !n.read).length > 0 && (
                <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-mono leading-none ${
                  activeNav === 'notifications' ? 'bg-amber-400 text-stone-900' : 'bg-orange-700 text-white'
                }`}>
                  {notificationsList.filter(n => !n.read).length}
                </span>
              )}
            </button>
          </div>
        </div>

        <div className="mt-6 md:mt-0 p-3 bg-amber-50/50 border border-amber-200/50 rounded-xl space-y-2">
          <div className="flex items-center gap-2 text-[10px] font-bold text-amber-800">
            <Shield className="w-3.5 h-3.5 text-orange-700" />
            <span>سلامة الاتصالات الثنائية</span>
          </div>
          <p className="text-[9px] text-stone-500 leading-relaxed font-light">
            تخضع المحادثات لتدقيق الهيئة الاستشارية للأمانة والمصداقية العلمية لمنصة آثاري.
          </p>
        </div>
      </div>

      {/* Main Action Component Frame */}
      <div className="flex-1 bg-white border border-amber-100 rounded-2xl overflow-hidden flex flex-col justify-between max-h-[650px] relative">
        
        {/* VIEW 1: MESSAGES AND CHATS */}
        {activeNav === 'messages' && (
          <div className="flex-1 flex flex-col md:flex-row h-full min-h-[500px]">
            {/* Conversations List Panel */}
            <div className="w-full md:w-56 border-l border-stone-100 bg-stone-50/50 flex flex-col overflow-y-auto max-h-[250px] md:max-h-none">
              <div className="p-3 bg-amber-50/20 border-b border-amber-100 flex items-center justify-between text-[11px] font-bold text-stone-500">
                <span>المعلمون والمنسقون</span>
                <span>متواجد حالياً</span>
              </div>
              
              <div className="divide-y divide-stone-100/60">
                {conversations.map((conv) => {
                  const isSelected = conv.id === selectedConvId;
                  return (
                    <button
                      key={conv.id}
                      onClick={() => clearUnreadDot(conv.id)}
                      className={`w-full text-right p-3 flex gap-3 transition border-0 cursor-pointer ${
                        isSelected ? 'bg-amber-100/50' : 'bg-transparent hover:bg-stone-100/40'
                      }`}
                    >
                      <div className="relative shrink-0">
                        <img 
                          src={conv.avatar} 
                          alt={conv.name} 
                          className="w-10 h-10 rounded-full border border-amber-100 object-cover"
                          referrerPolicy="no-referrer"
                        />
                        {conv.online && (
                          <span className="absolute bottom-0 left-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex justify-between items-baseline gap-1">
                          <h4 className="font-extrabold text-[11px] text-stone-900 truncate">{conv.name}</h4>
                          <span className="text-[8px] text-stone-400 font-mono shrink-0">{conv.time}</span>
                        </div>
                        <p className="text-[10px] text-stone-500 truncate leading-none font-light">{conv.role}</p>
                        <div className="flex justify-between items-center gap-1 pt-0.5">
                          <p className="text-[9px] text-stone-400 truncate leading-snug font-light flex-1">{conv.lastMessage}</p>
                          {conv.unreadCount > 0 && (
                            <span className="w-2 h-2 bg-orange-700 rounded-full shrink-0 animate-pulse" />
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active chat screen panel */}
            <div className="flex-1 flex flex-col justify-between bg-white max-h-[450px] md:max-h-none">
              
              {/* Active Chat Header */}
              <div className="p-4 bg-amber-50/30 border-b border-amber-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img 
                    src={currentConversation.avatar} 
                    alt={currentConversation.name} 
                    className="w-10 h-10 rounded-full border border-amber-200 object-cover" 
                    referrerPolicy="no-referrer" 
                  />
                  <div className="text-right">
                    <h4 className="font-black text-xs text-stone-900">{currentConversation.name}</h4>
                    <span className="text-[9px] font-bold text-stone-500 flex items-center gap-1.5 mt-0.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${currentConversation.online ? 'bg-emerald-500' : 'bg-stone-300'}`} />
                      <span>{currentConversation.online ? 'نشط الآن بمجلس التعليم' : 'غير متصل'}</span>
                      <span className="text-stone-300">•</span>
                      <span>{currentConversation.role}</span>
                    </span>
                  </div>
                </div>

                <div className="text-[8px] bg-stone-100 border border-stone-200 text-stone-600 font-mono rounded px-2 py-0.5">
                  رقم القناة المعرفية: MS-{currentConversation.id.slice(-3)}
                </div>
              </div>

              {/* Chat Message Lists body */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 min-h-[250px] max-h-[350px] md:max-h-none bg-stone-50/20">
                {currentConversation.messages.map((msg) => {
                  const isMe = msg.sender === 'me';
                  return (
                    <div key={msg.id} className={`flex ${isMe ? 'justify-start' : 'justify-end'} text-right`}>
                      <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 shadow-2xs space-y-1 ${
                        isMe 
                          ? 'bg-orange-700 text-amber-50 rounded-tr-none' 
                          : 'bg-white border border-stone-200 text-stone-900 rounded-tl-none'
                      }`}>
                        <p className="text-xs leading-relaxed font-sans">{msg.text}</p>
                        <div className="flex items-center justify-end gap-1 font-mono text-[8px] opacity-75">
                          <span>{msg.time}</span>
                          {isMe && (
                            <CheckCheck className="w-3 h-3 text-amber-200" />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={chatEndRef} />
              </div>

              {/* Message sending & constraints cooldown footer */}
              <div className="p-3 border-t border-stone-100 bg-white space-y-2">
                
                {/* Simulated Rate Limiting error card */}
                {isCooldownActive && (
                  <div className="p-3.5 bg-red-50 border border-red-200 text-red-950 rounded-xl flex items-center gap-3 animate-head-shake">
                    <AlertCircle className="w-5 h-5 text-red-700 shrink-0" />
                    <div className="text-right text-xs">
                      <span className="font-extrabold block">لقد تجاوزت الحد المسموح للإرسال السريع!</span>
                      <span className="text-[10px] text-red-700">
                        يحد خادم منصة آثاري الإرسال للتدقيق بـ ٣ رسائل سريعة بالدقيقة لمكافحة الإرسال المزعج. يرجى الانتظار <strong className="font-bold leading-none font-sans text-stone-950">{cooldownTime} ثوانٍ</strong>.
                      </span>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <div className="flex-1 bg-stone-50 border border-amber-100 focus-within:border-orange-700 rounded-xl px-3 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onTriggerToast('✓ تم فتح ألبوم المستندات والوثائق المعرفية التراثية المعتمدة.')}
                      className="p-1 hover:bg-stone-200/60 rounded text-stone-400 hover:text-stone-700 transition border-0 cursor-pointer"
                      title="إرفاق ملف أو تصديق مسودة"
                    >
                      <Paperclip className="w-4 h-4" />
                    </button>
                    
                    <input
                      type="text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      disabled={isCooldownActive}
                      placeholder={isCooldownActive ? 'رجاءً انتظر فترة الهدوء القسرية...' : 'اكتب رسالتك لفضيلة المدقق هنا...'}
                      className="w-full bg-transparent border-0 py-3.5 text-xs text-stone-900 focus:outline-none placeholder-stone-400"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isCooldownActive || !inputText.trim()}
                    className={`px-5 rounded-xl border-0 cursor-pointer flex items-center justify-center gap-2 transition font-black text-xs ${
                      isCooldownActive || !inputText.trim()
                        ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
                        : 'bg-orange-700 hover:bg-orange-800 text-white shadow'
                    }`}
                  >
                    <span>إرسال</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>

                <p className="text-[9px] text-stone-400 text-center font-light leading-none">
                  معدل التراسل الحالي: {sendMessageCount}/3 رسائل بالدقيقة • اضغط لإرسال فوري معزز ببروتوكول SignalR.
                </p>

              </div>

            </div>
          </div>
        )}

        {/* VIEW 2: NOTIFICATIONS AND LEDGER */}
        {activeNav === 'notifications' && (
          <div className="p-5 space-y-4 overflow-y-auto max-h-[550px] text-right">
            <div className="flex items-center justify-between pb-3 border-b border-amber-100">
              <div>
                <h3 className="font-extrabold text-[#962D15] text-xs sm:text-sm font-serif">شريط الحركات والبيانات الرصينة</h3>
                <p className="text-[10px] text-stone-500 mt-0.5">متابعة دقيقة لكل القرارات المعنية بحسابك بالمنصة</p>
              </div>

              <button
                onClick={markAllNotificationsAsRead}
                className="text-[10px] text-orange-900 bg-amber-50 hover:bg-amber-100 border border-amber-200 font-extrabold px-3 py-1.5 rounded-lg transition border-0 cursor-pointer"
              >
                تحديد الكل كمقروء
              </button>
            </div>

            {notificationsList.length === 0 ? (
              <div className="py-16 text-center space-y-4">
                <Bell className="w-12 h-12 text-stone-300 mx-auto" />
                <p className="text-xs text-stone-500">لا توجد إشعارات أو مستندات حية حالياً بمجلسك.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {notificationsList.map((notif) => {
                  let iconColor = 'bg-stone-100 text-stone-700';
                  if (notif.type === 'success') iconColor = 'bg-emerald-50 text-emerald-800 border-emerald-100 border';
                  if (notif.type === 'info') iconColor = 'bg-blue-50 text-blue-800 border-blue-100 border';
                  if (notif.type === 'alert') iconColor = 'bg-red-50 text-red-800 border-red-100 border';

                  return (
                    <div 
                      key={notif.id} 
                      className={`p-4 rounded-2xl border transition-all duration-300 flex items-start justify-between gap-4 ${
                        notif.read 
                          ? 'bg-stone-50/50 border-stone-200/80 hover:bg-stone-50 text-stone-600' 
                          : 'bg-amber-50/45 border-amber-200/80 shadow-2xs hover:bg-amber-50/60 text-stone-900'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm shrink-0 ${iconColor}`}>
                          {notif.type === 'success' && '📜'}
                          {notif.type === 'info' && '🎥'}
                          {notif.type === 'alert' && '⚠️'}
                        </div>

                        <div className="space-y-1">
                          <h4 className={`text-xs ${notif.read ? 'font-semibold' : 'font-black'}`}>{notif.title}</h4>
                          <p className="text-[11px] text-stone-500 leading-relaxed font-light">{notif.description}</p>
                          <span className="block text-[9px] text-stone-400 font-sans font-medium">{notif.time}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => toggleNotificationRead(notif.id)}
                        className={`text-[9px] font-black px-2.5 py-1.5 rounded-lg border transition whitespace-nowrap border-0 cursor-pointer ${
                          notif.read 
                            ? 'bg-stone-100 text-stone-500 hover:bg-stone-200' 
                            : 'bg-amber-100 text-amber-950 hover:bg-amber-200'
                        }`}
                      >
                        {notif.read ? 'تعليم كغير مقروء' : 'تعليم كمقروء'}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

      </div>

    </div>
  );
}
