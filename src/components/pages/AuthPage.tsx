import React, { useState } from 'react';
import { Language } from '../../types';
import { PERSONAS } from '../../data/researchData';
import { Phone, User, MapPin, Lock, ArrowRight } from 'lucide-react';

interface AuthPageProps {
  lang: Language;
  selectedPersonaId: string;
  onNavigate: (page: string) => void;
  onAuthSuccess: (userProfile: { name: string; phone: string; location: string }) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({
  lang,
  selectedPersonaId,
  onNavigate,
  onAuthSuccess,
}) => {
  const currentPersona = PERSONAS.find(p => p.id === selectedPersonaId) || PERSONAS[0];

  const [name, setName] = useState<string>(currentPersona.name);
  const [phone, setPhone] = useState<string>('98390' + Math.floor(10000 + Math.random() * 90000));
  const [location, setLocation] = useState<string>(currentPersona.location.split('(')[0].trim());
  const [step, setStep] = useState<'details' | 'otp'>('details');
  const [otp, setOtp] = useState<string>('');
  const [isSharedDevice, setIsSharedDevice] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep('otp');
      setOtp('4826'); // Mock autofill
    }, 400);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onAuthSuccess({ name, phone, location });
      onNavigate('assessment');
    }, 400);
  };

  return (
    <div className="max-w-md mx-auto space-y-8 py-8">
      
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between text-xs font-mono-data text-slate-500 pb-3 border-b border-slate-200">
        <span className="text-blue-700 font-bold">STEP 02 OF 02</span>
        <span>MOCK AUTHENTICATION</span>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 space-y-6 shadow-sm">
        
        <div className="space-y-1.5 text-center">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 mx-auto">
            <Lock className="w-5 h-5" />
          </div>
          <h1 className="text-xl font-display font-bold text-slate-900">
            {step === 'details' 
              ? (lang === 'en' ? 'Quick Candidate Sign-In' : 'त्वरित पंजीकरण / लॉगिन') 
              : (lang === 'en' ? 'Verify Mobile OTP' : 'मोबाइल ओटीपी सत्यापन')}
          </h1>
          <p className="text-xs text-slate-600">
            {lang === 'en'
              ? 'Lightweight access — no password needed. Save your skill gap progress.'
              : 'पासवर्ड की जरूरत नहीं। अपनी प्रगति सुरक्षित रखें।'}
          </p>
        </div>

        {step === 'details' ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            
            <div>
              <label className="text-xs text-slate-700 font-semibold block mb-1">
                {lang === 'en' ? 'Candidate Full Name' : 'उम्मीदवार का पूरा नाम'}
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"
                  placeholder="e.g. Priya Sharma"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-700 font-semibold block mb-1">
                {lang === 'en' ? 'Mobile Phone Number' : 'मोबाइल फोन नंबर'}
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2.5 text-xs text-slate-900 font-mono-data focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"
                  placeholder="10-digit mobile number"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-700 font-semibold block mb-1">
                {lang === 'en' ? 'District / Tehsil (Location)' : 'जिला / तहसील'}
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"
                  placeholder="e.g. Lucknow, Kanpur, Barabanki"
                />
              </div>
            </div>

            {/* Shared Device Safety Toggle */}
            <div className="pt-1">
              <label className="flex items-start gap-2 cursor-pointer text-xs text-slate-600">
                <input
                  type="checkbox"
                  checked={isSharedDevice}
                  onChange={e => setIsSharedDevice(e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-0"
                />
                <span>
                  {lang === 'en' 
                    ? 'Shared family device mode (auto-logout on tab close to protect privacy)' 
                    : 'साझा पारिवारिक फोन मोड (प्राइवेसी सुरक्षा हेतु टैब बंद होने पर सुरक्षित लॉगआउट)'}
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-lg bg-blue-600 text-white font-semibold text-xs hover:bg-blue-700 active:scale-[0.98] transition-all shadow-sm flex items-center justify-center gap-2 mt-4"
            >
              <span>{isLoading ? 'Sending SMS...' : (lang === 'en' ? 'Get Instant OTP' : 'ओटीपी प्राप्त करें')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-center justify-between">
              <span>Code sent to <strong className="text-blue-700 font-mono-data">+91 {phone}</strong></span>
              <button
                type="button"
                onClick={() => setStep('details')}
                className="text-slate-500 hover:text-slate-900 underline text-[11px]"
              >
                Change
              </button>
            </div>

            <div>
              <label className="text-xs text-slate-700 font-semibold block mb-1">
                {lang === 'en' ? 'Enter 4-Digit OTP' : '४ अंकों का ओटीपी दर्ज करें'}
              </label>
              <input
                type="text"
                maxLength={4}
                required
                value={otp}
                onChange={e => setOtp(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-center text-lg font-mono-data tracking-widest text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
              />
              <span className="text-[10px] text-emerald-600 font-mono-data block mt-1 text-center font-medium">
                ✓ Auto-detected code (Mock demo enabled)
              </span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-lg bg-blue-600 text-white font-semibold text-xs hover:bg-blue-700 active:scale-[0.98] transition-all shadow-sm flex items-center justify-center gap-2 mt-2"
            >
              <span>{isLoading ? 'Verifying...' : (lang === 'en' ? 'Verify & Start Assessment' : 'सत्यापित करें एवं परीक्षा शुरू करें')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        )}

        <div className="pt-2 text-center">
          <button
            onClick={() => onNavigate('landing')}
            className="text-xs text-slate-500 hover:text-slate-900"
          >
            {lang === 'en' ? '← Back to Overview' : '← वापस जाएं'}
          </button>
        </div>

      </div>

    </div>
  );
};
