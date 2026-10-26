import React, { useState } from 'react';
import { Language, UserProfile } from '../../types';
import { 
  User, 
  Mail, 
  Phone, 
  Lock, 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  ShieldCheck,
  UserPlus,
  LogIn
} from 'lucide-react';

interface AuthPageProps {
  lang: Language;
  selectedPersonaId: string;
  onNavigate: (page: string) => void;
  onAuthSuccess: (userProfile: UserProfile) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({
  lang,
  selectedPersonaId,
  onNavigate,
  onAuthSuccess,
}) => {
  // Mode: 'signin' vs 'signup'
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

  // Sign In State
  const [signInIdentifier, setSignInIdentifier] = useState<string>('9839048261');
  const [signInPassword, setSignInPassword] = useState<string>('kaushal2026');

  // Sign Up State
  const [signUpName, setSignUpName] = useState<string>('');
  const [signUpPhone, setSignUpPhone] = useState<string>('');
  const [signUpEmail, setSignUpEmail] = useState<string>('');
  const [signUpRole, setSignUpRole] = useState<string>('Junior GST & Accounts Executive');
  const [signUpLocation, setSignUpLocation] = useState<string>('Lucknow');
  const [signUpEducation, setSignUpEducation] = useState<string>('Graduation (B.Com / B.Sc / BA)');
  const [signUpPassword, setSignUpPassword] = useState<string>('');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [authSuccessMsg, setAuthSuccessMsg] = useState<string | null>(null);

  // 2 Dedicated Quick Test Accounts as requested by user
  const testAccounts = [
    {
      id: 'priya',
      name: 'Priya Sharma',
      role: 'Junior GST & Accounts Executive',
      location: 'Lucknow (Gomti Nagar)',
      phone: '9839048261',
      email: 'priya.sharma@gmail.com',
      education: 'B.Com (Accounts & Taxation) · Lucknow University',
      skills: ['Tally Prime 4.0', 'Advanced Excel', 'GST Filing', 'E-Way Bills', 'TDS Reconciliation'],
      bio: 'Detail-oriented commerce graduate with hands-on proficiency in Tally Prime, GSTR-2B reconciliation, and financial analytics.',
      atsScore: 88,
      badge: 'Test User 1 (Finance & Accounts)'
    },
    {
      id: 'rahul',
      name: 'Rahul Verma',
      role: 'Rooftop Solar PV Grid Technician',
      location: 'Kanpur (Panki Industrial)',
      phone: '9839011234',
      email: 'rahul.verma@gmail.com',
      education: 'ITI Electrician Diploma (NCVT) · Govt ITI Kanpur',
      skills: ['Solar Inverter Diagnostics', '3-Phase Industrial Wiring', 'Multimeter Testing', 'Electrical PPE Safety'],
      bio: 'NCVT-certified Industrial Electrical technician specialized in rooftop solar PV installations, inverter troubleshooting, and grid synchronization.',
      atsScore: 84,
      badge: 'Test User 2 (Solar ITI Trade)'
    }
  ];

  const handle1ClickTestLogin = (account: typeof testAccounts[0]) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const profile: UserProfile = {
        name: account.name,
        phone: account.phone,
        email: account.email,
        location: account.location,
        targetRole: account.role,
        education: account.education,
        experienceYears: 1,
        skills: account.skills,
        bio: account.bio,
        resumeBuilt: true,
        atsScore: account.atsScore,
      };
      localStorage.setItem('ks_active_user', JSON.stringify(profile));
      onAuthSuccess(profile);
      onNavigate('resume');
    }, 300);
  };

  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      // Construct user profile from identifier
      const profile: UserProfile = {
        name: signInIdentifier.includes('@') ? signInIdentifier.split('@')[0] : 'Candidate User',
        phone: signInIdentifier.includes('@') ? '98390' + Math.floor(10000 + Math.random() * 90000) : signInIdentifier,
        email: signInIdentifier.includes('@') ? signInIdentifier : `${signInIdentifier}@kaushalsetu.in`,
        location: 'Lucknow / UP Hub',
        targetRole: 'Vocational Executive Trainee',
        education: 'Graduate / ITI Diploma',
        experienceYears: 1,
        skills: ['Computer Literacy', 'Trade Skills', 'Communication'],
        bio: 'Self-motivated candidate actively seeking verified industrial placement opportunities.',
        resumeBuilt: true,
        atsScore: 82,
      };
      localStorage.setItem('ks_active_user', JSON.stringify(profile));
      onAuthSuccess(profile);
      onNavigate('resume');
    }, 400);
  };

  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const newProfile: UserProfile = {
        name: signUpName.trim() || 'New Registered Candidate',
        phone: signUpPhone.trim() || '98' + Math.floor(10000000 + Math.random() * 90000000),
        email: signUpEmail.trim() || `${signUpName.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
        location: signUpLocation.trim() || 'Lucknow',
        targetRole: signUpRole.trim(),
        education: signUpEducation.trim(),
        experienceYears: 0,
        skills: signUpRole.includes('GST') || signUpRole.includes('Account')
          ? ['Tally Prime 4.0', 'GST Filing', 'Advanced Excel', 'E-Way Bills']
          : signUpRole.includes('Solar') || signUpRole.includes('Electric')
            ? ['Solar Inverter Diagnostics', '3-Phase Wiring', 'Electrical PPE']
            : ['Digital Literacy', 'Customer Assistance', 'Data Entry'],
        bio: `Eager ${signUpRole} candidate based in ${signUpLocation}. Certified in ${signUpEducation} and ready for direct industrial hiring.`,
        resumeBuilt: true,
        atsScore: 78,
      };
      localStorage.setItem('ks_active_user', JSON.stringify(newProfile));
      onAuthSuccess(newProfile);
      setAuthSuccessMsg(lang === 'en' ? 'Account created successfully!' : 'खाता सफलतापूर्वक बनाया गया!');
      setTimeout(() => {
        onNavigate('resume');
      }, 500);
    }, 450);
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 py-6">
      
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between text-xs font-mono-data text-slate-500 pb-3 border-b border-slate-200">
        <span className="text-blue-700 font-bold">CANDIDATE ACCESS PORTAL</span>
        <span>SIGN IN / NEW REGISTRATION</span>
      </div>

      {/* 2 Quick Test Accounts Banner (Dedicated for Tester/User) */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 p-5 space-y-3 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-bold text-slate-900 uppercase font-mono-data tracking-wide">
              {lang === 'en' ? '1-Click Quick Testing (2 Test Accounts)' : '1-क्लिक त्वरित परीक्षण (२ टेस्ट खाते)'}
            </span>
          </div>
          <span className="text-[10.5px] px-2 py-0.5 rounded-full bg-blue-600 text-white font-mono-data font-bold">
            TEST MODE
          </span>
        </div>

        <p className="text-xs text-slate-600">
          {lang === 'en'
            ? 'Click either test profile to log in immediately with pre-filled verified credentials, or use the custom form below.'
            : 'तुरंत टेस्ट करने के लिए नीचे दिए गए किसी भी टेस्ट खाते पर क्लिक करें, या नीचे अपना नया फॉर्म भरें।'}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {testAccounts.map((acc, index) => (
            <button
              key={acc.id}
              onClick={() => handle1ClickTestLogin(acc)}
              disabled={isLoading}
              className="p-3.5 rounded-xl bg-white hover:bg-blue-50/80 border border-slate-200 hover:border-blue-300 text-left transition-all shadow-2xs group cursor-pointer"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-mono-data font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                  {index === 0 ? 'USER 01' : 'USER 02'}
                </span>
                <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  {acc.atsScore}% ATS
                </span>
              </div>
              <div className="font-bold text-xs text-slate-900 group-hover:text-blue-700 transition-colors">
                {acc.name}
              </div>
              <div className="text-[11px] text-slate-600 truncate">{acc.role}</div>
              <div className="text-[10px] text-slate-400 mt-1 flex items-center justify-between">
                <span>{acc.location.split('(')[0]}</span>
                <span className="text-blue-600 font-semibold group-hover:translate-x-0.5 transition-transform">
                  Login ➔
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Authentication Card with Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 space-y-6 shadow-sm">
        
        {/* Toggle Segment: Sign In vs Sign Up */}
        <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200/80 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setAuthMode('signin')}
            className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              authMode === 'signin'
                ? 'bg-white text-blue-700 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>{lang === 'en' ? 'Existing User Sign In' : 'मौजूदा यूजर लॉगिन'}</span>
          </button>

          <button
            type="button"
            onClick={() => setAuthMode('signup')}
            className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              authMode === 'signup'
                ? 'bg-white text-blue-700 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>{lang === 'en' ? 'Create New Account (Sign Up)' : 'नया खाता बनाएं (साइन अप)'}</span>
          </button>
        </div>

        {authSuccessMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{authSuccessMsg}</span>
          </div>
        )}

        {/* TAB 1: SIGN IN */}
        {authMode === 'signin' && (
          <form onSubmit={handleSignInSubmit} className="space-y-4">
            <div className="text-left space-y-1">
              <h2 className="text-lg font-bold text-slate-900">
                {lang === 'en' ? 'Welcome Back' : 'वापस स्वागत है'}
              </h2>
              <p className="text-xs text-slate-600">
                {lang === 'en'
                  ? 'Sign in using your mobile number or email address.'
                  : 'अपने मोबाइल नंबर या ईमेल आईडी से लॉगिन करें।'}
              </p>
            </div>

            <div>
              <label className="text-xs text-slate-700 font-semibold block mb-1">
                {lang === 'en' ? 'Mobile Number or Email' : 'मोबाइल नंबर या ईमेल'}
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={signInIdentifier}
                  onChange={e => setSignInIdentifier(e.target.value)}
                  placeholder="e.g. 9839048261 or test@gmail.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-700 font-semibold block mb-1 flex items-center justify-between">
                <span>{lang === 'en' ? 'Password / Security PIN' : 'पासवर्ड / पिन'}</span>
                <span className="text-[11px] text-blue-600 cursor-pointer">
                  {lang === 'en' ? 'Forgot?' : 'भूल गए?'}
                </span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={signInPassword}
                  onChange={e => setSignInPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs shadow-sm shadow-blue-500/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{isLoading ? 'Authenticating...' : (lang === 'en' ? 'Sign In & Open Studio' : 'साइन इन करें एवं स्टूडियो खोलें')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        )}

        {/* TAB 2: SIGN UP / REGISTER NEW USER */}
        {authMode === 'signup' && (
          <form onSubmit={handleSignUpSubmit} className="space-y-4">
            <div className="text-left space-y-1">
              <h2 className="text-lg font-bold text-slate-900">
                {lang === 'en' ? 'Create Candidate Account' : 'नया उम्मीदवार खाता बनाएं'}
              </h2>
              <p className="text-xs text-slate-600">
                {lang === 'en'
                  ? 'Fill your details to test the platform with custom candidate credentials.'
                  : 'कस्टम क्रेडेंशियल्स के साथ प्लेटफॉर्म टेस्ट करने के लिए अपना विवरण दर्ज करें।'}
              </p>
            </div>

            <div>
              <label className="text-xs text-slate-700 font-semibold block mb-1">
                {lang === 'en' ? 'Full Name' : 'पूरा नाम'}
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={signUpName}
                  onChange={e => setSignUpName(e.target.value)}
                  placeholder="e.g. Ansh Kumar"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-700 font-semibold block mb-1">
                  {lang === 'en' ? 'Mobile Phone' : 'मोबाइल नंबर'}
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    required
                    value={signUpPhone}
                    onChange={e => setSignUpPhone(e.target.value)}
                    placeholder="10-digit number"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-700 font-semibold block mb-1">
                  {lang === 'en' ? 'Email Address' : 'ईमेल पता'}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    value={signUpEmail}
                    onChange={e => setSignUpEmail(e.target.value)}
                    placeholder="user@example.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-700 font-semibold block mb-1">
                  {lang === 'en' ? 'Target Trade / Role' : 'लक्षित पद / ट्रेड'}
                </label>
                <div className="relative">
                  <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={signUpRole}
                    onChange={e => setSignUpRole(e.target.value)}
                    placeholder="e.g. Accounts, Solar, Electrician"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-700 font-semibold block mb-1">
                  {lang === 'en' ? 'District / Location' : 'जिला / स्थान'}
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={signUpLocation}
                    onChange={e => setSignUpLocation(e.target.value)}
                    placeholder="e.g. Lucknow, Kanpur, Varanasi"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-700 font-semibold block mb-1">
                {lang === 'en' ? 'Highest Qualification' : 'उच्चतम योग्यता'}
              </label>
              <div className="relative">
                <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={signUpEducation}
                  onChange={e => setSignUpEducation(e.target.value)}
                  placeholder="e.g. B.Com, ITI Electrician, 12th Pass"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-700 font-semibold block mb-1">
                {lang === 'en' ? 'Create Password' : 'पासवर्ड बनाएं'}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={signUpPassword}
                  onChange={e => setSignUpPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs shadow-sm shadow-blue-500/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <span>{isLoading ? 'Creating Account...' : (lang === 'en' ? 'Register Account & Open Resume Studio' : 'खाता बनाएं एवं रेज़्यूमे स्टूडियो खोलें')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        )}

      </div>

    </div>
  );
};
