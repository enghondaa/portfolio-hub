import { notFound } from 'next/navigation';
import Link from 'next/link';
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
  const module = MODULE_MAP[moduleId];
  if (!module) return {};
  return { title: module.title, description: module.description };
}

export default async function ModulePage({ params }: Props) {
  const { moduleId } = await params;
  const module = MODULE_MAP[moduleId];
  if (!module) notFound();
  return <ModuleOverview module={module} />;
}
