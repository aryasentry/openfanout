import { AppShell } from '@/components/shell/AppShell';
import { CourseSourceIndex } from '@/components/curriculum/CourseSourceIndex';
import { courseNavigation } from '@/content/navigation';
export const metadata = { title: 'System Design · openFanout' };
export default function SystemOverviewPage() {
  return <AppShell workspace="System Design" title="Overview" navigation={courseNavigation} activePath="/system/overview"><CourseSourceIndex courseId="system" /></AppShell>;
}
