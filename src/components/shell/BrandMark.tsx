import styles from './AppShell.module.css';

export function BrandMark() {
  return (
    <span className={styles.brand} aria-label="openFanout">
      <svg className={styles.brandMark} viewBox="0 0 32 32" aria-hidden="true">
        <path d="M7 7 16 13m0 0 9-7m-9 7v8m0 0-8 5m8-5 9 5" />
        <circle cx="7" cy="7" r="2.5" />
        <circle cx="25" cy="6" r="2.5" />
        <circle cx="16" cy="13" r="2.5" />
        <circle cx="8" cy="26" r="2.5" />
        <circle cx="25" cy="26" r="2.5" />
      </svg>
      <strong>openFanout</strong>
    </span>
  );
}
