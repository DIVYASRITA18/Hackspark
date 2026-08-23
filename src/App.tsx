import React, { useState, useEffect } from 'react';
import { OpportunityInput, AnalysisResult, SavedScan, ScamExample } from './types';
import { REAL_WORLD_EXAMPLES } from './data/mockScams';
import { getSavedScans, saveScanToStorage, deleteSavedScan, clearAllSavedScans } from './utils/analysisHelper';
import { Navbar, NavTabType } from './components/Navbar';
import { AnalyzerForm } from './components/AnalyzerForm';
import { AnalysisResultCard } from './components/AnalysisResultCard';
import { ThreatRadar } from './components/ThreatRadar';
import { HoneybotChallenger } from './components/HoneybotChallenger';
import { DomainInspector } from './components/DomainInspector';
import { ScamPlaybook } from './components/ScamPlaybook';
import { ScamSpotterQuiz } from './components/ScamSpotterQuiz';
import { ScanHistory } from './components/ScanHistory';
import { ShieldCheck, ShieldAlert, Sparkles, MessageSquare, AlertTriangle, ArrowRight, Zap, Radio, Bot } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTabType>('analyzer');


  const [input, setInput] = useState<OpportunityInput>({
    text: '',
    companyName: '',
    senderContact: '',
    platform: 'WhatsApp',
    role: '',
    salary: '',
    feeAsked: '',
  });

  const [currentResult, setCurrentResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [savedScans, setSavedScans] = useState<SavedScan[]>([]);

  // Load history on mount
  useEffect(() => {
    setSavedScans(getSavedScans());
  }, []);

  const handleAnalyze = async () => {
    if (!input.text.trim() && !input.companyName.trim() && !input.senderContact.trim()) {
      setErrorMsg('Please paste the opportunity message or enter the claimed details to analyze.');
      return;
    }

    setErrorMsg(null);
    setIsLoading(true);
    setCurrentResult(null);

    try {
      const response = await fetch('/api/analyze-opportunity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const data: AnalysisResult = await response.json();
      setCurrentResult(data);

      // Save to localStorage history
      const saved = saveScanToStorage(input, data);
      setSavedScans((prev) => [saved, ...prev.filter((s) => s.id !== saved.id)]);

      // Scroll smoothly to results card
      setTimeout(() => {
        const el = document.getElementById('analysis-result-container');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 150);
    } catch (err: any) {
      console.error('Scan error:', err);
      setErrorMsg('Failed to complete opportunity analysis. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setInput({
      text: '',
      companyName: '',
      senderContact: '',
      platform: 'WhatsApp',
      role: '',
      salary: '',
      feeAsked: '',
    });
    setCurrentResult(null);
    setErrorMsg(null);
  };

  const handleSelectExample = (example: ScamExample) => {
    setInput({ ...example.sampleInput });
    setCurrentResult(null);
    setErrorMsg(null);
  };

  const handleSelectHistoryScan = (scan: SavedScan) => {
    setInput(scan.input);
    setCurrentResult(scan.result);
    setActiveTab('analyzer');
    setTimeout(() => {
      const el = document.getElementById('analysis-result-container');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handleDeleteScan = (id: string) => {
    const updated = deleteSavedScan(id);
    setSavedScans(updated);
  };

  const handleClearAllHistory = () => {
    clearAllSavedScans();
    setSavedScans([]);
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 flex flex-col font-sans antialiased selection:bg-cyan-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} savedCount={savedScans.length} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Error Alert Banner */}
        {errorMsg && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm font-medium flex items-center justify-between shadow-xs">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
            <button
              onClick={() => setErrorMsg(null)}
              className="text-rose-500 hover:text-rose-700 font-bold px-2 py-0.5"
            >
              ✕
            </button>
          </div>
        )}

        {/* Tab 1: Primary Analyzer View */}
        {activeTab === 'analyzer' && (
          <div className="space-y-6">
            {/* Quick Hero Banner for Students */}
            {!currentResult && (
              <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl text-white p-6 sm:p-8 shadow-md relative overflow-hidden">
                <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-cyan-500/10 to-transparent pointer-events-none"></div>

                <div className="max-w-2xl relative z-10 space-y-3">
                  <div className="inline-flex items-center space-x-2 bg-indigo-500/20 border border-indigo-400/30 text-cyan-300 px-3 py-1 rounded-full text-xs font-semibold">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Cyber Defense For Student Job Seekers</span>
                  </div>

                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
                    Received an internship or job offer? <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-300">
                      Verify risk score before you reply or pay.
                    </span>
                  </h1>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    Scammers target students with WhatsApp YouTube task schemes, fake kit fees, and spoofed MNC offer letters. Paste any message below for instant forensic risk analysis.
                  </p>

                  <div className="pt-2 flex flex-wrap gap-4 text-xs text-slate-300">
                    <div className="flex items-center space-x-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>Detects Advance-Fee Demands</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>Free Gmail Spoof Inspector</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>Telegram Ponzi Flagging</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Input Form Card */}
            <AnalyzerForm
              input={input}
              setInput={setInput}
              onAnalyze={handleAnalyze}
              isLoading={isLoading}
              onClear={handleClear}
              onSelectExample={handleSelectExample}
            />

            {/* Results Display */}
            {currentResult && (
              <AnalysisResultCard
                result={currentResult}
                input={input}
                onNewScan={handleClear}
                onLaunchHoneybot={(company, claim) => {
                  setActiveTab('honeybot');
                }}
              />
            )}
          </div>
        )}

        {/* Tab 2: Campus Threat Intelligence Radar */}
        {activeTab === 'threatRadar' && (
          <ThreatRadar
            onAnalyzeSample={(text, company) => {
              setInput((prev) => ({
                ...prev,
                text,
                companyName: company,
              }));
              setActiveTab('analyzer');
            }}
          />
        )}

        {/* Tab 3: Honeybot Recruiter Sandbox */}
        {activeTab === 'honeybot' && <HoneybotChallenger />}

        {/* Tab 4: Domain & Email Inspector */}
        {activeTab === 'domain' && <DomainInspector />}

        {/* Tab 5: Scam Defense Playbook */}
        {activeTab === 'playbook' && <ScamPlaybook />}

        {/* Tab 6: Spotter Quiz */}
        {activeTab === 'quiz' && <ScamSpotterQuiz />}

        {/* Tab 7: Scan History */}
        {activeTab === 'history' && (
          <ScanHistory
            scans={savedScans}
            onSelectScan={handleSelectHistoryScan}
            onDeleteScan={handleDeleteScan}
            onClearAll={handleClearAllHistory}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 text-xs py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xs">
              🛡️
            </div>
            <span className="text-slate-200 font-semibold">ScamCheck — Student Opportunity Verification</span>
          </div>

          <div className="text-center sm:text-right text-slate-400 space-y-1">
            <p>Empowering students to identify and report deceptive employment practices.</p>
            <p className="text-slate-500 text-[11px]">
              If financial loss has occurred, immediately contact National Cyber Crime Reporting at{' '}
              <a href="tel:1930" className="text-rose-400 font-bold hover:underline">
                1930
              </a>{' '}
              or report to your bank's fraud desk.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
