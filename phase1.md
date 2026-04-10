# Phase 1 Prototype — Current State

> **FAB label:** "Switch to Post-GA" (navigates to Phase 2)  
> **Code entry point:** `app/_layout.tsx` → `Phase1Nav` (Expo Router stack)

---

## Overview

Phase 1 is the original GA-era prototype. It uses Expo Router for navigation with two screens — a home screen and a chat screen — and relies on panel overlays (goals, memory, history, settings) rather than dedicated navigable screens.

---

## Navigation

Standard Expo Router stack:

- **Home** (`app/index.tsx`) — default screen
- **Chat** (`app/chat.tsx`) — slides up from bottom (`slide_from_bottom`, swipe-to-dismiss enabled)

Context providers wrapping phase 1: `CoachProvider` → `ToastProvider`.

---

## Home Screen (`app/index.tsx`)

### Layout
- **Teal header band** (`#00a2c7`) with fixed top bar, scrollable body on off-white (`#faf8f5`)
- Decorative bottom tab bar (Home, Banking, Credit card, Invest, Loans — visual only, no navigation wiring)

### Header Bar
| Element | Action |
|---|---|
| Profile icon (left) | Opens `ScenarioSwitcher` panel (persona/scenario selection) |
| "Plus" gradient pill | Visual only |
| Notification bell (right) | No action |
| **"Ask Coach"** blur pill (center-bottom of teal band) | Navigates to `/chat` |

### Teal Hero Section
- Personalized greeting from active persona (`financialProfile.greeting`)
- Reward points pill and "Get $75" pill (visual only)
- Carousel dots (visual only)

### Accounts Section
Shows cards for each product the persona holds:
- **Banking** — transaction count badge, balance
- **Credit card** — current balance (only shown if persona has a CC balance)
- **Invest** — portfolio value or acquisition CTA depending on persona
- **Crypto** — "Win $1000 in BTC" promo card

### Shortcuts
Horizontal scroll row: Personal loans, Life insurance, Serious savings, Explore all — static, no actions.

### Coach Insights
- **Spending** card — monthly amount with pacing status and chart
- **Net Worth** card — amount with account count breakdown and chart
- **Credit score** card — numeric score, status label, bar chart

### Behavior
- On mount: if `sharedScreen === 'chat'` (set by phase switcher), auto-navigates to chat
- First load with no active persona: automatically opens `ScenarioSwitcher`

---

## Chat Screen (`app/chat.tsx`)

### Structure
- `ChatHeader` at top
- `FlatList` of messages (or `EmptyChat` when no messages)
- `InputBar` pinned to bottom with keyboard avoidance
- Scroll-to-bottom `ScrollAnchor` FAB appears when scrolled > 120px from bottom

### Panels / Overlays
All rendered as full-screen absolute overlays over the chat:

| Panel | Trigger | Component |
|---|---|---|
| Goals | `activePanel === 'goals'` | `GoalsDashboard` |
| Memory | `activePanel === 'memory'` | `MemoryCenter` |
| Chat history | `activePanel === 'history'` | `ChatHistory` |
| Settings | `activePanel === 'settings'` | `SettingsPanel` |
| Goal setup wizard | `pendingGoalSetup` set in context | `GoalSetupSheet` (always mounted) |
| Suggestion cards | No messages + no active panel | `SuggestionCards` (floating above input bar) |

### Chat Header (`components/ChatHeader.tsx`)
- **Left:** Close button — saves and closes chat (`saveAndClose()`), navigates back to home
- **Title:** Session title from Coach context; "Demo" subtitle badge in brand color when in demo mode
- **Right:** History (clock icon) → opens history panel; More (…) → overflow menu

**Overflow menu — with active chat:**
New chat, Chat memory, Goals (with draft badge count), Settings, Rename (no-op), Delete (danger)

**Overflow menu — empty chat:**
Chat memory, Goals (with draft badge count), Settings

---

## Empty Chat State (`components/EmptyChat.tsx`)

- Animated floating orb (`orb-combo.png`) with float + breathe loops and a shadow
- Orb springs upward when input is focused
- Headline: "I'm Coach. How can I help?"

