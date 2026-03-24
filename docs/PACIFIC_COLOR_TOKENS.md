# Pacific Color Token Lookup

Source of truth for mapping hex values seen in Figma to Pacific Design System semantic tokens.
Extracted from `sofi_design_system_tokens` v1.40.0 (`pacific_color_token_themes.dart`).

---

## Quick Reference: Hex → Primitive → Semantic Token

When Figma MCP returns a color (via `getDesignContext` or `getScreenshot`), use this file to:
1. Match the hex to a **primitive** (e.g., `#1A1919` → `bone850`)
2. Look up which **semantic tokens** use that primitive (e.g., `bone850` → `contentPrimaryDefault`, `buttonNeutralDefault`, `surfaceIndicatorSelected`)
3. Pick the semantic token that fits the element's role (text? surface? stroke?)

---

## 1. Primitive Hex Scales

### Bone Scale (Warm Neutrals)

| Primitive | Hex | Confirmed | Common Semantic Tokens (Light) |
|-----------|-----|-----------|-------------------------------|
| `bone0` | `#FFFFFF` | yes | `surfaceElevatedDefault`, `contentPrimaryInverse`, `contentOnDark` |
| `bone50` | `#FAF8F5` | yes | `surfaceBase`, `contentPrimaryDefault` (Dark) |
| `bone100` | `#F0EDE8` | ~approx | `surfaceInfoLabel` |
| `bone150` | `#E8E5DF` | ~approx | `surfaceInfoDefault`, `surfaceElevatedDisabled`, `surfaceSwitchUnselected` |
| `bone200` | `#E0DCD5` | ~approx | `surfaceSwitchUnselectedHover` |
| `bone250` | `#D0CCC5` | yes | `contentHint`, `contentDisabled`, `contentIndicatorDisabled`, `strokeIndicatorUnselectedDefault`, `surfaceIndicatorUnselected`, `buttonBrandDisabled` |
| `bone300` | `#BDBBB9` | ~approx | (no direct semantic token — prototype `contentDimmed`) |
| `bone350` | `#A8A6A3` | ~approx | `contentDisabled2`, `buttonBrandDisabled2` |
| `bone450` | `#8A8887` | ~approx | `contentIndicatorUnselected` (Dark) |
| `bone500` | `#7E7C7B` | ~approx | `contentSecondary` (Dark), `surfaceIndicatorSelectedSecondary` (Dark) |
| `bone550` | `#706F6E` | yes | `contentSecondary`, `surfaceIndicatorSelectedSecondary` |
| `bone600` | `#5C5B5A` | yes | `contentIndicatorUnselected` |
| `bone650` | `#4A4948` | ~approx | `surfaceElevatedDisabledEmphasized` (Dark) |
| `bone700` | `#3A3938` | ~approx | `surfaceToast` (Dark), `contentDisabled` (Dark) |
| `bone750` | `#2E2D2C` | ~approx | `surfaceIndicatorUnselected` (Dark), `surfaceElevatedDisabled` (Dark) |
| `bone800` | `#242322` | ~approx | `surfaceInfoDefault` (Dark) |
| `bone850` | `#1A1919` | yes | `contentPrimaryDefault`, `buttonNeutralDefault`, `surfaceIndicatorSelected`, `strokeIndicatorSelected`, `contentIndicatorSelected`, `contentLinkPrimary` |
| `bone900` | `#141313` | ~approx | `surfaceIndicatorRange` (Dark) |
| `bone950` | `#0F0F0F` | yes | `surfaceToast` |
| `bone1000` | `#0A0A0A` | yes | `contentStatusBar`, `contentPrimaryInverse` (Dark), `buttonBrandInverse` (Dark) |

#### Bone + Alpha (Opacity Variants)

These appear as `rgba()` in code. Pacific names them with a suffix like `010Pct`, `016Pct`, `050Pct`, etc.

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

**Key distinction:** Our prototype `surfaceEdge` (`rgba(10,10,10,0.10)`) maps to `strokeDividePrimary` (`bone100010Pct`), NOT Pacific's `surfaceEdge` which is `bone100016Pct` (0.16 opacity — heavier).

