# Coach Memory & Goals — Design Plan

**Features:** Coach Chat Memory · Goals
**Feature area:** Memory → Coach Chat only · Goals → Coach Chat + App Settings
**Designer:** Cloris Cai
**Status:** Planning

---

## Overview

This document covers two distinct but tightly interconnected features. They can ship independently, but each makes the other significantly more valuable.

---

### Feature 1 — Coach Chat Memory

- **What it is:** A persistence layer for SoFi Coach Chat. Coach accumulates context about a member across sessions — preferences, life events, financial attitudes, explicit facts — and uses that knowledge to personalize every subsequent response.
- **Core value:** "The more we talk, the more helpful I become." Coach stops being a stateless search box and starts behaving like someone who actually knows the member.
- **Access:** Coach Chat only. Memory is viewed and managed entirely within the chat surface — there is no standalone Settings entry point for memory. This keeps memory contextual and reinforces that it belongs to the Coach relationship, not the broader app.
- **Who it's for:** Any Coach Chat user. The value compounds — passive users benefit from light personalization; engaged users who actively manage their memories get a meaningfully tailored experience.

---

### Feature 2 — Goals

- **What it is:** A structured goal-tracking system surfaced through Coach Chat and accessible from app Settings. Members set financial goals (save up, pay down, invest toward a target), and Coach tracks progress against real account data, surfaces proactive alerts when goals are at risk, and celebrates milestones.
- **Core value:** Goals give Coach's responses a persistent target to aim at. Without goals, Coach answers questions. With goals, Coach connects every answer to something the member actually cares about.
- **Access:** Goals can be created and reviewed from Coach Chat (conversational, contextual) and from app Settings (direct, structured). This dual entry point ensures goals are reachable even for members who don't regularly use Coach Chat. **Save Up goals are directly linked to SoFi Banking's existing Vault feature** — creating a Save Up goal either connects to an existing Vault or prompts the member to create one, making the goal tangible and actionable rather than abstract tracking.
- **Who it's for:** Members with a specific financial intention — an emergency fund, a debt payoff plan, a savings target — who want accountability and progress visibility without leaving the app.

---

**How they connect:**

- Memory makes Goals personal. When a member has told Coach "I want to retire by 55," that context shapes how Coach frames every goal conversation.
- Goals generate memories. Creating a goal is itself a high-signal memory event — Coach knows what the member is working toward.
- Goal-aware responses draw on both. Coach's Next Step / Progress Delta / Risk Alert patterns require both memory (who this person is) and goal state (where they stand).
- Neither requires the other to launch, but both are significantly weaker in isolation.

---

**Who it's for (combined):** SoFi members using Coach Chat who want continuity, personalization, and a persistent place to track financial goals — rather than starting from scratch each session.

**Design principles:**

- **Cumulative value** — Every conversation should make the next one more useful. The member should feel the difference within three sessions.
- **Goals as the gravity center** — Generic financial Q&A is commoditized. SoFi's differentiation is that the AI connects responses back to the member's stated goals and real financial state. ("You asked about dining spend — here's how it affects your emergency-fund goal.")
- **Trust through transparency** — In regulated finance, a black-box memory is a liability. The member must always be able to see what the AI knows, why it said what it said, and delete anything instantly.

**Problems it solves:**

- **Session amnesia** — Coach currently forgets all context when a conversation ends; members repeat themselves and lose continuity
- **No goal persistence** — Members have no dedicated place to set, view, or track financial goals tied to their actual accounts
- **AI opacity** — Members can't see or correct what the AI knows about them, creating distrust and friction
- **Reactive-only coaching** — Coach only responds; it never initiates based on account changes, goal risk, or market events

**Why SoFi wins this:**

No competitor has combined all three of: **structured goals + conversational memory + real financial data** in a single integrated experience. Cleo has goals and memory but shallow financial data. Origin has data, reasoning and conversational memory, but no clear goal tracking functionality. Monarch has goals and data but no memory.

SoFi's unique moat: a multi-product ecosystem (banking, investing, lending, credit) under one roof — with real-time account data — enabling cross-product goal orchestration that no AI-first competitor can replicate.

---

## Goals & Success Metrics

**User goals:**

