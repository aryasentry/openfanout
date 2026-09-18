'use client';

import { useSyncExternalStore } from 'react';
import { roadmapTracks } from '../../content/roadmap';
import styles from './RoadmapPage.module.css';

function subscribe(callback: () => void) {
  window.addEventListener('popstate', callback);
  return () => window.removeEventListener('popstate', callback);
}
function currentTrack() { return new URLSearchParams(window.location.search).get('track') ?? 'ai'; }

export function RoadmapPage() {
  const trackId = useSyncExternalStore(subscribe, currentTrack, () => 'ai');
  const track = roadmapTracks.find(item => item.id === trackId) ?? roadmapTracks[0];
  function select(id: string) {
    const url = new URL(window.location.href);
    url.searchParams.set('track', id);
    url.hash = '';
    window.history.pushState(null, '', url);
    window.dispatchEvent(new PopStateEvent('popstate'));
  }
  return <main id="main-content" className={styles.page}>
    <header><p className={styles.eyebrow}>CHOOSE YOUR PATH</p><h1>Learning roadmaps</h1><p>Explore the modules, then open the topic index to plan your next step.</p></header>
    <div role="tablist" aria-label="Learning tracks" className={styles.tabs}>
      {roadmapTracks.map((item, index) => <button key={item.id} id={`track-${item.id}`} type="button" role="tab" aria-selected={track.id === item.id} aria-controls="roadmap-panel" tabIndex={track.id === item.id ? 0 : -1} onClick={() => select(item.id)} onKeyDown={event => {
        const target = event.key === 'ArrowRight' ? (index + 1) % 3 : event.key === 'ArrowLeft' ? (index + 2) % 3 : event.key === 'Home' ? 0 : event.key === 'End' ? 2 : -1;
        if (target >= 0) { event.preventDefault(); select(roadmapTracks[target].id); document.getElementById(`track-${roadmapTracks[target].id}`)?.focus(); }
      }}>{item.title}</button>)}
    </div>
    <div role="tabpanel" id="roadmap-panel" aria-labelledby={`track-${track.id}`}>
      <div className={styles.intro}><h2>{track.title}</h2><p>{track.modules.reduce((total, module) => total + module.count, 0)} {track.unit} · {track.modules.length} modules</p><p>{track.note}</p><a href={track.href}>{track.id === 'ml' ? 'Open the separate ML Math course' : track.id === 'ai' ? 'Open AI course' : 'Open System Design on Fanout ↗'}</a></div>
      <nav aria-label={`${track.title} module map`} className={styles.map}>
        {track.modules.map((module, index) => <a href={`#roadmap-index-${track.id}-${module.id}`} key={module.id} onClick={() => {
          const details = document.getElementById(`roadmap-index-${track.id}-${module.id}`);
          if (details instanceof HTMLDetailsElement) details.open = true;
        }}><span>{String(index + 1).padStart(2, '0')}</span><strong>{module.title}</strong><small>{module.count} {track.unit}</small></a>)}
      </nav>
      <h2>Topic index</h2>
      <div className={styles.index} key={track.id}>{track.modules.map(module => <details key={module.id} id={`roadmap-index-${track.id}-${module.id}`}>
        <summary>{module.title}<span>{module.count} {track.unit}</span></summary>
        <ul>{module.topics.map(topic => <li key={topic.title}>{topic.href ? <a href={topic.href}>{topic.title}</a> : topic.title}</li>)}</ul>
        {module.count > module.topics.length && <p className={styles.pending}>{module.count - module.topics.length} additional {track.unit === 'topics' ? 'topic' : 'lesson'}{module.count - module.topics.length === 1 ? '' : 's'} not captured in the source preview.</p>}
      </details>)}</div>
    </div>
  </main>;
}
