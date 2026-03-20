# SoFi Coach Chat — Flutter Migration Prototype

## Overview

This project is a pnpm monorepo using TypeScript, designed as a mobile app prototype for an AI financial coach. The primary goal is to prototype the user experience, interactions, and AI integration using React Native (Expo), with the explicit intention of converting it to Flutter using SoFi's Pacific component library. The prototype serves as a blueprint for a mobile engineer to implement.

The project features a full-stack architecture: an Express API server and a React Native mobile client. Key capabilities include live AI chat (GPT-4o-mini), pre-built demo scenarios, a Memory Center, a Goals Dashboard, and chat history. The project emphasizes Flutter portability — only standard React Native APIs, no web CSS, no browser APIs.

## User Preferences

- Concise and accurate responses
- Iterative development with frequent, small updates
- Approval required before major architectural changes or new external dependencies
- Well-documented code for Flutter conversion (UI components, state management, styling)
- Standard APIs only — cross-platform compatibility is critical

## System Architecture

### Monorepo Structure

```
artifacts/
├── api-server/          # Express 5 API server (@workspace/api-server)
│   └── src/
│       ├── routes/
│       │   ├── chat.ts  # /api/chat, /api/chat/stream, /api/title endpoints
│       │   └── health.ts
│       ├── app.ts       # Express app setup with CORS + pino logging
│       └── index.ts     # Server entry point (reads PORT env var)
├── mobile/              # Expo/React Native client (@workspace/mobile)
│   ├── app/
│   │   ├── _layout.tsx  # Root layout with font loading + ErrorBoundary
│   │   └── index.tsx    # Main chat screen
│   ├── components/
│   │   ├── MessageBubble.tsx      # AI/user/system message rendering + text parser
│   │   ├── TypingIndicator.tsx    # Orb GIF + shimmer "Analyzing..." text
│   │   ├── InputBar.tsx           # Message input with send button
│   │   ├── ChatHeader.tsx         # Title bar with history/more menu
│   │   ├── ChatHistory.tsx        # Session history panel (slide-in)
│   │   ├── MemoryCenter.tsx       # Memory CRUD panel
│   │   ├── GoalsDashboard.tsx     # Goals with progress rings
│   │   ├── ScenarioSwitcher.tsx   # Demo scenario selector
│   │   ├── ScenarioFab.tsx        # FAB to open scenario switcher
│   │   ├── EmptyChat.tsx          # Welcome screen with starter prompts
│   │   ├── ScrollAnchor.tsx       # Scroll-to-bottom button
│   │   ├── ErrorBoundary.tsx      # Error boundary wrapper
│   │   └── ErrorFallback.tsx      # Error fallback UI
│   ├── constants/
│   │   ├── types.ts       # All TypeScript interfaces and enums
│   │   ├── colors.ts      # Design token color palette
│   │   ├── fonts.ts       # Font family constants
│   │   ├── scenarios.ts   # 10 pre-built demo scenarios
│   │   └── aiResponse.ts  # Demo mode AI response generator
│   └── context/
│       └── CoachContext.tsx  # Central state management + streaming logic
└── mockup-sandbox/      # Component preview server for canvas prototyping
```

### API Endpoints

| Endpoint | Method | Description |
|---|---|---|
| `/api/chat` | POST | Non-streaming AI chat (fallback for native mobile) |
| `/api/chat/stream` | POST | SSE-based token streaming (web only) |
| `/api/title` | POST | Auto-generate session title from conversation |
| `/api/healthz` | GET | Health check |

### AI Configuration

- **Model:** GPT-4o-mini via Replit AI Integrations proxy (OpenAI-compatible)
- **System prompt location:** `artifacts/api-server/src/routes/chat.ts` (SYSTEM_PROMPT constant)
- **Temperature:** 0.7 for chat, 0.3 for title generation
- **Max tokens:** 1000 for chat, 20 for titles

## Streaming Architecture

The app uses a dual-path streaming strategy to work on both web and native mobile:

### Web Path (Expo Web)
1. `POST /api/chat/stream` → SSE with `{type:"token"}` events, then `{type:"done"}`
2. Client detects `ReadableStream` support → uses `fetch` + `getReader()` to read SSE
3. All tokens collected into a queue while typing indicator (orb) stays visible
4. After stream completes, tokens drain progressively at 15ms intervals via `setInterval`
5. Retry logic: up to 2 retries with 500ms/1s backoff, then falls back to non-streaming

### Native Mobile Path (iOS/Android)
1. `ReadableStream` not available → uses `POST /api/chat` directly (non-streaming)
2. Full response received at once while typing indicator stays visible
3. Response split by whitespace and drained word-by-word at 8ms intervals
4. Same visual effect as streaming — progressive text reveal

