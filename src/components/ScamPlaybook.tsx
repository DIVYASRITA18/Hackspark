import React, { useState } from 'react';
import { SCAM_PATTERNS_GUIDE } from '../data/mockScams';
import { BookOpen, AlertTriangle, ShieldCheck, CheckCircle2, ChevronDown, ChevronUp, Sparkles, ExternalLink } from 'lucide-react';

export const ScamPlaybook: React.FC = () => {
  const [openSection, setOpenSection] = useState<string>('task-scam');

  return (
    <div className="space-y-6">
      {/* Playbook Header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 sm:p-7">
        <div className="flex items-center space-x-3 pb-4 border-b border-slate-100">
          <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Student Scam Defense Playbook</h2>
            <p className="text-xs text-slate-500">
              Anatomy, deception mechanics, and red flags of the top 5 employment scams targeting college students today.
            </p>
          </div>
        </div>

        {/* Golden Rules Banner */}
        <div className="mt-5 p-4 rounded-xl bg-indigo-900 text-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2.5">
            <Sparkles className="w-5 h-5 text-yellow-400 flex-shrink-0" />
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-yellow-300">The Student Golden Rule</h4>
              <p className="text-sm font-semibold text-indigo-100">
                A real employer pays you for your work — you NEVER pay an employer to get a job or internship.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Accordion of Scam Typologies */}
      <div className="space-y-4">
        {SCAM_PATTERNS_GUIDE.map((pattern) => {
          const isOpen = openSection === pattern.id;

          return (
            <div
              key={pattern.id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden transition-all"
            >
              <div
                onClick={() => setOpenSection(isOpen ? '' : pattern.id)}
                className="p-5 sm:p-6 flex items-center justify-between cursor-pointer select-none hover:bg-slate-50/60 transition-colors"
              >
                <div className="flex items-center space-x-3.5">
                  <div className="p-2 rounded-xl bg-rose-50 text-rose-600 font-bold">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900">{pattern.title}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{pattern.shortDescription}</p>
                  </div>
                </div>

                <div className="text-slate-400">
                  {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </div>

              {isOpen && (
                <div className="px-6 pb-6 pt-2 border-t border-slate-100 space-y-5 text-sm">
                  {/* How it works */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                      How The Syndicate Operates:
                    </h4>
                    <p className="text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
                      {pattern.mechanism}
                    </p>
                  </div>

                  {/* Red Flags List */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-rose-600 mb-2">
                      Key Warning Indicators To Watch For:
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {pattern.redFlags.map((flag, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-xl bg-rose-50/50 border border-rose-100 text-xs text-rose-950 flex items-start space-x-2"
                        >
                          <span className="text-rose-500 font-bold">•</span>
                          <span className="leading-snug">{flag}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Immediate Defense Action */}
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex items-start space-x-3">
                    <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h5 className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                        Student Action Rule
                      </h5>
                      <p className="text-xs sm:text-sm font-medium mt-0.5">{pattern.defenseAction}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Cyber Incident Emergency Contacts */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6">
        <h3 className="text-base font-bold text-slate-900 mb-3">Official Cyber Crime Reporting Channels</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <a
            href="https://cybercrime.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/40 transition-colors flex items-center justify-between group"
          >
            <div>
              <div className="font-bold text-slate-900 group-hover:text-indigo-600">India: Cyber Helpline</div>
              <div className="text-slate-500 mt-0.5">Dial 1930 / cybercrime.gov.in</div>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
          </a>

          <a
            href="https://reportfraud.ftc.gov"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/40 transition-colors flex items-center justify-between group"
          >
            <div>
              <div className="font-bold text-slate-900 group-hover:text-indigo-600">USA: FTC Fraud Report</div>
              <div className="text-slate-500 mt-0.5">reportfraud.ftc.gov</div>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
          </a>

          <a
            href="https://www.actionfraud.police.uk"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/40 transition-colors flex items-center justify-between group"
          >
            <div>
              <div className="font-bold text-slate-900 group-hover:text-indigo-600">UK: Action Fraud</div>
              <div className="text-slate-500 mt-0.5">actionfraud.police.uk</div>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
          </a>
        </div>
      </div>
    </div>
  );
};
