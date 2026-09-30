import React from 'react';
import { 
  Sparkles, 
  MessageSquare, 
  FileText, 
  HelpCircle, 
  CalendarCheck, 
  ArrowRight, 
  BookOpen, 
  TrendingUp, 
  CheckCircle2, 
  Brain,
  Lightbulb,
  Compass,
  Code,
  Cpu,
  Sigma,
  Terminal,
  Atom,
  ChevronRight
} from 'lucide-react';
import { StudentLevel, AppLanguage, QuizResult } from '../types';
import { SUBJECTS } from '../data/subjects';

interface DashboardViewProps {
  onNavigate: (tab: string, extraData?: any) => void;
  level: StudentLevel;
  language: AppLanguage;
  streakDays: number;
  quizHistory: QuizResult[];
  completedTopicsCount: number;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigate,
  level,
  language,
  streakDays,
  quizHistory,
  completedTopicsCount,
}) => {
  const [quickQuery, setQuickQuery] = React.useState('');

  const averageScore = quizHistory.length > 0
    ? Math.round(quizHistory.reduce((acc, q) => acc + q.percentage, 0) / quizHistory.length)
    : 85;

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickQuery.trim()) return;
    onNavigate('chat', { initialPrompt: quickQuery });
  };

  const getSubjectIcon = (iconName: string) => {
    switch (iconName) {
      case 'Code': return <Code className="w-5 h-5 text-blue-600" />;
      case 'Cpu': return <Cpu className="w-5 h-5 text-purple-600" />;
      case 'Sigma': return <Sigma className="w-5 h-5 text-emerald-600" />;
      case 'Terminal': return <Terminal className="w-5 h-5 text-amber-600" />;
      case 'BookOpen': return <BookOpen className="w-5 h-5 text-rose-600" />;
      case 'Atom': return <Atom className="w-5 h-5 text-cyan-600" />;
      default: return <BookOpen className="w-5 h-5 text-indigo-600" />;
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 text-white p-6 sm:p-10 shadow-xl shadow-indigo-950/20">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-12 w-64 h-64 rounded-full bg-violet-500/20 blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-indigo-200 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
            <span>Empowering Academic Excellence with Google Gemini</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span className="text-white/80">{level} Mode</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Learn anything faster, <br />
            <span className="bg-gradient-to-r from-indigo-200 via-violet-200 to-amber-200 bg-clip-text text-transparent">
              simpler & step-by-step.
            </span>
          </h1>

          <p className="mt-3 text-slate-300 text-sm sm:text-base leading-relaxed">
            EduGenie breaks down tough college topics, deciphers handwritten notes, generates custom revision quizzes, and crafts study plans tuned to your pace.
          </p>

          {/* Quick Chat Input Box inside Hero */}
          <form onSubmit={handleQuickSubmit} className="mt-6 flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={quickQuery}
                onChange={(e) => setQuickQuery(e.target.value)}
                placeholder={
                  language === 'ta'
                    ? 'கேளுங்கள்: "பைத்தானில் ரெகர்ஷன் என்றால் என்ன?" அல்லது "ஒருங்கிணைப்பு விதியை விளக்கு"...'
                    : 'Ask anything: "Explain Dynamic Programming simply" or "How does Backpropagation work?"...'
                }
                className="w-full pl-4 pr-10 py-3.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white/15 shadow-inner"
              />
              <Sparkles className="absolute right-3.5 top-3.5 w-5 h-5 text-indigo-300 pointer-events-none" />
            </div>
            <button
              type="submit"
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Ask Genie</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick suggestions */}
          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-300">
            <span className="text-slate-400">Try asking:</span>
            {[
              'Explain QuickSort vs MergeSort',
              'Derive Integration by Parts',
              'What is ACID in DBMS?',
              'Explain Transformer Attention in Tamil',
            ].map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => onNavigate('chat', { initialPrompt: prompt })}
                className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 border border-white/10 transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Metrics & Study Progress Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{completedTopicsCount}</div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Topics Mastered</div>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{averageScore}%</div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Quiz Accuracy</div>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{streakDays} Days</div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Study Streak 🔥</div>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">
              {quizHistory.length} Done
            </div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Quizzes Taken</div>
          </div>
        </div>
      </div>

      {/* Main Feature Cards Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Compass className="w-5 h-5 text-indigo-600" />
            <span>EduGenie Learning Toolkit</span>
          </h2>
          <span className="text-xs text-slate-500">Pick any feature to begin</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: AI Chat Assistant */}
          <div
            onClick={() => onNavigate('chat')}
            className="group p-6 rounded-2xl bg-white border border-slate-200/80 hover:border-indigo-400 hover:shadow-lg hover:shadow-indigo-50 transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -z-0 group-hover:scale-110 transition-transform" />
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-100/70 text-blue-700 flex items-center justify-center mb-4">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                AI Academic Tutor
              </h3>
              <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                Ask any complex concept. Get step-by-step solutions, intuitive real-life analogies, and simplified breakdowns on demand.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-600">
              <span>Start Learning</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: Explain Image / Notes (Multimodal Vision) */}
          <div
            onClick={() => onNavigate('notes')}
            className="group p-6 rounded-2xl bg-white border border-slate-200/80 hover:border-violet-400 hover:shadow-lg hover:shadow-violet-50 transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-violet-50 rounded-bl-full -z-0 group-hover:scale-110 transition-transform" />
            <div>
              <div className="w-12 h-12 rounded-xl bg-violet-100/70 text-violet-700 flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="inline-block px-2 py-0.5 rounded-full bg-violet-100 text-violet-700 text-[10px] font-bold uppercase mb-1">
                Gemini Vision
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-violet-600 transition-colors">
                Explain Handwritten Notes
              </h3>
              <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                Snap a photo or upload messy lecture notes, blackboard derivations, or circuit diagrams. Genie transcribes & explains every line.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-violet-600">
              <span>Upload Notes / Diagram</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3: Smart Summarizer */}
          <div
            onClick={() => onNavigate('summarize')}
            className="group p-6 rounded-2xl bg-white border border-slate-200/80 hover:border-emerald-400 hover:shadow-lg hover:shadow-emerald-50 transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-full -z-0 group-hover:scale-110 transition-transform" />
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-100/70 text-emerald-700 flex items-center justify-center mb-4">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                Smart Summarizer
              </h3>
              <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                Condense 20-page textbook readings and dense slides into high-yield executive summaries, key formula sheets, and flashcards.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-emerald-600">
              <span>Condense Material</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 4: Quiz Generator */}
          <div
            onClick={() => onNavigate('quiz')}
            className="group p-6 rounded-2xl bg-white border border-slate-200/80 hover:border-amber-400 hover:shadow-lg hover:shadow-amber-50 transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50 rounded-bl-full -z-0 group-hover:scale-110 transition-transform" />
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-100/70 text-amber-700 flex items-center justify-center mb-4">
                <HelpCircle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                Practice Quiz Arena
              </h3>
              <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                Generate interactive MCQs with instant feedback, hints, wrong-answer breakdowns, and automatic progress tracking.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-amber-600">
              <span>Test Knowledge</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 5: Personalized Study Planner */}
          <div
            onClick={() => onNavigate('planner')}
            className="group p-6 rounded-2xl bg-white border border-slate-200/80 hover:border-rose-400 hover:shadow-lg hover:shadow-rose-50 transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-rose-50 rounded-bl-full -z-0 group-hover:scale-110 transition-transform" />
            <div>
              <div className="w-12 h-12 rounded-xl bg-rose-100/70 text-rose-700 flex items-center justify-center mb-4">
                <CalendarCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-rose-600 transition-colors">
                Personalized Study Planner
              </h3>
              <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                Input your exam dates, daily available hours, and target subjects. Genie produces an actionable day-by-day revision roadmap.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-rose-600">
              <span>Build Schedule</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 6: Multilingual English + Tamil Support */}
          <div
            onClick={() => onNavigate('subjects')}
            className="group p-6 rounded-2xl bg-white border border-slate-200/80 hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-50 transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-50 rounded-bl-full -z-0 group-hover:scale-110 transition-transform" />
            <div>
              <div className="w-12 h-12 rounded-xl bg-cyan-100/70 text-cyan-700 flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6" />
              </div>
              <div className="inline-block px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-700 text-[10px] font-bold uppercase mb-1">
                English & தமிழ்
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-cyan-600 transition-colors">
                Academic Subject Explorer
              </h3>
              <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                Browse core STEM curricula in Programming, AI, Math, CS, English, and Physics with instant starter exercises.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-cyan-600">
              <span>Explore Curricula</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* Subject-Based Learning Row */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Supported Academic Disciplines</h2>
            <p className="text-xs text-slate-500">Pick any subject for focused tutor assistance</p>
          </div>
          <button
            onClick={() => onNavigate('subjects')}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SUBJECTS.map((sub) => (
            <div
              key={sub.id}
              onClick={() => onNavigate('chat', { subject: sub.name })}
              className="p-4 rounded-xl bg-white border border-slate-200/80 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 group-hover:scale-110 transition-transform shrink-0">
                  {getSubjectIcon(sub.iconName)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
                      {sub.name}
                    </h4>
                  </div>
                  <p className="text-[11px] text-slate-400 font-medium">{sub.tamilName}</p>
                  <p className="mt-1 text-xs text-slate-500 line-clamp-2">{sub.description}</p>
                  <div className="mt-2.5 flex items-center gap-1 text-[11px] font-semibold text-indigo-600">
                    <span>Ask question</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pro Study Strategy & Cognitive Tip */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-indigo-500/10 border border-amber-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500 text-white shrink-0 shadow-sm">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">
              Genie Study Tip: The Feynman Technique
            </h4>
            <p className="text-xs text-slate-600 mt-0.5 max-w-2xl leading-relaxed">
              If you can’t explain a concept in simple words without technical jargon, you don’t fully understand it yet. Try clicking <span className="font-semibold text-indigo-700">"Explain Simpler 🪄"</span> in the AI Tutor to see how even quantum physics or recursive algorithms can be understood through intuitive real-world metaphors!
            </p>
          </div>
        </div>
        <button
          onClick={() => onNavigate('chat', { initialPrompt: 'Teach me the Feynman technique for college exam prep step by step.' })}
          className="shrink-0 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
        >
          Try Feynman Demo
        </button>
      </div>
    </div>
  );
};
