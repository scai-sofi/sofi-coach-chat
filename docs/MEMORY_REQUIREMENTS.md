# Memory System — Requirements & Trigger Map

This document defines when and how the SoFi Coach Chat memory system should capture, categorize, and store user information. It serves as the source of truth for prompt engineering, client-side validation, and Flutter migration.

---

## Memory Categories

| Category | Label | What it captures | Save type |
|---|---|---|---|
| `ABOUT_ME` | About me | Life situation, household, location, accounts, financial products, income, balances, recent financial actions, employment, factual details | Auto-save |
| `PREFERENCES` | Preferences | Communication style, detail level, risk tolerance, financial approach, how they want things done, saving vs spending philosophy | Propose |
| `PRIORITIES` | Priorities | Current goals, focus areas, things they're working toward, life events they're planning around, debt payoff targets, savings targets | Auto-save or Propose |

---

## Trigger Rules — When to Capture Memories

### Always auto-save (MEMORY_SAVE)

Auto-save when the user shares any unambiguous personal fact. The AI does not ask for confirmation — it saves immediately and tells the user what was stored.

**ABOUT_ME auto-save signals:**
- Financial specifics: income, salary, rent, mortgage, debt amounts, balances, credit score, tax status
- Financial products: credit cards, bank accounts, loans, insurance, brokerage/retirement accounts (401k, IRA, Roth), pending applications
- Life details: age, location, household size, marital/family status, employment, homeowner vs renter
- Life events: wedding, baby, retirement timeline, job change, move, major purchase
- Budget constraints: monthly fixed expenses, discretionary budget, savings capacity, minimum payments

**PRIORITIES auto-save signals:**
- Explicit goals: "I want to save $X for Y", "I want to pay off X by Y"
- Declared focus areas: "My priority right now is...", "I'm focused on..."

### Propose for confirmation (MEMORY_PROPOSAL)

Propose when the AI infers something the user hasn't explicitly stated. The user must confirm before it's stored.

**PREFERENCES proposal signals:**
- Communication style patterns (prefers detail vs. summaries, frequency of check-ins)
- Financial philosophy (risk tolerance, debt-averse behavior, aggressive vs. conservative approach)
- Detected investment style (index funds vs. stock picking, active vs. passive)

**PRIORITIES proposal signals:**
- Inferred goals from behavior patterns (e.g., user keeps asking about emergency funds → infer it's a priority)
- Emerging focus areas the user hasn't explicitly declared

### Update existing memories (MEMORY_UPDATE)

When a user corrects or supersedes a previously stored fact (e.g., "actually I make $130k now"), the AI emits a `[MEMORY_UPDATE]` marker. The system finds the best-matching active memory in the same category and replaces its content.

---

## Memory Markers

The AI emits markers after `[SUGGESTIONS]` in its response. Markers are stripped before the response reaches the user.

```
[MEMORY_SAVE]CATEGORY|content
[MEMORY_PROPOSAL]CATEGORY|content
[MEMORY_UPDATE]CATEGORY|new content
```

**Rules:**
- Multiple markers per response are allowed (one per distinct fact or insight)
- Related facts can be grouped into a single memory; unrelated facts get separate markers
- Saves, proposals, and updates can be mixed in the same response
- No marker if the information is already stored (deduplication)
- Content must be concise (under 100 characters)

---

## Frequency & Throttling

- **No cooldown**: All memory actions (saves, proposals, updates) fire immediately with no throttling
- **Temporary chat mode**: All memory actions are disabled — nothing is saved or proposed

---

## Known Limitations (Prototype)

### L1: No memory persistence
Memories exist only in the current app session (in-memory state). Closing the app loses all memories. Production should use server-side storage.

### L2: Demo scenarios use pre-loaded memories only
Demo scenarios are pre-loaded canned conversations. Each scenario comes with its own pre-set memories baked into the scenario data. The memory detection pipeline does not run on these canned messages — if it did, it would create duplicate memories from the AI's pre-written responses every time someone opened a demo. Demos showcase what the memory system *looks like* in action without actually running the detection pipeline. They are display-only snapshots.

This only applies to the canned demo messages themselves. The block on live memory detection is scoped to temporary chat mode (shield icon), not to demo scenarios. If a user starts a live chat, memory detection works normally.

---

## Architecture Notes

### Server side (`api-server/src/routes/chat.ts`)
- `VALID_MEMORY_CATEGORIES` Set validates category strings
- `parseMemoryMarkers()` extracts `[MEMORY_SAVE]`, `[MEMORY_PROPOSAL]`, and `[MEMORY_UPDATE]` markers from AI output
- `memoryActions` array is included in the JSON response for both `/chat` and `/chat/stream` endpoints
- The done event in SSE streaming carries the `memoryActions` payload

### Client side (`mobile/context/CoachContext.tsx`)
- `VALID_MEMORY_CATEGORIES` Set mirrors the server-side validation
- `shouldAllowProposal()` blocks proposals only during temporary chat mode
- No cooldown — all memory actions fire immediately
- `applyMemoryActions()` creates Memory objects, handles updates, or shows MemoryProposal UI
- Auto-saves → `IMPLICIT_CONFIRMED` source → "AI inferred" label in UI
- Proposals → user confirms → `EXPLICIT` source → "You created" label in UI
- Updates → find best match by category + content similarity → replace content
- Duplicate detection: exact content match (case-insensitive) prevents re-saving

### Memory flow
```
User message
  → Server builds prompt with existing memories
  → AI generates response + optional memory markers (save/proposal/update)
  → Server parses markers via parseMemoryMarkers()
  → Server returns memoryActions array in response JSON
  → Client processes all actions: saves immediately, proposals with cooldown check, updates by match
  → UI shows "Saved to memory" chip, proposal card, or "Memory updated" chip
```
