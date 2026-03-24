# SoFi Coach Chat — Documentation

All project documentation lives in this folder for easy reference.

---

| Document | Description |
|---|---|
| [FLUTTER_HANDOFF.md](./FLUTTER_HANDOFF.md) | Complete Flutter migration spec — architecture, AI integration, every component, animation, data flow, color token, and font mapped for the Flutter team |
| [DESIGN_SYSTEM_MAP.md](./DESIGN_SYSTEM_MAP.md) | Prototype-to-Pacific bridge — all color/token mappings (including alpha/opacity primitives), Tailwind correction flags, typography, spacing, shadows, icons, and component specs |
| [MEMORY_AND_GOALS.md](./MEMORY_AND_GOALS.md) | Memory & Goals design requirements — features, user flows, implementation spec, demo coverage, and open questions |
| [WHY_LIVE_PROTOTYPE.md](./WHY_LIVE_PROTOTYPE.md) | Justification for live AI prototyping over static Figma — what we learned, tradeoffs, and why it matters |

### Color Token Source of Truth

The **Pacific Color Mapper skill** (`.agents/skills/pacific-color-mapper/SKILL.md`) is the authoritative reference for all 181 Pacific semantic tokens, primitive hex scales, and hex reverse-lookup tables. All docs above reference it rather than duplicating its content.
