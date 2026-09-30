import React, { useState } from 'react';
import { 
  Upload, 
  Sparkles, 
  Image as ImageIcon, 
  Check, 
  Copy, 
  HelpCircle, 
  RefreshCw, 
  MessageSquare,
  Eye,
  FileCheck,
  ChevronRight,
  Maximize2
} from 'lucide-react';
import { StudentLevel, AppLanguage } from '../types';
import { generateSampleNotesImage } from '../utils/sampleImages';
import { MarkdownRenderer } from './MarkdownRenderer';
import { SUBJECTS } from '../data/subjects';

interface ExplainNotesViewProps {
  level: StudentLevel;
  language: AppLanguage;
  onNavigateToChat: (subject: string, prompt?: string) => void;
  onTopicCompleted?: (topic: string) => void;
}

export const ExplainNotesView: React.FC<ExplainNotesViewProps> = ({
  level,
  language,
  onNavigateToChat,
  onTopicCompleted,
}) => {
  const [imageBase64, setImageBase64] = useState<string>('');
  const [mimeType, setMimeType] = useState<string>('image/png');
  const [imageName, setImageName] = useState<string>('');
  const [subject, setSubject] = useState<string>('Mathematics & Calculus');
  const [userQuery, setUserQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [explanation, setExplanation] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageName(file.name);
    setMimeType(file.type || 'image/png');

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setImageBase64(result);
        setExplanation('');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSelectSample = (sampleType: 'calculus' | 'tree' | 'circuits') => {
    const sample = generateSampleNotesImage(sampleType);
    setImageBase64(sample.dataUrl);
    setMimeType(sample.mimeType);

    if (sampleType === 'calculus') {
      setImageName('Sample_Handwritten_Calculus_Notes.png');
      setSubject('Mathematics & Calculus');
      setUserQuery('Transcribe the formula, verify the integration steps, and explain why the constant C is required.');
    } else if (sampleType === 'tree') {
      setImageName('Sample_AVL_Tree_Rotation_Diagram.png');
      setSubject('Computer Science Core');
      setUserQuery('Explain how the balance factor is calculated and how the Right-Rotation restores balance.');
    } else {
      setImageName('Sample_Kirchhoff_Circuit_Notes.png');
      setSubject('Physics & Engineering');
      setUserQuery('Explain Kirchhoff’s Laws shown in this circuit diagram and step through the current calculation.');
    }
    setExplanation('');
  };

  const handleExplainNotes = async () => {
    if (!imageBase64 || loading) return;

    setLoading(true);
    setExplanation('');

    try {
      const res = await fetch('/api/explain-notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64,
          mimeType,
          userQuery,
          subject,
          level,
          language,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to explain image');

      setExplanation(data.explanation);
      if (onTopicCompleted) {
        onTopicCompleted(`Notes Explainer: ${subject}`);
      }
    } catch (err: any) {
      console.error(err);
      setExplanation(`⚠️ Failed to analyze image notes: ${err.message || 'Please check connection'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!explanation) return;
    navigator.clipboard.writeText(explanation);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-violet-900 via-indigo-900 to-slate-900 p-6 sm:p-8 text-white shadow-lg">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-violet-200 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-violet-300" />
            <span>Multimodal Gemini 3.8 Flash Vision</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Explain Handwritten Notes & Diagrams
          </h1>
          <p className="mt-2 text-violet-100 text-xs sm:text-sm leading-relaxed">
            Snap a photo of messy handwriting, blackboard proofs, math equations, or circuit schematics. EduGenie transcribes every line, fixes conceptual gaps, and explains the concepts clearly.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Image Upload & Preview */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
            
            {/* Subject Selector */}
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700">Discipline:</label>
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

            {/* Upload Box or Image Preview */}
            <div>
              {imageBase64 ? (
                <div className="space-y-2">
                  <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shadow-inner group">
                    <img
                      src={imageBase64}
                      alt="Uploaded notes preview"
                      className="w-full h-56 object-contain bg-slate-900/5"
                    />
                    <div className="absolute bottom-2 right-2 flex items-center gap-1.5">
                      <label className="px-2.5 py-1 rounded-lg bg-black/70 hover:bg-black/80 text-white text-[11px] font-semibold backdrop-blur-md cursor-pointer transition-colors">
                        Change Photo
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500 px-1">
                    <span className="truncate max-w-[240px] font-medium">{imageName}</span>
                    <button
                      onClick={() => {
                        setImageBase64('');
                        setImageName('');
                        setExplanation('');
                      }}
                      className="text-rose-600 hover:text-rose-800 font-semibold"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <label className="border-2 border-dashed border-slate-300 hover:border-violet-500 rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all bg-slate-50/50 hover:bg-violet-50/30 group">
                  <div className="w-12 h-12 rounded-2xl bg-violet-100 text-violet-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Upload className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-800">
                    Upload Photo of Notes or Board
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-xs">
                    PNG, JPG, or WEBP of handwritten derivations, flowcharts, circuits, or textbook pages.
                  </p>
                  <span className="mt-3 px-3 py-1 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-violet-700 shadow-2xs group-hover:border-violet-300">
                    Browse Files
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Quick Test Samples */}
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                Or Try Sample Handwritten Notes:
              </span>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'calculus', label: 'Calculus Proof', color: 'hover:border-emerald-400' },
                  { id: 'tree', label: 'AVL Tree Diagram', color: 'hover:border-amber-400' },
                  { id: 'circuits', label: 'Circuit Laws', color: 'hover:border-blue-400' },
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => handleSelectSample(s.id as any)}
                    className={`p-2 rounded-xl bg-slate-50 border border-slate-200 text-[11px] font-semibold text-slate-700 hover:bg-white transition-all text-center ${s.color}`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Question input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Specific Question or Focus (Optional):
              </label>
              <textarea
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
                rows={2}
                placeholder="e.g. Explain step 2, check if the math is correct, or simplify this diagram..."
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>

            {/* Action button */}
            <button
              onClick={handleExplainNotes}
              disabled={!imageBase64 || loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 disabled:opacity-50 text-white font-bold text-sm shadow-md shadow-violet-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Gemini is reading handwriting & diagrams...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Explain Notes with Gemini Vision</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: AI Explanation & Step-by-Step Breakdown */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs h-full min-h-[480px] flex flex-col">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-violet-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Visual Analysis & Concept Breakdown
                </h3>
              </div>

              {explanation && (
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

                  <button
                    onClick={() =>
                      onNavigateToChat(
                        subject,
                        `Let's discuss these notes further: ${userQuery || 'Explain the concept shown in these notes in even simpler detail'}`
                      )
                    }
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-violet-50 hover:bg-violet-100 text-violet-800 text-xs font-semibold transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-violet-600" />
                    <span>Follow-up in Chat</span>
                  </button>
                </div>
              )}
            </div>

            {/* Explanation Content */}
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-slate-400">
                  <div className="w-12 h-12 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center mb-3">
                    <Sparkles className="w-6 h-6 animate-pulse" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-700">Deciphering Visual Notes...</h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm">
                    Reading handwritten text, parsing equations, analyzing diagrams, and translating into {level} clear explanations.
                  </p>
                </div>
              ) : explanation ? (
                <div className="prose prose-sm max-w-none">
                  <MarkdownRenderer content={explanation} />
                </div>
              ) : (
                <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-slate-400">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mb-3">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-semibold text-slate-600">No notes analyzed yet</h4>
                  <p className="text-xs text-slate-400 mt-1 max-w-xs">
                    Upload a photo of your lecture notes or pick one of the sample diagrams (Calculus, AVL Tree, or Circuits) to see multimodal AI explanation in action.
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
