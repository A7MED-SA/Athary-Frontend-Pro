import { useState, useEffect, useRef } from 'react';
import {
  MessageCircle,
  Bell,
  Send,
  CheckCheck,
  AlertCircle,
  User,
  Shield,
} from 'lucide-react';
import { useMessages, useConversation } from '../common/hooks/useMessages';
import { useNotifications } from '../common/hooks/useNotifications';

export default function MessagingCenter() {
  const [activeNav, setActiveNav] = useState<'messages' | 'notifications'>('messages');
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [inputText, setInputText] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  const { conversations, isLoading: convosLoading, send, isSendPending, markAsRead } = useMessages();
  const { messages, isLoading: msgsLoading } = useConversation(selectedUserId);
  const { notifications, unreadCount, markAllAsRead, markAsRead: markNotifRead, isLoading: notifsLoading } = useNotifications();

  const currentConvo = conversations?.find((c) => c.userId === selectedUserId);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (conversations && conversations.length > 0 && !selectedUserId) {
      setSelectedUserId(conversations[0].userId);
    }
  }, [conversations, selectedUserId]);

  const handleSelectConvo = (userId: string) => {
    setSelectedUserId(userId);
    markAsRead(userId);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !selectedUserId) return;

    send(
      { receiverId: selectedUserId, content: inputText },
      {
        onSuccess: () => setInputText(''),
      }
    );
  };

  const formatTime = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="bg-stone-50 rounded-3xl border border-amber-200/80 p-1 sm:p-4 overflow-hidden relative font-sans flex flex-col md:flex-row gap-4 min-h-[600px]" dir="rtl">

      {/* Sidebar */}
      <div className="w-full md:w-64 bg-white border border-amber-100 rounded-2xl p-3 shrink-0 flex flex-col justify-between">
        <div className="space-y-4">
          <div className="px-2 pt-2 pb-1 text-right">
            <h3 className="font-extrabold text-[#962D15] text-sm font-serif">مركز الاتصال</h3>
            <p className="text-[10px] text-stone-400 mt-0.5">مراسلات وإشعارات</p>
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
                <span>الرسائل</span>
              </div>
              {unreadCount > 0 && (
                <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-mono leading-none ${
                  activeNav === 'messages' ? 'bg-amber-400 text-stone-900' : 'bg-orange-700 text-white'
                }`}>
                  {unreadCount}
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
                <span>التنبيهات</span>
              </div>
              {unreadCount > 0 && (
                <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-mono leading-none ${
                  activeNav === 'notifications' ? 'bg-amber-400 text-stone-900' : 'bg-orange-700 text-white'
                }`}>
                  {unreadCount}
                </span>
              )}
            </button>
          </div>
        </div>

        <div className="mt-6 md:mt-0 p-3 bg-amber-50/50 border border-amber-200/50 rounded-xl space-y-2">
          <div className="flex items-center gap-2 text-[10px] font-bold text-amber-800">
            <Shield className="w-3.5 h-3.5 text-orange-700" />
            <span>سلامة الاتصالات</span>
          </div>
          <p className="text-[9px] text-stone-500 leading-relaxed font-light">
            تخضع المحادثات للتدقيق والمصادقة العلمية.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-white border border-amber-100 rounded-2xl overflow-hidden flex flex-col justify-between max-h-[650px] relative">

        {/* Messages View */}
        {activeNav === 'messages' && (
          <div className="flex-1 flex flex-col md:flex-row h-full min-h-[500px]">

            {/* Conversations List */}
            <div className="w-full md:w-56 border-l border-stone-100 bg-stone-50/50 flex flex-col overflow-y-auto max-h-[250px] md:max-h-none">
              <div className="p-3 bg-amber-50/20 border-b border-amber-100 text-[11px] font-bold text-stone-500">
                <span>المحادثات</span>
              </div>

              {convosLoading ? (
                <div className="p-4 text-center text-stone-400 text-xs">جاري التحميل...</div>
              ) : !conversations || conversations.length === 0 ? (
                <div className="p-4 text-center text-stone-400 text-xs">لا توجد محادثات</div>
              ) : (
                <div className="divide-y divide-stone-100/60">
                  {conversations.map((conv) => (
                    <button
                      key={conv.userId}
                      onClick={() => handleSelectConvo(conv.userId)}
                      className={`w-full text-right p-3 flex gap-3 transition border-0 cursor-pointer ${
                        conv.userId === selectedUserId ? 'bg-amber-100/50' : 'bg-transparent hover:bg-stone-100/40'
                      }`}
                    >
                      <div className="relative shrink-0">
                        <div className="w-10 h-10 rounded-full border border-amber-100 bg-stone-200 flex items-center justify-center overflow-hidden">
                          {conv.userProfileImageUrl ? (
                            <img src={conv.userProfileImageUrl} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          ) : (
                            <User className="w-5 h-5 text-stone-400" />
                          )}
                        </div>
                      </div>

                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex justify-between items-baseline gap-1">
                          <h4 className="font-extrabold text-[11px] text-stone-900 truncate">{conv.userName}</h4>
                          <span className="text-[8px] text-stone-400 font-mono shrink-0">{formatTime(conv.lastMessageAt)}</span>
                        </div>
                        <div className="flex justify-between items-center gap-1 pt-0.5">
                          <p className="text-[9px] text-stone-400 truncate leading-snug font-light flex-1">{conv.lastMessage}</p>
                          {conv.unreadCount > 0 && (
                            <span className="w-2 h-2 bg-orange-700 rounded-full shrink-0 animate-pulse" />
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Active Chat */}
            <div className="flex-1 flex flex-col justify-between bg-white max-h-[450px] md:max-h-none">

              {selectedUserId && currentConvo ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 bg-amber-50/30 border-b border-amber-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full border border-amber-200 bg-stone-200 flex items-center justify-center overflow-hidden">
                        {currentConvo.userProfileImageUrl ? (
                          <img src={currentConvo.userProfileImageUrl} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        ) : (
                          <User className="w-5 h-5 text-stone-400" />
                        )}
                      </div>
                      <div className="text-right">
                        <h4 className="font-black text-xs text-stone-900">{currentConvo.userName}</h4>
                        <span className="text-[9px] font-bold text-stone-500">
                          {currentConvo.unreadCount > 0 ? `${currentConvo.unreadCount} غير مقروءة` : 'متصل'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 p-4 overflow-y-auto space-y-3 min-h-[250px] max-h-[350px] md:max-h-none bg-stone-50/20">
                    {msgsLoading ? (
                      <div className="text-center text-stone-400 text-xs py-8">جاري تحميل الرسائل...</div>
                    ) : !messages || messages.length === 0 ? (
                      <div className="text-center text-stone-400 text-xs py-8">لا توجد رسائل بعد</div>
                    ) : (
                      messages.map((msg) => {
                        const isMe = msg.senderId !== selectedUserId;
                        return (
                          <div key={msg.id} className={`flex ${isMe ? 'justify-start' : 'justify-end'} text-right`}>
                            <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 shadow-2xs space-y-1 ${
                              isMe
                                ? 'bg-orange-700 text-amber-50 rounded-tr-none'
                                : 'bg-white border border-stone-200 text-stone-900 rounded-tl-none'
                            }`}>
                              <p className="text-xs leading-relaxed font-sans">{msg.content}</p>
                              <div className="flex items-center justify-end gap-1 font-mono text-[8px] opacity-75">
                                <span>{formatTime(msg.sentAt)}</span>
                                {isMe && msg.isRead && <CheckCheck className="w-3 h-3 text-amber-200" />}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                    <div ref={chatEndRef} />
                  </div>

                  {/* Input */}
                  <div className="p-3 border-t border-stone-100 bg-white">
                    <form onSubmit={handleSendMessage} className="flex gap-2">
                      <div className="flex-1 bg-stone-50 border border-amber-100 focus-within:border-orange-700 rounded-xl px-3 flex items-center gap-2">
                        <input
                          type="text"
                          value={inputText}
                          onChange={(e) => setInputText(e.target.value)}
                          disabled={isSendPending}
                          placeholder="اكتب رسالتك..."
                          className="w-full bg-transparent border-0 py-3.5 text-xs text-stone-900 focus:outline-none placeholder-stone-400"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={isSendPending || !inputText.trim()}
                        className={`px-5 rounded-xl border-0 cursor-pointer flex items-center justify-center gap-2 transition font-black text-xs ${
                          isSendPending || !inputText.trim()
                            ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
                            : 'bg-orange-700 hover:bg-orange-800 text-white shadow'
                        }`}
                      >
                        <span>إرسال</span>
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </form>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-stone-400 text-xs">
                  {convosLoading ? 'جاري تحميل المحادثات...' : 'اختر محادثة للبدء'}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Notifications View */}
        {activeNav === 'notifications' && (
          <div className="p-5 space-y-4 overflow-y-auto max-h-[550px] text-right">
            <div className="flex items-center justify-between pb-3 border-b border-amber-100">
              <div>
                <h3 className="font-extrabold text-[#962D15] text-xs sm:text-sm font-serif">التنبيهات</h3>
                <p className="text-[10px] text-stone-500 mt-0.5">متابعة لكل القرارات المعنية بحسابك</p>
              </div>
              <button
                onClick={() => markAllAsRead()}
                className="text-[10px] text-orange-900 bg-amber-50 hover:bg-amber-100 border border-amber-200 font-extrabold px-3 py-1.5 rounded-lg transition border-0 cursor-pointer"
              >
                تحديد الكل كمقروء
              </button>
            </div>

            {notifsLoading ? (
              <div className="text-center py-16 text-stone-400 text-xs">جاري التحميل...</div>
            ) : !notifications || notifications.length === 0 ? (
              <div className="py-16 text-center space-y-4">
                <Bell className="w-12 h-12 text-stone-300 mx-auto" />
                <p className="text-xs text-stone-500">لا توجد إشعارات حالياً</p>
              </div>
            ) : (
              <div className="space-y-3">
                {notifications.map((notif) => {
                  let iconColor = 'bg-stone-100 text-stone-700';
                  if (notif.type === 'success') iconColor = 'bg-emerald-50 text-emerald-800 border-emerald-100 border';
                  if (notif.type === 'info') iconColor = 'bg-blue-50 text-blue-800 border-blue-100 border';
                  if (notif.type === 'alert') iconColor = 'bg-red-50 text-red-800 border-red-100 border';

                  return (
                    <div
                      key={notif.id}
                      className={`p-4 rounded-2xl border transition-all duration-300 flex items-start justify-between gap-4 ${
                        notif.isRead
                          ? 'bg-stone-50/50 border-stone-200/80 hover:bg-stone-50 text-stone-600'
                          : 'bg-amber-50/45 border-amber-200/80 shadow-2xs hover:bg-amber-50/60 text-stone-900'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm shrink-0 ${iconColor}`}>
                          {notif.type === 'success' && '✓'}
                          {notif.type === 'info' && 'ℹ'}
                          {notif.type === 'alert' && '⚠'}
                        </div>
                        <div className="space-y-1">
                          <h4 className={`text-xs ${notif.isRead ? 'font-semibold' : 'font-black'}`}>{notif.title}</h4>
                          <p className="text-[11px] text-stone-500 leading-relaxed font-light">{notif.message}</p>
                          <span className="block text-[9px] text-stone-400 font-sans font-medium">{formatTime(notif.createdAt)}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => markNotifRead(notif.id)}
                        className={`text-[9px] font-black px-2.5 py-1.5 rounded-lg border transition whitespace-nowrap border-0 cursor-pointer ${
                          notif.isRead
                            ? 'bg-stone-100 text-stone-500 hover:bg-stone-200'
                            : 'bg-amber-100 text-amber-950 hover:bg-amber-200'
                        }`}
                      >
                        {notif.isRead ? 'تعليم كغير مقروء' : 'تعليم كمقروء'}
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
