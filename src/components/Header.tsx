import React, { useState } from 'react';
import { Language } from '../types';
import { 
  Download, 
  Menu, 
  X, 
  LayoutDashboard, 
  Home, 
  UserCheck, 
  LogIn, 
  HelpCircle, 
  FileSpreadsheet, 
  BookOpen, 
  Briefcase, 
  Info, 
  Palette
} from 'lucide-react';

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  lang: Language;
  setLang: (lang: Language) => void;
  onOpenPdfExport: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  onNavigate,
  lang,
  setLang,
  onOpenPdfExport,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const sitemapPages = [
    { id: 'landing', labelEn: '1. Landing / Home', labelHi: '१. मुख्य पृष्ठ', icon: Home },
    { id: 'onboarding', labelEn: '2. Onboarding (Language & Role)', labelHi: '२. भाषा व प्रोफाइल चयन', icon: UserCheck },
    { id: 'auth', labelEn: '3. Sign Up / Log In', labelHi: '३. साइन अप / लॉगिन', icon: LogIn },
    { id: 'assessment', labelEn: '4. Skill Assessment (Diagnostic)', labelHi: '४. कौशल परीक्षा', icon: HelpCircle },
    { id: 'gap-report', labelEn: '5. Skill Gap Report (Results)', labelHi: '५. कौशल अंतर रिपोर्ट', icon: FileSpreadsheet },
    { id: 'courses', labelEn: '6. Course Recommendations (6a Detail)', labelHi: '६. अनुशंसित कोर्स', icon: BookOpen },
    { id: 'jobs', labelEn: '7. Job & Apprenticeship Listings (7a Detail)', labelHi: '७. स्थानीय नौकरियां', icon: Briefcase },
    { id: 'dashboard', labelEn: '8. Profile / Dashboard', labelHi: '८. उम्मीदवार डैशबोर्ड', icon: LayoutDashboard },
    { id: 'about', labelEn: '9. About / Impact', labelHi: '९. सामाजिक प्रभाव', icon: Info },
    { id: 'specs', labelEn: 'Design Tokens & Research', labelHi: 'डिजाइन सिस्टम व शोध', icon: Palette },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 lg:px-8 py-2.5 transition-colors no-print shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Left: Authoritative Brand Lockup with Subtitle & Live Indicator */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-2.5 text-left group focus:outline-none"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xs shadow-sm shadow-blue-500/25 group-hover:bg-blue-700 transition-colors shrink-0">
              KS
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-slate-900 text-sm tracking-tight leading-tight whitespace-nowrap group-hover:text-blue-700 transition-colors">
                {lang === 'en' ? 'KAUSHAL SETU' : 'कौशल सेतु'}
              </span>
              <span className="text-[10.5px] text-slate-500 font-medium tracking-tight hidden sm:block leading-none mt-0.5">
                {lang === 'en' ? 'UP Youth Skills & Trade Bridge' : 'उत्तर प्रदेश कौशल एवं रोजगार सेतु'}
              </span>
            </div>
          </button>

          {/* Live Industrial Activity Micro-Badge */}
          <div className="hidden lg:flex items-center gap-1.5 pl-3 border-l border-slate-200 text-[11px] font-medium text-slate-500">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>{lang === 'en' ? 'Live Hiring Feeds' : 'सक्रिय औद्योगिक मानक'}</span>
          </div>
        </div>

        {/* Center: Balanced Primary Navigation (Grounded Segmented Control) */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-100/90 p-1 rounded-xl border border-slate-200/80 text-xs shadow-2xs">
          {[
            { id: 'landing', labelEn: 'Home', labelHi: 'होम' },
            { id: 'assessment', labelEn: 'Assessment', labelHi: 'परीक्षा' },
            { id: 'gap-report', labelEn: 'Gap Report', labelHi: 'अंतर रिपोर्ट' },
            { id: 'courses', labelEn: 'Courses', labelHi: 'कोर्स' },
            { id: 'jobs', labelEn: 'Jobs', labelHi: 'नौकरियां' },
            { id: 'dashboard', labelEn: 'Dashboard', labelHi: 'डैशबोर्ड' },
            { id: 'about', labelEn: 'Impact', labelHi: 'प्रभाव' },
          ].map(tab => {
            const isActive = currentPage === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onNavigate(tab.id)}
                className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-white text-blue-700 font-bold shadow-xs border border-blue-100/80'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                {lang === 'en' ? tab.labelEn : tab.labelHi}
              </button>
            );
          })}
        </nav>

        {/* Right: Actions Cluster (Language Switcher + PDF Export + Mobile Menu) */}
        <div className="flex items-center gap-2.5 shrink-0">
          
          {/* Language Selector (Bilingual Toggle) */}
          <div className="flex items-center bg-slate-100 rounded-lg border border-slate-200 p-0.5 text-xs">
            <button
              onClick={() => setLang('en')}
              className={`px-2.5 py-1 rounded-md font-mono-data text-xs transition-colors ${
                lang === 'en'
                  ? 'bg-white text-blue-700 font-bold shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLang('hi')}
              className={`px-2.5 py-1 rounded-md font-hindi text-xs transition-colors ${
                lang === 'hi'
                  ? 'bg-white text-blue-700 font-bold shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              हिंदी
            </button>
          </div>

          {/* Download PDF Button: Vibrant Royal Blue */}
          <button
            onClick={onOpenPdfExport}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.98] transition-all shadow-xs whitespace-nowrap shrink-0"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{lang === 'en' ? 'PDF Report' : 'पीडीएफ रिपोर्ट'}</span>
          </button>

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg bg-slate-100 border border-slate-200"
            aria-label="Toggle navigation menu"
          >
            {isMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>

      </div>

      {/* Mobile Menu Drawer */}
      {isMenuOpen && (
        <div className="md:hidden pt-3 mt-3 border-t border-slate-200 space-y-1">
          <div className="text-[10px] font-mono-data text-slate-400 px-2 py-1">
            ALL 11 SCREENS DIRECTORY
          </div>
          <div className="grid grid-cols-2 gap-1">
            {sitemapPages.map(page => {
              const Icon = page.icon;
              const isCurrent = currentPage === page.id;
              return (
                <button
                  key={page.id}
                  onClick={() => {
                    onNavigate(page.id);
                    setIsMenuOpen(false);
                  }}
                  className={`p-2 rounded-lg text-left text-xs flex items-center gap-2 transition-colors ${
                    isCurrent ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 text-slate-500" />
                  <span className="truncate">{lang === 'en' ? page.labelEn : page.labelHi}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
