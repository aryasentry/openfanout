import { describe, expect, it } from 'vitest';
import audit from './math-media-audit.json';
import { fullMathTopics } from './local-course-topics';
import { mathLessons } from './math-lessons';

const youtubeWatchUrl = /^https:\/\/(?:www\.)?youtube\.com\/watch\?v=([A-Za-z0-9_-]{11})$/;

const observations = audit.observations;
const canonicalTopicsBySource = new Map(fullMathTopics.map((topic) => [topic.sourceUrl, topic]));
const lessonRecordsBySource = new Map(mathLessons.map((lesson) => [lesson.sourceUrl, lesson]));

function explicitQuizRecord(value: unknown): boolean {
  if (typeof value !== 'object' || value === null) return false;
  const record = value as Record<string, unknown>;
  return 'quiz' in record || 'quizzes' in record;
}

describe('Math observed media audit', () => {
  it('contains only canonical Math source URLs with unique source observations', () => {
    const canonicalSources = fullMathTopics.map((topic) => topic.sourceUrl);
    const observedSources = observations.map((observation) => observation.sourceUrl);

    expect(new Set(canonicalSources).size).toBe(canonicalSources.length);
    expect(new Set(observedSources).size).toBe(observedSources.length);
    expect(observations).toHaveLength(canonicalSources.length);
    expect(new Set(observedSources)).toEqual(new Set(canonicalSources));

    for (const observation of observations) {
      const canonical = canonicalTopicsBySource.get(observation.sourceUrl);
      expect(canonical, `unmatched observed source: ${observation.sourceUrl}`).toBeDefined();
      expect(observation.moduleId).toBe(canonical?.moduleId);
      expect(observation.moduleTitle).toBe(canonical?.moduleTitle);
      expect(observation.lessonTitle).toBe(canonical?.title);
    }
  });

  it('requires every observed source to have completed hydration and a valid YouTube watch URL', () => {
    expect(observations.every((observation) => observation.hydrationStatus === 'complete')).toBe(true);

    for (const observation of observations) {
      expect(observation.videoUi).toBe('present');
      expect(observation.videoUrls.length).toBeGreaterThan(0);
      for (const videoUrl of observation.videoUrls) {
        const match = videoUrl.match(youtubeWatchUrl);
        expect(match, `invalid YouTube URL: ${videoUrl}`).not.toBeNull();
        expect(match?.[1]).toMatch(/^[A-Za-z0-9_-]{11}$/);
      }
    }
  });

  it('keeps scope and summary counts derived from the current observation array', () => {
    const completeCount = observations.filter((observation) => observation.hydrationStatus === 'complete').length;
    const videoCount = observations.filter((observation) => observation.videoUi === 'present').length;
    const quizCount = observations.filter((observation) => observation.quizUi === 'present').length;
    const notesCount = observations.filter((observation) => observation.notesUi === 'present').length;
    const youtubeUrlCount = observations.flatMap((observation) => observation.videoUrls).length;
    const resourceUrlCount = observations.flatMap((observation) => observation.resourceUrls).length;

    expect(audit.scope.sourcesVisited).toBe(observations.length);
    expect(audit.scope.sourcesHydrated).toBe(completeCount);
    expect(audit.scope.sourcesUnvisited).toBe(fullMathTopics.length - observations.length);
    expect(audit.scope.sourcesVisited + audit.scope.sourcesUnvisited).toBe(fullMathTopics.length);
    expect(audit.summary.videoPresent).toBe(videoCount);
    expect(audit.summary.quizPresent).toBe(quizCount);
    expect(audit.summary.notesPresent).toBe(notesCount);
    expect(audit.summary.portableYouTubeUrls).toBe(youtubeUrlCount);
    expect(audit.summary.externalResourceUrls).toBe(resourceUrlCount);
    expect(audit.scope.modulesSampled).toBe(new Set(observations.map((observation) => observation.moduleId)).size);
  });

  it('keeps every observed resource link HTTPS', () => {
    for (const resourceUrl of observations.flatMap((observation) => observation.resourceUrls)) {
      expect(new URL(resourceUrl).protocol, `non-HTTPS resource: ${resourceUrl}`).toBe('https:');
    }
  });

  it('reports import gaps without treating observed metadata as imported lesson content', () => {
    const observedNotes = observations.filter((observation) => observation.notesUi === 'present').length;
    const importedNotes = observations.filter((observation) => {
      const lesson = lessonRecordsBySource.get(observation.sourceUrl);
      return Boolean(lesson?.notes.some((note) => note.body.trim().length > 0));
    }).length;
    const observedQuizChecks = observations.filter((observation) => observation.quizUi === 'present').length;
    const importedQuizRecords = observations.filter((observation) => explicitQuizRecord(lessonRecordsBySource.get(observation.sourceUrl))).length;
    const observedBlogLinks = observations
      .flatMap((observation) => observation.resourceUrls)
      .filter((resourceUrl) => /blog/i.test(resourceUrl)).length;
    const importedBlogLinks = observations.filter((observation) => {
      const lesson = lessonRecordsBySource.get(observation.sourceUrl);
      return Boolean(lesson?.references.some((reference) => /blog/i.test(reference.url)));
    }).length;

    expect(importedNotes).toBeLessThanOrEqual(observedNotes);
    expect(importedQuizRecords).toBeLessThanOrEqual(observedQuizChecks);
    expect(importedBlogLinks).toBeLessThanOrEqual(observedBlogLinks);

    console.info('[math-media-audit coverage]', {
      observedSources: observations.length,
      canonicalSources: fullMathTopics.length,
      unvisitedSources: fullMathTopics.length - observations.length,
      observedNotes,
      notesImportedIntoMathLessons: importedNotes,
      observedQuizChecks,
      quizRecordsImportedIntoMathLessons: importedQuizRecords,
      observedBlogLinks,
      blogLinksImportedIntoMathLessons: importedBlogLinks,
    });
  });
});
