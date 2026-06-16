import React, { useState } from 'react';
import { 
  Award, 
  Users, 
  Star, 
  MessageCircle, 
  BookOpen, 
  MapPin, 
  ExternalLink, 
  ChevronLeft, 
  UserCheck,
  Building,
  Calendar,
  Compass
} from 'lucide-react';
import { Course } from '../types';
import { COURSES } from '../data';

interface PublicProfileProps {
  instructorName?: string;
  onBack: () => void;
  onSelectCourse: (courseId: string) => void;
  onStartChat?: (withName: string) => void;
  isLoggedIn?: boolean;
}

export default function PublicProfile({
  instructorName = 'م. عبد الرحمن البغدادي',
  onBack,
  onSelectCourse,
  onStartChat,
  isLoggedIn = true
}: PublicProfileProps) {
  const [activeTab, setActiveTab] = useState<'courses' | 'bio'>('courses');

  // Find instructor-specific details
  const filteredCourses = COURSES.filter(c => c.instructorName === instructorName);
  
  // Custom metadata based on instructor or general profile
  const isBaghdadi = instructorName.includes('البغدادي');
  const isAnsari = instructorName.includes('الأنصاري');
  
  const avatar = isBaghdadi
    ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
    : isAnsari 
      ? 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'
      : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150';

  const role = isBaghdadi
    ? 'مهندس وباحث تراثي معتمد لدى هيئة التطوير الأثري'
    : isAnsari
      ? 'أستاذة التاريخ والحضارات المقارنة بجامعة المدينة'
      : 'باحث ومحاضر تراثي مسجل بالمنصة';

  const bio = isBaghdadi
    ? 'باحث متخصص في الهندسة المعمارية الإسلامية ووثائق المقرصنات والقباب العباسية والأموية. أشرف على ترميم عدة قلاع أثرية بالمشرق.'
    : isAnsari
      ? 'متخصصة في تاريخ الفترات المستقلة وحركات الإصلاح الفني والاجتماعي بالأندلس والمشرق العربي. مؤلفة كتاب طروس حضارية.'
      : 'عضو اللجنة العلمية لاستقراء الموروث التراثي والحضاري بمنصة آثاري العريقة.';

  const location = isBaghdadi ? 'بغداد، العراق' : isAnsari ? 'المدينة المنورة، السعودية' : 'الرياض، السعودية';
  
  // Stats row
  const countCourses = filteredCourses.length || 2;
  const countStudents = isBaghdadi ? 3120 : isAnsari ? 2450 : 120;
  const avgRating = isBaghdadi ? '٤.٩/٥' : isAnsari ? '٤.٨/٥' : '٥/٥';

  return (
    <div className="min-h-screen bg-stone-50 text-right font-sans pb-20" dir="rtl" id="public-profile-page">
      
      {/* 1. HERO HEADER AREA WITH WARM GRADIENT */}
      <div className="bg-gradient-to-br from-amber-200/60 via-[#FDFBF7] to-orange-50/40 border-b border-amber-100 pb-12 pt-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          
          {/* Back button & controls */}
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={onBack}
              className="bg-white/80 backdrop-blur-xs hover:bg-stone-100 text-[#5C230E] font-bold text-xs py-2 px-4 rounded-xl border border-stone-200 transition duration-150 flex items-center gap-1.5 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>الرجوع للصفحة السابقة</span>
            </button>

            {isLoggedIn && onStartChat && (
              <button
                onClick={() => onStartChat(instructorName)}
                className="bg-orange-700 hover:bg-orange-850 text-amber-50 text-xs font-black py-2.5 px-5 rounded-xl border-0 cursor-pointer flex items-center gap-1.5 shadow-sm transition"
              >
                <MessageCircle className="w-4 h-4" />
                <span>مراسلة فورية</span>
              </button>
            )}
          </div>

          {/* User Details with overlap container */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mt-4">
            
            {/* avatar picture */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-white bg-stone-200 shadow-md shrink-0 overflow-hidden relative">
              <img 
                src={avatar} 
                alt={instructorName} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Profile main details */}
            <div className="space-y-3 text-center md:text-right flex-1">
              <div className="flex flex-col sm:flex-row justify-center md:justify-start items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-stone-900 font-serif">{instructorName}</h1>
                <span className="bg-amber-105 bg-amber-100 text-amber-900/95 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-amber-300 flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-amber-800" />
                  <span>مدرب معتمد</span>
                </span>
              </div>

              <p className="text-xs sm:text-sm font-semibold text-stone-700 leading-normal max-w-2xl">
                {role}
              </p>

              <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 text-stone-505 text-xs text-stone-500 font-medium">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-orange-750" />
                  <span>{location}</span>
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-orange-750" />
                  <span>عضو منذ عام ٢٠٢٤</span>
                </span>
                <span className="flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5 text-orange-750" />
                  <span>الهوية شرفية وموثقة</span>
                </span>
              </div>

              <p className="text-xs text-stone-600 font-light mt-2 max-w-3xl leading-relaxed">
                {bio}
              </p>
            </div>

          </div>

        </div>
      </div>

      {/* 2. STATS ROW */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 -mt-6">
        <div className="grid grid-cols-3 gap-3 sm:gap-6 bg-white border border-[#E9E4D9] rounded-2xl p-4 sm:p-5 shadow-sm">
          
          <div className="text-center space-y-1">
            <div className="w-8 h-8 rounded-full bg-orange-50 text-[#962D15] flex items-center justify-center mx-auto mb-1">
              <BookOpen className="w-4 h-4" />
            </div>
            <span className="text-[10px] sm:text-xs text-stone-400 font-medium block">عدد المقررات والدورات</span>
            <span className="text-lg sm:text-xl font-black text-stone-900 font-mono block">{countCourses}</span>
          </div>

          <div className="text-center space-y-1 border-r border-stone-200">
            <div className="w-8 h-8 rounded-full bg-orange-50 text-[#962D15] flex items-center justify-center mx-auto mb-1">
              <Users className="w-4 h-4" />
            </div>
            <span className="text-[10px] sm:text-xs text-stone-400 font-medium block">عدد الدارسين المستفيدين</span>
            <span className="text-lg sm:text-xl font-black text-stone-900 font-mono block">{countStudents}</span>
          </div>

          <div className="text-center space-y-1 border-r border-stone-200">
            <div className="w-8 h-8 rounded-full bg-orange-50 text-[#962D15] flex items-center justify-center mx-auto mb-1">
              <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
            </div>
            <span className="text-[10px] sm:text-xs text-stone-400 font-medium block">متوسط تقييم العلماء</span>
            <span className="text-lg sm:text-xl font-black text-stone-900 font-mono block">{avgRating}</span>
          </div>

        </div>
      </div>

      {/* 3. MAIN CONTENT SYSTEM */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-8">
        
        {/* TABS SELECTOR */}
        <div className="flex border-b border-stone-200 mb-6 gap-2">
          
          <button
            onClick={() => setActiveTab('courses')}
            className={`px-5 py-3 text-xs font-black border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'courses'
                ? 'border-orange-700 text-[#962D15]'
                : 'border-transparent text-stone-500 hover:text-stone-850'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>المقررات التي يلقنها ({countCourses})</span>
          </button>

          <button
            onClick={() => setActiveTab('bio')}
            className={`px-5 py-3 text-xs font-black border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'bio'
                ? 'border-orange-700 text-[#962D15]'
                : 'border-transparent text-stone-500 hover:text-stone-850'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>الذخيرة والنبذة البحثية</span>
          </button>

        </div>

        {/* TAB 1: COURSES GRID */}
        {activeTab === 'courses' && (
          <div>
            {filteredCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map((c) => (
                  <div 
                    key={c.id} 
                    className="bg-white border border-[#E9E4D9] rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition duration-300 flex flex-col justify-between"
                  >
                    <div className="relative h-44 bg-stone-100">
                      <img 
                        src={c.thumbnail} 
                        alt={c.title} 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <span className="absolute top-3 right-3 bg-stone-900/70 text-amber-50 rounded-lg text-[9px] font-black px-2 py-0.5 backdrop-blur-xs">
                        {c.category}
                      </span>
                    </div>

                    <div className="p-4 sm:p-5 text-right flex-1 space-y-3 flex flex-col justify-between">
                      <div className="space-y-1">
                        <h3 className="text-xs sm:text-sm font-black text-stone-900 leading-snug hover:text-[#962D15] transition line-clamp-2">
                          {c.title}
                        </h3>
                        <p className="text-[10px] text-stone-500 font-light flex items-center justify-start gap-3 pt-2">
                          <span>{c.duration}</span>
                          <span>•</span>
                          <span>({c.lessonsCount} درساً)</span>
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-stone-55 border-stone-100">
                        <div className="flex items-center gap-1 text-xs">
                          <span className="font-extrabold text-stone-900 font-mono">{c.price} $</span>
                          {c.originalPrice && (
                            <span className="text-[10px] text-stone-400 line-through font-mono font-light">{c.originalPrice} $</span>
                          )}
                        </div>

                        <button
                          onClick={() => onSelectCourse(c.id)}
                          className="bg-transparent hover:bg-stone-50 text-orange-900 hover:text-orange-950 text-xs font-black py-1.5 px-3 rounded-xl border border-[#E9E4D9] transition flex items-center gap-1 cursor-pointer"
                        >
                          <span>عرض المقرر</span>
                          <ChevronLeft className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-3xl border border-[#E9E4D9] space-y-3">
                <span className="text-3xl">🏜️</span>
                <p className="text-xs font-black text-stone-900">لا توجد مقررات فعالة ومنشورة بالدليل للأستاذ المختار حالياً.</p>
                <p className="text-[10px] text-stone-400">تابعنا قريباً حيث يُلقي الأستاذ دورساً ومجالس بث حي مباشرة.</p>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: SCHOLARLY BIO */}
        {activeTab === 'bio' && (
          <div className="bg-white border border-[#E9E4D9] rounded-3xl p-6 sm:p-8 space-y-6">
            
            <div className="space-y-3 text-right">
              <h3 className="text-sm sm:text-base font-black text-[#5C230E] font-serif flex items-center gap-2">
                <Building className="w-5 h-5 text-orange-700" />
                <span>الجريدة العلمية والمشاركات الأكاديمية</span>
              </h3>
              <p className="text-xs text-stone-605 text-stone-600 leading-relaxed font-light">
                {isBaghdadi ? (
                  `عضو برتبة زميل أول في مركز دراسات العمارة التراثية بدمشق وحلب، أشرف على رصد نقوش الأقراص والزخارف الجصية بمحيط قلعة صلاح الدين، وحاصل على براءات حصر أثرية متعددة ومقالات منشورة بدورية "الآثار الشرقية الموقرة".`
                ) : isAnsari ? (
                  `باحثة زائرة في معهد الأوراق الأندلسية بمدريد، وأشرفت على فهرسة أكثر من ٢٣٠ ورقة وحجية عائلية نادرة، ومحكمة لبرامج التراث المقارن بعدة جامعات خليجية ومشرقية عريقة.`
                ) : (
                  `زميل تدريس مسجل بنظام منصة آثاري الممثلة، ولديه مجموعة متميزة من الأبحاث الميدانية المهتمة بالموروث الإسلامي والعربي المعاصر.`
                )}
              </p>
            </div>

            <div className="h-0.5 bg-stone-100" />

            {/* Simulated research list block */}
            <div className="space-y-4">
              <h3 className="text-xs font-black text-[#5C230E] font-serif">الإصدارات والشهادات الصادرة من الهيئة العامة للآثار</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 flex items-start gap-3">
                  <div className="font-extrabold text-xs text-orange-800 bg-[#FAF9F5] w-8 h-8 rounded-lg flex items-center justify-center border shrink-0">١</div>
                  <div className="space-y-1 text-right">
                    <h4 className="font-extrabold text-xs text-stone-900">شهادة الدكتوراه الفخرية في الهندسة التراثية من جامعة الفنون الشريفة</h4>
                    <span className="text-[9.5px] text-stone-450 text-stone-400 block font-mono">عام ٢٠٢٠ • معتمدة بالرقم القومي</span>
                  </div>
                </div>

                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 flex items-start gap-3">
                  <div className="font-extrabold text-xs text-orange-800 bg-[#FAF9F5] w-8 h-8 rounded-lg flex items-center justify-center border shrink-0">٢</div>
                  <div className="space-y-1 text-right">
                    <h4 className="font-extrabold text-xs text-stone-900">نشرة بحثية مقارنة: "محاور الأقواس في القباب الأثرية عبر تطور المشرق"</h4>
                    <span className="text-[9.5px] text-stone-450 text-stone-400 block font-mono">مؤرشف الكترونياً • مع المرفق الرقمي</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        )}

      </div>

    </div>
  );
}
