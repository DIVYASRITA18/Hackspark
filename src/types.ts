export type RiskLevel = 'SAFE' | 'CAUTION' | 'HIGH_RISK' | 'DANGER_SCAM';

export type IndicatorSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'POSITIVE';

export interface VisualEvidenceRegion {
  boxLabel: string;
  severity: IndicatorSeverity;
  description: string;
  ymin: number;
  xmin: number;
  ymax: number;
  xmax: number;
}

export interface ExtractedEntities {
  upiIds: string[];
  phoneNumbers: string[];
  telegramLinks: string[];
  emails: string[];
  urls: string[];
  amounts: string[];
}

export interface WarningIndicator {
  severity: IndicatorSeverity;
  category:
    | 'PAYMENT_DEMAND'
    | 'UNREALISTIC_COMPENSATION'
    | 'SUSPICIOUS_COMMUNICATION'
    | 'INTERVIEW_ANOMALY'
    | 'URGENCY_PRESSURE'
    | 'DATA_HARVESTING'
    | 'TASK_BASED_PONZI'
    | 'VISUAL_FORGERY'
    | string;
  title: string;
  explanation: string;
  snippetFound?: string;
}

export interface AnalysisResult {
  riskScore: number; // 0 - 100
  riskLevel: RiskLevel;
  headlineVerdict: string;
  confidenceScore: number;
  identifiedScamType: string;
  warningIndicators: WarningIndicator[];
  legitimacySignals: string[];
  companyVerificationAdvice: string[];
  safeResponseAction: string;
  safeReplyTemplate: string;
  reportingChecklist: string[];
  extractedOcrText?: string;
  imageForensicsSummary?: string;
  visualEvidenceRegions?: VisualEvidenceRegion[];
  extractedEntities?: ExtractedEntities;
}

export interface OpportunityInput {
  text: string;
  companyName: string;
  senderContact: string;
  platform: 'WhatsApp' | 'Email' | 'Telegram' | 'LinkedIn' | 'Instagram' | 'SMS' | 'JobBoard' | 'Other';
  role: string;
  salary: string;
  feeAsked: string;
  imageBase64?: string;
  imageMimeType?: string;
}

export interface SavedScan {
  id: string;
  timestamp: number;
  input: OpportunityInput;
  result: AnalysisResult;
  userNotes?: string;
}

export interface ScamExample {
  id: string;
  title: string;
  category: string;
  channel: string;
  riskBadge: string;
  riskScore: number;
  description: string;
  sampleInput: OpportunityInput;
}

export interface QuizQuestion {
  id: number;
  scenario: string;
  messageSnippet: string;
  channel: string;
  claimedCompany: string;
  isScam: boolean;
  correctAnswerReason: string;
  keyRedFlag: string;
}

export interface ThreatReport {
  id: string;
  title: string;
  scamType: string;
  claimedCompany: string;
  platform: string;
  reportCount: number;
  upvotes: number;
  dateReported: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  identifiers: {
    handles: string[];
    upiOrPayment?: string;
    phoneOrEmail?: string;
  };
  modusOperandi: string;
  targetedCampuses: string[];
  isVerifiedByAnalysts: boolean;
}

export interface CounterChallengeStrategy {
  id: string;
  title: string;
  strategyName: string;
  description: string;
  tacticalPrompt: string;
  expectedScammerTrap: string;
  badge: string;
}

