import Link from 'next/link';
import {
  BadgeHelp,
  BookOpen,
  Brain,
  BriefcaseBusiness,
  Building2,
  ChartNoAxesCombined,
  ChevronDown,
  Code2,
  Cpu,
  FileText,
  Files,
  GraduationCap,
  House,
  FunctionSquare,
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
import { aiModules } from '../../content/ai-lessons';
import { mathModules } from '../../content/math-lessons';
import type { NavigationGroup } from '../../content/schema';
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
  FunctionSquare,
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
  const curriculumModules = activePath.startsWith('/ml-math/') ? mathModules : aiModules;
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
            <div className={styles.curriculumList}>
              {curriculumModules.map((module) => {
                const containsActiveLesson = module.lessons.some((lesson) => lesson.route === activePath);
                return (
                  <details
                    className={styles.moduleDisclosure}
                    open={containsActiveLesson || ((activePath === '/ai/overview' || activePath === '/ml-math/overview') && module.index === 1)}
                    data-testid="sidebar-module"
                    key={module.id}
                  >
                    <summary className={styles.moduleNavItem}>
                      <span>{String(module.index).padStart(2, '0')}</span>
                      <strong>{module.shortTitle}</strong>
                      <small>{module.lessons.length}</small>
                      <ChevronDown size={13} aria-hidden="true" />
                    </summary>
                    <ul className={styles.lessonNavList}>
                      {module.lessons.map((lesson) => {
                        const selected = lesson.route === activePath;
                        return (
                          <li key={lesson.id}>
                            <Link
                              href={lesson.route}
                              className={`${styles.lessonNavItem} ${selected ? styles.lessonNavItemSelected : ''}`}
                              aria-current={selected ? 'page' : undefined}
                              data-testid="sidebar-lesson-link"
                              onClick={onClose}
                            >
                              <span className={styles.sidebarTopicSymbol}>{lesson.symbol}</span>
                              <span>{lesson.title}</span>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </details>
                );
              })}
            </div>
          </section>
        </nav>
      </aside>
    </>
  );
}
