# openFanout Advanced Mathematics Implementation Plan

**Goal:** Recreate the observed Fanout mathematics workspace structure as an original, local-first implementation with all 34 public lesson routes, dense mathematical topic symbols, open notes for all twelve modules, useful decoder/resources pages, and persisted progress.

**Clean-room boundary:** Preserve observed factual titles, ordering, counts, public route identifiers, and public links. Write all explanations, examples, interactions, icons, and artwork independently. Do not reproduce restricted copy, assets, pricing, account, paywall, or theme controls.

## Task 1: Lock the source map in tests

- Add a typed mathematics registry test covering 12 modules, group order, exact public lesson titles, exact observed source slugs, 34 unique local routes, and symbols.
- Add neighbor tests that cross module boundaries.
- Run the focused test and confirm it fails before implementation.

## Task 2: Build the curriculum registry and navigation

- Add 12 mathematics modules and 34 lesson records with independently written summaries, examples, equations, practice prompts, and public references.
- Add mathematics workspace navigation for Overview, Math Decoder, and Resources.
- Add math lessons to the unified catalog and source inventory.
- Remove `mathLessons` from deferred coverage and lock the expected module sequence.

## Task 3: Match the observed mathematics overview hierarchy

- Add the compact course hero, two statistics, original math-folder artwork, three-column course map, and full grouped curriculum.
- Render a meaningful mathematical symbol for every public lesson row.
- Represent Spectral Thinking and Statistical Estimation as original open-note module sections without inventing public lesson routes.
- Add component tests for the 12 modules, 34 routes, groups, symbols, and forbidden-surface absence.

## Task 4: Add lesson reading and persistence

- Generalize the lesson reader for both workspaces.
- Add static mathematics lesson routes with metadata and 404 handling.
- Preserve completion, resume, module progress, and previous/next navigation.
- Add focused component tests and a real-browser reload test.

## Task 5: Add Math Decoder and Resources

- Build a local symbol/phrase decoder with editable input and deterministic explanation output.
- Build an original resources page with public references grouped by topic.
- Add unit/component tests for both pages.

## Task 6: Visual and production verification

- Generate and integrate detailed original mathematics artwork.
- Compare the live Fanout overview and the local route through Computer Use.
- Run unit tests, coverage verifier, typecheck, lint, production build, and Playwright.
- Inspect desktop and 320px screenshots, then mark only evidence-backed checklist items.
