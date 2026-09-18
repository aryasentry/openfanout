import { useEffect } from 'react';

const revealEvent = 'openfanout:reveal-anchor';

// Same-page navigation must reveal a filtered-out target before scrolling.
export function revealSearchAnchor(href: string) {
  const destination = new URL(href, window.location.href);
  if (destination.origin !== window.location.origin || destination.pathname !== window.location.pathname || !destination.hash) return;
  window.dispatchEvent(new CustomEvent<string>(revealEvent, { detail: decodeURIComponent(destination.hash.slice(1)) }));
}

export function useAnchorReveal(reveal: (id: string) => boolean) {
  useEffect(() => {
    let frame = 0;
    const onReveal = (event: Event) => {
      const id = (event as CustomEvent<string>).detail;
      if (typeof id !== 'string' || !reveal(id)) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ block: 'start' }));
    };
    window.addEventListener(revealEvent, onReveal);
    return () => {
      window.removeEventListener(revealEvent, onReveal);
      cancelAnimationFrame(frame);
    };
  }, [reveal]);
}
