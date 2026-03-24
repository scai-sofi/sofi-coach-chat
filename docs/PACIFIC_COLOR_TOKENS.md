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

## 2. Reverse Lookup: Semantic Token → Light / Dark Primitives

### Surface Tokens (Backgrounds)

| Pacific Token | Light | Dark | Role |
|---------------|-------|------|------|
| `surfaceSub` | `blue550` | `blue1000` | SoFi blue page bg |
| `surfaceSubDark` | `blue750` | `bone1000` | Dark SoFi blue bg |
| `surfaceSubCrypto` | `blue550` | `bone1000` | Crypto page bg |
| `surfaceSubError` | `blue750` | `blue900` | Error page bg |
| `surfaceBase` | `bone50` | `bone1000` | Page background |
| `surfaceElevatedDefault` | `bone0` | `bone850` | Card / container bg |
| `surfaceElevatedHover` | `bone10004Pct` | `bone04Pct` | Card hover |
| `surfaceElevatedPressed` | `bone10008Pct` | `bone08Pct` | Card pressed |
| `surfaceElevatedUnselected` | `bone0` | `bone850` | Unselected card |
| `surfaceElevatedSelected` | `bone850` | `bone0` | Selected pill / toggle bg |
| `surfaceElevatedDisabled` | `bone150` | `bone750` | Disabled input bg |
| `surfaceElevatedDisabledEmphasized` | `bone250` | `bone650` | Emphasized disabled bg |
| `surfaceBottomSheet` | `bone50` | `bone850` | Bottom sheet bg |
| `surfaceToast` | `bone950` | `bone700` | Toast notification bg |
| `surfaceScrim` | `bone100050Pct` | `bone100070Pct` | Overlay / modal backdrop |
| `surfaceScrimFab` | `bone5080Pct` | `bone100070Pct` | FAB scrim |
| `surfaceEdge` | `bone100016Pct` | `bone020Pct` | Container edge definition |
| `surfaceScrollHandle` | `bone100010Pct` | `bone010Pct` | Scroll handle |
| `surfaceGhostDefault` | `bone10007Pct` | `bone07Pct` | Ghost pill / status bg |
| `surfaceGhostDefaultEmphasized` | `bone100016Pct` | `bone012Pct` | Emphasized ghost bg |
| `surfaceGhostOnDark` | `bone010Pct` | `bone010Pct` | Ghost on dark surface |
| `surfaceGhostOnDarkDisabled` | `bone012Pct` | `bone012Pct` | Disabled ghost on dark |
| `surfaceInfoLabel` | `bone100` | `bone08Pct` | Subheader bg |
| `surfaceInfoDefault` | `bone150` | `bone800` | Info banner bg |
| `surfaceInfoDiminish` | `bone10007Pct` | `bone010Pct` | Info diminish pill |
| `surfaceTipDefault` | `blue50` | `blue900` | Tip banner bg |
| `surfaceTipDiminish` | `blue55010Pct` | `blue55010Pct` | Tip diminish pill |
| `surfaceSuccessDefault` | `green50` | `green900` | Success banner bg |
| `surfaceSuccessDiminish` | `green55010Pct` | `green55010Pct` | Success diminish pill |
| `surfaceCautionDefault` | `yellow50` | `yellow800` | Caution banner bg |
| `surfaceCautionEmphasize` | `yellow350` | `yellow350` | Emphasized caution bg |
| `surfaceCautionDiminish` | `yellow60010Pct` | `yellow35010Pct` | Caution diminish pill |
| `surfaceDangerDefault` | `red50` | `red850` | Danger banner bg |
| `surfaceDangerEmphasize` | `red650` | `red600` | Emphasized danger bg |
| `surfaceDangerDiminish` | `red60010Pct` | `red60010Pct` | Danger diminish pill |
| `surfaceAlert` | `red600` | `red600` | Alert dot |
| `surfacePositiveDefault` | `green550` | `green550` | Positive movement bg |
| `surfacePositiveDiminish` | `green50` | `green900` | Positive diminish pill |
| `surfaceNegativeDefault` | `red600` | `red600` | Negative movement bg |
| `surfaceNegativeDiminish` | `red50` | `red850` | Negative diminish pill |
| `surfaceIndicatorSelected` | `bone850` | `bone50` | Pagination dot on |
| `surfaceIndicatorSelectedSecondary` | `bone550` | `bone500` | Secondary selected indicator |
| `surfaceIndicatorSelectedBrand` | `blue550` | `blue500` | Brand-colored selected |
| `surfaceIndicatorUnselected` | `bone250` | `bone750` | Pagination dot off |
| `surfaceIndicatorUnselectedHover` | `bone300` | `bone650` | Pagination dot hover |
| `surfaceIndicatorHover` | `bone10004Pct` | `bone04Pct` | Indicator hover |
| `surfaceIndicatorPressed` | `bone10008Pct` | `bone08Pct` | Indicator pressed |
| `surfaceIndicatorDisabled` | `bone150` | `bone750` | Indicator disabled |
| `surfaceIndicatorRange` | `bone150` | `bone900` | Date range highlight |
| `surfaceNeutral` | `blue550` | `blue500` | Neutral blue bg |
| `surfaceSwitchSelected` | `bone0` | `bone750` | Switch on |
| `surfaceSwitchUnselected` | `bone150` | `bone800` | Switch off |
| `surfaceSwitchUnselectedHover` | `bone200` | `bone850` | Switch off hover |

