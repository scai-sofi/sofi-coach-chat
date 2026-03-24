# SoFi Coach Chat — Design System Map

> Prototype-to-Pacific bridge document. Every token, component, and pattern in the Expo prototype mapped to its Pacific design system equivalent.

---

## 1. Design Tokens

### 1.1 Color Palette

> Source of truth: `pacific-color-mapper` skill (`.agents/skills/pacific-color-mapper/SKILL.md`). All mappings below are for the **Light** theme.

#### Core Surface Tokens

| Prototype Token | Hex / Value | Pacific Token | Primitive | Usage |
|---|---|---|---|---|
| `surfaceBase` | `#FAF8F5` | `surfaceBase` | `bone50` | App background everywhere |
| `surfaceElevated` | `#FFFFFF` | `surfaceElevatedDefault` | `bone0` | Cards, inputs, menus |
| `surfaceTint` | `#F0EDE8` | — (prototype only) | ~`bone150` (`#f0eeeb`, Δ3) | Chip backgrounds, tints, proposal cards |
| `surfaceMuted` | `#F5F3F0` | `surfaceInfoLabel` | `bone100` | Safety badge informational/suggestive bg |

#### Edge / Stroke Tokens

| Prototype Token | Hex / Value | Pacific Token | Primitive | Usage |
|---|---|---|---|---|
| `surfaceEdge` | `rgba(10,10,10,0.10)` | `strokeDividePrimary` / `strokeEdge` | `bone100010Pct` | Borders, dividers |
| `surfaceEdgeLight` | `rgba(10,10,10,0.05)` | — (prototype only, lighter than strokeEdge) | — | Proposal card border |

**Note:** Pacific's `surfaceEdge` token is `bone100016Pct` (0.16 opacity) — heavier than our stroke usage. Our prototype `surfaceEdge` maps to `strokeDividePrimary` (0.10), not Pacific's `surfaceEdge`.

#### Content Tokens

| Prototype Token | Hex / Value | Pacific Token | Primitive | Usage |
|---|---|---|---|---|
| `contentPrimary` | `#1A1919` | `contentPrimaryDefault` | `bone850` | Primary text, active UI, dark fills |
| `contentSecondary` | `#706F6E` | `contentSecondary` | `bone550` | Secondary text, inactive icons, meta text |
| `contentBone600` | `#5c5b5a` / `#adacaa` | — (coach-chat-specific) | Light: `bone600`, Dark: `bone400` | User bubble bg, send button bg, cursor, action icon tint, suggestion pill border |
| `contentStatusbar` | `#0A0A0A` | `contentStatusBar` | `bone1000` | Status bar tint |
| `contentMuted` | `#D0CCC5` | `contentHint` | `bone250` (`#dbdad7`, ❌ Δ25) | Empty state placeholder icons, drag handle |
| `contentDimmed` | `#BDBBB9` | `contentDisabled2` | `bone350` ✓ | Edit character count, muted more-icon |
| `contentBrand` | `#00A2C7` | `contentBrand` | `blue550` | Brand cyan — demo indicator, shimmer target |

#### Status Tokens — Danger

| Prototype Token | Hex / Value | Pacific Token | Primitive | Usage |
|---|---|---|---|---|
| `danger` | `#FA2D25` | `contentDanger` | `red600` | Delete icon color, delete button bg |
| `dangerLight` | `#EF4444` | — (prototype only) | ~`red550` (`#fb4a43`, ⚠ Tailwind) | At-risk goal ring stroke |
| `dangerChipText` | `#DC2626` | `contentDanger` | `red600` (`#fa2d25`, ❌ Tailwind) | Risk/alert chip text |
| `dangerChipBg` | `#FEE2E2` | `surfaceDangerDefault` | `red50` (`#ffe5e5`, ~ Δ4) | Risk/alert chip background |

#### Status Tokens — Success

| Prototype Token | Hex / Value | Pacific Token | Primitive | Usage |
|---|---|---|---|---|
| `success` | `#22C55E` | `contentSuccess` | `green550` (`#1bc245`, ❌ Tailwind) | Goal completion ring |
| `successDark` | `#16A34A` | `contentSuccessEmphasized` | `green600` (`#19a623`, ❌ Tailwind) | Milestone text, completed status |
| `successBg` | `#DCFCE7` | `surfaceSuccessDefault` | `green50` (`#ebf9ee`, ⚠ Tailwind) | Milestone chip bg, completed badge bg |
| `successBorder` | `#BBF7D0` | — (prototype only) | — | Success border (unused in current code) |
| `successBgLight` | `#F0FDF4` | — (prototype only, lighter than surfaceSuccessDefault) | — | Completed goal card bg |

#### Status Tokens — Warning / Caution

| Prototype Token | Hex / Value | Pacific Token | Primitive | Usage |
|---|---|---|---|---|
| `warning` | `#B45309` | `contentCaution` | `yellow600` (`#8c6914`, ❌ Tailwind) | Actionable safety tier text |
| `warningBg` | `#FEF3C7` | `surfaceCautionDefault` | `yellow50` (`#fff5e5`, ❌ Tailwind) | Actionable safety tier bg |

#### Status Tokens — Info / Tip

| Prototype Token | Hex / Value | Pacific Token | Primitive | Usage |
|---|---|---|---|---|
| `info` | `#2563EB` | `contentTip` | `blue650` (`#006280`, ❌ Tailwind — not Pacific) | Handoff chip text |
| `infoBg` | `#DBEAFE` | `surfaceTipDefault` | `blue50` (`#edf8fc`, ❌ Tailwind) | Handoff chip bg |

#### Utility Tokens

| Prototype Token | Hex / Value | Pacific Token | Primitive | Usage |
|---|---|---|---|---|
| `progressTrack` | `#E5E1DA` | `surfaceIndicatorUnselected` | `bone250` | Goal ring track color |
| `frameBg` | `#E8E4DE` | — (prototype only) | ~`bone200` | Frame backgrounds |

#### Button Tokens (reference)

| Pacific Token | Primitive | Prototype Mapping |
|---|---|---|
| `buttonNeutralDefault` | `bone850` | Confirm pill bg → `contentPrimary` |
| `buttonBrandDefault` | `blue550` | Brand actions → `contentBrand` |
| `buttonDestructiveDefault` | `red600` | Delete button bg → `danger` |

#### Previously hardcoded colors — now tokenized in `theme.ts`

