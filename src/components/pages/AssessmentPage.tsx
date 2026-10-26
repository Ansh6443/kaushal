import React, { useState } from 'react';
import { Language } from '../../types';
import { PERSONAS } from '../../data/researchData';
import { ArrowRight, ArrowLeft, CheckCircle2, ShieldCheck, Zap, HelpCircle, FileText } from 'lucide-react';

interface AssessmentPageProps {
  lang: Language;
  selectedPersonaId: string;
  onNavigate: (page: string) => void;
  onAssessmentComplete: (scores: Record<string, number>) => void;
}

export const AssessmentPage: React.FC<AssessmentPageProps> = ({
  lang,
  selectedPersonaId,
  onNavigate,
  onAssessmentComplete,
}) => {
  const currentPersona = PERSONAS.find(p => p.id === selectedPersonaId) || PERSONAS[0];
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});

  // Streamlined 3 Practical Scenario Questions per Persona (Removed redundant questions as requested)
  const questionsByPersona: Record<string, Array<{
    qEn: string;
    qHi: string;
    contextEn: string;
    contextHi: string;
    options: Array<{ labelEn: string; labelHi: string; score: number }>;
  }>> = {
    priya: [
      {
        qEn: 'When reconciling GST invoices in Tally Prime, how do you handle mismatched E-Way bills with GSTR-2B?',
        qHi: 'टैली प्राइम में जीएसटी चालान का मिलान करते समय ई-वे बिल और 2B में विसंगति आने पर आप क्या करते हैं?',
        contextEn: 'Practical GST Compliance Benchmark',
        contextHi: 'व्यावहारिक जीएसटी मानक',
        options: [
          { labelEn: 'Have only heard of E-Way bills; require step-by-step assistance', labelHi: 'केवल नाम सुना है, कार्य करने में सहायता चाहिए', score: 35 },
          { labelEn: 'Can generate bills but need senior guidance on GSTR-2B mismatch reconciliation', labelHi: 'बिल बना सकते हैं पर 2B मिलान में सीनियर की मदद चाहिए', score: 65 },
          { labelEn: 'Can independently reconcile 2B, generate E-Way bills & file returns with 100% accuracy', labelHi: 'स्वतंत्र रूप से 2B मिलान, ई-वे बिल व सटीक फाइलिंग कर सकते हैं', score: 95 },
        ]
      },
      {
        qEn: 'In Excel, which feature do you use to aggregate 5,000 monthly sales records across distributor regions?',
        qHi: 'एक्सेल में 5,000 मासिक बिक्री रिकॉर्ड को क्षेत्रवार संक्षेप में देखने के लिए आप किसका उपयोग करते हैं?',
        contextEn: 'Data Analysis & Financial Modeling',
        contextHi: 'डेटा विश्लेषण दक्षता',
        options: [
          { labelEn: 'Manual summation and basic sorting', labelHi: 'साधारण जोड़ और बेसिक सॉर्टिंग', score: 40 },
          { labelEn: 'SUMIFS formula and standard filters', labelHi: 'SUMIFS फॉर्मूला और साधारण फ़िल्टर', score: 70 },
          { labelEn: 'Dynamic Pivot Tables with slicers & XLOOKUP models', labelHi: 'पिवट टेबल, स्लाइसर और XLOOKUP फॉर्मूला', score: 95 },
        ]
      },
      {
        qEn: 'When a vendor demands immediate payment without a valid Tax Invoice, what is your compliance protocol?',
        qHi: 'यदि कोई विक्रेता बिना वैध टैक्स इनवॉइस के तत्काल भुगतान की मांग करे, तो सही प्रक्रिया क्या है?',
        contextEn: 'Statutory Compliance Audit',
        contextHi: 'कानूनी अनुपालन',
        options: [
          { labelEn: 'Release partial cash payment immediately', labelHi: 'नकद आंशिक भुगतान तुरंत कर देना', score: 25 },
          { labelEn: 'Ask senior accountant before proceeding', labelHi: 'सीनियर अकाउंटेंट से पूछकर निर्णय लेना', score: 70 },
          { labelEn: 'Hold payment until GSTIN-validated Tax Invoice is issued', labelHi: 'जीएसटी प्रमाणित इनवॉइस आने तक भुगतान रोकना', score: 95 },
        ]
      }
    ],
    rahul: [
      {
        qEn: 'Before installing a 5kW rooftop solar PV inverter, what critical test do you perform first?',
        qHi: '५ किलोवाट सोलर इन्वर्टर स्थापित करने से पहले कौन सा प्राथमिक परीक्षण अनिवार्य है?',
        contextEn: 'Electrical Safety Standard',
        contextHi: 'विद्युत सुरक्षा मानक',
        options: [
          { labelEn: 'Directly connect solar panels to the main MCB switch', labelHi: 'सीधे पैनल को मेन एमसीबी से जोड़ना', score: 20 },
          { labelEn: 'Check multimeter continuity and earth-to-neutral resistance', labelHi: 'मल्टीमीटर से अर्थिंग व न्यूट्रल वोल्टेज जांचना', score: 85 },
          { labelEn: 'Perform full Voc and Isc string testing under standard irradiance', labelHi: 'पूर्ण Voc और Isc स्ट्रिंग लोड व अर्थिंग परीक्षण करना', score: 95 },
        ]
      },
      {
        qEn: 'If a 3-phase industrial motor makes abnormal humming sounds and overheats within 10 minutes, what is the cause?',
        qHi: 'यदि थ्री-फेज औद्योगिक मोटर असामान्य आवाज करे और १० मिनट में गर्म हो जाए, तो क्या कारण हो सकता है?',
        contextEn: 'Industrial Motor Troubleshooting',
        contextHi: 'मोटर फॉल्ट डायग्नोस्टिक्स',
        options: [
          { labelEn: 'Just need more grease on the shaft', labelHi: 'केवल ग्रीस की कमी हो सकती है', score: 30 },
          { labelEn: 'Single-phasing / blown fuse on one phase line', labelHi: 'सिंगल-फेजिंग या एक फेज का फ्यूज उड़ना', score: 85 },
          { labelEn: 'Stator winding phase imbalance or bearing seizure', labelHi: 'वाइंडिंग असंतुलन या बेयरिंग सीज होना', score: 95 },
        ]
      },
      {
        qEn: 'Which Personal Protective Equipment (PPE) is mandatory before opening a 440V distribution panel?',
        qHi: '४४० वोल्ट पैनल खोलने से पहले कौन से व्यक्तिगत सुरक्षा उपकरण (PPE) अनिवार्य हैं?',
        contextEn: 'IS / OSHA Safety Standards',
        contextHi: 'सुरक्षा मानक',
        options: [
          { labelEn: 'Standard cotton gloves and slippers', labelHi: 'साधारण सूती दस्ताने या चप्पल', score: 10 },
          { labelEn: 'Rubber boots and insulated screwdriver', labelHi: 'रबर बूट और इंसुलेटेड पेचकस', score: 65 },
          { labelEn: 'Class 0 Dielectric gloves (1000V rated), arc face shield, and safety shoes', labelHi: '१०००V प्रमाणित इंसुलेटेड दस्ताने, फेस शील्ड व सेफ्टी जूते', score: 95 },
        ]
      }
    ],
    sunita: [
      {
        qEn: 'To generate an Ayushman Bharat Golden Card for a village resident at a CSC center, what is the critical step?',
        qHi: 'सीएससी केंद्र पर ग्रामीण का आयुष्मान भारत कार्ड बनाने के लिए मुख्य रूप से क्या आवश्यक है?',
        contextEn: 'CSC E-Governance Services',
        contextHi: 'जन सेवा केंद्र सेवाएं',
        options: [
          { labelEn: 'Only verbal name and phone number entry', labelHi: 'केवल मौखिक नाम और फोन नंबर', score: 20 },
          { labelEn: 'Ration card list match and basic Aadhaar verification', labelHi: 'राशन कार्ड पात्रता व आधार सत्यापन', score: 75 },
          { labelEn: 'Complete biometric KYC + PMJAY beneficiary database sync', labelHi: 'बायोमेट्रिक ई-केवाईसी व लाभार्थी डेटाबेस मिलान', score: 95 },
        ]
      },
      {
        qEn: 'What is your typing and numeric entry speed on a standard keyboard in Hindi or English?',
        qHi: 'कंप्यूटर कीबोर्ड पर आपकी हिंदी या अंग्रेजी में टाइपिंग व संख्या दर्ज करने की गति कितनी है?',
        contextEn: 'Data Entry & Typing Benchmark',
        contextHi: 'डेटा एंट्री दक्षता',
        options: [
          { labelEn: 'One-finger typing, slow on numbers (under 12 WPM)', labelHi: 'एक उंगली से धीरे-धीरे (१२ शब्द प्रति मिनट से कम)', score: 35 },
          { labelEn: 'Average speed (20-28 WPM) with occasional typos', labelHi: 'मध्यम गति (२०-२८ शब्द प्रति मिनट)', score: 75 },
          { labelEn: 'Certified professional speed (35+ WPM) with 98% accuracy', labelHi: 'पेशेवर गति (३५+ शब्द प्रति मिनट व ९८% शुद्धता)', score: 95 },
        ]
      },
      {
        qEn: 'If a villager reports a micro-ATM cash withdrawal failure where money was debited but not dispensed, what do you do?',
        qHi: 'यदि माइक्रो-एटीएम से पैसे कट जाएं पर कैश न निकले, तो सीएससी ऑपरेटर के रूप में आप क्या करेंगे?',
        contextEn: 'Financial Security & AePS Protocol',
        contextHi: 'वित्तीय सुरक्षा प्रोटोकॉल',
        options: [
          { labelEn: 'Tell the customer to visit their bank branch in the district capital', labelHi: 'ग्राहक को जिला मुख्यालय की बैंक शाखा जाने को कहना', score: 30 },
          { labelEn: 'Wait 24 hours without logging a formal complaint', labelHi: 'बिना कंप्लेंट दर्ज किए २४ घंटे इंतजार करने को कहना', score: 55 },
          { labelEn: 'Immediately log RRN dispute ticket on NPCI portal and print receipt with reference ID', labelHi: 'एनपीसीआई पोर्टल पर RRN विवाद दर्ज कर रसीद प्रिंट करके देना', score: 95 },
        ]
      }
    ]
  };

  const questions = questionsByPersona[selectedPersonaId] || questionsByPersona.priya;
  const currentQ = questions[currentStep];
  const totalQuestions = questions.length;

  const handleSelectOption = (score: number) => {
    setAnswers({ ...answers, [currentStep]: score });
  };

  const handleNext = () => {
    if (currentStep < totalQuestions - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onAssessmentComplete(answers);
      onNavigate('gap-report');
    }
  };

  const isCurrentAnswered = answers[currentStep] !== undefined;

  return (
    <div className="max-w-3xl mx-auto space-y-6 py-6">
      
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono-data text-blue-700 font-bold mb-1">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            <span>CORE WORKFLOW STEP 02</span>
            <span>·</span>
            <span>3-MINUTE ADAPTIVE DIAGNOSTIC</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-display font-bold text-slate-900">
            {lang === 'en' ? 'Targeted Trade Scenario Assessment' : 'व्यावहारिक कौशल परिदृश्य परीक्षा'}
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            {lang === 'en'
              ? `Derived directly from ${currentPersona.name}'s resume to determine real-world employability.`
              : `${currentPersona.name} के रेज़्यूमे और औद्योगिक मानकों पर आधारित 3 त्वरित व्यावहारिक प्रश्न।`}
          </p>
        </div>

        <button
          onClick={() => onNavigate('resume')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold self-start sm:self-auto transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{lang === 'en' ? 'Edit Resume' : 'रेज़्यूमे बदलें'}</span>
        </button>
      </div>

      {/* Progress Strip */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-blue-600" />
          <span className="text-xs font-bold text-slate-800">
            {lang === 'en' ? `Question ${currentStep + 1} of ${totalQuestions}` : `प्रश्न ${currentStep + 1} / ${totalQuestions}`}
          </span>
          <span className="text-xs text-slate-400 font-mono-data">· 3-Minute Quick Diagnostic</span>
        </div>
        
        {/* Step dots */}
        <div className="flex items-center gap-1.5">
          {questions.map((_, idx) => (
            <div
              key={idx}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                idx === currentStep 
                  ? 'w-6 bg-blue-600' 
                  : answers[idx] !== undefined 
                    ? 'bg-emerald-500' 
                    : 'bg-slate-200'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 space-y-6 shadow-sm">
        
        {/* Context Chip */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold font-mono-data">
          <Zap className="w-3.5 h-3.5 text-blue-600" />
          <span>{lang === 'en' ? currentQ.contextEn : currentQ.contextHi}</span>
        </div>

        {/* Question Text */}
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
          {lang === 'en' ? currentQ.qEn : currentQ.qHi}
        </h2>

        {/* Options */}
        <div className="space-y-3 pt-2">
          {currentQ.options.map((opt, idx) => {
            const isSelected = answers[currentStep] === opt.score;
            return (
              <button
                key={idx}
                onClick={() => handleSelectOption(opt.score)}
                className={`w-full text-left p-4 rounded-xl border transition-all duration-150 flex items-start gap-3.5 cursor-pointer ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/70 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/70'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                    isSelected ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300 bg-white'
                  }`}
                >
                  {isSelected && <span className="w-2 h-2 rounded-full bg-white" />}
                </div>

                <div className="flex-1">
                  <span className={`text-xs sm:text-sm leading-relaxed ${isSelected ? 'font-semibold text-blue-950' : 'text-slate-800'}`}>
                    {lang === 'en' ? opt.labelEn : opt.labelHi}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 disabled:opacity-30 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{lang === 'en' ? 'Previous' : 'पिछला'}</span>
          </button>

          <button
            onClick={handleNext}
            disabled={!isCurrentAnswered}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
          >
            <span>
              {currentStep < totalQuestions - 1
                ? (lang === 'en' ? 'Next Question' : 'अगला प्रश्न')
                : (lang === 'en' ? 'Generate My Skill Gap Report ➔' : 'मेरी कौशल अंतर रिपोर्ट बनाएं ➔')}
            </span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

    </div>
  );
};
