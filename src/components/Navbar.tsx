import React from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  BookOpen, 
  HelpCircle, 
  History, 
  Globe, 
  Sparkles, 
  Radio, 
  Bot,
  CreditCard 
} from 'lucide-react';

export type NavTabType = 'analyzer' | 'threatRadar' | 'honeybot' | 'domain' | 'playbook' | 'quiz' | 'history';

interface NavbarProps {
  activeTab: NavTabType;
  setActiveTab: (tab: NavTabType) => void;
  savedCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, savedCount }) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div
            id="brand-logo-btn"
            onClick={() => setActiveTab('analyzer')}
            className="flex items-center space-x-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-200">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg tracking-tight text-white group-hover:text-cyan-400 transition-colors">
                  ScamCheck
                </span>
                <span className="bg-red-500/20 text-red-300 text-xs px-2 py-0.5 rounded-full font-medium border border-red-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse"></span>
                  Forensic Shield
                </span>
              </div>
              <p className="text-xs text-slate-400 font-normal">Student Opportunity Threat & Verification System</p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center space-x-1">
            <button
              id="nav-analyzer-btn"
              onClick={() => setActiveTab('analyzer')}
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                activeTab === 'analyzer'
                  ? 'bg-slate-800 text-cyan-400 shadow-sm border border-slate-700'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Forensic Analyzer</span>
            </button>

            <button
              id="nav-threat-radar-btn"
              onClick={() => setActiveTab('threatRadar')}
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                activeTab === 'threatRadar'
                  ? 'bg-slate-800 text-red-400 shadow-sm border border-slate-700'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Radio className="w-4 h-4 text-red-400 animate-pulse" />
              <span>Campus Threat Radar</span>
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
            </button>

            <button
              id="nav-honeybot-btn"
              onClick={() => setActiveTab('honeybot')}
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                activeTab === 'honeybot'
                  ? 'bg-slate-800 text-indigo-400 shadow-sm border border-slate-700'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Bot className="w-4 h-4 text-indigo-400" />
              <span>Honeybot Sandbox</span>
            </button>

            <button
              id="nav-domain-btn"
              onClick={() => setActiveTab('domain')}
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                activeTab === 'domain'
                  ? 'bg-slate-800 text-cyan-400 shadow-sm border border-slate-700'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Globe className="w-4 h-4 text-cyan-400" />
              <span>Domain & UPI Auditor</span>
            </button>

            <button
              id="nav-playbook-btn"
              onClick={() => setActiveTab('playbook')}
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                activeTab === 'playbook'
                  ? 'bg-slate-800 text-cyan-400 shadow-sm border border-slate-700'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Scam Playbook</span>
            </button>

            <button
              id="nav-quiz-btn"
              onClick={() => setActiveTab('quiz')}
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                activeTab === 'quiz'
                  ? 'bg-slate-800 text-cyan-400 shadow-sm border border-slate-700'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>Defense Quiz</span>
            </button>

            <button
              id="nav-history-btn"
              onClick={() => setActiveTab('history')}
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                activeTab === 'history'
                  ? 'bg-slate-800 text-cyan-400 shadow-sm border border-slate-700'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <History className="w-4 h-4" />
              <span>History</span>
              {savedCount > 0 && (
                <span className="bg-cyan-500 text-slate-900 text-xs px-1.5 py-0.2 rounded-full font-bold">
                  {savedCount}
                </span>
              )}
            </button>
          </nav>

          {/* Emergency Alert Hotline pill */}
          <div className="flex items-center space-x-2">
            <a
              href="https://cybercrime.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1.5 bg-rose-950/80 border border-rose-800/60 hover:bg-rose-900 text-rose-300 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors shadow-sm"
              title="National Cyber Crime Reporting Helpline (India 1930 / Global)"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
              <span>Cyber Helpline: 1930</span>
            </a>
          </div>
        </div>

        {/* Medium & Mobile Navigation Bar */}
        <div className="flex xl:hidden overflow-x-auto py-2.5 space-x-2 border-t border-slate-800 no-scrollbar">
          <button
            onClick={() => setActiveTab('analyzer')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap ${
              activeTab === 'analyzer' ? 'bg-cyan-600 text-white font-bold' : 'bg-slate-800 text-slate-300'
            }`}
          >
            Forensic Analyzer
          </button>
          <button
            onClick={() => setActiveTab('threatRadar')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'threatRadar' ? 'bg-red-600 text-white font-bold' : 'bg-slate-800 text-red-300'
            }`}
          >
            <Radio className="w-3 h-3" />
            Threat Radar
          </button>
          <button
            onClick={() => setActiveTab('honeybot')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'honeybot' ? 'bg-indigo-600 text-white font-bold' : 'bg-slate-800 text-indigo-300'
            }`}
          >
            <Bot className="w-3 h-3" />
            Honeybot Sandbox
          </button>
          <button
            onClick={() => setActiveTab('domain')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap ${
              activeTab === 'domain' ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-300'
            }`}
          >
            Domain & UPI
          </button>
          <button
            onClick={() => setActiveTab('playbook')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap ${
              activeTab === 'playbook' ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-300'
            }`}
          >
            Playbook
          </button>
          <button
            onClick={() => setActiveTab('quiz')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap ${
              activeTab === 'quiz' ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-300'
            }`}
          >
            Quiz
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap flex items-center gap-1 ${
              activeTab === 'history' ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-300'
            }`}
          >
            History ({savedCount})
          </button>
        </div>
      </div>
    </header>
  );
};

