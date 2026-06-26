import { DashboardSkeleton } from '../../../components/shared/Skeleton';
import { SectionHeader } from '../../../components/shared/ui';

interface UsersManagerProps {
  users: Array<{ id: string; fullName: string; email: string; roles: string[]; isActive: boolean }> | undefined;
  isLoading: boolean;
  onToggleActive: (id: string) => void;
  onToast: (msg: string) => void;
}

export function UsersManager({ users, isLoading, onToggleActive, onToast }: UsersManagerProps) {
  return (
    <div className="space-y-6 animate-fade-in" id="users-workbench-tab">
      <SectionHeader
        label="إدارة حسابات المستخدمين"
        title="المستخدمون"
        description="عرض وإدارة حسابات المستخدمين وتفعيل/إلغاء تفعيل الحسابات."
      />

      {isLoading ? (
        <DashboardSkeleton />
      ) : (
        <div className="bg-white rounded-3xl border border-amber-200/80 p-6 shadow-sm space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="border-b border-amber-100 text-stone-500 font-bold">
                  <th className="pb-3 pr-2">الاسم</th>
                  <th className="pb-3">البريد الإلكتروني</th>
                  <th className="pb-3">الدور</th>
                  <th className="pb-3">الحالة</th>
                  <th className="pb-3 pl-2">الإجراء</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-50">
                {(users ?? []).length === 0 ? (
                  <tr><td colSpan={5} className="py-8 text-center text-stone-400">لا يوجد مستخدمون</td></tr>
                ) : (
                  (users ?? []).map((user) => (
                    <tr key={user.id} className="hover:bg-amber-50/20 transition-colors">
                      <td className="py-3 pr-2 font-bold text-stone-900">{user.fullName}</td>
                      <td className="py-3 text-stone-600">{user.email}</td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-50 text-amber-800 border border-amber-200">{user.roles.join(', ')}</span>
                      </td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${!user.isActive ? 'bg-red-50 text-red-800 border border-red-200' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'}`}>
                          {!user.isActive ? 'غير نشط' : 'نشط'}
                        </span>
                      </td>
                      <td className="py-3 pl-2">
                        <button onClick={() => { onToggleActive(user.id); onToast(user.isActive ? 'تم إلغاء تفعيل الحساب' : 'تم تفعيل الحساب'); }} className="text-[10px] text-orange-700 hover:underline font-bold bg-transparent border-0 cursor-pointer">
                          {user.isActive ? 'إلغاء التفعيل' : 'تفعيل'}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
