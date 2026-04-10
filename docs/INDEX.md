# SoFi Coach Chat — Documentation

All project documentation lives in this folder for easy reference.

---

| Document | Description |
|---|---|
| [FLUTTER_HANDOFF.md](./FLUTTER_HANDOFF.md) | Complete Flutter migration spec — architecture, AI integration, every component, animation, data flow, color token, and font mapped for the Flutter team |
| [DESIGN_SYSTEM_MAP.md](./DESIGN_SYSTEM_MAP.md) | Prototype-to-Pacific bridge — all color/token mappings (including alpha/opacity primitives), Tailwind correction flags, typography, spacing, shadows, icons, and component specs |
| [PHASE 1.md](./PHASE%201.md) | Memory & Goals Phase 1 design requirements — features, user flows, goal taxonomy, implementation spec, demo coverage, and open questions |
| [COACH_INTELLIGENCE.md](./COACH_INTELLIGENCE.md) | Coach intelligence design strategy — AI behavior, memory tiers, safety framework, proactive engagement, and the 70/20/10 rule |
| [WHY_LIVE_PROTOTYPE.md](./WHY_LIVE_PROTOTYPE.md) | Justification for live AI prototyping over static Figma — what we learned, tradeoffs, and why it matters |

---

### Color Token Source of Truth

The **Pacific Color Mapper skill** (`.agents/skills/pacific-color-mapper/SKILL.md`) is the authoritative reference for all 181 Pacific semantic tokens, primitive hex scales, and hex reverse-lookup tables. All docs above reference it rather than duplicating its content.

---

### Key Source Files

| File | Purpose |
|---|---|
| `constants/pacificTokens.ts` | Single source of truth for all Pacific color tokens — `pacificLight`, `pacificDark`, `pacificPrimitives` |
| `constants/pacificType.ts` | Pacific typography scale — maps TTNorms variants to `TextStyle` objects for each UI role |
| `constants/personaGoals.ts` | Per-persona goal data for all 4 demo personas — covers all goal types, tabs, and statuses |
| `constants/seededHistory.ts` | Builds each persona's chat history; uses `personaGoals.ts` via per-session `goals` override |
| `constants/theme.ts` | `lightTheme` and `darkTheme` derived from `pacificTokens.ts` — used by all components via `useTheme()` |
| `context/CoachContext.tsx` | Central state — messages, memories, goals, persona, scenario, streaming, AI calls |
