# Coach Intelligence — Executive Design Plan

**Designer:** Cloris Cai
**Status:** Phase 1 prototype validated · Full roadmap proposed
**Last updated:** March 2026

---

## Executive Summary

**Coach Intelligence** is a foundational layer of the SoFi ecosystem that utilizes artificial intelligence to translate a member's real-time financial reality into a continuous, trust-based coaching journey. By weaving a coherent coaching narrative across multiple touchpoints — inside and outside the Chat — the framework ensures that every interaction a member has with SoFi Coach feels like a deliberate, personalized step toward Getting Your Money Right.

Coach Intelligence is powered by two core inputs:

- **Memory** — What Coach knows about the member: their context, preferences, life circumstances, and financial attitudes.
- **Goals** — What the member is working toward: structured commitments with targets, timelines, and real-time progress tracking.

These inputs feed a unified intelligence layer that produces **proactive insights, personalized guidance, risk alerts, milestone celebrations, and cross-surface recommendations** — not just reactive answers to questions.

The plan ships in three phases. Phase 1 (validated prototype, ready to ship) proves the core value inside Coach Chat. Phase 2 unifies memory and goals into a single knowledge model and elevates Coach Intelligence to app level. Phase 3 extends the intelligence layer across every SoFi surface.

No competitor has combined structured goals, conversational memory, and real-time multi-product financial data into a single coaching intelligence. This is SoFi's differentiation.

---

## The Problem

| Problem | Impact |
|---------|--------|
| **Session amnesia** | Coach forgets everything between sessions. Members repeat themselves. There's no continuity — no sense that Coach is getting smarter. |
| **No persistent goals** | Members have no place to set, track, or get accountability on financial goals tied to real accounts. |
| **AI opacity** | Members can't see or correct what the AI knows. In regulated finance, this is a trust and compliance liability. |
| **Reactive-only coaching** | Coach only answers questions. It never initiates based on goal risk, spending changes, or account events. The coaching feels passive, not proactive. |
| **Fragmented experience** | Personalization is trapped inside Coach Chat. The Home feed, product surfaces, and Settings don't benefit from what Coach has learned. Each surface feels like a separate app, not a coherent coaching journey. |

---

## The Vision

A member opens SoFi. Coach Intelligence already understands their priorities, remembers what they've shared, tracks their goals against real account data, and shapes every surface accordingly. Whether they're checking their balance, reviewing investments, or chatting with Coach, the experience feels like one continuous conversation — a deliberate, personalized path toward Getting Your Money Right.

Coach Intelligence is built on three ideas:

1. **Memory and goals are the same system.** A goal is a memory that has been given a target, a timeline, and progress tracking. Instead of two separate features, there's one unified knowledge layer that feeds all of Coach Intelligence.
2. **Trust scales with the member.** A single "trust dial" lets members choose how much Coach learns — from nothing to everything. The architecture is the same for everyone; the dial just controls how much of it is active.
3. **Intelligence, not just information.** Memory and goals are inputs. The output is coaching — proactive insights, contextual recommendations, risk alerts, and celebrations that connect every interaction back to what the member actually cares about.

---

## How Coach Intelligence Works

```
┌─────────────────────────────────────────────────────────┐
│                   COACH INTELLIGENCE                     │
│                                                         │
│   ┌───────────┐   ┌───────────┐   ┌──────────────────┐  │
│   │  MEMORY   │   │   GOALS   │   │ FINANCIAL REALITY│  │
│   │           │   │           │   │                  │  │
│   │ Facts     │   │ Tracked   │   │ Account data     │  │
│   │ Prefs     │   │ Suggested │   │ Transactions     │  │
│   │ Context   │   │ Completed │   │ Product usage    │  │
│   └─────┬─────┘   └─────┬─────┘   └────────┬─────────┘  │
│         │               │                   │            │
│         └───────────────┼───────────────────┘            │
│                         │                                │
│                         ▼                                │
│              ┌─────────────────────┐                     │
│              │  COACHING OUTPUTS   │                     │
│              │                     │                     │
│              │ • Proactive insights│                     │
│              │ • Risk alerts       │                     │
│              │ • Milestone moments │                     │
│              │ • Next-step actions │                     │
│              │ • Cross-product recs│                     │
│              └─────────────────────┘                     │
│                         │                                │
└─────────────────────────┼────────────────────────────────┘
                          │
          ┌───────────────┼───────────────┐
          │               │               │
          ▼               ▼               ▼
    ┌───────────┐  ┌────────────┐  ┌────────────┐
    │Coach Chat │  │ Home Feed  │  │  Product   │
    │           │  │            │  │  Surfaces  │
    └───────────┘  └────────────┘  └────────────┘
```