### Content Tokens (Text & Icons)

| Pacific Token | Light | Dark | Role |
|---------------|-------|------|------|
| `contentPrimaryDefault` | `bone850` | `bone50` | Primary text, icons |
| `contentPrimaryInverse` | `bone0` | `bone1000` | Text on dark surfaces |
| `contentOnLight` | `bone850` | `bone850` | Text on light bg (always dark) |
| `contentOnDark` | `bone0` | `bone0` | Text on dark bg (always light) |
| `contentOnDarkDiminish` | `bone080Pct` | `bone5080Pct` | Dimmed text on dark bg |
| `contentOnDarkDisabled` | `bone020Pct` | `bone020Pct` | Disabled text on dark bg |
| `contentOnDarkDisabled2` | `bone060Pct` | `bone060Pct` | Alt disabled on dark |
| `contentSecondary` | `bone550` | `bone500` | Secondary text, meta |
| `contentHint` | `bone250` | `bone500` | Placeholder / hint text |
| `contentDisabled` | `bone250` | `bone700` | Disabled text |
| `contentDisabled2` | `bone350` | `bone850` | Alt disabled text |
| `contentBrand` | `blue550` | `blue500` | Brand-colored text |
| `contentLinkPrimary` | `bone850` | `bone50` | Standalone text links |
| `contentLinkSecondary` | `blue550` | `blue500` | Inline text links |
| `contentInfo` | `bone850` | `bone50` | Info banner text |
| `contentTip` | `blue650` | `blue450` | Tip / new-item text |
| `contentSuccess` | `green550` | `green550` | Success text |
| `contentSuccessEmphasized` | `green600` | `green550` | Emphasized success |
| `contentCaution` | `yellow600` | `yellow350` | Caution text |
| `contentCautionOnDark` | `yellow350` | `yellow350` | Caution on dark (always) |
| `contentDanger` | `red600` | `red600` | Danger / error text |
| `contentDangerEmphasized` | `red650` | `red600` | Emphasized danger |
| `contentPositive` | `green550` | `green550` | Positive movement |
| `contentNegative` | `red600` | `red600` | Negative movement |
| `contentIndicatorSelected` | `bone850` | `bone50` | Active tab text |
| `contentIndicatorSelectedInverse` | `bone0` | `bone1000` | Inverse selected |
| `contentIndicatorUnselected` | `bone600` | `bone450` | Inactive tab text |
| `contentIndicatorHover` | `bone850` | `bone50` | Tab hover text |
| `contentIndicatorDisabled` | `bone250` | `bone750` | Disabled tab text |
| `contentIndicatorCaution` | `yellow600` | `yellow350` | Caution indicator |
| `contentIndicatorFair` | `orangeFair` | `orangeFairOnDark` | Fair performance |
| `contentIndicatorError` | `red600` | `red600` | Error indicator |
| `contentIndicatorErrorHover` | `red650` | `red650` | Error hover |
| `contentIndicatorErrorPressed` | `red700` | `red700` | Error pressed |
| `contentStatusBar` | `bone1000` | `bone0` | iOS status bar |
| `contentHighlight` | `bone100010Pct` | `bone020Pct` | Highlight overlay |