- Feel genuinely known by the Coach across sessions — not repeat themselves
- Understand and control what the AI has learned about them
- Set meaningful financial goals and track progress against real account data
- Receive timely, contextual alerts when plans are at risk or milestones are reached

**Business goals:**

- Increase Coach Chat session depth and return rate (members come back because Coach adds compounding value)
- Drive goal creation and adherence as a cross-product engagement signal
- Deepen connection across SoFi product lines through in-chat recommendations and allocations
- Differentiate SoFi Coach from generic AI assistants through transparency and persistence

**North Star:** *Goal-Adjusted Financial Improvement Score* — a composite measuring whether members with active goals + memory enabled are making measurable financial progress (debt reduction velocity, savings growth rate, spending alignment with stated priorities) compared to members without.

**Product metrics:**


| Metric                     | Description                                                         | Target                |
| -------------------------- | ------------------------------------------------------------------- | --------------------- |
| Memory adoption            | % of active Coach users with ≥ 3 active memories at 30 days         | > 60%                 |
| Goal creation rate         | % of Coach users who create ≥ 1 goal within first 3 sessions        | > 40%                 |
| Goal adherence (30/60/90d) | % of active goals where actual monthly contribution ≥ 80% of target | > 70%                 |
| Goal completion rate       | % of goals reaching 100% within stated timeframe                    | > 25% at 6 months     |
| Coach Chat return rate     | % of users returning within 7 days                                  | +15 pp vs. non-memory |
| Containment rate           | % of conversations resolved without human escalation                | > 65%                 |


**Safety metrics:**


| Metric                                                | Target     |
| ----------------------------------------------------- | ---------- |
| Incorrect memory rate (member-flagged)                | < 5%       |
| Compliance-flagged responses per 10,000 conversations | < 1        |
| Memory deletion SLA (request → full purge)            | < 24 hours |
| Sensitive data stored without explicit consent        | 0          |


**Experimentation plan:**


| Experiment                                         | Measure                                             |
| -------------------------------------------------- | --------------------------------------------------- |
| Memory on vs. off                                  | Return rate, session depth, CSAT                    |
| Implicit memory suggestions vs. explicit-only      | Memory adoption rate, incorrect-memory rate         |
| Goal-contextual responses vs. standard             | Goal adherence, CSAT                                |
| Proactive alerts vs. passive tracking only         | Goal completion rate, notification unsubscribe rate |
| Cold-start guided onboarding vs. organic discovery | 30-day memory count, goal creation rate             |


---

## User Flows

### 1. Cold Start — New Member Onboarding

*Memory + Goals · Sessions 1–3: demonstrating cumulative value quickly*

- **Session 1:** Coach introduces itself and its memory capability. Asks 2–3 lightweight seed questions ("What's your biggest financial priority right now?" / "Do you prefer detailed breakdowns or quick summaries?"). Proposes one goal based on the answer. Saves 1–2 memories from the conversation.
- **Sessions 2–3:** Coach references Session 1 context without being asked. Proposes additional memories from conversation. Suggests linking additional accounts for richer context.
- **Session 4+:** Full personalization active. Coach proactively references memories and goals without prompting.

*The first 30 days determine long-term retention. Coach must demonstrate cumulative value early.*

---

### 2. Memory Lifecycle

*Memory · How memories are created, viewed, edited, and removed*

- **Explicit save** — Member says "I'm saving for a house" → Coach surfaces a "Memory saved" inline indicator immediately
- **Implicit proposal** — Coach detects a recurring pattern or stated fact → proposes inline: *"Want me to remember that you prefer keeping 6 months of expenses in your emergency fund?"* → [Remember] [Not now]
- **Full disclosure** — Member opens Memory Center to see all memories grouped by category; each shows source ("You said" / "AI inferred"), creation date, and version history
- **Correction** — Member taps a memory row, edits inline, saves; prior version is retained in history
- **Pause** — Member toggles a memory to Paused; Coach stops referencing it but retains it
- **Delete** — Member permanently removes a memory; purge completes within 24 hours; audit log retained for compliance

---

### 3. Goal Discovery from Conversation

*Goals (+ Memory) · Turning casual intent into a tracked goal*

