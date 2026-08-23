import React, { useState } from 'react';
import { CreditCard, ShieldAlert, CheckCircle2, AlertTriangle, ArrowRight, Check, Search, HelpCircle } from 'lucide-react';

export const PaymentAuditor: React.FC = () => {
  const [handle, setHandle] = useState('');
  const [result, setResult] = useState<{
    handle: string;
    isVpa: boolean;
    isDisguisedPersonalAccount: boolean;
    riskLevel: string;
    analysis: string;
    recommendation: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!handle) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/audit-payment-handle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ handle }),
      });

      if (response.ok) {
        const data = await response.json();
        setResult(data);
      }
    } catch (err) {
      console.error('Audit payment error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const sampleHandles = [
    { label: 'Fake Disguised UPI', vpa: 'infosys.hr.onboarding@paytm' },
    { label: 'Fake Task Merchant', vpa: 'vip.taskdeposit@ybl' },
    { label: 'Personal GPay VPA', vpa: 'alex9932@okaxis' },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4" id="payment-auditor-widget">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-slate-700" />
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            UPI & Payment VPA Threat Checker
          </h3>
        </div>
        <span className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">
          P2P vs Corporate Merchant Audit
        </span>
      </div>

      <p className="text-xs text-slate-500">
        Enter the UPI handle or payment link provided by the recruiter to check if it is a personal P2P disguised wallet.
      </p>

      <form onSubmit={handleAudit} className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            required
            value={handle}
            onChange={(e) => setHandle(e.target.value)}
            placeholder="e.g. hr.infosys.desk@paytm or candidate.fee@okaxis"
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:ring-2 focus:ring-slate-900 focus:bg-white focus:outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs rounded-lg transition-colors shrink-0 disabled:opacity-50"
        >
          {isLoading ? 'Auditing...' : 'Audit Handle'}
        </button>
      </form>

      {/* Quick Test Samples */}
      <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
        <span className="text-slate-400">Try sample:</span>
        {sampleHandles.map((s, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => {
              setHandle(s.vpa);
            }}
            className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded transition-colors font-mono"
          >
            {s.vpa}
          </button>
        ))}
      </div>

      {result && (
        <div
          className={`p-3.5 rounded-xl border text-xs space-y-2 ${
            result.riskLevel === 'CRITICAL'
              ? 'bg-red-50 border-red-200 text-red-950'
              : result.riskLevel === 'HIGH'
              ? 'bg-amber-50 border-amber-200 text-amber-950'
              : 'bg-emerald-50 border-emerald-200 text-emerald-950'
          }`}
          id="payment-audit-result"
        >
          <div className="flex items-center justify-between font-bold">
            <span className="flex items-center gap-1.5">
              {result.riskLevel === 'CRITICAL' ? (
                <ShieldAlert className="w-4 h-4 text-red-600" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-amber-600" />
              )}
              Risk Level: {result.riskLevel}
            </span>
            <code className="font-mono text-[11px] bg-white/70 px-2 py-0.5 rounded border border-black/10">
              {result.handle}
            </code>
          </div>

          <p className="leading-relaxed text-slate-800 text-[11.5px]">{result.analysis}</p>

          <div className="pt-1 text-[11px] font-semibold text-slate-700 flex items-center gap-1">
            <strong>Action Rule:</strong> {result.recommendation}
          </div>
        </div>
      )}
    </div>
  );
};
