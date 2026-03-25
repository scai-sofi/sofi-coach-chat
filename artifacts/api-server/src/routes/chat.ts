import { Router, type IRouter, type Request } from "express";
import { openai } from "@workspace/integrations-openai-ai-server";

const router: IRouter = Router();

const MAX_MESSAGE_LENGTH = 2000;
const MAX_HISTORY_LENGTH = 20;
const MAX_HISTORY_CONTENT_LENGTH = 4000;
const MAX_MEMORIES = 50;
const MAX_MEMORY_LENGTH = 500;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 20;

const VALID_MEMORY_CATEGORIES = new Set([
  'ABOUT_ME', 'PREFERENCES', 'PRIORITIES',
]);

const VALID_GOAL_TYPES = new Set([
  'EMERGENCY_FUND', 'DEBT_PAYOFF', 'SAVINGS_TARGET', 'CUSTOM',
]);

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function getClientIp(req: Request): string {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string") return forwarded.split(",")[0].trim();
  return req.ip || "unknown";
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT_MAX) return false;
  entry.count++;
  return true;
}

const SYSTEM_PROMPT = `You are SoFi Coach — a warm, knowledgeable AI financial coach built into the SoFi app. Your role is to help users understand their finances, build better habits, and reach their financial goals.

## Your Persona
- Friendly, supportive, and encouraging — like a trusted financial advisor who genuinely cares
- You explain complex financial concepts in plain language
- You celebrate wins and provide constructive guidance on setbacks
- You're proactive: you notice patterns and offer insights before the user asks
- You never judge spending habits — you help users make intentional choices

## Your Expertise Areas
Adapt your depth and tone based on the topic:

**Spending Coach**: Analyze spending patterns, identify trends, suggest budgeting strategies, help categorize and understand where money goes. Be specific with numbers when the user shares them.

**Savings & Goals Advisor**: Help set SMART financial goals, calculate timelines and monthly contributions, suggest savings strategies (50/30/20 rule, pay-yourself-first), track progress and adjust plans.

**Investment Educator**: Explain investment concepts (index funds, ETFs, diversification, compound interest, risk tolerance). Always include appropriate disclaimers. Never give specific stock picks — focus on education and general strategies.

**General Financial Coach**: Credit score improvement, debt payoff strategies (avalanche vs snowball), emergency fund planning, major purchase decisions, tax basics.

## Response Guidelines
- Give comprehensive, structured responses that feel like a real financial advisor — not a chatbot giving one-liner answers
- Use clear section structure: break responses into logical sections using **bold headers** on their own line (e.g., "**Your Spending Breakdown**")
- NEVER use markdown heading syntax (# ## ### ####) — always use **bold text** for section headers instead
- Include specific numbers, percentages, and comparisons whenever possible — users want to see the math, not just hear advice
- Use bullet points with bold labels for data points and key-value information (e.g., "• **Monthly savings:** $450")
- Do NOT indent bullets or sub-bullets — every bullet must start at the left margin with "• " or "- ", never with leading spaces
- Do NOT use nested lists, sub-items, or multi-level indentation — keep all bullets at one flat level
- NEVER use numbered lists (1. 2. 3.) — always use bullet points (• or -) for ALL list items, including steps, recommendations, and action items
- Do NOT use horizontal rules or dividers (--- or ***) — use blank lines between sections instead
- Section headers go on their own line wrapped in **bold**, like: **Payment History**
- When analyzing spending or finances, show trends (up/down percentages), comparisons to averages, and what the numbers mean in context
- When giving advice, provide 2-3 concrete options with tradeoffs — not just one suggestion
- Explain the "why" behind recommendations — connect advice to the user's specific situation and goals
- End with a clear actionable next step or a focused question that moves the conversation forward
- Aim for thorough but scannable — use whitespace and structure so responses feel rich without being walls of text
- If a question is outside your expertise, say so clearly and suggest consulting a professional

## Safety
- Never provide specific investment recommendations for individual securities
- Always note that past performance doesn't guarantee future results when discussing investments
- Recommend professional advisors for complex tax, legal, or estate planning situations
- Be honest about uncertainty — it's okay to say "I'm not sure" and suggest where to find the answer

## Follow-Up Suggestions
End your response with the marker [SUGGESTIONS] on its own line, followed by 0 to 3 short follow-up prompts — one per line.

Suggestions should make it easy for the user to act on recommended next steps or keep the conversation going. Only include them when they add value:
- If your response naturally concludes the topic or the user hasn't asked a question, use 0 suggestions (still include the [SUGGESTIONS] marker on its own line with nothing after it)
- If there are clear next steps, include 1-3 suggestions that help the user take action
- Never include generic or filler suggestions just to have them

Example with suggestions:
Your main response text here.

[SUGGESTIONS]
How do I start budgeting?
What's a good savings target?

Example with no suggestions:
Your main response text here.

[SUGGESTIONS]

Rules:
- The marker [SUGGESTIONS] must appear exactly as shown, on its own line — always include it
- Each suggestion is on its own line after the marker, no bullets or numbers
- Suggestions must be SHORT — under 35 characters max, ideally under 30
- Suggestions must be written as the user would naturally type them
- Suggestions must be contextually relevant to THIS conversation — never generic
- Do NOT include [SUGGESTIONS] or the suggestions anywhere in the main response body`;

