import React from 'react';
import { 
  BarChart3, 
  Award, 
  Flame, 
  CheckCircle2, 
  Brain, 
  TrendingUp, 
  RotateCcw, 
  BookOpen, 
  Trash2, 
  Download,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { QuizResult, StudentLevel } from '../types';

interface ProgressViewProps {
  quizHistory: QuizResult[];
  completedTopics: string[];
  streakDays: number;
  onRetakeQuiz: (topic: string, subject: string) => void;
  onClearHistory: () => void;
  onReviseTopic: (topic: string) => void;
}

export const ProgressView: React.FC<ProgressViewProps> = ({
  quizHistory,
  completedTopics,
  streakDays,
  onRetakeQuiz,
  onClearHistory,
  onReviseTopic,
}) => {
  const averageScore = quizHistory.length > 0
    ? Math.round(quizHistory.reduce((acc, q) => acc + q.percentage, 0) / quizHistory.length)
    : 0;

  // Identify weak areas (quizzes with score < 70%)
  const weakQuizzes = quizHistory.filter((q) => q.percentage < 70);

  // Gamified Badges
  const badges = [
    {
      id: 'first_step',
      name: 'Curious Scholar',
      desc: 'Completed your first study topic or explanation',
      unlocked: completedTopics.length >= 1,
      icon: '🌱',
    },
    {
      id: 'streak_3',
      name: 'Consistent Thinker',
      desc: 'Maintained a 3+ day learning streak',
      unlocked: streakDays >= 3,
      icon: '🔥',
    },
    {
      id: 'quiz_master',
      name: 'Quiz Champion',
      desc: 'Achieved 80%+ on any quiz',
      unlocked: quizHistory.some((q) => q.percentage >= 80),
      icon: '🏆',
    },
    {
      id: 'polymath',
      name: 'Multidisciplinary Mind',
      desc: 'Mastered 3 or more subjects',
      unlocked: completedTopics.length >= 3,
      icon: '🧠',
    },
  ];

  const handleExportData = () => {
    const report = {
      appName: 'EduGenie Learning Assistant',
      generatedAt: new Date().toISOString(),
      stats: {
        completedTopicsCount: completedTopics.length,
        averageScore,
        streakDays,
        totalQuizzesTaken: quizHistory.length,
      },
      completedTopics,
      quizHistory,
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `EduGenie_Progress_Report_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 sm:p-8 text-white shadow-lg">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-indigo-200 text-xs font-semibold mb-3">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Academic Analytics & Mastery</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Learning Progress & Knowledge Tracker
          </h1>
          <p className="mt-2 text-slate-300 text-xs sm:text-sm leading-relaxed">
            Track topics completed, quiz score trends, study streaks, and automatically identified weak areas that need focused revision.
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Topics Completed</span>
            <Brain className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-3xl font-black text-slate-900">{completedTopics.length}</div>
          <p className="text-[11px] text-slate-500">Modules explored with AI</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Avg Quiz Score</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-3xl font-black text-slate-900">{averageScore}%</div>
          <p className="text-[11px] text-slate-500">Across {quizHistory.length} assessments</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Active Streak</span>
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
          </div>
          <div className="text-3xl font-black text-slate-900">{streakDays} Days</div>
          <p className="text-[11px] text-slate-500">Daily study habit 🔥</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Achievements</span>
            <Award className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-3xl font-black text-slate-900">
            {badges.filter((b) => b.unlocked).length} / {badges.length}
          </div>
          <p className="text-[11px] text-slate-500">Badges unlocked</p>
        </div>
      </div>

      {/* Badges and Milestones */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Award className="w-4 h-4 text-indigo-600" />
          <span>Student Mastery Badges</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {badges.map((b) => (
            <div
              key={b.id}
              className={`p-4 rounded-xl border flex items-center gap-3 transition-all ${
                b.unlocked
                  ? 'bg-amber-50/50 border-amber-200 shadow-2xs'
                  : 'bg-slate-50/50 border-slate-200 opacity-60'
              }`}
            >
              <div className="text-2xl shrink-0">{b.icon}</div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-bold text-slate-900">{b.name}</h4>
                  {b.unlocked && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  )}
                </div>
                <p className="text-[10px] text-slate-500 mt-0.5">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Weak Areas needing revision */}
      {weakQuizzes.length > 0 && (
        <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-3">
          <div className="flex items-center gap-2 text-amber-900">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <h3 className="text-xs sm:text-sm font-bold">
              Identified Revision Recommendations (&lt;70% Accuracy)
            </h3>
          </div>
          <p className="text-xs text-amber-800 leading-relaxed">
            EduGenie noticed these topics had lower scores. Spend 10 minutes reviewing them with the AI Tutor:
          </p>
          <div className="flex flex-wrap gap-2">
            {weakQuizzes.map((wq) => (
              <button
                key={wq.id}
                onClick={() => onReviseTopic(wq.topic)}
                className="px-3 py-1.5 rounded-xl bg-white hover:bg-amber-100/60 text-amber-950 border border-amber-300 text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
              >
                <span>Revise {wq.topic} ({wq.percentage}%)</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-600" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quiz History Table */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Recent Quiz Results</h3>
            <p className="text-xs text-slate-500">History of assessments and scores</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportData}
              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON</span>
            </button>
            {quizHistory.length > 0 && (
              <button
                onClick={onClearHistory}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                title="Clear History"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {quizHistory.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 uppercase font-semibold">
                <tr>
                  <th className="px-4 py-2.5 rounded-l-lg">Topic</th>
                  <th className="px-4 py-2.5">Subject</th>
                  <th className="px-4 py-2.5">Score</th>
                  <th className="px-4 py-2.5">Accuracy</th>
                  <th className="px-4 py-2.5">Date</th>
                  <th className="px-4 py-2.5 rounded-r-lg text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {quizHistory.map((q) => (
                  <tr key={q.id} className="hover:bg-slate-50/50">
                    <td className="px-4 py-3 font-semibold text-slate-900 max-w-xs truncate">
                      {q.topic}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{q.subject}</td>
                    <td className="px-4 py-3 font-mono font-medium text-slate-700">
                      {q.score} / {q.total}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold ${
                          q.percentage >= 80
                            ? 'bg-emerald-100 text-emerald-800'
                            : q.percentage >= 60
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {q.percentage}%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-400">{q.date}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => onRetakeQuiz(q.topic, q.subject)}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Retake</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-8 text-center text-slate-400 text-xs">
            No quiz records yet. Head over to the Quiz Arena to take your first knowledge test!
          </div>
        )}
      </div>

      {/* Log of Completed Study Topics */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
        <h3 className="text-sm font-bold text-slate-900">
          Topics & Exercises Explored ({completedTopics.length})
        </h3>
        {completedTopics.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {completedTopics.map((topic, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-medium flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>{topic}</span>
              </span>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400">
            Topics you chat about, summarize, or decipher with the Vision tool will be automatically tracked here.
          </p>
        )}
      </div>
    </div>
  );
};
