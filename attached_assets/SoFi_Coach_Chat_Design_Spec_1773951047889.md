# SoFi Coach Chat — Design & Implementation Spec

A complete reference for rebuilding the Coach Chat prototype in any framework (Flutter, SwiftUI, etc.). Covers every design token, component, data model, interaction pattern, and screen.

---

## 1. Design Tokens

### 1.1 Colors

| Token | Hex | Usage |
|---|---|---|
| **surface-base** | `#faf8f5` | App background, header bg, footer bg, panel bg |
| **surface-elevated** | `#ffffff` | Cards, input fields, menu dropdowns |
| **surface-tint** | `#f0ede8` | Hover states, chip backgrounds, empty state circles |
| **surface-edge** | `rgba(10,10,10,0.10)` | Borders, dividers (1px or 0.75px) |
| **surface-edge-light** | `rgba(10,10,10,0.05)` | Proposal card borders |
| **surface-muted** | `#f5f3f0` | Safety tier badge bg (info/suggestion) |
| **content-primary** | `#1a1919` | Primary text, active icons, send button bg |
| **content-secondary** | `#706f6e` | Secondary text, inactive icons, placeholders |
| **content-bone-600** | `#5C5B5A` | User message bubble bg, suggestion pill borders (lowercase `#5c5b5a` equivalent) |
| **content-statusbar** | `#0a0a0a` | iOS status bar text, signal/wifi/battery icons |
| **content-muted** | `#d0ccc5` | Empty state icons |
| **danger** | `#fa2d25` | Delete menu text/icon |
| **danger-light** | `#ef4444` | Memory delete icon |
| **danger-chip-text** | `#dc2626` | Risk/alert chip text |
| **danger-chip-bg** | `#fee2e2` | Risk/alert chip bg, delete icon hover bg |
| **success** | `#22c55e` | Completed goals progress ring |
| **success-dark** | `#16a34a` | Milestone text, checkmark confirmation, completed goal text |
| **success-bg** | `#dcfce7` | Milestone chip bg, confirm-pulse flash, completed goal card bg |
| **success-border** | `#bbf7d0` | Completed goal card border |
| **success-bg-light** | `#f0fdf4` | Completed goal card background |
| **warning** | `#b45309` | Actionable safety tier text |
| **warning-bg** | `#fef3c7` | Actionable safety tier bg |
| **info** | `#2563eb` | Handoff text |
| **info-bg** | `#dbeafe` | Handoff chip bg, handoff safety tier bg |
| **progress-track** | `#e5e1da` | Goal progress ring background track, completed section divider |

### 1.2 Typography

**Font Family:** TT Norms (Regular 400, Medium 500, Bold 700). Fallback: Helvetica, sans-serif.

| Style | Size | Weight | Line Height | Letter Spacing | Usage |
|---|---|---|---|---|---|
| **Status bar** | 15px | 600 (Semibold) | — | 0.2px | iOS time display. Font: `-apple-system, 'SF Pro Display', 'TT Norms', sans-serif` |
| **Title small** | 16px | 500 (Medium) | 20px | 0 | App bar title "Coach", panel headers, menu items |
| **Title medium** | 18px | 500 (Medium) | 24px | -0.2px | Bold standalone headers in AI messages |
| **Body large** | 16px | 400 (Regular) | 20–22px | 0 | Message text, input text, search placeholder |
| **Body** | 15px | 400 (Regular) | 20px | 0 | Memory card content, suggestion pill text |
| **Body small** | 14px | 400 (Regular) | 18px | 0 | Descriptions, starter prompts, insight-to-action title |
| **Label** | 13px | 500 (Medium) | 18px | 0 | Confirmation text, sub-labels, "Ask about this goal" button, system message text |
| **Label small** | 12px | 500 (Medium) | 16px | 0.1px | Category headers, chip text, meta info, proposal buttons, goal detail rows |
| **Caption** | 11px | 400 (Regular) | 14px | 0 | Tooltips, milestone pills, completed section divider label |
| **Micro** | 10px | 500 (Medium) | 12px | 0 | Safety tier badges, goal type labels |

### 1.3 Spacing

| Token | Value | Usage |
|---|---|---|
| space-2 | 2px | Minimal padding (menu vertical py-0.5) |
| space-4 | 4px | Small gaps (pr-1 on left nav zone) |
| space-6 | 6px | Chip gaps (gap-1.5), paragraph gaps (gap-1.5) |
| space-8 | 8px | Component internal gaps (gap-2), suggestion gaps |
| space-10 | 10px | Chip horizontal padding (px-2.5) |
| space-12 | 12px | Search bar vertical padding, card padding (p-3), medium gaps (gap-3) |
| space-16 | 16px | Screen horizontal padding (px-4), input left padding, card padding (p-4) |
| space-20 | 20px | Icon gap in right nav controls (gap-5) |

### 1.4 Border Radii

| Token | Value | Usage |
|---|---|---|
| radius-full | 9999px | Circular buttons, pill chips, badges, suggestion pills |
| radius-24 | 24px | Input fields (search, message), user message bubble, rounded-3xl |
| radius-20 | 20px | More menu dropdown |
| radius-16 | 16px | Memory cards, goal cards, proposal cards, provenance card |
| radius-12 | 12px | Filter toggle button |

### 1.5 Shadows

| Name | Value | Usage |
|---|---|---|
| **frame-shadow** | `0 20px 60px rgba(0,0,0,0.2)` | Phone frame outer shadow |
| **dropdown-shadow** | `0 0 1px rgba(10,10,10,0.16), 0 6px 16px rgba(10,10,10,0.04), 0 14px 32px rgba(10,10,10,0.02)` | More menu dropdown |
| **scroll-btn-shadow** | `0 0 1px rgba(10,10,10,0.16), 0 2px 8px rgba(10,10,10,0.04), 0 4px 16px rgba(10,10,10,0.02)` | Scroll-to-bottom button |

### 1.6 Animations

| Name | Duration | Easing | Description |
|---|---|---|---|
| **fade-in** | 200ms | ease | Dropdown menus, filter chip reveal, add-memory form: opacity 0→1, translateY -10→0 |
| **confirm-pulse** | 500ms | ease | Memory/goal confirmation: scale 1→1.02→1, bg flashes green `#dcfce7` at 30% |
| **bounce** (typing) | 1200ms | ease-in-out, infinite | Typing indicator dots: translateY 0→-6px→0, opacity 0.4→1→0.4, staggered 200ms per dot. Defined inline in TypingIndicator.tsx (not in index.css). |

---

## 2. Screen Layout

### 2.1 Phone Frame

- **Viewport:** 390 × 844px (iPhone 14 Pro)
- **Background behind frame:** `#e8e4de`
- **Frame border-radius:** 40px
- **Frame shadow:** `0 20px 60px rgba(0,0,0,0.2)` (no border — shadow only)
- **Frame container:** `padding: 40px 24px` on outer page, centered

