import { AppShell } from '@/components/shell/AppShell';
import { CurriculumOverview } from '@/components/curriculum/CurriculumOverview';
import { aiNavigation } from '@/content/navigation';

export default function AiOverviewPage() {
  return (
    <AppShell workspace="AI" title="Overview" navigation={aiNavigation} activePath="/ai/overview">
      <CurriculumOverview />
    </AppShell>
  );
}