### Stroke Tokens (Borders & Dividers)

| Pacific Token | Light | Dark | Role |
|---------------|-------|------|------|
| `strokeIndicatorHover` | `bone850` | `bone50` | Control hover border |
| `strokeIndicatorSelected` | `bone850` | `bone50` | Selected control border |
| `strokeIndicatorPressed` | `bone850` | `bone50` | Pressed control border |
| `strokeIndicatorError` | `red600` | `red600` | Error border |
| `strokeIndicatorErrorHover` | `red650` | `red650` | Error hover border |
| `strokeIndicatorErrorPressed` | `red700` | `red700` | Error pressed border |
| `strokeIndicatorDisabled` | `bone100010Pct` | `bone010Pct` | Disabled control border |
| `strokeIndicatorUnselectedDefault` | `bone250` | `bone750` | Unselected control border |
| `strokeIndicatorUnselectedEmphasized` | `bone100040Pct` | `bone040Pct` | Filter pill border |
| `strokeIndicatorGhost` | `bone030Pct` | `bone030Pct` | Very light rule |
| `strokeIndicatorCaution` | `yellow600` | `yellow350` | Caution border |
| `strokeOnDark` | `bone0` | `bone50` | Border on dark surface |
| `strokeOnDarkDisabled` | `bone08Pct` | `bone08Pct` | Disabled on dark |
| `strokeBrand` | `blue550` | `blue500` | Focus / brand border |
| `strokeDividePrimary` | `bone100010Pct` | `bone010Pct` | Dividers over primary surface |
| `strokeDivideSecondary` | `bone100010Pct` | `bone07Pct` | Dividers over secondary surface |
| `strokeEdge` | `bone100010Pct` | `bone07Pct` | Container edges |
| `strokePositiveDefault` | `green550` | `green550` | Positive divider |
| `strokeNegativeDefault` | `red600` | `red600` | Negative divider |

### Button Tokens

