# Memory System — Requirements & Trigger Map

This document defines when and how the SoFi Coach Chat memory system should capture, categorize, and store user information. It serves as the source of truth for prompt engineering, client-side validation, and Flutter migration.

---

## Memory Categories

| Category | Label | What it captures | Save type |
|---|---|---|---|
| `EXPLICIT_FACT` | Facts | Concrete numbers: income, balances, debt amounts, credit scores, tax brackets, net worth | Auto-save |
| `LIFE_CONTEXT` | Life Context | Location, family, age, career, homeowner/renter, marital status, major life events (wedding, new baby, retirement timeline) | Auto-save |
| `CONSTRAINT` | Constraints | Budget limits, debt obligations, income caps, time constraints, minimum payments, fixed expenses | Auto-save |
| `FINANCIAL_ATTITUDE` | Attitudes | Risk tolerance, saving vs. spending philosophy, investment style, debt payoff strategy preference | Propose |
| `GOAL_RELATED` | Goals | Savings targets, debt payoff priorities, retirement timelines, purchase plans (house, car), education funding | Auto-save or Propose |
| `PREFERENCE` | Preferences | Communication style, detail level, how often they want check-ins, preferred advice format | Propose |

---

## Trigger Map — When to Capture Memories

### Always auto-save (MEMORY_SAVE)

These are unambiguous facts. Save immediately without asking.

| User says something like... | Category | Example memory content |
|---|---|---|
| "I make $120k" / "My salary is..." | `EXPLICIT_FACT` | Annual salary is $120,000 |
| "I have $30k in student loans" | `EXPLICIT_FACT` | Has $30,000 in student loan debt |
| "My credit score is 740" | `EXPLICIT_FACT` | Credit score is 740 |
| "I have a Chase Sapphire card" | `EXPLICIT_FACT` | Has Chase Sapphire Preferred credit card |
| "I have a 401k with Fidelity" | `EXPLICIT_FACT` | Has 401k with Fidelity |
| "I have a Roth IRA" / "My brokerage..." | `EXPLICIT_FACT` | Has Roth IRA with $50,000 balance |
| "I pay $2,200/mo rent" | `EXPLICIT_FACT` | Monthly rent is $2,200 |
| "My mortgage is $1,800/mo" | `EXPLICIT_FACT` | Monthly mortgage payment is $1,800 |
| "I have State Farm insurance" | `EXPLICIT_FACT` | Has State Farm auto and home insurance |
| "I live in Austin" / "We're in NYC" | `LIFE_CONTEXT` | Lives in Austin, TX |
| "I'm married" / "I have 2 kids" | `LIFE_CONTEXT` | Married with 2 children |
| "I'm a software engineer at Google" | `LIFE_CONTEXT` | Software engineer at Google |
| "I'm 34 years old" | `LIFE_CONTEXT` | 34 years old |
| "We're planning a wedding next year" | `LIFE_CONTEXT` | Planning wedding for next year |
| "We just had a baby" | `LIFE_CONTEXT` | Recently had a baby |
| "I'm retiring in 10 years" | `LIFE_CONTEXT` | Plans to retire in approximately 10 years |
| "I own my home" / "I rent" | `LIFE_CONTEXT` | Homeowner (or: Renter) |
| "I file taxes jointly" | `LIFE_CONTEXT` | Files taxes married filing jointly |
| "My budget is $4k/mo after rent" | `CONSTRAINT` | Monthly discretionary budget is $4,000 after rent |
| "I can only save $500/mo" | `CONSTRAINT` | Can save up to $500 per month |
| "I have $800/mo in minimum payments" | `CONSTRAINT` | Monthly minimum debt payments total $800 |
| "I want to save $20k for a down payment" | `GOAL_RELATED` | Saving $20,000 for home down payment |
| "I want to pay off my cards by December" | `GOAL_RELATED` | Goal to pay off credit cards by December |
| "I'm saving for my kids' college" | `GOAL_RELATED` | Saving for children's college education |

