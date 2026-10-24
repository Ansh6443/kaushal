import React, { useState } from 'react';
import { Language } from '../types';
import { PERSONAS, SKILLS_DATA, JOBS_DATA, COURSES_DATA } from '../data/researchData';
import { 
  MapPin, 
  Phone, 
  MessageSquare, 
  Award, 
  Clock, 
  ShieldCheck, 
  Check, 
  RefreshCw, 
  Zap, 
  HelpCircle,
  Briefcase,
  BookOpen,
  ArrowRight,
  ChevronDown,
  Sparkles
} from 'lucide-react';

interface DashboardViewProps {
  lang: Language;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ lang }) => {
  const [selectedPersonaId, setSelectedPersonaId] = useState<string>('priya');
  const [activeTab, setActiveTab] = useState<'courses' | 'jobs'>('jobs');
  const [showAllSkills, setShowAllSkills] = useState<boolean>(false);
  const [enrolledCourses, setEnrolledCourses] = useState<Record<string, boolean>>({});
  const [skillsOverride, setSkillsOverride] = useState<Record<string, number>>({});
  const [isAssessmentOpen, setIsAssessmentOpen] = useState<boolean>(false);
  const [assessmentAnswers, setAssessmentAnswers] = useState<Record<string, number>>({});
  const [assessmentSubmitted, setAssessmentSubmitted] = useState<boolean>(false);
  const [actionAlert, setActionAlert] = useState<string | null>(null);

  const currentPersona = PERSONAS.find(p => p.id === selectedPersonaId) || PERSONAS[0];
  const baseSkills = SKILLS_DATA[selectedPersonaId] || [];
  const baseJobs = JOBS_DATA[selectedPersonaId] || [];
  const baseCourses = COURSES_DATA[selectedPersonaId] || [];

  // Compute live skills based on overrides
  const skills = baseSkills.map(skill => {
    const current = skillsOverride[skill.id] !== undefined ? skillsOverride[skill.id] : skill.currentLevel;
    const gap = Math.max(0, skill.requiredLevel - current);
    return { ...skill, currentLevel: current, gap };
  });

  // Calculate live employability score
  const totalRequired = skills.reduce((acc, s) => acc + s.requiredLevel, 0);
  const totalCurrent = skills.reduce((acc, s) => acc + Math.min(s.currentLevel, s.requiredLevel), 0);
  const employabilityScore = totalRequired > 0 ? Math.round((totalCurrent / totalRequired) * 100) : currentPersona.baselineScore;

  // Display top 3 skills by default, or all if expanded
  const displayedSkills = showAllSkills ? skills : skills.slice(0, 3);

  const handleBoostSkill = (skillId: string, targetVal: number) => {
    setSkillsOverride(prev => ({
      ...prev,
      [skillId]: targetVal
    }));
    setActionAlert(
      lang === 'en'
        ? `Skill upgraded! Employability index recalculated.`
        : `कौशल स्तर बढ़ाया गया! रोजगार सूचकांक अद्यतन हुआ।`
    );
    setTimeout(() => setActionAlert(null), 3000);
  };

  const handleResetSkills = () => {
    setSkillsOverride({});
    setActionAlert(
      lang === 'en'
        ? 'Skill levels reset to baseline.'
        : 'कौशल स्तर मूल मूल्यांकन पर रीसेट किए गए।'
    );
    setTimeout(() => setActionAlert(null), 2500);
  };

  const handleToggleCourse = (courseId: string, courseTitle: string) => {
    setEnrolledCourses(prev => {
      const next = !prev[courseId];
      if (next) {
        setActionAlert(
          lang === 'en'
            ? `Enrolled in "${courseTitle}". NCVT sponsorship confirmed.`
            : `"${courseTitle}" में नामांकन सफल। सरकारी अनुदान स्वीकृत।`
        );
      }
      return { ...prev, [courseId]: next };
    });
    setTimeout(() => setActionAlert(null), 3000);
  };

  const handleContactEmployer = (method: string, employer: string, jobTitle: string) => {
    setActionAlert(
      lang === 'en'
        ? `Connecting via ${method} to ${employer}...`
        : `${employer} से ${method} द्वारा संपर्क शुरू किया जा रहा है...`
    );
    setTimeout(() => setActionAlert(null), 3500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-16">
      
      {/* Toast Alert */}
      {actionAlert && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#111622] border border-cyan-400 text-slate-100 text-xs px-4 py-3 rounded-lg shadow-[0_0_20px_rgba(0,240,255,0.25)] flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <Zap className="w-4 h-4 text-cyan-400 shrink-0" />
          <span className="font-medium">{actionAlert}</span>
        </div>
      )}

      {/* 1. Candidate Persona Switcher (Clean, Uncluttered Segmented Row) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
        <div>
          <span className="text-[11px] font-mono-data text-cyan-400 tracking-wider uppercase block mb-1">
            {lang === 'en' ? 'Active Candidate Profile' : 'वर्तमान उम्मीदवार प्रोफाइल'}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-xl font-display font-bold text-slate-100">{currentPersona.name}</span>
            <span className="text-xs text-slate-400 font-normal">· {currentPersona.location.split('(')[0].trim()}</span>
          </div>
        </div>

        {/* Persona Selectors */}
        <div className="flex items-center gap-1.5 p-1 bg-[#111622] rounded-lg border border-[#1E293B]">
          {PERSONAS.map(p => {
            const isSelected = p.id === selectedPersonaId;
            return (
              <button
                key={p.id}
                onClick={() => {
                  setSelectedPersonaId(p.id);
                  setSkillsOverride({});
                }}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
                  isSelected
                    ? 'bg-[#1A2235] text-cyan-400 shadow-sm border border-cyan-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {p.name.split(' ')[0]}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Candidate Hero Card (Spacious, Single Elevation, Calm Focal Point) */}
      <div className="bg-[#111622] rounded-2xl border border-[#1E293B] p-6 sm:p-8 space-y-6">
        
        {/* Top summary row */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-1.5 max-w-xl">
            <div className="inline-flex items-center gap-2 text-xs font-mono-data text-slate-400">
              <span className="text-cyan-400 font-semibold">{lang === 'en' ? currentPersona.role : currentPersona.roleHi}</span>
              <span>·</span>
              <span>{currentPersona.device}</span>
            </div>
            <h1 className="text-lg sm:text-xl font-medium text-slate-200 leading-relaxed">
              {lang === 'en' ? currentPersona.primaryGoal : currentPersona.primaryGoalHi}
            </h1>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsAssessmentOpen(true)}
              className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/20 transition-colors flex items-center gap-2"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'Quick Skill Check' : 'कौशल जांचें'}</span>
            </button>
            <button
              onClick={handleResetSkills}
              title="Reset scores"
              className="p-2 text-slate-400 hover:text-slate-200 hover:bg-[#1A2235] border border-[#1E293B] rounded-lg transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Big Key Metrics (Clean Two-Column Focal Anchor) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#1E293B]/70">
          
          {/* Employability Score */}
          <div className="p-5 rounded-xl bg-[#0C101A] border border-[#1E293B] flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-400 font-medium">
                {lang === 'en' ? 'Employability Match' : 'रोजगार उपयुक्तता'}
              </div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl sm:text-4xl font-display font-bold text-slate-100 font-mono-data">
                  {employabilityScore}%
                </span>
                <span className={`text-xs font-mono-data font-semibold ${
                  employabilityScore >= 75 ? 'text-emerald-400' : 'text-amber-400'
                }`}>
                  {employabilityScore >= 75 ? '↑ High Match' : '· Needs Upskilling'}
                </span>
              </div>
            </div>

            <div className="w-12 h-12 rounded-full border-2 border-[#1E293B] flex items-center justify-center font-mono-data text-xs font-bold text-cyan-400">
              {employabilityScore >= 75 ? 'Tier 1' : 'Tier 2'}
            </div>
          </div>

          {/* Median Starting Wage Potential */}
          <div className="p-5 rounded-xl bg-[#0C101A] border border-[#1E293B] flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-400 font-medium">
                {lang === 'en' ? 'Projected Monthly Wage' : 'संभावित मासिक मानदेय'}
              </div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl sm:text-4xl font-display font-bold text-emerald-400 font-mono-data">
                  {selectedPersonaId === 'priya' 
                    ? (employabilityScore >= 80 ? '₹26,000' : '₹16,000') 
                    : selectedPersonaId === 'rahul' 
                      ? (employabilityScore >= 75 ? '₹18,500' : '₹12,800')
                      : (employabilityScore >= 70 ? '₹11,000' : '₹8,500')}
                </span>
                <span className="text-xs text-slate-400 font-mono-data">/ mo</span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[11px] text-emerald-400 font-mono-data block font-semibold">
                +₹8,500 unlock
              </span>
              <span className="text-[10px] text-slate-500 font-mono-data">
                {lang === 'en' ? 'post 1 module' : '1 मॉड्यूल के बाद'}
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* 3. Skill Gap Analysis (Airy & Focused) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-display font-bold text-slate-100">
              {lang === 'en' ? 'Skill Gap Benchmark' : 'कौशल अंतर विश्लेषण'}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {lang === 'en'
                ? 'Candidate current score vs employer minimum threshold.'
                : 'वर्तमान योग्यता बनाम नियोक्ताओं की न्यूनतम मांग।'}
            </p>
          </div>
          
          <div className="flex items-center gap-4 text-xs font-mono-data text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span>{lang === 'en' ? 'Current' : 'वर्तमान'}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-slate-500" />
              <span>{lang === 'en' ? 'Required' : 'न्यूनतम'}</span>
            </span>
          </div>
        </div>

        {/* Skill Cards (Spacious, Uncluttered) */}
        <div className="space-y-3">
          {displayedSkills.map(skill => {
            return (
              <div
                key={skill.id}
                className="p-4 sm:p-5 rounded-xl bg-[#111622] border border-[#1E293B] hover:border-slate-700 transition-colors space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-slate-100">
                        {lang === 'en' ? skill.name : skill.nameHi}
                      </span>
                      <span className="text-[11px] font-mono-data text-slate-400">
                        · {skill.category}
                      </span>
                    </div>
                    <div className="text-xs text-emerald-400 font-mono-data mt-0.5">
                      {lang === 'en' ? 'Impact on starting salary:' : 'वेतन पर संभावित प्रभाव:'} {skill.wageUplift}
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 text-right">
                    <div className="text-xs font-mono-data font-semibold text-slate-200">
                      {skill.currentLevel}% / {skill.requiredLevel}%
                    </div>
                    {skill.gap > 0 ? (
                      <button
                        onClick={() => handleBoostSkill(skill.id, skill.requiredLevel)}
                        className="px-2.5 py-1 text-xs font-medium rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/20 transition-colors flex items-center gap-1"
                      >
                        <Zap className="w-3 h-3" />
                        <span>{lang === 'en' ? 'Close Gap' : 'अंतर घटाएं'}</span>
                      </button>
                    ) : (
                      <span className="text-xs text-emerald-400 flex items-center gap-1 font-mono-data font-semibold">
                        <Check className="w-3.5 h-3.5" />
                        <span>{lang === 'en' ? 'Qualified' : 'योग्य'}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Clean Progress Bar */}
                <div className="relative w-full bg-[#182030] h-2.5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 transition-all duration-300 rounded-full"
                    style={{ width: `${skill.currentLevel}%` }}
                  />
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-white z-10"
                    style={{ left: `${skill.requiredLevel}%` }}
                    title={`Required: ${skill.requiredLevel}%`}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Toggle to expand remaining skills */}
        {skills.length > 3 && (
          <div className="text-center pt-1">
            <button
              onClick={() => setShowAllSkills(!showAllSkills)}
              className="text-xs text-slate-400 hover:text-cyan-400 font-mono-data transition-colors inline-flex items-center gap-1.5"
            >
              <span>{showAllSkills ? (lang === 'en' ? 'Show Less' : 'कम दिखाएं') : (lang === 'en' ? `View All ${skills.length} Skills` : `सभी ${skills.length} कौशल देखें`)}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showAllSkills ? 'rotate-180' : ''}`} />
            </button>
          </div>
        )}
      </div>

      {/* 4. Actionable Next Steps: Tabs for Opportunities vs Training (Clean & Uncrowded) */}
      <div className="space-y-4 pt-2">
        
        {/* Section Header with Clean Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#1E293B]">
          <h2 className="text-base font-display font-bold text-slate-100">
            {lang === 'en' ? 'Recommended Next Steps' : 'अनुशंसित अगले कदम'}
          </h2>

          <div className="flex items-center gap-1 p-1 bg-[#111622] rounded-lg border border-[#1E293B]">
            <button
              onClick={() => setActiveTab('jobs')}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                activeTab === 'jobs'
                  ? 'bg-[#1A2235] text-cyan-400 shadow-sm border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'Verified Openings' : 'उपलब्ध नौकरियां'} ({baseJobs.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('courses')}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                activeTab === 'courses'
                  ? 'bg-[#1A2235] text-cyan-400 shadow-sm border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'Free Courses' : 'निःशुल्क कोर्स'} ({baseCourses.length})</span>
            </button>
          </div>
        </div>

        {/* Content: Jobs View */}
        {activeTab === 'jobs' && (
          <div className="space-y-3">
            {baseJobs.map(job => (
              <div
                key={job.id}
                className="p-5 rounded-xl bg-[#111622] border border-[#1E293B] hover:border-slate-700 transition-colors space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-100">
                        {lang === 'en' ? job.title : job.titleHi}
                      </h3>
                      {job.verifiedGovt && (
                        <span title="Government Verified" className="text-cyan-400">
                          <ShieldCheck className="w-4 h-4" />
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      {job.employer} · <strong className="text-slate-300 font-normal">{job.distanceKm} km away</strong>
                    </div>
                  </div>

                  <div className="text-left sm:text-right">
                    <div className="text-sm font-bold text-emerald-400 font-mono-data">
                      {job.stipend}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono-data">
                      {lang === 'en' ? job.type : job.typeHi}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-[#1E293B]/70">
                  <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono-data">
                    <span className="text-slate-400">{lang === 'en' ? 'Matched:' : 'मैच:'}</span>
                    {job.skillsMatched.map(s => (
                      <span key={s} className="text-emerald-400 bg-emerald-950/40 px-1.5 py-0.5 rounded text-[11px]">
                        ✓ {s}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    {job.contactMethod === 'WhatsApp' ? (
                      <button
                        onClick={() => handleContactEmployer('WhatsApp', job.employer, job.title)}
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-950/40 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-900/40 transition-colors flex items-center gap-1.5"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Direct WhatsApp</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleContactEmployer('Direct Phone Call', job.employer, job.title)}
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-cyan-950/40 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-900/40 transition-colors flex items-center gap-1.5"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Call Desk</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Content: Courses View */}
        {activeTab === 'courses' && (
          <div className="space-y-3">
            {baseCourses.map(course => {
              const isEnrolled = enrolledCourses[course.id];
              return (
                <div
                  key={course.id}
                  className="p-5 rounded-xl bg-[#111622] border border-[#1E293B] hover:border-slate-700 transition-colors space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-bold text-slate-100">
                        {lang === 'en' ? course.title : course.titleHi}
                      </h3>
                      <div className="text-xs text-slate-400 mt-0.5">
                        {course.provider} · <span className="font-mono-data text-cyan-400">{course.durationHours} hrs</span>
                      </div>
                    </div>

                    <span className="text-xs font-mono-data text-emerald-400 font-semibold px-2 py-0.5 rounded bg-emerald-950/50 border border-emerald-800/40 w-fit">
                      {lang === 'en' ? course.cost : course.costHi}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {course.addressesGap}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-[#1E293B]/70">
                    <span className="text-[11px] text-slate-400 font-mono-data">
                      {course.certification}
                    </span>

                    <button
                      onClick={() => handleToggleCourse(course.id, course.title)}
                      className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                        isEnrolled
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-cyan-500 text-slate-950 hover:bg-cyan-400'
                      }`}
                    >
                      {isEnrolled ? (
                        <span className="flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5" />
                          <span>{lang === 'en' ? 'Enrolled' : 'नामांकित'}</span>
                        </span>
                      ) : (
                        <span>{lang === 'en' ? 'Start Free Course' : 'कोर्स शुरू करें'}</span>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Interactive Assessment Modal (Clean & Minimal) */}
      {isAssessmentOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111622] rounded-2xl border border-cyan-500/40 max-w-lg w-full p-6 space-y-5 shadow-[0_0_40px_rgba(0,240,255,0.2)]">
            <div className="flex items-center justify-between pb-3 border-b border-[#1E293B]">
              <div>
                <h3 className="text-base font-display font-bold text-slate-100">
                  {lang === 'en' ? 'Quick Skill Diagnostic' : 'त्वरित कौशल मूल्यांकन'}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {currentPersona.name} · {lang === 'en' ? '2 practical questions' : '२ व्यावहारिक प्रश्न'}
                </p>
              </div>
              <button
                onClick={() => {
                  setIsAssessmentOpen(false);
                  setAssessmentSubmitted(false);
                }}
                className="text-slate-400 hover:text-slate-200 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {!assessmentSubmitted ? (
              <div className="space-y-4">
                <div className="space-y-2 text-xs">
                  <p className="font-semibold text-slate-200">
                    {lang === 'en' 
                      ? '1. How confident are you handling core trade tools and daily tasks independently?' 
                      : '१. आप अपने कार्य से जुड़े उपकरणों और कार्यों को स्वतंत्र रूप से करने में कितने सहज हैं?'}
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {['Beginner', 'Moderate', 'Confident'].map((opt, idx) => (
                      <button
                        key={opt}
                        onClick={() => setAssessmentAnswers(prev => ({ ...prev, q1: (idx + 1) * 30 }))}
                        className={`p-2.5 rounded-lg border text-center transition-colors text-xs ${
                          assessmentAnswers.q1 === (idx + 1) * 30
                            ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-semibold'
                            : 'bg-[#0C101A] border-[#1E293B] text-slate-300 hover:bg-[#161F31]'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <p className="font-semibold text-slate-200">
                    {lang === 'en' 
                      ? '2. What is your troubleshooting protocol when an error or fault occurs?' 
                      : '२. तकनीकी समस्या आने पर आपका पहला कदम क्या होता है?'}
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {['Ask Supervisor', 'Basic Check', 'Root Cause Fix'].map((opt, idx) => (
                      <button
                        key={opt}
                        onClick={() => setAssessmentAnswers(prev => ({ ...prev, q2: (idx + 1) * 30 }))}
                        className={`p-2.5 rounded-lg border text-center transition-colors text-xs ${
                          assessmentAnswers.q2 === (idx + 1) * 30
                            ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-semibold'
                            : 'bg-[#0C101A] border-[#1E293B] text-slate-300 hover:bg-[#161F31]'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => {
                    setAssessmentSubmitted(true);
                    skills.forEach(s => {
                      setSkillsOverride(prev => ({
                        ...prev,
                        [s.id]: Math.min(s.requiredLevel, Math.round(s.currentLevel + 20))
                      }));
                    });
                  }}
                  className="w-full py-2.5 rounded-lg bg-cyan-500 text-slate-950 font-semibold text-xs hover:bg-cyan-400 transition-colors mt-2"
                >
                  {lang === 'en' ? 'Recalculate Skill Match' : 'कौशल सूचकांक अपडेट करें'}
                </button>
              </div>
            ) : (
              <div className="text-center py-6 space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-400 text-emerald-400 flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="font-display font-bold text-slate-100 text-sm">
                  {lang === 'en' ? 'Score Updated' : 'मूल्यांकन अद्यतन हुआ'}
                </h4>
                <p className="text-xs text-slate-400">
                  {lang === 'en'
                    ? 'Employability match score and stipend potential have updated.'
                    : 'रोजगार उपयुक्तता स्कोर और मानदेय संभावनाओं को अपडेट कर दिया गया है।'}
                </p>
                <button
                  onClick={() => {
                    setIsAssessmentOpen(false);
                    setAssessmentSubmitted(false);
                  }}
                  className="px-4 py-2 rounded-lg bg-[#161F31] border border-cyan-500/40 text-cyan-300 text-xs font-semibold hover:bg-cyan-950/50"
                >
                  {lang === 'en' ? 'Back to Dashboard' : 'डैशबोर्ड पर वापस जाएं'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
