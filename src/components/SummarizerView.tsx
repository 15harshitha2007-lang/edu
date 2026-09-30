import React, { useState } from 'react';
import { 
  FileText, 
  Sparkles, 
  Upload, 
  Copy, 
  Check, 
  BookOpen, 
  Layers, 
  Zap, 
  HelpCircle,
  FileCheck2,
  RefreshCw,
  Share2
} from 'lucide-react';
import { StudentLevel, AppLanguage } from '../types';
import { SAMPLE_STUDY_MATERIALS, SUBJECTS } from '../data/subjects';
import { MarkdownRenderer } from './MarkdownRenderer';

interface SummarizerViewProps {
  level: StudentLevel;
  language: AppLanguage;
  initialSubject?: string;
  onNavigateToQuiz?: (topic: string, material: string) => void;
  onTopicCompleted?: (topic: string) => void;
}

export const SummarizerView: React.FC<SummarizerViewProps> = ({
  level,
  language,
  initialSubject,
  onNavigateToQuiz,
  onTopicCompleted,
}) => {
  const [inputText, setInputText] = useState<string>('');
  const [subject, setSubject] = useState<string>(initialSubject || 'Computer Science');
  const [mode, setMode] = useState<'concise' | 'detailed' | 'flashcards' | 'exam_cram'>('detailed');
  const [summary, setSummary] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setInputText(content);
      }
    };
    reader.readAsText(file);
  };

  const handleLoadSample = (sampleIndex: number) => {
    const sample = SAMPLE_STUDY_MATERIALS[sampleIndex];
    if (sample) {
      setInputText(sample.content);
      setSubject(sample.subject);
      setUploadedFileName(sample.title);
    }
  };

  const handleGenerateSummary = async () => {
    if (!inputText.trim() || loading) return;

    setLoading(true);
    setSummary('');

    try {
      const res = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: inputText,
          mode,
          subject,
          level,
          language,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to summarize study material');

      setSummary(data.summary);
      if (onTopicCompleted) {
        onTopicCompleted(`Summarized: ${subject} (${mode})`);
      }
    } catch (err: any) {
      console.error(err);
      setSummary(`⚠️ Error generating summary: ${err.message || 'Please check connection'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!summary) return;
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-emerald-900 via-teal-800 to-slate-900 p-6 sm:p-8 text-white shadow-lg">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-200 text-xs font-semibold mb-3">
            <FileText className="w-3.5 h-3.5 text-emerald-300" />
            <span>AI Study Material Summarizer</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Distill Dense Text into High-Yield Revision
          </h1>
          <p className="mt-2 text-slate-300 text-xs sm:text-sm leading-relaxed">
            Paste lecture notes, textbook chapters, or research papers. EduGenie automatically generates executive summaries, step-by-step concepts, key formulas, and active recall flashcards.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Input Material & Options */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
            
            {/* Header controls: Subject & Sample Presets */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-700">Subject:</span>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-800 focus:outline-none"
                >
                  {SUBJECTS.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sample Presets */}
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-slate-500 font-medium">Sample:</span>
                <button
                  type="button"
                  onClick={() => handleLoadSample(0)}
                  className="px-2 py-0.5 rounded bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[11px] font-semibold transition-colors"
                >
                  OS Scheduling
                </button>
                <button
                  type="button"
                  onClick={() => handleLoadSample(1)}
                  className="px-2 py-0.5 rounded bg-purple-50 hover:bg-purple-100 text-purple-700 text-[11px] font-semibold transition-colors"
                >
                  ML Overfitting
                </button>
              </div>
            </div>

            {/* Mode selection buttons */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Select Output Format & Depth:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'concise', label: 'Concise Bullet', icon: Zap, desc: 'Quick 200 words' },
                  { id: 'detailed', label: 'Deep Outline', icon: Layers, desc: 'Full step-by-step' },
                  { id: 'flashcards', label: 'Flashcards', icon: BookOpen, desc: 'Q&A Active Recall' },
                  { id: 'exam_cram', label: 'Exam Cram', icon: FileCheck2, desc: 'Must-know formulas' },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = mode === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setMode(item.id as any)}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-900 shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100/70'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 font-bold text-xs">
                        <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-emerald-600' : 'text-slate-500'}`} />
                        <span>{item.label}</span>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-0.5">{item.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Input Text Area */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Study Material Content:
                </label>
                <label className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 cursor-pointer">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload .txt / .md</span>
                  <input
                    type="file"
                    accept=".txt,.md,.doc,.json"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {uploadedFileName && (
                <div className="mb-2 px-3 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between">
                  <span className="truncate font-medium">Loaded: {uploadedFileName}</span>
                  <button
                    onClick={() => {
                      setUploadedFileName(null);
                      setInputText('');
                    }}
                    className="text-emerald-700 hover:text-emerald-900 font-bold ml-2"
                  >
                    ×
                  </button>
                </div>
              )}

              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                rows={10}
                placeholder="Paste lecture notes, textbook chapters, or syllabi here to generate a comprehensive study summary..."
                className="w-full p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all font-mono leading-relaxed"
              />
              <div className="mt-1 flex items-center justify-between text-[11px] text-slate-400">
                <span>{inputText.length} characters</span>
                <span>Supported: English & தமிழ்</span>
              </div>
            </div>

            {/* Summarize Action Button */}
            <button
              onClick={handleGenerateSummary}
              disabled={!inputText.trim() || loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 text-white font-bold text-sm shadow-md shadow-emerald-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>EduGenie is analyzing notes...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate High-Yield Summary</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Generated Summary Output */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs h-full min-h-[480px] flex flex-col">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Synthesized Study Summary
                </h3>
              </div>

              {summary && (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-600">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>

                  {onNavigateToQuiz && (
                    <button
                      onClick={() => onNavigateToQuiz(subject, inputText)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-semibold transition-colors"
                    >
                      <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
                      <span>Quiz from This</span>
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Output Display Area */}
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-slate-400">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                    <Sparkles className="w-6 h-6 animate-pulse" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-700">Synthesizing Notes...</h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm">
                    Condensing core concepts, extracting definitions, and applying {level} learning adjustments.
                  </p>
                </div>
              ) : summary ? (
                <div className="prose prose-sm max-w-none">
                  <MarkdownRenderer content={summary} />
                </div>
              ) : (
                <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-slate-400">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mb-3">
                    <FileText className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-semibold text-slate-600">No summary generated yet</h4>
                  <p className="text-xs text-slate-400 mt-1 max-w-xs">
                    Paste your study material on the left or click one of the quick samples (OS Scheduling or ML Overfitting) to generate a summary.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
