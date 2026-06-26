const errorMessages: Record<string, string> = {
  INVALID_USER: 'المستخدم غير صالح أو غير موجود في الجلسة الحالية',
  INVALID_SESSION: 'الجلسة غير صالحة، يرجى تسجيل الدخول مرة أخرى',
  USER_NOT_FOUND: 'المستخدم غير موجود أو تم حذفه',
  DUPLICATE_EMAIL: 'البريد الإلكتروني مسجل مسبقاً، يرجى استخدام بريد آخر',
  REGISTRATION_FAILED: 'فشل إنشاء الحساب، يرجى التحقق من صحة البيانات',
  INVALID_CREDENTIALS: 'البريد الإلكتروني أو كلمة المرور غير صحيحة',
  ACCOUNT_LOCKED: 'تم قفل الحساب بسبب محاولات دخول فاشلة متكررة، يرجى الانتظار ١٥ دقيقة ثم المحاولة مرة أخرى',
  ACCOUNT_NOT_ACTIVE: 'الحساب غير نشط، يرجى تأكيد البريد الإلكتروني أولاً',
  ACCOUNT_NO_LONGER_ACTIVE: 'تم إلغاء تنشيط هذا الحساب، يرجى التواصل مع الدعم',
  INVALID_REFRESH_TOKEN: 'انتهت صلاحية الجلسة، يرجى تسجيل الدخول مرة أخرى',
  SESSION_VALIDATION_FAILED: 'تعذر التحقق من الجلسة، يرجى تسجيل الدخول مرة أخرى',
  SESSION_NOT_FOUND: 'الجلسة غير موجودة أو تم إنهاؤها',
  EMAIL_ALREADY_VERIFIED: 'البريد الإلكتروني مؤكد مسبقاً، يمكنك تسجيل الدخول مباشرة',
  INVALID_OR_EXPIRED_OTP: 'رمز التحقق غير صالح أو انتهت صلاحيته، يرجى طلب رمز جديد',
  PASSWORD_RESET_FAILED: 'فشل إعادة تعيين كلمة المرور، يرجى التحقق من صحة البيانات',
  PASSWORD_CHANGE_FAILED: 'فشل تغيير كلمة المرور، يرجى التأكد من صحة كلمة المرور الحالية',

  INVALID_IMAGE_FILE: 'الملف المرفوع ليس صورة صالحة أو لم يكتمل رفعه',
  FILE_NOT_OWNED: 'هذا الملف لا يخص حسابك الشخصي',
  USER_NO_PROFILE_PICTURE: 'لا توجد صورة شخصية للحذف',
  DUPLICATE_PHONE_NUMBER: 'رقم الجوال موجود مسبقاً في حسابك',
  PHONE_NOT_FOUND: 'رقم الجوال غير موجود',
  ADDRESS_NOT_FOUND: 'العنوان غير موجود',
  INVALID_FULL_NAME: 'الاسم الكامل لا يمكن أن يكون فارغاً',

  VALIDATION_ERROR: 'البيانات المدخلة غير صحيحة، يرجى التحقق منها',
  INTERNAL_SERVER_ERROR: 'حدث خطأ غير متوقع، يرجى المحاولة لاحقاً',
};

const defaultMessage = 'حدث خطأ غير متوقع، يرجى المحاولة مرة أخرى';

export function getErrorMessage(error: unknown): string {
  const err = error as { response?: { data?: { errorCode?: string; message?: string } }; message?: string } | undefined;

  if (err?.response?.data?.errorCode && errorMessages[err.response.data.errorCode]) {
    return errorMessages[err.response.data.errorCode];
  }

  if (err?.response?.data?.message) {
    return err.response.data.message;
  }

  if (err?.message) {
    return err.message;
  }

  return defaultMessage;
}

export function getErrorCode(error: unknown): string | null {
  const err = error as { response?: { data?: { errorCode?: string } } } | undefined;
  return err?.response?.data?.errorCode ?? null;
}
