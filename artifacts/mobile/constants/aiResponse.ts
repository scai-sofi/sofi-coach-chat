import { Message, Memory, Goal, MemoryCategory, GoalType } from './types';

const uid = () => Date.now().toString() + Math.random().toString(36).substr(2, 9);

interface StoreState {
  memories: Memory[];
  goals: Goal[];
}

export function generateAIResponse(userInput: string, store: StoreState): Partial<Message> | null {
  const input = userInput.toLowerCase().trim();
  const prefersDetail = store.memories.some(m => m.content.toLowerCase().includes('detailed breakdown'));
  const hasGoals = store.goals.filter(g => g.status !== 'COMPLETED' && g.status !== 'PAUSED').length > 0;

  const deletePatterns = [
    'delete this memory', 'delete that memory', 'delete memory', 'remove this memory', 'remove that memory',
    'forget this', 'forget that', 'forget about',
    "don't remember", "dont remember", "stop remembering",
    "don't want you to remember", "dont want you to remember",
    "remove what you know about", "delete what you know",
    "i don't want you to know", "i dont want you to know",
    "erase this", "erase that",
  ];
  const isDeletionIntent = deletePatterns.some(p => input.includes(p));

  if (isDeletionIntent) {
    const activeMemories = store.memories.filter(m => m.status === 'ACTIVE');

    if (activeMemories.length === 0) {
      return {
        content: "I don't have any memories saved right now, so there's nothing to delete. If I learn something from our conversations in the future, you can always ask me to forget it.",
      };
    }

    const inputWords = input.replace(/[^a-z0-9\s]/g, '').split(/\s+/);
    const scored = activeMemories.map(m => {
      const memWords = m.content.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/);
      const overlap = inputWords.filter(w => w.length > 3 && memWords.some(mw => mw.includes(w))).length;
      return { memory: m, score: overlap };
    }).sort((a, b) => b.score - a.score);

    const bestMatch = scored[0];

    if (bestMatch.score > 0) {
      return {
        content: `I found a memory that seems to match what you're referring to:\n\n> "${bestMatch.memory.content}"\n\nWould you like me to delete this memory? Once removed, I won't reference it in future conversations.`,
        memoryDeletion: {
          memoryId: bestMatch.memory.id,
          memoryContent: bestMatch.memory.content,
        },
      };
    }

    const memoryList = activeMemories
      .map((m, i) => `${i + 1}. "${m.content}"`)
      .join('\n');

    return {
      content: `I have ${activeMemories.length} memories saved. Which one would you like me to delete?\n\n${memoryList}\n\nJust let me know which one, or you can say "delete all" to clear everything.`,
      suggestions: activeMemories.length <= 3
        ? [...activeMemories.map(m => `Delete "${m.content.slice(0, 30)}${m.content.length > 30 ? '...' : ''}"`), 'Delete all memories']
        : ['Delete all memories'],
    };
  }

  if (input.includes('delete all memories') || input.includes('clear all memories') || input.includes('forget everything')) {
    return {
      content: "**All Memories Cleared**\n\nDone — I've deleted all saved memories. I'm starting fresh with no prior context from our conversations.\n\nYou can always build new memories naturally as we chat, or adjust your memory settings in Preferences.",
      memoryDeletion: {
        memoryId: '__ALL__',
        memoryContent: 'All memories',
        confirmed: true,
      },
      chips: [{ type: 'memory-deleted', label: 'All memories deleted' }],
    };
  }

  if (input.includes('outdated') || input.includes('that dining thing')) {
    return {
      content: "**Memory Updated**\n\nI've adjusted that memory to reflect your shift toward cooking at home.\n\n**What Changed**\n• **Before:** \"Dining out is a focus area for spending reduction\"\n• **After:** Updated to reflect your active cooking-at-home habit\n\n**Why This Matters**\nThis shift is already showing results — your dining spend is down 21% over the last 3 months, which translates to roughly $1,500/year in savings. That's real money flowing toward your emergency fund and credit card payoff.\n\nSince you're making this a consistent habit, would you like me to also remember that cooking at home is a priority? That way I can factor it into future spending advice and recipe-vs-restaurant decisions.",
      chips: [{ type: 'memory-updated', label: 'Memory updated' }],
      memoryProposal: { id: uid(), content: 'Cooking at home is now a priority over dining out', category: 'PRIORITIES' },
    };
  }

  if (input.includes('help me pay off') || input.includes('pay off credit')) {
    return {
      content: "**Credit Card Payoff Plan**\n\nLet's get a plan together. Here's your current situation:\n\n**Your Card Details**\n• **Balance:** $4,200\n• **Interest rate:** 22.99% APR\n• **Minimum payment:** $84/month\n• **Daily interest accruing:** ~$2.64\n\n**The Cost of Minimum Payments**\nAt $84/month, you'd be paying for 7+ years and spend over $3,100 in interest — nearly doubling what you owe. Every month you accelerate saves you real money.\n\n**Option A — Aggressive (6 months)**\n• **Monthly payment:** $720\n• **Paid off by:** July\n• **Total interest paid:** ~$400\n• **Interest saved vs. minimum:** ~$2,800\n• **Impact on budget:** Leaves $800/month from your surplus\n\n**Option B — Balanced (12 months)**\n• **Monthly payment:** $380\n• **Paid off by:** January\n• **Total interest paid:** ~$700\n• **Interest saved vs. minimum:** ~$2,400\n• **Impact on budget:** Leaves $1,140/month from your surplus\n\n**My Take**\nOption A saves you $400 more in interest, but Option B gives you significantly more breathing room each month. Given your wedding savings coming up, the balanced approach might be the smarter play.\n\nWhich feels more doable for your monthly budget?",
      memoryProposal: { id: uid(), content: 'Paying off credit card debt is a financial priority', category: 'PRIORITIES' as MemoryCategory },
      goalProposal: {
        id: uid(), type: 'DEBT_PAYOFF' as GoalType, title: 'Credit Card Payoff',
        targetAmount: 4200, targetDate: new Date(Date.now() + 365 * 86400000),
        monthlyContribution: 380, linkedAccount: 'SoFi Credit Card',
      },
      suggestions: ['Set up Option A', 'Set up Option B', 'Help me prioritize my debts'],
    };
  }

  if (input.includes('help me prioritize')) {
    return {
      content: "**Your Priority Roadmap**\n\nHere's how I'd rank your financial priorities based on impact and urgency:\n\n**1. Credit Card Payoff — Top Priority**\n• **Balance:** $4,200 at 22.99% APR\n• **Why first:** Every dollar here earns you a guaranteed 23% return by eliminating interest. At minimum payments, you'd lose $3,100+ to interest alone.\n• **Timeline:** 6–12 months depending on your plan\n\n**2. Emergency Fund — Continue Building**\n• **Progress:** $8,400 of $12,000 (70%)\n• **Why second:** You already have a solid 2.1 months of coverage. Getting to 3 months ($12K) gives you real financial security.\n• **Timeline:** ~8 months at $450/month\n\n**3. Wedding Savings — Start After Emergency Fund Hits 90%**\n• **Target date:** October 2027\n• **Why wait:** You have 18+ months of runway. Once your emergency fund is near-complete, redirecting that $450/month gets you ahead fast.\n\n**The Math Behind This Order**\nEliminating 22.99% interest before stacking savings is almost always the optimal move — it's the equivalent of a guaranteed investment return that beats any savings account APY.\n\nWant me to set up a phased plan based on this order?",
      suggestions: ['Sounds good, set it up', 'What about investing?', 'Show me the numbers'],
    };
  }

  if (input.includes('sounds good') || input.includes("let's go") || input.includes('let\'s go')) {
    return {
      content: "**Let's Get Started**\n\nHere are four areas we can focus on — pick the one that feels most important right now. We can always layer in more goals later.\n\n• **Building an emergency fund** — create a financial safety net for unexpected expenses\n• **Paying off debt** — eliminate high-interest debt and free up monthly cash flow\n• **Saving for a big purchase** — reverse-engineer a savings plan with a clear timeline\n• **Spending smarter** — find opportunities to optimize where your money goes\n\nEach one builds on the others, so there's no wrong starting point. What feels most urgent?",
      suggestions: ['Build an emergency fund', 'Pay off debt faster', 'Save for a big purchase'],
    };
  }

  if (input.includes('building an emergency fund')) {
    return {
      content: "Smart first move — an emergency fund is the foundation everything else builds on.\n\n**Recommended Target**\nFor your situation — household of two in the Bay Area — I'd recommend 3 to 6 months of essential expenses. Based on your monthly spending:\n\n• **Essential expenses:** ~$4,000/month (housing, groceries, transport, utilities)\n• **3-month target:** $12,000 (minimum safety net)\n• **6-month target:** $24,000 (full protection)\n\n**Your Plan**\nLet's start with $12,000. Here's what that looks like:\n\n• **Monthly contribution:** $450 via auto-transfer\n• **Timeline:** ~8 months to full target\n• **Account:** SoFi Savings (currently earning 4.00% APY)\n• **Interest earned:** ~$180 over the savings period\n\n**Why This Amount?**\nThe Bay Area has higher-than-average costs, so a 3-month cushion gives you real runway if anything unexpected happens — job change, medical expense, or car repair.\n\nWant me to create this goal and set up the automatic transfers?",
      memoryProposal: { id: uid(), content: 'Building an emergency fund is a top priority', category: 'PRIORITIES' as MemoryCategory },
      goalProposal: {
        id: uid(), type: 'EMERGENCY_FUND' as GoalType, title: 'Emergency Fund',
        targetAmount: 12000, targetDate: new Date(Date.now() + 240 * 86400000),
        monthlyContribution: 450, linkedAccount: 'SoFi Savings',
      },
    };
  }

  if (input.includes('paying off debt')) {
    return {
      content: "**Debt Payoff Planning**\n\nGreat call — getting rid of debt frees up both mental and financial space. Let me help you build a strategy.\n\n**Two Proven Approaches**\n\n• **Avalanche method:** Pay off highest interest rate first. Saves the most money mathematically — best if you're motivated by efficiency.\n\n• **Snowball method:** Pay off smallest balance first. Creates quick wins and momentum — best if you're motivated by progress.\n\n**What I Can Do**\nTell me about what you're working with, or I can pull the details from your SoFi accounts. I'll calculate the optimal payoff order, timeline, and monthly amounts for both methods so you can compare.\n\n**Quick Stat**\nThe average American carries $6,365 in credit card debt. Getting ahead of this now — especially before your wedding in October 2027 — puts you in a much stronger position.\n\nWhat debts are you looking to tackle?",
      memoryProposal: { id: uid(), content: 'Paying off debt is a financial priority', category: 'PRIORITIES' as MemoryCategory },
      goalProposal: {
        id: uid(), type: 'DEBT_PAYOFF' as GoalType, title: 'Debt Payoff Plan',
        targetAmount: 4200, targetDate: new Date(Date.now() + 365 * 86400000),
        monthlyContribution: 350, linkedAccount: 'SoFi Credit Card',
      },
    };
  }

  if (input.includes('saving for') || input.includes('big purchase')) {
    return {
      content: "**Savings Goal Planning**\n\nLove it — having a specific target makes all the difference. Here's how I can help:\n\n**How It Works**\nTell me what you're saving for and when you need it, and I'll reverse-engineer a monthly plan:\n\n• **Calculate the monthly amount** needed to hit your target on time\n• **Set up auto-transfers** so savings happen automatically\n• **Track milestones** (25%, 50%, 75%, 100%) with progress updates\n• **Adjust the plan** if your timeline or income changes\n\n**Your Wedding in October 2027**\nSince you've mentioned saving for a wedding, I've already put together a starting plan. A typical Bay Area wedding runs $30,000–$50,000. Here's what a $40,000 target looks like:\n\n• **Monthly contribution:** $1,700\n• **Timeline:** ~24 months\n• **Account:** SoFi Savings (4.00% APY)\n• **Interest earned:** ~$800 over the savings period\n\nYou can adjust the target and timeline to fit your vision. Want to set this up, or are you saving for something else?",
      memoryProposal: { id: uid(), content: 'Saving for wedding in October 2027 is an active priority', category: 'PRIORITIES' as MemoryCategory },
      goalProposal: {
        id: uid(), type: 'SAVINGS_TARGET' as GoalType, title: 'Wedding Fund',
        targetAmount: 40000, targetDate: new Date(Date.now() + 730 * 86400000),
        monthlyContribution: 1700, linkedAccount: 'SoFi Savings',
      },
      suggestions: ['Set up wedding fund', 'Adjust the target', 'I\'m saving for something else'],
    };
  }

  if (input.includes('spend smarter') || input.includes('spending smarter')) {
    return {
      content: "**Smarter Spending Starts Here**\n\nI can definitely help with that. First, let me understand how you like to receive insights — this helps me tailor my approach.\n\n**Option A — Quick Weekly Pulse**\nA brief summary with your total spend, top categories, and one actionable tip. Takes 30 seconds to read.\n\n**Option B — Detailed Breakdown**\nFull category-by-category analysis with percentages, trends vs. prior weeks, and specific opportunities. The deep dive.\n\n**What I'll Track Either Way**\n• Category-level spending with week-over-week trends\n• Anomalies and unusual charges\n• Progress toward your spending targets\n• Subscription usage and optimization opportunities\n\nWhich format do you prefer?",
      suggestions: ['Quick summary is fine', 'Detailed breakdown please'],
    };
  }

  if (input.includes('quick summary')) {
    return {
      content: "**Weekly Pulse — This Week**\n\nGot it — I'll keep things concise and actionable. Here's your quick take:\n\n• **Total spent:** $892 (↓5% vs. your weekly average of $938)\n• **Top category:** Shopping at $580 (one-time monitor purchase)\n• **Baseline spend:** $312 (excluding the monitor) — well below your typical $380\n\n**One Quick Win**\nYour dining came in at $95 this week — your best in a month. The cooking-at-home habit is saving you roughly $30/week compared to your average.\n\nI'll send you a quick pulse like this every week. You can always ask me to go deeper on anything.",
      autoSaveMemory: { content: 'Prefers quick financial summaries over detailed breakdowns', category: 'PREFERENCES' },
    };
  }

  if (input.includes('detailed breakdown')) {
    return {
      content: "**Detailed Weekly Breakdown**\n\nMy kind of person — let's dig into the numbers.\n\n**This Week's Spending: $892** (↓5% vs. weekly average)\n\n• **Groceries:** $165 (18.5%) — on budget, consistent with last 4 weeks\n• **Dining:** $95 (10.7%) — down 18% from last week, your best week this month\n• **Transport:** $52 (5.8%) — stable, right at your $50–55 weekly norm\n• **Shopping:** $580 (65%) — one-time monitor purchase\n\n**Adjusted Baseline (Excluding One-Time Purchases)**\n• **Baseline spend:** $312 — well below your typical $380\n• **Savings vs. average:** $68 this week ($3,536 annualized at this pace)\n\n**Trend Analysis**\n• **Dining:** ↓21% over 3 months (from $610 → $485/month avg)\n• **Groceries:** ↑9% as you shift from restaurants — net savings still positive\n• **Overall trajectory:** Improving week over week\n\nI'll send you this detailed breakdown every week. Want me to flag anything specific to watch?",
      autoSaveMemory: { content: 'Prefers detailed financial breakdowns with numbers and trends', category: 'PREFERENCES' },
    };
  }

  if (input.includes('set up option a')) {
    return {
      content: "**Aggressive Payoff Plan — Activated**\n\nYour plan is set up and ready to go:\n\n**Plan Details**\n• **Monthly payment:** $720\n• **Duration:** 6 months\n• **Source:** SoFi Checking → SoFi Credit Card\n• **First payment:** This Friday\n• **Projected completion:** July\n\n**What This Means for Your Budget**\n• **Monthly surplus after payment:** $800 (from your $1,520 surplus)\n• **Total interest you'll pay:** ~$400\n• **Interest saved vs. minimum payments:** ~$2,800\n\n**What Happens Next**\nI've created your goal in the Goals dashboard with milestone tracking at 25%, 50%, 75%, and 100%. I'll send you weekly progress updates — and I'll let you know immediately if anything needs attention.\n\nYou're on track to be completely debt-free in 6 months.",
      autoCreateGoal: {
        type: 'DEBT_PAYOFF', title: 'Credit Card Payoff',
        targetAmount: 4200, targetDate: new Date(Date.now() + 180 * 86400000),
        monthlyContribution: 720, linkedAccount: 'SoFi Credit Card',
      },
      chips: [{ type: 'goal-progress', label: 'Goal created' }],
    };
  }

  if (input.includes('set up option b')) {
    return {
      content: "**Balanced Payoff Plan — Activated**\n\nYour plan is set up and ready to go:\n\n**Plan Details**\n• **Monthly payment:** $380\n• **Duration:** 12 months\n• **Source:** SoFi Checking → SoFi Credit Card\n• **First payment:** This Friday\n• **Projected completion:** January\n\n**What This Means for Your Budget**\n• **Monthly surplus after payment:** $1,140 (from your $1,520 surplus)\n• **Total interest you'll pay:** ~$700\n• **Interest saved vs. minimum payments:** ~$2,400\n\n**Why This Works**\nThe balanced approach gives you $340/month more breathing room than the aggressive plan — useful for unexpected expenses or building your emergency fund simultaneously. You're still saving $2,400+ in interest.\n\nI'll send weekly check-ins so you always know where you stand. Your goal is live in the Goals dashboard.",
      autoCreateGoal: {
        type: 'DEBT_PAYOFF', title: 'Credit Card Payoff',
        targetAmount: 4200, targetDate: new Date(Date.now() + 365 * 86400000),
        monthlyContribution: 380, linkedAccount: 'SoFi Credit Card',
      },
      chips: [{ type: 'goal-progress', label: 'Goal created' }],
    };
  }

  if (input.includes('increase this month')) {
    return {
      content: "**Credit Card Payoff — Plan Updated**\n\nHere's your updated plan:\n\n**Changes Made**\n• **This month's payment:** $520 (↑$140 from $380)\n• **Confidence score:** Back up to 78% (was 58%)\n• **Status:** On track again\n\n**Impact of This Adjustment**\n• **Remaining balance after payment:** ~$740\n• **Back on schedule** for your original target date\n• **Extra interest saved** by catching up now: ~$18\n\n**What's Next**\nI'll send you a reminder 3 days before the payment goes through. Next month you can return to your regular $380 payment and stay on track.\n\nGreat call — a small temporary bump makes a real difference in the long run.",
      autoUpdateGoal: {
        goalTitle: 'Credit Card Payoff',
        monthlyContribution: 520,
        confidenceScore: 0.78,
        status: 'ON_TRACK',
      },
      chips: [{ type: 'goal-progress', label: 'Goal updated' }],
    };
  }

  if (input.includes('extend deadline') || input.includes('extend my deadline')) {
    return {
      content: "**Credit Card Payoff — Timeline Extended**\n\nHere's your updated plan:\n\n**Changes Made**\n• **New deadline:** Extended by 2 months\n• **Monthly payment:** Reduced to $350 (↓$30 from $380)\n• **Confidence score:** 72%\n\n**What This Means**\n• **Monthly savings:** $30 more breathing room each month\n• **Extra interest cost:** ~$45 over the extended period\n• **New payoff date:** Approximately 5.5 months from now\n\n**Why This Can Be the Right Move**\nSometimes a sustainable pace beats an aggressive one. A slightly lower payment reduces the risk of missing a month entirely — which would cost you more in the long run.\n\nI'll keep tracking and let you know if anything changes. You can always bump the payment back up in any month where you have extra cash.",
      autoUpdateGoal: {
        goalTitle: 'Credit Card Payoff',
        monthlyContribution: 350,
        targetDate: new Date(Date.now() + 180 * 86400000),
        confidenceScore: 0.72,
      },
      chips: [{ type: 'goal-progress', label: 'Goal updated' }],
    };
  }

  if (input.includes('confirm transfer') || input.includes('set up all three')) {
    return {
      content: "**Transfers Complete — Here's Your Summary**\n\n**1. Credit Card — $1,260**\n• **Result:** Balance cleared to $0. Your 22.99% APR is officially history.\n• **Monthly cash freed up:** $380 that was going to debt payments\n• **Total interest saved** over the life of the payoff: ~$2,400\n\n**2. Emergency Fund — $1,200**\n• **Result:** Balance now $9,600 (80% of $12,000 goal)\n• **Milestone:** 6 weeks ahead of schedule\n• **Remaining:** Just $2,400 to go — about 5 months at your current pace\n\n**3. SoFi Invest — $540**\n• **Result:** Allocated to Conservative portfolio (70% bonds, 30% index funds)\n• **Projected growth:** At 5% avg return, this grows to ~$690 in 5 years\n\n**The Big Picture**\nIn one move, you eliminated your most expensive debt, fast-tracked your safety net, and started building long-term wealth. Plus, that freed-up $380/month from debt payments is now available for your next priority.\n\nCongratulations — that's a genuinely great financial day.",
      autoUpdateGoal: {
        goalTitle: 'Credit Card Payoff',
        currentAmount: 4200,
        status: 'COMPLETED',
        confidenceScore: 1.0,
      },
      chips: [
        { type: 'milestone', label: 'Credit Card paid off!' },
        { type: 'goal-progress', label: 'Emergency Fund 80%' },
      ],
    };
  }

  if (input.includes('connect me') || input.includes('planner')) {
    return {
      content: "**Financial Planner Session — Setup**\n\nI'll connect you with a SoFi Certified Financial Planner — it's completely free for SoFi members.\n\n**What to Expect**\n• **Duration:** 30-minute video or phone session\n• **Cost:** $0 (included with your SoFi membership)\n• **Scheduling:** Usually available within 2–3 business days\n\n**What They'll Cover**\n• A full review of your investment picture and asset allocation\n• Personalized rebalancing strategy based on your risk profile\n• Tax-optimization recommendations (tax-loss harvesting, account types)\n• Long-term planning aligned with your goals (wedding, retirement)\n\n**What I'll Share (With Your Permission)**\nI can send the planner your relevant financial context — goals, savings progress, risk preference, and spending patterns — so they can jump right in without starting from scratch.\n\nWant me to go ahead and schedule this?",
      chips: [{ type: 'handoff', label: 'Connecting to specialist' }],
    };
  }

  if (input.includes('what can you help') || input.includes('what do you do')) {
    return {
      content: "**What I Can Help With**\n\nI'm your AI financial coach — here to help you understand, manage, and grow your money. Here's what I cover:\n\n**Spending Insights**\nTrack where your money goes, spot trends week-over-week, identify unused subscriptions, and find concrete opportunities to save. I'll do the math so you don't have to.\n\n**Goals & Tracking**\nSet financial goals with specific timelines, monitor progress with milestone tracking (25/50/75/100%), and get proactive alerts when something needs attention. Auto-transfers keep you on track.\n\n**SoFi Products**\nHelp you get the most out of checking, savings (4.00% APY), investing, credit, and loans. I can coordinate across accounts for optimal allocation.\n\n**Financial Planning**\nBudgeting strategies, debt payoff plans (avalanche vs. snowball), investment education, and connecting you with human SoFi Certified Financial Planners for complex topics — free for members.\n\nWhat sounds most useful right now?",
      suggestions: ['Show my spending', 'Help me set a goal', 'What products do I have?'],
    };
  }

  if (input.includes('dining trend')) {
    if (prefersDetail) {
      return {
        content: "**Your Dining Trend — Full Analysis**\n\n**Monthly Trend**\n• **This month:** $485 (↓12% from last month)\n• **3-month average:** $530/month\n• **6-month average:** $610/month\n• **Direction:** Consistently decreasing for 4 months straight\n\n**This Month's Weekly Breakdown**\n• **Week 1:** $145 — birthday dinner out (one-time event)\n• **Week 2:** $95 — your lowest week in 3 months\n• **Week 3:** $120 — slightly up, but still well below average\n• **Week 4:** $125 (so far) — tracking to finish strong\n\n**Where Your Dining Money Goes**\n• **DoorDash:** $180 (37%) — this is your biggest single source. Reducing delivery orders by even 2/month saves ~$60\n• **Local restaurants:** $165 (34%) — sit-down meals and takeout\n• **Coffee shops:** $140 (29%) — averaging $4.70/visit, ~30 visits this month\n\n**Impact on Your Goals**\nAt this rate, you'll save roughly $1,500/year compared to your peak spending. That's equivalent to 3.3 months of emergency fund contributions — directly accelerating your financial goals.\n\nThe shift to cooking at home is clearly showing in the numbers. Want to set a specific dining budget target?",
        provenance: 'Analysis based on SoFi Checking and Credit Card transactions. Categories are auto-classified and some may need manual adjustment.',
      };
    }
    return {
      content: "**Your Dining Trend**\n\nYour dining spending is trending down consistently:\n\n• **This month:** $485 (↓12% from last month)\n• **3-month average:** $530/month (↓21% from 6-month avg of $610)\n• **Direction:** 4 months of consecutive decreases\n\n**What This Means**\nThe shift to cooking at home is paying off. At this pace, you're on track to save about **$1,500/year** compared to your peak dining spend — that's equivalent to 3+ months of emergency fund contributions.\n\n**Biggest Opportunity**\nDelivery apps (DoorDash) still make up 37% of your dining spend. Even cutting 2 delivery orders per month saves an additional $60/month ($720/year).\n\nWant me to break it down by vendor or set a dining budget target?",
      provenance: 'Based on your SoFi Checking and Credit Card transaction data.',
      suggestions: ['Show me the detailed breakdown', 'How does this help my goals?'],
    };
  }

  if (input.includes('show goal') || input.includes('goals progress')) {
    const goalSummaries = store.goals
      .filter(g => g.status !== 'PAUSED' && g.status !== 'COMPLETED')
      .map(g => {
        const pct = Math.round((g.currentAmount / g.targetAmount) * 100);
        const remaining = g.targetAmount - g.currentAmount;
        const monthsLeft = g.monthlyContributionTarget ? Math.ceil(remaining / g.monthlyContributionTarget) : 0;
        const statusLabel = g.status === 'AT_RISK' ? 'needs attention' : 'on track';
        const confidencePct = g.confidenceScore ? Math.round(g.confidenceScore * 100) : 0;
        return `• **${g.title}:** $${g.currentAmount.toLocaleString()} of $${g.targetAmount.toLocaleString()} (${pct}%) — ${statusLabel}\n  Remaining: $${remaining.toLocaleString()} · ~${monthsLeft} months to go · ${confidencePct}% confidence`;
      }).join('\n\n');

    return {
      content: goalSummaries
        ? `**Your Goals at a Glance**\n\n${goalSummaries}\n\n**Quick Tip**\nYou can see the full dashboard with progress rings and milestones in the Goals panel — tap \"Goals\" in the menu for the visual view.`
        : "**No Active Goals Yet**\n\nYou don't have any goals set up, but that's easy to change. Goals help you stay focused and I'll track your progress automatically with milestone celebrations along the way.\n\n**Popular Starting Points**\n• **Emergency fund** — build a 3–6 month safety net\n• **Debt payoff** — eliminate high-interest balances\n• **Savings target** — save for a specific purchase or event\n\nWant me to help you set one up?",
      suggestions: hasGoals ? ['Open goals dashboard', 'Help me adjust a goal'] : ['Help me set a goal', 'What goals should I consider?'],
    };
  }

  if (input.includes('snapshot') || input.includes('overview') || input.includes('financial snapshot')) {
    return {
      content: "**Your Financial Snapshot**\n\n**Accounts**\n• **Checking:** $3,847.52 — steady, covers 3 weeks of essentials\n• **Savings:** $8,400.00 — earning 4.00% APY ($28/month in interest)\n• **Invest:** $2,150.00 — Conservative portfolio, up 3.2% YTD\n• **Credit Card:** −$1,260 remaining balance (was $4,200)\n\n**Net Worth**\n• **Current:** $13,137.52\n• **Last month:** $12,297.52\n• **Change:** +$840 (+6.8%)\n• **3-month trend:** Consistently rising\n\n**Goals Progress**\n• **Emergency Fund:** $8,400 of $12,000 (70%) — on track, ahead of schedule by 2 weeks\n• **Credit Card Payoff:** $2,940 of $4,200 (70%) — needs attention, payments below target\n\n**Monthly Cash Flow**\n• **Income:** $6,200\n• **Expenses:** $4,680\n• **Surplus:** $1,520 (24.5% savings rate)\n\n**Key Insight**\nYour 24.5% savings rate is above the national average of 4.7% — that's excellent. Your $1,520 monthly surplus is your biggest lever for accelerating your goals. Directing even half of it strategically could close out your credit card in 2 months.\n\nWhat would you like to dig into?",
      suggestions: ['Tell me about my spending', 'How can I grow my net worth?', 'Show my goals'],
    };
  }

  if (input.includes('what do you know') || input.includes('know about me')) {
    const grouped: Record<string, string[]> = {};
    store.memories
      .filter(m => m.status === 'ACTIVE')
      .forEach(m => {
        const labels: Record<string, string> = {
          ABOUT_ME: 'About me', PREFERENCES: 'Preferences',
          PRIORITIES: 'Priorities',
        };
        const cat = labels[m.category] || m.category;
        if (!grouped[cat]) grouped[cat] = [];
        grouped[cat].push(`• ${m.content}`);
      });

    const memoryList = Object.entries(grouped)
      .map(([cat, items]) => `**${cat}**\n${items.join('\n')}`)
      .join('\n\n');

    const memoryCount = store.memories.filter(m => m.status === 'ACTIVE').length;

    return {
      content: memoryList
        ? `**What I Know About You**\n\nI currently have ${memoryCount} active memories across ${Object.keys(grouped).length} categories:\n\n${memoryList}\n\n**How I Use This**\nThese memories help me personalize my advice — from the level of detail I give you, to which goals I prioritize in recommendations, to how I frame financial decisions.\n\n**Your Control**\nYou can edit, pause, or remove any of these anytime — tap the brain icon in the menu to open the Memory Center. Everything stays transparent.`
        : "**No Memories Yet**\n\nI don't have any saved context about you yet, but that changes fast as we chat. Here's how it works:\n\n• **Automatic:** I'll pick up on preferences and context as we talk, always asking before saving\n• **Manual:** Tell me things directly — like \"remember that I'm saving for a house\" — and I'll store it immediately\n• **Categories:** I organize into three groups — About me, Preferences, and Priorities\n\nThe more context I have, the more tailored and useful my advice becomes. Want to tell me something about yourself to get started?",
    };
  }

  if (input.includes('how does my memory work') || input.includes('how does memory work')) {
    return {
      content: "**How Memory Works**\n\nGreat question! Here's the full picture:\n\n**How I Learn**\nI pick up on your preferences, habits, and context as we chat. I'll always ask before saving something new — nothing gets stored without your awareness.\n\n**What I Track**\nI organize memories into three categories:\n• **About me** — your life situation, accounts, financial details, household info\n• **Preferences** — how you like to receive information, risk tolerance, financial approach\n• **Priorities** — what you're working toward, goals, focus areas, key events\n\n**You're Always in Control**\n• **View & edit:** Open the Memory Center (brain icon in the menu) to see, edit, pause, or delete any memory\n• **Pause memories:** Pause individual memories so they're not used in chat, and resume them anytime\n• **Tell me directly:** Say \"remember that...\" to save something specific, or \"forget about...\" to remove it\n\n**Why It Matters**\nThe more context I have, the more personalized and relevant my advice becomes. But your privacy always comes first — you decide what I know.",
      suggestions: ['Show me my memories', 'What do you know about me?'],
    };
  }

  if (input.includes('cancel') && input.includes('subscription')) {
    return {
      content: "**Subscription Review**\n\nI can help you think through this. Here's what I found:\n\n**Service Details**\n• **Service:** StreamMax Premium\n• **Monthly cost:** $14.99\n• **Annual cost:** $179.88\n• **Last used:** 6 weeks ago\n• **Usage trend:** Declining — used 3 times in the last 3 months\n\n**Financial Impact**\n• **Annual savings if cancelled:** $179.88\n• **What that could fund:** Almost half a month of emergency fund contributions, or ~2.5% of your remaining credit card balance\n\n**Your Options**\n• **Cancel now** — save the full $180/year starting immediately. The actual cancellation needs to happen on StreamMax's end (I can walk you through it)\n• **Downgrade** — some services offer cheaper tiers. Worth checking if you still want occasional access\n• **Flag for review** — I'll remind you in 30 days so you can decide with more usage data\n\n**My Take**\n6 weeks of no usage is a strong signal. That $15/month is small individually, but subscription creep adds up — it's often the #1 source of \"invisible\" spending.\n\nWhat would you like to do?",
      memoryProposal: { id: uid(), content: 'Reviewing unused subscriptions for potential cancellation', category: 'PRIORITIES' },
    };
  }

  if (input.includes('how can i save') || input.includes('save more')) {
    return {
      content: "**Your Savings Opportunities**\n\nBased on your spending patterns over the last 3 months, here's where the biggest wins are:\n\n**Quick Wins (No Lifestyle Change)**\n• **Unused subscriptions:** $45/month ($540/year) — 2 services with low or no usage in the last 6 weeks\n• **Auto-transfer surplus:** $1,520/month available after expenses — moving this on payday means it's saved before you can spend it\n\n**Moderate Adjustments**\n• **Dining out:** Save ~$150/month ($1,800/year) — you're already trending down 12% month-over-month. Keeping the cooking momentum could free up $150+ monthly\n• **Grocery optimization:** Save ~$40/month ($480/year) — your grocery spend went up as dining went down, but there's room to optimize with meal planning\n\n**Total Potential Savings**\n• **Monthly:** Up to $1,755 (on top of your existing surplus)\n• **Annual impact:** ~$2,820 in identified optimizations\n\n**My Recommendation**\nStart with automation — it's the highest-impact, lowest-effort move. Setting up a payday auto-transfer captures your surplus without willpower. Then tackle subscriptions for easy wins.\n\nWant me to set up automatic transfers on your next payday?",
      suggestions: ['Set up auto-transfers', 'Show me my subscriptions', 'What about my groceries?'],
    };
  }

  if (input.includes('remember') && (input.includes('that') || input.includes('i '))) {
    const factContent = userInput.replace(/remember\s*(that\s*)?/i, '').trim();
    if (factContent.length > 5) {
      return {
        content: `Got it — I've noted: "${factContent}"\n\n**How I'll Use This**\nI'll factor this into future advice, suggestions, and insights. For example, if this relates to a spending preference, I'll reference it when analyzing your budget. If it's a life event, I'll consider it when recommending timelines and priorities.\n\n**Your Control**\nYou can view, edit, or remove this anytime in the Memory Center (brain icon in the menu). Just say "forget about..." if you want me to remove something specific.`,
        autoSaveMemory: { content: factContent, category: 'ABOUT_ME' },
      };
    }
  }

  if (input.includes('what about investing') || input.includes('should i invest')) {
    return {
      content: "**Should You Start Investing?**\n\nInvesting is a powerful long-term wealth builder, but timing and readiness matter. Here's where you stand:\n\n**Your Investment Readiness Checklist**\n• **High-interest debt:** $1,260 remaining at 22.99% APR — almost done\n• **Emergency fund:** $8,400 of $12,000 (70%) — solid progress\n• **Monthly surplus:** $1,520 available — plenty of room to invest\n• **Risk profile:** Conservative (your preference)\n\n**My Assessment**\nYou're close to the ideal starting point. Once your credit card is paid off (1–3 months away), every dollar that was going to 22.99% interest can work for you in the market instead.\n\n**Your Options on SoFi Invest**\n• **Conservative portfolio:** ~70% bonds, 30% index funds — lower volatility, steady growth (~4–6% historical average)\n• **Moderate portfolio:** ~50/50 split — balanced risk and reward (~6–8% historical average)\n• **Aggressive portfolio:** ~80% stocks, 20% bonds — higher growth potential with more volatility (~8–10% historical average)\n\n**What I'd Suggest**\nGiven your risk-averse preference, start with the Conservative portfolio at $100–200/month after your credit card is paid off. Even $150/month at 5% average return grows to ~$23,000 over 10 years.\n\nAll investing involves risk, and past performance doesn't guarantee future results. Want to explore any of these options in more detail?",
      suggestions: ['Explain conservative portfolios', 'How much should I invest monthly?', 'I\'ll wait until my debt is paid off'],
    };
  }

  return null;
}
