# Coach Intelligence — Executive Design Plan

**Designer:** Cloris Cai
**Status:** Phase 1 prototype validated · Full roadmap proposed
**Last updated:** March 2026

---

## Executive Summary

**Coach Intelligence** is the foundational layer that translates a member's financial reality into a continuous, trust-based coaching journey. It weaves a coherent coaching narrative across every SoFi touchpoint — inside and outside Chat — so that every interaction feels like a deliberate, personalized step toward Getting Your Money Right.

Coach Intelligence is powered by three inputs:

- **Memory** — What Coach knows about the member: their context, preferences, life circumstances, and financial attitudes.
- **Goals** — What the member is working toward: structured commitments with targets, timelines, and real-time progress tracking.
- **Financial Reality** — The member's actual financial state: real-time account balances, transaction patterns, and product usage across all SoFi products.

These inputs produce two kinds of output. *Reactively*, Coach Intelligence makes every chat response smarter by grounding answers in the member's full context. *Proactively*, it surfaces insights, nudges, and interventions through a calibrated 70/20/10 engagement framework — trust-building FYIs (70%), optimization nudges (20%), and high-conviction interventions that protect the member's critical path (10%).

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

## What Members Told Us

User research and broader market data reveal a clear set of tensions that Coach Intelligence must navigate. These aren't edge cases — they're the core design constraints.

| What we heard | Design implication |
|---------------|-------------------|
| **"Help me see around corners"** — Members want AI that solves real money problems: keeping up with policy changes, avoiding overspending, saving more. | Coach Intelligence must lead with tangible financial value, not AI novelty. Every output should answer "how does this help my money?" |
| **Accuracy is non-negotiable** — The quality bar for AI from a bank is extremely high. Members expect data-grounded answers and easy escalation to a human when needed. | Every Coach Intelligence output must be traceable to real data. When confidence is low, Coach says so and offers a human path. |
| **Coach = support, not destination** — Many members interpret "Ask Coach" as customer service chat. They see AI as an extension of support and education, not a standalone product. | Coach Intelligence should be embedded in existing flows, not require members to navigate to a separate AI surface. The best coaching happens where the member already is. |
| **"Put it everywhere"** — Members want Coach accessible throughout the app so they don't have to navigate back and forth. | Cross-surface presence (Phase 3) isn't a nice-to-have — it's a member expectation. The phased rollout should acknowledge this tension: we're shipping chat-first for validation, not because members want it siloed. |
| **Comfort levels vary widely** — Attitudes range from AI-skeptical to AI-enthusiastic, with experience level and generational factors driving the spread. Gen Z/Millennials show highest interest in AI for financial advice. | One-size-fits-all won't work. The trust spectrum must accommodate skeptics who want full control and enthusiasts who want Coach to just handle it. |
| **Value over buzz** — Members prefer simple, useful features. Not everything needs to be branded as "AI." Market the feature value, not the technology. | "Coach Intelligence" is an internal framework name. Members should never see it. They should just notice that SoFi keeps getting more useful. |
| **Human, not robotic** — AI should feel human yet be demonstrably accurate and know when to hand off. | Coach's tone is warm and direct. It shows its work (provenance, data sources). It never pretends to know something it doesn't. |
| **Guidance, not autopilot** — Good fit for insights, education, and guidance. Strong aversion to fully automated proposals without transparency and control. | Coach Intelligence presents options, not decisions. Must/Should-do moments always show the reasoning and offer choices — never auto-execute. |

---

## The Vision

A member opens SoFi and the app already works harder for them. It remembers what they've shared with Coach, tracks their goals against real account data, and helps them see around corners — surfacing the insights, optimizations, and warnings that matter for *their* situation. Whether they're checking their balance, reviewing investments, or chatting with Coach, the experience feels like one continuous relationship with a financial partner that gets smarter over time.

This isn't about AI for AI's sake. Members don't care that Coach Intelligence exists. They care that SoFi helped them avoid a fee, catch an opportunity, or stay on track for a goal they set three months ago. The technology is invisible; the value is obvious.

Coach Intelligence is built on three ideas:

1. **Memory and goals are the same system.** A goal is a memory that has been given a target, a timeline, and progress tracking. Instead of two separate features, there's one unified knowledge layer that feeds all of Coach Intelligence.
2. **Trust scales with the member.** A trust spectrum accommodates everyone — from AI-skeptical members who want full control over what Coach remembers, to enthusiasts who want Coach to just handle it. The architecture is the same; the member's comfort level controls how much of it is active.
3. **Solve real problems, not showcase technology.** Memory and goals are inputs. The output is tangible financial value — helping members see around corners, avoid overspending, save more, and stay on track. Every coaching moment must answer: "how does this help my money?"

