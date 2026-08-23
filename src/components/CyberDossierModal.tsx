import React, { useState, useEffect } from 'react';
import { AnalysisResult, OpportunityInput } from '../types';
import { 
  FileText, 
  Download, 
  Copy, 
  Check, 
  ShieldAlert, 
  CheckCircle2, 
  Building, 
  ExternalLink,
  PhoneCall,
  Lock
} from 'lucide-react';

interface CyberDossierModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: AnalysisResult;
  input: OpportunityInput;
}

export const CyberDossierModal: React.FC<CyberDossierModalProps> = ({
  isOpen,
  onClose,
  result,
  input,
}) => {
  const [studentName, setStudentName] = useState('');
  const [collegeName, setCollegeName] = useState('');
  const [locationCity, setLocationCity] = useState('');
  const [dossierText, setDossierText] = useState('');
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      generateDossier();
    }
  }, [isOpen, studentName, collegeName, locationCity]);

  const generateDossier = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-cyber-dossier', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: studentName || 'Candidate / Student Victim',
          victimDetails: {
            collegeName: collegeName || 'College Placement Cell / University',
            location: locationCity || 'India / Remote',
          },
          scanResult: result,
          inputData: input,
          incidentDate: new Date().toISOString().split('T')[0],
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setDossierText(data.dossierText);
      }
    } catch (err) {
      console.error('Error generating dossier:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(dossierText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([dossierText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CyberCrime_Report_${(input.companyName || 'Scam').replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden" id="cyber-dossier-modal">
        {/* Header */}
        <div className="p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="w-5 h-5 text-red-400" />
            <div>
              <h3 className="text-base font-bold">1-Click Cyber Crime Complaint & Evidence Brief</h3>
              <p className="text-xs text-slate-400">
                Formatted for National Cyber Crime Portal (1930 / cybercrime.gov.in) & University Placement Cells
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg text-sm font-bold"
          >
            ✕
          </button>
        </div>

        {/* Form Inputs for Customization */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Your Name (Optional)</label>
            <input
              type="text"
              placeholder="e.g. John Doe"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs focus:ring-1 focus:ring-slate-900 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-slate-700 font-semibold mb-1">College / University</label>
            <input
              type="text"
              placeholder="e.g. IIT Madras / Anna Univ"
              value={collegeName}
              onChange={(e) => setCollegeName(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs focus:ring-1 focus:ring-slate-900 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-slate-700 font-semibold mb-1">City / State</label>
            <input
              type="text"
              placeholder="e.g. Bangalore, Karnataka"
              value={locationCity}
              onChange={(e) => setLocationCity(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs focus:ring-1 focus:ring-slate-900 focus:outline-none"
            />
          </div>
        </div>

        {/* Dossier Content View */}
        <div className="p-4 flex-1 overflow-y-auto bg-slate-900 font-mono text-[11px] leading-relaxed text-emerald-400 select-all border-b border-slate-800">
          <pre className="whitespace-pre-wrap font-mono">{dossierText}</pre>
        </div>

        {/* Action Footer */}
        <div className="p-4 bg-white flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3 text-slate-500">
            <span className="flex items-center gap-1 font-medium text-slate-700">
              <PhoneCall className="w-3.5 h-3.5 text-red-600" />
              National Cyber Helpline: <strong>1930</strong>
            </span>
            <span>•</span>
            <a
              href="https://cybercrime.gov.in"
              target="_blank"
              rel="noreferrer"
              className="text-slate-600 hover:text-slate-900 underline flex items-center gap-0.5"
            >
              cybercrime.gov.in <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium rounded-lg inline-flex items-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied to Clipboard!' : 'Copy Dossier'}
            </button>
            <button
              onClick={handleDownload}
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg inline-flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Download Legal Brief (.txt)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
