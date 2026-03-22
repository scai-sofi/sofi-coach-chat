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
  'PREFERENCE', 'CONSTRAINT', 'LIFE_CONTEXT',
  'FINANCIAL_ATTITUDE', 'GOAL_RELATED', 'EXPLICIT_FACT',
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
Only when the user shares something genuinely worth retaining for future conversations. Most messages do NOT warrant a memory. Only act on substantive personal disclosures.

There are two types of memory actions:

**Auto-save (for clear, unambiguous facts):**
When the user explicitly states a concrete fact about themselves — income, family size, location, specific account balances, employment status, clear deadlines — save it automatically.
Place this marker on its own line AFTER [SUGGESTIONS]:
[MEMORY_SAVE]CATEGORY|content

**Propose (for inferred preferences or attitudes):**
When you detect a preference, attitude, financial behavior, or life context that the user hasn't explicitly asked you to remember — propose it for their confirmation.
Place this marker on its own line AFTER [SUGGESTIONS]:
[MEMORY_PROPOSAL]CATEGORY|content

**Rules:**
- Maximum ONE memory action per response (either save or propose, never both)
- Do NOT emit a memory marker if the information is already in the provided memories below
- Do NOT propose obvious conversational statements — only genuinely useful context
- Keep memory content concise (under 100 characters) — a brief factual statement
- The memory marker lines must NOT appear in your main response text — only after [SUGGESTIONS]

**Valid categories:**
- PREFERENCE — user preferences for communication style, detail level, frequency
- FINANCIAL_ATTITUDE — risk tolerance, saving vs spending philosophy, financial priorities
- GOAL_RELATED — specific financial goals, savings targets, debt priorities
- LIFE_CONTEXT — location, family situation, job, major life events
- CONSTRAINT — budget limits, income constraints, debt obligations
- EXPLICIT_FACT — specific numbers (income, rent, account balances)

**Examples:**
[MEMORY_SAVE]LIFE_CONTEXT|Lives in San Francisco Bay Area with partner
[MEMORY_SAVE]EXPLICIT_FACT|Annual household income is $85,000
[MEMORY_PROPOSAL]FINANCIAL_ATTITUDE|Prefers aggressive debt payoff over slow and steady
[MEMORY_PROPOSAL]PREFERENCE|Likes detailed breakdowns with specific numbers`;

function buildSystemPrompt(memories?: string[]): string {
  let prompt = SYSTEM_PROMPT + MEMORY_PROMPT_SECTION;

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

  return prompt;
}

interface MemoryAction {
  type: 'save' | 'proposal';
  category: string;
  content: string;
}

function parseMemoryMarkers(text: string): { cleanText: string; memoryAction: MemoryAction | null } {
  const saveRegex = /\n?\[MEMORY_SAVE\](\w+)\|(.+)/;
  const proposalRegex = /\n?\[MEMORY_PROPOSAL\](\w+)\|(.+)/;

  let cleanText = text;
  let memoryAction: MemoryAction | null = null;

  const saveMatch = cleanText.match(saveRegex);
  if (saveMatch) {
    const category = saveMatch[1].trim();
    const content = saveMatch[2].trim().slice(0, 200);
    if (VALID_MEMORY_CATEGORIES.has(category) && content.length > 0) {
      memoryAction = { type: 'save', category, content };
    }
    cleanText = cleanText.replace(saveRegex, '');
  }

  if (!memoryAction) {
    const proposalMatch = cleanText.match(proposalRegex);
    if (proposalMatch) {
      const category = proposalMatch[1].trim();
      const content = proposalMatch[2].trim().slice(0, 200);
      if (VALID_MEMORY_CATEGORIES.has(category) && content.length > 0) {
        memoryAction = { type: 'proposal', category, content };
      }
      cleanText = cleanText.replace(proposalRegex, '');
    }
  }

  cleanText = cleanText.replace(/\[MEMORY_SAVE\][^\n]*/g, '');
  cleanText = cleanText.replace(/\[MEMORY_PROPOSAL\][^\n]*/g, '');

  return { cleanText: cleanText.trim(), memoryAction };
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
    .filter((s) => s.length > 0 && !s.startsWith('[MEMORY_'))
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
}

function validateChatRequest(req: Request, res: any): { message: string; sanitizedHistory: Array<{ role: "user" | "assistant"; content: string }>; sanitizedMemories: string[] } | null {
  const clientIp = getClientIp(req);
  if (!checkRateLimit(clientIp)) {
    res.status(429).json({ error: "Too many requests. Please wait a moment and try again." });
    return null;
  }

  const { message, history = [], memories = [] } = req.body as ChatRequest;

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

  return { message, sanitizedHistory, sanitizedMemories };
}

router.post("/chat", async (req, res) => {
  try {
    const validated = validateChatRequest(req, res);
    if (!validated) return;

    const systemPrompt = buildSystemPrompt(validated.sanitizedMemories);

    const messages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
      { role: "system", content: systemPrompt },
      ...validated.sanitizedHistory,
      { role: "user", content: validated.message },
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      max_completion_tokens: 8192,
    });

    const raw = completion.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response. Please try again.";
    const { cleanText, memoryAction } = parseMemoryMarkers(raw);
    const { reply, suggestions } = parseSuggestions(cleanText);

    res.json({ reply, suggestions, memoryAction });
  } catch (error: any) {
    console.error("Chat API error:", error?.message || error);
    if (error?.status === 429) {
      res.status(429).json({ error: "Too many requests. Please wait a moment and try again." });
      return;
    }
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
});

router.post("/chat/stream", async (req, res) => {
  try {
    const validated = validateChatRequest(req, res);
    if (!validated) return;

    const systemPrompt = buildSystemPrompt(validated.sanitizedMemories);

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

    const stream = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      max_completion_tokens: 8192,
      stream: true,
    });

    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta?.content;
      if (delta) {
        fullText += delta;
        res.write(`data: ${JSON.stringify({ type: "token", content: delta })}\n\n`);
      }
    }

    const { cleanText, memoryAction } = parseMemoryMarkers(fullText);
    const { reply, suggestions } = parseSuggestions(cleanText);
    res.write(`data: ${JSON.stringify({ type: "done", reply, suggestions, memoryAction })}\n\n`);
    res.end();
  } catch (error: any) {
    console.error("Chat stream error:", error?.message || error);
    const errMsg = error?.status === 429
      ? "Too many requests. Please wait a moment and try again."
      : "Something went wrong. Please try again.";
    res.write(`data: ${JSON.stringify({ type: "error", error: errMsg })}\n\n`);
    res.end();
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
