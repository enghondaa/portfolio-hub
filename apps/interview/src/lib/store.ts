'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ProgressState } from '@/types';

interface ProgressStore extends ProgressState {
  toggleTopicComplete: (topicId: string) => void;
  setConfidenceRating: (topicId: string, rating: number) => void;
  markStudied: (topicId: string) => void;
  toggleStudyMode: () => void;
  getModuleProgress: (moduleId: string, topicIds: string[]) => number;
  getWeakAreas: () => string[];
  setLanguage: (lang: 'en' | 'ar') => void;
}

export const useProgressStore = create<ProgressStore>()(
  persist(
    (set, get) => ({
      completedTopics: {},
      confidenceRatings: {},
      lastStudied: {},
      studyMode: false,
      language: 'en',

      toggleTopicComplete: (topicId) =>
        set((state) => ({
          completedTopics: {
            ...state.completedTopics,
            [topicId]: !state.completedTopics[topicId],
          },
        })),

      setConfidenceRating: (topicId, rating) =>
        set((state) => ({
          confidenceRatings: { ...state.confidenceRatings, [topicId]: rating },
        })),

      markStudied: (topicId) =>
        set((state) => ({
          lastStudied: { ...state.lastStudied, [topicId]: new Date().toISOString() },
        })),

      toggleStudyMode: () =>
        set((state) => ({ studyMode: !state.studyMode })),

      setLanguage: (lang) =>
        set(() => ({ language: lang })),

      getModuleProgress: (moduleId, topicIds) => {
        const { completedTopics } = get();
        if (topicIds.length === 0) return 0;
        const completed = topicIds.filter((id) => completedTopics[`${moduleId}/${id}`]).length;
        return Math.round((completed / topicIds.length) * 100);
      },

      getWeakAreas: () => {
        const { confidenceRatings } = get();
        return Object.entries(confidenceRatings)
          .filter(([, rating]) => rating <= 2)
          .map(([topicId]) => topicId);
      },
    }),
    {
      name: 'interview-study-progress',
    }
  )
);
