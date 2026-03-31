# Design Strategy: Coach Intelligence

**Author:** Cloris Cai

**Status:** In progress

**Last updated:** March 2026

## Executive Summary

Coach Intelligence is the foundational layer that translates a member's financial reality into a continuous, trust-based coaching journey. It weaves a coherent coaching narrative across every touchpoint powered by SoFi Coach — inside and outside Chat — so that every interaction feels like a deliberate, personalized step toward Getting Your Money Right.

Coach Intelligence draws from three inputs: Memory (what Coach knows about the member — context, preferences, life circumstances, financial attitudes), Goals (what the member is working toward — structured commitments with targets, timelines, and real-time progress tracking), and Financial Reality (the member's actual financial state — real-time balances, transaction patterns, product usage across SoFi).

These inputs power two kinds of output. Reactively, Coach Intelligence makes every chat response smarter by grounding answers in the member's full context. Proactively, it surfaces insights, nudges, and interventions through a calibrated engagement framework — trust-building FYIs (70%), optimization nudges (20%), and high-conviction interventions (10%).

The plan ships in two phases. Phase 1 (prototype complete) proves core value inside Coach Chat. Phase 2 unifies the knowledge model into Profile tabs, integrates goals with Banking, Invest, and Loans, and extends the full coaching framework across every SoFi surface.

No competitor has combined structured goals, conversational memory, and real-time multi-product financial data into a single coaching intelligence. This is SoFi's differentiation.

## The Problem

| Problem | Impact |
| :---- | :---- |
| Session amnesia | Coach forgets everything between sessions. Members repeat themselves. There is no continuity — no sense that Coach is getting smarter. |
| No persistent goals | Members have no place to set, track, or get accountability on financial goals tied to real accounts. |
| AI opacity | Members cannot see or correct what Coach knows. In regulated finance, this is a trust and compliance liability. |
| Reactive-only coaching | Coach only answers questions. It never initiates based on goal risk, spending changes, or account events. The coaching feels passive, not proactive. |
| Fragmented experience | Personalization is trapped inside Coach Chat. The Home and other product surfaces do not benefit from what Coach has learned. Each surface feels like a separate app, not a coherent coaching journey. |

## What Members Told Us

User research and broader market data reveal a set of tensions that Coach Intelligence must navigate. These are the core design constraints.

| What we heard | Design implication |
| :---- | :---- |
| "Help me see around corners" — Members want AI that solves real money problems: keeping up with policy changes, avoiding overspending, saving more. | Coach Intelligence must lead with tangible financial value. Every output should answer: how does this help my money? |
| Accuracy is non-negotiable — The quality bar for AI from a bank is extremely high. Members expect data-grounded answers and easy escalation to a human when needed. | Every output must be traceable to real data. When confidence is low, Coach says so and offers a human path. |
| Coach \= support, not destination — Many members interpret "Ask Coach" as customer service. They see AI as an extension of support and education, not a standalone product. | Coach must be seamlessly integrated with the existing support chat, not behind a separate AI navigation path. |
| "Put it everywhere" — Members want Coach accessible throughout the app so they don't navigate back and forth. | Cross-surface presence (Phase 3\) is a member expectation. Phase 1 ships chat-first for validation, not because members want it siloed. |
| Comfort levels vary widely — Attitudes range from AI-skeptical to AI-enthusiastic, with Gen Z/Millennials showing highest interest. | One-size-fits-all won't work. The trust spectrum must accommodate skeptics who want full control and enthusiasts who want Coach to just handle it. |
| Value over buzz — Members prefer simple, useful features. Not everything needs to be branded as AI. | "Coach Intelligence" is an internal name. Members should never see it. They should just notice SoFi keeps getting more useful. |
| Human, not robotic — AI should feel human yet be demonstrably accurate and know when to hand off. | Coach’s tone is warm and direct. It shows its work. It never pretends to know something it doesn't. |
| Guidance, not autopilot — Strong aversion to fully automated proposals without transparency and control. | Coach Intelligence presents options, not decisions. Must/Should-do moments always show reasoning and offer choices — never auto-execute. |

## Competitive Position

| Capability | ChatGPT | Claude | Cleo | Origin | Monarch | SoFi Coach Intelligence |
| :---- | :---- | :---- | :---- | :---- | :---- | :---- |
| **Goals** | No | No | Yes (gamified) | No | Yes (cleanest UI) | Yes |
| **Memory** | Yes (best controls) | Yes (project-scoped) | Yes (shallow) | Yes (multi-agent) | No | Yes |
| **Financial Data** | No | No | Shallow (read-only) | Deep (SEC-regulated) | Deep (aggregation) | Deep (owned, real-time) |
| **Proactive Engagement** | No | No | Notifications only | No | Alerts only | Calibrated 70/20/10 framework |
| **Cross-Product Intelligence** | No | No | No | No | No | Yes |

Others can do memory or goals. Others can send notifications. No competitor has a calibrated engagement framework — one that earns the right to nudge through consistent trust-building — powered by first-party, real-time data across a multi-product financial ecosystem. That combination is the moat.

## The Vision

A member opens SoFi and the app already works harder for them. It remembers what they have shared with Coach, tracks their goals against real account data, and helps them see around corners — surfacing the insights, optimizations, and warnings that matter for their situation. Whether they are checking their balance, reviewing investments, or chatting with Coach, the experience feels like one continuous relationship with a financial partner that gets smarter over time.

The technology is invisible; the value is obvious. Members do not care that Coach Intelligence exists — they care that SoFi helped them avoid a fee, catch an opportunity, or stay on track for a goal they set three months ago.

## Principles

**Integrity of insight:** Every coaching output is grounded in the member’s actual financial data and high-conviction signals — specific numbers, real balances, verified behavior. If an insight cannot be substantiated or lacks immediate relevance, it is withheld. Saying “I’m not sure” is always correct. Accuracy over presence, always.

**Narrative continuity:** Drawing from a single knowledge layer, Coach eliminates internal competition between product surfaces. Whether a member is in a deep Chat conversation or scanning the Home feed, the guidance is unified, consistent, and logically connected — one voice, not a collection of siloed suggestions.

**Guidance over solicitation:** Coach presents options and reasoning — never decisions or sales pitches. Product suggestions surface only when they serve the member’s financial situation; the member always sees the logic and chooses the action. Long-term trust over short-term conversion — product engagement is earned as a byproduct of genuine guidance, never the goal.

**Member control is visible and actionable:** Members can see everything Coach knows about them — and change it on their own terms. Every knowledge item surfaces with its source and offers direct tools to edit, pause, or delete it. This is not a privacy checkbox; it is the mechanism that makes the trust spectrum real. When members can verify and correct what Coach knows, they engage more willingly and share more deeply.

**Cumulative value:** Every interaction should make the next one smarter. The system improving over time is not a feature — it is the felt experience that drives willingness to share context. This is the core promise of Coach Intelligence.

**Human handoff built in:** When confidence is low, when a question requires account action Coach cannot take, or when the member wants a person, the path to a human specialist is immediate and frictionless.

**Respect “no” completely:** When conversational memory is off, it’s off — no passive collection, no dark patterns, no re-prompting. Goals and financial reality still ground responses; only conversation context is not saved.

## How Coach Intelligence Works

Coach Intelligence has three inputs, one unified knowledge model, and two kinds of output.

### Conceptual diagram

![][image1]

### Inputs

**Memory:** What Coach has learned about the member: preferences, life context, financial attitudes, and declared facts from conversations, manual entry, and behavioral patterns.

**Goals:** Commitments with targets, timelines, linked accounts, and progress tracking. A goal starts as a memory with structure added.

**Financial Reality:** Real-time account balances, transaction patterns, and product usage across all SoFi products, supplemented by profile-level context — income range, employment type, life stage — pre-seeded from the member’s existing SoFi data on activation.

**\* The three inputs don’t operate independently — they layer and correct each other:** Risk tolerance, for example, begins as a declared baseline from the Invest questionnaire, refines through conversation, and is checked against actual financial data: portfolio composition, cash reserves, debt structure. Declared and revealed tolerance often diverge; Coach tracks both. What products a member holds also shapes what coaching is relevant — portfolio guidance for Invest members, debt payoff framing for loan holders.

### The Unified Knowledge Model

All three inputs feed a single knowledge layer — one place where everything Coach knows about a member lives, regardless of where it came from. A spending pattern inferred from transactions, a goal set in conversation, and a risk preference declared in the Invest questionnaire are all knowledge items with similar visibility and member controls.

| Type | Example | Tracking | Source |
| :---- | :---- | :---- | :---- |
| Fact | "Household income \~$120K" | None | Conversation |
| Preference | "Prefers ETFs over individual stocks" | None | Conversation or inferred |
| Intent | "Wants to buy a house" | None (yet) | Conversation |
| Tracked Goal | "Save $60K for down payment by Dec 2027" | Progress ring, milestones, confidence | Promoted from intent |
| Completed Goal | "Paid off credit card, Dec 2026" | Completion record | Reverted from tracked goal |

### Knowledge categories

Knowledge items are organized into three categories that reflect what they say about the member:

| Category | What it captures | Examples |
| :---- | :---- | :---- |
| About Me | Identity, life context, factual information | "Self-employed," "Expecting a baby in March," "Household income \~$120K" |
| Preferences | Interaction style and financial attitudes | "Prefers detailed breakdowns," "Comfortable with moderate risk" |
| Priorities | What the member is working toward — including tracked goals | "Building emergency fund is top priority," "Save $60K by Dec 2027" |

Three categories because they answer three distinct questions: who this member is, how they prefer to engage with Coach, and what they're actively working toward. The same structure holds across memories, goals, and inferred items.

### Outputs

**Reactive responses:** Every Chat answer is grounded in the full knowledge model: the member’s goals, financial data, risk profile, and conversation history. The same question gets a different answer for different members — one that speaks to their actual situation.

**Proactive insights:** Coach doesn’t wait to be asked. Candidate insights are filtered against member context and propensity; only high-signal, immediately relevant outputs surface. These reach the member across Chat, Home, product surfaces, and push — governed by the 70/20/10 framework described below.

## The Trust Spectrum

The most important single design decision: one setting that scales Coach to the member's comfort level. Research shows attitudes toward AI vary widely — from members who want full control over every piece of saved context to those who want Coach to just handle it. The trust spectrum meets each member where they are without changing the underlying architecture.

| Mode | Who it is for | Behavior | Default? |
| :---- | :---- | :---- | :---- |
| Memory off | The skeptic — wants Coach useful right now, does not want it saving conversational memories | Coach doesn’t save conversational memories. Responses are still grounded in your goals and financial reality. | No |
| Always ask me first | The pragmatist — sees the value of Coach remembering, but wants to approve each piece | Coach proposes memories inline during conversation. Nothing saved without explicit approval. | Yes — default for all members |
| Full memory | The enthusiast — wants Coach to get smarter automatically, reviews when they feel like it | Coach saves relevant context from conversations automatically. Member can review and manage anytime. | No |

"Always ask me first" is the default because it maps directly to what research found: members see the potential in AI but want to stay in control. Coach needs to earn member’s approval to remember before it actually does

Goals and financial reality are available in all three modes — they are independent of conversational memory. The trust spectrum governs only whether Coach saves context from conversations.

### How the trust spectrum shapes proactive output

| Mode | Reactive output (chat) | Proactive output (70/20/10) |
| :---- | :---- | :---- |
| Memory off | Responses grounded in goals and financial reality — no conversational memory | Goal and financial-reality-driven engagement only. Memory-triggered nudges are off. |
| Always ask me first | Responses use approved memories and goals | Proactive engagement scales with what the member has approved. More approvals → richer FYIs, sharper nudges. |
| Full memory | Full context — all memories and goals shape every response | Full engagement framework active. All three tiers fire based on the member's complete profile. |

Trust spectrum setting determines context depth, which determines output confidence, which gates tier eligibility. A “Memory off” member still has Financial Reality as input — real balances, transactions, product usage — enough signal for relevant FYIs. What it can’t justify is a Could Do nudge or a Must/Should Do intervention, because Coach hasn’t earned the confidence those tiers require. As trust grows and knowledge accumulates, higher tiers become available.

The system is built for natural migration. A skeptic who starts with “Memory off” and finds the FYIs useful may try “Always ask me first”; a pragmatist who tires of approving every memory may move to “Full memory.” Neither transition requires a prompt — the value of each step makes the next one obvious.

## The 70/20/10 Engagement Framework

Proactive engagement follows a starting ratio — to be validated through Phase 1 data — that delivers the right intensity at the right moment. The framework prevents Coach from overwhelming members while building the trust required for higher-stakes interventions.

The governing principle: Coach Intelligence earns intensity through consistency. Consistent FYIs over time earn the right to nudge.

### Trust Builders — FYIs (70%)

Low-stakes, high-value touchpoints that make the member smarter about their own money — without asking anything of them. These anchor the member's relationship with SoFi as their financial home base.

| Format | Example |
| :---- | :---- |
| Macro-to-micro translator | A rate change occurs → Coach explains how it impacts \*this member's\* mortgage or savings yield |
| Insights tooltip | Coach tooltips embedded within trends, modules, or rows — timely, contextually relevant education |
| Weekly brief — Market & Money Pulse | A personalized weekly summary connecting market movements to the member's portfolio and goals |

**Threshold:** low. **Frequency:** high. Fire on any relevant context.

**Why 70%:** Trust is the foundation. Most interactions should make the member smarter about their own money without asking anything of them. This is how Coach earns the right to nudge.

### Optimization Ideas — Could dos (20%)

Precision nudges designed to capture incremental gains or stop value leaks within the member's current financial flow. Feature engagement occurs as a logical byproduct of making money work harder — never as generic upselling.

| Format | Example |
| :---- | :---- |
| Home Insights — Optimizations | "You have $2,400 sitting in checking earning 0.01% — moving it to your vault would earn $86/year" |
| Smart chips on chat welcome screen | Quick-action suggestions based on recent activity and goal state |
| In-line contextual tips | Insights and actions appearing exactly where the member is already looking at their data |
| Weekly brief — Optimization Ideas | Personalized suggestions for making money work harder, tied to current account state |

**Threshold:** medium. **Frequency:** moderate. Fire when there is a quantifiable optimization connected to the member's stated priorities.

**Why 20%:** These nudges only land when trust is already established. Coach Intelligence earns the right to suggest through consistent FYIs first. Each “could do” connects directly to the member’s stated priorities — never generic upselling.

### Readiness Moments — Must/Should dos (10%)

High-conviction, high-urgency interventions reserved for critical-path course corrections or major life milestones. Surfaced only when the member is on a path toward a negative outcome or entering a transformative life stage requiring structural change. 

Note: a goal milestone can produce two distinct outputs — an FYI celebrating the achievement and, when the milestone opens a natural next action (e.g., savings goal hit → mortgage readiness), a separate Readiness Moment. These are not mutually exclusive.

| Format | Example |
| :---- | :---- |
| Critical path course-correction | "Your debt-to-income ratio has been trending up for 3 months — at this pace, it will impact your credit within 60 days. Here are three options." |
| Big milestones | Coach detects a fundamental shift in the member's reality (new job, new baby, home purchase) and surfaces structural recommendations |

**Threshold:** high. **Frequency:** rare. Fire only on high-conviction triggers with verifiable data. Overusing urgency erodes trust.

**Why 10%:** These are the moments that matter most — and the easiest to get wrong. Coach Intelligence reserves high-intensity interventions for situations where inaction has real financial consequences, backed by data the member can verify.

### How the tiers connect

The 70/20/10 ratio is a design guardrail, not a rigid formula. The key principle: Coach Intelligence earns intensity through consistency. A member who has received consistent FYIs trusts a “could do” nudge. A member who trusts “could do” nudges will act on a “must do” moment. Skip the trust-building, and the high-conviction interventions feel like spam.

* FYIs fire on any relevant context — low threshold, high frequency  
* Could dos fire when there’s a quantifiable optimization — medium threshold, moderate frequency  
* Must/Should dos fire only on high-conviction triggers — high threshold, rare

### Member-Facing Surfaces (WIP)

| Surface | Coach Intelligence role | Phase |
| :---- | :---- | :---- |
| Coach Chat | Primary creation path. Conversations generate memories and goals. Coach Intelligence powers personalized responses and proactive coaching outputs. | 1 |
| Profile (in Settings) | Single view for all knowledge items that feed Coach Intelligence. Replaces separate Memory Center and Goals Dashboard. | 2 |
| Home Feed | Coach Intelligence surfaces personalized cards, goal progress widgets, and contextual recommendations based on the member's full profile. | 3 |
| Product Surfaces (Invest, Banking, Lending) | Coach Intelligence provides relevant context to each product. Invest sees risk tolerance and retirement timeline; Banking sees spending goals and savings targets. | 3 |

### Control Hierarchy (WIP)

| Level | What it controls | Surface | Phase |
| :---- | :---- | :---- | :---- |
| Global — Trust Spectrum | How Coach learns: Memory off / Always ask me first / Full memory | App Settings | 1 |
| Per-Category | Toggle categories on/off (e.g., "Don't remember my financial details") | Profile | 2 |
| Per-Item | Edit, pause, resume, delete individual knowledge items | Profile \+ Chat | 1 |
| Per-Surface | Where Coach Intelligence is active (e.g., "Don't personalize Home feed") | App Settings | 3 |
| Session | Temporary Chat mode — Coach Intelligence paused for this conversation | Chat | 2 |

## Phased Roadmap (WIP)

### Phase 1 — Validate Coach Intelligence in Chat (prototype complete)

**Scope:** Memory and goals as separate features powering Coach Intelligence within Coach Chat only.

**What ships:**

* Memory Center with search, category filters, inline edit/pause/delete, and manual add  
* Goals Dashboard with progress rings, milestones, suggested goals, and confidence indicators  
* Three-mode trust spectrum (Memory off / Always ask me first / Full memory)  
* Chat History with search and monthly grouping  
* Reactive output: goal-aware and memory-aware chat responses grounded in member context  
* Proactive output (chat-scoped): weekly recaps and pure milestone celebrations (FYI tier), spending optimization suggestions and minor goal course corrections (Could do tier), critical goal risk alerts and milestone-triggered readiness moments (Must/Should do tier)

**Entry points:** Brain icon and clock icon in chat header; Settings accessible via overflow menu.

**What this validates:** Do members want Coach to remember them? Do they engage with goals? Does cumulative personalization drive return usage? Does the trust spectrum give skeptics enough control while letting enthusiasts opt in deeper?

**Success criteria:**

| Metric | Target |
| :---- | :---- |
| Memory adoption (3+ items at 30d) | \>60% |
| Goal creation rate (first 3 sessions) | \>40% |
| Goal adherence (monthly contribution ≥80% target) | \>70% |
| Coach Chat return rate (7d) | \+15pp vs. non-memory |
| Incorrect memory rate (member-flagged) | \<5% |

**Detailed spec:** See Coach Memory & Goals — Phase 1 Design Plan for component tables, prototype architecture, animation details, and open questions.

### Phase 2 — Unify and Expand Coach Intelligence

**Scope: Unify the knowledge model into Profile tabs. Integrate goals with Banking, Invest, and Loans. Extend Coach Intelligence from Chat to every SoFi surface.**

**What changes:**

* Memory and goals fold into Profile as four tabs: About Me (life circumstances, financial attitudes, things told to Coach), My Goals (standalone goal tracking — targets, timelines, progress), My Finances (internal \+ external account status, spending patterns, product usage across SoFi), and My Preferences (existing preference settings consolidated with Coach-specific controls: trust spectrum, per-category toggles, suppression signals).  
* Shortcut from the chat header to Profile for quick access.  
* Promotion flow. New UX for converting a passive memory into a tracked goal — adding a target amount, timeline, and linked account. Reverse flow for completed goals reverting to archived memories.  
* Goals integrate with product surfaces: goals link to and surface within Banking (vaults), Invest, and Loans — goals become the connective tissue across SoFi’s product ecosystem.  
* Goal trajectory monitoring. Once goals are linked to real account data, Coach continuously monitors whether the member is on track — surfacing a proactive FYI or Readiness Moment when actual behavior diverges from the pace required to hit a goal deadline. This is ongoing deviation detection, not a one-time alert.  
* Source labels. Every knowledge item shows provenance: "You told Coach," "Coach inferred," "You added manually."  
* Per-category toggles. Members can pause Coach Intelligence for specific knowledge categories without changing their global trust spectrum setting.

**What this validates: Does unifying memory and goals into Profile tabs feel natural or confusing? Does cross-surface personalization increase engagement or feel invasive? Do inferred memories increase trust or cause friction? Does Coach Intelligence measurably improve financial outcomes?**

**Success criteria:**

| Metric | Target |
| :---- | :---- |
| Profile engagement (monthly visits) | \>30% of memory-enabled users |
| Goal promotion rate (intent → tracked goal) | \>20% |
| Memory deletion rate | No increase vs. Phase 1 |

**Key design decisions required:**

* How Coach Intelligence tabs are organized within Profile (tab order, visual hierarchy)  
* How goals retain visual prominence within a unified list (dedicated section vs. inline with badges)  
* Whether completed goals auto-archive or stay visible with a completion badge  
* What proxy signals determine when context depth is sufficient to unlock Could Do tier

### Phase 2 (Cross-Surface Expansion) — Coach Intelligence Across Every Surface

**Scope (Phase 2 continued): With the unified knowledge model in place, Coach Intelligence powers a coherent coaching narrative across all SoFi surfaces — every touchpoint a deliberate step toward Getting Your Money Right.**

**What changes:**

* Full 70/20/10 framework goes cross-surface. All three tiers reach the member through every surface: Home feed cards, product surface tooltips, and push notifications.  
* Home Feed powered by Coach Intelligence. Knowledge items shape which cards appear. Goal progress widgets surface on the Home screen. The Home screen stops being generic and starts feeling like a personalized coaching dashboard.  
* Product surface integration. Invest sees risk tolerance and retirement timeline. Banking highlights spending patterns tied to goals. Lending frames refinance options against debt payoff goals.  
* Inferred knowledge items. Transaction patterns and product usage generate proposed memories ("You spend \~$400/month on dining — want me to remember this?"), subject to the trust spectrum and approval flow.  
* Macro signal awareness. External economic signals — rate changes, inflation trends, market shifts — provide additional context for proactive coaching. A rate cut, for example, surfaces relevant guidance for members with variable-rate products or active refinance goals, without requiring the member to connect the dots.  
* Per-surface toggles. Members independently control where Coach Intelligence is active.  
* Chat as suppression signal. Explicit member statements in Chat — "I don't want savings reminders" or "not interested in refinancing right now" — pause the relevant coaching category across all surfaces. Suppression intent carries forward; it persists by design — how suppressions are surfaced and cleared is an open design question for Phase 2\.  
* Must/Should-do moments beyond chat. Critical path course-corrections and major milestone interventions surface via Home alert zone and push notifications, not just in-chat.

**What this validates:** Does cross-surface personalization increase engagement or feel invasive? Does Coach Intelligence measurably improve financial outcomes?

**Success criteria:**

| Metric | Target |
| :---- | :---- |
| Cross-surface personalization opt-in | \>50% of memory-enabled users |
| Home Feed engagement lift | \+10% card interaction rate |
| Goal adherence improvement | \+15% monthly contribution consistency |
| Memory adoption (3+ items at 30d) | \>75% |
| Coach Chat return rate (7d) | \+20pp |

**Key design decisions required:**

* Which product surfaces get Coach Intelligence access first (Home Feed likely first, then Invest, then Banking)  
* Inferred memory approval UX: inline in surface vs. batched in Profile  
* Push notification frequency controls and cadence limits per goal type  
* Data architecture and cross-surface state synchronization — trust spectrum changes, approval decisions, and suppression signals must propagate consistently across all active surfaces (real-time vs. cached profile snapshots requires engineering validation)

## Risk Mitigation

| Risk | Mitigation |
| :---- | :---- |
| Trust erosion | "Always ask me first" as default; provenance on every item; clear separation between shared context and institutional data; frictionless human escalation at any point. |
| Regulatory exposure | Per-item deletion with \<24hr purge SLA; audit trail retained; no sensitive data stored without explicit consent; safety tiers on all AI responses. |
| Feature complexity | One unified system; the trust spectrum is the only setting most members ever touch; granular controls exist but are not required to get value. |
| Over-personalization | Coach surfaces no connections when topics are unrelated; per-surface toggles let members limit where intelligence is active; Coach presents options, never decisions. |
| AI-as-buzzword backlash | No member-facing use of "AI" or "intelligence"; all copy markets the value ("Coach remembers," "your weekly brief," "goal progress"), not the technology. |
| Mental model mismatch | All coaching outputs embed in existing flows — where the member already is — rather than requiring navigation to a separate AI surface. |
| Adoption failure | Phase 1 validates demand inside Coach Chat before investing in cross-surface infrastructure; each phase has independent success criteria and can ship alone. |

## Success Metrics

**North Star:** Goal-Adjusted Financial Improvement Score — a composite measuring whether members with active Coach Intelligence (goals \+ memory enabled) are making measurable financial progress (debt reduction velocity, savings growth rate, spending alignment with stated priorities) compared to members without. This becomes the primary success signal starting Phase 2, once the unified knowledge model provides sufficient data depth.

Attribution challenge: Members who opt into Coach Intelligence are likely more financially motivated than the general population — a raw comparison will overstate impact. Requires a matched-cohort or difference-in-differences approach to isolate Coach Intelligence’s contribution.

### Knowledge layer

| Metric | Phase 1 Target | Phase 3 Target |
| :---- | :---- | :---- |
| Memory adoption (3+ items at 30d) | \>60% | \>75% |
| Goal creation rate (first 3 sessions) | \>40% | \>55% |
| Goal adherence (monthly contribution ≥80% target) | \>70% | \>80% |
| Coach Chat return rate (7d) | \+15pp | \+20pp |
| Cross-surface intelligence opt-in | N/A | \>50% |
| Incorrect memory rate (member-flagged) | \<5% | \<3% |

### Engagement framework

| Metric | Phase 1 Target | Phase 3 Target |
| :---- | :---- | :---- |
| FYI engagement rate (opened or expanded) | \>25% | \>40% |
| Could-do nudge action rate | \>10% | \>18% |
| Must/Should-do response rate (within 48h) | \>50% | \>65% |
| Proactive engagement dismissal rate | \<40% | \<30% |
| Engagement tier ratio (actual vs. 70/20/10 target) | Within ±15pp | Within ±10pp |

## References

| Resource | Link |
| :---- | :---- |
| Phase 1 detailed spec | Coach Memory & Goals — Phase 1 Design Plan (companion document) |
| Replit prototype | coach-memory-goals.replit.app |
| Jira epic | RDMEMB-661 |
| Figma |  |
| Flutter package (planned) | flutter/feature\_packages/sofi\_ai\_chat\_memory\_goals |

[image1]: <data:image/png;base64,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cLjggc56KWtdSZnzGlc80Iky8EBns5VxrCZc9EH/y/7Xv9yUvBnTD6u6staVlDmvuhh0myFclE+/qTHoeqo7wkWzlXGsHqtwofFD9hPCk2X16eem/bCqK2tdyaDz8uvLD6+Cc889J/Onrfs16OeqYrj4858XpNaVVP2lfaG1a95rX3nlFalyue++ewZeT3Wnz0u4aK4ytvexCxfWrV/Ni7WcseqZCmUu+yDz0svH7DXqVaafl256uAgN+nmq4uWXVuSGiyYiXDRbGfvx2IYL37/gumvbF190UVI2Y8aMrmHq1sNtRx75865yvWdEVGbdNmzOnDnJwXnhwpuTv7fddmtqearAt8koDTIvvWk2fG23r0frKuy3bnsZlh5I1F+/HrUubD1ee+38pNzeSaL3v8yaNatrGn2jVb++nWu4X/+qT/NUt15eFs4ra5uxOmxbG6RNpI7hQmX2llC9f8PG0VtE1X3NNfOTtgqntbax8bOGqb39O3tUPm/e7zvzC69O2nQKEeFn07rTPt9qtVL7sR5QD5fZz0vjZr0gb5hlrxItI+GiubK299jGNlzMnDmzq1/hImu59YKh0077badf36j9jwtlTZdVVkVlLucg89IP+NiBWG+YDK8OqCwvXITd/qQQdutkZuHC5hOOZy+h0slc74KwYV7WlQt7KZX1h9uMyvWabnXbZ/R1FqlruMgq9zTOiy++0On+xz9uS7o//+zT1PopWifheHYC13tAipah6MqF3kPjp9WPBfpl0gvsrHuyyz7VtJyEi+by2/sojF240MFGJ6u/L7yla5jChb5JZU3j2Rszw3H8dOFbFPUWRD+8KrKWfVSGndf8+Vcn09rLntSdFS78ra4dX37e6ddbTXU1yYbpddc+XHgaZlc1ZNq0aallywoXvh6xbSZcvqz+XuoaLrLqsjeLhmwf9PWE/eEVAb9OfH02X7X/nXfenloGM2i4uPXvC9vXXXtNp1/Djz766E53OG6/y14lWj7CRXP5bXgUxi5c+DKjcKG3afryoml6jaOToV7treG63O6HV0Heso/CZOal13HrrbRWT1a48N12S8O6w8vQeu12GC4UNvw8QwonGs9/hrxwoVex+zpsWFF/L3UNF1kPO6s8/C0N9fcTLsyf/nRZUr767VVJv26l+W3BPoNukymk+jrMoOFi8eIHuv6DRMN1a8W6w3F9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>