All previously hardcoded `rgba()` and hex values have been migrated to named tokens in the theme system:

| Token | Light Value | Dark Value | Pacific Ref | Usage |
|---|---|---|---|---|
| `surfaceToast` | `#0F0F0F` | `#3d3d3c` | `surfaceToast` / `bone950` | Toast background |
| `toastAction` | `#32B7D9` | `#32b7d9` | — | Toast undo action text |
| `shimmerBase` | `#c4a882` | `#8c6914` | — | Typing shimmer base color |
| `scrimBackdrop` | `rgba(0,0,0,0.35)` | `rgba(0,0,0,0.55)` | `surfaceScrim` | ScenarioSwitcher backdrop |
| `scrimHeavy` | `rgba(0,0,0,0.4)` | `rgba(0,0,0,0.65)` | `surfaceScrim` | Delete-all overlay |
| `shadowEdge` | `rgba(10,10,10,0.06)` | `rgba(0,0,0,0.20)` | — | Card border (ChatHistory) |
| `borderSubtle` | `rgba(10,10,10,0.08)` | `rgba(250,248,245,0.08)` | — | Memory card border |
| `shadowColor` | `rgba(10,10,10,0.16)` | `rgba(0,0,0,0.40)` | `surfaceEdge` | Menu shadow, card shadow |
| `borderMedium` | `rgba(10,10,10,0.2)` | `rgba(250,248,245,0.20)` | — | Edit cancel button border |
| `inverseAlpha20` | `rgba(255,255,255,0.2)` | `rgba(0,0,0,0.2)` | — | Active scenario icon bg |
| `inverseAlpha60` | `rgba(255,255,255,0.6)` | `rgba(0,0,0,0.6)` | — | Active scenario subtitle |
| `whiteOnDark` | `#ffffff` | `#ffffff` | — | Text on dark backgrounds |

#### Alpha / Opacity Primitives

These appear as `rgba()` in code. Pacific names them with suffixes like `010Pct`, `016Pct`, `050Pct`, etc.

| Primitive | CSS Value | Common Semantic Tokens (Light) |
|-----------|-----------|-------------------------------|
| `bone100010Pct` | `rgba(10,10,10, 0.10)` | `strokeDividePrimary`, `strokeDivideSecondary`, `strokeEdge`, `strokeIndicatorDisabled`, `surfaceScrollHandle` |
| `bone100016Pct` | `rgba(10,10,10, 0.16)` | `surfaceEdge`, `surfaceGhostDefaultEmphasized` |
| `bone100020Pct` | `rgba(10,10,10, 0.20)` | `buttonNeutralDefaultDiminish` |
| `bone100040Pct` | `rgba(10,10,10, 0.40)` | `strokeIndicatorUnselectedEmphasized` |
| `bone100050Pct` | `rgba(10,10,10, 0.50)` | `surfaceScrim` |
| `bone10004Pct` | `rgba(10,10,10, 0.04)` | `surfaceElevatedHover`, `surfaceIndicatorHover` |
| `bone10007Pct` | `rgba(10,10,10, 0.07)` | `surfaceGhostDefault`, `buttonNeutralPressedDiminish` |
| `bone10008Pct` | `rgba(10,10,10, 0.08)` | `surfaceElevatedPressed`, `surfaceIndicatorPressed` |
| `bone030Pct` | `rgba(~bone, 0.03)` | `strokeIndicatorGhost` |

**Key distinction — surfaceEdge:** Our prototype `surfaceEdge` = `rgba(10,10,10, 0.10)` → maps to `strokeDividePrimary` (`bone100010Pct`). Pacific's `surfaceEdge` = `rgba(10,10,10, 0.16)` → `bone100016Pct` (heavier). Flutter must use the correct Pacific semantic token based on intent, not our prototype name.

**Migration note:** Prototype hex values marked ❌ are Tailwind CSS colors, NOT Pacific primitives — they must be replaced with the Pacific hex values shown in parentheses during Flutter migration. Tokens marked "prototype only" need Pacific equivalents assigned or should be consolidated into existing Pacific tokens.

### 1.2 Typography

| Prototype Key | Font File | Weight | Pacific Variable |
|---|---|---|---|
| `Fonts.regular` | `TTNorms-Regular` | 400 | `font-weight-regular` |
| `Fonts.medium` | `TTNorms-Medium` | 500 | `font-weight-medium` |
| `Fonts.bold` | `TTNorms-Bold` | 700 | `font-weight-bold` |
| `Fonts.italic` | `TTNorms-Italic` | 400i | `font-weight-regular` + italic |
| `Fonts.boldItalic` | `TTNorms-BoldItalic` | 700i | `font-weight-bold` + italic |

**Type Scale:**

> **Pacific Scale column:** Maps each prototype text usage to the closest canonical Pacific text style name. Pacific's hierarchy is Display → Headline → Title → Label → Body, each with ExtraLarge/Large/Medium/Small/ExtraSmall variants. Sizes marked ⚠ fall between standard Pacific steps and may need rounding during Flutter migration.

