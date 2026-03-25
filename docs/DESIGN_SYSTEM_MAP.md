# SoFi Coach Chat — Design System Map

> Prototype-to-Pacific bridge document for Flutter migration. Every token, component, and pattern in the prototype mapped to its Pacific design system equivalent with Flutter syntax.

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
| `surfaceEdge` | `Color(0x1A0A0A0A)` (10% opacity) | `strokeDividePrimary` / `strokeEdge` | `bone100010Pct` | Borders, dividers |
| `surfaceEdgeLight` | `Color(0x0D0A0A0A)` (5% opacity) | — (prototype only, lighter than strokeEdge) | — | Proposal card border |

**Note:** Pacific's `surfaceEdge` token is `bone100016Pct` (0.16 opacity) — heavier than our stroke usage. Our prototype `surfaceEdge` maps to `strokeDividePrimary` (0.10), not Pacific's `surfaceEdge`.

#### Content Tokens

| Prototype Token | Hex / Value | Pacific Token | Primitive | Usage |
|---|---|---|---|---|
| `contentPrimary` | `Color(0xFF1A1919)` | `contentPrimaryDefault` | `bone850` | Primary text, active UI, dark fills |
| `contentSecondary` | `Color(0xFF706F6E)` | `contentSecondary` | `bone550` | Secondary text, inactive icons, meta text |
| `contentBone600` | Light: `Color(0xFF5C5B5A)`, Dark: `Color(0xFFADACAA)` | — (coach-chat-specific) | Light: `bone600`, Dark: `bone400` | User bubble bg, send button bg, cursor, action icon tint, suggestion pill border |
| `contentStatusbar` | `Color(0xFF0A0A0A)` | `contentStatusBar` | `bone1000` | Status bar tint |
| `contentMuted` | `Color(0xFFD0CCC5)` | `contentHint` | `bone250` (`#dbdad7`, ❌ Δ25) | Empty state placeholder icons, drag handle |
| `contentDimmed` | `Color(0xFFBDBBB9)` | `contentDisabled2` | `bone350` ✓ | Edit character count, muted more-icon |
| `contentBrand` | `Color(0xFF00A2C7)` | `contentBrand` | `blue550` | Brand cyan — demo indicator, shimmer target |

#### Status Tokens — Danger

| Prototype Token | Hex / Value | Pacific Token | Primitive | Usage |
|---|---|---|---|---|
| `danger` | `Color(0xFFFA2D25)` | `contentDanger` | `red600` | Delete icon color, delete button bg |
| `dangerLight` | `Color(0xFFEF4444)` | — (prototype only) | ~`red550` (`#fb4a43`, ⚠ Tailwind) | At-risk goal ring stroke |
| `dangerChipText` | `Color(0xFFDC2626)` | `contentDanger` | `red600` (`#fa2d25`, ❌ Tailwind) | Risk/alert chip text |
| `dangerChipBg` | `Color(0xFFFEE2E2)` | `surfaceDangerDefault` | `red50` (`#ffe5e5`, ~ Δ4) | Risk/alert chip background |

#### Status Tokens — Success

| Prototype Token | Hex / Value | Pacific Token | Primitive | Usage |
|---|---|---|---|---|
| `success` | `Color(0xFF22C55E)` | `contentSuccess` | `green550` (`#1bc245`, ❌ Tailwind) | Goal completion ring |
| `successDark` | `Color(0xFF16A34A)` | `contentSuccessEmphasized` | `green600` (`#19a623`, ❌ Tailwind) | Milestone text, completed status |
| `successBg` | `Color(0xFFDCFCE7)` | `surfaceSuccessDefault` | `green50` (`#ebf9ee`, ⚠ Tailwind) | Milestone chip bg, completed badge bg |
| `successBorder` | `Color(0xFFBBF7D0)` | — (prototype only) | — | Success border (unused in current code) |
| `successBgLight` | `Color(0xFFF0FDF4)` | — (prototype only, lighter than surfaceSuccessDefault) | — | Completed goal card bg |

#### Status Tokens — Warning / Caution

| Prototype Token | Hex / Value | Pacific Token | Primitive | Usage |
|---|---|---|---|---|
| `warning` | `Color(0xFFB45309)` | `contentCaution` | `yellow600` (`#8c6914`, ❌ Tailwind) | Actionable safety tier text |
| `warningBg` | `Color(0xFFFEF3C7)` | `surfaceCautionDefault` | `yellow50` (`#fff5e5`, ❌ Tailwind) | Actionable safety tier bg |

#### Status Tokens — Info / Tip

| Prototype Token | Hex / Value | Pacific Token | Primitive | Usage |
|---|---|---|---|---|
| `info` | `Color(0xFF2563EB)` | `contentTip` | `blue650` (`#006280`, ❌ Tailwind — not Pacific) | Handoff chip text |
| `infoBg` | `Color(0xFFDBEAFE)` | `surfaceTipDefault` | `blue50` (`#edf8fc`, ❌ Tailwind) | Handoff chip bg |

#### Utility Tokens

| Prototype Token | Hex / Value | Pacific Token | Primitive | Usage |
|---|---|---|---|---|
| `progressTrack` | `Color(0xFFE5E1DA)` | `surfaceIndicatorUnselected` | `bone250` | Goal ring track color |
| `frameBg` | `Color(0xFFE8E4DE)` | — (prototype only) | ~`bone200` | Frame backgrounds |

#### Button Tokens (reference)

| Pacific Token | Primitive | Prototype Mapping |
|---|---|---|
| `buttonNeutralDefault` | `bone850` | Confirm pill bg → `contentPrimary` |
| `buttonBrandDefault` | `blue550` | Brand actions → `contentBrand` |
| `buttonDestructiveDefault` | `red600` | Delete button bg → `danger` |

#### Previously hardcoded colors — now tokenized in theme system

All previously hardcoded color values have been migrated to named tokens:

| Token | Light Value | Dark Value | Pacific Ref | Usage |
|---|---|---|---|---|
| `surfaceToast` | `Color(0xFF0F0F0F)` | `Color(0xFF3D3D3C)` | `surfaceToast` / `bone950` | Toast background |
| `toastAction` | `Color(0xFF32B7D9)` | `Color(0xFF32B7D9)` | — | Toast undo action text |
| `shimmerBase` | `Color(0xFFC4A882)` | `Color(0xFF8C6914)` | — | Typing shimmer base color |
| `scrimBackdrop` | `Color(0x59000000)` (0.35) | `Color(0x8C000000)` (0.55) | `surfaceScrim` | ScenarioSwitcher backdrop |
| `scrimHeavy` | `Color(0x66000000)` (0.4) | `Color(0xA6000000)` (0.65) | `surfaceScrim` | Delete-all overlay |
| `shadowEdge` | `Color(0x0F0A0A0A)` (0.06) | `Color(0x33000000)` (0.20) | — | Card border (ChatHistory) |
| `borderSubtle` | `Color(0x140A0A0A)` (0.08) | `Color(0x14FAF8F5)` (0.08) | — | Memory card border |
| `shadowColor` | `Color(0x290A0A0A)` (0.16) | `Color(0x66000000)` (0.40) | `surfaceEdge` | Menu shadow, card shadow |
| `borderMedium` | `Color(0x330A0A0A)` (0.2) | `Color(0x33FAF8F5)` (0.20) | — | Edit cancel button border |
| `inverseAlpha20` | `Colors.white.withOpacity(0.2)` | `Colors.black.withOpacity(0.2)` | — | Active scenario icon bg |
| `inverseAlpha60` | `Colors.white.withOpacity(0.6)` | `Colors.black.withOpacity(0.6)` | — | Active scenario subtitle |
| `whiteOnDark` | `Colors.white` | `Colors.white` | — | Text on dark backgrounds |

#### Alpha / Opacity Primitives

In Flutter, use `Color.fromRGBO(r, g, b, opacity)` or the `0xAARRGGBB` hex format. Pacific names these with suffixes like `010Pct`, `016Pct`, `050Pct`, etc.

