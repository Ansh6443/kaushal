export type Language = 'en' | 'hi';

export interface Persona {
  id: string;
  name: string;
  age: number;
  location: string;
  role: string;
  roleHi: string;
  device: string;
  connectivity: string;
  primaryGoal: string;
  primaryGoalHi: string;
  painPoint: string;
  painPointHi: string;
  designRule: string;
  baselineScore: number;
  targetRole: string;
}

export interface SkillItem {
  id: string;
  name: string;
  nameHi: string;
  category: string;
  requiredLevel: number; // 0 - 100
  currentLevel: number; // 0 - 100
  marketDemand: 'Critical' | 'High' | 'Moderate';
  marketDemandHi: 'अति आवश्यक' | 'उच्च मांग' | 'मध्यम';
  gap: number;
  wageUplift: string;
}

export interface JobListing {
  id: string;
  title: string;
  titleHi: string;
  employer: string;
  location: string;
  locationHi: string;
  distanceKm: number;
  stipend: string;
  type: 'Apprenticeship' | 'Direct Job' | 'Trainee';
  typeHi: 'शिक्षुता (Apprenticeship)' | 'सीधी नौकरी' | 'प्रशिक्षु';
  skillsMatched: string[];
  skillsMissing: string[];
  contactMethod: 'WhatsApp' | 'Direct Call' | 'In-Person';
  verifiedGovt: boolean;
  vacancies: number;
}

export interface CourseRecommendation {
  id: string;
  title: string;
  titleHi: string;
  provider: string;
  durationHours: number;
  mode: 'Practical Lab + Mobile' | 'Self-Paced Video' | 'Weekend ITI';
  modeHi: 'प्रैक्टिकल लैब + मोबाइल' | 'वीडियो पाठ' | 'सप्ताहांत आईटीआई';
  cost: 'Free (Govt Sponsored)' | '₹499 (Skill Subsidy)';
  costHi: 'निःशुल्क (सरकारी अनुदान)' | '₹499 (सब्सिडी)';
  certification: string;
  skillsCovered: string[];
  addressesGap: string;
}

export interface ColorToken {
  name: string;
  hex: string;
  rgb: string;
  wcagContrast: string;
  wcagScore: 'AAA' | 'AA' | 'Pass';
  role: string;
  psychology: string;
  luminescence: string;
}

export interface TypographySpec {
  role: string;
  family: string;
  devanagariFallback: string;
  sizes: string;
  lineHeight: string;
  sampleTextEn: string;
  sampleTextHi: string;
  rationale: string;
}

export interface IconEmojiSpec {
  trade: string;
  tradeHi: string;
  emoji: string;
  svgIconName: string;
  semioticMeaning: string;
  comprehensionRate: string;
  avoidCliché: string;
}


export interface UserProfile {
  name: string;
  phone: string;
  email?: string;
  location: string;
  targetRole: string;
  education: string;
  experienceYears: number;
  skills: string[];
  bio: string;
  resumeBuilt: boolean;
  atsScore: number;
  avatarUrl?: string;
  unlockedCourses?: string[];
  paypalEmail?: string;
}

export interface HrDispatchRecord {
  id: string;
  companyName: string;
  roleTitle: string;
  hrName: string;
  hrRole: string;
  location: string;
  appliedDate: string;
  matchScore: number;
  status: 'Dispatched to HR' | 'HR Reviewing' | 'Interview Scheduled' | 'Shortlisted';
  statusHi: 'एचआर को भेजा गया' | 'एचआर समीक्षाधीन' | 'साक्षात्कार तय' | 'शॉर्टलिस्टेड';
  channel: 'Direct Portal Push' | 'Verified WhatsApp Link' | 'NATS Apprenticeship API';
}

export interface PlatformQaItem {
  id: string;
  pillar: '1-Social Impact' | '2-Presentation' | '3-Unique Idea' | '4-Feasibility' | '5-Prototype' | '6-Q&A Defense';
  pillarHi: '१-सामाजिक प्रभाव' | '२-प्रस्तुति' | '३-विशिष्ट विचार' | '४-व्यावहारिकता' | '५-प्रोटोटाइप' | '६-प्रश्न-उत्तर';
  question: string;
  questionHi: string;
  answer: string;
  answerHi: string;
  metric: string;
}


export interface GigMilestone {
  id: string;
  title: string;
  titleHi?: string;
  employer: string;
  category: string;
  stipendUsd: number;
  stipendInr: number;
  description: string;
  descriptionHi?: string;
  requirements: string[];
  defaultReceiver: string;
}

export interface AiMilestoneEvaluation {
  score: number;
  approved: boolean;
  feedback: string;
  completeness_pct: number;
  technical_accuracy_pct: number;
  practical_feasibility_pct: number;
}

export interface PaypalPayoutReceipt {
  status: string;
  payout_mode: string;
  batch_header?: {
    payout_batch_id: string;
    batch_status: string;
    sender_batch_id: string;
    amount?: {
      value: string;
      currency: string;
    };
  };
  item?: {
    payout_item_id: string;
    transaction_status: string;
    receiver: string;
    amount: {
      value: string;
      currency: string;
    };
    note: string;
  };
  timestamp: string;
  message?: string;
  error?: string;
}

export interface AgenticCourseOrder {
  id: string;
  courseTitle: string;
  originalPrice: number;
  discountPercent: number;
  finalPrice: number;
  status: string;
  orderMode: string;
  timestamp: string;
  captureId?: string;
}
