# openFanout AI Curriculum Implementation Plan

> **Execution:** Follow `superpowers:executing-plans` and `superpowers:test-driven-development` task by task. Keep `https://fanout.sh/ai/overview` open in Chrome as the factual ordering reference; write all explanatory prose independently.

**Goal:** Ship all 12 AI modules, 108 ordered lesson records, 16 public YouTube lessons, direct lesson routes, local completion/resume state, and exact source coverage.

**Architecture:** One typed `aiModules` registry owns ordering and lesson metadata. The overview, sidebar, search catalog, dynamic lesson route, adjacency links, progress calculations, and source inventory are derived from that registry. `LessonReader` is the only AI lesson view and consumes the existing `ProgressProvider`.

**Acceptance:** AI coverage counts are exactly 108 lessons and 16 YouTube lessons, every lesson slug prerenders, the overview and sidebar expose every module, previous/next links cross module boundaries, and the existing reload Playwright test becomes a real pass.

---

## Task 1: Lock the 108-record curriculum registry

**Files:**
- Create: `src/content/ai-lessons.ts`
- Create: `src/content/ai-lessons.test.ts`
- Modify: `src/content/ai-curriculum.ts`
- Modify: `src/content/catalog.ts`

- [ ] Write a failing registry test for module counts `[15,4,9,27,7,3,5,4,1,5,25,3]`, total 108, unique IDs/slugs/routes, exact module order, 16 expected YouTube IDs, and adjacency across module boundaries.
- [ ] Run `npm test -- src/content/ai-lessons.test.ts` and verify RED.
- [ ] Implement all factual lesson titles in source order with original one-sentence summaries, durations, tags, and public video IDs where known.
- [ ] Derive flattened lessons, module summaries, lookup maps, and `getAiLessonNeighbors(slug)`.
- [ ] Add all lesson records to the shared catalog and rerun tests, type-check, and lint.
- [ ] Commit `feat: add complete AI curriculum registry`.

## Task 2: Build the lesson reader and dynamic routes

**Files:**
- Create: `src/components/lesson/LessonReader.tsx`
- Create: `src/components/lesson/LessonReader.module.css`
- Create: `src/components/lesson/LessonReader.test.tsx`
- Create: `src/app/ai/lessons/[slug]/page.tsx`
- Create: `src/app/not-found.tsx`

- [ ] Write failing component tests for title/module context, safe YouTube embed and fallback link, complete/incomplete control, and previous/next links.
- [ ] Run the focused test and verify RED.
- [ ] Implement independently written lesson notes using reusable concept/example/practice sections; use a responsive 16:9 iframe only for the 16 public videos.
- [ ] Persist completion and last route through `useProgress`; derive module progress from completed IDs.
- [ ] Generate static params for all 108 slugs and return the branded 404 for unknown slugs.
- [ ] Run component tests, type-check, lint, and build; commit `feat: add AI lesson reader`.

## Task 3: Expand the overview and sidebar from the registry

**Files:**
- Modify: `src/components/curriculum/CurriculumOverview.tsx`
- Modify: `src/components/curriculum/CurriculumOverview.test.tsx`
- Modify: `src/components/shell/WorkspaceSidebar.tsx`
- Modify: `src/components/shell/AppShell.module.css`

- [ ] Write failing tests asserting all 12 module sections, 108 local lesson links, and all module groups in course navigation.
- [ ] Replace the preview rows and hardcoded sidebar sample with registry-derived expandable module lists.
- [ ] Make resume and percentages read persisted state without optimistic completion claims.
- [ ] Verify desktop and 320px layouts, tests, type-check, lint, and build; commit `feat: render complete AI curriculum navigation`.

## Task 4: Close AI source coverage

**Files:**
- Modify: `src/content/source-inventory.json`
- Modify: `scripts/verify-coverage.ts`
- Modify: `CHECKLIST.md`

- [ ] Add one source inventory record for every AI lesson route.
- [ ] Enforce the exact 16 YouTube IDs, 12 module counts, and 108 ordered records in the verifier.
- [ ] Remove `aiLessons` and `aiYoutubeLessons` from deferred partitions.
- [ ] Run `npm run verify:coverage` and require zero AI errors; mark only proven AI curriculum checklist items.
- [ ] Commit `test: close AI curriculum coverage`.

## Task 5: Turn reload acceptance green

**Files:**
- Modify: `e2e/progress.spec.ts`
- Add: `e2e/ai-curriculum.spec.ts`
- Modify: `CHECKLIST.md`

- [ ] Remove the expected-failure annotation from lesson persistence.
- [ ] Verify direct first/middle/last lesson routes, video fallback, cross-module previous/next, completion after reload, and overview percentage.
- [ ] Capture and inspect current desktop and mobile lesson screenshots.
- [ ] Run `npm test && npm run lint && npm run typecheck && npm run build && npm run verify:coverage && npm run test:e2e`.
- [ ] Commit `test: verify complete AI curriculum`.
