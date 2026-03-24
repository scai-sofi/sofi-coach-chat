# Pacific Alpha / Opacity Tokens

Prototype `rgba()` values mapped to Pacific alpha primitives for Flutter migration.

**Full Pacific reference:** `.agents/skills/pacific-color-mapper/SKILL.md` (all 181 semantic tokens, primitive hex scales, hex reverse-lookup)
**Migration map (prototype → Pacific):** `docs/DESIGN_SYSTEM_MAP.md` §1.1 (every `colors.ts` entry with Tailwind flags and correct Pacific hex)

---

## Alpha / Opacity Primitives

These appear as `rgba()` in code and are NOT in the mapper skill's semantic token list. Pacific names them with suffixes like `010Pct`, `016Pct`, `050Pct`, etc.

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

## Key Distinction: surfaceEdge

Our prototype `surfaceEdge` = `rgba(10,10,10, 0.10)` → maps to `strokeDividePrimary` (`bone100010Pct`)

Pacific's `surfaceEdge` = `rgba(10,10,10, 0.16)` → `bone100016Pct` (heavier)

Flutter must use the correct Pacific semantic token based on intent, not our prototype name.
