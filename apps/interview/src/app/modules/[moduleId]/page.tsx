// `module` is a reserved identifier in Next's lint rules: it collides with
// CommonJS's module object and the bundler flags any binding that shadows it.
// Renamed to `mod`, which is what the client components already use.
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { MODULE_MAP, MODULES } from '@/lib/modules';
import ModuleOverview from './ModuleOverview';

interface Props {
  params: Promise<{ moduleId: string }>;
}

export async function generateStaticParams() {
  return MODULES.map((m) => ({ moduleId: m.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { moduleId } = await params;
  const mod = MODULE_MAP[moduleId];
  if (!mod) return {};
  return { title: mod.title, description: mod.description };
}

export default async function ModulePage({ params }: Props) {
  const { moduleId } = await params;
  const mod = MODULE_MAP[moduleId];
  if (!mod) notFound();
  return <ModuleOverview module={mod} />;
}