| Usage | Size | Weight | LineHeight | Extra | Pacific Scale | Component(s) |
|---|---|---|---|---|---|---|
| Greeting title | 24 | Medium | 28 | letterSpacing -0.5 | `headlineSmall` | EmptyChat |
| AI section header | 18 | Medium | 24 | letterSpacing -0.2 | `titleLarge` ⚠ | MessageBubble (headerText) |
| Confirm dialog title | 18 | Bold | 24 | — | `titleLarge` ⚠ | MemoryCenter (confirmTitle) |
| Body text / AI text | 16 | Regular | 20 | paddingHorizontal 4 | `bodyLarge` | MessageBubble (aiText) |
| User message | 16 | Regular | 20 | — | `bodyLarge` | MessageBubble (userText) |
| Panel titles | 16 | Medium | 20 | centered | `titleMedium` | All panel headers |
| Menu items | 16 | Medium | 20 | flex: 1 | `titleMedium` | ChatHeader, MemoryCenter |
| Input text | 16 | Regular | 20 | — | `bodyLarge` | InputBar, MemoryCenter search |
| Suggestion pills | 16 | Regular | 20 | — | `bodyLarge` | MessageBubble (suggestionText) |
| Memory content | 16 | Regular | 20 | — | `bodyLarge` | MemoryCenter (memContent) |
| Empty state title | 16 | Medium | 20 | — | `titleMedium` | MemoryCenter (emptyTitle) |
| Analyzing shimmer | 16 | Medium | 20 | letterSpacing 0 | `titleMedium` | TypingIndicator |
| Goal title | 15 | Medium | 20 | — | `titleMedium` ⚠ Δ1 | GoalsDashboard (goalTitle) |
| Toast message | 14 | Medium | 20 | white | `labelLarge` | Toast |
| Toast undo | 14 | Bold | 20 | color #32B7D9 | `labelLarge` + bold | Toast |
| Memory meta | 14 | Medium | 20 | contentSecondary | `labelLarge` | MemoryCenter (memMetaText) |
| Section labels | 14 | Medium | 20 | contentSecondary | `labelLarge` | Settings, MemoryCenter |
| Edit buttons text | 14 | Bold | 20 | — | `labelLarge` + bold | MemoryCenter (editSaveText, editCancelText) |
| Confirm dialog body | 14 | Regular | 20 | contentSecondary | `bodyMedium` | MemoryCenter (confirmDesc) |
| Scenario row title | 14 | Medium | 18 | — | `labelLarge` | ScenarioSwitcher (rowTitle) |
| Proposal text | 13 | Medium | 18 | contentPrimary | `bodyMedium` ⚠ Δ1 | MessageBubble (proposalText) |
| Confirmed text | 13 | Medium | 18 | contentSecondary | `bodyMedium` ⚠ Δ1 | MessageBubble (confirmedText) |
| System message | 13 | Medium | 18 | contentSecondary | `bodyMedium` ⚠ Δ1 | MessageBubble (systemText) |
| Goal amount | 13 | Regular | — | contentSecondary | `bodySmall` ⚠ Δ1 | GoalsDashboard |
| History group label | 13 | Medium | 18 | contentSecondary | `bodyMedium` ⚠ Δ1 | ChatHistory |
| Ask button text | 13 | Medium | — | contentPrimary | `bodyMedium` ⚠ Δ1 | GoalsDashboard |
| Clear filters | 13 | Medium | — | contentPrimary | `bodyMedium` ⚠ Δ1 | MemoryCenter |
| Proposal detail | 12 | Regular | 16 | contentSecondary | `bodySmall` | MessageBubble (proposalDetail) |
| Chip label | 12 | Medium | — | letterSpacing 0.1 | `labelMedium` | MessageBubble (chipText) |
| Card label (uppercase) | 12 | Medium | 16 | letterSpacing 0.6 | `overline` | EmptyChat (cardLabel) |
| Demo indicator | 12 | Medium | 16 | letterSpacing 0.1, brand | `labelMedium` | ChatHeader |
| Goal status text | 12 | Medium | — | varies by status | `labelMedium` | GoalsDashboard |
| Detail labels | 12 | Regular | — | contentSecondary | `bodySmall` | GoalsDashboard |
| Filter chip text | 12 | Medium | — | contentSecondary | `labelMedium` | MemoryCenter |
| Scenario subtitle | 12 | Regular | 16 | contentSecondary | `bodySmall` | ScenarioSwitcher |
| Confirm btn text | 12 | Medium | — | white | `labelMedium` | MessageBubble (confirmBtnText) |
| Dismiss btn text | 12 | Medium | — | contentSecondary | `labelMedium` | MessageBubble (dismissBtnText) |
| Why this? | 12 | Regular | — | contentSecondary | `bodySmall` | MessageBubble (inline) |
| Provenance text | 12 | Regular | 16 | contentSecondary | `bodySmall` | MessageBubble (provenanceText) |
| Disclaimer text | 11 | Regular | 16 | contentSecondary | `labelSmall` | InputBar |
| Footer text | 11 | Regular | 14-16 | contentSecondary | `labelSmall` | GoalsDashboard, ScenarioSwitcher |
| Milestone text | 11 | Medium | — | contentSecondary | `labelSmall` | GoalsDashboard |
| Filter count | 11 | Regular | — | rgba(112,111,110,0.6) | `labelSmall` | MemoryCenter |
| Approval hint | 11 | Medium | 14 | contentSecondary | `labelSmall` | MessageBubble |
| Safety badge text | 10 | Medium | 12 | varies | below scale ⚠ | MessageBubble (safetyText) |
| Type badge text | 10 | Medium | — | uppercase, contentSecondary | below scale ⚠ | GoalsDashboard |

**Pacific Scale migration notes:**
- **18px** usages map to `titleLarge` — Pacific's standard may be 22px; verify against `textTokens.titleLarge` and adjust if needed.
- **13px** usages fall between `bodyMedium` (14px) and `bodySmall` (12px); round to nearest during migration.
- **15px** (goal title) falls between `titleMedium` (16px) and `labelLarge` (14px); round up to `titleMedium`.
- **10px** usages are below Pacific's standard scale; use `labelSmall` with a size override or a custom style.
- Scale names follow the `{scale}{SizeVariant}` convention: e.g. `headlineSmall`, `bodyLarge`, `labelMedium`.

### 1.3 Shadows

> **Pacific Level column:** Pacific provides 5 elevation levels (`dropShadowDown1`–`dropShadowDown5` and `dropShadowUp1`–`dropShadowUp5`). Higher levels = more offset + blur. All shadows use `bone1000` (`#0a0a0a`) as the base color.

| Name | Color | Offset | Radius | Opacity | Pacific Level | Usage |
|---|---|---|---|---|---|---|
| dropShadow-down-2 | `#0A0A0A` | 0, 2 | 8 | 0.04 | `dropShadowDown2` ✓ | Settings card |
| card-light | `rgba(10,10,10,0.06)` | 0, 2 | 8 | 1 | ~`dropShadowDown2` | Memory cards |
| card-standard | `rgba(10,10,10,0.16)` | 0, 1 | 4 | 1 | ~`dropShadowDown1` | EmptyChat cards, goal cards |
| menu-shadow | `rgba(10,10,10,0.16)` | 0, 6 | 16 | 1 | ~`dropShadowDown4` | More menus |
| scroll-anchor | `#0A0A0A` | 0, 2 | 8 | 0.08 | ~`dropShadowDown2` | ScrollAnchor button |
| toast-shadow | `rgba(10,10,10,0.16)` | 0, 0 | 1 | 1 | ~`dropShadowDown1` | Toast |
| sheet-shadow | `#000` | 0, -4 | 16 | 0.1 | ~`dropShadowUp4` | ScenarioSwitcher bottom sheet |

### 1.4 Border Radii