### Shared Drain Animation (`drainReplyWithAnimation`)
- Typing indicator (orb) stays visible until first token/word is ready to display
- First token replaces the typing indicator message in-place (same position in message list)
- Subsequent tokens/words appended via `setInterval` timer
- Final state sets complete reply content, `isStreaming: false`, and suggestion pills

### Streaming UI Components
- **TypingIndicator:** Orb GIF (preloaded at app startup via `expo-asset`) + shimmer "Analyzing..." text using `react-native-reanimated` interpolated colors
- **StreamingContent:** Animated wrapper with entrance animation (opacity 0→1 + translateY 6→0 over 500ms) and per-block fade-in (300ms) as new content blocks appear during drain
- **Message state flags:** `isStreaming` (true during drain), `isTypingIndicator` (true for orb message)

## Text Formatting & Parse-Render Pipeline

AI responses go through a parse-render pipeline in `MessageBubble.tsx`:

### Pipeline Stages
1. **`normalizeLine(raw)`** — Normalize markdown variants:
   - `***text***` → `**text**`, `___text___` → `**text**`, `__text__` → `**text**`
   - Strip markdown links `[text](url)` → `text`
   - Strip inline code backticks
2. **`classifyLine(line)`** — Classify each line:
   - Hash headers (`# ## ###`) → header (converted to `**bold**`)
   - Standalone bold (`**Text**` on its own line, NOT numbered) → header
   - Horizontal rules (`---`, `***`, `___`) → treated as whitespace (skipped)
   - Bullet items (`•`, `- `) → list
   - Numbered items (`1. 2. 3.`) → list (converted to `• ` bullets, NEVER headers)
   - Everything else → text
3. **`parseContentBlocks(content)`** — Build typed `ContentBlock[]`:
   - Types: `text`, `bullet`, `header`, `divider`
   - Divider inserted before headers only when non-header content already exists (contextual section breaks)
   - Code blocks (triple backticks) preserved as text blocks
   - Paragraph gap tracking for proper spacing
4. **`formatInlineStyles(text)`** — Render inline `**bold**` as `<Text style={medium}>` within any block
5. **`renderBlock(block, index)`** — Map each block to its React Native component

### ContentBlock Types
```typescript
type ContentBlock =
  | { type: 'text'; text: string; paragraphGap: boolean }
  | { type: 'bullet'; text: string; paragraphGap: boolean }
  | { type: 'header'; text: string }
  | { type: 'divider' };
```

### System Prompt Formatting Rules
The AI is instructed (in `SYSTEM_PROMPT`) to:
- Use `**bold text**` for section headers on their own line
- NEVER use `# ## ### ####` markdown headings
- NEVER use numbered lists (1. 2. 3.) — always bullet points (`•` or `-`)
- NEVER use horizontal rules (`---` or `***`)
- Keep all bullets flat — no indentation, no nested lists
- Use bullet points with bold labels for key-value data (e.g., `• **Monthly savings:** $450`)

Despite these instructions, the parser defensively handles all formats since LLM output can't be fully controlled.

## Design Tokens

### Color Palette (`constants/colors.ts`)

| Token | Hex | Usage |
|---|---|---|
| `surfaceBase` | `#FAF8F5` | App background, header, footer, panels |
| `surfaceElevated` | `#FFFFFF` | Cards, input fields, menus |
| `surfaceTint` | `#F0EDE8` | Hover states, chip backgrounds |
| `surfaceEdge` | `rgba(10,10,10,0.10)` | Borders, dividers |
| `surfaceMuted` | `#F5F3F0` | Safety tier badges |
| `contentPrimary` | `#1A1919` | Primary text, active icons |
| `contentSecondary` | `#706F6E` | Secondary text, inactive icons |
| `contentBone600` | `#5C5B5A` | User message bubble bg, suggestion pill borders |
| `contentBrand` | `#00A2C7` | Brand cyan accent |
| `contentMuted` | `#D0CCC5` | Empty state icons |
| `danger` | `#FA2D25` | Delete actions |
| `success` | `#22C55E` | Completed goals |
| `successDark` | `#16A34A` | Milestone text, confirmations |
| `warning` | `#B45309` | Actionable safety tier |
| `info` | `#2563EB` | Handoff text |

### Typography (`constants/fonts.ts`)

- **Font family:** TT Norms (Regular 400, Medium 500, Bold 700, Italic, BoldItalic)
- **Loading:** `expo-font` in `_layout.tsx`
- **Key styles:**
  - Body: 16px Regular, lineHeight 20-22px
  - Headers: 18px Medium, lineHeight 24px, letterSpacing -0.2px
  - Labels: 13px Medium, lineHeight 18px
  - Chips: 12px Medium, letterSpacing 0.1px

