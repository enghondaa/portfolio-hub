// `module` is a reserved identifier in Next's lint rules: it collides with
// CommonJS's module object and the bundler flags any binding that shadows it.
// Renamed to `mod`, which is what the client components already use.
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
  const mod = MODULE_MAP[moduleId];
  if (!mod) return {};
  const topic = mod.topics.find((t) => t.id === topicId);
  if (!topic) return {};
  return {
    title: `${topic.title} — ${mod.title}`,
    description: `Study ${topic.title} for your frontend interview. Estimated time: ${topic.estimatedTime}.`,
  };
}

export default async function TopicPageRoute({ params }: Props) {
  const { moduleId, topicId } = await params;
  const mod = MODULE_MAP[moduleId];
  if (!mod) notFound();

  const topicIndex = mod.topics.findIndex((t) => t.id === topicId);
  if (topicIndex === -1) notFound();

  const content = getTopicContent(moduleId as ModuleId, topicId);
  if (!content) notFound();

  const prevTopic = topicIndex > 0 ? mod.topics[topicIndex - 1] : null;
  const nextTopic = topicIndex < mod.topics.length - 1 ? mod.topics[topicIndex + 1] : null;

  return (
    <TopicPage
      topic={content}
      prevTopic={prevTopic ?? undefined}
      nextTopic={nextTopic ?? undefined}
    />
  );
}