---

## How Coach Intelligence Works

```
┌──────────────────────────────────────────────────────────────────────────┐
│                          COACH INTELLIGENCE                              │
│                                                                          │
│   ┌───────────┐   ┌───────────┐   ┌──────────────────┐                  │
│   │  MEMORY   │   │   GOALS   │   │ FINANCIAL REALITY│                  │
│   │           │   │           │   │                  │                  │
│   │ Facts     │   │ Tracked   │   │ Account data     │                  │
│   │ Prefs     │   │ Suggested │   │ Transactions     │                  │
│   │ Context   │   │ Completed │   │ Product usage    │                  │
│   └─────┬─────┘   └─────┬─────┘   └────────┬─────────┘                  │
│         │               │                   │                            │
│         └───────────────┼───────────────────┘                            │
│                         │                                                │
│              ┌──────────┴──────────┐                                     │
│              │                     │                                     │
│              ▼                     ▼                                     │
│   ┌──────────────────┐  ┌──────────────────────────────────────────┐    │
│   │    REACTIVE       │  │      PROACTIVE ENGAGEMENT (70/20/10)    │    │
│   │                   │  │                                          │    │
│   │ Personalized chat │  │  ┌────────┐  ┌──────────┐  ┌─────────┐ │    │
│   │ responses shaped  │  │  │ FYIs   │  │ Could dos│  │Must dos │ │    │
│   │ by member context │  │  │ (70%)  │  │  (20%)   │  │ (10%)   │ │    │
│   └────────┬─────────┘  └──────────────────┬───────────────────────┘    │
│            │                               │                            │
└────────────┼───────────────────────────────┼────────────────────────────┘
             │               ┌───────────────┼───────────────┐
             │               │               │               │
             ▼               ▼               ▼               ▼
       ┌─────────────┐  ┌────────────┐  ┌────────────┐
       │ Coach Chat  │  │ Home Feed  │  │  Product   │
       │ (both)      │  │            │  │  Surfaces  │
       └─────────────┘  └────────────┘  └────────────┘
```

### Inputs — What Coach Intelligence knows

- **Memory:** Facts, preferences, life context, financial attitudes — accumulated from conversations, manual entry, and (later) inferred from behavior
- **Goals:** Structured commitments with targets, timelines, linked accounts, and progress tracking — created through conversation or directly
- **Financial Reality:** Real-time account balances, transaction patterns, product usage — the member's actual financial state across all SoFi products

### Outputs — How Coach Intelligence delivers value

Coach Intelligence produces two kinds of output:

**1. Personalized chat responses** — When a member asks Coach a question, Coach Intelligence shapes the answer using everything it knows: memory, goals, and financial reality. Instead of generic advice, the response is grounded in the member's actual situation. This is the *reactive* output — the member initiates, and Coach Intelligence makes the answer smarter.

**2. Proactive engagement** — Coach Intelligence doesn't wait to be asked. It surfaces insights, nudges, and interventions across every touchpoint — chat, Home feed, product surfaces, notifications. This is the *proactive* output, governed by the 70/20/10 Engagement Framework below.

### The 70/20/10 Engagement Framework

Proactive engagement follows a calibrated ratio that ensures the right intensity at the right moment. Not every insight carries the same weight — the framework prevents Coach from overwhelming members while building the trust required for higher-stakes interventions.

#### Trust-Builders — "FYIs" (70%)

Educational or advisory insights that serve as low-stakes, high-value touchpoints, anchoring the member's relationship with SoFi as their financial home base. These build trust through consistent, useful context — not by asking the member to do anything.

| Format | Example |
|--------|---------|
| **Macro-to-micro translator** | A rate change occurs → Coach explains how it impacts *this member's* mortgage or savings yield |
| **Insights tooltip** | Coach tooltips embedded within trends, modules, or rows — timely, contextually relevant education |
| **Weekly brief — Market & Money Pulse** | A personalized weekly summary connecting market movements to the member's portfolio and goals |

*Why 70%: Trust is the foundation. Most interactions should make the member smarter about their own money without asking anything of them. This is how Coach earns the right to nudge.*

#### Optimization Ideas — "Could dos" (20%)