### 2.2 Demo Selector (outside frame)

- Position: absolute, top=40px, left=24px (top-10 left-6), z=50
- Sits outside the phone frame in the page background
- Dropdown with "COACH DEMOS" label + current scenario title + chevron
- See Section 8 for scenario list and order

### 2.3 Main Chat Screen Structure

```
┌─────────────────────────────┐
│ Status Bar (54px)           │  ← iOS-style: time left, signal/wifi/battery right
│ Title Bar (44px)            │  ← Close | "Coach" | History + More
│ [Temporary Chat Banner]     │  ← Optional: dark bar when temp chat active
├─────────────────────────────┤
│                             │
│ Message List (scrollable)   │  ← flex-1, overflow-y-auto, px=16, pb=120
│                             │
│ [Scroll-to-bottom button]   │  ← Appears when >120px from bottom
├─────────────────────────────┤
│ Input Footer                │  ← 48px input pill + home indicator
│ Home Indicator (5×134px)    │  ← Centered, #0a0a0a at 20% opacity
└─────────────────────────────┘
```

**Content top padding:** 114px normally, 138px when temporary chat banner visible.
This accounts for status bar (54px) + title bar (44px) + extra space (16px), plus 24px for the banner.

---

## 3. Components

### 3.1 App Bar

**Status Bar:** Height 54px (h-[54px]). Left: time "9:41" (15px semibold, tracking 0.2px, `#0a0a0a`, SF Pro font). Right: signal bars + wifi + battery SVGs in `#0a0a0a`.

**Title Bar:** Height 44px (h-11).

| Zone | Spec | Content |
|---|---|---|
| **Left** | w=104px, pl=16px, pr=4px | Close (X) button — 14×14 SVG, stroke `#1a1919`, strokeWidth 1.5 |
| **Center** | flex-1 | "Coach" — 16px medium `#1a1919`, centered, truncated |
| **Right** | w=104px, pr=16px, gap=20px, justify-end | History icon (clock SVG, 20×20, `#706f6e`) + More icon (dots-in-circle SVG, 20×20, `#706f6e`) |

All icon buttons in title bar: 24×24px tap target, hover opacity 70%.

**More Menu (dropdown):**
- Position: absolute, top=100% of nav, right=16px (right-4), mt=4px (mt-1)
- Width: 212px
- Background: white
- Border-radius: 20px
- Overflow: hidden
- Padding: 2px vertical (py-0.5), 16px horizontal (px-4)
- Shadow: dropdown-shadow
- Animation: fade-in (200ms)
- Items: 48px height each, 12px vertical padding (py-3)
- Item text: 16px medium `#1a1919`, left-aligned, line-height 20px, flex-1
- Item icons: 20–24px, right-aligned, `#1a1919`
- Dividers: 0.75px solid `rgba(10,10,10,0.1)` (borderBottom on each item except last)
- **Menu items (in order):**
  1. "New chat" — custom chat-bubble-plus SVG icon (24×24)
  2. "Coach memory" — Brain icon 20px → opens Memory Center panel
  3. "Goals" — custom bullseye SVG icon (24×24, 3 concentric circles) → opens Goals Dashboard panel
  4. "Rename" — custom pencil SVG icon (24×24)
  5. "Delete" — text `#fa2d25`, custom trash SVG icon (24×24, `#fa2d25`), no bottom border
- Close behavior: clicking outside (mousedown listener), clicking More icon again, or selecting any menu item

### 3.2 Message Bubbles

**AI Messages:**
- Full width, left-aligned
- No background color (renders directly on `#faf8f5` surface)
- Outer wrapper: flex col, gap=8px (gap-2)
- Text container: px=4px (px-1)
- Text: 16px regular `#1a1919`, line-height 22px, flex col gap=6px (gap-1.5)
- Blank line spacer: 12px height (h-3)
- **Bold text (two tiers):**
  - Standalone bold line (entire line is bold, or pattern like "1. **text**"): rendered as `<strong>` at 18px medium
  - Inline bold within a sentence: rendered as `<strong>` at 16px medium (same size, just weight change)
- Bullet points: prefixed with "• ", 8px left padding (pl-2)

**User Messages:**
- Right-aligned (items-end), left padding 60px (pl-[60px])
- Background: `#5c5b5a` (bone-600)
- Border-radius: 24px (rounded-3xl)
- Padding: 11px top (pt-[11px]), 12px bottom (pb-3), 16px horizontal (px-4)
- Max-width: 298px
- Text: 16px regular, white, line-height 20px

**System Messages:**
- Centered (justify-center), py=8px (py-2)
- Inline pill: inline-flex, items-center, gap=8px (gap-2), px=16px, py=8px, rounded-full
- **Non-proactive:** bg `#f0ede8`, text `#706f6e`, 13px medium
- **Proactive:** bg `#1a1919`, text white, 13px medium, Sparkles icon 13px prefix

### 3.3 Chips / Badges

Appear above AI message content in a flex-wrap row with gap=6px (gap-1.5), px=4px (px-1).

| Type | Background | Text Color | Icon |
|---|---|---|---|
| memory-saved | `#f0ede8` | `#1a1919` | Brain 11px |
| memory-updated | `#f0ede8` | `#1a1919` | Brain 11px |
| goal-progress | `#f0ede8` | `#1a1919` | Target 11px |
| goal-risk | `#fee2e2` | `#dc2626` | AlertTriangle 11px |
| milestone | `#dcfce7` | `#16a34a` | Sparkles 11px |
| handoff | `#dbeafe` | `#2563eb` | ArrowUpRight 11px |
| alert | `#fee2e2` | `#dc2626` | AlertTriangle 11px |

- Styling: 12px medium text, pill shape (rounded-full), px=10px (px-2.5), py=4px (py-1), inline-flex with gap=6px (gap-1.5)

### 3.4 Safety Tier Badge

Appears below message content (mt=4px), px=4px.

| Tier | Text | Background | Text Color | Icon |
|---|---|---|---|---|
| informational | "Informational" | `#f5f3f0` | `#706f6e` | ShieldCheck 10px |
| suggestive | "Suggestion" | `#f5f3f0` | `#706f6e` | ShieldCheck 10px |
| actionable | "Actionable — needs your approval" | `#fef3c7` | `#b45309` | ShieldCheck 10px |
| handoff | "Complex — human advisor recommended" | `#dbeafe` | `#2563eb` | ArrowUpRight 10px |

- Styling: 10px medium text, rounded (4px), px=8px (px-2), py=2px (py-0.5), inline-flex, gap=4px (gap-1)

### 3.5 Action Footer (copy, thumbs, provenance)

