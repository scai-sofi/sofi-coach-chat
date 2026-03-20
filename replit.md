# Workspace

## IMPORTANT: Mobile Prototype for Flutter Conversion

This is a **mobile app prototype** built in Expo/React Native because Replit does not support Flutter and we do not have access to SoFi's Pacific Flutter component library here. The goal is NOT to ship this React Native code — it is to prototype the UX, interactions, and AI integration so that a mobile engineer can easily pick it up and convert it into Flutter using the Pacific component library.

**All development decisions must prioritize Flutter portability:**
- Use only standard React Native APIs — no web-only CSS (`boxShadow`, `caretColor`, `cursor`, etc.)
- No `Platform.OS === 'web'` branches in component/UI code
- No `window.*` or `document.*` browser APIs
- Keep components, state, and styling clean and well-documented
- Every color, spacing value, font weight, and layout dimension should be explicitly defined so the Flutter engineer can replicate them exactly
- SVG icon paths are provided inline so they can be converted to Flutter `CustomPaint` or SVG assets
- API contracts (endpoints, request/response shapes) are documented for the backend integration

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Structure

```text
artifacts-monorepo/
├── artifacts/              # Deployable applications
│   └── api-server/         # Express API server
├── lib/                    # Shared libraries
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── scripts/                # Utility scripts (single workspace package)
│   └── src/                # Individual .ts scripts, run via `pnpm --filter @workspace/scripts run <script>`
├── pnpm-workspace.yaml     # pnpm workspace (artifacts/*, lib/*, lib/integrations/*, scripts)
├── tsconfig.base.json      # Shared TS options (composite, bundler resolution, es2022)
├── tsconfig.json           # Root TS project references
└── package.json            # Root package with hoisted devDeps
```

## TypeScript & Composite Projects

Every package extends `tsconfig.base.json` which sets `composite: true`. The root `tsconfig.json` lists all packages as project references. This means:

- **Always typecheck from the root** — run `pnpm run typecheck` (which runs `tsc --build --emitDeclarationOnly`). This builds the full dependency graph so that cross-package imports resolve correctly. Running `tsc` inside a single package will fail if its dependencies haven't been built yet.
- **`emitDeclarationOnly`** — we only emit `.d.ts` files during typecheck; actual JS bundling is handled by esbuild/tsx/vite...etc, not `tsc`.
- **Project references** — when package A depends on package B, A's `tsconfig.json` must list B in its `references` array. `tsc --build` uses this to determine build order and skip up-to-date packages.

## Root Scripts

- `pnpm run build` — runs `typecheck` first, then recursively runs `build` in all packages that define it
- `pnpm run typecheck` — runs `tsc --build --emitDeclarationOnly` using project references

## Packages

### `artifacts/api-server` (`@workspace/api-server`)

Express 5 API server. Routes live in `src/routes/` and use `@workspace/api-zod` for request and response validation and `@workspace/db` for persistence.

- Entry: `src/index.ts` — reads `PORT`, starts Express
- App setup: `src/app.ts` — mounts CORS, JSON/urlencoded parsing, routes at `/api`
- Routes: `src/routes/index.ts` mounts sub-routers; `src/routes/health.ts` exposes `GET /healthz`; `src/routes/chat.ts` exposes `POST /chat` (full path: `/api/chat`) — AI financial coach endpoint using OpenAI via Replit AI Integrations proxy, with in-memory rate limiting (20 req/min per IP) and input validation
- Depends on: `@workspace/db`, `@workspace/api-zod`, `@workspace/integrations-openai-ai-server`
- `pnpm --filter @workspace/api-server run dev` — run the dev server
- `pnpm --filter @workspace/api-server run build` — production esbuild bundle (`dist/index.cjs`)
- Build bundles an allowlist of deps (express, cors, pg, drizzle-orm, zod, etc.) and externalizes the rest

### `lib/db` (`@workspace/db`)

Database layer using Drizzle ORM with PostgreSQL. Exports a Drizzle client instance and schema models.

- `src/index.ts` — creates a `Pool` + Drizzle instance, exports schema
- `src/schema/index.ts` — barrel re-export of all models
- `src/schema/<modelname>.ts` — table definitions with `drizzle-zod` insert schemas (no models definitions exist right now)
- `drizzle.config.ts` — Drizzle Kit config (requires `DATABASE_URL`, automatically provided by Replit)
- Exports: `.` (pool, db, schema), `./schema` (schema only)

Production migrations are handled by Replit when publishing. In development, we just use `pnpm --filter @workspace/db run push`, and we fallback to `pnpm --filter @workspace/db run push-force`.

### `lib/api-spec` (`@workspace/api-spec`)

Owns the OpenAPI 3.1 spec (`openapi.yaml`) and the Orval config (`orval.config.ts`). Running codegen produces output into two sibling packages:

1. `lib/api-client-react/src/generated/` — React Query hooks + fetch client
2. `lib/api-zod/src/generated/` — Zod schemas

Run codegen: `pnpm --filter @workspace/api-spec run codegen`