Precision nudges designed to capture incremental gains or stop value leaks within a member's current financial flow. These are efficiency plays where a feature engagement or product activation occurs as a logical byproduct of making the member's money work harder.

| Format | Example |
|--------|---------|
| **Home Insights — Optimizations** | "You have $2,400 sitting in checking earning 0.01% — moving it to your vault would earn $86/year" |
| **Smart chips on welcome screen** | Quick-action suggestions based on recent activity and goal state |
| **In-line contextual tips** | Insights and actions appearing exactly where the member is already looking at their data |
| **Weekly brief — Optimization Ideas** | Personalized suggestions for making money work harder, tied to current account state |

*Why 20%: These nudges only land when trust is already established. Coach Intelligence earns the right to suggest through consistent FYIs first. Each "could do" connects directly to the member's stated priorities — never generic upselling.*

#### Readiness Moments — "Must/Should dos" (10%)

High-conviction, high-urgency interventions reserved for critical path course corrections or major life milestones. Surfaced only when the member is on a path toward a negative outcome or entering a transformative life stage that requires structural change. These act as protective guardrails that keep the member on the critical path to their long-term financial goals.

| Format | Example |
|--------|---------|
| **Critical path course-correction** | "Your debt-to-income ratio has been trending up for 3 months — at this pace, it will impact your credit within 60 days. Here are three options." |
| **Big milestones** | Coach detects a fundamental shift in the member's reality (new job, new baby, home purchase) and surfaces structural recommendations |

*Why 10%: These are the moments that matter most — and the easiest to get wrong. Overusing urgency erodes trust. Coach Intelligence reserves high-intensity interventions for situations where inaction has real financial consequences, backed by data the member can verify.*

#### How the tiers connect

The 70/20/10 ratio is a design guardrail, not a rigid formula. The key principle: **Coach Intelligence earns intensity through consistency.** A member who has received weeks of useful FYIs trusts a "could do" nudge. A member who trusts "could do" nudges will act on a "must do" moment. Skip the trust-building, and the high-conviction interventions feel like spam.

Each tier draws on the same inputs (memory, goals, financial reality) but applies different thresholds:
- **FYIs** fire on any relevant context — low threshold, high frequency
- **Could dos** fire when there's a quantifiable optimization — medium threshold, moderate frequency
- **Must/Should dos** fire only on high-conviction triggers with verifiable data — high threshold, rare frequency

---

## Core Design Principles

**Cumulative value** — Every interaction makes the next one smarter. A member should feel Coach getting better within three sessions. This is the core promise: it's worth sharing context because the payoff compounds.

**Invisible technology, obvious value** — "Coach Intelligence" is never visible to the member. They don't interact with a "personalization engine" — they just notice that SoFi keeps getting more useful. Feature value first, technology never.

**Provenance always visible** — Every piece of knowledge shows where it came from: "You told Coach," "Coach inferred," or "From your account activity." Members trust what they can verify. In regulated finance, opacity is a liability.

**Two layers, clearly separated** — "Things I've shared" (conversational memory, declared preferences, goals) stays distinct from "Things SoFi can see" (account data, transaction patterns). The member controls the first; the second exists regardless. This keeps the experience feeling like a trusted relationship, not corporate data collection.

**Goals are promoted memories** — A casual intent ("I want to pay off my credit card") sits as a passive memory until the member or Coach promotes it to a tracked goal with a target, timeline, and linked account. One system, graduated commitment.

**Guidance, not automation** — Coach presents options, not decisions. Even in high-conviction Must/Should-do moments, the member always sees the reasoning and chooses the action. No auto-execution, no opaque recommendations. Members told us they want insights and education, not an autopilot they can't see into.

**Coaching, not just answering** — Coach works in two modes. *Reactively*, it makes every chat response smarter by grounding answers in the member's full context. *Proactively*, it surfaces insights, nudges, and interventions through a calibrated 70/20/10 engagement framework. Both modes draw from the same inputs; the difference is who initiates.

**Human handoff built in** — Coach knows when to step aside. When confidence is low, when a question involves account-specific actions Coach can't take, or when the member asks to talk to a person, the path to a human specialist is immediate and frictionless. This isn't a fallback — it's a feature. Research showed that easy human escalation is non-negotiable for trust.

**Warm, direct, shows its work** — Coach's tone is human and conversational, but never vague. It cites specific numbers, references the member's actual data, and says "I'm not sure" when it isn't. The bar for a bank is higher than for a general-purpose AI — members expect demonstrable accuracy, not confident guessing.

