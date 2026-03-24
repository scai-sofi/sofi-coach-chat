# Pacific Color Mapper

**A design token reference for AI-first designers.** Built for people designing in Replit, Cursor, Claude.ai, or any AI tool — without direct access to the Pacific Design System codebase. This file is your complete Pacific token reference: colors, typography scale, spacing, elevation, and border radii.

**How it works:** Describe what you're designing, share a hex from Figma, or drop a Figma frame URL. The AI looks up the right Pacific token and tells you exactly what to use in your code.

**Self-contained.** All 181 Pacific color tokens with their light and dark values are embedded here, plus typography scale names, spacing tokens (`rpx10`–`rpx56`), 5-level elevation system, and border radius tokens. No installs, no scripts, no SoFi repo access needed.

---

## What this is for

You're designing or building something in an AI environment — maybe in Replit, maybe you're vibe-coding a Flutter component with Cursor, maybe you're annotating a Figma spec to hand off to an engineer. You want to use Pacific Design System colors the right way, but you don't have the design system package installed locally.

This skill is your answer. Ask about any color and you'll get:
- The exact token name (`contentBrand`, `surfaceBase`, `buttonBrandDefault`)
- What the color looks like in light mode vs. dark mode
- How to write it in Flutter, CSS, or Tailwind
- Whether the color you have is actually in the Pacific palette

**Why token names matter more than hex values:**
Using `contentBrand` instead of `#00a2c7` means the color automatically updates with the design system, adapts correctly in dark mode, and communicates the *intent* of the color to anyone reading the code. A token is a contract between design and engineering — a hex is just a number.

---

## Which token should I use?

The same hex can map to many tokens — `#00a2c7` (Pacific blue) is used for buttons, text, borders, and backgrounds. The right choice is always the one that describes **what the element does**, not what it looks like.

> **Quick rule:** If it's text → `content*`. If it's a background → `surface*`. If it's a button → `button*`. If it's a border or line → `stroke*`.

### I'm building a…

| Element | Token to use |
|---|---|
| Page or screen background | `surfaceBase` |
| Card, bottom sheet, or floating container | `surfaceElevatedDefault` |
| SoFi blue hero section or feature page | `surfaceNeutral` |
| Primary body text or heading | `contentPrimaryDefault` |
| Secondary / supporting text | `contentSecondary` |
| Brand-colored icon or label | `contentBrand` |
| Text link | `contentLinkPrimary` |
| Primary / brand button | `buttonBrandDefault` |
| Secondary / ghost button | `buttonNeutralDefault` |
| Destructive action button (delete, remove) | `buttonDestructiveDefault` |
| Focus ring or selected outline | `strokeBrand` |

### I need a color for a…

| State or feedback type | Token to use |
|---|---|
| Success message or banner | `contentSuccess` / `surfaceSuccessDefault` |
| Error or danger message | `contentDanger` / `surfaceDangerDefault` |
| Warning or caution message | `contentCaution` / `surfaceCautionDefault` |
| Informational label or banner | `contentInfo` / `surfaceInfoDefault` |
| Tip or help text | `contentTip` / `surfaceTipDefault` |
| Disabled text | `contentDisabled` |
| Disabled button | `buttonBrandDisabled` |
| Text on a dark background or photo | `contentOnDark` |
| Error state input border | `strokeIndicatorError` |

---

## How to use

**In any AI tool (Claude, ChatGPT, Gemini, Replit, Cursor, etc.):**
1. Copy the full contents of this file
2. Paste it into your AI chat
3. Say: *"Use this as your Pacific Design System color reference"*
4. Then ask your question

---

## What to ask

Describe what you need in plain language. Examples:

**Token lookup by color:**
- *"What Pacific token is `#00a2c7`?"*
- *"I have this hex from Figma: `#1a1919` — what token is it?"*
- *"Map these colors to Pacific tokens: #00a2c7, #faf8f5, #1a1919"*

**Token lookup by intent:**
- *"What token should I use for the primary button background?"*
- *"What's the Pacific token for page background color?"*
- *"I need a token for body text — what's the right one?"*
- *"What token should an error message use?"*

**Figma frame mapping (with Figma MCP):**
- *"Here's my Figma frame: [URL] — what Pacific tokens are these colors?"*
- *"Map all the colors in this frame to Pacific tokens: [URL]"*

**Annotation and handoff:**
- *"Help me annotate this design spec with Pacific token names"*
- *"Write a handoff note for an engineer with the correct token names for these colors"*
- *"Replace the hardcoded colors in this component with Pacific tokens"*

**Color library setup** *(if your project has no token file yet)*:
- *"I'm starting a new Replit React project — set up a Pacific color library for me"*
- *"My React Native project has no color file yet. Create one using the Pacific tokens from this Figma frame: [URL]"*
- *"Generate a `pacificColors.js` with the tokens from this design"*
- *"Create a CSS tokens file for my React web project"*

**Codebase audit** *(secondary use)*:
- *"Scan this file for hardcoded colors and suggest tokens"*
- *"Audit this folder for colors that aren't using Pacific tokens"*

---

## Using Figma MCP

If you're in Cursor with the Figma plugin connected, you can drop a Figma frame URL directly:

> *"Here's my Figma frame: https://figma.com/design/ABC123/My-App?node-id=42-15 — what Pacific tokens should these colors use?"*

The AI will fetch the design data, extract every fill and stroke color, convert them to hex, and map each one to the right Pacific token. You'll get a layer-by-layer annotation ready to drop into your spec or code.

**If Figma MCP isn't connected**, copy hex values out of Figma's Inspect panel and paste them instead — the result is the same.

---

## Handoff example

Say your Figma spec has a blue CTA button. Instead of handing off:

> *"Button fill: #00a2c7"*

You hand off:

> *"Button fill: `buttonBrandDefault` (Pacific token)"*

The Flutter engineer writes `colors.buttonBrandDefault`. The web engineer uses the same token name in whatever system your web team uses. No guessing, no wrong-color bugs, and the button automatically shows the correct shade in dark mode.

---

## Typography Scale

Pacific defines text styles using a two-part naming convention: **scale** + **size variant**. The scale describes the role, the size variant controls the magnitude.

**Hierarchy (large → small):** Display → Headline → Title → Label → Body

Each scale has five size variants: ExtraLarge, Large, Medium, Small, ExtraSmall.

| Scale | Role | Typical Use |
|---|---|---|
| Display | Hero numbers, large callouts | Account balance, greeting |
| Headline | Page titles, section headers | Screen title, modal title |
| Title | Subsection headers, card titles | Card header, list group title |
| Label | UI labels, captions, metadata | Button text, chip label, badge |
| Body | Paragraph text, descriptions | Message body, form helper text |

**Additional styles:** Underline, Overline, Button, BodyEmphasized — used for specialized UI elements.

**Token name format:** `{scale}{SizeVariant}` in camelCase — e.g. `headlineMedium`, `bodySmall`, `labelLarge`, `titleExtraSmall`.

**In code:**
- **Web (StyleX):** `textTokens.headlineMedium` from `@sofi-web-ui/base`
- **Flutter:** `context.textTheme.headlineMedium`
- **React Native (prototype):** Map manually — see DESIGN_SYSTEM_MAP.md § 1.2 for prototype-to-Pacific type scale mapping

---

## Spacing Tokens

Pacific uses `rpx*` tokens for all spacing (margin, padding, gap). Values range from `rpx10` (10px) to `rpx56` (56px) in **2px increments**.

| Token | px | rem |
|---|---|---|
| `rpx10` | 10 | 0.625 |
| `rpx12` | 12 | 0.75 |
| `rpx14` | 14 | 0.875 |
| `rpx16` | 16 | 1.0 |
| `rpx18` | 18 | 1.125 |
| `rpx20` | 20 | 1.25 |
| `rpx22` | 22 | 1.375 |
| `rpx24` | 24 | 1.5 |
| `rpx26` | 26 | 1.625 |
| `rpx28` | 28 | 1.75 |
| `rpx30` | 30 | 1.875 |
| `rpx32` | 32 | 2.0 |
| `rpx34` | 34 | 2.125 |
| `rpx36` | 36 | 2.25 |
| `rpx38` | 38 | 2.375 |
| `rpx40` | 40 | 2.5 |
| `rpx42` | 42 | 2.625 |
| `rpx44` | 44 | 2.75 |
| `rpx46` | 46 | 2.875 |
| `rpx48` | 48 | 3.0 |
| `rpx50` | 50 | 3.125 |
| `rpx52` | 52 | 3.25 |
| `rpx54` | 54 | 3.375 |
| `rpx56` | 56 | 3.5 |

Values below 10px (e.g. 4, 6, 8) are not covered by `rpx*` tokens — use platform-appropriate small spacing constants.

**In code:**
- **Web (StyleX):** `globalTokens.rpx16` from `@sofi-web-ui/base/dist/globalTokens.stylex`
- **Flutter:** `PacificSpacing.rpx16` (or equivalent from `sofi_design_system`)
- **React Native (prototype):** Raw pixel values — see DESIGN_SYSTEM_MAP.md § 1.5 for prototype-to-Pacific spacing mapping

---

## Elevation (Box Shadows)

Pacific provides 5 elevation levels for depth, available in both downward and upward directions.

| Level | Token (down) | Token (up) | Typical Use |
|---|---|---|---|
| 1 | `dropShadowDown1` | `dropShadowUp1` | Subtle card edges, dividers |
| 2 | `dropShadowDown2` | `dropShadowUp2` | Cards, list items |
| 3 | `dropShadowDown3` | `dropShadowUp3` | Floating buttons, toolbars |
| 4 | `dropShadowDown4` | `dropShadowUp4` | Menus, dropdowns |
| 5 | `dropShadowDown5` | `dropShadowUp5` | Modals, bottom sheets |

Higher levels = more offset, larger blur radius, slightly more opacity. All shadows use `bone1000` (`#0a0a0a`) as the shadow color.

**In code:**
- **Web (StyleX):** `boxShadowsTokens.dropShadowDown2` from `@sofi-web-ui/base/dist/boxShadows.stylex`
- **Flutter:** `PacificElevation.level2` (or equivalent from `sofi_design_system`)

---

## Border Radius Tokens

Pacific provides four standard border radius values via `globalTokens.borderRadius*`.

| Token | Value | Typical Use |
|---|---|---|
| `borderRadius12` | 12px | Buttons, small interactive elements |
| `borderRadius16` | 16px | Cards, containers, input fields |
| `borderRadius20` | 20px | Larger cards, dialogs, sheets |
| `borderRadius24` | 24px | Pills, search bars, large inputs |

For full-circle / pill shapes, use a large arbitrary value (e.g. 9999px) — there is no dedicated Pacific `borderRadiusPill` token.

---

## Using tokens in code

> **React Native / Expo?** CSS variables don't work in React Native. Use the **"Bootstrap: React Native / Expo"** file instead — it's a TypeScript theme object that works with `useColorScheme`. See that section below.

### Web / React (browser) — CSS file

Copy `pacific-tokens.css` (from the Bootstrap section below) into your project and import it once:

```js
import './pacific-tokens.css';
```

Then use any token in your CSS or inline styles:

