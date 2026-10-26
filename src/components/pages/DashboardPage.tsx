import React, { useState, useEffect } from 'react';
import { Language, UserProfile } from '../../types';
import { PERSONAS } from '../../data/researchData';
import { 
  ShieldCheck, 
  ArrowRight,
  Briefcase,
  FileText,
  CheckCircle2,
  Clock,
  Sparkles,
  ExternalLink,
  MessageSquare
} from 'lucide-react';

interface DashboardPageProps {
  lang: Language;
  selectedPersonaId: string;
  onNavigate: (page: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  lang,
  selectedPersonaId,
  onNavigate,
}) => {
  const currentPersona = PERSONAS.find(p => p.id === selectedPersonaId) || PERSONAS[0];

  // Retrieve active logged in user from localStorage if available
  const [activeUser, setActiveUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('ks_active_user');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      name: currentPersona.name,
      phone: '9839048261',
      email: `${currentPersona.id}.kaushal@gmail.com`,
      location: currentPersona.location.split('(')[0].trim(),
      targetRole: currentPersona.targetRole,
      education: 'Graduation / ITI Diploma',
      experienceYears: 1,
      skills: ['Tally Prime', 'Excel', 'GST Compliance'],
      bio: currentPersona.primaryGoal,
      resumeBuilt: true,
      atsScore: currentPersona.baselineScore + 18,
    };
  });

  // Retrieve applied jobs from localStorage
  const [appliedJobs, setAppliedJobs] = useState<Array<{ id: string; employer: string; title: string; time: string; appId: string }>>(() => {
    try {
      const saved = localStorage.getItem('ks_applied_jobs');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: 'init-1',
        employer: selectedPersonaId === 'priya' 
          ? 'Kedia Logistics & Cold Chain Pvt Ltd' 
          : 'Tata Power Solar EPC Partner',
        title: selectedPersonaId === 'priya' 
          ? 'Junior GST & Accounts Executive' 
          : 'Rooftop Solar PV Grid Technician',
        time: 'Yesterday',
        appId: 'KS-APP-4821'
      }
    ];
  });

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6">
      
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 space-y-6 shadow-sm">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 border-2 border-blue-200 flex items-center justify-center text-blue-700 font-display font-bold text-xl shadow-xs">
              {activeUser.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-display font-bold text-slate-900">
                  {activeUser.name}
                </h1>
                <span className="text-blue-700" title="State Verified Candidate">
                  <ShieldCheck className="w-5 h-5" />
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {activeUser.targetRole} · {activeUser.location}
              </p>
              <div className="text-[11px] font-mono-data text-emerald-700 mt-1 font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Active Profile · Direct HR Dispatch Enabled</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('resume')}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'Edit Resume' : 'रेज़्यूमे एडिट करें'}</span>
            </button>
            <button
              onClick={() => onNavigate('assessment')}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              {lang === 'en' ? 'Retake Diagnostic' : 'पुनः परीक्षा दें'}
            </button>
          </div>
        </div>

        {/* 3 Key Metric Tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="text-xs text-slate-500 font-medium">
              {lang === 'en' ? 'Resume ATS Readiness' : 'एटीएस उपयुक्तता'}
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono-data text-slate-900">
                {activeUser.atsScore || 88}%
              </span>
              <span className="text-xs text-emerald-700 font-mono-data font-semibold">
                High Match
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-mono-data">
              Optimized for UP industrial recruiters
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="text-xs text-slate-500 font-medium">
              {lang === 'en' ? 'Active Training Module' : 'सक्रिय प्रशिक्षण'}
            </span>
            <div className="text-xs font-bold text-blue-800 truncate">
              {selectedPersonaId === 'priya' ? 'Practical GST & 2B Workshop' : selectedPersonaId === 'rahul' ? 'PM Surya Ghar Solar Inverters' : 'CSC Citizen Operations'}
            </div>
            <div className="text-[11px] text-slate-500 font-mono-data">
              65% Completed · Lab Practical Ready
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="text-xs text-slate-500 font-medium">
              {lang === 'en' ? 'Applications Sent to HR' : 'एचआर को भेजे गए आवेदन'}
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono-data text-emerald-700">
                {appliedJobs.length}
              </span>
              <span className="text-xs text-slate-500 font-mono-data">
                firms reviewing
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-mono-data">
              Direct HR Dispatch Pipeline
            </p>
          </div>

        </div>

      </div>

      {/* Applied Jobs Pipeline Tracker */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-display font-bold text-slate-900 flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-blue-600" />
            <span>{lang === 'en' ? 'Direct HR Applications & Tracking Status' : 'सीधे भेजे गए आवेदन एवं लाइव स्टेटस'}</span>
          </h2>
          <span className="text-xs font-mono-data text-slate-500">
            {appliedJobs.length} Active Records
          </span>
        </div>

        <div className="space-y-3">
          {appliedJobs.map((app, idx) => (
            <div
              key={idx}
              className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-300 transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-sm text-slate-900">{app.employer}</span>
                  <span className="text-[10px] font-mono-data text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>Dispatched to HR Desks</span>
                  </span>
                </div>
                <div className="text-xs text-blue-700 font-medium">{app.title}</div>
                <div className="text-[11px] text-slate-400 font-mono-data">
                  Tracking ID: {app.appId} · Applied: {app.time}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`https://wa.me/919839048261?text=Hello%2C%20following%20up%20on%20my%20application%20${app.appId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp HR</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
        <button
          onClick={() => onNavigate('gap-report')}
          className="text-xs text-slate-600 hover:text-blue-700 transition-colors font-medium cursor-pointer"
        >
          {lang === 'en' ? '← View Skill Gap Report' : '← कौशल अंतर रिपोर्ट'}
        </button>

        <button
          onClick={() => onNavigate('jobs')}
          className="text-xs text-blue-700 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
        >
          <span>{lang === 'en' ? 'Browse More Opportunities' : 'और नौकरियां देखें'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
};