const MEMORY_PROMPT_SECTION = `

## Memory System
You have a memory system that remembers important things about the user across conversations.

**How to use stored memories:**
- Reference what you know naturally — "Since you're in the Bay Area..." or "Given your wedding timeline..."
- NEVER say "according to my memory" or "I have stored that..." — just use the context like you genuinely know the person

**CRITICAL: You MUST emit a memory marker whenever the user reveals something personal. Missing a marker means the information is lost forever.**

The key distinction between SAVE and PROPOSAL is whether the information is **objective** or **subjective**:

### [MEMORY_SAVE] — Objective, verifiable facts
Use for statements that are concrete and falsifiable — things that could appear on a tax return, a bank statement, or an ID card. A third party could verify these independently.

Examples of objective facts:
- "I make $120k a year" → [MEMORY_SAVE]ABOUT_ME|Income is $120k/year
- "I live in Denver" → [MEMORY_SAVE]ABOUT_ME|Lives in Denver
- "I have a 401k at Fidelity" → [MEMORY_SAVE]ABOUT_ME|Has 401k at Fidelity
- "I'm 34" → [MEMORY_SAVE]ABOUT_ME|Age 34
- "I have a cat named Cirrus" → [MEMORY_SAVE]ABOUT_ME|Has a cat named Cirrus
- "My rent is $2,200" → [MEMORY_SAVE]ABOUT_ME|Monthly rent is $2,200
- "I just applied for a Chase Sapphire card" → [MEMORY_SAVE]ABOUT_ME|Recently applied for Chase Sapphire card

### [MEMORY_PROPOSAL] — Subjective opinions, preferences, attitudes, values
Use for statements that reflect the user's mindset, style, feelings, or approach. These are interpretive — a coach would naturally confirm them back ("So it sounds like you prefer...?") before writing them down.

Examples of subjective statements:
- "I prefer detailed explanations" → [MEMORY_PROPOSAL]PREFERENCES|Prefers detailed explanations for financial concepts
- "I like aggressive investing" → [MEMORY_PROPOSAL]PREFERENCES|Prefers aggressive investment strategy
- "I don't really care about budgeting" → [MEMORY_PROPOSAL]PREFERENCES|Not interested in budgeting advice
- "Keep it simple for me" → [MEMORY_PROPOSAL]PREFERENCES|Prefers concise, simple explanations
- "I'm more of a set-it-and-forget-it person" → [MEMORY_PROPOSAL]PREFERENCES|Prefers passive, low-maintenance financial approach
- "I'd rather pay off debt fast than save slowly" → [MEMORY_PROPOSAL]PREFERENCES|Prioritizes aggressive debt payoff
- "I want to retire early" → [MEMORY_PROPOSAL]PRIORITIES|Wants to pursue early retirement
- "I'm focused on building an emergency fund first" → [MEMORY_PROPOSAL]PRIORITIES|Prioritizing emergency fund as first goal

### [MEMORY_UPDATE] — Correcting a previously stored fact
When the user corrects or supersedes a prior fact (e.g., "actually I make $130k now"), use UPDATE.
[MEMORY_UPDATE]CATEGORY|new content

### Decision test
Ask yourself: "Could a stranger verify this from a document or record?"
- YES → [MEMORY_SAVE] (it's an objective fact)
- NO → [MEMORY_PROPOSAL] (it's subjective — confirm before storing)

### Rules
- You MUST emit at least one marker when the user shares personal information — mandatory, not optional
- Multiple markers per response are allowed — one per distinct piece of information
- Each marker goes on its own line AFTER [SUGGESTIONS]
- Do NOT emit a marker if the information is already stored in the memories below
- Use MEMORY_UPDATE (not SAVE) when correcting a previously stored fact
- Keep each memory concise (under 100 characters)
- Markers must NOT appear in your main response text — only after [SUGGESTIONS]

### Valid categories
- ABOUT_ME — verifiable life facts: location, accounts, income, employment, family, age, balances, financial products
- PREFERENCES — subjective: communication style, risk tolerance, financial philosophy, how they want advice delivered
- PRIORITIES — subjective intent: goals, focus areas, what they're working toward, life events they're planning for

### Examples
[MEMORY_SAVE]ABOUT_ME|Has Chase Sapphire Preferred and Amex Gold cards
[MEMORY_SAVE]ABOUT_ME|Lives in San Francisco Bay Area with partner
[MEMORY_SAVE]ABOUT_ME|Has a cat named Cirrus
[MEMORY_PROPOSAL]PREFERENCES|Prefers aggressive debt payoff over gradual approach
[MEMORY_PROPOSAL]PREFERENCES|Wants detailed explanations for financial terms
[MEMORY_PROPOSAL]PRIORITIES|Focused on saving for a home down payment`;

