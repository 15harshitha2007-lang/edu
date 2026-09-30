/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { ChatView } from './components/ChatView';
import { SubjectHubView } from './components/SubjectHubView';
import { SummarizerView } from './components/SummarizerView';
import { QuizView } from './components/QuizView';
import { ExplainNotesView } from './components/ExplainNotesView';
import { StudyPlannerView } from './components/StudyPlannerView';
import { ProgressView } from './components/ProgressView';
import { StudentLevel, AppLanguage, QuizResult } from './types';
import { Sparkles, Heart } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  
  // Student personalized level: Beginner, Intermediate, Advanced
  const [level, setLevel] = useState<StudentLevel>(() => {
    return (localStorage.getItem('edugenie_level') as StudentLevel) || 'Intermediate';
  });

  // Multilingual preference: English, Tamil, Bilingual
  const [language, setLanguage] = useState<AppLanguage>(() => {
    return (localStorage.getItem('edugenie_language') as AppLanguage) || 'en';
  });

  // Learning streak
  const [streakDays, setStreakDays] = useState<number>(() => {
    const saved = localStorage.getItem('edugenie_streak');
    return saved ? parseInt(saved, 10) : 5;
  });

  // Completed Topics
  const [completedTopics, setCompletedTopics] = useState<string[]>(() => {
    const saved = localStorage.getItem('edugenie_topics');
    return saved
      ? JSON.parse(saved)
      : [
          'Recursion & Tree Traversals',
          'Integration by Parts & Calculus',
          'OS CPU Scheduling Algorithms',
          'Neural Networks & Backprop',
        ];
  });

  // Quiz History
  const [quizHistory, setQuizHistory] = useState<QuizResult[]>(() => {
    const saved = localStorage.getItem('edugenie_quizzes');
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 'quiz-init-1',
            topic: 'Operating Systems CPU Scheduling',
            subject: 'Computer Science Core',
            score: 4,
            total: 5,
            percentage: 80,
            date: 'Sep 27, 2026',
            level: 'Intermediate',
          },
          {
            id: 'quiz-init-2',
            topic: 'Object-Oriented Programming (Polymorphism)',
            subject: 'Programming & Coding',
            score: 5,
            total: 5,
            percentage: 100,
            date: 'Sep 28, 2026',
            level: 'Intermediate',
          },
        ];
  });

  // Context passing for cross-tab navigation
  const [chatInitialPrompt, setChatInitialPrompt] = useState<string>('');
  const [chatInitialSubject, setChatInitialSubject] = useState<string>('General Academic');
  const [quizInitialTopic, setQuizInitialTopic] = useState<string>('');
  const [quizInitialSubject, setQuizInitialSubject] = useState<string>('Computer Science Core');
  const [quizInitialMaterial, setQuizInitialMaterial] = useState<string>('');
  const [summarizeInitialSubject, setSummarizeInitialSubject] = useState<string>('Computer Science');

  // Persistence effects
  useEffect(() => {
    localStorage.setItem('edugenie_level', level);
  }, [level]);

  useEffect(() => {
    localStorage.setItem('edugenie_language', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('edugenie_streak', streakDays.toString());
  }, [streakDays]);

  useEffect(() => {
    localStorage.setItem('edugenie_topics', JSON.stringify(completedTopics));
  }, [completedTopics]);

  useEffect(() => {
    localStorage.setItem('edugenie_quizzes', JSON.stringify(quizHistory));
  }, [quizHistory]);

  const handleNavigate = (tab: string, extraData?: any) => {
    if (tab === 'chat' && extraData) {
      if (extraData.initialPrompt) setChatInitialPrompt(extraData.initialPrompt);
      if (extraData.subject) setChatInitialSubject(extraData.subject);
    }
    if (tab === 'quiz' && extraData) {
      if (extraData.topic) setQuizInitialTopic(extraData.topic);
      if (extraData.subject) setQuizInitialSubject(extraData.subject);
      if (extraData.material) setQuizInitialMaterial(extraData.material);
    }
    if (tab === 'summarize' && extraData?.subject) {
      setSummarizeInitialSubject(extraData.subject);
    }
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTopicCompleted = (topicName: string) => {
    if (!completedTopics.includes(topicName)) {
      setCompletedTopics((prev) => [topicName, ...prev]);
    }
  };

  const handleQuizFinished = (result: QuizResult) => {
    setQuizHistory((prev) => [result, ...prev]);
    handleTopicCompleted(`Quiz: ${result.topic}`);
  };

  const handleClearHistory = () => {
    if (window.confirm('Reset all quiz history and completed topics?')) {
      setQuizHistory([]);
      setCompletedTopics([]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={(tab) => {
          setChatInitialPrompt('');
          setCurrentTab(tab);
        }}
        level={level}
        setLevel={setLevel}
        language={language}
        setLanguage={setLanguage}
        streakDays={streakDays}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12">
        {currentTab === 'dashboard' && (
          <DashboardView
            onNavigate={handleNavigate}
            level={level}
            language={language}
            streakDays={streakDays}
            quizHistory={quizHistory}
            completedTopicsCount={completedTopics.length}
          />
        )}

        {currentTab === 'chat' && (
          <ChatView
            level={level}
            setLevel={setLevel}
            language={language}
            setLanguage={setLanguage}
            initialPrompt={chatInitialPrompt}
            initialSubject={chatInitialSubject}
            onNavigateToQuiz={(topic, subject) =>
              handleNavigate('quiz', { topic, subject })
            }
            onTopicCompleted={handleTopicCompleted}
          />
        )}

        {currentTab === 'subjects' && (
          <SubjectHubView
            onNavigateToChat={(subject, prompt) =>
              handleNavigate('chat', { subject, initialPrompt: prompt })
            }
            onNavigateToQuiz={(topic, subject) =>
              handleNavigate('quiz', { topic, subject })
            }
            onNavigateToSummarize={(subject) =>
              handleNavigate('summarize', { subject })
            }
            level={level}
            language={language}
          />
        )}

        {currentTab === 'summarize' && (
          <SummarizerView
            level={level}
            language={language}
            initialSubject={summarizeInitialSubject}
            onNavigateToQuiz={(topic, material) =>
              handleNavigate('quiz', { topic, material })
            }
            onTopicCompleted={handleTopicCompleted}
          />
        )}

        {currentTab === 'quiz' && (
          <QuizView
            level={level}
            language={language}
            initialTopic={quizInitialTopic}
            initialSubject={quizInitialSubject}
            initialMaterial={quizInitialMaterial}
            onQuizFinished={handleQuizFinished}
          />
        )}

        {currentTab === 'notes' && (
          <ExplainNotesView
            level={level}
            language={language}
            onNavigateToChat={(subject, prompt) =>
              handleNavigate('chat', { subject, initialPrompt: prompt })
            }
            onTopicCompleted={handleTopicCompleted}
          />
        )}

        {currentTab === 'planner' && (
          <StudyPlannerView
            level={level}
            language={language}
            onTopicCompleted={handleTopicCompleted}
          />
        )}

        {currentTab === 'progress' && (
          <ProgressView
            quizHistory={quizHistory}
            completedTopics={completedTopics}
            streakDays={streakDays}
            onRetakeQuiz={(topic, subject) =>
              handleNavigate('quiz', { topic, subject })
            }
            onClearHistory={handleClearHistory}
            onReviseTopic={(topic) =>
              handleNavigate('chat', { initialPrompt: `Let's revise ${topic} step by step with practice exercises.` })
            }
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-indigo-600 flex items-center justify-center text-white">
              <Sparkles className="w-3 h-3" />
            </div>
            <span className="font-bold text-slate-800">EduGenie</span>
            <span>– Google Gemini Powered Learning Assistant</span>
          </div>

          <div className="flex items-center gap-4 text-slate-600">
            <span>Levels: Beginner • Intermediate • Advanced</span>
            <span>•</span>
            <span>Languages: English • தமிழ் (Tamil)</span>
          </div>

          <div className="text-[11px] text-slate-400">
            Designed for college & school students worldwide
          </div>
        </div>
      </footer>
    </div>
  );
}