- Member mentions a financial intention in passing ("I want to pay off my credit card this year")
- Coach recognizes the intent and asks structured follow-up: timeline, monthly capacity, current balance
- Coach presents a Goal Proposal card: goal type, target amount, monthly contribution, estimated completion date, linked account (pre-suggested)
- For Save Up goals, Coach proposes linking to an existing Vault or creating a new one; the Vault becomes the live source of truth for progress
- Member taps "Set up goal"; goal appears in Goals Dashboard with progress ring, confidence indicator, milestone markers
- Coach may surface an Insight-to-Action card if a product move would accelerate the goal

---

### 4. Goal-Aware Response in Conversation

*Memory + Goals · Every response passes through a goal-relevance check*

When applicable, Coach's response includes one of four patterns:

- **Next Step** — A concrete action the member can take now. *"Transfer $150 to your vault to stay on track this month."*
- **Progress Delta** — How the topic connects to goal progress. *"Your dining spend is down 18% — you're $45 ahead on your savings goal."*
- **Risk Alert** — A warning tied to goal health. *"This purchase would use 40% of your remaining monthly budget and put your debt payoff goal at risk."*
- **None** — Topic is unrelated to any active goal. No forced connection.

*The "none" case matters: over-connecting everything to goals will feel patronizing.*

---

### 5. Proactive Risk Alert

*Goals · Coach detects a goal is at risk and initiates a check-in*

- Coach monitors goal confidence score derived from spending patterns, contributions, account changes
- When confidence drops below threshold, Coach sends a push notification and pre-loads the chat with context
- The alert includes: goal name, root cause ("Your credit card balance increased $800 this week"), and 2–3 recovery options
- Member selects a recovery path; Coach adjusts the goal's estimated completion date and saves a relevant memory

---

### 6. Milestone Celebration

*Goals · Reaching a milestone triggers a positive reinforcement moment*

- Member reaches a goal milestone (25% / 50% / 75% / 100%, or a behavior streak such as 3 months hitting the savings target)
- Coach sends a push notification + in-app animation; opens into a chat with celebratory message
- Coach shows journey timeline (past milestones + upcoming) and forward projection ("At this rate, you'll hit your target by August")
- Member can share the milestone, adjust the goal target, or continue the conversation

---

### 7. Cross-Product Orchestration

*Memory + Goals · Coach connects a life event to action across SoFi products*

- Member mentions a windfall or income change ("I just got a $3,000 bonus")
- Coach identifies relevant products: checking (liquidity), savings (emergency fund gap), invest (long-term), credit (high-interest balance)
- Coach presents a split-allocation Insight-to-Action card: e.g., "$1,000 → Emergency Fund, $1,500 → Invest, $500 → Credit Card"
- Member reviews the breakdown; Coach adjusts individual amounts on request
- Member approves; Coach logs the decision as a memory and updates goal progress

---

## Screens & Components

### Chat Interface — Memory + Goals (existing, extended)

*Package: `sofi_x_package` · `lib/modules/chat/`*


| Design element            | Production widget                                                                       | Status |
| ------------------------- | --------------------------------------------------------------------------------------- | ------ |
| User message bubble       | `ChatBubble.user()` / `ChatOutboundMessageWidget`                                       | Exists |
| AI message block          | `ChatBubble.bot()` / `ChatStreamingMessageWidget`                                       | Exists |
| Memory proposal prompt    | New renderable type routed through `DynamicChatWidget`                                  | New    |
| "Memory saved" chip       | `ChatPillsWidget` / `PacificPillsWidget` — new confirmed-memory pill variant            | Extend |
| Goal proposal card        | New `ChatCashCoachAction*Builder` — follow pattern of `ChatCashCoachActionVaultBuilder` | New    |
| Insight-to-Action card    | Existing `ChatCashCoachAction*Builder` variants (fund, savings, invest, card)           | Extend |
| "Why this recommendation" | New expandable row type routed through `DynamicChatWidget`                              | New    |
| System banner (dark)      | `ChatStatusContainer` — new dark variant                                                | Extend |
| System banner (light)     | `ChatStatusContainer` / `ChatDisclaimerFooterWidget`                                    | Extend |
| Suggestion chips          | `ChatPillsWidget` / `PacificPillsWidget`                                                | Exists |
| Safety tier badge         | `PacificStatusPill` — new placement in `ChatBubble`                                     | Extend |
| Temporary Chat indicator  | `UnifiedChatAppBar` — new persistent chip in header                                     | Extend |


