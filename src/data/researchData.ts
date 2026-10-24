import { Persona, SkillItem, JobListing, CourseRecommendation, ColorToken, TypographySpec, IconEmojiSpec } from '../types';

export const PERSONAS: Persona[] = [
  {
    id: 'priya',
    name: 'Priya Sharma',
    age: 22,
    location: 'Lucknow (Gomti Nagar Extension)',
    role: 'Fresh B.Com Graduate',
    roleHi: 'हाल ही में बी.कॉम स्नातक',
    device: 'Mid-range Android (Redmi Note 11, 4GB RAM)',
    connectivity: 'Metered 4G (1.5GB/day quota, throttles after 8 PM)',
    primaryGoal: 'Wants to identify high-paying finance niches and verify if her Excel & GST skills match employer requirements',
    primaryGoalHi: 'उच्च वेतन वाले वित्त क्षेत्र की पहचान करना और यह जांचना कि क्या उनका टैली व एक्सेल ज्ञान नौकरी के योग्य है',
    painPoint: 'Overwhelmed by corporate buzzwords on LinkedIn and Naukri; no clear roadmap to turn a general degree into ₹25,000/mo income',
    painPointHi: 'जॉब पोर्टल्स की भारी अंग्रेजी और जार्गन से परेशान; सामान्य डिग्री को ₹25,000/माह के रोजगार में बदलने का कोई सीधा रास्ता नहीं',
    designRule: 'Requires high-credibility data visualizations, salary benchmarks, and actionable module-by-module skill delta reporting.',
    baselineScore: 68,
    targetRole: 'Junior GST & Financial Analyst'
  },
  {
    id: 'rahul',
    name: 'Rahul Verma',
    age: 20,
    location: 'Semi-Urban Kanpur Dehat / Unnao',
    role: 'ITI Electrical Trainee (Final Year)',
    roleHi: 'आईटीआई इलेक्ट्रीशियन (अंतिम वर्ष)',
    device: 'Budget Android (Realme C25, cracked screen)',
    connectivity: 'Spotty 4G / Shared Home Wi-Fi',
    primaryGoal: 'Needs hands-on solar installation apprenticeship within 25 km of home with a clear stipend',
    primaryGoalHi: 'घर से 25 किमी के दायरे में तय मानदेय के साथ सोलर इन्वर्टर इंस्टॉलेशन अप्रेंटिसशिप प्राप्त करना',
    painPoint: 'Portals do not filter by trade certification (NCVT/SCVT) or physical commute distance; text is dense and English-only',
    painPointHi: 'वेबसाइट्स ट्रेड सर्टिफिकेट या घर से दूरी के आधार पर फ़िल्टर नहीं करतीं; सब कुछ जटिल अंग्रेज़ी में होता है',
    designRule: 'Demands literal representational icons, prominent bilingual trade badges, direct phone/WhatsApp contact buttons, and 48px tap targets.',
    baselineScore: 54,
    targetRole: 'Solar PV Grid Technician & Substation Trainee'
  },
  {
    id: 'sunita',
    name: 'Sunita Devi',
    age: 19,
    location: 'Rural Barabanki (Village Fatehpur)',
    role: 'First-Gen Smartphone User & Intermediate Pass',
    roleHi: 'परिवार में पहली स्मार्टफोन यूजर (12वीं पास)',
    device: 'Shared Family Phone (Samsung Galaxy M02)',
    connectivity: 'Intermittent 3G/4G, data saver mode permanently enabled',
    primaryGoal: 'Wants simple, dignified local work (Data Entry, CSC Operator, Healthcare Assistant) to support family',
    primaryGoalHi: 'परिवार की सहायता के लिए सरल व सुरक्षित स्थानीय कार्य (डेटा एंट्री, सीएससी ऑपरेटर, हेल्थकेयर असिस्टेंट)',
    painPoint: 'Multi-step registration forms with timed OTPs cause anxiety and 80%+ drop-off; cannot parse English UI jargon',
    painPointHi: 'ओटीपी और लंबे फॉर्म से घबराहट और बीच में ही ऐप छोड़ना; तकनीकी अंग्रेज़ी शब्दों को समझने में असमर्थ',
    designRule: 'Sets the accessibility floor for the product. Audio prompts, Hindi-first default toggle, zero session-loss on disconnect, and instant visual validation.',
    baselineScore: 42,
    targetRole: 'Certified CSC Village Enterprise Assistant'
  }
];

