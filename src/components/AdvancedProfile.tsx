import React, { useState } from 'react';
import { 
  Camera, 
  Phone, 
  MapPin, 
  Trash2, 
  Smartphone, 
  LogOut, 
  Star, 
  Key, 
  Plus, 
  X, 
  Home, 
  ShieldAlert,
  Save,
  CheckCircle,
  Laptop
} from 'lucide-react';

interface PhoneItem {
  id: string;
  number: string;
  isDefault: boolean;
  label: string;
}

interface AddressItem {
  id: string;
  city: string;
  addressLine: string;
  isDefault: boolean;
  label: string;
}

interface AuthSession {
  id: string;
  device: string;
  os: string;
  browser: string;
  location: string;
  lastActive: string;
  isCurrent: boolean;
}

interface AdvancedProfileProps {
  userName: string;
  onTriggerToast: (msg: string) => void;
}

export default function AdvancedProfile({ userName: initialUserName, onTriggerToast }: AdvancedProfileProps) {
  const [activeSubTab, setActiveSubTab] = useState<'info' | 'contacts' | 'security'>('info');
  
  // 1. Personal Info states
  const [fullName, setFullName] = useState<string>(initialUserName);
  const [bio, setBio] = useState<string>(
    'طالب علم مهتم بنظم القوافي الأثرية ودرس العمارة وجدران المساجد القديمة.'
  );
  const [avatarUrl, setAvatarUrl] = useState<string>(
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
  );

  // 2. Contacts & Phones states
  const [phones, setPhones] = useState<PhoneItem[]>([
    { id: 'p_1', number: '+966 50 123 4567', isDefault: true, label: 'رقم الجوال الأساسي (WhatsApp)' },
    { id: 'p_2', number: '+966 53 987 6543', isDefault: false, label: 'رقم هاتف المنزل أو الطوارئ' }
  ]);
  const [newPhoneNum, setNewPhoneNum] = useState<string>('');
  const [newPhoneLabel, setNewPhoneLabel] = useState<string>('');
  const [showAddPhone, setShowAddPhone] = useState<boolean>(false);

  // 3. Address states
  const [addresses, setAddresses] = useState<AddressItem[]>([
    { id: 'addr_1', city: 'الرياض', addressLine: 'حي العليا، شارع التخصصي الرقم ٤٢', isDefault: true, label: 'موقع السكن الأساسي' },
    { id: 'addr_2', city: 'المدينة المنورة', addressLine: 'منطقة الحرم الشريف المعظم، قرب بوابات الدعم الأثري', isDefault: false, label: 'العنوان البحثي البديل' }
  ]);
  const [newCity, setNewCity] = useState<string>('');
  const [newAddressLine, setNewAddressLine] = useState<string>('');
  const [newAddrLabel, setNewAddrLabel] = useState<string>('');
  const [showAddAddress, setShowAddAddress] = useState<boolean>(false);

  // 4. Password states
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  // 5. Active Sessions state (Simulating GET /api/auth/sessions)
  const [sessions, setSessions] = useState<AuthSession[]>([
    { id: 'sess_1', device: 'Windows Desktop', os: 'Windows 11', browser: 'Chrome', location: 'الرياض، المملكة العربية السعودية', lastActive: 'نشط الآن (الجلسة الحالية)', isCurrent: true },
    { id: 'sess_2', device: 'Apple iPhone', os: 'iOS 17.2', browser: 'Safari Mobile', location: 'مكة المكرمة، السعودية', lastActive: 'منذ ١ ساعة', isCurrent: false },
    { id: 'sess_3', device: 'Samsung Galaxy', os: 'Android 14', browser: 'Chrome Mobile', location: 'المدينة المنورة، السعودية', lastActive: 'قبل يومين', isCurrent: false }
  ]);

  // Profile Picture simulation
  const handleAvatarChange = () => {
    // Cycles between 3 realistic placeholder faces
    const presets = [
      'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80',
      'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=150&q=80',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80'
    ];
    const nextIndex = (presets.indexOf(avatarUrl) + 1) % presets.length;
    setAvatarUrl(presets[nextIndex] || presets[0]);
    onTriggerToast('✓ تم محاكاة رفع الصورة الشخصية وتوليد ختم الصورة المعتمد بنجاح من الملحقات 📸');
  };

  // Safe phone list updates
  const handleAddPhone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhoneNum.trim()) return;
    const item: PhoneItem = {
      id: 'p_' + Date.now(),
      number: newPhoneNum,
      isDefault: phones.length === 0,
      label: newPhoneLabel.trim() || 'رقم جوال إضافي'
    };
    setPhones([...phones, item]);
    setNewPhoneNum('');
    setNewPhoneLabel('');
    setShowAddPhone(false);
    onTriggerToast('✓ تم إلحاق رقم الهاتف الجديد بمسودة ملفك بنجاح.');
  };

  const handleDeletePhone = (id: string, isDefault: boolean) => {
    if (isDefault && phones.length > 1) {
      onTriggerToast('❌ لا يمكن حذف الجوال الافتراضي، يرجى تعيين رقم آخر كافتراضي أولاً.');
      return;
    }
    setPhones(phones.filter(p => p.id !== id));
    onTriggerToast('✓ تم حذف رقم الهاتف المختار من السجل.');
  };

  const handleMakePhoneDefault = (id: string) => {
    setPhones(phones.map(p => ({
      ...p,
      isDefault: p.id === id
    })));
    onTriggerToast('★ تم تعيين الجوال الأساسي لتلقي تنبيهات التحقق وبث المحاضرات.');
  };

  // Address list updates  
  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCity.trim() || !newAddressLine.trim()) return;
    const item: AddressItem = {
      id: 'addr_' + Date.now(),
      city: newCity,
      addressLine: newAddressLine,
      isDefault: addresses.length === 0,
      label: newAddrLabel.trim() || 'عنوان مراسلات جديد'
    };
    setAddresses([...addresses, item]);
    setNewCity('');
    setNewAddressLine('');
    setNewAddrLabel('');
    setShowAddAddress(false);
    onTriggerToast('✓ تم إضافة العنوان الجديد لسجل الدارس بالمنصة.');
  };

  const handleDeleteAddress = (id: string, isDefault: boolean) => {
    if (isDefault && addresses.length > 1) {
      onTriggerToast('❌ لا يمكن حذف العنوان الافتراضي للمطابقة الفورية.');
      return;
    }
    setAddresses(addresses.filter(a => a.id !== id));
    onTriggerToast('✓ تم تفتيت وحذف العنوان بنجاح.');
  };

  const handleMakeAddressDefault = (id: string) => {
    setAddresses(addresses.map(a => ({
      ...a,
      isDefault: a.id === id
    })));
    onTriggerToast('★ تم تعيين العنوان كافتراضي لتوصيل الإسنادات المطبوعة والشهادات الورقية.');
  };

  // Password submission
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      onTriggerToast('❌ يرجى ملء كافة حقول كلمة المرور.');
      return;
    }
    if (newPassword !== confirmPassword) {
      onTriggerToast('❌ فحص التطابق فشل! كلمة المرور الجديدة وتأكيدها غير متطابقتين.');
      return;
    }
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    onTriggerToast('🔒 تم تغيير كلمة المرور وتحديث شهادة التشفير الخاصة بمسار حسابك مجاناً!');
  };

  // Session termination
  const handleTerminateSession = (id: string) => {
    setSessions(sessions.filter(s => s.id !== id));
    onTriggerToast('✓ تم إنهاء الجلسة التفاعلية للجهاز المختار وتسليمه ورقة الخروج.');
  };

  const handleTerminateAllSessions = () => {
    // Keeps only current session
    setSessions(sessions.filter(s => s.isCurrent));
    onTriggerToast('🛑 تم تسجيل الخروج فوراً من جميع الأجهزة النشطة الأخرى بنجاح ومصادقتها.');
  };

  const handleSavePersonalInfo = () => {
    onTriggerToast('✓ تم حفظ المعلومات الشخصية والبيوغرافيا بنجاح في دليل منصة آثاري.');
  };

  return (
    <div className="bg-amber-50/20 rounded-3xl border border-amber-200/85 p-4 sm:p-6 text-right font-sans flex flex-col md:flex-row gap-6 min-h-[580px]" id="advanced-profile-settings">
      
      {/* Settings Navigation Right Sidebar */}
      <div className="w-full md:w-64 bg-white border border-amber-100 rounded-2xl p-3 shrink-0 flex flex-col gap-1 h-fit shadow-xs">
        <div className="p-3 border-b border-stone-50 text-right">
          <h3 className="font-extrabold text-[#962D15] text-xs sm:text-sm font-serif">ضبط الحساب والمطابقة</h3>
          <p className="text-[10px] text-stone-400 mt-0.5">شؤون الأمان ومطابقة بيانات الهوية والموثوقية</p>
        </div>

        <button
          onClick={() => setActiveSubTab('info')}
          className={`w-full text-right px-4 py-3 rounded-xl text-xs font-black transition border-0 cursor-pointer flex items-center gap-2 mt-2 ${
            activeSubTab === 'info' 
              ? 'bg-orange-700 text-amber-50' 
              : 'bg-stone-50 hover:bg-amber-50 text-stone-700'
          }`}
        >
          <Camera className="w-4 h-4" />
          <span>المعلومات والبيان التعريفي</span>
        </button>

        <button
          onClick={() => setActiveSubTab('contacts')}
          className={`w-full text-right px-4 py-3 rounded-xl text-xs font-black transition border-0 cursor-pointer flex items-center gap-2 ${
            activeSubTab === 'contacts' 
              ? 'bg-orange-700 text-amber-50' 
              : 'bg-stone-50 hover:bg-amber-50 text-stone-700'
          }`}
        >
          <Phone className="w-4 h-4" />
          <span>جهات الاتصال ومراكز العناوين</span>
        </button>

        <button
          onClick={() => setActiveSubTab('security')}
          className={`w-full text-right px-4 py-3 rounded-xl text-xs font-black transition border-0 cursor-pointer flex items-center gap-2 ${
            activeSubTab === 'security' 
              ? 'bg-orange-700 text-amber-50' 
              : 'bg-stone-50 hover:bg-amber-50 text-stone-700'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>حصن الأمان وجلسات الأجهزة</span>
        </button>
      </div>

      {/* Settings Main Form Area */}
      <div className="flex-1 bg-white border border-amber-100 rounded-2xl p-5 sm:p-6 shadow-xs">
        
        {/* TAB 1: PERSONAL INFO */}
        {activeSubTab === 'info' && (
          <div className="space-y-6">
            <div className="border-b border-stone-100 pb-3">
              <h3 className="text-sm sm:text-base font-extrabold text-[#962D15] font-serif">البيانات الشرفية والتاريخية</h3>
              <p className="text-[11px] text-stone-550 mt-1">المعلومات العلمية والاسم الذي يُدوَّن في وثائق النجاح والإجازات.</p>
            </div>

            {/* Avatar upload center */}
            <div className="flex flex-col sm:flex-row items-center gap-5 bg-amber-50/10 p-4 border border-dashed border-amber-200 rounded-2xl">
              <div className="relative group cursor-pointer" onClick={handleAvatarChange} title="تغيير الصورة الشرفية">
                <img 
                  src={avatarUrl} 
                  alt={fullName} 
                  className="w-20 h-20 rounded-full border-2 border-orange-700 object-cover shadow"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-stone-900/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-200">
                  <Camera className="w-5 h-5 text-amber-50" />
                </div>
              </div>

              <div className="text-center sm:text-right space-y-1">
                <h4 className="font-extrabold text-xs text-stone-900">الصورة الشرفية للباحث</h4>
                <p className="text-[10px] text-stone-500 font-light leading-relaxed">
                  يقبل الصيغ الشائعة JPG و PNG. يوصى بملف مربع وبحد أقصى ٢ ميجابايت من البث ليكون الختم ناصع الألوان بالشهادات الورقية.
                </p>
                <button
                  onClick={handleAvatarChange}
                  className="mt-1 text-orange-780 hover:text-orange-900 font-black text-[10px] hover:underline bg-transparent border-0 cursor-pointer block"
                >
                  انقر هنا لتعديل أو توليد وجه عينة 📸
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-1 text-right">
                <label className="text-xs font-bold text-stone-700 block">الاسم الشريف بالكامل</label>
                <input 
                  type="text" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="مثال: أحمد بن معز التميمي"
                  className="w-full bg-stone-50 text-stone-900 text-xs py-3 px-4 rounded-xl border border-amber-200 focus:outline-none focus:ring-1 focus:ring-orange-700 font-semibold"
                />
                <span className="text-[9px] text-stone-400 block pr-1">مهم جداً: تطابق هذا الحقل بالاسم الرباعي لإجازات التحقيق القديمة والمشافهات.</span>
              </div>

              <div className="space-y-1 text-right">
                <label className="text-xs font-bold text-stone-700 block">السيرة والبيان العلمي (Bio)</label>
                <textarea 
                  rows={4}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="اكتب نبذة تراثية أو علمية عن اهتمامك..."
                  className="w-full bg-stone-50 text-stone-900 text-xs py-3 px-4 rounded-xl border border-amber-200 focus:outline-none focus:ring-1 focus:ring-orange-700 leading-relaxed"
                />
                <span className="text-[9px] text-stone-400 block pr-1">تظهر السيرة المعرفية للمعلمين والمنسقين عند التناقش بالمجالس.</span>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-100 flex justify-end">
              <button
                onClick={handleSavePersonalInfo}
                className="bg-orange-700 hover:bg-orange-850 text-amber-50 font-black py-3 px-6 rounded-xl text-xs transition shadow-sm border-0 cursor-pointer flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                <span>حفظ التعديلات العلمية والشخصية</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: CONTACTS & ADDRESSES */}
        {activeSubTab === 'contacts' && (
          <div className="space-y-6">
            <div className="border-b border-stone-100 pb-3">
              <h3 className="text-sm sm:text-base font-extrabold text-[#962D15] font-serif font-serif">جهات الاتصال وسجلات العناوين</h3>
              <p className="text-[11px] text-stone-550 mt-1">تلقي تنبيهات الغرف الصوتية، واستلام شهادات الفضة والذهب من خدمة شحن الورق البريدي.</p>
            </div>

            {/* PHONES SECTION */}
            <div className="space-y-3">
              <div className="flex justify-between items-center bg-amber-50/10 p-2.5 border border-amber-200/50 rounded-xl">
                <span className="font-extrabold text-xs text-[#962D15] flex items-center gap-1.5">
                  <Phone className="w-4 h-4 text-orange-700" />
                  <span>طابور أرقام الجوال المسجلة</span>
                </span>
                <button
                  onClick={() => setShowAddPhone(!showAddPhone)}
                  className="bg-orange-700 hover:bg-orange-850 text-white font-black text-[10px] py-1.5 px-3 rounded-lg flex items-center gap-1 transition-all border-0 cursor-pointer"
                >
                  {showAddPhone ? <X className="w-3" /> : <Plus className="w-3" />}
                  <span>{showAddPhone ? 'إلغاء' : 'إضافة هاتف'}</span>
                </button>
              </div>

              {showAddPhone && (
                <form onSubmit={handleAddPhone} className="p-4 bg-stone-50 border border-amber-200/50 rounded-2xl space-y-3 animate-slide-down">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-stone-700 block">رقم الهاتف الشريف</label>
                      <input 
                        type="text" 
                        required
                        value={newPhoneNum}
                        onChange={(e) => setNewPhoneNum(e.target.value)}
                        placeholder="+966 5x xxx xxxx"
                        className="w-full bg-white text-stone-900 text-xs py-2.5 px-3 rounded-lg border border-amber-200 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-stone-700 block">وصف أو وسم الرقم</label>
                      <input 
                        type="text" 
                        value={newPhoneLabel}
                        onChange={(e) => setNewPhoneLabel(e.target.value)}
                        placeholder="مثال: رقم الوكيل أو الهاتف البديل"
                        className="w-full bg-white text-stone-900 text-xs py-2.5 px-3 rounded-lg border border-amber-200 focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="submit"
                      className="bg-orange-700 hover:bg-orange-850 text-white text-[10px] font-black px-4 py-2 rounded-lg cursor-pointer border-0"
                    >
                      إضافة الرقم لمسودات الاتصال
                    </button>
                  </div>
                </form>
              )}

              <div className="space-y-2">
                {phones.map((p) => (
                  <div key={p.id} className="p-3 bg-white border border-stone-200 rounded-xl flex items-center justify-between text-right">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${p.isDefault ? 'bg-orange-100 text-orange-900' : 'bg-stone-50 text-stone-400'}`}>
                        <Phone className="w-4 h-4" />
                      </div>
                      <div className="space-y-0.5">
                        <span className="font-extrabold text-xs text-stone-900 block">{p.number}</span>
                        <span className="text-[10px] text-stone-500 font-light block">{p.label}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleMakePhoneDefault(p.id)}
                        className={`p-2 rounded-lg transition border-0 cursor-pointer ${
                          p.isDefault ? 'text-amber-500' : 'text-stone-300 hover:text-amber-500 bg-stone-50'
                        }`}
                        title={p.isDefault ? 'الجوال الافتراضي للمصادقة' : 'تعيين كاساسي'}
                      >
                        <Star className="w-4 h-4 fill-current" />
                      </button>
                      
                      <button
                        onClick={() => handleDeletePhone(p.id, p.isDefault)}
                        className="p-2 text-stone-300 hover:text-red-700 hover:bg-red-50 rounded-lg transition border-0 cursor-pointer"
                        title="حذف الرقم"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ADDRESSES SECTION */}
            <div className="space-y-3 pt-4">
              <div className="flex justify-between items-center bg-amber-50/10 p-2.5 border border-amber-200/50 rounded-xl">
                <span className="font-extrabold text-xs text-[#962D15] flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-orange-700" />
                  <span>عناوين الاستلام والبريد الأثري</span>
                </span>
                <button
                  onClick={() => setShowAddAddress(!showAddAddress)}
                  className="bg-orange-700 hover:bg-orange-850 text-white font-black text-[10px] py-1.5 px-3 rounded-lg flex items-center gap-1 transition-all border-0 cursor-pointer"
                >
                  {showAddAddress ? <X className="w-3" /> : <Plus className="w-3" />}
                  <span>{showAddAddress ? 'إلغاء' : 'إضافة عنوان'}</span>
                </button>
              </div>

              {showAddAddress && (
                <form onSubmit={handleAddAddress} className="p-4 bg-stone-50 border border-amber-200/50 rounded-2xl space-y-3 animate-slide-down">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-stone-700 block">البلد والمدينة</label>
                      <input 
                        type="text" 
                        required
                        value={newCity}
                        onChange={(e) => setNewCity(e.target.value)}
                        placeholder="مثال: الرياض"
                        className="w-full bg-white text-stone-900 text-xs py-2.5 px-3 rounded-lg border border-amber-200 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-[10px] font-bold text-stone-700 block">تفصيل الزقاق أو العمارة</label>
                      <input 
                        type="text" 
                        required
                        value={newAddressLine}
                        onChange={(e) => setNewAddressLine(e.target.value)}
                        placeholder="حي العليا، شارع التخصصي الرقم ٤٢"
                        className="w-full bg-white text-stone-900 text-xs py-2.5 px-3 rounded-lg border border-amber-200 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1 sm:col-span-3">
                      <label className="text-[10px] font-bold text-stone-700 block">وسم العنوان وملاحظات التوصيل</label>
                      <input 
                        type="text" 
                        value={newAddrLabel}
                        onChange={(e) => setNewAddrLabel(e.target.value)}
                        placeholder="مثال: عنوان السكن الكلاسيكي للتجميع"
                        className="w-full bg-white text-stone-900 text-xs py-2.5 px-3 rounded-lg border border-amber-200 focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="submit"
                      className="bg-orange-700 hover:bg-orange-850 text-white text-[10px] font-black px-4 py-2 rounded-lg cursor-pointer border-0"
                    >
                      إعتماد عنوان الشحن
                    </button>
                  </div>
                </form>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {addresses.map((a) => (
                  <div 
                    key={a.id} 
                    className={`p-4 bg-white border rounded-2xl flex flex-col justify-between text-right transition ${
                      a.isDefault ? 'border-orange-700 shadow-2xs' : 'border-stone-200'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className={`text-[9px] px-2.5 py-0.5 rounded-full font-black ${
                          a.isDefault ? 'bg-orange-100 text-orange-900' : 'bg-stone-100 text-stone-600'
                        }`}>
                          {a.label}
                        </span>
                        
                        {a.isDefault && (
                          <span className="text-[9px] text-teal-850 font-black">✓ افتراضي للتوصيل</span>
                        )}
                      </div>

                      <div className="space-y-1 pt-1">
                        <h4 className="font-extrabold text-xs text-stone-900 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-orange-750" />
                          <span>{a.city}</span>
                        </h4>
                        <p className="text-[11px] text-stone-500 font-light leading-relaxed">{a.addressLine}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-4 mt-2 border-t border-stone-50">
                      <button
                        onClick={() => handleMakeAddressDefault(a.id)}
                        className={`text-[9px] font-extrabold px-2.5 py-1 rounded transition border-0 cursor-pointer ${
                          a.isDefault 
                            ? 'text-stone-400 bg-transparent cursor-default' 
                            : 'text-orange-755 bg-orange-50 hover:bg-orange-100'
                        }`}
                        disabled={a.isDefault}
                      >
                        {a.isDefault ? 'مثبت حالياً' : 'جعله كعنوان شحن أساسي'}
                      </button>

                      <button
                        onClick={() => handleDeleteAddress(a.id, a.isDefault)}
                        className="text-stone-300 hover:text-red-700 p-1 rounded hover:bg-red-50 transition border-0 cursor-pointer"
                        title="حذف العنوان"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB 3: SECURITY & SESSIONS */}
        {activeSubTab === 'security' && (
          <div className="space-y-6 animate-fade-in">
            <div className="border-b border-stone-100 pb-3">
              <h3 className="text-sm sm:text-base font-extrabold text-[#962D15] font-serif">حصن أمان البوابة والجلسات النشطة</h3>
              <p className="text-[11px] text-stone-550 mt-1">إعادة تهيئة كلمة السر، وتتبع تسجيل الدخول للأجهزة لمنع تسريب علوم الإجازات.</p>
            </div>

            {/* Change password Form */}
            <form onSubmit={handlePasswordSubmit} className="space-y-4 bg-stone-50/50 p-4 rounded-2xl border border-stone-200/80">
              <h4 className="font-extrabold text-xs text-stone-900 flex items-center gap-2">
                <Key className="w-4 h-4 text-orange-700 font-serif" />
                <span>تبديل كلمة المرور الحائطة</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-stone-700 block">الرمز الحالي</label>
                  <input 
                    type="password" 
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white text-stone-900 text-xs py-2.5 px-3 rounded-lg border border-amber-200 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-stone-700 block">شفرة المرور الجديدة</label>
                  <input 
                    type="password" 
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="حد أدنى ٨ رموز"
                    className="w-full bg-white text-stone-900 text-xs py-2.5 px-3 rounded-lg border border-amber-200 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-stone-700 block">إعادة تأكيد الشفرة</label>
                  <input 
                    type="password" 
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="تأكيد الشفرة الموقرة"
                    className="w-full bg-white text-stone-900 text-xs py-2.5 px-3 rounded-lg border border-amber-200 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="bg-orange-700 hover:bg-orange-850 text-white font-black text-[10px] py-2 px-5 rounded-lg border-0 cursor-pointer shadow-xs transition"
                >
                  تعيين وتأكيد تشفير بوابة الحساب
                </button>
              </div>
            </form>

            {/* ACTIVE SESSIONS LIST (Simulating GET /api/auth/sessions) */}
            <div className="space-y-4 pt-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-amber-50/15 p-3.5 border border-amber-200/50 rounded-xl">
                <div>
                  <h4 className="font-extrabold text-xs text-[#962D15] flex items-center gap-1.5">
                    <Laptop className="w-4 h-4 text-orange-700" />
                    <span>الجلسات النشطة حالياً (Active Audits)</span>
                  </h4>
                  <p className="text-[10px] text-stone-500 mt-0.5">تفويضات الدخول الحالية المعتمدة باسمك مع تعيين نظام تشغيل المتصفح.</p>
                </div>

                {sessions.length > 1 && (
                  <button
                    onClick={handleTerminateAllSessions}
                    className="bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 font-extrabold text-[10px] py-1.5 px-3 rounded-lg transition shrink-0 cursor-pointer"
                  >
                    تسجيل الخروج من كافة الأجهزة الأخرى 🛑
                  </button>
                )}
              </div>

              {/* Session cards */}
              <div className="space-y-2.5">
                {sessions.map((sess) => (
                  <div 
                    key={sess.id} 
                    className={`p-3.5 rounded-xl border flex items-center justify-between text-right transition-all duration-300 ${
                      sess.isCurrent 
                        ? 'border-orange-200 bg-orange-50/10 shadow-3xs' 
                        : 'border-stone-150 bg-white hover:bg-stone-50/40'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${sess.isCurrent ? 'bg-orange-100 text-orange-950' : 'bg-stone-100 text-stone-500'}`}>
                        {sess.device.includes('iPhone') || sess.device.includes('Galaxy') ? (
                          <Smartphone className="w-4.5 h-4.5" />
                        ) : (
                          <Laptop className="w-4.5 h-4.5" />
                        )}
                      </div>

                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-xs text-stone-900">{sess.device} ({sess.os})</span>
                          {sess.isCurrent && (
                            <span className="text-[8px] bg-emerald-100 text-emerald-800 font-black px-2 py-0.5 rounded">الجلسة الحالية</span>
                          )}
                        </div>
                        <p className="text-[10px] text-stone-500 leading-none">توقيع المستعرض: {sess.browser} • بموقع: {sess.location}</p>
                        <span className="text-[9px] text-stone-400 font-sans font-medium block">توقيت الحركة الحرة: {sess.lastActive}</span>
                      </div>
                    </div>

                    {!sess.isCurrent && (
                      <button
                        onClick={() => handleTerminateSession(sess.id)}
                        className="p-2 text-stone-400 hover:text-red-700 hover:bg-red-50 rounded-lg transition border-0 cursor-pointer flex items-center gap-1 text-[10px] font-bold"
                        title="إنهاء الجلسة المع معرفية"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">إنهاء الجلسة</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>

    </div>
  );
}
