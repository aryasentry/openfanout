import { DailyArchive } from '@/components/daily/DailyArchive';
import { AppShell } from '@/components/shell/AppShell';
import { dailyNavigation } from '@/content/navigation';

export default function DailyArchivePage() {
  return <AppShell workspace="Daily" title="Archive" navigation={dailyNavigation} activePath="/daily"><DailyArchive /></AppShell>;
}