**Inputs** — What Coach Intelligence knows:
- **Memory:** Facts, preferences, life context, financial attitudes — accumulated from conversations, manual entry, and (later) inferred from behavior
- **Goals:** Structured commitments with targets, timelines, linked accounts, and progress tracking — created through conversation or directly
- **Financial Reality:** Real-time account balances, transaction patterns, product usage — the member's actual financial state across all SoFi products

**Outputs** — What Coach Intelligence does with it:
- **Proactive insights:** "Your dining spend is down 18% this month — you're $45 ahead on your savings goal"
- **Risk alerts:** "Your credit card balance increased $800 this week — your debt payoff goal is at risk"
- **Milestone celebrations:** "You hit 75% of your emergency fund target — at this rate, you'll reach it by August"
- **Next-step actions:** "Transfer $150 to your vault to stay on track this month"
- **Cross-product recommendations:** "You got a $3,000 bonus — here's how to split it across your emergency fund, investments, and credit card"

---

## Core Design Principles

**Cumulative value** — Every interaction makes the next one smarter. A member should feel Coach Intelligence getting better within three sessions.

**Provenance always visible** — Every piece of knowledge shows where it came from: "You told Coach," "Coach inferred," or "From your account activity." The member never wonders how Coach knows something.

**Two layers, clearly separated** — "Things I've shared" (conversational memory, declared preferences, goals) stays distinct from "Things SoFi can see" (account data, transaction patterns). The member controls the first; the second exists regardless. This keeps Coach Intelligence feeling like a trusted relationship, not corporate surveillance.

**Goals are promoted memories** — A casual intent ("I want to pay off my credit card") sits as a passive memory until the member or Coach promotes it to a tracked goal with a target, timeline, and linked account. One system, graduated commitment.

**Coaching, not just answering** — Coach Intelligence doesn't wait to be asked. It connects insights across memory, goals, and financial reality to surface the right guidance at the right moment — inside chat or outside it.

**Respect "no" completely** — Intelligence off means intelligence off. No passive collection, no dark patterns, no nagging. Coach still works as a Q&A tool — just without the coaching layer.

---

## The Trust Dial

The single most important design decision: one global setting that scales Coach Intelligence to the member's comfort level.

| Mode | Behavior | Default? |
|------|----------|----------|
| **Off** | Coach doesn't save anything between sessions. Pure Q&A. No personalization anywhere. | No |
| **Ask me first** | Coach proposes memories inline during conversation. Nothing saved without explicit approval. | **Yes — default for all members** |
| **Automatic** | Coach saves relevant context from conversations automatically. Member can review and manage anytime. | No |

"Ask me first" is the default because it's the safe middle ground: members experience cumulative value through approve/deny cycles, trust builds naturally, and no one is surprised by what Coach remembers.

Goals work in all three modes. Even with intelligence off, a member can manually create and track a goal. The trust dial governs whether Coach *learns from conversations* — not whether structured goal tracking is available.

---

## The Unified Knowledge Model

Every piece of member context is a **knowledge item** within Coach Intelligence. The data model is the same; what varies is the item's type, source, and tracking state.

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

A member can enter at any point: save a memory from chat, create a goal directly, or let Coach propose the full chain. Coach Intelligence uses all of these — alongside real-time financial data — to generate its coaching outputs.

---

## Member Categories

Knowledge items are organized by what they say about the member:

| Category | What it captures | Examples |
|----------|-----------------|----------|
| **About Me** | Identity, life context, factual information | "Self-employed," "Expecting a baby in March," "Household income ~$120K" |
| **Preferences** | How they like to interact and their financial attitudes | "Prefers detailed breakdowns," "Comfortable with moderate risk" |
| **Priorities** | What they're working toward — including tracked goals | "Building emergency fund is top priority," "Save $60K by Dec 2027" |

This three-category model groups by *what kind of thing it is about the member*: who they are, how they like to engage, and what they're working toward. It's simple enough for members to understand and scan, while still allowing finer-grained backend tagging for Coach Intelligence's retrieval.

---

## Information Architecture

### Member-Facing Surfaces

