import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '@/providers/AppProvider';
import { useAuth } from '@/features/common/hooks/useAuth';
import { useProfile } from '@/features/common/hooks/useProfile';
import { useNotificationPreferences } from '@/features/common/hooks/useNotificationPreferences';
import { mediaService } from '@/features/media/services/media.service';
import { DashboardSkeleton } from '@/components/shared/Skeleton';
import { ErrorFallback } from '@/components/shared/ErrorFallback';
import { getErrorMessage } from '@/lib/error-codes';
import { SettingsSidebar } from './components/SettingsSidebar';
import { PersonalInfoTab } from './components/PersonalInfoTab';
import { PhonesTab } from './components/PhonesTab';
import { AddressesTab } from './components/AddressesTab';
import { SecurityTab } from './components/SecurityTab';
import { NotificationsTab } from './components/NotificationsTab';

interface PhoneItem { id: string; number: string; isDefault: boolean; label: string; }
interface AddressItem { id: string; title: string; addressLine: string; isDefault: boolean; }

type SettingsTab = 'personal' | 'phones' | 'addresses' | 'security' | 'notifications';

export default function ProfileSettings() {
  const navigate = useNavigate();
  const { userName, displayToast } = useAppContext();
  const {
    profile, isLoading, error, update, isUpdatePending,
    addPhone, setDefaultPhone, deletePhone,
    addAddress, setDefaultAddress, deleteAddress, updateAddress,
    setProfilePicture, deleteProfilePicture,
  } = useProfile();

  const { sessions, revokeSession, changePassword } = useAuth();
  const { preferences: notifPrefs, updatePreferences: updateNotifPrefs, isUpdatePending: isNotifPending } = useNotificationPreferences();

  const [activeTab, setActiveTab] = useState<SettingsTab>('personal');

  const [autosaveStatus, setAutosaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [isFirstRender, setIsFirstRender] = useState(true);
  const [hasLoadedProfile, setHasLoadedProfile] = useState(false);

  const [fullName, setFullName] = useState<string>(() => localStorage.getItem('athari_fullName') || userName);
  const [bio, setBio] = useState<string>(() => localStorage.getItem('athari_bio') || 'باحث ومحب للمخطوطات والآثار الإسلامية القديمة والعمارة التراثية الشريفة.');
  const [avatarUrl, setAvatarUrl] = useState<string>(() => localStorage.getItem('athari_avatarUrl') || '');

  const [firstName, setFirstName] = useState<string>(() => localStorage.getItem('athari_firstName') || 'أحمد');
  const [lastName, setLastName] = useState<string>(() => localStorage.getItem('athari_lastName') || 'التميمي');
  const [gender, setGender] = useState<string>(() => localStorage.getItem('athari_gender') || 'male');
  const [dob, setDob] = useState<string>(() => localStorage.getItem('athari_dob') || '1995-04-12');
  const [nationality, setNationality] = useState<string>(() => localStorage.getItem('athari_nationality') || 'المملكة العربية السعودية');

  const [notifSmsLive, setNotifSmsLive] = useState<boolean>(true);
  const [notifEmailManuscript, setNotifEmailManuscript] = useState<boolean>(true);
  const [notifPushAnnouncements, setNotifPushAnnouncements] = useState<boolean>(true);
  const [notifWeeklyDigest, setNotifWeeklyDigest] = useState<boolean>(false);

  useEffect(() => {
    if (notifPrefs) {
      setNotifSmsLive(notifPrefs.emailNotifications);
      setNotifEmailManuscript(notifPrefs.courseUpdates);
      setNotifPushAnnouncements(notifPrefs.pushNotifications);
      setNotifWeeklyDigest(notifPrefs.announcementAlerts);
    }
  }, [notifPrefs]);

  const [isLoadingPicture, setIsLoadingPicture] = useState<boolean>(false);
  const [uploadStep, setUploadStep] = useState<number>(0);

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const [isAddingPhone, setIsAddingPhone] = useState(false);
  const [newPhone, setNewPhone] = useState('');
  const [newPhoneType, setNewPhoneType] = useState<'Primary' | 'Secondary'>('Primary');

  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [editingAddress, setEditingAddress] = useState<AddressItem | null>(null);
  const [newAddrTitle, setNewAddrTitle] = useState('');
  const [newAddrLine, setNewAddrLine] = useState('');
  const [newAddrCity, setNewAddrCity] = useState('');
  const [newAddrCountry, setNewAddrCountry] = useState('');
  const [newAddrPostalCode, setNewAddrPostalCode] = useState('');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (profile && !hasLoadedProfile) {
      const nameParts = (profile.fullName || '').split(' ');
      const fName = nameParts[0] || '';
      const lName = nameParts.slice(1).join(' ') || '';
      setFirstName(fName);
      setLastName(lName);
      setFullName(profile.fullName || '');
      setBio(profile.bio || '');
      setAvatarUrl(profile.profileImageUrl || '');
      if (profile.dateOfBirth) setDob(profile.dateOfBirth.split('T')[0]);
      if (profile.gender) setGender(profile.gender.toLowerCase());
      if (profile.nationality) setNationality(profile.nationality);
      setHasLoadedProfile(true);
    }
  }, [profile, hasLoadedProfile]);

  useEffect(() => {
    const errors: Record<string, string> = {};
    if (firstName.trim().length === 0) errors.firstName = 'الاسم الأول مطلوب ولا يمكن حفظه فارغاً.';
    else if (firstName.length > 100) errors.firstName = 'الاسم الأول يجب ألا يتجاوز ١٠٠ حرفاً.';
    if (lastName.trim().length === 0) errors.lastName = 'اسم العائلة مطلوب ولا يمكن حفظه فارغاً.';
    else if (lastName.length > 100) errors.lastName = 'اسم العائلة يجب ألا يتجاوز ١٠٠ حرفاً.';
    if (fullName.trim().length < 5) errors.fullName = 'الاسم الكامل يجب ألا يقل عن ٥ أحرف كحد أدنى للإجازات العلمية.';
    if (isAddingPhone && newPhone) {
      if (!/^\+?[0-9\s-]{7,16}$/.test(newPhone)) errors.newPhone = 'رقم الجوال الشريف المدخل غير صالح (يرجى توفير أرقام فقط).';
    }
    setValidationErrors(errors);
  }, [firstName, lastName, fullName, isAddingPhone, newPhone]);

  useEffect(() => {
    if (isFirstRender) { setIsFirstRender(false); return; }
    setAutosaveStatus('saving');
    try {
      localStorage.setItem('athari_fullName', fullName);
      localStorage.setItem('athari_bio', bio);
      localStorage.setItem('athari_avatarUrl', avatarUrl);
      localStorage.setItem('athari_firstName', firstName);
      localStorage.setItem('athari_lastName', lastName);
      localStorage.setItem('athari_gender', gender);
      localStorage.setItem('athari_dob', dob);
      localStorage.setItem('athari_nationality', nationality);
    } catch (err) { console.error('Error auto-syncing to local storage:', err); }
    const timer = setTimeout(() => setAutosaveStatus('saved'), 1200);
    return () => clearTimeout(timer);
  }, [fullName, bio, avatarUrl, firstName, lastName, gender, dob, nationality, isFirstRender]);

  const handlePictureUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsLoadingPicture(true);
    setUploadStep(1);
    try {
      displayToast('جاري رفع الصورة...');
      const mediaFile = await mediaService.uploadFile(file);
      setUploadStep(4);
      setProfilePicture(mediaFile.id, {
        onSuccess: (res) => { setAvatarUrl(res.data.profileImageUrl || ''); displayToast('تم حفظ الصورة الشخصية بنجاح!'); setIsLoadingPicture(false); setUploadStep(0); },
        onError: (err: unknown) => { displayToast(getErrorMessage(err)); setIsLoadingPicture(false); setUploadStep(0); },
      });
    } catch (err: any) {
      displayToast(err?.message || 'فشل رفع ملف الصورة');
      setIsLoadingPicture(false);
      setUploadStep(0);
    }
  };

  const handleRemovePicture = () => {
    deleteProfilePicture(undefined, {
      onSuccess: () => { setAvatarUrl(''); displayToast('🗑️ تم إزالة الصورة الشخصية من السجلات بنجاح.'); },
      onError: (err: unknown) => displayToast(getErrorMessage(err)),
    });
  };

  const handleSavePersonalInfo = (e: React.FormEvent) => {
    e.preventDefault();
    if (firstName.trim().length === 0) { displayToast('❌ يرجى ملء الاسم الأول لتأكيد الحفظ.'); return; }
    if (lastName.trim().length === 0) { displayToast('❌ يرجى ملء اسم العائلة لتأكيد الحفظ.'); return; }
    if (fullName.trim().length < 5) { displayToast('❌ الاسم الكامل المقترح قصير جداً ولا يطابق معايير الإجازات.'); return; }
    const genderMap: Record<string, 'Male' | 'Female' | 'Other' | 'PreferNotToSay' | undefined> = {
      male: 'Male',
      female: 'Female',
      prefer_not_to_say: 'PreferNotToSay',
      other: 'Other',
    };
    update({
      firstName, lastName, bio,
      gender: genderMap[gender],
      dateOfBirth: dob || undefined, nationality,
    }, {
      onSuccess: () => displayToast('🎉 تم ترحيل التعديلات الطوعية وتحديث سجلات الحساب بنجاح!'),
      onError: (err: unknown) => displayToast(getErrorMessage(err)),
    });
  };

  const handleSetPhoneDefault = (phoneId: string) => {
    setDefaultPhone(phoneId, {
      onSuccess: () => displayToast('⭐ تم تغيير رقم الجوال الافتراضي للمراسلة الفورية فوراً!'),
      onError: (err: unknown) => displayToast(getErrorMessage(err)),
    });
  };

  const handleAddPhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhone.trim()) return;
    if (validationErrors.newPhone) { displayToast('❌ ' + validationErrors.newPhone); return; }
    addPhone({ phoneNumber: newPhone, type: newPhoneType, isDefault: false }, {
      onSuccess: () => { setNewPhone(''); setNewPhoneType('Primary'); setIsAddingPhone(false); displayToast('✓ تم إضافة رقم الهاتف الجديد.'); },
      onError: (err: unknown) => displayToast(getErrorMessage(err)),
    });
  };

  const handleDeletePhone = (phoneId: string) => {
    const item = (profile?.phones || []).find((p: any) => p.id === phoneId);
    if (item?.isDefault) { displayToast('⚠️ لا يمكن حذف رقم المراسلة الافتراضي. يرجى اختيار بديل أولا.'); return; }
    deletePhone(phoneId, {
      onSuccess: () => displayToast('🗑️ تم حذف رقم الهاتف من سجل الحساب.'),
      onError: (err: unknown) => displayToast(getErrorMessage(err)),
    });
  };

  const handleSetAddressDefault = (addrId: string) => {
    setDefaultAddress(addrId, {
      onSuccess: () => displayToast('⭐ تم تعيين عنوان الشحن الافتراضي بنجاح (تحديث فوري)!'),
      onError: (err: unknown) => displayToast(getErrorMessage(err)),
    });
  };

  const handleAddAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddrTitle.trim() || !newAddrLine.trim()) { displayToast('❌ يرجى ملء كافة تفاصيل العنوان.'); return; }
    addAddress({
      type: newAddrTitle, streetLine1: newAddrLine, city: newAddrCity || 'الرياض',
      country: newAddrCountry || 'السعودية', postalCode: newAddrPostalCode || '11564',
    }, {
      onSuccess: () => { setNewAddrTitle(''); setNewAddrLine(''); setNewAddrCity(''); setNewAddrCountry(''); setNewAddrPostalCode(''); setIsAddingAddress(false); displayToast('✓ تم إضافة العنوان الجديد بنجاح.'); },
      onError: (err: unknown) => displayToast(getErrorMessage(err)),
    });
  };

  const handleUpdateAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAddress) return;
    updateAddress({ addressId: editingAddress.id, data: { type: editingAddress.title, streetLine1: editingAddress.addressLine } }, {
      onSuccess: () => { setEditingAddress(null); displayToast('✓ تم تحديث وتصويب تفاصيل العنوان المالي.'); },
      onError: (err: unknown) => displayToast(getErrorMessage(err)),
    });
  };

  const handleDeleteAddress = (addrId: string) => {
    const item = (profile?.addresses || []).find((a: any) => a.id === addrId);
    if (item?.isDefault) { displayToast('⚠️ يرجى ترك عنوان الشحن الافتراضي أو استبداله قبل الحذف.'); return; }
    deleteAddress(addrId, {
      onSuccess: () => displayToast('🗑️ تم إقصاء العنوان من سجل التوصيل المالي.'),
      onError: (err: unknown) => displayToast(getErrorMessage(err)),
    });
  };

  const handlePasswordReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) { displayToast('⚠️ يرجى تعمير كافة الخانات لتحديث القفل الشفري.'); return; }
    if (newPassword !== confirmPassword) { displayToast('❌ فحص المطابقة فشل! الرموز الجديدة غير متطابقة.'); return; }
    changePassword({ currentPassword, newPassword }, {
      onSuccess: () => { setCurrentPassword(''); setNewPassword(''); setConfirmPassword(''); displayToast('🔒 تم تغيير شفرة المرور وتشفير سجل الدارس بالكامل بنجاح!'); },
      onError: (err: unknown) => displayToast(getErrorMessage(err)),
    });
  };

  const handleTerminateSession = (sessId: string) => {
    revokeSession(sessId, {
      onSuccess: () => displayToast('✓ تم إنهاء الجلسة بنجاح'),
      onError: (err: unknown) => displayToast(getErrorMessage(err)),
    });
  };

  const handleSaveNotifPrefs = () => {
    updateNotifPrefs({
      emailNotifications: notifSmsLive,
      pushNotifications: notifPushAnnouncements,
      courseUpdates: notifEmailManuscript,
      announcementAlerts: notifWeeklyDigest,
      marketingEmails: false,
      newMessageAlerts: true,
      liveSessionReminders: true,
      quizReminders: true,
      certificateAchievements: true,
    }, {
      onSuccess: () => displayToast('✓ تم حفظ تفضيلات الإشعارات بنجاح!'),
      onError: (err: unknown) => displayToast(getErrorMessage(err)),
    });
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><DashboardSkeleton /></div>;
  if (error) return <div className="min-h-screen flex items-center justify-center"><ErrorFallback onRetry={() => navigate(0)} /></div>;

  const displayPhones = profile?.phones ?? [];
  const displayAddresses = profile?.addresses ?? [];
  const userEmail = profile?.email ?? 'ahmedmelk32@gmail.com';

  return (
    <div className="min-h-screen bg-stone-50 font-sans selection:bg-orange-200 selection:text-orange-950 pb-20 pt-6" id="profile-settings-layout" dir="rtl">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 bg-white py-3 px-5 rounded-2xl border border-stone-200/50 shadow-xs">
          <div className="flex items-center gap-2 text-stone-500 text-xs">
            <span className="hover:text-stone-900 cursor-pointer font-semibold" onClick={() => navigate(-1)}>الرئيسية</span>
            <span className="text-stone-300">/</span>
            <span className="text-orange-950 font-black">إعدادات الحساب</span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-stone-50 border border-amber-200/40 text-[10px] font-extrabold text-stone-700 animate-fade-in">
            <div className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${autosaveStatus === 'saving' ? 'bg-orange-600 animate-ping' : autosaveStatus === 'saved' ? 'bg-emerald-600 animate-bounce' : 'bg-orange-600/80'}`} />
            <span>
              {autosaveStatus === 'saving' ? <span className="text-orange-700 font-bold">جاري المزامنة والحفظ التلقائي... ⚡</span>
              : autosaveStatus === 'saved' ? <span className="text-emerald-700 font-bold">تم تأمين وحفظ التغيرات في الذاكرة المحلية (localStorage) ✓</span>
              : <span className="text-stone-500">حالة الاتصال: كامل تعديلاتك الطوعية تحفظ تلقائياً 🛡️</span>}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          <div className="lg:col-span-4 space-y-6">
            <SettingsSidebar activeTab={activeTab} onTabChange={setActiveTab} onNavigateBack={() => navigate(-1)} />

            <div className="bg-orange-50/20 rounded-3xl border border-stone-200 p-5 text-right space-y-2">
              <span className="text-[10px] text-orange-700 font-extrabold">ميثاق التوطين والسيادة</span>
              <h3 className="text-xs font-black text-stone-900 font-serif leading-snug">رأس مال معرفي آمن</h3>
              <p className="text-[11px] text-stone-500 leading-relaxed font-light">
                تعتمد منصة آثاري على تشفير المفاتيح المزدوج وتخزين المرفقات المباشرة عبر مستودعاتنا الوطنية لضمان عدم تسريب الإجازات والأقراص العلمية.
              </p>
            </div>
          </div>

          <div className="lg:col-span-8 bg-white rounded-3xl border border-stone-200/60 shadow-sm p-6 sm:p-8">

            <div className="border-b border-stone-100 pb-4 mb-6 text-right">
              <h1 className="text-base sm:text-lg font-black text-orange-950 font-serif leading-none">
                {activeTab === 'personal' && 'المعلومات الشخصية والبيان التعريفي'}
                {activeTab === 'phones' && 'كابينة أرقام الجوال والمراسلة'}
                {activeTab === 'addresses' && 'عناوين شحن وتنسيب الإجازات'}
                {activeTab === 'security' && 'حصن حماية الحساب وسجلات الجلسات'}
                {activeTab === 'notifications' && 'إدارة تفضيلات الإشعارات والتنبيهات'}
              </h1>
              <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                {activeTab === 'personal' && 'قم بضبط اسمك وتفاصيل ملفك الشخصي بدقة لتطابق فحص الشهادات التراكمية وسيرتك المعرفية.'}
                {activeTab === 'phones' && 'أرقام جوال مضافة وقنوات سحب التحقق الثنائي لضمان استلام إشعارات البث.'}
                {activeTab === 'addresses' && 'عناوين بريدية معتمدة تضمن وصول شهاداتك الذهبية الفاخرة للعنوان الصحيح.'}
                {activeTab === 'security' && 'سجلات الأوقات النشطة وتفويضات الدخول لجميع عتادك وحواسبك الشخصية.'}
                {activeTab === 'notifications' && 'تحكم في كيفية ومواعيد إشعارك بقنوات البث المباشر، المراجعات، والأخبار الأكاديمية.'}
              </p>
            </div>

            {activeTab === 'personal' && (
              <PersonalInfoTab
                firstName={firstName} lastName={lastName} fullName={fullName} bio={bio}
                gender={gender} dob={dob} nationality={nationality} avatarUrl={avatarUrl}
                validationErrors={validationErrors} isLoadingPicture={isLoadingPicture}
                uploadStep={uploadStep} isUpdatePending={isUpdatePending} userEmail={userEmail}
                onFirstNameChange={(v) => { setFirstName(v); setFullName(`${v} ${lastName}`); }}
                onLastNameChange={(v) => { setLastName(v); setFullName(`${firstName} ${v}`); }}
                onFullNameChange={setFullName}
                onBioChange={setBio}
                onGenderChange={setGender}
                onDobChange={setDob}
                onNationalityChange={setNationality}
                onPictureUpload={handlePictureUpload}
                onRemovePicture={handleRemovePicture}
                onSave={handleSavePersonalInfo}
                onCancel={() => navigate(-1)}
              />
            )}

            {activeTab === 'phones' && (
              <PhonesTab
                phones={displayPhones}
                isAdding={isAddingPhone}
                newPhone={newPhone}
                newPhoneType={newPhoneType}
                validationErrors={validationErrors}
                onToggleAdd={() => setIsAddingPhone(!isAddingPhone)}
                onNewPhoneChange={setNewPhone}
                onNewPhoneTypeChange={setNewPhoneType}
                onAddSubmit={handleAddPhoneSubmit}
                onSetDefault={handleSetPhoneDefault}
                onDelete={handleDeletePhone}
              />
            )}

            {activeTab === 'addresses' && (
              <AddressesTab
                addresses={displayAddresses}
                isAdding={isAddingAddress}
                editingAddress={editingAddress}
                newAddrTitle={newAddrTitle} newAddrLine={newAddrLine}
                newAddrCity={newAddrCity} newAddrCountry={newAddrCountry} newAddrPostalCode={newAddrPostalCode}
                onToggleAdd={() => { setEditingAddress(null); setIsAddingAddress(!isAddingAddress); }}
                onNewTitleChange={setNewAddrTitle}
                onNewLineChange={setNewAddrLine}
                onNewCityChange={setNewAddrCity}
                onNewCountryChange={setNewAddrCountry}
                onNewPostalChange={setNewAddrPostalCode}
                onAddSubmit={handleAddAddressSubmit}
                onEditStart={(a) => setEditingAddress(a)}
                onEditCancel={() => setEditingAddress(null)}
                onEditSubmit={handleUpdateAddressSubmit}
                onSetDefault={handleSetAddressDefault}
                onDelete={handleDeleteAddress}
              />
            )}

            {activeTab === 'security' && (
              <SecurityTab
                sessions={sessions}
                currentPassword={currentPassword} newPassword={newPassword} confirmPassword={confirmPassword}
                onCurrentPasswordChange={setCurrentPassword}
                onNewPasswordChange={setNewPassword}
                onConfirmPasswordChange={setConfirmPassword}
                onPasswordReset={handlePasswordReset}
                onTerminateSession={handleTerminateSession}
              />
            )}

            {activeTab === 'notifications' && (
              <NotificationsTab
                notifSmsLive={notifSmsLive} notifEmailManuscript={notifEmailManuscript}
                notifPushAnnouncements={notifPushAnnouncements} notifWeeklyDigest={notifWeeklyDigest}
                isNotifPending={isNotifPending}
                onSmsLiveChange={(v) => { setNotifSmsLive(v); displayToast(v ? '🔔 تم تشغيل تنبيهات البث المباشر الميداني عبر SMS!' : '🔕 تم إيقاف تنبيهات SMS لبث الدروس.'); }}
                onEmailManuscriptChange={(v) => { setNotifEmailManuscript(v); displayToast(v ? '🔔 تم تغذية قنوات مراجعات المخطوطات الأكاديمية بالبريد!' : '🔕 تم كتم البريد التقييمي للمهام.'); }}
                onPushAnnouncementsChange={(v) => { setNotifPushAnnouncements(v); displayToast(v ? '🔔 تم تشغيل تنبيه السواري والقرارات الإدارية بنجاح.' : '🔕 تم إلغاء تنبيهات الويب الفوقية للقرارات.'); }}
                onWeeklyDigestChange={(v) => { setNotifWeeklyDigest(v); displayToast(v ? '🔔 تم تفعيل البريد التلخيصي السبتي التراكمي.' : '🔕 تم إلغاء الملخص الأسبوعي المعرفي.'); }}
                onSave={handleSaveNotifPrefs}
                onCancel={() => navigate(-1)}
              />
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
