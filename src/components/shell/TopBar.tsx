import { ChevronDown, Menu, Search } from 'lucide-react';
import { BrandMark } from './BrandMark';
import styles from './AppShell.module.css';

interface TopBarProps {
  workspace: string;
  title: string;
  onOpenMenu: () => void;
}

export function TopBar({ workspace, title, onOpenMenu }: TopBarProps) {
  return (
    <header className={styles.topBar}>
      <button className={styles.mobileMenu} type="button" onClick={onOpenMenu} aria-label="Open navigation">
        <Menu size={19} aria-hidden="true" />
      </button>
      <BrandMark />
      <span className={styles.topDivider} aria-hidden="true" />
      <button className={styles.workspaceButton} type="button" aria-label="Switch learning space">
        <span>{workspace}</span>
        <ChevronDown size={14} aria-hidden="true" />
      </button>
      <span className={styles.breadcrumbDivider} aria-hidden="true">/</span>
      <span className={styles.breadcrumb}>{title}</span>
      <button className={styles.searchButton} type="button" aria-label="Search openFanout">
        <Search size={15} aria-hidden="true" />
        <span>Search</span>
        <kbd>⌘K</kbd>
      </button>
    </header>
  );
}
