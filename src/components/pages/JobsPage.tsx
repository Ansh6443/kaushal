import React, { useState, useEffect } from 'react';
import { Language, JobListing } from '../../types';
import { JOBS_DATA } from '../../data/researchData';
import { 
  MapPin, 
  Phone, 
  MessageSquare, 
  ShieldCheck, 
  Briefcase, 
  CheckCircle2,
  Search,
  Bookmark,
  Volume2,
  Send,
  Building2,
  ExternalLink,
  SlidersHorizontal,
  Check
} from 'lucide-react';

interface JobsPageProps {
  lang: Language;
  selectedPersonaId: string;
  onNavigate: (page: string) => void;
}

export const JobsPage: React.FC<JobsPageProps> = ({
  lang,
  selectedPersonaId,
  onNavigate,
}) => {
  const [selectedJobDetail, setSelectedJobDetail] = useState<JobListing | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [districtFilter, setDistrictFilter] = useState<string>('all');
  const [distanceRadius, setDistanceRadius] = useState<number>(30);
  const [jobTypeFilter, setJobTypeFilter] = useState<string>('all');
  const [actionAlert, setActionAlert] = useState<{ title: string; subtitle: string } | null>(null);

  // Saved jobs persistence
  const [savedJobIds, setSavedJobIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('ks_saved_jobs');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Applied jobs tracking
  const [appliedJobs, setAppliedJobs] = useState<Array<{ id: string; employer: string; title: string; time: string; appId: string }>>(() => {
    try {
      const saved = localStorage.getItem('ks_applied_jobs');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const allJobs: JobListing[] = [
    ...(JOBS_DATA.priya || []),
    ...(JOBS_DATA.rahul || []),
    ...(JOBS_DATA.sunita || []),
  ];

  const toggleSaveJob = (jobId: string) => {
    const next = savedJobIds.includes(jobId) 
      ? savedJobIds.filter(id => id !== jobId)
      : [...savedJobIds, jobId];
    setSavedJobIds(next);
    localStorage.setItem('ks_saved_jobs', JSON.stringify(next));
  };

  const handleSpeakJob = (job: JobListing) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const text = lang === 'en'
        ? `${job.title} at ${job.employer}, located in ${job.location}. Salary: ${job.stipend}. Commute distance: ${job.distanceKm} kilometers.`
        : `${job.titleHi}, कंपनी ${job.employer}, स्थान ${job.locationHi || job.location}। मानदेय ${job.stipend}। घर से दूरी ${job.distanceKm} किलोमीटर।`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === 'en' ? 'en-IN' : 'hi-IN';
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleApply = (method: string, employer: string, jobTitle: string) => {
    const appId = 'KS-APP-' + Math.floor(1000 + Math.random() * 9000);
    const newApplied = [
      { id: Date.now().toString(), employer, title: jobTitle, time: 'Just now', appId },
      ...appliedJobs
    ];
    setAppliedJobs(newApplied);
    localStorage.setItem('ks_applied_jobs', JSON.stringify(newApplied));

    setActionAlert({
      title: lang === 'en' ? `Resume Dispatched to ${employer}!` : `${employer} को रेज़्यूमे भेजा गया!`,
      subtitle: lang === 'en' 
        ? `Tracking ID: ${appId} · Application pushed to HR portal & WhatsApp.` 
        : `ट्रैकिंग आईडी: ${appId} · आवेदन सीधे एचआर पोर्टल व व्हाट्सएप पर प्रेषित।`
    });

    setTimeout(() => setActionAlert(null), 4500);
  };

  const filteredJobs = allJobs.filter(j => {
    if (j.distanceKm > distanceRadius) return false;
    if (jobTypeFilter !== 'all' && j.type !== jobTypeFilter) return false;
    if (districtFilter !== 'all' && !j.location.toLowerCase().includes(districtFilter.toLowerCase())) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = j.title.toLowerCase().includes(q) || j.titleHi.toLowerCase().includes(q);
      const matchEmployer = j.employer.toLowerCase().includes(q);
      const matchSkill = j.skillsMatched.some(s => s.toLowerCase().includes(q)) || j.skillsMissing.some(s => s.toLowerCase().includes(q));
      if (!matchTitle && !matchEmployer && !matchSkill) return false;
    }
    return true;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6 py-6">
      
      {/* Toast Alert */}
      {actionAlert && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs px-5 py-3.5 rounded-xl shadow-2xl border border-slate-700 flex items-start gap-3 animate-in fade-in slide-in-from-bottom-5">
          <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 mt-0.5">
            <Check className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="font-bold text-white">{actionAlert.title}</div>
            <div className="text-[11px] text-slate-300 mt-0.5">{actionAlert.subtitle}</div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono-data text-blue-700 font-bold mb-1">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            <span>VERIFIED OPPORTUNITIES</span>
            <span>·</span>
            <span>DIRECT HR RECRUITMENT</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-slate-900">
            {lang === 'en' ? 'Local Jobs & Apprenticeship Portal' : 'सत्यापित स्थानीय नौकरियां एवं शिक्षुता'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            {lang === 'en'
              ? 'Zero ghost applications. Send your verified resume directly to local HR desks within your commute radius.'
              : 'कोई पेंडेंसी नहीं। अपने घर के पास के नियोक्ताओं को सीधे रेज़्यूमे भेजें और व्हाट्सएप पर बात करें।'}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onNavigate('resume')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            {lang === 'en' ? 'Edit AI Resume' : 'रेज़्यूमे एडिट करें'}
          </button>
        </div>
      </div>

      {/* Search & Comprehensive Filters */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 space-y-4 shadow-xs">
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={lang === 'en' ? 'Search by role, company, or skill (e.g. Tally, Solar, Excel, Wiring)...' : 'पद, कंपनी या कौशल से खोजें (जैसे Tally, Solar, Excel)...'}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"
          />
        </div>

        {/* Filter Controls Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-xs">
          
          {/* Commute Radius */}
          <div className="flex items-center gap-2">
            <span className="text-slate-600 font-medium">
              {lang === 'en' ? 'Max Distance:' : 'अधिकतम दूरी:'}
            </span>
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs font-mono-data">
              {[10, 20, 30].map(dist => (
                <button
                  key={dist}
                  onClick={() => setDistanceRadius(dist)}
                  className={`px-2.5 py-1 rounded transition-all cursor-pointer ${
                    distanceRadius === dist
                      ? 'bg-white text-slate-900 font-bold shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  ≤{dist}km
                </button>
              ))}
            </div>
          </div>

          {/* District Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-slate-600 font-medium">
              {lang === 'en' ? 'District:' : 'जिला:'}
            </span>
            <select
              value={districtFilter}
              onChange={e => setDistrictFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
            >
              <option value="all">{lang === 'en' ? 'All Districts' : 'सभी जिले'}</option>
              <option value="lucknow">Lucknow (लखनऊ)</option>
              <option value="kanpur">Kanpur (कानपुर)</option>
              <option value="barabanki">Barabanki (बाराबंकी)</option>
            </select>
          </div>

          {/* Opportunity Type */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
            {['all', 'Apprenticeship', 'Direct Job'].map(type => (
              <button
                key={type}
                onClick={() => setJobTypeFilter(type)}
                className={`px-3 py-1 rounded transition-all cursor-pointer ${
                  jobTypeFilter === type
                    ? 'bg-white text-slate-900 font-bold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {type === 'all' ? (lang === 'en' ? 'All' : 'सभी') : type === 'Apprenticeship' ? (lang === 'en' ? 'Apprenticeships' : 'शिक्षुता') : (lang === 'en' ? 'Direct Jobs' : 'सीधी नौकरी')}
              </button>
            ))}
          </div>

        </div>

      </div>

      {/* Jobs Feed */}
      <div className="space-y-4">
        {filteredJobs.length === 0 ? (
          <div className="text-center py-12 p-6 rounded-2xl bg-white border border-slate-200 space-y-2">
            <p className="text-slate-700 text-sm font-medium">
              {lang === 'en' ? 'No opportunities match your current filters.' : 'वर्तमान फ़िल्टर के अनुसार कोई अवसर नहीं मिला।'}
            </p>
            <button
              onClick={() => {
                setDistanceRadius(30);
                setSearchQuery('');
                setDistrictFilter('all');
                setJobTypeFilter('all');
              }}
              className="text-xs text-blue-700 hover:underline font-semibold cursor-pointer"
            >
              {lang === 'en' ? 'Reset all filters' : 'फ़िल्टर रीसेट करें'}
            </button>
          </div>
        ) : (
          filteredJobs.map(job => {
            const isSaved = savedJobIds.includes(job.id);
            const isApplied = appliedJobs.some(a => a.employer === job.employer);

            return (
              <div
                key={job.id}
                className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/90 hover:border-slate-300 hover:shadow-sm transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900">
                        {lang === 'en' ? job.title : job.titleHi}
                      </h3>
                      {job.verifiedGovt && (
                        <span title="Govt NATS Verified" className="text-blue-700">
                          <ShieldCheck className="w-4 h-4" />
                        </span>
                      )}
                      {/* Audio listen button */}
                      <button
                        onClick={() => handleSpeakJob(job)}
                        className="p-1 rounded-md text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        title={lang === 'en' ? 'Listen to Job Details' : 'विवरण सुनें'}
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="text-xs text-slate-500">
                      {job.employer} · <strong className="text-slate-700 font-normal">{job.location}</strong>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="text-left sm:text-right">
                      <div className="text-base font-bold text-emerald-800 font-mono-data">
                        {job.stipend}
                      </div>
                      <div className="text-xs text-blue-700 font-mono-data font-semibold">
                        📍 {job.distanceKm} km from home
                      </div>
                    </div>

                    {/* Bookmark Button */}
                    <button
                      onClick={() => toggleSaveJob(job.id)}
                      className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                        isSaved 
                          ? 'bg-rose-50 text-rose-600 border-rose-200' 
                          : 'bg-slate-50 text-slate-400 hover:text-slate-600 border-slate-200'
                      }`}
                      title={isSaved ? 'Saved' : 'Save Job'}
                    >
                      <Bookmark className="w-4 h-4 fill-current" />
                    </button>
                  </div>
                </div>

                {/* Skill Requirements Strip */}
                <div className="flex flex-wrap items-center gap-2 text-xs font-mono-data pt-1">
                  <span className="text-slate-500">{lang === 'en' ? 'Skills:' : 'कौशल:'}</span>
                  {job.skillsMatched.map(s => (
                    <span key={s} className="text-emerald-800 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded text-[11px] font-medium">
                      ✓ {s}
                    </span>
                  ))}
                  {job.skillsMissing.map(s => (
                    <span key={s} className="text-amber-800 bg-amber-50 border border-amber-200/60 px-2 py-0.5 rounded text-[11px] font-medium">
                      ! {s}
                    </span>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
                  <div className="text-xs text-slate-500 font-mono-data">
                    {job.vacancies} {lang === 'en' ? 'positions open · Direct HR Dispatch' : 'रिक्तियां · सीधा एचआर प्रेषण'}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedJobDetail(job)}
                      className="px-3.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      {lang === 'en' ? 'Job Details' : 'विवरण देखें'}
                    </button>

                    {/* Send Resume to HR Button */}
                    <button
                      onClick={() => handleApply('Direct HR Push', job.employer, job.title)}
                      className={`px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer ${
                        isApplied
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{isApplied ? (lang === 'en' ? 'Resume Dispatched ✓' : 'रेज़्यूमे प्रेषित ✓') : (lang === 'en' ? 'Send Resume to HR' : 'एचआर को भेजें')}</span>
                    </button>

                    {/* WhatsApp HR Direct Button */}
                    {job.contactMethod === 'WhatsApp' ? (
                      <button
                        onClick={() => handleApply('WhatsApp', job.employer, job.title)}
                        className="px-3.5 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>WhatsApp</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleApply('Direct Call', job.employer, job.title)}
                        className="px-3.5 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Call</span>
                      </button>
                    )}
                  </div>
                </div>

              </div>
            );
          })
        )}
      </div>

      {/* Job Detail Modal */}
      {selectedJobDetail && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-in zoom-in-95 duration-200">
            
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10.5px] font-mono-data text-blue-700 font-bold uppercase">
                  VERIFIED EMPLOYER OPPORTUNITY
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">
                  {lang === 'en' ? selectedJobDetail.title : selectedJobDetail.titleHi}
                </h3>
                <div className="text-xs text-slate-500 mt-0.5">
                  {selectedJobDetail.employer} · {selectedJobDetail.location}
                </div>
              </div>
              <button
                onClick={() => setSelectedJobDetail(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Commute and Stipend Spec */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-200">
                <span className="text-slate-500 font-mono-data block">STIPEND / SALARY</span>
                <strong className="text-emerald-800 text-sm font-mono-data">{selectedJobDetail.stipend}</strong>
              </div>
              <div className="p-3 rounded-xl bg-blue-50/50 border border-blue-200">
                <span className="text-slate-500 font-mono-data block">DISTANCE FROM HOME</span>
                <strong className="text-blue-800 text-sm font-mono-data">{selectedJobDetail.distanceKm} km</strong>
              </div>
            </div>

            {/* Workplace Terms */}
            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-slate-900 font-mono-data uppercase">
                {lang === 'en' ? 'Workplace Terms & Facilities' : 'कार्यस्थल सुविधाएं व नियम'}
              </h4>
              <ul className="space-y-1.5 text-slate-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Government NATS apprenticeship certificate provided upon completion.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Direct bank transfer stipend on 5th of every month (PF/ESIC eligible).</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Free safety kit and transport allowance included for candidates &gt; 10km.</span>
                </li>
              </ul>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                onClick={() => setSelectedJobDetail(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200 cursor-pointer"
              >
                {lang === 'en' ? 'Close' : 'बंद करें'}
              </button>
              <button
                onClick={() => {
                  handleApply('Direct HR Push', selectedJobDetail.employer, selectedJobDetail.title);
                  setSelectedJobDetail(null);
                }}
                className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{lang === 'en' ? 'Send Resume to HR Now' : 'एचआर को रेज़्यूमे भेजें'}</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
