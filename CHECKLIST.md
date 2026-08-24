# openFanout Coverage Checklist

This file is the human-readable completion ledger. Do not mark an item complete without current evidence from source inventory, tests, a successful build, or browser verification.

## Foundation

- [x] Next.js TypeScript project and light-only design tokens
- [x] openFanout branding and original branching-node mark
- [x] Reference-like top bar, 244px desktop sidebar, breadcrumbs, and content canvas
- [x] Responsive sidebar drawer and mobile layouts down to 320px
- [x] Typed catalog registry and source inventory
- [x] Cross-catalog search and command palette
- [x] IndexedDB persistence with localStorage fallback
- [x] Progress JSON export/import
- [ ] Coverage verifier and local-route crawler
- [x] No pricing, login, account, paywall, upgrade, subscription, or dark-mode UI

Foundation evidence (2026-08-24): schema and shell component tests passed; TypeScript, ESLint, and the Next.js production build passed; Chrome Computer Use comparison against `fanout.sh/ai/overview` confirmed desktop shell proportions and content hierarchy. Responsive and real-browser persistence claims remain unchecked until browser acceptance tests exist.

Persistence evidence (2026-08-24): four storage tests prove cross-instance IndexedDB reload, complete JSON export/import, non-destructive schema rejection, and localStorage fallback. A real-browser reload remains a separate final-verification item.

Search evidence (2026-08-24): deterministic ranking, local-link, dialog, Escape, and command-shortcut tests passed. Chrome Computer Use opened the palette from the real top-bar control and resolved `cuda` directly to the local `/ai/gpu` route.

Coverage evidence (2026-08-24): the verifier matched all 26 foundation page records to their source inventory, rejected duplicate URLs and forbidden routes in tests, and reported every unbuilt content partition as an explicit deferred count. Deferred partitions are not completion claims and remain unchecked below.

Browser evidence (2026-08-24): Playwright passed desktop shell/search and 320px drawer/no-overflow checks. Desktop and mobile screenshots were inspected against the generated design concept and saved under `design/screenshots/`. The lesson-reload acceptance test remains an explicit expected failure owned by the AI curriculum slice.

## AI workspace pages

- [ ] `/ai/overview`
- [ ] `/ai/resources`
- [ ] `/ai/community`
- [ ] `/ai/articles`
- [ ] `/ai/blogs`
- [ ] `/ai/roadmap`
- [ ] `/ai/tools`
- [ ] `/ai/claude-code`
- [ ] `/ai/system-design`
- [ ] `/ai/hardware`
- [ ] `/ai/challenges`
- [ ] `/ai/glossary`
- [ ] `/ai/newsletters`
- [ ] `/ai/tracks`
- [ ] `/ai/guides`
- [ ] `/ai/papers`
- [ ] `/ai/interviews`
- [ ] `/ai/jobs`
- [ ] `/ai/misc`
- [ ] `/ai/newbies`
- [ ] `/study-with-me`
- [ ] `/companies`
- [ ] `/ai/deep-learning`
- [ ] `/ai/machine-learning`
- [ ] `/ai/reinforcement-learning`
- [ ] `/ai/gpu`
- [ ] Source inventory contains at least the 455 unique external resources already mapped, plus every additional record discovered on the remaining requested pages
- [ ] Coverage verifier reports zero unmatched records from the final source snapshot
- [ ] Independently written copy for every local catalog group and definition

## AI curriculum modules

- [ ] 01 Math Fundamentals — 15 lesson records
- [ ] 02 Core AI Intuitions — 4 lesson records
- [ ] 03 PyTorch Fundamentals — 9 lesson records
- [ ] 04 TensorFlow Fundamentals — 27 lesson records
- [ ] 05 Neural Network from Scratch — 7 lesson records
- [ ] 06 Transformers — 3 lesson records
- [ ] 07 Reinforcement Learning — 5 lesson records
- [ ] 08 LLM From Scratch — 4 lesson records
- [ ] 09 Write Research Paper — 1 lesson record
- [ ] 10 How to Fine-Tune Models — 5 lesson records
- [ ] 11 Machine Learning Operations — 25 lesson records
- [ ] 12 Bonus Lessons — 3 lesson records
- [ ] All 108 lesson titles represented in module order
- [ ] Previous/next navigation across module boundaries
- [ ] Completion, resume, and module progress persistence

## AI public YouTube lessons

- [ ] Functions — `kvGsIo1TmsM`
- [ ] Derivatives — `9vKqVkMQHKk`
- [ ] Vectors — `fNk_zzaMoSs`
- [ ] Gradients — `vp2oUoBDH4w`
- [ ] Matrices — `5H4crNlLK_A`
- [ ] Hadamard Product — `_MaVzNUjMPk`
- [ ] Moving Averages — `lAq96T8FkTw`
- [ ] 7 PyTorch Tasks — `QtlDV2r1ryE`
- [ ] PPO and LLM Reasoning — `TjHH_--7l8g`
- [ ] Qwen GSPO and DeepSeek GRPO — `L94MdLdP21s`
- [ ] Llama 4 From Scratch — `yXbF-1n9wxs`
- [ ] AI Research Paper Workflow — `O2yAMJu8LpI`
- [ ] ML Pipeline with DVC and AWS S3 — `oYIBwbHM_PI`
- [ ] Sequence Length vs Batch Size — `bu5dhaLmr7E`
- [ ] SwiGLU — `enPFr-WxHgQ`
- [ ] Tiny Recursive Model — `P9zzUM0PrBM`

