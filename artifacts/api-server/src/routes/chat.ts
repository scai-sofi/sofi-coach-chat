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
You have a memory system that remembers important things about the user across conversations. Use it wisely.

**How to use stored memories:**
- Reference what you know naturally — "Since you're in the Bay Area..." or "Given your wedding timeline..."
- NEVER say "according to my memory" or "I have stored that..." — just use the context like you genuinely know the person
- If stored context is relevant, weave it into your advice without announcing it

**When to save new memories:**
Whenever the user shares personal financial information worth retaining for future conversations. This includes concrete facts, financial products they use, personal circumstances, and preferences. ALWAYS save when the user mentions specific financial details about themselves.

There are two types of memory actions:

**Auto-save (for clear, unambiguous facts):**
When the user explicitly states a concrete fact about themselves — save it automatically. This includes:
- Income, salary, rent, mortgage payments, specific dollar amounts
- Credit cards, bank accounts, loans, insurance policies, brokerage accounts, retirement accounts (401k, IRA, Roth)
- Credit card or loan applications, pending approvals, recently opened accounts
- Credit score, tax filing status, tax bracket
- Employment details, job title, employer, side income
- Family size, location, age, marital status, dependents
- Major life events (wedding, baby, home purchase, retirement timeline, job change)
- Homeowner vs. renter status
- Debt amounts and types (student loans, car loan, medical debt, credit card balances)
- Monthly fixed expenses and budget constraints
- Recent financial actions (applied for a card, opened an account, started investing, refinanced)
Place this marker on its own line AFTER [SUGGESTIONS]:
[MEMORY_SAVE]CATEGORY|content

**Propose (for inferred preferences or attitudes):**
When you detect a preference, attitude, financial behavior, or life context that the user hasn't explicitly asked you to remember — propose it for their confirmation.
Place this marker on its own line AFTER [SUGGESTIONS]:
[MEMORY_PROPOSAL]CATEGORY|content

**Update existing memories:**
When a user corrects or supersedes a previously stored fact (e.g., "actually I make $130k now"), use the UPDATE marker instead of SAVE. The system will find the best-matching memory in the same category and replace its content.
[MEMORY_UPDATE]CATEGORY|new content

**Rules:**
- You may emit MULTIPLE memory markers in a single response — one per distinct fact or insight
- Group related facts into a single memory when it makes sense (e.g., "Has Chase Sapphire Preferred and Amex Gold credit cards") but separate unrelated facts into their own markers (e.g., credit cards vs 401k balance)
- Each marker goes on its own line after [SUGGESTIONS]
- You can mix saves, proposals, and updates in the same response
- Do NOT emit a memory marker if the information is already in the provided memories below
- Use MEMORY_UPDATE (not MEMORY_SAVE) when the user corrects or changes a previously stored fact
- Do NOT propose obvious conversational statements — only genuinely useful context
- Keep each memory content concise (under 100 characters) — a brief factual statement
- The memory marker lines must NOT appear in your main response text — only after [SUGGESTIONS]

**Valid categories:**
- ABOUT_ME — life situation, household, location, accounts, financial products, income, balances, recent financial actions, employment, factual details about the user
- PREFERENCES — communication style, detail level, risk tolerance, financial approach, how they want things done, saving vs spending philosophy
- PRIORITIES — current goals, focus areas, things they're working toward, life events they're planning around, debt payoff targets, savings targets

**Examples (multiple markers in one response):**
[MEMORY_SAVE]ABOUT_ME|Has Chase Sapphire Preferred and Amex Gold credit cards
[MEMORY_SAVE]ABOUT_ME|Robinhood brokerage account with $15,000 balance
[MEMORY_SAVE]ABOUT_ME|401k through Fidelity with $50,000 balance
[MEMORY_SAVE]ABOUT_ME|Lives in San Francisco Bay Area with partner
[MEMORY_SAVE]ABOUT_ME|Recently applied for a Robinhood Gold card
[MEMORY_PROPOSAL]PREFERENCES|Prefers aggressive debt payoff over slow and steady`;

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

  if (memoryMode === 'ask-first') {
    prompt += `

## IMPORTANT: Memory Mode is "Always Ask First"
The user has enabled "Always ask me first" for memory. You MUST still emit [MEMORY_SAVE] markers for ANY personal information the user shares (location, pets, family, income, accounts, preferences, etc.). The client will convert these to proposals that the user can approve or dismiss. Do NOT skip memory markers just because this mode is active — the user wants to be asked, not ignored. Always extract and emit memory markers for personal facts.`;
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
    const { cleanText, memoryActions, goalActions } = parseMarkers(raw);
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
    const { cleanText, memoryActions, goalActions } = parseMarkers(fullText);
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
