import React from 'react';
import { Language } from '../../types';
import { PERSONAS, SKILLS_DATA } from '../../data/researchData';
import { 
  ArrowRight, 
  Check, 
  MapPin, 
  BookOpen, 
  ShieldCheck,
  TrendingUp,
  FileCheck
} from 'lucide-react';

interface GapReportPageProps {
  lang: Language;
  selectedPersonaId: string;
  onNavigate: (page: string) => void;
}

export const GapReportPage: React.FC<GapReportPageProps> = ({
  lang,
  selectedPersonaId,
  onNavigate,
}) => {
  const currentPersona = PERSONAS.find(p => p.id === selectedPersonaId) || PERSONAS[0];
  const skills = SKILLS_DATA[selectedPersonaId] || [];

  const totalRequired = skills.reduce((acc, s) => acc + s.requiredLevel, 0);
  const totalCurrent = skills.reduce((acc, s) => acc + Math.min(s.currentLevel, s.requiredLevel), 0);
  const readinessScore = Math.round((totalCurrent / totalRequired) * 100);

  const criticalGaps = skills.filter(s => s.gap > 20);

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6">
      
      {/* Top Banner (Clean White Card with Royal Blue Accents) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 space-y-6 shadow-sm">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono-data text-emerald-700 font-semibold mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>OFFICIAL DIAGNOSTIC REPORT GENERATED</span>
              <span>·</span>
              <span>LUCKNOW PILOT</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-slate-900">
              {currentPersona.name} · {lang === 'en' ? 'Personalised Skill Gap Analysis' : 'व्यक्तिगत कौशल अंतर विश्लेषण'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              {lang === 'en'
                ? `Evaluated against current 2026 employer benchmarks in ${currentPersona.location.split('(')[0]}.`
                : `उत्तर प्रदेश के उद्योगों की वर्तमान मांग और वेतन मानकों के आधार पर विश्लेषित।`}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('dashboard')}
              className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-semibold transition-colors"
            >
              {lang === 'en' ? 'View Profile Dashboard' : 'डैशबोर्ड देखें'}
            </button>
          </div>
        </div>

        {/* 2-Column Key Outcome Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="text-xs text-slate-600 font-medium">
              {lang === 'en' ? 'Current Industry Match' : 'वर्तमान उद्योग उपयुक्तता'}
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-display font-bold text-slate-900 font-mono-data">
                {readinessScore}%
              </span>
              <span className="text-xs font-mono-data text-amber-700 font-medium">
                · {criticalGaps.length} critical skills to close
              </span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mt-3">
              <div
                className="h-full bg-blue-600 rounded-full"
                style={{ width: `${readinessScore}%` }}
              />
            </div>
          </div>

          <div className="p-5 rounded-xl bg-emerald-50/50 border border-emerald-200 space-y-2">
            <span className="text-xs text-emerald-900 font-medium">
              {lang === 'en' ? 'Projected Starting Monthly Wage' : 'संभावित प्रारंभिक मासिक मानदेय'}
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-display font-bold text-emerald-800 font-mono-data">
                {selectedPersonaId === 'priya' ? '₹24,000' : selectedPersonaId === 'rahul' ? '₹18,500' : '₹11,000'}
              </span>
              <span className="text-xs text-slate-500 font-mono-data">/ mo</span>
            </div>
            <p className="text-[11px] text-emerald-700 font-mono-data font-semibold mt-2">
              ↑ +35% wage unlock immediately upon completing 1 free NCVT module
            </p>
          </div>

        </div>
      </div>

      {/* Granular Skill Gap Breakdown */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-display font-bold text-slate-900">
            {lang === 'en' ? 'Itemized Skill Delta (Your Level vs Industry Requirement)' : 'कौशल अंतर विवरण (वर्तमान स्तर vs उद्योग की मांग)'}
          </h2>
          <span className="text-xs font-mono-data text-slate-500">
            {skills.length} Evaluated Parameters
          </span>
        </div>

        <div className="space-y-3">
          {skills.map(s => {
            const hasGap = s.gap > 0;
            return (
              <div
                key={s.id}
                className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">
                        {lang === 'en' ? s.name : s.nameHi}
                      </span>
                      <span className="text-[11px] font-mono-data text-slate-500">
                        · {s.category}
                      </span>
                    </div>
                    <div className="text-xs text-emerald-700 font-mono-data font-semibold mt-0.5">
                      {lang === 'en' ? 'Estimated monthly salary boost:' : 'वेतन वृद्धि:'} {s.wageUplift}
                    </div>
                  </div>

                  <div className="text-left sm:text-right">
                    <div className="text-xs font-mono-data font-bold text-slate-900">
                      {s.currentLevel}% Current / {s.requiredLevel}% Required
                    </div>
                    <div className={`text-xs font-mono-data font-semibold ${hasGap ? 'text-amber-600' : 'text-emerald-600'}`}>
                      {hasGap ? `Δ -${s.gap}% Skill Deficit` : '✓ Fully Met'}
                    </div>
                  </div>
                </div>

                <div className="relative w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full"
                    style={{ width: `${s.currentLevel}%` }}
                  />
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-slate-900 z-10"
                    style={{ left: `${s.requiredLevel}%` }}
                    title={`Required: ${s.requiredLevel}%`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two Direct Action Steps */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
        
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm">
              {lang === 'en' ? '1. Close Gaps with Free Courses' : '१. निःशुल्क कोर्स से अंतर समाप्त करें'}
            </h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              {lang === 'en'
                ? 'Government-sponsored short modules (12-24h) designed to close your specific gaps.'
                : 'कौशल विकास मिशन द्वारा प्रमाणित छोटे पाठ, जो सीधे आपकी कमियों को दूर करते हैं।'}
            </p>
          </div>
          <button
            onClick={() => onNavigate('courses')}
            className="w-full py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
          >
            <span>{lang === 'en' ? 'Browse Recommended Courses' : 'अनुशंसित कोर्स देखें'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm">
              {lang === 'en' ? '2. Apply to Nearby Apprenticeships' : '२. स्थानीय नौकरियों में आवेदन करें'}
            </h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              {lang === 'en'
                ? 'Verified listings within 25km of your location with direct WhatsApp contact.'
                : 'घर से २५ किमी के दायरे में उपलब्ध सत्यापित अवसर, सीधे नियोक्ताओं से संपर्क सहित।'}
            </p>
          </div>
          <button
            onClick={() => onNavigate('jobs')}
            className="w-full py-2.5 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 flex items-center justify-center gap-2 transition-all shadow-sm"
          >
            <span>{lang === 'en' ? 'View Matching Local Jobs' : 'उपलब्ध अवसर देखें'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

    </div>
  );
};