| Primitive | Flutter Value | Common Semantic Tokens (Light) |
|-----------|-----------|-------------------------------|
| `bone100010Pct` | `Color.fromRGBO(10, 10, 10, 0.10)` | `strokeDividePrimary`, `strokeDivideSecondary`, `strokeEdge`, `strokeIndicatorDisabled`, `surfaceScrollHandle` |
| `bone100016Pct` | `Color.fromRGBO(10, 10, 10, 0.16)` | `surfaceEdge`, `surfaceGhostDefaultEmphasized` |
| `bone100020Pct` | `Color.fromRGBO(10, 10, 10, 0.20)` | `buttonNeutralDefaultDiminish` |
| `bone100040Pct` | `Color.fromRGBO(10, 10, 10, 0.40)` | `strokeIndicatorUnselectedEmphasized` |
| `bone100050Pct` | `Color.fromRGBO(10, 10, 10, 0.50)` | `surfaceScrim` |
| `bone10004Pct` | `Color.fromRGBO(10, 10, 10, 0.04)` | `surfaceElevatedHover`, `surfaceIndicatorHover` |
| `bone10007Pct` | `Color.fromRGBO(10, 10, 10, 0.07)` | `surfaceGhostDefault`, `buttonNeutralPressedDiminish` |
| `bone10008Pct` | `Color.fromRGBO(10, 10, 10, 0.08)` | `surfaceElevatedPressed`, `surfaceIndicatorPressed` |
| `bone030Pct` | `Color.fromRGBO(~bone, ~bone, ~bone, 0.03)` | `strokeIndicatorGhost` |

**Key distinction — surfaceEdge:** Our prototype `surfaceEdge` = `Color.fromRGBO(10, 10, 10, 0.10)` → maps to `strokeDividePrimary` (`bone100010Pct`). Pacific's `surfaceEdge` = `Color.fromRGBO(10, 10, 10, 0.16)` → `bone100016Pct` (heavier). Flutter must use the correct Pacific semantic token based on intent, not our prototype name.

**Migration note:** Prototype hex values marked ❌ are Tailwind CSS colors, NOT Pacific primitives — they must be replaced with the Pacific hex values shown in parentheses during Flutter migration. Tokens marked "prototype only" need Pacific equivalents assigned or should be consolidated into existing Pacific tokens.

### 1.2 Typography

| Prototype Key | Font File | Weight | Pacific Variable | Flutter FontWeight |
|---|---|---|---|---|
| `Fonts.regular` | `TTNorms-Regular` | 400 | `font-weight-regular` | `FontWeight.w400` |
| `Fonts.medium` | `TTNorms-Medium` | 500 | `font-weight-medium` | `FontWeight.w500` |
| `Fonts.bold` | `TTNorms-Bold` | 700 | `font-weight-bold` | `FontWeight.w700` |
| `Fonts.italic` | `TTNorms-Italic` | 400i | `font-weight-regular` + italic | `FontWeight.w400`, `FontStyle.italic` |
| `Fonts.boldItalic` | `TTNorms-BoldItalic` | 700i | `font-weight-bold` + italic | `FontWeight.w700`, `FontStyle.italic` |

**Type Scale:**

> **Pacific Scale column:** Maps each prototype text usage to the closest canonical Pacific text style name. Pacific's hierarchy is Display → Headline → Title → Label → Body, each with ExtraLarge/Large/Medium/Small/ExtraSmall variants. Sizes marked ⚠ fall between standard Pacific steps and may need rounding during Flutter migration.
>
> **Flutter `height`:** In Flutter `TextStyle`, `height` is a multiplier of `fontSize`, not an absolute value. E.g. fontSize 16, lineHeight 20 → `height: 1.25` (20/16).

| Usage | Size | Weight | Flutter `height` | Extra | Pacific Scale | Widget(s) |
|---|---|---|---|---|---|---|
| Greeting title | 24 | `w500` | 1.17 (28/24) | `letterSpacing: -0.5` | `headlineSmall` | EmptyChat |
| AI section header | 18 | `w500` | 1.33 (24/18) | `letterSpacing: -0.2` | `titleLarge` ⚠ | MessageBubble (headerText) |
| Confirm dialog title | 18 | `w700` | 1.33 (24/18) | — | `titleLarge` ⚠ | MemoryCenter (confirmTitle) |
| Body text / AI text | 16 | `w400` | 1.25 (20/16) | `EdgeInsets.symmetric(horizontal: 4)` | `bodyLarge` | MessageBubble (aiText) |
| User message | 16 | `w400` | 1.25 (20/16) | — | `bodyLarge` | MessageBubble (userText) |
| Panel titles | 16 | `w500` | 1.25 (20/16) | `TextAlign.center` | `titleMedium` | All panel headers |
| Menu items | 16 | `w500` | 1.25 (20/16) | `Expanded` child | `titleMedium` | ChatHeader, MemoryCenter |
| Input text | 16 | `w400` | 1.25 (20/16) | — | `bodyLarge` | InputBar, MemoryCenter search |
| Suggestion pills | 16 | `w400` | 1.25 (20/16) | — | `bodyLarge` | MessageBubble (suggestionText) |
| Memory content | 16 | `w400` | 1.25 (20/16) | — | `bodyLarge` | MemoryCenter (memContent) |
| Empty state title | 16 | `w500` | 1.25 (20/16) | — | `titleMedium` | MemoryCenter (emptyTitle) |
| Analyzing shimmer | 16 | `w500` | 1.25 (20/16) | `letterSpacing: 0` | `titleMedium` | TypingIndicator |
| Goal title | 15 | `w500` | 1.33 (20/15) | — | `titleMedium` ⚠ Δ1 | GoalsDashboard (goalTitle) |
| Toast message | 14 | `w500` | 1.43 (20/14) | `Colors.white` | `labelLarge` | Toast |
| Toast undo | 14 | `w700` | 1.43 (20/14) | `Color(0xFF32B7D9)` | `labelLarge` + bold | Toast |
| Memory meta | 14 | `w500` | 1.43 (20/14) | contentSecondary | `labelLarge` | MemoryCenter (memMetaText) |
| Section labels | 14 | `w500` | 1.43 (20/14) | contentSecondary | `labelLarge` | Settings, MemoryCenter |
| Edit buttons text | 14 | `w700` | 1.43 (20/14) | — | `labelLarge` + bold | MemoryCenter (editSaveText, editCancelText) |
| Confirm dialog body | 14 | `w400` | 1.43 (20/14) | contentSecondary | `bodyMedium` | MemoryCenter (confirmDesc) |
| Scenario row title | 14 | `w500` | 1.29 (18/14) | — | `labelLarge` | ScenarioSwitcher (rowTitle) |
| Proposal text | 12 | `w500` | 1.33 (16/12) | `letterSpacing: 0.1`, contentPrimary | `labelMedium` | MessageBubble (proposalText) |
| Confirmed text | 12 | `w500` | 1.33 (16/12) | `letterSpacing: 0.1`, contentSecondary | `labelMedium` | MessageBubble (confirmedText) |
| System message | 14 | `w500` | 1.43 (20/14) | contentSecondary | `labelLarge` | MessageBubble (systemText) |
| Goal amount | 14 | `w400` | — | contentSecondary | `bodyMedium` | GoalsDashboard |
| History group label | 14 | `w500` | 1.43 (20/14) | contentSecondary | `labelLarge` | ChatHistory |
| Ask button text | 14 | `w500` | — | contentPrimary | `labelLarge` | GoalsDashboard |
| Clear filters | 14 | `w500` | — | contentPrimary | `labelLarge` | MemoryCenter |
| Proposal detail | 12 | `w400` | 1.33 (16/12) | contentSecondary | `bodySmall` | MessageBubble (proposalDetail) |
| Chip label | 12 | `w500` | 1.33 (16/12) | `letterSpacing: 0.1` | `labelMedium` | MessageBubble (chipText) |
| Card label (uppercase) | 12 | `w500` | 1.33 (16/12) | `letterSpacing: 0.6` | `overline` | EmptyChat (cardLabel) |
| Demo indicator | 12 | `w500` | 1.33 (16/12) | `letterSpacing: 0.1`, brand | `labelMedium` | ChatHeader |
| Goal status text | 12 | `w500` | — | varies by status | `labelMedium` | GoalsDashboard |
| Detail labels | 12 | `w400` | — | contentSecondary | `bodySmall` | GoalsDashboard |
| Filter chip text | 12 | `w500` | — | contentSecondary | `labelMedium` | MemoryCenter |
| Scenario subtitle | 12 | `w400` | 1.33 (16/12) | contentSecondary | `bodySmall` | ScenarioSwitcher |
| Confirm btn text | 12 | `w500` | — | `Colors.white` | `labelMedium` | MessageBubble (confirmBtnText) |
| Dismiss btn text | 12 | `w500` | — | contentSecondary | `labelMedium` | MessageBubble (dismissBtnText) |
| Why this? | 12 | `w400` | — | contentSecondary | `bodySmall` | MessageBubble (inline) |
| Provenance text | 12 | `w400` | 1.33 (16/12) | contentSecondary | `bodySmall` | MessageBubble (provenanceText) |
| Disclaimer text | 11 | `w400` | 1.45 (16/11) | contentSecondary | `labelSmall` | InputBar |
| Footer text | 11 | `w400` | 1.27–1.45 | contentSecondary | `labelSmall` | GoalsDashboard, ScenarioSwitcher |
| Milestone text | 11 | `w500` | — | contentSecondary | `labelSmall` | GoalsDashboard |
| Filter count | 11 | `w400` | — | `Color.fromRGBO(112, 111, 110, 0.6)` | `labelSmall` | MemoryCenter |
| Approval hint | 11 | `w500` | 1.27 (14/11) | contentSecondary | `labelSmall` | MessageBubble |
| Safety badge text | 10 | `w500` | 1.2 (12/10) | varies | below scale ⚠ | MessageBubble (safetyText) |
| Type badge text | 10 | `w500` | — | uppercase, contentSecondary | below scale ⚠ | GoalsDashboard |

