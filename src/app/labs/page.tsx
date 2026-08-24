import { LabsCatalog } from '@/components/labs/LabsCatalog';
import { AppShell } from '@/components/shell/AppShell';
import { labNavigation } from '@/content/navigation';

export default function LabsPage() {
  return <AppShell workspace="Labs" title="Catalog" navigation={labNavigation} activePath="/labs"><LabsCatalog /></AppShell>;
}