```css
.page     { background-color: var(--color-surface-base);           }  /* #faf8f5 light, #0a0a0a dark */
.heading  { color: var(--color-content-primary-default);           }  /* #1a1919 light, #faf8f5 dark */
.cta      { background-color: var(--color-button-brand-default);   }  /* #00a2c7 light, #32b7d9 dark */
```

Toggle dark mode: `document.documentElement.classList.toggle('dark')`

**Naming:** camelCase token → kebab-case variable with `--color-` prefix.
`contentBrand` → `--color-content-brand`

### React Native / Expo — TypeScript theme object

CSS variables don't exist in React Native. Use the `pacificTokens.ts` file from the Bootstrap section below instead:

```tsx
import { useColorScheme } from 'react-native';
import { pacificLight, pacificDark } from './pacificTokens';

export default function MyComponent() {
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? pacificDark : pacificLight;

  return (
    <View style={{ backgroundColor: colors.surfaceBase }}>
      <Text style={{ color: colors.contentPrimaryDefault }}>Hello</Text>
      <Pressable style={{ backgroundColor: colors.buttonBrandDefault }}>
        <Text style={{ color: colors.contentOnDark }}>Get started</Text>
      </Pressable>
    </View>
  );
}
```

Every token is a plain hex string — use it anywhere React Native accepts a color value.

### Flutter / Dart

```dart
import 'package:sofi_design_system/sofi_design_system.dart';

final colors = context.colors; // in your widget's build() method

color: colors.contentBrand        // brand icon or text
color: colors.buttonBrandDefault  // primary button fill
color: colors.strokeBrand         // focus ring / selected border
color: colors.surfaceBase         // page background
color: colors.surfaceNeutral      // SoFi blue container
```

---

## Bootstrap: ready-to-paste CSS

Drop this file into any web project — Replit, React, plain HTML, Next.js, whatever. It defines every Pacific color token as a CSS variable for light mode, with a `.dark` class override for dark mode.

**Primitive variables** (`--primitive-*`) are the raw color values. You rarely need them directly — use the semantic tokens instead. But they're included so you can reference `var(--primitive-blue-550)` if you need a specific raw color.

