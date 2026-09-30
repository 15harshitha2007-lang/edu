export type StudentLevel = 'Beginner' | 'Intermediate' | 'Advanced';
export type AppLanguage = 'en' | 'ta' | 'bilingual';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  subject?: string;
  level?: StudentLevel;
  language?: AppLanguage;
  actionRequested?: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  conceptHint?: string;
}

export interface QuizResult {
  id: string;
  topic: string;
  subject: string;
  score: number;
  total: number;
  percentage: number;
  date: string;
  level: StudentLevel;
}

export interface StudyPhase {
  phaseName: string;
  duration: string;
  focus: string;
  keyMilestones: string[];
}

export interface DailyScheduleItem {
  day: string;
  subject: string;
  topic: string;
  allocatedHours: string;
  tasks: string[];
  revisionTip: string;
  completed?: boolean;
}

export interface StudyPlan {
  title: string;
  overview: string;
  totalStudyHoursWeekly: number;
  phases: StudyPhase[];
  weeklySchedule: DailyScheduleItem[];
  goldenTips: string[];
  createdAt: string;
  examDate?: string;
}

export interface SubjectInfo {
  id: string;
  name: string;
  tamilName: string;
  iconName: string;
  description: string;
  color: string;
  bgLight: string;
  topics: string[];
  sampleQuestions: string[];
}
