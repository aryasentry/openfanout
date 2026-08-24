# openFanout Master Design

## Product intent

openFanout is a local-first, light-mode technical learning library inspired by Fanout's information architecture. It preserves the recognizable workspace shell, dense left navigation, curriculum overview anatomy, resource directories, lesson-to-lesson navigation, public YouTube embeds, labs, and daily-paper browsing while using openFanout branding, different icons, and independently written explanatory copy.

The application is free and local. It contains no pricing, subscription, account, upgrade, paywall, or dark-mode surfaces.

## Clean-room content boundary

The implementation may preserve factual metadata from publicly visible pages: resource names, URLs, paper titles, authors, publication links, lesson titles, section ordering, video IDs, and topic taxonomy. It must not copy Fanout's proprietary prose, locked lesson text, illustrations, logos, or branded assets. Explanations, summaries, prompts, exercises, glossary definitions, and supporting copy are written independently for openFanout.

"Entire content" means every publicly visible record in the requested surfaces is represented in the local catalog, including all public links and embeds. Coverage is proven by a machine-readable source inventory and a verifier, not by visual inspection alone.

## Selected architecture

Use Next.js App Router, TypeScript, React, CSS Modules, Vitest, Testing Library, and Playwright. The application is data-driven and serverless: all catalog data ships as versioned local TypeScript or JSON records, while user state is stored in IndexedDB with a localStorage fallback. No remote database, authentication provider, analytics, payments, or required API is part of the product.

This approach is preferred over a Vite single-page app because the requested URL-by-URL navigation maps naturally to file and dynamic routes, direct links work without hash routing, and static catalog pages remain indexable and testable. It is preferred over hand-written HTML because the shared shell, hundreds of records, lesson navigation, persistence, and interactive labs require reusable typed components.

## Product slices

1. **Foundation shell and content registry** — branding, top bar, collapsible sidebar, responsive drawer, search, routing, page templates, content schemas, persistence, and coverage verifier.
2. **AI curriculum** — overview, 12 modules, all lesson records, 16 public YouTube lessons, previous/next navigation, completion state, and all requested AI discovery pages.
3. **Advanced mathematics** — overview, 12 modules, 34 public lesson routes, Math Decoder, resources, independently written lesson notes, and progress.
4. **Directories and discovery** — community, articles, blogs, roadmap, tools and practice, challenges, glossary, newsletters, learning tracks, official guides, research papers, interview preparation, miscellaneous material, companies/startups, and the deep-learning, machine-learning, reinforcement-learning, and GPU/CUDA domains.
5. **Labs** — a catalog plus 15 local lab routes. Each route must contain a working browser-local interaction appropriate to the named lab; no inert mock cards.
6. **Daily papers** — archive, calendar/list navigation, and the 30 unique issue routes visible in the 2026-08-24 source snapshot, with citation metadata, source links, original summaries, and local read/saved state.

All slices share one typed catalog and one persistence API. They are implemented and reviewed separately so completeness failures in one slice do not hide behind another.

## Information architecture and routes

### Global

- `/` — openFanout home and resume surface
- `/search` — cross-catalog search results
- `/labs` and `/labs/[slug]`
- `/daily` and `/daily/[slug]`
- `/companies`
- `/study-with-me`

### AI workspace

- `/ai/overview`
- `/ai/resources`
- `/ai/community`
- `/ai/articles`
- `/ai/blogs`
- `/ai/roadmap`
- `/ai/tools`
- `/ai/claude-code`
- `/ai/system-design`
- `/ai/hardware`
- `/ai/challenges`
- `/ai/glossary`
- `/ai/newsletters`
- `/ai/tracks`
- `/ai/guides`
- `/ai/papers`
- `/ai/interviews`
- `/ai/jobs`
- `/ai/misc`
- `/ai/newbies`
- `/ai/deep-learning`
- `/ai/machine-learning`
- `/ai/reinforcement-learning`
- `/ai/gpu`
- `/ai/lessons/[slug]`

The sidebar includes Study with me, Claude Code, System Design, Hardware, Jobs, and Newbies because they are part of the public AI workspace taxonomy. Their public records receive local routes and the same clean-room catalog treatment as the other discovery pages.

### Mathematics workspace

- `/ml-math/overview`
- `/ml-math/decoder`
- `/ml-math/resources`
- `/ml-math/lessons/[slug]`

No route may lead to pricing, account, login, subscription, checkout, or an external Fanout page. External learning resources and original paper/video sources open in a new tab with safe link attributes.

## Visual system

The desktop interface preserves the reference product's recognizable anatomy:

- a 64px white top bar with product switcher, workspace switcher, breadcrumb, and command-search trigger;
- a 244px fixed left workspace sidebar with grouped labels, compact monochrome line icons, selected-row highlight, and an independent scroll area;
- a pale neutral content canvas with a centered main column;
- compact monospaced display headings, neutral sans-serif body/UI text, thin borders, restrained shadows, small radii, and dense curriculum rows;
- overview pages composed from an intro block, access/progress callout, curriculum structure grid, resume strip, and expanded module sections;
- lesson pages with sticky course navigation, media or reading content, completion controls, and previous/next links;
- directory pages using compact lists, tables, and grouped rows rather than generic card grids.