### Blue Scale (Brand)

| Primitive | Hex | Confirmed | Common Semantic Tokens (Light) |
|-----------|-----|-----------|-------------------------------|
| `blue50` | `#E6F7FB` | ~approx | `surfaceTipDefault` |
| `blue100` | `#B3E8F2` | ~approx | `gradientCoachMark1` |
| `blue300` | `#66C9E0` | ~approx | `contentChartF` |
| `blue450` | `#33B0CC` | ~approx | `gradientCoachMark2`, `contentChartA` |
| `blue500` | `#00A2C7` | yes | `buttonBrandDefaultInverse`, `contentBrand` (Dark), `surfaceIndicatorSelectedBrand` (Dark) |
| `blue550` | `#0095B8` | ~approx | `buttonBrandDefault`, `contentBrand`, `contentLinkSecondary`, `surfaceSub`, `surfaceNeutral`, `strokeBrand` |
| `blue600` | `#0088A9` | ~approx | `buttonBrandHover`, `contentChartB` |
| `blue650` | `#007B9A` | ~approx | `contentTip`, `buttonTip` |
| `blue700` | `#006E8B` | ~approx | `buttonTipHover` |
| `blue750` | `#00617C` | ~approx | `surfaceSubDark`, `contentChartC` |

### Red Scale (Danger / Negative)

| Primitive | Hex | Confirmed | Common Semantic Tokens (Light) |
|-----------|-----|-----------|-------------------------------|
| `red50` | `#FEE2E2` | yes | `surfaceDangerDefault`, `surfaceNegativeDiminish` |
| `red550` | `#EF4444` | ~approx | `contentChart5` |
| `red600` | `#FA2D25` | yes | `contentDanger`, `contentNegative`, `surfaceAlert`, `surfaceNegativeDefault`, `buttonDestructiveDefault`, `strokeIndicatorError` |
| `red650` | `#E5281F` | ~approx | `contentDangerEmphasized`, `surfaceDangerEmphasize`, `buttonDangerEmphasized` |
| `red700` | `#CC231B` | ~approx | `buttonDestructivePressed` |

### Green Scale (Success / Positive)

| Primitive | Hex | Confirmed | Common Semantic Tokens (Light) |
|-----------|-----|-----------|-------------------------------|
| `green50` | `#DCFCE7` | yes | `surfaceSuccessDefault`, `surfacePositiveDiminish` |
| `green550` | `#22C55E` | yes | `contentSuccess`, `contentPositive`, `surfacePositiveDefault`, `strokePositiveDefault`, `buttonInvestPositiveDefault` |
| `green600` | `#16A34A` | yes | `contentSuccessEmphasized`, `buttonSuccess` |
| `green650` | `#138D40` | ~approx | `buttonSuccessHover` |

### Yellow Scale (Caution / Warning)

| Primitive | Hex | Confirmed | Common Semantic Tokens (Light) |
|-----------|-----|-----------|-------------------------------|
| `yellow50` | `#FEF3C7` | yes | `surfaceCautionDefault` |
| `yellow250` | `#E5C35A` | ~approx | `contentChart8` |
| `yellow350` | `#D4A843` | ~approx | `surfaceCautionEmphasize`, `contentCautionOnDark` |
| `yellow600` | `#B45309` | yes | `contentCaution`, `contentIndicatorCaution`, `buttonCaution`, `strokeIndicatorCaution` |
| `yellow650` | `#9A4808` | ~approx | `buttonCautionHover` |

---

## 2. Reverse Lookup: Semantic Token → Primitive + Hex

### Surface Tokens (Backgrounds)

