import React, { useState } from 'react';
import { Language, JobListing } from '../../types';
import { JOBS_DATA } from '../../data/researchData';
import { 
  MapPin, 
  Phone, 
  MessageSquare, 
  ShieldCheck, 
  Briefcase, 
  CheckCircle2
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
  const [distanceRadius, setDistanceRadius] = useState<number>(20);
  const [jobTypeFilter, setJobTypeFilter] = useState<string>('all');
  const [actionAlert, setActionAlert] = useState<string | null>(null);

  const allJobs = [
    ...(JOBS_DATA.priya || []),
    ...(JOBS_DATA.rahul || []),
    ...(JOBS_DATA.sunita || []),
  ];

  const filteredJobs = allJobs.filter(j => {
    if (j.distanceKm > distanceRadius) return false;
    if (jobTypeFilter !== 'all' && j.type !== jobTypeFilter) return false;
    return true;
  });

  const handleApply = (method: string, employer: string, jobTitle: string) => {
    setActionAlert(
      lang === 'en'
        ? `Dispatching application via ${method} to ${employer}...`
        : `${employer} को ${method} द्वारा आवेदन भेजा जा रहा है...`
    );
    setTimeout(() => setActionAlert(null), 3500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6">
      
      {/* Toast Alert */}
      {actionAlert && (
        <div className="fixed bottom-6 right-6 z-50 bg-white border border-blue-600 text-slate-900 text-xs px-4 py-3 rounded-lg shadow-lg flex items-center gap-2.5">
          <MessageSquare className="w-4 h-4 text-blue-600 shrink-0" />
          <span className="font-medium">{actionAlert}</span>
        </div>
      )}

      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 text-xs font-mono-data text-blue-700 font-semibold">
          <span>CLOSING THE LOOP TO OPPORTUNITY</span>
          <span>·</span>
          <span>SCREEN 07</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-slate-900">
          {lang === 'en' ? 'Hyperlocal Jobs & Apprenticeship Listings' : 'सत्यापित स्थानीय नौकरियां एवं शिक्षुता'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-2xl">
          {lang === 'en'
            ? 'Real openings filtered by your actual commute radius with government-fixed stipends and direct WhatsApp dispatch.'
            : 'आपके घर से तय दूरी के भीतर उपलब्ध अवसर, स्पष्ट मानदेय एवं सीधा व्हाट्सएप संपर्क।'}
        </p>
      </div>

      {/* Commute Distance & Type Filtering */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        
        {/* Distance Radius */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-600 font-medium">
            {lang === 'en' ? 'Commute Radius:' : 'अधिकतम दूरी:'}
          </span>
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
            {[10, 20, 30].map(dist => (
              <button
                key={dist}
                onClick={() => setDistanceRadius(dist)}
                className={`px-3 py-1 rounded font-mono-data transition-all ${
                  distanceRadius === dist
                    ? 'bg-white text-slate-900 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                ≤ {dist} km
              </button>
            ))}
          </div>
        </div>

        {/* Opportunity Type */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg border border-slate-200 text-xs">
          <button
            onClick={() => setJobTypeFilter('all')}
            className={`px-3 py-1 rounded transition-all ${
              jobTypeFilter === 'all'
                ? 'bg-white text-slate-900 font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {lang === 'en' ? 'All' : 'सभी'}
          </button>
          <button
            onClick={() => setJobTypeFilter('Apprenticeship')}
            className={`px-3 py-1 rounded transition-all ${
              jobTypeFilter === 'Apprenticeship'
                ? 'bg-white text-slate-900 font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {lang === 'en' ? 'Apprenticeships' : 'शिक्षुता'}
          </button>
          <button
            onClick={() => setJobTypeFilter('Direct Job')}
            className={`px-3 py-1 rounded transition-all ${
              jobTypeFilter === 'Direct Job'
                ? 'bg-white text-slate-900 font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {lang === 'en' ? 'Direct Jobs' : 'सीधी नौकरी'}
          </button>
        </div>

      </div>

      {/* Jobs Feed */}
      <div className="space-y-4">
        {filteredJobs.length === 0 ? (
          <div className="text-center py-12 p-6 rounded-2xl bg-white border border-slate-200 space-y-2">
            <p className="text-slate-700 text-sm font-medium">
              {lang === 'en' ? 'No opportunities found within this radius.' : 'इस दूरी के दायरे में कोई अवसर नहीं मिला।'}
            </p>
            <button
              onClick={() => setDistanceRadius(30)}
              className="text-xs text-blue-700 hover:underline font-semibold"
            >
              {lang === 'en' ? 'Expand to 30km radius' : 'दायरा बढ़ाकर ३० किमी करें'}
            </button>
          </div>
        ) : (
          filteredJobs.map(job => (
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
                  </div>
                  <div className="text-xs text-slate-500">
                    {job.employer} · <strong className="text-slate-700 font-normal">{job.location}</strong>
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <div className="text-base font-bold text-emerald-800 font-mono-data">
                    {job.stipend}
                  </div>
                  <div className="text-xs text-blue-700 font-mono-data font-semibold">
                    📍 {job.distanceKm} km from home
                  </div>
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
                  {job.vacancies} {lang === 'en' ? 'positions open · NATS Contract' : 'रिक्तियां · अप्रेंटिसशिप अनुबंध'}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedJobDetail(job)}
                    className="px-3.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-100 transition-colors"
                  >
                    {lang === 'en' ? 'Job Details (7A)' : 'विवरण देखें'}
                  </button>

                  {job.contactMethod === 'WhatsApp' ? (
                    <button
                      onClick={() => handleApply('WhatsApp', job.employer, job.title)}
                      className="px-4 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors flex items-center gap-1.5 shadow-xs"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>WhatsApp HR</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleApply('Direct Call', job.employer, job.title)}
                      className="px-4 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors flex items-center gap-1.5 shadow-xs"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call Hiring Desk</span>
                    </button>
                  )}
                </div>
              </div>

            </div>
          ))
        )}
      </div>

      {/* Screen 7a: Job/Internship Detail Modal */}
      {selectedJobDetail && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl">
            
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-mono-data text-blue-700 font-semibold">OPPORTUNITY SPECIFICATION (7A)</span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">
                  {lang === 'en' ? selectedJobDetail.title : selectedJobDetail.titleHi}
                </h3>
                <div className="text-xs text-slate-500 mt-0.5">
                  {selectedJobDetail.employer} · {selectedJobDetail.location}
                </div>
              </div>
              <button
                onClick={() => setSelectedJobDetail(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            {/* Commute and Stipend Spec */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-emerald-50/50 border border-emerald-200">
                <span className="text-slate-500 font-mono-data block">STIPEND / SALARY</span>
                <strong className="text-emerald-800 text-sm font-mono-data">{selectedJobDetail.stipend}</strong>
              </div>
              <div className="p-3 rounded-lg bg-blue-50/50 border border-blue-200">
                <span className="text-slate-500 font-mono-data block">DISTANCE FROM HOME</span>
                <strong className="text-blue-800 text-sm font-mono-data">{selectedJobDetail.distanceKm} km</strong>
              </div>
            </div>

            {/* Working Environment Details */}
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
                className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200"
              >
                {lang === 'en' ? 'Close' : 'बंद करें'}
              </button>
              <button
                onClick={() => {
                  handleApply(selectedJobDetail.contactMethod, selectedJobDetail.employer, selectedJobDetail.title);
                  setSelectedJobDetail(null);
                }}
                className="px-5 py-2 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 shadow-xs"
              >
                {lang === 'en' ? 'Direct Dispatch Application' : 'सीधे आवेदन भेजें'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
