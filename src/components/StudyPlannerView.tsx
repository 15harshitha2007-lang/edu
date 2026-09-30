import React, { useState } from 'react';
import { 
  CalendarCheck, 
  Sparkles, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  Circle, 
  Download, 
  RefreshCw, 
  Flame, 
  Target, 
  BookOpen, 
  Layers,
  ArrowRight
} from 'lucide-react';
import { StudyPlan, StudentLevel, AppLanguage } from '../types';
import { SUBJECTS } from '../data/subjects';

interface StudyPlannerViewProps {
  level: StudentLevel;
  language: AppLanguage;
  onTopicCompleted?: (topic: string) => void;
}

export const StudyPlannerView: React.FC<StudyPlannerViewProps> = ({
  level,
  language,
  onTopicCompleted,
}) => {
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([
    'Mathematics & Calculus',
    'Computer Science Core',
  ]);
  const [examDate, setExamDate] = useState<string>('2026-11-20');
  const [hoursPerDay, setHoursPerDay] = useState<number>(3);
  const [daysPerWeek, setDaysPerWeek] = useState<number>(6);
  const [weakAreas, setWeakAreas] = useState<string>('Dynamic Programming, Integration by Parts, DBMS Normalization');
  const [targetGoal, setTargetGoal] = useState<string>('Score High Grade & Master Concepts');
  const [loading, setLoading] = useState<boolean>(false);
  const [plan, setPlan] = useState<StudyPlan | null>(() => {
    // Provide an initial realistic generated plan template
    return {
      title: 'EduGenie 30-Day Master Revision Roadmap',
      overview: 'Structured spaced-repetition plan balancing theoretical mastery with daily active recall problem solving. Prioritizes weaker algorithmic and mathematical concepts in the early phases.',
      totalStudyHoursWeekly: 18,
      phases: [
        {
          phaseName: 'Phase 1: Foundation & Conceptual Clarity',
          duration: 'Days 1 - 10',
          focus: 'Solidify fundamentals in Dynamic Programming, Memory Management, and Integrals.',
          keyMilestones: [
            'Complete all core textbook derivations',
            'Solve 15 beginner-to-intermediate exercises per subject',
            'Produce formula flashcard cheat sheets',
          ],
        },
        {
          phaseName: 'Phase 2: High-Intensity Problem Solving',
          duration: 'Days 11 - 22',
          focus: 'Timed practice exercises and past college semester papers.',
          keyMilestones: [
            'Simulate 3 timed practice quizzes',
            'Debug and analyze every error with EduGenie tutor',
            'Achieve >85% accuracy on core modules',
          ],
        },
        {
          phaseName: 'Phase 3: Final Consolidation & Mock Exams',
          duration: 'Days 23 - 30',
          focus: 'Active recall, flashcard review, and 5-minute pre-exam cram summaries.',
          keyMilestones: [
            'Review all marked tricky questions',
            'Conduct full-length simulated mock exam',
            'Mental relaxation and strategic pacing',
          ],
        },
      ],
      weeklySchedule: [
        {
          day: 'Monday',
          subject: 'Mathematics & Calculus',
          topic: 'Integration by Parts & Substitution Methods',
          allocatedHours: '3 Hours',
          tasks: [
            'Review LIATE rule and formula derivations (45m)',
            'Solve 5 medium-difficulty trigonometric integrals (60m)',
            'Take a 5-question EduGenie quiz to test accuracy (30m)',
          ],
          revisionTip: 'Always check your integral result by differentiating the solution back!',
          completed: false,
        },
        {
          day: 'Tuesday',
          subject: 'Computer Science Core',
          topic: 'Operating Systems: CPU Scheduling & Deadlocks',
          allocatedHours: '3 Hours',
          tasks: [
            'Diagram FCFS, SJF, and Round Robin Gantt charts (60m)',
            'Study Banker’s Algorithm safety state conditions (60m)',
            'Write bullet summaries of the 4 Deadlock conditions (30m)',
          ],
          revisionTip: 'Remember the 4 Deadlock conditions: Mutual Exclusion, Hold & Wait, No Preemption, Circular Wait.',
          completed: false,
        },
        {
          day: 'Wednesday',
          subject: 'Programming & Coding',
          topic: 'Dynamic Programming & Memoization',
          allocatedHours: '3 Hours',
          tasks: [
            'Trace recursive Fibonacci vs Memoized vs Bottom-Up Table (60m)',
            'Implement 0/1 Knapsack problem in code (75m)',
            'Review time & space complexity Big-O trade-offs (30m)',
          ],
          revisionTip: 'Look for overlapping subproblems and optimal substructure.',
          completed: false,
        },
        {
          day: 'Thursday',
          subject: 'Mathematics & Calculus',
          topic: 'Linear Algebra: Eigenvalues & Matrix Diagonalization',
          allocatedHours: '3 Hours',
          tasks: [
            'Compute characteristic equations det(A - λI) = 0 (60m)',
            'Find corresponding eigenvectors for distinct eigenvalues (60m)',
            'Connect eigenvalues to PCA and dimensionality reduction (30m)',
          ],
          revisionTip: 'The sum of eigenvalues always equals the trace of the matrix.',
          completed: false,
        },
        {
          day: 'Friday',
          subject: 'Computer Science Core',
          topic: 'DBMS: Normalization (1NF, 2NF, 3NF, BCNF)',
          allocatedHours: '3 Hours',
          tasks: [
            'Practice decomposing unnormalized tables to 3NF (75m)',
            'Verify functional dependencies and candidate keys (60m)',
            'Generate active recall flashcards in EduGenie Summarizer (30m)',
          ],
          revisionTip: 'Every non-key attribute must depend on the key, the whole key, and nothing but the key!',
          completed: false,
        },
        {
          day: 'Saturday',
          subject: 'Review & Mock Testing',
          topic: 'Weekly Cumulative Assessment & Mistake Analysis',
          allocatedHours: '3 Hours',
          tasks: [
            'Complete EduGenie 10-Question Quiz across all 3 subjects (45m)',
            'Review all incorrect answers in detail with AI Tutor (60m)',
            'Update personal formula sheet (45m)',
          ],
          revisionTip: 'Mistakes made during practice are the highest-retention learning moments.',
          completed: false,
        },
        {
          day: 'Sunday',
          subject: 'Rest & Strategic Preview',
          topic: 'Light Flashcard Review & Upcoming Week Setup',
          allocatedHours: '1 Hour',
          tasks: [
            'Review flashcards in 15-minute intervals (45m)',
            'Prepare study goals for the upcoming week (15m)',
          ],
          revisionTip: 'Quality sleep cements memory consolidation in the brain hippocampus.',
          completed: false,
        },
      ],
      goldenTips: [
        'Use the 50/10 Pomodoro Method: 50 minutes of deep focus followed by 10 minutes of screen-free relaxation.',
        'Prioritize active recall over passive reading: Always close the notes and try to re-derive formulas from scratch.',
        'Spaced Repetition: Re-test yourself on day 1, day 3, day 7, and day 14 to cement concepts permanently.',
        'If stuck on any problem, use EduGenie "Explain Simpler 🪄" to unlock the intuition before memorizing steps.',
      ],
      createdAt: new Date().toLocaleDateString(),
    };
  });

  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({});

  const handleToggleSubject = (subjectName: string) => {
    if (selectedSubjects.includes(subjectName)) {
      if (selectedSubjects.length > 1) {
        setSelectedSubjects(selectedSubjects.filter((s) => s !== subjectName));
      }
    } else {
      setSelectedSubjects([...selectedSubjects, subjectName]);
    }
  };

  const handleGeneratePlan = async () => {
    if (selectedSubjects.length === 0 || loading) return;

    setLoading(true);

    try {
      const res = await fetch('/api/study-planner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subjects: selectedSubjects,
          examDate,
          hoursPerDay,
          daysPerWeek,
          currentLevel: level,
          weakAreas,
          targetGoal,
          language,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate study plan');

      setPlan({
        ...data,
        createdAt: new Date().toLocaleDateString(),
      });
      setCompletedTasks({});

      if (onTopicCompleted) {
        onTopicCompleted(`Generated Study Roadmap: ${selectedSubjects.join(', ')}`);
      }
    } catch (err: any) {
      console.error(err);
      alert(`Error generating plan: ${err.message || 'Please check connection'}`);
    } finally {
      setLoading(false);
    }
  };

  const toggleTask = (taskKey: string) => {
    setCompletedTasks((prev) => ({
      ...prev,
      [taskKey]: !prev[taskKey],
    }));
  };

  const handleDownloadPlan = () => {
    if (!plan) return;
    const textContent = `
========================================
${plan.title}
========================================
Generated by EduGenie – Google Gemini Powered Learning Assistant
Date Created: ${plan.createdAt}
Target Exam Date: ${examDate}
Weekly Study Hours: ${plan.totalStudyHoursWeekly}h
Student Level: ${level}

OVERVIEW:
${plan.overview}

PHASES:
${plan.phases.map((p) => `\n* ${p.phaseName} (${p.duration})\n  Focus: ${p.focus}\n  Milestones:\n  - ${p.keyMilestones.join('\n  - ')}`).join('\n')}

WEEKLY SCHEDULE:
${plan.weeklySchedule.map((d) => `\n[${d.day}] - ${d.subject}: ${d.topic} (${d.allocatedHours})\nTasks:\n${d.tasks.map((t) => ` [ ] ${t}`).join('\n')}\nTip: ${d.revisionTip}`).join('\n')}

GOLDEN STUDY HABITS:
${plan.goldenTips.map((tip, i) => `${i + 1}. ${tip}`).join('\n')}
========================================
    `.trim();

    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `EduGenie_Study_Plan_${examDate}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-rose-900 via-indigo-900 to-slate-900 p-6 sm:p-8 text-white shadow-lg">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-rose-200 text-xs font-semibold mb-3">
            <CalendarCheck className="w-3.5 h-3.5" />
            <span>AI Personalized Revision Timetable</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Personalized Study Planner & Schedule
          </h1>
          <p className="mt-2 text-rose-100 text-xs sm:text-sm leading-relaxed">
            Eliminate exam anxiety. Input your target subjects, test deadlines, and daily available hours. EduGenie builds an actionable, phase-by-phase schedule complete with task checklists and spaced repetition.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Plan Configuration Drawer */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Target className="w-4 h-4 text-rose-600" />
              <h3 className="text-sm font-bold text-slate-900">Configure Study Schedule</h3>
            </div>

            {/* Select Subjects */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Target Subjects:
              </label>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {SUBJECTS.map((s) => {
                  const isChecked = selectedSubjects.includes(s.name);
                  return (
                    <div
                      key={s.id}
                      onClick={() => handleToggleSubject(s.name)}
                      className={`p-2 rounded-xl border text-xs font-medium flex items-center justify-between cursor-pointer transition-colors ${
                        isChecked
                          ? 'bg-rose-50/70 border-rose-400 text-rose-950 font-semibold'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <span className="truncate">{s.name}</span>
                      <div className={`w-4 h-4 rounded flex items-center justify-center ${
                        isChecked ? 'bg-rose-600 text-white' : 'border border-slate-300'
                      }`}>
                        {isChecked && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Target Exam Date */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                <span>Target Exam / Deadline Date:</span>
              </label>
              <input
                type="date"
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            {/* Daily Hours Slider */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold text-slate-700 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  Available Hours per Day:
                </span>
                <span className="font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                  {hoursPerDay} Hours / Day
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={8}
                value={hoursPerDay}
                onChange={(e) => setHoursPerDay(Number(e.target.value))}
                className="w-full accent-rose-600 cursor-pointer"
              />
            </div>

            {/* Days per Week */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold text-slate-700">Days per Week:</span>
                <span className="font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                  {daysPerWeek} Days
                </span>
              </div>
              <input
                type="range"
                min={3}
                max={7}
                value={daysPerWeek}
                onChange={(e) => setDaysPerWeek(Number(e.target.value))}
                className="w-full accent-rose-600 cursor-pointer"
              />
            </div>

            {/* Weak Areas */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Weak Topics / Difficult Areas:
              </label>
              <textarea
                value={weakAreas}
                onChange={(e) => setWeakAreas(e.target.value)}
                rows={2}
                placeholder="e.g. Dynamic Programming, Normalization, Calculus Proofs..."
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            {/* Submit Button */}
            <button
              onClick={handleGeneratePlan}
              disabled={loading || selectedSubjects.length === 0}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-700 hover:to-indigo-700 disabled:opacity-50 text-white font-bold text-sm shadow-md shadow-rose-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Genie is constructing plan...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Customized Plan</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Generated Plan View */}
        <div className="lg:col-span-8 space-y-4">
          {plan ? (
            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-6">
              {/* Plan Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold uppercase">
                      Active Plan
                    </span>
                    <span className="text-xs text-slate-400">Target: {examDate}</span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                    {plan.title}
                  </h2>
                </div>

                <button
                  onClick={handleDownloadPlan}
                  className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Plan (.txt)</span>
                </button>
              </div>

              {/* Strategy Overview */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed">
                <span className="font-bold text-slate-900">Strategy Overview: </span>
                {plan.overview}
              </div>

              {/* Phases Breakdown */}
              {plan.phases && plan.phases.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                    Preparation Phases & Key Milestones
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {plan.phases.map((phase, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-700 font-bold text-xs flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <span className="text-[11px] font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                            {phase.duration}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-900">{phase.phaseName}</h4>
                        <p className="text-[11px] text-slate-500 leading-relaxed">{phase.focus}</p>
                        <div className="pt-2 border-t border-slate-100 space-y-1">
                          {phase.keyMilestones.map((m, mIdx) => (
                            <div key={mIdx} className="text-[10px] text-slate-600 flex items-start gap-1.5">
                              <span className="text-indigo-500 font-bold">•</span>
                              <span>{m}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Day-by-Day Timetable Checklist */}
              {plan.weeklySchedule && plan.weeklySchedule.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                    Actionable Weekly Timetable & Daily Checklists
                  </h3>
                  <div className="space-y-3">
                    {plan.weeklySchedule.map((item, dIdx) => (
                      <div
                        key={dIdx}
                        className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs space-y-2.5"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-100">
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-1 rounded-lg bg-slate-900 text-white font-bold text-xs">
                              {item.day}
                            </span>
                            <span className="text-xs font-bold text-indigo-700">
                              {item.subject}
                            </span>
                            <span className="text-slate-300">•</span>
                            <span className="text-xs text-slate-600 font-medium">
                              {item.topic}
                            </span>
                          </div>
                          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                            {item.allocatedHours}
                          </span>
                        </div>

                        {/* Checklist items */}
                        <div className="space-y-1.5">
                          {item.tasks.map((task, tIdx) => {
                            const taskKey = `${dIdx}-${tIdx}`;
                            const isDone = completedTasks[taskKey];
                            return (
                              <div
                                key={tIdx}
                                onClick={() => toggleTask(taskKey)}
                                className={`p-2 rounded-lg text-xs flex items-center justify-between cursor-pointer transition-colors ${
                                  isDone
                                    ? 'bg-emerald-50 text-emerald-900 line-through'
                                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
                                }`}
                              >
                                <div className="flex items-center gap-2.5">
                                  {isDone ? (
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                  ) : (
                                    <Circle className="w-4 h-4 text-slate-400 shrink-0" />
                                  )}
                                  <span>{task}</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Pro Revision Tip */}
                        {item.revisionTip && (
                          <div className="text-[11px] text-slate-500 italic bg-amber-50/50 p-2 rounded-lg border border-amber-100">
                            💡 <span className="font-semibold text-slate-700">Pro Tip: </span>
                            {item.revisionTip}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Golden Study Habits */}
              {plan.goldenTips && plan.goldenTips.length > 0 && (
                <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-100 space-y-2">
                  <h4 className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
                    <span>Evidence-Based High Yield Study Habits</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-indigo-950">
                    {plan.goldenTips.map((tip, idx) => (
                      <div key={idx} className="flex items-start gap-1.5 leading-relaxed">
                        <span className="text-indigo-600 font-bold shrink-0">{idx + 1}.</span>
                        <span>{tip}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="h-96 flex flex-col items-center justify-center p-8 bg-white rounded-2xl border border-slate-200 text-center text-slate-400">
              <CalendarCheck className="w-12 h-12 mb-3 text-slate-300" />
              <h4 className="text-sm font-bold text-slate-700">Ready to build your roadmap</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-sm">
                Select your target subjects and exam deadline on the left, then click "Generate Customized Plan".
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