| Pacific Token | Light Primitive | Approx Hex | Role |
|---------------|----------------|------------|------|
| `surfaceBase` | `bone50` | `#FAF8F5` | Page background |
| `surfaceElevatedDefault` | `bone0` | `#FFFFFF` | Card / container background |
| `surfaceElevatedHover` | `bone10004Pct` | `rgba(10,10,10,0.04)` | Card hover state |
| `surfaceElevatedPressed` | `bone10008Pct` | `rgba(10,10,10,0.08)` | Card pressed state |
| `surfaceElevatedSelected` | `bone850` | `#1A1919` | Selected pill / toggle bg |
| `surfaceElevatedDisabled` | `bone150` | `#E8E5DF` | Disabled input bg |
| `surfaceBottomSheet` | `bone50` | `#FAF8F5` | Bottom sheet bg |
| `surfaceToast` | `bone950` | `#0F0F0F` | Toast notification bg |
| `surfaceScrim` | `bone100050Pct` | `rgba(10,10,10,0.50)` | Overlay / modal backdrop |
| `surfaceEdge` | `bone100016Pct` | `rgba(10,10,10,0.16)` | Container edge definition |
| `surfaceGhostDefault` | `bone10007Pct` | `rgba(10,10,10,0.07)` | Ghost pill / status bg |
| `surfaceGhostDefaultEmphasized` | `bone100016Pct` | `rgba(10,10,10,0.16)` | Emphasized ghost bg |
| `surfaceInfoDefault` | `bone150` | `#E8E5DF` | Info banner bg |
| `surfaceInfoLabel` | `bone100` | `#F0EDE8` | Subheader bg |
| `surfaceTipDefault` | `blue50` | `#E6F7FB` | Tip banner bg |
| `surfaceSuccessDefault` | `green50` | `#DCFCE7` | Success banner bg |
| `surfaceCautionDefault` | `yellow50` | `#FEF3C7` | Caution banner bg |
| `surfaceDangerDefault` | `red50` | `#FEE2E2` | Danger banner bg |
| `surfaceAlert` | `red600` | `#FA2D25` | Alert dot |
| `surfaceIndicatorSelected` | `bone850` | `#1A1919` | Pagination dot on |
| `surfaceIndicatorUnselected` | `bone250` | `#D0CCC5` | Pagination dot off |
| `surfaceIndicatorSelectedBrand` | `blue550` | `#0095B8` | Brand-colored selected indicator |
| `surfaceSub` | `blue550` | `#0095B8` | SoFi blue page bg |

### Content Tokens (Text & Icons)

| Pacific Token | Light Primitive | Approx Hex | Role |
|---------------|----------------|------------|------|
| `contentPrimaryDefault` | `bone850` | `#1A1919` | Primary text, icons |
| `contentPrimaryInverse` | `bone0` | `#FFFFFF` | Text on dark surfaces |
| `contentSecondary` | `bone550` | `#706F6E` | Secondary text, meta |
| `contentHint` | `bone250` | `#D0CCC5` | Placeholder / hint text |
| `contentDisabled` | `bone250` | `#D0CCC5` | Disabled text |
| `contentBrand` | `blue550` | `#0095B8` | Brand-colored text |
| `contentOnDark` | `bone0` | `#FFFFFF` | Text on dark bg |
| `contentLinkPrimary` | `bone850` | `#1A1919` | Standalone text links |
| `contentLinkSecondary` | `blue550` | `#0095B8` | Inline text links |
| `contentTip` | `blue650` | `#007B9A` | Tip / new-item text |
| `contentInfo` | `bone850` | `#1A1919` | Info banner text |
| `contentSuccess` | `green550` | `#22C55E` | Success text |
| `contentSuccessEmphasized` | `green600` | `#16A34A` | Emphasized success |
| `contentCaution` | `yellow600` | `#B45309` | Caution text |
| `contentDanger` | `red600` | `#FA2D25` | Danger / error text |
| `contentPositive` | `green550` | `#22C55E` | Positive movement |
| `contentNegative` | `red600` | `#FA2D25` | Negative movement |
| `contentIndicatorSelected` | `bone850` | `#1A1919` | Active tab text |
| `contentIndicatorUnselected` | `bone600` | `#5C5B5A` | Inactive tab text |
| `contentIndicatorDisabled` | `bone250` | `#D0CCC5` | Disabled tab text |
| `contentStatusBar` | `bone1000` | `#0A0A0A` | iOS status bar |

### Stroke Tokens (Borders & Dividers)

