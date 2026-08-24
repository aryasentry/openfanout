# openFanout Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the tested light-only openFanout application shell, typed content registry, local progress store, search, and completeness verifier that every curriculum, directory, lab, and daily-paper route will use.

**Architecture:** Next.js App Router renders a shared `AppShell` around data-driven page components. Static TypeScript registries define navigation and catalog records; a versioned persistence adapter stores user state in IndexedDB with localStorage fallback. Pure helpers remain framework-independent so coverage, ordering, search, and progress behavior can be tested without a browser.

**Tech Stack:** Next.js 16, React 19, TypeScript 5, CSS Modules, Lucide React, Vitest, Testing Library, fake-indexeddb, Playwright

**Spec:** `docs/superpowers/specs/2026-08-24-openfanout-master-design.md`

## Global Constraints

- Product name is `openFanout`; use an original branching-node mark and Lucide icons.
- Light mode only; do not create dark tokens, a theme provider, or a theme toggle.
- No pricing, subscription, account, login, entitlement, upgrade, analytics, or paywall UI.
- The desktop shell uses a 64px top bar and a 244px fixed sidebar; below 1024px the sidebar becomes an overlay drawer.
- Source-derived content is limited to factual metadata and public URLs; prose is independently written.
- Every shipped local route and source inventory record must pass automated coverage checks.
- User progress is local-first and survives reload without a cloud service.

---

### Task 1: Bootstrap the application and define content contracts

**Files:**
- Create: `package.json`
- Create: `next.config.ts`
- Create: `tsconfig.json`
- Create: `eslint.config.mjs`
- Create: `vitest.config.ts`
- Create: `src/test/setup.ts`
- Create: `src/content/schema.ts`
- Create: `src/content/navigation.ts`
- Test: `src/content/schema.test.ts`

**Interfaces:**
- Produces: `CatalogRecord`, `CurriculumModule`, `LessonRecord`, `NavigationGroup`, `SourceInventoryRecord`, and `validateCatalog(records)`.
- Consumes: no project code.

- [ ] **Step 1: Write the failing schema test**

```ts
import { describe, expect, it } from 'vitest';
import { validateCatalog, type CatalogRecord } from './schema';

describe('validateCatalog', () => {
  it('rejects duplicate ids, duplicate local routes, and Fanout destinations', () => {
    const records: CatalogRecord[] = [
      { id: 'one', slug: 'one', title: 'One', kind: 'resource', workspace: 'ai', section: 'tools', route: '/ai/tools/one', sourceUrl: 'https://fanout.sh/ai/tools', provenanceCheckedAt: '2026-08-24' },
      { id: 'one', slug: 'two', title: 'Two', kind: 'resource', workspace: 'ai', section: 'tools', route: '/ai/tools/one', sourceUrl: 'https://fanout.sh/pricing', provenanceCheckedAt: '2026-08-24' },
    ];

    expect(validateCatalog(records)).toEqual([
      'duplicate id: one',
      'duplicate route: /ai/tools/one',
      'forbidden Fanout destination: https://fanout.sh/pricing',
    ]);
  });
});
```

- [ ] **Step 2: Run the test and verify RED**

Run: `npm test -- src/content/schema.test.ts`

Expected: FAIL because `package.json` and `src/content/schema.ts` do not exist.

- [ ] **Step 3: Add the project configuration and minimal schema implementation**

```json
{
  "name": "openfanout",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test",
    "verify:coverage": "tsx scripts/verify-coverage.ts"
  },
  "dependencies": {
    "idb": "latest",
    "lucide-react": "latest",
    "next": "latest",
    "react": "latest",
    "react-dom": "latest"
  },
  "devDependencies": {
    "@playwright/test": "latest",
    "@testing-library/jest-dom": "latest",
    "@testing-library/react": "latest",
    "@types/node": "latest",
    "@types/react": "latest",
    "@types/react-dom": "latest",
    "@vitejs/plugin-react": "latest",
    "eslint": "latest",
    "eslint-config-next": "latest",
    "fake-indexeddb": "latest",
    "jsdom": "latest",
    "tsx": "latest",
    "typescript": "latest",
    "vitest": "latest"
  }
}
```

