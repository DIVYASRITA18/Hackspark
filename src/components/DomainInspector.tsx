import React, { useState } from 'react';
import { Globe, Search, ShieldCheck, ShieldAlert, AlertTriangle, Building, CheckCircle2, ArrowRight, CreditCard } from 'lucide-react';
import { PaymentAuditor } from './PaymentAuditor';

export const DomainInspector: React.FC = () => {

  const [query, setQuery] = useState('');
  const [claimedCompany, setClaimedCompany] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    domain: string;
    isFreeProvider: boolean;
    hasSuspiciousTld: boolean;
    spoofDetected: boolean;
    officialDomain: string;
    verdict: string;
  } | null>(null);

  const popularCompanies = [
    { name: 'Google', domain: 'google.com' },
    { name: 'Microsoft', domain: 'microsoft.com' },
    { name: 'Amazon', domain: 'amazon.com' },
    { name: 'TCS', domain: 'tcs.com' },
    { name: 'Infosys', domain: 'infosys.com' },
    { name: 'Meta', domain: 'meta.com' },
    { name: 'Deloitte', domain: 'deloitte.com' },
    { name: 'Wipro', domain: 'wipro.com' },
  ];

  const handleCheck = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const res = await fetch('/api/quick-domain-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, claimedCompany }),
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error('Domain check failed', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTestSample = (testEmail: string, company: string) => {
    setQuery(testEmail);
    setClaimedCompany(company);
    setTimeout(() => {
      // trigger check
      fetch('/api/quick-domain-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: testEmail, claimedCompany: company }),
      })
        .then((r) => r.json())
        .then((d) => setResult(d));
    }, 100);
  };

  return (
    <div className="space-y-6">
      {/* Header card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 sm:p-7">
        <div className="flex items-center space-x-3 pb-4 border-b border-slate-100">
          <div className="p-2 rounded-xl bg-cyan-50 text-cyan-600">
            <Globe className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Email & Recruiter Domain Inspector</h2>
            <p className="text-xs text-slate-500">
              Check if an email address or website domain is a legitimate corporate address or a spoofed phishing provider.
            </p>
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleCheck} className="mt-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Sender Email Address or Website URL
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  id="input-domain-query"
                  type="text"
                  placeholder="e.g. hr.infosys.hiring@gmail.com or amazon-careers.site"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 focus:bg-white text-slate-900 font-mono placeholder:font-sans"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Claimed Company (Optional)
              </label>
              <div className="relative">
                <Building className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  id="input-claimed-company"
                  type="text"
                  placeholder="e.g. Google, Infosys, Amazon, Microsoft"
                  value={claimedCompany}
                  onChange={(e) => setClaimedCompany(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 focus:bg-white text-slate-900"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex items-center space-x-1.5 text-xs text-slate-500">
              <span className="font-semibold">Test Sample:</span>
              <button
                type="button"
                onClick={() => handleTestSample('recruitment-amazon@gmail.com', 'Amazon')}
                className="underline hover:text-cyan-700"
              >
                Amazon (Gmail Spoof)
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => handleTestSample('careers@google.com', 'Google')}
                className="underline hover:text-cyan-700"
              >
                Google (Official Domain)
              </button>
            </div>

            <button
              id="btn-inspect-domain"
              type="submit"
              disabled={loading || !query.trim()}
              className={`px-6 py-2.5 rounded-xl font-bold text-sm text-white shadow-sm flex items-center space-x-2 transition-colors ${
                loading || !query.trim()
                  ? 'bg-slate-400 cursor-not-allowed'
                  : 'bg-cyan-600 hover:bg-cyan-500'
              }`}
            >
              <span>{loading ? 'Inspecting...' : 'Audit Domain'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Result Breakdown Card */}
        {result && (
          <div className="mt-6 pt-5 border-t border-slate-100 space-y-4">
            <div
              className={`p-5 rounded-2xl border ${
                result.spoofDetected
                  ? 'bg-rose-50 border-rose-200 text-rose-950'
                  : result.isFreeProvider || result.hasSuspiciousTld
                  ? 'bg-amber-50 border-amber-200 text-amber-950'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-950'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="mt-0.5">
                  {result.spoofDetected ? (
                    <AlertTriangle className="w-6 h-6 text-rose-600 flex-shrink-0" />
                  ) : result.isFreeProvider || result.hasSuspiciousTld ? (
                    <ShieldAlert className="w-6 h-6 text-amber-600 flex-shrink-0" />
                  ) : (
                    <ShieldCheck className="w-6 h-6 text-emerald-600 flex-shrink-0" />
                  )}
                </div>

                <div className="space-y-2">
                  <h4 className="text-base font-bold">{result.verdict}</h4>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs pt-2">
                    <div className="p-2.5 rounded-lg bg-white/80 border border-slate-200/80">
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">Analyzed Domain</span>
                      <span className="font-mono font-bold text-slate-800">{result.domain}</span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-white/80 border border-slate-200/80">
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">Provider Type</span>
                      <span className="font-semibold text-slate-800">
                        {result.isFreeProvider ? 'Free Webmail (Gmail/Yahoo)' : 'Custom Domain'}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-white/80 border border-slate-200/80">
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">Spoof Risk</span>
                      <span className={`font-bold ${result.spoofDetected ? 'text-rose-600' : 'text-emerald-600'}`}>
                        {result.spoofDetected ? 'High (Domain Mismatch)' : 'None Detected'}
                      </span>
                    </div>
                  </div>

                  {result.officialDomain && (
                    <p className="text-xs font-semibold text-slate-700 pt-1">
                      Official Verified Domain for {claimedCompany}: <code className="bg-white px-2 py-0.5 rounded border border-slate-300 text-indigo-700">@{result.officialDomain}</code>
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* UPI & Payment Handle Forensic Auditor */}
      <PaymentAuditor />

      {/* Verified Corporate Career Portals Directory */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6">
        <h3 className="text-base font-bold text-slate-900 mb-2">Authentic Company Hiring Domains Directory</h3>
        <p className="text-xs text-slate-500 mb-4">
          Genuine enterprise recruiters will only email you from these authenticated domains:
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {popularCompanies.map((c) => (
            <div key={c.name} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <div className="font-bold text-slate-900 flex items-center justify-between">
                <span>{c.name}</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <div className="font-mono text-indigo-700 mt-1">@{c.domain}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
