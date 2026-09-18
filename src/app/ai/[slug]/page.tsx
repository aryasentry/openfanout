import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { DirectoryPage } from '@/components/directory/DirectoryPage';
import { EditorialPage } from '@/components/directory/EditorialPage';
import { GlossaryPage } from '@/components/directory/GlossaryPage';
import { RoadmapPage } from '@/components/roadmap/RoadmapPage';
import { AppShell } from '@/components/shell/AppShell';
import { directoryPages } from '@/content/external-resources';
import { editorialPageByRoute } from '@/content/editorial-pages';
import { aiNavigation } from '@/content/navigation';

const localRoutes = aiNavigation.flatMap((group) => group.items.map((item) => item.href))
  .filter((route) => route.startsWith('/ai/') && route !== '/ai/overview');

export const dynamicParams = false;

export function generateStaticParams() {
  return localRoutes.map((route) => ({ slug: route.split('/').at(-1)! }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const route = `/ai/${slug}`;
  return { title: directoryPages.get(route)?.title ?? editorialPageByRoute.get(route)?.title ?? (slug === 'glossary' ? 'AI glossary' : 'Page not found') };
}

export default async function AiWorkspacePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const route = `/ai/${slug}`;
  const directory = directoryPages.get(route);
  const editorial = editorialPageByRoute.get(route);
  const title = directory?.title ?? editorial?.title ?? (slug === 'glossary' ? 'Glossary' : null);
  if (!title) notFound();

  return (
    <AppShell workspace="AI" title={title} navigation={aiNavigation} activePath={route}>
      {slug === 'roadmap' ? <RoadmapPage /> : slug === 'glossary' ? <GlossaryPage /> : directory ? <DirectoryPage page={directory} /> : editorial ? <EditorialPage page={editorial} /> : null}
    </AppShell>
  );
}