Brand differences are intentional: the name is `openFanout`, the mark is an original branching-node symbol, icons come from Lucide, accent colors use cobalt and mint rather than the source's pink archive motif, and all illustrations are original. There is no dark-mode toggle or dark palette.

### Responsive behavior

- At widths below 1024px the sidebar becomes an overlay drawer opened from the top bar.
- At widths below 720px the curriculum grid becomes a single list, top-bar labels collapse, media remains 16:9, and previous/next navigation stacks.
- Primary content must remain usable at 320px without horizontal scrolling.

## Component boundaries

- `AppShell` owns the top bar, sidebar, breadcrumbs, and content viewport.
- `WorkspaceSidebar` consumes a typed navigation tree and never hardcodes route-specific content.
- `CatalogPage` renders grouped link, publication, community, tool, company, newsletter, and glossary records through explicit variants.
- `CurriculumOverview` renders modules, availability, progress, and resume state.
- `LessonReader` renders original notes, public embeds, citations, completion, and previous/next navigation.
- `DailyArchive` and `DailyIssue` render the paper calendar and issue records.
- `LabCatalog` and individual lab components own browser-local simulations.
- `SearchPalette` searches the normalized catalog and routes directly to local pages.
- `ProgressStore` is the sole interface to IndexedDB/localStorage.
- `CoverageVerifier` compares source inventory records against shipped catalog records and fails CI on omissions, duplicate IDs, broken local routes, or missing source URLs.

## Content model

Every record has a stable `id`, `slug`, `title`, `kind`, `workspace`, `section`, `sourceUrl`, and `provenanceCheckedAt`. Optional fields include authors, year, publisher, external URL, YouTube embed URL, tags, difficulty, original summary, original notes, citations, and lab configuration.

Curriculum modules contain ordered lesson IDs. Lesson navigation is derived from module order, never duplicated manually. External resources are normalized by canonical URL so the same link can appear in multiple categories without becoming multiple source records.

The source inventory records every discovered public item and the local catalog ID that implements it. `CHECKLIST.md` is the human-readable execution ledger; automated coverage output is the authoritative completeness proof.

## Local progress and saved state

Persistent state includes:

- lesson read/completed state;
- per-workspace and per-module completion percentages;
- last-opened lesson and resume destination;
- saved resources and papers;
- daily issues read;
- lab inputs and most recent valid result where useful;
- sidebar collapsed groups and search recents.

The persistence layer versions its schema and migrates forward. Corrupt or unavailable IndexedDB falls back to localStorage and surfaces a non-blocking warning. A settings action exports progress as JSON and imports a validated backup. Clearing progress requires an explicit confirmation.

## Labs acceptance contract

The 15 lab routes are Math Decoder, Agent Control Room, Latency Numbers, Tokenizer and Context, RAG Chunking and Retrieval, Inference Memory and KV Cache, Fanout Scale, Eval Confidence, Gradient Descent, Sampling Playground, Timeout Architect, How AI Remembers, Daily Planner, Model Router and Pareto Explorer, and PDF-to-RAG Readiness Scan.

Each lab must expose editable inputs, compute or simulate a real result locally, explain the result, survive refresh where appropriate, and have focused unit tests. Live-provider claims from the reference are not copied; labs that would normally need an API use deterministic bundled datasets or clearly labeled local calculations.

## Error handling

- Unknown routes render a branded 404 with links to AI, mathematics, labs, and daily papers.
- Missing catalog records fail the production build through the coverage verifier.
- Invalid external URLs are reported by the link audit and excluded from unsafe rendering.
- Failed YouTube embeds retain the video title and offer a direct YouTube link.
- Persistence failures preserve in-memory operation and show one dismissible warning.
- Invalid imported progress is rejected without overwriting existing state.

## Testing and verification

1. Schema and registry unit tests cover IDs, slugs, canonical URLs, module ordering, and lesson adjacency.
2. Persistence tests cover save, reload, migration, fallback, import, and export.
3. Component tests cover active navigation, completion controls, search, responsive sidebar behavior, embeds, and previous/next navigation.
4. Each lab has calculation/simulation tests and one interaction test.
5. Coverage tests assert source-to-local parity for every requested page, external resource, AI video, math lesson, lab, and daily issue.
6. Playwright tests cover direct page loads, desktop and mobile navigation, refresh persistence, search, one AI lesson, one math lesson, one lab, and one daily issue.
7. Browser review compares the accepted clean-room concept against implementation screenshots at desktop and mobile sizes.
8. Final audit runs tests, lint, type-check, production build, coverage verifier, local-link crawl, external-link sample check, and browser smoke tests.

## Explicit exclusions

- Dark mode
- Pricing, subscriptions, checkout, paywalls, login, account management, and entitlement checks
- Fanout name, logo, illustrations, proprietary prose, or locked course text
- Analytics, advertising, tracking pixels, and cookies
- Required cloud services

## Completion definition

The project is complete only when every item in `CHECKLIST.md` is checked with evidence, the source inventory has no unmatched requested records, all local routes resolve, public YouTube embeds and resource links are present, progress survives reload, all labs perform real local interactions, no pricing/account/dark-mode UI exists, and the full verification suite passes from a clean install.