**Response safety tiers:**


| Tier | Type                  | Guardrail                                                           |
| ---- | --------------------- | ------------------------------------------------------------------- |
| 1    | Informational         | None — factual answers, balance lookups                             |
| 2    | Suggestive            | Data provenance included; tagged as "suggestion"                    |
| 3    | Actionable            | Confidence threshold required; "Why this" section; disclaimer shown |
| 4    | Complex / high-stakes | AI provides framing, explicitly hands off to human advisor          |


---

### Memory Center

*Package: `sofi_ai_chat_memory_goals` (new) · all components new, built on existing patterns*

Accessed via a new item under the "more menu" icon in the chat header. Accessed via Coach Chat only — no Settings entry point.


| Design element    | Production widget                                                                       | Status |
| ----------------- | --------------------------------------------------------------------------------------- | ------ |
| Panel scaffold    | `ChatScaffold` / `UnifiedChatScreen` pattern                                            | New    |
| Panel header      | `UnifiedChatAppBar` pattern with close + title                                          | New    |
| Memory row        | `PacificRow` with trailing edit / pause / delete actions — source label + date          | New    |
| Version history   | Expandable `PacificRow` — prior versions with timestamps                                | New    |
| Category controls | New — per-category Pacific toggle + retention window selector                           | New    |
| Global controls   | Extend `ChatSessionControlsMenu` — pause all / delete all / implicit suggestions toggle | New    |
| Footer            | `ChatDisclaimerFooterWidget` pattern — active count + privacy note                      | New    |


**Memory categories:**


| Category            | Examples                                                                  |
| ------------------- | ------------------------------------------------------------------------- |
| Preferences         | "Prefers detailed breakdowns over quick summaries"                        |
| Life Context        | "Expecting a baby in March", "Starting a new job at [Company]"            |
| Financial Attitudes | "Comfortable with moderate investment risk"                               |
| Goal-Related        | "Wants to retire by 55", "Building emergency fund is top priority"        |
| Explicit Facts      | "Total household income ~$120K", "Self-employed, irregular income months" |
| Other               | "Prefers high-yield savings over brokerage for short-term goals"          |


---

### Goals Dashboard

*Package: `sofi_ai_chat_memory_goals` (new) · reuses chart and progress components from `sofi_coach_dashboard`*

Two entry points: a new item under the "more menu" icon in the chat header, and a dedicated Goals section in app Settings. Both surfaces show the same goal state; goals created or edited in either place sync immediately.


| Design element          | Production widget                                                                         | Status |
| ----------------------- | ----------------------------------------------------------------------------------------- | ------ |
| Panel scaffold          | `ChatScaffold` / `UnifiedChatScreen` pattern                                              | New    |
| Goal card               | `PacificCard` + `PacificProgressMeter` (circular) — Save Up shows linked Vault name       | New    |
| Confidence indicator    | `PacificStatusPill` — On Track / At Risk / Paused / Completed                             | New    |
| Monthly trend sparkline | `PacificLineGraph` (from `sofi_coach_dashboard`)                                          | New    |
| Goal metadata           | `PacificRow` — monthly target, completion date, linked account; Vault balance for Save Up | New    |
| Blockers row            | `PacificRow` — AI-identified risks inline ("Spending spike in dining")                    | New    |
| Milestone row           | `PacificRow` — badge icons unreached (outlined) → reached (filled)                        | New    |
| Scenario simulation     | New — "What if I increase by $X/month?" projection panel                                  | New    |
| Goal action             | `ChatPillsWidget` pill — "Ask about this goal" opens chat pre-seeded with goal context    | New    |
| Completed section       | `PacificRow` with divider separator — completion date + final achievement                 | New    |


---

### Proactive Messaging

*Alert zone: `HomeZoneType.alerts` (`ZONE_ALERTS`) · `ItemAlert` widget · backend-driven via `/getHomeZones` · severity: `INFORMATIONAL` / `CAUTIONARY`*