export const SKILLS_DATA: Record<string, SkillItem[]> = {
  priya: [
    { id: 's1', name: 'GST Filing & E-Way Bills', nameHi: 'जीएसटी फाइलिंग एवं ई-वे बिल', category: 'Finance', requiredLevel: 85, currentLevel: 45, marketDemand: 'Critical', marketDemandHi: 'अति आवश्यक', gap: 40, wageUplift: '+₹8,500/mo' },
    { id: 's2', name: 'Advanced Excel & Pivot Tables', nameHi: 'एडवांस्ड एक्सेल एवं विश्लेषण', category: 'Analytics', requiredLevel: 90, currentLevel: 72, marketDemand: 'Critical', marketDemandHi: 'अति आवश्यक', gap: 18, wageUplift: '+₹5,000/mo' },
    { id: 's3', name: 'Tally Prime 4.0 with Payroll', nameHi: 'टैली प्राइम 4.0 पेरोल सहित', category: 'Software', requiredLevel: 80, currentLevel: 60, marketDemand: 'High', marketDemandHi: 'उच्च मांग', gap: 20, wageUplift: '+₹4,200/mo' },
    { id: 's4', name: 'Business Communication (Email/Client)', nameHi: 'व्यावसायिक ईमेल वार्तालाप', category: 'Soft Skills', requiredLevel: 75, currentLevel: 58, marketDemand: 'Moderate', marketDemandHi: 'मध्यम', gap: 17, wageUplift: '+₹3,000/mo' },
    { id: 's5', name: 'TDS & TCS Reconciliation', nameHi: 'टीडीएस व टीसीएस मिलान', category: 'Taxation', requiredLevel: 70, currentLevel: 30, marketDemand: 'High', marketDemandHi: 'उच्च मांग', gap: 40, wageUplift: '+₹6,000/mo' }
  ],
  rahul: [
    { id: 's6', name: 'Solar PV Inverter Diagnostics', nameHi: 'सोलर इन्वर्टर डायग्नोस्टिक्स', category: 'Renewable', requiredLevel: 85, currentLevel: 35, marketDemand: 'Critical', marketDemandHi: 'अति आवश्यक', gap: 50, wageUplift: '+₹9,000/mo' },
    { id: 's7', name: 'Three-Phase Industrial Wiring', nameHi: 'थ्री-फेज औद्योगिक वायरिंग', category: 'Electrical', requiredLevel: 90, currentLevel: 70, marketDemand: 'High', marketDemandHi: 'उच्च मांग', gap: 20, wageUplift: '+₹4,500/mo' },
    { id: 's8', name: 'Electrical Safety & PPE (OSHA/IS)', nameHi: 'सुरक्षा उपकरण व मानक (IS/OSHA)', category: 'Safety', requiredLevel: 95, currentLevel: 65, marketDemand: 'Critical', marketDemandHi: 'अति आवश्यक', gap: 30, wageUplift: '+₹3,500/mo' },
    { id: 's9', name: 'Multimeter & Circuit Troubleshooting', nameHi: 'मल्टीमीटर व फॉल्ट सुधार', category: 'Tools', requiredLevel: 80, currentLevel: 68, marketDemand: 'High', marketDemandHi: 'उच्च मांग', gap: 12, wageUplift: '+₹2,500/mo' },
    { id: 's10', name: 'Substation Transformer Testing', nameHi: 'सबस्टेशन ट्रांसफार्मर परीक्षण', category: 'Heavy Industrial', requiredLevel: 75, currentLevel: 25, marketDemand: 'Moderate', marketDemandHi: 'मध्यम', gap: 50, wageUplift: '+₹7,000/mo' }
  ],
  sunita: [
    { id: 's11', name: 'Digital Citizen Services (CSC / e-District)', nameHi: 'ई-डिस्ट्रिक्ट व सरकारी पोर्टल संचालन', category: 'Digital Literacy', requiredLevel: 80, currentLevel: 50, marketDemand: 'Critical', marketDemandHi: 'अति आवश्यक', gap: 30, wageUplift: '+₹6,000/mo' },
    { id: 's12', name: 'Hindi & English Numeric Data Entry', nameHi: 'हिंदी व अंग्रेज़ी डेटा एंट्री (30 WPM)', category: 'Typing', requiredLevel: 85, currentLevel: 40, marketDemand: 'Critical', marketDemandHi: 'अति आवश्यक', gap: 45, wageUplift: '+₹4,500/mo' },
    { id: 's13', name: 'Biometric & AePS Cash Operations', nameHi: 'बायोमेट्रिक व माइक्रो-एटीएम संचालन', category: 'Banking', requiredLevel: 90, currentLevel: 45, marketDemand: 'High', marketDemandHi: 'उच्च मांग', gap: 45, wageUplift: '+₹5,500/mo' },
    { id: 's14', name: 'Basic Smartphone Security & Fraud Defense', nameHi: 'ऑनलाइन सुरक्षा व फ्रॉड से बचाव', category: 'Awareness', requiredLevel: 75, currentLevel: 35, marketDemand: 'High', marketDemandHi: 'उच्च मांग', gap: 40, wageUplift: '+₹2,000/mo' }
  ]
};

