import React, { useState } from 'react';
import { 
  BookOpen, 
  Code, 
  Cpu, 
  Sigma, 
  Terminal, 
  Atom, 
  HelpCircle, 
  MessageSquare, 
  FileText, 
  Sparkles,
  Search,
  ArrowRight
} from 'lucide-react';
import { SUBJECTS } from '../data/subjects';
import { StudentLevel, AppLanguage, SubjectInfo } from '../types';

interface SubjectHubViewProps {
  onNavigateToChat: (subject: string, prompt?: string) => void;
  onNavigateToQuiz: (topic: string, subject: string) => void;
  onNavigateToSummarize: (subject: string) => void;
  level: StudentLevel;
  language: AppLanguage;
}

export const SubjectHubView: React.FC<SubjectHubViewProps> = ({
  onNavigateToChat,
  onNavigateToQuiz,
  onNavigateToSummarize,
  level,
  language,
}) => {
  const [selectedSubject, setSelectedSubject] = useState<SubjectInfo>(SUBJECTS[0]);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSubjects = SUBJECTS.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.tamilName.includes(searchQuery) ||
      s.topics.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

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
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 p-6 sm:p-8 text-white shadow-lg">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-indigo-200 text-xs font-semibold mb-3">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Subject-Based Learning Curricula</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Academic Subject Explorer
          </h1>
          <p className="mt-2 text-slate-300 text-xs sm:text-sm leading-relaxed">
            Choose any core college discipline to access topic outlines, instant AI tutor prompts, curriculum flashcards, and tailored practice exercises.
          </p>

          {/* Search bar */}
          <div className="mt-5 relative max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search subjects, concepts (e.g. Backpropagation, Calculus)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
        </div>
      </div>

      {/* Main Grid: Left Subject Cards, Right Detail Pane */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left List of Subjects */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-slate-900 flex items-center justify-between">
            <span>Select Discipline</span>
            <span className="text-xs text-slate-500 font-normal">{filteredSubjects.length} available</span>
          </h2>

          <div className="space-y-2.5">
            {filteredSubjects.map((sub) => {
              const isSelected = selectedSubject.id === sub.id;
              return (
                <div
                  key={sub.id}
                  onClick={() => setSelectedSubject(sub)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center gap-3 ${
                    isSelected
                      ? 'bg-indigo-50/70 border-indigo-400 shadow-xs'
                      : 'bg-white border-slate-200/80 hover:border-slate-300 hover:bg-slate-50/50'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                    {getSubjectIcon(sub.iconName)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className={`text-xs sm:text-sm font-bold truncate ${isSelected ? 'text-indigo-900' : 'text-slate-800'}`}>
                        {sub.name}
                      </h3>
                      {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>}
                    </div>
                    <p className="text-[11px] text-slate-500 truncate">{sub.tamilName}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Active Subject Detail Workspace */}
        <div className="lg:col-span-2 space-y-5">
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-6">
            {/* Subject Title and Quick Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-indigo-50 text-indigo-700">
                  {getSubjectIcon(selectedSubject.iconName)}
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                    {selectedSubject.name}
                  </h2>
                  <p className="text-xs text-indigo-700 font-medium">
                    {selectedSubject.tamilName} • {level} Rigor
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onNavigateToChat(selectedSubject.name)}
                  className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Chat Tutor</span>
                </button>
                <button
                  onClick={() => onNavigateToQuiz(selectedSubject.topics[0] || selectedSubject.name, selectedSubject.name)}
                  className="px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
                  <span>Topic Quiz</span>
                </button>
                <button
                  onClick={() => onNavigateToSummarize(selectedSubject.name)}
                  className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-slate-600" />
                  <span>Summarize</span>
                </button>
              </div>
            </div>

            {/* Curriculum Topics */}
            <div>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                Key Curriculum Syllabus Modules
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {selectedSubject.topics.map((topic, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-indigo-300 hover:bg-indigo-50/40 transition-all flex items-center justify-between group cursor-pointer"
                    onClick={() =>
                      onNavigateToChat(
                        selectedSubject.name,
                        `Explain "${topic}" in ${selectedSubject.name} step by step for a ${level} college student.`
                      )
                    }
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="w-5 h-5 rounded-md bg-white border border-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-500">
                        {idx + 1}
                      </span>
                      <span className="text-xs font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors truncate">
                        {topic}
                      </span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all shrink-0" />
                  </div>
                ))}
              </div>
            </div>

            {/* Popular Questions to Ask Gemini */}
            <div>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Frequently Tested Academic Problems</span>
              </h3>
              <div className="space-y-2">
                {selectedSubject.sampleQuestions.map((q, idx) => (
                  <div
                    key={idx}
                    onClick={() => onNavigateToChat(selectedSubject.name, q)}
                    className="p-3 rounded-xl bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-xs transition-all flex items-start justify-between gap-3 cursor-pointer group"
                  >
                    <div className="flex items-start gap-2 text-xs text-slate-700 leading-relaxed group-hover:text-indigo-900">
                      <span className="font-bold text-indigo-600">Q{idx + 1}:</span>
                      <span>{q}</span>
                    </div>
                    <span className="shrink-0 text-[11px] font-semibold text-indigo-600 px-2 py-0.5 rounded bg-indigo-50 group-hover:bg-indigo-100 transition-colors">
                      Ask Tutor →
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
