import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { DailyPaperReader } from '@/components/daily/DailyPaperReader';
import { AppShell } from '@/components/shell/AppShell';
import { dailyPaperBySlug, dailyPapers, getDailyPaperNeighbors } from '@/content/daily-papers';
import { dailyNavigation } from '@/content/navigation';

export const dynamicParams = false;
export function generateStaticParams() { return dailyPapers.map((paper) => ({ slug: paper.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return { title: dailyPaperBySlug.get(slug)?.title ?? 'Paper not found' };
}

export default async function DailyPaperPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const paper = dailyPaperBySlug.get(slug);
  if (!paper) notFound();
  return <AppShell workspace="Daily" title={paper.title} navigation={dailyNavigation} activePath={paper.route}><DailyPaperReader paper={paper} neighbors={getDailyPaperNeighbors(slug)} /></AppShell>;
}