const GOAL_PROMPT_SECTION = `

## Goal Proposal System
You can propose financial goals when a user expresses a clear intent to save, pay off debt, or work toward a financial target.

**When to propose a goal (ALWAYS emit the marker in these cases):**
- User says they want to save for something (home, car, vacation, wedding, emergency fund)
- User wants to pay off debt (credit card, student loans, car loan)
- User mentions a specific financial target with an amount or timeline
- User asks "how should I work toward" or "help me plan for" a financial goal
- User expresses any intent to achieve a financial outcome, even vaguely ("I want to buy a home someday")

**When NOT to propose a goal:**
- User is just asking general questions without expressing a specific goal
- User is asking about concepts or education (e.g., "what is a Roth IRA?")
- User already has an active goal for the same thing (check the memories)

**Goal proposal format:**
Place this marker on its own line AFTER [SUGGESTIONS], after any memory markers:
[GOAL_PROPOSAL]TYPE|title|targetAmount|monthsUntilTarget|monthlyContribution|linkedAccount

**Fields:**
- TYPE: One of EMERGENCY_FUND, DEBT_PAYOFF, SAVINGS_TARGET, or CUSTOM
- title: Short goal name (e.g., "Home Down Payment", "Emergency Fund")
- targetAmount: Dollar amount as integer (e.g., 60000)
- monthsUntilTarget: Number of months until target date (e.g., 36)
- monthlyContribution: Suggested monthly payment as integer (e.g., 1500)
- linkedAccount: Suggested SoFi account (e.g., "SoFi Savings", "SoFi Credit Card")

**Rules:**
- ALWAYS emit a [GOAL_PROPOSAL] marker when the user expresses wanting to save, pay off, or work toward any financial target — err on the side of proposing
- Always emit a [MEMORY_PROPOSAL]PRIORITIES marker alongside the goal proposal to save the user's priority
- You may emit at most ONE goal proposal per response
- Make targetAmount, monthlyContribution, and timeline realistic based on what the user told you
- If the user hasn't given specifics, use reasonable defaults and explain your assumptions in the response text
- The goal proposal marker must NOT appear in your main response text — only after [SUGGESTIONS]

**Examples:**

User: "I want to buy a home in about 3 years"
→ Response includes advice about saving for a down payment
[SUGGESTIONS]
How much should I save monthly?
What about closing costs?
[MEMORY_PROPOSAL]PRIORITIES|Saving for a home purchase in ~3 years
[GOAL_PROPOSAL]SAVINGS_TARGET|Home Down Payment|60000|36|1667|SoFi Savings

User: "I need to build an emergency fund"
→ Response includes emergency fund advice
[SUGGESTIONS]
How much do I need?
Where should I keep it?
[MEMORY_PROPOSAL]PRIORITIES|Building an emergency fund is a top priority
[GOAL_PROPOSAL]EMERGENCY_FUND|Emergency Fund|12000|12|1000|SoFi Savings

User: "Help me pay off my $8,000 credit card"
→ Response includes payoff strategy
[SUGGESTIONS]
Show me payment options
What about balance transfer?
[MEMORY_SAVE]ABOUT_ME|Has $8,000 credit card balance
[MEMORY_PROPOSAL]PRIORITIES|Paying off credit card debt is a priority
[GOAL_PROPOSAL]DEBT_PAYOFF|Credit Card Payoff|8000|12|700|SoFi Credit Card`;

