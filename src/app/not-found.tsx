import Link from 'next/link';
import styles from './not-found.module.css';

export default function NotFound() {
  return (
    <main className={styles.main}>
      <section className={styles.panel}>
        <span>404 · openFanout</span>
        <h1>This learning path is not in the local library.</h1>
        <p>Return to a shipped workspace. No account or upgrade is required.</p>
        <div className={styles.links}>
          <Link href="/ai/overview">AI curriculum</Link>
          <Link href="/ml-math/overview">Advanced math</Link>
          <Link href="/labs">Labs</Link>
          <Link href="/daily">Daily papers</Link>
        </div>
      </section>
    </main>
  );
}