Below each AI message:
- Row: flex, items-center, gap=12px (gap-3), px=4px (px-1), mt=4px (mt-1)
- Each button: p=4px (p-1), hover opacity 70%
- **Copy button:** Copy icon 16px `#706f6e`, swaps to Check icon `#1a1919` for 2 seconds after click
- **Thumbs up:** ThumbsUp 16px, toggles `#706f6e` ↔ `#1a1919`
- **Thumbs down:** ThumbsDown 16px, toggles `#706f6e` ↔ `#1a1919`
- **"Why this?"** (provenance toggle, only if message has provenance): ml=4px (ml-1), flex row, gap=4px (gap-1), 12px text `#706f6e`, hover text `#1a1919`. ChevronDown/Up 12px. Expands a card below.

**Provenance expanded card:** mx=4px, px=12px, py=10px, rounded-2xl (16px), bg `#f0ede8`, 12px text `#706f6e`, line-height 16px.

### 3.6 Suggestion Pills

- Position: below action footer, right-aligned (items-end), mt=4px (mt-1)
- Direction: vertical column (flex-col), gap=8px (gap-2)
- Only shown on the latest AI message (`isLatest` prop)
- Each pill: inline-flex, items-center, rounded-3xl (24px), bg transparent, border `0.75px solid #5C5B5A`
- Padding: 11px top (pt-[11px]), 12px bottom (pb-3), 16px horizontal (px-4)
- Text: 15px regular `#1a1919`, line-height 20px
- Hover: bg `#f0ede8`

### 3.7 Memory Proposal Card

- Margin-top: 12px (mt-3)
- Background: `#f0ede8`, border: 1px `rgba(10,10,10,0.05)` (`#0a0a0a0d`), radius: 16px (rounded-2xl), padding: 12px (p-3)
- Bottom padding: 16px (pb-[16px])
- Header row: flex, items-start, gap=8px (gap-2), mb=10px (mb-2.5)
  - Brain icon 14px `#706f6e`, mt=2px (mt-0.5), shrink-0
  - Text 13px `#1a1919`, line-height 18px: `Want me to remember: "{content}"?` — content in `<em>` (italic)
- Buttons row: flex, gap=8px (gap-2), ml=16px (ml-[16px])
  - **"Remember":** pill, bg `#1a1919`, white text, 12px medium, px=12, py=6, hover bg `#2d2c2b`
  - **"Not now":** pill, border `rgba(10,10,10,0.1)`, text `#706f6e`, 12px medium, px=12, py=6, hover bg white
- **Confirmed state:** Same card structure (bg `#f0ede8`, border, radius), plays `confirm-pulse` animation.
  - Content: flex, items-center, gap=8px
  - CheckCircle2 14px `#16a34a` + "Saved to memory" 13px `#706f6e` medium

### 3.8 Goal Proposal Card

Same base layout as memory proposal (bg, border, radius, padding) but no extra bottom padding:
- Header: flex, items-start, gap=8px, mb=10px
  - Target icon 14px `#706f6e`, mt=2px, shrink-0
  - Title: 13px medium `#1a1919`, line-height 18px
  - Details: 12px `#706f6e`, mt=2px — "Target: $X · $Y/mo · Month Year · Linked: Account"
- Buttons row: flex, gap=8px (no ml offset)
  - **"Set up goal":** pill, bg `#1a1919`, white text, 12px medium, hover bg `#2d2c2b`
  - **"Just chatting":** pill, border `rgba(10,10,10,0.1)`, text `#706f6e`, 12px medium, hover bg white
- **Confirmed state:** CheckCircle2 14px `#16a34a` + "Goal created — check your goals panel" 13px `#1a1919` medium. Plays confirm-pulse.

### 3.9 Insight-to-Action Card

Combined memory + goal proposal. mt=12px (mt-3), rounded-2xl (16px), bg `#f0ede8`, border `#0a0a0a0d`, p=12px.

**Unresolved state:**
- Top row: flex, items-start, gap=10px (gap-2.5)
  - Dark circle: 32×32px (w-8 h-8), rounded-full, bg `#1a1919`, centered Target icon 14px white, mt=2px, shrink-0
  - Title: 14px medium `#1a1919`, line-height 18px
  - Details: 12px `#706f6e`, mt=2px, line-height 16px — "$X · $Y/mo · ~Z months"
- Buttons row: flex, items-center, gap=8px (gap-2), mt=12px (mt-3)
  - **"Set up goal":** pill, bg `#1a1919`, white text, 13px medium, px=14 (px-3.5), py=7px (py-[7px]), hover bg `#2d2c2b`
  - **"Just remember":** pill, no bg/border, text `#706f6e`, 13px medium, px=14, py=7px, hover text `#1a1919`
- **Accepted state (goal + memory):** rounded-2xl, border `#0a0a0a0d`, overflow hidden, bg `#f0ede8`, p=12px. CheckCircle2 14px `#16a34a` + "All set — saved to memory & goal created" 13px `#1a1919` medium.
- **Memory-only state:** Same structure. Brain icon 14px `#706f6e` + "Saved to memory" 13px `#706f6e` medium.

### 3.10 Input Footer

- Background: `#faf8f5`
- Container: px=16px, pt=12px (pt-3), pb=8px (pb-2)
- Input pill: min-height 48px, white bg, rounded-3xl (24px), 1px border `rgba(10,10,10,0.1)`, flex row, items-center, gap=8px (gap-2)
- Internal padding: pl=20px (pl-5), pr=8px (pr-2), py=8px (py-2)
- Textarea: flex-1, bg transparent, 16px regular `#1a1919`, line-height 20px, placeholder `#706f6e` "Message", resize-none, outline-none, border-none, py=4px (py-1), max-height 96px (max-h-24), overflow-y auto, single row default (rows=1)
- **Send button** (shown when text entered): 32×32px circle (w-8 h-8), bg `#1a1919`, rounded-full, shrink-0, hover bg `#2d2c2b`, disabled opacity 40%. Contains white arrow-up SVG (14×14).
- **Temporary chat button** (shown when no text): 32×32px circle, no bg, rounded-full, shrink-0, hover bg `#f0ede8`. ShieldOff icon 16px — `#706f6e` when inactive, `#1a1919` when temp chat is active.
- **Tooltip** (shows on first-ever temp chat activation, disappears after 3 seconds): absolute, bottom=100% of button, right-aligned, mb=8px. Dark pill: bg `#1a1919`, rounded-lg, px=12, py=6, 11px white text, whitespace-nowrap, shadow-lg, fade-in animation. Has a 8×8px arrow pointer (rotated 45° square) below.

**Home Indicator:** Below input, bg `#faf8f5`, flex justify-center, pb=8px (pb-2), pt=4px (pt-1). Pill: 134×5px, bg `#0a0a0a`, rounded-full, opacity 20%.