**Pacific Scale migration notes:**
- **18px** usages map to `titleLarge` — Pacific's standard may be 22px; verify against `textTokens.titleLarge` and adjust if needed.
- **13px** usages fall between `bodyMedium` (14px) and `bodySmall` (12px); round to nearest during migration.
- **15px** (goal title) falls between `titleMedium` (16px) and `labelLarge` (14px); round up to `titleMedium`.
- **10px** usages are below Pacific's standard scale; use `labelSmall` with a size override or a custom `TextStyle`.
- Scale names follow the `{scale}{SizeVariant}` convention: e.g. `headlineSmall`, `bodyLarge`, `labelMedium`.

### 1.3 Shadows

> **Pacific Level column:** Pacific provides 5 elevation levels (`dropShadowDown1`–`dropShadowDown5` and `dropShadowUp1`–`dropShadowUp5`). Higher levels = more offset + blur. All shadows use `bone1000` (`#0a0a0a`) as the base color.

| Name | Flutter `BoxShadow` | Pacific Level | Usage |
|---|---|---|---|
| dropShadow-down-2 | `BoxShadow(color: Color(0x0A0A0A0A), offset: Offset(0, 2), blurRadius: 8)` | `dropShadowDown2` ✓ | Settings card, EmptyChat cards |
| card-light | `BoxShadow(color: Color.fromRGBO(10, 10, 10, 0.06), offset: Offset(0, 2), blurRadius: 8)` | ~`dropShadowDown2` | Memory cards |
| card-standard | `BoxShadow(color: Color.fromRGBO(10, 10, 10, 0.16), offset: Offset(0, 1), blurRadius: 4)` | ~`dropShadowDown1` | Goal cards |
| menu-shadow | `BoxShadow(color: Color.fromRGBO(10, 10, 10, 0.16), offset: Offset(0, 6), blurRadius: 16)` | ~`dropShadowDown4` | More menus |
| scroll-anchor | `BoxShadow(color: Color(0x140A0A0A), offset: Offset(0, 2), blurRadius: 8)` | ~`dropShadowDown2` | ScrollAnchor button |
| toast-shadow | `BoxShadow(color: Color.fromRGBO(10, 10, 10, 0.16), offset: Offset(0, 0), blurRadius: 1)` | ~`dropShadowDown1` | Toast |
| sheet-shadow | `BoxShadow(color: Color(0x1A000000), offset: Offset(0, -4), blurRadius: 16)` | ~`dropShadowUp4` | ScenarioSwitcher bottom sheet |

### 1.4 Border Radii

| Value | Pacific Variable | Flutter | Usage |
|---|---|---|---|
| 4 | `radius-4` | `BorderRadius.circular(4)` | Safety badge, type badge |
| 12 | `radius-12` | `BorderRadius.circular(12)` | Edit buttons, filter button, scenario row, icon button |
| 14 | — | `BorderRadius.circular(14)` | Scenario icon wrap (radius = size/2) |
| 16 | `radius-16` | `BorderRadius.circular(16)` | Proposal cards, EmptyChat cards, ChatHistory card, toast, progress ring inner circle |
| 20 | `radius-20` | `BorderRadius.circular(20)` | Memory cards, goal cards, settings card, menus, confirm dialog, bottom sheet top |
| 24 | `radius-24` | `BorderRadius.circular(24)` | User bubble, input pills, search bars |
| 9999 | `radius-pill` | `StadiumBorder()` or `BorderRadius.circular(9999)` | Chips, pill buttons, milestones, filter chips |
| 100 | — | `BorderRadius.circular(100)` | Send button, scroll anchor (equivalent to pill) |

### 1.5 Spacing Constants

> **Pacific rpx column:** Pacific spacing tokens run from `rpx10` (10px) to `rpx56` (56px) in 2px increments. Values below 10px or non-even values have no direct `rpx*` token — marked with "—".

| Token | Value | Pacific rpx | Usage |
|---|---|---|---|
| Screen padding | 16 | `rpx16` | `EdgeInsets.symmetric(horizontal: 16)` on all major containers |
| Header height | 44 | `rpx44` | All header bars / title bars — `SizedBox(height: 44)` |
| Left/Right zone width | 100–104 | — (layout) | Panel headers (100), ChatHeader (104) — `SizedBox(width: ...)` |
| Message gap (aiRow) | 16 | `rpx16` | Gap between AI message sections — `SizedBox(height: 16)` |
| AI content gap | 8 | — (< rpx10) | Gap between content blocks |
| Card gap | 12 | `rpx12` | Gap between memory cards, goal cards |
| Section gap | 12 | `rpx12` | Gap between section label and card |
| Chip row gap | 6 | — (< rpx10) | Gap between inline chips — `Wrap(spacing: 6)` |
| Menu item height | 48 | `rpx48` | All menu item rows — `SizedBox(height: 48)` |
| Menu width | 212 | — (layout) | More menu dropdown — `SizedBox(width: 212)` |
| Menu divider | 0.75 | — (sub-pixel) | `Divider(height: 0.75, thickness: 0.75)` between menu items |
| Card divider | 0.75–1 | — (sub-pixel) | Between settings rows, ChatHistory items |

**Spacing migration notes:**
- Values 4, 6, 8 have no Pacific `rpx*` equivalent — use platform small-spacing constants.
- Layout-specific widths (100, 104, 212) are not spacing tokens — keep as fixed layout values.
- Sub-pixel dividers (0.75) are hairline borders — use `Divider` with explicit `thickness`.

---

## 2. Global Components

### 2.1 App Bar

Shared widget used by ChatHeader, MemoryCenter, SettingsPanel, GoalsDashboard, ChatHistory, ScenarioSwitcher.

**Shared layout spec:**

