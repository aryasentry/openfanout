import { AppShell } from '../../components/shell/AppShell';
import { aiNavigation } from '../../content/navigation';
import { SearchPageClient } from './SearchPageClient';

export const metadata = { title: 'Search' };

export default function SearchPage() {
  return (
    <AppShell workspace="AI" title="Search" navigation={aiNavigation} activePath="/search">
      <SearchPageClient />
    </AppShell>
  );
}
