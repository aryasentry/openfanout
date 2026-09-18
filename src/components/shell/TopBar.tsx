"use client";

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Menu, Search } from 'lucide-react';
import { BrandMark } from './BrandMark';
import styles from './AppShell.module.css';

interface TopBarProps {
  workspace: string;
  title: string;
  onOpenMenu: () => void;
  onOpenSearch: () => void;
}

const learningSpaces = [
  { label: 'AI Research', workspace: 'AI', href: '/ai/overview' },
  { label: 'ML Math', workspace: 'ML Math', href: '/ml-math/overview' },
] as const;

export function TopBar({ workspace, title, onOpenMenu, onOpenSearch }: TopBarProps) {
  const [workspaceMenuOpen, setWorkspaceMenuOpen] = useState(false);
  const [focusedSpace, setFocusedSpace] = useState<number | null>(null);
  const workspaceControlRef = useRef<HTMLDivElement>(null);
  const workspaceButtonRef = useRef<HTMLButtonElement>(null);
  const workspaceItemRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const activeSpaceIndex = Math.max(learningSpaces.findIndex((space) => space.workspace === workspace), 0);

  useEffect(() => {
    if (focusedSpace === null) return;
    workspaceItemRefs.current[focusedSpace]?.focus();
  }, [focusedSpace, workspaceMenuOpen]);

  useEffect(() => {
    if (!workspaceMenuOpen) return;
    const closeWhenClickingOutside = (event: MouseEvent) => {
      if (!workspaceControlRef.current?.contains(event.target as Node)) {
        setWorkspaceMenuOpen(false);
        setFocusedSpace(null);
      }
    };
    document.addEventListener('mousedown', closeWhenClickingOutside);
    return () => document.removeEventListener('mousedown', closeWhenClickingOutside);
  }, [workspaceMenuOpen]);

  const focusSpace = (index: number) => {
    setWorkspaceMenuOpen(true);
    setFocusedSpace((index + learningSpaces.length) % learningSpaces.length);
  };

  return (
    <header className={styles.topBar}>
      <button className={styles.mobileMenu} type="button" onClick={onOpenMenu} aria-label="Open navigation">
        <Menu size={19} aria-hidden="true" />
      </button>
      <BrandMark />
      <span className={styles.topDivider} aria-hidden="true" />
      <div className={styles.workspaceControl} ref={workspaceControlRef}>
        <button
          className={styles.workspaceButton}
          type="button"
          aria-label="Switch learning space"
          aria-expanded={workspaceMenuOpen}
          aria-haspopup="menu"
          aria-controls="learning-space-menu"
          ref={workspaceButtonRef}
          onClick={() => {
            setWorkspaceMenuOpen((open) => !open);
            setFocusedSpace(null);
          }}
          onKeyDown={(event) => {
            if (event.key === 'ArrowDown') {
              event.preventDefault();
              focusSpace(activeSpaceIndex + 1);
            }
            if (event.key === 'ArrowUp') {
              event.preventDefault();
              focusSpace(activeSpaceIndex - 1);
            }
          }}
        >
          <span>{workspace}</span>
          <ChevronDown size={14} aria-hidden="true" />
        </button>
        {workspaceMenuOpen ? (
          <div className={styles.workspaceMenu} id="learning-space-menu" role="menu" aria-label="Learning spaces">
            {learningSpaces.map((space, index) => (
              <Link
                className={styles.workspaceMenuItem}
                href={space.href}
                key={space.href}
                role="menuitem"
                aria-current={space.workspace === workspace ? 'page' : undefined}
                ref={(element) => {
                  workspaceItemRefs.current[index] = element;
                }}
                onClick={() => setWorkspaceMenuOpen(false)}
                onKeyDown={(event) => {
                  if (event.key === 'ArrowDown') {
                    event.preventDefault();
                    focusSpace(index + 1);
                  }
                  if (event.key === 'ArrowUp') {
                    event.preventDefault();
                    focusSpace(index - 1);
                  }
                  if (event.key === 'Escape') {
                    event.preventDefault();
                    setWorkspaceMenuOpen(false);
                    setFocusedSpace(null);
                    workspaceButtonRef.current?.focus();
                  }
                }}
              >
                {space.label}
              </Link>
            ))}
          </div>
        ) : null}
      </div>
      <span className={styles.breadcrumbDivider} aria-hidden="true">/</span>
      <span className={styles.breadcrumb}>{title}</span>
      <button className={styles.searchButton} type="button" aria-label="Search openFanout" onClick={onOpenSearch}>
        <Search size={15} aria-hidden="true" />
        <span>Search</span>
        <kbd>⌘K</kbd>
      </button>
    </header>
  );
}