## Advanced mathematics workspace

- [ ] `/ml-math/overview`
- [ ] `/ml-math/decoder`
- [ ] `/ml-math/resources`
- [ ] 01 Set Language for Machine Learning — 14 lessons
- [ ] 02 Logic for Precise Reasoning — 5 lessons
- [ ] 03 Linear Systems and Geometric Maps — 1 lesson
- [ ] 04 Vector Spaces, Bases, and Rank — 2 lessons
- [ ] 05 Spectral Thinking and Diagonalization module represented with original open notes
- [ ] 06 Orthogonality and Projections — 1 lesson
- [ ] 07 Low-Rank Structure and Quadratic Geometry — 4 lessons
- [ ] 08 Linear Algebra in Models — 2 lessons
- [ ] 09 Multivariable Calculus for Learning — 1 lesson
- [ ] 10 Reasoning Under Uncertainty — 2 lessons
- [ ] 11 Joint Distributions and Covariance — 2 lessons
- [ ] 12 Statistical Estimation from Samples module represented with original open notes
- [ ] All 34 public lesson routes represented
- [ ] Original explanations, examples, citations, and previous/next navigation
- [ ] Completion, resume, and module progress persistence

## Mathematics public lesson routes

- [ ] Special Sets and the Number-System Ladder
- [ ] Equivalent Sets
- [ ] Building Sets by Listing Members
- [ ] Building Sets with Membership Conditions
- [ ] Set-Builder Notation
- [ ] Planar Regions in Set-Builder Form
- [ ] Indicator Functions
- [ ] Indicator Functions for Predicates
- [ ] The Cartesian Product
- [ ] Cartesian Products as Regions
- [ ] Interior and Boundary Points
- [ ] Supremum and Infimum
- [ ] Argmax and Argmin Notation
- [ ] Reading Argmax and Argmin from Data
- [ ] Truth Tables
- [ ] De Morgan's Laws for Logic
- [ ] Truth Sets of Predicates
- [ ] Boolean Functions
- [ ] Boolean Functions and Logical Operations
- [ ] The Image of an Affine Transformation
- [ ] Change-of-Coordinates Matrices
- [ ] Converting Between Bases
- [ ] Distance-Preserving Linear Maps
- [ ] Singular Values as Matrix Stretch
- [ ] Computing Matrix Singular Values
- [ ] SVD for 2x2 Matrices
- [ ] SVD with Zero or Repeated Eigenvalues
- [ ] Introduction to Principal Component Analysis
- [ ] How PCA Connects to SVD
- [ ] Gradients over Selected Variables
- [ ] Many-to-One Transforms of Discrete Variables
- [ ] CDF Methods for Many-to-One Transforms
- [ ] Conditional Variance for Continuous Variables
- [ ] Transforming Expectations for Two Variables

## Labs

- [ ] Labs catalog
- [ ] Math Decoder
- [ ] Agent Control Room
- [ ] Latency Numbers
- [ ] Tokenizer and Context
- [ ] RAG Chunking and Retrieval
- [ ] Inference Memory and KV Cache
- [ ] Fanout Scale
- [ ] Eval Confidence
- [ ] Gradient Descent
- [ ] Sampling Playground
- [ ] Timeout Architect
- [ ] How AI Remembers
- [ ] Daily Planner
- [ ] Model Router and Pareto Explorer
- [ ] PDF-to-RAG Readiness Scan
- [ ] Every lab has editable inputs, real local output, explanations, persistence where useful, and tests

## Daily papers

- [ ] Daily archive and month navigation
- [ ] Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks
- [ ] Fast Inference from Transformers via Speculative Decoding
- [ ] The Tail at Scale
- [ ] Distilling the Knowledge in a Neural Network
- [ ] Switch Transformers
- [ ] Training Language Models to Follow Instructions with Human Feedback
- [ ] Proximal Policy Optimization Algorithms
- [ ] DeepSeekMath and GRPO
- [ ] Grouped-Query Attention
- [ ] Orca continuous batching
- [ ] ZeRO memory optimization
- [ ] RMSNorm
- [ ] Mamba selective state spaces
- [ ] FlashAttention-2
- [ ] Ring Attention
- [ ] ReAct
- [ ] PageRank
- [ ] Stealing Reasoning Traces from Proprietary LLM APIs
- [ ] Congestion Avoidance and Control
- [ ] Bitcoin
- [ ] AlphaGo
- [ ] Tor
- [ ] Bloom filters
- [ ] Chain-of-Thought Prompting
- [ ] Shazam audio search
- [ ] Toolformer
- [ ] End-to-End Arguments in System Design
- [ ] Development of the Domain Name System
- [ ] CLIP
- [ ] Large-scale cluster management at Google with Borg
- [ ] Source inventory confirms all 30 unique daily issues in the 2026-08-24 source snapshot
- [ ] Each issue has citation metadata, source link, original summary, and read/saved state

## Final verification

- [ ] Unit and component tests pass
- [ ] Every lab test passes
- [ ] Persistence survives a real browser reload
- [ ] Type-check and lint pass without warnings
- [ ] Production build succeeds from a clean install
- [ ] Coverage verifier reports zero unmatched requested records
- [ ] Local-route crawl reports zero broken routes
- [ ] External-link audit samples every catalog category
- [ ] Desktop visual review completed
- [ ] Tablet visual review completed
- [ ] 320px mobile visual review completed
- [ ] All public YouTube embeds load or expose a working fallback link
- [ ] No forbidden pricing/account/dark-mode surface exists
