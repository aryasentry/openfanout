import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { labs } from '../../content/labs';
import styles from './Labs.module.css';

export function LabsCatalog() {
  return (
    <main id="main-content" className={styles.catalogMain}>
      <header className={styles.catalogHero}><p>Change the numbers</p><h1>Interactive labs</h1><span>Fifteen local simulators for model mathematics, inference memory, retrieval, evaluation, reliability, and planning.</span></header>
      <div className={styles.labGrid}>
        {labs.map((lab, index) => (
          <Link data-testid="lab-card" href={lab.route} key={lab.id}>
            <span className={styles.labSymbol}>{lab.symbol}</span>
            <span className={styles.labCardCopy}><small>{String(index + 1).padStart(2, '0')}</small><strong>{lab.title}</strong><p>{lab.question}</p><em>{lab.inputs.slice(0, 3).map((input) => input.label).join(' · ')}</em></span>
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        ))}
      </div>
    </main>
  );
}
