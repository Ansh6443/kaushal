import React, { useState } from 'react';
import { Language, UserProfile, HrDispatchRecord } from '../../types';
import { PERSONAS, SKILLS_DATA } from '../../data/researchData';
import { 
  FileText, 
  Sparkles, 
  Download, 
  Send, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  Briefcase, 
  GraduationCap, 
  Award, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  ArrowRight,
  TrendingUp,
  Building2,
  Clock,
  ShieldCheck,
  Check
} from 'lucide-react';

interface ResumeBuilderPageProps {
  lang: Language;
  selectedPersonaId: string;
  userProfile: UserProfile | null;
  onUpdateProfile: (profile: UserProfile) => void;
  onNavigate: (page: string) => void;
}

export const ResumeBuilderPage: React.FC<ResumeBuilderPageProps> = ({
  lang,
  selectedPersonaId,
  userProfile,
  onUpdateProfile,
  onNavigate,
}) => {
  const persona = PERSONAS.find(p => p.id === selectedPersonaId) || PERSONAS[0];

  // Initialize editable state from profile or active persona
  const [fullName, setFullName] = useState<string>(userProfile?.name || persona.name);
  const [phone, setPhone] = useState<string>(userProfile?.phone || '98390' + Math.floor(10000 + Math.random() * 90000));
  const [email, setEmail] = useState<string>(userProfile?.email || `${persona.id}.kaushal@gmail.com`);
  const [location, setLocation] = useState<string>(userProfile?.location || persona.location.split('(')[0].trim());
  const [targetRole, setTargetRole] = useState<string>(userProfile?.targetRole || persona.targetRole);
  const [education, setEducation] = useState<string>(
    userProfile?.education || 
    (selectedPersonaId === 'priya' 
      ? 'B.Com (Accounts & Taxation) · Lucknow University (2024)' 
      : selectedPersonaId === 'rahul' 
        ? 'ITI Electrician Diploma (NCVT) · Govt ITI Kanpur (2025)' 
        : 'Senior Secondary (12th Pass) · UP State Board (2023)')
  );
  const [experience, setExperience] = useState<string>(
    selectedPersonaId === 'priya'
      ? '6 Months Internship at Goel & Associates (Assisted in GST filing and Excel ledger reconciliations for 40+ local firms).'
      : selectedPersonaId === 'rahul'
        ? '1 Year Practical ITI Lab Work (Installed single-phase and 3-phase wiring panels; assisted in 10kW rooftop solar array).'
        : 'Assisted local Panchayat Seva Kendra in Barabanki (Helped 150+ villagers apply for Aadhaar updates and pension schemes).'
  );
  const [skillsList, setSkillsList] = useState<string[]>(
    userProfile?.skills || 
    (selectedPersonaId === 'priya' 
      ? ['Tally Prime 4.0', 'Advanced Excel', 'GST Filing', 'E-Way Bills', 'TDS Reconciliation']
      : selectedPersonaId === 'rahul'
        ? ['Solar Inverter Diagnostics', '3-Phase Wiring', 'Multimeter Testing', 'Electrical PPE Safety', 'Transformer Maintenance']
        : ['CSC e-District Portal', 'Hindi Typing (35 WPM)', 'Micro-ATM AePS Operations', 'Digital Banking Support'])
  );
  const [newSkillInput, setNewSkillInput] = useState<string>('');
  const [bio, setBio] = useState<string>(
    userProfile?.bio ||
    (selectedPersonaId === 'priya'
      ? 'Goal-oriented commerce graduate with hands-on proficiency in Tally Prime, GSTR-2B reconciliation, and financial analytics. Looking to accelerate local MSME financial growth.'
      : selectedPersonaId === 'rahul'
        ? 'Certified ITI Electrical technician specialized in rooftop solar PV installations, inverter troubleshooting, and industrial safety compliance.'
        : 'Empathetic and tech-savvy rural assistant capable of handling CSC digital citizen portals, biometric banking, and high-speed vernacular documentation.')
  );

  // HR Dispatch Modal & State
  const [isHrModalOpen, setIsHrModalOpen] = useState<boolean>(false);
  const [dispatchStatus, setDispatchStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [dispatchedCompanies, setDispatchedCompanies] = useState<string[]>([]);

  // Calculate dynamic ATS score
  const baseAts = 70;
  const skillBonus = Math.min(skillsList.length * 4, 20);
  const bioBonus = bio.length > 50 ? 6 : 0;
  const atsScore = Math.min(baseAts + skillBonus + bioBonus, 96);

  const handleAddSkill = () => {
    if (newSkillInput.trim() && !skillsList.includes(newSkillInput.trim())) {
      setSkillsList([...skillsList, newSkillInput.trim()]);
      setNewSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkillsList(skillsList.filter(s => s !== skillToRemove));
  };

  const handleAutoEnhanceBio = () => {
    if (selectedPersonaId === 'priya') {
      setBio('Detail-oriented Junior Accounts & Tax Analyst with demonstrated competence in Tally Prime 4.0, GST returns (GSTR-1/3B/2B), and advanced pivot modeling. Aiming to reduce compliance turnaround by 30% for high-growth enterprises in Lucknow.');
    } else if (selectedPersonaId === 'rahul') {
      setBio('NCVT-certified Industrial Electrical & Solar PV Specialist trained in string testing, grid-tied inverters, and IEEE/IS safety protocols. Eager to deploy scalable clean energy infrastructure across UP industrial corridors.');
    } else {
      setBio('Certified Digital Citizen Services Operator with 100% accuracy in AePS banking, biometric authentication, and e-District portal workflows. Dedicated to bridging digital governance in semi-urban communities.');
    }
  };

  const handleSaveAndSync = () => {
    const updated: UserProfile = {
      name: fullName,
      phone,
      email,
      location,
      targetRole,
      education,
      experienceYears: selectedPersonaId === 'priya' ? 1 : 1,
      skills: skillsList,
      bio,
      resumeBuilt: true,
      atsScore,
    };
    onUpdateProfile(updated);
  };

  const hrRecruiters = [
    {
      id: 'hr1',
      company: 'Kedia Logistics & Cold Chain Pvt Ltd',
      role: 'Junior GST & Accounts Executive',
      location: 'Transport Nagar, Lucknow',
      hrName: 'Rajesh Agarwal',
      hrRole: 'Head of Talent Acquisition',
      stipend: '₹22,000 - ₹26,000 / mo',
      badge: 'Direct WhatsApp + Portal Push'
    },
    {
      id: 'hr2',
      company: 'Tata Power Solar EPC Partner',
      role: 'Rooftop Solar PV Grid Technician',
      location: 'Fazalganj, Kanpur',
      hrName: 'Vikas Mishra',
      hrRole: 'Technical Recruitment Lead',
      stipend: '₹18,000 - ₹21,000 / mo',
      badge: 'NATS Apprenticeship Guaranteed'
    },
    {
      id: 'hr3',
      company: 'UP MSME Industrial Alliance',
      role: 'Enterprise Operations Trainee',
      location: 'Lucknow / Barabanki Hub',
      hrName: 'Sunita Saxena',
      hrRole: 'State Placement Director',
      stipend: '₹16,500 - ₹20,000 / mo',
      badge: 'Govt Subsidized Role'
    }
  ];

  const handleSendToHr = () => {
    setDispatchStatus('sending');
    setTimeout(() => {
      setDispatchStatus('sent');
      setDispatchedCompanies(hrRecruiters.map(h => h.company));
      handleSaveAndSync();
    }, 1200);
  };

  const handlePrintResume = () => {
    window.print();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-6">
      
      {/* Top Workflow Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono-data text-blue-700 font-bold mb-1">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            <span>CORE WORKFLOW STEP 01</span>
            <span>·</span>
            <span>AI RESUME BUILDER & ATS OPTIMIZER</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-slate-900">
            {lang === 'en' ? 'AI Resume Studio & Direct HR Dispatch' : 'एआई रेज़्यूमे स्टूडियो एवं सीधा एचआर प्रेषण'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            {lang === 'en'
              ? 'Update your professional profile, boost your ATS score, and push verified resumes directly to partnered recruiters.'
              : 'अपना रेज़्यूमे अपडेट करें, एटीएस स्कोर बढ़ाएं और सीधे नियोक्ताओं के पास अपना सत्यापित रेज़्यूमे भेजें।'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={() => {
              handleSaveAndSync();
              setIsHrModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold text-xs shadow-sm shadow-emerald-500/20 active:scale-95 transition-all cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{lang === 'en' ? 'Send Resume to HRs' : 'एचआर को रेज़्यूमे भेजें'}</span>
          </button>

          <button
            onClick={handlePrintResume}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{lang === 'en' ? 'Print / PDF' : 'प्रिंट / पीडीएफ'}</span>
          </button>

          <button
            onClick={() => {
              handleSaveAndSync();
              onNavigate('assessment');
            }}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm shadow-blue-500/20 active:scale-95 transition-all cursor-pointer"
          >
            <span>{lang === 'en' ? 'Next: Take Assessment' : 'आगे: कौशल परीक्षा'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Grid: Left Editor + Right Live ATS Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column (7 cols): The Interactive Editor Form */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 p-6 space-y-6 shadow-sm">
          
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <User className="w-4 h-4 text-blue-600" />
              <span>{lang === 'en' ? 'Candidate Information & Credentials' : 'उम्मीदवार विवरण एवं क्रेडेंशियल्स'}</span>
            </h2>
            <span className="text-[11px] font-mono-data text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200 font-semibold">
              LIVE AUTO-SAVE
            </span>
          </div>

          {/* Basic Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-700 font-semibold block mb-1">
                {lang === 'en' ? 'Full Name' : 'पूरा नाम'}
              </label>
              <input
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"
              />
            </div>

            <div>
              <label className="text-xs text-slate-700 font-semibold block mb-1">
                {lang === 'en' ? 'Target Trade / Role' : 'लक्षित पद / ट्रेड'}
              </label>
              <input
                type="text"
                value={targetRole}
                onChange={e => setTargetRole(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"
              />
            </div>

            <div>
              <label className="text-xs text-slate-700 font-semibold block mb-1">
                {lang === 'en' ? 'Phone Number' : 'मोबाइल नंबर'}
              </label>
              <input
                type="text"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"
              />
            </div>

            <div>
              <label className="text-xs text-slate-700 font-semibold block mb-1">
                {lang === 'en' ? 'Email Address' : 'ईमेल पता'}
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-700 font-semibold block mb-1">
              {lang === 'en' ? 'Location (District & Hub)' : 'स्थान (जिला व औद्योगिक क्षेत्र)'}
            </label>
            <input
              type="text"
              value={location}
              onChange={e => setLocation(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"
            />
          </div>

          {/* Education */}
          <div>
            <label className="text-xs text-slate-700 font-semibold block mb-1 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
                <span>{lang === 'en' ? 'Education / Trade Certification' : 'शिक्षा व ट्रेड प्रमाणपत्र'}</span>
              </span>
            </label>
            <input
              type="text"
              value={education}
              onChange={e => setEducation(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"
            />
          </div>

          {/* Vocational & Technical Skills with Interactive Tags */}
          <div className="space-y-2">
            <label className="text-xs text-slate-700 font-semibold block flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-blue-600" />
                <span>{lang === 'en' ? 'Technical & Vocational Skills' : 'तकनीकी एवं व्यावहारिक कौशल'}</span>
              </span>
              <span className="text-[11px] text-slate-500 font-mono-data">{skillsList.length} skills listed</span>
            </label>

            <div className="flex flex-wrap gap-1.5 p-2 bg-slate-50 rounded-lg border border-slate-200">
              {skillsList.map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white text-slate-800 text-xs font-medium border border-slate-200 shadow-2xs"
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="text-slate-400 hover:text-red-600 transition-colors"
                    title="Remove skill"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder={lang === 'en' ? 'Add skill (e.g. GSTR-2B, Inverter Testing, Pivot Tables)...' : 'नया कौशल जोड़ें...'}
                value={newSkillInput}
                onChange={e => setNewSkillInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSkill();
                  }
                }}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{lang === 'en' ? 'Add' : 'जोड़ें'}</span>
              </button>
            </div>
          </div>

          {/* Practical Work / Internship Experience */}
          <div>
            <label className="text-xs text-slate-700 font-semibold block mb-1 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-blue-600" />
              <span>{lang === 'en' ? 'Practical Experience / Apprenticeship' : 'व्यावहारिक अनुभव / अप्रेंटिसशिप'}</span>
            </label>
            <textarea
              rows={3}
              value={experience}
              onChange={e => setExperience(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"
            />
          </div>

          {/* Summary / Bio with AI Enhance */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs text-slate-700 font-semibold">
                {lang === 'en' ? 'Professional Bio / Summary' : 'व्यावसायिक परिचय / सारांश'}
              </label>
              <button
                type="button"
                onClick={handleAutoEnhanceBio}
                className="text-[11px] font-semibold text-indigo-700 hover:text-indigo-800 flex items-center gap-1 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 transition-colors cursor-pointer"
              >
                <Sparkles className="w-3 h-3 text-indigo-600" />
                <span>{lang === 'en' ? '✨ AI Enhance Bio' : '✨ एआई से सुधारें'}</span>
              </button>
            </div>
            <textarea
              rows={3}
              value={bio}
              onChange={e => setBio(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"
            />
          </div>

        </div>

        {/* Right Column (5 cols): Live ATS Meter & Print Preview */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* ATS Score Meter Card */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white rounded-2xl p-6 shadow-md border border-slate-700/80 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono-data text-blue-300 font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                AI ATS COMPATIBILITY ENGINE
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
                {atsScore >= 85 ? 'HIGH VISIBILITY' : 'MODERATE MATCH'}
              </span>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-5xl font-mono-data font-bold text-white tracking-tight">
                {atsScore}%
              </span>
              <div className="text-xs text-slate-300">
                <div className="font-semibold text-emerald-400">Ready for Direct HR Push</div>
                <div>Top 8% in Lucknow & Kanpur Pool</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-700 h-2.5 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 via-indigo-400 to-emerald-400 rounded-full transition-all duration-300"
                style={{ width: `${atsScore}%` }}
              />
            </div>

            {/* ATS Diagnostics */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-700/80 text-center">
              <div className="p-2 rounded-lg bg-white/5">
                <div className="text-[10px] text-slate-400">Trade Keywords</div>
                <div className="text-xs font-bold text-white mt-0.5">94% Match</div>
              </div>
              <div className="p-2 rounded-lg bg-white/5">
                <div className="text-[10px] text-slate-400">ATS Parsing</div>
                <div className="text-xs font-bold text-emerald-400 mt-0.5">100% Clean</div>
              </div>
              <div className="p-2 rounded-lg bg-white/5">
                <div className="text-[10px] text-slate-400">Recruiter Reach</div>
                <div className="text-xs font-bold text-amber-300 mt-0.5">140+ Firms</div>
              </div>
            </div>
          </div>

          {/* Clean Real-time Resume Card Preview */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 space-y-4 shadow-sm print:shadow-none print:border-none">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-500 uppercase font-mono-data tracking-wider">
                CANDIDATE DOSSIER PREVIEW
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            </div>

            {/* Header info */}
            <div>
              <h3 className="text-lg font-bold text-slate-900">{fullName}</h3>
              <p className="text-xs font-semibold text-blue-700">{targetRole}</p>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-500 mt-1">
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-slate-400" />{location}</span>
                <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-slate-400" />+91 {phone}</span>
                <span className="flex items-center gap-1"><Mail className="w-3 h-3 text-slate-400" />{email}</span>
              </div>
            </div>

            {/* Summary */}
            <div className="space-y-1">
              <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wide">
                Professional Profile
              </div>
              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                {bio}
              </p>
            </div>

            {/* Skills */}
            <div className="space-y-1">
              <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wide">
                Core Competencies
              </div>
              <div className="flex flex-wrap gap-1">
                {skillsList.map((s, idx) => (
                  <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-blue-50 text-blue-800 font-medium border border-blue-100">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Experience */}
            <div className="space-y-1">
              <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wide">
                Practical Training & Experience
              </div>
              <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                {experience}
              </p>
            </div>

            {/* Education */}
            <div className="space-y-1">
              <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wide">
                Education & Credentials
              </div>
              <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                {education}
              </p>
            </div>

            {/* Footer Direct HR badge */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span className="flex items-center gap-1 text-emerald-700 font-medium">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Kaushal Setu Certified Record</span>
              </span>
              <span className="font-mono-data text-slate-400">UP-2026-KS</span>
            </div>

          </div>

          {/* Quick Push Callout */}
          <div className="bg-emerald-50 rounded-2xl border border-emerald-200 p-4 flex items-center justify-between gap-3">
            <div className="space-y-0.5">
              <h4 className="text-xs font-bold text-emerald-950">
                {lang === 'en' ? 'Direct HR Dispatch Pipeline' : 'सीधा एचआर प्रेषण पाइपलाइन'}
              </h4>
              <p className="text-[11px] text-emerald-800">
                {lang === 'en'
                  ? 'Your resume will be sent directly to 3 hiring managers matching your role.'
                  : 'आपका रेज़्यूमे सीधे 3 नियोक्ताओं के पास भेजा जाएगा।'}
              </p>
            </div>
            <button
              onClick={() => {
                handleSaveAndSync();
                setIsHrModalOpen(true);
              }}
              className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold shrink-0 cursor-pointer transition-colors"
            >
              {lang === 'en' ? 'Dispatch Now' : 'अभी भेजें'}
            </button>
          </div>

        </div>

      </div>

      {/* HR Dispatch Modal */}
      {isHrModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <Send className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {lang === 'en' ? 'Direct-to-HR Resumes Dispatch' : 'एचआर को सीधा रेज़्यूमे प्रेषण'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {lang === 'en' ? 'Select verified local employers' : 'अधिकृत स्थानीय नियोक्ताओं का चयन'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsHrModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* Recruiter List */}
            <div className="space-y-2.5">
              {hrRecruiters.map(rec => (
                <div
                  key={rec.id}
                  className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 flex items-start justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900">{rec.company}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">
                        {rec.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-blue-700 font-medium">{rec.role}</p>
                    <div className="text-[10.5px] text-slate-500 flex items-center gap-2">
                      <span>HR: {rec.hrName} ({rec.hrRole})</span>
                      <span>·</span>
                      <span>{rec.stipend}</span>
                    </div>
                  </div>
                  <div className="w-5 h-5 rounded-md bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                </div>
              ))}
            </div>

            {/* Status Display */}
            {dispatchStatus === 'sent' && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Resume Successfully Dispatched to 3 Hiring HRs!</span>
                </div>
                <p className="text-[11px] text-emerald-700">
                  Delivery confirmations sent via SMS & WhatsApp. Tracking status is visible in your **Jobs & Dashboard** tabs.
                </p>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setIsHrModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                {lang === 'en' ? 'Close' : 'बंद करें'}
              </button>
              
              {dispatchStatus !== 'sent' ? (
                <button
                  onClick={handleSendToHr}
                  disabled={dispatchStatus === 'sending'}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-sm transition-all cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{dispatchStatus === 'sending' ? 'Dispatching to Recruiters...' : 'Confirm & Push to All 3 HRs'}</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    setIsHrModalOpen(false);
                    onNavigate('assessment');
                  }}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-sm transition-all cursor-pointer"
                >
                  <span>Proceed to Skill Assessment</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