### Spacing & Layout

- Screen horizontal padding: 16px
- Message list gap: 24px between messages
- AI content internal gap: 8px
- Section divider margin: 16px top and bottom
- Card border-radius: 16px; Pills: 9999px; Inputs: 24px
- Header bar: 44px height

### Animations

| Animation | Duration | Properties | Usage |
|---|---|---|---|
| Streaming entrance | 500ms | opacity 0→1, translateY 6→0 | When streaming content first appears |
| Block fade-in | 300ms | opacity 0→1 | Each new content block during streaming |
| Typing indicator shimmer | 2200ms loop | color interpolation (#c4a882 ↔ #00a2c7) | "Analyzing..." text color sweep |
| Dropdown fade-in | 200ms | opacity 0→1 | Menu dropdowns |
| Confirm pulse | 500ms | scale 1→1.02→1, green flash | Memory/goal confirmation |

All animations use `useNativeDriver: true` for GPU acceleration. Typing indicator uses `react-native-reanimated` for interpolated color animations.

## Assets

### Images (`assets/images/`)
- `orb-analyzing.gif` — Typing indicator orb animation (preloaded at startup via `expo-asset`)
- `icon-copy.png` — Copy action icon
- `icon-thumbs-up.png` / `icon-thumbs-up-filled.png` — Thumbs up states
- `icon-thumbs-down.png` / `icon-thumbs-down-filled.png` — Thumbs down states
- `icon-sofi-coach.png` — Coach logo for empty state

### Fonts (`assets/fonts/`)
- TT Norms: Regular, Medium, Bold, Italic, BoldItalic (.otf files)

## Key Architectural Decisions

### State Management
- Single `CoachContext` provider with `useCallback`/`useRef` for all state
- No external state library — plain React context for Flutter portability
- Messages, memories, goals, sessions all managed in context
- `messagesRef` used for accessing current messages in callbacks without stale closures

### Panel System
- MemoryCenter, GoalsDashboard, ChatHistory use `StyleSheet.absoluteFillObject` + `zIndex: 100`
- Full-screen overlay panels, not navigation routes
- `PanelType` enum controls which panel is visible

### Chat Sessions
- In-memory session management (no persistence)
- Sessions stored in array with `id`, `title`, `messages`, `memories`, `goals`
- Auto-generated titles via `/api/title` endpoint after first AI response
- `sessionVersionRef` counter prevents stale updates when switching sessions

### Demo vs Live Mode
- `ChatMode`: `'demo'` | `'live'` (default: `'live'`)
- Demo mode loads pre-built scenarios with mock messages, memories, goals
- Live mode uses real AI via API endpoints
- 10 demo scenarios defined in `constants/scenarios.ts`

## External Dependencies

- **OpenAI:** Via Replit AI Integrations proxy (GPT-4o-mini)
- **Express 5:** API server framework
- **Expo/React Native:** Mobile app framework
- **expo-font:** Custom font loading
- **expo-asset:** GIF preloading for typing indicator
- **react-native-reanimated:** Color interpolation animations (typing indicator)
- **react-native-svg:** Custom SVG icons
- **@expo/vector-icons (Feather):** Standard icons
- **pino/pino-http:** API server logging

## Flutter Migration Notes

### What Maps Directly
- All color tokens → Flutter `Color` constants
- Font styles → Flutter `TextStyle` with TT Norms
- Spacing values → Flutter `EdgeInsets` / `SizedBox`
- Border radii → Flutter `BorderRadius`
- Message types → Dart data classes
- Parse-render pipeline → Dart equivalent with `ContentBlock` sealed class
- Streaming drain animation → Dart `Timer.periodic` + `setState`

### What Needs Adaptation
- `react-native-reanimated` color interpolation → Flutter `AnimationController` + `ColorTween`
- `RNAnimated.View` opacity/translate → Flutter `FadeTransition` / `SlideTransition`
- `expo-asset` GIF preloading → Flutter `precacheImage`
- SSE streaming (web-only) → Dart `http` package with `StreamedResponse` (works natively)
- Context API → Flutter `Provider` or `Riverpod`
- `FlatList` → Flutter `ListView.builder`
- `StyleSheet` → Flutter `ThemeData` + component-level styling

### Key Patterns for Flutter Engineer
1. **Token drain queue:** Collect all tokens, then reveal progressively via timer — same pattern in Dart
2. **Typing indicator lifecycle:** Show immediately with user message, replace in-place when content ready
3. **Section dividers:** Contextual — only between sections, never before the first header
4. **Content blocks:** Typed union (sealed class in Dart) — text, bullet, header, divider
5. **Session versioning:** Counter ref that increments on new chat — discard stale async results
