# SoFi Personalization Platform — Memory & Goals

**Executive Design Plan**
**Designer:** Cloris Cai
**Status:** Phase 1 prototype validated · Full roadmap proposed
**Last updated:** March 2026

---

## Executive Summary

SoFi Coach is evolving from a stateless Q&A tool into a persistent financial partner. This plan describes how **memory** (what Coach knows about a member) and **goals** (what a member is working toward) become a single, app-level personalization platform — not just a chat feature.

The plan ships in three phases. Phase 1 (validated prototype, ready to ship) proves the core value inside Coach Chat. Phase 2 unifies memory and goals into one system. Phase 3 extends personalization across every SoFi surface.

No competitor has combined structured goals, conversational memory, and real-time multi-product financial data in one experience. This is SoFi's differentiation.

---

## The Problem

| Problem | Impact |
|---------|--------|
| **Session amnesia** | Coach forgets everything between sessions. Members repeat themselves. There's no continuity. |
| **No persistent goals** | Members have no place to set, track, or get accountability on financial goals tied to real accounts. |
| **AI opacity** | Members can't see or correct what the AI knows. In regulated finance, this is a trust and compliance liability. |
| **Reactive-only coaching** | Coach only answers questions. It never initiates based on goal risk, spending changes, or account events. |
| **One-surface limitation** | Personalization is trapped inside Coach Chat. The Home feed, product surfaces, and Settings don't benefit from what Coach has learned. |

---

## The Vision

A member opens SoFi. The app already knows their priorities, remembers what they've shared with Coach, tracks their goals against real account data, and personalizes every surface accordingly. The member controls exactly how much the app knows and where that knowledge is used.

This is built on two simple ideas:

1. **Memory and goals are the same system.** A goal is a memory that has been given a target, a timeline, and progress tracking. Instead of two separate features, there's one unified knowledge layer.
2. **Trust scales with the member.** A single "trust dial" lets members choose how much the AI learns — from nothing to everything. The architecture is the same for everyone; the dial just controls how much of it is active.

---

## Core Design Principles

**Cumulative value** — Every interaction makes the next one more useful. A member should feel the difference within three sessions.

**Provenance always visible** — Every piece of knowledge shows where it came from: "You told Coach," "Coach inferred," or "From your account activity." The member never wonders how the AI knows something.

**Two layers, clearly separated** — "Things I've shared" (conversational memory, declared preferences, goals) stays distinct from "Things SoFi can see" (account data, transaction patterns). The member controls the first; the second exists regardless. This keeps the AI relationship feeling like a trusted assistant, not corporate data collection.

**Goals are promoted memories** — A casual intent ("I want to pay off my credit card") sits as a passive memory until the member or Coach promotes it to a tracked goal with a target, timeline, and linked account. One system, one panel, graduated commitment.

**Respect "no" completely** — Memory off means memory off. No passive collection, no dark patterns, no nagging. Coach still works — just without personalization.

---

## The Trust Dial

The single most important design decision: one global setting that scales the entire system to the member's comfort level.

| Mode | Behavior | Default? |
|------|----------|----------|
| **Off** | Coach doesn't save anything between sessions. Pure Q&A. No personalization anywhere. | No |
| **Ask me first** | Coach proposes memories inline during conversation. Nothing saved without explicit approval. | **Yes — default for all members** |
| **Automatic** | Coach saves relevant context from conversations automatically. Member can review and manage anytime. | No |

"Ask me first" is the default because it's the safe middle ground: members experience cumulative value through approve/deny cycles, trust builds naturally, and no one is surprised by what Coach remembers.

Goals work in all three modes. Even with memory off, a member can manually create and track a goal. The trust dial governs whether Coach *learns from conversations* — not whether structured goal tracking is available.

---

## The Unified Knowledge Model

Every piece of member context is a **knowledge item**. The data model is the same; what varies is the item's type, source, and tracking state.

| Type | Example | Tracking | Source |
|------|---------|----------|--------|
| **Fact** | "Household income ~$120K" | None | Conversation |
| **Preference** | "Prefers ETFs over individual stocks" | None | Conversation or inferred |
| **Intent** | "Wants to buy a house" | None (yet) | Conversation |
| **Tracked Goal** | "Save $60K for down payment by Dec 2027" | Progress ring, milestones, confidence | Promoted from intent |
| **Completed Goal** | "Paid off credit card, Dec 2026" | Completion record | Reverted from tracked goal |