**Respect "no" completely** — Intelligence off means intelligence off. No passive collection, no dark patterns, no nagging. Coach still works as a Q&A tool — just without the coaching layer.

---

## The Trust Spectrum

The single most important design decision: one setting that scales Coach to the member's comfort level. Research shows comfort with AI varies widely — from members who want full control over every piece of saved context to those who want Coach to just handle it. Instead of treating this as a binary, the trust spectrum meets each member where they are.

| Mode | Who it's for | Behavior | Default? |
|------|-------------|----------|----------|
| **Just answers** | The skeptic — wants Coach to be useful right now, doesn't want it remembering anything | Coach doesn't save anything between sessions. Pure Q&A. No personalization anywhere. | No |
| **I'll decide** | The pragmatist — sees the value of Coach remembering, but wants to approve each piece | Coach proposes memories inline during conversation. Nothing saved without explicit approval. | **Yes — default for all members** |
| **Learn as we go** | The enthusiast — wants Coach to get smarter automatically, will review when they feel like it | Coach saves relevant context from conversations automatically. Member can review and manage anytime. | No |

"I'll decide" is the default because it maps to what research showed: members are open to AI with pragmatism. They see the potential, but they want to stay in control. The approve/deny cycle lets trust build naturally — every approval is an explicit signal that the member finds value in Coach remembering.

Goals work in all three modes. Even in "just answers" mode, a member can manually create and track a goal. The trust spectrum governs whether Coach *learns from conversations* — not whether structured goal tracking is available.

**How the trust spectrum interacts with the engagement framework:**

| Mode | Reactive output (chat) | Proactive output (70/20/10) |
|------|----------------------|----------------------------|
| **Just answers** | Generic responses — no memory or goal context | No proactive engagement. Coach never initiates. |
| **I'll decide** | Responses use approved memories and goals | Proactive engagement scales with what the member has approved. More approvals → richer FYIs, sharper nudges. |
| **Learn as we go** | Full context — all memories and goals shape every response | Full engagement framework active. All three tiers fire based on the member's complete profile. |

The trust spectrum controls the *depth* of Coach's inputs. The 70/20/10 framework controls the *intensity* of its proactive outputs. Both scale together: a member with a thin profile gets fewer, lighter-touch FYIs; a member with a rich profile gets the full range.

**Natural migration:** The system is designed so members naturally move along the spectrum as trust builds. A skeptic who starts with "just answers" and sees useful responses may try "I'll decide." A pragmatist who tires of approving every memory may switch to "learn as we go." The architecture never changes — only the member's comfort level dial.

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

