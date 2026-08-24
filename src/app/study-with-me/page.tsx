import { notFound } from 'next/navigation';
import { DirectoryPage } from '@/components/directory/DirectoryPage';
import { AppShell } from '@/components/shell/AppShell';
import { directoryPages } from '@/content/external-resources';
import { aiNavigation } from '@/content/navigation';

export default function StudyWithMePage() {
  const page = directoryPages.get('/study-with-me');
  if (!page) notFound();
  return <AppShell workspace="AI" title="Study with me" navigation={aiNavigation} activePath="/study-with-me"><DirectoryPage page={page} /></AppShell>;
}