| Value | Pacific Variable | Usage |
|---|---|---|
| 4 | `radius-4` | Safety badge, type badge |
| 12 | `radius-12` | Edit buttons, filter button, scenario row, icon button |
| 14 | — | Scenario icon wrap (borderRadius = size/2) |
| 16 | `radius-16` | Proposal cards, EmptyChat cards, ChatHistory card, toast, progress ring inner circle |
| 20 | `radius-20` | Memory cards, goal cards, settings card, menus, confirm dialog, bottom sheet top |
| 24 | `radius-24` | User bubble, input pills, search bars |
| 9999 | `radius-pill` | Chips, pill buttons, milestones, filter chips |
| 100 | — | Send button, scroll anchor (equivalent to pill) |

### 1.5 Spacing Constants

> **Pacific rpx column:** Pacific spacing tokens run from `rpx10` (10px) to `rpx56` (56px) in 2px increments. Values below 10px or non-even values have no direct `rpx*` token — marked with "—".

| Token | Value | Pacific rpx | Usage |
|---|---|---|---|
| Screen padding | 16px | `rpx16` | Horizontal padding on all major containers |
| Header height | 44px | `rpx44` | All header bars / title bars |
| Left/Right zone width | 100–104px | — (layout) | Panel headers (100), ChatHeader (104) |
| Message gap (aiRow) | 16px | `rpx16` | Gap between AI message sections |
| AI content gap | 8px | — (< rpx10) | Gap between content blocks |
| Card gap | 12px | `rpx12` | Gap between memory cards, goal cards |
| Section gap | 12px | `rpx12` | Gap between section label and card |
| Chip row gap | 6px | — (< rpx10) | Gap between inline chips |
| Menu item height | 48px | `rpx48` | All menu item rows |
| Menu width | 212px | — (layout) | More menu dropdown |
| Menu divider | 0.75px | — (sub-pixel) | Between menu items |
| Card divider | 0.75–1px | — (sub-pixel) | Between settings rows, ChatHistory items |

**Spacing migration notes:**
- Values 4px, 6px, 8px have no Pacific `rpx*` equivalent — use platform small-spacing constants.
- Layout-specific widths (100px, 104px, 212px) are not spacing tokens — keep as fixed layout values.
- Sub-pixel dividers (0.75px) are hairline borders, not spacing — keep as raw values.

---

## 2. Global Components

### 2.1 App Bar (`AppBar` component)

Shared component: `components/AppBar.tsx`. Used by ChatHeader, MemoryCenter, SettingsPanel, GoalsDashboard, ChatHistory, ScenarioSwitcher.

**Shared layout spec:**

| Property | Value |
|---|---|
| Title bar height | 44px |
| Background | surfaceBase (configurable via `backgroundColor` prop) |
| Left zone | width 104px, paddingLeft 16, paddingRight 4 |
| Center zone | flex 1, centered, overflow hidden |
| Right zone | width 104px, paddingRight 16, justifyContent flex-end, gap 20 |
| Title | 16px Medium, contentPrimary, centered, numberOfLines 1 |
| Icon button | 24×24, centered, borderRadius 12 |
| Hit slop | 8px default |
| Safe area | paddingTop = safeAreaInsets.top (handled internally) |
| Right actions | Up to 2 action icons, spaced with gap 20 |

**Variants:**

| Variant | Left | Center | Right |
|---|---|---|---|
| `standard` | Optional action icon | Title + optional subtitle | Up to 2 action icons (`rightActions[]`) |
| `back` | ChevronLeftIcon (onBack) | Title | Up to 2 action icons (`rightActions[]` or single `rightAction`) |
| `sheet` | — | Left-aligned title | Optional close button |

**Sheet variant** has different layout: `flexDirection: row`, `justifyContent: space-between`, `paddingHorizontal: 20`, `paddingVertical: 12`. No safe area inset. No left/center/right zones.

### 2.2 Radio Button

Used in SettingsPanel. Figma node: `28813:86882`.

| State | Outer Circle | Inner Dot |
|---|---|---|
| Selected | r=9.5, strokeWidth=1, stroke=contentPrimary | r=6, fill=contentPrimary |
| Unselected | r=9.5, strokeWidth=1, stroke=contentSecondary | none |
| Container | 24×24 SVG | viewBox="0 0 24 24" |

Pacific equivalent: `PacificRadio` component.

### 2.3 Pill Button (Confirm)

Used on proposal cards, goal cards.

| Property | Value |
|---|---|
| Background | contentPrimary (dark) |
| Border radius | 9999 (pill) |
| Padding | horizontal 12, vertical 6 |
| Text | 12px Medium, white |

### 2.4 Pill Button (Dismiss/Outlined)

| Property | Value |
|---|---|
| Background | transparent |
| Border | 1px rgba(10,10,10,0.1) |
| Border radius | 9999 (pill) |
| Padding | horizontal 12, vertical 6 |
| Text | 12px Medium, contentSecondary |

### 2.5 More Menu (Dropdown)

Shared pattern between ChatHeader and MemoryCenter.

| Layer | Style |
|---|---|
| `menuOverlay` | absolute fill, zIndex 50/150 |
| `menuPositioner` | alignItems flex-end, paddingRight 16 |
| `menuShadow` | width 212, borderRadius 20, shadow rgba(10,10,10,0.16) offset 0/6 radius 16 |
| `menuInner` | white bg, borderRadius 20, paddingVertical 2, paddingHorizontal 16 |
| `menuItem` | height 48, row, space-between, borderBottom 0.75px rgba(10,10,10,0.1) |
| `menuItemLast` | height 48, row, space-between, no border |
| `menuText` | 16px Medium, contentPrimary, lineHeight 20, flex: 1 |
| Trailing icon | 24×24 |

### 2.6 Toast

Global notification system via `ToastProvider`.

| Property | Value |
|---|---|
| Background | `#0F0F0F` |
| Border radius | 16px |
| Padding | 16px |
| Layout | Row, gap 8 |
| Message | 14px Medium, white, lineHeight 20 |
| Action text | 14px Bold, `#32B7D9`, lineHeight 20 |
| Position | absolute, left/right 16, bottom = max(safeArea, 16) + 16, zIndex 9999 |
| Shadow | rgba(10,10,10,0.16) offset 0/0 radius 1 |
| Animation | slide up 100→0 + fade in 300ms; dismiss 250ms |
| Auto-dismiss | 3000ms default |

### 2.7 Input Bar