```ts
export type Workspace = 'global' | 'ai' | 'ml-math' | 'labs' | 'daily';
export type CatalogKind = 'page' | 'resource' | 'lesson' | 'paper' | 'lab' | 'company' | 'glossary';

export interface CatalogRecord {
  id: string;
  slug: string;
  title: string;
  kind: CatalogKind;
  workspace: Workspace;
  section: string;
  route: `/${string}`;
  sourceUrl: string;
  provenanceCheckedAt: string;
  externalUrl?: string;
  summary?: string;
  tags?: string[];
}

export interface LessonRecord extends CatalogRecord {
  kind: 'lesson';
  moduleId: string;
  order: number;
  youtubeEmbedUrl?: string;
  notes: Array<{ heading: string; body: string }>;
}

export interface CurriculumModule {
  id: string;
  index: number;
  title: string;
  description: string;
  lessonIds: string[];
}

export interface NavigationGroup {
  id: string;
  label: string;
  items: Array<{ label: string; href: `/${string}`; icon: string }>;
}

export interface SourceInventoryRecord {
  sourceUrl: string;
  localId: string;
  kind: CatalogKind;
  checkedAt: string;
}

export function validateCatalog(records: CatalogRecord[]): string[] {
  const ids = new Set<string>();
  const routes = new Set<string>();
  const errors: string[] = [];
  for (const record of records) {
    if (ids.has(record.id)) errors.push(`duplicate id: ${record.id}`);
    if (routes.has(record.route)) errors.push(`duplicate route: ${record.route}`);
    if (/^https:\/\/fanout\.sh\/(pricing|account|login)/.test(record.sourceUrl)) {
      errors.push(`forbidden Fanout destination: ${record.sourceUrl}`);
    }
    ids.add(record.id);
    routes.add(record.route);
  }
  return errors;
}
```

- [ ] **Step 4: Run the schema test and full static checks**

Run: `npm install && npm test -- src/content/schema.test.ts && npm run typecheck`

Expected: one passing test and TypeScript exit code 0.

- [ ] **Step 5: Commit the contracts**

```bash
git add package.json package-lock.json next.config.ts tsconfig.json eslint.config.mjs vitest.config.ts src/test/setup.ts src/content/schema.ts src/content/navigation.ts src/content/schema.test.ts
git commit -m "feat: bootstrap openFanout content contracts"
```

### Task 2: Build the light-only application shell

**Files:**
- Create: `src/app/layout.tsx`
- Create: `src/app/page.tsx`
- Create: `src/app/globals.css`
- Create: `src/components/shell/AppShell.tsx`
- Create: `src/components/shell/AppShell.module.css`
- Create: `src/components/shell/BrandMark.tsx`
- Create: `src/components/shell/TopBar.tsx`
- Create: `src/components/shell/WorkspaceSidebar.tsx`
- Test: `src/components/shell/AppShell.test.tsx`

**Interfaces:**
- Consumes: `NavigationGroup[]` from `src/content/navigation.ts`.
- Produces: `<AppShell workspace title navigation>{children}</AppShell>` and stable shell landmarks used by all pages.

- [ ] **Step 1: Write the failing shell test**

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AppShell } from './AppShell';

