import React from 'react';
import { Language } from '../../types';
import { Check, ArrowRight } from 'lucide-react';

interface OnboardingPageProps {
  lang: Language;
  setLang: (lang: Language) => void;
  selectedPersonaId: string;
  setSelectedPersonaId: (id: string) => void;
  onNavigate: (page: string) => void;
}

export const OnboardingPage: React.FC<OnboardingPageProps> = ({
  lang,
  setLang,
  selectedPersonaId,
  setSelectedPersonaId,
  onNavigate,
}) => {
  const roles = [
    {
      id: 'priya',
      titleEn: 'College Graduate (B.Com / Arts / Science)',
      titleHi: 'कॉलेज स्नातक (बी.कॉम / बीए / बीएससी)',
      descEn: 'Looking to turn general degree into specialized, well-paying accounting or finance jobs.',
      descHi: 'डिग्री को अकाउंटिंग, जीएसटी व कॉरपोरेट जॉब्स में बदलने के इच्छुक।',
      personaName: 'Priya (Lucknow)',
      badge: 'Tier-2 College'
    },
    {
      id: 'rahul',
      titleEn: 'ITI / Polytechnic / Vocational Trainee',
      titleHi: 'आईटीआई / पॉलिटेक्निक प्रशिक्षु',
      descEn: 'Final year or passed out; looking for practical NCVT apprenticeship near hometown.',
      descHi: 'अंतिम वर्ष या पास; घर के पास प्रैक्टिकल अप्रेंटिसशिप व मानदेय की तलाश।',
      personaName: 'Rahul (Kanpur / Unnao)',
      badge: 'Technical Trade'
    },
    {
      id: 'sunita',
      titleEn: 'Rural Job Seeker / 1st-Gen Smartphone User',
      titleHi: 'ग्रामीण युवा / प्रथम पीढ़ी शिक्षार्थी',
      descEn: '10th/12th pass; looking for dignified local village work (CSC center, banking point).',
      descHi: '१०वीं/१२वीं पास; गांव में सीएससी या बैंकिंग सेवा केंद्र में काम की तलाश।',
      personaName: 'Sunita (Barabanki)',
      badge: 'Village Youth'
    }
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-8 py-6">
      
      {/* Step Indicator */}
      <div className="flex items-center justify-between text-xs font-mono-data text-slate-500 pb-3 border-b border-slate-200">
        <span className="text-blue-700 font-bold">STEP 01 OF 02</span>
        <span>ONBOARDING: LANGUAGE & IDENTITY</span>
      </div>

      {/* Header */}
      <div className="space-y-2 text-center">
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-slate-900">
          {lang === 'en' ? 'Welcome to Kaushal Setu' : 'कौशल सेतु में आपका स्वागत है'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
          {lang === 'en'
            ? 'Choose your preferred language and tell us who you are so we can tailor the right skill assessment.'
            : 'अपनी पसंदीदा भाषा और प्रोफाइल चुनें ताकि हम आपके अनुसार उचित कौशल मूल्यांकन तैयार कर सकें।'}
        </p>
      </div>

      {/* 1. Language Selection (Clean White Cards) */}
      <div className="space-y-3">
        <label className="text-xs font-mono-data text-slate-600 block uppercase tracking-wider font-semibold">
          {lang === 'en' ? '1. Select Preferred Language' : '१. भाषा का चयन करें'}
        </label>
        
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setLang('en')}
            className={`p-4 rounded-xl border text-left transition-all ${
              lang === 'en'
                ? 'bg-blue-50/70 border-blue-600 text-slate-900 shadow-sm ring-1 ring-blue-600'
                : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-sm text-slate-900">English</span>
              {lang === 'en' && <Check className="w-4 h-4 text-blue-600" />}
            </div>
            <p className="text-xs text-slate-500">Standard vocational benchmarks & terms</p>
          </button>

          <button
            onClick={() => setLang('hi')}
            className={`p-4 rounded-xl border text-left transition-all ${
              lang === 'hi'
                ? 'bg-blue-50/70 border-blue-600 text-slate-900 shadow-sm ring-1 ring-blue-600'
                : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-sm text-slate-900 font-hindi">हिंदी (Hindi)</span>
              {lang === 'hi' && <Check className="w-4 h-4 text-blue-600" />}
            </div>
            <p className="text-xs text-slate-500 font-hindi">सरल भाषा, बिना किसी जटिल तकनीकी शब्दों के</p>
          </button>
        </div>
      </div>

      {/* 2. Role Identity Selection */}
      <div className="space-y-3 pt-2">
        <label className="text-xs font-mono-data text-slate-600 block uppercase tracking-wider font-semibold">
          {lang === 'en' ? '2. Who are you? (Select your background)' : '२. आप कौन हैं? (अपनी प्रोफाइल चुनें)'}
        </label>

        <div className="space-y-3">
          {roles.map(r => {
            const isSelected = selectedPersonaId === r.id;
            return (
              <div
                key={r.id}
                onClick={() => setSelectedPersonaId(r.id)}
                className={`p-4 sm:p-5 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-blue-50/70 border-blue-600 shadow-sm ring-1 ring-blue-600'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm text-slate-900">
                        {lang === 'en' ? r.titleEn : r.titleHi}
                      </h3>
                      <span className="text-[10px] font-mono-data text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded font-semibold">
                        {r.badge}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {lang === 'en' ? r.descEn : r.descHi}
                    </p>
                  </div>

                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                    isSelected ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300 bg-white'
                  }`}>
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </div>

                <div className="mt-2.5 pt-2 border-t border-slate-100 text-[11px] font-mono-data text-slate-500">
                  Target Profile: <strong className="text-slate-700 font-medium">{r.personaName}</strong>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="pt-4 flex items-center justify-between">
        <button
          onClick={() => onNavigate('landing')}
          className="text-xs text-slate-600 hover:text-slate-900 transition-colors font-medium"
        >
          {lang === 'en' ? '← Back to Home' : '← होम पेज पर जाएं'}
        </button>

        <button
          onClick={() => onNavigate('auth')}
          className="px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold text-xs hover:bg-blue-700 active:scale-[0.98] transition-all shadow-sm flex items-center gap-2"
        >
          <span>{lang === 'en' ? 'Continue to Quick Sign-In' : 'लॉगिन / साइन-अप करें'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
};
