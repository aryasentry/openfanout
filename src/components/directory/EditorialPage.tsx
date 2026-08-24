import type { EditorialPageRecord } from '../../content/editorial-pages';
import styles from './EditorialPage.module.css';

export function EditorialPage({ page }: { page: EditorialPageRecord }) {
  return (
    <main id="main-content" className={styles.main}>
      <header className={styles.hero}><p>{page.eyebrow}</p><h1>{page.title}</h1><span>{page.description}</span></header>
      <div className={styles.itemGrid}>
        {page.items.map((item, index) => (
          <article className={styles.item} key={item.title}>
            <span className={styles.symbol}>{item.symbol}</span>
            <div><small>{String(index + 1).padStart(2, '0')}</small><h2>{item.title}</h2><p>{item.description}</p><strong>Checkpoint</strong><p>{item.checkpoint}</p></div>
          </article>
        ))}
      </div>
    </main>
  );
}
