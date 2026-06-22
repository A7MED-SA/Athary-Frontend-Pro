import React, { useState, useEffect } from 'react';
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
  Pencil, 
  X,
  Lock,
  Smartphone,
  Laptop,
  Globe,
  AlertCircle,
  Bell,
  Calendar
} from 'lucide-react';

interface PhoneItem {
  id: string;
  number: string;
  isDefault: boolean;
  label: string;
}

interface AddressItem {
  id: string;
  title: string;
  addressLine: string;
  isDefault: boolean;
}

interface AuthSession {
  id: string;
  device: string;
  browser: string;
  location: string;
  lastActive: string;
  isCurrent: boolean;
}

interface ProfileSettingsProps {
  onBackToMain: () => void;
  userName: string;
  userEmail?: string;
  onUpdateUserName: (name: string) => void;
  onTriggerToast: (msg: string) => void;
}

type SettingsTab = 'personal' | 'phones' | 'addresses' | 'security' | 'notifications';

export default function ProfileSettings({
  onBackToMain,
  userName,
  userEmail = 'ahmedmelk32@gmail.com',
  onUpdateUserName,
  onTriggerToast
}: ProfileSettingsProps) {
  const [activeTab, setActiveTab] = useState<SettingsTab>('personal');
  
  // Autosave Status: 'idle' | 'saving' | 'saved'
  const [autosaveStatus, setAutosaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [isFirstRender, setIsFirstRender] = useState(true);

  // 1. Personal Info states (loaded with localStorage fallback for deep persistence confidence)
  const [fullName, setFullName] = useState<string>(() => {
    return localStorage.getItem('athari_fullName') || userName;
  });
  const [bio, setBio] = useState<string>(() => {
    return localStorage.getItem('athari_bio') || 'باحث ومحب للمخطوطات والآثار الإسلامية القديمة والعمارة التراثية الشريفة.';
  });
  const [avatarUrl, setAvatarUrl] = useState<string>(() => {
    return localStorage.getItem('athari_avatarUrl') || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80';
  });
  
  // Advanced Public Profile fields (matching registration)
  const [firstName, setFirstName] = useState<string>(() => {
    const reg = localStorage.getItem('athari_registered_user');
    if (reg) {
      try { return JSON.parse(reg).firstName || ''; } catch(_) {}
    }
    return localStorage.getItem('athari_firstName') || 'أحمد';
  });
  const [lastName, setLastName] = useState<string>(() => {
    const reg = localStorage.getItem('athari_registered_user');
    if (reg) {
      try { return JSON.parse(reg).lastName || ''; } catch(_) {}
    }
    return localStorage.getItem('athari_lastName') || 'التميمي';
  });
  const [gender, setGender] = useState<string>(() => {
    const reg = localStorage.getItem('athari_registered_user');
    if (reg) {
      try { return JSON.parse(reg).gender || ''; } catch(_) {}
    }
    return localStorage.getItem('athari_gender') || 'male';
  });
  const [dob, setDob] = useState<string>(() => {
    const reg = localStorage.getItem('athari_registered_user');
    if (reg) {
      try { return JSON.parse(reg).dob || ''; } catch(_) {}
    }
    return localStorage.getItem('athari_dob') || '1995-04-12';
  });
  const [country, setCountry] = useState<string>(() => {
    const reg = localStorage.getItem('athari_registered_user');
    if (reg) {
      try { return JSON.parse(reg).country || ''; } catch(_) {}
    }
    return localStorage.getItem('athari_country') || 'المملكة العربية السعودية';
  });
  const [city, setCity] = useState<string>(() => {
    const reg = localStorage.getItem('athari_registered_user');
    if (reg) {
      try { return JSON.parse(reg).city || ''; } catch(_) {}
    }
    return localStorage.getItem('athari_city') || 'الرياض';
  });
  const [streetLine1, setStreetLine1] = useState<string>(() => {
    const reg = localStorage.getItem('athari_registered_user');
    if (reg) {
      try { return JSON.parse(reg).streetLine1 || ''; } catch(_) {}
    }
    return localStorage.getItem('athari_streetLine1') || 'الملز، طريق صلاح الدين';
  });
  const [postalCode, setPostalCode] = useState<string>(() => {
    const reg = localStorage.getItem('athari_registered_user');
    if (reg) {
      try { return JSON.parse(reg).postalCode || ''; } catch(_) {}
    }
    return localStorage.getItem('athari_postalCode') || '11564';
  });

  // Notification Preferences states
  const [notifSmsLive, setNotifSmsLive] = useState<boolean>(() => {
    return localStorage.getItem('athari_notif_smsLive') !== 'false';
  });
  const [notifEmailManuscript, setNotifEmailManuscript] = useState<boolean>(() => {
    return localStorage.getItem('athari_notif_emailManuscript') !== 'false';
  });
  const [notifPushAnnouncements, setNotifPushAnnouncements] = useState<boolean>(() => {
    return localStorage.getItem('athari_notif_pushAnnouncements') !== 'false';
  });
  const [notifWeeklyDigest, setNotifWeeklyDigest] = useState<boolean>(() => {
    return localStorage.getItem('athari_notif_weeklyDigest') === 'true';
  });

  const [isLoadingPicture, setIsLoadingPicture] = useState<boolean>(false);
  const [uploadStep, setUploadStep] = useState<number>(0); 
  
  // validation error simulation for ApiResponse shape
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // 2. Phones list state (custom persist)
  const [phones, setPhones] = useState<PhoneItem[]>(() => {
    const cached = localStorage.getItem('athari_phones');
    return cached ? JSON.parse(cached) : [
      { id: 'ph-1', number: '+966 50 123 4567', isDefault: true, label: 'رقم الجوال الشخصي الرسمي' },
      { id: 'ph-2', number: '+966 11 405 9290', isDefault: false, label: 'رقم مكتب عمادة حائل للأبحاث' }
    ];
  });
  const [isAddingPhone, setIsAddingPhone] = useState(false);
  const [newPhone, setNewPhone] = useState('');
  const [newPhoneLabel, setNewPhoneLabel] = useState('');

  // Real-time automatic form validation effect
  useEffect(() => {
    const errors: Record<string, string> = {};

    if (firstName.trim().length === 0) {
      errors.firstName = 'الاسم الأول مطلوب ولا يمكن حفظه فارغاً.';
    } else if (firstName.length > 100) {
      errors.firstName = 'الاسم الأول يجب ألا يتجاوز ١٠٠ حرفاً.';
    }

    if (lastName.trim().length === 0) {
      errors.lastName = 'اسم العائلة مطلوب ولا يمكن حفظه فارغاً.';
    } else if (lastName.length > 100) {
      errors.lastName = 'اسم العائلة يجب ألا يتجاوز ١٠٠ حرفاً.';
    }

    if (fullName.trim().length < 5) {
      errors.fullName = 'الاسم الكامل يجب ألا يقل عن ٥ أحرف كحد أدنى للإجازات العلمية.';
    }

    if (postalCode && !/^[a-zA-Z0-9\s-]{4,10}$/.test(postalCode)) {
      errors.postalCode = 'الرمز البريدي يجب أن يتكون من ٤ إلى ١٠ حروف أو أرقام.';
    }

    if (isAddingPhone && newPhone) {
      if (!/^\+?[0-9\s-]{7,16}$/.test(newPhone)) {
        errors.newPhone = 'رقم الجوال الشريف المدخل غير صالح (يرجى توفير أرقام فقط).';
      }
    }

    setValidationErrors(errors);
  }, [firstName, lastName, fullName, postalCode, isAddingPhone, newPhone]);

  // 3. Addresses list state (custom persist)
  const [addresses, setAddresses] = useState<AddressItem[]>(() => {
    const cached = localStorage.getItem('athari_addresses');
    return cached ? JSON.parse(cached) : [
      { id: 'add-1', title: 'سكن الرياض الأساسي', addressLine: 'حي السفارات، بناية الأوركيد الرقم ٣، الرياض، المملكة العربية السعودية', isDefault: true },
      { id: 'add-2', title: 'مكتب المدينة المنورة', addressLine: 'بجوار المسجد النبوي الشريف، مركز البحوث التاريخية، المدينة المنورة', isDefault: false }
    ];
  });
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [editingAddress, setEditingAddress] = useState<AddressItem | null>(null);
  const [newAddrTitle, setNewAddrTitle] = useState('');
  const [newAddrLine, setNewAddrLine] = useState('');

  // Automated Autosave Side-Effect to localStorage
  useEffect(() => {
    if (isFirstRender) {
      setIsFirstRender(false);
      return;
    }

    setAutosaveStatus('saving');

    try {
      localStorage.setItem('athari_fullName', fullName);
      localStorage.setItem('athari_bio', bio);
      localStorage.setItem('athari_avatarUrl', avatarUrl);
      localStorage.setItem('athari_phones', JSON.stringify(phones));
      localStorage.setItem('athari_addresses', JSON.stringify(addresses));

      // Extra fields
      localStorage.setItem('athari_firstName', firstName);
      localStorage.setItem('athari_lastName', lastName);
      localStorage.setItem('athari_gender', gender);
      localStorage.setItem('athari_dob', dob);
      localStorage.setItem('athari_country', country);
      localStorage.setItem('athari_city', city);
      localStorage.setItem('athari_streetLine1', streetLine1);
      localStorage.setItem('athari_postalCode', postalCode);

      // Notification settings
      localStorage.setItem('athari_notif_smsLive', String(notifSmsLive));
      localStorage.setItem('athari_notif_emailManuscript', String(notifEmailManuscript));
      localStorage.setItem('athari_notif_pushAnnouncements', String(notifPushAnnouncements));
      localStorage.setItem('athari_notif_weeklyDigest', String(notifWeeklyDigest));

      // Bubble up name updates to upper modules
      if (fullName.trim() && fullName.length >= 5) {
        onUpdateUserName(fullName);
      }
    } catch (err) {
      console.error('Error auto-syncing to local storage:', err);
    }

    const timer = setTimeout(() => {
      setAutosaveStatus('saved');
    }, 1200);

    return () => clearTimeout(timer);
  }, [
    fullName, bio, avatarUrl, phones, addresses,
    firstName, lastName, gender, dob, country, city, streetLine1, postalCode,
    notifSmsLive, notifEmailManuscript, notifPushAnnouncements, notifWeeklyDigest
  ]);

  // 4. Security states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Auth sessions
  const [sessions, setSessions] = useState<AuthSession[]>([
    { id: 'sess-1', device: 'Windows PC', browser: 'Chrome 125.0', location: 'الرياض، السعودية', lastActive: 'نشط الآن', isCurrent: true },
    { id: 'sess-2', device: 'iPhone 15 Pro', browser: 'Safari 17.2', location: 'مكة المكرمة، السعودية', lastActive: 'منذ ٣ ساعات', isCurrent: false }
  ]);

  // Handle picture change via MinIO 2-Step Upload simulation
  const handlePictureUploadSimulation = () => {
    setIsLoadingPicture(true);
    setUploadStep(1); // Call POST /api/media/upload-url

    setTimeout(() => {
      setUploadStep(2); // Uploading to MinIO directly using URL
      onTriggerToast('⚡ الخطوة الأولى: تم طلب رابط التحميل من MinIO للنوع ProfilePicture...');
      
      setTimeout(() => {
        setUploadStep(3); // POST /api/media/confirm-upload with fileId
        onTriggerToast('🔄 الخطوة الثانية: جاري النقل السحابي الخادم لقنوات الأرشيف...');

        setTimeout(() => {
          setUploadStep(4); // POST /api/profile/picture
          setAvatarUrl('https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80');
          setIsLoadingPicture(false);
          setUploadStep(0);
          onTriggerToast('✅ تم تأكيد النقل المزدوج وحفظ رابط الصورة الرسمية بنجاح!');
        }, 1200);
      }, 1000);
    }, 800);
  };

  const handleRemovePicture = () => {
    setAvatarUrl('');
    onTriggerToast('🗑️ تم إزالة الصورة الشخصية من السجلات.');
  };

  // 1. Personal Info Save
  const handleSavePersonalInfo = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check automatic validation errors first
    if (firstName.trim().length === 0) {
      onTriggerToast('❌ يرجى ملء الاسم الأول لتأكيد الحفظ الشرفي.');
      return;
    }
    if (lastName.trim().length === 0) {
      onTriggerToast('❌ يرجى ملء اسم العائلة لتأكيد الحفظ الشرفي.');
    }
    if (fullName.trim().length < 5) {
      onTriggerToast('❌ الاسم الكامل المقترح قصير جداً ولا يطابق معايير الإجازات.');
      return;
    }
    if (postalCode && !/^[a-zA-Z0-9\s-]{4,10}$/.test(postalCode)) {
      onTriggerToast('❌ الرمز البريدي غير صالح. يجب أن يحتوي من ٤ إلى ١٠ أحرف أو أرقام.');
      return;
    }

    onUpdateUserName(fullName);
    onTriggerToast('🎉 تم ترحيل التعديلات الطوعية وتحديث نموذج IdentityUser بنجاح!');
  };

  // Optimistic UI updates for Phones
  const handleSetPhoneDefault = (phoneId: string) => {
    // Instantly switch in UI (Optimistic UI Pattern)
    const originalPhones = [...phones];
    setPhones(prev => prev.map(p => ({
      ...p,
      isDefault: p.id === phoneId
    })));
    onTriggerToast('⭐ تم تغيير رقم الجوال الافتراضي للمراسلة الفورية فوراً!');

    // Simulated API call PUT /api/profile/phones/{phoneId}/default
    setTimeout(() => {
      console.log(`API confirmed default status for phone ${phoneId}`);
    }, 500);
  };

  const handleAddPhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhone.trim()) return;

    if (validationErrors.newPhone) {
      onTriggerToast('❌ ' + validationErrors.newPhone);
      return;
    }
    
    const isFirst = phones.length === 0;
    const item: PhoneItem = {
      id: 'ph-' + Date.now(),
      number: newPhone,
      isDefault: isFirst,
      label: newPhoneLabel.trim() || 'رقم هاتف إضافي'
    };

    setPhones([...phones, item]);
    setNewPhone('');
    setNewPhoneLabel('');
    setIsAddingPhone(false);
    onTriggerToast('✓ تم إضافة رقم الهاتف الجديد وسيتلقى إشعار تأكيد SMS.');
  };

  const handleDeletePhone = (phoneId: string) => {
    const item = phones.find(p => p.id === phoneId);
    if (item?.isDefault) {
      onTriggerToast('⚠️ لا يمكن حذف رقم المراسلة الافتراضي. يرجى اختيار بديل أولا.');
      return;
    }
    setPhones(phones.filter(p => p.id !== phoneId));
    onTriggerToast('🗑️ تم حذف رقم الهاتف من سجل الحساب.');
  };

  // Optimistic UI updates for Addresses
  const handleSetAddressDefault = (addrId: string) => {
    setAddresses(prev => prev.map(a => ({
      ...a,
      isDefault: a.id === addrId
    })));
    onTriggerToast('⭐ تم تعيين عنوان الشحن الافتراضي بنجاح (تحديث فوري)!');
  };

  const handleAddAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddrTitle.trim() || !newAddrLine.trim()) {
      onTriggerToast('❌ يرجى ملء كافة تفاصيل العنوان.');
      return;
    }

    const item: AddressItem = {
      id: 'add-' + Date.now(),
      title: newAddrTitle,
      addressLine: newAddrLine,
      isDefault: addresses.length === 0
    };

    setAddresses([...addresses, item]);
    setNewAddrTitle('');
    setNewAddrLine('');
    setIsAddingAddress(false);
    onTriggerToast('✓ تم تدبيج العنوان الجديد في سجل المراسلات المعتمدة.');
  };

  const handleUpdateAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAddress) return;

    setAddresses(addresses.map(a => a.id === editingAddress.id ? editingAddress : a));
    setEditingAddress(null);
    onTriggerToast('✓ تم تحديث وتصويب تفاصيل العنوان المالي.');
  };

  const handleDeleteAddress = (addrId: string) => {
    const item = addresses.find(a => a.id === addrId);
    if (item?.isDefault) {
      onTriggerToast('⚠️ يرجى ترك عنوان الشحن الافتراضي أو استبداله قبل الحذف.');
      return;
    }
    setAddresses(addresses.filter(a => a.id !== addrId));
    onTriggerToast('🗑️ تم إقصاء العنوان من نظام الشحن الأثري.');
  };

  // Password reset simulation
  const handlePasswordReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      onTriggerToast('⚠️ يرجى تعمير كافة الخانات لتحديث القفل الشفري.');
      return;
    }
    if (newPassword !== confirmPassword) {
      onTriggerToast('❌ فحص المطابقة فشل! الرموز الجديدة غير متطابقة.');
      return;
    }

    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    onTriggerToast('🔒 تم تغيير شفرة المرور وتشفير سجل الدارس بالكامل بنجاح!');
  };

  // Terminate session
  const handleTerminateSession = (sessId: string) => {
    setSessions(sessions.filter(s => s.id !== sessId));
    onTriggerToast('✓ تم إلغاء توقيع تفويض الجهاز المختار.');
  };

  return (
    <div className="min-h-screen bg-stone-50 font-sans selection:bg-orange-200 selection:text-orange-950 pb-20 pt-6" id="profile-settings-layout" dir="rtl">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Navigation Breadcrumb & Premium Autosave indicator */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 bg-white py-3 px-5 rounded-2xl border border-stone-200/50 shadow-xs">
          <div className="flex items-center gap-2 text-stone-550 text-xs">
            <span className="hover:text-stone-900 cursor-pointer text-stone-500 font-semibold" onClick={onBackToMain}>الرئيسية</span>
            <span className="text-stone-300">/</span>
            <span className="text-orange-950 font-black">إعدادات الحساب</span>
          </div>

          {/* Glowing Autosave state */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-stone-50 border border-amber-200/40 text-[10px] font-extrabold text-stone-700 animate-fade-in">
            <div className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              autosaveStatus === 'saving' ? 'bg-orange-600 animate-ping' :
              autosaveStatus === 'saved' ? 'bg-emerald-600 animate-bounce' : 'bg-orange-600/80'
            }`} />
            <span>
              {autosaveStatus === 'saving' ? (
                <span className="text-orange-700 font-bold">جاري المزامنة والحفظ التلقائي... ⚡</span>
              ) : autosaveStatus === 'saved' ? (
                <span className="text-emerald-700 font-bold">تم تأمين وحفظ التغيرات في الذاكرة المحلية (localStorage) ✓</span>
              ) : (
                <span className="text-stone-500">حالة الاتصال: كامل تعديلاتك الطوعية تحفظ تلقائياً 🛡️</span>
              )}
            </span>
          </div>
        </div>

        {/* 1. LAYOUT: TWO COLLEGE COLUMNS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Right Sidebar (Navigation & Info Card) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Core Vertical Navigation Menu */}
            <div className="bg-white rounded-3xl border border-stone-250/60 p-4 shadow-sm">
              <div className="p-3 border-b border-stone-100 mb-2">
                <h2 className="text-xs font-black text-orange-950 font-serif tracking-tight">إعدادات البوابة الشريفة</h2>
                <p className="text-[10px] text-stone-400 mt-1">إدارة معلومات الباحث وأمان الحساب</p>
              </div>

              {/* Responsive container for mobile vertical scrollable tab bar */}
              <nav className="flex flex-row lg:flex-col overflow-x-auto gap-1 pb-2 lg:pb-0 scrollbar-none">
                
                <button
                  onClick={() => setActiveTab('personal')}
                  className={`w-full text-right px-4.5 py-3 rounded-2xl text-xs font-black transition border-0 cursor-pointer flex items-center gap-3 shrink-0 ${
                    activeTab === 'personal'
                      ? 'bg-orange-700 text-amber-50 shadow-xs'
                      : 'text-stone-600 hover:bg-stone-55 hover:bg-stone-100 bg-transparent'
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>المعلومات الشخصية</span>
                </button>

                <button
                  onClick={() => setActiveTab('phones')}
                  className={`w-full text-right px-4.5 py-3 rounded-2xl text-xs font-black transition border-0 cursor-pointer flex items-center gap-3 shrink-0 ${
                    activeTab === 'phones'
                      ? 'bg-orange-700 text-amber-50 shadow-xs'
                      : 'text-stone-600 hover:bg-stone-55 hover:bg-stone-100 bg-transparent'
                  }`}
                >
                  <Phone className="w-4 h-4" />
                  <span>أرقام الهواتف</span>
                </button>

                <button
                  onClick={() => setActiveTab('addresses')}
                  className={`w-full text-right px-4.5 py-3 rounded-2xl text-xs font-black transition border-0 cursor-pointer flex items-center gap-3 shrink-0 ${
                    activeTab === 'addresses'
                      ? 'bg-orange-700 text-amber-50 shadow-xs'
                      : 'text-stone-600 hover:bg-stone-55 hover:bg-stone-100 bg-transparent'
                  }`}
                >
                  <MapPin className="w-4 h-4" />
                  <span>العناوين المسجلة</span>
                </button>

                <button
                  onClick={() => setActiveTab('security')}
                  className={`w-full text-right px-4.5 py-3 rounded-2xl text-xs font-black transition border-0 cursor-pointer flex items-center gap-3 shrink-0 ${
                    activeTab === 'security'
                      ? 'bg-orange-700 text-amber-50 shadow-xs shadow-orange-950/20'
                      : 'text-stone-600 hover:bg-stone-55 hover:bg-stone-100 bg-transparent'
                  }`}
                >
                  <Shield className="w-4 h-4" />
                  <span>الأمان والجلسات</span>
                </button>

                <button
                  onClick={() => setActiveTab('notifications')}
                  className={`w-full text-right px-4.5 py-3 rounded-2xl text-xs font-black transition border-0 cursor-pointer flex items-center gap-3 shrink-0 ${
                    activeTab === 'notifications'
                      ? 'bg-orange-700 text-amber-50 shadow-xs shadow-orange-950/20'
                      : 'text-stone-600 hover:bg-stone-55 hover:bg-stone-100 bg-transparent'
                  }`}
                >
                  <Bell className="w-4 h-4" />
                  <span>تفضيلات الإشعارات</span>
                </button>

                <div className="h-0.5 bg-stone-100 my-2 hidden lg:block" />

                <button
                  onClick={onBackToMain}
                  className="w-full text-right px-4.5 py-3 rounded-2xl text-xs font-extrabold text-orange-900 hover:bg-amber-50 bg-transparent transition border-0 cursor-pointer flex items-center gap-3 shrink-0"
                >
                  <ArrowRight className="w-4 h-4 text-orange-700" />
                  <span>العودة للرئيسية</span>
                </button>

              </nav>
            </div>

            {/* Quick Vintage Fact Box */}
            <div className="bg-orange-50/20 rounded-3xl border border-stone-200 p-5 text-right space-y-2">
              <span className="text-[10px] text-orange-700 font-extrabold">ميثاق التوطين والسيادة</span>
              <h3 className="text-xs font-black text-stone-900 font-serif leading-snug">رأس مال معرفي آمن</h3>
              <p className="text-[11px] text-stone-500 leading-relaxed font-light">
                تعتمد منصة آثاري على تشفير المفاتيح المزدوج وتخزين المرفقات المباشرة عبر مستودعاتنا الوطنية لضمان عدم تسريب الإجازات والأقراص العلمية.
              </p>
            </div>

          </div>

          {/* Left Main Area: Active tab container */}
          <div className="lg:col-span-8 bg-white rounded-3xl border border-stone-250/60 shadow-sm p-6 sm:p-8">
            
            {/* HEADER BOX */}
            <div className="border-b border-stone-150 pb-4 mb-6 text-right">
              <h1 className="text-base sm:text-lg font-black text-orange-950 font-serif leading-none">
                {activeTab === 'personal' && 'المعلومات الشخصية والبيان التعريفي'}
                {activeTab === 'phones' && 'كابينة أرقام الجوال والمراسلة'}
                {activeTab === 'addresses' && 'عناوين شحن وتنسيب الإجازات'}
                {activeTab === 'security' && 'حصن حماية الحساب وسجلات الجلسات'}
                {activeTab === 'notifications' && 'إدارة تفضيلات الإشعارات والتنبيهات'}
              </h1>
              <p className="text-xs text-stone-550 mt-1 leading-relaxed">
                {activeTab === 'personal' && 'قم بضبط اسمك وتفاصيل ملفك الشخصي بدقة لتطابق فحص الشهادات التراكمية وسيرتك المعرفية.'}
                {activeTab === 'phones' && 'أرقام جوال مضافة وقنوات سحب التحقق الثنائي لضمان استلام إشعارات البث.'}
                {activeTab === 'addresses' && 'عناوين بريدية معتمدة تضمن وصول شهاداتك الذهبية الفاخرة للعنوان الصحيح.'}
                {activeTab === 'security' && 'سجلات الأوقات النشطة وتفويضات الدخول لجميع عتادك وحواسبك الشخصية.'}
                {activeTab === 'notifications' && 'تحكم في كيفية ومواعيد إشعارك بقنوات البث المباشر، المراجعات، والأخبار الأكاديمية.'}
              </p>
            </div>

            {/* CONTENT MODULES */}

            {/* TAB 1: PERSONAL INFO */}
            {activeTab === 'personal' && (
              <div className="space-y-6">
                
                {/* Avatar section with smart feedback */}
                <div className="bg-orange-50/20 p-5 rounded-2xl border border-stone-200">
                  <div className="relative w-[120px] h-[120px] rounded-full shrink-0 bg-stone-200 border-2 border-orange-700/80 overflow-hidden shadow">
                    {avatarUrl ? (
                      <img 
                        src={avatarUrl} 
                        alt="الملف الشخصي" 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-stone-500 font-serif text-3xl font-black bg-stone-100">
                        {fullName.slice(0, 2)}
                      </div>
                    )}

                    {isLoadingPicture && (
                      <div className="absolute inset-0 bg-stone-900/80 flex flex-col items-center justify-center text-amber-50 text-[10px] p-2 text-center">
                        <span className="animate-spin text-orange-500 text-lg">⏳</span>
                        <span className="mt-1 font-bold">جاري الرفع... {uploadStep}/4</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3 text-center sm:text-right flex-1">
                    <h3 className="text-xs font-black text-stone-900 block">الصورة الشرفية والأثرية</h3>
                    <p className="text-[11px] text-stone-400 leading-normal">
                      تتكامل الواجهة مع GET/PUT /api/profile/picture عبر ترحيل مرحلي مزدوج لقنوات التخزين لـ MinIO.
                    </p>
                    
                    <div className="flex flex-wrap justify-center sm:justify-start gap-3">
                      <button
                        type="button"
                        onClick={handlePictureUploadSimulation}
                        disabled={isLoadingPicture}
                        className="bg-orange-700 hover:bg-orange-850 text-amber-50 text-xs font-black py-2 px-4 rounded-xl shadow-xs transition border-0 cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>تغيير الصورة</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleRemovePicture}
                        className="text-red-700 hover:text-red-900 bg-red-50 hover:bg-red-100 text-xs font-black py-2 px-4 rounded-xl transition border-0 cursor-pointer flex items-center gap-1.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>حذف الصورة</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Info Text form */}
                <form onSubmit={handleSavePersonalInfo} className="space-y-6">
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-stone-900 block">الاسم الأول</label>
                      <input 
                        type="text"
                        maxLength={100}
                        className={`w-full bg-stone-50 p-3 text-xs text-stone-950 border rounded-xl focus:outline-none focus:bg-white focus:border-orange-700 font-semibold ${
                          validationErrors.firstName ? 'border-red-500 ring-2 ring-red-100' : 'border-stone-250/80'
                        }`}
                        value={firstName}
                        onChange={(e) => {
                          setFirstName(e.target.value);
                          setFullName(`${e.target.value} ${lastName}`);
                        }}
                        placeholder="أحمد"
                      />
                      {validationErrors.firstName && (
                        <p className="text-[10px] text-red-650 text-red-600 font-bold mt-1">⚠️ {validationErrors.firstName}</p>
                      )}
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-stone-900 block">اسم العائلة</label>
                      <input 
                        type="text"
                        maxLength={100}
                        className={`w-full bg-stone-50 p-3 text-xs text-stone-950 border rounded-xl focus:outline-none focus:bg-white focus:border-orange-700 font-semibold ${
                          validationErrors.lastName ? 'border-red-500 ring-2 ring-red-100' : 'border-stone-250/80'
                        }`}
                        value={lastName}
                        onChange={(e) => {
                          setLastName(e.target.value);
                          setFullName(`${firstName} ${e.target.value}`);
                        }}
                        placeholder="التميمي"
                      />
                      {validationErrors.lastName && (
                        <p className="text-[10px] text-red-650 text-red-600 font-bold mt-1">⚠️ {validationErrors.lastName}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-900 block font-serif">الاسم الكامل الشريف (المسجل بالإجازات)</label>
                    <input 
                      type="text"
                      className={`w-full bg-stone-100 p-3 text-xs text-stone-900 border rounded-xl focus:outline-none font-bold ${
                        validationErrors.fullName ? 'border-red-700 ring-1 ring-red-400' : 'border-stone-250/80'
                      }`}
                      value={fullName}
                      onChange={(e) => {
                        setFullName(e.target.value);
                        if (validationErrors.fullName) setValidationErrors({});
                      }}
                      placeholder="أحمد بن معز التميمي..."
                    />
                    
                    {validationErrors.fullName && (
                      <p className="text-[11px] text-red-700 font-bold flex items-center gap-1 animate-pulse mt-1">
                        <AlertCircle className="w-3.5 h-3.5 text-red-700 shrink-0" />
                        <span>{validationErrors.fullName}</span>
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-stone-900 block">الجنس</label>
                      <select
                        className="w-full bg-stone-50 p-3 text-xs text-stone-950 border border-stone-250/80 rounded-xl focus:outline-none focus:bg-white focus:border-orange-700"
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                      >
                        <option value="male">ذكر</option>
                        <option value="female">أنثى</option>
                        <option value="prefer_not_to_say">يفضل عدم الإفصاح</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-stone-900 block">تاريخ الميلاد</label>
                      <input 
                        type="date"
                        className="w-full bg-stone-50 p-3 text-xs text-stone-950 border border-stone-250/80 rounded-xl focus:outline-none focus:bg-white focus:border-orange-700 font-mono"
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="h-px bg-stone-100 my-4" />
                  <h3 className="text-xs font-black text-orange-950 font-serif mb-2">معلومات الإقامة والتوصيل المالي</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-stone-900 block">الدولة</label>
                      <div className="relative">
                        <input 
                          type="text"
                          className="w-full bg-stone-50 pr-10 p-3 text-xs text-stone-950 border border-stone-250/80 rounded-xl focus:outline-none focus:bg-white focus:border-orange-700 font-semibold"
                          value={country}
                          onChange={(e) => setCountry(e.target.value)}
                          placeholder="المملكة العربية السعودية..."
                        />
                        <Globe className="w-4 h-4 text-stone-400 absolute right-3.5 top-3.5" />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-stone-900 block">المدينة</label>
                      <div className="relative">
                        <input 
                          type="text"
                          className="w-full bg-stone-50 pr-10 p-3 text-xs text-stone-950 border border-stone-250/80 rounded-xl focus:outline-none focus:bg-white focus:border-orange-700 font-semibold"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="الرياض"
                        />
                        <MapPin className="w-4 h-4 text-stone-400 absolute right-3.5 top-3.5" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-xs font-bold text-stone-900 block">عنوان الشارع والحي (تفصيلي)</label>
                      <input 
                        type="text"
                        className="w-full bg-stone-50 p-3 text-xs text-stone-950 border border-stone-250/80 rounded-xl focus:outline-none focus:bg-white focus:border-orange-700"
                        value={streetLine1}
                        onChange={(e) => setStreetLine1(e.target.value)}
                        placeholder="حي الملز، شارع صلاح الدين الأيوبي..."
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-stone-900 block">الرمز البريدي</label>
                      <input 
                        type="text"
                        className={`w-full bg-stone-50 p-3 text-xs text-stone-950 border rounded-xl focus:outline-none focus:bg-white focus:border-orange-700 font-mono ${
                          validationErrors.postalCode ? 'border-red-500 ring-2 ring-red-100' : 'border-stone-250/80'
                        }`}
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        placeholder="11564"
                      />
                      {validationErrors.postalCode && (
                        <p className="text-[10px] text-red-650 text-red-600 font-bold mt-1">⚠️ {validationErrors.postalCode}</p>
                      )}
                    </div>
                  </div>

                  <div className="h-px bg-stone-100 my-4" />

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-750 block">عنوان البريد الإلكتروني (غير قابل للتعديل)</label>
                    <div className="relative">
                      <input 
                        type="email"
                        disabled
                        className="w-full bg-stone-100 p-3 text-xs text-stone-500 border border-stone-200 rounded-xl cursor-not-allowed font-mono text-left"
                        value={userEmail}
                        dir="ltr"
                      />
                      <span className="absolute top-2.5 right-3 bg-emerald-100 text-emerald-800 text-[10px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-emerald-300">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-700" />
                        <span>مؤكد</span>
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold text-stone-900 block">نبذة تعريفية (Bio)</label>
                      <span className="text-[10px] text-stone-400 font-mono">{bio.length}/500 حرف</span>
                    </div>
                    <textarea 
                      rows={3}
                      className="w-full bg-stone-50 p-3 text-xs text-stone-950 border border-stone-250/80 rounded-xl focus:outline-none focus:bg-white focus:border-orange-700 leading-relaxed font-sans"
                      maxLength={500}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="تحدث بوضوح وتأصيل عن دراستك التراثية العريقة واهتماماتك الميدانية..."
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-stone-100">
                    <button
                      type="button"
                      onClick={onBackToMain}
                      className="bg-stone-100 hover:bg-stone-200 text-stone-600 font-bold py-2.5 px-6 rounded-xl text-xs transition border-0 cursor-pointer"
                    >
                      إلغاء
                    </button>

                    <button
                      type="submit"
                      className="bg-orange-700 hover:bg-orange-850 text-amber-50 font-black py-2.5 px-6 rounded-xl text-xs shadow-sm transition border-0 cursor-pointer flex items-center gap-1.5"
                    >
                      <Save className="w-4 h-4" />
                      <span>حفظ التغييرات</span>
                    </button>
                  </div>
                </form>

              </div>
            )}

            {/* TAB 2: PHONE MANAGEMENT */}
            {activeTab === 'phones' && (
              <div className="space-y-6">
                
                {/* Section Header */}
                <div className="flex justify-between items-center border-b border-stone-100 pb-3">
                  <h3 className="text-xs sm:text-sm font-black text-orange-950 font-serif">إدارة هويات الهواتف المعتمدة</h3>
                  <button
                    onClick={() => setIsAddingPhone(!isAddingPhone)}
                    className="bg-orange-700 hover:bg-orange-850 text-amber-50 text-[11px] py-1.5 px-3 rounded-lg font-black flex items-center gap-1 transition-all border-0 cursor-pointer"
                  >
                    {isAddingPhone ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                    <span>{isAddingPhone ? 'إلغاء' : 'إضافة رقم جديد'}</span>
                  </button>
                </div>

                {isAddingPhone && (
                  <form onSubmit={handleAddPhoneSubmit} className="p-4 bg-stone-50 border border-amber-200/50 rounded-2xl space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-stone-700 block">رقم الهاتف الشريف</label>
                        <input 
                          type="text" 
                          required
                          value={newPhone}
                          onChange={(e) => setNewPhone(e.target.value)}
                          placeholder="+966 5x xxx xxxx"
                          className={`w-full bg-white text-stone-950 text-xs py-2 px-3 rounded-lg border focus:outline-none ${
                            validationErrors.newPhone ? 'border-red-500 ring-2 ring-red-100' : 'border-stone-200'
                          }`}
                        />
                        {validationErrors.newPhone && (
                          <p className="text-[9.5px] text-red-600 font-bold mt-1">⚠️ {validationErrors.newPhone}</p>
                        )}
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-stone-700 block">وصف الرقم</label>
                        <input 
                          type="text" 
                          value={newPhoneLabel}
                          onChange={(e) => setNewPhoneLabel(e.target.value)}
                          placeholder="مثال: رقم الطوارئ أو المنزل"
                          className="w-full bg-white text-stone-950 text-xs py-2 px-3 rounded-lg border border-stone-200 focus:outline-none"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end pt-1">
                      <button
                        type="submit"
                        className="bg-orange-700 hover:bg-orange-850 text-white text-[10px] font-black px-4 py-2 rounded-lg cursor-pointer border-0"
                      >
                        حفظ هاتف المراسلة
                      </button>
                    </div>
                  </form>
                )}

                {/* List of phones card */}
                <div className="space-y-3">
                  {phones.map((p) => (
                    <div key={p.id} className="p-4 bg-stone-50/50 hover:bg-white rounded-2xl border border-stone-200 flex items-center justify-between transition group">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center border-0 ${
                          p.isDefault ? 'bg-orange-100 text-orange-750 dark:bg-orange-950/40 dark:text-orange-400' : 'bg-stone-100 text-stone-400'
                        }`}>
                          <Phone className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-xs font-mono font-black text-stone-900 block" dir="ltr">{p.number}</span>
                          <span className="text-[10px] text-stone-500 font-light block">{p.label}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {p.isDefault ? (
                          <span className="text-[9.5px] font-black bg-amber-100 text-amber-950 py-1 px-2.5 rounded-lg border border-amber-300">
                            افتراضي
                          </span>
                        ) : (
                          <button
                            onClick={() => handleSetPhoneDefault(p.id)}
                            className="bg-transparent hover:bg-orange-50/30 p-2 text-stone-300 hover:text-amber-500 rounded-lg transition border-0 cursor-pointer"
                            title="تعيين كافتراضي"
                          >
                            <Star className="w-4.5 h-4.5" />
                          </button>
                        )}

                        <button
                          onClick={() => handleDeletePhone(p.id)}
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
            )}

            {/* TAB 3: ADDRESSES */}
            {activeTab === 'addresses' && (
              <div className="space-y-6">
                
                {/* Section Header */}
                <div className="flex justify-between items-center border-b border-stone-100 pb-3">
                  <h3 className="text-xs sm:text-sm font-black text-orange-950 font-serif">العناوين المعتمدة لشحن السجلات</h3>
                  <button
                    onClick={() => {
                      setEditingAddress(null);
                      setIsAddingAddress(!isAddingAddress);
                    }}
                    className="bg-orange-700 hover:bg-orange-850 text-amber-50 text-[11px] py-1.5 px-3 rounded-lg font-black flex items-center gap-1 transition-all border-0 cursor-pointer"
                  >
                    {isAddingAddress ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                    <span>{isAddingAddress ? 'إلغاء' : 'إضافة عنوان جديد'}</span>
                  </button>
                </div>

                {isAddingAddress && (
                  <form onSubmit={handleAddAddressSubmit} className="p-4 bg-stone-50 border border-amber-200/50 rounded-2xl space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-stone-700 block">اسم توضيحي (مثال: المنزل)</label>
                        <input 
                          type="text" 
                          required
                          value={newAddrTitle}
                          onChange={(e) => setNewAddrTitle(e.target.value)}
                          placeholder="المنزل، العمل..."
                          className="w-full bg-white text-stone-950 text-xs py-2 px-3 rounded-lg border border-stone-200 focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1 sm:col-span-2">
                        <label className="text-[10px] font-bold text-stone-700 block">العنوان والتفاصيل</label>
                        <input 
                          type="text" 
                          required
                          value={newAddrLine}
                          onChange={(e) => setNewAddrLine(e.target.value)}
                          placeholder="الحي، اسم الشارع، رقم البناية..."
                          className="w-full bg-white text-stone-950 text-xs py-2 px-3 rounded-lg border border-stone-200 focus:outline-none"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end pt-1">
                      <button
                        type="submit"
                        className="bg-orange-700 hover:bg-orange-850 text-white text-[10px] font-black px-4 py-2 rounded-lg cursor-pointer border-0"
                      >
                        حفظ عنوان الشحن
                      </button>
                    </div>
                  </form>
                )}

                {/* Edit Form */}
                {editingAddress && (
                  <form onSubmit={handleUpdateAddressSubmit} className="p-4 bg-amber-50/20 border-2 border-dashed border-amber-200 rounded-2xl space-y-3">
                    <h4 className="text-xs font-black text-stone-900">تعديل وتصحيح تفاصيل العنوان:</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-stone-700 block">اسم توضيحي</label>
                        <input 
                          type="text" 
                          required
                          value={editingAddress.title}
                          onChange={(e) => setEditingAddress({ ...editingAddress, title: e.target.value })}
                          className="w-full bg-white text-stone-950 text-xs py-2 px-3 rounded-lg border border-stone-200 focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1 sm:col-span-2">
                        <label className="text-[10px] font-bold text-stone-700 block">العنوان بالتفصيل</label>
                        <input 
                          type="text" 
                          required
                          value={editingAddress.addressLine}
                          onChange={(e) => setEditingAddress({ ...editingAddress, addressLine: e.target.value })}
                          className="w-full bg-white text-stone-950 text-xs py-2 px-3 rounded-lg border border-stone-200 focus:outline-none"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setEditingAddress(null)}
                        className="bg-stone-100 text-stone-600 text-[10px] font-bold px-3 py-1.5 rounded-lg border-0 cursor-pointer"
                      >
                        إلغاء
                      </button>
                      <button
                        type="submit"
                        className="bg-orange-700 hover:bg-orange-850 text-white text-[10px] font-black px-4 py-1.5 rounded-lg cursor-pointer border-0"
                      >
                        تحديث العنوان
                      </button>
                    </div>
                  </form>
                )}

                {/* List of addresses */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {addresses.map((a) => (
                    <div 
                      key={a.id} 
                      className={`p-4 rounded-2xl border flex flex-col justify-between text-right transition-all duration-300 ${
                        a.isDefault 
                          ? 'border-orange-600 bg-orange-50/20 shadow-2xs' 
                          : 'border-stone-200 bg-white hover:border-stone-400'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-right">
                          <span className="font-black text-xs text-orange-950 font-serif">{a.title}</span>
                          
                          {a.isDefault && (
                            <span className="text-[9px] bg-amber-100 text-amber-950 px-2.5 py-0.5 rounded-full border border-amber-300">
                              الافتراضي للشحن
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-stone-600 leading-relaxed font-light">{a.addressLine}</p>
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-4 mt-3 border-t border-stone-100">
                        {!a.isDefault && (
                          <button
                            onClick={() => handleSetAddressDefault(a.id)}
                            className="text-[10px] text-orange-700 hover:text-orange-850 bg-transparent border-0 cursor-pointer flex items-center gap-1 font-black"
                            title="تعيين كافتراضي"
                          >
                            <Star className="w-3.5 h-3.5 fill-current" />
                            <span>تعيين كافتراضي</span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => setEditingAddress(a)}
                          className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition border-0 cursor-pointer"
                          title="تعديل العنوان"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteAddress(a.id)}
                          className="p-1.5 text-stone-300 hover:text-red-700 hover:bg-red-50 rounded-lg transition border-0 cursor-pointer"
                          title="حذف العنوان"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            )}

            {/* TAB 4: SECURITY & SESSIONS */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                
                {/* Credentials block */}
                <form onSubmit={handlePasswordReset} className="space-y-4 bg-stone-50 border border-stone-200 p-5 rounded-2xl">
                  <h3 className="text-xs font-black text-[#5C230E] font-serif flex items-center gap-2">
                    <Lock className="w-4.5 h-4.5 text-orange-700" />
                    <span>تغيير وثيقة التحقق من البوابة (كلمة المرور)</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-stone-700 block">شفرة المرور الفعالة حالياً</label>
                      <input 
                        type="password"
                        required
                        className="w-full bg-white p-2.5 text-xs text-stone-900 border border-stone-200 rounded-lg focus:outline-none"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="••••••••"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-stone-700 block">الشفرة الجديدة المستهدفة</label>
                      <input 
                        type="password"
                        required
                        className="w-full bg-white p-2.5 text-xs text-stone-900 border border-stone-200 rounded-lg focus:outline-none"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="٨ خانات كحد أدنى..."
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-stone-700 block">تأكيد شفرة المرور الجديدة</label>
                      <input 
                        type="password"
                        required
                        className="w-full bg-white p-2.5 text-xs text-stone-900 border border-stone-200 rounded-lg focus:outline-none"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="إعادة إدخال للتأكيد..."
                      />
                    </div>

                  </div>

                  <div className="flex justify-end pt-1">
                    <button
                      type="submit"
                      className="bg-orange-700 hover:bg-orange-850 text-white text-[11px] font-black py-2 px-5 rounded-lg transition border-0 cursor-pointer shadow-xs"
                    >
                      تبديل شفرة المرور
                    </button>
                  </div>
                </form>

                {/* active session blocks */}
                <div className="space-y-3">
                  <h3 className="text-xs font-black text-[#5C230E] font-serif flex items-center gap-2">
                    <Laptop className="w-4.5 h-4.5 text-orange-700" />
                    <span>الحواسيب والهواتف المتصلة حالياً</span>
                  </h3>

                  <div className="space-y-2.5">
                    {sessions.map((sess) => (
                      <div 
                        key={sess.id} 
                        className={`p-4 rounded-2xl border flex items-center justify-between text-right ${
                          sess.isCurrent ? 'border-orange-500 bg-orange-50/10' : 'border-stone-200 bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2.5 rounded-xl ${sess.isCurrent ? 'bg-orange-100 text-orange-950' : 'bg-stone-150 text-stone-500'}`}>
                            {sess.device.includes('iPhone') ? <Smartphone className="w-4.5 h-4.5" /> : <Laptop className="w-4.5 h-4.5" />}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-extrabold text-xs text-stone-900">{sess.device}</span>
                              {sess.isCurrent && (
                                <span className="text-[8px] bg-emerald-100 text-emerald-800 font-extrabold px-2 py-0.5 rounded">
                                  الجلسة الحالية
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-stone-500 font-light block mt-0.5">{sess.browser} • بموقع: {sess.location}</span>
                            <span className="text-[9px] text-stone-400 font-sans block">{sess.lastActive}</span>
                          </div>
                        </div>

                        {!sess.isCurrent && (
                          <button
                            type="button"
                            onClick={() => handleTerminateSession(sess.id)}
                            className="bg-transparent hover:bg-stone-100 text-stone-500 hover:text-red-700 p-2 rounded-lg transition border-0 cursor-pointer text-xs font-semibold"
                          >
                            إنهاء الجلسة
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* TAB 5: NOTIFICATIONS PREFERENCES */}
            {activeTab === 'notifications' && (
              <div className="space-y-6 animate-fade-in text-right" dir="rtl">
                <div className="bg-orange-50/20 p-4 rounded-2xl border border-stone-200 mb-4 text-right">
                  <span className="text-[11px] font-extrabold text-orange-950">🔔 إشعارات البوابة الشريفة</span>
                  <p className="text-stone-600 text-xs mt-1 leading-relaxed">
                    يتم مزامنة تعديلاتك تلقائياً مع خيوط إشعارات الحساب. تحكم بقنوات الاتصال المفضلة لضمان استلاف تقارير المدرسين والإجازات التراكمية.
                  </p>
                </div>

                <div className="space-y-4">
                  {/* SMS notifications config */}
                  <div className="p-5 bg-stone-50 rounded-2xl border border-stone-250/60 flex items-start justify-between gap-4">
                    <div className="space-y-1 text-right flex-1">
                      <h4 className="text-xs font-black text-stone-900">تنبيهات البث المفتوح والدروس المباشرة (SMS)</h4>
                      <p className="text-[11px] text-stone-500 leading-normal font-light">
                        تلقي رسائل جوال نصية هامة عند بدء المدرس في شرح مخطوط حية لمساعدتك على الحضور الفوري والتعليق.
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer select-none">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={notifSmsLive}
                        onChange={(e) => {
                          setNotifSmsLive(e.target.checked);
                          onTriggerToast(e.target.checked ? '🔔 تم تشغيل تنبيهات البث المباشر الميداني عبر SMS!' : '🔕 تم إيقاف تنبيهات SMS لبث الدروس.');
                        }}
                      />
                      <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-700"></div>
                    </label>
                  </div>

                  {/* Written evaluation email notifications */}
                  <div className="p-5 bg-stone-50 rounded-2xl border border-stone-250/60 flex items-start justify-between gap-4">
                    <div className="space-y-1 text-right flex-1">
                      <h4 className="text-xs font-black text-stone-900">مراجعة وتدبيج المخطوطات والواجبات العلمية (البريد الإلكتروني)</h4>
                      <p className="text-[11px] text-stone-500 leading-normal font-light">
                        تلقي رسالة آلية عبر بريدك المسجل فور قيام أحد الأساتذة بتقييم فرضك المكتوب أو كتابة حواشٍ نقدية عليه.
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer select-none">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={notifEmailManuscript}
                        onChange={(e) => {
                          setNotifEmailManuscript(e.target.checked);
                          onTriggerToast(e.target.checked ? '🔔 تم تغذية قنوات مراجعات المخطوطات الأكاديمية بالبريد!' : '🔕 تم كتم البريد التقييمي للمهام.');
                        }}
                      />
                      <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-700"></div>
                    </label>
                  </div>

                  {/* Public administrative alerts via Webpush */}
                  <div className="p-5 bg-stone-50 rounded-2xl border border-stone-250/60 flex items-start justify-between gap-4">
                    <div className="space-y-1 text-right flex-1">
                      <h4 className="text-xs font-black text-stone-900">إشعار بالمستجدات والقرارات الإدارية العليا (إشارات ويب مدمجة)</h4>
                      <p className="text-[11px] text-stone-500 leading-normal font-light">
                        تنبيهات منبثقة غامرة للأجهزة لقرارات مجلس إدارة الأثر الأكاديمي، بما يشمل تعديلات المناهج الشريفة.
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer select-none">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={notifPushAnnouncements}
                        onChange={(e) => {
                          setNotifPushAnnouncements(e.target.checked);
                          onTriggerToast(e.target.checked ? '🔔 تم تشغيل تنبيه السواري والقرارات الإدارية بنجاح.' : '🔕 تم إلغاء تنبيهات الويب الفوقية للقرارات.');
                        }}
                      />
                      <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-700"></div>
                    </label>
                  </div>

                  {/* Weekly report summary */}
                  <div className="p-5 bg-stone-50 rounded-2xl border border-stone-250/60 flex items-start justify-between gap-4">
                    <div className="space-y-1 text-right flex-1">
                      <h4 className="text-xs font-black text-stone-900">الملخص الأسبوعي للدارس (تقرير قياس الأثر التحليلي)</h4>
                      <p className="text-[11px] text-stone-500 leading-normal font-light">
                        تلقي تقرير شامل في صبيحة كل سبت يوضح كمية استهلاكك للمحاضرات وعدد الساعات التراكمية ومستوى تقدم معدلاتك.
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer select-none">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={notifWeeklyDigest}
                        onChange={(e) => {
                          setNotifWeeklyDigest(e.target.checked);
                          onTriggerToast(e.target.checked ? '🔔 تم تفعيل البريد التلخيصي السبتي التراكمي.' : '🔕 تم إلغاء الملخص الأسبوعي المعرفي.');
                        }}
                      />
                      <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-700"></div>
                    </label>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-stone-100">
                  <button
                    type="button"
                    onClick={onBackToMain}
                    className="bg-stone-100 hover:bg-stone-200 text-stone-600 font-bold py-2.5 px-6 rounded-xl text-xs transition border-0 cursor-pointer"
                  >
                    العودة للرئيسية
                  </button>

                  <button
                    type="button"
                    onClick={() => onTriggerToast('✓ تم تأمين وحفظ كافة تفضيلات الإشعارات والتنبيهات في السجل السحابي!')}
                    className="bg-orange-700 hover:bg-orange-850 text-amber-50 font-black py-2.5 px-6 rounded-xl text-xs shadow-sm transition border-0 cursor-pointer flex items-center gap-1.5"
                  >
                    <Save className="w-4 h-4" />
                    <span>تأكيد الحفظ الرئيسي</span>
                  </button>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