```css
/* ============================================================
   Pacific Design System — Color Tokens
   Source: sofi_design_system_tokens
   ============================================================

   USAGE:
     color: var(--color-content-brand);
     background: var(--color-surface-base);
     border-color: var(--color-stroke-brand);

   DARK MODE: add class="dark" to <html> or <body>
     document.documentElement.classList.toggle('dark');

   camelCase → CSS variable:
     contentBrand        → --color-content-brand
     surfaceBase         → --color-surface-base
     buttonBrandDefault  → --color-button-brand-default
   ============================================================ */

:root {

  /* ── Primitive palette (raw hex values) ── */

  /* Bone (neutral) */
  --primitive-bone-0:    #ffffff;
  --primitive-bone-50:   #faf8f5;
  --primitive-bone-100:  #f5f3f0;
  --primitive-bone-150:  #f0eeeb;
  --primitive-bone-200:  #e5e4e1;
  --primitive-bone-250:  #dbdad7;
  --primitive-bone-300:  #cccac8;
  --primitive-bone-350:  #bdbbb9;
  --primitive-bone-400:  #adacaa;
  --primitive-bone-450:  #999896;
  --primitive-bone-500:  #858482;
  --primitive-bone-550:  #706f6e;
  --primitive-bone-600:  #5c5b5a;
  --primitive-bone-650:  #4d4c4b;
  --primitive-bone-700:  #3d3d3c;
  --primitive-bone-750:  #2e2e2d;
  --primitive-bone-800:  #242323;
  --primitive-bone-850:  #1a1919;
  --primitive-bone-900:  #141414;
  --primitive-bone-950:  #0f0f0f;
  --primitive-bone-1000: #0a0a0a;

  /* Blue */
  --primitive-blue-50:   #edf8fc;
  --primitive-blue-100:  #e5f6fc;
  --primitive-blue-150:  #def5fc;
  --primitive-blue-200:  #d6f3fc;
  --primitive-blue-250:  #c1ebf9;
  --primitive-blue-300:  #ade4f5;
  --primitive-blue-350:  #98dcf2;
  --primitive-blue-400:  #87d6ed;
  --primitive-blue-450:  #65cae5;
  --primitive-blue-500:  #32b7d9;
  --primitive-blue-550:  #00a2c7;
  --primitive-blue-600:  #0080a3;
  --primitive-blue-650:  #006280;
  --primitive-blue-700:  #005471;
  --primitive-blue-750:  #004661;
  --primitive-blue-800:  #003951;
  --primitive-blue-850:  #002c40;
  --primitive-blue-900:  #002638;
  --primitive-blue-950:  #001e2d;
  --primitive-blue-1000: #001722;

  /* Red */
  --primitive-red-50:   #ffe5e5;
  --primitive-red-100:  #ffe0e0;
  --primitive-red-150:  #ffd7d6;
  --primitive-red-200:  #fecdcc;
  --primitive-red-250:  #fec4c2;
  --primitive-red-300:  #feb6b3;
  --primitive-red-350:  #fda7a4;
  --primitive-red-400:  #fd928e;
  --primitive-red-450:  #fc7c77;
  --primitive-red-500:  #fc6761;
  --primitive-red-550:  #fb4a43;
  --primitive-red-600:  #fa2d25;
  --primitive-red-650:  #cd251e;
  --primitive-red-700:  #a01d18;
  --primitive-red-750:  #8a1914;
  --primitive-red-800:  #731511;
  --primitive-red-850:  #352120;
  --primitive-red-900:  #281918;
  --primitive-red-950:  #1b1110;
  --primitive-red-1000: #140c0c;

  /* Green */
  --primitive-green-50:   #ebf9ee;
  --primitive-green-100:  #e2f7e7;
  --primitive-green-150:  #d9f4df;
  --primitive-green-200:  #c7efd1;
  --primitive-green-250:  #b5ebc2;
  --primitive-green-300:  #a3e6b3;
  --primitive-green-350:  #91e1a5;
  --primitive-green-400:  #7edc96;
  --primitive-green-450:  #63d580;
  --primitive-green-500:  #3fcc62;
  --primitive-green-550:  #1bc245;
  --primitive-green-600:  #19a623;
  --primitive-green-650:  #178a00;
  --primitive-green-700:  #157206;
  --primitive-green-750:  #135a0b;
  --primitive-green-800:  #12490f;
  --primitive-green-850:  #113912;
  --primitive-green-900:  #102916;
  --primitive-green-950:  #0b1b0f;
  --primitive-green-1000: #08150b;

  /* Yellow */
  --primitive-yellow-50:   #fff5e5;
  --primitive-yellow-100:  #fff1ce;
  --primitive-yellow-150:  #ffedb7;
  --primitive-yellow-200:  #ffe589;
  --primitive-yellow-250:  #ffdc5c;
  --primitive-yellow-300:  #ffd42e;
  --primitive-yellow-350:  #ffcc00;
  --primitive-yellow-400:  #f2c102;
  --primitive-yellow-450:  #dfb006;
  --primitive-yellow-500:  #c69a0a;
  --primitive-yellow-550:  #a67f10;
  --primitive-yellow-600:  #8c6914;
  --primitive-yellow-650:  #6c5518;
  --primitive-yellow-700:  #55471c;
  --primitive-yellow-750:  #453d1e;
  --primitive-yellow-800:  #353320;
  --primitive-yellow-850:  #2a291a;
  --primitive-yellow-900:  #201f13;
  --primitive-yellow-950:  #15140d;
  --primitive-yellow-1000: #100f0a;

  /* Brand / marketing */
  --primitive-mktg-eggplant:       #4c12a1;
  --primitive-mktg-ink:            #38256d;
  --primitive-mktg-berry:          #cc1975;
  --primitive-plus-light-purple:   #f3f2ff;
  --primitive-plus-dark-purple:    #3a1679;
  --primitive-plus-pop-purple:     #5c26bd;
  --primitive-crypto-400:          #8a5aad;
  --primitive-orange-fair:         #fd972e;
  --primitive-orange-fair-on-dark: #feaa24;

  /* ── Semantic tokens — light mode ── */

  /* Content */
  --color-content-primary-default:          #1a1919;
  --color-content-primary-inverse:          #ffffff;
  --color-content-on-light:                 #1a1919;
  --color-content-on-dark:                  #ffffff;
  --color-content-disabled:                 #dbdad7;
  --color-content-disabled-2:               #bdbbb9;
  --color-content-secondary:                #706f6e;
  --color-content-hint:                     #dbdad7;
  --color-content-brand:                    #00a2c7;
  --color-content-link-primary:             #1a1919;
  --color-content-link-secondary:           #00a2c7;
  --color-content-info:                     #1a1919;
  --color-content-tip:                      #006280;
  --color-content-success:                  #1bc245;
  --color-content-success-emphasized:       #19a623;
  --color-content-caution:                  #8c6914;
  --color-content-caution-on-dark:          #ffcc00;
  --color-content-danger:                   #fa2d25;
  --color-content-danger-emphasized:        #cd251e;
  --color-content-positive:                 #1bc245;
  --color-content-negative:                 #fa2d25;
  --color-content-indicator-selected:       #1a1919;
  --color-content-indicator-caution:        #8c6914;
  --color-content-indicator-fair:           #fd972e;
  --color-content-indicator-error:          #fa2d25;
  --color-content-indicator-error-hover:    #cd251e;
  --color-content-indicator-error-pressed:  #a01d18;
  --color-content-indicator-selected-inverse: #ffffff;
  --color-content-indicator-unselected:     #5c5b5a;
  --color-content-indicator-hover:          #1a1919;
  --color-content-indicator-disabled:       #dbdad7;
  --color-content-status-bar:               #0a0a0a;
  --color-content-chart-a:                  #65cae5;
  --color-content-chart-b:                  #0080a3;
  --color-content-chart-c:                  #004661;
  --color-content-chart-d:                  #1a1919;
  --color-content-chart-e:                  #00a2c7;
  --color-content-chart-f:                  #ade4f5;
  --color-content-chart-1:                  #32b7d9;
  --color-content-chart-2:                  #0080a3;
  --color-content-chart-3:                  #8a5aad;
  --color-content-chart-4:                  #cc1975;
  --color-content-chart-5:                  #fb4a43;
  --color-content-chart-6:                  #fc7c77;
  --color-content-chart-7:                  #ffcc00;
  --color-content-chart-8:                  #ffdc5c;
  --color-content-chart-9:                  #1bc245;
  --color-content-chart-10:                 #63d580;
  --color-content-chart-disbursed-1:        #bdbbb9;
  --color-content-chart-disbursed-2:        #858482;
  --color-content-chart-disbursed-3:        #4d4c4b;
  --color-content-chart-disbursed-4:        #242323;
  --color-content-crypto-coin-shadow:       #0080a3;

  /* Surface */
  --color-surface-base:                          #faf8f5;
  --color-surface-elevated-default:              #ffffff;
  --color-surface-elevated-unselected:           #ffffff;
  --color-surface-elevated-selected:             #1a1919;
  --color-surface-elevated-disabled:             #f0eeeb;
  --color-surface-elevated-disabled-emphasized:  #dbdad7;
  --color-surface-bottom-sheet:                  #faf8f5;
  --color-surface-indicator-selected:            #1a1919;
  --color-surface-indicator-selected-secondary:  #706f6e;
  --color-surface-indicator-selected-brand:      #00a2c7;
  --color-surface-indicator-unselected:          #dbdad7;
  --color-surface-indicator-unselected-hover:    #cccac8;
  --color-surface-indicator-disabled:            #f0eeeb;
  --color-surface-indicator-range:               #f0eeeb;
  --color-surface-info-label:                    #f5f3f0;
  --color-surface-info-default:                  #f0eeeb;
  --color-surface-tip-default:                   #edf8fc;
  --color-surface-neutral:                       #00a2c7;
  --color-surface-toast:                         #0f0f0f;
  --color-surface-success-default:               #ebf9ee;
  --color-surface-caution-default:               #fff5e5;
  --color-surface-caution-emphasize:             #ffcc00;
  --color-surface-danger-default:                #ffe5e5;
  --color-surface-danger-emphasize:              #cd251e;
  --color-surface-alert:                         #fa2d25;
  --color-surface-positive-default:              #1bc245;
  --color-surface-positive-diminish:             #ebf9ee;
  --color-surface-negative-default:              #fa2d25;
  --color-surface-negative-diminish:             #ffe5e5;
  --color-surface-sub:                           #00a2c7;
  --color-surface-sub-dark:                      #004661;
  --color-surface-sub-crypto:                    #00a2c7;
  --color-surface-sub-error:                     #004661;
  --color-surface-switch-selected:               #ffffff;
  --color-surface-switch-unselected:             #f0eeeb;
  --color-surface-switch-unselected-hover:       #e5e4e1;

  /* Stroke */
  --color-stroke-brand:                         #00a2c7;
  --color-stroke-indicator-hover:               #1a1919;
  --color-stroke-indicator-selected:            #1a1919;
  --color-stroke-indicator-pressed:             #1a1919;
  --color-stroke-indicator-error:               #fa2d25;
  --color-stroke-indicator-error-hover:         #cd251e;
  --color-stroke-indicator-error-pressed:       #a01d18;
  --color-stroke-indicator-unselected-default:  #dbdad7;
  --color-stroke-indicator-caution:             #8c6914;
  --color-stroke-on-dark:                       #ffffff;
  --color-stroke-positive-default:              #1bc245;
  --color-stroke-negative-default:              #fa2d25;

  /* Button */
  --color-button-brand-default:               #00a2c7;
  --color-button-brand-default-inverse:       #32b7d9;
  --color-button-brand-inverse:               #ffffff;
  --color-button-brand-disabled:              #f0eeeb;
  --color-button-brand-disabled-2:            #bdbbb9;
  --color-button-brand-hover:                 #0080a3;
  --color-button-brand-pressed:               #006280;
  --color-button-destructive-default:         #fa2d25;
  --color-button-destructive-disabled:        #ffd7d6;
  --color-button-destructive-disabled-2:      #fda7a4;
  --color-button-destructive-hover:           #cd251e;
  --color-button-destructive-pressed:         #a01d18;
  --color-button-destructive-inverse:         #ffffff;
  --color-button-on-dark:                     #ffffff;
  --color-button-on-dark-inverse:             #0a0a0a;
  --color-button-neutral-default:             #1a1919;
  --color-button-neutral-disabled:            #dbdad7;
  --color-button-neutral-hover:               #3d3d3c;
  --color-button-neutral-pressed:             #0a0a0a;
  --color-button-tip:                         #006280;
  --color-button-tip-hover:                   #005471;
  --color-button-caution:                     #8c6914;
  --color-button-caution-hover:               #6c5518;
  --color-button-danger-emphasized:           #cd251e;
  --color-button-danger-emphasized-hover:     #a01d18;
  --color-button-success:                     #19a623;
  --color-button-success-hover:               #178a00;
  --color-button-invest-positive-default:     #1bc245;
  --color-button-invest-positive-hover:       #19a623;
  --color-button-invest-positive-pressed:     #157206;
  --color-button-invest-positive-selected:    #1bc245;
  --color-button-invest-neutral-default:      #706f6e;
  --color-button-invest-neutral-hover:        #5c5b5a;
  --color-button-invest-neutral-pressed:      #3d3d3c;
  --color-button-invest-neutral-selected:     #858482;
  --color-button-invest-negative-default:     #fa2d25;
  --color-button-invest-negative-hover:       #cd251e;
  --color-button-invest-negative-pressed:     #a01d18;
  --color-button-invest-negative-selected:    #fa2d25;

  /* Marketing */
  --color-marketing-white:      #ffffff;
  --color-marketing-bone:       #faf8f5;
  --color-marketing-sofi-blue:  #00a2c7;
  --color-marketing-eggplant:   #4c12a1;
  --color-marketing-ink:        #38256d;
  --color-marketing-berry:      #cc1975;

  /* Plus */
  --color-plus-light-purple: #f3f2ff;
  --color-plus-pop-purple:   #5c26bd;

  /* iOS Keypad */
  --color-ioskeypad-surface:         #dbdad7;
  --color-ioskeypad-keys-primary:    #ffffff;
  --color-ioskeypad-keys-secondary:  #bdbbb9;
  --color-ioskeypad-content:         #0f0f0f;
  --color-ioskeypad-shadow:          #858482;

  /* Gradient (solid stops) */
  --color-gradient-on-base-1:      #f0eeeb;
  --color-gradient-on-base-2:      #faf8f5;
  --color-gradient-on-elevated-1:  #faf8f5;
  --color-gradient-on-elevated-2:  #ffffff;
  --color-gradient-coach-mark-1:   #e5f6fc;
  --color-gradient-coach-mark-2:   #65cae5;
  --color-gradient-sub-1:          #32b7d9;
  --color-gradient-sub-2:          #00a2c7;
}

/* ── Dark mode overrides ── */
/* Add class="dark" to <html> or <body> to activate */
.dark {

  /* Content */
  --color-content-primary-default:          #faf8f5;
  --color-content-primary-inverse:          #0a0a0a;
  --color-content-on-light:                 #1a1919;
  --color-content-on-dark:                  #ffffff;
  --color-content-disabled:                 #3d3d3c;
  --color-content-disabled-2:               #1a1919;
  --color-content-secondary:                #858482;
  --color-content-hint:                     #858482;
  --color-content-brand:                    #32b7d9;
  --color-content-link-primary:             #faf8f5;
  --color-content-link-secondary:           #32b7d9;
  --color-content-info:                     #faf8f5;
  --color-content-tip:                      #65cae5;
  --color-content-success:                  #1bc245;
  --color-content-success-emphasized:       #1bc245;
  --color-content-caution:                  #ffcc00;
  --color-content-caution-on-dark:          #ffcc00;
  --color-content-danger:                   #fa2d25;
  --color-content-danger-emphasized:        #fa2d25;
  --color-content-positive:                 #1bc245;
  --color-content-negative:                 #fa2d25;
  --color-content-indicator-selected:       #faf8f5;
  --color-content-indicator-caution:        #ffcc00;
  --color-content-indicator-fair:           #feaa24;
  --color-content-indicator-error:          #fa2d25;
  --color-content-indicator-error-hover:    #cd251e;
  --color-content-indicator-error-pressed:  #a01d18;
  --color-content-indicator-selected-inverse: #0a0a0a;
  --color-content-indicator-unselected:     #999896;
  --color-content-indicator-hover:          #faf8f5;
  --color-content-indicator-disabled:       #2e2e2d;
  --color-content-status-bar:               #ffffff;
  --color-content-chart-a:                  #65cae5;
  --color-content-chart-b:                  #0080a3;
  --color-content-chart-c:                  #004661;
  --color-content-chart-d:                  #dbdad7;
  --color-content-chart-e:                  #65cae5;
  --color-content-chart-f:                  #006280;
  --color-content-chart-1:                  #32b7d9;
  --color-content-chart-2:                  #0080a3;
  --color-content-chart-3:                  #8a5aad;
  --color-content-chart-4:                  #cc1975;
  --color-content-chart-5:                  #fb4a43;
  --color-content-chart-6:                  #fc7c77;
  --color-content-chart-7:                  #ffcc00;
  --color-content-chart-8:                  #ffdc5c;
  --color-content-chart-9:                  #1bc245;
  --color-content-chart-10:                 #63d580;
  --color-content-chart-disbursed-1:        #242323;
  --color-content-chart-disbursed-2:        #2e2e2d;
  --color-content-chart-disbursed-3:        #3d3d3c;
  --color-content-chart-disbursed-4:        #4d4c4b;
  --color-content-crypto-coin-shadow:       #242323;

  /* Surface */
  --color-surface-base:                          #0a0a0a;
  --color-surface-elevated-default:              #1a1919;
  --color-surface-elevated-unselected:           #1a1919;
  --color-surface-elevated-selected:             #ffffff;
  --color-surface-elevated-disabled:             #2e2e2d;
  --color-surface-elevated-disabled-emphasized:  #4d4c4b;
  --color-surface-bottom-sheet:                  #1a1919;
  --color-surface-indicator-selected:            #faf8f5;
  --color-surface-indicator-selected-secondary:  #858482;
  --color-surface-indicator-selected-brand:      #32b7d9;
  --color-surface-indicator-unselected:          #2e2e2d;
  --color-surface-indicator-unselected-hover:    #4d4c4b;
  --color-surface-indicator-disabled:            #2e2e2d;
  --color-surface-indicator-range:               #141414;
  --color-surface-info-default:                  #242323;
  --color-surface-tip-default:                   #002638;
  --color-surface-neutral:                       #32b7d9;
  --color-surface-toast:                         #3d3d3c;
  --color-surface-success-default:               #102916;
  --color-surface-caution-default:               #353320;
  --color-surface-caution-emphasize:             #ffcc00;
  --color-surface-danger-default:                #352120;
  --color-surface-danger-emphasize:              #fa2d25;
  --color-surface-alert:                         #fa2d25;
  --color-surface-positive-default:              #1bc245;
  --color-surface-positive-diminish:             #102916;
  --color-surface-negative-default:              #fa2d25;
  --color-surface-negative-diminish:             #352120;
  --color-surface-sub:                           #001722;
  --color-surface-sub-dark:                      #0a0a0a;
  --color-surface-sub-crypto:                    #0a0a0a;
  --color-surface-sub-error:                     #002638;
  --color-surface-switch-selected:               #2e2e2d;
  --color-surface-switch-unselected:             #242323;
  --color-surface-switch-unselected-hover:       #1a1919;

  /* Stroke */
  --color-stroke-brand:                         #32b7d9;
  --color-stroke-indicator-hover:               #faf8f5;
  --color-stroke-indicator-selected:            #faf8f5;
  --color-stroke-indicator-pressed:             #faf8f5;
  --color-stroke-indicator-error:               #fa2d25;
  --color-stroke-indicator-error-hover:         #cd251e;
  --color-stroke-indicator-error-pressed:       #a01d18;
  --color-stroke-indicator-unselected-default:  #2e2e2d;
  --color-stroke-indicator-caution:             #ffcc00;
  --color-stroke-on-dark:                       #faf8f5;
  --color-stroke-positive-default:              #1bc245;
  --color-stroke-negative-default:              #fa2d25;

  /* Button */
  --color-button-brand-default:               #32b7d9;
  --color-button-brand-default-inverse:       #32b7d9;
  --color-button-brand-inverse:               #0a0a0a;
  --color-button-brand-disabled:              #2e2e2d;
  --color-button-brand-disabled-2:            #1a1919;
  --color-button-brand-hover:                 #00a2c7;
  --color-button-brand-pressed:               #0080a3;
  --color-button-destructive-default:         #fa2d25;
  --color-button-destructive-disabled:        #352120;
  --color-button-destructive-disabled-2:      #731511;
  --color-button-destructive-hover:           #cd251e;
  --color-button-destructive-pressed:         #a01d18;
  --color-button-destructive-inverse:         #0a0a0a;
  --color-button-on-dark:                     #ffffff;
  --color-button-on-dark-inverse:             #0a0a0a;
  --color-button-neutral-default:             #faf8f5;
  --color-button-neutral-disabled:            #3d3d3c;
  --color-button-neutral-hover:               #cccac8;
  --color-button-neutral-pressed:             #ffffff;
  --color-button-tip:                         #0080a3;
  --color-button-tip-hover:                   #006280;
  --color-button-caution:                     #ffcc00;
  --color-button-caution-hover:               #f2c102;
  --color-button-danger-emphasized:           #fa2d25;
  --color-button-danger-emphasized-hover:     #cd251e;
  --color-button-success:                     #1bc245;
  --color-button-success-hover:               #19a623;
  --color-button-invest-positive-default:     #1bc245;
  --color-button-invest-positive-hover:       #19a623;
  --color-button-invest-positive-pressed:     #157206;
  --color-button-invest-positive-selected:    #1bc245;
  --color-button-invest-neutral-default:      #706f6e;
  --color-button-invest-neutral-hover:        #5c5b5a;
  --color-button-invest-neutral-pressed:      #3d3d3c;
  --color-button-invest-neutral-selected:     #858482;
  --color-button-invest-negative-default:     #fa2d25;
  --color-button-invest-negative-hover:       #cd251e;
  --color-button-invest-negative-pressed:     #a01d18;
  --color-button-invest-negative-selected:    #fa2d25;

  /* Marketing */
  --color-marketing-white:      #1a1919;
  --color-marketing-bone:       #0a0a0a;
  --color-marketing-sofi-blue:  #32b7d9;
  --color-marketing-eggplant:   #4c12a1;
  --color-marketing-ink:        #38256d;
  --color-marketing-berry:      #cc1975;

  /* Plus */
  --color-plus-light-purple: #3a1679;
  --color-plus-pop-purple:   #ffffff;

  /* iOS Keypad */
  --color-ioskeypad-surface:         #2e2e2d;
  --color-ioskeypad-keys-primary:    #3d3d3c;
  --color-ioskeypad-keys-secondary:  #1a1919;
  --color-ioskeypad-content:         #ffffff;
  --color-ioskeypad-shadow:          #0f0f0f;

  /* Gradient (solid stops) */
  --color-gradient-on-base-1:      #1a1919;
  --color-gradient-on-base-2:      #0f0f0f;
  --color-gradient-on-elevated-1:  #1a1919;
  --color-gradient-on-elevated-2:  #0a0a0a;
  --color-gradient-coach-mark-1:   #32b7d9;
  --color-gradient-coach-mark-2:   #87d6ed;
  --color-gradient-sub-1:          #003951;
  --color-gradient-sub-2:          #002c40;
}
```