**Key design constraint:** Research shows members see Coach as an extension of support and education, not a standalone destination. Many interpret "Ask Coach" as customer service chat. This means Coach Intelligence must be *embedded* — its outputs appear where members already are (Home feed, product pages, in-chat), not behind a navigation path to "the AI feature." The IA below reflects this: Coach Chat is the primary creation path, but the value radiates outward to every surface the member already visits.

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
| **Global — Trust Spectrum** | How Coach learns: Just Answers / I'll Decide / Learn As We Go | App Settings | 1 |
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
- Three-mode trust spectrum (Just Answers / I'll Decide / Learn As We Go)
- Chat History with search and monthly grouping
- Reactive output: goal-aware and memory-aware chat responses grounded in member context
- Proactive output (chat-scoped): weekly recaps (FYI tier), spending optimization tips (Could do tier), goal risk alerts and milestone celebrations (Must/Should do tier)
- Seven demo scenarios covering cold start, memory lifecycle, goal discovery, risk alerts, milestone celebration, weekly recap

**Entry points:** Brain icon and clock icon in chat header; Settings accessible via overflow menu in chat header.

**What this validates:** Do members want Coach to remember them? Do they engage with goals? Does cumulative personalization drive return usage? Does the trust spectrum give skeptics enough control while letting enthusiasts opt in deeper?

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
- **The full 70/20/10 framework goes cross-surface.** In Phase 1, proactive engagement is limited to chat. In Phase 3, all three tiers — FYIs, Could dos, and Must/Should dos — reach the member through every surface: Home feed cards, product surface tooltips, and push notifications. The engagement framework becomes the unified language for how Coach Intelligence communicates everywhere.
- **Home Feed powered by Coach Intelligence.** Knowledge items shape which cards appear. Goal progress widgets surface on the Home screen. FYI-tier insights (macro-to-micro translators, market pulse) and Could-do nudges (optimization ideas, smart chips) appear as Home cards. The Home screen stops being generic and starts feeling like a personalized coaching dashboard.
- **Product surface integration.** Each product surface reads from Coach Intelligence. Invest sees risk tolerance and retirement timeline. Banking highlights spending patterns tied to goals. Lending frames refinance options against debt payoff goals. In-line contextual tips (Could-do tier) appear exactly where the member is already looking at their data.
- **Inferred knowledge items.** Transaction patterns and product usage generate proposed memories ("You spend ~$400/month on dining — want me to remember this?"). Subject to the trust spectrum and approval flow. Coach Intelligence gets smarter even outside of conversations.
- **Per-surface toggles.** Members control where Coach Intelligence is active. Each surface can be independently enabled or disabled. Full transparency, full control.
- **Must/Should-do moments beyond chat.** Critical path course-corrections and big milestone interventions surface via Home alert zone and push notifications — not just in-chat. These are the highest-conviction moments (10% tier), reserved for situations where inaction has real financial consequences.

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
| **Proactive Engagement** | No | No | Notifications only | No | Alerts only | **Calibrated 70/20/10 framework** |
| **Cross-Product Intelligence** | No | No | No | No | No | **Yes** |

SoFi is the only platform that combines all five rows. Others can do memory or goals. Others can send notifications. But no competitor has a calibrated engagement framework — one that earns the right to nudge through consistent trust-building — powered by first-party, real-time data across a multi-product financial ecosystem. That combination is what makes Coach Intelligence a moat, not a feature.

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| **Trust erosion** | "I'll decide" as default. Provenance on every item. Clear separation between shared context and institutional data. Easy human escalation at any point. |
| **Regulatory exposure** | Per-item deletion with <24hr purge SLA. Audit trail retained. No sensitive data stored without explicit consent. Safety tiers on all AI responses. |
| **Feature complexity** | One system, not two. The trust spectrum is the only setting most members ever touch. Granular controls exist but aren't required. |
| **Over-personalization** | "None" case in coaching outputs — Coach doesn't force connections when topics are unrelated. Per-surface toggles let members limit where intelligence is active. Guidance, never automation. |
| **AI-as-buzzword backlash** | Never brand member-facing features as "AI" or "intelligence." Market the value: "Coach remembers," "your weekly brief," "goal progress." Technology is invisible; utility is the selling point. |
| **Mental model mismatch** | Members see Coach as support/education, not a destination. All coaching outputs embed in existing flows — where the member already is — rather than requiring navigation to a separate AI surface. |
| **Adoption failure** | Phase 1 validates demand inside Coach Chat before investing in cross-surface infrastructure. Each phase has independent success criteria and can ship alone. |

---

## Success Metrics

**North Star:** *Goal-Adjusted Financial Improvement Score* — a composite measuring whether members with active Coach Intelligence (goals + memory enabled) are making measurable financial progress (debt reduction velocity, savings growth rate, spending alignment with stated priorities) compared to members without.

### Knowledge layer metrics

| Metric | Phase 1 Target | Phase 3 Target |
|--------|---------------|----------------|
| Memory adoption (3+ items at 30d) | >60% | >75% |
| Goal creation rate (first 3 sessions) | >40% | >55% |
| Goal adherence (monthly contribution ≥80% target) | >70% | >80% |
| Coach Chat return rate (7d) | +15pp | +20pp |
| Cross-surface intelligence opt-in | N/A | >50% |
| Incorrect memory rate (member-flagged) | <5% | <3% |

### Engagement framework metrics

| Metric | Phase 1 Target | Phase 3 Target |
|--------|---------------|----------------|
| FYI engagement rate (opened or expanded) | >25% | >40% |
| Could-do nudge action rate (member acts on suggestion) | >10% | >18% |
| Must/Should-do response rate (member engages within 48h) | >50% | >65% |
| Proactive engagement dismissal rate | <40% | <30% |
| Engagement tier ratio (actual vs. 70/20/10 target) | Within ±15pp | Within ±10pp |

---

## References

| Resource | Link |
|----------|------|
| Phase 1 detailed spec | *Coach Memory & Goals — Phase 1 Design Plan* (companion document) |
| Replit prototype | [coach-memory-goals.replit.app](https://coach-memory-goals.replit.app) |
| Jira epic | [RDMEMB-661](https://sofiinc.atlassian.net/browse/RDMEMB-661) |
| Figma | |
| Flutter package (planned) | `flutter/feature_packages/sofi_ai_chat_memory_goals` |
