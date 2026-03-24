# SoFi Coach Chat — Flutter Migration Handoff Document

This document is a complete specification for rebuilding the SoFi Coach Chat prototype in Flutter. It covers architecture, every UI component, the chat engine, AI integration, data models, animations, and edge cases. A Flutter engineer should be able to rebuild the app from this document alone without referencing the React Native source code.

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [File Structure](#2-file-structure)
3. [Data Models](#3-data-models)
4. [State Management](#4-state-management)
5. [AI / Backend Integration](#5-ai--backend-integration)
6. [Coach Chat — Conversation Flow](#6-coach-chat--conversation-flow)
7. [Message Rendering Pipeline](#7-message-rendering-pipeline)
8. [UI Components](#8-ui-components)
9. [Design Tokens](#9-design-tokens)
10. [Animations & Motion](#10-animations--motion)
11. [Data Persistence & Sessions](#11-data-persistence--sessions)
12. [Demo Scenario System](#12-demo-scenario-system)
13. [Environment Variables & Dependencies](#13-environment-variables--dependencies)
14. [Edge Cases & Interaction States](#14-edge-cases--interaction-states)
15. [Flutter Migration Mapping](#15-flutter-migration-mapping)

---

## 1. Architecture Overview

The app is a **full-stack AI financial coach** with two runtime paths:

```
┌──────────────────────────────┐
│  Expo/React Native Client    │
│  (single-screen chat app)    │
│                              │
│  ┌────────────────────────┐  │
│  │ CoachContext (state)   │  │
│  │ - messages, memories,  │  │
│  │   goals, sessions      │  │
│  │ - streaming engine     │  │
│  │ - demo scenario loader │  │
│  └────────────────────────┘  │
│         │                    │
│         ├─ Live mode ──────────────► Express API Server
│         │   POST /api/chat          (GPT-4o-mini)
│         │   POST /api/chat/stream
│         │   POST /api/title
│         │
│         └─ Demo mode ──────── Local scenario data
│             (no network)       (constants/scenarios.ts)
└──────────────────────────────┘
```

**Key design principles:**
- Single-screen app — all panels (Memory, Goals, History, Scenarios) are full-screen overlays, not navigation routes
- Live AI chat is the default. Demo scenarios are a subfeature accessed via a header button
- State is entirely in-memory (no database, no AsyncStorage)
- Only standard React Native APIs — no web CSS, no browser-only APIs

---

## 2. File Structure

```
mobile/
├── app/
│   ├── _layout.tsx          # Root layout: font loading, providers, error boundary
│   └── index.tsx            # Main (and only) screen — the chat UI
├── components/
│   ├── ChatHeader.tsx       # Top bar with title, mode indicator, menus
│   ├── EmptyChat.tsx        # Welcome screen when no messages exist
│   ├── InputBar.tsx         # Message text input + send button
│   ├── MessageBubble.tsx    # All message types: user, AI, system + attachments
│   ├── TypingIndicator.tsx  # Animated orb + "Analyzing..." shimmer text
│   ├── ScrollAnchor.tsx     # Floating scroll-to-bottom button
│   ├── MemoryCenter.tsx     # Full-screen memory CRUD panel
│   ├── GoalsDashboard.tsx   # Full-screen goals panel with progress rings
│   ├── ChatHistory.tsx      # Full-screen session history panel
│   ├── ScenarioSwitcher.tsx # Bottom sheet for demo scenario selection
│   ├── ScenarioFab.tsx      # Floating action button for demos (currently disabled)
│   ├── Toast.tsx            # Global toast notification system
│   ├── ErrorBoundary.tsx    # Catches render errors
│   └── ErrorFallback.tsx    # Fallback UI for errors
├── constants/
│   ├── types.ts             # All TypeScript interfaces and enums
│   ├── colors.ts            # Complete color palette (29 tokens)
│   ├── fonts.ts             # Font family name constants
│   ├── scenarios.ts         # 10 pre-built demo scenarios with data
│   └── aiResponse.ts        # Demo mode: keyword-matched AI response generator
├── context/
│   └── CoachContext.tsx      # Central state: messages, memories, goals, streaming
└── assets/
    ├── fonts/               # TT Norms: Regular, Medium, Bold, Italic, BoldItalic (.otf)
    └── images/
        ├── orb-analyzing.gif          # Typing indicator animation
        ├── orb-combo.png              # Welcome screen orb graphic
        ├── icon-copy.png              # Copy action button
        ├── icon-thumbs-up.png         # Feedback: thumbs up (outline)
        ├── icon-thumbs-up-filled.png  # Feedback: thumbs up (filled)
        ├── icon-thumbs-down.png       # Feedback: thumbs down (outline)
        └── icon-thumbs-down-filled.png # Feedback: thumbs down (filled)

api-server/
├── src/
│   ├── index.ts             # Server entry: reads PORT, starts listening
│   ├── app.ts               # Express app: CORS, JSON body parser, pino logging
│   ├── routes/
│   │   ├── index.ts         # Route aggregator
│   │   ├── chat.ts          # /api/chat, /api/chat/stream, /api/title
│   │   └── health.ts        # /api/healthz
│   └── lib/
│       └── logger.ts        # Pino logger instance
└── package.json
```

---

## 3. Data Models

### Message

```
Message {
  id: string                     // Unique ID (timestamp + random)
  role: 'user' | 'ai' | 'system'
  content: string                // Markdown-formatted text
  timestamp: Date
  chips?: MessageChip[]          // Status badges above AI content
  memoryProposal?: MemoryProposal
  goalProposal?: GoalProposal
  // insightToAction — RETIRED in Task #12; goal proposals now create DRAFT goals in Goals Center
  autoSaveMemory?: AutoSaveMemory     // Auto-saved (no user prompt)
  autoCreateGoal?: AutoCreateGoal     // Auto-created goal
  autoUpdateGoal?: AutoUpdateGoal     // Auto-updated existing goal
  suggestions?: string[]              // Follow-up prompt pills (max 3)
  provenance?: string                 // Data source explanation
  safetyTier?: SafetyTier             // Risk classification badge
  safetyMessage?: string
  isProactive?: boolean               // System messages initiated by AI
  isStreaming?: boolean                // True during token drain animation
  isTypingIndicator?: boolean         // True for the orb placeholder message
}
```

### MessageChip

```
MessageChip {
  type: 'memory-saved' | 'goal-progress' | 'goal-risk' | 'memory-updated' | 'milestone' | 'alert' | 'handoff'
  label: string
}
```

### MemoryProposal (inline card asking user to confirm)

```
MemoryProposal {
  id: string
  content: string
  category: MemoryCategory
  confirmed?: boolean    // Shows "Saved to memory" checkmark
  dismissed?: boolean    // Card removed
}
```

### GoalProposal (inline card asking user to create goal)

```
GoalProposal {
  id: string
  type: GoalType
  title: string
  targetAmount: number
  targetDate: Date
  monthlyContribution: number
  linkedAccount: string
  confirmed?: boolean    // Shows "Goal created" checkmark
  dismissed?: boolean    // Card removed
}
```

### InsightToAction — RETIRED (Task #12)

> **Retired.** Goal proposals no longer bundle with inline cards in chat. Instead, the AI creates DRAFT goals directly in the Goals Center. A chat system nudge ("I've added a goal suggestion to your Goals panel") notifies the user. The user confirms or dismisses from the "Suggested" section in Goals Center. Memory proposals continue to work independently as `memoryProposal` on the message.

### Memory

```
Memory {
  id: string
  category: MemoryCategory   // 'ABOUT_ME' | 'PREFERENCES' | 'PRIORITIES'
  content: string
  source: MemorySource        // 'EXPLICIT' | 'IMPLICIT_CONFIRMED'
  status: MemoryStatus        // 'ACTIVE' | 'PAUSED' | 'DELETED'
  createdAt: Date
  updatedAt: Date
}
```

### Goal

```
Goal {
  id: string
  type: GoalType              // 'EMERGENCY_FUND' | 'DEBT_PAYOFF' | 'SAVINGS_TARGET' | 'CUSTOM'
  title: string
  targetAmount: number
  currentAmount: number
  targetDate: Date
  monthlyContributionTarget: number
  actualMonthlyContribution: number
  status: GoalStatus          // 'DRAFT' | 'ACTIVE' | 'ON_TRACK' | 'AT_RISK' | 'PAUSED' | 'COMPLETED'
  confidenceScore: number     // 0.0 to 1.0
  milestones: Milestone[]
  linkedAccount: string
  createdAt: Date
}
```

### Milestone

```
Milestone {
  id: string
  label: string       // "25%", "50%", "75%", "100%"
  targetPct: number   // 25, 50, 75, 100
  reached: boolean
  reachedAt?: Date
}
```

### Safety Tiers

```
SafetyTier: 'informational' | 'suggestive' | 'actionable' | 'handoff'
```

Each tier has a badge with specific styling:
- **Informational**: grey bg, grey text, shield icon — "Informational"
- **Suggestive**: grey bg, grey text, shield icon — "Suggestion"
- **Actionable**: amber bg, amber text, shield icon — "Actionable — needs your approval"
- **Handoff**: blue bg, blue text, arrow icon — "Complex — human advisor recommended"

### Enums

```
PanelType: 'none' | 'memory' | 'goals' | 'scenarios' | 'history'

MemoryCategory labels:
  ABOUT_ME → "About me"
  PREFERENCES → "Preferences"
  PRIORITIES → "Priorities"

MemoryCategory display order: ABOUT_ME, PREFERENCES, PRIORITIES

GoalType labels:
  EMERGENCY_FUND → "Save Up"
  DEBT_PAYOFF → "Pay Down"
  SAVINGS_TARGET → "Save Up"
  CUSTOM → "Custom"
```

### ChatSession (in-memory storage)

```
ChatSession {
  id: string
  title: string
  messages: Message[]
  memories: Memory[]
  goals: Goal[]
  createdAt: Date
  updatedAt: Date
}
```

---

## 4. State Management

All app state lives in a single `CoachContext` provider. No external state library is used. The Flutter equivalent would be `Provider`, `Riverpod`, or `Bloc`.

### State Shape

```
CoachState {
  messages: Message[]           // Current conversation messages
  memories: Memory[]            // Current memory items
  goals: Goal[]                 // Current goals
  isTyping: boolean             // True while waiting for AI response
  activePanel: PanelType        // Which overlay panel is visible
  activeScenario: string        // ID of active demo scenario (empty = live mode)
  showOnboarding: boolean       // Whether to show onboarding UI
  chatMode: 'demo' | 'live'    // Current operating mode
  inputFocused: boolean         // Whether the text input is focused
  chatHistory: ChatSession[]    // All saved sessions
  currentSessionId: string?     // ID of current session (null until first message)
  sessionTitle: string          // Displayed in header (default: "Coach")
}
```

### Key Actions (exposed via context)

| Action | Description |
|---|---|
| `sendMessage(text)` | Send user message → triggers AI response (live or demo) |
| `setActivePanel(panel)` | Toggle overlay panel visibility |
| `switchScenario(id)` | Switch to demo scenario (loads its messages/memories/goals) |
| `startLiveChat()` | Clear everything and enter live mode |
| `saveAndClose()` | Save current session to history and start new chat |
| `loadSession(id)` | Restore a previous session from history |
| `confirmMemory(msgId)` | Accept a memory proposal inline card |
| `dismissMemoryProposal(msgId)` | Dismiss a memory proposal |
| `confirmGoal(msgId)` | Accept a goal proposal inline card |
| `dismissGoalProposal(msgId)` | Dismiss a goal proposal |
| `acceptDraftGoal(goalId)` | Accept a DRAFT goal from Goals Center Suggested section |
| `dismissDraftGoal(goalId)` | Dismiss a DRAFT goal from Goals Center |
| `editMemory(id, content)` | Edit a memory's text |
| `pauseMemory(id)` | Toggle memory between ACTIVE ↔ PAUSED |
| `deleteMemory(id)` | Soft-delete a memory (status → DELETED) |
| `restoreMemory(id)` | Restore a deleted memory (status → ACTIVE) |
| `clearConversation()` | Clear messages only (keep mode/scenario) |

### Session Versioning

A `sessionVersionRef` counter increments whenever the user switches chats, scenarios, or starts a new conversation. All async operations (API calls, streaming timers) check this counter before updating state — if it doesn't match, the result is discarded. This prevents stale responses from appearing in the wrong conversation.

---

## 5. AI / Backend Integration

### API Server (Express)

The API server is a separate Express application that proxies requests to OpenAI's GPT-4o-mini via a Replit AI Integrations proxy.

### Endpoints

#### `POST /api/chat` — Non-streaming (fallback)

**Request:**
```json
{
  "message": "How do I save more money?",
  "history": [
    { "role": "user", "content": "..." },
    { "role": "assistant", "content": "..." }
  ]
}
```

**Response:**
```json
{
  "reply": "**Your Savings Opportunities**\n\n...",
  "suggestions": ["Set up auto-transfers", "Show subscriptions"],
  "memoryActions": [
    { "type": "save", "category": "ABOUT_ME", "content": "Has $8,000 credit card balance" }
  ],
  "goalActions": [
    { "type": "SAVINGS_TARGET", "title": "Home Down Payment", "targetAmount": 60000, "monthsUntilTarget": 36, "monthlyContribution": 1667, "linkedAccount": "SoFi Savings" }
  ]
}
```

**Memory and goal actions** are parsed from AI markers (`[MEMORY_SAVE]`, `[MEMORY_PROPOSAL]`, `[MEMORY_UPDATE]`, `[GOAL_PROPOSAL]`) that appear after `[SUGGESTIONS]` in the raw AI output. The server strips these markers before returning the cleaned `reply`.

When a `goalActions` entry arrives (with or without a PRIORITIES-category `memoryActions` proposal), the client creates a DRAFT goal in the Goals Center and sends a system nudge in chat. The InsightToAction inline card pattern has been retired (Task #12).

**Constraints:**
- `message` max length: 2000 characters
- `history` max entries: 20, each content max: 4000 characters
- Rate limit: 20 requests per IP per 60 seconds

#### `POST /api/chat/stream` — SSE streaming

Same request format. Response is Server-Sent Events:

```
data: {"type":"token","content":"**Your"}
data: {"type":"token","content":" Savings"}
...
data: {"type":"done","reply":"full cleaned text","suggestions":["..."],"memoryActions":[...],"goalActions":[...]}
```

Error case:
```
data: {"type":"error","error":"Too many requests..."}
```

#### `POST /api/title` — Auto-generate session title

**Request:**
```json
{
  "messages": [
    { "role": "user", "content": "..." },
    { "role": "assistant", "content": "..." }
  ]
}
```

**Response:**
```json
{ "title": "Emergency Fund Planning" }
```

Uses last 6 messages, max 500 chars each. Max 30 tokens for response. Title is 3-6 words, no markdown.

### System Prompt (Coach Persona)

The system prompt defines "SoFi Coach" — a warm, knowledgeable AI financial advisor. Key aspects:

**Persona:**
- Friendly, supportive, encouraging — like a trusted advisor who genuinely cares
- Explains complex concepts in plain language
- Celebrates wins, provides constructive guidance on setbacks
- Proactive: notices patterns and offers insights before asked
- Never judges spending habits

**Expertise areas:**
- Spending Coach (analyze patterns, suggest budgets)
- Savings & Goals Advisor (SMART goals, timelines, 50/30/20 rule)
- Investment Educator (concepts only, never specific stock picks)
- General Financial Coach (credit scores, debt strategies, emergency funds)

**Response formatting rules (critical for parser compatibility):**
- Use `**bold text**` for section headers on their own line
- NEVER use markdown heading syntax (`# ## ###`)
- NEVER use numbered lists (`1. 2. 3.`) — always bullet points (`•` or `-`)
- NEVER use horizontal rules (`---` or `***`)
- No nested lists or indentation — all bullets at one flat level
- Bullet points with bold labels for data: `• **Monthly savings:** $450`

**Follow-up suggestions:**
- End every response with `[SUGGESTIONS]` marker on its own line
- 0-3 short suggestions below the marker, one per line
- Each suggestion under 35 characters
- Written as the user would naturally type them
- The marker and suggestions are parsed out and never displayed in the message body

### Suggestion Parsing Logic

```
function parseSuggestions(text):
  find last occurrence of "[SUGGESTIONS]"
  split: reply = text before marker, suggestions = lines after marker
  clean each suggestion: strip bullets/numbers, trim, truncate to 35 chars
  return { reply, suggestions (max 3) }
```

---

## 6. Coach Chat — Conversation Flow

### Message Lifecycle (Live Mode)

```
1. User types message → taps send
2. User message added to messages array
3. Typing indicator message added (special message with isTypingIndicator=true)
4. isTyping = true
5. Keyboard dismissed, input blurred
6. Input text cleared

[API call begins]

7a. (Web) Try streaming via /api/chat/stream
    - Up to 2 retries with 500ms/1s backoff
    - Falls back to /api/chat if streaming fails
7b. (Native) Direct call to /api/chat

[Response received]

8. Typing indicator replaced with AI message (same position in list)
9. Token/word drain animation begins:
   - isTyping = false
   - isStreaming = true on AI message
   - First token/word displayed immediately
   - Remaining tokens drain at 15ms intervals (streaming) or 8ms/word (non-streaming)
10. When drain completes:
    - isStreaming = false
    - Full cleaned reply set as content
    - Suggestion pills appear
    - Title generated (first response only) via /api/title

[Post-response]

11. Inline cards appear if present (memory proposals, goal proposals, etc.)
12. Action footer appears (copy, thumbs up/down)
13. Suggestion pills shown only on the latest AI message
```

### Message Lifecycle (Demo Mode)

```
1. User types message → taps send
2. User message added
3. Typing indicator added
4. isTyping = true

[Local processing: 800-1500ms random delay]

5. generateAIResponse(userInput, storeState) called
   - Keyword matching against ~25 patterns
   - Returns pre-written response with optional chips, proposals, etc.
   - If no match found → falls through to live API call

6. Process auto-actions:
   - autoSaveMemory → add memory + show "Saved to memory" chip
   - autoCreateGoal → create goal
   - autoUpdateGoal → update existing goal

8. Typing indicator replaced with AI message
9. isTyping = false (no streaming animation in demo mode)
```

### Typing Indicator States

The typing indicator is a special message (`id = '__typing_indicator__'`) inserted into the messages array. It renders as:
- Animated orb GIF (14.5px clipped circle, from 24px source image)
- "Analyzing..." text with shimmer color animation

When the AI response is ready, this message is replaced in-place (same array position) with the actual AI message. This ensures smooth visual continuity — the typing indicator doesn't jump or disappear, it transforms into the response.

### Keyboard Behavior

- `keyboardDismissMode="on-drag"` on the message list (FlatList)
- All header buttons dismiss keyboard before action
- Suggestion pills dismiss keyboard before sending
- When `isTyping=true`, input is blurred and keyboard dismissed
- Footer padding adapts: `keyboardUp ? 4px : max(safeArea.bottom, 8px)`
- When keyboard shows: list scrolls to end after 100ms delay

---

## 7. Message Rendering Pipeline

AI message content goes through a multi-stage parse-render pipeline to convert markdown-like text into styled native components.

### Stage 1: Line Normalization (`normalizeLine`)

For each line of the content string:
- `***text***` → `**text**` (triple bold → double bold)
- `___text___` → `**text**` (triple underscore → bold)
- `__text__` → `**text**` (double underscore → bold)
- `[text](url)` → `text` (strip markdown links)
- `` `code` `` → `code` (strip inline code backticks)

### Stage 2: Line Classification (`classifyLine`)

Each normalized line is classified as one of:
- **Header**: `# Heading` syntax (converted to `**Heading**`) OR standalone bold text on its own line (NOT if line starts with a number)
- **List item**: starts with `•`, `- `, or matches `^\d+\.\s`
- **Horizontal rule**: `---`, `***`, `___` (3+ chars) — skipped entirely
- **Text**: everything else

### Stage 3: Block Building (`parseContentBlocks`)

Lines are assembled into typed content blocks:

```
ContentBlock = text | bullet | header | divider

- text:    { type: 'text', text: string, paragraphGap: boolean }
- bullet:  { type: 'bullet', text: string, paragraphGap: boolean }
- header:  { type: 'header', text: string }
- divider: { type: 'divider' }
```

Rules:
- All `- ` prefixes converted to `• ` (bullet point)
- All numbered items (`1. `, `2. `) converted to `• ` (never rendered as numbers)
- Duplicate bullet markers (`•  • text`) collapsed to single `• `
- Dividers inserted before headers ONLY when non-header content already exists above
- Code blocks (triple backtick fences) passed through as plain text blocks
- `paragraphGap` set to true when: blank line preceded this block, or transitioning between list/non-list content

### Stage 4: Inline Style Rendering (`formatInlineStyles`)

Within any block's text, `**bold text**` segments are rendered in medium weight font. All other text uses regular weight. Stray `*` characters are stripped.

### Stage 5: Component Rendering

Each block maps to a component:

| Block Type | Component | Style |
|---|---|---|
| `text` | `<Text>` | 16px regular, lineHeight 20, paddingHorizontal 4 |
| `bullet` | `<Text>` | Same as text (bullet char is part of text string) |
| `header` | `<Text>` | 18px medium, letterSpacing -0.2, lineHeight 24, paddingHorizontal 4 |
| `divider` | `<View>` | 0.75px height, rgba(10,10,10,0.1) bg, marginVertical 16 |

**Important:** `paddingHorizontal: 4` on `aiText` is the base style. Dividers and other widgets should NOT add extra horizontal padding beyond the parent container's 16px.

---

## 8. UI Components

### 8.1 ChatHeader

**Location:** Top of screen, below safe area inset

**Structure:**
```
[Left Zone 104px] [Center Zone flex] [Right Zone 104px]
```

**Left zone:**
- No active chat: Flask/beaker icon (opens demo scenario switcher)
- Active chat: X close icon (saves session and starts new chat)

**Center zone:**
- Session title (16px medium, single line, truncated)
- Demo mode indicator: small cyan dot (4px) + "Demo" text (12px medium, `#00A2C7`)
- No indicator shown in live mode

**Right zone:**
- Clock icon → opens Chat History panel
- Three-dot icon → opens dropdown menu (only visible when messages exist)

**Dropdown menu (212px wide, right-aligned, 20px border radius):**
- "New chat" + compose icon
- "Chat memory" + brain/lightbulb icon
- "Goals" + target icon
- "Rename" + pencil icon
- "Delete" + trash icon (red text, red icon)
- Dividers between items (0.75px)
- Backdrop: full-screen transparent pressable to dismiss

### 8.2 EmptyChat (Welcome Screen)

Shown when `messages.length === 0`.

**Layout:**
- **Top section:** Orb combo image (96×120px) + "I'm Coach.\nHow can I help?" text (24px medium, -0.5 letterSpacing)
- **Bottom section:** Starter prompt cards
  - 1 full-width card: "SUPPORT" label + "I need help with my SoFi account." text
  - 2 half-width cards side by side: "CREDIT SCORE" and "SPENDING"
  - Cards: white bg, 16px radius, shadow (rgba(10,10,10,0.16) offset 0,1 radius 4)

**Animation on keyboard focus:**
- Orb section translates up 60px and scales to 0.95 (spring: damping 20, stiffness 180, mass 0.8)
- Full card fades out + translates down 20px (350ms ease)
- Half cards fade out + translate down 24px (300ms ease, 80ms delay)
- Reverse animation when keyboard hides

### 8.3 InputBar

**Structure:**
```
[Input Pill (rounded 24px)] containing:
  [TextInput (flex)] [Send Button (32px circle, conditional)]
[Disclaimer text centered below]
```

**Input pill:** White bg, 0.75px border rgba(10,10,10,0.1), minHeight 48px, paddingLeft 20, paddingRight 8
**TextInput:** 16px regular, placeholder "Message", multiline, maxLength 2000, cursor color #5c5b5a, selection color rgba(92,91,90,0.3)
**Send button:** Only visible when text is non-empty. 32px circle, bg #5c5b5a, white arrow-up SVG icon (11.5×14.5). Opacity 0.4 when `isTyping=true`.
**Disclaimer:** "AI can make mistakes. Learn more  Privacy policy" — 11px regular, secondary color, underline on links

**Footer padding:** `paddingBottom: keyboardUp ? 4 : max(safeArea.bottom, 8)`
**Footer background:** Transparent with an absolute-positioned `surfaceBase` bg that starts 24px from top (creates a seamless blend with the content above)

### 8.4 MessageBubble

Renders differently based on `message.role`:

#### User Message
- Right-aligned, left padding 60px
- Bubble: bg `#5C5B5A`, borderRadius 24, paddingTop 11, paddingBottom 12, paddingHorizontal 16, maxWidth 298
- Text: 16px regular, white

#### System Message
- Center-aligned pill
- Standard: bg surfaceTint, secondary text (13px medium)
- Proactive (isProactive=true): bg contentPrimary (dark), white text, star icon prefix

#### AI Message
Full structure top to bottom:
1. **Chips row** — horizontal wrap, gap 6 (if chips exist)
2. **Content area** — parsed markdown content (gap 8 between blocks)
3. **Safety badge** — small inline badge (if safetyTier exists)
4. **Memory proposal card** — "Want me to remember..." with Remember/Not now buttons
5. **Goal proposal card** — goal details with Set up goal/Just chatting buttons
6. **Insight-to-action card** — combined memory+goal with Set up goal/Just remember buttons
7. **Action footer** — copy, thumbs up, thumbs down icons + optional "Why this?" provenance
8. **Suggestion pills** — right-aligned, only on the latest message when not streaming

**Chip badge:** Rounded pill with icon + label. Styles per type:
| Type | Background | Text Color | Icon |
|---|---|---|---|
| memory-saved | surfaceTint | contentPrimary | cpu |
| memory-updated | surfaceTint | contentPrimary | cpu |
| goal-progress | surfaceTint | contentPrimary | target |
| goal-risk | #fee2e2 | #dc2626 | alert-triangle |
| milestone | #dcfce7 | #16a34a | star |
| handoff | #dbeafe | #2563eb | arrow-up-right |

**Proposal cards:** bg surfaceTint (#F0EDE8), 1px border rgba(10,10,10,0.05), borderRadius 16, padding 12
- Confirmed state: checkmark icon + "Saved to memory" / "Goal created" text
- Buttons: "Remember"/"Set up goal" = dark bg pill; "Not now"/"Just chatting" = outlined pill

**Action footer:** Row of 20×20 image icons with 16px gap:
- Copy (shows checkmark SVG for 2 seconds after tap)
- Thumbs up (toggles between outline/filled)
- Thumbs down (toggles between outline/filled)
- "Why this?" text button (toggles provenance card below)

**Suggestion pills:** Right-aligned column, gap 8
- Border: 0.75px solid #5C5B5A, borderRadius 24
- Padding: top 11, bottom 12, horizontal 16
- Text: 16px regular, contentPrimary, single line truncated
- Max 3 pills, only shown on latest AI message, hidden during streaming

### 8.5 TypingIndicator

**Layout:** Row with 6px gap, paddingHorizontal 4, paddingVertical 8

**Orb:** 14.5px clipped circle (overflow hidden, borderRadius 60) containing a 24px animated GIF. The GIF is preloaded at app startup.

**"Analyzing..." text:** Split into 3 segments for staggered color animation:
- "Ana" → phase 1 shimmer
- "lyzi" → phase 2 shimmer (offset)
- "ng..." → phase 3 shimmer (offset)

Color interpolation cycles between `#c4a882` (warm gold) and `#00a2c7` (brand cyan) over 2200ms, repeating infinitely in a ping-pong loop. Each segment has offset keyframes creating a sweep effect.

Font: 16px medium, lineHeight 20.

### 8.6 ScrollAnchor (Scroll-to-Bottom Button)

**Trigger:** Appears when user scrolls more than 120px from the bottom. Hidden when keyboard is visible.

**Appearance:** 36px white circle with shadow (rgba(10,10,10,0.08) offset 0,2 radius 8). Contains a 16px container with a left-arrow SVG rotated -90° (points downward). Fill color: #1A1919.

**Animation:** Fade in 200ms (opacity 0→1, scale 0.8→1), fade out 150ms (reverse). Uses `Easing.out` for enter, `Easing.in` for exit.

**Position:** Centered horizontally, positioned `bottom: inputBarHeight + 16`, zIndex 50.

### 8.7 MemoryCenter (Full-Screen Panel)

**Header:** "Coach memory" title, back chevron, standard panel header layout

**Search bar:** Height 48, white bg, 24px radius, 1px border, search icon + TextInput

**Filter button:** 32×32, 12px radius. Active state: dark bg with white filter icon. Opens a horizontal scrollable row of category filter chips.

**Filter chips:** Pill shape, surfaceTint bg (active: dark bg, white text). Shows category label + count.

**Memory cards (per memory item):**
- White bg, 20px radius, 16px padding, 12px gap, 1px border rgba(10,10,10,0.08)
- Shadow: rgba(10,10,10,0.06) offset 0,2 radius 8

**Card content (view mode):**
- Memory text: 16px regular
- Meta row: source label + date OR "Paused · not used in chat"
- Action icons (in 16×16 containers, 16px gap between):
  - Pencil: 13×13 filled, color #706F6E
  - Pause: ~8.6×10.67 stroked, color #706F6E (shows Play icon when paused, with 1.5px right optical offset)
  - Delete: 11.5×14.5 filled, color #FA2D25

**Card content (edit mode):**
- TextInput matches Text exactly (zero padding/margin, scrollEnabled=false) — no visual shift on edit
- Character counter: `{length}/300` in #BDBBB9
- Save button: #00A2C7 bg, white bold text, 12px radius
- Cancel button: 1.5px border rgba(10,10,10,0.2), 12px radius

**Section headers:**
- First section: 12px top padding (search bar provides spacing above)
- Subsequent sections: 24px top padding
- All: 12px bottom padding, 4px horizontal padding
- Text: 14px medium, secondary color

**Paused memory:** 0.5 opacity on the entire card

**Empty state:** Centered text explaining memories will accumulate through chat

**Toast notifications:** Triggered on delete ("Memory deleted." + Undo) and pause/resume ("Memory paused."/"Memory resumed." + Undo). The Undo action for delete calls `restoreMemory(id)` which sets status back to ACTIVE.

**Global actions (header area):** Visible only when memories exist and memoryMode !== 'off':
- **Pause all / Resume all:** Labeled pill button with icon. Toggles all non-deleted memories between ACTIVE and PAUSED. Toast: "All memories paused." / "All memories resumed."
- **Delete all:** Labeled pill button (danger color). Opens confirmation dialog with dynamic count ("This will permanently delete N memories. The coach will forget everything it has learned about you."). Cancel + Delete all buttons.

**Memory-off state:** When `memoryMode === 'off'`, shows a dedicated empty state regardless of existing memory count. Title: "Memory is off". Description: "The coach won't save or use memories while memory is turned off. You can change this in Settings."

### 8.9 SettingsPanel (Slide-in Panel)

Slide-in from right (same animation pattern as ChatHistory). Accessible from overflow menu "Settings" item.

**Header:** "Settings" title, back chevron, standard panel header layout.

**Memory section:**
- Section label: "Memory", 14px medium, secondary color
- Card: white bg, 20px radius, 1px border, shadow. Contains 3 radio-style rows:
  - **Full memory** — "Coach automatically remembers details from your conversations."
  - **Ask first** — "Coach will ask before saving any memory from your conversations."
  - **Memory off** — "Coach won't save or use any memories. Goals are still tracked."
- Selected row shows checkmark (stroke icon, contentBrand color)
- Rows separated by 0.75px border

**Memory mode type:** `'full' | 'ask-first' | 'off'` — defaults to `'full'`. Stored in `CoachContext.memoryMode`.

### 8.10 GoalsDashboard (Full-Screen Panel)

**Header:** "My goals" title, back chevron

**Goal cards (white bg, 20px radius, shadow):**
- **Top section:** Progress ring (72px SVG circle) + goal info
  - Progress ring: 4px stroke, track color #e5e1da, fill color varies by status (primary/red/green)
  - Percentage text centered inside ring
  - Goal title + type badge ("Save Up" / "Pay Down")
  - Amount text: "$X of $Y"
  - Status row: icon + status text + confidence percentage

- **Detail rows:** Monthly target, est. completion, linked account
- **Milestones:** Row of pills (25%, 50%, 75%, 100%). Reached: dark bg, white text, checkmark. Completed: green bg, green text.
- **"Ask about this goal" button** (not on completed goals)
- **Completed card:** Light green background

**Footer:** "{n} active · {n} completed · Auto-updated from your accounts"

**Divider between active/completed:** Centered "COMPLETED" label with lines on either side

### 8.9 ChatHistory (Full-Screen Panel, Slide-In)

**Entry animation:** Slides in from right (translateX: screenWidth → 0, 300ms cubic bezier 0.4,0,0.2,1)

**Header:** "Chat history" title, back chevron (left), new-chat compose icon (right)

**Search bar:** Same style as Memory Center search

**Session list:**
- Grouped by month ("March 2026", etc.)
- Group label: 13px medium, secondary color
- Sessions in white card (16px radius, 0.75px border)
- Each session row: 16px padding, session title (16px regular, single line)
- Dividers between sessions in same group (0.75px, 16px horizontal margin)

**Session tap:** Slide out right → load session → close panel
**New chat tap:** Slide out → save current session → close

### 8.10 ScenarioSwitcher (Bottom Sheet)

**Backdrop:** rgba(0,0,0,0.35), tappable to dismiss

**Sheet:** Slides up from bottom, surfaceBase bg, 20px top radius, max 70% screen height, shadow

**Drag handle:** 36×4px rounded bar, centered

**Header:** "Experience Demos" title + X close button

**Scenario rows:** Icon circle (28px) + title + subtitle. Active row: dark bg, white text, checkmark.

**10 scenarios listed in order:**
1. Cold Start Onboarding
2. Returning Member (Session 4+)
3. Memory Lifecycle
4. Goal Discovery & Creation
5. Proactive Risk Alert
6. Milestone Celebration
7. Weekly Financial Recap
8. Cross-Product Orchestration
9. Recommendation Safety Tiers
10. Free Chat

**Footer:** "All data is simulated" (11px, centered)

**Gesture:** Pan down to dismiss (threshold: 120px or velocity > 800). Spring back if not past threshold.

### 8.11 Toast

**Global toast system** wrapping the entire app.

**Appearance:** Dark bg (#0f0f0f), 16px radius, 16px padding, row layout
- Message: 14px medium, white
- Undo button (optional): 14px bold, cyan #32b7d9

**Position:** `bottom: max(safeArea.bottom, 16) + 16`, horizontal margins 16px, zIndex 9999

**Animation:** Slide up from 100px below + fade in (300ms). Slide down + fade out on dismiss (250ms).

**Auto-dismiss:** 3 seconds default. Timer resets if a new toast is shown.

---

## 9. Design Tokens

### Color Palette

**Full Pacific reference:** `.agents/skills/pacific-color-mapper/SKILL.md` — all 181 semantic tokens, primitive hex scales, hex reverse-lookup. **Alpha/opacity tokens:** `docs/PACIFIC_COLOR_TOKENS.md`. **Component-level usage context:** `docs/DESIGN_SYSTEM_MAP.md` §1.1.

**⚠ Several prototype hex values below are Tailwind CSS approximations, NOT Pacific primitives.** The Pacific column shows the correct production value.

| Prototype Token | Prototype Hex | Pacific Token | Pacific Hex | Usage |
|---|---|---|---|---|
| `surfaceBase` | `#FAF8F5` | `surfaceBase` | `#faf8f5` ✓ | App background |
| `surfaceElevated` | `#FFFFFF` | `surfaceElevatedDefault` | `#ffffff` ✓ | Cards, inputs, menus |
| `surfaceTint` | `#F0EDE8` | ~`surfaceInfoDefault` | `#f0eeeb` ~ | Chip bg, tints |
| `surfaceEdge` | `rgba(10,10,10,0.10)` | `strokeDividePrimary` | same ✓ | Borders, dividers |
| `surfaceMuted` | `#F5F3F0` | `surfaceInfoLabel` | `#f5f3f0` ✓ | Muted backgrounds |
| `contentPrimary` | `#1A1919` | `contentPrimaryDefault` | `#1a1919` ✓ | Primary text |
| `contentSecondary` | `#706F6E` | `contentSecondary` | `#706f6e` ✓ | Secondary text |
| `contentBone600` | `#5C5B5A` | `contentIndicatorUnselected` | `#5c5b5a` ✓ | User bubble bg, send button |
| `contentBrand` | `#00A2C7` | `contentBrand` | `#00a2c7` ✓ | Brand cyan |
| `contentMuted` | `#D0CCC5` | `contentHint` | `#dbdad7` ❌ | Placeholder icons |
| `danger` | `#FA2D25` | `contentDanger` | `#fa2d25` ✓ | Delete icon |
| `success` | `#22C55E` | `contentSuccess` | `#1bc245` ❌ | Goal completion ring |
| `successDark` | `#16A34A` | `contentSuccessEmphasized` | `#19a623` ❌ | Milestone text |
| `successBg` | `#DCFCE7` | `surfaceSuccessDefault` | `#ebf9ee` ❌ | Milestone chip bg |
| `warning` | `#B45309` | `contentCaution` | `#8c6914` ❌ | Actionable tier text |
| `warningBg` | `#FEF3C7` | `surfaceCautionDefault` | `#fff5e5` ❌ | Actionable tier bg |
| `info` | `#2563EB` | `contentTip` | `#006280` ❌ | Handoff text |
| `infoBg` | `#DBEAFE` | `surfaceTipDefault` | `#edf8fc` ❌ | Handoff bg |
| `dangerChipBg` | `#FEE2E2` | `surfaceDangerDefault` | `#ffe5e5` ~ | Risk chip bg |
| `progressTrack` | `#E5E1DA` | `surfaceIndicatorUnselected` | `#dbdad7` ⚠ | Goal ring track |
| toast bg | `#0F0F0F` | `surfaceToast` | `#0f0f0f` ✓ | Toast notification |
| undo cyan | `#32B7D9` | `buttonBrandDefaultInverse` | `#32b7d9` ✓ | Toast undo button |

### Typography

**Font family:** TT Norms (5 weights loaded at startup)
- Regular (400): `TTNorms-Regular.otf`
- Medium (500): `TTNorms-Medium.otf`
- Bold (700): `TTNorms-Bold.otf`
- Italic: `TTNorms-Italic.otf`
- BoldItalic: `TTNorms-BoldItalic.otf`

**Type scale:**

| Usage | Size | Weight | LineHeight | Extra |
|---|---|---|---|---|
| Greeting title | 24px | Medium | 28px | letterSpacing -0.5 |
| AI section header | 18px | Medium | 24px | letterSpacing -0.2 |
| Body text / AI text | 16px | Regular | 20px | paddingHorizontal 4 |
| User message text | 16px | Regular | 20px | |
| Panel titles | 16px | Medium | 20px | centered |
| Menu items | 16px | Medium | 20px | |
| Input text | 16px | Regular | 20px | |
| Suggestion pills | 16px | Regular | 20px | |
| Memory content | 16px | Regular | 20px | |
| Toast message | 14px | Medium | 20px | |
| Toast undo | 14px | Bold | 20px | color #32b7d9 |
| Memory meta | 14px | Medium | 20px | secondary color |
| Memory section label | 14px | Medium | 20px | secondary color |
| System message | 13px | Medium | 18px | |
| Chip label | 12px | Medium | — | letterSpacing 0.1 |
| Card label (empty state) | 12px | Medium | 16px | letterSpacing 0.6, uppercase |
| Demo indicator | 12px | Medium | 16px | letterSpacing 0.1 |
| Goal status text | 12px | Medium | — | |
| Detail labels | 12px | Regular | — | secondary color |
| Disclaimer | 11px | Regular | 16px | secondary color |
| Footer text | 11px | Regular | 14px | secondary color |
| Safety badge | 10px | Medium | 12px | |
| Type badge | 10px | Medium | — | uppercase |

### Spacing Constants

| Token | Value | Usage |
|---|---|---|
| Screen padding | 16px | Horizontal padding on all major containers |
| Message gap | 16px | marginBottom on each message wrapper |
| AI content gap | 8px | Gap between content blocks in AI messages |
| Section divider margin | 16px | marginVertical on dividers |
| Card border radius | 16-20px | Cards, proposal cards |
| Pill border radius | 9999px | Chips, buttons, input pills |
| Input pill radius | 24px | Input bar, search bars |
| Header height | 44px | All header bars |
| Icon button size | 24×24px | Standard tap targets |
| Memory action icons | 16×16px | Icon containers in memory cards |
| Action footer icons | 20×20px | Copy, thumbs up/down |
| ScrollAnchor size | 36×36px | Scroll-to-bottom button |
| Send button size | 32×32px | In input bar |

---

## 10. Animations & Motion

### Streaming Content Entrance
- **Duration:** 500ms
- **Properties:** opacity 0→1, translateY 6→0
- **Trigger:** When first token appears (replaces typing indicator)
- **Per-block fade:** Each new content block fades in at 300ms as content grows during drain

### Post-Stream Element Stagger (after streaming finishes)
When streaming completes (`isStreaming` goes from true to false), inline elements animate in sequence:
1. **Safety badge:** 50ms delay, 250ms fade+slide
2. **Proposal cards:** 100ms delay, 300ms fade+slide
3. **Action footer:** 200ms delay, 300ms fade+slide
4. **Suggestion pills:** 400ms delay, 350ms fade+slide

Each uses `FadeInView`: opacity 0→1 + translateY 8→0, native driver.

### Typing Indicator Shimmer
- **Duration:** 2200ms loop (ping-pong)
- **Type:** Color interpolation on 3 text segments
- **Colors:** `#c4a882` (warm gold) ↔ `#00a2c7` (brand cyan)
- **Stagger offsets:**
  - "Ana": [0, 0.3, 0.5, 0.8, 1]
  - "lyzi": [0, 0.15, 0.4, 0.7, 1]
  - "ng...": [0, 0.3, 0.55, 0.85, 1]

### Empty Chat Keyboard Animation
- **Orb:** Spring (damping 20, stiffness 180, mass 0.8) → translateY -60, scale 0.95
- **Full card:** 350ms ease → fade out + translateY 20 + scale 0.97
- **Half cards:** 300ms ease, 80ms delay → fade out + translateY 24 + scale 0.97
- **Reverse:** Same spring/timing back to origin

### Chat History Slide
- 300ms cubic bezier (0.4, 0, 0.2, 1)
- Enter: translateX screenWidth → 0
- Exit: translateX 0 → screenWidth

### Scenario Switcher
- Pan gesture with dismiss threshold 120px or velocity > 800
- Spring back: damping 20, stiffness 300
- Backdrop opacity tracks sheet position

### ScrollAnchor
- Show: 200ms opacity 0→1, scale 0.8→1 (Easing.out)
- Hide: 150ms opacity 1→0, scale 1→0.8 (Easing.in)
- Hidden when keyboard visible

### Toast
- Enter: translateY 100→0, opacity 0→1 (300ms)
- Exit: translateY 0→100, opacity 1→0 (250ms)

---

## 11. Data Persistence & Sessions

### Current Implementation: In-Memory Only

All data is held in React state. Nothing persists to disk or database. Refreshing the app resets everything.

### Chat Sessions

Sessions are stored as an in-memory array (`chatHistory: ChatSession[]`).

**Save trigger:** When user:
- Taps the close (X) button in the header
- Opens a different session from chat history
- Starts a new chat from the dropdown menu

**Save logic:**
1. If current messages exist AND mode is `live`:
   - Create/update session with current messages, memories, goals
   - Title = AI-generated title if available, otherwise "New conversation"
   - If session already exists (same ID), update it in-place
   - If new, prepend to history array
2. Reset all state for new chat
3. Cancel any pending AI requests

**Load logic:**
1. Cancel any pending requests
2. Increment session version (prevents stale updates)
3. Restore messages, memories, goals from saved session
4. Set title and mode

**Session grouping in UI:** Sessions are grouped by month for display ("March 2026", etc.)

### Title Generation

- Triggered once: after the first AI response completes in a live session
- Uses `/api/title` endpoint with last 6 messages (max 500 chars each)
- Title is 3-6 words, no markdown formatting
- Guarded by `titleGeneratedRef` flag and session version check
- Default title until generated: "Coach"

---

## 12. Demo Scenario System

### Overview

10 pre-built scenarios demonstrate specific product features. Each scenario includes:
- Pre-loaded messages (user + AI turns with all formatting)
- Pre-loaded memories (for the Memory Center)
- Pre-loaded goals (for the Goals Dashboard)

### Scenario Data

Each scenario is defined with:
```
Scenario {
  id: string           // e.g. 'cold-start', 'returning-member'
  title: string        // Display name
  subtitle: string     // One-line description
  icon: string         // Icon identifier
  messages: Message[]  // Pre-loaded conversation
  memories: Memory[]   // Pre-loaded memory items
  goals: Goal[]        // Pre-loaded goal items
}
```

### Shared Test Data

5 shared memories used across most scenarios:
- "Prefers detailed breakdowns with numbers" (PREFERENCES)
- "Dining out is a focus area for spending reduction" (PRIORITIES)
- "Household of 2, living in San Francisco Bay Area" (ABOUT_ME)
- "Saving for a wedding in October 2027" (PRIORITIES)
- "Prefers weekly check-ins over daily notifications" (PREFERENCES)

2 shared goals:
- Emergency Fund: $8,400 of $12,000 (70%), ON_TRACK, 0.82 confidence
- Credit Card Payoff: $2,940 of $4,200 (70%), AT_RISK, 0.58 confidence

### Demo Response Engine

In demo mode, user messages are matched against ~25 keyword patterns in `aiResponse.ts`. Each pattern returns a pre-written response with appropriate:
- Formatted content (matching the parser's expected markdown format)
- Chips (status badges)
- Memory proposals / auto-save memories
- Goal proposals / auto-create goals / auto-update goals
- Suggestions
- Safety tiers
- Provenance data

If no pattern matches, the message falls through to the live AI API.

### 10 Scenarios

1. **Cold Start Onboarding** — Coach introduces itself, explains capabilities
2. **Returning Member** — Spending breakdown with goal progress chips
3. **Memory Lifecycle** — Explicit save, implicit proposal, memory correction
4. **Goal Discovery & Creation** — Insight-to-action flow: auto-saves a fact (`ABOUT_ME`), proposes a `PRIORITIES` memory + goal together as a bundle the user can accept
5. **Proactive Risk Alert** — Goal setback triggers memory proposal; AI references existing `PRIORITIES` memories (wedding timeline) when explaining the impact of a confidence drop
6. **Milestone Celebration** — 75% emergency fund milestone; existing memories provide context
7. **Weekly Financial Recap** — Proactive weekly summary with goal progress
8. **Cross-Product Orchestration** — AI uses memories to personalize multi-product allocation; proposes new `ABOUT_ME` memory
9. **Recommendation Safety Tiers** — Shows all 4 safety tier badges
10. **Free Chat** — Empty conversation with some memories/goals pre-loaded

---

## 13. Environment Variables & Dependencies

### Environment Variables

| Variable | Description |
|---|---|
| `PORT` | Server port (required, set by Replit) |
| `EXPO_PUBLIC_DOMAIN` | API domain for mobile client (set by Replit) |
| `SESSION_SECRET` | Session secret (available but not actively used) |

### API Server Dependencies

| Package | Version | Purpose |
|---|---|---|
| express | ^5 | HTTP server framework |
| cors | ^2 | Cross-origin request handling |
| pino / pino-http | ^9 / ^10 | Structured logging |
| @workspace/integrations-openai-ai-server | workspace | OpenAI proxy client (GPT-4o-mini) |
| tsx | (dev) | TypeScript execution |

### Mobile Client Dependencies

| Package | Version | Purpose |
|---|---|---|
| expo | ~54.0 | React Native framework |
| expo-router | ~6.0 | File-based routing |
| expo-font | ~14.0 | Custom font loading |
| expo-asset | ^55.0 | GIF preloading |
| expo-splash-screen | ~31.0 | Splash screen management |
| react-native | 0.81.5 | Core framework |
| react-native-reanimated | ~4.1 | Color interpolation animations |
| react-native-gesture-handler | ~2.28 | Pan gestures (scenario sheet) |
| react-native-svg | 15.12 | Custom SVG icons |
| react-native-safe-area-context | ~5.6 | Safe area insets |
| react-native-keyboard-controller | ^1.20 | KeyboardAvoidingView |
| @expo/vector-icons (Feather) | ^15.0 | Standard icon set |
| @tanstack/react-query | (catalog) | Available but minimally used |

### Custom SVG Icons

Most icons are custom SVGs defined inline in their component files (not from a library). These include:
- ChevronLeft, Close, Clock, More (three dots), ChatNew, Memory (lightbulb), Goals (target circles), Pencil, Delete (trash), Search, Filter, Pause, Play, DemoFlask, SendArrow, ScrollAnchor (rotated left arrow)

The action footer uses PNG image assets: copy, thumbs-up, thumbs-up-filled, thumbs-down, thumbs-down-filled.

---

## 14. Edge Cases & Interaction States

### Streaming & Network

- **ReadableStream detection:** If `ReadableStream` is undefined (native mobile), the client skips SSE streaming entirely and uses the non-streaming `/api/chat` endpoint
- **Retry logic (web streaming):** Up to 2 retries with exponential backoff (500ms, 1000ms), then falls back to non-streaming endpoint
- **Abort on switch:** When user switches scenarios, starts new chat, or loads a session, any in-flight API requests are aborted via `AbortController`
- **Stale response prevention:** `sessionVersionRef` counter checked at every async boundary — mismatched versions discard results
- **Network error message:** "Unable to connect to the server. Please check your connection and try again."
- **Rate limit (server):** 20 requests/IP/minute. Returns 429 with "Too many requests. Please wait a moment and try again."
- **API error (server):** 500 with "Something went wrong. Please try again."

### Keyboard Handling

- FlatList uses `keyboardDismissMode="on-drag"` and `keyboardShouldPersistTaps="handled"`
- Keyboard listeners track visibility state for ScrollAnchor behavior
- When keyboard shows: scroll to end after 100ms
- When keyboard shows: immediately hide ScrollAnchor (100ms fade)
- When `isTyping` becomes true: blur input, dismiss keyboard
- All header buttons, suggestion pills, and menu items dismiss keyboard before action

### Scroll Behavior

- `maintainVisibleContentPosition` enabled on FlatList (keeps content stable when new items added above)
- User messages trigger `scrollToEnd` after 50ms delay
- Scenario switch: scroll to offset 0 (top) after 100ms
- `onScrollToIndexFailed` fallback: estimates offset from average item length, retries after 200ms
- ScrollAnchor threshold: 120px from bottom
- ScrollAnchor hidden during keyboard visibility

### Memory Editing

- TextInput in edit mode has zero padding/margin to match display Text exactly — prevents visual shift when entering/exiting edit mode
- `scrollEnabled={false}` on edit TextInput so it grows naturally
- When edit starts: measures card bottom position, if it would be obscured by keyboard, scrolls the panel to keep it visible (waits 350ms for keyboard animation)
- Character limit: 300, with live counter shown during editing
- Empty or whitespace-only edits rejected (original text kept)

### Memory Delete/Restore

- Delete is a soft-delete (status → 'DELETED', card hidden from view)
- Toast shows "Memory deleted." with Undo button
- Undo calls `restoreMemory(id)` which sets status back to 'ACTIVE'
- Toast auto-dismisses after 3 seconds
- If user taps Undo, toast immediately dismissed

### Memory Pause/Resume

- Toggle between ACTIVE ↔ PAUSED status
- Paused cards shown at 0.5 opacity
- Meta text changes to "Paused · not used in chat"
- Toast shows "Memory paused." / "Memory resumed." with Undo
- Play icon has 1.5px right optical offset for visual centering

### Goal Status Logic

When `currentAmount` is updated on a goal:
- If `currentAmount >= targetAmount`: status → COMPLETED, all milestones marked reached
- If `currentAmount/targetAmount >= 0.7` and not COMPLETED: status → ON_TRACK
- If `currentAmount/targetAmount < 0.7` and not COMPLETED: status → AT_RISK

### Demo ↔ Live Mode Switching

- Switching to demo: loads scenario data, sets chatMode to 'demo', cancels any pending live requests
- Switching to live: clears all data, sets chatMode to 'live', resets title to "Coach"
- Demo mode shows cyan "Demo" indicator below title in header
- Live mode shows no indicator (clean title only)

### Panel System

- Only one panel can be active at a time
- `setActivePanel(panel)` toggles: if same panel already active, closes it ('none')
- Panels use `absoluteFillObject` + `zIndex: 100` to overlay the chat
- MemoryCenter, GoalsDashboard: instant show/hide
- ChatHistory: slide-in/out animation (300ms)
- ScenarioSwitcher: bottom sheet with gesture

### Empty States

- **No messages:** EmptyChat welcome screen with starter prompts
- **No memories:** "No memories yet. The coach will start learning as you chat."
- **No memories (filtered):** "No memories match your search" with "Clear filters" link
- **No goals:** Target icon + "No goals yet. Tell the coach what you're working toward..."
- **No chat history:** "No chat history yet"
- **No active chat + close button:** Shows flask icon instead of X (opens demo switcher instead of closing)

---

## 15. Flutter Migration Mapping

### Direct 1:1 Mappings

| React Native | Flutter Equivalent |
|---|---|
| `View` | `Container`, `Column`, `Row`, `SizedBox` |
| `Text` | `Text` with `TextStyle` |
| `TextInput` | `TextField` or `TextFormField` |
| `FlatList` | `ListView.builder` |
| `ScrollView` | `SingleChildScrollView` |
| `Pressable` | `GestureDetector` or `InkWell` |
| `Image` | `Image.asset` / `Image.network` |
| `StyleSheet` | `ThemeData` + component-level `BoxDecoration` |
| `SafeAreaView` | `SafeArea` |
| `useSafeAreaInsets` | `MediaQuery.of(context).padding` |
| `KeyboardAvoidingView` | Built-in with `Scaffold.resizeToAvoidBottomInset` |
| `Platform.OS` | `Platform.isIOS` / `Platform.isAndroid` |

### State Management

| React Native | Flutter |
|---|---|
| `React.createContext` + `useContext` | `Provider` / `Riverpod` / `Bloc` |
| `useState` | `StatefulWidget` + `setState` |
| `useCallback` | Method references (no equivalent needed) |
| `useRef` | Instance variables on `State` class |

### Animation Mapping

| React Native | Flutter |
|---|---|
| `react-native-reanimated` SharedValue | `AnimationController` + `Tween` |
| `useAnimatedStyle` | `AnimatedBuilder` |
| `interpolateColor` | `ColorTween` |
| `withTiming` | `CurvedAnimation` with `Curves` |
| `withSpring` | `SpringSimulation` |
| `withRepeat` | `AnimationController.repeat` |
| `RNAnimated.timing` | `AnimationController.animateTo` |
| `useNativeDriver: true` | All Flutter animations are "native" |

### Streaming

| React Native (current) | Flutter |
|---|---|
| `ReadableStream` detection | Use `http` package `StreamedResponse` (works natively on all platforms) |
| SSE parsing with `TextDecoder` | Parse SSE lines from `response.stream` |
| `setInterval` for token drain | `Timer.periodic` |
| `AbortController` | `StreamSubscription.cancel()` |

### Icons

| React Native | Flutter |
|---|---|
| Custom SVG components | Flutter `CustomPainter` or `flutter_svg` package |
| `react-native-svg` | `flutter_svg` package |
| `@expo/vector-icons` Feather | `Icons` class or `feather_icons` package |

### Fonts

| React Native | Flutter |
|---|---|
| `expo-font` + `useFonts` | `pubspec.yaml` font declaration + `TextStyle(fontFamily: ...)` |

### Key Patterns to Preserve

1. **Token drain queue:** Collect all tokens from stream, then reveal progressively via `Timer.periodic` at 15ms (streaming) or 8ms (non-streaming) intervals. Same visual effect in both paths.

2. **Typing indicator lifecycle:** Insert a placeholder message immediately with user message → show animated orb → replace placeholder in-place when response ready → start drain animation.

3. **Session versioning:** Maintain a counter that increments on every conversation switch. Check this counter at every async boundary. Discard results from stale versions.

4. **Section dividers:** Only inserted between sections (before a header that has non-header content above it). Never before the first header.

5. **Content block parsing:** Use a sealed class / union type for `ContentBlock`. The parser must handle all markdown variants defensively since LLM output isn't perfectly controlled.

6. **Panel overlay architecture:** Panels are full-screen overlays with absolute positioning, not navigation routes. Only one active at a time. This keeps the chat screen always mounted and preserves scroll position.

7. **Inline card state machine:** Each proposal card (memory, goal, insight) has 3 states: pending (show buttons) → confirmed (show checkmark) → dismissed (remove card). State is stored on the message itself, not separately.

---

*This document reflects the complete state of the SoFi Coach Chat prototype as of the date of generation. All component behaviors, edge cases, and interaction states described above are implemented and tested in the React Native codebase.*