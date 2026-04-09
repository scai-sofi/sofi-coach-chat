/**
 * Mock OpenAI-compatible server for local development.
 *
 * Implements /v1/chat/completions (streaming + non-streaming) so the
 * sofi-coach-chat api-server can run without a real OpenAI API key.
 *
 * Usage:
 *   PORT=4321 tsx scripts/src/mock-openai.ts
 */

import http from "http";

const PORT = Number(process.env.PORT ?? 4321);

// ---------------------------------------------------------------------------
// Response templates — realistic SoFi Coach format with [SUGGESTIONS] marker
// ---------------------------------------------------------------------------
const RESPONSES: Array<{ trigger: RegExp; response: string }> = [
  {
    trigger: /budget|spend|categoriz/i,
    response: `**Your Spending Snapshot**

Great question about budgeting! Here are a few proven frameworks to get started:

**The 50/30/20 Rule**
• **50%** — Needs (rent, groceries, utilities, minimum debt payments)
• **30%** — Wants (dining, entertainment, subscriptions)
• **20%** — Savings & extra debt payments

**Why It Works**
This rule is flexible enough for most income levels and gives you permission to enjoy life while still building financial security. The key is tracking actual spending for 30 days before tweaking percentages.

**Getting Started**
• Review your last 3 months of bank/card statements
• Categorize every transaction (most banking apps do this automatically)
• Compare your actual splits to 50/30/20 and identify the biggest gaps
• Pick ONE category to improve first — trying to fix everything at once leads to burnout

[SUGGESTIONS]
Show me my spending categories
How do I cut my biggest expense?`,
  },
  {
    trigger: /emergency fund|rainy day/i,
    response: `**Building Your Emergency Fund**

An emergency fund is the foundation of financial resilience — it protects everything else you're building.

**How Much Do You Need?**
• **Starter goal:** $1,000 — covers most minor emergencies and stops you from reaching for a credit card
• **Full goal:** 3–6 months of essential expenses
• **High-risk situations** (freelancer, single income, variable pay): aim for 6–12 months

**The Math**
If your monthly essentials (rent, food, utilities, minimum payments) total $3,000:
• 3-month fund = $9,000
• 6-month fund = $18,000

**Where to Keep It**
Keep it in a high-yield savings account (HYSA) — separate from your checking so it's not tempting to spend, but accessible within 1–2 days. SoFi Savings currently offers a competitive APY.

**Building It Faster**
• Automate a transfer the day after payday — even $50/week adds up to $2,600/year
• Direct any windfalls (tax refunds, bonuses) straight to this account

[SUGGESTIONS]
How much should I save monthly?
Where's the best place to keep it?`,
  },
  {
    trigger: /invest|stock|etf|401k|roth|ira|market/i,
    response: `**Investing Fundamentals**

Investing is how your money works for you over time — here's a grounded overview.

**Start with Tax-Advantaged Accounts**
• **401(k):** Contribute at least enough to get your full employer match — that's an instant 50–100% return on those dollars
• **Roth IRA:** Contributions grow tax-free; ideal if you expect to be in a higher tax bracket in retirement (2026 limit: $7,000)
• **Traditional IRA:** Tax deduction now, taxes at withdrawal; better if you're in a high bracket today

**Core Investing Principles**
• **Diversify:** Index funds (like S&P 500 ETFs) give you exposure to hundreds of companies in one fund
• **Time in market > timing the market:** Consistent contributions beat trying to buy at the perfect moment
• **Expense ratios matter:** A 1% fee vs 0.05% fee on $100k over 30 years = ~$200,000 difference
• **Compound interest:** $500/month at 7% annualized = ~$1.2M after 40 years

**Disclaimer:** This is general education — past performance doesn't guarantee future results. For personalized advice, consider consulting a fee-only financial advisor (CFP).

[SUGGESTIONS]
How much should I invest each month?
What's the difference between ETFs and index funds?`,
  },
  {
    trigger: /debt|credit card|loan|payoff|pay off/i,
    response: `**Debt Payoff Strategy**

Getting out of debt is one of the highest-return things you can do financially. Here are the two main approaches:

**Avalanche Method (mathematically optimal)**
Pay minimums on all debts, then throw every extra dollar at the highest-interest debt first.
• Saves the most money in interest
• Takes discipline — early wins can feel slow
• Best if you're motivated by numbers and efficiency

**Snowball Method (psychologically powerful)**
Pay minimums on all debts, then attack the smallest balance first regardless of rate.
• Faster early wins keep you motivated
• You might pay slightly more in total interest
• Best if you need momentum and visible progress

**Quick Example**
Say you have $300/month extra after minimums:
• **Credit card at 24% APR, $3,000 balance** → avalanche target #1
• **Car loan at 6%, $8,000 balance** → avalanche target #2

Putting that $300 at the credit card first saves you roughly $400–600 in interest vs. the snowball order.

**Power Move:** Look into balance transfers (0% intro APR for 12–18 months) to pause interest while you pay down principal.

[SUGGESTIONS]
Which method is right for me?
Should I do a balance transfer?`,
  },
  {
    trigger: /credit score|fico|credit report/i,
    response: `**Improving Your Credit Score**

Your credit score affects your interest rates, rental applications, and even some job opportunities. Here's how it's calculated and how to move the needle:

**FICO Score Breakdown**
• **35% — Payment History:** Single biggest factor. Even one missed payment can drop your score 50–100 points
• **30% — Credit Utilization:** Keep balances below 30% of each card's limit (10% is ideal)
• **15% — Credit Age:** Older average age = better. Don't close old cards
• **10% — Credit Mix:** Having both revolving (cards) and installment (loans) credit helps
• **10% — New Credit:** Each hard inquiry typically drops score 5–10 points temporarily

**Highest-Impact Actions**
• Pay every bill on time — set up autopay for at least the minimum
• Pay down card balances to below 30% utilization
• Don't close old accounts (even if unused)
• Dispute any errors on your credit report (free at annualcreditreport.com)

**Timeline Expectations**
• Utilization improvements: visible in 30–60 days
• Payment history rebuilding: 6–12 months to see meaningful change
• Score recovery after a missed payment: 12–24 months

[SUGGESTIONS]
How do I check my credit report for free?
What's a good credit score to aim for?`,
  },
  {
    trigger: /save|saving|goal|down payment|vacation|home|house|car|wedding/i,
    response: `**Building a Savings Plan**

Setting a specific goal makes saving dramatically more effective — vague saving rarely works.

**The SMART Goal Framework**
• **Specific:** "Save $15,000 for a home down payment" vs. "save more money"
• **Measurable:** Track progress monthly
• **Achievable:** Based on your actual income and expenses
• **Relevant:** Tied to something you genuinely want
• **Time-bound:** A target date creates urgency

**Building the Math**
• Define your target amount
• Set your target date
• Divide: monthly savings needed = target ÷ months remaining
• Example: $12,000 in 18 months = $667/month

**Making It Automatic**
The most effective strategy is automating transfers the day after payday — before you have a chance to spend it. "Pay yourself first" removes willpower from the equation entirely.

**Where to Save**
• High-yield savings account for goals under 3 years
• Consider I-bonds or short-term CDs for goals 2–5 years out
• Investment accounts for goals 5+ years away (time to recover from market dips)

[SUGGESTIONS]
How much do I need to save monthly?
Should I invest instead of saving?`,
  },
];