### Suggestion Cards
Three quick-send suggestions always shown when chat is empty:
- Full-width: **"I need help with my SoFi account"** (Support)
- Half-width: **"Why did my credit score change?"** (Credit score)
- Half-width: **"Review monthly spending"** (Spending)

Cards fade out when keyboard is open.

---

## Goals Dashboard (`components/GoalsDashboard.tsx`)

Full-screen overlay panel (`zIndex: 100`).

### App Bar
- Back → `setActivePanel('none')`
- **+** → `openNewGoalSetup()` (opens Goal Setup Sheet)

### Tabs
Segmented control with animated sliding pill indicator. Three tabs, each showing goal count:
- **Save up**
- **Pay off**
- **Investment**

### Goal Cards
**Active goal card (`GoalCard`):**
- Illustration image top-right (house or pagoda based on goal type)
- Large animated percentage counter
- Progress bar (animated fill on mount)
- Saved amount / target amount
- Est. completion, Recurring contribution, Linked account rows
- **Edit** button (no action) + **Ask Coach** button (closes goals panel)

**Completed goal card:**
- Slightly reduced opacity
- Shows Final amount (in success green) and Linked account only
- Separated from active goals by a "COMPLETED" rule divider

**Suggested goal card (`SuggestedGoalCard`):**
- Dashed border in brand color
- "Proposed by Coach" pill
- Target, Monthly contribution, Est. completion, Linked account rows
- **Dismiss** button — exit animation (shrinks down), then `dismissDraftGoal()`
- **Set up** button — lift/fade exit animation, then `acceptDraftGoal()` which opens the setup wizard

### Empty States
- No goals at all → target icon + "No goals yet. Tell the coach what you're working toward…"
- Tab has no goals → "No {tab name} goals yet"

---

## Goal Setup Sheet (`components/GoalSetupSheet.tsx`)

Full-screen wizard that slides in from the right (`zIndex: 200`). Driven by `pendingGoalSetup` in Coach context.

### Entry Points
- Tapping **Set up** on a suggested goal card (pre-fills fields, skips to review page)
- Tapping **+** in the Goals Dashboard app bar (fresh flow)

### Steps
**Save up / Investment (4 steps):** Category → Vault selection → Plan → Contribution method → Review

**Pay off (3 steps):** Category → Plan (debt tabs) → Review

| Page | Content |
|---|---|
| 0 — Category | Save up / Pay off / Investment cards |
| 1 — Vault (save up only) | Emergency Fund, Travel, Kids, House, Car, Wedding, etc. Smart defaults populated. Emergency Fund shows a member-360-aware 3 vs 6 month tip. |
| 2 — Plan | **Save up/invest:** goal name, target amount, target date, monthly contribution. **Pay off:** horizontal debt account tabs, link external account form, payment amount, payoff date. |
| 3 — Contribution (save up/invest only) | Direct deposit / Recurring / One-time — radio cards |
| 4 — Review | Summary card; interest savings callout for debt; on-track / extra callout for savings. **Create goal** button. |

Back button navigates through steps; Close dismisses the whole sheet.

---

## Memory Center (`components/MemoryCenter.tsx`)

Slides in from right. Shows all memories the Coach has about the current user.

### Header Actions
- **+** — inline add form (category auto-classified from content)
- **More (…)** — Pause all / Resume all, Delete all (with confirm dialog)

### Features
- Search bar + category filter chips (All, Priorities, Preferences, About Me)
- Memories grouped by category, sorted by most recently updated
- Each memory card: content text, source/date meta, edit / pause / resume / delete actions
- Deleted memories: toast with Undo
- Paused memories: 50% opacity
- Memory mode `off`: empty state explaining memory is disabled, no add/manage actions

---

## Message Bubbles (`components/MessageBubble.tsx`)

### Roles
- **System messages** — centered pill; proactive messages have a star icon and inverted colors
- **User messages** — right-aligned, bone-colored bubble
- **Assistant messages** — left-aligned column with chips, content, action cards, follow-up pills