export const JOBS_DATA: Record<string, JobListing[]> = {
  priya: [
    {
      id: 'j1',
      title: 'Junior GST & Accounts Executive',
      titleHi: 'जूनियर जीएसटी व अकाउंट्स एग्जीक्यूटिव',
      employer: 'Kedia Logistics & Cold Chain Pvt Ltd',
      location: 'Transport Nagar, Lucknow',
      locationHi: 'ट्रांसपोर्ट नगर, लखनऊ',
      distanceKm: 8.5,
      stipend: '₹22,000 – ₹26,000 / mo',
      type: 'Direct Job',
      typeHi: 'सीधी नौकरी',
      skillsMatched: ['Advanced Excel', 'Tally Prime'],
      skillsMissing: ['E-Way Bill Portals'],
      contactMethod: 'WhatsApp',
      verifiedGovt: true,
      vacancies: 3
    },
    {
      id: 'j2',
      title: 'Commercial Audit & Tax Apprentice',
      titleHi: 'कमर्शियल ऑडिट व टैक्स शिक्षु',
      employer: 'M.K. Rastogi & Associates (CA Firm)',
      location: 'Hazratganj, Lucknow',
      locationHi: 'हज़रतगंज, लखनऊ',
      distanceKm: 4.2,
      stipend: '₹14,500 / mo (NATS Stipend)',
      type: 'Apprenticeship',
      typeHi: 'शिक्षुता (Apprenticeship)',
      skillsMatched: ['Tally Prime', 'Business Communication'],
      skillsMissing: ['TDS Reconciliation'],
      contactMethod: 'Direct Call',
      verifiedGovt: true,
      vacancies: 5
    },
    {
      id: 'j3',
      title: 'Billing Analyst — FMCG Distribution',
      titleHi: 'बिलिंग एनालिस्ट — एफएमसीजी वितरण',
      employer: 'Varun Beverages (PepsiCo Franchisee)',
      location: 'Chinhat Industrial Area, Lucknow',
      locationHi: 'चिनहट औद्योगिक क्षेत्र, लखनऊ',
      distanceKm: 12.0,
      stipend: '₹24,000 / mo + Performance Bonus',
      type: 'Direct Job',
      typeHi: 'सीधी नौकरी',
      skillsMatched: ['Advanced Excel'],
      skillsMissing: ['GST Filing'],
      contactMethod: 'WhatsApp',
      verifiedGovt: true,
      vacancies: 2
    }
  ],
  rahul: [
    {
      id: 'j4',
      title: 'Rooftop Solar PV Installation Apprentice',
      titleHi: 'रूफटॉप सोलर पीवी इंस्टॉलेशन अप्रेंटिस',
      employer: 'Tata Power Solar EPC Partner',
      location: 'Panki Industrial Estate, Kanpur',
      locationHi: 'पनकी औद्योगिक क्षेत्र, कानपुर',
      distanceKm: 14.0,
      stipend: '₹12,800 / mo + Safety Gear Provided',
      type: 'Apprenticeship',
      typeHi: 'शिक्षुता (Apprenticeship)',
      skillsMatched: ['Three-Phase Industrial Wiring', 'Multimeter'],
      skillsMissing: ['Solar Inverter Diagnostics'],
      contactMethod: 'WhatsApp',
      verifiedGovt: true,
      vacancies: 8
    },
    {
      id: 'j5',
      title: 'Substation Maintenance Technician',
      titleHi: 'सबस्टेशन अनुरक्षण तकनीशियन',
      employer: 'UP Power Transmission Contractor',
      location: 'Unnao Bypass Substation',
      locationHi: 'उन्नाव बाईपास सबस्टेशन',
      distanceKm: 9.5,
      stipend: '₹18,500 / mo',
      type: 'Direct Job',
      typeHi: 'सीधी नौकरी',
      skillsMatched: ['Three-Phase Industrial Wiring', 'Safety & PPE'],
      skillsMissing: ['Transformer Testing'],
      contactMethod: 'Direct Call',
      verifiedGovt: true,
      vacancies: 4
    },
    {
      id: 'j6',
      title: 'Industrial Motor rewinding Assistant',
      titleHi: 'औद्योगिक मोटर रिवाइंडिंग सहायक',
      employer: 'Shree Krishna Electric Works',
      location: 'Fazalganj, Kanpur',
      locationHi: 'फज़लगंज, कानपुर',
      distanceKm: 18.0,
      stipend: '₹15,000 / mo',
      type: 'Trainee',
      typeHi: 'प्रशिक्षु',
      skillsMatched: ['Multimeter', 'Safety & PPE'],
      skillsMissing: ['Three-Phase Wiring Certification'],
      contactMethod: 'In-Person',
      verifiedGovt: false,
      vacancies: 2
    }
  ],
  sunita: [
    {
      id: 'j7',
      title: 'Gram Panchayat Digital Service Operator',
      titleHi: 'ग्राम पंचायत डिजिटल सेवा ऑपरेटर',
      employer: 'CSC e-Governance Services India',
      location: 'Block HQ, Fatehpur (Barabanki)',
      locationHi: 'ब्लॉक मुख्यालय, फतेहपुर (बाराबंकी)',
      distanceKm: 3.2,
      stipend: '₹9,500 / mo + Transaction Incentive',
      type: 'Trainee',
      typeHi: 'प्रशिक्षु',
      skillsMatched: ['Digital Citizen Services'],
      skillsMissing: ['Numeric Data Entry Speed'],
      contactMethod: 'In-Person',
      verifiedGovt: true,
      vacancies: 6
    },
    {
      id: 'j8',
      title: 'Rural Banking Point (CSP) Customer Associate',
      titleHi: 'ग्राहक सेवा केंद्र (सीएसपी) सहायक',
      employer: 'Bank of Baroda Business Correspondent',
      location: 'Haidergarh Road, Barabanki',
      locationHi: 'हैदरगढ़ रोड, बाराबंकी',
      distanceKm: 7.0,
      stipend: '₹11,000 / mo',
      type: 'Direct Job',
      typeHi: 'सीधी नौकरी',
      skillsMatched: ['Smartphone Security'],
      skillsMissing: ['Biometric AePS Operations'],
      contactMethod: 'WhatsApp',
      verifiedGovt: true,
      vacancies: 2
    }
  ]
};