| Pacific Token | Light | Dark | Role |
|---------------|-------|------|------|
| `buttonBrandDefault` | `blue550` | `blue500` | Primary brand CTA |
| `buttonBrandDefaultInverse` | `blue500` | `blue500` | Inverse brand CTA |
| `buttonBrandInverse` | `bone0` | `bone1000` | Brand button text |
| `buttonBrandDisabled` | `bone150` | `bone750` | Brand disabled bg |
| `buttonBrandDisabled2` | `bone350` | `bone850` | Alt brand disabled bg |
| `buttonBrandHover` | `blue600` | `blue550` | Brand hover |
| `buttonBrandPressed` | `blue650` | `blue600` | Brand pressed |
| `buttonNeutralDefault` | `bone850` | `bone50` | Neutral CTA bg |
| `buttonNeutralDefaultDiminish` | `bone100020Pct` | `bone020Pct` | Diminished neutral bg |
| `buttonNeutralDisabled` | `bone250` | `bone700` | Neutral disabled |
| `buttonNeutralHover` | `bone700` | `bone300` | Neutral hover |
| `buttonNeutralPressed` | `bone1000` | `bone0` | Neutral pressed |
| `buttonNeutralHoverDiminish` | `bone10004Pct` | `bone04Pct` | Diminished neutral hover |
| `buttonNeutralPressedDiminish` | `bone10007Pct` | `bone07Pct` | Diminished neutral pressed |
| `buttonDestructiveDefault` | `red600` | `red600` | Delete / destructive CTA |
| `buttonDestructiveDisabled` | `red150` | `red850` | Destructive disabled bg |
| `buttonDestructiveDisabled2` | `red350` | `red800` | Alt destructive disabled |
| `buttonDestructiveHover` | `red650` | `red650` | Destructive hover |
| `buttonDestructivePressed` | `red700` | `red700` | Destructive pressed |
| `buttonDestructiveInverse` | `bone0` | `bone1000` | Destructive button text |
| `buttonOnDark` | `bone0` | `bone0` | Button on dark surface |
| `buttonOnDarkDiminish` | `bone012Pct` | `bone010Pct` | Diminished on dark |
| `buttonOnDarkInverse` | `bone1000` | `bone1000` | Inverse on dark text |
| `buttonOnDarkHover` | `bone080Pct` | `bone070Pct` | On dark hover |
| `buttonOnDarkHover2` | `bone020Pct` | `bone012Pct` | On dark hover alt |
| `buttonOnDarkHover3` | `bone010Pct` | `bone07Pct` | On dark hover alt 2 |
| `buttonOnDarkPressed` | `bone060Pct` | `bone050Pct` | On dark pressed |
| `buttonOnDarkPressed2` | `bone012Pct` | `bone07Pct` | On dark pressed alt |
| `buttonOnDarkPressed3` | `bone07Pct` | `bone04Pct` | On dark pressed alt 2 |
| `buttonOnDarkDisabled` | `bone012Pct` | `bone010Pct` | Disabled on dark |
| `buttonOnDarkDisabled2` | `bone020Pct` | `bone012Pct` | Alt disabled on dark |
| `buttonOnDarkDisabledDiminish` | `bone08Pct` | `bone07Pct` | Diminished disabled on dark |
| `buttonOnDarkDisabledDiminish2` | `bone020Pct` | `bone020Pct` | Alt diminished disabled |
| `buttonTip` | `blue650` | `blue600` | Tip action |
| `buttonTipHover` | `blue700` | `blue650` | Tip hover |
| `buttonCaution` | `yellow600` | `yellow350` | Caution action |
| `buttonCautionHover` | `yellow650` | `yellow400` | Caution hover |
| `buttonDangerEmphasized` | `red650` | `red600` | Emphasized danger |
| `buttonDangerEmphasizedHover` | `red700` | `red650` | Emphasized danger hover |
| `buttonSuccess` | `green600` | `green550` | Success action |
| `buttonSuccessHover` | `green650` | `green600` | Success hover |
| `buttonInvestPositiveDefault` | `green550` | `green550` | Invest positive |
| `buttonInvestPositiveHover` | `green600` | `green600` | Invest positive hover |
| `buttonInvestPositivePressed` | `green700` | `green700` | Invest positive pressed |
| `buttonInvestPositiveSelected` | `green550` | `green550` | Invest positive selected |
| `buttonInvestNeutralDefault` | `bone550` | `bone550` | Invest neutral |
| `buttonInvestNeutralHover` | `bone600` | `bone600` | Invest neutral hover |
| `buttonInvestNeutralPressed` | `bone700` | `bone700` | Invest neutral pressed |
| `buttonInvestNeutralSelected` | `bone500` | `bone500` | Invest neutral selected |
| `buttonInvestNegativeDefault` | `red600` | `red600` | Invest negative |
| `buttonInvestNegativeHover` | `red650` | `red650` | Invest negative hover |
| `buttonInvestNegativePressed` | `red700` | `red700` | Invest negative pressed |
| `buttonInvestNegativeSelected` | `red600` | `red600` | Invest negative selected |

### Gradient Tokens

| Pacific Token | Light | Dark | Role |
|---------------|-------|------|------|
| `gradientSubDark` | `blue7500Pct` | `bone10000Pct` | Sub dark gradient |
| `gradientPlus1` | `plus100` | `plus400` | Plus gradient stop 1 |
| `gradientPlus2` | `plus200` | `plus500` | Plus gradient stop 2 |
| `gradientPlus3` | `plus300` | `plus600` | Plus gradient stop 3 |
| `gradientOnSub1` | `bone020Pct` | `bone010Pct` | On-sub gradient 1 |
| `gradientOnSub2` | `bone08Pct` | `bone04Pct` | On-sub gradient 2 |
| `gradientOnBase1` | `bone150` | `bone850` | On-base gradient 1 |
| `gradientOnBase2` | `bone50` | `bone950` | On-base gradient 2 |
| `gradientBaseTrans` | `bone500Pct` | `bone10000Pct` | Base transparent |
| `gradientSubCryptoTrans` | `blue5500Pct` | `bone10000Pct` | Crypto sub transparent |
| `gradientOnElevated1` | `bone50` | `bone850` | On-elevated gradient 1 |
| `gradientOnElevated2` | `bone0` | `bone1000` | On-elevated gradient 2 |
| `gradientElevatedTrans` | `bone00Pct` | `bone10000Pct` | Elevated transparent |
| `gradientCoachMark1` | `blue100` | `blue500` | Coach mark gradient 1 |
| `gradientCoachMark2` | `blue450` | `blue400` | Coach mark gradient 2 |
| `gradientSub1` | `blue500` | `blue800` | Sub gradient 1 |
| `gradientSub2` | `blue550` | `blue850` | Sub gradient 2 |

