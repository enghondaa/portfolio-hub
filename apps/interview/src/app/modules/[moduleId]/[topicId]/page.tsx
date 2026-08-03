import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { MODULE_MAP, MODULES } from '@/lib/modules';
import { getTopicContent } from '@/lib/content';
import type { ModuleId } from '@/types';
import TopicPage from '@/components/content/TopicPage';

interface Props {
  params: Promise<{ moduleId: string; topicId: string }>;
}

export async function generateStaticParams() {
  return MODULES.flatMap((m) =>
    m.topics.map((t) => ({ moduleId: m.id, topicId: t.id }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { moduleId, topicId } = await params;
  const module = MODULE_MAP[moduleId];
  if (!module) return {};
  const topic = module.topics.find((t) => t.id === topicId);
  if (!topic) return {};
  return {
    title: `${topic.title} — ${module.title}`,
    description: `Study ${topic.title} for your frontend interview. Estimated time: ${topic.estimatedTime}.`,
  };
}

export default async function TopicPageRoute({ params }: Props) {
  const { moduleId, topicId } = await params;
  const module = MODULE_MAP[moduleId];
  if (!module) notFound();

  const topicIndex = module.topics.findIndex((t) => t.id === topicId);
  if (topicIndex === -1) notFound();

  const content = getTopicContent(moduleId as ModuleId, topicId);
  if (!content) notFound();

  const prevTopic = topicIndex > 0 ? module.topics[topicIndex - 1] : null;
  const nextTopic = topicIndex < module.topics.length - 1 ? module.topics[topicIndex + 1] : null;

  return (
    <TopicPage
      topic={content}
      prevTopic={prevTopic ?? undefined}
      nextTopic={nextTopic ?? undefined}
    />
  );
}
