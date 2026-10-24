import React from 'react';
import { Language } from '../../types';
import { PERSONAS } from '../../data/researchData';
import { 
  ShieldCheck, 
  ArrowRight
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

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6">
      
      {/* Top Banner (Shows Persistence & Progress Over Time for Hackathon Rubric) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 space-y-6 shadow-sm">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 border-2 border-blue-200 flex items-center justify-center text-blue-700 font-display font-bold text-xl shadow-xs">
              {currentPersona.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-display font-bold text-slate-900">
                  {currentPersona.name}
                </h1>
                <span className="text-blue-700" title="State Verified Candidate">
                  <ShieldCheck className="w-5 h-5" />
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {lang === 'en' ? currentPersona.role : currentPersona.roleHi} · {currentPersona.location}
              </p>
              <div className="text-[11px] font-mono-data text-emerald-700 mt-1 font-medium">
                Candidate ID: KS-UP-2026-{selectedPersonaId.toUpperCase()}
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('assessment')}
            className="px-4 py-2 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold hover:bg-blue-100 transition-colors"
          >
            {lang === 'en' ? 'Retake Assessment' : 'पुनः मूल्यांकन करें'}
          </button>
        </div>

        {/* 3 Sustainability KPI Tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="text-xs text-slate-500 font-medium">
              {lang === 'en' ? 'Employability Index' : 'रोजगार उपयुक्तता'}
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono-data text-slate-900">
                {currentPersona.baselineScore}%
              </span>
              <span className="text-xs text-emerald-700 font-mono-data font-semibold">
                ↑ +14% this month
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-mono-data">
              {lang === 'en' ? 'Tier 1 regional candidate pool' : 'शीर्ष उम्मीदवार समूह'}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="text-xs text-slate-500 font-medium">
              {lang === 'en' ? 'Active In-Progress Module' : 'सक्रिय प्रशिक्षण पाठ'}
            </span>
            <div className="text-sm font-bold text-blue-800">
              {selectedPersonaId === 'priya' ? 'Practical GST 2026' : selectedPersonaId === 'rahul' ? 'PM Surya Ghar Solar' : 'CSC Village Operator'}
            </div>
            <div className="text-[11px] text-slate-500 font-mono-data">
              65% Completed · Lab Practical Scheduled
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="text-xs text-slate-500 font-medium">
              {lang === 'en' ? 'Verified Badges Earned' : 'प्रमाणित डिजिटल बैज'}
            </span>
            <div className="flex items-center gap-1.5 pt-1">
              <span className="text-[11px] font-mono-data text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-medium">
                MSME Level 1
              </span>
              <span className="text-[11px] font-mono-data text-blue-800 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded font-medium">
                NATS Ready
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-mono-data">
              State Blockchain Verified
            </p>
          </div>

        </div>

      </div>

      {/* Persistence Tracker: Applications & Interview Schedule */}
      <div className="space-y-4">
        <h2 className="text-base font-display font-bold text-slate-900">
          {lang === 'en' ? 'Application Tracking & Recruiter Updates' : 'आवेदन स्थिति एवं भर्ती सूचनाएं'}
        </h2>

        <div className="space-y-3">
          <div className="p-4 rounded-xl bg-white border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-slate-900">
                  {selectedPersonaId === 'priya' 
                    ? 'Kedia Logistics & Cold Chain' 
                    : selectedPersonaId === 'rahul' 
                      ? 'Tata Power Solar EPC Partner' 
                      : 'CSC e-Governance Services'}
                </span>
                <span className="text-[10px] font-mono-data text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-semibold">
                  Interview Scheduled
                </span>
              </div>
              <div className="text-xs text-slate-500">
                Transport Nagar, Lucknow · WhatsApp confirmation received
              </div>
            </div>

            <div className="text-xs font-mono-data text-blue-700 font-semibold">
              Tomorrow, 11:30 AM
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-slate-900">
                  {selectedPersonaId === 'priya' 
                    ? 'M.K. Rastogi & Associates (CA Firm)' 
                    : selectedPersonaId === 'rahul' 
                      ? 'UP Power Transmission Substation' 
                      : 'Bank of Baroda CSP Point'}
                </span>
                <span className="text-[10px] font-mono-data text-blue-800 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded font-semibold">
                  Documents Verified
                </span>
              </div>
              <div className="text-xs text-slate-500">
                NATS Contract Approved · Stipend ₹14,500/mo
              </div>
            </div>

            <div className="text-xs font-mono-data text-slate-500">
              Applied 3 days ago
            </div>
          </div>
        </div>
      </div>

      {/* Quick Navigation Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
        <button
          onClick={() => onNavigate('gap-report')}
          className="text-xs text-slate-600 hover:text-blue-700 transition-colors font-medium"
        >
          {lang === 'en' ? '← View Full Gap Report' : '← कौशल अंतर रिपोर्ट'}
        </button>

        <button
          onClick={() => onNavigate('jobs')}
          className="text-xs text-blue-700 hover:underline flex items-center gap-1 font-semibold"
        >
          <span>{lang === 'en' ? 'Browse More Opportunities' : 'और नौकरियां देखें'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
};