---

## Bootstrap: React Native / Expo

Save this file as `pacificTokens.ts` in your project root, then import `pacificLight` or `pacificDark` anywhere you need colors.

```typescript
// pacificTokens.ts
// Pacific Design System color tokens for React Native / Expo
// Source: sofi_design_system_tokens
//
// Usage:
//   import { useColorScheme } from 'react-native';
//   import { pacificLight, pacificDark } from './pacificTokens';
//   const colors = useColorScheme() === 'dark' ? pacificDark : pacificLight;
//   <View style={{ backgroundColor: colors.surfaceBase }} />

export interface PacificTokens {
  // Content
  contentPrimaryDefault: string;
  contentPrimaryInverse: string;
  contentOnLight: string;
  contentOnDark: string;
  contentDisabled: string;
  contentDisabled2: string;
  contentSecondary: string;
  contentHint: string;
  contentBrand: string;
  contentLinkPrimary: string;
  contentLinkSecondary: string;
  contentInfo: string;
  contentTip: string;
  contentSuccess: string;
  contentSuccessEmphasized: string;
  contentCaution: string;
  contentCautionOnDark: string;
  contentDanger: string;
  contentDangerEmphasized: string;
  contentPositive: string;
  contentNegative: string;
  contentIndicatorSelected: string;
  contentIndicatorCaution: string;
  contentIndicatorFair: string;
  contentIndicatorError: string;
  contentIndicatorErrorHover: string;
  contentIndicatorErrorPressed: string;
  contentIndicatorSelectedInverse: string;
  contentIndicatorUnselected: string;
  contentIndicatorHover: string;
  contentIndicatorDisabled: string;
  contentStatusBar: string;
  // Surface
  surfaceBase: string;
  surfaceElevatedDefault: string;
  surfaceElevatedUnselected: string;
  surfaceElevatedSelected: string;
  surfaceElevatedDisabled: string;
  surfaceElevatedDisabledEmphasized: string;
  surfaceBottomSheet: string;
  surfaceIndicatorSelected: string;
  surfaceIndicatorSelectedSecondary: string;
  surfaceIndicatorSelectedBrand: string;
  surfaceIndicatorUnselected: string;
  surfaceIndicatorUnselectedHover: string;
  surfaceIndicatorDisabled: string;
  surfaceIndicatorRange: string;
  surfaceInfoLabel: string;
  surfaceInfoDefault: string;
  surfaceTipDefault: string;
  surfaceNeutral: string;
  surfaceToast: string;
  surfaceSuccessDefault: string;
  surfaceCautionDefault: string;
  surfaceCautionEmphasize: string;
  surfaceDangerDefault: string;
  surfaceDangerEmphasize: string;
  surfaceAlert: string;
  surfacePositiveDefault: string;
  surfacePositiveDiminish: string;
  surfaceNegativeDefault: string;
  surfaceNegativeDiminish: string;
  surfaceSub: string;
  surfaceSubDark: string;
  surfaceSubCrypto: string;
  surfaceSubError: string;
  surfaceSwitchSelected: string;
  surfaceSwitchUnselected: string;
  surfaceSwitchUnselectedHover: string;
  // Stroke
  strokeBrand: string;
  strokeIndicatorHover: string;
  strokeIndicatorSelected: string;
  strokeIndicatorPressed: string;
  strokeIndicatorError: string;
  strokeIndicatorErrorHover: string;
  strokeIndicatorErrorPressed: string;
  strokeIndicatorUnselectedDefault: string;
  strokeIndicatorCaution: string;
  strokeOnDark: string;
  strokePositiveDefault: string;
  strokeNegativeDefault: string;
  // Button
  buttonBrandDefault: string;
  buttonBrandDefaultInverse: string;
  buttonBrandInverse: string;
  buttonBrandDisabled: string;
  buttonBrandDisabled2: string;
  buttonBrandHover: string;
  buttonBrandPressed: string;
  buttonDestructiveDefault: string;
  buttonDestructiveDisabled: string;
  buttonDestructiveDisabled2: string;
  buttonDestructiveHover: string;
  buttonDestructivePressed: string;
  buttonDestructiveInverse: string;
  buttonOnDark: string;
  buttonOnDarkInverse: string;
  buttonNeutralDefault: string;
  buttonNeutralDisabled: string;
  buttonNeutralHover: string;
  buttonNeutralPressed: string;
  buttonTip: string;
  buttonTipHover: string;
  buttonCaution: string;
  buttonCautionHover: string;
  buttonDangerEmphasized: string;
  buttonDangerEmphasizedHover: string;
  buttonSuccess: string;
  buttonSuccessHover: string;
  buttonInvestPositiveDefault: string;
  buttonInvestPositiveHover: string;
  buttonInvestPositivePressed: string;
  buttonInvestPositiveSelected: string;
  buttonInvestNeutralDefault: string;
  buttonInvestNeutralHover: string;
  buttonInvestNeutralPressed: string;
  buttonInvestNeutralSelected: string;
  buttonInvestNegativeDefault: string;
  buttonInvestNegativeHover: string;
  buttonInvestNegativePressed: string;
  buttonInvestNegativeSelected: string;
  // Marketing
  marketingWhite: string;
  marketingBone: string;
  marketingSofiBlue: string;
  marketingEggplant: string;
  marketingInk: string;
  marketingBerry: string;
  // Plus
  plusLightPurple: string;
  plusPopPurple: string;
}

export const pacificLight: PacificTokens = {
  // Content
  contentPrimaryDefault:          '#1a1919',
  contentPrimaryInverse:          '#ffffff',
  contentOnLight:                 '#1a1919',
  contentOnDark:                  '#ffffff',
  contentDisabled:                '#dbdad7',
  contentDisabled2:               '#bdbbb9',
  contentSecondary:               '#706f6e',
  contentHint:                    '#dbdad7',
  contentBrand:                   '#00a2c7',
  contentLinkPrimary:             '#1a1919',
  contentLinkSecondary:           '#00a2c7',
  contentInfo:                    '#1a1919',
  contentTip:                     '#006280',
  contentSuccess:                 '#1bc245',
  contentSuccessEmphasized:       '#19a623',
  contentCaution:                 '#8c6914',
  contentCautionOnDark:           '#ffcc00',
  contentDanger:                  '#fa2d25',
  contentDangerEmphasized:        '#cd251e',
  contentPositive:                '#1bc245',
  contentNegative:                '#fa2d25',
  contentIndicatorSelected:       '#1a1919',
  contentIndicatorCaution:        '#8c6914',
  contentIndicatorFair:           '#fd972e',
  contentIndicatorError:          '#fa2d25',
  contentIndicatorErrorHover:     '#cd251e',
  contentIndicatorErrorPressed:   '#a01d18',
  contentIndicatorSelectedInverse:'#ffffff',
  contentIndicatorUnselected:     '#5c5b5a',
  contentIndicatorHover:          '#1a1919',
  contentIndicatorDisabled:       '#dbdad7',
  contentStatusBar:               '#0a0a0a',
  // Surface
  surfaceBase:                        '#faf8f5',
  surfaceElevatedDefault:             '#ffffff',
  surfaceElevatedUnselected:          '#ffffff',
  surfaceElevatedSelected:            '#1a1919',
  surfaceElevatedDisabled:            '#f0eeeb',
  surfaceElevatedDisabledEmphasized:  '#dbdad7',
  surfaceBottomSheet:                 '#faf8f5',
  surfaceIndicatorSelected:           '#1a1919',
  surfaceIndicatorSelectedSecondary:  '#706f6e',
  surfaceIndicatorSelectedBrand:      '#00a2c7',
  surfaceIndicatorUnselected:         '#dbdad7',
  surfaceIndicatorUnselectedHover:    '#cccac8',
  surfaceIndicatorDisabled:           '#f0eeeb',
  surfaceIndicatorRange:              '#f0eeeb',
  surfaceInfoLabel:                   '#f5f3f0',
  surfaceInfoDefault:                 '#f0eeeb',
  surfaceTipDefault:                  '#edf8fc',
  surfaceNeutral:                     '#00a2c7',
  surfaceToast:                       '#0f0f0f',
  surfaceSuccessDefault:              '#ebf9ee',
  surfaceCautionDefault:              '#fff5e5',
  surfaceCautionEmphasize:            '#ffcc00',
  surfaceDangerDefault:               '#ffe5e5',
  surfaceDangerEmphasize:             '#cd251e',
  surfaceAlert:                       '#fa2d25',
  surfacePositiveDefault:             '#1bc245',
  surfacePositiveDiminish:            '#ebf9ee',
  surfaceNegativeDefault:             '#fa2d25',
  surfaceNegativeDiminish:            '#ffe5e5',
  surfaceSub:                         '#00a2c7',
  surfaceSubDark:                     '#004661',
  surfaceSubCrypto:                   '#00a2c7',
  surfaceSubError:                    '#004661',
  surfaceSwitchSelected:              '#ffffff',
  surfaceSwitchUnselected:            '#f0eeeb',
  surfaceSwitchUnselectedHover:       '#e5e4e1',
  // Stroke
  strokeBrand:                        '#00a2c7',
  strokeIndicatorHover:               '#1a1919',
  strokeIndicatorSelected:            '#1a1919',
  strokeIndicatorPressed:             '#1a1919',
  strokeIndicatorError:               '#fa2d25',
  strokeIndicatorErrorHover:          '#cd251e',
  strokeIndicatorErrorPressed:        '#a01d18',
  strokeIndicatorUnselectedDefault:   '#dbdad7',
  strokeIndicatorCaution:             '#8c6914',
  strokeOnDark:                       '#ffffff',
  strokePositiveDefault:              '#1bc245',
  strokeNegativeDefault:              '#fa2d25',
  // Button
  buttonBrandDefault:             '#00a2c7',
  buttonBrandDefaultInverse:      '#32b7d9',
  buttonBrandInverse:             '#ffffff',
  buttonBrandDisabled:            '#f0eeeb',
  buttonBrandDisabled2:           '#bdbbb9',
  buttonBrandHover:               '#0080a3',
  buttonBrandPressed:             '#006280',
  buttonDestructiveDefault:       '#fa2d25',
  buttonDestructiveDisabled:      '#ffd7d6',
  buttonDestructiveDisabled2:     '#fda7a4',
  buttonDestructiveHover:         '#cd251e',
  buttonDestructivePressed:       '#a01d18',
  buttonDestructiveInverse:       '#ffffff',
  buttonOnDark:                   '#ffffff',
  buttonOnDarkInverse:            '#0a0a0a',
  buttonNeutralDefault:           '#1a1919',
  buttonNeutralDisabled:          '#dbdad7',
  buttonNeutralHover:             '#3d3d3c',
  buttonNeutralPressed:           '#0a0a0a',
  buttonTip:                      '#006280',
  buttonTipHover:                 '#005471',
  buttonCaution:                  '#8c6914',
  buttonCautionHover:             '#6c5518',
  buttonDangerEmphasized:         '#cd251e',
  buttonDangerEmphasizedHover:    '#a01d18',
  buttonSuccess:                  '#19a623',
  buttonSuccessHover:             '#178a00',
  buttonInvestPositiveDefault:    '#1bc245',
  buttonInvestPositiveHover:      '#19a623',
  buttonInvestPositivePressed:    '#157206',
  buttonInvestPositiveSelected:   '#1bc245',
  buttonInvestNeutralDefault:     '#706f6e',
  buttonInvestNeutralHover:       '#5c5b5a',
  buttonInvestNeutralPressed:     '#3d3d3c',
  buttonInvestNeutralSelected:    '#858482',
  buttonInvestNegativeDefault:    '#fa2d25',
  buttonInvestNegativeHover:      '#cd251e',
  buttonInvestNegativePressed:    '#a01d18',
  buttonInvestNegativeSelected:   '#fa2d25',
  // Marketing
  marketingWhite:     '#ffffff',
  marketingBone:      '#faf8f5',
  marketingSofiBlue:  '#00a2c7',
  marketingEggplant:  '#4c12a1',
  marketingInk:       '#38256d',
  marketingBerry:     '#cc1975',
  // Plus
  plusLightPurple: '#f3f2ff',
  plusPopPurple:   '#5c26bd',
};

export const pacificDark: PacificTokens = {
  // Content
  contentPrimaryDefault:          '#faf8f5',
  contentPrimaryInverse:          '#0a0a0a',
  contentOnLight:                 '#1a1919',
  contentOnDark:                  '#ffffff',
  contentDisabled:                '#3d3d3c',
  contentDisabled2:               '#1a1919',
  contentSecondary:               '#858482',
  contentHint:                    '#858482',
  contentBrand:                   '#32b7d9',
  contentLinkPrimary:             '#faf8f5',
  contentLinkSecondary:           '#32b7d9',
  contentInfo:                    '#faf8f5',
  contentTip:                     '#65cae5',
  contentSuccess:                 '#1bc245',
  contentSuccessEmphasized:       '#1bc245',
  contentCaution:                 '#ffcc00',
  contentCautionOnDark:           '#ffcc00',
  contentDanger:                  '#fa2d25',
  contentDangerEmphasized:        '#fa2d25',
  contentPositive:                '#1bc245',
  contentNegative:                '#fa2d25',
  contentIndicatorSelected:       '#faf8f5',
  contentIndicatorCaution:        '#ffcc00',
  contentIndicatorFair:           '#feaa24',
  contentIndicatorError:          '#fa2d25',
  contentIndicatorErrorHover:     '#cd251e',
  contentIndicatorErrorPressed:   '#a01d18',
  contentIndicatorSelectedInverse:'#0a0a0a',
  contentIndicatorUnselected:     '#999896',
  contentIndicatorHover:          '#faf8f5',
  contentIndicatorDisabled:       '#2e2e2d',
  contentStatusBar:               '#ffffff',
  // Surface
  surfaceBase:                        '#0a0a0a',
  surfaceElevatedDefault:             '#1a1919',
  surfaceElevatedUnselected:          '#1a1919',
  surfaceElevatedSelected:            '#ffffff',
  surfaceElevatedDisabled:            '#2e2e2d',
  surfaceElevatedDisabledEmphasized:  '#4d4c4b',
  surfaceBottomSheet:                 '#1a1919',
  surfaceIndicatorSelected:           '#faf8f5',
  surfaceIndicatorSelectedSecondary:  '#858482',
  surfaceIndicatorSelectedBrand:      '#32b7d9',
  surfaceIndicatorUnselected:         '#2e2e2d',
  surfaceIndicatorUnselectedHover:    '#4d4c4b',
  surfaceIndicatorDisabled:           '#2e2e2d',
  surfaceIndicatorRange:              '#141414',
  surfaceInfoLabel:                   '#242323',
  surfaceInfoDefault:                 '#242323',
  surfaceTipDefault:                  '#002638',
  surfaceNeutral:                     '#32b7d9',
  surfaceToast:                       '#3d3d3c',
  surfaceSuccessDefault:              '#102916',
  surfaceCautionDefault:              '#353320',
  surfaceCautionEmphasize:            '#ffcc00',
  surfaceDangerDefault:               '#352120',
  surfaceDangerEmphasize:             '#fa2d25',
  surfaceAlert:                       '#fa2d25',
  surfacePositiveDefault:             '#1bc245',
  surfacePositiveDiminish:            '#102916',
  surfaceNegativeDefault:             '#fa2d25',
  surfaceNegativeDiminish:            '#352120',
  surfaceSub:                         '#001722',
  surfaceSubDark:                     '#0a0a0a',
  surfaceSubCrypto:                   '#0a0a0a',
  surfaceSubError:                    '#002638',
  surfaceSwitchSelected:              '#2e2e2d',
  surfaceSwitchUnselected:            '#242323',
  surfaceSwitchUnselectedHover:       '#1a1919',
  // Stroke
  strokeBrand:                        '#32b7d9',
  strokeIndicatorHover:               '#faf8f5',
  strokeIndicatorSelected:            '#faf8f5',
  strokeIndicatorPressed:             '#faf8f5',
  strokeIndicatorError:               '#fa2d25',
  strokeIndicatorErrorHover:          '#cd251e',
  strokeIndicatorErrorPressed:        '#a01d18',
  strokeIndicatorUnselectedDefault:   '#2e2e2d',
  strokeIndicatorCaution:             '#ffcc00',
  strokeOnDark:                       '#faf8f5',
  strokePositiveDefault:              '#1bc245',
  strokeNegativeDefault:              '#fa2d25',
  // Button
  buttonBrandDefault:             '#32b7d9',
  buttonBrandDefaultInverse:      '#32b7d9',
  buttonBrandInverse:             '#0a0a0a',
  buttonBrandDisabled:            '#2e2e2d',
  buttonBrandDisabled2:           '#1a1919',
  buttonBrandHover:               '#00a2c7',
  buttonBrandPressed:             '#0080a3',
  buttonDestructiveDefault:       '#fa2d25',
  buttonDestructiveDisabled:      '#352120',
  buttonDestructiveDisabled2:     '#731511',
  buttonDestructiveHover:         '#cd251e',
  buttonDestructivePressed:       '#a01d18',
  buttonDestructiveInverse:       '#0a0a0a',
  buttonOnDark:                   '#ffffff',
  buttonOnDarkInverse:            '#0a0a0a',
  buttonNeutralDefault:           '#faf8f5',
  buttonNeutralDisabled:          '#3d3d3c',
  buttonNeutralHover:             '#cccac8',
  buttonNeutralPressed:           '#ffffff',
  buttonTip:                      '#0080a3',
  buttonTipHover:                 '#006280',
  buttonCaution:                  '#ffcc00',
  buttonCautionHover:             '#f2c102',
  buttonDangerEmphasized:         '#fa2d25',
  buttonDangerEmphasizedHover:    '#cd251e',
  buttonSuccess:                  '#1bc245',
  buttonSuccessHover:             '#19a623',
  buttonInvestPositiveDefault:    '#1bc245',
  buttonInvestPositiveHover:      '#19a623',
  buttonInvestPositivePressed:    '#157206',
  buttonInvestPositiveSelected:   '#1bc245',
  buttonInvestNeutralDefault:     '#706f6e',
  buttonInvestNeutralHover:       '#5c5b5a',
  buttonInvestNeutralPressed:     '#3d3d3c',
  buttonInvestNeutralSelected:    '#858482',
  buttonInvestNegativeDefault:    '#fa2d25',
  buttonInvestNegativeHover:      '#cd251e',
  buttonInvestNegativePressed:    '#a01d18',
  buttonInvestNegativeSelected:   '#fa2d25',
  // Marketing
  marketingWhite:     '#1a1919',
  marketingBone:      '#0a0a0a',
  marketingSofiBlue:  '#32b7d9',
  marketingEggplant:  '#4c12a1',
  marketingInk:       '#38256d',
  marketingBerry:     '#cc1975',
  // Plus
  plusLightPurple: '#3a1679',
  plusPopPurple:   '#ffffff',
};

// Primitive colors — raw values, use sparingly.
// Prefer semantic tokens above for all UI work.
export const pacificPrimitives = {
  bone0: '#ffffff',   bone50: '#faf8f5',  bone100: '#f5f3f0', bone150: '#f0eeeb',
  bone200: '#e5e4e1', bone250: '#dbdad7', bone300: '#cccac8', bone350: '#bdbbb9',
  bone400: '#adacaa', bone450: '#999896', bone500: '#858482', bone550: '#706f6e',
  bone600: '#5c5b5a', bone650: '#4d4c4b', bone700: '#3d3d3c', bone750: '#2e2e2d',
  bone800: '#242323', bone850: '#1a1919', bone900: '#141414', bone950: '#0f0f0f',
  bone1000: '#0a0a0a',
  blue50: '#edf8fc',  blue100: '#e5f6fc', blue150: '#def5fc', blue200: '#d6f3fc',
  blue250: '#c1ebf9', blue300: '#ade4f5', blue350: '#98dcf2', blue400: '#87d6ed',
  blue450: '#65cae5', blue500: '#32b7d9', blue550: '#00a2c7', blue600: '#0080a3',
  blue650: '#006280', blue700: '#005471', blue750: '#004661', blue800: '#003951',
  blue850: '#002c40', blue900: '#002638', blue950: '#001e2d', blue1000: '#001722',
  red50: '#ffe5e5',   red150: '#ffd7d6',  red350: '#fda7a4',  red450: '#fc7c77',
  red550: '#fb4a43',  red600: '#fa2d25',  red650: '#cd251e',  red700: '#a01d18',
  red800: '#731511',  red850: '#352120',
  green50: '#ebf9ee', green450: '#63d580', green550: '#1bc245', green600: '#19a623',
  green650: '#178a00', green700: '#157206', green900: '#102916',
  yellow50: '#fff5e5', yellow250: '#ffdc5c', yellow350: '#ffcc00', yellow400: '#f2c102',
  yellow600: '#8c6914', yellow650: '#6c5518', yellow800: '#353320',
  mktgEggplant: '#4c12a1', mktgInk: '#38256d', mktgBerry: '#cc1975',
  plusLightPurple: '#f3f2ff', plusDarkPurple: '#3a1679', plusPopPurple: '#5c26bd',
  crypto400: '#8a5aad', orangeFair: '#fd972e', orangeFairOnDark: '#feaa24',
} as const;
```