The promotion lifecycle:

```
Conversation → Memory (passive) → Goal (tracked) → Completed (archived)
```

A member can enter at any point: save a memory from chat, create a goal directly, or let Coach propose the full chain.

---

## Member Categories

Knowledge items are organized by what they say about the member:

| Category | What it captures | Examples |
|----------|-----------------|----------|
| **About Me** | Identity, life context, factual information | "Self-employed," "Expecting a baby in March," "Household income ~$120K" |
| **Preferences** | How they like to interact and their financial attitudes | "Prefers detailed breakdowns," "Comfortable with moderate risk" |
| **Priorities** | What they're working toward — including tracked goals | "Building emergency fund is top priority," "Save $60K by Dec 2027" |

This three-category model groups by *what kind of thing it is about the member*: who they are, how they like to engage, and what they're working toward. It's simple enough for members to understand and scan, while still allowing finer-grained backend tagging for retrieval.

---

## Information Architecture

### Member-Facing Surfaces

| Surface | Role | Phase |
|---------|------|-------|
| **Coach Chat** | Primary creation path. Conversations generate memories. Coach proposes goals. All personalization powered by the knowledge layer. | 1 |
| **Profile Hub** (in App Settings) | Single place to view, edit, and manage all knowledge items. Replaces separate Memory Center and Goals Dashboard. | 2 |
| **Home Feed** | Personalized cards based on member profile. Goal progress widgets. Contextual recommendations. | 3 |
| **Product Surfaces** (Invest, Banking, Lending) | Read relevant knowledge items to personalize product experiences. Invest sees risk tolerance; Banking sees spending goals. | 3 |

### Control Hierarchy

| Level | What it controls | Surface | Phase |
|-------|-----------------|---------|-------|
| **Global — Trust Dial** | How Coach learns: Off / Ask First / Automatic | App Settings | 1 |
| **Per-Category** | Toggle categories on/off (e.g., "Don't remember my financial details") | Profile Hub | 2 |
| **Per-Item** | Edit, pause, resume, delete individual knowledge items | Profile Hub + Chat | 1 |
| **Per-Surface** | Where knowledge is used for personalization (e.g., "Don't personalize Home feed") | App Settings | 3 |
| **Session** | Temporary Chat mode — no memory read/write for this session | Chat | 2 |

---

## Phased Roadmap

### Phase 1 — Validate in Coach Chat *(prototype complete)*

**Scope:** Memory and goals as separate features, scoped to Coach Chat only.

**What ships:**
- Memory Center with search, category filters, inline edit/pause/delete, manual add
- Goals Dashboard with progress rings, milestones, suggested goals, confidence indicators
- Three-mode trust dial (Off / Ask Me First / Automatic)
- Chat History with search and monthly grouping
- Seven demo scenarios covering cold start, memory lifecycle, goal discovery, risk alerts, milestone celebration, weekly recap

**Entry points:** Brain icon and clock icon in chat header; Settings accessible via overflow menu in chat header.

**Success criteria:**

| Metric | Target |
|--------|--------|
| Memory adoption (3+ items at 30d) | >60% |
| Goal creation rate (first 3 sessions) | >40% |
| Goal adherence (monthly contribution ≥80% target) | >70% |
| Coach Chat return rate (7d) | +15pp vs. non-memory |
| Incorrect memory rate (member-flagged) | <5% |

**Detailed spec:** See *Coach Memory & Goals — Phase 1 Design Plan* (companion document) for component tables, prototype architecture, animation details, and open questions.

---

### Phase 2 — Unify and Elevate

**Scope:** Merge goals into memory as a unified knowledge model. Elevate access from chat to app level.

**What changes:**
- **One panel replaces two.** Memory Center and Goals Dashboard merge into a unified Profile Hub. Goals are knowledge items with progress tracking — visually prominent but architecturally the same as any other memory.
- **Entry point moves up.** Profile Hub lives in App Settings with a shortcut from chat header. Memory becomes a first-class app feature, not a chat sub-feature.
- **Promotion flow.** New UX for converting a passive memory into a tracked goal — adding a target amount, timeline, linked account. Reverse flow for completed goals reverting to archived memories.
- **Source labels.** Every knowledge item shows provenance: "You told Coach," "Coach inferred," "You added manually."
- **Per-category toggles.** Members can disable entire categories (e.g., "Don't remember financial details").
- **Temporary Chat mode.** Session-level privacy toggle — Coach doesn't read or write memory for this conversation.

