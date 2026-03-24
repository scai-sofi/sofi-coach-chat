# Coach Memory & Goals — Design Requirements

**Features:** Coach Chat Memory · Goals
**Feature area:** Memory → Coach Chat only · Goals → Coach Chat + App Settings
**Designer:** Cloris Cai
**Status:** Prototype complete — ready for Flutter migration

---

## Overview

This document covers two distinct but tightly interconnected features. They can ship independently, but each makes the other significantly more valuable.

### Feature 1 — Coach Chat Memory

- **What it is:** A persistence layer for SoFi Coach Chat. Coach accumulates context about a member across sessions — preferences, life events, financial attitudes, explicit facts — and uses that knowledge to personalize every subsequent response.
- **Core value:** "The more we talk, the more helpful I become." Coach stops being a stateless search box and starts behaving like someone who actually knows the member.
- **Access:** Coach Chat only. Memory is viewed and managed entirely within the chat surface — there is no standalone Settings entry point for memory.
- **Who it's for:** Any Coach Chat user. The value compounds — passive users benefit from light personalization; engaged users who actively manage their memories get a meaningfully tailored experience.

### Feature 2 — Goals

- **What it is:** A structured goal-tracking system surfaced through Coach Chat and accessible from app Settings. Members set financial goals (save up, pay down, invest toward a target), and Coach tracks progress against real account data, surfaces proactive alerts when goals are at risk, and celebrates milestones.
- **Core value:** Goals give Coach's responses a persistent target to aim at. Without goals, Coach answers questions. With goals, Coach connects every answer to something the member actually cares about.
- **Access:** Goals can be created and reviewed from Coach Chat (conversational, contextual) and from app Settings (direct, structured). **Save Up goals are directly linked to SoFi Banking's existing Vault feature** — creating a Save Up goal either connects to an existing Vault or prompts the member to create one.
- **Who it's for:** Members with a specific financial intention — an emergency fund, a debt payoff plan, a savings target — who want accountability and progress visibility.

### How memory and goals work together

Neither feature requires the other to launch, but both are significantly weaker in isolation. They share a single processing pipeline and reinforce each other at every layer:

**Shared pipeline** — Every AI response passes through `parseMarkers()` on the server, which extracts both memory markers (`[MEMORY_SAVE]`, `[MEMORY_PROPOSAL]`, `[MEMORY_UPDATE]`) and goal markers (`[GOAL_PROPOSAL]`) in a single pass. The client receives `memoryActions` and `goalActions` in the same response payload and processes them together via `applyMemoryAndGoalActions()`.

**Goals create memories** — When the AI proposes a goal, it typically also emits a `[MEMORY_SAVE]PRIORITIES|...` marker. Accepting a goal stores a PRIORITIES memory alongside it — so Coach retains persistent knowledge of what the member is working toward. Example: a goal proposal for "Pay Off Credit Card — $4,200" also saves "Wants to pay off credit card debt by year-end" as a PRIORITIES memory.