const DEFAULT_RESPONSE = `**Welcome to SoFi Coach**

I'm here to help you with your financial goals — whether that's budgeting, saving, paying off debt, or building wealth.

Here are some things I can help you with today:

• **Spending & Budgeting** — Understand where your money goes and build a plan that works
• **Emergency Fund** — Calculate how much you need and how to build it
• **Debt Payoff** — Compare strategies (avalanche vs. snowball) and find the fastest path out
• **Investing Basics** — Understand 401(k), Roth IRA, index funds, and how to start
• **Savings Goals** — Plan for a home, car, vacation, or any major purchase
• **Credit Score** — Learn what moves the needle and how to improve over time

What's on your mind? Share a specific situation and I'll give you concrete numbers and a real action plan.

[SUGGESTIONS]
Help me make a budget
How do I build an emergency fund?
I want to pay off debt`;

function pickResponse(messages: Array<{ role: string; content: string }>): string {
  const lastUserMsg = [...messages].reverse().find((m) => m.role === "user");
  const text = lastUserMsg?.content ?? "";

  for (const { trigger, response } of RESPONSES) {
    if (trigger.test(text)) return response;
  }
  return DEFAULT_RESPONSE;
}

// ---------------------------------------------------------------------------
// OpenAI-compatible response builders
// ---------------------------------------------------------------------------
function buildCompletionResponse(content: string, model: string) {
  return {
    id: `chatcmpl-mock-${Date.now()}`,
    object: "chat.completion",
    created: Math.floor(Date.now() / 1000),
    model,
    choices: [
      {
        index: 0,
        message: { role: "assistant", content },
        finish_reason: "stop",
      },
    ],
    usage: { prompt_tokens: 100, completion_tokens: 200, total_tokens: 300 },
  };
}

