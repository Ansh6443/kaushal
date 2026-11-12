import React, { useState, useRef, useEffect } from 'react';
import { Language, UserProfile } from '../types';
import { 
  Bot, 
  Send, 
  X, 
  Sparkles, 
  MessageSquare, 
  ChevronDown, 
  CheckCircle2, 
  Zap, 
  Building2, 
  FileText, 
  HelpCircle,
  Volume2
} from 'lucide-react';

interface ChatbotWidgetProps {
  lang: Language;
  userProfile: UserProfile | null;
  selectedPersonaId: string;
  onNavigate: (page: string) => void;
}

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  quickActions?: Array<{ label: string; action: () => void }>;
}

export const ChatbotWidget: React.FC<ChatbotWidgetProps> = ({
  lang,
  userProfile,
  selectedPersonaId,
  onNavigate,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [inputText, setInputText] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const candidateName = userProfile?.name || (selectedPersonaId === 'priya' ? 'Priya' : selectedPersonaId === 'rahul' ? 'Rahul' : 'Sunita');
  const targetRole = userProfile?.targetRole || (selectedPersonaId === 'priya' ? 'Junior GST Executive' : selectedPersonaId === 'rahul' ? 'Solar PV Technician' : 'CSC Digital Operator');

  const initialBotMessage = lang === 'en'
    ? `Namaste ${candidateName}! 🙏 I am **Kaushal Saarthi**, your AI Career Copilot. I can help you build your resume, boost your ATS score to 90%+, practice interview questions, or push your verified profile directly to local HR recruiters. How can I guide you today?`
    : `नमस्ते ${candidateName}! 🙏 मैं हूँ **कौशल सारथी**, आपका एआई करियर साथी। मैं आपका रेज़्यूमे बनाने, एटीएस स्कोर 90%+ करने, इंटरव्यू की तैयारी और आपका रेज़्यूमे सीधे स्थानीय एचआर (HR) को भेजने में मदद कर सकता हूँ। आज आप क्या करना चाहेंगे?`;

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init-1',
      sender: 'bot',
      text: initialBotMessage,
      timestamp: 'Just now',
    }
  ]);

  const quickPrompts = lang === 'en' ? [
    { label: '📄 How to improve my ATS score?', query: 'How can I optimize my resume for a high ATS score?' },
    { label: '🚀 Send resume directly to HR', query: 'How does the direct HR dispatch feature work?' },
    { label: '⚖️ Why Kaushal Setu vs LinkedIn/Unstop?', query: 'Why is Kaushal Setu better than LinkedIn and Unstop for Bharat youth?' },
    { label: '🎯 What is my biggest skill gap?', query: 'What is the biggest skill gap holding back my salary?' },
    { label: '💼 Free government certified courses', query: 'Which free PMKVY or UPSDM courses should I take?' }
  ] : [
    { label: '📄 रेज़्यूमे एटीएस स्कोर कैसे बढ़ाएं?', query: 'मेरा रेज़्यूमे एटीएस स्कोर 90% कैसे पहुंचेगा?' },
    { label: '🚀 एचआर को सीधा रेज़्यूमे कैसे भेजें?', query: 'एचआर को डायरेक्ट रेज़्यूमे भेजने की क्या प्रक्रिया है?' },
    { label: '⚖️ लिंक्डइन और अनस्टॉप से यह कैसे बेहतर है?', query: 'लिंक्डइन और अनस्टॉप के मुकाबले कौशल सेतु में क्या खास है?' },
    { label: '🎯 मेरा मुख्य कौशल अंतर क्या है?', query: 'मेरी सैलरी बढ़ाने के लिए मुझे कौन सा कौशल सीखना होगा?' },
    { label: '💼 फ्री सरकारी कोर्स कौन से हैं?', query: 'मुझे कौन से फ्री सरकारी सर्टिफिकेट कोर्स करने चाहिए?' }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      let botResponse = '';
      const lower = text.toLowerCase();

      if (lower.includes('ats') || lower.includes('resume') || lower.includes('रेज़्यूमे') || lower.includes('स्कोर')) {
        botResponse = lang === 'en'
          ? `✅ **ATS Optimization Tips for ${targetRole}:**\n1. Ensure key trade keywords like *Tally Prime, GSTR-2B, Inverter Diagnostics* match employer job descriptions.\n2. Use standard single-column layout without complex graphics.\n3. Add quantifiable metrics (e.g. 'Reconciled 200+ monthly invoices with 99% accuracy').\n\nYou can edit and update your resume right now in our **AI Resume Builder**!`
          : `✅ **${targetRole} के लिए एटीएस स्कोर बढ़ाने के सुझाव:**\n1. अपने ट्रेड के मुख्य तकनीकी शब्द जैसे *Tally Prime, GSTR-2B, Solar Inverter* अवश्य शामिल करें।\n2. सरल सिंगल-कॉलम लेआउट रखें जिससे सॉफ्टवेयर आसानी से पढ़ सके।\n3. अपने काम के आंकड़े लिखें (जैसे 'प्रतिमाह 200+ बिलों का 99% शुद्धता से मिलान किया')।\n\nआप अभी **AI Resume Builder** में जाकर अपना रेज़्यूमे अपडेट कर सकते हैं!`;
      } else if (lower.includes('hr') || lower.includes('dispatch') || lower.includes('भेजें') || lower.includes('नौकरी')) {
        botResponse = lang === 'en'
          ? `🚀 **Direct HR Recruiter Dispatch:**\nUnlike traditional job boards where your application sits in an inbox, Kaushal Setu pushes your verified resume directly to our 140+ partnered employers across Uttar Pradesh (e.g., Kedia Logistics, Tata Solar Partners, Swiggy Instamart).\n\nGo to the **Resume Builder** or **Jobs** tab and click **'Send Resume to HR'** to see live tracking status!`
          : `🚀 **सीधा एचआर डिस्पैच सिस्टम:**\nपारंपरिक जॉब वेबसाइट्स की तरह आपका फॉर्म पेंडिंग नहीं रहता। कौशल सेतु आपका सत्यापित रेज़्यूमे उत्तर प्रदेश के 140+ अधिकृत नियोक्ताओं और एचआर को सीधे पोर्टल और व्हाट्सएप एपीआई के जरिए भेजता है।\n\nआप **Resume Builder** या **Jobs** पेज पर जाकर **'Send Resume to HR'** बटन दबाएं और लाइव स्टेटस ट्रैक करें!`;
      } else if (lower.includes('linkedin') || lower.includes('unstop') || lower.includes('लिंक्डइन') || lower.includes('खास')) {
        botResponse = lang === 'en'
          ? `🔥 **Why Kaushal Setu beats LinkedIn & Unstop for Bharat:**\n\n1. **No Ghost Applications:** LinkedIn has a 98% ghost rate. We guarantee direct delivery to local verified HRs.\n2. **Beyond Elite Tech Coders:** Traditional portals focus only on top-tier engineering coders; we focus on 85% of Bharat youth (vocational trades, commerce, ITI, rural enterprise).\n3. **100% Vernacular & Audio:** Fully accessible in Hindi with low-bandwidth 4G optimization.\n4. **Proof-of-Skill Diagnostic:** 3-minute scenario benchmark instead of vanity certificates!`
          : `🔥 **कौशल सेतु लिंक्डइन और अनस्टॉप से कैसे बेहतर है:**\n\n1. **कोई घोस्ट जॉब नहीं:** लिंक्डइन पर 98% आवेदनों का जवाब नहीं आता। हम सीधे स्थानीय एचआर के व्हाट्सएप और पोर्टल पर पुश करते हैं।\n2. **सभी युवाओं के लिए:** अनस्टॉप केवल आईआईटी/इंजीनियरिंग कोडिंग तक सीमित है; हम आईटीआई, बीकॉम, नॉन-टेक और ग्रामीण युवाओं के लिए बने हैं।\n3. **पूरी तरह हिंदी व स्थानीय भाषा:** कम डेटा (2G/3G) पर भी तेज़ और ऑडियो-सक्षम।\n4. **व्यावहारिक कौशल परीक्षा:** लंबी क्विज़ के बदले सिर्फ 3 व्यावहारिक प्रश्नों से क्षमता की सही पहचान!`;
      } else if (lower.includes('course') || lower.includes('कोर्स') || lower.includes('free') || lower.includes('सरकारी')) {
        botResponse = lang === 'en'
          ? `🎓 **Top Free Government Certified Courses for You:**\n- **UPSDM Practical GST Workshop:** 24 Hours, Govt Certified (Free)\n- **PM Surya Ghar Rooftop Solar ITI Lab:** 30 Hours Weekend Training\n- **CSC Digital Financial Services Module:** Free online with stipend subsidy.\n\nCheck the **Courses** tab to view syllabi and enroll without any fees!`
          : `🎓 **आपके लिए शीर्ष निःशुल्क सरकारी प्रमाणित कोर्स:**\n- **यूपीएसडीएम (UPSDM) प्रैक्टिकल जीएसटी वर्कशॉप:** 24 घंटे, सरकारी प्रमाणपत्र (फ्री)\n- **पीएम सूर्य घर सोलर इंस्टॉलेशन लैब:** 30 घंटे सप्ताहांत आईटीआई ट्रेनिंग\n- **सीएससी डिजिटल सेवा मॉड्यूल:** निःशुल्क ऑनलाइन प्रशिक्षण।\n\nविस्तार से देखने के लिए **Courses** टैब पर जाएं!`;
      } else {
        botResponse = lang === 'en'
          ? `I understand! Based on your target role as **${targetRole}**, my top recommendation is to finish updating your **AI Resume**, run the quick **3-Question Diagnostic Assessment**, and check your **Skill Gap Report** to unlock a potential ₹${selectedPersonaId === 'priya' ? '8,500' : '9,000'}/month salary boost.`
          : `मैं समझ गया! **${targetRole}** के लिए मेरी सलाह है कि पहले अपना **AI Resume** अपडेट करें, फिर त्वरित **3 प्रश्नों की कौशल परीक्षा** दें। इससे आपकी **कौशल अंतर रिपोर्ट** बनेगी और आपकी मासिक आय में ₹${selectedPersonaId === 'priya' ? '8,500' : '9,000'} तक की वृद्धि हो सकती है।`;
      }

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: botResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <>
      {/* Floating Trigger Button with Mascot Avatar */}
      <div className="fixed bottom-5 right-5 z-50 no-print flex flex-col items-end gap-2">
        {!isOpen && (
          <div className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full shadow-lg border border-blue-200 text-xs font-semibold text-slate-800 flex items-center gap-2 animate-bounce cursor-pointer" onClick={() => setIsOpen(true)}>
            <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-spin" />
            <span>{lang === 'en' ? 'Ask Kaushal Saarthi AI' : 'कौशल सारथी से पूछें'}</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          </div>
        )}

        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-all duration-300 relative group ${
            isOpen 
              ? 'bg-slate-900 text-white rotate-90' 
              : 'bg-gradient-to-tr from-blue-700 via-indigo-600 to-blue-500 text-white hover:scale-105 shadow-blue-500/30'
          }`}
          aria-label="Toggle Kaushal Saarthi Chatbot"
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <div className="relative flex items-center justify-center">
              {/* Custom Mascot Logo with Antenna & Eyes */}
              <svg className="w-8 h-8 text-white drop-shadow-sm" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Robot Head Body */}
                <rect x="5" y="8" width="26" height="22" rx="8" fill="white" fillOpacity="0.95" />
                {/* Antenna */}
                <path d="M18 8V3M18 3L15 4.5M18 3L21 4.5" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
                <circle cx="18" cy="2.5" r="2.2" fill="#F59E0B" />
                {/* Robot Screen/Face */}
                <rect x="8" y="11" width="20" height="13" rx="4" fill="#1E293B" />
                {/* Cyan Glowing Eyes */}
                <circle cx="13" cy="17" r="2" fill="#38BDF8" />
                <circle cx="23" cy="17" r="2" fill="#38BDF8" />
                {/* Friendly Smile */}
                <path d="M15 20.5C16 21.5 20 21.5 21 20.5" stroke="#38BDF8" strokeWidth="1.5" strokeLinecap="round" />
                {/* Ear Sensors */}
                <rect x="2" y="14" width="3" height="7" rx="1.5" fill="#F59E0B" />
                <rect x="31" y="14" width="3" height="7" rx="1.5" fill="#F59E0B" />
              </svg>
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></span>
            </div>
          )}
        </button>
      </div>

      {/* Floating Chat Drawer Modal */}
      {isOpen && (
        <div className="fixed bottom-22 right-4 sm:right-6 w-[92vw] sm:w-[410px] h-[580px] max-h-[82vh] bg-white rounded-2xl shadow-2xl border border-slate-200/90 flex flex-col z-50 overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200 no-print">
          
          {/* Header Bar */}
          <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white p-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center p-1 shadow-inner">
                {/* Mini Mascot */}
                <svg className="w-7 h-7 text-white" viewBox="0 0 36 36" fill="none">
                  <rect x="5" y="8" width="26" height="22" rx="7" fill="white" />
                  <rect x="8" y="11" width="20" height="13" rx="4" fill="#0F172A" />
                  <circle cx="13" cy="17" r="2" fill="#38BDF8" />
                  <circle cx="23" cy="17" r="2" fill="#38BDF8" />
                  <path d="M15 20.5C16 21.5 20 21.5 21 20.5" stroke="#38BDF8" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-sm tracking-tight text-white leading-tight">
                    {lang === 'en' ? 'Kaushal Saarthi AI' : 'कौशल सारथी एआई'}
                  </h3>
                  <span className="text-[10px] px-1.5 py-0.2 bg-emerald-500/30 text-emerald-300 border border-emerald-400/40 rounded-full font-mono font-semibold">
                    LIVE
                  </span>
                </div>
                <p className="text-[11px] text-blue-100 font-medium">
                  {lang === 'en' ? 'Bilingual Career & HR Copilot' : 'द्विभाषी करियर एवं भर्ती सहायक'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                title="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Stats Micro Strip */}
          <div className="bg-slate-50 border-b border-slate-200 px-4 py-2 flex items-center justify-between text-[11px] text-slate-600 font-medium">
            <span className="flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-blue-600" />
              <span>140+ UP Recruiters Connected</span>
            </span>
            <span className="text-emerald-700 font-semibold flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-500" />
              Direct HR Dispatch Active
            </span>
          </div>

          {/* Message Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs shrink-0 font-bold shadow-xs">
                    KS
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed shadow-2xs ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-xs font-medium'
                      : 'bg-white text-slate-800 border border-slate-200/90 rounded-bl-xs'
                  }`}
                >
                  <div className="whitespace-pre-line">{msg.text}</div>
                  <div className={`text-[9.5px] mt-1 text-right ${msg.sender === 'user' ? 'text-blue-100' : 'text-slate-400'}`}>
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2 items-center text-xs text-slate-400 italic">
                <div className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">
                  KS
                </div>
                <div className="bg-white border border-slate-200 rounded-xl px-3 py-2 flex items-center gap-1.5 shadow-2xs">
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  <span className="text-[11px] text-slate-500 font-medium ml-1">
                    {lang === 'en' ? 'Saarthi is typing...' : 'सारथी विचार कर रहा है...'}
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompt Suggestion Chips */}
          <div className="p-2.5 bg-white border-t border-slate-100 overflow-x-auto whitespace-nowrap flex gap-1.5 scrollbar-thin">
            {quickPrompts.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(chip.query)}
                className="text-[10.5px] px-2.5 py-1 rounded-full bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200/80 transition-all font-medium shrink-0"
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              placeholder={lang === 'en' ? 'Type question or choose above...' : 'अपना प्रश्न लिखें या ऊपर विकल्प चुनें...'}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="w-9 h-9 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white flex items-center justify-center transition-all shadow-xs shrink-0 cursor-pointer"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}
    </>
  );
};