---

## Colors not in the Pacific palette

When a color has no exact match, a delta (Δ) score shows how far off it is:

| Delta | What it likely means | What to do |
|---|---|---|
| Δ < 5 | Rounding from Figma or your design tool export | Safe to swap for the closest suggested token |
| Δ 5–20 | Close but possibly intentional | Check with the designer before replacing |
| Δ > 20 | Genuinely off-palette | Flag for design review — don't use a token silently |

---

## Full token reference

All 181 Pacific semantic tokens with their light and dark primitive values. Use this table to look up any token name and see exactly what color it resolves to in each theme — useful when you want to verify a color is right for your design, or when building a custom theme.

The **primitive name** (e.g. `bone850`, `blue550`) is an internal name for the raw color value. When coding, always use the **semantic token name** (left column), never the primitive name directly.

### Sourced from `sofi_design_system_tokens`

A full semantic→primitive mapping for both light and dark themes. Sourced from `sofi_design_system_tokens`.

### Marketing

| Token | Light primitive | Dark primitive |
|---|---|---|
| `marketingWhite` | bone0 | bone850 |
| `marketingBone` | bone50 | bone1000 |
| `marketingSofiBlue` | blue550 | blue500 |
| `marketingEggplant` | mktgEggplant | mktgEggplant |
| `marketingInk` | mktgInk | mktgInk |
| `marketingBerry` | mktgBerry | mktgBerry |

