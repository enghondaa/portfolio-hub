import { ALL_CONTENT } from './content/index';
import { MODULES } from './modules';
import type { SearchResult } from '@/types';

interface SearchIndex {
  topicId: string;
  moduleId: string;
  topicTitle: string;
  moduleTitle: string;
  text: string;
  type: 'title' | 'content' | 'question';
  snippet: string;
}

// Build search index from all content
const buildIndex = (): SearchIndex[] => {
  const moduleMap = Object.fromEntries(MODULES.map((m) => [m.id, m.title]));
  const index: SearchIndex[] = [];

  for (const topic of ALL_CONTENT) {
    const moduleTitle = moduleMap[topic.moduleId] ?? topic.moduleId;

    // Index title
    index.push({
      topicId: topic.id,
      moduleId: topic.moduleId,
      topicTitle: topic.title,
      moduleTitle,
      text: topic.title.toLowerCase(),
      type: 'title',
      snippet: topic.description,
    });

    // Index section content
    for (const section of topic.sections) {
      index.push({
        topicId: topic.id,
        moduleId: topic.moduleId,
        topicTitle: topic.title,
        moduleTitle,
        text: (section.title + ' ' + section.content).toLowerCase(),
        type: 'content',
        snippet: section.title,
      });
    }

    // Index interview questions
    for (const q of topic.interviewQuestions) {
      index.push({
        topicId: topic.id,
        moduleId: topic.moduleId,
        topicTitle: topic.title,
        moduleTitle,
        text: q.question.toLowerCase(),
        type: 'question',
        snippet: q.question.slice(0, 100),
      });
    }

    // Index code example titles and explanations
    for (const ex of topic.codeExamples) {
      index.push({
        topicId: topic.id,
        moduleId: topic.moduleId,
        topicTitle: topic.title,
        moduleTitle,
        text: (ex.title + ' ' + (ex.explanation ?? '')).toLowerCase(),
        type: 'content',
        snippet: ex.title,
      });
    }
  }

  return index;
};

const INDEX = buildIndex();

export function search(query: string, limit = 20): SearchResult[] {
  if (!query || query.trim().length < 2) return [];

  const terms = query.toLowerCase().trim().split(/\s+/);
  const seen = new Set<string>();
  const results: SearchResult[] = [];

  // Score each index entry
  const scored = INDEX.map((entry) => {
    let score = 0;
    for (const term of terms) {
      if (entry.text.includes(term)) {
        score += entry.type === 'title' ? 3 : entry.type === 'question' ? 2 : 1;
        if (entry.text.startsWith(term)) score += 2;
      }
    }
    return { entry, score };
  }).filter(({ score }) => score > 0);

  // Sort by score descending
  scored.sort((a, b) => b.score - a.score);

  for (const { entry } of scored) {
    const key = `${entry.moduleId}/${entry.topicId}/${entry.type}`;
    if (seen.has(key)) continue;
    seen.add(key);

    results.push({
      topicId: entry.topicId,
      moduleId: entry.moduleId as any,
      topicTitle: entry.topicTitle,
      moduleTitle: entry.moduleTitle,
      matchType: entry.type,
      snippet: entry.snippet,
    });

    if (results.length >= limit) break;
  }

  return results;
}