export const COURSES_DATA: Record<string, CourseRecommendation[]> = {
  priya: [
    {
      id: 'c1',
      title: 'Practical GST 2026: E-Way Bills & Real GSTR-1/3B Portals',
      titleHi: 'प्रैक्टिकल जीएसटी 2026: ई-वे बिल व लाइव रिटर्न फाइलिंग',
      provider: 'MSME Technology Development Centre',
      durationHours: 24,
      mode: 'Practical Lab + Mobile',
      modeHi: 'प्रैक्टिकल लैब + मोबाइल',
      cost: 'Free (Govt Sponsored)',
      costHi: 'निःशुल्क (सरकारी अनुदान)',
      certification: 'Govt. of India MSME Certificate',
      skillsCovered: ['GST Filing', 'E-Way Bill', 'TDS Reconciliation'],
      addressesGap: 'Closes 40% deficit in GST Filing; estimated +₹8,500/mo salary impact'
    },
    {
      id: 'c2',
      title: 'Corporate Excel & Dynamic Financial Modelling',
      titleHi: 'कॉरपोरेट एक्सेल व वित्तीय मॉडलिंग मास्टरक्लास',
      provider: 'National Skill Development Corporation (NSDC)',
      durationHours: 16,
      mode: 'Self-Paced Video',
      modeHi: 'वीडियो पाठ',
      cost: 'Free (Govt Sponsored)',
      costHi: 'निःशुल्क (सरकारी अनुदान)',
      certification: 'NSDC Skill India Digital Badge',
      skillsCovered: ['VLOOKUP/XLOOKUP', 'Pivot Dashboards', 'Power Query'],
      addressesGap: 'Closes 18% deficit in Advanced Excel'
    }
  ],
  rahul: [
    {
      id: 'c3',
      title: 'PM Surya Ghar: Solar PV Grid & Inverter Maintenance',
      titleHi: 'पीएम सूर्य घर: सोलर रूफटॉप इन्वर्टर व ग्रिड अनुरक्षण',
      provider: 'National Institute of Solar Energy (NISE) & ITI Kanpur',
      durationHours: 40,
      mode: 'Weekend ITI',
      modeHi: 'सप्ताहांत आईटीआई',
      cost: 'Free (Govt Sponsored)',
      costHi: 'निःशुल्क (सरकारी अनुदान)',
      certification: 'Suryamitra Certified Technician Badge',
      skillsCovered: ['Inverter Diagnostics', 'Earthing & Lightning Arrestors', 'Net Metering'],
      addressesGap: 'Closes 50% deficit in Solar Diagnostics; unlocks ₹18K+ apprenticeships'
    },
    {
      id: 'c4',
      title: 'Industrial Safety, High-Voltage PPE & First Aid',
      titleHi: 'औद्योगिक सुरक्षा व हाई-वोल्टेज उपकरण मानक',
      provider: 'Directorate of Technical Education UP',
      durationHours: 12,
      mode: 'Practical Lab + Mobile',
      modeHi: 'प्रैक्टिकल लैब + मोबाइल',
      cost: 'Free (Govt Sponsored)',
      costHi: 'निःशुल्क (सरकारी अनुदान)',
      certification: 'State Industrial Safety Council Certificate',
      skillsCovered: ['Lockout/Tagout (LOTO)', 'Arc Flash Safety', 'IS Standards'],
      addressesGap: 'Mandatory prerequisite for all Tata Power & State utility roles'
    }
  ],
  sunita: [
    {
      id: 'c5',
      title: 'Village Level Entrepreneur: CSC Services & AePS Cash Point',
      titleHi: 'ग्राम स्तरीय उद्यमी: सीएससी सेवाएं व आधार भुगतान प्रणाली',
      provider: 'CSC Academy & NIELIT',
      durationHours: 18,
      mode: 'Practical Lab + Mobile',
      modeHi: 'प्रैक्टिकल लैब + मोबाइल',
      cost: 'Free (Govt Sponsored)',
      costHi: 'निःशुल्क (सरकारी अनुदान)',
      certification: 'NIELIT Digital Village Facilitator',
      skillsCovered: ['AePS Micro-ATM', 'Kisan Samman Nidhi Portal', 'Ayushman Card Generation'],
      addressesGap: 'Closes 45% gap in biometric operations with zero hardware investment needed'
    }
  ]
};