### Plus

| Token | Light primitive | Dark primitive |
|---|---|---|
| `plusLightPurple` | plusLightPurple | plusDarkPurple |
| `plusPopPurple` | plusPopPurple | bone0 |

### Documentation

| Token | Light primitive | Dark primitive |
|---|---|---|
| `documentationPink` | pink | pink |
| `documentationBlue` | blue | blue |
| `documentationPurple` | purple | purple |
| `documentationGreen` | green | green |

### iOS Keypad

| Token | Light primitive | Dark primitive |
|---|---|---|
| `ioskeypadSurface` | bone250 | bone750 |
| `ioskeypadKeysPrimary` | bone0 | bone700 |
| `ioskeypadKeysSecondary` | bone350 | bone850 |
| `ioskeypadContent` | bone950 | bone0 |
| `ioskeypadShadow` | bone500 | bone950 |

### Stroke

| Token | Light primitive | Dark primitive |
|---|---|---|
| `strokeIndicatorHover` | bone850 | bone50 |
| `strokeIndicatorSelected` | bone850 | bone50 |
| `strokeIndicatorPressed` | bone850 | bone50 |
| `strokeIndicatorError` | red600 | red600 |
| `strokeIndicatorErrorHover` | red650 | red650 |
| `strokeIndicatorErrorPressed` | red700 | red700 |
| `strokeIndicatorUnselectedDefault` | bone250 | bone750 |
| `strokeOnDark` | bone0 | bone50 |
| `strokeBrand` | blue550 | blue500 |
| `strokePositiveDefault` | green550 | green550 |
| `strokeNegativeDefault` | red600 | red600 |
| `strokeIndicatorCaution` | yellow600 | yellow350 |
| `strokeDividePrimary` | *(semi-transparent)* | *(semi-transparent)* |

### Button

| Token | Light primitive | Dark primitive |
|---|---|---|
| `buttonBrandDefault` | blue550 | blue500 |
| `buttonBrandDefaultInverse` | blue500 | blue500 |
| `buttonBrandInverse` | bone0 | bone1000 |
| `buttonBrandDisabled` | bone150 | bone750 |
| `buttonBrandDisabled2` | bone350 | bone850 |
| `buttonBrandHover` | blue600 | blue550 |
| `buttonBrandPressed` | blue650 | blue600 |
| `buttonDestructiveDefault` | red600 | red600 |
| `buttonDestructiveDisabled` | red150 | red850 |
| `buttonDestructiveDisabled2` | red350 | red800 |
| `buttonDestructiveHover` | red650 | red650 |
| `buttonDestructivePressed` | red700 | red700 |
| `buttonDestructiveInverse` | bone0 | bone1000 |
| `buttonOnDark` | bone0 | bone0 |
| `buttonOnDarkInverse` | bone1000 | bone1000 |
| `buttonNeutralDefault` | bone850 | bone50 |
| `buttonNeutralDisabled` | bone250 | bone700 |
| `buttonNeutralHover` | bone700 | bone300 |
| `buttonNeutralPressed` | bone1000 | bone0 |
| `buttonTip` | blue650 | blue600 |
| `buttonTipHover` | blue700 | blue650 |
| `buttonCaution` | yellow600 | yellow350 |
| `buttonCautionHover` | yellow650 | yellow400 |
| `buttonDangerEmphasized` | red650 | red600 |
| `buttonDangerEmphasizedHover` | red700 | red650 |
| `buttonSuccess` | green600 | green550 |
| `buttonSuccessHover` | green650 | green600 |
| `buttonInvestPositiveDefault` | green550 | green550 |
| `buttonInvestPositiveHover` | green600 | green600 |
| `buttonInvestPositivePressed` | green700 | green700 |
| `buttonInvestPositiveSelected` | green550 | green550 |
| `buttonInvestNeutralDefault` | bone550 | bone550 |
| `buttonInvestNeutralHover` | bone600 | bone600 |
| `buttonInvestNeutralPressed` | bone700 | bone700 |
| `buttonInvestNeutralSelected` | bone500 | bone500 |
| `buttonInvestNegativeDefault` | red600 | red600 |
| `buttonInvestNegativeHover` | red650 | red650 |
| `buttonInvestNegativePressed` | red700 | red700 |
| `buttonInvestNegativeSelected` | red600 | red600 |

### Surface

| Token | Light primitive | Dark primitive |
|---|---|---|
| `surfaceSub` | blue550 | blue1000 |
| `surfaceSubDark` | blue750 | bone1000 |
| `surfaceSubCrypto` | blue550 | bone1000 |
| `surfaceSubError` | blue750 | blue900 |
| `surfaceBase` | bone50 | bone1000 |
| `surfaceElevatedDefault` | bone0 | bone850 |
| `surfaceElevatedUnselected` | bone0 | bone850 |
| `surfaceElevatedSelected` | bone850 | bone0 |
| `surfaceElevatedDisabled` | bone150 | bone750 |
| `surfaceElevatedDisabledEmphasized` | bone250 | bone650 |
| `surfaceBottomSheet` | bone50 | bone850 |
| `surfaceIndicatorSelected` | bone850 | bone50 |
| `surfaceIndicatorSelectedSecondary` | bone550 | bone500 |
| `surfaceIndicatorSelectedBrand` | blue550 | blue500 |
| `surfaceIndicatorUnselected` | bone250 | bone750 |
| `surfaceIndicatorUnselectedHover` | bone300 | bone650 |
| `surfaceIndicatorDisabled` | bone150 | bone750 |
| `surfaceIndicatorRange` | bone150 | bone900 |
| `surfaceInfoLabel` | bone100 | *(semi-transparent)* |
| `surfaceInfoDefault` | bone150 | bone800 |
| `surfaceTipDefault` | blue50 | blue900 |
| `surfaceNeutral` | blue550 | blue500 |
| `surfaceToast` | bone950 | bone700 |
| `surfaceSuccessDefault` | green50 | green900 |
| `surfaceCautionDefault` | yellow50 | yellow800 |
| `surfaceCautionEmphasize` | yellow350 | yellow350 |
| `surfaceDangerDefault` | red50 | red850 |
| `surfaceDangerEmphasize` | red650 | red600 |
| `surfaceAlert` | red600 | red600 |
| `surfacePositiveDefault` | green550 | green550 |
| `surfacePositiveDiminish` | green50 | green900 |
| `surfaceNegativeDefault` | red600 | red600 |
| `surfaceNegativeDiminish` | red50 | red850 |
| `surfaceSwitchSelected` | bone0 | bone750 |
| `surfaceSwitchUnselected` | bone150 | bone800 |
| `surfaceSwitchUnselectedHover` | bone200 | bone850 |

### Content

