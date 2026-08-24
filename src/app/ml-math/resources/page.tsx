import { MathResources } from '@/components/math/MathResources';
import { AppShell } from '@/components/shell/AppShell';
import { mathNavigation } from '@/content/navigation';

export default function MathResourcesPage() {
  return (
    <AppShell workspace="ML Math" title="Resources" navigation={mathNavigation} activePath="/ml-math/resources">
      <MathResources />
    </AppShell>
  );
}