**Success criteria:**

| Metric | Target |
|--------|--------|
| Profile Hub engagement (monthly visits) | >30% of memory-enabled users |
| Goal promotion rate (intent → tracked goal) | >20% |
| Memory deletion rate | No increase vs. Phase 1 |

**Key design decisions required:**
- Profile Hub naming ("My Profile," "What Coach Knows," "Financial Profile"?)
- How goals retain visual prominence within a unified list (dedicated section vs. inline with badges)
- Whether completed goals auto-archive or stay visible with a completion badge

---

### Phase 3 — Cross-Surface Personalization

**Scope:** The knowledge layer powers personalization across all SoFi surfaces, not just Coach Chat.

**What changes:**
- **Home Feed personalization.** Knowledge items shape which cards appear. Goal progress widgets surface on the Home screen. Contextual recommendations reference member priorities.
- **Product surface integration.** Invest reads risk tolerance and retirement timeline. Banking highlights spending patterns tied to goals. Lending frames refinance options against debt payoff goals.
- **Inferred knowledge items.** Transaction patterns generate proposed memories ("You spend ~$400/month on dining — want me to remember this?"). Subject to the trust dial and approval flow.
- **Per-surface toggles.** Members control which surfaces use their profile for personalization. Each can be independently enabled or disabled.
- **Proactive alerts.** Goal risk alerts and milestone celebrations surface via Home alert zone and push notifications, not just in-chat.

**Success criteria:**

| Metric | Target |
|--------|--------|
| Cross-surface personalization opt-in | >50% of memory-enabled users |
| Home Feed engagement lift | +10% card interaction rate |
| Goal adherence improvement | +15% monthly contribution consistency |
| Memory adoption (3+ items at 30d) | >75% |
| Coach Chat return rate (7d) | +20pp |

**Key design decisions required:**
- Which product surfaces get read access first (Home Feed likely first, then Invest, then Banking)
- Inferred memory approval UX — inline in the relevant surface vs. batched in Profile Hub
- Push notification frequency controls and cadence limits per goal type
- Data architecture for cross-surface reads (real-time vs. cached profile snapshots)

---

## Competitive Position

| Capability | ChatGPT | Claude | Cleo | Origin | Monarch | **SoFi (Phase 3)** |
|------------|---------|--------|------|--------|---------|---------------------|
| **Goals** | No | No | Yes (gamified) | No | Yes (cleanest UI) | **Yes** |
| **Memory** | Yes (best controls) | Yes (project-scoped) | Yes (shallow) | Yes (multi-agent) | No | **Yes** |
| **Financial Data** | No | No | Shallow (read-only) | Deep (SEC-regulated) | Deep (aggregation) | **Deep (owned, real-time)** |
| **Cross-Product** | No | No | No | No | No | **Yes** |

SoFi is the only platform that combines all four. The multi-product ecosystem (banking, investing, lending, credit) under one roof — with first-party, real-time account data — enables cross-product personalization that no AI-first competitor can replicate.

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| **Trust erosion** | "Ask me first" as default. Provenance on every item. Clear separation between shared context and institutional data. |
| **Regulatory exposure** | Per-item deletion with <24hr purge SLA. Audit trail retained. No sensitive data stored without explicit consent. Safety tiers on all AI responses. |
| **Feature complexity** | One system, not two. The trust dial is the only setting most members ever touch. Granular controls exist but aren't required. |
| **Over-personalization** | "None" case in goal-aware responses — Coach doesn't force connections when topics are unrelated. Per-surface toggles let members limit where personalization appears. |
| **Adoption failure** | Phase 1 validates demand inside Coach Chat before investing in cross-surface infrastructure. Each phase has independent success criteria and can ship alone. |

---

## References

| Resource | Link |
|----------|------|
| Phase 1 detailed spec | *Coach Memory & Goals — Phase 1 Design Plan* (companion document) |
| Replit prototype | [coach-memory-goals.replit.app](https://coach-memory-goals.replit.app) |
| Jira epic | [RDMEMB-661](https://sofiinc.atlassian.net/browse/RDMEMB-661) |
| Figma | |
| Flutter package (planned) | `flutter/feature_packages/sofi_ai_chat_memory_goals` |