### 3.11 Scroll-to-Bottom Button

- Position: absolute, centered horizontally (left-1/2 -translate-x-1/2), bottom=101px, z=20
- Size: 36×36px circle (w-9 h-9)
- Background: white, rounded-full
- Shadow: scroll-btn-shadow
- Icon: chevron SVG (16×16), rotated -90° to point down, stroke `#0a0a0a`, strokeWidth 1.5
- Visibility: shown when `scrollHeight - scrollTop - clientHeight > 120`, hidden after programmatic scroll-to-bottom

### 3.12 Temporary Chat Banner

- Position: between title bar and message area (inside header)
- Full width, bg `#1a1919`, text white 12px, flex items-center justify-center gap=8px, py=8px (py-2)
- Content: ShieldOff icon 12px + "Temporary chat — nothing will be remembered"
- Close button: X icon 12px, ml=4px, opacity 70%, hover opacity 100%
- When visible, content area top padding increases from 114px to 138px (+24px)

### 3.13 Typing Indicator

- Container: flex, items-center, gap=6px (gap-1.5), px=4px (px-1), py=8px (py-2)
- 3 dots: each 8×8px (w-2 h-2), rounded-full, bg `#1a1919`, opacity 40%
- Animation: `bounce` keyframes, 1200ms duration, ease-in-out, infinite loop
  - 0%, 80%, 100%: translateY(0), opacity 0.4
  - 40%: translateY(-6px), opacity 1.0
- Stagger: dot 0 = 0s delay, dot 1 = 0.2s, dot 2 = 0.4s

### 3.14 Empty Chat State

Shown when `messages.length === 0`:
- Container: flex col, items-center, justify-center, py=80px (py-20), gap=16px (gap-4)
- Icon circle: 48×48px (w-12 h-12), rounded-full, bg `#f0ede8`, centered Brain icon 24px `#706f6e`
- Title: "Start a conversation" — 16px medium `#1a1919`
- Subtitle: "Type a message or try one of these topics to explore the experience." — 14px `#706f6e`, mt=4px, max-w=260px, centered
- Starter buttons: flex col, gap=8px (gap-2), max-w=300px, full width
  - Each: full width, py=12px (py-3), px=16px (px-4), rounded-2xl (16px), border 1px `rgba(10,10,10,0.1)`, 14px text `#1a1919`, hover bg `#f0ede8`, text-left
  - Prompts: "What's my financial snapshot?", "Help me set a goal", "How does my memory work?", "Show my spending breakdown"

---

## 4. Memory Center (Panel)

Slides in from right (`translate-x-full` → `translate-x-0`, 300ms transition) as full-screen overlay on z=30. Chat content fades to opacity 0 and becomes pointer-events-none when panel is open.

### 4.1 Header
- Container: flex, items-center, gap=12px (gap-3), px=16px, py=16px, border-bottom `rgba(10,10,10,0.1)`
- Back button: ChevronLeft 22px `#1a1919`, p=4px (p-1), rounded-full, hover bg `#f0ede8`
- Title row: flex, items-center, gap=8px (gap-2), flex-1
  - Brain icon 18px `#1a1919`
  - "Memory Center" — 16px medium `#1a1919`
- Add button: Plus 18px, p=6px (p-1.5), rounded-full
  - Default: hover bg `#f0ede8`, icon `#1a1919`
  - Active (form open): bg `#1a1919`, icon white

### 4.2 Add Memory Form (toggleable, below header)
- Container: px=16px, py=12px, border-bottom, fade-in animation
- Textarea: full width, px=16px, py=12px, rounded-2xl (16px), bg white, 1px border `rgba(10,10,10,0.1)`, 15px text `#1a1919`, line-height 20px, placeholder `#706f6e` "What should the coach remember?", rows=2, autoFocus
- Controls row: flex, items-center, justify-between, mt=10px (mt-2.5)
  - Category dropdown: native `<select>`, styled as pill, appearance-none, bg `#f0ede8`, rounded-full, 12px medium `#706f6e`, pl=10px, pr=28px, py=6px. ChevronDown 10px absolute right=10px as decoration. Default value: "Facts" (EXPLICIT_FACT).
  - Buttons: flex, gap=8px
    - **"Cancel":** text-only, 12px medium `#706f6e`, hover text `#1a1919`, px=12, py=6, rounded-full
    - **"Save":** pill, bg `#1a1919`, white text, 12px medium, px=12, py=6, rounded-full, hover bg `#2d2c2b`. Disabled (opacity 30%) when textarea empty.

**Category labels in dropdown:**
| Value | Label |
|---|---|
| PREFERENCE | Preferences |
| FINANCIAL_ATTITUDE | Attitudes |
| GOAL_RELATED | Goals |
| LIFE_CONTEXT | Life Context |
| CONSTRAINT | Constraints |
| EXPLICIT_FACT | Facts |

### 4.3 Search Bar
- Container: px=16px, py=12px, flex col, gap=10px (gap-2.5)
- Search row: flex, items-center, gap=12px (gap-3)
- Input: flex-1, relative container
  - Height: 48px
  - Border-radius: 24px (rounded-3xl)
  - Background: white
  - Border: 1px solid `rgba(10,10,10,0.1)`
  - Left icon: Search 13px `#706f6e`, absolute, left=16px, vertically centered
  - Text padding: pl=40px (pl-10), pr=36px (pr-9)
  - Placeholder: "Search" — 16px regular `#706f6e`
  - Clear button (shown when text present): absolute, right=14px (right-3.5), X icon 14px `#706f6e`, p=2px, rounded-full, hover bg `#f0ede8`
- **Filter toggle button:** 32×32px (w-8 h-8), shrink-0, flex centered, rounded-xl (12px)
  - Default: hover bg `#f0ede8`, SlidersHorizontal 16px `#706f6e`
  - Active (filters shown or filter selected): bg `#1a1919`, SlidersHorizontal 16px white

### 4.4 Category Filter Chips
- Visible when filter toggle is active OR when a category filter is currently selected
- Animation: fade-in
- Container: flex row, gap=6px (gap-1.5), overflow-x auto, no visible scrollbar (.no-scrollbar), pb=2px
- Each chip: shrink-0, flex row, items-center, gap=4px (gap-1), rounded-full, 12px medium, px=10px (px-2.5), py=4px (py-1)
  - Default: bg `#f0ede8`, text `#706f6e`, hover text `#1a1919`
  - Active: bg `#1a1919`, text white
  - Count badge: 11px, same color at 60% opacity
- Chips with 0 items are hidden
- Clicking active chip deselects it (sets filter to null)

