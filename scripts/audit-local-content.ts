import { writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { aiLessons } from '../src/content/ai-lessons';
import { fullMathTopics, localCourseTopics } from '../src/content/local-course-topics';
import { mathLessons } from '../src/content/math-lessons';
import mathMediaAudit from '../src/content/math-media-audit.json';
import type { LessonRecord } from '../src/content/schema';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outputPath = resolve(repoRoot, 'CONTENT-STATUS.md');

type CourseId = 'ai' | 'ml-math';

interface AuditRow {
  courseId: CourseId;
  moduleTitle: string;
  title: string;
  sourceUrl: string;
  route: string;
  routeExists: boolean;
  lessonRecordExists: boolean;
  notesPresent: boolean;
  videoEmbedPresent: boolean;
  quizPresent: boolean;
}

interface CourseSummary {
  topics: number;
  routeExists: number;
  lessonRecordExists: number;
  notesPresent: number;
  videoEmbedPresent: number;
  quizPresent: number;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function hasText(value: unknown): boolean {
  return typeof value === 'string' && value.trim().length > 0;
}

function hasNotes(lesson: LessonRecord | undefined): boolean {
  return Boolean(lesson?.notes.some((note) => hasText(note.body)));
}

function hasVideoEmbed(lesson: LessonRecord | undefined): boolean {
  return hasText(lesson?.youtubeEmbedUrl);
}

function isQuizEntry(value: unknown): boolean {
  if (!isRecord(value)) return false;
  const hasQuestion = hasText(value.question) || hasText(value.prompt);
  const hasAnswer = hasText(value.answer) || hasText(value.correctAnswer) || hasText(value.correctOption);
  const hasOptions = Array.isArray(value.options) && value.options.length > 0;
  return hasQuestion && (hasAnswer || hasOptions);
}

function hasQuiz(lesson: LessonRecord | undefined): boolean {
  if (!lesson || !isRecord(lesson)) return false;

  // Only explicit quiz data counts. A note titled "Verification checkpoint"
  // is instructional prose, not a quiz in the current LessonRecord schema.
  for (const key of ['quiz', 'quizzes']) {
    const value = lesson[key];
    if (isQuizEntry(value)) return true;
    if (Array.isArray(value) && value.some(isQuizEntry)) return true;
  }
  return false;
}

function markdownCell(value: string): string {
  return value.replaceAll('|', '\\|').replaceAll('\n', ' ');
}

function countSummary(rows: AuditRow[]): CourseSummary {
  return {
    topics: rows.length,
    routeExists: rows.filter((row) => row.routeExists).length,
    lessonRecordExists: rows.filter((row) => row.lessonRecordExists).length,
    notesPresent: rows.filter((row) => row.notesPresent).length,
    videoEmbedPresent: rows.filter((row) => row.videoEmbedPresent).length,
    quizPresent: rows.filter((row) => row.quizPresent).length,
  };
}

function missing(summary: CourseSummary, field: keyof Omit<CourseSummary, 'topics'>): number {
  return summary.topics - summary[field];
}

function buildRows(): AuditRow[] {
  const aiByRoute = new Map<string, LessonRecord>(aiLessons.map((lesson) => [lesson.route, lesson]));
  const mathByRoute = new Map<string, LessonRecord>(mathLessons.map((lesson) => [lesson.route, lesson]));
  const aiRoutes = new Set(aiLessons.map((lesson) => lesson.route));
  const mathRoutes = new Set(fullMathTopics.map((topic) => topic.route));

  return localCourseTopics.map((topic) => {
    const lesson = (topic.courseId === 'ai' ? aiByRoute : mathByRoute).get(topic.route);
    // localCourseTopics is the source of truth for route generation. This is
    // intentionally separate from lesson lookup: Math has pending topics with
    // valid routes but no MathLessonRecord yet.
    const routeExists = topic.courseId === 'ai' ? aiRoutes.has(topic.route) : mathRoutes.has(topic.route);
    return {
      courseId: topic.courseId as CourseId,
      moduleTitle: topic.moduleTitle,
      title: topic.title,
      sourceUrl: topic.sourceUrl,
      route: topic.route,
      routeExists,
      lessonRecordExists: Boolean(lesson),
      notesPresent: hasNotes(lesson),
      videoEmbedPresent: hasVideoEmbed(lesson) || topic.videoAvailable,
      quizPresent: hasQuiz(lesson),
    };
  });
}

function summaryRow(label: string, summary: CourseSummary): string {
  return `| ${label} | ${summary.topics} | ${summary.routeExists} | ${summary.lessonRecordExists} | ${summary.notesPresent} | ${summary.videoEmbedPresent} | ${summary.quizPresent} |`;
}

function missingRow(label: string, summary: CourseSummary): string {
  return `| ${label} | ${missing(summary, 'routeExists')} | ${missing(summary, 'lessonRecordExists')} | ${missing(summary, 'notesPresent')} | ${missing(summary, 'videoEmbedPresent')} | ${missing(summary, 'quizPresent')} |`;
}

export function buildContentStatus(rows = buildRows()): string {
  const aiRows = rows.filter((row) => row.courseId === 'ai');
  const mathRows = rows.filter((row) => row.courseId === 'ml-math');
  const totalRows = rows;
  const aiSummary = countSummary(aiRows);
  const mathSummary = countSummary(mathRows);
  const totalSummary = countSummary(totalRows);

  const detailRows = rows.map((row, index) => {
    const yesNo = (value: boolean) => value ? 'yes' : 'no';
    return `| ${index + 1} | ${row.courseId} | ${markdownCell(row.moduleTitle)} | ${markdownCell(row.title)} | [source](${row.sourceUrl}) | \`${row.route}\` | ${yesNo(row.routeExists)} | ${yesNo(row.lessonRecordExists)} | ${yesNo(row.notesPresent)} | ${yesNo(row.videoEmbedPresent)} | ${yesNo(row.quizPresent)} |`;
  }).join('\n');

  return `# Local Content Status

Generated by \`npx tsx scripts/audit-local-content.ts\` from the live \`localCourseTopics\` (including observed Math media), \`aiLessons\`, and \`mathLessons\` registries. System Design is intentionally excluded.

A local route is reported separately from a lesson record. Math routes are generated for every entry in \`fullMathTopics\`, while only the 34 topics represented in \`mathLessons\` currently have lesson records. A topic is not considered complete merely because its route or lesson record exists.

**Important provenance warning:** a video or quiz that is absent from the local registry means only that openFanout does not currently store it locally. It does not prove that the source provides no video or quiz, and it does not mean one is required. For example, the source-verified AI topic “Evaluation & Deployment” is notes-only locally; its absent local video is not a claim about the source.

Quiz detection counts only explicit \`quiz\` or \`quizzes\` data with a question/prompt and an answer or options in the runtime lesson record. Math notes titled “Verification checkpoint” are not quizzes.

The hydrated Math source audit covers ${mathMediaAudit.observations.length} lessons; ${fullMathTopics.length - mathMediaAudit.observations.length} remain unverified. Their ${mathMediaAudit.summary.portableYouTubeUrls} YouTube links and ${mathMediaAudit.summary.externalResourceUrls} resource links are attached locally, but the source quiz questions and paid notes were not copied. Therefore locally usable quizzes remain zero; source quiz presence is not counted as an imported quiz.

## Summary

| Course | Topics | Local routes | Lesson records | Notes | Video embeds | Quizzes |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
${summaryRow('AI108', aiSummary)}
${summaryRow('Math301', mathSummary)}
${summaryRow('Total', totalSummary)}

## Not present locally

These are local-registry absence counts, not claims about source requirements or source absence.

| Course | Routes not present locally | Lesson records not present locally | Notes not present locally | Video embeds not present locally | Quizzes not present locally |
| --- | ---: | ---: | ---: | ---: | ---: |
${missingRow('AI108', aiSummary)}
${missingRow('Math301', mathSummary)}
${missingRow('Total', totalSummary)}

## Topic audit

| # | Course | Module | Title | Source | Local route | Route exists | Lesson record | Notes | Video embed | Quiz |
| ---: | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
${detailRows}
`;
}

const report = buildContentStatus();
await writeFile(outputPath, report, 'utf8');
console.log(`Wrote ${outputPath} (${localCourseTopics.length} topics).`);
