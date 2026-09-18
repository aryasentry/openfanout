import { RoadmapPage } from '@/components/roadmap/RoadmapPage';
import { AppShell } from '@/components/shell/AppShell';
import { aiNavigation } from '@/content/navigation';

export const metadata = { title: 'Learning roadmaps' };
export default function RoadmapRoute() {
  return <AppShell workspace="AI" title="Roadmaps" navigation={aiNavigation} activePath="/ai/roadmap"><RoadmapPage /></AppShell>;
}
