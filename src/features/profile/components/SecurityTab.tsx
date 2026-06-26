import { Lock, Laptop, Smartphone } from 'lucide-react';

interface SessionItem { id: string; userAgent?: string; ipAddress?: string; isActive?: boolean; lastUsed?: string; createdAt: string; }

interface SecurityTabProps {
  sessions: SessionItem[] | undefined;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  onCurrentPasswordChange: (v: string) => void;
  onNewPasswordChange: (v: string) => void;
  onConfirmPasswordChange: (v: string) => void;
  onPasswordReset: (e: React.FormEvent) => void;
  onTerminateSession: (id: string) => void;
}

export function SecurityTab({
  sessions, currentPassword, newPassword, confirmPassword,
  onCurrentPasswordChange, onNewPasswordChange, onConfirmPasswordChange,
  onPasswordReset, onTerminateSession,
}: SecurityTabProps) {
  return (
    <div className="space-y-6">
      <form onSubmit={onPasswordReset} className="space-y-4 bg-stone-50 border border-stone-200 p-5 rounded-2xl">
        <h3 className="text-xs font-black text-orange-950 font-serif flex items-center gap-2">
          <Lock className="w-4.5 h-4.5 text-orange-700" />
          <span>تغيير وثيقة التحقق من البوابة (كلمة المرور)</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-stone-700 block">شفرة المرور الفعالة حالياً</label>
            <input type="password" required
              className="w-full bg-white p-2.5 text-xs text-stone-900 border border-stone-200 rounded-lg focus:outline-none"
              value={currentPassword} onChange={(e) => onCurrentPasswordChange(e.target.value)} placeholder="••••••••" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-stone-700 block">الشفرة الجديدة المستهدفة</label>
            <input type="password" required
              className="w-full bg-white p-2.5 text-xs text-stone-900 border border-stone-200 rounded-lg focus:outline-none"
              value={newPassword} onChange={(e) => onNewPasswordChange(e.target.value)} placeholder="٨ خانات كحد أدنى..." />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-stone-700 block">تأكيد شفرة المرور الجديدة</label>
            <input type="password" required
              className="w-full bg-white p-2.5 text-xs text-stone-900 border border-stone-200 rounded-lg focus:outline-none"
              value={confirmPassword} onChange={(e) => onConfirmPasswordChange(e.target.value)} placeholder="إعادة إدخال للتأكيد..." />
          </div>
        </div>

        <div className="flex justify-end pt-1">
          <button type="submit"
            className="bg-orange-700 hover:bg-orange-850 text-white text-[11px] font-black py-2 px-5 rounded-lg transition border-0 cursor-pointer shadow-xs">
            تبديل شفرة المرور
          </button>
        </div>
      </form>

      <div className="space-y-3">
        <h3 className="text-xs font-black text-orange-950 font-serif flex items-center gap-2">
          <Laptop className="w-4.5 h-4.5 text-orange-700" />
          <span>الحواسيب والهواتف المتصلة حالياً</span>
        </h3>

        <div className="space-y-2.5">
          {sessions?.map((sess) => (
            <div key={sess.id}
              className={`p-4 rounded-2xl border flex items-center justify-between text-right ${sess.isActive ? 'border-orange-500 bg-orange-50/10' : 'border-stone-200 bg-white'}`}>
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl ${sess.isActive ? 'bg-orange-100 text-orange-950' : 'bg-stone-100 text-stone-500'}`}>
                  {sess.userAgent?.includes('iPhone') || sess.userAgent?.includes('Android') ? <Smartphone className="w-4.5 h-4.5" /> : <Laptop className="w-4.5 h-4.5" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-xs text-stone-900">{sess.userAgent || 'جهاز غير معروف'}</span>
                    {sess.isActive && <span className="text-[8px] bg-emerald-100 text-emerald-800 font-extrabold px-2 py-0.5 rounded">الجلسة الحالية</span>}
                  </div>
                  <span className="text-[10px] text-stone-500 font-light block mt-0.5">IP: {sess.ipAddress}</span>
                  <span className="text-[9px] text-stone-400 font-sans block">{sess.lastUsed ? `آخر نشاط: ${new Date(sess.lastUsed).toLocaleDateString('ar-SA')}` : `أنشئت: ${new Date(sess.createdAt).toLocaleDateString('ar-SA')}`}</span>
                </div>
              </div>
              {!sess.isActive && (
                <button type="button" onClick={() => onTerminateSession(sess.id)}
                  className="bg-transparent hover:bg-stone-100 text-stone-500 hover:text-red-700 p-2 rounded-lg transition border-0 cursor-pointer text-xs font-semibold">
                  إنهاء الجلسة
                </button>
              )}
            </div>
          ))}
          {(!sessions || sessions.length === 0) && (
            <p className="text-xs text-stone-500 text-center py-4">لا توجد جلسات نشطة</p>
          )}
        </div>
      </div>
    </div>
  );
}
