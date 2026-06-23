import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAppContext } from '../../providers/AppProvider';
import { useProfile } from '../common/hooks/useProfile';
import { DashboardSkeleton } from '../../components/shared/Skeleton';
import { ErrorFallback } from '../../components/shared/ErrorFallback';
import {
  User,
  Phone,
  MapPin,
  Shield,
  ArrowRight,
  Upload,
  Trash2,
  Save,
  CheckCircle,
  Plus,
  Star,
  X,
  Lock,
} from 'lucide-react';

const profileSchema = z.object({
  fullName: z.string().min(5, 'الاسم الكامل يجب ألا يقل عن 5 أحرف'),
  bio: z.string().optional(),
  gender: z.enum(['Male', 'Female', 'Other']).optional(),
  dateOfBirth: z.string().optional(),
  nationality: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

type SettingsTab = 'personal' | 'phones' | 'addresses' | 'security';

export default function ProfileSettings() {
  const navigate = useNavigate();
  const { userName, displayToast } = useAppContext();
  const {
    profile,
    isLoading,
    error,
    update,
    isUpdatePending,
    addPhone,
    setDefaultPhone,
    deletePhone,
    addAddress,
    setDefaultAddress,
    deleteAddress,
  } = useProfile();

  const [activeTab, setActiveTab] = useState<SettingsTab>('personal');
  const [isAddingPhone, setIsAddingPhone] = useState(false);
  const [newPhoneNumber, setNewPhoneNumber] = useState('');
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({ streetLine1: '', city: '', postalCode: '', country: '' });

  const { register, handleSubmit, formState: { errors } } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    values: {
      fullName: profile?.fullName ?? userName,
      bio: profile?.bio ?? '',
      gender: (profile?.gender as 'Male' | 'Female' | 'Other') ?? undefined,
      dateOfBirth: profile?.dateOfBirth?.split('T')[0] ?? '',
      nationality: profile?.nationality ?? '',
    },
  });

  const onSubmit = (data: ProfileFormData) => {
    update(data, {
      onSuccess: () => displayToast('تم حفظ التغييرات بنجاح'),
      onError: () => displayToast('حدث خطأ أثناء الحفظ'),
    });
  };

  const handleAddPhone = () => {
    if (!newPhoneNumber.trim()) return;
    addPhone({ phoneNumber: newPhoneNumber, type: 'Primary' }, {
      onSuccess: () => {
        setNewPhoneNumber('');
        setIsAddingPhone(false);
        displayToast('تم إضافة رقم الجوال بنجاح');
      },
      onError: () => displayToast('حدث خطأ أثناء إضافة الرقم'),
    });
  };

  const handleDeletePhone = (phoneId: string) => {
    deletePhone(phoneId, {
      onSuccess: () => displayToast('تم حذف رقم الجوال'),
      onError: () => displayToast('حدث خطأ أثناء الحذف'),
    });
  };

  const handleSetDefaultPhone = (phoneId: number) => {
    setDefaultPhone(String(phoneId), {
      onSuccess: () => displayToast('تم تعيين الرقم كافتراضي'),
    });
  };

  const handleAddAddress = () => {
    if (!newAddress.streetLine1.trim() || !newAddress.city.trim()) return;
    addAddress({ ...newAddress, type: 'Home' }, {
      onSuccess: () => {
        setNewAddress({ streetLine1: '', city: '', postalCode: '', country: '' });
        setIsAddingAddress(false);
        displayToast('تم إضافة العنوان بنجاح');
      },
      onError: () => displayToast('حدث خطأ أثناء إضافة العنوان'),
    });
  };

  const handleDeleteAddress = (addressId: string) => {
    deleteAddress(addressId, {
      onSuccess: () => displayToast('تم حذف العنوان'),
    });
  };

  const handleSetDefaultAddress = (addressId: string) => {
    setDefaultAddress(addressId, {
      onSuccess: () => displayToast('تم تعيين العنوان كافتراضي'),
    });
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><DashboardSkeleton /></div>;
  if (error) return <div className="min-h-screen flex items-center justify-center"><ErrorFallback onRetry={() => navigate(0)} /></div>;

  const phones = profile?.phones ?? [];
  const addresses = profile?.addresses ?? [];

  const menuItems = [
    { id: 'personal' as SettingsTab, label: 'المعلومات الشخصية', icon: <User className="w-4 h-4" /> },
    { id: 'phones' as SettingsTab, label: 'أرقام الجوال', icon: <Phone className="w-4 h-4" /> },
    { id: 'addresses' as SettingsTab, label: 'عناوين الشحن', icon: <MapPin className="w-4 h-4" /> },
    { id: 'security' as SettingsTab, label: 'الأمان وكلمة المرور', icon: <Shield className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-transparent" dir="rtl">
      <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-8">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-stone-100 rounded-xl transition"><ArrowRight className="w-5 h-5 text-stone-600" /></button>
          <div>
            <h1 className="text-xl font-extrabold text-stone-900">إعدادات الحساب الشخصي</h1>
            <p className="text-xs text-stone-500 mt-1">إدارة معلوماتك الشخصية وأرقام الجوال والعناوين.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition ${
                  activeTab === item.id ? 'bg-orange-700 text-amber-50' : 'text-stone-700 hover:bg-orange-50'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="lg:col-span-3 space-y-6">
            {activeTab === 'personal' && (
              <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-3xl border border-amber-200/80 p-6 shadow-sm space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-amber-100">
                  <h2 className="text-sm font-extrabold text-stone-900">المعلومات الشخصية</h2>
                  <button type="submit" disabled={isUpdatePending} className="bg-orange-700 hover:bg-orange-800 text-amber-50 text-xs font-bold px-4 py-2 rounded-xl transition flex items-center gap-1.5 disabled:opacity-50">
                    <Save className="w-3.5 h-3.5" />
                    <span>{isUpdatePending ? 'جاري الحفظ...' : 'حفظ التغييرات'}</span>
                  </button>
                </div>

                {profile?.profileImageUrl && (
                  <div className="flex items-center gap-4">
                    <img src={profile.profileImageUrl} alt="" className="w-20 h-20 rounded-2xl object-cover border border-amber-100" />
                    <div>
                      <p className="text-xs font-bold text-stone-900">صورة الملف الشخصي</p>
                      <p className="text-[10px] text-stone-500">JPEG, PNG, WebP - حد أقصى 5 ميجا</p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-stone-600 block">الاسم الكامل</label>
                    <input {...register('fullName')} className="w-full p-3 text-xs border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-orange-500" />
                    {errors.fullName && <p className="text-[10px] text-red-600">{errors.fullName.message}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-stone-600 block">الجنس</label>
                    <select {...register('gender')} className="w-full p-3 text-xs border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-orange-500">
                      <option value="">غير محدد</option>
                      <option value="Male">ذكر</option>
                      <option value="Female">أنثى</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-stone-600 block">تاريخ الميلاد</label>
                    <input type="date" {...register('dateOfBirth')} className="w-full p-3 text-xs border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-orange-500" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-stone-600 block">الجنسية</label>
                    <input {...register('nationality')} className="w-full p-3 text-xs border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-orange-500" placeholder="مثال: سعودي" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-stone-600 block">النبذة التعريفية</label>
                  <textarea {...register('bio')} rows={3} className="w-full p-3 text-xs border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-orange-500 resize-none" placeholder="اكتب نبذة مختصرة عنك..." />
                </div>

                <div className="text-[10px] text-stone-400 pt-2 border-t border-stone-100">
                  <p>البريد الإلكتروني: {profile?.email ?? 'غير محدد'}</p>
                  <p>تاريخ الانضمام: {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('ar-EG') : 'غير محدد'}</p>
                </div>
              </form>
            )}

            {activeTab === 'phones' && (
              <div className="bg-white rounded-3xl border border-amber-200/80 p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-4 border-b border-amber-100">
                  <h2 className="text-sm font-extrabold text-stone-900">أرقام الجوال</h2>
                  <button onClick={() => setIsAddingPhone(true)} className="bg-orange-700 hover:bg-orange-800 text-amber-50 text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1">
                    <Plus className="w-3.5 h-3.5" /><span>إضافة رقم</span>
                  </button>
                </div>

                {isAddingPhone && (
                  <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 flex gap-3 items-end">
                    <div className="flex-1 space-y-1">
                      <label className="text-[10px] font-bold text-stone-600 block">رقم الجوال</label>
                      <input value={newPhoneNumber} onChange={(e) => setNewPhoneNumber(e.target.value)} placeholder="+966 5X XXX XXXX" className="w-full p-2.5 text-xs border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-orange-500" />
                    </div>
                    <button onClick={handleAddPhone} className="bg-orange-700 text-amber-50 text-xs font-bold px-4 py-2.5 rounded-xl">حفظ</button>
                    <button onClick={() => { setIsAddingPhone(false); setNewPhoneNumber(''); }} className="bg-stone-100 text-stone-600 text-xs font-bold px-4 py-2.5 rounded-xl">إلغاء</button>
                  </div>
                )}

                <div className="space-y-3">
                  {phones.length === 0 ? (
                    <p className="text-center text-stone-400 text-xs py-6">لا توجد أرقام مسجلة</p>
                  ) : (
                    phones.map((phone) => (
                      <div key={phone.id} className="flex items-center justify-between p-4 bg-stone-50 border border-stone-200 rounded-2xl">
                        <div className="flex items-center gap-3">
                          <Phone className="w-4 h-4 text-stone-400" />
                          <div>
                            <p className="text-xs font-bold text-stone-900 font-mono">{phone.phoneNumber}</p>
                            <p className="text-[10px] text-stone-500">{phone.type === 'Primary' ? 'رئيسي' : 'ثانوي'}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {phone.isDefault && <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />}
                          {!phone.isDefault && (
                            <button onClick={() => handleSetDefaultPhone(Number(phone.id))} className="text-[10px] text-orange-700 hover:underline">تعيين كافتراضي</button>
                          )}
                          <button onClick={() => handleDeletePhone(phone.id)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {activeTab === 'addresses' && (
              <div className="bg-white rounded-3xl border border-amber-200/80 p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-4 border-b border-amber-100">
                  <h2 className="text-sm font-extrabold text-stone-900">عناوين الشحن</h2>
                  <button onClick={() => setIsAddingAddress(true)} className="bg-orange-700 hover:bg-orange-800 text-amber-50 text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1">
                    <Plus className="w-3.5 h-3.5" /><span>إضافة عنوان</span>
                  </button>
                </div>

                {isAddingAddress && (
                  <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <input value={newAddress.streetLine1} onChange={(e) => setNewAddress({ ...newAddress, streetLine1: e.target.value })} placeholder="الشارع" className="p-2.5 text-xs border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-orange-500" />
                      <input value={newAddress.city} onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })} placeholder="المدينة" className="p-2.5 text-xs border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-orange-500" />
                      <input value={newAddress.postalCode} onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })} placeholder="الرمز البريدي" className="p-2.5 text-xs border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-orange-500" />
                      <input value={newAddress.country} onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })} placeholder="الدولة" className="p-2.5 text-xs border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-orange-500" />
                    </div>
                    <div className="flex gap-2">
                      <button onClick={handleAddAddress} className="bg-orange-700 text-amber-50 text-xs font-bold px-4 py-2 rounded-xl">حفظ</button>
                      <button onClick={() => { setIsAddingAddress(false); setNewAddress({ streetLine1: '', city: '', postalCode: '', country: '' }); }} className="bg-stone-100 text-stone-600 text-xs font-bold px-4 py-2 rounded-xl">إلغاء</button>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  {addresses.length === 0 ? (
                    <p className="text-center text-stone-400 text-xs py-6">لا توجد عناوين مسجلة</p>
                  ) : (
                    addresses.map((addr) => (
                      <div key={addr.id} className="flex items-center justify-between p-4 bg-stone-50 border border-stone-200 rounded-2xl">
                        <div className="flex items-center gap-3">
                          <MapPin className="w-4 h-4 text-stone-400" />
                          <div>
                            <p className="text-xs font-bold text-stone-900">{addr.streetLine1}, {addr.city}</p>
                            <p className="text-[10px] text-stone-500">{addr.country} - {addr.postalCode}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {addr.isDefault && <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />}
                          {!addr.isDefault && (
                            <button onClick={() => handleSetDefaultAddress(addr.id)} className="text-[10px] text-orange-700 hover:underline">تعيين كافتراضي</button>
                          )}
                          <button onClick={() => handleDeleteAddress(addr.id)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="bg-white rounded-3xl border border-amber-200/80 p-6 shadow-sm space-y-6">
                <div className="pb-4 border-b border-amber-100">
                  <h2 className="text-sm font-extrabold text-stone-900">الأمان وكلمة المرور</h2>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-stone-50 border border-stone-200 rounded-2xl">
                    <Lock className="w-5 h-5 text-stone-400" />
                    <div className="flex-1">
                      <p className="text-xs font-bold text-stone-900">كلمة المرور</p>
                      <p className="text-[10px] text-stone-500">آخر تغيير: غير معروف</p>
                    </div>
                    <button className="text-[10px] text-orange-700 font-bold hover:underline">تغيير كلمة المرور</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
