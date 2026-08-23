import React, { useState } from 'react';
import { AnalysisResult, OpportunityInput } from '../types';
import { getRiskLevelConfig, getSeverityBadge, generateReportText } from '../utils/analysisHelper';
import { CyberDossierModal } from './CyberDossierModal';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  AlertCircle,
  Copy,
  Check,
  Download,
  Share2,
  FileCheck,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  PhoneCall,
  Lock,
  Search,
  Bot,
  FileText,
  CreditCard,
  Phone,
  Eye,
  Sparkles
} from 'lucide-react';

interface AnalysisResultCardProps {
  result: AnalysisResult;
  input: OpportunityInput;
  onNewScan: () => void;
  onLaunchHoneybot?: (company: string, claim: string) => void;
}

export const AnalysisResultCard: React.FC<AnalysisResultCardProps> = ({
  result,
  input,
  onNewScan,
  onLaunchHoneybot,
}) => {
  const [copiedTemplate, setCopiedTemplate] = useState(false);
  const [copiedReport, setCopiedReport] = useState(false);
  const [expandedIndicator, setExpandedIndicator] = useState<number | null>(0); // expand first by default
  const [showDossierModal, setShowDossierModal] = useState(false);
  const [showOcrText, setShowOcrText] = useState(false);

  const config = getRiskLevelConfig(result.riskLevel, result.riskScore);

  const handleCopyTemplate = () => {
    navigator.clipboard.writeText(result.safeReplyTemplate);
    setCopiedTemplate(true);
    setTimeout(() => setCopiedTemplate(false), 2500);
  };

  const handleCopyReport = () => {
    const text = generateReportText(result, input);
    navigator.clipboard.writeText(text);
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2500);
  };

  const handleDownloadReport = () => {
    const text = generateReportText(result, input);
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ScamCheck_Report_${(input.companyName || 'Opportunity').replace(/\s+/g, '_')}_${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Determine key risk pillars
  const hasFee = result.warningIndicators.some((i) => i.category === 'PAYMENT_DEMAND');
  const hasEmailIssue = result.warningIndicators.some((i) => i.category === 'SUSPICIOUS_COMMUNICATION');
  const hasTaskPonzi = result.warningIndicators.some((i) => i.category === 'TASK_BASED_PONZI');
  const hasUrgency = result.warningIndicators.some((i) => i.category === 'URGENCY_PRESSURE');

  const entities = result.extractedEntities;

  return (
    <div id="analysis-result-container" className="space-y-6">
      {/* Primary Score & Verdict Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-md overflow-hidden">
        {/* Top color status banner */}
        <div className={`px-6 py-4 ${config.bgClass} border-b flex items-center justify-between`}>
          <div className="flex items-center space-x-3">
            {result.riskScore >= 75 ? (
              <AlertTriangle className="w-6 h-6 text-rose-600 flex-shrink-0 animate-bounce" />
            ) : result.riskScore >= 50 ? (
              <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0" />
            ) : result.riskScore >= 25 ? (
              <ShieldAlert className="w-6 h-6 text-yellow-600 flex-shrink-0" />
            ) : (
              <ShieldCheck className="w-6 h-6 text-emerald-600 flex-shrink-0" />
            )}
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider block opacity-80">
                Opportunity Risk Assessment
              </span>
              <h3 className="text-base sm:text-lg font-bold">{config.label}</h3>
            </div>
          </div>

          <span
            className={`px-3 py-1.5 rounded-full text-xs font-extrabold tracking-wide uppercase shadow-xs ${config.badgeClass}`}
          >
            {result.riskLevel.replace('_', ' ')}
          </span>
        </div>

        {/* Score & Core Verdict Body */}
        <div className="p-6 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Risk Gauge Visual (Left Column) */}
            <div className="lg:col-span-4 flex flex-col items-center justify-center p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
              <div className="relative w-36 h-36 flex items-center justify-center">
                {/* Background Ring */}
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    fill="transparent"
                    stroke="#e2e8f0"
                    strokeWidth="10"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    fill="transparent"
                    stroke={config.meterColor}
                    strokeWidth="10"
                    strokeDasharray={263.89}
                    strokeDashoffset={263.89 - (263.89 * Math.min(100, Math.max(5, result.riskScore))) / 100}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-3xl font-black text-slate-900 leading-none">
                    {result.riskScore}
                  </span>
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-0.5">
                    / 100 Risk
                  </span>
                </div>
              </div>

              <div className="mt-3 text-center">
                <span className="text-xs text-slate-500 font-medium">Confidence Rating</span>
                <div className="flex items-center justify-center space-x-1.5 mt-0.5">
                  <span className="text-sm font-bold text-slate-800">{result.confidenceScore}%</span>
                  <span className="text-xs text-slate-400">• High Accuracy</span>
                </div>
              </div>
            </div>

            {/* Verdict & Classification (Right Column) */}
            <div className="lg:col-span-8 space-y-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200/60 px-2.5 py-0.5 rounded-md">
                    Typology: {result.identifiedScamType}
                  </span>
                  {input.companyName && (
                    <span className="text-xs text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-md font-medium">
                      Company: {input.companyName}
                    </span>
                  )}
                  {input.platform && (
                    <span className="text-xs text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-md font-medium">
                      Platform: {input.platform}
                    </span>
                  )}
                </div>

                <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                  {result.headlineVerdict}
                </h2>
              </div>

              {/* Immediate Directive / Action Alert */}
              <div
                className={`p-4 rounded-xl border ${
                  result.riskScore >= 50
                    ? 'bg-rose-50 border-rose-200 text-rose-900'
                    : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="mt-0.5">
                    {result.riskScore >= 50 ? (
                      <ShieldAlert className="w-5 h-5 text-rose-600" />
                    ) : (
                      <FileCheck className="w-5 h-5 text-emerald-600" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider">Recommended Next Action</h4>
                    <p className="text-sm font-medium mt-0.5">{result.safeResponseAction}</p>
                  </div>
                </div>
              </div>

              {/* Quick Risk Indicator Badges Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-center">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Upfront Fee</span>
                  <span
                    className={`text-xs font-bold ${
                      hasFee ? 'text-rose-600' : 'text-emerald-600'
                    }`}
                  >
                    {hasFee ? '🚨 Demanded' : '✅ None Found'}
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-center">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Domain Trust</span>
                  <span
                    className={`text-xs font-bold ${
                      hasEmailIssue ? 'text-amber-600' : 'text-slate-700'
                    }`}
                  >
                    {hasEmailIssue ? '⚠️ Free/Suspicious' : 'Standard'}
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-center">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Task Pattern</span>
                  <span
                    className={`text-xs font-bold ${
                      hasTaskPonzi ? 'text-rose-600' : 'text-slate-700'
                    }`}
                  >
                    {hasTaskPonzi ? '🚨 Ponzi/Task' : 'Normal'}
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-center">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Pressure Tactics</span>
                  <span
                    className={`text-xs font-bold ${
                      hasUrgency ? 'text-orange-600' : 'text-emerald-600'
                    }`}
                  >
                    {hasUrgency ? '⚠️ Artificial Rush' : 'Normal Pace'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <button
              id="btn-copy-report"
              onClick={handleCopyReport}
              className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-medium flex items-center space-x-1.5 transition-colors"
            >
              {copiedReport ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
              <span>{copiedReport ? 'Report Copied!' : 'Copy Summary'}</span>
            </button>

            <button
              id="btn-download-report"
              onClick={handleDownloadReport}
              className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-medium flex items-center space-x-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Download .TXT</span>
            </button>

            <button
              id="btn-generate-dossier-modal"
              onClick={() => setShowDossierModal(true)}
              className="px-3 py-1.5 rounded-lg bg-red-50 border border-red-200 hover:bg-red-100 text-red-800 font-bold flex items-center space-x-1.5 transition-colors"
            >
              <FileText className="w-3.5 h-3.5 text-red-600" />
              <span>Generate Cyber Police FIR / Dossier</span>
            </button>

            {onLaunchHoneybot && (
              <button
                id="btn-launch-honeybot"
                onClick={() =>
                  onLaunchHoneybot(
                    input.companyName || 'Recruiter Claim',
                    input.text || 'Offer letter inquiry'
                  )
                }
                className="px-3 py-1.5 rounded-lg bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 text-indigo-900 font-semibold flex items-center space-x-1.5 transition-colors"
              >
                <Bot className="w-3.5 h-3.5 text-indigo-600" />
                <span>Test Recruiter in Honeybot Sandbox</span>
              </button>
            )}
          </div>

          <button
            id="btn-scan-another"
            onClick={onNewScan}
            className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold flex items-center space-x-1.5 transition-colors shadow-xs"
          >
            <span>Scan Another Offer</span>
          </button>
        </div>
      </div>

      {/* Forensic Entity Extraction & Multimodal OCR Details */}
      {entities && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4" id="forensic-entities-section">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Forensic Entity Breakdown & Digital Evidence
              </h3>
            </div>
            <span className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">
              Automated Forensic Extraction
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            {/* UPI Identifiers */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <CreditCard className="w-3 h-3 text-slate-500" />
                UPI & VPAs Detected
              </span>
              <div className="font-mono text-slate-900 font-semibold">
                {entities.upiIds && entities.upiIds.length > 0 ? (
                  entities.upiIds.map((h, i) => (
                    <span key={i} className="inline-block bg-red-100 text-red-900 px-1.5 py-0.5 rounded text-[11px] mr-1 mb-1">
                      {h}
                    </span>
                  ))
                ) : (
                  <span className="text-slate-400 font-sans text-xs">None Detected</span>
                )}
              </div>
            </div>

            {/* Phone Numbers */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Phone className="w-3 h-3 text-slate-500" />
                Phone Numbers
              </span>
              <div className="font-mono text-slate-900 font-semibold">
                {entities.phoneNumbers && entities.phoneNumbers.length > 0 ? (
                  entities.phoneNumbers.map((p, i) => (
                    <span key={i} className="inline-block bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded text-[11px] mr-1 mb-1">
                      {p}
                    </span>
                  ))
                ) : (
                  <span className="text-slate-400 font-sans text-xs">None Detected</span>
                )}
              </div>
            </div>

            {/* Suspicious Links / Handles */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <ExternalLink className="w-3 h-3 text-slate-500" />
                Domains & Handles
              </span>
              <div className="font-mono text-slate-900 font-semibold text-[11px] truncate">
                {((entities.telegramLinks && entities.telegramLinks.length > 0) || (entities.urls && entities.urls.length > 0)) ? (
                  [...(entities.telegramLinks || []), ...(entities.urls || [])].slice(0, 2).map((l, i) => (
                    <span key={i} className="inline-block bg-indigo-50 text-indigo-900 px-1.5 py-0.5 rounded text-[11px] mr-1 mb-1 truncate max-w-full">
                      {l}
                    </span>
                  ))
                ) : (
                  <span className="text-slate-400 font-sans text-xs">Standard Channels</span>
                )}
              </div>
            </div>

            {/* Financial Demands */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Lock className="w-3 h-3 text-slate-500" />
                Amounts Demanded
              </span>
              <div className="font-mono text-slate-900 font-semibold">
                {entities.amounts && entities.amounts.length > 0 ? (
                  entities.amounts.map((m, i) => (
                    <span key={i} className="inline-block bg-rose-100 text-rose-900 font-bold px-1.5 py-0.5 rounded text-[11px] mr-1 mb-1">
                      {m}
                    </span>
                  ))
                ) : (
                  <span className="text-emerald-700 font-sans text-xs font-semibold">₹0 Demanded</span>
                )}
              </div>
            </div>
          </div>

          {/* Multimodal Screenshot OCR Preview */}
          {result.imageForensicsSummary && (
            <div className="p-4 bg-slate-900 text-slate-200 rounded-xl space-y-2 border border-slate-800 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-amber-400 flex items-center gap-1.5">
                  <Eye className="w-4 h-4" />
                  Multimodal Screenshot Analysis Findings:
                </span>
                {result.extractedOcrText && (
                  <button
                    onClick={() => setShowOcrText(!showOcrText)}
                    className="text-[11px] text-slate-400 hover:text-white underline"
                  >
                    {showOcrText ? 'Hide Extracted OCR Text' : 'View Extracted OCR Text'}
                  </button>
                )}
              </div>
              <p className="text-slate-300 leading-relaxed font-sans">{result.imageForensicsSummary}</p>

              {showOcrText && result.extractedOcrText && (
                <div className="p-3 bg-slate-950 rounded-lg text-emerald-400 font-mono text-[11px] whitespace-pre-wrap max-h-40 overflow-y-auto border border-slate-800">
                  {result.extractedOcrText}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Detailed Warning Indicators Section */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 sm:p-7">
        <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              Detailed Red Flag Indicators ({result.warningIndicators.length})
            </h3>
            <p className="text-xs text-slate-500">
              Specific risk markers extracted and verified from the submitted opportunity details.
            </p>
          </div>
        </div>

        {result.warningIndicators.length === 0 ? (
          <div className="p-6 text-center bg-emerald-50 rounded-xl border border-emerald-200">
            <ShieldCheck className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-emerald-900">No Critical Red Flags Detected</h4>
            <p className="text-xs text-emerald-700 mt-1">
              The communication aligns with standard professional hiring practices. Always exercise caution and never share OTPs or passwords.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {result.warningIndicators.map((indicator, index) => {
              const badge = getSeverityBadge(indicator.severity);
              const isExpanded = expandedIndicator === index;

              return (
                <div
                  key={index}
                  className={`rounded-xl border transition-all ${
                    indicator.severity === 'CRITICAL'
                      ? 'border-rose-200 bg-rose-50/30'
                      : indicator.severity === 'HIGH'
                      ? 'border-amber-200 bg-amber-50/30'
                      : 'border-slate-200 bg-slate-50/40'
                  }`}
                >
                  <div
                    onClick={() => setExpandedIndicator(isExpanded ? null : index)}
                    className="p-4 flex items-center justify-between cursor-pointer select-none"
                  >
                    <div className="flex items-center space-x-3 pr-2">
                      <div className="flex-shrink-0">
                        {indicator.severity === 'CRITICAL' ? (
                          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 block"></span>
                        ) : indicator.severity === 'HIGH' ? (
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 block"></span>
                        ) : (
                          <span className="w-2.5 h-2.5 rounded-full bg-slate-400 block"></span>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2 mb-0.5">
                          <span
                            className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md border ${badge.bg}`}
                          >
                            {badge.label}
                          </span>
                          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                            {indicator.category.replace(/_/g, ' ')}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900">{indicator.title}</h4>
                      </div>
                    </div>

                    <div className="text-slate-400 hover:text-slate-600">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="px-4 pb-4 pt-1 border-t border-slate-200/60 text-xs sm:text-sm text-slate-700 space-y-2.5">
                      <p className="leading-relaxed">{indicator.explanation}</p>

                      {indicator.snippetFound && (
                        <div className="p-2.5 bg-white rounded-lg border border-slate-200 font-mono text-xs text-slate-800">
                          <span className="text-[10px] uppercase font-bold text-slate-400 block font-sans mb-0.5">
                            Trigger / Evidence Found:
                          </span>
                          "{indicator.snippetFound}"
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Positive Legitimacy Signals (if any) */}
        {result.legitimacySignals && result.legitimacySignals.length > 0 && (
          <div className="mt-5 p-4 rounded-xl bg-emerald-50/60 border border-emerald-200">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5 mb-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Legitimate Hiring Signals Observed ({result.legitimacySignals.length})
            </h4>
            <ul className="space-y-1.5">
              {result.legitimacySignals.map((signal, idx) => (
                <li key={idx} className="text-xs text-emerald-800 flex items-start space-x-2">
                  <span className="text-emerald-500 font-bold">•</span>
                  <span>{signal}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Two-Column: Company Verification Checklist + Safe Reply Template */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Company Verification Blueprint */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6">
          <div className="flex items-center space-x-2 pb-3 mb-4 border-b border-slate-100">
            <Search className="w-5 h-5 text-indigo-600" />
            <h3 className="text-base font-bold text-slate-900">Student Company Verification Steps</h3>
          </div>

          <div className="space-y-3">
            {result.companyVerificationAdvice.map((advice, idx) => (
              <div key={idx} className="flex items-start space-x-3 text-xs sm:text-sm text-slate-700">
                <div className="w-5 h-5 rounded-full bg-indigo-50 text-indigo-700 font-bold flex items-center justify-center flex-shrink-0 text-xs mt-0.5">
                  {idx + 1}
                </div>
                <p className="leading-relaxed">{advice}</p>
              </div>
            ))}
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Verify via MCA / LinkedIn Recruiter</span>
            <span className="font-semibold text-indigo-600">Golden Rule: Real Jobs Never Charge Fees</span>
          </div>
        </div>

        {/* Safe Recruiter Challenge / Reply Template */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <Lock className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-bold text-slate-900">Safe Verification Response</h3>
              </div>
              <span className="text-[10px] uppercase font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                Test Recruiter
              </span>
            </div>

            <p className="text-xs text-slate-500 mb-3">
              Copy this formal response to challenge the sender without escalating or exposing sensitive details:
            </p>

            <div className="relative p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs font-mono text-slate-800 leading-relaxed max-h-48 overflow-y-auto whitespace-pre-wrap">
              {result.safeReplyTemplate}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-400">Scammers usually cease replies when asked for corporate domain email.</span>
            <button
              id="btn-copy-safe-template"
              type="button"
              onClick={handleCopyTemplate}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs flex items-center space-x-1.5 transition-colors shadow-xs"
            >
              {copiedTemplate ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedTemplate ? 'Copied to Clipboard' : 'Copy Safe Reply'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Emergency Incident Checklist (If Already Engaged) */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl p-6 sm:p-7 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-700">
          <div className="flex items-center space-x-3">
            <span className="p-2 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-400">
              <PhoneCall className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-base sm:text-lg font-bold">Emergency Student Defense Action Plan</h3>
              <p className="text-xs text-slate-400">If you already paid money, clicked suspicious links, or shared identity documents:</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowDossierModal(true)}
              className="px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center space-x-1.5 transition-colors shadow-xs"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Open 1930 Cyber Dossier</span>
            </button>
            <a
              href="https://cybercrime.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center space-x-1.5 border border-slate-600 transition-colors shadow-xs"
            >
              <span>cybercrime.gov.in</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {result.reportingChecklist.map((step, idx) => (
            <div key={idx} className="flex items-start space-x-2.5 text-xs sm:text-sm text-slate-200 bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
              <span className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-400 font-bold flex items-center justify-center flex-shrink-0 text-xs mt-0.5 border border-rose-500/30">
                {idx + 1}
              </span>
              <p className="leading-snug">{step}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Cybercrime Dossier Generation Modal */}
      <CyberDossierModal
        isOpen={showDossierModal}
        onClose={() => setShowDossierModal(false)}
        result={result}
        input={input}
      />
    </div>
  );
};

