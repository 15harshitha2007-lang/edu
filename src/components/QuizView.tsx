import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  HelpCircle, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  RotateCcw, 
  Lightbulb, 
  Award, 
  BrainCircuit, 
  BookOpen,
  Check,
  ChevronRight
} from 'lucide-react';
import { QuizQuestion, StudentLevel, AppLanguage, QuizResult } from '../types';
import { SUBJECTS } from '../data/subjects';

interface QuizViewProps {
  level: StudentLevel;
  language: AppLanguage;
  initialTopic?: string;
  initialSubject?: string;
  initialMaterial?: string;
  onQuizFinished: (result: QuizResult) => void;
}

export const QuizView: React.FC<QuizViewProps> = ({
  level,
  language,
  initialTopic,
  initialSubject,
  initialMaterial,
  onQuizFinished,
}) => {
  const [topic, setTopic] = useState<string>(initialTopic || 'Operating Systems CPU Scheduling');
  const [subject, setSubject] = useState<string>(initialSubject || 'Computer Science');
  const [material, setMaterial] = useState<string>(initialMaterial || '');
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [loading, setLoading] = useState<boolean>(false);

  // Active quiz state
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showHint, setShowHint] = useState<boolean>(false);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);

  const handleGenerateQuiz = async () => {
    if (!topic.trim() || loading) return;

    setLoading(true);
    setQuestions([]);
    setSelectedAnswers({});
    setCurrentIndex(0);
    setQuizSubmitted(false);
    setShowHint(false);

    try {
      const res = await fetch('/api/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          subject,
          level,
          questionCount,
          material,
          language,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate quiz');

      if (data.questions && Array.isArray(data.questions)) {
        setQuestions(data.questions);
      } else {
        throw new Error('No questions returned by Gemini');
      }
    } catch (err: any) {
      console.error(err);
      alert(`Error generating quiz: ${err.message || 'Please try again'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (optionIndex: number) => {
    if (quizSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentIndex]: optionIndex,
    }));
  };

  const handleSubmitQuiz = () => {
    let correctCount = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswerIndex) {
        correctCount++;
      }
    });

    setScore(correctCount);
    setQuizSubmitted(true);

    const percentage = Math.round((correctCount / questions.length) * 100);

    // Trigger celebratory confetti if passed well
    if (percentage >= 60) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    }

    // Save result to global progress
    const result: QuizResult = {
      id: `quiz-${Date.now()}`,
      topic,
      subject,
      score: correctCount,
      total: questions.length,
      percentage,
      date: new Date().toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }),
      level,
    };
    onQuizFinished(result);
  };

  const currentQ = questions[currentIndex];
  const totalQ = questions.length;
  const isLastQuestion = currentIndex === totalQ - 1;
  const answeredCount = Object.keys(selectedAnswers).length;

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-amber-600 via-orange-600 to-indigo-900 p-6 sm:p-8 text-white shadow-lg">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-200 text-xs font-semibold mb-3">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Interactive MCQ Arena</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Practice & Test Your Mastery
          </h1>
          <p className="mt-2 text-amber-100 text-xs sm:text-sm leading-relaxed">
            Generate custom exam-grade multiple choice questions on any topic or notes. Instant conceptual hints, detailed explanations for right & wrong answers, and automatic progress tracking.
          </p>
        </div>
      </div>

      {/* Quiz Configuration Drawer / Generator Bar */}
      {questions.length === 0 ? (
        <div className="max-w-2xl mx-auto p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-md space-y-5">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Configure Practice Quiz</h2>
              <p className="text-xs text-slate-500">EduGenie will generate fresh tailored questions</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Topic or Academic Concept:
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Binary Search Tree Rotations, Newton Laws, Integration by Parts..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Subject Area:
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer"
                >
                  {SUBJECTS.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Number of Questions:
                </label>
                <select
                  value={questionCount}
                  onChange={(e) => setQuestionCount(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer"
                >
                  <option value={3}>3 Questions (Quick Sprint)</option>
                  <option value={5}>5 Questions (Standard)</option>
                  <option value={10}>10 Questions (Deep Assessment)</option>
                </select>
              </div>
            </div>

            {/* Optional Context text */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Optional: Base quiz on specific lecture notes / text:
              </label>
              <textarea
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                rows={3}
                placeholder="Paste relevant notes or syllabus excerpts here if you want questions derived from exact material..."
                className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
              />
            </div>

            {/* Quick Preset Buttons */}
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                Quick Starters:
              </span>
              <div className="flex flex-wrap gap-2">
                {[
                  { t: 'Object-Oriented Programming & Polymorphism', s: 'Programming & Coding' },
                  { t: 'Backpropagation & Neural Networks', s: 'Artificial Intelligence & ML' },
                  { t: 'Integration by Parts & Calculus', s: 'Mathematics & Calculus' },
                  { t: 'Deadlocks & Banker\'s Algorithm', s: 'Computer Science Core' },
                ].map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setTopic(preset.t);
                      setSubject(preset.s);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-amber-50 hover:text-amber-800 text-slate-600 text-xs font-medium transition-colors border border-slate-200"
                  >
                    {preset.t.split('&')[0]}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleGenerateQuiz}
              disabled={loading || !topic.trim()}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 disabled:opacity-50 text-white font-bold text-sm shadow-md shadow-amber-200 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              {loading ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>Gemini is generating quiz...</span>
                </>
              ) : (
                <>
                  <HelpCircle className="w-4 h-4" />
                  <span>Generate Quiz ({questionCount} Questions)</span>
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        /* Active Quiz Player */
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Top Status & Progress Bar */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">
                  {subject}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  {level} Level
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-extrabold text-slate-900 mt-1 truncate max-w-md">
                Topic: {topic}
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-600">
                Question {currentIndex + 1} of {totalQ}
              </span>
              <button
                onClick={() => {
                  if (window.confirm('Leave this quiz and configure a new one?')) {
                    setQuestions([]);
                  }
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                title="Restart with new topic"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Progress track */}
          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
            <div
              className="bg-amber-500 h-full transition-all duration-300 rounded-full"
              style={{ width: `${((currentIndex + 1) / totalQ) * 100}%` }}
            />
          </div>

          {/* Question Card */}
          {currentQ && (
            <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-6">
              {/* Question Text */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
                  Question #{currentQ.id || currentIndex + 1}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                  {currentQ.question}
                </h3>
              </div>

              {/* Options List */}
              <div className="space-y-2.5">
                {currentQ.options.map((opt, optIdx) => {
                  const isSelected = selectedAnswers[currentIndex] === optIdx;
                  const isCorrect = optIdx === currentQ.correctAnswerIndex;
                  const showResultState = quizSubmitted;

                  let optionStyle = 'bg-slate-50/80 border-slate-200 text-slate-800 hover:bg-amber-50/50 hover:border-amber-300';
                  if (isSelected && !showResultState) {
                    optionStyle = 'bg-amber-50 border-amber-500 text-amber-950 ring-1 ring-amber-500 font-semibold';
                  } else if (showResultState) {
                    if (isCorrect) {
                      optionStyle = 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold ring-1 ring-emerald-500';
                    } else if (isSelected && !isCorrect) {
                      optionStyle = 'bg-rose-50 border-rose-500 text-rose-950 font-medium ring-1 ring-rose-500';
                    } else {
                      optionStyle = 'bg-slate-50/50 border-slate-200 text-slate-400';
                    }
                  }

                  const optionLetter = String.fromCharCode(65 + optIdx); // A, B, C, D

                  return (
                    <button
                      key={optIdx}
                      disabled={quizSubmitted}
                      onClick={() => handleSelectOption(optIdx)}
                      className={`w-full p-4 rounded-xl border text-left text-xs sm:text-sm flex items-center justify-between gap-3 transition-all cursor-pointer ${optionStyle}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                          isSelected ? 'bg-amber-600 text-white' : 'bg-white border border-slate-200 text-slate-600'
                        }`}>
                          {optionLetter}
                        </span>
                        <span className="leading-relaxed">{opt}</span>
                      </div>

                      {showResultState && isCorrect && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      )}
                      {showResultState && isSelected && !isCorrect && (
                        <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Hint Box */}
              {currentQ.conceptHint && (
                <div className="pt-2">
                  {showHint ? (
                    <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
                      <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold">Conceptual Hint: </span>
                        <span>{currentQ.conceptHint}</span>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowHint(true)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 hover:text-amber-900 transition-colors"
                    >
                      <Lightbulb className="w-4 h-4 text-amber-500" />
                      <span>Need a hint? Click to reveal</span>
                    </button>
                  )}
                </div>
              )}

              {/* Explanation (Shown when submitted) */}
              {quizSubmitted && currentQ.explanation && (
                <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-200 text-indigo-950 text-xs space-y-1">
                  <div className="font-bold flex items-center gap-1 text-indigo-800">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>EduGenie Solution & Concept Explanation:</span>
                  </div>
                  <p className="leading-relaxed text-slate-800">{currentQ.explanation}</p>
                </div>
              )}

              {/* Bottom Navigation Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  disabled={currentIndex === 0}
                  onClick={() => {
                    setCurrentIndex((prev) => prev - 1);
                    setShowHint(false);
                  }}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 transition-colors cursor-pointer"
                >
                  Previous
                </button>

                <div className="flex items-center gap-2">
                  {!isLastQuestion ? (
                    <button
                      onClick={() => {
                        setCurrentIndex((prev) => prev + 1);
                        setShowHint(false);
                      }}
                      className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span>Next</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : !quizSubmitted ? (
                    <button
                      onClick={handleSubmitQuiz}
                      disabled={answeredCount === 0}
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 text-white text-xs font-bold shadow-md shadow-emerald-200 transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Check className="w-4 h-4" />
                      <span>Submit Answers ({answeredCount}/{totalQ})</span>
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          )}

          {/* Results Summary Card after submission */}
          {quizSubmitted && (
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-md text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto shadow-xs">
                <Award className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-xl font-extrabold text-slate-900">
                  Quiz Completed!
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  You scored <span className="font-bold text-slate-900">{score} out of {totalQ}</span> ({Math.round((score / totalQ) * 100)}%)
                </p>
              </div>

              <div className="max-w-xs mx-auto p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
                {score === totalQ
                  ? '🌟 Perfect score! You have thoroughly mastered this topic.'
                  : score >= totalQ * 0.6
                  ? '👍 Solid effort! Review the detailed solutions above for any missed items.'
                  : '🌱 Good practice! Try reviewing this topic in the AI Tutor or check simpler explanations.'}
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => {
                    setSelectedAnswers({});
                    setQuizSubmitted(false);
                    setCurrentIndex(0);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors cursor-pointer"
                >
                  Retake This Quiz
                </button>
                <button
                  onClick={() => {
                    setQuestions([]);
                    setTopic('');
                  }}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                >
                  Create New Quiz
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
