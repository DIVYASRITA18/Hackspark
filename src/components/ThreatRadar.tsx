import React, { useState } from 'react';
import { ThreatReport } from '../types';
import { COMMUNITY_THREAT_REPORTS } from '../data/mockScams';
import { 
  Radio, 
  Search, 
  AlertTriangle, 
  ShieldAlert, 
  ThumbsUp, 
  MapPin, 
  Share2, 
  PlusCircle, 
  CheckCircle2,
  Phone,
  Send,
  Building2,
  Copy,
  Check
} from 'lucide-react';

interface ThreatRadarProps {
  onAnalyzeSample?: (text: string, company: string) => void;
}

export const ThreatRadar: React.FC<ThreatRadarProps> = ({ onAnalyzeSample }) => {
  const [reports, setReports] = useState<ThreatReport[]>(COMMUNITY_THREAT_REPORTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('ALL');
  const [upvotedIds, setUpvotedIds] = useState<Record<string, boolean>>({});
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [copiedHandle, setCopiedHandle] = useState<string | null>(null);

  // New report form state
  const [newTitle, setNewTitle] = useState('');
  const [newCompany, setNewCompany] = useState('');
  const [newPlatform, setNewPlatform] = useState('WhatsApp');
  const [newModus, setNewModus] = useState('');
  const [newUpi, setNewUpi] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newCampuses, setNewCampuses] = useState('');

  const handleUpvote = (id: string) => {
    if (upvotedIds[id]) return;
    setUpvotedIds((prev) => ({ ...prev, [id]: true }));
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, upvotes: r.upvotes + 1 } : r))
    );
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHandle(text);
    setTimeout(() => setCopiedHandle(null), 2000);
  };

  const handleAddReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newModus) return;

    const report: ThreatReport = {
      id: `user-report-${Date.now()}`,
      title: newTitle,
      scamType: 'Student-Reported Threat',
      claimedCompany: newCompany || 'Unverified Recruiter',
      platform: newPlatform,
      reportCount: 1,
      upvotes: 1,
      dateReported: 'Just now',
      severity: 'HIGH',
      identifiers: {
        handles: [],
        upiOrPayment: newUpi || undefined,
        phoneOrEmail: newPhone || undefined,
      },
      modusOperandi: newModus,
      targetedCampuses: newCampuses ? newCampuses.split(',').map((c) => c.trim()) : ['Campus Community'],
      isVerifiedByAnalysts: false,
    };

    setReports([report, ...reports]);
    setShowSubmitModal(false);
    // Reset form
    setNewTitle('');
    setNewCompany('');
    setNewModus('');
    setNewUpi('');
    setNewPhone('');
    setNewCampuses('');
  };

  const filteredReports = reports.filter((r) => {
    const matchesSearch =
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.claimedCompany.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.modusOperandi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.identifiers.upiOrPayment && r.identifiers.upiOrPayment.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (r.identifiers.phoneOrEmail && r.identifiers.phoneOrEmail.toLowerCase().includes(searchQuery.toLowerCase())) ||
      r.targetedCampuses.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesPlatform =
      selectedPlatform === 'ALL' ||
      r.platform.toLowerCase().includes(selectedPlatform.toLowerCase());

    return matchesSearch && matchesPlatform;
  });

  return (
    <div className="space-y-6" id="threat-radar-container">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-white shadow-lg relative overflow-hidden" id="threat-radar-header">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-950/80 border border-red-800/60 rounded-full text-red-300 text-xs font-semibold uppercase tracking-wider mb-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              Live Campus Threat Radar & Blacklist
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Active Student Job Scams & Payment Blacklist</h2>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Crowdsourced threat intelligence gathered from university placement cells and student submissions. Search known scammer phone numbers, UPI handles, and modus operandi.
            </p>
          </div>
          <button
            id="btn-report-scam"
            onClick={() => setShowSubmitModal(true)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium text-sm rounded-lg transition-colors shadow-sm shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            Report Suspicious Contact
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between" id="threat-filter-bar">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="threat-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by company, UPI handle, phone number, or college campus..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all text-slate-900 placeholder:text-slate-400"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {['ALL', 'WhatsApp', 'Telegram', 'Email', 'Instagram'].map((plat) => (
            <button
              key={plat}
              id={`filter-plat-${plat}`}
              onClick={() => setSelectedPlatform(plat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                selectedPlatform === plat
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {plat}
            </button>
          ))}
        </div>
      </div>

      {/* Threat List */}
      <div className="space-y-4" id="threat-reports-list">
        {filteredReports.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-500">
            <Radio className="w-10 h-10 mx-auto text-slate-300 mb-3 animate-pulse" />
            <p className="font-semibold text-slate-800">No active threats matched your query</p>
            <p className="text-xs text-slate-400 mt-1">Try searching for other terms or clear your search filter.</p>
          </div>
        ) : (
          filteredReports.map((report) => (
            <div
              key={report.id}
              id={`threat-card-${report.id}`}
              className="bg-white border border-slate-200 hover:border-slate-300 rounded-xl p-5 shadow-sm transition-all"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-semibold uppercase ${
                        report.severity === 'CRITICAL'
                          ? 'bg-red-100 text-red-800 border border-red-200'
                          : report.severity === 'HIGH'
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      <AlertTriangle className="w-3 h-3" />
                      {report.severity} THREAT
                    </span>

                    <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs font-medium">
                      {report.platform}
                    </span>

                    {report.isVerifiedByAnalysts && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded text-xs font-medium">
                        <CheckCircle2 className="w-3 h-3 text-blue-600" />
                        Verified Syndicate Pattern
                      </span>
                    )}

                    <span className="text-xs text-slate-400 ml-auto">{report.dateReported}</span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 leading-snug">{report.title}</h3>

                  <div className="text-xs text-slate-500 flex flex-wrap items-center gap-3">
                    <span className="flex items-center gap-1 text-slate-700 font-medium">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      Claimed Entity: <span className="text-slate-900 font-semibold">{report.claimedCompany}</span>
                    </span>
                    <span>•</span>
                    <span>Reported by <strong>{report.reportCount}</strong> students</span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                    {report.modusOperandi}
                  </p>

                  {/* Identifiers & Blacklist */}
                  <div className="pt-2 flex flex-wrap gap-2 items-center text-xs">
                    {report.identifiers.upiOrPayment && (
                      <div className="flex items-center gap-1.5 bg-red-50 text-red-800 border border-red-200 px-2.5 py-1 rounded">
                        <span className="font-semibold">Blacklisted UPI:</span>
                        <code className="font-mono text-red-900 font-bold">{report.identifiers.upiOrPayment}</code>
                        <button
                          onClick={() => handleCopy(report.identifiers.upiOrPayment!)}
                          className="hover:text-red-950 p-0.5 rounded transition-colors"
                          title="Copy UPI handle"
                        >
                          {copiedHandle === report.identifiers.upiOrPayment ? (
                            <Check className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    )}

                    {report.identifiers.phoneOrEmail && (
                      <div className="flex items-center gap-1.5 bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-1 rounded">
                        <Phone className="w-3 h-3 text-amber-600" />
                        <span className="font-semibold">Contact:</span>
                        <code className="font-mono text-amber-900 font-bold">{report.identifiers.phoneOrEmail}</code>
                        <button
                          onClick={() => handleCopy(report.identifiers.phoneOrEmail!)}
                          className="hover:text-amber-950 p-0.5 rounded transition-colors"
                          title="Copy contact"
                        >
                          {copiedHandle === report.identifiers.phoneOrEmail ? (
                            <Check className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    )}

                    {report.targetedCampuses && report.targetedCampuses.length > 0 && (
                      <div className="flex items-center gap-1.5 text-slate-500 ml-auto">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>Targeting:</span>
                        <span className="text-slate-700 font-medium">{report.targetedCampuses.slice(0, 3).join(', ')}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Action Column */}
                <div className="flex md:flex-col items-center md:items-end justify-between gap-2 shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
                  <button
                    id={`btn-upvote-${report.id}`}
                    onClick={() => handleUpvote(report.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      upvotedIds[report.id]
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>{report.upvotes} Confirmed Victims</span>
                  </button>

                  {onAnalyzeSample && (
                    <button
                      id={`btn-audit-report-${report.id}`}
                      onClick={() => onAnalyzeSample(report.modusOperandi, report.claimedCompany)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium transition-colors"
                    >
                      <ShieldAlert className="w-3 h-3" />
                      Audit Opportunity
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Submit Threat Report Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto" id="submit-threat-modal">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-red-600" />
                <h3 className="text-lg font-bold text-slate-900">Report Suspicious Recruiter to Campus Radar</h3>
              </div>
              <button
                onClick={() => setShowSubmitModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-semibold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddReport} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Threat Title / Scheme Summary *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Fake Accenture ₹2,000 Laptop Security Deposit Scam"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-slate-900 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Claimed Company</label>
                  <input
                    type="text"
                    placeholder="e.g., TCS, Google, Amazon"
                    value={newCompany}
                    onChange={(e) => setNewCompany(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-slate-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Platform Used</label>
                  <select
                    value={newPlatform}
                    onChange={(e) => setNewPlatform(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-slate-900 focus:outline-none bg-white"
                  >
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="Telegram">Telegram</option>
                    <option value="Email">Email</option>
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="Instagram">Instagram</option>
                    <option value="SMS">SMS</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Suspect UPI Handle (if provided)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. hr.infosys@paytm"
                    value={newUpi}
                    onChange={(e) => setNewUpi(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-slate-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Suspect Phone / Email
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. +91 98451 XXXXX or hr@gmail.com"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  How did they attempt to scam you? (Modus Operandi) *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe what they promised and what they demanded (e.g. Asked for ₹1,500 deposit for laptop dispatch or asked to like YouTube videos on Telegram)."
                  value={newModus}
                  onChange={(e) => setNewModus(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Targeted College / City (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Anna University, IIT Bombay, Bangalore"
                  value={newCampuses}
                  onChange={(e) => setNewCampuses(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-slate-900 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg shadow-sm"
                >
                  Publish Report to Radar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
