import React, { useState } from 'react';
import { COUNTER_CHALLENGE_STRATEGIES } from '../data/mockScams';
import { CounterChallengeStrategy } from '../types';
import { 
  Bot, 
  Send, 
  ShieldCheck, 
  AlertOctagon, 
  Sparkles, 
  CheckCircle, 
  Copy, 
  Flame, 
  HelpCircle,
  CornerDownRight,
  Loader2,
  RefreshCw
} from 'lucide-react';

interface HoneybotChallengerProps {
  initialCompany?: string;
  initialRole?: string;
}

export const HoneybotChallenger: React.FC<HoneybotChallengerProps> = ({
  initialCompany = 'Infosys Technologies (Claimed)',
  initialRole = 'Remote Software Intern',
}) => {
  const [selectedStrategy, setSelectedStrategy] = useState<CounterChallengeStrategy>(
    COUNTER_CHALLENGE_STRATEGIES[0]
  );
  const [recruiterPitch, setRecruiterPitch] = useState(
    'Congratulations! You are directly shortlisted for Remote Software Intern (Stipend ₹35,000/mo). Kindly pay ₹1,499 refundable laptop dispatch fee to confirm your seat.'
  );
  const [customReply, setCustomReply] = useState(selectedStrategy.tacticalPrompt);
  const [companyName, setCompanyName] = useState(initialCompany);

  const [isLoading, setIsLoading] = useState(false);
  const [simResult, setSimResult] = useState<{
    simulatedScammerReply: string;
    tacticExposed: string;
    redFlagsTriggered: string[];
    nextActionAdvice: string;
  } | null>(null);

  const [copied, setCopied] = useState(false);

  const handleStrategyChange = (strat: CounterChallengeStrategy) => {
    setSelectedStrategy(strat);
    const customized = strat.tacticalPrompt.replace(
      /\[company\]/g,
      companyName ? companyName.toLowerCase().replace(/[^a-z0-9]/g, '') : 'company'
    );
    setCustomReply(customized);
  };

  const handleRunSimulation = async () => {
    setIsLoading(true);
    setSimResult(null);

    try {
      const response = await fetch('/api/simulate-recruiter-challenge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          strategy: selectedStrategy.strategyName,
          recruiterClaim: recruiterPitch,
          candidateMessage: customReply,
          context: { companyName, role: initialRole },
        }),
      });

      if (!response.ok) {
        throw new Error('Simulation failed');
      }

      const data = await response.json();
      setSimResult(data);
    } catch (err) {
      console.error('Honeybot simulation error:', err);
      // Fallback
      setSimResult({
        simulatedScammerReply:
          'Dear candidate, our IT server is currently under maintenance so we are contacting via WhatsApp. If the ₹1,499 fee is not sent in 30 minutes, your seat will be cancelled immediately.',
        tacticExposed: 'Artificial Deadline Urgency & Infrastructure Excuses',
        redFlagsTriggered: [
          'Excuses avoiding official corporate domain email',
          'Immediate intimidation and threat of offer forfeiture',
          'Urgency pressure to bypass parental or placement cell consultation',
        ],
        nextActionAdvice:
          'Cease all replies. No real corporate HR will threaten you over a dispatch fee.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6" id="honeybot-challenger-container">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-white shadow-lg relative overflow-hidden" id="honeybot-header">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-950/80 border border-indigo-700/60 rounded-full text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-2">
              <Bot className="w-3.5 h-3.5 text-indigo-400" />
              AI Recruiter Challenger & Honeybot Sandbox
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Test & Unmask Scammers in a Safe Sandbox</h2>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Don't know if a recruiter is legitimate? Use our tactical counter-inquiry templates. Run an interactive simulation to see how a scam syndicate will attempt to deceive or pressure you before sending your reply.
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Controls + Simulation Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="honeybot-workspace">
        {/* Left Column: Challenge Strategy Selection & Candidate Message */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-slate-700" />
              1. Select Tactical Verification Challenge
            </h3>

            <div className="space-y-2" id="challenge-strategy-selector">
              {COUNTER_CHALLENGE_STRATEGIES.map((strat) => {
                const isSelected = selectedStrategy.id === strat.id;
                return (
                  <div
                    key={strat.id}
                    id={`strategy-btn-${strat.id}`}
                    onClick={() => handleStrategyChange(strat)}
                    className={`p-3 rounded-lg border text-left cursor-pointer transition-all ${
                      isSelected
                        ? 'border-slate-900 bg-slate-900 text-white shadow-sm'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs">{strat.title}</span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
                          isSelected ? 'bg-slate-800 text-slate-200' : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {strat.badge}
                      </span>
                    </div>
                    <p
                      className={`text-xs mt-1 leading-relaxed ${
                        isSelected ? 'text-slate-300' : 'text-slate-500'
                      }`}
                    >
                      {strat.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Prompt Editor & Recruiter Claim */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-600" />
              2. Opportunity Details & Your Challenger Message
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Recruiter's Suspicious Claim / Pitch
              </label>
              <textarea
                rows={2}
                value={recruiterPitch}
                onChange={(e) => setRecruiterPitch(e.target.value)}
                placeholder="What did the recruiter tell or offer you?"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:ring-2 focus:ring-slate-900 focus:outline-none"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700">
                  Your Tactical Challenger Response (Copy to send to Recruiter)
                </label>
                <button
                  type="button"
                  onClick={() => handleCopyText(customReply)}
                  className="text-xs text-slate-600 hover:text-slate-900 inline-flex items-center gap-1 font-medium"
                >
                  {copied ? (
                    <>
                      <CheckCircle className="w-3 h-3 text-emerald-600" />
                      <span className="text-emerald-600 font-semibold">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy Template</span>
                    </>
                  )}
                </button>
              </div>
              <textarea
                id="tactical-reply-textarea"
                rows={4}
                value={customReply}
                onChange={(e) => setCustomReply(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 font-mono focus:ring-2 focus:ring-slate-900 focus:outline-none leading-relaxed"
              />
            </div>

            <button
              id="btn-run-honeybot-sim"
              onClick={handleRunSimulation}
              disabled={isLoading}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-slate-300" />
                  Simulating Scammer Reaction...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  Simulate Scammer Reaction in AI Sandbox
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Honeybot Simulation Results & Tactic Exposure */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm h-full flex flex-col justify-between" id="honeybot-results-panel">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Bot className="w-4 h-4 text-slate-700" />
                  Simulation & Psychological Tactic Breakdown
                </h3>
                <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">
                  Sandbox Engine Active
                </span>
              </div>

              {!simResult && !isLoading ? (
                <div className="p-8 text-center text-slate-400 space-y-2">
                  <Bot className="w-12 h-12 mx-auto text-slate-300" />
                  <p className="text-xs font-medium text-slate-600">
                    Select a strategy on the left and click "Simulate Scammer Reaction".
                  </p>
                  <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
                    The Honeybot will simulate how a fake recruiter attempts to deflect questions, double down with urgency, or make excuses for missing corporate infrastructure.
                  </p>
                </div>
              ) : null}

              {isLoading && (
                <div className="p-12 text-center text-slate-600 space-y-3">
                  <Loader2 className="w-8 h-8 mx-auto animate-spin text-slate-900" />
                  <p className="text-xs font-semibold">Analyzing deception triggers & generating psychological response...</p>
                </div>
              )}

              {simResult && (
                <div className="space-y-4" id="sim-result-content">
                  {/* Simulated Reply Bubble */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Simulated Scammer Reaction:
                    </span>
                    <div className="bg-slate-900 text-slate-100 p-4 rounded-xl text-xs font-mono border border-slate-800 leading-relaxed shadow-sm relative">
                      <div className="flex items-center gap-1.5 text-red-400 font-semibold mb-2">
                        <AlertOctagon className="w-3.5 h-3.5" />
                        Scam Syndicate Bot Reply:
                      </div>
                      "{simResult.simulatedScammerReply}"
                    </div>
                  </div>

                  {/* Deception Tactic Exposed */}
                  <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-xl space-y-1">
                    <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">
                      Psychological Manipulation Tactic Exposed:
                    </span>
                    <p className="text-xs font-bold text-amber-950">{simResult.tacticExposed}</p>
                  </div>

                  {/* Red Flags Triggered */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                      Red Flags Uncovered by this Challenge:
                    </span>
                    <ul className="space-y-1.5 text-xs text-slate-700">
                      {simResult.redFlagsTriggered.map((flag, idx) => (
                        <li key={idx} className="flex items-start gap-2 bg-slate-50 p-2 rounded-lg border border-slate-100">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                          <span>{flag}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Defensive Action Advice */}
                  <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl space-y-1">
                    <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                      Defensive Student Recommendation:
                    </span>
                    <p className="text-xs text-slate-800 font-medium leading-relaxed">
                      {simResult.nextActionAdvice}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Trap Guide */}
            <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg text-[11px] text-slate-500 flex items-center gap-2 mt-4">
              <HelpCircle className="w-4 h-4 text-slate-400 shrink-0" />
              <span>
                <strong>Why this works:</strong> Legitimate HR easily fulfills corporate email and Job ID requests. Only scam syndicates react with evasive excuses and urgency threats.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