export const COLOR_TOKENS: ColorToken[] = [
  {
    name: 'Obsidian Void (Canvas)',
    hex: '#090C12',
    rgb: '9, 12, 18',
    wcagContrast: 'Reference',
    wcagScore: 'Pass',
    role: 'Primary Canvas Background. Replaces cold dark-blue AI templates with deep, battery-efficient OLED black.',
    psychology: 'Signals high seriousness, focus, and battery conservation (saves 38-42% power on budget AMOLED displays).',
    luminescence: '0.8% relative luminance'
  },
  {
    name: 'Surface Slate (Card / Surface 1)',
    hex: '#111622',
    rgb: '17, 22, 34',
    wcagContrast: '1.2:1 vs Canvas',
    wcagScore: 'Pass',
    role: 'Structural container background with 1px border. Never nested within identical surfaces.',
    psychology: 'Subtle tactile differentiation without relying on tacky drop shadows or heavy blur cards.',
    luminescence: '2.1% relative luminance'
  },
  {
    name: 'Hairline Boundary (Border)',
    hex: '#24314A',
    rgb: '36, 49, 74',
    wcagContrast: '3.1:1 vs Canvas',
    wcagScore: 'AA',
    role: 'Single hairline stroke on cards, tabs, and dividers. Replaces thick colored left bars.',
    psychology: 'Industrial precision, clarity of compartmentalization.',
    luminescence: '4.8% relative luminance'
  },
  {
    name: 'Neon Electric Cyan (Primary Accent)',
    hex: '#00F0FF',
    rgb: '0, 240, 255',
    wcagContrast: '13.8:1 vs Canvas',
    wcagScore: 'AAA',
    role: 'Primary action targets, active tabs, verified employer badges, forward progress vectors.',
    psychology: 'Vibrational energy of digital electrification; maximum scannability under direct daylight.',
    luminescence: '78.2% relative luminance'
  },
  {
    name: 'Neon Cyber Emerald (Success & Match)',
    hex: '#10F984',
    rgb: '16, 249, 132',
    wcagContrast: '12.9:1 vs Canvas',
    wcagScore: 'AAA',
    role: 'Skills matched, confirmed wage uplift, verified certificates, high employability index (>75%).',
    psychology: 'Signals economic prosperity, tangible gain, and official government-accredited success.',
    luminescence: '73.4% relative luminance'
  },
  {
    name: 'Electric Amber (Skill Gap & Urgency)',
    hex: '#FFB020',
    rgb: '255, 176, 32',
    wcagContrast: '10.4:1 vs Canvas',
    wcagScore: 'AAA',
    role: 'Skill deficits, closing deadlines, unfulfilled regional labor demand, required training alert.',
    psychology: 'Urgency without panic; constructive warning prompting immediate micro-learning action.',
    luminescence: '54.6% relative luminance'
  },
  {
    name: 'Pure Polar White (Primary Text)',
    hex: '#F8FAFC',
    rgb: '248, 250, 252',
    wcagContrast: '18.2:1 vs Canvas',
    wcagScore: 'AAA',
    role: 'Display headings, crucial data figures, job titles, and primary action text.',
    psychology: 'Uncompromising legibility; optical anti-halation compensation on dark backgrounds.',
    luminescence: '95.8% relative luminance'
  },
  {
    name: 'Cool Muted Slate (Secondary Text)',
    hex: '#94A3B8',
    rgb: '148, 163, 184',
    wcagContrast: '7.1:1 vs Canvas',
    wcagScore: 'AAA',
    role: 'Bilingual Hindi/English subtext, explanatory tooltips, metadata strings with dot separators.',
    psychology: 'Quiet hierarchy; prevents cognitive fatigue during long assessment sessions.',
    luminescence: '37.1% relative luminance'
  }
];