| Property | Value |
|---|---|
| Pill bg | white |
| Pill border | 0.75px rgba(10,10,10,0.1) |
| Pill radius | 24px |
| Pill minHeight | 48px |
| Pill padding | left 20, right 8, vertical 8 |
| Input font | 16px Regular, contentPrimary, lineHeight 20 |
| Placeholder | "Message", contentSecondary |
| Cursor color | `contentBone600` (light: bone600 `#5c5b5a`, dark: bone400 `#adacaa`) |
| Selection color | `rgba(92,91,90,0.3)` |
| Send button | 32×32 circle, bg `contentBone600` (light: bone600 `#5c5b5a`, dark: bone400 `#adacaa`), white arrow SVG 11.5×14.5 |
| Disclaimer | 11px Regular, contentSecondary, centered |

### 2.8 Search Bar

Shared `SearchBar` component (`components/SearchBar.tsx`) used in MemoryCenter and ChatHistory.

**Variants:** `search` (default) and `search-filter` (includes filter toggle button).

| Property | Value |
|---|---|
| Height | 48px |
| Background | `Colors.surfaceElevated` (white, from token) |
| Border | 1px `rgba(10,10,10,0.1)` |
| Border radius | 24px |
| Icon | Feather `search` size 16, `Colors.contentSecondary` |
| Input font | 16px Regular, `Colors.contentPrimary`, lineHeight 20 |
| Placeholder | "Search", `Colors.contentSecondary` |
| Cursor color | `contentBone600` (light: bone600 `#5c5b5a`, dark: bone400 `#adacaa`) |
| Selection color | `rgba(92,91,90,0.3)` |
| Internal gap | 8px (between icon and input) |
| Pill padding | horizontal 16 |
| Wrapper padding | horizontal 16, vertical 12 |

**Filter variant additions (`search-filter`):**

| Property | Value |
|---|---|
| Filter button size | 32×32 |
| Filter button radius | 12px |
| Filter button icon | Custom FilterIcon SVG 16×16 (3 horizontal lines, strokeWidth 1.25) |
| Filter inactive | transparent bg, `Colors.contentSecondary` icon |
| Filter active | `Colors.contentPrimary` bg, white icon |
| Gap between pill and filter button | 12px |

**Props:** `value`, `onChangeText`, `placeholder?`, `variant?` (`'search'` | `'search-filter'`), `filterActive?`, `onFilterPress?`

**Usage:** MemoryCenter uses `variant="search-filter"`, ChatHistory uses default `variant="search"`.

### 2.9 Scroll Anchor (Scroll-to-Bottom)

| Property | Value |
|---|---|
| Size | 36×36 |
| Background | white |
| Border radius | 100 (circle) |
| Shadow | `#0A0A0A` offset 0/2 radius 8 opacity 0.08 |
| Icon | Arrow-left SVG 14.5×11.5, rotated -90deg, fill `#1A1919` |
| Icon container | 16×16 |

### 2.10 Confirmation Dialog

Used in MemoryCenter for "Delete all memories?".

| Property | Value |
|---|---|
| Overlay | absolute fill, `rgba(0,0,0,0.4)`, zIndex 200 |
| Card bg | white |
| Card radius | 20px |
| Card padding | 24px |
| Card gap | 12px |
| Card max width | 340px |
| Title | 18px Bold, contentPrimary, lineHeight 24 |
| Description | 14px Regular, contentSecondary, lineHeight 20 |
| Button row | row, justify flex-end, gap 8, paddingTop 8 |
| Cancel button | 1.5px border rgba(10,10,10,0.2), radius 12, padding h16/v8, 14px Bold contentPrimary |
| Delete button | bg danger, radius 12, padding h16/v8, 14px Bold white |

### 2.11 Bottom Sheet (ScenarioSwitcher)

| Property | Value |
|---|---|
| Backdrop | `rgba(0,0,0,0.35)`, tappable dismiss |
| Sheet bg | surfaceBase |
| Sheet radius | top 20px |
| Sheet maxHeight | 70% |
| Shadow | `#000` offset 0/-4 radius 16 opacity 0.1 |
| Drag handle | 36×4, radius 2, contentMuted |
| Header padding | horizontal 20, vertical 12 |
| Header title | 16px Medium, contentPrimary |
| Close button | padding 4, Feather x 16, contentSecondary |
| Row padding | vertical 10, horizontal 12 |
| Row radius | 12px |
| Row gap | 12px |
| Icon wrap | 28×28 circle, surfaceTint bg |
| Row title | 14px Medium, contentPrimary |
| Row subtitle | 12px Regular, contentSecondary |
| Active row | bg contentPrimary, white text, icon bg rgba(255,255,255,0.2) |
| Footer | 11px Regular, contentSecondary, centered |
| Gesture | Pan dismiss threshold 120px or velocity > 800 |

---

## 3. Inline Communication Components

These are elements rendered inside AI message bubbles.

### 3.1 Component Hierarchy