| Surface | Coach Intelligence role | Phase |
|---------|----------------------|-------|
| **Coach Chat** | Primary creation path. Conversations generate memories and goals. Coach Intelligence powers personalized responses, proactive insights, and coaching outputs. | 1 |
| **Profile Hub** (in App Settings) | Single place to view, edit, and manage all knowledge items that feed Coach Intelligence. Replaces separate Memory Center and Goals Dashboard. | 2 |
| **Home Feed** | Coach Intelligence surfaces personalized cards, goal progress widgets, and contextual recommendations based on the member's full profile. | 3 |
| **Product Surfaces** (Invest, Banking, Lending) | Coach Intelligence provides relevant context to each product. Invest sees risk tolerance and retirement timeline; Banking sees spending goals and savings targets. | 3 |

### Control Hierarchy

| Level | What it controls | Surface | Phase |
|-------|-----------------|---------|-------|
| **Global — Trust Dial** | How Coach learns: Off / Ask First / Automatic | App Settings | 1 |
| **Per-Category** | Toggle categories on/off (e.g., "Don't remember my financial details") | Profile Hub | 2 |
| **Per-Item** | Edit, pause, resume, delete individual knowledge items | Profile Hub + Chat | 1 |
| **Per-Surface** | Where Coach Intelligence is active (e.g., "Don't personalize Home feed") | App Settings | 3 |
| **Session** | Temporary Chat mode — Coach Intelligence paused for this conversation | Chat | 2 |

---

## Phased Roadmap

### Phase 1 — Validate Coach Intelligence in Chat *(prototype complete)*

**Scope:** Memory and goals as separate features powering Coach Intelligence within Coach Chat only.

**What ships:**
- Memory Center with search, category filters, inline edit/pause/delete, manual add
- Goals Dashboard with progress rings, milestones, suggested goals, confidence indicators
- Three-mode trust dial (Off / Ask Me First / Automatic)
- Chat History with search and monthly grouping
- Coach Intelligence outputs: proactive weekly recaps, goal-aware responses, risk alerts, milestone celebrations
- Seven demo scenarios covering cold start, memory lifecycle, goal discovery, risk alerts, milestone celebration, weekly recap

**Entry points:** Brain icon and clock icon in chat header; Settings accessible via overflow menu in chat header.

**What this validates:** Do members want Coach to remember them? Do they engage with goals? Does cumulative personalization drive return usage? Does the trust dial give cautious members enough control?

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

### Phase 2 — Unify and Elevate Coach Intelligence

**Scope:** Merge goals into memory as a unified knowledge model. Elevate Coach Intelligence from a chat feature to an app-level capability.

**What changes:**
- **One panel replaces two.** Memory Center and Goals Dashboard merge into a unified Profile Hub — the single view into everything Coach Intelligence knows. Goals are knowledge items with progress tracking — visually prominent but architecturally the same as any other memory.
- **Entry point moves up.** Profile Hub lives in App Settings with a shortcut from chat header. Coach Intelligence becomes a first-class app capability, not a chat sub-feature.
- **Promotion flow.** New UX for converting a passive memory into a tracked goal — adding a target amount, timeline, linked account. Reverse flow for completed goals reverting to archived memories.
- **Source labels.** Every knowledge item shows provenance: "You told Coach," "Coach inferred," "You added manually."
- **Per-category toggles.** Members can disable entire categories from feeding Coach Intelligence.
- **Temporary Chat mode.** Session-level privacy toggle — Coach Intelligence paused for this conversation.

**What this validates:** Does unifying memory and goals feel natural or confusing? Do members visit the Profile Hub? Does elevating to app level increase adoption or create overwhelm?

**Success criteria:**

| Metric | Target |
|--------|--------|
| Profile Hub engagement (monthly visits) | >30% of memory-enabled users |
| Goal promotion rate (intent → tracked goal) | >20% |
| Memory deletion rate | No increase vs. Phase 1 |

**Key design decisions required:**
- Profile Hub naming ("My Profile," "What Coach Knows," "Coach Intelligence"?)
- How goals retain visual prominence within a unified list (dedicated section vs. inline with badges)
- Whether completed goals auto-archive or stay visible with a completion badge

---

### Phase 3 — Coach Intelligence Across Every Surface

**Scope:** Coach Intelligence powers a coherent coaching narrative across all SoFi surfaces — every touchpoint feels like a deliberate step toward Getting Your Money Right.