| Property | Flutter Value |
|---|---|
| Title bar height | `SizedBox(height: 44)` |
| Background | surfaceBase (configurable via parameter) |
| Left zone | `SizedBox(width: 104)`, `EdgeInsets.only(left: 16, right: 4)` |
| Center zone | `Expanded`, `Center`, `overflow: TextOverflow.ellipsis` |
| Right zone | `SizedBox(width: 104)`, `EdgeInsets.only(right: 16)`, `MainAxisAlignment.end`, spacing 20 |
| Title | `TextStyle(fontSize: 16, fontWeight: FontWeight.w500, color: contentPrimary)`, `TextAlign.center`, `maxLines: 1` |
| Icon button | `SizedBox(width: 24, height: 24)`, `BorderRadius.circular(12)` |
| Hit slop | `EdgeInsets.all(8)` (via `Padding` or `GestureDetector` area) |
| Safe area | `MediaQuery.of(context).padding.top` |
| Right actions | Up to 2 action icons, spaced with `SizedBox(width: 20)` |

**Variants:**

| Variant | Left | Center | Right |
|---|---|---|---|
| `standard` | Optional action icon | Title + optional subtitle | Up to 2 action icons |
| `back` | ChevronLeftIcon (onBack) | Title | Up to 2 action icons |
| `sheet` | — | Left-aligned title | Optional close button |

**Sheet variant** has different layout: `Row`, `MainAxisAlignment.spaceBetween`, `EdgeInsets.symmetric(horizontal: 20, vertical: 12)`. No safe area inset. No left/center/right zones.

### 2.2 Radio Button

Used in SettingsPanel. Figma node: `28813:86882`.

| State | Outer Circle | Inner Dot |
|---|---|---|
| Selected | `CustomPaint` — circle r=9.5, stroke=1, color=contentPrimary | circle r=6, fill=contentPrimary |
| Unselected | circle r=9.5, stroke=1, color=contentSecondary | none |
| Container | `SizedBox(width: 24, height: 24)` | — |

Pacific equivalent: `PacificRadio` widget.

### 2.3 Pill Button (Confirm)

Used on proposal cards, goal cards.

| Property | Flutter Value |
|---|---|
| Background | contentPrimary (dark) |
| Shape | `StadiumBorder()` |
| Padding | `EdgeInsets.symmetric(horizontal: 12, vertical: 6)` |
| Text | `TextStyle(fontSize: 12, fontWeight: FontWeight.w500, color: Colors.white)` |

### 2.4 Pill Button (Dismiss/Outlined)

| Property | Flutter Value |
|---|---|
| Background | `Colors.transparent` |
| Border | `Border.all(color: Color.fromRGBO(10, 10, 10, 0.1), width: 1)` |
| Shape | `StadiumBorder()` |
| Padding | `EdgeInsets.symmetric(horizontal: 12, vertical: 6)` |
| Text | `TextStyle(fontSize: 12, fontWeight: FontWeight.w500, color: contentSecondary)` |

### 2.5 More Menu (Dropdown)

Shared pattern between ChatHeader and MemoryCenter.

| Layer | Flutter Implementation |
|---|---|
| `menuOverlay` | `Positioned.fill` in `Stack`, zIndex via widget order |
| `menuPositioner` | `Align(alignment: Alignment.topRight)`, `Padding(right: 16)` |
| `menuShadow` | `Container(width: 212, decoration: BoxDecoration(borderRadius: BorderRadius.circular(20), boxShadow: [BoxShadow(color: Color.fromRGBO(10,10,10,0.16), offset: Offset(0, 6), blurRadius: 16)]))` |
| `menuInner` | `Container(decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(20)), padding: EdgeInsets.symmetric(vertical: 2, horizontal: 16))` |
| `menuItem` | `SizedBox(height: 48)`, `Row`, `MainAxisAlignment.spaceBetween`, bottom border `Divider(thickness: 0.75, color: Color.fromRGBO(10,10,10,0.1))` |
| `menuItemLast` | `SizedBox(height: 48)`, `Row`, `MainAxisAlignment.spaceBetween`, no border |
| `menuText` | `TextStyle(fontSize: 16, fontWeight: FontWeight.w500, color: contentPrimary, height: 1.25)`, `Expanded` |
| Trailing icon | `SizedBox(width: 24, height: 24)` |

### 2.6 Toast

Global notification system via `ToastProvider` (use `OverlayEntry` in Flutter).

| Property | Flutter Value |
|---|---|
| Background | `Color(0xFF0F0F0F)` |
| Border radius | `BorderRadius.circular(16)` |
| Padding | `EdgeInsets.all(16)` |
| Layout | `Row`, `SizedBox(width: 8)` between children |
| Message | `TextStyle(fontSize: 14, fontWeight: FontWeight.w500, color: Colors.white, height: 1.43)` |
| Action text | `TextStyle(fontSize: 14, fontWeight: FontWeight.w700, color: Color(0xFF32B7D9), height: 1.43)` |
| Position | `Positioned(left: 16, right: 16, bottom: max(safeArea, 16) + 16)` |
| Shadow | `BoxShadow(color: Color.fromRGBO(10, 10, 10, 0.16), offset: Offset(0, 0), blurRadius: 1)` |
| Animation | `SlideTransition` 100→0 + `FadeTransition`, 300ms; dismiss 250ms |
| Auto-dismiss | `Timer(Duration(milliseconds: 3000))` |

### 2.7 Input Bar

| Property | Flutter Value |
|---|---|
| Pill bg | `Colors.white` |
| Pill border | `Border.all(width: 0.75, color: Color.fromRGBO(10, 10, 10, 0.1))` |
| Pill radius | `BorderRadius.circular(24)` |
| Pill minHeight | `BoxConstraints(minHeight: 48)` |
| Pill padding | `EdgeInsets.only(left: 20, right: 8, top: 8, bottom: 8)` |
| Input font | `TextStyle(fontSize: 16, fontWeight: FontWeight.w400, color: contentPrimary, height: 1.25)` |
| Placeholder | `hintText: "Message"`, `hintStyle: TextStyle(color: contentSecondary)` |
| Cursor color | `contentBone600` (light: bone600 `#5c5b5a`, dark: bone400 `#adacaa`) |
| Selection color | `Color.fromRGBO(92, 91, 90, 0.3)` |
| Send button | `Container(width: 32, height: 32, decoration: BoxDecoration(shape: BoxShape.circle, color: contentBone600))`, white arrow `CustomPaint` 11.5×14.5 |
| Disclaimer | `TextStyle(fontSize: 11, fontWeight: FontWeight.w400, color: contentSecondary)`, `TextAlign.center` |

### 2.8 Search Bar

Shared widget used in MemoryCenter and ChatHistory.

**Variants:** `search` (default) and `searchFilter` (includes filter toggle button).

| Property | Flutter Value |
|---|---|
| Height | `SizedBox(height: 48)` |
| Background | `surfaceElevated` (white, from token) |
| Border | `Border.all(width: 1, color: Color.fromRGBO(10, 10, 10, 0.1))` |
| Border radius | `BorderRadius.circular(24)` |
| Icon | `Icon(Icons.search, size: 16, color: contentSecondary)` |
| Input font | `TextStyle(fontSize: 16, fontWeight: FontWeight.w400, color: contentPrimary, height: 1.25)` |
| Placeholder | `hintText: "Search"`, `hintStyle: TextStyle(color: contentSecondary)` |
| Cursor color | `contentBone600` (light: bone600 `#5c5b5a`, dark: bone400 `#adacaa`) |
| Selection color | `Color.fromRGBO(92, 91, 90, 0.3)` |
| Internal gap | `SizedBox(width: 8)` between icon and input |
| Pill padding | `EdgeInsets.symmetric(horizontal: 16)` |
| Wrapper padding | `EdgeInsets.symmetric(horizontal: 16, vertical: 12)` |

**Filter variant additions (`searchFilter`):**

| Property | Flutter Value |
|---|---|
| Filter button size | `SizedBox(width: 32, height: 32)` |
| Filter button radius | `BorderRadius.circular(12)` |
| Filter button icon | Custom FilterIcon `CustomPaint` 16×16 (3 horizontal lines, strokeWidth 1.25) |
| Filter inactive | transparent bg, contentSecondary icon |
| Filter active | contentPrimary bg, `Colors.white` icon |
| Gap between pill and filter button | `SizedBox(width: 12)` |