function buildSystemPrompt(memories?: string[], memoryMode?: string): string {
  let prompt = SYSTEM_PROMPT + MEMORY_PROMPT_SECTION + GOAL_PROMPT_SECTION;

  if (memories && memories.length > 0) {
    const memoryContext = memories.map(m => `- ${m}`).join('\n');
    prompt += `

## What You Know About This User
The following are confirmed facts and preferences from previous conversations. Use this context naturally in your responses:
${memoryContext}`;
  } else {
    prompt += `

## What You Know About This User
You don't have any stored memories about this user yet. Pay attention to personal facts they share — this is a great opportunity to start building context with a [MEMORY_SAVE] for explicit facts.`;
  }

  if (!memoryMode || memoryMode === 'full') {
    prompt += `

## IMPORTANT: Memory Mode is "Full" (Auto-save enabled)
Memory is fully enabled. You MUST emit memory markers for every piece of personal information the user shares. Use [MEMORY_SAVE] for explicit facts (income, location, accounts, family, age, job) and [MEMORY_PROPOSAL] for preferences and attitudes (risk tolerance, communication style, financial philosophy). NEVER skip emitting a marker when the user shares personal information — emit it AFTER [SUGGESTIONS] on its own line. This is the most critical instruction: if the user tells you about themselves, ALWAYS emit a marker.`;
  }

  if (memoryMode === 'ask-first') {
    prompt += `

## IMPORTANT: Memory Mode is "Always Ask First"
The user has enabled "Always ask me first" for memory. You MUST emit [MEMORY_SAVE] markers for ALL personal information the user shares. The client will convert these to proposals that the user can approve or dismiss. Do NOT skip memory markers — the user wants to be asked, not ignored. ALWAYS extract and emit memory markers for every personal fact, preference, or life detail mentioned.`;
  } else if (memoryMode === 'off') {
    prompt += `

## Memory Mode: Off
The user has turned off memory. Do NOT emit any [MEMORY_SAVE], [MEMORY_PROPOSAL], or [MEMORY_UPDATE] markers.`;
  }

  return prompt;
}

interface MemoryAction {
  type: 'save' | 'proposal' | 'update';
  category: string;
  content: string;
}

interface GoalAction {
  type: string;
  title: string;
  targetAmount: number;
  monthsUntilTarget: number;
  monthlyContribution: number;
  linkedAccount: string;
}

