# openFanout Foundation Visual Specification

Concept: `design/concepts/openfanout-ai-overview.png` (1629 × 965)

## Locked composition

- 64px true-white top bar.
- 244px true-white fixed desktop sidebar with independent scrolling.
- Cool-gray `#f6f7f8` content canvas and centered content column.
- First viewport order: intro and branching-library illustration, open-curriculum callout, 12-module structure panel, Continue Learning strip, start of expanded first module.
- At 1024px and below the sidebar becomes a drawer; at 720px and below the module grid becomes one column.

## Allowed first-viewport copy

- openFanout
- AI
- Overview
- Search
- AI Research archive
- A structured path from math foundations to advanced AI research, with code, theory, and practice at every step.
- Your open curriculum
- 108 lessons, always available
- Start reading
- Curriculum structure
- Continue Learning
- Functions
- 0% complete
- Resume
- The 12 approved module names from `CHECKLIST.md`
- The approved sidebar labels from `CHECKLIST.md` and the master spec

No additional hero eyebrow, badge, metric, account label, pricing copy, lock label, or dark-mode copy is allowed.

## Tokens

- Canvas: `#f6f7f8`
- Surface and navigation: `#ffffff`
- Muted surface: `#f1f3f5`
- Primary text: `#17191c`
- Muted text: `#69717c`
- Border: `#e2e5e9`
- Cobalt: `#315efb`
- Cobalt-soft: `#e9efff`
- Mint: `#dff6ea`
- Mint-strong: `#45c98b`
- Radius: 8px controls/panels, 6px compact rows
- Shadow: `0 1px 2px rgb(15 23 42 / 7%)`
- UI type: Inter/system sans, 12–14px controls, 14–16px body
- Display type: IBM Plex Mono/system mono, 28–32px H1, 16–18px panel headings

## Icon inventory

- Brand: custom branching-node SVG, cobalt stroke, 1.75px, 28px.
- Topbar: Search, ChevronDown, Menu, X from Lucide, 1.5px stroke.
- Workspace/sidebar: House, Library, Users, Video, Newspaper, FileText, Map, Wrench, Code, Network, Cpu, Trophy, BookOpen, Mail, Route, BadgeHelp, Files, BriefcaseBusiness, Sparkles, GraduationCap, Building2, Brain, ChartNoAxesCombined, Repeat2, Microchip.
- Module rows: use one restrained Lucide icon per module in a 32px cobalt-soft square.
- Directional controls: Lucide ChevronRight; never text arrows.
- Selected sidebar row: cobalt icon/text, cobalt 2px left rail, cobalt-soft background.

## Component families

- `TopBar`: brand, workspace switcher, breadcrumb, search trigger, mobile menu button.
- `WorkspaceSidebar`: labeled groups, 36px navigation rows, 40px curriculum rows.
- `Intro`: monospaced title, one paragraph, branching illustration.
- `OpenCurriculumCallout`: open-book icon, two text lines, cobalt primary button.
- `ModuleGrid`: 3 columns desktop, 2 tablet, 1 mobile; compact bordered rows.
- `ResumeStrip`: lesson identity, completion text/progress line, dark action button.
- `ModuleSection`: open list container with rows, status, duration, and chevron.

## Interaction and motion

- Hover: border/text shifts toward cobalt; no elevation jump.
- Focus: 2px cobalt ring with 2px offset.
- Sidebar drawer: 180ms ease-out translate; reduced motion disables translation animation.
- Search opens with Meta+K and closes with Escape.
- Progress updates visibly and persists locally.

## Intentional clean-room deviations

- openFanout name and branching-node mark.
- Cobalt/mint accents replace the source’s branded illustration treatment.
- Lucide-style icons replace source icons.
- No account, dark mode, pricing, locked rows, upgrade prompts, or feedback widget.
- Supporting prose is original.