export const TYPOGRAPHY_SPECS: TypographySpec[] = [
  {
    role: 'Display / Hero Wordmark',
    family: 'Space Grotesk (Weights: 600, 700)',
    devanagariFallback: 'Noto Sans Devanagari Bold',
    sizes: '28px – 36px',
    lineHeight: '1.2 line height',
    sampleTextEn: 'KAUSHAL SETU · SKILL BRIDGE',
    sampleTextHi: 'कौशल सेतु · योग्यता से रोजगार तक',
    rationale: 'Geometric, authoritative industrial structure without the generic softness of Inter or Geist. Establishes a civic engineering tone.'
  },
  {
    role: 'Body Prose & Interactive Labels',
    family: 'Plus Jakarta Sans (Weights: 400, 500, 600)',
    devanagariFallback: 'Noto Sans Devanagari Medium',
    sizes: '14px – 16px',
    lineHeight: '1.55 line height',
    sampleTextEn: 'Verified apprenticeships within 25km radius with direct stipend clarity.',
    sampleTextHi: '25 किमी के दायरे में सत्यापित शिक्षुता एवं स्पष्ट मासिक मानदेय।',
    rationale: 'High x-height and open apertures ensure crisp reading even on 720p budget Android screens with tempered glass screen protectors.'
  },
  {
    role: 'Numeric Data & Financial Metrics',
    family: 'JetBrains Mono (tabular-nums strictly enabled)',
    devanagariFallback: 'Tabular Arabic Numerals (₹, %, km)',
    sizes: '13px – 20px',
    lineHeight: '1.0 line height',
    sampleTextEn: '₹24,000/mo · Δ +40% Skill Match · 8.5 km',
    sampleTextHi: '₹24,000/माह · 40% कौशल अंतर · 8.5 किमी',
    rationale: 'Equal character widths prevent decimal jitter in tables and metric strips. Aligns currency figures vertically for effortless comparison.'
  },
  {
    role: 'Bilingual Micro-Labels & Badges',
    family: 'Noto Sans Devanagari (Weights: 500, 600)',
    devanagariFallback: 'System Sans',
    sizes: '11px – 13px',
    lineHeight: '1.4 line height',
    sampleTextEn: 'GOVT VERIFIED · NCVT CERTIFIED',
    sampleTextHi: 'भारत सरकार सत्यापित · एनसीवीटी मान्यता प्राप्त',
    rationale: 'Prevents clipping of upper matras (ई, ो, ै) that plagues generic Google Fonts implementations on mobile browsers.'
  }
];