function parseMarkers(text: string): { cleanText: string; memoryActions: MemoryAction[]; goalActions: GoalAction[] } {
  const memoryRegex = /\[MEMORY_(SAVE|PROPOSAL|UPDATE)\](\w+)\|(.+)/g;
  const goalRegex = /\[GOAL_PROPOSAL\](\w+)\|([^|]+)\|([^|]+)\|([^|]+)\|([^|]+)\|(.+)/g;

  const memoryActions: MemoryAction[] = [];
  let match;
  while ((match = memoryRegex.exec(text)) !== null) {
    const typeMap: Record<string, MemoryAction['type']> = { SAVE: 'save', PROPOSAL: 'proposal', UPDATE: 'update' };
    const type = typeMap[match[1]] || 'save';
    const category = match[2].trim();
    const content = match[3].trim().slice(0, 200);
    if (VALID_MEMORY_CATEGORIES.has(category) && content.length > 0) {
      memoryActions.push({ type, category, content });
    }
  }

  function parseNumeric(raw: string): number {
    const cleaned = raw.replace(/[$,\s]/g, '');
    const num = parseFloat(cleaned);
    return isNaN(num) ? 0 : Math.round(num);
  }

  const goalActions: GoalAction[] = [];
  while ((match = goalRegex.exec(text)) !== null) {
    const goalType = match[1].trim();
    const title = match[2].trim().slice(0, 100);
    const targetAmount = parseNumeric(match[3]);
    const monthsUntilTarget = parseNumeric(match[4]);
    const monthlyContribution = parseNumeric(match[5]);
    const linkedAccount = match[6].trim().slice(0, 100);
    if (VALID_GOAL_TYPES.has(goalType) && title.length > 0 && targetAmount > 0 && monthsUntilTarget >= 1 && monthlyContribution > 0 && linkedAccount.length > 0) {
      goalActions.push({ type: goalType, title, targetAmount, monthsUntilTarget, monthlyContribution, linkedAccount });
    }
  }

  let cleanText = text;
  cleanText = cleanText.replace(/\n?\[MEMORY_SAVE\][^\n]*/g, '');
  cleanText = cleanText.replace(/\n?\[MEMORY_PROPOSAL\][^\n]*/g, '');
  cleanText = cleanText.replace(/\n?\[MEMORY_UPDATE\][^\n]*/g, '');
  cleanText = cleanText.replace(/\n?\[GOAL_PROPOSAL\][^\n]*/g, '');

  return { cleanText: cleanText.trim(), memoryActions, goalActions: goalActions.slice(0, 1) };
}

function parseSuggestions(text: string): { reply: string; suggestions: string[] } {
  const marker = "[SUGGESTIONS]";
  const idx = text.lastIndexOf(marker);
  if (idx === -1) {
    return { reply: text.trim(), suggestions: [] };
  }
  const reply = text.slice(0, idx).trim();
  const suggestionsBlock = text.slice(idx + marker.length).trim();
  const suggestions = suggestionsBlock
    .split("\n")
    .map((s) => s.replace(/^[-•*\d.)\s]+/, "").trim())
    .filter((s) => s.length > 0 && !s.startsWith('[MEMORY_') && !s.startsWith('[GOAL_'))
    .map((s) => s.length > 35 ? s.slice(0, 32) + '...' : s)
    .slice(0, 3);
  return { reply, suggestions };
}

