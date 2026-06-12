import { create } from 'zustand';

export interface Notification {
  id: string;
  title: string;
  content: string;
  date: string;
  read: boolean;
  type: 'new_course' | 'award' | 'live' | 'system';
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: () => number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'read' | 'date'>) => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [
    {
      id: 'n_1',
      title: 'إطلاق دبلوم الخط العربي الجديد! 🖋️',
      content: 'تم فتح التسجيل في الدورة التطبيقية المركزة لأسرار خط الديواني والثلث برعاية الخطاط أ. معاذ السامرائي.',
      date: 'منذ ساعتين',
      read: false,
      type: 'new_course'
    },
    {
      id: 'n_2',
      title: 'تهنئة بالتميز الأكاديمي 🎓',
      content: 'تم اعتماد ونشر شهادة الإجازة الكبرى الخاصة بك في مسار "روائع البلاغة العربية ونظم النثر". تصفحها الآن في لوحة التحكم!',
      date: 'منذ ٥ دقائق',
      read: false,
      type: 'award'
    },
    {
      id: 'n_3',
      title: 'بث مباشر مرتقب غداً 🔴',
      content: 'يبدأ مجلس لغة الضاد التفاعلي للنقاش الصوتي المفتوح غداً بعد صلاة العشاء مباشرة. اضبط تنبيهك للحضور.',
      date: 'منذ يوم واحد',
      read: true,
      type: 'live'
    }
  ],
  unreadCount: () => {
    return get().notifications.filter(n => !n.read).length;
  },
  markAsRead: (id) => {
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    }));
  },
  markAllAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
    }));
  },
  deleteNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }));
  },
  addNotification: (notification) => {
    const newNotif: Notification = {
      ...notification,
      id: `n_${Date.now()}`,
      read: false,
      date: 'الآن',
    };
    set((state) => ({
      notifications: [newNotif, ...state.notifications],
    }));
  }
}));