### Propose for confirmation (MEMORY_PROPOSAL)

These are inferences. Ask the user before storing.

| AI detects... | Category | Example memory content |
|---|---|---|
| User consistently asks for detailed breakdowns | `PREFERENCE` | Prefers detailed breakdowns with numbers |
| User says "just give me the bottom line" | `PREFERENCE` | Prefers concise, bottom-line answers |
| User shows strong debt-averse behavior | `FINANCIAL_ATTITUDE` | Debt-averse — prioritizes paying off balances |
| User prefers index funds over stock picking | `FINANCIAL_ATTITUDE` | Prefers passive index fund investing |
| User seems risk-tolerant with investments | `FINANCIAL_ATTITUDE` | Comfortable with moderate investment risk |
| User mentions wanting aggressive savings | `FINANCIAL_ATTITUDE` | Aggressive savings mindset |
| User hints at a financial priority | `GOAL_RELATED` | Wants to build 6-month emergency fund |

---

## Current Limitations & Known Gaps

### L1: One memory per response
The system only saves ONE memory action per AI response. If a user shares multiple facts in a single message (e.g., "I live in Boston, make 100k, and have 2 kids"), only the most important one gets captured. The others are lost.

**Recommendation**: Either allow multiple memory markers per response, or have the AI prioritize the most financially relevant fact and naturally ask a follow-up that re-surfaces the others.

### L2: No memory update/correction
If a user previously said "I make $100k" and later says "I got a raise, I now make $120k," the old memory stays and a new one is added. There is no mechanism to update or replace existing memories from the AI side.

**Recommendation**: Add a `[MEMORY_UPDATE]` marker that references the category and replaces existing content. The prompt should instruct the AI to use update when it detects a change to previously stored information.

### L3: Cooldown between memory actions
The client enforces a 2-response cooldown between memory actions. If the user shares important facts in rapid succession, some will be silently dropped.

**Recommendation**: Consider reducing cooldown to 1, or exempting auto-saves from the cooldown (only throttle proposals).

### L4: Demo/temp sessions block all memory
When in a demo scenario or temporary chat, all memory saving is disabled. This is correct behavior but worth documenting — users won't see memory features in demo mode.

### L5: No memory persistence
Memories exist only in the current app session (in-memory state). Closing the app or refreshing loses all memories. This is expected for the prototype but should use server-side storage in production.

---

## Architecture Notes

### Server side (`api-server/src/routes/chat.ts`)
- `VALID_MEMORY_CATEGORIES` Set validates category strings
- `parseMemoryMarkers()` extracts `[MEMORY_SAVE]` and `[MEMORY_PROPOSAL]` markers from AI output
- `memoryAction` is included in the JSON response for both `/chat` and `/chat/stream` endpoints
- The done event in SSE streaming carries the `memoryAction` payload

### Client side (`mobile/context/CoachContext.tsx`)
- `VALID_MEMORY_CATEGORIES` Set mirrors the server-side validation
- `shouldAllowMemoryAction()` enforces frequency rules (cooldown, temp chat block)
- `applyMemoryAction()` creates Memory objects or MemoryProposal UI
- Auto-saves → `IMPLICIT_CONFIRMED` source → "Coach noticed" label in UI
- Proposals → user confirms → `EXPLICIT` source → "You shared" label in UI
- Duplicate detection: exact content match (case-insensitive) prevents re-saving

### Memory flow
```
User message
  → Server builds prompt with existing memories
  → AI generates response + optional [MEMORY_SAVE] or [MEMORY_PROPOSAL] marker
  → Server parses marker via parseMemoryMarkers()
  → Server returns memoryAction in response JSON
  → Client checks shouldAllowMemoryAction() frequency rules
  → Client calls applyMemoryAction() to store or propose
  → UI shows "Saved to memory" chip or proposal card
```