Rather than building new notification surfaces, proactive messaging reuses the existing home alert zone (`ZONE_ALERTS`) to surface high-conviction goal-related moments at the right time. The alert zone appears when conditions are met — celebrating key milestones and flagging notable deviations from a member's goals.


| Message type           | Trigger                                   | Entry point                                                                                                                       |
| ---------------------- | ----------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| Milestone notification | Goal milestone reached                    | `ItemAlert` (INFORMATIONAL) in home alert zone + push → `AnimatedRenderable` in-chat celebratory message                          |
| Risk alert             | Notable deviation from goal on-track pace | `ItemAlert` (CAUTIONARY or INFORMATIONAL) in home alert zone + push → chat pre-loaded with root cause and recovery action buttons |


---

### Control Hierarchy


| Level               | Feature | Surface                 | Controls                                                                                                                  |
| ------------------- | ------- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| 1 — Global (Goals)  | Goals   | App Settings            | Goal tracking on/off, proactive notifications toggle (by type), notification frequency, Goals section with full list view |
| 1 — Global (Memory) | Memory  | Coach Chat header       | Pause all memory, delete all memory, toggle implicit suggestions                                                          |
| 2 — Category        | Memory  | Memory Center (in-chat) | Toggle per category, set retention window per category                                                                    |
| 3 — Item            | Memory  | Memory Center + chat    | Edit, delete, view version history, "That's not right" correction on implicit memories                                    |
| 4 — Session         | Memory  | Chat                    | Temporary Chat mode (no memory read/write), per-response "Don't use this" flag                                            |


---

### Pacific Component Mapping


| Design element                                                  | Pacific component                         |
| --------------------------------------------------------------- | ----------------------------------------- |
| Full-screen views (if Memory Center / Goals Dashboard promoted) | `PacificPage` / `PacificAppBar`           |
| Goal progress ring                                              | `PacificProgressMeter` (circular variant) |
| Status pills (goal status, safety tier)                         | `PacificStatusPill`                       |
| Memory list rows                                                | `PacificRow` with trailing action icons   |
| Goal cards and Insight-to-Action cards                          | `PacificCard`                             |
| Suggestion chips                                                | `PacificChip` (selectable, pill variant)  |


---

## Open Questions

*Codebase analysis completed 2026-03-17. Status tags: **Decided by code** · **Open decision** · **Blocked on external***

- **Vault integration for Save Up goals** — When a member creates a Save Up goal, can they link to an existing Vault, or must a new one be created? If a new Vault is created from the goal flow, does that happen in-chat or does it hand off to the Banking surface? How does goal progress sync with Vault balance — real-time or periodic?
  - *Partially decided by code.* Navigation already leaves chat via `VaultSelectCategoryScreenRouteTarget` (full Banking screen), with a feature flag to return. Only vault creation exists — `VaultCreationEnriching` has no existing-vault field. Linking is net-new eng work; scope before committing to V1.
- **Galileo integration** — What's the API contract for reading account balances and transaction data at session start? What's the latency budget, and is on-demand refresh during conversation feasible?
  - *Blocked on external — Backend / Data Eng.* Global HTTP timeout is 60 s; no polling or streaming pattern exists. Pre-fetch at session start + 30–60 s cache is the only viable pattern. Need to align on: which endpoints get cache headers, session-start vs. on-demand fetch, and stale-data fallback UX.
- **Implicit memory timing** — Is the confirm/dismiss prompt synchronous in-chat, or can members action it later from Memory Center?
  - *Open decision — recommend synchronous.* `ChatPillsWidget` + `DynamicChatWidget` already support inline confirm/dismiss. Adding a `memoryProposal` renderable type is self-contained frontend work + one backend type string contract. Async queue creates a growing unreviewed backlog — recommend locking synchronous now.
- **Goal confidence scoring** — What model drives the confidence score? Rules-based thresholds, ML model, or LLM-evaluated? Who owns iteration on it?
  - *Blocked on external — Product + Data Science.* Display components (`PacificStatusPill`, `PacificLineGraph`) exist in `sofi_coach_dashboard`. Model ownership is unresolved and blocks the Goals Dashboard spec.