**Memories make goals personal** — When generating a response, the AI prompt includes both all active memories (who this person is, their financial context) and all active goals (what they're working toward, progress, confidence). This combination enables four goal-aware response patterns:

- **Next Step** — uses memory (financial context) + goal (specific target) to suggest an action
- **Progress Delta** — uses goal state to show how a topic affects goal progress
- **Risk Alert** — uses goal state + memory (spending patterns, income) to flag risks
- **None** — topic is unrelated to any goal; no forced connection

**Independent lifecycles** — Memories and goals can be managed independently. Pausing, editing, or deleting memories doesn't affect linked goals; completing or dismissing goals doesn't remove related memories. Deleting all memories does not delete goals (and vice versa).

**Memory mode asymmetry** — Goals keep working even when memory is turned off. A member can track goals without broader personalization:

| Memory mode | Memory behavior | Goal behavior |
|---|---|---|
| `full` | Auto-save + proposals enabled | Goals track normally; AI references goals in responses |
| `ask-first` | All saves converted to proposals | Goals track normally; memory proposals require confirmation |
| `off` | No memory reads or writes | Goals still tracked — `acceptDraftGoal` works regardless of memory mode |

**Where each feature surfaces in the UI:**

| Surface | Memory | Goals | Both |
|---|---|---|---|
| Chat inline | Proposal cards, saved/updated chips | Goal nudge (system pill) | AI responses draw on both |
| Memory Center | Full CRUD for memories | — | PRIORITIES category shows goal-related memories |
| Goals Dashboard | — | Full goal cards, milestones, progress | — |
| Settings | Memory mode toggle | — | — |
| Chat header menu | Memory Center entry | Goals Dashboard entry (with DRAFT badge) | — |

### Design principles

- **Cumulative value** — Every conversation should make the next one more useful. The member should feel the difference within three sessions.
- **Goals as the gravity center** — SoFi's differentiation is that the AI connects responses back to the member's stated goals and real financial state.
- **Trust through transparency** — In regulated finance, a black-box memory is a liability. The member must always be able to see what the AI knows, why it said what it said, and delete anything instantly.

### Why SoFi wins this

No competitor has combined all three of: **structured goals + conversational memory + real financial data** in a single integrated experience. SoFi's unique moat: a multi-product ecosystem (banking, investing, lending, credit) under one roof — with real-time account data — enabling cross-product goal orchestration that no AI-first competitor can replicate.

---

## Memory System — Implementation Spec

### Memory categories

The prototype uses three categories. The design doc's six categories (Preferences, Life Context, Financial Attitudes, Goal-Related, Explicit Facts, Other) are collapsed into three for simplicity — production may expand.

| Category      | Label        | What it captures | Save type |
|---|---|---|---|
| `ABOUT_ME`    | About me     | Life situation, household, location, accounts, financial products, income, balances, employment, factual details | Auto-save |
| `PREFERENCES` | Preferences  | Communication style, detail level, risk tolerance, financial approach, saving vs spending philosophy | Propose |
| `PRIORITIES`  | Priorities   | Current goals, focus areas, debt payoff targets, savings targets, life events being planned around | Auto-save or Propose |

### Trigger rules — when to capture memories

**Always auto-save (`MEMORY_SAVE`):**

Auto-save when the user shares any unambiguous personal fact. The AI does not ask for confirmation — it saves immediately and tells the user what was stored.

- **ABOUT_ME signals:** Financial specifics (income, salary, rent, debt amounts, balances, credit score), financial products (accounts, loans, insurance, retirement accounts), life details (age, location, household, employment), life events (wedding, baby, retirement timeline, job change), budget constraints (fixed expenses, discretionary budget, savings capacity)
- **PRIORITIES signals:** Explicit goals ("I want to save $X for Y"), declared focus areas ("My priority right now is...")

**Propose for confirmation (`MEMORY_PROPOSAL`):**

Propose when the AI infers something the user hasn't explicitly stated.

- **PREFERENCES signals:** Communication style patterns, financial philosophy, detected investment style
- **PRIORITIES signals:** Inferred goals from behavior patterns, emerging focus areas

**Update existing memories (`MEMORY_UPDATE`):**

When a user corrects or supersedes a previously stored fact (e.g., "actually I make $130k now"), the AI emits a `[MEMORY_UPDATE]` marker. The system finds the best-matching active memory in the same category and replaces its content.

### Memory markers

The AI emits markers after `[SUGGESTIONS]` in its response. Markers are stripped before the response reaches the user.

```
[MEMORY_SAVE]CATEGORY|content
[MEMORY_PROPOSAL]CATEGORY|content
[MEMORY_UPDATE]CATEGORY|new content
```

**Rules:**
- Multiple markers per response are allowed (one per distinct fact or insight)
- Related facts can be grouped into a single memory; unrelated facts get separate markers
- Saves, proposals, and updates can be mixed in the same response
- No marker if the information is already stored (deduplication)
- Content must be concise (under 100 characters)

### Memory data model (implemented)

```typescript
type MemoryCategory = 'ABOUT_ME' | 'PREFERENCES' | 'PRIORITIES';
type MemorySource = 'EXPLICIT' | 'IMPLICIT_CONFIRMED';
type MemoryStatus = 'ACTIVE' | 'PAUSED' | 'DELETED';

interface Memory {
  id: string;
  category: MemoryCategory;
  content: string;
  source: MemorySource;
  status: MemoryStatus;
  createdAt: Date;
  updatedAt: Date;
}
```

### Memory privacy mode (implemented)

```typescript
type MemoryMode = 'full' | 'ask-first' | 'off';
```

Three user-configurable memory modes, set via Settings panel:

| Mode | Memory reads | Memory writes | Behavior |
|---|---|---|---|
| `full` (default) | AI receives all active memories | Auto-save and proposals enabled | Normal personalized behavior |
| `ask-first` | AI receives all active memories | All saves converted to proposals | User must explicitly confirm before any memory is persisted |
| `off` | AI receives empty memory array | All saves/proposals/chips suppressed | No personalization; goals still tracked normally |

**Settings panel:** Accessible from the overflow menu ("Settings" item with gear icon). Slide-in panel matching ChatHistory pattern. Three radio-style rows with label + description + radio button for selected mode.

**Memory Center behavior in off mode:** Shows dedicated "Memory is off" empty state regardless of existing memories. Pause all / Delete all buttons hidden.

**Memory Center global actions:**
- **Pause all / Resume all:** Toggle button in header; pauses or resumes all non-deleted memories. Toast confirmation.
- **Delete all:** Button with confirmation dialog showing dynamic count ("This will permanently delete N memories..."). Clears entire memory store.

**Pipeline enforcement:**
- Demo mode: `generateAIResponse` receives empty memories when off; `autoSaveMemory` suppressed in off, converted to proposal in ask-first; memory chips filtered in off.
- Live mode: `applyMemoryAndGoalActions` blocks entire memory block when off; converts all actions to proposals in ask-first. Memory strings sent as empty array when off.
- Draft goals: `acceptDraftGoal` activates a DRAFT goal regardless of memory mode; `dismissDraftGoal` removes it.

### Memory source types

| Source | Label in UI | When it's set |
|---|---|---|
| `IMPLICIT_CONFIRMED` | "AI inferred" | Auto-saved by AI, or proposal confirmed by user |
| `EXPLICIT` | "You created" | Manually added by the member |

### Memory lifecycle (implemented in prototype)

| Action | How it works | Status |
|---|---|---|
| Auto-save | AI detects a fact → saves immediately → shows "Saved to memory" chip inline → chip is tappable to navigate to Memory Center | Implemented |
| Memory update | AI detects a correction → finds best-matching active memory by category + word overlap → replaces content → shows "Memory updated" chip | Implemented |
| Implicit proposal | AI infers a preference → shows proposal card with [Remember] / [Not now] buttons | Implemented |
| View all memories | Member opens Memory Center from chat header → memories grouped by category, each with source label ("AI inferred" or "You created") and date | Implemented |
| Search | Text search bar in Memory Center filters memories by content | Implemented |
| Category filter | Filter chips with per-category counts; toggle to show only one category | Implemented |
| Edit individual | Pencil icon on memory card → inline TextInput with Save/Cancel buttons and character counter (300 max) | Implemented |
| Pause individual | Pause icon on memory card → toggles between ACTIVE/PAUSED → paused memories show "Paused · not used in chat" and render at 50% opacity → play icon to resume | Implemented |
| Delete individual | Trash icon on memory card → sets status to DELETED → toast notification with "Undo" action that restores the memory | Implemented |
| Chip tap-through | Tapping a "Saved to memory" or "Memory updated" chip in chat opens Memory Center and briefly highlights the relevant memory card with a border animation | Implemented |
| Version history | Expandable row showing prior versions with timestamps | Not implemented |
| Clear all memories | Global "Delete all" with confirmation dialog (dynamic count) in Memory Center | Implemented |
| Per-category controls | Toggle per category, set retention window | Not implemented |

### Frequency & throttling

- **No cooldown**: All memory actions (saves, proposals, updates) fire immediately with no throttling

---

## Goal System — Implementation Spec

### Goal types

| Type | Purpose | Example |
|---|---|---|
| `EMERGENCY_FUND` | Build an emergency savings buffer | "$12,000 Emergency Fund" |
| `DEBT_PAYOFF` | Pay down a debt | "Pay Off Credit Card — $4,200" |
| `SAVINGS_TARGET` | Save for a specific purchase or event | "Wedding Fund — $40,000" |
| `CUSTOM` | Any other financial target | User-defined |

### Goal proposal marker

```
[GOAL_PROPOSAL]TYPE|title|targetAmount|monthsUntilTarget|monthlyContribution|linkedAccount
```

- Emitted after `[SUGGESTIONS]`, same as memory markers
- Max 1 goal proposal per response
- Numeric fields accept `$`, commas, and decimals (parser strips formatting)
- `monthsUntilTarget` must be ≥ 1
- `linkedAccount` is required (server parser rejects proposals where `linkedAccount` is empty)

### Goal + memory bundling

The client determines how to present goal proposals based on what markers accompany them:

| Markers present | UI pattern | Card type |
|---|---|---|
| `GOAL_PROPOSAL` (with or without `MEMORY_PROPOSAL PRIORITIES`) | DRAFT goal created in Goals Center; chat nudge sent | DRAFT goal in Goals Center |
| `MEMORY_PROPOSAL` alone (no goal) | Memory proposal card | `memoryProposal` |

### Goal data model (implemented)

```typescript
type GoalType = 'EMERGENCY_FUND' | 'DEBT_PAYOFF' | 'SAVINGS_TARGET' | 'CUSTOM';
type GoalStatus = 'DRAFT' | 'ACTIVE' | 'ON_TRACK' | 'AT_RISK' | 'PAUSED' | 'COMPLETED';

interface Goal {
  id: string;
  type: GoalType;
  title: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: Date;
  monthlyContributionTarget: number;
  actualMonthlyContribution: number;
  status: GoalStatus;
  confidenceScore: number;  // 0.0–1.0 (displayed as Math.round(value * 100)%)
  milestones: Milestone[];
  linkedAccount: string;
  createdAt: Date;
}

interface Milestone {
  id: string;
  label: string;
  targetPct: number;       // e.g., 25, 50, 75, 100
  reached: boolean;
  reachedAt?: Date;
}
```

### Goal lifecycle (implemented in prototype)

| Action | How it works | Status |
|---|---|---|
| Create from conversation | AI detects goal intent → emits `[GOAL_PROPOSAL]` → creates DRAFT goal in Goals Center → member taps "Set up goal" in Suggested section | Implemented |
| Goals Dashboard | Full-screen panel from chat header → progress rings, milestones, confidence scores | Implemented |
| Goal cards | Circular progress ring, status pill (On Track / At Risk), monthly contribution, target date | Implemented |
| Milestone tracking | Visual milestone markers (25%/50%/75%/100%) on goal cards | Implemented |
| Confidence scoring | Numeric score (0–100) with On Track / At Risk status | Implemented (display only — no live data) |
| Create from Settings | Dedicated Goals section in app Settings | Not implemented |
| Vault integration | Link Save Up goals to SoFi Banking Vault | Not implemented |
| Scenario simulation | "What if I increase by $X/month?" projection | Not implemented |

---

## User Flows

### 1. Cold Start — New Member Onboarding

*Prototype status: Demonstrated via demo scenario "Cold Start — First-Time Coach Intro"*

- **Session 1:** Coach introduces itself and its memory capability. Asks lightweight seed questions about financial priorities and communication preferences. Proposes one goal based on the answer. Saves 1–2 memories.
- **Sessions 2–3:** Coach references prior context without being asked. Proposes additional memories. Suggests linking additional accounts for richer context.
- **Session 4+:** Full personalization active.

### 2. Memory Lifecycle

*Prototype status: Demonstrated via demo scenario "Memory Lifecycle — Correction Flow"*

- **Explicit save** — Member shares a fact → Coach saves immediately → "Saved to memory" chip shown inline → tapping the chip opens Memory Center and highlights the saved memory
- **Memory update** — Member corrects a fact → Coach finds the best-matching memory and replaces its content → "Memory updated" chip shown inline with tap-through navigation
- **Implicit proposal** — Coach detects a pattern → proposes inline: *"Want me to remember that?"* → [Remember] / [Not now]
- **Full disclosure** — Memory Center shows all memories grouped by category, each with source label ("AI inferred" or "You created") and date
- **Edit** — Member taps pencil icon on a memory card → inline edit with Save/Cancel and character counter
- **Pause** — Member taps pause icon → memory is retained but excluded from Coach context → "Paused · not used in chat" label with 50% opacity → tap play icon to resume
- **Delete** — Member taps trash icon → memory marked as deleted → toast with "Undo" to restore
- **Search & filter** — Text search bar and category filter chips with counts for finding specific memories

*Not yet demonstrated: Version history, per-category retention controls*

### 3. Goal Discovery from Conversation

*Prototype status: Demonstrated via demo scenario "Goal Discovery & Setup" and live AI chat*

- Member mentions a financial intention ("I want to pay off my credit card this year")
- Coach recognizes the intent and asks structured follow-up: timeline, monthly capacity, current balance
- Coach presents a Goal Proposal card: goal type, target amount, monthly contribution, estimated completion date, linked account
- Member taps "Set up goal"; goal appears in Goals Dashboard with progress ring and milestones
- A PRIORITIES memory is auto-saved alongside goal creation (e.g., "Wants to pay off credit card debt by year-end")

### 4. Goal-Aware Response in Conversation

*Prototype status: Demonstrated via demo scenarios "Proactive Risk Alert" and "Weekly Recap & Next Steps"*

When applicable, Coach's response includes one of four patterns:

- **Next Step** — A concrete action the member can take now
- **Progress Delta** — How the topic connects to goal progress
- **Risk Alert** — A warning tied to goal health
- **None** — Topic is unrelated to any active goal. No forced connection.

### 5. Proactive Risk Alert

*Prototype status: Demonstrated via demo scenario "Proactive Risk Alert — Goal at Risk"*

- Coach detects a goal is at risk (confidence score drops)
- Alert includes: goal name, root cause, and recovery options
- Member selects a recovery path; Coach adjusts estimated completion date

*Not yet demonstrated: Push notifications, live account data triggers*

### 6. Milestone Celebration

*Prototype status: Demonstrated via demo scenario "Milestone Celebration — Emergency Fund"*

- Member reaches a goal milestone (25%/50%/75%/100%)
- Coach shows celebratory message with journey timeline and forward projection

*Not yet demonstrated: Push notifications, in-app animations, share functionality*

### 7. Cross-Product Orchestration

*Prototype status: Demonstrated via demo scenario "Cross-Product Orchestration"*

- Member mentions a windfall or income change ("I just got a $3,000 bonus")
- Coach identifies relevant products and presents allocation recommendations
- Member reviews and approves; Coach logs the decision as a memory and updates goal progress

---

## Chat Interface Components

### Response safety tiers

| Tier | Type                  | Badge | Guardrail | Prototype status |
| ---- | --------------------- | ----- | --------- | ---------------- |
| 1    | Informational         | Grey badge, "Informational" | None — factual answers, balance lookups | Implemented |
| 2    | Suggestive            | Grey badge, "Suggestion" | Data provenance included | Implemented |
| 3    | Actionable            | Integrated into card — shield icon + "Needs your approval" | Confidence threshold; disclaimer shown | Implemented |
| 4    | Complex / high-stakes | Orange badge, "Handoff to advisor" | AI provides framing, explicitly hands off to human | Implemented |

**Actionable tier behavior:** When a GoalProposal card is present, the standalone actionable badge is suppressed — instead, a subtle "Needs your approval" label with a shield icon is shown inside the card above the action buttons. DRAFT goals in the Goals Center also carry the actionable tier. Other tiers always show as standalone badges.

### Chat components (implemented)

| Component | Description |
|---|---|
| User message bubble | Right-aligned, `contentBone600` (bone400) bg, `contentPrimaryInverse` text |
| AI message block | Left-aligned, transparent background, streaming support |
| Memory proposal card | Inline card with [Remember] / [Not now] buttons |
| "Saved to memory" chip | Tappable chip below AI message — navigates to Memory Center and highlights the memory |
| "Memory updated" chip | Tappable chip — same navigation behavior as "Saved to memory" |
| Goal proposal card | Goal type, target, monthly contribution, timeline, [Set up goal] / [Dismiss] |
| Goal nudge (system pill) | System message notifying the user a DRAFT goal has been added to Goals Center |
| Suggestion chips | Horizontally scrollable pills below AI response |
| Safety tier badge | Color-coded pill above message text |
| Approval hint | Shield icon + "Needs your approval" label inside actionable cards (replaces standalone badge) |
| Confirmed state | SVG checkmark + summary text (e.g., "Saved to memory", "Goal created", "All set — saved to memory & goal created") |
| Action footer | Copy (with SVG checkmark confirmation), thumbs up/down (PNG icons with `tintColor: contentBone600`), provenance toggle |

### Memory Center (implemented)

Accessed via the chat header menu. Full-screen overlay panel.

| Component | Description |
|---|---|
| Panel header | Title ("Coach memory") + back chevron |
| Search bar | Text search with search icon; filters memories by content match |
| Category filter | Filter button toggles filter chips; each chip shows category name + count; tap to filter by category |
| Memory cards | Rounded cards showing content text, source label ("AI inferred" or "You created"), and date |
| Card actions | Three icon buttons per card: pencil (edit), pause/play (toggle), trash (delete) |
| Inline edit mode | TextInput with Save/Cancel buttons and character counter (300 max) |
| Paused state | Card renders at 50% opacity with "Paused · not used in chat" label |
| Delete + undo | Delete sets status to DELETED; toast with "Undo" action restores immediately |
| Category sections | Grouped by ABOUT_ME, PREFERENCES, PRIORITIES with section headers |
| Highlight animation | When navigated from a chat chip, the target memory card briefly shows a border highlight that fades over 2 seconds |
| Empty state | Message when no memories exist; "Clear filters" link when search/filter yields no results |

### Goals Dashboard (implemented)

Accessed via the chat header menu. Full-screen overlay panel.

| Component | Description |
|---|---|
| Panel header | Title + close button |
| Goal cards | Circular progress ring, title, status pill (On Track / At Risk / Completed) |
| Goal metadata | Monthly target, target date, linked account, current vs. target amount |
| Milestone markers | Visual indicators for 25%/50%/75%/100% milestones |
| Confidence indicator | Numeric score with status coloring |
| Empty state | Message when no goals exist |

---

## Theme System — Implementation Details

The prototype implements dynamic light/dark theming using Pacific design tokens. All color values are resolved at runtime through the theme context — zero hardcoded colors in render paths.

### Architecture

| File | Role |
|---|---|
| `constants/theme.ts` | Defines `lightTheme` and `darkTheme` objects (type `AppTheme`) with all color tokens |
| `context/ThemeContext.tsx` | React context + `useTheme()` hook; follows device color scheme preference |
| All components | Access `const { colors } = useTheme()` — no direct `Colors.*` imports for rendering |

### Key design decisions

- **`contentBone600`** is mapped to bone400 (`#adacaa`) in **both** light and dark mode. This is an intentional one-off for chat UI elements: user bubble background, send button, cursor, action icon tint, suggestion pill border.
- **User bubble** uses `contentBone600` bg + `contentPrimaryInverse` text (not a dedicated `whiteOnDark` or `userBubbleBg` token).
- **Active-on-primary-bg pattern**: When an element sits on a `contentPrimary` background (e.g., active scenario row), text uses `contentPrimaryInverse`, subdued text uses `inverseAlpha60`, and overlay fills use `inverseAlpha20`.
- **ErrorFallback** manages its own dark mode via `useColorScheme` internally — intentional since the theme context may not be available during error states.
- **Dark mode token bumps**: `contentMuted` → `#4d4c4b`, `contentDimmed` → `#585756`, `progressTrack` → `#3d3d3c` (bumped from near-invisible values for usability).
- **PNG action icons** (copy, thumbs up/down) use `tintColor: colors.contentBone600` for theme adaptability.

### Migration pattern

Components follow a consistent theming pattern:
1. `useTheme()` hook at the top of every component
2. Module-level lookup tables converted to factory functions `getXxx(c: AppTheme)` that return style objects
3. Static `StyleSheet.create` for layout-only styles (no color values)
4. Color values applied as inline style overrides: `style={[styles.foo, { color: colors.contentPrimary }]}`

---

## Architecture — Implementation Details

### Server side (`api-server/src/routes/chat.ts`)

- `VALID_MEMORY_CATEGORIES` Set validates category strings (`ABOUT_ME`, `PREFERENCES`, `PRIORITIES`)
- `VALID_GOAL_TYPES` Set validates goal type strings (`EMERGENCY_FUND`, `DEBT_PAYOFF`, `SAVINGS_TARGET`, `CUSTOM`)
- `parseMarkers()` extracts `[MEMORY_SAVE]`, `[MEMORY_PROPOSAL]`, `[MEMORY_UPDATE]`, and `[GOAL_PROPOSAL]` markers from AI output
- `memoryActions` and `goalActions` arrays are included in the JSON response for both `/chat` and `/chat/stream` endpoints
- The done event in SSE streaming carries both `memoryActions` and `goalActions` payloads
- Goal proposal numeric parser strips `$`, commas; validates `monthsUntilTarget >= 1`

### Client side (`mobile/context/CoachContext.tsx`)

- `VALID_MEMORY_CATEGORIES` Set mirrors the server-side validation
- `shouldAllowProposal()` returns true unless memory mode is `off` (blocks all proposals when memory is disabled)
- No cooldown — all memory and goal actions fire immediately
- `applyMemoryAndGoalActions()` processes both memory and goal actions together:
  - Memory saves → `IMPLICIT_CONFIRMED` source → "AI inferred" label in UI
  - Memory proposals → user confirms → `IMPLICIT_CONFIRMED` source → "AI inferred" label in UI
  - Memory updates → find best match by category + content similarity → replace content
  - Goal proposal (with or without PRIORITIES memory) → DRAFT goal in Goals Center + chat nudge
  - Duplicate detection: exact content match (case-insensitive) prevents re-saving

### Memory + goal flow

```
User message
  → Server builds prompt with existing memories
  → AI generates response + optional memory markers + optional goal marker
  → Server parses all markers via parseMarkers()
  → Server returns memoryActions + goalActions arrays in response JSON
  → Client processes all actions via applyMemoryAndGoalActions()
  → If goal action present: DRAFT goal created in Goals Center + chat nudge sent
  → Memory saves/updates applied immediately
  → UI shows chips, proposal cards, goal cards in Goals Center
```

### Demo mode behavior

Demo scenarios use pre-loaded canned conversations with pre-set memories and goals baked into the scenario data. The live memory/goal detection pipeline does not run on canned messages — demos are display-only snapshots.

---

## Control Hierarchy

| Level               | Feature | Surface                 | Prototype status | Controls |
| ------------------- | ------- | ----------------------- | ---------------- | -------- |
| 3 — Item            | Memory  | Memory Center           | Implemented | Edit, pause/resume, delete with undo, search, category filter |
| 2 — Global          | Memory  | Memory Center header    | Implemented | Pause all / resume all toggle, delete all with confirmation dialog |

**Not yet implemented:** Per-category toggle, retention window settings, per-response "Don't use this" flag, global Goals on/off in Settings, proactive notification controls.

---

## Demo Scenario Coverage

The prototype includes 10 demo scenarios that collectively demonstrate every implemented feature:

| # | Scenario | Features demonstrated |
|---|---|---|
| 1 | Cold Start — First-Time Coach Intro | Memory cold start, seed questions, first memory save |
| 2 | Returning Member — Personalized Session | Memory recall, context-aware responses, memory update |
| 3 | Memory Lifecycle — Correction Flow | Memory save, proposal, update, correction |
| 4 | Goal Discovery & Setup | Goal proposal from conversation, DRAFT goal in Goals Center |
| 5 | Proactive Risk Alert — Goal at Risk | Goal-aware response, risk alert pattern, recovery options |
| 6 | Milestone Celebration — Emergency Fund | Goal milestone, celebratory response, progress tracking |
| 7 | Weekly Recap & Next Steps | Goal progress delta, next step pattern |
| 8 | Cross-Product Orchestration | Multi-product allocation, DRAFT goal in Goals Center |
| 9 | Tiered Safety Responses | All 4 safety tiers, provenance, handoff |
| 10 | Free Chat — Live AI | Live GPT-4o-mini, real-time memory/goal detection |

---

## Success Metrics

**User goals:**

- Feel genuinely known by the Coach across sessions — not repeat themselves
- Understand and control what the AI has learned about them
- Set meaningful financial goals and track progress against real account data
- Receive timely, contextual alerts when plans are at risk or milestones are reached

**Business goals:**

- Increase Coach Chat session depth and return rate
- Drive goal creation and adherence as a cross-product engagement signal
- Deepen connection across SoFi product lines through in-chat recommendations
- Differentiate SoFi Coach from generic AI assistants through transparency and persistence

**North Star:** *Goal-Adjusted Financial Improvement Score* — a composite measuring whether members with active goals + memory enabled are making measurable financial progress compared to members without.

**Product metrics:**

| Metric                     | Description                                                         | Target                |
| -------------------------- | ------------------------------------------------------------------- | --------------------- |
| Memory adoption            | % of active Coach users with ≥ 3 active memories at 30 days         | > 60%                 |
| Goal creation rate         | % of Coach users who create ≥ 1 goal within first 3 sessions        | > 40%                 |
| Goal adherence (30/60/90d) | % of active goals where actual monthly contribution ≥ 80% of target | > 70%                 |
| Goal completion rate       | % of goals reaching 100% within stated timeframe                    | > 25% at 6 months     |
| Coach Chat return rate     | % of users returning within 7 days                                  | +15 pp vs. non-memory |
| Containment rate           | % of conversations resolved without human escalation                | > 65%                 |

**Safety metrics:**

| Metric                                                | Target     |
| ----------------------------------------------------- | ---------- |
| Incorrect memory rate (member-flagged)                | < 5%       |
| Compliance-flagged responses per 10,000 conversations | < 1        |
| Memory deletion SLA (request → full purge)            | < 24 hours |
| Sensitive data stored without explicit consent        | 0          |

**Experimentation plan:**

| Experiment                                         | Measure                                             |
| -------------------------------------------------- | --------------------------------------------------- |
| Memory on vs. off                                  | Return rate, session depth, CSAT                    |
| Implicit memory suggestions vs. explicit-only      | Memory adoption rate, incorrect-memory rate         |
| Goal-contextual responses vs. standard             | Goal adherence, CSAT                                |
| Proactive alerts vs. passive tracking only         | Goal completion rate, notification unsubscribe rate |
| Cold-start guided onboarding vs. organic discovery | 30-day memory count, goal creation rate             |

---

## Known Limitations (Prototype)

### L1: No memory persistence
Memories exist only in the current app session (in-memory state). Closing the app loses all memories. Production requires server-side storage with encryption at rest.

### L2: Demo scenarios use pre-loaded memories only
Demo scenarios showcase what the memory/goal system looks like in action without running the live detection pipeline. This prevents duplicate memories from canned AI responses.

### L3: No real account data
Goal progress, confidence scores, and account balances are simulated. Production requires Galileo integration for real-time financial data.

### L4: No push notifications
Proactive alerts and milestone celebrations are demonstrated in-chat only. Production requires FCM integration and notification preference controls.

### L5: No Vault integration
Save Up goals do not connect to SoFi Banking Vaults. Production requires linking goal progress to Vault balances.

---

## Open Questions for Production

- **Vault integration for Save Up goals** — Link to existing Vault vs. create new? In-chat or hand off to Banking surface? Real-time or periodic sync?
- **Galileo integration** — API contract for account balances and transaction data. Latency budget. Pre-fetch at session start + cache vs. on-demand.
- **Goal confidence scoring model** — Rules-based thresholds, ML model, or LLM-evaluated? Who owns iteration?
- **Safety tier classification** — Rules-based, LLM-classified, or hybrid? Compliance review pipeline ownership.
- **Human advisor handoff** — Scheduling mechanics. Context package format for the advisor.
- **Proactive outreach infrastructure** — FCM delivery. Per-goal-type frequency controls. Member-facing preference UI.
- **Memory edit guardrails** — Free-text edit for all memories, or confirm/deny only for AI-inferred? Gaming prevention.
- **Sensitive data policy** — Which categories require flagging? Disclosure copy requirements.
- **Scenario simulation depth** — Linear projection vs. compound/inflation? Frontend-only vs. backend service.

---

## References

| Resource                               | Link |
| -------------------------------------- | ---- |
| Figma spec                             | File `8c5TuXaL1MvZh2rkkf1e1Y` |
| Jira epic                              | [RDMEMB-661](https://sofiinc.atlassian.net/browse/RDMEMB-661) |
| Flutter package (planned)              | `flutter/feature_packages/sofi_ai_chat_memory_goals` |
| Related package                        | `sofi_coach_dashboard` |
| Competitive reference — ChatGPT Memory | Explicit + implicit two-layer system, best-in-class controls |
| Competitive reference — Claude Memory  | Project-scoped, editable summaries, import/export |
| Competitive reference — Cleo           | SMART goals, gamification, behavioral design ($129M cumulative savings) |
| Competitive reference — Origin         | SEC-regulated, multi-agent, scenario forecasting |
| Competitive reference — Monarch        | Cleanest goal-tracking UI, CFP-guided, explicit limitation disclosures |
