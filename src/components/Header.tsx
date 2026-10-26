import React, { useState } from 'react';
import { Language, UserProfile } from '../types';
import { 
  Download, 
  Menu, 
  X, 
  LayoutDashboard, 
  Home, 
  LogIn, 
  HelpCircle, 
  FileSpreadsheet, 
  BookOpen, 
  Briefcase, 
  Info, 
  Palette,
  FileText,
  User,
  LogOut,
  ChevronDown,
  Bookmark,
  CheckCircle2
} from 'lucide-react';

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  lang: Language;
  setLang: (lang: Language) => void;
  onOpenPdfExport: () => void;
  userProfile: UserProfile | null;
  onSignOut?: () => void;
  savedJobsCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  onNavigate,
  lang,
  setLang,
  onOpenPdfExport,
  userProfile,
  onSignOut,
  savedJobsCount = 0,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState<boolean>(false);

  const navTabs = [
    { id: 'landing', labelEn: 'Home', labelHi: 'होम' },
    { id: 'resume', labelEn: 'AI Resume Studio', labelHi: 'एआई रेज़्यूमे' },
    { id: 'assessment', labelEn: 'Skill Diagnostic', labelHi: 'कौशल परीक्षा' },
    { id: 'gap-report', labelEn: 'Gap Report', labelHi: 'अंतर रिपोर्ट' },
    { id: 'jobs', labelEn: 'Jobs & HR Connect', labelHi: 'नौकरियां व HR' },
    { id: 'courses', labelEn: 'Free Courses', labelHi: 'सरकारी कोर्स' },
    { id: 'dashboard', labelEn: 'My Dashboard', labelHi: 'डैशबोर्ड' },
  ];

  const sitemapPages = [
    { id: 'landing', labelEn: 'Home', labelHi: 'मुख्य पृष्ठ', icon: Home },
    { id: 'resume', labelEn: 'AI Resume Studio', labelHi: 'एआई रेज़्यूमे', icon: FileText },
    { id: 'assessment', labelEn: 'Skill Diagnostic', labelHi: 'कौशल परीक्षा', icon: HelpCircle },
    { id: 'gap-report', labelEn: 'Skill Gap Report', labelHi: 'कौशल अंतर रिपोर्ट', icon: FileSpreadsheet },
    { id: 'jobs', labelEn: 'Local Jobs & HR Connect', labelHi: 'स्थानीय नौकरियां व HR', icon: Briefcase },
    { id: 'courses', labelEn: 'Free Certified Courses', labelHi: 'निःशुल्क कोर्स', icon: BookOpen },
    { id: 'dashboard', labelEn: 'Candidate Dashboard', labelHi: 'उम्मीदवार डैशबोर्ड', icon: LayoutDashboard },
    { id: 'about', labelEn: 'Social Impact & Mission', labelHi: 'सामाजिक प्रभाव', icon: Info },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 lg:px-8 py-2.5 transition-colors no-print shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Left: Brand Lockup */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-2.5 text-left group focus:outline-none cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xs shadow-sm shadow-blue-500/25 group-hover:bg-blue-700 transition-colors shrink-0">
              KS
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-slate-900 text-sm tracking-tight leading-tight whitespace-nowrap group-hover:text-blue-700 transition-colors">
                {lang === 'en' ? 'KAUSHAL SETU' : 'कौशल सेतु'}
              </span>
              <span className="text-[10.5px] text-slate-500 font-medium tracking-tight hidden sm:block leading-none mt-0.5">
                {lang === 'en' ? 'Skills, Resume & Direct HR Pipeline' : 'कौशल, रेज़्यूमे एवं सीधा एचआर प्रेषण'}
              </span>
            </div>
          </button>

          {/* Live Industrial Activity Micro-Badge */}
          <div className="hidden xl:flex items-center gap-1.5 pl-3 border-l border-slate-200 text-[11px] font-medium text-slate-500">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>{lang === 'en' ? '140+ UP Employers Active' : '१४०+ नियोक्ता सक्रिय'}</span>
          </div>
        </div>

        {/* Center: Primary Navigation */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-100/90 p-1 rounded-xl border border-slate-200/80 text-xs shadow-2xs">
          {navTabs.map(tab => {
            const isActive = currentPage === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onNavigate(tab.id)}
                className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all cursor-pointer ${
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

        {/* Right: User Login & Profile + Language + PDF */}
        <div className="flex items-center gap-2 shrink-0">
          
          {/* User Sign In / Profile Menu */}
          {userProfile ? (
            <div className="relative">
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200/80 border border-slate-200/90 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-800 transition-colors cursor-pointer"
              >
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-[11px] font-bold">
                  {userProfile.name.charAt(0)}
                </div>
                <div className="text-left hidden sm:block max-w-[110px] truncate">
                  <div className="leading-tight truncate">{userProfile.name}</div>
                  <div className="text-[10px] text-slate-500 font-normal truncate">{userProfile.targetRole}</div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {/* Profile Dropdown */}
              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-1.5 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 text-xs animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3.5 py-2 border-b border-slate-100">
                    <div className="font-bold text-slate-900">{userProfile.name}</div>
                    <div className="text-[11px] text-slate-500">{userProfile.email || userProfile.phone}</div>
                    <div className="mt-1 flex items-center gap-1.5 text-[10.5px] font-mono-data text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>ATS Score: {userProfile.atsScore}%</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setIsProfileDropdownOpen(false);
                      onNavigate('dashboard');
                    }}
                    className="w-full px-3.5 py-2 text-left text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5 text-slate-500" />
                    <span>{lang === 'en' ? 'My Dashboard' : 'मेरा डैशबोर्ड'}</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsProfileDropdownOpen(false);
                      onNavigate('resume');
                    }}
                    className="w-full px-3.5 py-2 text-left text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5 text-slate-500" />
                    <span>{lang === 'en' ? 'Edit AI Resume' : 'रेज़्यूमे एडिट करें'}</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsProfileDropdownOpen(false);
                      onNavigate('jobs');
                    }}
                    className="w-full px-3.5 py-2 text-left text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                  >
                    <Briefcase className="w-3.5 h-3.5 text-slate-500" />
                    <span>{lang === 'en' ? 'My Applications' : 'मेरे आवेदन'}</span>
                  </button>

                  <div className="border-t border-slate-100 my-1"></div>

                  <button
                    onClick={() => {
                      setIsProfileDropdownOpen(false);
                      onNavigate('auth');
                    }}
                    className="w-full px-3.5 py-2 text-left text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                  >
                    <User className="w-3.5 h-3.5 text-slate-500" />
                    <span>{lang === 'en' ? 'Switch User Account' : 'खाता बदलें'}</span>
                  </button>

                  {onSignOut && (
                    <button
                      onClick={() => {
                        setIsProfileDropdownOpen(false);
                        onSignOut();
                      }}
                      className="w-full px-3.5 py-2 text-left text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer font-medium"
                    >
                      <LogOut className="w-3.5 h-3.5 text-rose-500" />
                      <span>{lang === 'en' ? 'Sign Out' : 'लॉग आउट'}</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => onNavigate('auth')}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition-all cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'Sign In / Register' : 'लॉगिन / साइन अप'}</span>
            </button>
          )}

          {/* Language Selector */}
          <div className="flex items-center bg-slate-100 rounded-lg border border-slate-200 p-0.5 text-xs">
            <button
              onClick={() => setLang('en')}
              className={`px-2 py-1 rounded-md font-mono-data text-xs transition-colors cursor-pointer ${
                lang === 'en'
                  ? 'bg-white text-blue-700 font-bold shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLang('hi')}
              className={`px-2 py-1 rounded-md font-hindi text-xs transition-colors cursor-pointer ${
                lang === 'hi'
                  ? 'bg-white text-blue-700 font-bold shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              हिंदी
            </button>
          </div>

          {/* Download PDF Button */}
          <button
            onClick={onOpenPdfExport}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 transition-all shadow-xs whitespace-nowrap cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{lang === 'en' ? 'PDF' : 'पीडीएफ'}</span>
          </button>

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg bg-slate-100 border border-slate-200 cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {isMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>

      </div>

      {/* Mobile Menu Drawer */}
      {isMenuOpen && (
        <div className="lg:hidden pt-3 mt-3 border-t border-slate-200 space-y-1">
          <div className="text-[10px] font-mono-data text-slate-400 px-2 py-1">
            NAVIGATION DIRECTORY
          </div>
          <div className="grid grid-cols-2 gap-1.5">
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
                  className={`p-2.5 rounded-lg text-left text-xs flex items-center gap-2 transition-colors cursor-pointer ${
                    isCurrent ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-700 hover:bg-slate-100'
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
