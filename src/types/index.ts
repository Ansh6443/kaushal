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