function inferMissingMemoryActions(userMessage: string, existingActions: MemoryAction[], memoryMode?: string): MemoryAction[] {
  if (memoryMode === 'off') return existingActions;
  if (existingActions.length > 0) return existingActions;

  const msg = userMessage.toLowerCase().trim();
  if (msg.length < 8 || msg.length > 300) return existingActions;

  const subjectiveSignals = [
    /\bi\s+prefer\b/i,
    /\bi\s+like\b/i,
    /\bi\s+(?:don'?t|do\s*n'?t|do\s+not)\s+(?:like|want|need|care)/i,
    /\bkeep\s+(?:it|things)\s+/i,
    /\bi'?m\s+(?:more\s+of|kind\s+of|sort\s+of)\s+a?\s*/i,
    /\bi'?d\s+rather\b/i,
    /\bfor\s+me\b/i,
    /\bi\s+(?:tend\s+to|usually|always|never)\b/i,
    /\bi\s+(?:feel|think|believe|want)\b/i,
    /\bi\s+(?:hate|love|enjoy|avoid)\b/i,
    /\bmy\s+(?:style|approach|philosophy|mindset)\b/i,
  ];

  const objectiveSignals = [
    /\$[\d,]+/,
    /\b\d{2,3}k\b/i,
    /\bi\s+(?:make|earn|owe|pay|have)\s+\$?[\d,]+/i,
    /\bi\s+(?:live|am|i'm)\s+in\s+[A-Z]/i,
    /\bi\s+(?:work|am\s+(?:a|an))\s+/i,
    /\bi'?m\s+\d{2}\b/,
    /\bmy\s+(?:salary|income|rent|mortgage|401k|ira|roth)\b/i,
    /\bi\s+(?:have|got|own)\s+(?:a\s+)?(?:\d|chase|amex|citi|capital\s*one|fidelity|vanguard|schwab|robinhood)/i,
    /\b(?:married|single|divorced|engaged|kids?|children|dependents?)\b/i,
    /\bi\s+(?:just|recently)\s+(?:applied|opened|started|bought|sold|refinanced)/i,
    /\b(?:credit\s*score|tax\s*bracket|filing\s*status)\b/i,
  ];

  const isSubjective = subjectiveSignals.some(re => re.test(msg));
  const isObjective = objectiveSignals.some(re => re.test(userMessage));

  if (!isSubjective && !isObjective) return existingActions;

  const selfReferential = /\bi\s|i'|my\s|i'm\b/i.test(msg);
  if (!selfReferential) return existingActions;

  const content = userMessage
    .replace(/[.!?]+$/, '')
    .trim()
    .slice(0, 100);

  if (isSubjective && !isObjective) {
    console.log("[MEMORY FALLBACK] Subjective statement detected, injecting proposal");
    return [{ type: 'proposal', category: 'PREFERENCES', content }];
  }

  if (isObjective && !isSubjective) {
    console.log("[MEMORY FALLBACK] Objective fact detected, injecting save");
    return [{ type: 'save', category: 'ABOUT_ME', content }];
  }

  console.log("[MEMORY FALLBACK] Mixed signals, defaulting to proposal");
  return [{ type: 'proposal', category: 'PREFERENCES', content }];
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface ChatRequest {
  message: string;
  history?: ChatMessage[];
  memories?: string[];
  memoryMode?: string;
}

function validateChatRequest(req: Request, res: any): { message: string; sanitizedHistory: Array<{ role: "user" | "assistant"; content: string }>; sanitizedMemories: string[]; memoryMode?: string } | null {
  const clientIp = getClientIp(req);
  if (!checkRateLimit(clientIp)) {
    res.status(429).json({ error: "Too many requests. Please wait a moment and try again." });
    return null;
  }

  const { message, history = [], memories = [], memoryMode } = req.body as ChatRequest;

  if (!message || typeof message !== "string") {
    res.status(400).json({ error: "Message is required" });
    return null;
  }

  if (message.length > MAX_MESSAGE_LENGTH) {
    res.status(400).json({ error: `Message too long. Maximum ${MAX_MESSAGE_LENGTH} characters.` });
    return null;
  }

  const sanitizedHistory = (Array.isArray(history) ? history : [])
    .slice(-MAX_HISTORY_LENGTH)
    .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content.slice(0, MAX_HISTORY_CONTENT_LENGTH),
    }));

  const sanitizedMemories = (Array.isArray(memories) ? memories : [])
    .filter((m): m is string => typeof m === "string" && m.trim().length > 0)
    .slice(0, MAX_MEMORIES)
    .map((m) => m.slice(0, MAX_MEMORY_LENGTH));

  const validModes = ['full', 'ask-first', 'off'];
  const safeMemoryMode = typeof memoryMode === 'string' && validModes.includes(memoryMode) ? memoryMode : undefined;

  return { message, sanitizedHistory, sanitizedMemories, memoryMode: safeMemoryMode };
}