### `lib/api-zod` (`@workspace/api-zod`)

Generated Zod schemas from the OpenAPI spec (e.g. `HealthCheckResponse`). Used by `api-server` for response validation.

### `lib/api-client-react` (`@workspace/api-client-react`)

Generated React Query hooks and fetch client from the OpenAPI spec (e.g. `useHealthCheck`, `healthCheck`).

### `scripts` (`@workspace/scripts`)

Utility scripts package. Each script is a `.ts` file in `src/` with a corresponding npm script in `package.json`. Run scripts via `pnpm --filter @workspace/scripts run <script>`. Scripts can import any workspace package (e.g., `@workspace/db`) by adding it as a dependency in `scripts/package.json`.

### `lib/integrations-openai-ai-server` (`@workspace/integrations-openai-ai-server`)

OpenAI integration via Replit AI Integrations proxy. Provides pre-configured OpenAI SDK client using `AI_INTEGRATIONS_OPENAI_BASE_URL` and `AI_INTEGRATIONS_OPENAI_API_KEY` env vars (auto-provisioned, no user API key needed). Exports `openai` client instance plus image/audio/batch utilities.

### `artifacts/mobile` (`@workspace/mobile`)

Expo/React Native mobile app — "SoFi Coach Chat", an interactive AI financial coach chat interface. Supports both demo scenarios (mock data) and live AI chat mode (real OpenAI responses via API server).

- **Entry**: `app/index.tsx` — single-screen chat interface
- **Layout**: `app/_layout.tsx` — wraps app with CoachProvider, KeyboardProvider, SafeAreaProvider
- **State**: `context/CoachContext.tsx` — all state management (messages, memories, goals, panels, scenarios, chat mode)
  - `chatMode`: `'demo' | 'live'` — demo uses mock responses, live calls API server
  - `startLiveChat()`: switches to live mode, clears conversation
  - `sendLiveMessage()`: sends user message + history to `POST /api/chat`, handles errors/abort
  - `getApiBaseUrl()`: resolves API URL for web (handles Expo dev domain → dev domain mapping) and native
