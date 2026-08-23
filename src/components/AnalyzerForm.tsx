import React, { useState, useRef } from 'react';
import { OpportunityInput, ScamExample } from '../types';
import { REAL_WORLD_EXAMPLES } from '../data/mockScams';
import {
  Sparkles,
  MessageSquare,
  Mail,
  Send,
  Building,
  DollarSign,
  AlertOctagon,
  Trash2,
  FileText,
  CheckCircle2,
  Shield,
  Loader2,
  Upload,
  Image as ImageIcon,
  X,
  Eye,
  Camera,
} from 'lucide-react';

interface AnalyzerFormProps {
  input: OpportunityInput;
  setInput: React.Dispatch<React.SetStateAction<OpportunityInput>>;
  onAnalyze: () => void;
  isLoading: boolean;
  onClear: () => void;
  onSelectExample: (example: ScamExample) => void;
}

export const AnalyzerForm: React.FC<AnalyzerFormProps> = ({
  input,
  setInput,
  onAnalyze,
  isLoading,
  onClear,
  onSelectExample,
}) => {
  const [formMode, setFormMode] = useState<'quick' | 'detailed'>('quick');
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const platforms: Array<{ label: OpportunityInput['platform']; icon: React.ReactNode }> = [
    { label: 'WhatsApp', icon: <MessageSquare className="w-3.5 h-3.5" /> },
    { label: 'Email', icon: <Mail className="w-3.5 h-3.5" /> },
    { label: 'Telegram', icon: <Send className="w-3.5 h-3.5" /> },
    { label: 'LinkedIn', icon: <Building className="w-3.5 h-3.5" /> },
    { label: 'Instagram', icon: <MessageSquare className="w-3.5 h-3.5" /> },
    { label: 'SMS', icon: <MessageSquare className="w-3.5 h-3.5" /> },
    { label: 'JobBoard', icon: <Building className="w-3.5 h-3.5" /> },
  ];

  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, JPEG, WebP).');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      alert('File size exceeds 8MB limit. Please upload a smaller image.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      setInput((prev) => ({
        ...prev,
        imageBase64: base64,
        imageMimeType: file.type,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleRemoveImage = () => {
    setInput((prev) => ({
      ...prev,
      imageBase64: undefined,
      imageMimeType: undefined,
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 sm:p-7">
      {/* Header with Title & Mode Switch */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
              <Shield className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Opportunity Risk Scanner</h2>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Paste suspicious WhatsApp messages, offer letters, emails, or upload screenshots to inspect for fraud.
          </p>
        </div>

        {/* Form View Selector Tabs */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl self-start sm:self-auto border border-slate-200">
          <button
            id="tab-quick-paste"
            type="button"
            onClick={() => setFormMode('quick')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              formMode === 'quick' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Quick Paste
          </button>
          <button
            id="tab-detailed-form"
            type="button"
            onClick={() => setFormMode('detailed')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              formMode === 'detailed' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Detailed Fields
          </button>
        </div>
      </div>

      {/* Quick Example Loader Pills */}
      <div className="mt-4 pt-1 pb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            Try Common Student Scams & Test Cases:
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {REAL_WORLD_EXAMPLES.map((ex) => (
            <button
              key={ex.id}
              id={`preset-${ex.id}`}
              type="button"
              onClick={() => onSelectExample(ex)}
              className="text-xs px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 hover:border-indigo-300 font-medium transition-all flex items-center space-x-1.5 group"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 group-hover:bg-indigo-500"></span>
              <span>{ex.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onAnalyze();
        }}
        className="space-y-4"
      >
        {/* Receiving Platform Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Where did you receive this message?
          </label>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {platforms.map((p) => (
              <button
                key={p.label}
                id={`platform-btn-${p.label.toLowerCase()}`}
                type="button"
                onClick={() => setInput((prev) => ({ ...prev, platform: p.label }))}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1.5 border transition-all ${
                  input.platform === p.label
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {p.icon}
                <span>{p.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Detailed inputs if in detailed mode */}
        {formMode === 'detailed' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Claimed Company Name</label>
              <div className="relative">
                <Building className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  id="input-company-name"
                  type="text"
                  placeholder="e.g. Infosys, Amazon, TechCorp"
                  value={input.companyName}
                  onChange={(e) => setInput((prev) => ({ ...prev, companyName: e.target.value }))}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Sender Email or Phone</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  id="input-sender-contact"
                  type="text"
                  placeholder="e.g. hr.team@gmail.com / +91..."
                  value={input.senderContact}
                  onChange={(e) => setInput((prev) => ({ ...prev, senderContact: e.target.value }))}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Claimed Role / Title</label>
              <div className="relative">
                <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  id="input-role"
                  type="text"
                  placeholder="e.g. Web Dev Intern, Data Entry"
                  value={input.role}
                  onChange={(e) => setInput((prev) => ({ ...prev, role: e.target.value }))}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Promised Pay / Stipend</label>
              <div className="relative">
                <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  id="input-salary"
                  type="text"
                  placeholder="e.g. ₹40,000/mo, $50/hr, ₹3000/day"
                  value={input.salary}
                  onChange={(e) => setInput((prev) => ({ ...prev, salary: e.target.value }))}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-rose-700 mb-1 flex items-center gap-1">
                <AlertOctagon className="w-3.5 h-3.5 text-rose-500" />
                Upfront Fee / Registration / Security Deposit Asked?
              </label>
              <input
                id="input-fee-asked"
                type="text"
                placeholder="e.g. ₹1,499 laptop insurance, ₹500 form charge (or leave blank if none)"
                value={input.feeAsked}
                onChange={(e) => setInput((prev) => ({ ...prev, feeAsked: e.target.value }))}
                className="w-full px-3 py-2 text-sm bg-rose-50/50 border border-rose-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-rose-950 placeholder-rose-400"
              />
            </div>
          </div>
        )}

        {/* Opportunity Text Body (Main Input) */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Offer Message Text / WhatsApp Chat / Email Body
            </label>
            <span className="text-xs text-slate-400">
              {input.text.length} characters
            </span>
          </div>

          <textarea
            id="input-opportunity-text"
            rows={formMode === 'quick' ? 6 : 4}
            value={input.text}
            onChange={(e) => setInput((prev) => ({ ...prev, text: e.target.value }))}
            placeholder="Paste the full WhatsApp message, email, offer letter text, Telegram invitation, or job description here...

Example:
'Hi! We saw your profile. You are selected for a 3-month Software Intern role at Infosys. Stipend ₹35,000/mo. To dispatch your company laptop, transfer ₹1,499 refundable kit fee to our HR UPI id within 2 hours...'"
            className="w-full p-3.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white text-slate-900 transition-colors font-mono placeholder:font-sans placeholder:text-slate-400"
          ></textarea>
        </div>

        {/* Screenshot / Offer Letter Upload Dropzone */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5 text-indigo-600" />
              Upload Screenshot or Offer Letter (OCR Vision Forensics)
            </label>
            <span className="text-[11px] text-indigo-600 font-medium">
              Multimodal AI & OCR Supported
            </span>
          </div>

          {!input.imageBase64 ? (
            <div
              id="screenshot-dropzone"
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
                dragOver
                  ? 'border-indigo-500 bg-indigo-50/60'
                  : 'border-slate-300 hover:border-indigo-400 bg-slate-50/70 hover:bg-slate-50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg, image/jpg, image/webp"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileUpload(e.target.files[0]);
                  }
                }}
              />
              <div className="flex flex-col items-center justify-center space-y-1.5">
                <div className="w-9 h-9 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <Upload className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-800">
                    Click to browse or drag & drop screenshot
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Supports WhatsApp screenshots, Telegram chat logs, fake PDF offer letter images (PNG, JPG, WebP up to 8MB)
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="relative p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-14 h-14 rounded-lg overflow-hidden border border-slate-200 bg-slate-900 flex-shrink-0 flex items-center justify-center">
                  <img
                    src={input.imageBase64}
                    alt="Uploaded offer preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center space-x-1.5">
                    <ImageIcon className="w-4 h-4 text-indigo-600" />
                    <span className="text-xs font-bold text-slate-900">Screenshot Attached for Forensic OCR</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Will be inspected for forged corporate seals, altered fonts, payment QR codes, and fake letterheads.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleRemoveImage}
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                title="Remove attached image"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            {(input.text.length > 0 || input.imageBase64) && (
              <button
                id="btn-clear-input"
                type="button"
                onClick={onClear}
                disabled={isLoading}
                className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 text-xs font-medium transition-colors flex items-center justify-center space-x-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>Clear All</span>
              </button>
            )}
            <span className="text-xs text-slate-500 hidden sm:inline-flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              100% Student Confidential & Free
            </span>
          </div>

          <button
            id="btn-analyze-opportunity"
            type="submit"
            disabled={isLoading || (!input.text.trim() && !input.companyName.trim() && !input.imageBase64)}
            className={`w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-sm text-white shadow-md flex items-center justify-center space-x-2 transition-all transform active:scale-98 ${
              isLoading || (!input.text.trim() && !input.companyName.trim() && !input.imageBase64)
                ? 'bg-slate-400 cursor-not-allowed opacity-75'
                : 'bg-gradient-to-r from-indigo-600 via-indigo-700 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 hover:shadow-lg'
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Running Forensic Analysis...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-cyan-200" />
                <span>Inspect & Calculate Risk Score</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

