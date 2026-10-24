import React, { useState } from 'react';
import { Language, CourseRecommendation } from '../../types';
import { COURSES_DATA } from '../../data/researchData';
import { 
  BookOpen, 
  Clock, 
  Award, 
  Check, 
  Building2,
  MapPin,
  CheckCircle2
} from 'lucide-react';

interface CoursesPageProps {
  lang: Language;
  selectedPersonaId: string;
  onNavigate: (page: string) => void;
}

export const CoursesPage: React.FC<CoursesPageProps> = ({
  lang,
  selectedPersonaId,
  onNavigate,
}) => {
  const [selectedCourseDetail, setSelectedCourseDetail] = useState<CourseRecommendation | null>(null);
  const [enrolledCourses, setEnrolledCourses] = useState<Record<string, boolean>>({});
  const [filterMode, setFilterMode] = useState<string>('recommended');
  const [alertMsg, setAlertMsg] = useState<string | null>(null);

  const allCourses = [
    ...(COURSES_DATA.priya || []),
    ...(COURSES_DATA.rahul || []),
    ...(COURSES_DATA.sunita || []),
  ];

  const filteredCourses = allCourses.filter(c => {
    if (filterMode === 'all') return true;
    if (filterMode === 'recommended') return (COURSES_DATA[selectedPersonaId] || []).some(rc => rc.id === c.id);
    return true;
  });

  const handleEnroll = (courseId: string, courseTitle: string) => {
    setEnrolledCourses(prev => ({ ...prev, [courseId]: true }));
    setAlertMsg(
      lang === 'en'
        ? `Enrolled in "${courseTitle}". NCVT portal registration generated.`
        : `"${courseTitle}" में नामांकन सफल हुआ। सरकारी पंजीकरण संख्या दर्ज हुई।`
    );
    setTimeout(() => setAlertMsg(null), 3500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6">
      
      {/* Toast Alert */}
      {alertMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-white border border-emerald-500 text-slate-900 text-xs px-4 py-3 rounded-lg shadow-lg flex items-center gap-2.5">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-medium">{alertMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 text-xs font-mono-data text-blue-700 font-semibold">
          <span>WHAT TO DO ABOUT YOUR SKILL GAP</span>
          <span>·</span>
          <span>SCREEN 06</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-slate-900">
          {lang === 'en' ? 'Govt-Accredited Course Recommendations' : 'सरकारी मान्यता प्राप्त प्रशिक्षण कोर्स'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-2xl">
          {lang === 'en'
            ? 'Short practical modules (12h to 40h) sponsored by MSME and NISE to directly close your evaluated skill gaps.'
            : '१२ से ४० घंटे के अल्पकालिक व्यावहारिक प्रशिक्षण, जो सीधे आपकी चिन्हित कमियों को दूर करते हैं।'}
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg border border-slate-200 w-fit text-xs">
        <button
          onClick={() => setFilterMode('recommended')}
          className={`px-3 py-1.5 rounded-md font-medium transition-all ${
            filterMode === 'recommended'
              ? 'bg-white text-slate-900 shadow-xs font-semibold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          {lang === 'en' ? 'Matched to Your Gap' : 'आपकी कमियों के अनुसार'}
        </button>
        <button
          onClick={() => setFilterMode('all')}
          className={`px-3 py-1.5 rounded-md font-medium transition-all ${
            filterMode === 'all'
              ? 'bg-white text-slate-900 shadow-xs font-semibold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          {lang === 'en' ? 'All Free Modules' : 'सभी कोर्स'} ({allCourses.length})
        </button>
      </div>

      {/* Course Cards Grid */}
      <div className="space-y-4">
        {filteredCourses.map(course => {
          const isEnrolled = enrolledCourses[course.id];
          return (
            <div
              key={course.id}
              className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/90 hover:border-slate-300 hover:shadow-sm transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono-data text-emerald-800 font-semibold px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200 w-fit inline-block">
                    {lang === 'en' ? course.cost : course.costHi}
                  </span>
                  <h3 className="text-base font-bold text-slate-900">
                    {lang === 'en' ? course.title : course.titleHi}
                  </h3>
                  <div className="text-xs text-slate-500 flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>{course.provider}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 font-mono-data text-xs text-slate-600">
                  <Clock className="w-3.5 h-3.5 text-blue-600" />
                  <span>{course.durationHours} Hours</span>
                  <span>·</span>
                  <span>{lang === 'en' ? course.mode : course.modeHi}</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-blue-50/60 border border-blue-200/60 text-xs text-blue-900 font-medium">
                🎯 {course.addressesGap}
              </div>

              {/* Card Footer Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-2 text-xs text-slate-600 font-mono-data">
                  <Award className="w-4 h-4 text-emerald-600" />
                  <span>{course.certification}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedCourseDetail(course)}
                    className="px-3.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-100 transition-colors"
                  >
                    {lang === 'en' ? 'View Syllabus (6A)' : 'पाठ्यक्रम देखें'}
                  </button>

                  <button
                    onClick={() => handleEnroll(course.id, course.title)}
                    className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      isEnrolled
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold'
                        : 'bg-blue-600 text-white hover:bg-blue-700 shadow-xs'
                    }`}
                  >
                    {isEnrolled ? (
                      <span className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5" />
                        <span>{lang === 'en' ? 'Enrolled' : 'नामांकित'}</span>
                      </span>
                    ) : (
                      <span>{lang === 'en' ? 'Enroll Free' : 'मुफ़्त पंजीकरण'}</span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Screen 6a: Course Detail Modal (Light Mode) */}
      {selectedCourseDetail && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl">
            
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-mono-data text-blue-700 font-semibold">COURSE SPECIFICATION (6A)</span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">
                  {lang === 'en' ? selectedCourseDetail.title : selectedCourseDetail.titleHi}
                </h3>
                <div className="text-xs text-slate-500 mt-0.5">
                  {selectedCourseDetail.provider}
                </div>
              </div>
              <button
                onClick={() => setSelectedCourseDetail(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            {/* Syllabus Modules */}
            <div className="space-y-3 text-xs">
              <h4 className="font-bold text-slate-800 uppercase tracking-wider font-mono-data">
                {lang === 'en' ? 'Curriculum & Practical Modules' : 'प्रायोगिक विषय एवं मॉड्यूल'}
              </h4>
              <div className="space-y-2">
                {selectedCourseDetail.skillsCovered.map((item, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center gap-2.5 text-slate-700">
                    <span className="w-5 h-5 rounded-md bg-blue-100 text-blue-800 font-mono-data font-bold flex items-center justify-center text-[10px]">
                      {idx + 1}
                    </span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Practical Center Location */}
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1 text-xs">
              <span className="text-slate-500 font-mono-data block">TRAINING LAB / WORKSHOP LOCATION:</span>
              <div className="text-slate-800 flex items-center gap-1.5 font-medium">
                <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>Govt. ITI Aliganj (Lucknow) & Regional MSME Labs / Mobile LMS</span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setSelectedCourseDetail(null)}
                className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200"
              >
                {lang === 'en' ? 'Close' : 'बंद करें'}
              </button>
              <button
                onClick={() => {
                  handleEnroll(selectedCourseDetail.id, selectedCourseDetail.title);
                  setSelectedCourseDetail(null);
                }}
                className="px-5 py-2 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 shadow-xs"
              >
                {lang === 'en' ? 'Confirm Free Enrollment' : 'निःशुल्क पंजीकरण करें'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
