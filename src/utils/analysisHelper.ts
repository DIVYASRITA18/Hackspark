import { RiskLevel, IndicatorSeverity, SavedScan, AnalysisResult, OpportunityInput } from '../types';

export function getRiskLevelConfig(level: RiskLevel, score: number) {
  if (score >= 75 || level === 'DANGER_SCAM') {
    return {
      label: 'Critical Scam Alert',
      colorName: 'red',
      bgClass: 'bg-rose-50 border-rose-200 text-rose-800',
      badgeClass: 'bg-rose-600 text-white',
      accentBorder: 'border-rose-500',
      meterColor: '#e11d48',
      iconName: 'AlertTriangle',
      actionAlert: '🚨 DO NOT SEND MONEY OR PERSONAL DATA — High Risk of Fraud',
    };
  }
  if (score >= 50 || level === 'HIGH_RISK') {
    return {
      label: 'High Risk Opportunity',
      colorName: 'amber',
      bgClass: 'bg-amber-50 border-amber-200 text-amber-900',
      badgeClass: 'bg-amber-600 text-white',
      accentBorder: 'border-amber-500',
      meterColor: '#d97706',
      iconName: 'AlertCircle',
      actionAlert: '⚠️ SUSPICIOUS OFFER — Multiple Red Flags Detected',
    };
  }
  if (score >= 25 || level === 'CAUTION') {
    return {
      label: 'Proceed With Caution',
      colorName: 'yellow',
      bgClass: 'bg-yellow-50 border-yellow-200 text-yellow-900',
      badgeClass: 'bg-yellow-600 text-white',
      accentBorder: 'border-yellow-500',
      meterColor: '#ca8a04',
      iconName: 'ShieldAlert',
      actionAlert: '⚡ CAUTION ADVISED — Cross-verify with Official Career Portal',
    };
  }
  return {
    label: 'Likely Legitimate Opportunity',
    colorName: 'emerald',
    bgClass: 'bg-emerald-50 border-emerald-200 text-emerald-900',
    badgeClass: 'bg-emerald-600 text-white',
    accentBorder: 'border-emerald-500',
    meterColor: '#059669',
    iconName: 'ShieldCheck',
    actionAlert: '✅ LOW RISK — Standard Recruitment Indicators Present',
  };
}

export function getSeverityBadge(severity: IndicatorSeverity) {
  switch (severity) {
    case 'CRITICAL':
      return {
        label: 'CRITICAL RED FLAG',
        bg: 'bg-rose-100 text-rose-700 border-rose-300',
      };
    case 'HIGH':
      return {
        label: 'HIGH CONCERN',
        bg: 'bg-orange-100 text-orange-700 border-orange-300',
      };
    case 'MEDIUM':
      return {
        label: 'MODERATE RISK',
        bg: 'bg-amber-100 text-amber-800 border-amber-300',
      };
    case 'LOW':
      return {
        label: 'LOW RISK NOTE',
        bg: 'bg-slate-100 text-slate-700 border-slate-300',
      };
    case 'POSITIVE':
      return {
        label: 'LEGITIMACY SIGNAL',
        bg: 'bg-emerald-100 text-emerald-700 border-emerald-300',
      };
    default:
      return {
        label: 'NOTICE',
        bg: 'bg-slate-100 text-slate-700 border-slate-300',
      };
  }
}

// LocalStorage history helpers
const STORAGE_KEY = 'scamcheck_scan_history_v1';

export function getSavedScans(): SavedScan[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse saved scans from localStorage', e);
    return [];
  }
}

export function saveScanToStorage(input: OpportunityInput, result: AnalysisResult): SavedScan {
  const newScan: SavedScan = {
    id: 'scan_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    timestamp: Date.now(),
    input,
    result,
  };

  try {
    const existing = getSavedScans();
    const updated = [newScan, ...existing.slice(0, 49)]; // store up to 50
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save scan to localStorage', e);
  }

  return newScan;
}

export function deleteSavedScan(id: string): SavedScan[] {
  try {
    const existing = getSavedScans();
    const filtered = existing.filter((s) => s.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return filtered;
  } catch (e) {
    console.error('Failed to delete scan', e);
    return [];
  }
}

export function clearAllSavedScans(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Failed to clear scans', e);
  }
}

export function generateReportText(result: AnalysisResult, input: OpportunityInput): string {
  const dateStr = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return `=====================================================
🛡️ SCAMCHECK OPPORTUNITY VERIFICATION REPORT
Generated: ${dateStr}
=====================================================

RISK SCORE: ${result.riskScore}/100 (${result.riskLevel})
CONFIDENCE: ${result.confidenceScore}%
CLASSIFICATION: ${result.identifiedScamType}

VERDICT:
${result.headlineVerdict}

--- OPPORTUNITY SUMMARY ---
Claimed Company: ${input.companyName || 'Not specified'}
Sender Contact: ${input.senderContact || 'Not specified'}
Platform: ${input.platform || 'General'}
Role: ${input.role || 'Not specified'}
Promised Pay: ${input.salary || 'Not specified'}
Upfront Fee Demanded: ${input.feeAsked || 'None'}

--- DETECTED RED FLAGS (${result.warningIndicators.length}) ---
${result.warningIndicators
  .map(
    (ind, i) =>
      `[${i + 1}] ${ind.severity} - ${ind.title}\n    ${ind.explanation}${
        ind.snippetFound ? `\n    Matched: "${ind.snippetFound}"` : ''
      }`
  )
  .join('\n\n')}

${
  result.legitimacySignals.length > 0
    ? `--- LEGITIMACY SIGNALS ---\n${result.legitimacySignals
        .map((s) => `• ${s}`)
        .join('\n')}\n`
    : ''
}
--- RECOMMENDED STUDENT ACTION ---
${result.safeResponseAction}

--- COMPANY VERIFICATION CHECKLIST ---
${result.companyVerificationAdvice.map((a, i) => `${i + 1}. ${a}`).join('\n')}

--- SAFE REPLY TEMPLATE ---
"${result.safeReplyTemplate}"

=====================================================
Report generated by ScamCheck - Student Opportunity Defense System
Cybercrime Emergency Helpline: Call 1930 (India) or visit cybercrime.gov.in
=====================================================`;
}
