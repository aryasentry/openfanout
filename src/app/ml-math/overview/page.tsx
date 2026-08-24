import { MathOverview } from '@/components/math/MathOverview';
import { AppShell } from '@/components/shell/AppShell';
import { mathNavigation } from '@/content/navigation';

export default function MathOverviewPage() {
  return (
    <AppShell workspace="ML Math" title="Overview" navigation={mathNavigation} activePath="/ml-math/overview">
      <MathOverview />
    </AppShell>
  );
}