### Marketing / Specialty Tokens

| Pacific Token | Light | Dark | Role |
|---------------|-------|------|------|
| `marketingWhite` | `bone0` | `bone850` | Marketing white bg |
| `marketingBone` | `bone50` | `bone1000` | Marketing bone bg |
| `marketingSofiBlue` | `blue550` | `blue500` | Marketing blue bg |
| `marketingEggplant` | `mktgEggplant` | `mktgEggplant` | Marketing eggplant |
| `marketingInk` | `mktgInk` | `mktgInk` | Marketing ink |
| `marketingBerry` | `mktgBerry` | `mktgBerry` | Marketing berry |
| `plusLightPurple` | `plusLightPurple` | `plusDarkPurple` | Plus light purple |
| `plusPopPurple` | `plusPopPurple` | `bone0` | Plus pop purple |

### iOS Keypad Tokens

| Pacific Token | Light | Dark | Role |
|---------------|-------|------|------|
| `ioskeypadSurface` | `bone250` | `bone750` | Keypad surface |
| `ioskeypadKeysPrimary` | `bone0` | `bone700` | Primary keys |
| `ioskeypadKeysSecondary` | `bone350` | `bone850` | Secondary keys |
| `ioskeypadContent` | `bone950` | `bone0` | Key text |
| `ioskeypadShadow` | `bone500` | `bone950` | Key shadow |

### Content Chart Tokens

| Pacific Token | Light | Dark | Role |
|---------------|-------|------|------|
| `contentChartA` | `blue450` | `blue450` | Chart color A |
| `contentChartB` | `blue600` | `blue600` | Chart color B |
| `contentChartC` | `blue750` | `blue750` | Chart color C |
| `contentChartD` | `bone850` | `bone250` | Chart color D |
| `contentChartE` | `blue550` | `blue450` | Chart color E |
| `contentChartF` | `blue300` | `blue650` | Chart color F |
| `contentChart1` | `blue500` | `blue500` | Chart 1 |
| `contentChart2` | `blue600` | `blue600` | Chart 2 |
| `contentChart3` | `crypto400` | `crypto400` | Chart 3 |
| `contentChart4` | `mktgBerry` | `mktgBerry` | Chart 4 |
| `contentChart5` | `red550` | `red550` | Chart 5 |
| `contentChart6` | `red450` | `red450` | Chart 6 |
| `contentChart7` | `yellow350` | `yellow350` | Chart 7 |
| `contentChart8` | `yellow250` | `yellow250` | Chart 8 |
| `contentChart9` | `green550` | `green550` | Chart 9 |
| `contentChart10` | `green450` | `green450` | Chart 10 |
| `contentChartDisbursed1` | `bone350` | `bone800` | Disbursed 1 |
| `contentChartDisbursed2` | `bone500` | `bone750` | Disbursed 2 |
| `contentChartDisbursed3` | `bone650` | `bone700` | Disbursed 3 |
| `contentChartDisbursed4` | `bone800` | `bone650` | Disbursed 4 |
| `contentCryptoCoinShadow` | `blue600` | `bone800` | Crypto coin shadow |

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
| **Light** | `PacificColorTokensLight` | Default light theme |
| **Dark** | `PacificColorTokensDark` | Default dark theme |
| **Minimum** | `PacificColorTokensMinimum` | Same values as Light; baseline |
| **Maximum** | `PacificColorTokensMaximum` | Slightly bolder light variant |
| **LightModeAccessible** | `PacificColorTokensLightModeAccessible` | High-contrast light |
| **DarkModeAccessible** | `PacificColorTokensDarkModeAccessible` | High-contrast dark |

This project targets **Light** theme. All Section 2 tables include both Light and Dark columns for complete theme mapping. Key Light→Dark inversion patterns:
- `bone850` ↔ `bone50` (primary content, indicators)
- `bone0` ↔ `bone850` (elevated surfaces)
- `bone50` ↔ `bone1000` (base surface, bottom sheets vary)
- `blue550` ↔ `blue500` (brand, links)
- `bone1000` ↔ `bone0` (status bar, inverse content)
- Status colors (red600, green550) are often **identical** across themes
