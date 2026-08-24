import Link from 'next/link';
import {
  BadgeHelp,
  BookOpen,
  Brain,
  BriefcaseBusiness,
  Building2,
  ChartNoAxesCombined,
  Code2,
  Cpu,
  FileText,
  Files,
  GraduationCap,
  House,
  Library,
  Mail,
  Map,
  Microchip,
  Network,
  Newspaper,
  Repeat2,
  Route,
  Sparkles,
  Trophy,
  Users,
  Video,
  Wrench,
  X,
  type LucideIcon,
} from 'lucide-react';
import type { NavigationGroup } from '@/content/schema';
import styles from './AppShell.module.css';

const icons: Record<string, LucideIcon> = {
  BadgeHelp,
  BookOpen,
  Brain,
  BriefcaseBusiness,
  Building2,
  ChartNoAxesCombined,
  Code: Code2,
  Cpu,
  FileText,
  Files,
  GraduationCap,
  House,
  Library,
  Mail,
  Map,
  Microchip,
  Network,
  Newspaper,
  Repeat2,
  Route,
  Sparkles,
  Trophy,
  Users,
  Video,
  Wrench,
};

interface WorkspaceSidebarProps {
  groups: NavigationGroup[];
  activePath: string;
  open: boolean;
  onClose: () => void;
}

export function WorkspaceSidebar({ groups, activePath, open, onClose }: WorkspaceSidebarProps) {
  return (
    <>
      <button
        className={`${styles.scrim} ${open ? styles.scrimVisible : ''}`}
        type="button"
        aria-label="Close navigation"
        tabIndex={open ? 0 : -1}
        onClick={onClose}
      />
      <aside className={`${styles.sidebar} ${open ? styles.sidebarOpen : ''}`}>
        <div className={styles.sidebarMobileHeader}>
          <span>Navigation</span>
          <button type="button" aria-label="Close navigation" onClick={onClose}>
            <X size={18} aria-hidden="true" />
          </button>
        </div>
        <nav aria-label="Course navigation" className={styles.navigation}>
          {groups.map((group) => (
            <section className={styles.navGroup} key={group.id} aria-labelledby={`nav-${group.id}`}>
              <h2 id={`nav-${group.id}`}>{group.label}</h2>
              <ul>
                {group.items.map((item) => {
                  const Icon = icons[item.icon] ?? FileText;
                  const selected = item.href === activePath;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={`${styles.navItem} ${selected ? styles.navItemSelected : ''}`}
                        aria-current={selected ? 'page' : undefined}
                        onClick={onClose}
                      >
                        <Icon size={15} strokeWidth={1.6} aria-hidden="true" />
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
          <section className={styles.navGroup} aria-labelledby="nav-curriculum">
            <h2 id="nav-curriculum">Curriculum</h2>
            <ul>
              <li><Link href="/ai/overview#math-fundamentals" className={styles.moduleNavItem}><span>01.</span> Math Fundamentals</Link></li>
              <li><Link href="/ai/overview#core-ai-intuitions" className={styles.moduleNavItem}><span>02.</span> Core AI Intuitions</Link></li>
              <li><Link href="/ai/overview#pytorch-fundamentals" className={styles.moduleNavItem}><span>03.</span> PyTorch Fundamentals</Link></li>
            </ul>
          </section>
        </nav>
      </aside>
    </>
  );
}
