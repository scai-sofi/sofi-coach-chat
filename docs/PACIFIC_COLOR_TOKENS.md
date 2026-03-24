# Prototype → Pacific Color Migration Guide

Maps every color in our React Native `colors.ts` to the correct Pacific Design System token for Flutter migration.

**Full Pacific token reference:** See `.agents/skills/pacific-color-mapper/SKILL.md` for all 181 semantic tokens, primitive hex scales, TypeScript/CSS bootstrap, and hex reverse-lookup tables.

---

## Alpha / Opacity Tokens

These appear as `rgba()` in code and are NOT in the mapper skill. Pacific names them with suffixes like `010Pct`, `016Pct`, `050Pct`, etc.

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

---

## Prototype → Pacific Migration Map

**⚠ IMPORTANT: Several prototype hex values are Tailwind CSS colors, NOT Pacific primitives.** These were used during early prototyping and must be corrected during Flutter migration. The table below shows the actual Pacific hex (from `pacific-color-mapper` skill) alongside our prototype value.

| `colors.ts` Key | Prototype Hex | Pacific Token | Primitive | Pacific Hex | Δ | Status |
|-----------------|---------------|---------------|-----------|-------------|---|--------|
| `surfaceBase` | `#faf8f5` | `surfaceBase` | `bone50` | `#faf8f5` | 0 | ✓ |
| `surfaceElevated` | `#ffffff` | `surfaceElevatedDefault` | `bone0` | `#ffffff` | 0 | ✓ |
| `surfaceTint` | `#f0ede8` | — (no equivalent) | ~`bone150` | `#f0eeeb` | 3 | ~ |
| `surfaceEdge` | `rgba(10,10,10,0.10)` | `strokeDividePrimary` | `bone100010Pct` | same | 0 | ✓ |
| `surfaceEdgeLight` | `rgba(10,10,10,0.05)` | — (no equivalent) | — | — | — | proto |
| `surfaceMuted` | `#f5f3f0` | `surfaceInfoLabel` | `bone100` | `#f5f3f0` | 0 | ✓ |
| `contentPrimary` | `#1a1919` | `contentPrimaryDefault` | `bone850` | `#1a1919` | 0 | ✓ |
| `contentSecondary` | `#706f6e` | `contentSecondary` | `bone550` | `#706f6e` | 0 | ✓ |
| `contentBone600` | `#5c5b5a` | `contentIndicatorUnselected` | `bone600` | `#5c5b5a` | 0 | ✓ |
| `contentStatusbar` | `#0a0a0a` | `contentStatusBar` | `bone1000` | `#0a0a0a` | 0 | ✓ |
| `contentMuted` | `#d0ccc5` | `contentHint` | `bone250` | `#dbdad7` | 25 | ❌ off-palette |
| `contentDimmed` | `#bdbbb9` | `contentDisabled2` | `bone350` | `#bdbbb9` | 0 | ✓ |
| `contentBrand` | `#00a2c7` | `contentBrand` | `blue550` | `#00a2c7` | 0 | ✓ |
| `danger` | `#fa2d25` | `contentDanger` | `red600` | `#fa2d25` | 0 | ✓ |
| `dangerLight` | `#ef4444` | — | ~`red550` | `#fb4a43` | 14 | ⚠ Tailwind |
| `dangerChipText` | `#dc2626` | `contentDanger` | `red600` | `#fa2d25` | 30 | ❌ Tailwind |
| `dangerChipBg` | `#fee2e2` | `surfaceDangerDefault` | `red50` | `#ffe5e5` | 4 | ~ |
| `success` | `#22c55e` | `contentSuccess` | `green550` | `#1bc245` | 26 | ❌ Tailwind |
| `successDark` | `#16a34a` | `contentSuccessEmphasized` | `green600` | `#19a623` | 39 | ❌ Tailwind |
| `successBg` | `#dcfce7` | `surfaceSuccessDefault` | `green50` | `#ebf9ee` | 17 | ⚠ Tailwind |
| `successBorder` | `#bbf7d0` | — | — | — | — | proto |
| `successBgLight` | `#f0fdf4` | — | — | — | — | proto |
| `warning` | `#b45309` | `contentCaution` | `yellow600` | `#8c6914` | 47 | ❌ Tailwind |
| `warningBg` | `#fef3c7` | `surfaceCautionDefault` | `yellow50` | `#fff5e5` | 30 | ❌ Tailwind |
| `info` | `#2563eb` | — | — | — | — | ❌ Tailwind (not Pacific) |
| `infoBg` | `#dbeafe` | `surfaceTipDefault` | `blue50` | `#edf8fc` | 22 | ❌ Tailwind |
| `progressTrack` | `#e5e1da` | `surfaceIndicatorUnselected` | `bone250` | `#dbdad7` | 14 | ⚠ approx |

### Status legend

| Symbol | Meaning | Action |
|--------|---------|--------|
| ✓ | Exact match | Use Pacific token directly |
| ~ | Close (Δ < 5) | Safe to swap — likely Figma rounding |
| ⚠ | Off (Δ 5–20) | Check with designer, probably Tailwind |
| ❌ | Wrong (Δ > 20) | Definitely wrong — replace with Pacific hex |
| proto | Prototype-only | No Pacific equivalent; decide in Flutter |

### Migration notes

- Tokens marked **❌ Tailwind** used Tailwind CSS color values during prototyping. Replace with Pacific hex during Flutter migration.
- `contentMuted` (#d0ccc5) does not match any Pacific primitive — it sits between bone250 (#dbdad7) and bone300 (#cccac8). Use `contentHint` (bone250) or `contentDisabled` (bone250) in production.
- `contentDimmed` (#bdbbb9) is exactly `bone350` = Pacific `contentDisabled2`.
- `info` (#2563eb) is Tailwind blue-600, not in Pacific at all. Use `contentTip` (blue650 = #006280) or `contentBrand` (blue550 = #00a2c7).
- `surfaceTint` (#f0ede8) is close to `bone150` (#f0eeeb, Δ3) — use `surfaceInfoDefault` or `surfaceElevatedDisabled` in production.
- `surfaceMuted` (#f5f3f0) is exactly `bone100` — maps to `surfaceInfoLabel` in Pacific.
