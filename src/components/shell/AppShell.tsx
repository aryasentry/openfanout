'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { catalog } from '../../content/catalog';
import type { NavigationGroup } from '../../content/schema';
import { SearchPalette } from '../search/SearchPalette';
import { TopBar } from './TopBar';
import { WorkspaceSidebar } from './WorkspaceSidebar';
import styles from './AppShell.module.css';

interface AppShellProps {
  workspace: string;
  title: string;
  navigation: NavigationGroup[];
  activePath?: string;
  children: ReactNode;
}

export function AppShell({ workspace, title, navigation, activePath = '/ai/overview', children }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    if (!sidebarOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSidebarOpen(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [sidebarOpen]);

  useEffect(() => {
    const openSearch = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLocaleLowerCase() === 'k') {
        event.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', openSearch);
    return () => window.removeEventListener('keydown', openSearch);
  }, []);

  return (
    <div className={styles.shell}>
      <a className={styles.skipLink} href="#main-content">Skip to main content</a>
      <TopBar
        workspace={workspace}
        title={title}
        onOpenMenu={() => setSidebarOpen(true)}
        onOpenSearch={() => setSearchOpen(true)}
      />
      <WorkspaceSidebar
        groups={navigation}
        activePath={activePath}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className={styles.viewport}>{children}</div>
      <SearchPalette open={searchOpen} records={catalog} onClose={() => setSearchOpen(false)} />
    </div>
  );
}
