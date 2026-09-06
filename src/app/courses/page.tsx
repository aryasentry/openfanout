import { AppShell } from '@/components/shell/AppShell';
import { CourseSourceIndex } from '@/components/curriculum/CourseSourceIndex';
import { courseNavigation } from '@/content/navigation';
export const metadata = { title: 'All courses · openFanout' };
export default function CoursesPage() {
  return <AppShell workspace="Courses" title="All courses" navigation={courseNavigation} activePath="/courses"><CourseSourceIndex /></AppShell>;
}
