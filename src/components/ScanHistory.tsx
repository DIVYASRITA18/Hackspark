import React, { useState } from 'react';
import { SavedScan } from '../types';
import { getRiskLevelConfig } from '../utils/analysisHelper';
import { History, Trash2, Search, ArrowUpRight, ShieldCheck, AlertTriangle, AlertCircle, ShieldAlert, Calendar } from 'lucide-react';

interface ScanHistoryProps {
  scans: SavedScan[];
  onSelectScan: (scan: SavedScan) => void;
  onDeleteScan: (id: string) => void;
  onClearAll: () => void;
}

export const ScanHistory: React.FC<ScanHistoryProps> = ({
  scans,
  onSelectScan,
  onDeleteScan,
  onClearAll,
}) => {
  const [filterRisk, setFilterRisk] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredScans = scans.filter((scan) => {
    if (filterRisk !== 'all' && scan.result.riskLevel !== filterRisk) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchCompany = (scan.input.companyName || '').toLowerCase().includes(q);
      const matchRole = (scan.input.role || '').toLowerCase().includes(q);
      const matchVerdict = (scan.result.headlineVerdict || '').toLowerCase().includes(q);
      const matchType = (scan.result.identifiedScamType || '').toLowerCase().includes(q);
      return matchCompany || matchRole || matchVerdict || matchType;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 sm:p-7">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <History className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Verified Opportunity History</h2>
              <p className="text-xs text-slate-500">
                Review, compare, and re-examine all previously audited job and internship offers.
              </p>
            </div>
          </div>

          {scans.length > 0 && (
            <button
              id="btn-clear-all-history"
              onClick={onClearAll}
              className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 text-xs font-semibold flex items-center space-x-1.5 transition-colors self-start sm:self-auto"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All Scans</span>
            </button>
          )}
        </div>

        {/* Search & Filter Bar */}
        {scans.length > 0 && (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-12 gap-3">
            <div className="sm:col-span-8 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search by company, role, or scam typology..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900"
              />
            </div>

            <div className="sm:col-span-4">
              <select
                value={filterRisk}
                onChange={(e) => setFilterRisk(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900"
              >
                <option value="all">All Risk Levels ({scans.length})</option>
                <option value="DANGER_SCAM">Danger Scams (Score &gt; 75)</option>
                <option value="HIGH_RISK">High Risk (50 - 75)</option>
                <option value="CAUTION">Caution (25 - 50)</option>
                <option value="SAFE">Safe / Legitimate (&lt; 25)</option>
              </select>
            </div>
          </div>
        )}

        {/* Scan List */}
        {scans.length === 0 ? (
          <div className="mt-8 text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <History className="w-10 h-10 text-slate-400 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-slate-800">No Opportunity Scans Yet</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Whenever you verify a message or offer letter in the analyzer, a record will be saved here locally for quick reference.
            </p>
          </div>
        ) : filteredScans.length === 0 ? (
          <div className="mt-6 text-center py-6 text-xs text-slate-500">
            No scans match your current search criteria.
          </div>
        ) : (
          <div className="mt-5 space-y-3">
            {filteredScans.map((scan) => {
              const cfg = getRiskLevelConfig(scan.result.riskLevel, scan.result.riskScore);
              const dateStr = new Date(scan.timestamp).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={scan.id}
                  className="p-4 rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-xs transition-all bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                >
                  <div className="flex items-start space-x-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs flex-shrink-0 ${cfg.badgeClass}`}
                    >
                      {scan.result.riskScore}
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-1.5 mb-1">
                        <span className="font-bold text-sm text-slate-900">
                          {scan.input.companyName || 'Unknown Company'}
                        </span>
                        {scan.input.role && (
                          <span className="text-xs text-slate-500">• {scan.input.role}</span>
                        )}
                        <span className={`text-[10px] font-bold px-2 py-0.2 rounded-md ${cfg.bgClass}`}>
                          {scan.result.riskLevel.replace('_', ' ')}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 line-clamp-1 max-w-lg">
                        {scan.result.headlineVerdict}
                      </p>

                      <div className="flex items-center space-x-3 text-[11px] text-slate-400 mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {dateStr}
                        </span>
                        <span>•</span>
                        <span>Platform: {scan.input.platform || 'General'}</span>
                        <span>•</span>
                        <span className="text-indigo-600 font-medium">{scan.result.identifiedScamType}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 self-end sm:self-center">
                    <button
                      id={`btn-view-scan-${scan.id}`}
                      onClick={() => onSelectScan(scan)}
                      className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-xs flex items-center space-x-1 transition-colors"
                    >
                      <span>View Full Report</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => onDeleteScan(scan.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Delete record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