- **Safety tier classification** — Is Tier 3 / 4 assignment rules-based, LLM-classified, or a hybrid? Who owns the compliance review pipeline for actionable responses?
  - *Blocked on external — Compliance / Legal.* Mobile only renders the tier badge and "Why this" row — frontend is unblocked. Classification ownership and the compliance pipeline are backend / AI platform concerns.
- **Human advisor handoff** — How does scheduling work? What does the context package handed to the advisor contain, and how is it formatted?
  - *Blocked on external — Product + Operations.* Mobile Tier 4 UI is a single `ChatCashCoachAction` card variant. Scheduling mechanics and context package format need Financial Planning and advisor tooling input.
- **Proactive outreach infrastructure** — What delivery layer handles push notifications? What are the member-facing frequency controls, and how are delivery preferences stored?
  - *Partially decided by code.* FCM is the delivery layer; `ZONE_ALERTS` → `ItemAlert` supports INFORMATIONAL / CAUTIONARY severity with backend-synced dismiss. Gap: only a global push toggle exists in Settings today — no per-goal-type frequency controls. Product needs to define cadence limits before backend can build them.
- **Temporary Chat consent** — Does privacy mode need an explicit consent step on first use, or is toggling sufficient?
  - *Blocked on external — Compliance / Legal.* `ChatSessionControlsMenu` is the right surface for the toggle. Whether a first-use consent modal is legally required gates the `UnifiedChatAppBar` chip design.
- **Memory Center & Goals Dashboard — modal vs. full screen** — Current design uses slide-over panels. On mobile, should these promote to full `PacificPage` screens?
  - *Decided by code — use full `PacificPage`.* No slide-over or `DraggableScrollableSheet` pattern exists from the chat module. All secondary panels (`ChatHistoryScreen`, `EditChatSessionScreen`) use `RouteTransition.slideUp` + `PacificPage`. The "slide-over" language in the spec is aspirational — V1 should follow the established pattern.
- **Sensitive data policy edge cases** — If a member explicitly asks Coach to remember an exact salary figure or health information, what's the exact UX for the sensitivity flag and the Memory Center disclosure?
  - *Blocked on external — Compliance / Legal.* No sensitive data flag pattern exists in the codebase. The UI (flag icon on a memory row) is straightforward once Legal defines which categories require flagging and what the disclosure copy must say. This gates the Memory Center design.
- **Memory edit guardrails** — Can members freely edit AI-inferred memory text, or only confirm/deny? What prevents gaming that degrades Coach quality?
  - *Open decision — Product / UX.* No existing precedent. Recommend confirm/deny only for AI-inferred memories and free-text edit for member-entered memories. Needs product sign-off before Memory Center rows can be specced.
- **Scenario simulation depth** — "What if I increase contribution by $X?" — is this a simple linear projection or does it account for interest, inflation, account type? Who scopes this?
  - *Blocked on external — Product + Engineering.* `PacificLineGraph` is ready for output display. V1 linear projection is achievable frontend-only; compound/inflation requires a backend service. Scope decision needed before the Goals Dashboard "What if" panel can be designed.

---

## References


| Resource                               | Link                                                                                               |
| -------------------------------------- | -------------------------------------------------------------------------------------------------- |
| Replit prototype                       | [https://coach-memory-goals.replit.app](https://coach-memory-goals.replit.app)                     |
| Figma                                  |                                                                                                    |
| Jira epic                              | [https://sofiinc.atlassian.net/browse/RDMEMB-661](https://sofiinc.atlassian.net/browse/RDMEMB-661) |
| Flutter package (planned)              | `flutter/feature_packages/sofi_ai_chat_memory_goals`                                               |
| Related package                        | `sofi_coach_dashboard`                                                                             |
| Competitive reference — ChatGPT Memory | ChatGPT: explicit + implicit two-layer system, best-in-class controls                              |
| Competitive reference — Claude Memory  | Claude: project-scoped, editable summaries, import/export                                          |
| Competitive reference — Cleo           | Cleo: SMART goals, gamification, behavioral design ($129M cumulative savings)                      |
| Competitive reference — Origin         | Origin: SEC-regulated, multi-agent, scenario forecasting                                           |
| Competitive reference — Monarch        | Monarch: cleanest goal-tracking UI, CFP-guided, explicit limitation disclosures                    |