function buildStreamChunk(delta: string, model: string, id: string) {
  return `data: ${JSON.stringify({
    id,
    object: "chat.completion.chunk",
    created: Math.floor(Date.now() / 1000),
    model,
    choices: [{ index: 0, delta: { content: delta }, finish_reason: null }],
  })}\n\n`;
}

function buildStreamDone(model: string, id: string) {
  return `data: ${JSON.stringify({
    id,
    object: "chat.completion.chunk",
    created: Math.floor(Date.now() / 1000),
    model,
    choices: [{ index: 0, delta: {}, finish_reason: "stop" }],
  })}\n\ndata: [DONE]\n\n`;
}

// ---------------------------------------------------------------------------
// HTTP server
// ---------------------------------------------------------------------------
const server = http.createServer((req, res) => {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url ?? "/", `http://localhost:${PORT}`);

  if (url.pathname !== "/v1/chat/completions") {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Not found" }));
    return;
  }

  if (req.method !== "POST") {
    res.writeHead(405, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Method not allowed" }));
    return;
  }

  let body = "";
  req.on("data", (chunk) => (body += chunk));
  req.on("end", () => {
    let payload: { model?: string; messages?: Array<{ role: string; content: string }>; stream?: boolean };
    try {
      payload = JSON.parse(body);
    } catch {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Invalid JSON" }));
      return;
    }

    const model = payload.model ?? "gpt-4o-mini";
    const messages = payload.messages ?? [];
    const stream = payload.stream === true;
    const content = pickResponse(messages);
    const id = `chatcmpl-mock-${Date.now()}`;

    console.log(`[mock-openai] ${stream ? "stream" : "completion"} request — model=${model}, matched ${messages.length} messages`);

    if (stream) {
      res.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      });

      // Emit the response word-by-word with a small delay to simulate streaming
      const words = content.split(" ");
      let i = 0;

      function emitNext() {
        if (i >= words.length) {
          res.write(buildStreamDone(model, id));
          res.end();
          return;
        }
        const chunk = (i === 0 ? "" : " ") + words[i];
        res.write(buildStreamChunk(chunk, model, id));
        i++;
        // ~15ms per word → ~250 words in ~3.75s (realistic pace)
        setTimeout(emitNext, 15);
      }

      emitNext();
    } else {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(buildCompletionResponse(content, model)));
    }
  });
});

server.listen(PORT, () => {
  console.log(`[mock-openai] Listening on http://localhost:${PORT}`);
  console.log(`[mock-openai] Endpoint: http://localhost:${PORT}/v1/chat/completions`);
  console.log(`[mock-openai] API Key:  any value works (e.g. "mock-key")`);
});