| Pacific Token | Light Primitive | Approx Hex | Role |
|---------------|----------------|------------|------|
| `strokeDividePrimary` | `bone100010Pct` | `rgba(10,10,10,0.10)` | Dividers over primary surface |
| `strokeDivideSecondary` | `bone100010Pct` | `rgba(10,10,10,0.10)` | Dividers over secondary surface |
| `strokeEdge` | `bone100010Pct` | `rgba(10,10,10,0.10)` | Container edges |
| `strokeIndicatorSelected` | `bone850` | `#1A1919` | Selected control border |
| `strokeIndicatorUnselectedDefault` | `bone250` | `#D0CCC5` | Unselected control border |
| `strokeIndicatorUnselectedEmphasized` | `bone100040Pct` | `rgba(10,10,10,0.40)` | Filter pill border |
| `strokeIndicatorGhost` | `bone030Pct` | `rgba(~,~,~,0.03)` | Very light rule |
| `strokeIndicatorDisabled` | `bone100010Pct` | `rgba(10,10,10,0.10)` | Disabled control border |
| `strokeBrand` | `blue550` | `#0095B8` | Focus / brand border |
| `strokePositiveDefault` | `green550` | `#22C55E` | Positive divider |
| `strokeNegativeDefault` | `red600` | `#FA2D25` | Negative divider |
| `strokeIndicatorError` | `red600` | `#FA2D25` | Error border |

### Button Tokens

| Pacific Token | Light Primitive | Approx Hex | Role |
|---------------|----------------|------------|------|
| `buttonBrandDefault` | `blue550` | `#0095B8` | Primary brand CTA |
| `buttonBrandHover` | `blue600` | `#0088A9` | Brand hover |
| `buttonBrandPressed` | `blue650` | `#007B9A` | Brand pressed |
| `buttonBrandDisabled` | `bone150` | `#E8E5DF` | Brand disabled bg |
| `buttonBrandInverse` | `bone0` | `#FFFFFF` | Brand button text |
| `buttonNeutralDefault` | `bone850` | `#1A1919` | Neutral CTA bg |
| `buttonNeutralHover` | `bone700` | `#3A3938` | Neutral hover |
| `buttonNeutralPressed` | `bone1000` | `#0A0A0A` | Neutral pressed |
| `buttonDestructiveDefault` | `red600` | `#FA2D25` | Delete / destructive CTA |
| `buttonDestructiveInverse` | `bone0` | `#FFFFFF` | Destructive button text |

---

## 3. Prototype → Pacific Migration Map

Quick lookup for our local `colors.ts` tokens → Pacific equivalents:

| `colors.ts` Key | Hex | Pacific Token | Primitive |
|-----------------|-----|---------------|-----------|
| `surfaceBase` | `#FAF8F5` | `surfaceBase` | `bone50` |
| `surfaceElevated` | `#FFFFFF` | `surfaceElevatedDefault` | `bone0` |
| `surfaceTint` | `#F0EDE8` | — (no equivalent) | ~`bone100` |
| `surfaceEdge` | `rgba(10,10,10,0.10)` | `strokeDividePrimary` | `bone100010Pct` |
| `surfaceEdgeLight` | `rgba(10,10,10,0.05)` | — (no equivalent) | — |
| `surfaceMuted` | `#F5F3F0` | `surfaceInfoDefault` | `bone150` |
| `contentPrimary` | `#1A1919` | `contentPrimaryDefault` | `bone850` |
| `contentSecondary` | `#706F6E` | `contentSecondary` | `bone550` |
| `contentBone600` | `#5C5B5A` | `contentIndicatorUnselected` | `bone600` |
| `contentStatusbar` | `#0A0A0A` | `contentStatusBar` | `bone1000` |
| `contentMuted` | `#D0CCC5` | `contentHint` | `bone250` |
| `contentDimmed` | `#BDBBB9` | — (no equivalent) | ~`bone300` |
| `contentBrand` | `#00A2C7` | `contentBrand` | `blue550` |
| `danger` | `#FA2D25` | `contentDanger` | `red600` |
| `dangerChipBg` | `#FEE2E2` | `surfaceDangerDefault` | `red50` |
| `success` | `#22C55E` | `contentSuccess` | `green550` |
| `successDark` | `#16A34A` | `contentSuccessEmphasized` | `green600` |
| `successBg` | `#DCFCE7` | `surfaceSuccessDefault` | `green50` |
| `warning` | `#B45309` | `contentCaution` | `yellow600` |
| `warningBg` | `#FEF3C7` | `surfaceCautionDefault` | `yellow50` |
| `info` | `#2563EB` | `contentTip` | `blue650` |
| `infoBg` | `#DBEAFE` | `surfaceTipDefault` | `blue50` |
| `progressTrack` | `#E5E1DA` | `surfaceIndicatorUnselected` | `bone250` |

