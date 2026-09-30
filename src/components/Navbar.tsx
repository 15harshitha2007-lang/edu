import React from 'react';
import { Sparkles, Flame, Globe, GraduationCap, Menu, X, BookOpen, Layers, HelpCircle, FileText, CalendarCheck, BarChart3, MessageSquare } from 'lucide-react';
import { StudentLevel, AppLanguage } from '../types';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  level: StudentLevel;
  setLevel: (level: StudentLevel) => void;
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;
  streakDays: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  level,
  setLevel,
  language,
  setLanguage,
  streakDays,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Layers },
    { id: 'chat', label: 'AI Tutor', icon: MessageSquare },
    { id: 'subjects', label: 'Subjects', icon: BookOpen },
    { id: 'summarize', label: 'Summarizer', icon: FileText },
    { id: 'quiz', label: 'Quiz Arena', icon: HelpCircle },
    { id: 'notes', label: 'Explain Notes', icon: Sparkles },
    { id: 'planner', label: 'Study Planner', icon: CalendarCheck },
    { id: 'progress', label: 'Progress', icon: BarChart3 },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div
            onClick={() => setCurrentTab('dashboard')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-indigo-700 via-violet-700 to-indigo-900 bg-clip-text text-transparent">
                  EduGenie
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700 border border-indigo-200">
                  Gemini AI
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block font-medium">
                Smart Learning Assistant
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100/70 p-1 rounded-xl border border-slate-200/60">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-white text-indigo-700 shadow-xs shadow-slate-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-600' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Controls: Level Selector, Language & Streak */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* Streak Badge */}
            <div
              title={`${streakDays} Day Learning Streak`}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold"
            >
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500 animate-pulse" />
              <span>{streakDays}d Streak</span>
            </div>

            {/* Student Level Dropdown */}
            <div className="relative flex items-center">
              <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
                <span className="pl-2 text-slate-500 flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span className="text-[11px] hidden md:inline font-medium">Level:</span>
                </span>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value as StudentLevel)}
                  className="bg-transparent font-semibold text-slate-800 py-1 pr-2 pl-1 rounded focus:outline-none cursor-pointer"
                >
                  <option value="Beginner">🌱 Beginner</option>
                  <option value="Intermediate">⚡ Intermediate</option>
                  <option value="Advanced">🚀 Advanced</option>
                </select>
              </div>
            </div>

            {/* Language Selector */}
            <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
              <span className="pl-2 text-slate-500 flex items-center gap-1">
                <Globe className="w-3.5 h-3.5" />
                <span className="text-[11px] hidden md:inline font-medium">Lang:</span>
              </span>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as AppLanguage)}
                className="bg-transparent font-semibold text-slate-800 py-1 pr-2 pl-1 rounded focus:outline-none cursor-pointer"
              >
                <option value="en">English (US)</option>
                <option value="ta">தமிழ் (Tamil)</option>
                <option value="bilingual">English + தமிழ்</option>
              </select>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-amber-50 text-amber-700 text-xs font-bold sm:hidden">
              <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>{streakDays}d</span>
            </div>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-3 shadow-lg">
          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold ${
                    isActive
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Mobile Preferences */}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-600">Knowledge Level:</span>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value as StudentLevel)}
                className="bg-slate-100 px-2 py-1 rounded border border-slate-200 text-xs font-semibold"
              >
                <option value="Beginner">🌱 Beginner</option>
                <option value="Intermediate">⚡ Intermediate</option>
                <option value="Advanced">🚀 Advanced</option>
              </select>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-600">Language:</span>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as AppLanguage)}
                className="bg-slate-100 px-2 py-1 rounded border border-slate-200 text-xs font-semibold"
              >
                <option value="en">English</option>
                <option value="ta">தமிழ் (Tamil)</option>
                <option value="bilingual">English + தமிழ்</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