### 4.5 Memory Cards
- Background: white
- Border: 1px `rgba(10,10,10,0.1)`
- Border-radius: 16px (rounded-2xl)
- Padding: 12px (p-3)
- Content: 15px regular `#1a1919`, line-height 20px
- **Meta row:** flex, items-center, gap=4px (gap-1)
  - Source + date: 12px `#706f6e`, flex-1 — "You said" (EXPLICIT) or "AI inferred" (IMPLICIT_CONFIRMED) + " · " + date (e.g., "Nov 5")
  - Action buttons (right side):
    - Edit: Pencil 13px `#706f6e`, p=6px (p-1.5), rounded-full, hover bg `#f0ede8`
    - Pause/Resume: Pause 13px `#706f6e` (or Play when paused), p=6px, rounded-full, hover bg `#f0ede8`
    - Delete: Trash2 13px `#ef4444`, p=6px, rounded-full, hover bg `#fee2e2`
- **Paused state:** entire card at 50% opacity
- **Edit mode:** textarea replaces content (same styling, rows=2, autoFocus), with Save (dark pill) and Cancel (bordered pill) buttons below, 13px medium

### 4.6 Grouped Display
- Cards are grouped by category in this order: Preferences, Attitudes, Goals, Life Context, Constraints, Facts
- Category header (shown when no single-category filter active): 12px medium `#706f6e`, uppercase, letter-spacing 0.5px
- Groups with 0 items are hidden
- When not searching/filtering, a help text appears: "These are facts the coach remembers about you. Edit or delete anything at any time." — 13px `#706f6e`, line-height 18px

### 4.7 Footer
- Container: px=16px, py=12px, border-top `rgba(10,10,10,0.1)`
- Centered text: 12px `#706f6e`
- When filtered/searching: "X of Y memories"
- When not filtered: "X active memory" or "X active memories" (plural)

### 4.8 Empty States
- **No memories at all:** Brain 32px `#d0ccc5` + "No memories yet. The coach will start learning as you chat." — 14px `#706f6e`, centered, py=48px (py-12)
- **No search/filter results:** Search 24px `#d0ccc5` + "No memories match your search" 14px `#706f6e` + "Clear filters" link (13px medium `#1a1919`, hover underline), py=40px (py-10)

---

## 5. Goals Dashboard (Panel)

Same slide-in behavior as Memory Center (translate-x, 300ms, z=30).

### 5.1 Header
- Container: flex, items-center, gap=12px (gap-3), px=16px, py=16px, border-bottom `rgba(10,10,10,0.1)`
- Back button: ChevronLeft 22px `#1a1919`, p=4px, rounded-full, hover bg `#f0ede8`
- Title row: flex, items-center, gap=8px (gap-2)
  - Target icon 18px `#1a1919`
  - **"My Goals"** — 16px medium `#1a1919`
- No header-level action button

### 5.2 Goal Card
- Container: flex col, gap=12px (gap-3), p=16px (p-4), rounded-2xl (16px), border 1px
- **Normal:** bg white, border `rgba(10,10,10,0.1)`
- **Completed:** bg `#f0fdf4`, border `#bbf7d0`

**Top row:** flex, items-start, gap=12px (gap-3)
- **Progress ring** (72×72px SVG, `rotate-[-90deg]`):
  - Background circle: cx=36, cy=36, r=28, stroke `#e5e1da`, strokeWidth=4, no fill
  - Progress arc: same center/radius, stroke color varies, strokeWidth=4, strokeLinecap=round, dasharray/offset animated (0.6s ease)
    - AT_RISK: `#ef4444`
    - COMPLETED: `#22c55e`
    - Default (ACTIVE/ON_TRACK): `#1a1919`
  - Center text: percentage, 13px medium, same color as stroke, rotated back 90° to read upright
- **Info column** (flex-1, min-w-0):
  - Title row: flex, items-center, gap=6px (gap-1.5)
    - Title: 15px medium `#1a1919`, line-height 20px
    - Type badge: pill, px=6px (px-1.5), py=2px (py-0.5), rounded (4px), 10px medium uppercase, tracking wide
      - Normal: bg `#f0ede8`, text `#706f6e` — label from map: EMERGENCY_FUND→"Save Up", DEBT_PAYOFF→"Pay Down", SAVINGS_TARGET→"Save Up", CUSTOM→"Custom"
      - Completed: bg `#dcfce7`, text `#16a34a`, label "Done"
  - Amount: 13px `#706f6e`, mt=2px — "$X of $Y" (formatted with commas)
  - Status row: flex, items-center, gap=4px, mt=4px
    - Icon 12px in status color (TrendingUp for ON_TRACK/ACTIVE, AlertTriangle for AT_RISK, CheckCircle2 for COMPLETED)
    - Status text: 12px medium in status color — "On track" | "At risk" | "Active" | "Paused" | "Goal reached!"
    - Confidence (not shown for completed): " · X% confidence" — 12px `#706f6e`, ml=4px

**Detail rows** (flex col, gap=6px):
- Each row: flex, justify-between, 12px text
  - Label (left): `#706f6e`
  - Value (right): `#1a1919` medium (or `#16a34a` for completed final amount)
- **Active goal rows:** "Monthly target" → "$X/mo", "Est. completion" → "This month" or "~X months"
- **Completed goal rows:** "Final amount" → "$X"
- **Always:** "Linked account" → account name

**Milestones section:** flex row, gap=6px (gap-1.5), flex-wrap
- Each milestone: flex, items-center, gap=4px (gap-1), px=8px (px-2), py=2px (py-0.5), rounded-full, 11px medium
  - **Reached (not completed goal):** bg `#1a1919`, text white, CheckCircle2 10px prefix
  - **Unreached:** bg `#f0ede8`, text `#706f6e`, no icon
  - **Completed goal (all milestones):** bg `#dcfce7`, text `#16a34a`, CheckCircle2 10px prefix

**"Ask about this goal" button** (shown for non-completed goals):
- Full width, flex, items-center, justify-center, gap=6px, py=8px, rounded-full, border 1px `rgba(10,10,10,0.1)`, 13px medium `#1a1919`, hover bg `#f0ede8`
- MessageSquare icon 13px prefix
- Action: returns to chat (setActivePanel("none"))

### 5.3 Sections
- Active goals rendered first (includes ACTIVE, ON_TRACK, AT_RISK, DRAFT — excludes COMPLETED and PAUSED)
- Paused goals are NOT displayed in the dashboard (filtered out alongside completed)
- **Completed section divider** (shown when both active and completed goals exist): mt=8px, flex row, items-center, gap=8px
  - Two horizontal lines: flex-1, h=1px, bg `#e5e1da`
  - Center label: "COMPLETED" — 11px medium `#706f6e`, uppercase, tracking wider (tracking-wider)
- Completed goals rendered after divider