---

## 4. Figma MCP Workflow

When using `getDesignContext` or `getScreenshot` from Figma MCP:

1. **Figma returns hex color** → Search Section 1 (Primitive Hex Scales) to find the primitive name
2. **Figma returns a style/variable name** → It may already be a Pacific token name — verify in Section 2
3. **Choosing the right semantic token** → Same primitive can be used by many semantic tokens. Pick based on:
   - **Text or icon?** → use `content*` tokens
   - **Background fill?** → use `surface*` tokens
   - **Border or divider?** → use `stroke*` tokens
   - **Clickable element?** → use `button*` tokens
4. **Not in Pacific?** → If a hex doesn't match any primitive, it's likely a one-off or custom value. Note it as "prototype only" in the design system map.

### Common Figma Patterns

| What You See in Figma | Pacific Token | Notes |
|------------------------|---------------|-------|
| Near-white page bg (`#FAF8F5`) | `surfaceBase` | bone50 |
| Pure white card (`#FFFFFF`) | `surfaceElevatedDefault` | bone0 |
| Dark text (`#1A1919`) | `contentPrimaryDefault` | bone850 |
| Gray secondary text (`#706F6E`) | `contentSecondary` | bone550 |
| Medium gray icon (`#5C5B5A`) | `contentIndicatorUnselected` | bone600 |
| Very light border (10% opacity) | `strokeDividePrimary` | bone100010Pct |
| Dark toast/snackbar bg | `surfaceToast` | bone950 |
| Semi-transparent overlay | `surfaceScrim` | bone100050Pct |
| SoFi brand blue | `contentBrand` / `buttonBrandDefault` | blue550 |
| Red error / delete | `contentDanger` / `buttonDestructiveDefault` | red600 |
| Green success | `contentSuccess` | green550 |
| Yellow warning text | `contentCaution` | yellow600 |
| Light red banner bg | `surfaceDangerDefault` | red50 |
| Light green banner bg | `surfaceSuccessDefault` | green50 |
| Light blue tip bg | `surfaceTipDefault` | blue50 |

---

## 5. Token Naming Convention

Tokens follow `[category][Modifier][State]`:

- **Category**: `surface`, `content`, `stroke`, `button`, `gradient`, `marketing`, `plus`, `ioskeypad`
- **Modifier**: `Brand`, `Elevated`, `Indicator`, `Ghost`, `Tip`, `Success`, `Caution`, `Danger`, `Positive`, `Negative`, `OnDark`, `Neutral`, `Destructive`, `Chart`
- **State**: `Default`, `Hover`, `Pressed`, `Disabled`, `Selected`, `Unselected`, `Inverse`, `Diminish`, `Emphasized`

---

## 6. Theme Variants

| Variant | Class | Notes |
|---------|-------|-------|
| **Light** | `PacificColorTokensLight` | Default — all mappings above use this |
| **Dark** | `PacificColorTokensDark` | Dark theme |
| **Minimum** | `PacificColorTokensMinimum` | Same as Light; baseline |
| **Maximum** | `PacificColorTokensMaximum` | Slightly bolder light variant |
| **LightModeAccessible** | `PacificColorTokensLightModeAccessible` | High-contrast light |
| **DarkModeAccessible** | `PacificColorTokensDarkModeAccessible` | High-contrast dark |

This project targets **Light** theme only. Dark theme primitives are listed in the bone scale for reference.
