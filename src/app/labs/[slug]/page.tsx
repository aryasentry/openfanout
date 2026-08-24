import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { LabWorkbenchRoute } from '@/components/labs/LabWorkbenchRoute';
import { AppShell } from '@/components/shell/AppShell';
import { labBySlug, labs } from '@/content/labs';
import { labNavigation } from '@/content/navigation';

export const dynamicParams = false;
export function generateStaticParams() { return labs.map((lab) => ({ slug: lab.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return { title: labBySlug.get(slug)?.title ?? 'Lab not found' };
}

export default async function LabPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lab = labBySlug.get(slug);
  if (!lab) notFound();
  return <AppShell workspace="Labs" title={lab.title} navigation={labNavigation} activePath={lab.route}><LabWorkbenchRoute slug={slug} /></AppShell>;
}