All proposal cards now share a unified visual language (normalized in Task #10).

| Component | Background | Border | Radius | Icon | Body Text | Detail Text | Buttons |
|---|---|---|---|---|---|---|---|
| MemoryProposalCard | surfaceTint | 1px edgeLight | 16 | Feather `cpu` 14, secondary, bare | 13px Medium | — | Remember / Not now |
| GoalProposalCard | surfaceTint | 1px edgeLight | 16 | Feather `target` 14, secondary, bare | 13px Medium | 12px Regular secondary | Set up goal / Just chatting |
| Confirmed (check) | surfaceTint | 1px edgeLight | 16 | SVG checkmark 14×14, bone600 | 13px Medium (secondary or primary) | — | — |

> **Note:** InsightToActionCard has been retired (Task #12). Goal suggestions now surface as DRAFT goals in the Goals Center instead of inline cards in chat. The "Confirmed (memory only)" state is no longer used.

**Shared proposal card spec:**

| Property | Value |
|---|---|
| Card padding | 12px (all sides) |
| Header layout | Row, gap 8, alignItems flex-start, marginBottom 10 |
| Icon position | marginTop 2 |
| Body text | 13px Medium, contentPrimary, lineHeight 18 |
| Detail text | 12px Regular, contentSecondary, marginTop 2, lineHeight 16 |
| Confirm button | Black pill — bg contentPrimary, radius 9999, padding h12/v6, text 12px Medium white |
| Dismiss button | Outlined pill — border 1px rgba(10,10,10,0.1), radius 9999, padding h12/v6, text 12px Medium contentSecondary |
| Button row | Row, gap 8 |
| Memory button indent | marginLeft 22 (aligns with text after icon) |
| Confirmed text (secondary) | 13px Medium, contentSecondary, lineHeight 18 |
| Confirmed text (primary) | 13px Medium, contentPrimary, lineHeight 18 |
| Approval hint | Row, gap 4, marginTop 8, marginBottom 4, paddingLeft 2 — 11px Medium contentSecondary |

### 3.2 Chip Badge

| Property | Value |
|---|---|
| Layout | Row, gap 6, pill shape |
| Padding | horizontal 10, vertical 6 |
| Border radius | 9999 |
| Left icon | Feather 11px |
| Label | 12px Medium, letterSpacing 0.1 |
| Right icon | Feather chevron-right 12px |
| Animation | Fade in 350ms + spring translateY 6→0 (tension 120, friction 8) |

**Chip styles by type:**

| Type | Background | Text/Icon Color | Icon Name |
|---|---|---|---|
| `memory-saved` | surfaceTint | contentPrimary | cpu |
| `memory-updated` | surfaceTint | contentPrimary | cpu |
| `goal-progress` | surfaceTint | contentPrimary | target |
| `goal-risk` | dangerChipBg | dangerChipText | alert-triangle |
| `milestone` | successBg | successDark | star |
| `handoff` | infoBg | info | arrow-up-right |
| `alert` | dangerChipBg | dangerChipText | alert-triangle |

### 3.3 Safety Badge

| Property | Value |
|---|---|
| Layout | Row, gap 4 |
| Padding | horizontal 8, vertical 2 |
| Border radius | 4 |
| Alignment | flex-start, marginLeft 4 |
| Icon | Feather, size varies (see below) |
| Text | 10px Medium, lineHeight 12 |

**Safety styles by tier:**

| Tier | Background | Text/Icon Color | Icon | Label |
|---|---|---|---|---|
| `informational` | surfaceMuted | contentSecondary | shield | "Informational" |
| `suggestive` | surfaceMuted | contentSecondary | shield | "Suggestion" |
| `actionable` | warningBg | warning | shield | "Actionable — needs your approval" |
| `handoff` | infoBg | info | arrow-up-right | "Complex — human advisor recommended" |

### 3.4 System Pill

| Variant | Background | Text | Icon |
|---|---|---|---|
| Standard | surfaceTint | 13px Medium, contentSecondary | — |
| Proactive | contentPrimary | 13px Medium, white | Feather star 13, white |
| Layout | Row, gap 8, horizontal padding 16, vertical padding 8, pill radius |

### 3.5 Suggestion Pills

| Property | Value |
|---|---|
| Alignment | flex-end (right-aligned column) |
| Gap | 8px |
| Border | 0.75px solid contentBone600 |
| Border radius | 24px |
| Padding | top 11, bottom 12, horizontal 16 |
| Text | 16px Regular, contentPrimary, lineHeight 20, numberOfLines 1 |
| Max count | 3 |
| Visibility | Only on latest AI message, hidden during streaming |

### 3.6 Action Footer

| Property | Value |
|---|---|
| Layout | Row, gap 16 |
| Icon size | 20×20 (PNG images) |
| Button padding | 4px |
| Icons | icon-copy, icon-thumbs-up, icon-thumbs-down (with filled variants) |
| Copied state | SVG checkmark 20×20 in 20×20 container, bone600 stroke |
| Why this? | 12px Regular contentSecondary + Feather chevron 12px |
| Provenance card | surfaceTint bg, radius 16, padding h12/v10, 12px Regular secondary |

### 3.7 Provenance Card

| Property | Value |
|---|---|
| Background | surfaceTint |
| Border radius | 16px |
| Padding | horizontal 12, vertical 10 |
| Margin top | 4px |
| Text | 12px Regular, contentSecondary, lineHeight 16 |

### 3.8 Suggested Goals Section (Goals Center)

Added in Task #12. When the AI detects a goal opportunity, it creates a DRAFT goal in state and sends a chat nudge. DRAFT goals appear in the Goals Center's "Suggested" section above active goals.

**Section Header:**

| Property | Value |
|---|---|
| Layout | Row, gap 6, marginTop 4, marginBottom 4 |
| Icon | Feather `star` 13, contentBrand |
| Label | 13px Medium, contentBrand, lineHeight 18 |

**Suggested Goal Card:**

| Property | Value |
|---|---|
| Background | white (#fff) |
| Border | 1px dashed, contentBrand |
| Border radius | 20px |
| Padding | 16px |
| Gap | 12px |
| Shadow | card-standard (same as GoalCard) |
| Suggested badge | surfaceTint bg, radius 4, padding h8/v2, 10px Medium contentBrand uppercase, letterSpacing 0.6 |
| Title | 15px Medium, contentPrimary (same as GoalCard) |
| Type badge | Same as GoalCard typeBadge |
| Detail text | 13px Regular, contentSecondary |
| Confirm button | Black pill — bg contentPrimary, radius 9999, padding h12/v6, text 12px Medium white |
| Dismiss button | Outlined pill — border 1px rgba(10,10,10,0.1), radius 9999, padding h12/v6, text 12px Medium contentSecondary |
| Button row | Row, gap 8 |

**Goals Menu Badge (ChatHeader):**

| Property | Value |
|---|---|
| Size | min-width 18, height 18 |
| Background | contentBrand |
| Border radius | 9 (circle) |
| Text | 11px Medium, white, lineHeight 14 |
| Position | Between menu text and GoalsMenuIcon, marginRight 8 |
| Visibility | Only shown when DRAFT goals exist |

**Chat Nudge:**

When a goal suggestion is queued, a system pill message appears: "I've added a goal suggestion to your Goals panel — check it when you're ready." Uses standard system pill pattern (surfaceTint bg, 13px Medium contentSecondary).

---

## 4. Icon Inventory

### 4.1 ChatHeader Icons

| Icon | Size | ViewBox | Style | Color | SVG Type |
|---|---|---|---|---|---|
| DemoIcon | 20×20 | 0 0 20 20 | Filled | contentPrimary | Flask/beaker |
| CloseIcon | 24×24 | 0 0 24 24 | Filled | contentPrimary | X mark |
| ClockIcon | 20×20 | 0 0 20 20 | Filled | contentPrimary | Clock face |
| MoreIcon (ChatHeader) | 20×20 | 0 0 20 20 | Filled | contentPrimary | Circle with 3 dots |
| ChatNewIcon | 24×24 | 0 0 24 24 | Filled | contentPrimary | Chat bubble + plus |
| MemoryMenuIcon | 24×24 | 0 0 24 24 | Filled | contentPrimary | CPU/chip |
| GoalsMenuIcon | 24×24 | 0 0 24 24 | Filled | contentPrimary | Concentric circles (target) |
| PencilMenuIcon | 24×24 | 0 0 24 24 | Filled | contentPrimary | Pencil |
| SettingsMenuIcon | 24×24 | 0 0 24 24 | Stroked (strokeWidth 2) | contentPrimary | Gear |
| DeleteMenuIcon (ChatHeader) | 24×24 | 0 0 24 24 | Filled | danger | Trash can |

### 4.2 MemoryCenter Icons

| Icon | Size | ViewBox | Style | Color | Notes |
|---|---|---|---|---|---|
| ChevronLeftIcon | 24×24 | 0 0 24 24 | Filled | contentPrimary | Shared across panels |
| Feather search | 16 | — | Feather | contentSecondary | SearchBar component (replaced custom SearchIcon SVG) |
| FilterIcon | 16×16 | 0 0 16 16 | Stroked (1.25) | contentSecondary | 3 horizontal lines (in SearchBar component) |
| MoreIcon (MemoryCenter) | 20×20 | 0 0 20 20 | Filled | contentPrimary | Same SVG as ChatHeader |
| PencilIcon (card action) | 13×13 | 0 0 13 13 | Filled | contentSecondary | Small pencil |
| PauseIcon (card action) | ~8.6×13 | 0 0 9.83 12.17 | Stroked (1.5) | contentSecondary | Two bars |
| PlayIcon (card action) | ~11×13 | 0 0 11 13 | Stroked (1.5) | contentSecondary | Triangle, 1.5px left offset |
| DeleteIcon (card action) | ~9.1×14.5 | 0 0 11.5 14.5 | Filled | danger | Small trash |
| PauseMenuIcon | 24×24 | -4.5 -3 19 19 | Stroked (1.5) | contentPrimary | Same paths as PauseIcon, centered in 24×24 |
| PlayMenuIcon | 24×24 | 0 0 24 24 | Filled | contentPrimary | Solid triangle |
| DeleteMenuIcon (MemoryCenter) | 24×24 | 0 0 24 24 | Filled | danger | Same SVG as ChatHeader DeleteMenuIcon |

### 4.3 MessageBubble Icons

| Icon | Size | ViewBox | Style | Color | Usage |
|---|---|---|---|---|---|
| Checkmark SVG (confirmed) | 14×14 | 0 0 24 24 | Stroked (1.5) | contentBone600 | Confirmed proposal state |
| Checkmark SVG (copied) | 20×20 | 0 0 24 24 | Stroked (1.25) | contentBone600 | Copy action feedback |
| Feather cpu | 14 | — | Feather | contentSecondary | Memory proposal icon |
| Feather target | 14 | — | Feather | contentSecondary | Goal/insight proposal icon |
| Feather shield | 10 | — | Feather | contentSecondary | Approval hint |
| Feather star | 13 | — | Feather | white | Proactive system pill |
| Feather chevron-right | 12 | — | Feather | per chip | Chip badge trailing |
| Feather chevron-up/down | 12 | — | Feather | contentSecondary | Why this? toggle |
| PNG icon-copy | 20×20 | — | Image | tintColor: contentBone600 | Action footer |
| PNG icon-thumbs-up | 20×20 | — | Image | tintColor: contentBone600 | Action footer |
| PNG icon-thumbs-down | 20×20 | — | Image | tintColor: contentBone600 | Action footer |

### 4.4 SettingsPanel Icons

| Icon | Size | ViewBox | Style | Color | Usage |
|---|---|---|---|---|---|
| RadioSelected | 24×24 | 0 0 24 24 | Stroked (outer) + Filled (inner) | contentPrimary | Selected radio — outer ring r=9.5 sw=1, inner dot r=6 |
| RadioUnselected | 24×24 | 0 0 24 24 | Stroked | contentSecondary | Unselected radio — outer ring r=9.5 sw=1 only |
| ChevronLeftIcon | 24×24 | 0 0 24 24 | Filled | contentPrimary | Back navigation |

### 4.5 GoalsDashboard Icons

| Icon | Size | ViewBox | Style | Color | Usage |
|---|---|---|---|---|---|
| ChevronLeftIcon | 24×24 | 0 0 24 24 | Filled | contentPrimary | Back navigation |
| ProgressRing | 72×72 (default) | SVG Circle | Stroked (sw=4) | varies by status | Goal progress ring (track: progressTrack) |
| Feather check-circle | 10-12 | — | Feather | successDark / white | Milestone reached, completed status |
| Feather trending-up | 12 | — | Feather | contentPrimary | On-track status |
| Feather alert-triangle | 12 | — | Feather | dangerLight | At-risk status |
| Feather target | 32 | — | Feather | contentMuted | Empty state |
| Feather message-square | 13 | — | Feather | contentPrimary | "Ask about this goal" button |

### 4.6 Other Component Icons

| Icon | Size | Component | Style | Color |
|---|---|---|---|---|
| ChevronLeftIcon | 24×24 | ChatHistory, SettingsPanel | Filled | contentPrimary |
| ChatNewIcon | 24×24 | ChatHistory | Filled | contentPrimary |
| Arrow-left (scroll) | 14.5×11.5 | ScrollAnchor | Filled | `#1A1919` |
| Arrow-up (send) | 11.5×14.5 | InputBar | Filled | white |
| Feather search | 16 | ChatHistory | Feather | contentSecondary |
| Feather x | 16 | ScenarioSwitcher | Feather | contentSecondary |
| Feather check | 16 | ScenarioSwitcher | Feather | white |
| Feather (scenario icons) | 14 | ScenarioSwitcher | Feather | contentPrimary / white |

### 4.7 SVG Definition Location Index

Every custom SVG icon definition and the file where it lives:

| File | SVG Components Defined |
|---|---|
| `icons.tsx` (shared) | ChevronLeftIcon, CloseIcon, MoreIcon, DemoIcon, ClockIcon, ChatNewIcon, MemoryMenuIcon, GoalsMenuIcon, PencilMenuIcon, SettingsMenuIcon, DeleteMenuIcon, PauseMenuIcon, PlayMenuIcon |
| `MemoryCenter.tsx` | PencilIcon (13×13), PauseIcon, PlayIcon, DeleteIcon |
| `SettingsPanel.tsx` | RadioSelected, RadioUnselected |
| `SearchBar.tsx` | FilterIcon |
| `ScrollAnchor.tsx` | Arrow-left (inline) |
| `InputBar.tsx` | Arrow-up (inline) |
| `MessageBubble.tsx` | Checkmark (inline, 2 sizes) |

**Import chain:** `AppBar.tsx` imports `ChevronLeftIcon` from `icons.tsx` and renders it for the `back` variant. All panels (GoalsDashboard, SettingsPanel, ChatHistory, MemoryCenter) get the back chevron via `<AppBar variant="back">` — no local ChevronLeftIcon definitions remain. `ChatHeader.tsx` imports all header icons from `icons.tsx`. `MemoryCenter.tsx` imports `MoreIcon`, `DeleteMenuIcon`, `PauseMenuIcon`, `PlayMenuIcon` from `icons.tsx`; `ChatHistory.tsx` imports `ChatNewIcon` from `icons.tsx`.

**Remaining local icons:** `MemoryCenter` still defines small card-action icons (PencilIcon 13×13, PauseIcon, PlayIcon, DeleteIcon) locally — these are smaller, card-specific variants distinct from the menu-sized versions in `icons.tsx`. `SettingsPanel` defines RadioSelected/RadioUnselected locally. `SearchBar` defines FilterIcon locally. `GoalsDashboard` defines ProgressRing (SVG Circle) inline.

---

## 5. Layout Patterns

### 5.1 Full-Screen Panel Overlay

Used by: MemoryCenter, GoalsDashboard, SettingsPanel, ChatHistory.

```
View (absoluteFillObject, surfaceBase, zIndex 100)
  View (appBar, paddingTop: safeArea.top)
    View (titleBar, height 44, row)
      View (leftControls, width 100, paddingLeft 16)
        Pressable (iconBtn 24×24) → ChevronLeftIcon
      View (titleArea, flex 1, centered)
        Text (16px Medium)
      View (rightControls, width 100)
        [optional icon buttons]
  ScrollView (flex 1)
    contentContainer (paddingHorizontal 16, paddingBottom 20-40)
```

**Slide-in variant (SettingsPanel, ChatHistory):** Uses `Animated.View` with `translateX` animation, 300ms cubic bezier (0.4, 0, 0.2, 1).

### 5.2 More Menu Overlay

```
View (menuOverlay: absolute fill, zIndex 50/150)
  Pressable (absoluteFill → dismiss)
  View (menuPositioner: alignItems flex-end, paddingRight 16, paddingTop: safeArea + headerHeight)
    View (menuShadow: width 212, radius 20, shadow)
      View (menuInner: white bg, radius 20, paddingV 2, paddingH 16)
        Pressable (menuItem: height 48, row, space-between, borderBottom 0.75)
          Text (menuText)
          Icon (24×24)
        Pressable (menuItemLast: height 48, row, space-between)
          Text (menuText)
          Icon (24×24)
```

### 5.3 Card Container

Two variants:

**Elevated card (Settings, EmptyChat, Goals):**
```
backgroundColor: white
borderRadius: 16-20
padding: 16
shadow: varies by component
no explicit border (shadow provides edge)
```

**Bordered card (Memory, ChatHistory):**
```
backgroundColor: white
borderRadius: 16-20
padding: 16
borderWidth: 0.75-1
borderColor: rgba(10,10,10, 0.06-0.08)
shadow: light or none
```

### 5.4 Proposal Card Container

```
View (proposalCard)
  backgroundColor: surfaceTint (#F0EDE8)
  borderWidth: 1
  borderColor: rgba(10,10,10,0.05)
  borderRadius: 16
  padding: 12
  
  View (proposalHeader: row, gap 8, marginBottom 10)
    Icon (14px)
    Text/View (proposalText: 13px Medium, flex 1)
  
  [Optional: approvalHint row]
  
  View (proposalButtons: row, gap 8)
    Pressable (confirmBtn: dark pill)
    Pressable (dismissBtn: outlined pill)
```

### 5.5 Bottom Sheet

```
View (overlay: absoluteFill, zIndex 100, justifyContent flex-end)
  Animated.View (backdrop: absoluteFill, rgba(0,0,0,0.35))
    Pressable (absoluteFill → dismiss)
  GestureDetector (pan gesture)
    Animated.View (sheet: surfaceBase, topRadius 20, maxHeight 70%)
      View (handleRow: center, paddingTop 10)
        View (handle: 36×4, radius 2, contentMuted)
      View (header: row, space-between, paddingH 20)
      ScrollView (content)
      View (footer)
```

---

## 6. Figma Cross-References

| Element | Figma File | Node ID | Notes |
|---|---|---|---|
| Memory settings radio | `8c5TuXaL1MvZh2rkkf1e1Y` | `28813:86882` | Radio selected/unselected spec |
| Prototype frame | `8c5TuXaL1MvZh2rkkf1e1Y` | — | Full interactive coach chat spec |

---

## 7. Migration Notes

### Token Gaps
- All previously hardcoded color values (`#0F0F0F`, `#32B7D9`, `#c4a882`, etc.) have been tokenized in the theme system. See Section 1.1 "Previously hardcoded colors" table.
- Semantic status colors (danger/success/warning/info chip variants) may not have direct Pacific equivalents — verify against Pacific's status color system.

### Component Gaps
- Search bar implementation differs slightly between MemoryCenter (1px border) and ChatHistory (0.75px border).
- SettingsMenuIcon uses stroke style while all other menu icons use filled style.

### Inline Component Inconsistencies
- Resolved in Task #10. All proposal cards now share unified icon treatment (bare Feather), text sizes (13px body, 12px detail), button patterns (confirm pill + dismiss outlined pill), and spacing (gap 8, padding 12). See Section 3.1 for the normalized spec.

### Theme System
- Full light/dark theming implemented via `constants/theme.ts` + `context/ThemeContext.tsx`. All components use `useTheme()` — zero hardcoded colors in render paths. See MEMORY_AND_GOALS.md "Theme System" section for migration pattern details.

---

*Last updated: 2026-03-24. Derived from Expo prototype source code inspection. Update this document when components are modified or new patterns are introduced.*
