import { javascriptContent } from './javascript';
import { reactContent } from './react';
import { nextjsContent } from './nextjs';
import { typescriptContent } from './typescript';
import {
  systemDesignContent,
  performanceContent,
  testingContent,
  behavioralContent,
  codingChallengesContent,
} from './other-modules';
import { gitContent } from './git';
import { graphqlContent } from './graphql';
import { arabicContent } from './arabicContent';
import type { TopicContent, ModuleId } from '@/types';

export const ALL_CONTENT: TopicContent[] = [
  ...javascriptContent,
  ...reactContent,
  ...nextjsContent,
  ...typescriptContent,
  ...systemDesignContent,
  ...performanceContent,
  ...testingContent,
  ...behavioralContent,
  ...codingChallengesContent,
  ...gitContent,
  ...graphqlContent,
];

export const CONTENT_MAP: Record<string, TopicContent> = Object.fromEntries(
  ALL_CONTENT.map((topic) => [`${topic.moduleId}/${topic.id}`, topic])
);

export const ARABIC_CONTENT_MAP: Record<string, TopicContent> = Object.fromEntries(
  arabicContent.map((topic) => [`${topic.moduleId}/${topic.id}`, topic])
);

export function getTopicContent(
  moduleId: ModuleId,
  topicId: string,
  language: 'en' | 'ar' = 'en'
): TopicContent | undefined {
  if (language === 'ar') {
    return ARABIC_CONTENT_MAP[`${moduleId}/${topicId}`] || CONTENT_MAP[`${moduleId}/${topicId}`];
  }
  return CONTENT_MAP[`${moduleId}/${topicId}`];
}

export function getModuleContent(moduleId: ModuleId): TopicContent[] {
  return ALL_CONTENT.filter((topic) => topic.moduleId === moduleId);
}

// All interview questions for mock interview mode
export const ALL_INTERVIEW_QUESTIONS = ALL_CONTENT.flatMap((topic) =>
  topic.interviewQuestions.map((q) => ({
    ...q,
    topicId: topic.id,
    topicTitle: topic.title,
    moduleId: topic.moduleId,
  }))
);

/**
 * Whether a topic has a real Arabic translation, as opposed to falling back to
 * English. getTopicContent falls back silently, which is right for rendering
 * but wrong for the reader: switching to Arabic and seeing English looks like
 * the toggle is broken rather than like the translation is missing. The UI uses
 * this to say so.
 */
export function hasArabicContent(moduleId: ModuleId, topicId: string): boolean {
  return Boolean(ARABIC_CONTENT_MAP[`${moduleId}/${topicId}`]);
}