**What changes:**
- **Home Feed powered by Coach Intelligence.** Knowledge items shape which cards appear. Goal progress widgets surface on the Home screen. Contextual recommendations reference member priorities. The Home screen stops being generic and starts feeling like a personalized coaching dashboard.
- **Product surface integration.** Each product surface reads from Coach Intelligence. Invest sees risk tolerance and retirement timeline. Banking highlights spending patterns tied to goals. Lending frames refinance options against debt payoff goals. The member feels recognized across the entire app, not just in chat.
- **Inferred knowledge items.** Transaction patterns and product usage generate proposed memories ("You spend ~$400/month on dining — want me to remember this?"). Subject to the trust dial and approval flow. Coach Intelligence gets smarter even outside of conversations.
- **Per-surface toggles.** Members control where Coach Intelligence is active. Each surface can be independently enabled or disabled. Full transparency, full control.
- **Proactive alerts beyond chat.** Goal risk alerts and milestone celebrations surface via Home alert zone and push notifications. Coach Intelligence reaches the member at the right moment, not just when they open chat.

**What this validates:** Does cross-surface personalization increase engagement or feel invasive? Do members opt in to personalization beyond chat? Does Coach Intelligence measurably improve financial outcomes?

**Success criteria:**

| Metric | Target |
|--------|--------|
| Cross-surface personalization opt-in | >50% of memory-enabled users |
| Home Feed engagement lift | +10% card interaction rate |
| Goal adherence improvement | +15% monthly contribution consistency |
| Memory adoption (3+ items at 30d) | >75% |
| Coach Chat return rate (7d) | +20pp |

**Key design decisions required:**
- Which product surfaces get Coach Intelligence access first (Home Feed likely first, then Invest, then Banking)
- Inferred memory approval UX — inline in the relevant surface vs. batched in Profile Hub
- Push notification frequency controls and cadence limits per goal type
- Data architecture for cross-surface reads (real-time vs. cached profile snapshots)

---

## Competitive Position

| Capability | ChatGPT | Claude | Cleo | Origin | Monarch | **SoFi Coach Intelligence** |
|------------|---------|--------|------|--------|---------|-------------------------------|
| **Goals** | No | No | Yes (gamified) | No | Yes (cleanest UI) | **Yes** |
| **Memory** | Yes (best controls) | Yes (project-scoped) | Yes (shallow) | Yes (multi-agent) | No | **Yes** |
| **Financial Data** | No | No | Shallow (read-only) | Deep (SEC-regulated) | Deep (aggregation) | **Deep (owned, real-time)** |
| **Cross-Product Intelligence** | No | No | No | No | No | **Yes** |

SoFi is the only platform that combines all four columns. The multi-product ecosystem (banking, investing, lending, credit) under one roof — with first-party, real-time account data — enables a coaching intelligence that no AI-first competitor can replicate. Others can do memory or goals. Only SoFi can weave them into a coherent financial coaching narrative across an entire product ecosystem.

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| **Trust erosion** | "Ask me first" as default. Provenance on every item. Clear separation between shared context and institutional data. Coach Intelligence feels like a trusted relationship, not surveillance. |
| **Regulatory exposure** | Per-item deletion with <24hr purge SLA. Audit trail retained. No sensitive data stored without explicit consent. Safety tiers on all AI responses. |
| **Feature complexity** | One system, not two. The trust dial is the only setting most members ever touch. Granular controls exist but aren't required. |
| **Over-personalization** | "None" case in coaching outputs — Coach Intelligence doesn't force connections when topics are unrelated. Per-surface toggles let members limit where intelligence is active. |
| **Adoption failure** | Phase 1 validates demand inside Coach Chat before investing in cross-surface infrastructure. Each phase has independent success criteria and can ship alone. |

---

## Success Metrics

**North Star:** *Goal-Adjusted Financial Improvement Score* — a composite measuring whether members with active Coach Intelligence (goals + memory enabled) are making measurable financial progress (debt reduction velocity, savings growth rate, spending alignment with stated priorities) compared to members without.

| Metric | Phase 1 Target | Phase 3 Target |
|--------|---------------|----------------|
| Memory adoption (3+ items at 30d) | >60% | >75% |
| Goal creation rate (first 3 sessions) | >40% | >55% |
| Goal adherence (monthly contribution ≥80% target) | >70% | >80% |
| Coach Chat return rate (7d) | +15pp | +20pp |
| Cross-surface intelligence opt-in | N/A | >50% |
| Incorrect memory rate (member-flagged) | <5% | <3% |

---

## References

| Resource | Link |
|----------|------|
| Phase 1 detailed spec | *Coach Memory & Goals — Phase 1 Design Plan* (companion document) |
| Replit prototype | [coach-memory-goals.replit.app](https://coach-memory-goals.replit.app) |
| Jira epic | [RDMEMB-661](https://sofiinc.atlassian.net/browse/RDMEMB-661) |
| Figma | |
| Flutter package (planned) | `flutter/feature_packages/sofi_ai_chat_memory_goals` |
