# Why a Live AI Prototype — Not Just Figma

## The Problem with Static Design for AI Features

Static design tools like Figma are essential for visual design, component libraries, and layout — but they fundamentally cannot represent how an AI-driven product actually *behaves*. When the core product experience is a conversation with an AI, the design *is* the behavior: how the AI responds, how fast content streams in, how memory builds over time, how formatting renders in a real layout engine, and how the user's context shapes every subsequent interaction.

Coach Chat is not a traditional screen-by-screen UI. It's a dynamic, stateful, AI-driven experience where:

- Every response is different
- The AI's personality, formatting, and tone need to be tuned through real interaction
- Memory and personalization create compound effects that only emerge over multiple turns
- Edge cases (long responses, markdown rendering, safety tiers, error states) can't be represented in a static frame

**A live prototype lets us design the experience, not just the interface.**

---

## What This Prototype Proved That Figma Couldn't

### 1. AI Response Formatting Is a Design Problem

In Figma, we'd mock up a "perfect" AI response — clean headers, tidy bullets, nice spacing. In reality, GPT-4o-mini returns markdown with unpredictable structure: nested lists, numbered steps, inconsistent header depths, horizontal rules, and varying paragraph lengths.

**What we discovered by building live:**
- Numbered lists (1. 2. 3.) look worse than bullet points in a chat bubble — we added a prompt rule to enforce bullets only
- Nested/indented bullets break the visual rhythm on mobile — we flattened all lists to one level
- Bold section headers need their own line with specific spacing — we tuned this through dozens of real responses
- The AI sometimes outputs `---` dividers or `####` headings that look broken in chat — we added explicit prompt rules and a parse-render pipeline to handle every content block type

**None of this would have surfaced in a Figma mockup.** We would have shipped a "perfect" design that broke immediately with real AI output.

### 2. Streaming UX Requires Real Latency

The feel of an AI chat is defined by how content appears — not just what it says. Streaming token-by-token creates a very different experience than waiting 3 seconds and showing a complete response.

**What we iterated on:**
- Word-by-word reveal animation speed (too fast feels mechanical, too slow feels laggy)
- The "Analyzing..." → "Thinking..." → response flow and its visual indicator (an animated orb)
- How suggestion chips appear after the response finishes (not during streaming)
- How the scroll anchor behaves during a streaming response vs. after completion
- What happens when the user scrolls up mid-stream — should we auto-scroll back?

**Figma can show a loading state.** It cannot show the *feeling* of a 2-second stream vs. a 4-second stream, or how scroll behavior during streaming affects perceived responsiveness.

### 3. Memory Is a Multi-Turn Design Problem

The memory system — where the AI notices personal facts, saves them, and uses them in future responses — is fundamentally impossible to prototype statically. It requires:

- A real AI interpreting natural language to decide what's worth remembering
- Prompt engineering to control when memories trigger (every response? only explicit facts? inferred attitudes?)
- A real conversation history to test multi-turn behavior
- UI for inline memory chips, proposal cards (accept/decline), and the Memory Center panel

**What we discovered through live iteration:**
- The AI was too conservative — it wouldn't save credit card types, insurance details, or tax filing status until we expanded the trigger patterns
- The AI was too aggressive on first messages — it tried to save memory on every response until we added frequency controls
- Memory proposals need a different UX than auto-saves — proposals feel intrusive if they appear too often, but auto-saves feel invisible if there's no chip confirmation
- The SSE streaming buffer sometimes dropped the memory action payload — a bug that would *never* appear in a static prototype and would have shipped to production undetected
- Category labels matter: "Explicit Fact" means nothing to a user, but "Facts" in the Memory Center feels natural

**This required 10+ prompt iterations, 3 client-side bug fixes, and dozens of real conversations to get right.** A Figma frame showing "Saved to memory ✓" tells us nothing about whether the system actually works.

### 4. Safety Tiers Need Real AI Judgment

Coach Chat uses a 4-tier safety system: Informational → Suggestive → Actionable → Handoff. The AI must correctly classify its own recommendations and show appropriate disclaimers.

**What we learned:**
- The boundary between "Suggestive" and "Actionable" is fuzzy — the AI needs clear prompt guidance
- "Handoff" (recommending a human advisor) must feel helpful, not dismissive
- Safety badges need to be visible but not alarming — we iterated on colors, icons, and copy

**Static mocks can show all 4 tiers. They can't test whether the AI classifies correctly across hundreds of different financial questions.**

### 5. Demo Scenarios Are Living Documentation

We built 10 interactive demo scenarios that serve as both a testing harness and a stakeholder demo. Each scenario pre-loads specific conversation state (memories, goals, history) and walks through a specific capability:

- Cold Start Onboarding — how the AI introduces itself to new users
- Memory Lifecycle — save, propose, correct, and delete memories
- Goal Discovery — AI detects goal intent from natural conversation
- Proactive Risk Alert — AI initiates a check-in when confidence drops
- Milestone Celebration — how goal completion feels
- Cross-Product Orchestration — coordinating across SoFi Checking, Savings, and Invest
- Safety Tiers — all 4 levels demonstrated in context

**These scenarios replace a 40-page Figma deck.** Instead of annotating static frames with "and then the AI would say something like...", stakeholders can tap through real conversations and see exactly how the product behaves.

### 6. Edge Cases Only Emerge in Live Code

Some of the most important design decisions came from edge cases we only discovered by building:

- **Long AI responses** — a detailed spending breakdown can be 500+ words. How does that feel in a chat bubble? (Answer: we needed clear section headers and scannable formatting)
- **Empty states** — what does the app look like before any conversation? Before any memories? Before any goals?
- **Rapid-fire messages** — what happens if the user sends 3 messages before the AI responds? (Answer: we needed session versioning to prevent race conditions)
- **Network errors mid-stream** — what does the user see if the connection drops during a streaming response?
- **Keyboard interactions** — how the input bar behaves with the software keyboard, safe area insets, and scroll position

---

## The Prototype as a Specification

This prototype isn't throwaway work. It serves as:

1. **A living spec** — every prompt rule, formatting decision, and interaction pattern is documented in working code, not in annotations that get stale
2. **A Flutter migration reference** — the `FLUTTER_HANDOFF.md` document maps every component, animation, and data flow to what the Flutter team needs to build, grounded in real tested behavior
3. **A memory & goals design doc** — `PHASE 1.md` defines trigger maps, category definitions, goal types, user flows, and known limitations, all derived from actual testing
4. **A stakeholder demo** — 10 scenarios that anyone can walk through without reading a PRD
5. **A prompt engineering testbed** — the AI's system prompt has been refined through real conversations, not hypothetical ones

---

## Tradeoffs: Where Figma Still Wins

A live prototype is the right tool for designing AI behavior, but it does come with real costs:

**Sharing is harder.** A Figma link is instantly viewable by anyone — no setup, no accounts, no loading time. A live prototype requires either a deployed URL (with potential auth, cold-start delays, and API costs) or running the app locally. You can't just paste a link into a Slack thread and have 20 people review it simultaneously the way you can with Figma. For broad stakeholder reviews or async feedback rounds, Figma's frictionless sharing is a genuine advantage.

**User testing has more overhead.** In Figma, you can spin up a usability test in minutes with tools like Maze or UserTesting — participants click through screens with zero technical dependencies. With a live prototype, user testing requires a stable deployed environment, active API keys, and enough backend capacity to handle concurrent testers. If the AI service has an outage or the server goes down mid-session, the test is lost. The unpredictability of live AI responses also makes it harder to create controlled, repeatable test conditions — two participants may see completely different responses to the same prompt.

**Iteration speed varies.** Visual changes (colors, spacing, typography) are faster in Figma — drag, adjust, done. In code, even small visual tweaks require editing files, waiting for hot reload, and testing across screen sizes. Figma excels at rapid visual exploration; live prototypes excel at rapid behavioral exploration.

**Cost.** Every AI conversation in the live prototype costs real API tokens. Figma mocks are free to view and interact with indefinitely.

The right approach is to use both: Figma for visual design, component libraries, and broad stakeholder alignment — and a live prototype for the behavioral design problems that only emerge through real interaction.

---

## Summary: Why This Approach

| Aspect | Figma | Live Prototype |
|---|---|---|
| Visual design & layout | Excellent | Good (real components) |
| AI response formatting | Mocked (fake text) | Real (actual GPT output) |
| Streaming UX & latency | Cannot represent | Real network conditions |
| Memory system behavior | Annotated flows | Working end-to-end |
| Multi-turn conversations | Separate frames | Continuous state |
| Edge cases & errors | Must imagine them | Discover them naturally |
| Prompt engineering | Cannot test | Iterate in real-time |
| Stakeholder demos | Click-through | Interactive conversations |
| Flutter handoff | Visual reference only | Behavioral specification |
| Sharing & async review | Instant link, zero friction | Requires deployed URL + active backend |
| User testing | Low overhead, repeatable | Needs stable environment, results vary |
| Visual iteration speed | Fast (direct manipulation) | Slower (code + reload) |
| Cost to demo | Free | API token costs per session |

**For traditional UI — buttons, layouts, navigation — Figma is the right tool.**
**For AI-driven conversational products, a live prototype is the only way to design the actual experience.**
**For most real projects, use both.**

This prototype exists because the hardest design problems in Coach Chat aren't visual — they're behavioral. And behavioral design requires a running system.