### 2.9 Scroll Anchor (Scroll-to-Bottom)

| Property | Flutter Value |
|---|---|
| Size | `SizedBox(width: 36, height: 36)` |
| Background | `Colors.white` |
| Border radius | `BoxShape.circle` |
| Shadow | `BoxShadow(color: Color(0x140A0A0A), offset: Offset(0, 2), blurRadius: 8)` |
| Icon | Arrow `CustomPaint` 14.5×11.5, `Transform.rotate(angle: -pi / 2)`, fill contentPrimary |
| Icon container | `SizedBox(width: 16, height: 16)` |

### 2.10 Confirmation Dialog

Used in MemoryCenter for "Delete all memories?".

| Property | Flutter Value |
|---|---|
| Overlay | `Positioned.fill`, `Color(0x66000000)` (0.4 opacity) |
| Card bg | `Colors.white` |
| Card radius | `BorderRadius.circular(20)` |
| Card padding | `EdgeInsets.all(24)` |
| Card gap | `SizedBox(height: 12)` between children |
| Card max width | `ConstrainedBox(constraints: BoxConstraints(maxWidth: 340))` |
| Title | `TextStyle(fontSize: 18, fontWeight: FontWeight.w700, color: contentPrimary, height: 1.33)` |
| Description | `TextStyle(fontSize: 14, fontWeight: FontWeight.w400, color: contentSecondary, height: 1.43)` |
| Button row | `Row`, `MainAxisAlignment.end`, `SizedBox(width: 8)` gap, `EdgeInsets.only(top: 8)` |
| Cancel button | `Border.all(width: 1.5, color: Color.fromRGBO(10, 10, 10, 0.2))`, `BorderRadius.circular(12)`, `EdgeInsets.symmetric(horizontal: 16, vertical: 8)`, `TextStyle(fontSize: 14, fontWeight: FontWeight.w700, color: contentPrimary)` |
| Delete button | `color: danger`, `BorderRadius.circular(12)`, `EdgeInsets.symmetric(horizontal: 16, vertical: 8)`, `TextStyle(fontSize: 14, fontWeight: FontWeight.w700, color: Colors.white)` |

### 2.11 Bottom Sheet (ScenarioSwitcher)

| Property | Flutter Value |
|---|---|
| Backdrop | `Color(0x59000000)` (0.35), tappable dismiss via `GestureDetector` |
| Sheet bg | surfaceBase |
| Sheet radius | `BorderRadius.only(topLeft: Radius.circular(20), topRight: Radius.circular(20))` |
| Sheet maxHeight | `MediaQuery.of(context).size.height * 0.7` |
| Shadow | `BoxShadow(color: Color(0x1A000000), offset: Offset(0, -4), blurRadius: 16)` |
| Drag handle | `Container(width: 36, height: 4, decoration: BoxDecoration(borderRadius: BorderRadius.circular(2), color: contentMuted))` |
| Header padding | `EdgeInsets.symmetric(horizontal: 20, vertical: 12)` |
| Header title | `TextStyle(fontSize: 16, fontWeight: FontWeight.w500, color: contentPrimary)` |
| Close button | `Padding(padding: EdgeInsets.all(4))`, `Icon(Icons.close, size: 16, color: contentSecondary)` |
| Row padding | `EdgeInsets.symmetric(vertical: 10, horizontal: 12)` |
| Row radius | `BorderRadius.circular(12)` |
| Row gap | `SizedBox(height: 12)` |
| Icon wrap | `Container(width: 28, height: 28, decoration: BoxDecoration(shape: BoxShape.circle, color: surfaceTint))` |
| Row title | `TextStyle(fontSize: 14, fontWeight: FontWeight.w500, color: contentPrimary)` |
| Row subtitle | `TextStyle(fontSize: 12, fontWeight: FontWeight.w400, color: contentSecondary)` |
| Active row | `color: contentPrimary`, white text, icon bg `Colors.white.withOpacity(0.2)` |
| Footer | `TextStyle(fontSize: 11, fontWeight: FontWeight.w400, color: contentSecondary)`, `TextAlign.center` |
| Gesture | `GestureDetector` / `DraggableScrollableSheet` — dismiss threshold 120 or velocity > 800 |

---

## 3. Inline Communication Components

These are elements rendered inside AI message bubbles.

### 3.0 Memory System — Three Tiers

The memory system operates in three tiers based on **who initiates** and **how sensitive** the information is. The decision is driven by two axes: **Confidence** (how certain this is lasting) and **Sensitivity** (privacy/stakes).

**Decision Matrix (Confidence × Sensitivity):**

| Information Type | Example | Logic | Tier |
|---|---|---|---|
| Operational Context | "I'm focused on my Q2 budget" | Low sensitivity; high immediate utility | Tier 1 (Auto-Save) |
| Stylistic Patterns | User consistently asks for bullet points | Mirroring behavior; non-invasive | Tier 1 (Auto-Save) |
| Specific Facts | "My dog's name is Barnaby" | Persistent but low-stakes personal data | Tier 1 (Auto-Save) |
| Core Preferences | "Never use jargon with me" | High-impact; changes future output significantly | Tier 2 (Propose) |
| Sensitive Data | "Here is my home address" | High privacy risk | Tier 2 (Propose) |

**Three Tiers:**

| Tier | Trigger | Marker | Source | UX Pattern | Client Component |
|---|---|---|---|---|---|
| 1. Auto-Save | AI detects low-sensitivity, high-confidence fact | `[MEMORY_SAVE]` | `IMPLICIT_CONFIRMED` | "Saved to memory" chip on message (always visible) | Chip badge on message |
| 2. Propose | AI detects preference, subjective opinion, or sensitive fact | `[MEMORY_PROPOSAL]` | `IMPLICIT_CONFIRMED` (after approval) | Confirmation card: Remember / Not now | MemoryProposalCard |
| 3. Manual | User creates memory in Memory Center | — (client-side) | `EXPLICIT` | Standard form in Memory Center | MemoryCenter add form |

**Key rule:** Sensitivity overrides objectivity — a verifiable fact that is high-stakes (e.g., home address, medical info) uses Tier 2 (propose), not Tier 1 (auto-save).

**Member 360 conflict:** When a Tier 1 auto-save for `ABOUT_ME` contradicts the SoFi profile, it escalates to a Member360ConflictCard (Tier 1→2 hybrid) prompting "Update your profile to [value]?" with Update / Not now buttons.

**MEMORY_UPDATE** corrects previously stored facts regardless of originating tier.

### 3.1 Component Hierarchy

All proposal cards share a unified visual language.

| Component | Background | Border | Radius | Icon | Body Text | Detail Text | Buttons |
|---|---|---|---|---|---|---|---|
| MemoryProposalCard (Tier 2) | surfaceTint | `Border.all(width: 1, color: surfaceEdgeLight)` | 16 | `Icon(Icons.memory, size: 12)`, secondary | 12 `w500` `ls: 0.1` | — | Remember / Not now |
| Member360ConflictCard (Tier 1→2) | surfaceTint | `Border.all(width: 1, color: surfaceEdgeLight)` | 16 | `Icon(Icons.memory, size: 12)`, secondary | 12 `w500` `ls: 0.1` — "Update your profile to [value]?" | — | Update / Not now |
| GoalProposalCard | surfaceTint | `Border.all(width: 1, color: surfaceEdgeLight)` | 16 | `Icon(Icons.gps_fixed, size: 12)`, secondary | 12 `w500` `ls: 0.1` | 12 `w400` secondary | Set up goal / Just chatting |
| Confirmed (check) | surfaceTint | `Border.all(width: 1, color: surfaceEdgeLight)` | 16 | `CustomPaint` checkmark 12×12, bone600 | 12 `w500` `ls: 0.1` (secondary or primary) | — | — |