### 5.4 Footer
- Container: px=16px, py=16px, border-top `rgba(10,10,10,0.1)`
- Centered text: 12px `#706f6e`
- Format: "X active" + optional " · Y completed" + " · Auto-updated from your accounts"

### 5.5 Empty State
- Container: flex col, items-center, justify-center, py=48px, gap=12px
- Target icon 32px `#d0ccc5`
- "No goals yet. Tell the coach what you're working toward and it will help you set one up." — 14px `#706f6e`, centered

---

## 6. Data Model

### 6.1 Memory
```
Memory {
  id: String
  category: PREFERENCE | CONSTRAINT | LIFE_CONTEXT | FINANCIAL_ATTITUDE | GOAL_RELATED | EXPLICIT_FACT
  content: String
  source: EXPLICIT | IMPLICIT_CONFIRMED
  status: ACTIVE | PAUSED | DELETED
  createdAt: DateTime
  updatedAt: DateTime
}
```

### 6.2 Goal
```
Goal {
  id: String
  type: EMERGENCY_FUND | DEBT_PAYOFF | SAVINGS_TARGET | CUSTOM
  title: String
  targetAmount: Number
  currentAmount: Number
  targetDate: DateTime
  monthlyContributionTarget: Number
  actualMonthlyContribution: Number
  status: DRAFT | ACTIVE | ON_TRACK | AT_RISK | PAUSED | COMPLETED
  confidenceScore: Number (0.0 – 1.0)
  milestones: [Milestone]
  linkedAccount: String
  createdAt: DateTime
}

Milestone {
  id: String
  label: String (e.g. "25%", "50%")
  targetPct: Number
  reached: Boolean
  reachedAt: DateTime? (only when reached)
}
```

### 6.3 Message
```
Message {
  id: String
  role: user | ai | system
  content: String
  timestamp: DateTime
  chips: [MessageChip]?
  memoryProposal: MemoryProposal?
  goalProposal: GoalProposal?
  insightToAction: InsightToAction?
  autoSaveMemory: AutoSaveMemory?
  autoCreateGoal: AutoCreateGoal?
  autoUpdateGoal: AutoUpdateGoal?
  suggestions: [String]?
  provenance: String?
  safetyTier: informational | suggestive | actionable | handoff?
  isProactive: Boolean?
}

MessageChip {
  type: memory-saved | goal-progress | goal-risk | memory-updated | milestone | alert | handoff
  label: String
}
```

### 6.4 Proposals & Auto-Actions
```
MemoryProposal {
  id: String
  content: String
  category: MemoryCategory
}

GoalProposal {
  id: String
  type: GoalType
  title: String
  targetAmount: Number
  targetDate: DateTime
  monthlyContribution: Number
  linkedAccount: String
}

InsightToAction {
  id: String
  memory: { content: String, category: MemoryCategory, saved: Boolean }
  goalProposal: GoalProposal
  dismissed: Boolean
}

AutoSaveMemory {
  content: String
  category: MemoryCategory
}

AutoCreateGoal {
  type: GoalType
  title: String
  targetAmount: Number
  targetDate: DateTime
  monthlyContribution: Number
  linkedAccount: String
}

AutoUpdateGoal {
  goalTitle: String
  monthlyContribution: Number?
  targetDate: DateTime?
  status: GoalStatus?
  confidenceScore: Number?
  currentAmount: Number?
}
```

---

## 7. State Management

### 7.1 App State
```
messages: [Message]
memories: [Memory]
goals: [Goal]
isTyping: Boolean
temporaryChat: Boolean
activePanel: none | memory | goals | scenarios
activeScenario: ScenarioId
showOnboarding: Boolean
```

Default state on app load: `activeScenario: "returning-member"`, `activePanel: "scenarios"`, messages/memories/goals loaded from the returning-member scenario.

### 7.2 Key Actions
| Action | Description |
|---|---|
| addMessage | Append message to list |
| setTyping | Toggle typing indicator |
| setTemporaryChat | Toggle temp chat mode (disables memory saving and auto-goal creation; goal proposals and auto-updates still work) |
| setActivePanel | Switch between panels; toggles off if same panel clicked again |
| switchScenario | Load a demo scenario: replaces messages, memories, goals; resets typing, temp chat, panel to "none"; sets showOnboarding=true for cold-start |
| confirmMemory | Convert MemoryProposal → active Memory (source=IMPLICIT_CONFIRMED); removes proposal from message; adds "Saved to memory" chip |
| dismissMemoryProposal | Remove proposal from message (no memory created) |
| addMemory | Manually add a new Memory (from Memory Center form or auto-save) |
| editMemory | Update memory content and updatedAt |
| pauseMemory | Toggle status between ACTIVE ↔ PAUSED |
| deleteMemory | Soft-delete: set status to DELETED (card hidden from view) |
| confirmGoal | Convert GoalProposal → active Goal (status=ACTIVE, confidenceScore=0.88, 4 milestones at 25/50/75/100%); removes proposal; adds chip |
| dismissGoalProposal | Remove proposal from message |
| updateGoalAmount | Update goal.currentAmount; auto-compute status (≥100% → COMPLETED, ≥70% → ON_TRACK, else AT_RISK) |
| updateGoalSettings | Update goal fields by title match (monthlyContributionTarget, targetDate, status, confidenceScore, currentAmount) |
| acceptInsightToAction | Save memory + create goal from InsightToAction; add both chips |
| saveInsightMemoryOnly | Save only memory part of InsightToAction; mark goal as dismissed |
| dismissInsightToAction | Mark InsightToAction as dismissed (no save) |

### 7.3 AI Response Flow (sendMessage in Chat.tsx)

1. User message added to store
2. Input cleared, typing=true
3. Delay: `800 + Math.random() * 700` ms (800–1500ms)
4. `generateAIResponse(text, store)` called — keyword-matching function returns partial Message with content, chips, proposals, etc.
5. If `autoSaveMemory` exists and NOT in temporary chat: add "Saved to memory" chip, auto-create Memory (source=IMPLICIT_CONFIRMED)
6. If `autoCreateGoal` exists and NOT in temporary chat and goal doesn't already exist: auto-create Goal via confirmGoal
7. If `autoUpdateGoal` exists: update matching goal via updateGoalSettings
8. In temporary chat mode: memoryProposal and insightToAction are suppressed (set to undefined), autoSaveMemory is skipped

---

## 8. Demo Scenarios

The app ships with 10 pre-built demo scenarios. A dropdown selector sits outside the phone frame (absolute, top-left corner of the page).