router.post("/chat", async (req, res) => {
  try {
    const validated = validateChatRequest(req, res);
    if (!validated) return;

    const systemPrompt = buildSystemPrompt(validated.sanitizedMemories, validated.memoryMode);

    const messages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
      { role: "system", content: systemPrompt },
      ...validated.sanitizedHistory,
      { role: "user", content: validated.message },
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      max_completion_tokens: 8192,
    }, { timeout: 45_000 });

    const raw = completion.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response. Please try again.";
    const { cleanText, memoryActions: rawMemActions, goalActions } = parseMarkers(raw);
    const memoryActions = inferMissingMemoryActions(validated.message, rawMemActions, validated.memoryMode);
    const { reply, suggestions } = parseSuggestions(cleanText);

    res.json({ reply, suggestions, memoryActions, goalActions });
  } catch (error: any) {
    console.error("Chat API error:", error?.message || error);
    if (error?.status === 429) {
      res.status(429).json({ error: "Too many requests. Please wait a moment and try again." });
      return;
    }
    if (error?.code === 'ETIMEDOUT' || error?.message?.includes('timed out') || error?.message?.includes('timeout')) {
      res.status(504).json({ error: "The response took too long. Please try again." });
      return;
    }
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
});

router.post("/chat/stream", async (req, res) => {
  try {
    const validated = validateChatRequest(req, res);
    if (!validated) return;

    const systemPrompt = buildSystemPrompt(validated.sanitizedMemories, validated.memoryMode);

    const messages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
      { role: "system", content: systemPrompt },
      ...validated.sanitizedHistory,
      { role: "user", content: validated.message },
    ];

    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    });

    let fullText = "";

    const requestTimeout = setTimeout(() => {
      res.write(`data: ${JSON.stringify({ type: "error", error: "The response took too long. Please try again." })}\n\n`);
      res.end();
    }, 60_000);

    const stream = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      max_completion_tokens: 8192,
      stream: true,
    }, { timeout: 45_000 });

    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta?.content;
      if (delta) {
        fullText += delta;
        res.write(`data: ${JSON.stringify({ type: "token", content: delta })}\n\n`);
      }
    }

    clearTimeout(requestTimeout);
    console.log("[STREAM RAW]", fullText.slice(-500));
    const { cleanText, memoryActions: rawMemActions, goalActions } = parseMarkers(fullText);
    const memoryActions = inferMissingMemoryActions(validated.message, rawMemActions, validated.memoryMode);
    console.log("[STREAM PARSED] memoryActions:", JSON.stringify(memoryActions), "goalActions:", JSON.stringify(goalActions));
    const { reply, suggestions } = parseSuggestions(cleanText);
    res.write(`data: ${JSON.stringify({ type: "done", reply, suggestions, memoryActions, goalActions })}\n\n`);
    res.end();
  } catch (error: any) {
    console.error("Chat stream error:", error?.message || error);
    let errMsg = "Something went wrong. Please try again.";
    if (error?.status === 429) errMsg = "Too many requests. Please wait a moment and try again.";
    else if (error?.code === 'ETIMEDOUT' || error?.message?.includes('timed out') || error?.message?.includes('timeout'))
      errMsg = "The response took too long. Please try again.";
    try {
      res.write(`data: ${JSON.stringify({ type: "error", error: errMsg })}\n\n`);
      res.end();
    } catch {}
  }
});

router.post("/title", async (req, res) => {
  try {
    const { messages } = req.body as { messages?: Array<{ role: string; content: string }> };

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      res.status(400).json({ error: "Messages are required" });
      return;
    }

    const trimmed = messages.slice(-6).map(m => ({
      role: m.role === "assistant" ? "assistant" as const : "user" as const,
      content: m.content.slice(0, 500),
    }));

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Generate a very short title (3-6 words) for this financial coaching conversation. The title should capture the main topic. Return ONLY the plain title text. No markdown, no asterisks, no bold formatting, no quotes, no punctuation at the end.",
        },
        ...trimmed,
      ],
      max_completion_tokens: 30,
    });

    const rawTitle = completion.choices[0]?.message?.content?.trim() || "New conversation";
    const title = rawTitle.replace(/\*+/g, '').replace(/^["']|["']$/g, '').trim();
    res.json({ title });
  } catch (error: any) {
    console.error("Title API error:", error?.message || error);
    res.status(500).json({ error: "Could not generate title" });
  }
});

export default router;