- **Constants**: `constants/types.ts` (type system), `constants/colors.ts` (SoFi brand palette), `constants/scenarios.ts` (10 demo scenarios), `constants/aiResponse.ts` (keyword-matching AI responses)
- **Components**: `ChatHeader` (demo banner when in demo mode), `InputBar`, `MessageBubble` (chips, proposals, safety tiers), `MemoryCenter` (CRUD), `GoalsDashboard` (SVG progress rings), `ScenarioSwitcher`, `TypingIndicator`, `EmptyChat`
- **Features**: **Live AI Chat** (default — real OpenAI responses via API server with financial coach system prompt), 10 pre-built demo scenarios (secondary — accessed via Demos FAB), Memory Center (CRUD for coach memories), Goals Dashboard (progress rings, milestones), message chips/proposals/safety tiers, temporary chat mode, scenario switcher panel
- **Mode design**: Live chat is the default with no visual indicators. Demo mode shows a subtle "Demo · [Scenario Name]" banner below the header with × to exit back to live. "New chat" in menu always returns to live mode.
- **Typography**: TT Norms font family (Regular, Medium, Bold, Italic, BoldItalic) loaded via expo-font from `assets/fonts/`
- **Design**: SoFi brand colors (#faf8f5 base, #1a1919 primary), matched to Figma spec (file key: 8c5TuXaL1MvZh2rkkf1e1Y)
- **Font config**: `constants/fonts.ts` exports `Fonts` object with named keys (regular, medium, bold, italic, boldItalic)
- **Default state**: Opens in live chat mode (empty conversation, ready to chat with AI)
- **Run**: `pnpm --filter @workspace/mobile run dev`

## Flutter Migration Guide

This prototype uses only standard React Native APIs (no web-only CSS properties). Every component maps cleanly to Flutter widgets.

### Design Tokens (`constants/colors.ts`)

| Token | Value | Usage |
|---|---|---|
| `surfaceBase` | `#FAF8F5` | App background, header background |
| `contentPrimary` | `#1A1919` | Primary text, icon fills |
| `contentSecondary` | `#706F6E` | Secondary text, placeholders |
| `contentBone600` | `#5C5B5A` | User message bubble bg, cursor/caret color, send button bg |
| `surfaceTint` | `#F0EEEB` | Chip backgrounds, proposal cards, demo banner |
| `surfaceMuted` | `#E6E4E1` | Muted surface areas |

### Typography (`constants/fonts.ts`)

| Weight | Font Family | Usage |
|---|---|---|
| Regular (400) | TT Norms Regular | Body text, input, placeholders |
| Medium (500) | TT Norms Medium | Headers, labels, buttons |
| Bold (700) | TT Norms Bold | Emphasis (rarely used) |

### Spacing & Layout

| Element | Value |
|---|---|
| Body text `fontSize` | 16 |
| Body text `lineHeight` | 20 |
| Section header `fontSize` | 18 |
| Section header `lineHeight` | 24 |
| Between-line gap (within paragraph) | 8 |
| Between-paragraph gap | 16 (8 gap + 8 spacer) |
| Between-bullet-list gap | 16 (same) |
| Header bar height | 44 |
| Header left/right zone width | 104 |
| Input pill `minHeight` | 48 |
| Input text `minHeight` | 32 |
| Input `paddingVertical` | 6 |
| Input `maxHeight` (multiline) | 96 |
| Card `borderRadius` | 16 |
| Pill/bubble `borderRadius` | 24 |
| Icon button size | 24×24 |

### Component → Flutter Widget Mapping

| React Native Component | Flutter Widget | Key File |
|---|---|---|
| `ChatHeader` | `AppBar` or custom `Container` | `components/ChatHeader.tsx` |
| `InputBar` | `TextField` in `Container` | `components/InputBar.tsx` |
| `MessageBubble` | `Container` with `BoxDecoration` | `components/MessageBubble.tsx` |
| `EmptyChat` | `Column` with animated orb | `components/EmptyChat.tsx` |
| `ChatHistory` | `Scaffold` with `ListView` | `components/ChatHistory.tsx` |
| `TypingIndicator` | `AnimatedBuilder` with dots | `components/TypingIndicator.tsx` |
| `MemoryCenter` | `Scaffold` with `ListView` | `components/MemoryCenter.tsx` |
| `GoalsDashboard` | `CustomPaint` for progress rings | `components/GoalsDashboard.tsx` |
| `ScenarioSwitcher` | `BottomSheet` with `ListView` | `components/ScenarioSwitcher.tsx` |

### API Endpoints

| Endpoint | Method | Body | Response | Purpose |
|---|---|---|---|---|
| `/api/chat` | POST | `{ message: string, history: [{role, content}] }` | `{ reply: string }` | AI chat (GPT-4o-mini) |
| `/api/title` | POST | `{ messages: [{role, content}] }` | `{ title: string }` | Auto-generate session title |
| `/api/healthz` | GET | — | `{ status: "ok" }` | Health check |

### Chat Message Rendering (Block-Based Architecture in `MessageBubble.tsx`)

Content rendering uses a **parse → render** pipeline for clean extensibility:

**Step 1: Parse** — `parseContentBlocks(content)` converts raw markdown text into typed `ContentBlock[]`:
- `{ type: 'text', text, paragraphGap }` — body paragraph
- `{ type: 'bullet', text, paragraphGap }` — bullet or numbered list item (`-` auto-converted to `•`)
- `{ type: 'header', text }` — section header (lines starting with `**` or `N. **`)
- `{ type: 'divider' }` — horizontal rule before headers

**Step 2: Render** — `renderBlock(block, index)` dispatches each block to its dedicated component:
- `TextBlock` / `BulletBlock` / `HeaderBlock` / `BlockDivider`
- Inline bold (`**text**`) handled by shared `formatInlineStyles()` utility

**Spacing**: Container `gap: 8` + `marginTop: 8` on paragraph breaks = exactly **16px** between paragraphs.

**To add a new widget type** (e.g. chart, card, action button):
1. Add a new variant to the `ContentBlock` union type
2. Create a new block component (e.g. `ChartBlock`)
3. Add a case to `renderBlock`
4. Add detection logic to `parseContentBlocks`

Flutter equivalent: `ContentBlock` → sealed class, each block → a `Widget`, `renderBlock` → pattern match in `ListView.builder`

### Header Behavior

| State | Left Icon | Center Title | Right Icons |
|---|---|---|---|
| Welcome (no messages) | Beaker/demo icon (opens scenario picker) | "Coach" | Clock (history) |
| Active chat | × close (saves & returns to welcome) | AI-generated title | Clock + More (⋯ in circle) |
| Demo mode | × close (saves & returns) | Scenario title | Clock + More |

### Chat History Panel

- Slides in from right (300ms, cubic-bezier 0.4/0/0.2/1)
- Sessions grouped by month, sorted newest first
- Search filters by title
- Session dividers: 0.75px, `rgba(10,10,10,0.06)`
- Card border: 0.75px, `rgba(10,10,10,0.06)`

### Custom SVG Icons (exact paths in `ChatHeader.tsx`, `ChatHistory.tsx`)

All icons use fill color `#1A1919` (contentPrimary):
- **CloseIcon**: × glyph, viewBox 0 0 24 24
- **ClockIcon**: Clock outline, viewBox 0 0 20 20
- **MoreIcon**: Three dots in circle, viewBox 0 0 20 20
- **ChevronLeftIcon**: Back arrow, viewBox 0 0 24 24
- **NewChatIcon**: Chat bubble with +, viewBox 0 0 24 24

### Shadow Spec (suggestion cards)

Native shadow properties (maps to Flutter `BoxShadow`):
- `shadowColor`: `rgba(10,10,10,0.16)`
- `shadowOffset`: `{width: 0, height: 1}`
- `shadowOpacity`: 1
- `shadowRadius`: 4
- `elevation`: 2 (Android)
