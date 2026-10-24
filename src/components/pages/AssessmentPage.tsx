import React, { useState } from 'react';
import { Language } from '../../types';
import { PERSONAS } from '../../data/researchData';
import { ArrowRight, ArrowLeft, CheckCircle2, Save } from 'lucide-react';

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

  const questionsByPersona: Record<string, Array<{
    qEn: string;
    qHi: string;
    contextEn: string;
    contextHi: string;
    options: Array<{ labelEn: string; labelHi: string; score: number }>;
  }>> = {
    priya: [
      {
        qEn: 'When reconciling GST invoices in Tally Prime, how do you handle mismatched E-Way bills?',
        qHi: 'टैली प्राइम में जीएसटी चालान का मिलान करते समय ई-वे बिल में विसंगति आने पर आप क्या करते हैं?',
        contextEn: 'Practical Accounting Benchmark',
        contextHi: 'व्यावहारिक लेखांकन मानक',
        options: [
          { labelEn: 'Have only heard of E-Way bills, never generated one', labelHi: 'केवल नाम सुना है, कभी जनरेट नहीं किया', score: 30 },
          { labelEn: 'Can generate bills but need help with GSTR-2B reconciliation', labelHi: 'बिल बना सकते हैं पर 2B मिलान में सहायता चाहिए', score: 65 },
          { labelEn: 'Can independently reconcile 2B, generate E-Way bills & file returns', labelHi: 'स्वतंत्र रूप से 2B मिलान, ई-वे बिल व फाइलिंग कर सकते हैं', score: 90 },
        ]
      },
      {
        qEn: 'In Excel, which feature do you use to aggregate 5,000 monthly sales records across distributor regions?',
        qHi: 'एक्सेल में 5,000 मासिक बिक्री रिकॉर्ड को क्षेत्रवार संक्षेप में देखने के लिए आप किसका उपयोग करते हैं?',
        contextEn: 'Data Analysis Proficiency',
        contextHi: 'डेटा विश्लेषण दक्षता',
        options: [
          { labelEn: 'Manual summation and basic sorting', labelHi: 'साधारण जोड़ और बेसिक सॉर्टिंग', score: 40 },
          { labelEn: 'SUMIFS formula and standard filters', labelHi: 'SUMIFS फॉर्मूला और साधारण फ़िल्टर', score: 70 },
          { labelEn: 'Dynamic Pivot Tables with slicers & XLOOKUP', labelHi: 'पिवट टेबल, स्लाइसर और XLOOKUP फॉर्मूला', score: 95 },
        ]
      },
      {
        qEn: 'When a vendor demands immediate payment without a valid Tax Invoice, what is the protocol?',
        qHi: 'यदि कोई विक्रेता बिना टैक्स इनवॉइस के तत्काल भुगतान की मांग करे, तो सही प्रक्रिया क्या है?',
        contextEn: 'Statutory Compliance Audit',
        contextHi: 'कानूनी अनुपालन',
        options: [
          { labelEn: 'Pay cash directly from office petty cash', labelHi: 'पेटी कैश से नकद भुगतान कर देना', score: 25 },
          { labelEn: 'Ask senior accountant before proceeding', labelHi: 'सीनियर अकाउंटेंट से पूछकर निर्णय लेना', score: 70 },
          { labelEn: 'Hold payment until GSTIN-validated Tax Invoice is issued', labelHi: 'जीएसटी प्रमाणित इनवॉइस आने तक भुगतान रोकना', score: 95 },
        ]
      },
      {
        qEn: 'How confident are you writing formal business reconciliation emails to corporate clients?',
        qHi: 'कॉरपोरेट ग्राहकों को औपचारिक व्यावसायिक ईमेल और रिपोर्ट भेजने में आप कितने सहज हैं?',
        contextEn: 'Commercial Communication',
        contextHi: 'व्यावसायिक पत्राचार',
        options: [
          { labelEn: 'Rely heavily on phone calls; struggle with formal English email', labelHi: 'फोन पर ही बात करते हैं, अंग्रेजी ईमेल में कठिनाई', score: 40 },
          { labelEn: 'Can draft standard email templates with minor corrections', labelHi: 'मानक टेम्पलेट का उपयोग कर ईमेल लिख सकते हैं', score: 75 },
          { labelEn: 'Fluent and professional in client correspondence & disputes', labelHi: 'क्लाइंट ईमेल व हिसाब-किताब में पूर्णतः कुशल', score: 90 },
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
          { labelEn: 'Directly connect solar panels to the main MCB', labelHi: 'सीधे पैनल को मेन एमसीबी से जोड़ना', score: 20 },
          { labelEn: 'Check multimeter continuity and earth-to-neutral resistance', labelHi: 'मल्टीमीटर से अर्थिंग व न्यूट्रल वोल्टेज जांचना', score: 85 },
          { labelEn: 'Perform full Voc and Isc string testing under standard irradiance', labelHi: 'पूर्ण Voc और Isc स्ट्रिंग लोड व अर्थिंग परीक्षण करना', score: 95 },
        ]
      },
      {
        qEn: 'If a 3-phase industrial motor makes abnormal humming sounds and overheats within 10 minutes, what is likely?',
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
      },
      {
        qEn: 'How do you configure net metering parameters between the solar inverter and UP Power utility grid?',
        qHi: 'सोलर इन्वर्टर और यूपी पावर ग्रिड के बीच नेट मीटरिंग सेटिंग कैसे की जाती है?',
        contextEn: 'Grid Synchronization',
        contextHi: 'ग्रिड सिंक्रोनाइज़ेशन',
        options: [
          { labelEn: 'Never worked on on-grid net meters before', labelHi: 'नेट मीटर पर पहले कभी काम नहीं किया', score: 25 },
          { labelEn: 'Know the basic wiring diagram but need senior guidance', labelHi: 'वायरिंग पता है पर सीनियर की निगरानी चाहिए', score: 60 },
          { labelEn: 'Fully certified to calibrate bidirectional meters and anti-islanding', labelHi: 'एंटी-आइलैंडिंग व मीटर कैलिब्रेशन में पूर्णतः प्रशिक्षित', score: 90 },
        ]
      }
    ],
    sunita: [
      {
        qEn: 'To generate an Ayushman Bharat Golden Card for a village resident at a CSC center, what is needed?',
        qHi: 'सीएससी केंद्र पर ग्रामीण का आयुष्मान भारत कार्ड बनाने के लिए मुख्य रूप से क्या आवश्यक है?',
        contextEn: 'CSC E-Governance Services',
        contextHi: 'जन सेवा केंद्र सेवाएं',
        options: [
          { labelEn: 'Only verbal name and phone number', labelHi: 'केवल मौखिक नाम और फोन नंबर', score: 20 },
          { labelEn: 'Ration card list match and Aadhaar OTP verification', labelHi: 'राशन कार्ड पात्रता व आधार ओटीपी सत्यापन', score: 80 },
          { labelEn: 'Complete biometric KYC + PMJAY beneficiary database sync', labelHi: 'बायोमेट्रिक ई-केवाईसी व लाभार्थी डेटाबेस मिलान', score: 95 },
        ]
      },
      {
        qEn: 'What is your typing and numeric entry speed on a standard keyboard in Hindi or English?',
        qHi: 'कंप्यूटर कीबोर्ड पर आपकी हिंदी या अंग्रेजी में टाइपिंग व संख्या दर्ज करने की गति कितनी है?',
        contextEn: 'Data Entry Benchmark',
        contextHi: 'डेटा एंट्री दक्षता',
        options: [
          { labelEn: 'One-finger typing, slow on numbers (under 10 WPM)', labelHi: 'एक उंगली से धीरे-धीरे (१० शब्द प्रति मिनट से कम)', score: 30 },
          { labelEn: 'Comfortable with numbers, moderate text speed (15-25 WPM)', labelHi: 'संख्याओं में सहज, मध्यम गति (१५-२५ शब्द/मिनट)', score: 65 },
          { labelEn: 'Fast and accurate entry in Hindi & English (30+ WPM)', labelHi: 'बिना गलती के तेज डेटा एंट्री (३०+ शब्द/मिनट)', score: 90 },
        ]
      },
      {
        qEn: 'When conducting an Aadhaar Enabled Payment (AePS) cash withdrawal, what must you NEVER do?',
        qHi: 'आधार माइक्रो-एटीएम (AePS) से पैसे निकालते समय क्या कभी नहीं करना चाहिए?',
        contextEn: 'Financial Security & Ethics',
        contextHi: 'वित्तीय सुरक्षा व नियम',
        options: [
          { labelEn: 'Ask customer to put their fingerprint twice without printing receipt', labelHi: 'बिना रसीद दिए ग्राहक का अंगूठा दो बार लगवाना', score: 10 },
          { labelEn: 'Charge extra unofficial commission above standard bank fee', labelHi: 'बैंक शुल्क के अतिरिक्त अवैध कमीशन लेना', score: 20 },
          { labelEn: 'Always issue instant printed/SMS receipt and never record biometrics offline', labelHi: 'हमेशा तत्काल रसीद देना और सुरक्षा नियमों का पालन करना', score: 95 },
        ]
      },
      {
        qEn: 'How do you assist a villager whose mobile number is not linked to their Aadhaar card?',
        qHi: 'यदि किसी ग्रामीण का मोबाइल नंबर आधार से लिंक नहीं है, तो आप उनकी सहायता कैसे करेंगी?',
        contextEn: 'Citizen Support Protocol',
        contextHi: 'नागरिक सेवा सहायता',
        options: [
          { labelEn: 'Tell them service cannot be provided and send them away', labelHi: 'काम नहीं होगा कहकर वापस भेज देना', score: 20 },
          { labelEn: 'Guide them to the nearest post office / bank Aadhaar Seva Kendra', labelHi: 'नजदीकी डाकघर या बैंक आधार केंद्र का पता बताना', score: 85 },
          { labelEn: 'Book online appointment or use CSC demographic update portal', labelHi: 'ऑनलाइन स्लॉट बुक करना या अधिकृत केंद्र पर ले जाना', score: 95 },
        ]
      }
    ]
  };

  const questions = questionsByPersona[selectedPersonaId] || questionsByPersona.priya;
  const currentQ = questions[currentStep];

  const handleSelectOption = (score: number) => {
    setAnswers(prev => ({ ...prev, [currentStep]: score }));
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      const total = Object.values(answers).reduce((a, b) => a + b, 0);
      const avg = Math.round(total / questions.length);
      onAssessmentComplete({ [selectedPersonaId]: avg });
      onNavigate('gap-report');
    }
  };

  const isCurrentAnswered = answers[currentStep] !== undefined;

  return (
    <div className="max-w-2xl mx-auto space-y-8 py-6">
      
      {/* Progress & Header */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-mono-data text-slate-500">
          <span className="text-blue-700 font-bold">
            QUESTION {currentStep + 1} OF {questions.length}
          </span>
          <span className="flex items-center gap-1.5 text-emerald-700 font-medium">
            <Save className="w-3.5 h-3.5" />
            <span>Progress Auto-Saved</span>
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 transition-all duration-300"
            style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question Card (White Background, Clean Shadow) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 space-y-6 shadow-sm">
        
        <div>
          <span className="text-[11px] font-mono-data text-blue-700 font-semibold uppercase tracking-wider block mb-1">
            {lang === 'en' ? currentQ.contextEn : currentQ.contextHi}
          </span>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
            {lang === 'en' ? currentQ.qEn : currentQ.qHi}
          </h2>
        </div>

        {/* Practical Scenario Options */}
        <div className="space-y-3">
          {currentQ.options.map((opt, idx) => {
            const isSelected = answers[currentStep] === opt.score;
            return (
              <div
                key={idx}
                onClick={() => handleSelectOption(opt.score)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-blue-50/70 border-blue-600 shadow-sm ring-1 ring-blue-600'
                    : 'bg-slate-50/60 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                    {lang === 'en' ? opt.labelEn : opt.labelHi}
                  </div>
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                    isSelected ? 'border-blue-600 bg-blue-600 text-white font-bold' : 'border-slate-300 bg-white'
                  }`}>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation Buttons */}
        <div className="pt-4 flex items-center justify-between border-t border-slate-100">
          <button
            onClick={() => {
              if (currentStep > 0) setCurrentStep(currentStep - 1);
              else onNavigate('onboarding');
            }}
            className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1 transition-colors font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{currentStep === 0 ? (lang === 'en' ? 'Back' : 'वापस') : (lang === 'en' ? 'Previous Question' : 'पिछला प्रश्न')}</span>
          </button>

          <button
            onClick={handleNext}
            disabled={!isCurrentAnswered}
            className={`px-6 py-2.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
              isCurrentAnswered
                ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
            }`}
          >
            <span>
              {currentStep === questions.length - 1
                ? (lang === 'en' ? 'Generate Skill Gap Report' : 'कौशल अंतर रिपोर्ट देखें')
                : (lang === 'en' ? 'Next Question' : 'अगला प्रश्न')}
            </span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

    </div>
  );
};