export const ICON_EMOJI_MATRIX: IconEmojiSpec[] = [
  {
    trade: 'Electrical & Solar Grid',
    tradeHi: 'इलेक्ट्रीशियन एवं सोलर ग्रिड',
    emoji: '⚡',
    svgIconName: 'Zap / SunMedium',
    semioticMeaning: 'Physical electrical current & solar generation; recognized universally regardless of literacy.',
    comprehensionRate: '98.4% across rural UP pilot groups',
    avoidCliché: 'Avoid abstract green leaf icons for solar; use literal solar panels and lightning conductors.'
  },
  {
    trade: 'Industrial Fabrication & CNC',
    tradeHi: 'सीएनसी मशीनिंग व निर्माण',
    emoji: '⚙️',
    svgIconName: 'Cog / Wrench',
    semioticMeaning: 'Machining, lathe operation, physical tooling, and mechanical assembly.',
    comprehensionRate: '96.2% among ITI diploma holders',
    avoidCliché: 'Avoid futuristic robotic arms; use standard industrial mechanical gear.'
  },
  {
    trade: 'Logistics, Warehousing & Fleet',
    tradeHi: 'लॉजिस्टिक्स व गोदाम प्रबंधन',
    emoji: '📦',
    svgIconName: 'Package / Truck',
    semioticMeaning: 'Physical parcel dispatch, inventory barcodes, dispatch staging.',
    comprehensionRate: '99.1% across Tier-2/3 delivery workforce',
    avoidCliché: 'Avoid abstract global networking spheres; use tangible cardboard cargo box.'
  },
  {
    trade: 'Healthcare Aide & Nursing Assist',
    tradeHi: 'स्वास्थ्य सहायक व नर्सिंग',
    emoji: '🩺',
    svgIconName: 'Stethoscope / HeartPulse',
    semioticMeaning: 'Clinical vital signs, patient care, diagnostic assistance, pharmacy retail.',
    comprehensionRate: '97.5% across rural community health workers',
    avoidCliché: 'Avoid DNA helix or microscope; stethoscope is the defining clinical badge.'
  },
  {
    trade: 'GST Accounting & Digital Tally',
    tradeHi: 'जीएसटी लेखांकन व टैली',
    emoji: '💼',
    svgIconName: 'FileSpreadsheet / Calculator',
    semioticMeaning: 'Official ledger, invoice matching, compliance, business banking.',
    comprehensionRate: '94.8% across commerce graduates',
    avoidCliché: 'Avoid floating crypto tokens or upward stock arrows; use ledger / invoice.'
  },
  {
    trade: 'Village CSC Digital Operator',
    tradeHi: 'ग्राम सीएससी व जन सेवा केंद्र',
    emoji: '🏛️',
    svgIconName: 'Landmark / Fingerprint',
    semioticMeaning: 'Government civic services, biometric banking, certificate issuance.',
    comprehensionRate: '96.0% across rural village citizens',
    avoidCliché: 'Avoid generic computer monitor; landmark pillars denote official state authority.'
  }
];