> **Note:** InsightToActionCard has been retired (Task #12). Goal suggestions now surface as DRAFT goals in the Goals Center instead of inline cards in chat.

**Shared proposal card spec:**

| Property | Flutter Value |
|---|---|
| Card padding | `EdgeInsets.all(12)` |
| Header layout | `Row`, `SizedBox(width: 6)`, `CrossAxisAlignment.start`, `EdgeInsets.only(bottom: 10)` |
| Icon position | `Padding(padding: EdgeInsets.only(top: 2))` |
| Body text | `TextStyle(fontSize: 12, fontWeight: FontWeight.w500, color: contentPrimary, height: 1.33, letterSpacing: 0.1)` |
| Detail text | `TextStyle(fontSize: 12, fontWeight: FontWeight.w400, color: contentSecondary, height: 1.33)`, `EdgeInsets.only(top: 2)` |
| Confirm button | Dark pill — `Container(color: contentPrimary, shape: StadiumBorder())`, `EdgeInsets.symmetric(horizontal: 12, vertical: 6)`, `TextStyle(fontSize: 12, fontWeight: FontWeight.w500, color: Colors.white)` |
| Dismiss button | Outlined pill — `Border.all(width: 1, color: Color.fromRGBO(10, 10, 10, 0.1))`, `StadiumBorder()`, `EdgeInsets.symmetric(horizontal: 12, vertical: 6)`, `TextStyle(fontSize: 12, fontWeight: FontWeight.w500, color: contentSecondary)` |
| Button row | `Row`, `SizedBox(width: 8)` |
| Memory button indent | `EdgeInsets.only(left: 18)` (aligns with text after 12px icon + 6px gap) |
| Confirmed text (secondary) | `TextStyle(fontSize: 12, fontWeight: FontWeight.w500, color: contentSecondary, height: 1.33, letterSpacing: 0.1)` |
| Confirmed text (primary) | `TextStyle(fontSize: 12, fontWeight: FontWeight.w500, color: contentPrimary, height: 1.33, letterSpacing: 0.1)` |
| Approval hint | `Row`, `SizedBox(width: 4)`, `EdgeInsets.only(top: 8, bottom: 4, left: 2)` — `TextStyle(fontSize: 12, fontWeight: FontWeight.w500, color: contentSecondary)` |

### 3.2 Chip Badge

| Property | Flutter Value |
|---|---|
| Layout | `Row`, `SizedBox(width: 6)`, `BorderRadius.circular(16)` |
| Padding | `EdgeInsets.symmetric(horizontal: 10, vertical: 6)` |
| Border | `Border.all(width: 1, color: surfaceEdgeLight)` |
| Shape | `RoundedRectangleBorder(borderRadius: BorderRadius.circular(16))` |
| Left icon | Feather/Icon 12 |
| Label | `TextStyle(fontSize: 12, fontWeight: FontWeight.w500, height: 1.33, letterSpacing: 0.1)` |
| Right icon | chevron-right Icon 12 |
| Animation | `FadeTransition` 350ms + `SlideTransition` translateY 6→0 (`SpringSimulation` tension 120, friction 8) |

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

| Property | Flutter Value |
|---|---|
| Layout | `Row`, `SizedBox(width: 4)` |
| Padding | `EdgeInsets.symmetric(horizontal: 8, vertical: 2)` |
| Border radius | `BorderRadius.circular(4)` |
| Alignment | `Alignment.centerLeft`, `EdgeInsets.only(left: 4)` |
| Icon | Feather/Icon, size varies (see below) |
| Text | `TextStyle(fontSize: 10, fontWeight: FontWeight.w500, height: 1.2)` |

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
| Standard | surfaceTint | `TextStyle(fontSize: 14, fontWeight: FontWeight.w500, color: contentSecondary)` | — |
| Proactive | contentPrimary | `TextStyle(fontSize: 14, fontWeight: FontWeight.w500, color: Colors.white)` | star Icon 14, `Colors.white` |
| Layout | `Row`, `SizedBox(width: 8)`, `EdgeInsets.symmetric(horizontal: 16, vertical: 8)`, `StadiumBorder()` |

### 3.5 Suggestion Pills

| Property | Flutter Value |
|---|---|
| Alignment | `CrossAxisAlignment.end` (right-aligned `Column`) |
| Gap | `SizedBox(height: 8)` |
| Border | `Border.all(width: 0.75, color: contentBone600)` |
| Border radius | `BorderRadius.circular(24)` |
| Padding | `EdgeInsets.only(top: 11, bottom: 12, left: 16, right: 16)` |
| Text | `TextStyle(fontSize: 16, fontWeight: FontWeight.w400, color: contentPrimary, height: 1.25)`, `maxLines: 1`, `overflow: TextOverflow.ellipsis` |
| Max count | 3 |
| Visibility | Only on latest AI message, hidden during streaming |

### 3.6 Action Footer

| Property | Flutter Value |
|---|---|
| Layout | `Row`, `SizedBox(width: 16)` |
| Icon size | `SizedBox(width: 20, height: 20)` (PNG `Image.asset`) |
| Button padding | `EdgeInsets.all(4)` |
| Icons | icon-copy, icon-thumbs-up, icon-thumbs-down (with filled variants) |
| Copied state | `CustomPaint` checkmark 20×20, bone600 stroke |
| Why this? | `TextStyle(fontSize: 12, fontWeight: FontWeight.w400, color: contentSecondary)` + chevron Icon 12 |
| Provenance card | surfaceTint bg, `BorderRadius.circular(16)`, `EdgeInsets.symmetric(horizontal: 12, vertical: 10)`, `TextStyle(fontSize: 12, fontWeight: FontWeight.w400, color: contentSecondary)` |

### 3.7 Provenance Card

| Property | Flutter Value |
|---|---|
| Background | surfaceTint |
| Border radius | `BorderRadius.circular(16)` |
| Padding | `EdgeInsets.symmetric(horizontal: 12, vertical: 10)` |
| Margin top | `SizedBox(height: 4)` |
| Text | `TextStyle(fontSize: 12, fontWeight: FontWeight.w400, color: contentSecondary, height: 1.33)` |

### 3.8 Suggested Goals Section (Goals Center)

Added in Task #12. When the AI detects a goal opportunity, it creates a DRAFT goal in state and sends a chat nudge. DRAFT goals appear in the Goals Center's "Suggested" section above active goals.

**Section Header:**

| Property | Flutter Value |
|---|---|
| Layout | `Row`, `SizedBox(width: 6)`, `EdgeInsets.symmetric(vertical: 4)` |
| Icon | star Icon 14, contentBrand |
| Label | `TextStyle(fontSize: 14, fontWeight: FontWeight.w500, color: contentBrand, height: 1.43)` |

**Suggested Goal Card:**

| Property | Flutter Value |
|---|---|
| Background | `Colors.white` |
| Border | `Border.all(width: 1, color: contentBrand)` with `BorderSide(style: BorderStyle.none)` — use `DashedBorder` or custom painter for dashed |
| Border radius | `BorderRadius.circular(20)` |
| Padding | `EdgeInsets.all(16)` |
| Gap | `SizedBox(height: 12)` |
| Shadow | card-standard (same as GoalCard) |
| Suggested badge | surfaceTint bg, `BorderRadius.circular(4)`, `EdgeInsets.symmetric(horizontal: 8, vertical: 2)`, `TextStyle(fontSize: 10, fontWeight: FontWeight.w500, color: contentBrand, letterSpacing: 0.6)`, uppercase |
| Title | `TextStyle(fontSize: 15, fontWeight: FontWeight.w500, color: contentPrimary)` (same as GoalCard) |
| Type badge | Same as GoalCard typeBadge |
| Detail text | `TextStyle(fontSize: 14, fontWeight: FontWeight.w400, color: contentSecondary)` |
| Confirm button | Dark pill — `color: contentPrimary`, `StadiumBorder()`, `EdgeInsets.symmetric(horizontal: 12, vertical: 6)`, `TextStyle(fontSize: 12, fontWeight: FontWeight.w500, color: Colors.white)` |
| Dismiss button | Outlined pill — `Border.all(width: 1, color: Color.fromRGBO(10, 10, 10, 0.1))`, `StadiumBorder()`, `EdgeInsets.symmetric(horizontal: 12, vertical: 6)`, `TextStyle(fontSize: 12, fontWeight: FontWeight.w500, color: contentSecondary)` |
| Button row | `Row`, `SizedBox(width: 8)` |

**Goals Menu Badge (ChatHeader):**

| Property | Flutter Value |
|---|---|
| Size | `ConstrainedBox(constraints: BoxConstraints(minWidth: 18))`, `SizedBox(height: 18)` |
| Background | contentBrand |
| Border radius | `BorderRadius.circular(9)` |
| Text | `TextStyle(fontSize: 11, fontWeight: FontWeight.w500, color: Colors.white, height: 1.27)` |
| Position | Between menu text and GoalsMenuIcon, `EdgeInsets.only(right: 8)` |
| Visibility | Only shown when DRAFT goals exist |

**Chat Nudge:**

When a goal suggestion is queued, a system pill message appears: "I've added a goal suggestion to your Goals panel — check it when you're ready." Uses standard system pill pattern (surfaceTint bg, `TextStyle(fontSize: 14, fontWeight: FontWeight.w500, color: contentSecondary)`).

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
| Search icon | 16 | — | Material | contentSecondary | `Icon(Icons.search)` |
| FilterIcon | 16×16 | 0 0 16 16 | Stroked (1.25) | contentSecondary | 3 horizontal lines (`CustomPaint`) |
| MoreIcon (MemoryCenter) | 20×20 | 0 0 20 20 | Filled | contentPrimary | Same SVG as ChatHeader |
| PencilIcon (card action) | 13×13 | 0 0 13 13 | Filled | contentSecondary | Small pencil |
| PauseIcon (card action) | ~8.6×13 | 0 0 9.83 12.17 | Stroked (1.5) | contentSecondary | Two bars |
| PlayIcon (card action) | ~11×13 | 0 0 11 13 | Stroked (1.5) | contentSecondary | Triangle, 1.5 left offset |
| DeleteIcon (card action) | ~9.1×14.5 | 0 0 11.5 14.5 | Filled | danger | Small trash |
| PauseMenuIcon | 24×24 | -4.5 -3 19 19 | Stroked (1.5) | contentPrimary | Same paths as PauseIcon, centered in 24×24 |
| PlayMenuIcon | 24×24 | 0 0 24 24 | Filled | contentPrimary | Solid triangle |
| DeleteMenuIcon (MemoryCenter) | 24×24 | 0 0 24 24 | Filled | danger | Same SVG as ChatHeader DeleteMenuIcon |

### 4.3 MessageBubble Icons

| Icon | Size | ViewBox | Style | Color | Usage |
|---|---|---|---|---|---|
| Checkmark (confirmed) | 14×14 | 0 0 24 24 | Stroked (1.5) | contentBone600 | Confirmed proposal state — `CustomPaint` |
| Checkmark (copied) | 20×20 | 0 0 24 24 | Stroked (1.25) | contentBone600 | Copy action feedback — `CustomPaint` |
| cpu icon | 14 | — | Material/Feather | contentSecondary | Memory proposal icon |
| target icon | 14 | — | Material/Feather | contentSecondary | Goal/insight proposal icon |
| shield icon | 10 | — | Material/Feather | contentSecondary | Approval hint |
| star icon | 13 | — | Material/Feather | `Colors.white` | Proactive system pill |
| chevron-right | 12 | — | Material/Feather | per chip | Chip badge trailing |
| chevron-up/down | 12 | — | Material/Feather | contentSecondary | Why this? toggle |
| PNG icon-copy | 20×20 | — | `Image.asset` | `ColorFilter.mode(contentBone600, BlendMode.srcIn)` | Action footer |
| PNG icon-thumbs-up | 20×20 | — | `Image.asset` | `ColorFilter.mode(contentBone600, BlendMode.srcIn)` | Action footer |
| PNG icon-thumbs-down | 20×20 | — | `Image.asset` | `ColorFilter.mode(contentBone600, BlendMode.srcIn)` | Action footer |

### 4.4 SettingsPanel Icons

| Icon | Size | ViewBox | Style | Color | Usage |
|---|---|---|---|---|---|
| RadioSelected | 24×24 | 0 0 24 24 | Stroked (outer) + Filled (inner) | contentPrimary | Selected radio — `CustomPaint` outer ring r=9.5 sw=1, inner dot r=6 |
| RadioUnselected | 24×24 | 0 0 24 24 | Stroked | contentSecondary | Unselected radio — `CustomPaint` outer ring r=9.5 sw=1 only |
| ChevronLeftIcon | 24×24 | 0 0 24 24 | Filled | contentPrimary | Back navigation |

### 4.5 GoalsDashboard Icons

| Icon | Size | ViewBox | Style | Color | Usage |
|---|---|---|---|---|---|
| ChevronLeftIcon | 24×24 | 0 0 24 24 | Filled | contentPrimary | Back navigation |
| ProgressRing | 72×72 (default) | `CustomPaint` Circle | Stroked (sw=4) | varies by status | Goal progress ring (track: progressTrack) — use `CustomPainter` with `Canvas.drawArc` |
| check-circle icon | 10-12 | — | Material | successDark / `Colors.white` | Milestone reached, completed status |
| trending-up icon | 12 | — | Material | contentPrimary | On-track status |
| alert-triangle icon | 12 | — | Material | dangerLight | At-risk status |
| target icon | 32 | — | Material | contentMuted | Empty state |
| message-square icon | 13 | — | Material | contentPrimary | "Ask about this goal" button |

### 4.6 Other Component Icons

| Icon | Size | Widget | Style | Color |
|---|---|---|---|---|
| ChevronLeftIcon | 24×24 | ChatHistory, SettingsPanel | Filled | contentPrimary |
| ChatNewIcon | 24×24 | ChatHistory | Filled | contentPrimary |
| Arrow-left (scroll) | 14.5×11.5 | ScrollAnchor | Filled | contentPrimary |
| Arrow-up (send) | 11.5×14.5 | InputBar | Filled | `Colors.white` |
| Search icon | 16 | ChatHistory | Material | contentSecondary |
| Close icon | 16 | ScenarioSwitcher | Material | contentSecondary |
| Check icon | 16 | ScenarioSwitcher | Material | `Colors.white` |
| Scenario icons | 14 | ScenarioSwitcher | Material | contentPrimary / `Colors.white` |

### 4.7 SVG Definition Location Index

Every custom SVG icon definition. In Flutter, convert to `CustomPaint` widgets or use `flutter_svg` with embedded SVG data:

| Source File | SVG Icons Defined |
|---|---|
| `icons.tsx` (shared) | ChevronLeftIcon, CloseIcon, MoreIcon, DemoIcon, ClockIcon, ChatNewIcon, MemoryMenuIcon, GoalsMenuIcon, PencilMenuIcon, SettingsMenuIcon, DeleteMenuIcon, PauseMenuIcon, PlayMenuIcon |
| `MemoryCenter.tsx` | PencilIcon (13×13), PauseIcon, PlayIcon, DeleteIcon |
| `SettingsPanel.tsx` | RadioSelected, RadioUnselected |
| `SearchBar.tsx` | FilterIcon |
| `ScrollAnchor.tsx` | Arrow-left (inline) |
| `InputBar.tsx` | Arrow-up (inline) |
| `MessageBubble.tsx` | Checkmark (inline, 2 sizes) |

**Widget tree:** `AppBar` widget includes `ChevronLeftIcon` for the `back` variant. All panels (GoalsDashboard, SettingsPanel, ChatHistory, MemoryCenter) get the back chevron via `AppBar(variant: back)` — no local ChevronLeftIcon definitions remain. `ChatHeader` references all header icons. `MemoryCenter` references `MoreIcon`, `DeleteMenuIcon`, `PauseMenuIcon`, `PlayMenuIcon`; `ChatHistory` references `ChatNewIcon`.

**Local-only icons:** `MemoryCenter` still defines small card-action icons (PencilIcon 13×13, PauseIcon, PlayIcon, DeleteIcon) locally — these are smaller, card-specific variants distinct from the menu-sized versions. `SettingsPanel` defines RadioSelected/RadioUnselected locally. `SearchBar` defines FilterIcon locally. `GoalsDashboard` defines ProgressRing (`CustomPainter` with `Canvas.drawArc`) inline.

---

## 5. Layout Patterns

### 5.1 Full-Screen Panel Overlay

Used by: MemoryCenter, GoalsDashboard, SettingsPanel, ChatHistory.

```dart
Stack(
  children: [
    Container(
      color: surfaceBase,
      child: Column(
        children: [
          SizedBox(height: MediaQuery.of(context).padding.top),
          // Title bar
          SizedBox(
            height: 44,
            child: Row(
              children: [
                // Left controls
                SizedBox(
                  width: 100,
                  child: Padding(
                    padding: EdgeInsets.only(left: 16),
                    child: GestureDetector(child: ChevronLeftIcon(size: 24)),
                  ),
                ),
                // Title area
                Expanded(
                  child: Center(
                    child: Text('Title', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w500)),
                  ),
                ),
                // Right controls
                SizedBox(width: 100),
              ],
            ),
          ),
          // Content
          Expanded(
            child: ListView(
              padding: EdgeInsets.symmetric(horizontal: 16).copyWith(bottom: 20),
              children: [...],
            ),
          ),
        ],
      ),
    ),
  ],
)
```

**Slide-in variant (SettingsPanel, ChatHistory):** Uses `SlideTransition` with `Tween<Offset>(begin: Offset(1, 0), end: Offset.zero)`, `CurvedAnimation(curve: Cubic(0.4, 0, 0.2, 1))`, 300ms duration.

### 5.2 More Menu Overlay

```dart
Stack(
  children: [
    // Dismiss backdrop
    Positioned.fill(
      child: GestureDetector(onTap: dismiss),
    ),
    // Menu positioner
    Positioned(
      top: safeAreaTop + headerHeight,
      right: 16,
      child: Container(
        width: 212,
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(20),
          boxShadow: [BoxShadow(color: Color.fromRGBO(10,10,10,0.16), offset: Offset(0, 6), blurRadius: 16)],
        ),
        child: Container(
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(20),
          ),
          padding: EdgeInsets.symmetric(vertical: 2, horizontal: 16),
          child: Column(
            children: [
              // Menu items — SizedBox(height: 48), Row with MainAxisAlignment.spaceBetween
              // Divider(thickness: 0.75, color: Color.fromRGBO(10,10,10,0.1))
            ],
          ),
        ),
      ),
    ),
  ],
)
```

### 5.3 Card Container

Two variants:

**Elevated card (Settings, EmptyChat, Goals):**
```dart
Container(
  decoration: BoxDecoration(
    color: Colors.white,
    borderRadius: BorderRadius.circular(16–20),
    boxShadow: [/* varies by component */],
  ),
  padding: EdgeInsets.all(16),
)
```

**Bordered card (Memory, ChatHistory):**
```dart
Container(
  decoration: BoxDecoration(
    color: Colors.white,
    borderRadius: BorderRadius.circular(16–20),
    border: Border.all(width: 0.75–1, color: Color.fromRGBO(10, 10, 10, 0.06–0.08)),
  ),
  padding: EdgeInsets.all(16),
)
```

### 5.4 Proposal Card Container

```dart
Container(
  decoration: BoxDecoration(
    color: surfaceTint, // Color(0xFFF0EDE8)
    border: Border.all(width: 1, color: Color.fromRGBO(10, 10, 10, 0.05)),
    borderRadius: BorderRadius.circular(16),
  ),
  padding: EdgeInsets.all(12),
  child: Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      // Header row
      Padding(
        padding: EdgeInsets.only(bottom: 10),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Icon(size: 14),
            SizedBox(width: 8),
            Expanded(child: Text(style: TextStyle(fontSize: 14, fontWeight: FontWeight.w500))),
          ],
        ),
      ),
      // Optional: approvalHint row
      // Button row
      Row(
        children: [
          // confirmBtn (dark pill)
          // SizedBox(width: 8)
          // dismissBtn (outlined pill)
        ],
      ),
    ],
  ),
)
```

### 5.5 Bottom Sheet

```dart
Stack(
  alignment: Alignment.bottomCenter,
  children: [
    // Backdrop
    Positioned.fill(
      child: GestureDetector(
        onTap: dismiss,
        child: AnimatedContainer(color: Color(0x59000000)), // 0.35 opacity
      ),
    ),
    // Sheet
    GestureDetector(
      onVerticalDragUpdate: handleDrag,
      onVerticalDragEnd: handleDragEnd, // dismiss threshold 120 or velocity > 800
      child: Container(
        constraints: BoxConstraints(maxHeight: MediaQuery.of(context).size.height * 0.7),
        decoration: BoxDecoration(
          color: surfaceBase,
          borderRadius: BorderRadius.only(
            topLeft: Radius.circular(20),
            topRight: Radius.circular(20),
          ),
          boxShadow: [BoxShadow(color: Color(0x1A000000), offset: Offset(0, -4), blurRadius: 16)],
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            // Handle
            Padding(
              padding: EdgeInsets.only(top: 10),
              child: Center(
                child: Container(width: 36, height: 4,
                  decoration: BoxDecoration(borderRadius: BorderRadius.circular(2), color: contentMuted)),
              ),
            ),
            // Header row — EdgeInsets.symmetric(horizontal: 20)
            // ListView content
            // Footer
          ],
        ),
      ),
    ),
  ],
)
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
- All previously hardcoded color values have been tokenized in the theme system. See Section 1.1 "Previously hardcoded colors" table.
- Semantic status colors (danger/success/warning/info chip variants) may not have direct Pacific equivalents — verify against Pacific's status color system.
- Prototype hex values marked ❌ are Tailwind CSS colors — replace with Pacific hex values during Flutter migration.

### Component Gaps
- Search bar implementation differs slightly between MemoryCenter (`Border.all(width: 1)`) and ChatHistory (`Border.all(width: 0.75)`).
- SettingsMenuIcon uses stroke style while all other menu icons use filled style.

### Inline Component Inconsistencies
- Resolved in Task #10. All proposal cards now share unified icon treatment, text sizes (13 body, 12 detail), button patterns (confirm pill + dismiss outlined pill), and spacing (`SizedBox(width: 8)`, `EdgeInsets.all(12)`). See Section 3.1 for the normalized spec.

### Theme System
- Full light/dark theming implemented. All widgets reference theme tokens — zero hardcoded colors in build methods. In Flutter, use `Theme.of(context).extension<CoachTheme>()` or an `InheritedWidget` to provide the token map. See MEMORY_AND_GOALS.md "Theme System" section for migration pattern details.

### Flutter-Specific Notes
- **PNG icon tinting:** Use `Image.asset(..., color: tokenColor, colorBlendMode: BlendMode.srcIn)` or `ColorFiltered(colorFilter: ColorFilter.mode(color, BlendMode.srcIn))`.
- **Custom SVG icons:** Use `flutter_svg` package with inline SVG strings, or convert to `CustomPainter` for path-based rendering. Path data is preserved in `icons.tsx`.
- **Dashed borders:** Flutter has no built-in dashed border. Use `CustomPainter` with `Paint()..style = PaintingStyle.stroke` and `dashPath` from the `path_drawing` package.
- **Safe area:** Use `SafeArea` widget or `MediaQuery.of(context).padding` to read insets.
- **Animations:** Prototype uses `Reanimated` (spring/timing). In Flutter, use `AnimationController` with `CurvedAnimation`. Spring animations use `SpringSimulation` or `physics_simulation` package.

---

*Last updated: 2026-03-24. Derived from Expo prototype source code inspection, converted to Flutter syntax for migration. Update this document when components are modified or new patterns are introduced.*