**Display order** (matches code's SCENARIO_ORDER):

| # | ID | Title | Subtitle | Icon | Memories | Goals |
|---|---|---|---|---|---|---|
| 1 | cold-start | Cold Start Onboarding | New member's first session — coach introduces itself and seeds initial preferences | sparkles | None | None |
| 2 | returning-member | Returning Member (Session 4+) | Fully personalized — coach references memories and goals without prompting | user-check | 5 shared | Emergency Fund |
| 3 | memory-lifecycle | Memory Lifecycle | Explicit save, implicit proposal, 'what do you know about me', correction flow | brain | 5 shared + 1 explicit fact | Emergency Fund |
| 4 | goal-discovery | Goal Discovery & Creation | AI detects goal intent from natural conversation and proposes structured setup | target | 3 shared | Emergency Fund |
| 5 | proactive-risk | Proactive Risk Alert | AI initiates contact when a goal's confidence drops — Pattern 4 from the strategy | alert-triangle | 5 shared | Emergency Fund + Credit Card (AT_RISK) |
| 6 | milestone-celebration | Milestone Celebration | 75% milestone reached on Emergency Fund — celebration + next step nudge | party-popper | 5 shared | Emergency Fund (75%, 3 milestones reached) |
| 7 | weekly-recap | Weekly Financial Recap | Proactive weekly summary — spending, goals, and one recommended action | calendar-check | 5 shared | Emergency Fund + Credit Card |
| 8 | cross-product | Cross-Product Orchestration | Coordinating across checking, savings, invest, and credit — SoFi's unique advantage | layers | 5 shared | Emergency Fund + Credit Card |
| 9 | tiered-safety | Recommendation Safety Tiers | Demonstrates all 4 safety tiers: informational → suggestive → actionable → human handoff | shield-check | 5 shared | Emergency Fund |
| 10 | free-chat | Free Chat | Start a fresh conversation — type anything to explore | message-circle | 2 shared (first 2) | Emergency Fund |

**Default scenario on app load:** returning-member

### 8.1 Shared Mock Data

**5 Shared Memories (SHARED_MEMORIES):**
1. PREFERENCE: "Prefers detailed breakdowns with numbers" (EXPLICIT, 14 days ago)
2. FINANCIAL_ATTITUDE: "Dining out is a focus area for spending reduction" (IMPLICIT_CONFIRMED, 7 days ago)
3. LIFE_CONTEXT: "Household of 2, living in San Francisco Bay Area" (EXPLICIT, 21 days ago)
4. CONSTRAINT: "Saving for a wedding in October 2027" (EXPLICIT, 10 days ago)
5. PREFERENCE: "Prefers weekly check-ins over daily notifications" (IMPLICIT_CONFIRMED, 5 days ago)

**Emergency Fund Goal (EMERGENCY_FUND_GOAL):**
- Type: EMERGENCY_FUND, Title: "Emergency Fund"
- Target: $12,000, Current: $8,400 (70%)
- Target date: 240 days from now
- Monthly target: $450/mo, Actual: $460/mo
- Status: ON_TRACK, Confidence: 82%
- Linked: "SoFi Savings"
- 4 milestones: 25% (reached, 60 days ago), 50% (reached, 20 days ago), 75% (not reached), 100% (not reached)
- Created: 90 days ago

**Credit Card Goal (CREDIT_CARD_GOAL):**
- Type: DEBT_PAYOFF, Title: "Credit Card Payoff"
- Target: $4,200, Current: $2,940 (70%)
- Target date: 120 days from now
- Monthly target: $420/mo, Actual: $380/mo
- Status: AT_RISK, Confidence: 58%
- Linked: "SoFi Credit Card"
- 4 milestones: 25% (reached, 45 days ago), 50% (reached, 12 days ago), 75% (not reached), 100% (not reached)
- Created: 75 days ago

### 8.2 Scenario Conversation Content

Each scenario pre-loads specific messages. Full message content, chips, suggestions, and proposals are defined in `coachStore.ts` `buildScenarios()`.

**Key scenario flows:**

- **Cold Start:** AI intro → user agrees → AI asks financial priority → 4 suggestion buttons
- **Returning Member:** User asks "top spending categories" → AI gives personalized breakdown referencing memories (dining focus, Bay Area, preference for detail) + 2 goal-progress chips
- **Memory Lifecycle:** 6 messages: explicit save → "what do you know" → correction flow → memory-updated chip + new proposal
- **Goal Discovery:** User mentions credit card payoff → AI shows balance + 2 options + actionable safety tier
- **Proactive Risk:** System proactive alert → AI shows confidence drop (82%→58%) with risk chip + 2 recovery options + memory proposal
- **Milestone Celebration:** System proactive → AI celebrates 75% milestone with milestone chip + journey timeline
- **Weekly Recap:** System proactive → AI weekly summary: spending, goals, subscription insight
- **Cross-Product:** User got $3,000 bonus → AI splits across 3 products (credit card, savings, invest) + memory proposal
- **Tiered Safety:** 4 exchanges demonstrating all safety tiers: informational (balance check) → suggestive (dining advice) → actionable (transfer) → handoff (investment rebalancing)
- **Free Chat:** Empty messages, 2 memories, 1 goal — user starts fresh

### 8.3 AI Response Generator

`generateAIResponse(userInput, store)` is a keyword-matching function. Key input patterns and their responses:

| Input Pattern | Response Type | Key Features |
|---|---|---|
| "outdated" / "that dining thing" | Memory correction | memory-updated chip + new memoryProposal |
| "help me pay off" / "pay off credit" | Debt payoff plan | goalProposal + actionable safety tier |
| "help me prioritize" | Priority ranking | Math-based ordering |
| "sounds good" / "let's go" | Onboarding next step | Priority question + suggestions |
| "building an emergency fund" | InsightToAction | Combined memory + goal proposal |
| "paying off debt" | InsightToAction | Combined memory + goal proposal |
| "saving for" / "big purchase" | Follow-up | memoryProposal |
| "spend smarter" | Preference question | Communication style question |
| "quick summary" / "detailed breakdown" | Preference save | autoSaveMemory |
| "set up option a/b" | Goal creation | autoCreateGoal |
| "increase this month" | Goal update | autoUpdateGoal (confidence restored) |
| "extend deadline" | Goal update | autoUpdateGoal (new target date) |
| "confirm transfer" / "set up all three" | Cross-product execution | autoUpdateGoal (COMPLETED) + milestone chip |
| "connect me" / "planner" | Handoff | handoff chip + safety tier |
| "what can you help" | Capabilities overview | 4 category breakdown |
| "dining trend" | Personalized (uses `prefersDetail` flag) | Long vs short version based on memory |
| "show goal" | Dynamic | Lists current goals from store |
| "snapshot" / "overview" | Full picture | Account balances + net worth |
| *fallback* | Generic | "That's a great question..." + starter suggestions |

---

## 9. Interaction Patterns

### 9.1 Message Flow
1. User types → send button appears (replaces temp chat button) → user presses send or Enter (Shift+Enter for newline)
2. User bubble rendered immediately, input cleared, typing=true
3. Typing indicator shows for 800–1500ms (random)
4. AI response rendered with optional: chips, proposals, safety tier, provenance, suggestions
5. Auto-scroll to bottom after each new message (50ms delay) — always scrolls, even if user had scrolled up
6. When scenario changes, scroll resets to top (scrollTop=0) instead of scrolling to bottom

### 9.2 Memory Lifecycle
- **Auto-save (transparent):** Some AI responses include `autoSaveMemory` — memory is created automatically with "Saved to memory" chip shown. No user action needed. Skipped in temporary chat mode.
- **Proposal (user confirms):** AI shows MemoryConfirmPrompt card → user clicks "Remember" → confirm-pulse animation → card transforms to "Saved to memory" confirmation → memory added to store (source=IMPLICIT_CONFIRMED)
- **Proposal dismissed:** User clicks "Not now" → card removed, no memory saved
- **Manual add:** User opens Memory Center → clicks "+" → fills in content + category → clicks "Save" → memory added (source=EXPLICIT)
- **Edit:** Click pencil icon → textarea replaces content → edit inline → Save/Cancel
- **Pause/Resume:** Click pause icon → card drops to 50% opacity, memory status toggled
- **Delete:** Click trash icon → memory set to DELETED (hidden from view, not recoverable in UI)

### 9.3 Goal Lifecycle
- **Proposal (user confirms):** GoalConfirmPrompt card → "Set up goal" → confirm-pulse → "Goal created — check your goals panel" → goal added (ACTIVE, confidence 0.88, 4 milestones)
- **Auto-create:** Some AI responses auto-create goals via `autoCreateGoal` (only if goal with same title+type doesn't already exist and not COMPLETED)
- **Auto-update:** Some AI responses auto-update goals via `autoUpdateGoal` (matches by title, updates contribution/date/status/confidence/amount)
- **Insight-to-action:** Combined card → "Set up goal" saves both memory + goal → "Just remember" saves memory only
- **Tracking:** Progress ring, milestones, confidence score visible in Goals Dashboard
- **Status auto-computation (updateGoalAmount):** ≥100% → COMPLETED, ≥70% → ON_TRACK, <70% → AT_RISK

### 9.4 Temporary Chat
- Toggle via ShieldOff button in input footer (only visible when input is empty)
- First-ever activation shows tooltip (3 second auto-dismiss): "Chat without saving to memory"
- Tooltip has dark pill with arrow pointer, fade-in animation
- Dark banner appears at top of chat
- When active: memoryProposals suppressed, autoSaveMemory skipped, insightToAction suppressed, autoCreateGoal skipped
- goalProposal cards still render (user can confirm/dismiss), and autoUpdateGoal still executes (not suppressed)
- User can exit anytime by clicking banner X or toggling button again

### 9.5 Panel Navigation
- More menu → "Coach memory" opens Memory Center panel, "Goals" opens Goals Dashboard panel
- Panel slides in from right (translate-x-full → translate-x-0, 300ms)
- Chat content fades to 0% opacity and becomes non-interactive (pointer-events-none)
- Back button (ChevronLeft) in panel header sets activePanel to "none"
- Panel also closes via goal card "Ask about this goal" button
- setActivePanel toggles: clicking same panel ID again closes it

### 9.6 Scenario Switcher Panel (in-app)

In addition to the external DemoSelector dropdown, there is an in-app ScenarioSwitcher panel accessible via `setActivePanel("scenarios")`. This is the default panel shown on app load.

**Header:** flex, justify-between, px=20px, py=16px, border-bottom
- Title: "Experience Demos" — 16px medium `#1a1919`
- Close button: X icon 18px `#1a1919`, p=6px, rounded-full, hover bg `#f0ede8`

**Intro text:** "Each scenario demonstrates a different part of the memory + goals strategy. Tap to load the conversation." — 13px `#706f6e`, line-height 18px, mb=8px

**Scenario cards:** flex col, gap=8px, each card is a button
- Layout: flex, items-start, gap=12px, p=12px, rounded-2xl (16px), text-left
- **Active card:** bg `#1a1919`, text white
  - Icon container: p=6px, rounded-full, bg `white/20`, icon 14px white
  - Title: 14px medium white, line-height 18px
  - Subtitle: 12px `white/70`, line-height 16px, mt=2px
- **Inactive card:** bg white, border 1px `rgba(10,10,10,0.1)`, hover border `rgba(10,10,10,0.2)`
  - Icon container: p=6px, rounded-full, bg `#f0ede8`, icon 14px `#1a1919`
  - Title: 14px medium `#1a1919`
  - Subtitle: 12px `#706f6e`
- Clicking any card calls `switchScenario(id)` (loads that scenario's messages/memories/goals)

**Footer:** px=16px, py=12px, border-top. "All data is simulated. Scenarios reset when you switch." — 11px `#706f6e`, centered, line-height 14px

---

## 10. Key Source Files Reference

| File | Purpose |
|---|---|
| `client/src/store/coachStore.ts` | All types, state store (Zustand), actions, demo scenario data, `generateAIResponse()` AI response engine (~1310 lines) |
| `client/src/pages/Chat.tsx` | Main chat screen: status bar, app bar, more menu, message list, input footer, scroll logic, sendMessage flow, panel switching (~464 lines) |
| `client/src/components/coach/MessageBubble.tsx` | All message rendering: chips, safety tiers, memory/goal/insight proposals, action footer, provenance, suggestions, content formatting (~370 lines) |
| `client/src/components/coach/MemoryCenter.tsx` | Memory panel: search, filter, category grouping, CRUD, add form (~348 lines) |
| `client/src/components/coach/GoalsDashboard.tsx` | Goals panel: progress rings, milestones, status, completed section (~209 lines) |
| `client/src/components/coach/TypingIndicator.tsx` | Three-dot bounce animation (~23 lines) |
| `client/src/components/coach/DemoSelector.tsx` | Scenario picker dropdown (outside phone frame), icon mapping, scenario order (~94 lines) |
| `client/src/components/coach/ScenarioSwitcher.tsx` | In-app scenario panel (inside phone frame), shown on initial load (~89 lines) |
| `client/src/App.tsx` | Router (single "/" route), phone frame container, DemoSelector positioning (~45 lines) |
| `client/src/index.css` | CSS variables (typography tokens), custom animations (fade-in, confirm-pulse), .no-scrollbar utility |
| `client/index.html` | @font-face declarations for TT Norms Regular/Medium/Bold (.otf files) |

---

## 11. Figma Reference

- **Design file:** https://www.figma.com/design/8c5TuXaL1MvZh2rkkf1e1Y/Coach-Chat
- **App bar with more menu:** node `28606-198987`
- **Search input component:** node `28657-2744`
