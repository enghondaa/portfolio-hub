export type ModuleId =
  | 'javascript'
  | 'react'
  | 'nextjs'
  | 'typescript'
  | 'system-design'
  | 'performance'
  | 'testing'
  | 'behavioral'
  | 'coding-challenges'
  | 'git'
  | 'graphql';

export interface CodeExample {
  title: string;
  code: string;
  language: string;
  explanation?: string;
  runnable?: boolean;
}

export interface InterviewQuestion {
  question: string;
  answer: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

export interface Gotcha {
  title: string;
  description: string;
  example?: string;
}

export interface TopicContent {
  id: string;
  moduleId: ModuleId;
  title: string;
  description: string;
  estimatedTime: string;
  sections: ContentSection[];
  codeExamples: CodeExample[];
  interviewQuestions: InterviewQuestion[];
  gotchas?: Gotcha[];
}

export interface ContentSection {
  title: string;
  content: string; // markdown
}

export interface ModuleInfo {
  id: ModuleId;
  title: string;
  description: string;
  icon: string;
  color: string;
  topics: TopicMeta[];
}

export interface TopicMeta {
  id: string;
  title: string;
  estimatedTime: string;
  moduleId: ModuleId;
}

export interface ProgressState {
  completedTopics: Record<string, boolean>;
  confidenceRatings: Record<string, number>; // 1-5
  lastStudied: Record<string, string>; // ISO date string
  studyMode: boolean;
  language: 'en' | 'ar';
}

export interface SearchResult {
  topicId: string;
  moduleId: ModuleId;
  topicTitle: string;
  moduleTitle: string;
  matchType: 'title' | 'content' | 'question';
  snippet: string;
}