### Assistant Message Anatomy
1. **Chips** (top) — memory saved/updated, goal created/at-risk/milestone, conflict resolved, handoff alerts. Tappable to navigate to the relevant memory.
2. **Content** — markdown-ish rendering: headers, bold, bullets, dividers
3. **Action cards** (after streaming ends):
   - *Memory proposal* — "Want me to remember: …?" → Remember / Not now; morphs to confirmation chip
   - *Goal proposal* — title + target + "Needs your approval" → Set up goal / Just chatting; morphs to confirmation
   - *Memory deletion card* — Delete / Keep it
   - *Member360 conflict card* — Update profile / Not now
4. **Action footer** — Copy, thumbs up/down, "Why this?" (shows provenance text)
5. **Follow-up suggestion pills** (latest message only, up to 3) — tap to send

---

## Personas

| Persona | Description | Key scenario flows |
|---|---|---|
| **Maya** | New member, no history with Coach, 25 | Cold-start onboarding |
| **Marcus** | Active goals, regular check-ins, 32 | Returning member check-in |
| **Jordan** | Carries debt, needs payoff plan, 28 | Cold-start onboarding |
| **David** | Multi-product, complex portfolio, 37 | Memory & privacy lifecycle |

Each persona has an avatar image, accent color, and a full financial profile (balances, credit score, net worth, spending status, reward points, greeting).

---

## Goals by Persona

| Persona | Goals |
|---|---|
| **Maya** | Credit Card Payoff (active, ON_TRACK) + Europe Trip 2027 (DRAFT — suggested) |
| **Marcus** | Emergency Fund (ON_TRACK) + Credit Card Payoff (AT_RISK) + Wedding Fund (ON_TRACK) |
| **Jordan** | Credit Card Payoff (ON_TRACK) + Emergency Starter Fund (PAUSED) + Move-In Fund (DRAFT — suggested) |
| **David** | Emergency Fund (ON_TRACK, 90%) + Kitchen Remodel (COMPLETED) + Roth IRA Max 2026 (INVESTMENT) + Annual Brokerage Contributions (INVESTMENT) |

---

## Prototype Switcher

A draggable pill FAB rendered on top of both prototypes (`zIndex: 9999`):
- **Phase 1** → dark background (`#1a1919`), label **"Switch to Post-GA"**
- **Phase 2** → teal background (`#00a2c7`), label **"Switch to GA"**

Drag to reposition; tap to toggle. Switching preserves `sharedPersonaId` and `sharedScreen` across prototypes.

---

## File Map

```
app/
  _layout.tsx          Root shell, providers, phase routing
  index.tsx            Home screen
  chat.tsx             Chat screen

components/
  ChatHeader.tsx       Header with back, title, history/more actions
  EmptyChat.tsx        Orb empty state + suggestion cards
  GoalsDashboard.tsx   Goals overlay panel
  GoalSetupSheet.tsx   Goal creation wizard (5-page)
  MemoryCenter.tsx     Memory management panel
  MessageBubble.tsx    All message rendering
  InputBar.tsx         Chat input
  AppBar.tsx           Shared app bar primitive
  ScenarioSwitcher.tsx Persona + scenario picker overlay
  ChatHistory.tsx      Past sessions panel
  SettingsPanel.tsx    Settings panel
  OverflowMenu.tsx     Dropdown menu primitive
  ScrollAnchor.tsx     Scroll-to-bottom FAB

context/
  CoachContext.tsx     All chat, goals, memory, persona state
  ThemeContext.tsx     Light/dark theme

constants/
  personas.ts          Persona definitions (Maya, Marcus, Jordan, David)
  personaGoals.ts      Goals seeded per persona
  scenarios.ts         Scenario/flow definitions
  types.ts             All TypeScript types
  theme.ts             Light/dark color themes
  fonts.ts             Font family constants
  shadows.ts           Shadow style presets
  seededHistory.ts     Pre-seeded chat history per scenario

prototype/
  PrototypeContext.tsx  Phase state (phase1/phase2), shared screen/persona
  PhaseSwitcherFab.tsx  Draggable phase toggle FAB
```