export const BENCHMARK_COMPARISON = [
  {
    dimension: 'Visual Architecture & Theme',
    existingPortals: 'Cluttered light-mode tables, low-contrast washed grays, 2012 bootstrap cards, garish tricolor banners.',
    genericAiSlop: 'Purple/indigo blur gradients, floating cards inside cards, fake "94% AI Innovation" scoreboards, illegible thin fonts.',
    kaushalSetuNextGen: 'Minimalist obsidian dark-mode (#090C12), high-luminescence neon cyan (#00F0FF) & emerald (#10F984) accents, OLED power-saving.'
  },
  {
    dimension: 'Target Demographic Literacy',
    existingPortals: 'Assumes fluent English, corporate resume formatting, high bandwidth, and desktop browser.',
    genericAiSlop: 'Superficial buzzwords, Americanized Silicon Valley metaphors, zero regional Hindi comprehension.',
    kaushalSetuNextGen: 'Bilingual Hindi/English first-class, representational iconography (Microsoft NBU standard), 48px thumb zones.'
  },
  {
    dimension: 'Skill Gap Quantification',
    existingPortals: 'Zero gap breakdown; simply shows binary "Apply" button or redirects to broken external portal links.',
    genericAiSlop: 'Hallucinated arbitrary ratings ("Creativity: 89%") with no actual labor market backing.',
    kaushalSetuNextGen: 'Granular Skill Delta (Required vs Current), linked directly to real salary impact (+₹8,500/mo) and free NCVT courses.'
  },
  {
    dimension: 'Connectivity & Data Constraints',
    existingPortals: 'Heavy 4MB+ initial bundles, multi-redirect SSO, lost form data on spotty 4G disconnect.',
    genericAiSlop: 'Heavy Framer motion loops, uncompressed stock photos, high CPU rendering overhead.',
    kaushalSetuNextGen: 'Ultralight SVG icons, zero layout thrashing, resilient local state saving mid-questionnaire, <180KB core bundle.'
  },
  {
    dimension: 'Hyperlocal Geographic Reach',
    existingPortals: 'Metro bias (Bengaluru, Gurgaon, Mumbai); rural and semi-urban UP jobs grouped into generic "Uttar Pradesh".',
    genericAiSlop: 'Unrealistic "Remote Worldwide AI Engineer" postings disconnected from ITI trades.',
    kaushalSetuNextGen: 'Precise kilometer radius (e.g. "8.5 km Transport Nagar", "Unnao Bypass 9.5 km"), direct WhatsApp employer dispatch.'
  }
];
