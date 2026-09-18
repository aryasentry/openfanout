import audit from '../../content/math-media-audit.json';
import styles from './MathObservedMedia.module.css';

type MathMediaObservation = (typeof audit.observations)[number];

export const observedMathMediaBySource = new Map<string, MathMediaObservation>(
  audit.observations.map((observation) => [observation.sourceUrl, observation]),
);

function youtubeEmbedUrl(videoUrl: string) {
  const videoId = new URL(videoUrl).searchParams.get('v');
  return videoId ? `https://www.youtube-nocookie.com/embed/${videoId}` : null;
}

interface MathObservedMediaProps {
  sourceUrl: string;
}

export function MathObservedMedia({ sourceUrl }: MathObservedMediaProps) {
  const observation = observedMathMediaBySource.get(sourceUrl);
  if (!observation) return null;

  const videoUrl = observation.videoUrls[0];
  const embedUrl = videoUrl ? youtubeEmbedUrl(videoUrl) : null;

  return (
    <section className={styles.media} aria-label="Observed lesson media">
      {embedUrl && videoUrl ? (
        <section className={styles.panel} aria-label={`${observation.lessonTitle} video`}>
          <div className={styles.videoFrame}>
            <iframe
              src={embedUrl}
              title={`Video: ${observation.lessonTitle}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
          <div className={styles.footer}>
            <span>Observed lesson video</span>
            <a
              href={videoUrl}
              target="_blank"
              rel="noreferrer noopener"
              aria-label={`Open on YouTube: ${observation.lessonTitle}`}
            >
              Open on YouTube
            </a>
          </div>
        </section>
      ) : null}

      <section className={`${styles.panel} ${styles.resources}`} aria-labelledby="observed-resources-title">
        <h2 id="observed-resources-title">Observed resources</h2>
        <ul>
          {observation.resourceUrls.map((resourceUrl) => (
            <li key={resourceUrl}>
              <a href={resourceUrl} target="_blank" rel="noreferrer noopener">{resourceUrl}</a>
            </li>
          ))}
        </ul>
      </section>

      <section className={`${styles.panel} ${styles.quiz}`} aria-labelledby="quiz-status-title">
        <h2 id="quiz-status-title">{observation.quizHeading}</h2>
        <p>Quiz questions are pending in this local copy.</p>
      </section>
    </section>
  );
}