| Token | Light primitive | Dark primitive |
|---|---|---|
| `contentPrimaryDefault` | bone850 | bone50 |
| `contentPrimaryInverse` | bone0 | bone1000 |
| `contentOnLight` | bone850 | bone850 |
| `contentOnDark` | bone0 | bone0 |
| `contentDisabled` | bone250 | bone700 |
| `contentDisabled2` | bone350 | bone850 |
| `contentSecondary` | bone550 | bone500 |
| `contentHint` | bone250 | bone500 |
| `contentBrand` | blue550 | blue500 |
| `contentLinkPrimary` | bone850 | bone50 |
| `contentLinkSecondary` | blue550 | blue500 |
| `contentInfo` | bone850 | bone50 |
| `contentTip` | blue650 | blue450 |
| `contentSuccess` | green550 | green550 |
| `contentSuccessEmphasized` | green600 | green550 |
| `contentCaution` | yellow600 | yellow350 |
| `contentCautionOnDark` | yellow350 | yellow350 |
| `contentDanger` | red600 | red600 |
| `contentDangerEmphasized` | red650 | red600 |
| `contentPositive` | green550 | green550 |
| `contentNegative` | red600 | red600 |
| `contentIndicatorSelected` | bone850 | bone50 |
| `contentIndicatorCaution` | yellow600 | yellow350 |
| `contentIndicatorFair` | orangeFair | orangeFairOnDark |
| `contentIndicatorError` | red600 | red600 |
| `contentIndicatorErrorHover` | red650 | red650 |
| `contentIndicatorErrorPressed` | red700 | red700 |
| `contentIndicatorSelectedInverse` | bone0 | bone1000 |
| `contentIndicatorUnselected` | bone600 | bone450 |
| `contentIndicatorHover` | bone850 | bone50 |
| `contentIndicatorDisabled` | bone250 | bone750 |
| `contentStatusBar` | bone1000 | bone0 |
| `contentChartA` | blue450 | blue450 |
| `contentChartB` | blue600 | blue600 |
| `contentChartC` | blue750 | blue750 |
| `contentChartD` | bone850 | bone250 |
| `contentChartE` | blue550 | blue450 |
| `contentChartF` | blue300 | blue650 |
| `contentChart1` | blue500 | blue500 |
| `contentChart2` | blue600 | blue600 |
| `contentChart3` | crypto400 | crypto400 |
| `contentChart4` | mktgBerry | mktgBerry |
| `contentChart5` | red550 | red550 |
| `contentChart6` | red450 | red450 |
| `contentChart7` | yellow350 | yellow350 |
| `contentChart8` | yellow250 | yellow250 |
| `contentChart9` | green550 | green550 |
| `contentChart10` | green450 | green450 |
| `contentChartDisbursed1` | bone350 | bone800 |
| `contentChartDisbursed2` | bone500 | bone750 |
| `contentChartDisbursed3` | bone650 | bone700 |
| `contentChartDisbursed4` | bone800 | bone650 |
| `contentCryptoCoinShadow` | blue600 | bone800 |

### Gradient

| Token | Light primitive | Dark primitive |
|---|---|---|
| `gradientPlus1` | plus100 | plus400 |
| `gradientPlus2` | plus200 | plus500 |
| `gradientPlus3` | plus300 | plus600 |
| `gradientOnBase1` | bone150 | bone850 |
| `gradientOnBase2` | bone50 | bone950 |
| `gradientOnElevated1` | bone50 | bone850 |
| `gradientOnElevated2` | bone0 | bone1000 |
| `gradientCoachMark1` | blue100 | blue500 |
| `gradientCoachMark2` | blue450 | blue400 |
| `gradientSub1` | blue500 | blue800 |
| `gradientSub2` | blue550 | blue850 |

---

## Hex lookup table

Use this table to look up any hex color and find which Pacific tokens use it. Every solid Pacific primitive is listed here.

### How to read it
- Find your hex value in the table
- The **Light tokens** column lists every semantic token that uses this color in light mode
- The **Dark tokens** column lists every semantic token that uses it in dark mode
- Pick the token that matches what your element *does* (see the cheatsheet above)

### Bone (neutral) scale

| Hex | Primitive | Light tokens | Dark tokens |
|---|---|---|---|
| `#ffffff` | bone0 | marketingWhite · ioskeypadKeysPrimary · strokeOnDark · buttonBrandInverse · buttonDestructiveInverse · buttonOnDark · surfaceElevatedDefault · surfaceElevatedUnselected · surfaceSwitchSelected · contentPrimaryInverse · contentOnDark · contentIndicatorSelectedInverse · gradientOnElevated2 | buttonOnDark · buttonNeutralPressed · surfaceElevatedSelected · contentOnDark · contentStatusBar · ioskeypadContent · plusPopPurple · gradientOnElevated2 |
| `#faf8f5` | bone50 | marketingBone · surfaceBase · surfaceBottomSheet | contentPrimaryDefault · strokeOnDark · strokeIndicatorHover · strokeIndicatorSelected · strokeIndicatorPressed · buttonNeutralDefault · surfaceIndicatorSelected · contentLinkPrimary · contentInfo · contentIndicatorSelected · contentIndicatorHover |
| `#f5f3f0` | bone100 | surfaceInfoLabel | — |
| `#f0eeeb` | bone150 | buttonBrandDisabled · surfaceElevatedDisabled · surfaceIndicatorDisabled · surfaceIndicatorRange · surfaceInfoDefault · surfaceSwitchUnselected · gradientOnBase1 | — |
| `#e5e4e1` | bone200 | surfaceSwitchUnselectedHover | — |
| `#dbdad7` | bone250 | strokeIndicatorUnselectedDefault · ioskeypadSurface · buttonNeutralDisabled · surfaceElevatedDisabledEmphasized · surfaceIndicatorUnselected · contentDisabled · contentHint · contentIndicatorDisabled | contentChartD |
| `#cccac8` | bone300 | surfaceIndicatorUnselectedHover | buttonNeutralHover |
| `#bdbbb9` | bone350 | ioskeypadKeysSecondary · buttonBrandDisabled2 · contentDisabled2 · contentChartDisbursed1 | — |
| `#adacaa` | bone400 | — | — |
| `#999896` | bone450 | — | contentIndicatorUnselected · contentTip |
| `#858482` | bone500 | ioskeypadShadow · contentChartDisbursed2 · buttonInvestNeutralSelected | surfaceIndicatorSelectedSecondary · contentSecondary · contentHint · buttonInvestNeutralSelected |
| `#706f6e` | bone550 | contentSecondary · surfaceIndicatorSelectedSecondary · buttonInvestNeutralDefault | buttonInvestNeutralDefault |
| `#5c5b5a` | bone600 | contentIndicatorUnselected · buttonInvestNeutralHover | buttonInvestNeutralHover |
| `#4d4c4b` | bone650 | contentChartDisbursed3 | surfaceElevatedDisabledEmphasized · surfaceIndicatorUnselectedHover · contentChartDisbursed4 |
| `#3d3d3c` | bone700 | buttonNeutralHover · buttonInvestNeutralPressed | ioskeypadKeysPrimary · buttonNeutralDisabled · buttonInvestNeutralPressed · surfaceElevatedDisabled · surfaceToast · contentDisabled · contentChartDisbursed3 |
| `#2e2e2d` | bone750 | — | ioskeypadSurface · buttonBrandDisabled · surfaceElevatedDisabled · surfaceIndicatorUnselected · surfaceIndicatorDisabled · surfaceSwitchSelected · contentChartDisbursed2 |
| `#242323` | bone800 | contentChartDisbursed4 | surfaceInfoDefault · surfaceSwitchUnselected · contentChartDisbursed1 · contentCryptoCoinShadow |
| `#1a1919` | bone850 | strokeIndicatorHover · strokeIndicatorSelected · strokeIndicatorPressed · buttonNeutralDefault · surfaceElevatedSelected · surfaceIndicatorSelected · contentPrimaryDefault · contentOnLight · contentLinkPrimary · contentInfo · contentIndicatorSelected · contentIndicatorHover · contentChartD | marketingWhite · ioskeypadKeysSecondary · buttonBrandDisabled2 · surfaceElevatedDefault · surfaceElevatedUnselected · surfaceBottomSheet · gradientOnBase1 · gradientOnElevated1 · contentDisabled2 · surfaceSwitchUnselectedHover · contentOnLight |
| `#141414` | bone900 | — | surfaceIndicatorRange |
| `#0f0f0f` | bone950 | ioskeypadContent · surfaceToast | ioskeypadShadow · gradientOnBase2 |
| `#0a0a0a` | bone1000 | buttonOnDarkInverse · buttonNeutralPressed · contentStatusBar | marketingBone · buttonBrandInverse · buttonDestructiveInverse · buttonOnDarkInverse · surfaceBase · surfaceSubCrypto · surfaceSubDark · gradientOnElevated2 · contentPrimaryInverse · contentIndicatorSelectedInverse |

### Blue scale

| Hex | Primitive | Light tokens | Dark tokens |
|---|---|---|---|
| `#edf8fc` | blue50 | surfaceTipDefault | — |
| `#e5f6fc` | blue100 | gradientCoachMark1 | — |
| `#ade4f5` | blue300 | contentChartF | — |
| `#87d6ed` | blue400 | gradientCoachMark2 | gradientCoachMark2 |
| `#65cae5` | blue450 | contentChartA · gradientCoachMark2 | contentChartA · contentChartE · contentTip |
| `#32b7d9` | blue500 | buttonBrandDefaultInverse · gradientSub1 · contentChart1 | marketingSofiBlue · strokeBrand · buttonBrandDefault · buttonBrandDefaultInverse · gradientCoachMark1 · gradientSub1 · surfaceIndicatorSelectedBrand · surfaceNeutral · contentBrand · contentLinkSecondary · contentChart1 |
| `#00a2c7` | blue550 | marketingSofiBlue · strokeBrand · buttonBrandDefault · surfaceSub · surfaceSubCrypto · surfaceIndicatorSelectedBrand · surfaceNeutral · gradientSub2 · contentBrand · contentLinkSecondary · contentChartE | buttonBrandHover |
| `#0080a3` | blue600 | buttonBrandHover · contentChartB · contentChart2 · contentCryptoCoinShadow | buttonBrandPressed · buttonTip · contentChartB · contentChart2 |
| `#006280` | blue650 | buttonBrandPressed · buttonTip · contentTip | buttonTipHover · contentChartF |
| `#005471` | blue700 | buttonTipHover | — |
| `#004661` | blue750 | surfaceSubDark · surfaceSubError · contentChartC | contentChartC |
| `#003951` | blue800 | — | gradientSub1 |
| `#002c40` | blue850 | — | gradientSub2 |
| `#002638` | blue900 | — | surfaceTipDefault · surfaceSubError |
| `#001722` | blue1000 | — | surfaceSub |

### Red scale

| Hex | Primitive | Light tokens | Dark tokens |
|---|---|---|---|
| `#ffe5e5` | red50 | surfaceDangerDefault · surfaceNegativeDiminish | — |
| `#ffd7d6` | red150 | buttonDestructiveDisabled | — |
| `#fda7a4` | red350 | buttonDestructiveDisabled2 | — |
| `#fc7c77` | red450 | contentChart6 | contentChart6 |
| `#fb4a43` | red550 | contentChart5 | contentChart5 |
| `#fa2d25` | red600 | strokeIndicatorError · strokeNegativeDefault · buttonDestructiveDefault · buttonInvestNegativeDefault · buttonInvestNegativeSelected · surfaceAlert · surfaceNegativeDefault · contentDanger · contentNegative · contentIndicatorError | strokeIndicatorError · strokeNegativeDefault · buttonDestructiveDefault · buttonDangerEmphasized · buttonInvestNegativeDefault · buttonInvestNegativeSelected · surfaceAlert · surfaceDangerEmphasize · surfaceNegativeDefault · contentDanger · contentDangerEmphasized · contentNegative · contentIndicatorError |
| `#cd251e` | red650 | strokeIndicatorErrorHover · buttonDestructiveHover · buttonDangerEmphasized · surfaceDangerEmphasize · contentDangerEmphasized · contentIndicatorErrorHover | strokeIndicatorErrorHover · buttonDestructiveHover · buttonDangerEmphasizedHover · contentIndicatorErrorHover |
| `#a01d18` | red700 | strokeIndicatorErrorPressed · buttonDestructivePressed · buttonDangerEmphasizedHover · buttonInvestNegativePressed · contentIndicatorErrorPressed | strokeIndicatorErrorPressed · buttonDestructivePressed · buttonInvestNegativePressed · contentIndicatorErrorPressed |
| `#731511` | red800 | — | buttonDestructiveDisabled2 |
| `#352120` | red850 | — | buttonDestructiveDisabled · surfaceDangerDefault · surfaceNegativeDiminish |