describe('AppShell', () => {
  it('renders the openFanout workspace without forbidden controls', () => {
    render(<AppShell workspace="AI" title="Overview" navigation={[]}><main>Body</main></AppShell>);
    expect(screen.getByRole('banner')).toHaveTextContent('openFanout');
    expect(screen.getByRole('navigation', { name: 'Course navigation' })).toBeInTheDocument();
    expect(screen.queryByText(/pricing|upgrade|account/i)).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /dark mode/i })).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the shell test and verify RED**

Run: `npm test -- src/components/shell/AppShell.test.tsx`

Expected: FAIL because `AppShell` does not exist.

- [ ] **Step 3: Implement the shell and design tokens**

```css
:root {
  color-scheme: light;
  --topbar-height: 64px;
  --sidebar-width: 244px;
  --canvas: #f6f7f8;
  --surface: #ffffff;
  --surface-muted: #f1f3f5;
  --text: #17191c;
  --muted: #69717c;
  --border: #e2e5e9;
  --accent: #315efb;
  --accent-soft: #e9efff;
  --mint: #dff6ea;
  --radius-sm: 8px;
  --shadow-sm: 0 1px 2px rgb(15 23 42 / 7%);
  --font-ui: Inter, ui-sans-serif, system-ui, sans-serif;
  --font-display: "IBM Plex Mono", ui-monospace, SFMono-Regular, monospace;
}
```

```tsx
export function AppShell({ workspace, title, navigation, children }: Props) {
  return (
    <div className={styles.shell}>
      <TopBar workspace={workspace} title={title} />
      <WorkspaceSidebar groups={navigation} />
      <div className={styles.viewport}>{children}</div>
    </div>
  );
}
```

Implement the desktop 64px/244px geometry, selected-row treatment, scrollable sidebar, mobile drawer, skip link, focus styles, and original branching-node SVG mark. Do not add any dark selector or theme state.

- [ ] **Step 4: Run shell tests and static checks**

Run: `npm test -- src/components/shell/AppShell.test.tsx && npm run lint && npm run typecheck`

Expected: all commands exit 0 with no warnings.

- [ ] **Step 5: Commit the shell**

```bash
git add src/app src/components/shell
git commit -m "feat: add openFanout application shell"
```

### Task 3: Add versioned local progress persistence

**Files:**
- Create: `src/lib/progress/types.ts`
- Create: `src/lib/progress/storage.ts`
- Create: `src/lib/progress/ProgressProvider.tsx`
- Create: `src/lib/progress/useProgress.ts`
- Test: `src/lib/progress/storage.test.ts`

**Interfaces:**
- Produces: `ProgressSnapshot`, `ProgressStore`, `createProgressStore()`, `useProgress()`, `exportProgress()`, and `importProgress(json)`.
- Consumes: lesson, paper, resource, and lab IDs from the catalog registry.

- [ ] **Step 1: Write failing persistence tests**

```ts
import 'fake-indexeddb/auto';
import { describe, expect, it } from 'vitest';
import { createProgressStore } from './storage';

describe('ProgressStore', () => {
  it('persists completion and last route across store instances', async () => {
    const first = createProgressStore('test-progress');
    await first.update({ completedLessonIds: ['ai-functions'], lastRoute: '/ai/lessons/functions' });
    const second = createProgressStore('test-progress');
    expect(await second.load()).toMatchObject({ completedLessonIds: ['ai-functions'], lastRoute: '/ai/lessons/functions' });
  });

  it('rejects invalid imports without overwriting saved progress', async () => {
    const store = createProgressStore('test-import');
    await store.update({ savedResourceIds: ['d2l'] });
    await expect(store.import('{"schemaVersion":99}')).rejects.toThrow('Unsupported progress schema');
    expect((await store.load()).savedResourceIds).toEqual(['d2l']);
  });
});
```

- [ ] **Step 2: Run persistence tests and verify RED**

Run: `npm test -- src/lib/progress/storage.test.ts`

Expected: FAIL because `createProgressStore` does not exist.

- [ ] **Step 3: Implement the versioned store**

```ts
export interface ProgressSnapshot {
  schemaVersion: 1;
  completedLessonIds: string[];
  readPaperIds: string[];
  savedResourceIds: string[];
  labState: Record<string, unknown>;
  lastRoute: string | null;
  updatedAt: string;
}

export interface ProgressStore {
  load(): Promise<ProgressSnapshot>;
  update(patch: Partial<Omit<ProgressSnapshot, 'schemaVersion' | 'updatedAt'>>): Promise<ProgressSnapshot>;
  export(): Promise<string>;
  import(json: string): Promise<ProgressSnapshot>;
  clear(): Promise<void>;
}
```

Use `idb` with database name supplied to `createProgressStore`. Catch open/write failures and mirror the same serialized snapshot under `${name}:fallback` in localStorage. Validate `schemaVersion === 1` and array/object field types before replacing existing data.

- [ ] **Step 4: Verify persistence behavior**

Run: `npm test -- src/lib/progress/storage.test.ts`

Expected: both tests pass.

- [ ] **Step 5: Commit persistence**

```bash
git add src/lib/progress
git commit -m "feat: persist local learning progress"
```

### Task 4: Add catalog search and direct local routing

**Files:**
- Create: `src/content/catalog.ts`
- Create: `src/lib/search/searchCatalog.ts`
- Create: `src/components/search/SearchPalette.tsx`
- Create: `src/components/search/SearchPalette.module.css`
- Create: `src/app/search/page.tsx`
- Test: `src/lib/search/searchCatalog.test.ts`
- Test: `src/components/search/SearchPalette.test.tsx`

**Interfaces:**
- Consumes: `CatalogRecord[]` from `src/content/catalog.ts`.
- Produces: `searchCatalog(query, records, limit)` and a keyboard-accessible search palette that only routes to local `record.route` values.

- [ ] **Step 1: Write the failing search test**

```ts
import { expect, it } from 'vitest';
import { searchCatalog } from './searchCatalog';

it('ranks exact titles before tag matches and returns only local routes', () => {
  const records = [
    { id: 'rl', slug: 'reinforcement-learning', title: 'Reinforcement Learning', kind: 'page', workspace: 'ai', section: 'domains', route: '/ai/reinforcement-learning', sourceUrl: 'https://fanout.sh/ai/reinforcement-learning', provenanceCheckedAt: '2026-08-24', tags: ['agents'] },
    { id: 'agents', slug: 'agents', title: 'Agent Control Room', kind: 'lab', workspace: 'labs', section: 'labs', route: '/labs/agent-control-room', sourceUrl: 'https://fanout.sh/labs/agent-control-room', provenanceCheckedAt: '2026-08-24', tags: ['reinforcement learning'] },
  ] as const;
  expect(searchCatalog('reinforcement learning', records, 10).map(result => result.route)).toEqual(['/ai/reinforcement-learning', '/labs/agent-control-room']);
});
```

- [ ] **Step 2: Run search tests and verify RED**

Run: `npm test -- src/lib/search/searchCatalog.test.ts`

Expected: FAIL because `searchCatalog` does not exist.

- [ ] **Step 3: Implement deterministic search and the command palette**

Normalize title, section, tags, and summary with lowercase Unicode text. Score exact title `100`, title prefix `70`, title substring `50`, tag match `30`, and summary match `10`; break ties by title. The palette opens with `Meta+K`, traps focus, closes with Escape, and uses Next `<Link>` for results.

```ts
export function searchCatalog(query: string, records: readonly CatalogRecord[], limit = 20): CatalogRecord[] {
  const needle = query.trim().toLocaleLowerCase();
  if (!needle) return [];
  return records
    .map(record => ({ record, score: scoreRecord(needle, record) }))
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score || a.record.title.localeCompare(b.record.title))
    .slice(0, limit)
    .map(item => item.record);
}
```

- [ ] **Step 4: Run search and accessibility tests**

Run: `npm test -- src/lib/search/searchCatalog.test.ts src/components/search/SearchPalette.test.tsx`

Expected: all tests pass.

- [ ] **Step 5: Commit search**

```bash
git add src/content/catalog.ts src/lib/search src/components/search src/app/search
git commit -m "feat: add local catalog search"
```

### Task 5: Enforce source coverage and forbidden-surface checks

**Files:**
- Create: `src/content/source-inventory.json`
- Create: `scripts/verify-coverage.ts`
- Create: `scripts/verify-coverage.test.ts`
- Modify: `package.json`
- Modify: `CHECKLIST.md`

**Interfaces:**
- Consumes: `catalog`, `navigation`, and `source-inventory.json`.
- Produces: `verifyCoverage({ catalog, inventory, navigation })` returning `{ errors: string[]; counts: CoverageCounts }` and a CLI that exits 1 for any error.

- [ ] **Step 1: Write the failing coverage test**

```ts
import { expect, it } from 'vitest';
import { verifyCoverage } from './verify-coverage';

it('reports unmatched source records and forbidden UI labels', () => {
  const result = verifyCoverage({
    catalog: [],
    inventory: [{ sourceUrl: 'https://example.com/paper', localId: 'paper-1', kind: 'paper', checkedAt: '2026-08-24' }],
    navigation: [{ id: 'bad', label: 'Workspace', items: [{ label: 'Pricing', href: '/pricing', icon: 'Lock' }] }],
  });
  expect(result.errors).toEqual([
    'inventory localId missing from catalog: paper-1',
    'forbidden navigation label: Pricing',
    'forbidden navigation route: /pricing',
  ]);
});
```

- [ ] **Step 2: Run the verifier test and verify RED**

Run: `npm test -- scripts/verify-coverage.test.ts`

Expected: FAIL because `verifyCoverage` does not exist.

- [ ] **Step 3: Implement the verifier and seed inventory metadata**

The CLI validates unique inventory URLs, one valid `localId` per inventory item, every catalog route beginning with `/`, all navigation routes resolving to catalog pages, required counts from `CHECKLIST.md`, all 16 YouTube IDs, 108 AI lesson records, 34 public math lesson records, 15 labs, and 30 daily issues. It scans labels and routes for `/pricing`, `/account`, `/login`, `upgrade`, `subscription`, and `dark mode`.

```ts
export interface CoverageCounts {
  inventory: number;
  externalResources: number;
  aiLessons: number;
  aiYoutubeLessons: number;
  mathLessons: number;
  labs: number;
  dailyIssues: number;
}

export function verifyCoverage(input: CoverageInput): { errors: string[]; counts: CoverageCounts } {
  // Build id/route maps, compare inventory, enforce exact requested counts,
  // and return every error so one run exposes the full omission set.
}
```

- [ ] **Step 4: Verify the initial foundation inventory**

Run: `npm test -- scripts/verify-coverage.test.ts && npm run verify:coverage`

Expected: unit test passes; CLI exits 0 for the foundation records and reports later-slice counts as explicitly deferred by plan-owned inventory partitions, not silently omitted.

- [ ] **Step 5: Mark only proven foundation checklist items and commit**

Update `CHECKLIST.md` only for foundation items proven by the commands above.

```bash
git add src/content/source-inventory.json scripts package.json CHECKLIST.md
git commit -m "test: enforce openFanout content coverage"
```

### Task 6: Add browser smoke coverage for the shell and persistence

**Files:**
- Create: `playwright.config.ts`
- Create: `e2e/shell.spec.ts`
- Create: `e2e/progress.spec.ts`
- Create: `e2e/mobile.spec.ts`
- Modify: `CHECKLIST.md`

**Interfaces:**
- Consumes: running Next.js app, stable shell landmarks, and progress controls.
- Produces: desktop, persistence, and 320px mobile browser evidence.

- [ ] **Step 1: Write failing end-to-end tests**

```ts
import { expect, test } from '@playwright/test';

test('loads the AI workspace shell directly', async ({ page }) => {
  await page.goto('/ai/overview');
  await expect(page.getByRole('banner')).toContainText('openFanout');
  await expect(page.getByRole('navigation', { name: 'Course navigation' })).toBeVisible();
  await expect(page.getByText(/pricing|upgrade/i)).toHaveCount(0);
});

test('persists lesson completion after reload', async ({ page }) => {
  await page.goto('/ai/lessons/functions');
  await page.getByRole('button', { name: 'Mark complete' }).click();
  await page.reload();
  await expect(page.getByRole('button', { name: 'Mark incomplete' })).toBeVisible();
});
```

- [ ] **Step 2: Run Playwright and verify RED**

Run: `npm run test:e2e -- e2e/shell.spec.ts e2e/progress.spec.ts e2e/mobile.spec.ts`

Expected: FAIL because curriculum routes and controls are not implemented yet. Keep these tests as cross-slice acceptance tests; do not weaken them.

- [ ] **Step 3: Add a foundation-only smoke assertion and retain cross-slice tests as expected failures**

Add `/` shell coverage that passes in this slice. Tag curriculum-dependent tests with `test.fail()` and a comment naming the exact owning plan (`openfanout-ai-curriculum`) so they become required green tests in that slice.

- [ ] **Step 4: Run the full foundation verification suite**

Run: `npm test && npm run lint && npm run typecheck && npm run build && npm run verify:coverage && npm run test:e2e -- e2e/shell.spec.ts e2e/mobile.spec.ts`

Expected: every command exits 0; curriculum tests are reported as expected failures, not skipped.

- [ ] **Step 5: Commit browser coverage**

```bash
git add playwright.config.ts e2e CHECKLIST.md
git commit -m "test: add openFanout browser smoke coverage"
```

## Execution handoff

After this plan is complete, execute the remaining slices through separate plans in this order:

1. `openfanout-ai-curriculum`
2. `openfanout-math-curriculum`
3. `openfanout-directories`
4. `openfanout-labs`
5. `openfanout-daily-and-final-audit`

Each slice must ingest its live reference records through Computer Use, update `source-inventory.json`, turn its expected-failure browser tests green, and check only the evidence-backed entries in `CHECKLIST.md`.
