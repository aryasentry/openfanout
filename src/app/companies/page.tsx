import { notFound } from 'next/navigation';
import { DirectoryPage } from '@/components/directory/DirectoryPage';
import { AppShell } from '@/components/shell/AppShell';
import { directoryPages } from '@/content/external-resources';
import { aiNavigation } from '@/content/navigation';

export default function CompaniesPage() {
  const page = directoryPages.get('/companies');
  if (!page) notFound();
  return <AppShell workspace="AI" title="Companies and startups" navigation={aiNavigation} activePath="/companies"><DirectoryPage page={page} /></AppShell>;
}
