import { DashboardSkeleton } from '../../../components/shared/Skeleton';
import ManuscriptCertificate from '../ManuscriptCertificate';
import { Award } from 'lucide-react';

interface CertificateItem {
  id: string;
  code: string;
  courseName: string;
  issuedAt: string;
}

interface CertificatesTabProps {
  isLoading: boolean;
  certificates: CertificateItem[];
  userName: string;
}

export function CertificatesTab({ isLoading, certificates, userName }: CertificatesTabProps) {
  return (
    <div className="bg-white rounded-3xl border border-amber-200/80 p-6 shadow-sm space-y-6" id="certificates-tab">
      <div>
        <h2 className="text-base font-extrabold text-orange-700 flex items-center gap-2">
          <Award className="w-5 h-5 text-orange-700" />
          <span>سجل الإجازات والشهادات المكتسبة</span>
        </h2>
        <p className="text-xs text-stone-500 font-light mt-1">تجد هنا الشهادات والاجازات الموقعة والمصدقة رقمياً من الهيئات الاستشارية لمنصة آثاري.</p>
      </div>

      {isLoading ? (
        <DashboardSkeleton />
      ) : certificates.length > 0 ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 pt-2">
          {certificates.map((cert) => (
            <ManuscriptCertificate
              key={cert.id}
              id={cert.id}
              title={cert.courseName}
              recipient={userName}
              grade="ممتاز"
              serialNumber={cert.code}
              dateHijri={new Date(cert.issuedAt).toLocaleDateString('ar-SA')}
              dateGregorian={new Date(cert.issuedAt).toLocaleDateString('ar-EG')}
              authorizer="المنصة"
              description="شهادة إتمام دورة تعليمية على منصة آثاري."
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-stone-400 text-xs">لم تحصل على أي شهادات بعد</div>
      )}
    </div>
  );
}