### Green scale

| Hex | Primitive | Light tokens | Dark tokens |
|---|---|---|---|
| `#ebf9ee` | green50 | surfaceSuccessDefault · surfacePositiveDiminish | — |
| `#63d580` | green450 | contentChart10 | contentChart10 |
| `#1bc245` | green550 | strokePositiveDefault · buttonInvestPositiveDefault · buttonInvestPositiveSelected · surfacePositiveDefault · contentSuccess · contentPositive · contentChart9 | strokePositiveDefault · buttonSuccess · buttonInvestPositiveDefault · buttonInvestPositiveSelected · surfacePositiveDefault · contentSuccess · contentSuccessEmphasized · contentPositive · contentChart9 |
| `#19a623` | green600 | buttonSuccess · buttonInvestPositiveHover · contentSuccessEmphasized | buttonInvestPositiveHover · buttonSuccessHover |
| `#178a00` | green650 | buttonSuccessHover | — |
| `#157206` | green700 | buttonInvestPositivePressed | buttonInvestPositivePressed |
| `#102916` | green900 | — | surfaceSuccessDefault · surfacePositiveDiminish |

### Yellow scale

| Hex | Primitive | Light tokens | Dark tokens |
|---|---|---|---|
| `#fff5e5` | yellow50 | surfaceCautionDefault | — |
| `#ffdc5c` | yellow250 | contentChart8 | contentChart8 |
| `#ffcc00` | yellow350 | surfaceCautionEmphasize · contentCautionOnDark · contentChart7 | strokeIndicatorCaution · buttonCaution · surfaceCautionEmphasize · contentCaution · contentCautionOnDark · contentIndicatorCaution · contentChart7 |
| `#f2c102` | yellow400 | — | buttonCautionHover |
| `#8c6914` | yellow600 | strokeIndicatorCaution · buttonCaution · contentCaution · contentIndicatorCaution | — |
| `#6c5518` | yellow650 | buttonCautionHover | — |
| `#353320` | yellow800 | — | surfaceCautionDefault |

### Marketing, brand, and special

| Hex | Primitive | Light tokens | Dark tokens |
|---|---|---|---|
| `#4c12a1` | mktgEggplant | marketingEggplant | marketingEggplant |
| `#38256d` | mktgInk | marketingInk | marketingInk |
| `#cc1975` | mktgBerry | marketingBerry · contentChart4 | marketingBerry · contentChart4 |
| `#f3f2ff` | plusLightPurple | plusLightPurple | — |
| `#3a1679` | plusDarkPurple | — | plusLightPurple |
| `#5c26bd` | plusPopPurple | plusPopPurple | — |
| `#8a5aad` | crypto400 | contentChart3 | contentChart3 |
| `#fd972e` | orangeFair | contentIndicatorFair | — |
| `#feaa24` | orangeFairOnDark | — | contentIndicatorFair |

---

## —— AI INSTRUCTIONS (internal — users can ignore this section) ——

When the user asks about Pacific colors, the primary behavior is to **answer from the embedded tables** — no file scanning needed unless the user explicitly asks to scan a file or folder.

**Priority order for answering:**
1. If the user describes what they're building → use the "Which token should I use?" table
2. If the user provides a hex, rgba, or Flutter `Color()` → look up in the Hex lookup table
3. If the user provides a Figma URL → follow the Figma MCP workflow (Step 0)
4. If the user asks to scan a file or folder → use Steps 1–4

**Platform detection for bootstrap requests:**
- User mentions **React Native**, **Expo**, `StyleSheet`, or `useColorScheme` → output the `pacificTokens.ts` file from the "Bootstrap: React Native / Expo" section
- User mentions **web**, **React** (browser), **Next.js**, **HTML**, **CSS**, **Tailwind**, or **Replit** (without React Native) → output the `pacific-tokens.css` file from the "Bootstrap: ready-to-paste CSS" section
- User mentions **Flutter** → refer them to `sofi_design_system` package; the tokens are built in
- If unclear, ask: *"Is this for a web app (React, HTML) or a React Native / Expo app?"*

---

### Step 0 — If the user provides a Figma URL, use the Figma MCP

When the user provides a URL matching `figma.com/design/:fileKey/...?node-id=:nodeId`:

1. **Parse** the file key and node ID from the URL
2. **Fetch** the design context:
   ```
   get_design_context(fileKey=":fileKey", nodeId=":nodeId")
   ```
3. **Extract all color values** from the response. Look for these fields in the JSON:
   - `fills[].color` — layer fill colors
   - `strokes[].color` — stroke/border colors
   - `backgroundColor` — frame or group backgrounds
   - `effects[].color` — shadows and glows
4. **Check for Figma variable bindings first.** If a fill has a `boundVariables.color` property, inspect the variable name. If the variable name matches a Pacific token (e.g. `contentBrand`, `surfaceBase`), use that token directly — no hex lookup needed.
5. **For raw color values**, convert Figma's float RGBA format to hex (see Step 2) and proceed with the lookup.
6. **Also fetch a screenshot** for context: `get_screenshot(fileKey=":fileKey", nodeId=":nodeId")`

**If `get_design_context` is not available**, ask the user to paste hex values manually or share the Figma MCP output as text.

---

### Step 1 — Find all color references in project files

Search the file(s) for color references using these regex patterns:

```
# Flutter / Dart
Color\(0x[0-9a-fA-F]{8}\)

# Hex (CSS, Figma exports, etc.)
#[0-9a-fA-F]{6}\b

# CSS rgba / rgb
rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+
```

---

### Step 2 — Normalize each color value to 6-char lowercase hex

| Input format | How to normalize |
|---|---|
| `Color(0xffRRGGBB)` | Drop the first two chars (alpha), take the 6 RGB chars |
| `Color(0xAARRGGBB)` | Drop the first two chars, take the 6 RGB chars |
| `#RRGGBB` | Strip `#`, lowercase |
| `#RGB` | Expand each digit: `#ABC` → `#aabbcc` |
| `rgba(R, G, B, A)` | Convert R/G/B 0–255 ints to hex: `R=0,G=162,B=199` → `00a2c7` |
| **Figma float RGBA** `{r: 0–1, g: 0–1, b: 0–1, a: 0–1}` | Multiply each by 255, round, convert to 2-char hex. Example: `{r:0, g:0.635, b:0.780}` → `round(0×255)=0` → `00`, `round(0.635×255)=162` → `a2`, `round(0.780×255)=199` → `c7` → `00a2c7` |

---

### Step 3 — Look up each hex in the table above

Find the hex in the **Hex lookup table**. Each row shows the primitive name and all semantic tokens that use it in light and dark mode.

**If no exact match:** Report the three closest rows by approximate visual distance with a Δ score. Δ < 5 is likely a rounding artifact from Figma's float precision; Δ > 20 needs design review.

---

### Step 4 — Present the results

**For Figma MCP results**, group by layer name and include the visual context from the screenshot:

```
Frame: "Card / Default"
─────────────────────────────────
Background fill
  #faf8f5  →  bone50  →  surfaceBase  (page/card background)
  → React Native: colors.surfaceBase
  → React Web CSS: var(--color-surface-base)

Title text "Get started"
  #1a1919  →  bone850  →  contentPrimaryDefault  (primary body text)
  → React Native: colors.contentPrimaryDefault
  → React Web CSS: var(--color-content-primary-default)

CTA button fill
  #00a2c7  →  blue550  →  buttonBrandDefault  (primary brand button)
  → React Native: colors.buttonBrandDefault
  → React Web CSS: var(--color-button-brand-default)

Icon stroke
  #00a2c7  →  blue550  →  strokeBrand or contentBrand
  → React Native: colors.strokeBrand  (border/outline)  or  colors.contentBrand  (icon fill)
  → React Web CSS: var(--color-stroke-brand)  or  var(--color-content-brand)
```

**For file scan results**, group by file:

```
lib/widgets/card.dart
─────────────────────────────────
#00a2c7  (blue550)  ×3  — lines 12, 45, 78
  Light tokens:  buttonBrandDefault · contentBrand · strokeBrand · surfaceNeutral
  Dark tokens:   buttonBrandHover
  Suggested:     colors.contentBrand  (brand-colored icon or text)

#ff3300  ⚠ Not in Pacific palette  ×1  — line 34
  Closest:  red600 (#fa2d25, Δ 8.3)  →  contentDanger · buttonDestructiveDefault
```

Always end with a summary: total unique colors found, how many matched the Pacific palette, how many need design review.

---

### Step 5 — Check for an existing color library; create one if missing

After presenting token mapping results, check whether the project already has a Pacific-compatible color library.

**Detection — search the project for:**
- Files named `colors.js`, `colors.ts`, `tokens.js`, `tokens.ts`, `theme.js`, `theme.ts`, `palette.js/ts`, `pacificTokens.ts`
- Files inside `src/styles/`, `src/theme/`, `src/tokens/`, `src/constants/`
- CSS files containing `:root {` with `--color-` custom properties
- Any file exporting a `colors` or `tokens` object with hex values

**If an existing library is found:**
Tell the user which variable name to use, e.g.:
> `contentBrand` is `--color-content-brand` in CSS, or `colors.contentBrand` in `pacificTokens.ts`. Your file already has this — no changes needed.

**If no library is found**, offer to create one proactively:
> *"I don't see a Pacific color library in this project. Want me to create one? I can set up a ready-to-use CSS file (React/HTML/Replit) or a TypeScript theme object (React Native/Expo)."*

Then output the appropriate Bootstrap file:
- **React Web / HTML / Next.js / Replit (browser)** → output the full `pacific-tokens.css` from the **"Bootstrap: ready-to-paste CSS"** section. Tell the user to save it as `src/styles/pacific-tokens.css` and add `import './styles/pacific-tokens.css'` to their root file. Usage: `var(--color-content-brand)`, `var(--color-surface-base)`, etc.
- **React Native / Expo** → output the full `pacificTokens.ts` from the **"Bootstrap: React Native / Expo"** section. Tell the user to save it as `src/pacificTokens.ts` or `pacificTokens.ts`. Usage: `import { pacificLight, pacificDark } from './pacificTokens'`, then `colors.contentBrand`, `colors.surfaceBase`, etc.
- **If unclear**, ask: *"Is this a web app (React, HTML, Replit) or a React Native / Expo app?"*

**After creating the file**, map each token from the Figma MCP color scan to its code reference:
```
surfaceBase         → CSS: var(--color-surface-base)           RN: colors.surfaceBase
contentPrimaryDefault → CSS: var(--color-content-primary-default)  RN: colors.contentPrimaryDefault
buttonBrandDefault  → CSS: var(--color-button-brand-default)   RN: colors.buttonBrandDefault
```
