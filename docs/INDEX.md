# SoFi Coach Chat — Documentation

All project documentation lives in this folder for easy reference.

---

| Document | Description |
|---|---|
| [FLUTTER_HANDOFF.md](./FLUTTER_HANDOFF.md) | Flutter migration reference — every component, animation, data flow, color token, and font mapped for the Flutter team |
| [DESIGN_SYSTEM_MAP.md](./DESIGN_SYSTEM_MAP.md) | Prototype-to-Pacific bridge — component-level color/token mapping with UI usage context, typography, spacing, icons |
| [PACIFIC_COLOR_TOKENS.md](./PACIFIC_COLOR_TOKENS.md) | Alpha/opacity token reference — `rgba()` primitives not covered in the mapper skill |
| [MEMORY_AND_GOALS.md](./MEMORY_AND_GOALS.md) | Memory & Goals design requirements — features, user flows, implementation spec, demo coverage |
| [WHY_LIVE_PROTOTYPE.md](./WHY_LIVE_PROTOTYPE.md) | Justification for live AI prototyping over static Figma — what we learned and why it matters |

### Color Token Source of Truth

The **Pacific Color Mapper skill** (`.agents/skills/pacific-color-mapper/SKILL.md`) is the authoritative reference for all 181 Pacific semantic tokens, primitive hex scales, and hex reverse-lookup tables. All docs above reference it rather than duplicating its content.
